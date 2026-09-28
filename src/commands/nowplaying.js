const { EmbedBuilder } = require('discord.js');
const { formatDuration, progressBar } = require('../utils/format');

module.exports = {
    name: 'nowplaying',
    aliases: ['np', 'current'],
    description: 'Show the currently playing track',
    usage: ',nowplaying',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const track = guildQueue.current;

        if (!track) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('No track information available.');
            return message.reply({ embeds: [embed] });
        }

        const position = player.position || 0;
        const duration = track.info.length || 0;
        const loopText = guildQueue.loop === 'off' ? 'Disabled' : guildQueue.loop === 'track' ? 'Track' : 'Queue';

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('Now Playing')
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .addFields(
                { name: 'Author', value: track.info.author || 'Unknown', inline: true },
                { name: 'Duration', value: `${formatDuration(position)} / ${formatDuration(duration)}`, inline: true },
                { name: 'Loop', value: loopText, inline: true },
                { name: 'Progress', value: progressBar(position, duration) }
            )
            .setThumbnail(track.info.artworkUrl || null)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
