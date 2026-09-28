class Queue {
    constructor() {
        this.queues = new Map();
    }

    get(guildId) {
        if (!this.queues.has(guildId)) {
            this.queues.set(guildId, {
                tracks: [],
                current: null,
                loop: 'off',
                volume: 100,
            });
        }
        return this.queues.get(guildId);
    }

    add(guildId, track) {
        const q = this.get(guildId);
        q.tracks.push(track);
    }

    next(guildId) {
        const q = this.get(guildId);

        if (q.loop === 'track' && q.current) {
            return q.current;
        }

        if (q.loop === 'queue' && q.current) {
            q.tracks.push(q.current);
        }

        const next = q.tracks.shift() || null;
        q.current = next;
        return next;
    }

    clear(guildId) {
        const q = this.get(guildId);
        q.tracks = [];
        q.current = null;
    }

    delete(guildId) {
        this.queues.delete(guildId);
    }

    size(guildId) {
        return this.get(guildId).tracks.length;
    }
}

module.exports = Queue;
