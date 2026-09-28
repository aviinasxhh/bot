const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'stop',
    aliases: ['dc', 'disconnect', 'leave'],
    description: 'Stop playback and leave the voice channel',
    usage: ',stop',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('You must be in a voice channel.');
            return message.reply({ embeds: [embed] });
        }

        queue.delete(message.guild.id);
        shoukaku.leaveVoiceChannel(message.guild.id);

        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription('Stopped the music and left the voice channel.');
        message.reply({ embeds: [embed] });
    },
};
