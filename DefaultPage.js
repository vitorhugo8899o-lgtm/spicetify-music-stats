window.MusicStats.Default = {
    DefaultPage() {
        const imageJaguar = Spicetify.React.createElement(
            "img",
            {
                src: "https://i.postimg.cc/8CWzkjz7/jaguar-preview.png",
                style: {
                    width: "250px",
                    height: "250px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    marginTop: "20px",
                    backgroundColor: "#121212"
                }
            }
        );

        return Spicetify.React.createElement(
            "div",
            { style: { textAlign: "center", marginTop: "50px", color: "#b3b3b3" } },

            Spicetify.React.createElement("h2", null, "Welcome to MusicStats!"),
            Spicetify.React.createElement("p", null, "Select a time period from the top right menu to load your metrics."),
            imageJaguar
        );
    }
}