import { setLayerData, layerData, showCurrentLayerInfo } from "./index.js";
import { updateHistory } from "./undo.js";

export default function (canvas) {
  const path = "./assets";
  const topOffset = 50;
  const leftOffset = 50;
  const faceIndex = 0;
  const mouthIndex = 1;
  const eyesIndex = 0;
  const sweatIndex = 0;
  // Load face
  fabric.loadSVGFromURL(`${path}/face/face-${faceIndex}.svg`, function (face, options) {
    face = fabric.util.groupSVGElements(face, options);

    face.set({
      borderColor: "#0c8ce9",
      cornerColor: "#0c8ce9",
      cornerSize: 10,
      padding: 10,
      transparentCorners: false,
    });

    face.top = topOffset;
    face.left = leftOffset;

    canvas.add(face);
    canvas.renderAll();
    setLayerData(canvas.getObjects());

    showCurrentLayerInfo(layerData);
    updateHistory();
  });
}
