# Dependencies

```
"@mediapipe/tasks-vision": "^0.10.14",
```

```tsx
useEffect(() => {
  const loadModels = async (): Promise<void> => {
    const vision = await FilesetResolver.forVisionTasks("/model");
    const faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/model/blaze_face_short_range.tflite",
      },
      runningMode: "IMAGE",
    });
    setFaceDetector(faceDetectorInstance);
  };
  await loadModels();
});
```

```tsx
<Webcam audio={false} height={"100%"} ref={videoPlayerRef} />
```

```tsx
const canvasRef = useRef<any>();
const videoPlayerRef = useRef<any>();
const canvas = canvasRef.current;
const imageSrc = videoPlayerRef?.current?.getScreenshot();
const image = new Image();
image.src = imageSrc;
image.onload = async () => {
  const imgCanvas = document.createElement("canvas");
  imgCanvas.width = canvas.width;
  imgCanvas.height = canvas.height;
  const ctx: any = imgCanvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageBitmap = await createImageBitmap(imgCanvas);

  let detections = await faceDetector.detect(imageBitmap, performance.now());
  detections = detections?.detections;
};
```
