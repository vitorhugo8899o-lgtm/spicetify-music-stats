window.MusicStats.Utils = {
    getLocalDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    },
    formatTimeListened(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
            return `${pad(minutes)}:${pad(seconds)}`;
        }
    },
    getDailyMusicBoundaries(firts, last) {
        if (!firts || !last) {
            return { firts: "None", last: "None" };
        }

        const formattingOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }

        const firtsHour = new Date(firts).toLocaleTimeString('pt-BR', formattingOptions);
        const lastHour = new Date(last).toLocaleTimeString('pt-BR', formattingOptions);

        return {
            firts: firtsHour,
            last: lastHour
        };
    }
}