const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/format');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'Show the current queue',
    usage: ',queue [page]',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const tracks = guildQueue.tracks;
        const current = guildQueue.current;

        if (!current) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('The queue is empty.');
            return message.reply({ embeds: [embed] });
        }

        const tracksPerPage = 10;
        const page = Math.max(1, parseInt(args[0]) || 1);
        const totalPages = Math.max(1, Math.ceil(tracks.length / tracksPerPage));
        const start = (page - 1) * tracksPerPage;
        const end = start + tracksPerPage;

        const queueList = tracks
            .slice(start, end)
            .map((track, i) => `\`${start + i + 1}.\` **[${track.info.title}](${track.info.uri})** — ${formatDuration(track.info.length)}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`Queue for ${message.guild.name}`)
            .setDescription(
                `**Now Playing:**\n**[${current.info.title}](${current.info.uri})** — ${formatDuration(current.info.length)}\n\n` +
                `**Up Next:**\n${queueList || 'No more tracks in queue.'}`
            )
            .setFooter({ text: `Page ${page}/${totalPages} | ${tracks.length} track(s) in queue | Loop: ${guildQueue.loop}` })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
