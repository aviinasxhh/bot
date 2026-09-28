const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/format');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play a song from YouTube or SoundCloud',
    usage: ',play <query or URL>',

    async execute(message, args, { shoukaku, queue }) {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('You must be in a voice channel to play music.');
            return message.reply({ embeds: [embed] });
        }

        const query = args.join(' ');
        if (!query) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Please provide a song name or URL.');
            return message.reply({ embeds: [embed] });
        }

        const node = [...shoukaku.nodes.values()].find(n => n.state === 1) || null;
        if (!node) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('No audio nodes are available right now. Try again later.');
            return message.reply({ embeds: [embed] });
        }

        let searchQuery = query;
        if (!query.startsWith('http://') && !query.startsWith('https://')) {
            searchQuery = `ytsearch:${query}`;
        }

        let result = await node.rest.resolve(searchQuery);
        if ((!result || result.loadType === 'empty' || result.loadType === 'error')
            && !query.startsWith('http://') && !query.startsWith('https://')) {
            result = await node.rest.resolve(`scsearch:${query}`);
        }
        if (!result || result.loadType === 'empty' || result.loadType === 'error') {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('No results found for your query.');
            return message.reply({ embeds: [embed] });
        }

        let tracks = [];
        let isPlaylist = false;

        switch (result.loadType) {
            case 'track':
                tracks = [result.data];
                break;
            case 'search':
                tracks = [result.data[0]];
                break;
            case 'playlist':
                tracks = result.data.tracks;
                isPlaylist = true;
                break;
            default: {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Unexpected result. Please try again.');
                return message.reply({ embeds: [embed] });
            }
        }

        if (tracks.length === 0) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('No results found.');
            return message.reply({ embeds: [embed] });
        }

        let player = shoukaku.players.get(message.guild.id);

        if (!player) {
            player = await shoukaku.joinVoiceChannel({
                guildId: message.guild.id,
                channelId: voiceChannel.id,
                shardId: 0,
                deaf: true,
            });

            player.on('end', () => {
                const nextTrack = queue.next(message.guild.id);

                if (nextTrack) {
                    player.playTrack({ track: { encoded: nextTrack.encoded } });
                    const embed = new EmbedBuilder()
                        .setColor(0x5865F2)
                        .setTitle('Now Playing')
                        .setDescription(`**[${nextTrack.info.title}](${nextTrack.info.uri})**`)
                        .addFields(
                            { name: 'Duration', value: formatDuration(nextTrack.info.length), inline: true },
                            { name: 'Author', value: nextTrack.info.author || 'Unknown', inline: true }
                        )
                        .setThumbnail(nextTrack.info.artworkUrl || null)
                        .setTimestamp();
                    message.channel.send({ embeds: [embed] }).catch(() => {});
                } else {
                    shoukaku.leaveVoiceChannel(message.guild.id);
                    queue.delete(message.guild.id);
                    const embed = new EmbedBuilder().setColor(0x5865F2).setDescription('Queue ended. Leaving the voice channel.');
                    message.channel.send({ embeds: [embed] }).catch(() => {});
                }
            });

            player.on('closed', () => {
                shoukaku.leaveVoiceChannel(message.guild.id);
                queue.delete(message.guild.id);
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Voice connection was closed.');
                message.channel.send({ embeds: [embed] }).catch(() => {});
            });

            player.on('exception', (error) => {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription(`Track failed to play: ${error.message || 'Unknown error'}. Skipping...`);
                message.channel.send({ embeds: [embed] }).catch(() => {});
                const nextTrack = queue.next(message.guild.id);
                if (nextTrack) {
                    player.playTrack({ track: { encoded: nextTrack.encoded } });
                } else {
                    shoukaku.leaveVoiceChannel(message.guild.id);
                    queue.delete(message.guild.id);
                }
            });

            player.on('stuck', () => {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Track got stuck, skipping...');
                message.channel.send({ embeds: [embed] }).catch(() => {});
                const nextTrack = queue.next(message.guild.id);
                if (nextTrack) {
                    player.playTrack({ track: { encoded: nextTrack.encoded } });
                } else {
                    shoukaku.leaveVoiceChannel(message.guild.id);
                    queue.delete(message.guild.id);
                }
            });
        }

        for (const track of tracks) {
            queue.add(message.guild.id, track);
        }

        const guildQueue = queue.get(message.guild.id);

        if (!guildQueue.current) {
            const firstTrack = queue.next(message.guild.id);
            player.playTrack({ track: { encoded: firstTrack.encoded } });

            const embed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('Now Playing')
                .setDescription(`**[${firstTrack.info.title}](${firstTrack.info.uri})**`)
                .addFields(
                    { name: 'Duration', value: formatDuration(firstTrack.info.length), inline: true },
                    { name: 'Author', value: firstTrack.info.author || 'Unknown', inline: true }
                )
                .setThumbnail(firstTrack.info.artworkUrl || null)
                .setTimestamp();

            if (isPlaylist) {
                embed.addFields({ name: 'Playlist', value: `Enqueued **${tracks.length}** tracks from **${result.data.info.name}**` });
            }

            return message.channel.send({ embeds: [embed] });
        } else {
            if (isPlaylist) {
                const embed = new EmbedBuilder()
                    .setColor(0xFEE75C)
                    .setTitle('Playlist Added to Queue')
                    .setDescription(`Enqueued **${tracks.length}** tracks from **${result.data.info.name}**`)
                    .addFields({ name: 'Position in Queue', value: `${queue.size(message.guild.id) - tracks.length + 1} - ${queue.size(message.guild.id)}` })
                    .setTimestamp();
                return message.channel.send({ embeds: [embed] });
            } else {
                const track = tracks[0];
                const embed = new EmbedBuilder()
                    .setColor(0xFEE75C)
                    .setTitle('Added to Queue')
                    .setDescription(`**[${track.info.title}](${track.info.uri})**`)
                    .addFields(
                        { name: 'Duration', value: formatDuration(track.info.length), inline: true },
                        { name: 'Position', value: `#${queue.size(message.guild.id)}`, inline: true }
                    )
                    .setThumbnail(track.info.artworkUrl || null)
                    .setTimestamp();
                return message.channel.send({ embeds: [embed] });
            }
        }
    },
};
