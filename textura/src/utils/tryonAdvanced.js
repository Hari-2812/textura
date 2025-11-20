// src/utils/tryonAdvanced.js
// Advanced offline try-on helper using MoveNet pose detector + BodyPix segmentation.
// Exports applyAdvancedTryOn(canvas, productImageSrc)
// - canvas: the canvas element that already contains the user's photo
// - productImageSrc: URL (or dataURL) of the shirt image (preferably PNG with transparent background)

import * as bodyPix from "@tensorflow-models/body-pix";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

/**
 * Load models (cached between calls)
 */
let bodyPixNet = null;
let poseDetector = null;
async function ensureModels() {
  if (!bodyPixNet) {
    bodyPixNet = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });
  }
  if (!poseDetector) {
    // Use MoveNet (lightning) if available
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
    poseDetector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
  }
}

/**
 * Helper: compute angle between two points (radians)
 */
function angleBetween(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * Helper: load image as HTMLImageElement (promise)
 */
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = src;
  });
}

/**
 * Main function
 */
export async function applyAdvancedTryOn(canvas, productImageSrc) {
  if (!canvas) throw new Error("Canvas is required");

  await ensureModels();

  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext("2d");

  // 1) Run pose detection on the canvas image (user photo)
  // poseDetector expects an ImageLike; canvas works
  const poses = await poseDetector.estimatePoses(canvas, { maxPoses: 1, flipHorizontal: false });
  if (!poses || poses.length === 0) {
    throw new Error("No person pose detected. Please upload a clear full-body photo.");
  }
  const pose = poses[0];

  // Find shoulders keypoints
  const leftShoulder = pose.keypoints.find(k => k.name === "left_shoulder" || k.part === "leftShoulder" || k.score && k.part === "leftShoulder");
  const rightShoulder = pose.keypoints.find(k => k.name === "right_shoulder" || k.part === "rightShoulder" || k.score && k.part === "rightShoulder");

  // fallback if names differ (MoveNet uses 'left_shoulder'/'right_shoulder')
  const L = leftShoulder || pose.keypoints[5] || null;
  const R = rightShoulder || pose.keypoints[6] || null;

  if (!L || !R || !L.x || !R.x) {
    throw new Error("Shoulder keypoints not found. Try a clearer, full-body front-facing photo.");
  }

  // 2) Compute position, angle and target size for the cloth
  const shoulderCenter = { x: (L.x + R.x) / 2, y: (L.y + R.y) / 2 };
  const dx = R.x - L.x;
  const dy = R.y - L.y;
  const shoulderDistance = Math.hypot(dx, dy);

  // angle for rotation (radians)
  const angle = Math.atan2(dy, dx); // rotate cloth by this

  // Cloth sizing: width proportional to shoulder distance
  const clothTargetWidth = shoulderDistance * 1.6; // tweak multiplier for desired fit
  const clothAspect = 1.2; // approximate height multiplier relative to width (adjust for t-shirts)
  const clothTargetHeight = clothTargetWidth * clothAspect;

  // 3) Run BodyPix segmentation to get a person mask
  const segmentation = await bodyPixNet.segmentPerson(canvas, {
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
  });

  // create mask data (Uint8ClampedArray) same size as canvas
  const maskData = segmentation.data; // 1 = person, 0 = background

  // 4) Load product (shirt) image
  const shirt = await loadImage(productImageSrc);

  // We'll create a temporary canvas to draw the transformed shirt
  const temp = document.createElement("canvas");
  temp.width = canvas.width;
  temp.height = canvas.height;
  const tctx = temp.getContext("2d");

  // Clear
  tctx.clearRect(0, 0, temp.width, temp.height);

  // draw transformed shirt centered at shoulderCenter
  tctx.save();
  tctx.translate(shoulderCenter.x, shoulderCenter.y);
  tctx.rotate(angle); // rotate
  // drawImage expects top-left origin; center the shirt
  tctx.drawImage(shirt, -clothTargetWidth / 2, -clothTargetHeight * 0.18, clothTargetWidth, clothTargetHeight);
  tctx.restore();

  // 5) Mask the shirt using body mask so shirt appears only where person exists (alpha mask)
  // Get imageData of shirt on temp
  const tempData = tctx.getImageData(0, 0, temp.width, temp.height);
  const tempPixels = tempData.data;

  // Iterate over pixels and multiply alpha by mask (maskData is 1 or 0)
  // maskData length = width*height, tempPixels length = width*height*4
  for (let i = 0, p = 0; i < maskData.length; i++, p += 4) {
    const maskVal = maskData[i]; // 1 or 0
    if (maskVal === 0) {
      // make pixel fully transparent
      tempPixels[p + 3] = 0;
    } else {
      // keep as is (optionally reduce alpha slightly for blending)
      // tempPixels[p + 3] = Math.min(255, tempPixels[p + 3]); // unchanged
    }
  }
  // put modified pixels back
  tctx.putImageData(tempData, 0, 0);

  // 6) Composite: draw the original photo (already present), then draw masked shirt on top
  // We will draw shirt with slight soft-edge using globalAlpha and a shadow for realism
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  // optional: slight shadow under shirt for depth
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 18;
  ctx.drawImage(temp, 0, 0);
  ctx.restore();

  // Done — canvas now contains the result
  return true;
}
