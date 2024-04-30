const video = document.getElementById('video') // gets video element
const div = document.getElementById('div') // gets div element that holds video elememt 

// gets the x and y coordinates of the video
const video_x = video.getBoundingClientRect().left; 
const video_y= video.getBoundingClientRect().top;

document.getElementById("xy-cord").innerHTML= video_x + ' x ' + video_y;

// loads all the faceapi models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]).then(startVideo)

// start the video and send error is cannot start
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

// when video starts follow
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    // document.body.append(canvas)
    div.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections)
        // if (detections.length > 0) {
        //     // Get the position of the first detected face
        //     const facePosition = detections[0].detection.box;
        //     // Update the position of the canvas relative to the videos
        //     // canvas.style.left = `${(facePosition.x+150)*-1}px`;
        //     // canvas.style.top = `${(facePosition.y)*-1}px`;
        //     facePosition.x = facePosition.x*-1;
        //     facePosition.y = facePosition.y*-1;
            
        // }

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
  })