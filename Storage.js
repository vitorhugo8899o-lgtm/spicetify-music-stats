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

    async getEventToday() {
        try {
            await initDatabase();

            return window.MusicStats.Database.data;
        } catch (error) {
            console.error(error);
            return {};
        }
    }
};