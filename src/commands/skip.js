const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    aliases: ['s', 'next'],
    description: 'Skip the current track',
    usage: ',skip',

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

        const guildQueue = queue.get(message.guild.id);
        const skippedTrack = guildQueue.current;

        if (guildQueue.loop === 'track') {
            guildQueue.loop = 'off';
        }

        player.stopTrack();

        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Skipped **${skippedTrack?.info?.title || 'current track'}**.`);
        message.reply({ embeds: [embed] });
    },
};
