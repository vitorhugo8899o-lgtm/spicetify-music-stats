window.MusicStats.Album = {
    AlbumPage(album_metrics) {
        const e = Spicetify.React.createElement;

        const [topAlbum, ...restAlbums] = album_metrics.top_albums;

        return e(
            "div",
            {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }
            },

            e(
                "h1",
                {
                    style: {
                        color: "#FFFAF0",
                        margin: 0
                    }
                },
                "Top Albums"
            ),

            e(
                "h2",
                { style: { color: "#b3b3b3", margin: "5px 0 24px 0", fontSize: "14px" } },
                `Today you heard a total of ${album_metrics.unique_albums} unique albums!`
            ),

            topAlbum &&
            e(
                "div",
                {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "50px"
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

                e(window.MusicStats.Components.AlbumCard, {
                    album: topAlbum,
                    size: 180
                }),

                e(
                    "div",
                    {
                        style: {
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(140px, 1fr))",
                            gap: "24px"
                        }
                    },
                    restAlbums.map((album) =>
                        e(window.MusicStats.Components.AlbumCard, {
                            key: album.albumUri,
                            album,
                            size: 120
                        })
                    )
                )
            )
        );
    }
};