const STORAGE_KEY = "music-stats:data";

async function waitForSpicetify() {
    while (!Spicetify?.Platform?.LocalStorageAPI) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

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

            Spicetify.Platform.LocalStorageAPI.setItem(
                STORAGE_KEY,
                data
            );

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