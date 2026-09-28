const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    aliases: ['vol'],
    description: 'Set the player volume (0-200)',
    usage: ',volume <0-200>',

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

        const guildQueue = queue.get(message.guild.id);

        if (!args[0]) {
            const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Current volume: **${guildQueue.volume}%**`);
            return message.reply({ embeds: [embed] });
        }

        const vol = parseInt(args[0]);
        if (isNaN(vol) || vol < 0 || vol > 200) {
            const embed = new EmbedBuilder().setColor(0xED4245).setDescription('Please provide a number between **0** and **200**.');
            return message.reply({ embeds: [embed] });
        }

        player.setGlobalVolume(vol);
        guildQueue.volume = vol;
        const embed = new EmbedBuilder().setColor(0x5865F2).setDescription(`Volume set to **${vol}%**`);
        message.reply({ embeds: [embed] });
    },
};
