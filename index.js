function render() {
    const e = Spicetify.React.createElement

    const [activePage, setActivePage] = Spicetify.React.useState("");
    const [activeOption, setActiveOption] = Spicetify.React.useState("");
    const [metricsData, setMetricsData] = Spicetify.React.useState(null);
    const [isLoading, setIsLoading] = Spicetify.React.useState(false);

    Spicetify.React.useEffect(() => {
        if (!activeOption) return;

        async function loadMetrics() {
            setIsLoading(true);
            try {
                const data = await buildMetrics(activeOption);

                setMetricsData(data);

                if (activePage === "") {
                    setActivePage("artists");
                }
            } catch (error) {
                console.error("Error retrieving Spicetify metrics:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadMetrics();

    }, [activeOption]);

    let content;

    if (!activeOption) {
        content = e(window.MusicStats.Default.DefaultPage, null);
    }

    else if (isLoading) {
        content = e("h1", null, "Loading metrics for the period...");
    }

    else if (typeof metricsData === "string") {
        content = e("h1", null, metricsData);
    }

    else if (metricsData) {
        switch (activePage) {
            case "artists":
                content = window.MusicStats.Artist.ArtistsPage
                    ? e(window.MusicStats.Artist.ArtistsPage, metricsData.artist_metrics)
                    : e("h1", null, "Artist Page");
                break;

            case "albums":
                content = window.MusicStats.Album.AlbumPage
                    ? e(window.MusicStats.Album.AlbumPage, metricsData.album_metrics)
                    : e("h1", null, "Album Page");
                break;

            case "songs":
                content = window.MusicStats.Song.SongsPage
                    ? e(window.MusicStats.Song.SongsPage, metricsData.music_metrics)
                    : e("h1", null, "Songs Page");
                break;

            case "overview":
                content = window.MusicStats.Overview.OverviewPage
                    ? e(
                        window.MusicStats.Overview.OverviewPage,
                        { overview_metrics: metricsData }
                    )
                    : e("h1", null, "OverView Page");
                break;
        }
    }

    return e(
        "div",
        {
            style: {
                padding: "30px"
            }
        },

        e(
            "div",
            {
                style: {
                    marginBottom: "40px",
                    display: "flex",
                    alignItems: "center"
                }
            },
            window.MusicStats.Components.TabButton("Artists", "artists", activePage, setActivePage),
            window.MusicStats.Components.TabButton("Albums", "albums", activePage, setActivePage),
            window.MusicStats.Components.TabButton("Songs", "songs", activePage, setActivePage),
            window.MusicStats.Components.TabButton("OverView", "overview", activePage, setActivePage),
            window.MusicStats.Components.OptionsMenu(activeOption, setActiveOption)
        ),

        content
    );
}