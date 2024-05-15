const video = document.getElementById('video') // gets video element
const image = document.getElementById('imageUpload') // gets video element
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
    const canvas = faceapi.createCanvasFromMedia(video) // creates a canvas
    div.append(canvas) // adds canvs to the div with the video
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        // console.log(resizedDetections)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // clears the rect
        // draws the fact detection
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
  })