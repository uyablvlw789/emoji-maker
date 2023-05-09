export default {
  setBackgroundImages(url, canvas) {
    fabric.Image.fromURL(url, (img) => {
      canvas.setBackgroundImage(img);
      canvas.renderAll();
    });
  },
};
