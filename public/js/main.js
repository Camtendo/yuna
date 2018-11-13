if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement');
    var disconnects = 0;
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        url: 'http://localhost:8000/live/live.flv',
        hasVideo: true,
        hasAudio: true,
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();

    flvPlayer.on(flvjs.Events.ERROR, () => {
        console.log('ERROR WAS THROWN!');
        // TODO Notify server down via client Twilio
        reloadPlayer();
    });

    flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
        console.log('LOADING COMPLETE WAS THROWN!');
        disconnects++;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/notify-disconnect", true);
        xhr.send();
        reloadPlayer();
    });

    function updateInfo() {
        var bitrate = flvPlayer._statisticsInfo ? flvPlayer._statisticsInfo.speed * 8 : 0;
        if (!bitrate) {
            document.getElementById('stream-info').innerHTML = 'DISCONNECTED';
            return;
        }

        var uptime = flvPlayer.currentTime;
        var width = flvPlayer.mediaInfo && flvPlayer.mediaInfo.width ? flvPlayer.mediaInfo.width : 0;
        var height = flvPlayer.mediaInfo && flvPlayer.mediaInfo.height ? flvPlayer.mediaInfo.height : 0;
        var droppedFrames = flvPlayer._statisticsInfo ? flvPlayer._statisticsInfo.droppedFrames : 0;
        var decodedFrames = flvPlayer._statisticsInfo ? flvPlayer._statisticsInfo.decodedFrames : 1;
        var frameRenderPercentage = (decodedFrames - droppedFrames) * 100 / (decodedFrames);

        var newText = buildInfoString(width, height, bitrate, uptime);
        document.getElementById('stream-info').innerHTML = newText;
    }

    function buildTimeString(seconds) {
        var intSecs = Math.round(seconds);
        var date = new Date(null);
        date.setSeconds(intSecs);
        var result = date.toISOString().substr(11, 8);
        return result;
    }

    function buildInfoString(width, height, bitrate, uptime) {
        return `${width}x${height}p @ ${bitrate.toFixed(2)}kbps | RTMP uptime: ${buildTimeString(uptime)} | Disconnects: ${disconnects}`;
    }

    function reloadPlayer() {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        // the play request is a deferred promise that will wait until the source exists again
        flvPlayer.play();
    }

    setInterval(updateInfo, 1000);
}