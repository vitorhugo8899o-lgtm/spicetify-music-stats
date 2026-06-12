window.MusicStats = window.MusicStats || {};

window.MusicStats.Database = {
    loaded: false,
    data: {}
};


async function initDatabase() {
    await waitForSpicetify();

    if (window.MusicStats.Database.loaded) {
        return;
    }

    window.MusicStats.Database.data = Spicetify.Platform.LocalStorageAPI.getItem(STORAGE_KEY) ?? {};

    window.MusicStats.Database.loaded = true;
}