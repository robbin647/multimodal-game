import {GameAPI} from './GameAPI.js';


function Audio() {
    const TimeDomainFFTSize = 2048;
    const FrequencyDomainFFTSize = 256;
    var TimeDomainFFTResult = new Uint8Array(TimeDomainFFTSize);
    function VolDataKeeper(){
        this.Size= 1024;
        this.Data = new Uint8Array(this.Size);
        this.Index = 0;
        this.Push = (function(value){
            this.Index = this.Index % this.Size;
            this.Data[this.Index] = value;
            this.Index++;
        });
        // this.Write = (function(i, value){
        //     this.Data[i] = value;
        // }).bind(this);
        this.Read = (function(i){
            return this.Data[i];
        }).bind(this);
    }
    const VolumeDataKeeper =  new VolDataKeeper();
    var IsBomberFiring = false;

    var drawVisual = null; // animation frame in which to draw sinewave or frequencybars

    var visualSetting = document.getElementById("visual").value;
    // document.getElementById("visual").addEventListener("change", (e)=>{
    //     visualSetting = e.target.value;
    //     if (drawVisual != null){
    //         window.cancelAnimationFrame(drawVisual);
    //     }
    //     console.log("Using visualSetting: ", visualSetting);
    //     // rerun visualize()
    //     Init.visualize();
    // });

    

    /**
     * Set up the user audio stream and start analyze it
     * No param required
     */
    function Init(){
        let heading = document.querySelector('h1');
        heading.textContent = 'Voice-change-O-matic';

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
                return new Promise(function(resolve, reject){
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }

        // set up forked web audio context, for multiple browsers
        // window. is needed otherwise Safari explodes
        // sample rate: 16000Hz ; Good enough, see https://en.wikipedia.org/wiki/Sampling_(signal_processing)
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 16000,});
        var listenAudioCtx = document.addEventListener("click", (()=>{
            audioCtx.resume();
            document.removeEventListener("click",listenAudioCtx );
        }).bind(this));

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

        var soundSource;
        var HEIGHT, WIDTH;

        // set up canvas context for visualizer

        var canvas = document.querySelector('.visualizer');
        var canvasCtx = canvas.getContext("2d");

        //main block for doing the audio recording
        if (navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia supported.');
            var constraints = {audio: true}
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                    source = audioCtx.createMediaStreamSource(stream);
                    source.connect(distortion);
                    distortion.connect(biquadFilter);
                    biquadFilter.connect(gainNode);
                    convolver.connect(gainNode);
                    gainNode.connect(analyser);
                    analyser.connect(audioCtx.destination);

                    visualize();  /* MAIN ENTRY */   
                })
                .catch(function (err) {
                    console.log('The following gUM error occured: ' + err);
                    console.log(err.stacktrace);
                })
        } else {
            console.log('getUserMedia not supported on your browser!');
        }

        this.visualize = visualize.bind(this);
        function visualize() {
            WIDTH = canvas.width;
            HEIGHT = canvas.height;
            
            var DrawSinewave = function() {
                analyser.fftSize = TimeDomainFFTSize;
                var bufferLength = analyser.fftSize;
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

                drawVisual = requestAnimationFrame(DrawSinewave);
                
                analyser.getByteTimeDomainData(TimeDomainFFTResult);

                // Copy data from '''TimeDomainFFTResult''' to the VolumeDataKeeper array
                ReadVolume();

                canvasCtx.fillStyle = 'rgb(200, 200, 200)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.lineWidth = 2;
                canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

                canvasCtx.beginPath();

                var sliceWidth = WIDTH * 1.0 / bufferLength;
                var x = 0;
                
                //var isFiring = false;
                
                for (var i = 0; i < bufferLength; i++) {
                    // if (TimeDomainFFTResult[i] > 128){
                    //     if (!isFiring) {
                    //         console.log('In audio sinewave: GameAPI.startfire()')
                    //         GameAPI.StartFire();
        
                    //         isFiring = true;
                    //     }
                    //     //please invoke the function to start the plane.
                    //     //will also invoke the function to adjust the speed according to sound level.
                    //     // console.log("The value of finalSpeed is : "+finalSpeed);
                    //     var finalSpeed = adjustSpeedbySoundLevel(TimeDomainFFTResult[i]);
                    //     //console.log("finalSpeed is "+finalSpeed);
                    //     GameAPI.SetBulletSpeed(finalSpeed);
                    // } 
                    // else {
                    //     GameAPI.CeaseFire();
                    //     isFiring = false;
                    // }
                    var v = TimeDomainFFTResult[i] / 128.0;
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

            // draw graph differently based on the select box value
            if (visualSetting === "sinewave") {
                DrawSinewave();
            } 
            else if (visualSetting == "frequencybars") {
                analyser.fftSize = FrequencyDomainFFTSize;
                var bufferLengthAlt = analyser.frequencyBinCount;
                var dataArrayAlt = new Uint8Array(bufferLengthAlt);
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            
                var drawAlt = function () {
                    drawVisual = requestAnimationFrame(drawAlt);
                
                    analyser.getByteFrequencyData(dataArrayAlt);
                    analyser.getByteTimeDomainData(TimeDomainFFTResult);
                    ReadVolume();

                    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
                
                    var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
                    var barHeight;
                    var x = 0;
                    //var isFiring2 = false;
                    for (var j = 0; j < bufferLengthAlt; j++) {
                        // console.log("Frequency test: " + dataArrayAlt[j]);
                        // if (dataArrayAlt[j] > 0){
                        //     //alert("Exceeds Minimum, value is: " + TimeDomainFFTResult[i]);
                        // if (!isFiring2) {
                        //         console.log('In audio frequency bars: GameAPI.startfire()')
                        //         GameAPI.StartFire();
                        //         isFiring2 = true;
                        //     }
                        //     //please invoke the function to start the plane.
                        //     //will also invoke the function to adjust the speed according to sound level.
                        //     var finalSpeed1 = adjustSpeedbySoundLevel2(dataArrayAlt[j]);
                        //     GameAPI.SetBulletSpeed(finalSpeed1);
                        // } else {
                        //     GameAPI.CeaseFire();
                        //     isFiring2 = false;
                        // }
                        barHeight = dataArrayAlt[j];
                
                        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
                        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
                
                        x += barWidth + 1;
                    }
                };
            
                drawAlt();
            } 
            else if (visualSetting == "off") {
                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
                canvasCtx.fillStyle = "red";
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            }
        }

        
        // Set up an event listeners to change visualize and voice settings

        document.getElementById("visual").addEventListener("change", (function(e){
            visualSetting = e.target.value;
            window.cancelAnimationFrame(drawVisual);
            visualize();
            console.log("Using visualSetting: ", visualSetting);
        }).bind(this));
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
    
    /**
     * Read certain amount of samples from ```TimeDomainFFTResult``` array and 
     *   feed these samples into array ```VolumeDataKeeper```, executed every ```ExtInterval```
     *   millisecond
     */
    function ReadVolume(){
        if (visualSetting === 'sinewave'){
            for (let i = 0; i < 512; i++){
                VolumeDataKeeper.Push(TimeDomainFFTResult[i]);
            }
        } else { //this.visualSettings === 'frequencybars'
            for (let i = 0; i < 128; i++){
                VolumeDataKeeper.Push(TimeDomainFFTResult[i]);
            }
        }

    }

    function NormalizeBomberSpeed(soundValue){
        return (10 + (soundValue - 110) * 2);
    }

    var CommandTicker = 0;
    var CommanderTimer = null;
    /**
     * Main logic for enable/disable bullets and set bullet speed
     * No param required
     */
    function Commander(){

        // Every each 5 ticks (i.e. 500ms) set bullet speed again 
        CommandTicker = (CommandTicker + 10) % 51;

        // silly, only look at single middle value among 1024 elements 
        var critical = (visualSetting === 'sinewave') ? VolumeDataKeeper.Read(511) : VolumeDataKeeper.Read(63);

        if (critical > 128) {
            if (!IsBomberFiring){
                GameAPI.StartFire();
                IsBomberFiring = true;
            }
            if (CommandTicker >= 50){
                GameAPI.SetBulletSpeed(NormalizeBomberSpeed(critical));
            }
        } else {
            if (IsBomberFiring){
                GameAPI.CeaseFire();
                IsBomberFiring = false;
            }
        }

    }

    function StartBulletControl(){
        if (CommanderTimer != null ) window.clearInterval(CommanderTimer);
        CommanderTimer = window.setInterval(Commander,100);
    }

    function ClearBulletControl(){
        if (CommanderTimer != null ) window.clearInterval(CommanderTimer);
    }

    this.Init = Init.bind(this);
    this.StartBulletControl = StartBulletControl.bind(this);
    this.ClearBulletControl = ClearBulletControl.bind(this);
    
}


const AudioControl = new Audio();
export default AudioControl; 

