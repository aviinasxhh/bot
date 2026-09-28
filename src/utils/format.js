function formatDuration(ms) {
    if (!ms || ms <= 0) return 'LIVE';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const pad = (n) => n.toString().padStart(2, '0');
    return hours > 0
        ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`;
}

function progressBar(current, total, length = 15) {
    if (!total || total <= 0) return '—'.repeat(length);
    const progress = Math.round((current / total) * length);
    return '▬'.repeat(progress) + '●' + '▬'.repeat(length - progress);
}

module.exports = { formatDuration, progressBar };
