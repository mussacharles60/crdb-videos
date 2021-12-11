//const scanner = document.getElementById("scanner");
const registrations_page = document.getElementById('registration-page');
const videos_page = document.getElementById('videos-page');
const next_button = document.getElementById('next-button');
const output_dialog = document.getElementById('output_dialog');
const output_name = document.getElementById('output_name');

// const video = document.getElementById("video");
// const canvasElement = document.getElementById("canvas");
// const canvas = canvasElement.getContext("2d");
// const loadingMessage = document.getElementById("loadingMessage");
// const outputContainer = document.getElementById("output");
// const outputMessage = document.getElementById("outputMessage");
// const outputData = document.getElementById("outputData");

// video.style.display = "block";
// canvasElement.style.display = "none";

registrations_page.style.display = "block";
videos_page.style.display = "none";
next_button.style.display = "none";
output_dialog.style.display = "none";
output_name.innerText = "";

var wasScannerInitialized = false;

var _name = '';
var _email = '';
var _phone = '';

var stage = 0;

function onRegisterClick() {
    var $name_field = $('input[name="the-name"]')
    var $email_field = $('input[name="the-email"]')
    var $phone_field = $('input[name="the-phone"]')

    // console.log('_name: ', $name_field.val())
    // console.log('_email: ', $email_field.val())
    // console.log('_phone: ', $phone_field.val())

    if ($name_field.val().length > 0 && $email_field.val().length > 0 && $phone_field.val().length) {
        _name = $name_field.val();
        _email = $email_field.val();
        _phone = $phone_field.val();

        registrations_page.style.display = "none";
        videos_page.style.display = "block";
        //initScanner();
        stage = 1;
        playNextVideo();
    } else {
        alert('Please provide required information to continue')
    }
}

// function initScanner() {
//     if (wasScannerInitialized) {
//         return;
//     }
//     wasScannerInitialized = true;
//     // Use facingMode: environment to attemt to get the front camera on phones
//     navigator.mediaDevices.getUserMedia({
//         audio: false,
//         video: {
//             facingMode: "environment"
//         }
//     }).then(function(stream) {
//         video.srcObject = stream;
//         video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
//         video.play();
//         requestAnimationFrame(tick);
//     }).catch(function(error) {
//         console.error("Something went wrong!", error);
//     });
// }

// function tick() {
//     loadingMessage.innerText = "⌛ Loading video..."
//     if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         loadingMessage.hidden = true;
//         canvasElement.hidden = false;
//         outputContainer.hidden = false;

//         canvasElement.height = video.videoHeight;
//         canvasElement.width = video.videoWidth;
//         canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
//         var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
//         var code = jsQR(imageData.data, imageData.width, imageData.height, {
//             inversionAttempts: "dontInvert",
//         });
//         if (code) {
//             drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
//             drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
//             drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
//             drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
//             outputMessage.hidden = true;
//             outputData.parentElement.hidden = false;
//             outputData.innerText = code.data;
//             video.style.display = "none";
//             canvasElement.style.display = "block";
//             if (code.data.length > 0) {
//                 // if (!isUpdating) {
//                 //     updateData(code.data);
//                 // }
//             }
//         } else {
//             outputMessage.hidden = false;
//             outputData.parentElement.hidden = true;
//             video.style.display = "block";
//             canvasElement.style.display = "none";
//         }
//     }
//     requestAnimationFrame(tick);
// }

// function drawLine(begin, end, color) {
//     canvas.beginPath();
//     canvas.moveTo(begin.x, begin.y);
//     canvas.lineTo(end.x, end.y);
//     canvas.lineWidth = 4;
//     canvas.strokeStyle = color;
//     canvas.stroke();
// }

// audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// const volume = 1;
// const duration = 250;
// const frequency = 2310;
// const type = 'sawtooth';

// var isUpdating = false;
// const output_dialog = document.getElementById('output_dialog');
// output_dialog.style.display = "none";
// const output_name = document.getElementById('name');

// function beep() {
//     var oscillator = audioCtx.createOscillator();
//     var gainNode = audioCtx.createGain();

//     oscillator.connect(gainNode);
//     gainNode.connect(audioCtx.destination);

//     gainNode.gain.value = volume;
//     oscillator.frequency.value = frequency;
//     oscillator.type = type;

//     oscillator.start();

//     setTimeout(
//         function() {
//             oscillator.stop();
//         },
//         duration
//     );
// };

function playNextVideo() {
    next_button.style.display = "none";
    next_button.innerText = stage < 3 ? "Next" : "Finish";
    var video = document.getElementById("video");
    video.src = "/videos/assets/video_" + stage + ".mp4";
    video.play();

    video.addEventListener('ended', myHandler, false);

    function myHandler(e) {
        video.removeEventListener('ended', myHandler, false);
        next_button.style.display = "flex";
    }
}

next_button.addEventListener('click', function() {
    stage++;
    next_button.innerText = stage < 3 ? "Next" : "Finish";
    if (stage > 3) {
        //stage = 0;
        submitData();
    } else {
        playNextVideo();
    }
});


function submitData() {

    const host = "https://crdb.imperialinnovations.co.tz/videos/add.php";

    const request = {
        name: _name,
        email: _email,
        phone: _phone,
    }

    try {
        axios({
                url: host,
                method: 'post',
                responseType: 'json',
                data: request,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'cache-control': 'no-cache',
                    // 'pragma': 'no-cache'
                }
            })
            .then((result) => {
                console.log("server: response: ", result.data);
                if (result.data && result.data.success) {
                    output_dialog.style.display = "flex";
                    if (result.data.success.name) {
                        const name = result.data.success.name;
                        output_name.innerText = name;
                    }
                }
            })
            .catch((err) => {
                console.error("> axios error: ", err.message);
            })
            .catch((thrown) => {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                } else {
                    console.error("> axios error: ", thrown);
                }
            });

    } catch (e) {
        console.error(e);
    }
}