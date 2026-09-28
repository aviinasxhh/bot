const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    aliases: [],
    description: 'Shuffle the current queue',
    usage: ',shuffle',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const tracks = guildQueue.tracks;

        if (tracks.length < 2) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Not enough tracks in queue to shuffle.');
            return message.reply({ embeds: [embed] });
        }

        for (let i = tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
        }

        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Shuffled **${tracks.length}** tracks in the queue.`);
        message.reply({ embeds: [embed] });
    },
};
