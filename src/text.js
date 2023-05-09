import { canvas } from "./index.js";
import { updateHistory } from "./undo.js";
import {
  layerData,
  setLayerData,
  showCurrentLayerInfo,
  showSelectionOnLayerInfoList,
} from "./index.js";

let text = "";

const addTextToCanvas = document.querySelector("#add-text-to-canvas");

export let color = "#000";

const textColor = document.querySelector("#text-color");

if (document.querySelector('label[for="text-color"]')) {
  document.querySelector('label[for="text-color"]').style = `border:1px solid ${color}`;
}

export let textToAdd;

textColor.addEventListener("input", (e) => {
  [textToAdd] = canvas.getObjects().filter((object) => object.type === "i-text");

  textColor.style = "border:1px solid black";
  color = e.target.value;
  document.querySelector('label[for="text-color"]').style = `border:1px solid ${color}`;

  if (textToAdd) {
    textColor.style.border = `1px solid ${color}`;

    textToAdd.set({ fill: color });
    canvas.renderAll();
    setLayerData(canvas.getObjects());

    showCurrentLayerInfo(layerData);
    showSelectionOnLayerInfoList();
    updateHistory();
  }
});

addTextToCanvas.addEventListener("click", () => {
  document.querySelector("#text-active-icon").classList.remove("hide");

  textToAdd = new fabric.IText(" ", {
    fontSize: 24,
    padding: 6,
    fontFamily: "Helvetica",
    fill: color,
    strokeWidth: 3,
    top: 250,
    left: 100,
    onCanvasEditing: true,
    borderColor: "#0c8ce9",
    cornerColor: "#0c8ce9",
    cornerSize: 10,
    transparentCorners: false,
  });
  textToAdd.caching = false;

  canvas.add(textToAdd);
  textToAdd.enterEditing();

  canvas.on("text:changed", function (e) {
    canvas.renderAll();
    setLayerData(canvas.getObjects());

    showCurrentLayerInfo(layerData);
    showSelectionOnLayerInfoList();

    canvas.setActiveObject(textToAdd);
  });
});
