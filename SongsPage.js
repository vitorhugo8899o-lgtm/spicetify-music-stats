window.MusicStats.Song = {
    SongsPage(songs_metrics) {
        const e = Spicetify.React.createElement;

        const [tracks, setTracks] = Spicetify.React.useState([]);
        const [loading, setLoading] = Spicetify.React.useState(true);

        const [currentUri, setCurrentUri] = Spicetify.React.useState(
            Spicetify.Player.data?.track?.uri || null
        );
        const [playerIsPlaying, setPlayerIsPlaying] = Spicetify.React.useState(
            !Spicetify.Player.data?.isPaused
        );

        const [likedMap, setLikedMap] = Spicetify.React.useState({});

        const [hoveredUri, setHoveredUri] = Spicetify.React.useState(null);

        const top1Song = tracks[0];

        Spicetify.React.useEffect(() => {
            const onSongChange = () => {
                setCurrentUri(Spicetify.Player.data?.track?.uri || null);
                setPlayerIsPlaying(!Spicetify.Player.data?.isPaused);
            };
            const onPlayPause = () => {
                setPlayerIsPlaying(!Spicetify.Player.data?.isPaused);
            };

            Spicetify.Player.addEventListener("songchange", onSongChange);
            Spicetify.Player.addEventListener("onplaypause", onPlayPause);

            return () => {
                Spicetify.Player.removeEventListener("songchange", onSongChange);
                Spicetify.Player.removeEventListener("onplaypause", onPlayPause);
            };
        }, []);


        Spicetify.React.useEffect(() => {
            let cancelled = false;

            async function fetchAllTracks() {
                const topSongs = songs_metrics?.top_songs || [];
                let firstLoaded = false;

                for (const song of topSongs) {
                    if (cancelled) break;

                    try {
                        const data = await window.MusicStats.Api.fetchTrackInfo(song.trackUri);
                        const buildTracker = window.MusicStats.Utils.buildTrackerData(data);

                        if (buildTracker && !cancelled) {
                            const track = { ...buildTracker, count: song.count };


                            setTracks(prev => [...prev, track]);
                            setLikedMap(prev => ({ ...prev, [track.uri]: track.liked }));

                            if (!firstLoaded) {
                                setLoading(false);
                                firstLoaded = true;
                            }
                        }
                    } catch (error) {
                        console.error("Error loading the track:", song.trackUri, error);
                    }
                }

                if (!cancelled) setLoading(false);
            }

            fetchAllTracks();
            return () => { cancelled = true; };
        }, [songs_metrics]);

        const handlePlayPause = async (uri) => {
            if (currentUri === uri) {
                if (playerIsPlaying) {
                    await window.MusicStats.Api.stopTracker();
                } else {
                    await Spicetify.Player.play();
                }
            } else {
                await window.MusicStats.Api.playTracker(uri);
            }
        };

        const handleToggleLike = async (uri) => {
            const isLiked = likedMap[uri];
            try {
                if (isLiked) {
                    await Spicetify.Platform.LibraryAPI.remove({ uris: [uri] });
                } else {
                    await Spicetify.Platform.LibraryAPI.add({ uris: [uri] });
                }
                setLikedMap(prev => ({ ...prev, [uri]: !isLiked }));
            } catch (err) {
                console.error("Error toggling like:", err);
            }
        };

        const title = e("h1",
            { style: { font: "bold", color: "#FFFAF0", margin: 0, paddingBottom: "8px" } },
            "Top Songs"
        );

        const uniqueSongs = e("h2",
            { style: { color: "#b3b3b3", margin: "5px 0 24px 0", fontSize: "14px" } },
            `You heard a total of ${songs_metrics?.top_songs?.length || 0} unique songs!`
        );

        if (loading) {
            return e("div", { style: { padding: "32px", color: "#fff" } }, "Loading top songs...");
        }

        if (tracks.length === 0) {
            return e("div", { style: { padding: "32px", color: "#fff" } }, title, uniqueSongs, "No music found.");
        }

        const heroSection = e("div", {
            style: {
                display: "flex",
                alignItems: "center",
                gap: "24px",
                padding: "24px",
                background: `radial-gradient(
                            circle at top left,
                            ${top1Song.dominantColor}AA 0%,
                            ${top1Song.dominantColor}33 45%,
                            #121212 100%
                    )`,
                borderRadius: "8px",
                marginBottom: "32px"
            }
        },
            e("img", {
                src: top1Song.cover,
                style: { width: "140px", height: "140px", objectFit: "cover", borderRadius: "4px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }
            }),
            e("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center" } },
                e("span", { style: { color: "#fff", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" } }, "Música Mais Ouvida"),
                e("h1", { style: { color: "#fff", fontSize: "48px", fontWeight: "900", margin: "0 0 8px 0" } }, top1Song.title),
                e("span", { style: { color: "#b3b3b3", fontSize: "16px" } }, `${top1Song.artist} • ${top1Song.album}`)
            )
        );

        const createTrackRow = (track, index) => {
            const isCurrentTrack = track.uri === currentUri;
            const isThisPlaying = isCurrentTrack && playerIsPlaying;
            const isHovered = hoveredUri === track.uri;
            const isLiked = likedMap[track.uri] ?? track.liked;

            const indexOrPlay = (isHovered || isCurrentTrack)
                ? e("button", {
                    onClick: (ev) => { ev.stopPropagation(); handlePlayPause(track.uri); },
                    style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: isCurrentTrack ? "#1db954" : "#fff",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        width: "16px",
                        lineHeight: 1
                    }
                }, isThisPlaying ? "⏸" : "▶")
                : e("span", {
                    style: { textAlign: "right", color: "#b3b3b3" }
                }, index);

            const likeButton = e("button", {
                onClick: (ev) => { ev.stopPropagation(); handleToggleLike(track.uri); },
                style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "16px",
                    color: isLiked ? "#1db954" : "#b3b3b3",
                    opacity: (isHovered || isLiked) ? 1 : 0,
                    transition: "opacity 0.15s, color 0.15s",
                    pointerEvents: (isHovered || isLiked) ? "auto" : "none"
                }
            }, "♥");

            return e("div", {
                key: track.uri,
                onMouseEnter: () => setHoveredUri(track.uri),
                onMouseLeave: () => setHoveredUri(null),
                style: {
                    display: "grid",
                    gridTemplateColumns: "16px 40px minmax(120px, 4fr) minmax(120px, 3fr) 32px 40px",
                    gridGap: "16px",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: "#b3b3b3",
                    fontSize: "14px",
                    fontFamily: "var(--font-family, spotify-circular)",
                    backgroundColor: isHovered ? "rgba(255,255,255,0.05)" : "transparent",
                    transition: "background-color 0.15s"
                }
            },
                indexOrPlay,
                e("img", {
                    src: track.cover,
                    style: { width: "40px", height: "40px", objectFit: "cover", borderRadius: "2px" }
                }),
                e("div", { style: { display: "flex", flexDirection: "column", overflow: "hidden", whiteSpace: "nowrap" } },
                    e("span", {
                        style: {
                            color: isCurrentTrack ? "#1db954" : "#fff",
                            fontWeight: "400",
                            fontSize: "16px",
                            textOverflow: "ellipsis",
                            overflow: "hidden"
                        }
                    }, track.title),
                    e("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" } },
                        track.explicit
                            ? e("span", {
                                style: {
                                    backgroundColor: "rgba(255,255,255,0.6)",
                                    color: "#121212",
                                    fontSize: "9px",
                                    padding: "1px 4px",
                                    borderRadius: "2px"
                                }
                            }, "E")
                            : null,
                        e("span", { style: { textOverflow: "ellipsis", overflow: "hidden" } }, track.artist)
                    )
                ),
                e("span", {
                    style: { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }
                }, track.album),
                likeButton,
                e("span", { style: { textAlign: "right" } }, track.duration)
            );
        };

        const trackList = e("div",
            { style: { display: "flex", flexDirection: "column", gap: "4px" } },
            tracks.map((track, index) => createTrackRow(track, index + 1))
        );

        return e(
            "div",
            { style: { padding: "32px", backgroundColor: "#121212", minHeight: "100vh" } },
            title,
            uniqueSongs,
            heroSection,
            trackList
        );
    }
};