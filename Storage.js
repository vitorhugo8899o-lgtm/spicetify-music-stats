window.MusicStats = window.MusicStats || {};

window.MusicStats.Storage = {
    saveEvent(event) {
        const STORAGE_KEY = "music-stats:data";

        if (!event) {
            return "Erro: No event received!";
        }

        const date = new Date().toISOString().split("T")[0];

        try {
            const raw = Spicetify.LocalStorage.get(STORAGE_KEY);

            const data = raw ? JSON.parse(raw) : {};

            if (!data[date]) {
                data[date] = [];
            }

            data[date].push(event);

            Spicetify.LocalStorage.set(
                STORAGE_KEY,
                JSON.stringify(data)
            );

            return "Event save!";
        } catch (error) {
            return `Erro: ${error}`;
        }
    }
}
