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

        let result = "";

        if (hours > 0) {
            result += `${hours}h `;
        }
        if (minutes > 0 || hours > 0) {
            result += `${minutes}m `;
        }

        return result.trim();
    }
}