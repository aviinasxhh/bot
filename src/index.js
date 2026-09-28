const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./utils/env');
const Queue = require('./structures/Queue');

loadEnv();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PREFIX = process.env.PREFIX || ',';

if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not set. Copy .env.example to .env and fill in your token.');
    process.exit(1);
}

const Nodes = [
    {
        name: 'Lavalink',
        url: `${process.env.LAVALINK_HOST || 'localhost'}:${process.env.LAVALINK_PORT || '2333'}`,
        auth: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        secure: process.env.LAVALINK_SECURE === 'true',
    },
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes, {
    resume: true,
    resumeTimeout: 30,
    reconnectTries: 5,
    reconnectInterval: 5,
});

shoukaku.on('ready', (name) => console.log(`Node "${name}" connected.`));
shoukaku.on('error', (name, error) => console.error(`Node "${name}" error:`, error.message));
shoukaku.on('close', (name, code, reason) => console.warn(`Node "${name}" closed (${code}): ${reason}`));
shoukaku.on('disconnect', (name, count) => console.warn(`Node "${name}" disconnected.`));
shoukaku.on('reconnecting', (name, left, interval) => {
    console.log(`Node "${name}" reconnecting... (${left} tries left, interval ${interval}s)`);
});

const queue = new Queue();

const commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
}

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (!message.guild) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName) || [...commands.values()].find(c => c.aliases?.includes(commandName));
    if (!command) return;

    try {
        await command.execute(message, args, { shoukaku, queue, commands });
    } catch (error) {
        console.error(`Error executing command "${commandName}":`, error);
        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setDescription('An error occurred while executing that command.');
        message.reply({ embeds: [embed] }).catch(() => {});
    }
});

client.on('clientReady', () => {
    console.log(`${client.user.tag} is online!`);
    console.log(`Prefix: "${PREFIX}"`);
    console.log(`Audio node: Lavalink`);
});

client.login(BOT_TOKEN);
