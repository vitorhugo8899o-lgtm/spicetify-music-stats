window.MusicStats.Utils = {
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    },
    getLocalDate() {
        return this.formatDate(new Date());
    },
    formatTimeListened(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
            return `${pad(minutes)}:${pad(seconds)}`;
        }
    },
    getDailyMusicBoundaries(firts, last) {
        if (!firts || !last) {
            return { firts: "None", last: "None" };
        }

        const formattingOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }

        const firtsHour = new Date(firts).toLocaleTimeString('pt-BR', formattingOptions);
        const lastHour = new Date(last).toLocaleTimeString('pt-BR', formattingOptions);

        return {
            firts: firtsHour,
            last: lastHour
        };
    },
    buildTrackerData(tracker_data) {
        const track = tracker_data?.trackUnion;
        if (!track) return null;

        const firstArtistName = track.firstArtist?.items?.[0]?.profile?.name
            || track.firstArtist?.items?.[0]?.name
            || "Unknown artist";

        const otherArtists = track.otherArtists?.items?.map(a => a.profile?.name || a.name) || [];

        const allArtists = [firstArtistName, ...otherArtists].join(", ");

        const sources = track.albumOfTrack?.coverArt?.sources || [];
        const bestCover = sources.find(s => s.height === 640)?.url || sources[0]?.url || "";

        const dominantColor = track.albumOfTrack?.coverArt?.extractedColors?.colorRaw?.hex || "#121212";

        return {
            title: track.name,
            artist: allArtists,
            album: track.albumOfTrack?.name,
            duration: window.MusicStats.Utils.formatTimeListened(track.duration?.totalMilliseconds || 0),
            explicit: track.contentRating?.label === "EXPLICIT",
            liked: track.saved,
            cover: bestCover,
            uri: track.uri,
            dominantColor
        };
    }
}