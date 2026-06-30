window.MusicStats.Artist = {
    ArtistsPage(artist_metrics) {
        const e = Spicetify.React.createElement;;

        const title = e(
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

        const uniqueArtists = e(
            "h2",
            { style: { color: "#b3b3b3", margin: "5px 0 24px 0", fontSize: "14px" } },
            `You heard a total of ${artist_metrics.unique_artists} unique artists!`
        )

        return e(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "20px" } },
            title,
            uniqueArtists,

            topArtist && e(
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

                e(
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
                    e("path", {
                        fill: "#FFD700",
                        d: "M3 18L5 7l5 5 2-8 2 8 5-5 2 11H3z"
                    }),
                    e("rect", {
                        x: 3,
                        y: 18,
                        width: 18,
                        height: 2,
                        fill: "#E6C200"
                    })
                ),

                e(
                    window.MusicStats.Components.ArtistCard,
                    { artist: topArtist, size: 180 }
                )
            ),

            e(
                "div",
                {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "24px"
                    }
                },
                restArtists.map((artist) =>
                    e(
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