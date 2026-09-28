const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../utils/format');

module.exports = {
    name: 'seek',
    aliases: [],
    description: 'Seek to a position in the current track',
    usage: ',seek <seconds> OR ,seek <MM:SS>',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const current = guildQueue.current;

        if (!current || !current.info.isSeekable) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('This track is not seekable.');
            return message.reply({ embeds: [embed] });
        }

        if (!args[0]) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Please provide a position, e.g. `,seek 90` or `,seek 1:30`');
            return message.reply({ embeds: [embed] });
        }

        let positionMs;
        const input = args[0];

        if (input.includes(':')) {
            const parts = input.split(':').map(Number);
            if (parts.some(isNaN)) {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Invalid time format. Use `MM:SS` or `HH:MM:SS`.');
                return message.reply({ embeds: [embed] });
            }
            if (parts.length === 2) {
                positionMs = (parts[0] * 60 + parts[1]) * 1000;
            } else if (parts.length === 3) {
                positionMs = (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
            } else {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Invalid time format.');
                return message.reply({ embeds: [embed] });
            }
        } else {
            const seconds = parseInt(input);
            if (isNaN(seconds)) {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Invalid number of seconds.');
                return message.reply({ embeds: [embed] });
            }
            positionMs = seconds * 1000;
        }

        if (positionMs < 0 || positionMs > current.info.length) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription(`Position must be between **0** and **${formatDuration(current.info.length)}**.`);
            return message.reply({ embeds: [embed] });
        }

        player.seekTo(positionMs);
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Seeked to **${formatDuration(positionMs)}**.`);
        message.reply({ embeds: [embed] });
    },
};
