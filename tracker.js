let currentSession = {
    registered: false,
    eventData: null
};


Spicetify.Player.addEventListener("songchange", (event) => {
    const track = event.data?.item ?? false;

    if (track.type === "ad") {
        console.log("Ad skip!")
        return;
    }

    if (track === false) {
        console.log("Item not found!")
        return;
    }

    currentSession = {
        registered: false,
        eventData: buildPlaybackEvent(track)
    }
});


Spicetify.Player.addEventListener("onprogress", async () => {
    if (currentSession.registered === true) {
        return;
    }

    let progress = Spicetify.Player.getProgressPercent();

    if (progress >= 0.60) {
        const resultado = await window.MusicStats.Storage.saveEvent(currentSession.eventData);

        currentSession.registered = true;
    }
});


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
