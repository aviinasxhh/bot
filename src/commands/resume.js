const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resume',
    aliases: ['unpause'],
    description: 'Resume the paused track',
    usage: ',resume',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        if (!message.member?.voice?.channel) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('You must be in a voice channel.');
            return message.reply({ embeds: [embed] });
        }

        if (!player.paused) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('The player is not paused.');
            return message.reply({ embeds: [embed] });
        }

        player.setPaused(false);
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription('Resumed the music.');
        message.reply({ embeds: [embed] });
    },
};
