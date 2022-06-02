import regeneratorRuntime from "regenerator-runtime";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from "regenerator-runtime";

const recorderVideo = document.querySelector(".recorder__video");
const recorderBtn = document.querySelector(".recorder__btn");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handelDownload = async () => {
  recorderBtn.innerText = "Transcoding...";
  recorderBtn.disabled = true;
  recorderBtn.removeEventListener("click", handelDownload);

  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "recording.mp4");
  downloadFile(thumbUrl, "thumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  recorderBtn.innerText = "Record Again";
  recorderBtn.disabled = false;
  recorderBtn.addEventListener("click", handelRecorderBtn);
};

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
    recorderBtn.addEventListener("click", handelDownload);
  };
};

recorderBtn.addEventListener("click", handelRecorderBtn);
