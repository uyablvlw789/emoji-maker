export default function (canvas) {
  const svgRotateIcon = encodeURIComponent(`
  <svg width="258" height="258" viewBox="0 0 258 258" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="125.5" cy="122.5" rx="114.5" ry="115.5" fill="white"/>
  <g clip-path="url(#clip0_1_9)">
  <path d="M122.688 27.8449C124.565 25.9897 127.371 25.5032 129.735 26.4459C132.17 27.4695 133.809 29.8478 133.721 32.5016L133.686 51.106C153.36 51.795 172.702 59.9465 186.768 74.1764C216.971 104.732 216.684 154.286 186.129 184.489C155.578 214.688 106.024 214.401 75.8207 183.846C59.4716 167.307 51.3471 144.493 53.6365 121.381C53.8593 119.729 55.2305 118.374 56.8789 118.456L76.6334 118.498C77.566 118.575 78.4241 119.015 79.0639 119.662C79.6388 120.381 79.9913 121.32 79.8416 122.18C77.6648 138.327 82.9627 154.082 94.3139 165.566C114.449 185.936 147.483 186.127 167.849 165.996C188.219 145.86 188.41 112.827 168.275 92.4567C158.923 82.9957 146.458 77.6108 133.463 77.0288L133.349 96.8473C133.406 99.51 131.739 101.869 129.361 102.788C126.918 103.78 124.118 103.261 122.263 101.384L90.2761 69.0248C87.7772 66.4968 87.8013 62.3304 90.3294 59.8314L122.688 27.8449Z" fill="#1296DB"/>
  </g>
  <defs>
  <clipPath id="clip0_1_9">
  <rect width="182" height="182" fill="white" transform="matrix(-0.703 -0.71119 -0.71119 0.703 257.691 129.745)"/>
  </clipPath>
  </defs>
  </svg>  
  `);

  const rotateIcon = `data:image/svg+xml;utf8,${svgRotateIcon}`;

  const imgIcon = document.createElement("img");
  imgIcon.src = rotateIcon;

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  const originalControl = fabric.Object.prototype.controls.mtr;
  fabric.Object.prototype.controls.mtr1 = new fabric.Control({
    x: 0.5,
    y: 0.5,
    render: renderIcon,
    actionHandler: originalControl.actionHandler,
    actionName: "rotate",
    cornerSize: 24,
    cursorStyle: "crosshair",
  });
  fabric.Object.prototype.controls.mtr.visible = false;
}
