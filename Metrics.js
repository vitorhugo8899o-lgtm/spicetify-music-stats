window.MusicStats.Metrics = {
    musicTodayCont() {
        const musicList = window.MusicStats.Storage.getEventToday();

        if (!musicList || !musicList[todayDate]) {
            console.log("No music found today.");
            return [];
        }

        console.log(musicList[todayDate].length);
        return musicList[todayDate];
    }
}