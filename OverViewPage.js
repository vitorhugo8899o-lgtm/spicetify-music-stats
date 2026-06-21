window.MusicStats.Overview = {
    OverviewPage({ overview_metrics }) {
        const e = Spicetify.React.createElement;
        const C = window.MusicStats.Components;

        const [artistUrl, setArtistUrl] = Spicetify.React.useState(null);
        const [albumUrl, setAlbumUrl] = Spicetify.React.useState(null);

        const [isArtistHovered, setIsArtistHovered] = Spicetify.React.useState(false);
        const [isAlbumHovered, setIsAlbumHovered] = Spicetify.React.useState(false);

        Spicetify.React.useEffect(() => {
            const fetchImages = async () => {
                try {
                    const resArtist = await window.MusicStats.Api.fetchArtistInfo(
                        overview_metrics.artist_metrics.top_artists[0].uri
                    );
                    const fetchedArtistUrl = resArtist?.artistUnion?.visuals?.avatarImage?.sources?.[1]?.url;
                    if (fetchedArtistUrl) setArtistUrl(fetchedArtistUrl);

                    const resAlbum = await window.MusicStats.Api.fetchAlbumInfo(
                        overview_metrics.album_metrics.top_albums[0].albumUri
                    );
                    const fetchedAlbumUrl = resAlbum?.albumUnion?.coverArt?.sources[0]?.url

                    console.log(resAlbum)
                    console.log(fetchedAlbumUrl)


                    if (fetchedAlbumUrl) setAlbumUrl(fetchedAlbumUrl);
                }
                catch (err) {
                    console.error("Error fetching images: ", err);
                }
            };

            fetchImages();
        }, []);

        const header = e(
            "h1",
            { style: { color: "#FFFAF0", fontWeight: "bold", fontSize: "2.2em", margin: 0 } },
            "OverView"
        );

        const subheader = e(
            "p",
            { style: { color: "#A7A7A7", margin: 0, fontSize: "1.1em" } },
            `Your musical day began at ${overview_metrics.daily.firts} and it ended at 
            ${overview_metrics.daily.last}.`
        );

        const statsRow = e(
            "div",
            { style: { display: "flex", gap: "16px" } },
            C.StatCard({
                icon: C.ClockIcon(),
                label: "Total Listening Time",
                value: overview_metrics.listen_time,
                subtitle: "Your total music listening time today.",
                flexGrow: 2
            }),
            C.StatCard({
                icon: C.HeadphonesIcon(),
                label: "Songs Listened To",
                value: overview_metrics.music_metrics.total_song_listen
            }),
            C.StatCard({
                icon: C.MusicNoteIcon(),
                label: "Unique Songs",
                value: overview_metrics.music_metrics.unique_songs
            }),
            C.StatCard({
                icon: C.RepeatIcon(),
                label: "Repeated Songs",
                value: overview_metrics.music_metrics.repeated_songs
            })
        );

        const repeatRateCard = e(
            "div",
            {
                style: {
                    background: "#181818",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                }
            },
            e(
                "span",
                { style: { color: "#FFFAF0", fontSize: "1.2em" } },
                "Repetition Rate: ",
                e("b", { style: { fontWeight: "bold" } }, `${overview_metrics.music_metrics.repeated_playback_rate}%`)
            ),
            C.RepeatRateBar({ percentage: overview_metrics.music_metrics.repeated_playback_rate })
        );

        const favoritesTitle = e(
            "h2",
            { style: { color: "#FFFAF0", margin: "10px 0 0 0", fontSize: "1.4em" } },
            "Your Favorites Today"
        );

        const favoriteArtistCard = C.FavoriteEntityCard({
            imageUrl: artistUrl,
            shape: "circle",
            showBadge: true,
            placeholderIcon: C.PersonIcon(),
            label: "Your most listened-to artist",
            name: overview_metrics.artist_metrics.top_artists[0].name,
            isHovered: isArtistHovered,
            onMouseEnter: () => setIsArtistHovered(true),
            onMouseLeave: () => setIsArtistHovered(false),
            onClick: () => {
                const uri = overview_metrics.artist_metrics.top_artists[0].uri;
                if (uri) {
                    Spicetify.Platform.History.push(`/artist/${uri.split(":")[2]}`);
                }
            }
        });

        const favoriteAlbumCard = C.FavoriteEntityCard({
            imageUrl: albumUrl,
            shape: "square",
            label: "Your most listened to album",
            name: overview_metrics.album_metrics.top_albums[0].albumName,
            isHovered: isAlbumHovered,
            onMouseEnter: () => setIsAlbumHovered(true),
            onMouseLeave: () => setIsAlbumHovered(false),
            onClick: () => {
                const uri = overview_metrics.album_metrics.top_albums[0].albumUri;
                if (uri) {
                    Spicetify.Platform.History.push(`/album/${uri.split(":")[2]}`);
                }
            }
        });

        const uniqueArtistsCard = C.SummaryTextCard([
            "You heard ",
            e("b", { key: "n", style: { fontWeight: "bold" } },
                overview_metrics.artist_metrics.unique_artists),
            " unique artists."
        ]);

        const uniqueAlbumsCard = C.SummaryTextCard([
            "You heard ",
            e("b", { key: "n", style: { fontWeight: "bold" } },
                overview_metrics.album_metrics.unique_albums),
            " unique albums today."
        ]);

        return e(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "20px" } },
            header,
            subheader,
            statsRow,
            repeatRateCard,
            favoritesTitle,
            e("div", { style: { display: "flex", gap: "16px" } }, favoriteArtistCard, favoriteAlbumCard),
            e("div", { style: { display: "flex", gap: "16px" } }, uniqueArtistsCard, uniqueAlbumsCard)
        );
    }
};