// Captura o evento de mudança de musica
Spicetify.Player.addEventListener("songchange", (event) => {
    const track = Spicetify.Player.data?.item ?? false;
    console.log("Capturado o Evento de mudança:", track)
    buildPlaybackEvent(track)
});


// Construtor
function buildPlaybackEvent(object) {
    if (object === false) {
        console.log("Objeto não encontrado!")
        return;
    }

    const build = {
        "trackUri": object.uri,
        "trackName": object.name,

        "artists":
            object.artists.map(artist => ({
                name: artist.name,
                uri: artist.uri
            }))
        ,

        "albumUri": object.album.uri,
        "albumName": object.album.name,

        "contextUri": object.metadata.context_uri,

        "durationMs": object.duration.milliseconds,
        "playedAt": Date.now()
    }

    console.log(build)
    console.log(build.artists[0])
}
