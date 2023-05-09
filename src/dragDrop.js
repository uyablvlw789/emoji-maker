import {
  canvas,
  layerData,
  setActiveObjectOnCanvas,
  setLayerData,
  updateCanvas,
  deleteLayerByIndex,
} from "./index.js";

const container = document.querySelector("#layer-list");

const swap = function (nodeA, nodeB) {
  const parentA = nodeA.parentNode;
  const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

  // Move `nodeA` to before the `nodeB`
  nodeB.parentNode.insertBefore(nodeA, nodeB);

  // Move `nodeB` to before the sibling of `nodeA`
  parentA.insertBefore(nodeB, siblingA);
};

const handleDrop = (eventType) => {
  if (eventType === "touchend" && !isMoving) {
    return;
  }
  isMoving = false;
  const [textToAdd] = canvas.getObjects().filter((object) => {
    return object.type === "i-text";
  });

  if (textToAdd) {
    if (textToAdd.isEditing) {
      return;
    }
  }
  const draggables = document.querySelectorAll("#container li:not(.shadow)");
  const newOrder = [...draggables].reverse().map((draggable) => {
    return +draggable.dataset.index;
  });
  // set new state of layer data according to update order
  setLayerData(undefined, newOrder);
  updateCanvas(layerData);

  // reset order
  const listElements = document.querySelectorAll("#container li:not(.shadow)");

  [...listElements].reverse().forEach((element, index) => {
    element.dataset.index = index;
    element.querySelector("div div:nth-child(2)").textContent = `Layer ${
      [...listElements].length - index
    }`;
  });

  const selectedLayerIndex = document.querySelector("#container li.active")?.dataset.index;

  selectedLayerIndex && setActiveObjectOnCanvas(selectedLayerIndex);
};

const handleDragover = (e) => {
  e.preventDefault();

  const [textToAdd] = canvas.getObjects().filter((object) => {
    return object.type === "i-text";
  });

  if (textToAdd) {
    if (textToAdd.isEditing) {
      return;
    }
  }

  let targetY;
  if (e.type === "touchmove") {
    targetY = e.changedTouches[0].clientY;
  } else {
    targetY = e.clientY;
  }
  const afterElement = getDragAfterElement(container, targetY);

  const draggable = document.querySelector("#container .dragging");

  if (afterElement === null) {
    container.appendChild(draggable);
  } else {
    swap(draggable, afterElement);
  }
};

container.addEventListener("drop", () => handleDrop("drop"));
container.addEventListener("touchend", () => handleDrop("touchend"));

container.addEventListener("dragover", handleDragover);
container.addEventListener("touchmove", handleDragover);

export function makeListItemsDraggable() {
  const draggables = document.querySelectorAll("#container li");

  draggables.forEach((draggable) => {
    ["dragstart", "touchstart"].forEach((eventType) => {
      draggable.addEventListener(eventType, () => {
        const [textToAdd] = canvas.getObjects().filter((object) => {
          return object.type === "i-text";
        });

        if (textToAdd) {
          if (textToAdd.isEditing) {
            return;
          }
        }
        draggable.classList.add("dragging");
      });
    });

    ["dragend", "touchend"].forEach((eventType) => {
      draggable.addEventListener(eventType, () => {
        draggable.classList.remove("dragging");
      });
    });
  });
}

function getDragAfterElement(container, y) {
  // get reference to those elements not dragging
  const draggableElements = [...container.querySelectorAll("#container .draggable")];

  const ulHeight = document.querySelector("#container ul").getBoundingClientRect().y;
  const index = Math.floor((y - ulHeight) / 42);
  return draggableElements[index];
}

let draggingElement;
let draggingElementShadow;
let isTouching = false;
let touchingStartYPosition;
let touchingPosition;

let isMoving = false;

container.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (e.target.dataset.label === "delete") {
    const index = e.target.closest("li").dataset.index;
    deleteLayerByIndex(index);
    return;
  }

  isTouching = true;

  touchingStartYPosition = e.changedTouches[0].pageY;

  draggingElement = e.target.closest("li");

  draggingElementShadow = draggingElement.cloneNode(true);

  const draggingElementShadowInitialY = draggingElement.offsetTop;

  touchingPosition = draggingElementShadowInitialY;

  draggingElementShadow.id = "dragging-element-shadow";

  draggingElementShadow.style = `background: aliceblue; width:100%; opacity: 0.9; display: flex; justify-content: space-between; align-items: center; height:42px; position: absolute;top:${draggingElementShadowInitialY}px; left:0; z-index:1; }`;
  draggingElementShadow.classList.add("shadow");
  draggingElementShadow.classList.remove("draggable");

  container.append(draggingElementShadow);
});

container.addEventListener("touchmove", (e) => {
  isMoving = true;
  draggingElementShadow.style.top = `${
    touchingPosition + e.changedTouches[0].pageY - touchingStartYPosition
  }px`;
});

container.addEventListener("touchend", (e) => {
  e.preventDefault();

  isTouching = false;

  container.querySelector("#container #dragging-element-shadow")?.remove();
  touchingStartYPosition = null;
  touchingPosition = null;
});
