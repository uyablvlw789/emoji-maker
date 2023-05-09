import LazyLoad from "vanilla-lazyload";

const html = String.raw;

const buttonTemplate = function (category, index) {
  return html` <button
    class="shape p-2 radius_1 mb_half border_none bg_silver mr_1"
    data-name="${category}-${index}"
  >
    <img
      class="lazy"
      src="./translate-loading.svg"
      data-src="./assets/${category}/${category}-${index}.svg"
      alt="${category}-${index}"
    />
  </button>`;
};

export function renderAssetMenu(positionData, iconsData) {
  const icons = iconsData;

  const categories = Object.keys(positionData);

  categories.forEach((category, i) => {
    const secondaryMenu = document.querySelector(".secondary-menu");

    secondaryMenu.insertAdjacentHTML(
      "beforeend",
      html` <div
        data-label="${category}"
        class="secondary-tab ${i === 0 && "active"} p-ss radius_1"
      >
        ${icons[category]}
      </div>`
    );

    const positions = positionData[category];

    const renderedButtons = positions.reduce((acc, cur, index) => {
      return acc + buttonTemplate(category, index);
    }, "");

    secondaryMenu.insertAdjacentHTML(
      "afterend",
      html` <div data-label="${category}" class="secondary-tab-content ${i === 0 && "active"} ">
        ${renderedButtons}
      </div>`
    );
  });
  const lazyContent = new LazyLoad();

  const secondaryTabs = document.querySelectorAll(".secondary-tab");

  const secondaryTabContents = document.querySelectorAll(".secondary-tab-content");
  secondaryTabs.forEach(function (secondaryTab) {
    secondaryTab.addEventListener("click", () => {
      secondaryTabs.forEach((secondaryTab) => {
        secondaryTab.classList.remove("active");
      });

      secondaryTabContents.forEach((secondaryTabContent) => {
        secondaryTabContent.classList.remove("active");
        if (secondaryTabContent.dataset.label === secondaryTab.dataset.label) {
          secondaryTabContent.classList.add("active");
        }
      });
      secondaryTab.classList.add("active");
    });
  });
}
