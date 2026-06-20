window.MusicStats.Artist = {
    ArtistsPage(artist_metrics) {
        const title = Spicetify.React.createElement(
            "h1",
            {
                style: {
                    font: "bold",
                    color: "#FFFAF0",
                    margin: 0
                }
            },
            "Top Artists"
        )

        const [topArtist, ...restArtists] = artist_metrics.top_artists

        const uniqueArtists = Spicetify.React.createElement(
            "h2",
            {
                style: {
                    color: "#FFFAF0",
                    margin: "5px"
                }
            },
            `Today you heard a total of ${artist_metrics.unique_artists} unique artists!`
        )

        return Spicetify.React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "20px" } },
            uniqueArtists,
            title,

            topArtist && Spicetify.React.createElement(
                "div",
                {
                    style: {
                        display: "flex", flexDirection: "column", alignItems: "center"
                    }
                },
                Spicetify.React.createElement(
                    window.MusicStats.Components.ArtistCard, { artist: topArtist, size: 180 }
                )
            ),

            Spicetify.React.createElement(
                "div",
                {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "24px"
                    }
                },
                restArtists.map((artist) =>
                    Spicetify.React.createElement(
                        window.MusicStats.Components.ArtistCard, {
                        key: artist.uri,
                        artist,
                        size: 120,
                    })
                )
            )
        );
    }
}