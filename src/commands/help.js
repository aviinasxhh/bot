const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all available commands',
    usage: ',help [command]',

    async execute(message, args, { commands }) {
        if (args[0]) {
            const cmdName = args[0].toLowerCase();
            const cmd = commands.get(cmdName) || [...commands.values()].find(c => c.aliases?.includes(cmdName));
            if (!cmd) {
                const embed = new EmbedBuilder().setColor(0xED4245).setDescription(`Unknown command: \`${cmdName}\``);
                return message.reply({ embeds: [embed] });
            }
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`Command: \`${cmd.name}\``)
                .setDescription(cmd.description || 'No description.')
                .addFields(
                    { name: 'Usage', value: `\`${cmd.usage || `,${cmd.name}`}\``, inline: true },
                    { name: 'Aliases', value: cmd.aliases?.length ? cmd.aliases.map(a => `\`${a}\``).join(', ') : 'None', inline: true }
                );
            return message.channel.send({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('Atrieus Music Bot — Commands')
            .setDescription('Prefix: `,`\n\n' +
                [...commands.values()]
                    .map(cmd => `\`${cmd.name}\` — ${cmd.description}`)
                    .join('\n')
            )
            .setFooter({ text: 'Use ,help <command> for details on a specific command.' })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
