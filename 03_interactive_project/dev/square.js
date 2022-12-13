const squareML = document.querySelector("#square-men-leisure");
const rc1 = rough.svg(squareML);
squareML.appendChild(
  rc1.rectangle(10, 10, 120, 120, {
    fill: "#AFBAFC",
    stroke: "black",
    fillWight: 5,
    // filter: "url(#watercolor-3)",
    // // borderRadius: "10px",
    fillStyle: "solid",
    // roughness: 1,
  })
);
// squareML.setAttribute("class", "watercolor");
squareML.appendChild(
  rc1.rectangle(140, 10, 120, 120, {
    fill: "black",
    stroke: "black",
    // strokeWidth: "1px",
    // filter: "url(#watercolor-3)",
    // // borderRadius: "10px",
    // // fillStyle: "solid",
    // roughness: 1,
  })
);

squareML.appendChild(
  rc1.rectangle(280, 10, 120, 120, {
    fill: "#AFBAFC",
    stroke: "black",
    fillWeight: 2.1,
    // strokeWidth: "1px",
    filter: "url(#watercolor-2)",
    // // borderRadius: "10px",
    // // fillStyle: "solid",
    // roughness: 1,
  })
);
// const squareWL = document.querySelector("#square-women-leisure");
// const rc2 = rough.svg(squareWL);
// squareWL.appendChild(
//   rc2.rectangle(190, 30, 100, 120, {
//     stroke: "red",
//     fill: "black",
//     strokeWidth: "1px",
//     // borderRadius: "10px",
//     // fillStyle: "solid",
//     // roughness: 1,
//   })
// );

// const svg1 = document.querySelector("#water");
// const rc2 = rough.svg(svg1);
// svg1.appendChild(
//   rc2.rectangle(100, 10, 100, 100, {
//     fill: "#AFBAFC",
//     // filter: "url(#watercolor-2)",
//     // borderRadius: "10px",
//     // fillStyle: "solid",
//     roughness: 1,
//   })
// );
// let path = document.querySelector("path");
// path.setAttribute("class", "path");

// let length = path.getTotalLength();
// path.style.strokeDasharray = length + " " + length;
// path.style.strokeDashoffset = length;

// svg1.svg.setAttribute("class", "watercolor");

// const svg2 = new svg2roughjs.Svg2Roughjs("#output2");
// svg2.svg = document.querySelector(".path");
// // svg2roughjs.roughConfig = {
// //   hachureAngle: 60,
// //   hachureGap: 30,
// // };
// svg2.sketch();
// svg2.svg.setAttribute("class", "watercolor");
// const svg2roughjs = new Svg2Roughjs("#output2");
// const svg2 = document.querySelector(".path");
// svg2roughjs.svg = svg2; // or maybe use the DOMParser to load an SVG file instead
// svg2roughjs.sketch();
