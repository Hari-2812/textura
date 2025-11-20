import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

export const applyTryOn = async (canvas, clothSrc) => {
  const net = await bodyPix.load();

  const ctx = canvas.getContext("2d");

  // Segment the person (detect body)
  const segmentation = await net.segmentPerson(canvas);

  // Draw original image
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);

  // Load clothing image
  const cloth = new Image();
  cloth.src = clothSrc;

  cloth.onload = () => {
    // Adjust overlay area (torso region)
    ctx.drawImage(
      cloth,
      canvas.width * 0.28,
      canvas.height * 0.18,
      canvas.width * 0.45,
      canvas.height * 0.45
    );
  };
};
