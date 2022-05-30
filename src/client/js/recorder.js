import regeneratorRuntime from "regenerator-runtime";
const recorderVideo = document.querySelector(".recorder__video");
const recorderBtn = document.querySelector(".recorder__btn");

let stream;
let recorder;
let videoFile;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 1280,
      height: 720,
    },
  });
  recorderVideo.srcObject = stream;
  recorderVideo.play();
};

init();

const handelRecorderBtn = () => {
  recorderBtn.innerText = "Recording...";
  recorderBtn.disabled = true;
  recorderBtn.removeEventListener("click", handelRecorderBtn);

  recorder = new MediaRecorder(stream);
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);

  recorder.ondataavailable = (evnet) => {
    videoFile = URL.createObjectURL(event.data);
    recorderVideo.srcObject = null;
    recorderVideo.src = videoFile;
    recorderVideo.loop = true;
    recorderVideo.play();
    recorderBtn.innerText = "Doweload Recording";
    recorderBtn.disabled = false;
  };
};

recorderBtn.addEventListener("click", handelRecorderBtn);
