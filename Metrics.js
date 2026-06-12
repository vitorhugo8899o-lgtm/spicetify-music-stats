window.MusicStats.Metrics = {
    async musicTodayCont() {
        const musicList = await window.MusicStats.Storage.getEventToday();

        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!musicList || !musicList[todayDate]) {
            console.log("No music found today.");
            return [];
        }

        console.log(musicList[todayDate].length);
        return musicList[todayDate];
    },
    async getMostPlayedToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        const counts = {};

        for (let i = 0; i <= tracks[todayDate].length - 1; i++) {
            const uri = tracks[todayDate][i].trackUri;
            if (!counts[uri]) {
                counts[uri] = { count: 0, trackName: tracks[todayDate][i].trackName, artists: tracks[todayDate][i].artists };
            }
            counts[uri].count++;
        }
        console.log(Object.values(counts).sort((a, b) => b.count - a.count))
        return Object.values(counts).sort((a, b) => b.count - a.count);
    },
    async getTopArtistsToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        const counts = {}

        for (let i = 0; i < tracks[todayDate].length; i++) {
            const artists = tracks[todayDate][i].artists;

            for (let j = 0; j < artists.length; j++) {
                const artist = artists[j];

                if (!counts[artist.uri]) {
                    counts[artist.uri] = { count: 0, name: artist.name, uri: artist.uri };
                }
                counts[artist.uri].count++;
            }
        }

        console.log(Object.values(counts).sort((a, b) => b.count - a.count))
        return Object.values(counts).sort((a, b) => b.count - a.count);
    }
}
