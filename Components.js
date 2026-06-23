window.MusicStats.Components = (() => {
    const e = Spicetify.React.createElement;

    function TabButton(name, page, activePage, setActivePage) {
        return e(
            "button",
            {
                onClick: () => setActivePage(page),
                style: {
                    padding: "10px 20px",
                    marginRight: "10px",
                    borderRadius: "8px",
                    border: activePage === page ? "2px solid #1DB954" : "1px solid #555",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer"
                }
            },
            name
        );
    }

    function OptionsMenu(activeOption, setActiveOption) {
        const [isOpen, setIsOpen] = Spicetify.React.useState(false);

        const labels = {
            today: "Today",
            week: "Last Week",
            month: "Last Month",
            all: "All Time"
        };

        function createOptionItem(value, label) {
            const isSelected = activeOption === value;

            return e(
                "div",
                {
                    onClick: () => {
                        setActiveOption(value);
                        setIsOpen(false);
                    },
                    style: {
                        padding: "10px 16px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#1DB954" : "transparent",
                        color: "white",
                        borderRadius: "4px",
                        fontWeight: isSelected ? "bold" : "normal",
                    }
                },
                label
            );
        }

        return e(
            "div",
            {
                style: {
                    position: "relative",
                    display: "inline-block",
                    marginLeft: "auto"
                }
            },

            e(
                "button",
                {
                    onClick: () => setIsOpen(!isOpen),
                    style: {
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "1px solid #555",
                        background: "#282828",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        whiteSpace: "nowrap"
                    }
                },
                labels[activeOption] || "Select Period",
                isOpen ? "▲" : "▼"
            ),

            isOpen && e(
                "div",
                {
                    style: {
                        position: "absolute",
                        top: "45px",
                        left: "0",
                        background: "#181818",
                        border: "1px solid #282828",
                        borderRadius: "8px",
                        padding: "4px",
                        minWidth: "180px",
                        zIndex: 99,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                    }
                },
                createOptionItem("today", "Today"),
                createOptionItem("week", "Last Week"),
                createOptionItem("month", "Last Month"),
                createOptionItem("all", "All Time")
            )
        )
    }

    function ArtistCard({ artist, size = 120 }) {
        const [image, setImage] = Spicetify.React.useState(null);
        const [isNameHovered, setIsNameHovered] = Spicetify.React.useState(false);

        Spicetify.React.useEffect(() => {
            let mounted = true;

            (async () => {
                try {
                    const res = await window.MusicStats.Api.fetchArtistInfo(artist.uri)
                    const avatarUrl = res?.artistUnion?.visuals?.avatarImage?.sources?.[1]?.url;
                    if (mounted && avatarUrl) setImage(avatarUrl);
                } catch (err) {
                    console.error("music-stats: error while searching for image of", artist.name, err);
                }
            })();

            return () => { mounted = false; };
        }, [artist.uri]);

        return e(
            "a",
            {
                href: artist.uri,
                onClick: (ev) => {
                    ev.preventDefault();
                    Spicetify.Platform.History.push(`/artist/${artist.uri.split(":")[2]}`);
                },
                style: {
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: size
                }
            },
            e("div", {
                style: {
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: "#282828",
                    backgroundImage: image ? `url(${image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "10px"
                }
            }),
            e(
                "span",
                {
                    onMouseEnter: () => setIsNameHovered(true),
                    onMouseLeave: () => setIsNameHovered(false),
                    style: {
                        fontWeight: "bold",
                        color: "#FFFAF0",
                        textAlign: "center",
                        textDecoration: isNameHovered ? "underline" : "none",
                        cursor: "pointer"
                    }
                },
                artist.name
            ),
            e(
                "span",
                { style: { color: "#A7A7A7", fontSize: "0.85em" } },
                "Artist"
            )
        );
    }

    function AlbumCard({ album, size = 150 }) {
        const e = Spicetify.React.createElement;

        const [image, setImage] = Spicetify.React.useState(null);
        const [backgroundAlbum, setBackgroundAlbum] = Spicetify.React.useState(
            "rgba(255,255,255,0.05)"
        );
        const [isHovered, setIsHovered] = Spicetify.React.useState(false);

        Spicetify.React.useEffect(() => {
            let cancelled = false;

            async function loadAlbumData() {
                try {
                    const res = await window.MusicStats.Api.fetchAlbumInfo(
                        album.albumUri
                    );

                    const imageUrl =
                        res?.albumUnion?.coverArt?.sources?.[0]?.url;

                    const albumColor =
                        res?.albumUnion?.coverArt?.extractedColors?.colorDark?.hex;

                    console.log(res, albumColor)

                    if (!cancelled) {
                        setImage(imageUrl ?? null);

                        if (albumColor) {
                            setBackgroundAlbum(albumColor);
                        }
                    }
                } catch (err) {
                    console.error(
                        `Failed to load cover for ${album.albumName}`,
                        err
                    );
                }
            }

            loadAlbumData();

            return () => {
                cancelled = true;
            };
        }, [album.albumUri]);

        return e(
            "div",
            {
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => setIsHovered(false),
                style: {
                    width: size + 32,
                    padding: "12px",
                    borderRadius: "16px",

                    background: `
                    linear-gradient(
                        180deg,
                        ${backgroundAlbum}55,
                        rgba(0,0,0,0.25)
                    )
                `,

                    backdropFilter: "blur(6px)",

                    transition: "all 0.2s ease",

                    transform: isHovered
                        ? "translateY(-4px)"
                        : "translateY(0)",

                    boxShadow: isHovered
                        ? "0 8px 20px rgba(0,0,0,0.35)"
                        : "0 4px 12px rgba(0,0,0,0.2)",

                    display: "flex",
                    justifyContent: "center"
                }
            },

            e(
                "a",
                {
                    href: album.albumUri,
                    onClick: (ev) => {
                        ev.preventDefault();

                        Spicetify.Platform.History.push(
                            `/album/${album.albumUri.split(":")[2]}`
                        );
                    },
                    style: {
                        textDecoration: "none",
                        color: "inherit",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                        width: size
                    }
                },

                e("div", {
                    style: {
                        width: size,
                        height: size,

                        borderRadius: "12px",

                        backgroundColor: "#282828",
                        backgroundImage: image
                            ? `url(${image})`
                            : undefined,

                        backgroundSize: "cover",
                        backgroundPosition: "center",

                        marginBottom: "10px",

                        boxShadow:
                            "0 6px 14px rgba(0,0,0,0.35)"
                    }
                }),

                e(
                    "span",
                    {
                        style: {
                            fontWeight: "bold",
                            color: "#FFFAF0",

                            textAlign: "center",

                            minHeight: "48px",
                            maxWidth: size,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            lineHeight: "1.2"
                        }
                    },
                    album.albumName
                ),

                e(
                    "span",
                    {
                        style: {
                            color: "#B3B3B3",
                            fontSize: "0.85em"
                        }
                    },
                    "Album"
                )
            )
        );
    }

    function ClockIcon() {
        return e(
            "svg",
            { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none" },
            e("circle", { cx: 12, cy: 12, r: 9, stroke: "#1DB954", strokeWidth: 2 }),
            e("path", {
                d: "M12 7v5l3 2",
                stroke: "#1DB954",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        );
    }

    function HeadphonesIcon() {
        return e(
            "svg",
            { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none" },
            e("path", {
                d: "M4 13v-1a8 8 0 0 1 16 0v1",
                stroke: "#1DB954",
                strokeWidth: 2,
                strokeLinecap: "round"
            }),
            e("rect", { x: 2, y: 13, width: 5, height: 7, rx: 2, fill: "#1DB954" }),
            e("rect", { x: 17, y: 13, width: 5, height: 7, rx: 2, fill: "#1DB954" })
        );
    }

    function MusicNoteIcon() {
        return e(
            "svg",
            { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none" },
            e("path", {
                d: "M9 18V5l11-2v13",
                stroke: "#1DB954",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            e("circle", { cx: 6.5, cy: 18, r: 2.5, fill: "#1DB954" }),
            e("circle", { cx: 17.5, cy: 16, r: 2.5, fill: "#1DB954" })
        );
    }

    function RepeatIcon() {
        return e(
            "svg",
            { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none" },
            e("path", { d: "M17 1l4 4-4 4", stroke: "#1DB954", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }),
            e("path", { d: "M3 11V9a4 4 0 0 1 4-4h14", stroke: "#1DB954", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }),
            e("path", { d: "M7 23l-4-4 4-4", stroke: "#1DB954", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }),
            e("path", { d: "M21 13v2a4 4 0 0 1-4 4H3", stroke: "#1DB954", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })
        );
    }

    function PersonIcon() {
        return e(
            "svg",
            { width: 44, height: 44, viewBox: "0 0 24 24", fill: "#9B9B9B" },
            e("circle", { cx: 12, cy: 8, r: 4 }),
            e("path", { d: "M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" })
        );
    }

    function SpotifyBadge() {
        return e(
            "svg",
            { width: 22, height: 22, viewBox: "0 0 24 24" },
            e("circle", { cx: 12, cy: 12, r: 12, fill: "#1DB954" }),
            e("path", { d: "M6 9c4-1.2 8-1.2 12 1", stroke: "white", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" }),
            e("path", { d: "M6.5 12.5c3.3-1 6.7-1 10 1", stroke: "white", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" }),
            e("path", { d: "M7 16c2.6-0.7 5.4-0.7 8 0.5", stroke: "white", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" })
        );
    }

    function StatCard({ icon, label, value, subtitle, flexGrow }) {
        return e(
            "div",
            {
                style: {
                    flex: flexGrow || 1,
                    background: "#181818",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "6px"
                }
            },
            icon,
            e(
                "span",
                { style: { color: "#FFFAF0", fontWeight: "bold", marginTop: "4px" } },
                label
            ),
            e(
                "span",
                {
                    style: {
                        color: "#FFFAF0",
                        fontWeight: "bold",
                        fontSize: subtitle ? "2.6em" : "1.8em",
                        margin: "4px 0"
                    }
                },
                value
            ),
            subtitle &&
            e(
                "span",
                { style: { color: "#A7A7A7", fontSize: "0.85em" } },
                subtitle
            )
        );
    }

    function RepeatRateBar({ percentage, totalSegments = 50, color = "#1DB954", trackColor = "#3E3E3E" }) {
        const filledSegments = Math.round((percentage / 100) * totalSegments);
        const segments = [];
        for (let i = 0; i < totalSegments; i++) {
            segments.push(
                e("div", {
                    key: i,
                    style: {
                        flex: 1,
                        height: "100%",
                        background: i < filledSegments ? color : trackColor
                    }
                })
            );
        }
        return e(
            "div",
            {
                style: {
                    display: "flex",
                    gap: "2px",
                    width: "100%",
                    height: "8px",
                    borderRadius: "4px",
                    overflow: "hidden"
                }
            },
            ...segments
        );
    }

    function SummaryTextCard(children) {
        return e(
            "div",
            {
                style: {
                    flex: 1,
                    background: "#181818",
                    borderRadius: "12px",
                    padding: "18px 20px",
                    color: "#FFFAF0",
                    fontSize: "1.05em"
                }
            },
            children
        );
    }

    function FavoriteEntityCard({
        imageUrl,
        shape = "square",
        showBadge = false,
        placeholderIcon = null,
        placeholderBackground,
        label,
        name,
        isHovered,
        onMouseEnter,
        onMouseLeave,
        onClick
    }) {
        const isCircle = shape === "circle";
        const bg = placeholderBackground || (isCircle ? "#D9D9D9" : "linear-gradient(135deg, #4B2E83, #8B1E3F)");

        const imageBox = isCircle
            ? e(
                "div",
                { style: { position: "relative", width: 80, height: 80, flexShrink: 0 } },
                e(
                    "div",
                    {
                        style: {
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: imageUrl ? `url(${imageUrl}) center/cover` : bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }
                    },
                    !imageUrl && placeholderIcon
                ),
                showBadge && e("div", { style: { position: "absolute", bottom: -2, right: -2 } }, SpotifyBadge())
            )
            : e("div", {
                style: {
                    width: 80,
                    height: 80,
                    borderRadius: "8px",
                    flexShrink: 0,
                    background: imageUrl ? `url(${imageUrl}) center/cover` : bg
                }
            });

        return e(
            "div",
            {
                style: {
                    flex: 1,
                    background: "#181818",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                }
            },
            imageBox,
            e(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                e("span", { style: { color: "#A7A7A7" } }, label),
                e(
                    "span",
                    {
                        style: {
                            color: "#FFFAF0",
                            fontWeight: "bold",
                            fontSize: "1.3em",
                            cursor: "pointer",
                            textDecoration: isHovered ? "underline" : "none"
                        },
                        onMouseEnter,
                        onMouseLeave,
                        onClick
                    },
                    name || "Not Found!"
                )
            )
        );
    }

    return {
        TabButton,
        OptionsMenu,
        ArtistCard,
        ClockIcon,
        HeadphonesIcon,
        MusicNoteIcon,
        RepeatIcon,
        PersonIcon,
        SpotifyBadge,
        StatCard,
        RepeatRateBar,
        SummaryTextCard,
        FavoriteEntityCard,
        AlbumCard
    };
})();