const width = innerWidth - 200;
const height = innerHeight;

let edgeColor = "path";

const _sankey = d3
  .sankey()
  .nodeWidth(1)
  .nodePadding(2)
  .nodeSort(null)
  .extent([
    [1, 1],
    [width, height - 5],
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
  .style("width", "80%")
  .style("height", "auto");
// .attr("transform", "rotate(270,0,0)");

d3.csv("../sankey2.csv").then((data) => {
  //set up graph in same style as original example but empty
  sankeydata = { nodes: [], links: [] };

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
  const unique = d3
    .nest()
    .key((d) => d.name)
    .entries(sankeydata.nodes);

  sankeydata.nodes = unique.map((d) => d.key);
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

  svg
    .append("g")
    // .attr("stroke", "#000")
    .selectAll("rect")
    .data(graph.nodes)
    .join("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", 0.6)
    .attr("fill", (d) => color(d.name))
    .append("title")
    .text((d) => `${d.name}\n${format(d.value)}`);

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  function update() {
    if (edgeColor === "path") {
      const gradient = link
        .append("linearGradient")
        .attr("id", (d, i) => {
          // (d.uid = DOM.uid("link")).id;
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

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // svg
  //   .append("g")
  //   .style("font", "10px sans-serif")
  //   .selectAll("text")
  //   .data(graph.nodes)
  //   .join("text")
  //   .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
  //   .attr("y", (d) => (d.y1 + d.y0) / 2)
  //   .attr("dy", "0.35em")
  //   .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
  //   .text((d) => d.name);

  // d3 = require("d3@5", "d3-sankey@0.7");
});
