function render() {
    const musicTodayButton = Spicetify.React.createElement(
        "button",
        {
            onClick: () => { window.MusicStats.Metrics.musicTodayCont() }
        },
        "Today Music"
    );

    const totalTracks = Spicetify.React.createElement(
        "div",
        null,
        "Rendering test"
    );

    const favoriteArtist = Spicetify.React.createElement(
        "div",
        null,
        "Favorite artist"
    );

    return Spicetify.React.createElement(
        "div",
        {
            style: {
                padding: "30px"
            }
        },
        totalTracks,
        favoriteArtist,
        musicTodayButton,
    );
}