const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]).then(startVideo)


function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)

    canvas.style.position = 'absolute'; // Set the position to absolute to control its position explicitly
    canvas.style.top = `80px`; // Set the new Y-coordinate
    canvas.style.left = `360px`; // Set the new X-coordinate
    
    document.body.append(canvas)
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