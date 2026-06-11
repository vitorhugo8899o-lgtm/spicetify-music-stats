window.MusicStats = window.MusicStats || {};

const STORAGE_KEY = "music-stats:data";

async function waitForSpicetify() {
    // Aguarda o Platform estar disponível
    while (!Spicetify?.Platform?.LocalStorageAPI) {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

window.MusicStats.Storage = {
    async saveEvent(event) {
        if (!event) return "Erro: No event received!";

        try {
            await waitForSpicetify();

            const todayDate = getLocalDate();
            const data = Spicetify.Platform.LocalStorageAPI.getItem(STORAGE_KEY) ?? {};

            if (!data[todayDate]) data[todayDate] = [];

            data[todayDate].push(event);

            Spicetify.Platform.LocalStorageAPI.setItem(STORAGE_KEY, data);

            return "Event saved!";
        } catch (error) {
            return `Erro: ${error}`;
        }
    },

    async getEventToday() {
        try {
            await waitForSpicetify();

            return Spicetify.Platform.LocalStorageAPI.getItem(STORAGE_KEY) ?? {};
        } catch (error) {
            console.error(error);
            return {};
        }
    }
};