window.MusicStats = window.MusicStats || {};

const STORAGE_KEY = "music-stats:data";

const todayDate = new Date().toISOString().split("T")[0];

window.MusicStats.Storage = {
    saveEvent(event) {
        if (!event) {
            return "Erro: No event received!";
        }

        try {
            const raw = Spicetify.LocalStorage.get(STORAGE_KEY);

            const data = raw ? JSON.parse(raw) : {};

            if (!data[todayDate]) {
                data[todayDate] = [];
            }

            data[todayDate].push(event);

            Spicetify.LocalStorage.set(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return "Event save!";
        } catch (error) {
            return `Erro: ${error}`;
        }
    },
    getEventToday() {
        try {
            const listToday = Spicetify.LocalStorage.get(STORAGE_KEY);

            if (!listToday) {
                return {};
            }

            return JSON.parse(listToday);
        } catch (error) {
            console.error(error);
            return {};
        }
    }
}
