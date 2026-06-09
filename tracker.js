// Contexto Global Para ser acessado pelo 'onprogress'
let currentSession = {
    registered: false,
    eventData: null
};


// Captura o evento de mudança de musica
Spicetify.Player.addEventListener("songchange", (event) => {
    const track = event.data?.item ?? false;

    if (track === false) {
        console.log("Item not found!")
        return;
    }

    currentSession = {
        registered: false,
        eventData: buildPlaybackEvent(track)
    }

    console.log(currentSession.eventData)
});


Spicetify.Player.addEventListener("onprogress", () => {
    if (currentSession.registered === true) {
        return;
    }

    let progress = Spicetify.Player.getProgressPercent();

    if (progress >= 0.60) {
        console.log("Music reached 60%. Saving...");

        const resultado = window.MusicStats.Storage.saveEvent(currentSession.eventData);
        console.log(resultado);

        currentSession.registered = true;
    }
});


// Construtor
function buildPlaybackEvent(object) {

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

    return build;
}
