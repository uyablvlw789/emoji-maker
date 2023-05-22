import {
  canvas,
  showCurrentLayerInfo,
  showSelectionOnLayerInfoList,
} from "./index.js";

import { PRODUCTION_MODE } from "./config.js";

const canvasHistory = {
  state: [],
  currentStateIndex: -1,
  undoStatus: false,
  redoStatus: false,
  undoFinishedStatus: true,
  redoFinishedStatus: true,
};

export const updateHistory = () => {
  setCustomObjectBorders();
  document.querySelector("#to-json").classList.remove("disabled");
  if (canvasHistory.undoStatus === true || canvasHistory.redoStatus === true) {
    if (!PRODUCTION_MODE) {
      console.log(
        "Do not do anything, this got triggered automatically while the undo and redo actions were performed"
      );
    }
  } else {
    const jsonData = canvas.toJSON();
    const canvasAsJson = JSON.stringify(jsonData);

    // NOTE: This is to replace the canvasHistory when it gets rewritten 20180912:Alevale
    if (canvasHistory.currentStateIndex < canvasHistory.state.length - 1) {
      const indexToBeInserted = canvasHistory.currentStateIndex + 1;
      canvasHistory.state[indexToBeInserted] = canvasAsJson;
      const elementsToKeep = indexToBeInserted + 1;
      if (!PRODUCTION_MODE) {
        console.log(`History rewritten, preserved ${elementsToKeep} items`);
      }
      canvasHistory.state = canvasHistory.state.splice(0, elementsToKeep);

      // NOTE: This happens when there is a new item pushed to the canvasHistory (normal case) 20180912:Alevale
    } else {
      if (!PRODUCTION_MODE) {
        console.log("push to canvas History");
      }
      canvasHistory.state.push(canvasAsJson);
    }

    canvasHistory.currentStateIndex = canvasHistory.state.length - 1;
  }
};

export function undo() {
  if (canvasHistory.currentStateIndex - 1 === -1) {
    if (canvas.getObjects().length === 0) {
      document.querySelector("#to-json").classList.add("disabled");
    }
    if (!PRODUCTION_MODE) {
      console.log(
        "do not do anything anymore, you are going far to the past, before creation, there was nothing"
      );
    }
    return;
  }
  if (canvasHistory.undoFinishedStatus) {
    canvasHistory.undoFinishedStatus = false;
    canvasHistory.undoStatus = true;
    canvas.clear();
    canvas.loadFromJSON(
      canvasHistory.state[canvasHistory.currentStateIndex - 1],
      () => {
        setCustomObjectBorders();
        canvas.renderAll();
        canvasHistory.undoStatus = false;
        canvasHistory.currentStateIndex--;
        canvasHistory.undoFinishedStatus = true;

        if (canvas.getObjects().length !== 0) {
          document.querySelector("#to-json").classList.remove("disabled");
        }

        const oldText = canvas.getObjects().filter((object, i) => {
          return object.type === "i-text";
        });
        oldText.forEach((text) => {
          text.editable = false;
        });

        showCurrentLayerInfo();
        showSelectionOnLayerInfoList();
      }
    );
  }
}

export function redo() {
  if (canvasHistory.currentStateIndex + 1 === canvasHistory.state.length) {
    if (canvas.getObjects().length === 0) {
      document.querySelector("#to-json").classList.add("disabled");
    }
    if (!PRODUCTION_MODE) {
      console.log(
        "do not do anything anymore, you do not know what is after the present, do not mess with the future"
      );
    }
    return;
  }

  if (canvasHistory.redoFinishedStatus) {
    canvasHistory.redoFinishedStatus = false;
    canvasHistory.redoStatus = true;
    canvas.loadFromJSON(
      canvasHistory.state[canvasHistory.currentStateIndex + 1],
      () => {
        setCustomObjectBorders();
        canvas.renderAll();
        canvasHistory.redoStatus = false;
        canvasHistory.currentStateIndex++;
        canvasHistory.redoFinishedStatus = true;

        if (canvas.getObjects().length !== 0) {
          document.querySelector("#to-json").classList.remove("disabled");
        }

        showCurrentLayerInfo();
        showSelectionOnLayerInfoList();
      }
    );
  }
}

export function setCustomObjectBorders() {
  canvas.getObjects().forEach((object) => {
    object.set({
      borderColor: "#0c8ce9",
      cornerColor: "#0c8ce9",
      cornerSize: 10,
      transparentCorners: false,
    });
  });
}
