const width = 400;
const height = 400;

let edgeColor = "path";

const _sankey = d3
  .sankey()
  .nodeWidth(0)
  .nodePadding(2.2)
  .nodeSort(null)
  .extent([
    [width / 2.2, 0],
    [width, height - 100],
  ]);

const sankey = ({ nodes, links }) =>
  _sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

const f = d3.format(",.0f");
const format = (d) => `${f(d)} TWh`;

const _color = d3.scaleOrdinal(d3.schemeCategory10);
const color = (name) => _color(name.replace(/ .*/, ""));

const svg = d3
  .select("#chart")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("width", "100%")
  .style("height", "auto%")
  .attr("transform", "rotate(270,0,0)");
// .attr("scale", "1.5");
// .attr("transform", "translate(0,50%)");

d3.csv("../sankey.csv").then((data) => {
  //set up graph in same style as original example but empty
  const sankeydata = { nodes: [], links: [] };

  data.forEach(function (d) {
    sankeydata.nodes.push({ name: d.source });
    sankeydata.nodes.push({ name: d.target });
    sankeydata.links.push({
      source: d.source,
      target: d.target,
      value: +d.value,
    });
  });

  // return only the distinct / unique nodes

  const test = d3
    .nest()
    .key((d) => d.name)
    .entries(sankeydata.nodes);

  // console.log(test);

  sankeydata.nodes = test.map((d) => d.key);
  // console.log(sankeydata.nodes);

  // loop through each link replacing the text with its index from node
  sankeydata.links.forEach(function (d, i) {
    sankeydata.links[i].source = sankeydata.nodes.indexOf(
      sankeydata.links[i].source
    );
    sankeydata.links[i].target = sankeydata.nodes.indexOf(
      sankeydata.links[i].target
    );
  });

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  sankeydata.nodes.forEach(function (d, i) {
    sankeydata.nodes[i] = { name: d };
  });

  // console.log(sankeydata);
  graph = sankey(sankeydata);

  // console.log(graph);

  // svg
  //   .append("g")
  //   // .attr("stroke", "#000")
  //   .selectAll("rect")
  //   .data(graph.nodes)
  //   .join("rect")
  //   .attr("x", (d) => d.x0)
  //   .attr("y", (d) => d.y0 - 0.5)
  //   .attr("height", 1)
  //   // .attr("height", (d) => d.y1 - d.y0)
  //   // .attr("width", (d) => d.x1 - d.x0)
  //   // .attr("height", (d) => d.y1 - d.y0)
  //   .attr("width", 1)
  //   .attr("fill", (d) => color(d.name))
  //   .append("title")
  //   .text((d) => `${d.name}\n${format(d.value)}`)
  // .attr("transform", "rotate(270,0,0)");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // const select = document.querySelector("#colorSelect");
  // select.onchange = () => {
  //   edgeColor = select.value;
  //   update();
  // };

  function update() {
    if (edgeColor === "path") {
      const gradient = link
        .append("linearGradient")
        .attr("id", (d, i) => {
          //  (d.uid = DOM.uid("link")).id
          const id = `link-${i}`;
          d.uid = `url(#${id})`;
          return id;
        })
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => d.source.x1)
        .attr("x2", (d) => d.target.x0);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d) => color(d.source.name));

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", (d) => color(d.target.name));
    }

    link
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", (d) =>
        edgeColor === "path"
          ? d.uid
          : edgeColor === "input"
          ? color(d.source.name)
          : color(d.target.name)
      )
      .attr("stroke-width", (d) => Math.max(1, d.width));
  }

  update();

  // link
  //   .append("title")
  //   .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg
    .append("g")
    .style("font", "6px sans-serif")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 3 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2 - 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 5 ? "start" : "end"));
  // .text((d) => (d.height <= 1 ? null : d.name));

  // Add lines
  const lines = [
    { x1: width - 1, y1: height - 92, x2: width - 1, y2: height },
    { x1: width - 109, y1: height - 228, x2: width - 109, y2: height },
    { x1: width - 218, y1: height - 228, x2: width - 218, y2: height },
  ];

  lines.forEach((l) => {
    svg
      .append("g")
      .append("line")
      .attr("x1", l.x1)
      .attr("y1", l.y1)
      .attr("x2", l.x2)
      .attr("y2", l.y2)
      .attr("stroke", "black")
      .attr("stroke-width", "0.15");
  });

  // .style("stroke-width", "0.2px");
});
