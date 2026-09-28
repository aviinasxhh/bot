const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clear',
    aliases: [],
    description: 'Clear the entire queue (keeps the current track)',
    usage: ',clear',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const count = guildQueue.tracks.length;
        guildQueue.tracks = [];
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Cleared **${count}** track(s) from the queue.`);
        message.reply({ embeds: [embed] });
    },
};
