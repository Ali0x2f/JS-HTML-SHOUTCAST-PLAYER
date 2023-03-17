//put stream link here
////////////////////////////////////
let shoutCast = "http://streams.extrafm.hr:8110/";
let sid = "1"
    ///////////////////////////////////
let lowQualityStream = shoutCast + "stream";
let highQualityStream = shoutCast + "stream";

let currentSong = shoutCast + "currentsong?sid=" + sid
let historySongs = shoutCast + "played?sid=" + sid
let corsProxy = "https://api.codetabs.com/v1/proxy/?quest=";
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