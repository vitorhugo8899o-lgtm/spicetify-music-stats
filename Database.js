window.MusicStats = window.MusicStats || {};

window.MusicStats.Database = {
    loaded: false,
    db: null,
    data: {}
};


async function initDatabase() {
    if (window.MusicStats.Database.loaded) {
        return;
    }

    const db = await openDatabase();

    window.MusicStats.Database.db = db;

    window.MusicStats.Database.data =
        await loadData();

    window.MusicStats.Database.loaded = true;
}


async function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MusicStats", 1);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains("storage")) {
                db.createObjectStore("storage");
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function loadData() {
    const tx =
        window.MusicStats.Database.db.transaction(
            "storage",
            "readonly"
        );

    const store = tx.objectStore("storage");

    return new Promise((resolve, reject) => {
        const request = store.get("history");

        request.onsuccess = () => {
            resolve(request.result ?? {});
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function saveData(data) {
    const tx =
        window.MusicStats.Database.db.transaction(
            "storage",
            "readwrite"
        );

    const store = tx.objectStore("storage");

    return new Promise((resolve, reject) => {
        const request = store.put(
            data,
            "history"
        );

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}