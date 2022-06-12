const videoBox = document.querySelector(".video__box");
const video = document.querySelector(".video__player");
const controller = document.querySelector(".video__controller");
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

let controlsTimeout = null;
let controlsMovementTimeout = null;
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
  if (document.fullscreenElement === null) {
    videoBox.requestFullscreen();
    modeBtn.className = "fas fa-compress";
  } else {
    document.exitFullscreen();
    modeBtn.className = "fas fa-expand";
  }
};

const removeShowing = () => {
  controller.classList.remove("showing");
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controller.classList.add("showing");
  controlsMovementTimeout = setTimeout(removeShowing, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(removeShowing, 3000);
};

const handelKeyDown = (event) => {
  const { code } = event;
  console.log(event.target.localName);
  if (event.target.localName === "textarea") {
    return;
  }
  if (code === "Space") {
    handlePlayBtn();
  }
  if (code === "KeyF" && document.fullscreenElement === null) {
    videoBox.requestFullscreen();
    modeBtn.className = "fas fa-compress";
  }
  if (code === "Escape" && document.fullscreenElement !== null) {
    document.exitFullscreen();
    modeBtn.className = "fas fa-expand";
  }
};

const handelEndVideo = () => {
  const { id } = videoBox.dataset;
  console.log(id);
  fetch(`/api/video/${id}/view`, {
    method: "POST",
  });
};

video.addEventListener("loadedmetadata", handleLoadedData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayBtn);
video.addEventListener("ended", handelEndVideo);
timelineRange.addEventListener("input", handelTimelineRange);
play.addEventListener("click", handlePlayBtn);
volumeBtn.addEventListener("click", handleVolumeBtn);
volumeRange.addEventListener("input", handelVolumeRange);
mode.addEventListener("click", handelModeBtn);
videoBox.addEventListener("mousemove", handleMouseMove);
videoBox.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handelKeyDown);
