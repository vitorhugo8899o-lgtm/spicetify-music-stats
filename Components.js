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
    }
}