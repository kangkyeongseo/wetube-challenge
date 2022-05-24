const video = document.querySelector(".video__player");
const timeline = document.querySelector(".controller__timeline");
const timelineRange = timeline.querySelector("input");
const play = document.querySelector(".controller__play");
const playBtn = play.querySelector("i");
const volume = document.querySelector(".controller__volume");
const volumeBtn = volume.querySelector("i");
const volumeRange = volume.querySelector("input");
const timestamp = document.querySelector(".controller__timestamp");
const startTime = timestamp.querySelector(".timestamp__start");
const endTime = timestamp.querySelector(".timestamp__end");
const mode = document.querySelector(".controller__mode");
const modeBtn = mode.querySelector("i");

let volumeSize = 0.5;
video.volume = volumeSize;

const handleTimeUpdate = () => {
  timelineRange.value = video.currentTime;
  startTime.innerText = formatTime(timelineRange.value);
};

const formatTime = (time) => new Date(time * 1000).toISOString().substr(14, 5);

const handleLoadedData = () => {
  endTime.innerText = formatTime(Math.floor(video.duration));
  timelineRange.max = video.duration;
};

const handelTimelineRange = (event) => {
  video.currentTime = event.target.value;
};

const handlePlayBtn = () => {
  if (video.paused) {
    playBtn.className = "fas fa-pause";
    video.play();
  } else {
    playBtn.className = "fas fa-play";
    video.pause();
  }
};

const handleVolumeBtn = () => {
  if (video.muted) {
    volumeBtn.className = "fas fa-volume-up";
    video.muted = false;
    volumeRange.value = volumeSize;
  } else {
    volumeBtn.className = "fas fa-volume-mute";
    video.muted = true;
    volumeRange.value = 0;
  }
};

const handelVolumeRange = (event) => {
  const value = event.target.value;
  video.muted = false;
  video.volume = value;
  volumeSize = value;
};

const handelModeBtn = () => {
  if (!video.fullscreen) {
    video.requestFullscreen();
    modeBtn.className = "fas fa-compress";
  } else {
    video.exitFullscreen();
    modeBtn.className = "fas fa-expand";
  }
};

video.addEventListener("loadedmetadata", handleLoadedData);
video.addEventListener("timeupdate", handleTimeUpdate);
timelineRange.addEventListener("input", handelTimelineRange);
play.addEventListener("click", handlePlayBtn);
volumeBtn.addEventListener("click", handleVolumeBtn);
volumeRange.addEventListener("input", handelVolumeRange);
mode.addEventListener("click", handelModeBtn);
