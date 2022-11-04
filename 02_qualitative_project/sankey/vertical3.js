let link;
let shorthand = {};
const width = 360;
const height = 370;

//2. Create Bound
const chart = d3
  .select("#chart")
  .attr("viewBox", `0 0 ${width} ${height / 2}`)
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
  prepData(data);

  //set up graph in same style as original example but empty
  // const _color = d3.scaleOrdinal(d3.schemeCategory10);
  // const color = (name) => _color(name.replace(/ .*/, ""));

  const color = d3.scaleOrdinal().domain(nameRange).range(palette);
  const color2 = d3.scaleOrdinal().domain(connections).range(palette2);

  //4. Prepare for Sankey

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
  //   .attr("x", (d) => d.x1)
  //   .attr("y", (d) => d.y0)
  //   // .attr("height", 8)
  //   // .attr("height", (d) => d.y1 - d.y0)
  //   // .attr("width", (d) => d.x1 - d.x0)
  //   .attr("height", (d) => d.y1 - d.y0)
  //   .attr("width", (d) => (d.height == 2 ? 1 : null))
  //   .attr("fill", (d, i) => color2(d.name))
  //   .on("mouseover", onMouseEnter2)
  //   .on("mouseleave", onMouseLeave);
  // // .append("title");
  // .text((d) => `${d.name}\n${format(d.value)}`)
  // .attr("transform", "rotate(270,0,0)");

  // console.log(graph.nodes);
  // 5. Draw Sankey

  swapText();

  const transformations = svg
    .append("g")
    .style("font", "6px DM Sans")
    .style("font-weight", "700")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d) => (d.depth == 0 ? d.x0 - 24 : null))
    .attr("y", function (d) {
      if (d.name != connections[1] && d.name !== connections[5]) {
        return (d.y1 + d.y0) / 2 - 5;
      } else if (d.name == connections[1]) {
        return (d.y1 + d.y0) / 2 + 4;
      } else {
        return (d.y1 + d.y0) / 2;
      }
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text((d, i) => (d.depth == 0 ? shorthand[d.name] : null))
    .attr("alignment-baseline", (d) =>
      d.name == connections[5] ? "hanging" : "bottom"
    )
    .style("fill", "black");

  const invia = link
    .append("path")
    .attr("class", "link-invisible")
    .attr("id", (d, i) => "a" + d.index)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("transform", "translate(0,-4)")
    // .attr("stroke-opacity", (d) => (d.source.x1 <= width / 2 ? 1 : 0.5))
    .attr("stroke", "transparent")
    .attr("stroke-width", (d) => {
      return d.width;
    });

  const invib = link
    .append("path")
    .attr("class", "link-invisible")
    .attr("id", (d, i) => "b" + d.index)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("transform", "translate(-6,8)")
    // .attr("stroke-opacity", (d) => (d.source.x1 <= width / 2 ? 1 : 0.5))
    .attr("stroke", "transparent")
    .attr("stroke-width", (d) => {
      return d.width;
    });

  const main = link
    .append("path")
    .attr("class", "link")
    // .attr("id", (d, i) => d.index)
    .attr("d", d3.sankeyLinkHorizontal())
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
    .append("textPath")
    .attr("xlink:href", "#b172")
    .text(`The Flowing Tree of SDGs`)
    .style("font", "8px Marcellus")
    .attr("x", width / 2 + 25)
    .attr("y", 22)
    .attr("text-anchor", "start")
    .attr("font-weight", "400")
    .style("fill", "url(#gr-simple)")
    .attr("startOffset", "10%");
  // .style("transform", `translate(195px,40px) rotate(140deg)`);

  //text labels
  svg
    .append("g")
    .style("font", "6px sans-serif")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 3 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2 - 2)
    .attr("dy", "0.4em")
    // .attr("font-size")
    .attr("text-anchor", "end")
    .text(function (d) {
      if (d.x0 > width / 2) {
        return null;
      } else if (d.name != "Other") {
        return d.name.slice(4);
      } else {
        return d.name;
      }
    })
    // .attr("transform", `rotate(180,0)`)
    .attr("font-family", "DM Sans")
    .attr("font-size", "0.3rem")
    .attr("alignment-baseline", "central");

  //append labels
  const goals = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    .attr("xlink:href", "#a0")
    .text("Goals")
    .attr("font-size", "0.4rem")
    .attr("text-align", "left")
    .attr("startOffset", "80%");

  const targets = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    .attr("startOffset", "75%")
    .attr("xlink:href", "#a1")
    .attr("font-size", "0.4rem")
    .text("Targets");

  const transform = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    // .attr("startOffset", "-25%")
    .attr("xlink:href", "#a0")
    .attr("font-size", "0.4rem")
    .text("Theme");
  // d3.selectAll("#c9,#c34,#c56,#c58,#c63,#c82,#c138").attr("stroke", "red");

  const coordinates = graph.nodes.filter((d) => d.height == 2);
  console.log(coordinates);

  // svg
  //   .append("g")

  //   .append("path")
  //   .attr(
  //     "d",
  //     `M 240 54.73
  //     S 230 58
  //      200 59`
  //   )
  //   //   .attr(
  //   //     "d",
  //   //     `M 240 54.73
  //   // C 230 58
  //   // 220 58
  //   //   200 59  S
  //   //   210 56 240 62.97 L 240 54.73`
  //   //   )
  //   .attr("stroke", "red")
  //   .attr("stroke-width", 0.5);

  // console.log(d);

  svg
    .append("g")
    .selectAll("path")
    .data(coordinates)
    .join("path")
    .attr(
      "d",
      (d) => `M ${d.x0} ${d.y0}
   S${d.x0 - 20} ${(d.y0 + d.y1) / 2},
    ${d.x0 - 70} ${(d.y0 + d.y1) / 2 - 1}  L${d.x0 - 70} ${
        (d.y0 + d.y1) / 2 + 1
      }  S
    ${d.x0 - 20}  ${(d.y0 + d.y1) / 2} ${d.x1} ${d.y1} L ${d.x0} ${d.y0}`
    )
    // ${d.x0 - 20} ${(d.y0 + d.y1) / 2},
    // .attr(
    //   "d",
    //   (d) => `M ${d.x0} ${d.y0}
    // C ${d.x0 - 10} ${(d.y0 + d.y1) / 2},
    // ${d.x0 - 20} ${(d.y0 + d.y1) / 2},
    // ${d.x0 - 40} ${(d.y0 + d.y1) / 2 + 1}  S
    // ${d.x0 - 30}  ${(d.y0 + d.y1) / 2 - 2} ${d.x1} ${d.y1} L ${d.x0} ${d.y0}`
    // )
    .attr("fill", (d) => color2(d.name));
  // .attr("stroke", (d) => color2(d.name));
  // .attr("stroke-width", (d) => (d.width < 1 ? 0.08 : 0.5));
}
