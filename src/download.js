import { PRODUCTION_MODE } from "./config.js";
import {
  canvas,
  setLayerData,
  showCurrentLayerInfo,
  showSelectionOnLayerInfoList,
} from "./index.js";
import loadSVGs from "./loadSVGs.js";
import { updateHistory } from "./undo.js";
import { setCustomObjectBorders } from "./undo.js";

function savePng(uri, name) {
  const link = document.createElement("a");

  link.download = name;

  link.href = uri;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function saveSvg(filedata, name = "my_svg") {
  const svgFile = new Blob([filedata], { type: "image/svg+xml;charset=utf-8" });

  const svgFileSrc = URL.createObjectURL(svgFile); //mylocfile);

  const dwn = document.createElement("a");

  dwn.href = svgFileSrc;

  dwn.download = name;

  document.body.appendChild(dwn);

  dwn.click();

  document.body.removeChild(dwn);
}

document.getElementById("to-png").addEventListener("click", () => {
  savePng(canvas.toDataURL(), "download");
});

document.getElementById("to-svg").addEventListener("click", () => {
  saveSvg(canvas.toSVG());
});

let jsonData;
var save_status = 2;
document
  .getElementById("to-json")
  .addEventListener("click", async function (e) {
    const _class = (
      "" +
      document.querySelector("#to-json").className +
      ""
    ).indexOf("disabled");
    if (_class > -1) {
      return false;
    }
    if (save_status < 2) {
      return false;
    }
    document.querySelector("#to-json .downloading").classList.remove("hide");

    let language_code = document.querySelector("html").getAttribute("lang");

    save_status = 1;
    jsonData = JSON.stringify({ data: canvas });
    if (!PRODUCTION_MODE) {
      console.log("[download.js] jsonData:", jsonData);
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    };

    fetch("/en/maker-save", requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let login_text, success_text, saved;
        if (PRODUCTION_MODE) {
          login_text = document.querySelector(".login_text").textContent;

          success_text = document.querySelector(".success_text")?.textContent;

          saved = document.querySelector(".saved")?.textContent;
        }

        const toJSONText = document.querySelector("#to-json")?.textContent;

        document.querySelector("#to-json .downloading")?.classList.add("hide");

        // disable download button
        document.querySelector("#to-json").classList.add("disabled");

        if (data.code == 1) {
          toast(login_text);
          // enable download button
          localStorage.setItem("maker_temp_id", data.data);

          window.location.href = "/" + language_code + "/login?cache=0";
        } else if (data.code == 200) {
          toast(success_text);
          document.querySelector("#to-json").textContent = saved;

          setTimeout(() => {
            document.querySelector("#to-json").textContent = toJSONText;
          }, 2000);
        } else {
          toast(data.msg);
        }
        save_status = 2;
      })
      .catch((err) => {
        // enable download button
        document.querySelector("#to-json").classList.remove("disabled");

        document.querySelector("#to-json .downloading").classList.add("hide");
        toast("error");
        save_status = 2;
      });
    return false;
  });

function toast(text) {
  document.querySelector(".toast-body p").textContent = text;
  document.querySelector(".toast").classList.remove("off");
  document.querySelector(".toast").classList.add("on");

  setTimeout(() => {
    document.querySelector(".toast-body p").textContent = "";
    document.querySelector(".toast").classList.remove("on");
    document.querySelector(".toast").classList.add("off");
  }, 2000);
}

function renderCanvasFromJson(jsonData) {
  canvas.clear();
  canvas.loadFromJSON(jsonData, () => {
    canvas.renderAll();
    setCustomObjectBorders();

    setLayerData();
    showCurrentLayerInfo();
    showSelectionOnLayerInfoList();
    updateHistory();
  });
}

export async function readData(id, date, temp = false) {
  let makerUrl;
  if (temp) {
    makerUrl = `/maker/temp/temp-${temp}-data.json`;
  } else {
    makerUrl = `/maker/${date}/maker-${id}-data.json`;
  }

  return fetch(makerUrl)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("file not found");
      }
      return res.json();
    })
    .then((data) => {
      renderCanvasFromJson(data);
    })
    .catch((err) => {
      loadSVGs(canvas);
    });
}

// readData();
