const { accessToken, tokenType } = Spicetify.Platform.Session;
const platform = navigator.platform;
const cacheArtist = new Map();
const cacheAlbum = new Map();

window.MusicStats.Api = {
    async fetchInfo(uri, operation, hash) {

        const params = new URLSearchParams({
            operationName: `${operation}`,
            variables: JSON.stringify({ uri: uri, locale: "pt-BR", includePrerelease: true }),
            extensions: JSON.stringify({
                persistedQuery: {
                    version: 1,
                    sha256Hash: hash
                }
            })
        });

        const res = await fetch(
            `https://api-partner.spotify.com/pathfinder/v1/query?${params}`,
            {
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                    "app-platform": `${platform}`
                }
            }
        );

        const json = await res.json();

        console.log(json);

        return json.data;
    },
    async fetchArtistInfo(uri) {
        if (cacheArtist[uri]) {
            return cacheArtist[uri];
        }

        const info = await this.fetchInfo(
            uri,
            "queryArtistOverview",
            "ae0e2958a4ab645b35ca19ac04d0495ae12d9c5d7b7286217674801a9aab281a"
        );

        if (!info) {
            return null;
        }

        cacheArtist[uri] = info;

        return cacheArtist[uri];
    }
}