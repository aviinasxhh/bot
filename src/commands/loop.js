const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'loop',
    aliases: ['repeat'],
    description: 'Toggle loop mode: off, track, queue',
    usage: ',loop [off|track|queue]',

    async execute(message, args, { shoukaku, queue }) {
        const player = shoukaku.players.get(message.guild.id);
        if (!player) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Nothing is playing right now.');
            return message.reply({ embeds: [embed] });
        }

        const guildQueue = queue.get(message.guild.id);
        const mode = args[0]?.toLowerCase();

        if (mode && ['off', 'track', 'queue'].includes(mode)) {
            guildQueue.loop = mode;
        } else {
            const cycle = { off: 'track', track: 'queue', queue: 'off' };
            guildQueue.loop = cycle[guildQueue.loop] || 'off';
        }

        const labels = { off: 'Disabled', track: 'Track', queue: 'Queue' };
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Loop mode: **${labels[guildQueue.loop]}**`);
        message.reply({ embeds: [embed] });
    },
};
