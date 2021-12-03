// This should be the main functions written by QIN

// call functions in faceDetection.js

setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);

let model, ctx, videoWidth, videoHeight, video, canvas;
let img;
const state = {
  backend: 'wasm'
};

async function setupCamera() {
  video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user'
    }
  });
  video.srcObject = stream;
  return new Promise(resolve => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

const renderPrediction = async () => {
  // stats.begin();
  const returnTensors = false;
  const flipHorizontal = true;
  const annotateBoxes = false;
  const predictions = await model.estimateFaces(video, returnTensors, flipHorizontal, annotateBoxes);

  if (predictions.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < predictions.length; i++) {
      if (returnTensors) {
        predictions[i].topLeft = predictions[i].topLeft.arraySync();
        predictions[i].bottomRight = predictions[i].bottomRight.arraySync();

        if (annotateBoxes) {
          predictions[i].landmarks = predictions[i].landmarks.arraySync();
        }
      }

      const xMul = 300/640;
      const yMul = 270/480;
      var start = predictions[i].topLeft;
      start[0] *= xMul;
      start[1] *= yMul;
      var end = predictions[i].bottomRight;
      end[0] *= xMul;
      end[1] *= yMul;
      const size = [end[0] - start[0], end[1] - start[1]];
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      const startX = start[0]+150;
      const startY = start[1];
      ctx.fillRect(startX, startY, size[0], size[1]);

      const centerX = startX+size[0]/2;
      const centerY = startY+size[1]/2;
      const rX = centerX/300, rY = centerY/270;
      // console.log(rX+", "+rY);
      // remains the same with GameAPI
      var oPlaneGame = document.getElementById("planeGame");
      var oMyPlane = document.getElementById("myPlane");
      let LeftValue = rX * (parseInt(window.getComputedStyle(oPlaneGame).width)
          - parseInt(window.getComputedStyle(oMyPlane).width)
      );
      let TopValue = rY  * (parseInt(window.getComputedStyle(oPlaneGame).height) 
          - parseInt(window.getComputedStyle(oMyPlane).height)
      );
      oMyPlane.style.left = LeftValue + 'px';
      oMyPlane.style.top = TopValue + 'px';
      // if (annotateBoxes) {
      //   const landmarks = predictions[i].landmarks;
      //   ctx.fillStyle = "blue";

      //   for (let j = 0; j < landmarks.length; j++) {
      //     const x = landmarks[j][0];
      //     const y = landmarks[j][1];
      //     ctx.fillRect(x, y, 5, 5);
      //   }
      // }
    }
  }

  // stats.end();
  requestAnimationFrame(renderPrediction);
};

const setupPage = async () => {
//   await tf.setBackend(state.backend);
  await tf.setBackend('wasm');
  await setupCamera();
  // img = document.getElementById('img');
  video.play();
  videoWidth = 300;
  videoHeight = 270;
  video.width = videoWidth;
  video.height = videoHeight;
  canvas = document.getElementById('output');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  // canvas.width = 400;
  // canvas.height = 300;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  model = await blazeface.load();
  renderPrediction();
};

setupPage();