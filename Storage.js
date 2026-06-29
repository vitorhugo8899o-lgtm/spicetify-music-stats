const STORAGE_KEY = "music-stats:data";


window.MusicStats.Storage = {
    async saveEvent(event) {
        if (!event) {
            return "Erro: No event received!";
        }

        try {
            await initDatabase();

            const todayDate = window.MusicStats.Utils.getLocalDate();

            const data = window.MusicStats.Database.data;

            if (!data[todayDate]) {
                data[todayDate] = [];
            }

            data[todayDate].push(event);

            await saveData(data);

            return "Event saved!";
        } catch (error) {
            return `Erro: ${error}`;
        }
    },

    async getEvents() {
        try {
            await initDatabase();

            return window.MusicStats.Database.data;
        } catch (error) {
            console.error(error);
            return {};
        }
    },

    async getEventsToday() {
        const tracks = await this.getEvents()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        return tracks[todayDate]
    },

    async getEventsWeek() {
        const events = await this.getEvents();

        const tracks = [];
        const currentDate = new Date();

        for (let i = 0; i < 7; i++) {
            const key = window.MusicStats.Utils.formatDate(currentDate);

            if (events[key]) {
                tracks.push(...events[key]);
            }

            currentDate.setDate(currentDate.getDate() - 1);
        }

        return tracks;
    },

    async getEventsMonth() {
        const events = await this.getEvents();

        const tracks = [];
        const currentDate = new Date();

        for (let i = 0; i < 30; i++) {
            const key = window.MusicStats.Utils.formatDate(currentDate);

            if (events[key]) {
                tracks.push(...events[key]);
            }

            currentDate.setDate(currentDate.getDate() - 1);
        }

        return tracks;
    }
};