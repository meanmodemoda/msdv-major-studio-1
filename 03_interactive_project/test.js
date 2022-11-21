const svg = document.querySelector("#svg");
const rc = rough.svg(svg);
svg.appendChild(
  rc.rectangle(25, 10, 100, 100, {
    // fill: "cornflowerblue",
    stroke: "black",
    strokeWidth: "5px",
    // filter: "url(#watercolor-3)",
    // borderRadius: "10px",
    fillStyle: "solid",
    roughness: 1,
  })
);

const svg2 = document.querySelector("#svg2");
const rc2 = rough.svg(svg2);
svg2.appendChild(
  rc2.rectangle(155, 10, 100, 100, {
    fill: "cornflowerblue",
    stroke: "none",
    // stroke: "grey",
    // strokeWidth: "4px",
    // filter: "url(#watercolor-3)",
    // borderRadius: "10px",
    fillStyle: "solid",
    roughness: 1,
  })
);

// const svgConverter = new svg2roughjs.Svg2Roughjs("#output");
// svgConverter.svg = document.querySelector("#svg");
// svgConverter.svg.setAttribute("class", "watercolor-2");
// svgConverter.sketch();
