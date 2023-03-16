let lowQualityStream = "http://streams.extrafm.hr:8110/stream";
let highQualityStream = "http://streams.extrafm.hr:8110/stream";
let shoutCast = "http://streams.extrafm.hr:8110/";
let corsProxy = "https://api.codetabs.com/v1/proxy/?quest=";
let currentSong = "http://streams.extrafm.hr:8110/currentsong?sid=1"
let historySongs = "http://streams.extrafm.hr:8110/played?sid=1"
    // this is done to fix caching issues
function getNewRandomizedLink(linkStream) {
    return linkStream + "?" + Math.floor((Math.random() * 10000) + 1);
}

// check for which audio quality to load
var checkBox = document.getElementById("quality");
const radioSource = getNewRandomizedLink(highQualityStream);
const resetAudio = "about:blank";
const loader = document.getElementById('loader');
const audio = document.getElementById('audio');

// set initial volume var
window.SetVolume = function(val) {
    var player = document.getElementById('audio');
    player.volume = val / 100;
}

audio.addEventListener('loadstart', () => {
    if (audio.src !== resetAudio) {
        loader.style.visibility = "visible";
    }
});

audio.addEventListener('playing', () => {
    loader.style.visibility = "hidden";
});

// if cliked the play button start the stream
document.getElementById('aroundbutton').addEventListener('click', (evt) => {
    var element = document.getElementById("on");
    if (audio.paused) {
        audio.src = resetAudio;
        audio.pause();
        audio.src = radioSource;
        audio.load();
        audio.play();
        element.classList.remove("fa-play");
        element.classList.add("fa-pause");
        checkBox.checked = true;
    } else {
        element.classList.remove("fa-pause");
        element.classList.add("fa-play");
        audio.src = resetAudio;
        audio.pause();
    }
})

// triggered by clicking quality choice button
function check() {
    if (checkBox.checked) {
        const radioSource = getNewRandomizedLink(highQualityStream);
        const resetAudio = "about:blank";
        var element = document.getElementById("on");
        audio.src = resetAudio;
        audio.pause();
        audio.src = radioSource;
        audio.load();
        audio.play();
        element.classList.remove("fa-play");
        element.classList.add("fa-pause");
    } else {
        const radioSource = getNewRandomizedLink(highQualityStream);
        const resetAudio = "about:blank";
        var element = document.getElementById("on");
        audio.src = resetAudio;
        audio.pause();
        audio.src = radioSource;
        audio.load();
        audio.play();
        element.classList.remove("fa-play");
        element.classList.add("fa-pause");
    }
}

// json parser for current playing song and artist
// replace with a more relevant parser if needed
function whatIsPlaying() {
    var url = corsProxy + currentSong;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.status == 200) {
            console.log(xmlHttp.responseText)
            document.getElementById('song').innerHTML = xmlHttp.responseText;

            window.document.title = xmlHttp.responseText + " | Simple player";
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function getHistory() {
    var url = corsProxy + historySongs;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        if (xmlHttp.status == 200) {
            console.log(xmlHttp.responseText.split('<table border="0" cellpadding="2" cellspacing="2">')[1].split('</td></tr></table>')[0])
            document.getElementById('history').innerHTML = '<table border="0" cellpadding="2" cellspacing="2">' + xmlHttp.responseText.split('<table border="0" cellpadding="2" cellspacing="2">')[1].split('</td></tr></table>')[0] + '</td></tr></table>';


        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

whatIsPlaying();
getHistory(); // auto refresh currently playing song. Consider drawback of frequent updates
setInterval(whatIsPlaying, 5000);
setInterval(getHistory, 5000);

document.getElementById('on').addEventListener('click', (evt) => {
    var element = document.getElementById("on");
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");
})

function getStreamingData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState === 4 && this.status === 200) {

            if (this.response.length === 0) {
                console.log('%cdebug', 'font-size: 22px')
            }

            var data = JSON.parse(this.responseText);

            var page = new Page();

            var currentSongElement = document.getElementById('currentSong').innerHTML.replace(/&apos;/g, '\'');
            let currentSongEl = currentSongElement.replace(/&amp;/g, '&');

            // Formating characters to UTF-8
            let song = data.currentSong.replace(/&apos;/g, '\'');
            let currentSong = song.replace(/&amp;/g, '&');

            let artist = data.currentArtist.replace(/&apos;/g, '\'');
            let currentArtist = artist.replace(/&amp;/g, '&');
            currentArtist = currentArtist.replace('  ', ' ');

            // Change the title
            document.title = currentSong + ' - ' + currentArtist + ' | ' + RADIO_NAME;

            if (currentSongEl.trim() !== currentSong.trim()) {
                page.refreshCover(currentSong, currentArtist);
                page.refreshCurrentSong(currentSong, currentArtist);
                page.refreshLyric(currentSong, currentArtist);

                for (var i = 0; i < 2; i++) {
                    page.refreshHistoric(data.songHistory[i], i);
                }
            }
        }
    };

    var d = new Date();

    // Requisition with timestamp to prevent cache on mobile devices
    xhttp.open('GET', 'api.php?url=' + URL_STREAMING + '&streamtype=' + STREAMING_TYPE + '&historic=' + HISTORIC + '&next=' + NEXT_SONG + '&t=' + d.getTime(), true);
    xhttp.send();
}