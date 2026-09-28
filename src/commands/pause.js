const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pause',
    aliases: [],
    description: 'Pause the current track',
    usage: ',pause',

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

        if (player.paused) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('The player is already paused. Use `,resume` to unpause.');
            return message.reply({ embeds: [embed] });
        }

        player.setPaused(true);
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription('Paused the music.');
        message.reply({ embeds: [embed] });
    },
};
