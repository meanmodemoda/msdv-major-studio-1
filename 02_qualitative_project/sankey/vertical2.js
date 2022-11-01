let link;
const width = 360;
const height = 380;

const nameRange = [
  "01. No Poverty",
  "02. Zero Hunger",
  "03. Good Health and Well-Being",
  "04. Quality Education",
  "05. Gender Equality",
  "06. Clean Water and Sanitation",
  "07. Affordable and Clean Energy",
  "08. Decent Work and Economic Growth",
  "09. Industry, Innovation, and Infrastructure",
  "10. Reduced Inequalities",
  "11. Sustainable Cities and Communities",
  "12. Responsible Consumption and Production",
  "13. Climate Action",
  "14. LIfe below Water",
  "15. Life on Land",
  "16. Peace, Justice and Strong Institutions",
  "17. Partnerships for the Goals",
];

//1. Initiate Sankey
const _sankey = d3
  .sankey()
  .nodeWidth(0)
  .nodeAlign(d3.sankeyJustify)
  .nodePadding(1.8)
  .nodeSort(null)
  .extent([
    [width / 2.1, 10],
    [width - 5, height - 30],
  ]);

const sankey = ({ nodes, links }) =>
  _sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

const f = d3.format(",.0f");
const format = (d) => `${f(d)} TWh`;

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
  //set up graph in same style as original example but empty
  const sankeydata = {
    nodes: [],
    links: [],
  };

  //trasform csv data into flow chart data
  data.forEach(function (d) {
    sankeydata.nodes.push({
      name: d.source,
    });
    sankeydata.nodes.push({
      name: d.target,
    });
    sankeydata.links.push({
      source: d.source,
      target: d.target,
      value: +d.value,
    });
  });

  // console.log(data[0]);

  // return only the distinct / unique nodes
  const unique = d3
    .nest()
    .key((d) => d.name)
    .entries(sankeydata.nodes);

  sankeydata.nodes = unique.map((d) => d.key);
  // console.log(sankeydata.nodes);

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
    sankeydata.nodes[i] = {
      name: d,
    };
  });

  const palette = [
    "#E5233D",
    "#DEA739",
    "#4CA146",
    "#C7212E",
    "#EF402D",
    "#27BFE6",
    "#FBC412",
    "#A21D43",
    "#F26A2E",
    "#E01583",
    "#F89D2A",
    "#BF8D2C",
    "#407F46",
    "#2097D4",
    "#59BA48",
    "#126A9E",
    "#15496B",
  ];

  // const _color = d3.scaleOrdinal(d3.schemeCategory10);
  // const color = (name) => _color(name.replace(/ .*/, ""));

  const color = d3.scaleOrdinal().domain(nameRange).range(palette);

  //4. Prepare for Sankey
  graph = sankey(sankeydata);

  // add rects

  // svg
  //   .append("g")
  //   // .attr("stroke", "#000")
  //   .selectAll("rect")
  //   .data(graph.nodes)
  //   .join("rect")
  //   .attr("x", (d) => d.x0)
  //   .attr("y", (d) => d.y0)
  //   // .attr("height", 8)
  //   // .attr("height", (d) => d.y1 - d.y0)
  //   // .attr("width", (d) => d.x1 - d.x0s)
  //   .attr("height", (d) => d.y1 - d.y0)
  //   .attr("width", 16)
  //   .attr("fill", (d) => color(d.name))
  //   .append("title")
  //   .text((d) => `${d.name}\n${format(d.value)}`);
  // .attr("transform", "rotate(270,0,0)");

  // 5. Draw Sankey
  link = svg
    .append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data(graph.links)
    .join("g")
    .style("mix-blend-mode", "multiply");

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
    // .attr("offset", "0%")
    .attr("stop-color", (d) => {
      // the first layer
      if (d.source.x1 > width / 2) {
        return color(d.source.name);
      } else {
        return color(d.target.name);
      }
    });

  gradient
    .append("stop")
    // .attr("offset", "100%")
    .attr("stop-color", (d) => {
      // the first layer
      if (d.source.x1 > width / 2) {
        return color(d.source.name);
      } else {
        return color(d.target.name);
      }
    });

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
    .append("g")
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
    .attr("stroke", (d) => d.uid)
    .attr("stroke-width", (d) => {
      // the first layer
      if (d.source.x1 > width / 2) {
        return d.width * 1.8;
      } else {
        return d.width;
      }
    })
    .on("mouseover", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  const reverse = link
    .append("g")
    .append("path")
    .attr("class", "link-reverse")
    .attr("id", (d, i) => "c" + d.index)
    .attr("opacity", 0)
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("transform", "translate(425,3) rotate(180,0,0) scale(1,-1)")
    // .attr("stroke-opacity", (d) => (d.source.height == 1 ? 0.1 : 0.1))
    .attr("stroke", (d) => d.uid)
    .attr("stroke-width", (d) => {
      return d.width * 2;
    });

  // const pathArray = ["#c9", "#c34", "#c56", "#c58", "#c63", "#c82", "#c138"];

  // pathArray.forEach((p) => {
  //   d3.select(p)
  //     .style("stroke", "grey")
  //     .style("stroke-width", 1)
  //     .style("opacity", 0.3);
  // });

  // link
  //   .append("title")
  //   .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  //7. Append text
  // const title = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "title")
  //   .text(`SDG at A Glace`)
  //   .style("font", "15px DM Sans")
  //   .attr("x", width / 2 + 25)
  //   .attr("y", 12)
  //   .attr("text-anchor", "start")
  //   // .style("fill", "url(#rainbow)")
  //   .style("transform", `translateX(180px) rotate(90deg)`);

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
    .attr("font-family", "")
    .attr("font-weight", "400")
    .style("fill", "gray")
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
    .attr("transform", `rotate(180,0)`)
    .attr("font-family", "DM Sans")
    .attr("font-size", "0.3rem")
    .attr("alignment-baseline", "central");

  //append labels
  const goals = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    .attr("xlink:href", "#a1")
    .text("Goals")
    .attr("font-size", "0.4rem")
    .attr("text-align", "left");
  // .attr("startOffset", "5%");

  const targets = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    .attr("startOffset", "75%")
    .attr("xlink:href", "#a1")
    .attr("font-size", "0.4rem")
    .text("Targets");

  const themes = svg
    .append("g")
    .append("text")
    .attr("class", "tick-label")
    .append("textPath")
    .attr("startOffset", "5%")
    .attr("xlink:href", "#a0")
    .attr("font-size", "0.4rem")
    .text("Themes")
    .attr("alignment-baseline", "top");

  // const egi = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c9")
  //   .text(`Education, Gender, and Inequality`)
  //   .style("font", "5px Marcellus")
  //   .attr("x", width / 2 + 25)
  //   .attr("y", 22)
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // // .attr("startOffset", "5%");

  // const health = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c34")
  //   .text(`Health, Well-Being, and Demography`)
  //   .style("font", "5px Marcellus")
  //   .attr("x", width / 2 + 25)
  //   .attr("y", 22)
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // // .attr("startOffset", "10%");

  // const energy = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("alignment-baseline", "hanging")
  //   .attr("xlink:href", "#c56")
  //   .text(`Energy Decarbonisation and Sustainable Industry`)
  //   .style("font", "5px Marcellus")
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // // .attr("startOffset", "10%");

  // const food = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c58")
  //   .attr("alignment-baseline", "top")
  //   .text(`Sustainable Food, Land, Water, and Oceans`)
  //   .style("font", "5px Marcellus")
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // .attr("startOffset", "10%");

  // const cities = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c63")
  //   .attr("alignment-baseline", "hanging")
  //   .text(`Sustainable Cities and Communities`)
  //   .style("font", "5px Marcellus")
  //   .attr("x", width / 2 + 25)
  //   .attr("y", 22)
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");

  // const digital = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c82")
  //   .text(`Digital Revolution for Sustainable Development`)
  //   .style("font", "5px Marcellus")
  //   .attr("alignment-baseline", "hanging")
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // // .attr("startOffset", "10%");

  // const other = svg
  //   .append("g")
  //   .append("text")
  //   .attr("class", "transformation")
  //   .append("textPath")
  //   .attr("xlink:href", "#c138")
  //   .text(`Other Transformations`)
  //   .style("font", "5px Marcellus")
  //   .attr("x", width / 2 + 25)
  //   .attr("y", 22)
  //   .attr("text-anchor", "start")
  //   .attr("font-family", "")
  //   .attr("font-weight", "400")
  //   .style("fill", "gray");
  // // .attr("startOffset", "10%");

  d3.selectAll("#c9,#c34,#c56,#c58,#c63,#c82,#c138").attr("stroke", "red");
});

const tooltip = d3.select("#tooltip");

//helper function
const imgPicker = (str) => {
  const newStr = str.split(" ")[0].slice(0, 2);
  return newStr;
};

function onMouseEnter(event) {
  // console.log(this, event);

  console.log(event.width);
  // d3.select(this).style("stroke-width", "2px");

  if (event.source.height == 1) {
    let imgCode = imgPicker(event.source.name);
    let img = `../assets/${imgCode}.png`;
    tooltip
      .select("#tooltip-goal")
      .html(
        `<div class="first-layer"><img src=${img} width="150px"/>
        <div id="first-layer">
        <h3 style=("font-size","5em")>Goal ${event.source.name}</h3>
        <div class="placeholder"></div>
        <p>Target ${event.target.name}</p>
        </div>
        </div>`
      )
      .style("font-weight", "400");
  }

  if (event.source.height == 2) {
    let imgCode = imgPicker(event.target.name);
    let img = `../assets/${imgCode}.png`;
    tooltip
      .select("#tooltip-goal")
      .html(
        `<div class="first-layer"><img src=${img} width="150px"/>
        <div id="first-layer">
        <h3 style=("font-size","5em")>Transformation ${event.source.name}</h3>
        <div class="placeholder"></div>
        <p>Goal ${event.target.name}</p>
        </div>
        </div>`
      )
      .style("font-weight", "400");
  }

  //Format tooltip position
  const x = event.pageX;
  const y = event.pageY;

  // tooltip.style(
  //   "transform",
  //   `translate(` + `calc(-5% + ${x}px),` + `calc(5% + ${y}px)` + `)`
  // );
  tooltip.style("width", "30%");
  tooltip.style("opacity", 1);
}

function onMouseLeave(event) {
  d3.select(this);
  tooltip.style("opacity", 0);
}
