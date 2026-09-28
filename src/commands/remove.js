const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'remove',
    aliases: ['rm'],
    description: 'Remove a track from the queue by position',
    usage: ',remove <position>',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);

        if (!args[0]) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Please provide a track position, e.g. `,remove 3`');
            return message.reply({ embeds: [embed] });
        }

        const position = parseInt(args[0]);
        if (isNaN(position) || position < 1 || position > guildQueue.tracks.length) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription(`Invalid position. Queue has **${guildQueue.tracks.length}** track(s).`);
            return message.reply({ embeds: [embed] });
        }

        const removed = guildQueue.tracks.splice(position - 1, 1)[0];
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Removed **${removed.info.title}** from position **#${position}**.`);
        message.reply({ embeds: [embed] });
    },
};
