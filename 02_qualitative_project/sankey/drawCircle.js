let link;
const width = 150;
const height = 300;
let r = 20;
let offset = 1.2;

//2. Create Bound
const chart = d3
  .select("#chart")
  .attr("viewBox", `0 0 300 150`)
  .style("VerticalAlignment", "Top")
  .style("width", "100%")
  .style("height", "auto")
  // .style("border", "1px solid #000")
  .append("g");

const svg = d3.select("#chart g");

svg.append("circle").attr("cx", 150).attr("cy", 150).attr("r", 20);

const angle = (Math.PI * 2) / 10;
console.log(angle);

let coordinates = [];

let x = r * Math.cos(angle * 2);
console.log(x);

for (let i = 1; i <= 10; i++) {
  let coordinate = {};
  coordinate.x = r * offset * Math.cos(angle * i) + width;
  coordinate.y = r * offset * Math.sin(angle * i) + height;
  coordinates.push(coordinate);
}

console.log(coordinates);

coordinates.forEach((d) => {
  svg.append("circle").attr("cx", d.x).attr("cy", d.y).attr("r", 2);
});
// const getCoordinatesForAngle = (angle, offset = 1) => [
//   Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
//   Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
// ];
