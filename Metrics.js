window.MusicStats.Metrics = {
    async getMetricsPlayed(tracks) {
        if (!tracks || tracks.length === 0) {
            return "No events received.";
        }

        const counts = {};

        for (const track of tracks) {
            const uri = track.trackUri;

            if (!counts[uri]) {
                counts[uri] = {
                    count: 0,
                    trackUri: uri,
                    trackName: track.trackName,
                    artists: track.artists
                };
            }

            counts[uri].count++;
        }

        const result = Object.values(counts).sort((a, b) => b.count - a.count);

        const repeatCount = result.reduce((total, music) => {
            return total + Math.max(0, music.count - 1);
        }, 0);

        return {
            total_song_listen: tracks.length,
            top_songs: result,
            unique_songs: result.length,
            repeated_songs: repeatCount,
            repeated_playback_rate: Number(
                ((repeatCount / tracks.length) * 100).toFixed(2)
            )
        };
    },
    async getMetricArtists(tracks) {
        if (!tracks || tracks.length === 0) {
            return "No events received.";
        }

        const counts = {};

        for (const track of tracks) {
            for (const artist of track.artists) {
                if (!counts[artist.uri]) {
                    counts[artist.uri] = {
                        count: 0,
                        name: artist.name,
                        uri: artist.uri
                    };
                }

                counts[artist.uri].count++;
            }
        }

        const result = Object.values(counts).sort((a, b) => b.count - a.count);

        return {
            top_artists: result,
            unique_artists: result.length
        };
    },
    async getListenTime(tracks) {
        if (!tracks || tracks.length === 0) {
            return "No events received.";
        }

        let totalMS = 0;

        for (const track of tracks) {
            totalMS += track.durationMs;
        }

        return window.MusicStats.Utils.formatTimeListened(totalMS);
    },
    async getAlbumMetrics(tracks) {
        if (!tracks || tracks.length === 0) {
            return "No events received.";
        }

        const counts = {};

        for (const track of tracks) {
            const uri = track.albumUri;

            if (!counts[uri]) {
                counts[uri] = {
                    count: 0,
                    albumName: track.albumName,
                    albumUri: uri
                };
            }

            counts[uri].count++;
        }

        const result = Object.values(counts).sort((a, b) => b.count - a.count);

        return {
            top_albums: result,
            unique_albums: result.length
        };
    },
    async getDailyTrackEnds(tracks) {
        if (!tracks || tracks.length === 0) {
            return "No events received.";
        }

        const firstSong = tracks[0].playedAt;
        const lastSong = tracks.at(-1).playedAt;

        const formatHours = window.MusicStats.Utils.getDailyMusicBoundaries(
            firstSong,
            lastSong
        );

        if (formatHours.first === "None" || formatHours.last === "None") {
            return "No music data";
        }

        return formatHours;
    }
}


async function buildMetrics(period = "today") {
    let tracks;

    switch (period) {
        case "today":
            tracks = await window.MusicStats.Storage.getEventsToday();
            break;

        case "week":
            tracks = await window.MusicStats.Storage.getEventsWeek();
            break;

        case "month":
            tracks = await window.MusicStats.Storage.getEventsMonth();
            break;

        case "all":
            tracks = await window.MusicStats.Storage.getEvents();
            break;
    }

    return {
        music_metrics: await window.MusicStats.Metrics.getMetricsPlayed(tracks),
        artist_metrics: await window.MusicStats.Metrics.getMetricArtists(tracks),
        album_metrics: await window.MusicStats.Metrics.getAlbumMetrics(tracks),
        listen_time: await window.MusicStats.Metrics.getListenTime(tracks),
        daily: await window.MusicStats.Metrics.getDailyTrackEnds(tracks)
    };
}