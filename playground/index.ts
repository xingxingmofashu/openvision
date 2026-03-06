import { ObjectDetector } from '../packages/openvision/src/index'

/**
 * Detect objects in still images on click
 */
async function handleClick(event: any) {
  return await ObjectDetector.detect({
    vision: {
      basePath: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
    },
    detector: {
      options: {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
          delegate: "GPU"
        },
        scoreThreshold: 0.5,
        runningMode: 'IMAGE'
      }
    },
    detect: {
      image: event.target
    }
  })
}


function displayImageDetections(
  result: ObjectDetector.ObjectDetectorResult,
  resultElement: HTMLImageElement
) {
  const ratio = resultElement.height / resultElement.naturalHeight;

  for (let detection of result.detections) {
    // Description text
    const p = document.createElement("p");
    p.setAttribute("class", "info");
    const highlighter = document.createElement("div");
    highlighter.setAttribute("class", "highlighter");


    if (detection.categories.length > 0) {
      const category = detection.categories.at(0)!
      p.innerText =
        category.categoryName +
        " - with " +
        Math.round(parseFloat(`${category.score}`) * 100) +
        "% confidence.";
    }

    // Positioned at the top left of the bounding box.
    // Height is whatever the text takes up.
    // Width subtracts text padding in CSS so fits perfectly.
    if (detection.boundingBox) {
      p.style =
        "left: " +
        detection.boundingBox?.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px; " +
        "width: " +
        (detection.boundingBox.width * ratio - 10) +
        "px;";

      highlighter.style =
        "left: " +
        detection.boundingBox.originX * ratio +
        "px;" +
        "top: " +
        detection.boundingBox.originY * ratio +
        "px;" +
        "width: " +
        detection.boundingBox.width * ratio +
        "px;" +
        "height: " +
        detection.boundingBox.height * ratio +
        "px;";

    }

    resultElement.parentNode?.appendChild(highlighter);
    resultElement.parentNode?.appendChild(p);
  }
}

window.onload = function () {
  const img = document.querySelector(".detectOnClick")?.querySelector('img')
  img?.addEventListener('click', async function (e) {
    const result = await handleClick(e)
    displayImageDetections(result, this)
  })
}