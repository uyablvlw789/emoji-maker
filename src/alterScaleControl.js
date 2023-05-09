export default function (canvas) {
  const svgScaleIcon =
    encodeURIComponent(`<svg width="412" height="423" viewBox="0 0 412 423" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="206" cy="211.5" rx="206" ry="211.5" fill="#1296DB"/>
    <path d="M250.604 111.008L329 111V196.173H287.316V150.928L250.604 150.936V111.008ZM99 223.086H142.518L142.625 266.516H182V312H142.625H99.1066L99 223.086Z" fill="white"/>
    </svg>
    `);

  const scaleIcon = `data:image/svg+xml;utf8,${svgScaleIcon}`;

  const imgIcon = document.createElement("img");
  imgIcon.src = scaleIcon;

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  fabric.Object.prototype.controls.tr.render = renderIcon;
  fabric.Object.prototype.controls.tr.cornerSize = 24;
}
