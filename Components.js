window.MusicStats.Components = {
    TabButton(name, page, activePage, setActivePage) {
        return Spicetify.React.createElement(
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
    },
    OptionsMenu(activeOption, setActiveOption) {
        const [isOpen, setIsOpen] = Spicetify.React.useState(false);

        const labels = {
            today: "Today",
            week: "Last Week",
            month: "Last Month",
            all: "All Time"
        };

        function createOptionItem(value, label) {
            const isSelected = activeOption === value;

            return Spicetify.React.createElement(
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

        return Spicetify.React.createElement(
            "div",
            {
                style: {
                    position: "relative",
                    display: "inline-block",
                    marginLeft: "auto"
                }
            },

            Spicetify.React.createElement(
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

            isOpen && Spicetify.React.createElement(
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
    },
    ArtistCard({ artist, size = 120 }) {
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

        return Spicetify.React.createElement(
            "a",
            {
                href: artist.uri,
                onClick: (e) => {
                    e.preventDefault();
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
            Spicetify.React.createElement("div", {
                style: {
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: "#282828",
                    backgroundImage: image ? `url(${image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    marginBottom: "8px"
                }
            }),
            Spicetify.React.createElement(
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
            Spicetify.React.createElement(
                "span",
                { style: { color: "#A7A7A7", fontSize: "0.85em" } },
                "Artist"
            )
        );
    }
}