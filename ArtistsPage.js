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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: "50px",
                        marginTop: "10px"
                    }
                },

                Spicetify.React.createElement(
                    "svg",
                    {
                        width: 48,
                        height: 48,
                        viewBox: "0 0 24 24",
                        style: {
                            marginBottom: "-8px",
                            filter: "drop-shadow(0 2px 6px rgba(255, 215, 0, 0.5))"
                        }
                    },
                    Spicetify.React.createElement("path", {
                        fill: "#FFD700",
                        d: "M3 18L5 7l5 5 2-8 2 8 5-5 2 11H3z"
                    }),
                    Spicetify.React.createElement("rect", {
                        x: 3,
                        y: 18,
                        width: 18,
                        height: 2,
                        fill: "#E6C200"
                    })
                ),

                Spicetify.React.createElement(
                    window.MusicStats.Components.ArtistCard,
                    { artist: topArtist, size: 180 }
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