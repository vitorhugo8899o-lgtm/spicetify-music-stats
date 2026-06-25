const cacheArtist = new Map();
const cacheAlbum = new Map();
const cacheTrack = new Map();

window.MusicStats.Api = {
    async queryGraphQL(uri, operation) {
        const res = await Spicetify.GraphQL.Request(
            operation,
            { uri: uri, locale: "pt", limit: 1, offset: 0 },
            { persistCache: true }
        );

        return res.data;
    },
    async fetchArtistInfo(uri) {
        if (cacheArtist[uri]) {
            return cacheArtist[uri];
        }

        const { queryArtistOverview } = Spicetify.GraphQL.Definitions;

        const info = await this.queryGraphQL(
            uri,
            queryArtistOverview,
        );

        if (!info) {
            return null;
        }

        cacheArtist[uri] = info;

        return cacheArtist[uri];
    },
    async fetchAlbumInfo(uri) {
        if (cacheAlbum[uri]) {
            return cacheAlbum[uri];
        }

        const { getAlbum } = Spicetify.GraphQL.Definitions;

        const info = await this.queryGraphQL(
            uri,
            getAlbum
        );

        if (!info) {
            return null;
        }

        cacheAlbum[uri] = info;

        return cacheAlbum[uri];
    },
    async fetchTrackInfo(uri) {
        if (cacheTrack[uri]) {
            return cacheTrack[uri];
        }

        const { getTrack } = Spicetify.GraphQL.Definitions;

        const info = await this.queryGraphQL(
            uri,
            getTrack
        );

        if (!info) {
            console.log(info)
            return null;
        }

        cacheTrack[uri] = info;

        console.log(info)
        return cacheTrack[uri];
    },
    async playTracker(uri) {
        if (!uri || uri.split(":")[0] != "spotify") {
            return;
        }

        try {
            await Spicetify.Player.playUri(uri)
            return;
        } catch (err) {
            console.log("Error playing music: ", err)
        }
    },
    async stopTracker() {
        try {
            await Spicetify.Player.pause()
            return;
        } catch (err) {
            console.log("Error pausing music: ", err)
        }
    },
    async favoriteSong() {
        const isFav = await Spicetify.Player.getHeart();

        if (isFav === true) {
            return true;
        }

        try {
            await Spicetify.Player.setHeart(true)
            return true;
        } catch (err) {
            console.log("Error adding song to favorites: ", err)
        }
    },
    async unfavoriteSong() {
        const isFav = await Spicetify.Player.getHeart();

        if (isFav === false) {
            return false;
        }

        try {
            await Spicetify.Player.setHeart(false)
            return false;
        } catch (err) {
            console.log("Error removing song from favorites: ", err)
        }
    }
}