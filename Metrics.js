window.MusicStats.Metrics = {
    async getMetricsPlayedToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        let result = ""
        const counts = {};

        for (let i = 0; i <= tracks[todayDate].length - 1; i++) {
            const uri = tracks[todayDate][i].trackUri;
            if (!counts[uri]) {
                counts[uri] = { count: 0, trackName: tracks[todayDate][i].trackName, artists: tracks[todayDate][i].artists };
            }
            counts[uri].count++;
        }

        result = Object.values(counts).sort((a, b) => b.count - a.count)

        console.log(tracks[todayDate].length)
        console.log(result.length)
        console.log(result)
        return {
            total_song_listen: tracks[todayDate].length,
            top_songs: result,
            unique_songs: result.length
        }
    },
    async getMetricArtists() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        let result = ""
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

        result = Object.values(counts).sort((a, b) => b.count - a.count)

        console.log(result.length)
        console.log(result)
        return {
            top_artists: result,
            unique_artists: result.length
        }
    },
    async getListenTimeToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        let totalMS = 0

        for (const time of tracks[todayDate]) {
            totalMS += time.durationMs
        }

        const totalTime = window.MusicStats.Utils.formatTimeListened(totalMS);

        console.log(totalTime)
        return totalTime;
    },
    async getAlbumMetricsToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        result = ""
        const counts = {}

        for (let i = 0; i < tracks[todayDate].length; i++) {
            const uri = tracks[todayDate][i].albumUri;

            if (!counts[uri]) {
                counts[uri] = { count: 0, albumName: tracks[todayDate][i].albumName, albumUri: tracks[todayDate][i].albumUri };
            }
            counts[uri].count++;
        }

        result = Object.values(counts).sort((a, b) => b.count - a.count)
        console.log(result)

        return {
            top_albums: result,
            unique_albums: result.length
        }
    },
    async getDailyTrackEnds() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        const firstSongToday = tracks[todayDate][0]["playedAt"]
        const lastSongToday = tracks[todayDate].at(-1)["playedAt"]

        const formatHours = window.MusicStats.Utils.getDailyMusicBoundaries(firstSongToday, lastSongToday)

        if (formatHours.firts === "None" || formatHours.last === "None") {
            return "No music data";
        }

        console.log(formatHours)
        return formatHours;
    }
}
