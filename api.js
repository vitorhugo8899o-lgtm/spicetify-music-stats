const cacheArtist = new Map();
const cacheAlbum = new Map();

window.MusicStats.Api = {
    async queryGraphQL(uri, operation) {
        const res = await Spicetify.GraphQL.Request(
            operation,
            { uri: uri, locale: "pt", limit: 1, offset: 0 },
            { persistCache: true }
        );

        console.log(res)

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
    }
}