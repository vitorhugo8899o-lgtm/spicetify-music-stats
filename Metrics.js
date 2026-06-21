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

        const musicRepeat = result
            .filter(music => music.count > 1)
            .map(music => {
                return {
                    repeat_count: Number(music.count - 1)
                }
            })

        const repeatCount = musicRepeat.reduce(
            (total, item) => total + item.repeat_count,
            0
        );

        return {
            total_song_listen: tracks[todayDate].length,
            top_songs: result,
            unique_songs: result.length,
            repeated_songs: repeatCount,
            repeated_playback_rate: Number((
                (repeatCount / Number(tracks[todayDate].length)) * 100)
                .toFixed(2)
            )
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

        return totalTime;
    },
    async getAlbumMetricsToday() {
        const tracks = await window.MusicStats.Storage.getEventToday()
        const todayDate = window.MusicStats.Utils.getLocalDate();

        if (!tracks || !tracks[todayDate]) {
            return "No events received.";
        }

        let result = ""
        const counts = {}

        for (let i = 0; i < tracks[todayDate].length; i++) {
            const uri = tracks[todayDate][i].albumUri;

            if (!counts[uri]) {
                counts[uri] = { count: 0, albumName: tracks[todayDate][i].albumName, albumUri: tracks[todayDate][i].albumUri };
            }
            counts[uri].count++;
        }

        result = Object.values(counts).sort((a, b) => b.count - a.count)

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

        return formatHours;
    }
}


async function buildMetricsToday() {
    let build = {
        music_metrics: await window.MusicStats.Metrics.getMetricsPlayedToday(),
        artist_metrics: await window.MusicStats.Metrics.getMetricArtists(),
        album_metrics: await window.MusicStats.Metrics.getAlbumMetricsToday(),
        listen_time: await window.MusicStats.Metrics.getListenTimeToday(),
        daily: await window.MusicStats.Metrics.getDailyTrackEnds()
    }

    if (isNaN(build.music_metrics.total_song_listen)) {
        build = "No events today."
        return build;
    }

    return build;
}