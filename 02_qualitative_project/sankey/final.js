let link;
let shorthand = {};
const width = 360;
const height = 370;

//2. Create Bound
const chart = d3
  .select("#chart")
  .attr("viewBox", `0 0 ${width} ${height / 1.8}`)
  // .attr("preserveAspectRatio", "xMaxYMid")
  .style("VerticalAlignment", "Top")
  .style("width", "100%")
  .style("height", "auto")
  // .style("border", "1px solid #000")
  .append("g");

const svg = d3.select("#chart g");

svg.attr("transform", `rotate(-90, 0, 0) translate(-${width}, 0)`);

//3. Load Data
d3.csv("../sankey.csv").then((data) => {
  displayData(data);
});

function displayData(data) {
  //4. Prepare for Sankey
  prepData(data);

  const color = d3.scaleOrdinal().domain(nameRange).range(palette);
  const color2 = d3.scaleOrdinal().domain(connections).range(palette2);

  //5. Draw Sankey graph
  const link = svg
    .attr("fill", "none")
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // add rects
  // const rects = svg
  //   .append("g")
  //   // .attr("stroke", "#000")
  //   .selectAll("rect")
  //   .data(graph.nodes)
  //   .join("rect")
  //   .attr("class", "end")
  //   .attr("x", (d) => d.x1 - 50)
  //   .attr("y", (d) => d.y0)
  //   // .attr("height", 8)
  //   // .attr("height", (d) => d.y1 - d.y0)
  //   // .attr("width", (d) => d.x1 - d.x0)
  //   .attr("height", (d) => d.y1 - d.y0)
  //   .attr("width", (d) => (d.height == 2 ? 50 : null))
  //   .attr("fill", (d, i) => color2(d.name))
  //   .on("mouseover", onMouseEnter2)
  //   .on("mouseleave", onMouseLeave);
  // .append("title");
  // .text((d) => `${d.name}\n${format(d.value)}`)
  // .attr("transform", "rotate(270,0,0)");

  // Add labels
  swapText();
  const transformations = svg
    .append("g")
    .style("font", "6px DM Sans")
    .style("font-weight", "400")
    .style("fill", "#3f474e")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d) => (d.depth == 0 ? d.x0 - 44 : null))
    .attr("y", function (d) {
      if (d.name != connections[1] && d.name !== connections[5]) {
        return (d.y1 + d.y0) / 2 - 1;
      } else if (d.name == connections[1]) {
        return (d.y1 + d.y0) / 2 + 1;
      } else {
        return (d.y1 + d.y0) / 2 - 2;
      }
    })
    .attr("dy", "0.4em")
    .attr("text-anchor", "end")
    .text((d, i) => (d.depth == 0 ? shorthand[d.name] : null))
    .attr("alignment-baseline", (d) =>
      d.name == connections[5] ? "hanging" : "top"
    );

  //Draw tree
  const main = link
    .append("path")
    .attr("class", "link")
    // .attr("id", (d, i) => d.index)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("data-source", (d) => d.source.name)
    .attr("data-target", (d) => d.target.name)
    // .attr("stroke-opacity", (d) => (d.source.x1 <= width / 2 ? 0.5 : 0.5))
    .attr("stroke", (d) => {
      // the first layer
      if (d.source.height == 1) {
        return color(d.source.name);
      }
      if (d.source.height == 2) {
        return color(d.target.name);
      }
    })
    .attr("stroke-width", (d) => {
      if (d.source.height == 1) {
        return d.width * 1.5;
      } else return d.width;
    })
    .on("mouseover", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  // console.log(graph.links[0]);

  const tagline = svg
    .append("g")
    .append("text")
    .attr("class", "tagline")
    .text(`The Flowing Tree of SDGs`)
    .style("font", "8px Marcellus")
    .attr("x", width / 2 + 25)
    .attr("y", 22)
    .attr("text-anchor", "start")
    .attr("font-weight", "400")
    .attr("fill", "black")
    .style("transform", `translate(195px,40px) rotate(140deg)`);

  // Add guidelines

  let guides = [];
  const transLine = graph.links.filter((d) => d.index == 185);
  const targetLine = graph.links.filter((d) => d.index == 172);
  guides.push({
    name: "169 Targets",
    x: targetLine[0].target.x0 - 5,
    y: targetLine[0].y1,
  });
  guides.push({
    name: "17 Goals",
    x: targetLine[0].source.x0 - 9,
    y: targetLine[0].y0,
  });
  guides.push({
    name: "6 Transformations",
    x: transLine[0].source.x0 - 5,
    y: transLine[0].y0,
  });
  console.log(guides);
  guides.forEach((d, i) => {
    svg
      .append("g")
      .append("line")
      .attr("x1", d.x)
      .attr("y1", d.y + 10)
      .attr("x2", d.x)
      .attr("y2", height - 25)
      .attr("stroke", "black")
      .attr("stroke-width", "0.1")
      .attr("stroke-dasharray", "1");

    svg
      .append("g")
      .append("text")
      .text(d.name)
      .attr("x", d.x - 5)
      .attr("y", height - 25)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-size", "0.4rem")
      .attr("writing-mode", "vertical-rl");
  });

  svg
    .append("g")
    .append("text")
    .text("The Flowing Tree of SDGs")
    .attr("x", guides[2].x - 70)
    .attr("y", height - 25)
    .attr("fill", "black")
    .attr("text-anchor", "end")
    .attr("font-size", "0.6rem")
    .attr("font-weight", "700")
    .attr("writing-mode", "vertical-rl");

  // console.log(guideline);

  // Add extensions
  let coordinates = {};
  coordinates.nodes = graph.nodes.filter((d) => d.height == 2);
  coordinates.links = graph.links.filter((d) => d.source.height == 2);
  const barline = svg
    .append("g")
    .selectAll("path")
    .data(coordinates.nodes)
    .join("path")
    .attr("class", "top")
    .attr("data-target", (d) => d.name)
    .attr(
      "d",
      (d) => `M ${d.x0} ${d.y0}
   S${d.x0 - 25} ${(d.y0 + d.y1) / 2},
    ${d.x0 - 40} ${(d.y0 + d.y1) / 2 - 0.5}  L${d.x0 - 40} ${
        (d.y0 + d.y1) / 2 + 0.5
      }  S
    ${d.x0 - 25}  ${(d.y0 + d.y1) / 2} ${d.x1} ${d.y1} L ${d.x0} ${d.y0}`
    )
    .attr("fill", (d) => color2(d.name))

    .on("mouseover", onMouseEnter2)
    .on("mouseleave", onMouseLeave2);
  // .attr("stroke", (d) => color2(d.name));
  // .attr("stroke-width", (d) => (d.width < 1 ? 0.08 : 0.5));
}
