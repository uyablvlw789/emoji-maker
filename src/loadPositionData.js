import loadSingleSVG from "./loadSingleSVG.js";
import { renderAssetMenu } from "./renderAssetMenu.js";

import { PRODUCTION_MODE } from "./config.js";

export const loadPositionData = async function (canvas) {
  const path = PRODUCTION_MODE
    ? "/sites/all/themes/emoji_2020/js/maker/"
    : "./";

  const [PositionDataRes, iconsRes] = await Promise.all([
    fetch(`${path}positionData.json`),
    fetch(`${path}icons.json`),
  ]);
  const [positionData, iconsData] = await Promise.all([
    PositionDataRes.json(),
    iconsRes.json(),
  ]);

  renderAssetMenu(positionData, iconsData);

  // attach event listeners to each button
  const buttons = document.querySelectorAll("button.shape");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      loadSingleSVG(this.dataset.name, canvas, positionData);
    });
  });
};
