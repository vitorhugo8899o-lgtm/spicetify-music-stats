window.MusicStats.Metrics = {
    async musicTodayCont() {
        const musicList = await window.MusicStats.Storage.getEventToday();

        const todayDate = getLocalDate();

        if (!musicList || !musicList[todayDate]) {
            console.log("No music found today.");
            return [];
        }

        console.log(musicList[todayDate].length);
        return musicList[todayDate];
    }
};