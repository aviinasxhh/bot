# 🎵 Atrieus — Discord Music Bot

A high-performance Discord music bot built with **Node.js**, **discord.js**, and **Shoukaku**. Uses **Lavalink** (with your custom YouTube plugin) as the primary audio server, with **NodeLink** as a backup.

## Architecture

```
Discord Bot (discord.js + Shoukaku)
        │
        ├── Primary: Lavalink (Java) + yt-plugin.jar
        │
        └── Backup:  NodeLink (Node.js, built-in YT)
```

## Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **Java** 17+ — Required only for Lavalink ([Download](https://adoptium.net/))
- **Lavalink.jar** — [Download latest v4](https://github.com/lavalink-devs/Lavalink/releases)

## Quick Start

### 1. Install Dependencies
```bash
cd d:\Atrieus
npm install
```

### 2. Configure Environment
```bash
# Copy the example and fill in your bot token
copy .env.example .env
```
Edit `.env` and set your `BOT_TOKEN`.

### 3. Set Up Lavalink
1. Download `Lavalink.jar` and place it in `lavalink/`
2. The custom YouTube plugin (`yt-plugin.jar`) is already in `lavalink/plugins/`
3. Start Lavalink:
```bash
cd lavalink
java -jar Lavalink.jar
```

### 4. (Optional) Set Up NodeLink Backup
```bash
git clone https://github.com/PerformanC/NodeLink.git nodelink-server
cd nodelink-server
npm install
cp config.default.js config.js
# Edit config.js — change the port to 2334 to avoid conflicts with Lavalink
npm run start
```

### 5. Start the Bot
```bash
npm start
```

## Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `,play <query>` | `,p` | Play a song (YouTube search or URL) |
| `,skip` | `,s`, `,next` | Skip the current track |
| `,stop` | `,dc`, `,disconnect`, `,leave` | Stop & leave voice channel |
| `,pause` | — | Pause the current track |
| `,resume` | `,unpause` | Resume playback |
| `,nowplaying` | `,np`, `,current` | Show what's playing |
| `,queue` | `,q` | Show the queue (paginated) |
| `,loop` | `,repeat` | Cycle loop: off → track → queue |
| `,volume <0-200>` | `,vol` | Set player volume |
| `,shuffle` | — | Shuffle the queue |
| `,seek <time>` | — | Seek to position (seconds or MM:SS) |
| `,remove <#>` | `,rm` | Remove a track from queue |
| `,clear` | — | Clear the queue |
| `,help` | `,h`, `,commands` | Show all commands |

## Project Structure

```
Atrieus/
├── src/
│   ├── index.js              # Entry point
│   ├── commands/
│   │   ├── play.js            # Play/search/queue tracks
│   │   ├── skip.js            # Skip current track
│   │   ├── stop.js            # Stop & disconnect
│   │   ├── pause.js           # Pause playback
│   │   ├── resume.js          # Resume playback
│   │   ├── nowplaying.js      # Now-playing display
│   │   ├── queue.js           # Queue viewer
│   │   ├── loop.js            # Loop toggle
│   │   ├── volume.js          # Volume control
│   │   ├── shuffle.js         # Shuffle queue
│   │   ├── seek.js            # Seek in track
│   │   ├── remove.js          # Remove from queue
│   │   ├── clear.js           # Clear queue
│   │   └── help.js            # Help listing
│   ├── structures/
│   │   └── Queue.js           # Per-guild queue manager
│   └── utils/
│       ├── env.js             # .env file parser
│       └── format.js          # Duration/progress formatting
├── lavalink/
│   ├── application.yml        # Lavalink config
│   ├── plugins/
│   │   └── yt-plugin.jar      # Custom YouTube plugin
│   └── README.md
├── yt-plugin.jar              # Original plugin file
├── package.json
├── .env.example
└── .gitignore
```

## Node Failover

The bot is configured with **automatic failover**:
- If the **Lavalink** node goes down, Shoukaku automatically moves all players to the **NodeLink** backup
- When Lavalink comes back online, new players prefer it again
- Set via `moveOnDisconnect: true` and a custom `nodeResolver` in the Shoukaku options

## License

MIT
