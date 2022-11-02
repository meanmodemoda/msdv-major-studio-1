let link;
let shorthand = {};
const width = 360;
const height = 370;

//1. Initiate Sankey
const _sankey = d3
  .sankey()
  .nodeWidth(0)
  .nodeAlign(d3.sankeyRight)
  .nodePadding(1.6)
  .nodeSort(null)
  .extent([
    [width / 1.5, 30],
    [width, height - 30],
  ]);

const sankey = ({ nodes, links }) =>
  _sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

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
  svg
    .append("g")
    // .attr("stroke", "#000")
    .selectAll("rect")
    .data(graph.nodes)
    .join("rect")
    .attr("x", (d) => d.x0 - 20)
    .attr("y", (d) => d.y0)
    // .attr("height", 8)
    // .attr("height", (d) => d.y1 - d.y0)
    // .attr("width", (d) => d.x1 - d.x0s)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => (d.height == 2 ? 20 : null))
    .attr("fill", (d, i) => color2(d.name))
    .append("title")
    // .text((d) => `${d.name}\n${format(d.value)}`)
    .attr("transform", "rotate(270,0,0)");

  console.log(graph.nodes);
  // 5. Draw Sankey

  swapText();

  const transformations = svg
    .append("g")
    .style("font", "6px DM Sans")
    .style("font-weight", "700")
    .selectAll("text")
    .data(graph.nodes)
    .join("text")
    .attr("x", (d) => (d.depth == 0 ? d.x0 - 22 : null))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 5 ? "start" : "end"))
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

  console.log(graph.links[0]);

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

  const tooltip = d3.select("#tooltip");

  //helper function
  const imgPicker = (str) => {
    const newStr = str.split(" ")[0].slice(0, 2);
    return newStr;
  };

  //helper function
  const convertName = (name) => {
    if (name != "Other") {
      return name.slice(4);
    } else {
      return name;
    }
  };

  //color helper
  let obj = {};
  const test = connections.map((d, i) => {
    obj[d] = palette2[i];
  });

  let obj2 = {};
  const test2 = nameRange.map((d, i) => {
    obj2[d] = palette[i];
  });

  // console.log(obj2);

  function onMouseEnter(event, datum) {
    console.log(this);
    main.style("opacity", 0.3);
    // main.style("stroke", function (d) {
    //   return d.source.name === event.source.name ||
    //     d.target.name === event.source.name
    //     ? "#69b3b2"
    //     : "d.uid";
    // });
    d3.select(this).style("opacity", 1);
    // main.style("stroke-width",c=>c.source)
    // d3.select(this).style("transform", `scale(1.2,1)`);
    // console.log(obj[event.source.name]);
    if (event.source.height == 1) {
      let imgCode = imgPicker(event.source.name);
      let img = `../assets/${imgCode}.png`;
      tooltip
        .select(".tooltip-goal")
        .html(
          `<div class="first-layer">
        <img src=${img} width="150px"/>
        <div class="text">
        <div class="goal-text">
        <h2 style="color:${obj2[event.source.name]}">Goal ${
            event.source.name
          }</h2>
        </div>
        <br>
        <div class="target">
        <h3>Target ${event.target.name.slice(
          0,
          event.target.name.indexOf(" ")
        )}</h3>
        <p>${event.target.name.slice(event.target.name.indexOf(" "))}</p>
        </div>
        <br>
        </div>
        </div>`
        )
        .style("font-weight", "400")
        .style("color", "#34495e");
    }
    if (event.source.height == 2 && event.source.name != "Other") {
      tooltip
        .data(connections)
        .select(".tooltip-goal")
        .html(
          `<div class="first-layer">
        <div class="text">
        <br>
        <h1 style="color:${obj[event.source.name]}"> ${convertName(
            event.source.name
          )}</h1>
        <p>is one of the six SDG Transformations that connects Goal ${
          event.target.name
        } with other SDGs.</p>
        </div>
        </div>`
        )
        .style("font-weight", "400");
    }

    if (event.source.name == "Other") {
      tooltip
        .data(connections)
        .select(".tooltip-goal")
        .html(
          `<div class="first-layer">
        <div class="text">
       <p>
        Goal ${event.target.name}
      is a standalone SDG.</p> 
        
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
    // tooltip.style("width", "30%");
    tooltip.style("opacity", 1);
    // tooltip.style("color", "#34495e");
  }

  function onMouseLeave(event) {
    main.style("opacity", 1);
    d3.select(this);
    tooltip.style("opacity", 0);
  }
}
