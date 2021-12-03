/*
Adapted from voice-change-o-matic
 */
import GameAPI from './GameAPI.js';
init1();
export default function init1() {
    let heading = document.querySelector('h1');
    //document.body.addEventListener('click', init);
    // ga.SetBulletSpeed(40);
    var ga = new GameAPI();
    ga.AllowCursorControlOnBomber(true);
    ga.StartGame();
    ga.SetBulletSpeed(50);
        heading.textContent = 'Voice-change-O-matic';
        // document.body.removeEventListener('click', init)

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }


        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {

                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }


        // set up forked web audio context, for multiple browsers
        // window. is needed otherwise Safari explodes

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // var voiceSelect = document.getElementById("voice");
        var source;
        var stream;

        // grab the mute button to use below

        var mute = document.querySelector('.mute');

        //set up the different audio nodes we will use for the app

        var analyser = audioCtx.createAnalyser();
        analyser.minDecibels = -100;
        analyser.maxDecibels = 100;
        analyser.smoothingTimeConstant = 0.85;

        var distortion = audioCtx.createWaveShaper();
        var gainNode = audioCtx.createGain();
        var biquadFilter = audioCtx.createBiquadFilter();
        var convolver = audioCtx.createConvolver();

        // distortion curve for the waveshaper, thanks to Kevin Ennis
        // http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

        // function makeDistortionCurve(amount) {
        //     var k = typeof amount === 'number' ? amount : 50,
        //         n_samples = 44100,
        //         curve = new Float32Array(n_samples),
        //         deg = Math.PI / 180,
        //         i = 0,
        //         x;
        //     for ( ; i < n_samples; ++i ) {
        //         x = i * 2 / n_samples - 1;
        //         curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        //     }
        //     return curve;
        // };

        // grab audio track via XHR for convolver node

        var soundSource;
        var ajaxRequest, HEIGHT, WIDTH;
        ajaxRequest = new XMLHttpRequest();

        ajaxRequest.open('GET', 'https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg', true);

        ajaxRequest.responseType = 'arraybuffer';


        ajaxRequest.onload = function () {
            var audioData = ajaxRequest.response;

            audioCtx.decodeAudioData(audioData, function (buffer) {
                soundSource = audioCtx.createBufferSource();
                convolver.buffer = buffer;
            }, function (e) {
                console.log("Error with decoding audio data" + e.err);
            });

            //soundSource.connect(audioCtx.destination);
            //soundSource.loop = true;
            //soundSource.start();
        };

        ajaxRequest.send();

        // set up canvas context for visualizer

        var canvas = document.querySelector('.visualizer');
        var canvasCtx = canvas.getContext("2d");


        var visualSelect = document.getElementById("visual");

        var drawVisual;

        //main block for doing the audio recording
        if (navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            var constraints = {audio: true}
            navigator.mediaDevices.getUserMedia(constraints)
                .then(
                    function (stream) {
                        source = audioCtx.createMediaStreamSource(stream);
                        source.connect(distortion);
                        distortion.connect(biquadFilter);
                        biquadFilter.connect(gainNode);
                        convolver.connect(gainNode);
                        gainNode.connect(analyser);
                        analyser.connect(audioCtx.destination);

                        visualize();
                    })
                .catch(function (err) {
                    console.log('The following gUM error occured: ' + err);
                })
        } else {
            console.log('getUserMedia not supported on your browser!');
        }

        function visualize() {
            WIDTH = canvas.width;
            HEIGHT = canvas.height;


            var visualSetting = visualSelect.value;
            console.log(visualSetting);

            if (visualSetting === "sinewave") {
                analyser.fftSize = 2048;
                var bufferLength = analyser.fftSize;
                console.log(bufferLength);
                var dataArray = new Uint8Array(bufferLength);

                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

                var draw = function () {

                    drawVisual = requestAnimationFrame(draw);

                    analyser.getByteTimeDomainData(dataArray);

                    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                    canvasCtx.lineWidth = 2;
                    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                    canvasCtx.beginPath();

                    var sliceWidth = WIDTH * 1.0 / bufferLength;
                    var x = 0;
                    var isFiring = false;

                    for (var i = 0; i < bufferLength; i++) {
                        // console.log(dataArray[i]);
                        if (dataArray[i] > 100){
                            //alert("Exceeds Minimum, value is: " + dataArray[i]);
                            if (!isFiring) {
                                console.log('In audio sinewave: ga.startfire()')
                                ga.StartFire();
                                isFiring = true;
                            }
                            //please invoke the function to start the plane.
                            //will also invoke the function to adjust the speed according to sound level.
                            // console.log("The value of finalSpeed is : "+finalSpeed);
                            var finalSpeed = adjustSpeedbySoundLevel(dataArray[i]);
                            console.log("finalSpeed is "+finalSpeed);
                            ga.SetBulletSpeed(100);
                         } else {
                                // ga.CeaseFire();
                            isFiring = false;
                        }
                        var v = dataArray[i] / 128.0;
                        var y = v * HEIGHT / 2;

                        if (i === 0) {
                            canvasCtx.moveTo(x, y);
                        } else {
                            canvasCtx.lineTo(x, y);
                        }

                        x += sliceWidth;
                    }

                    canvasCtx.lineTo(canvas.width, canvas.height / 2);
                    canvasCtx.stroke();
                };

                draw();


            } else if (visualSetting == "frequencybars") {
                analyser.fftSize = 256;
                var bufferLengthAlt = analyser.frequencyBinCount;
                console.log(bufferLengthAlt);
                var dataArrayAlt = new Uint8Array(bufferLengthAlt);
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

                var drawAlt = function () {
                    drawVisual = requestAnimationFrame(drawAlt);

                    analyser.getByteFrequencyData(dataArrayAlt);

                    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                    var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
                    var barHeight;
                    var x = 0;
                    var isFiring2 = false;
                    for (var j = 0; j < bufferLengthAlt; j++) {
                        // console.log("Frequency test: " + dataArrayAlt[j]);
                        if (dataArrayAlt[j] > -5){
                            //alert("Exceeds Minimum, value is: " + dataArray[i]);
                            if (!isFiring2) {
                                console.log('In audio frequency bars: ga.startfire()')
                                ga.StartFire();
                                isFiring2 = true;
                            }
                            //please invoke the function to start the plane.
                            //will also invoke the function to adjust the speed according to sound level.
                            var finalSpeed1 = adjustSpeedbySoundLevel2(dataArrayAlt[j]);
                            ga.SetBulletSpeed(finalSpeed1);
                        } else {
                            ga.CeaseFire();
                            isFiring2 = false;
                        }
                        barHeight = dataArrayAlt[j];

                        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                        x += barWidth + 1;
                    }
                };

                drawAlt();

            } else if (visualSetting == "off") {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.fillStyle = "red";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            }

        }

        //function used to change the speed of the plane according to the level of sound.
        //A function is defined for the relationship between plane speed and plane

        function adjustSpeedbySoundLevel(soundLevel) {

            //assume relation between speed and soundLevel is speed = k(soundLevel-128) where k = 5.

            return 3 * (soundLevel - 110);
        }

        function adjustSpeedbySoundLevel2(soundLevel) {
            return 5 * (soundLevel + 10);
        }

        // event listeners to change visualize and voice settings

        visualSelect.onchange = function () {
            window.cancelAnimationFrame(drawVisual);
            visualize();
        };

        // voiceSelect.onchange = function() {
        //     voiceChange();
        // };
        //
        // mute.onclick = voiceMute;
        //
        // function voiceMute() {
        //     if (mute.id === "") {
        //         gainNode.gain.value = 0;
        //         mute.id = "activated";
        //         mute.innerHTML = "Unmute";
        //     } else {
        //         gainNode.gain.value = 1;
        //         mute.id = "";
        //         mute.innerHTML = "Mute";
        //     }
        // }


}

// module.exports= MyTestCase;


