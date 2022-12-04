const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const volumnRange = document.getElementById("volumn");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumnValue = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;
video.volume = volumnValue;

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11, 19);

const handlePlayClick = (e) => {
    if(video.paused) {
        playBtnIcon.classList = "fas fa-pause"
        video.play();

    } else {
        playBtnIcon.classList = "fas fa-play"
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMuteClick = (e) => {
    if(video.muted) {
        video.muted = false;
    }else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ?  "fas fa-volume-mute" : "fas fa-volume-down";
    volumnRange.value = video.muted ? 0 : volumnValue;
}

const handleVolumnChange = (e) => {
    const { target: {value}} = e;

    if(video.muted) {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-down";
    } 
    volumnValue = value;
    video.volume = value;
}

const handleLoadedMetadata = (e) => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (e) => {
    const { target: {value}} = e;
    video.currentTime = value;
}

const handleFullScreen = (e) => {
    const fullscreen = document.fullscreenElement;

    if(fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => {
    videoControls.classList.remove("is_showing");
}

const handleMouseMove = (e) => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("is_showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = (e) => {
    controlsTimeout = setTimeout(hideControls, 3000)
}

const handleEnded = (e) => {
    const {videoid} = videoContainer.dataset;
    fetch(`/api/videos/${videoid}/view`, {
        method: "POST"
    });
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumnRange.addEventListener("input", handleVolumnChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded);