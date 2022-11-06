const tooltip = d3.select("#tooltip");
//color helper
let obj = {};
const test = connections.map((d, i) => {
  obj[d] = palette2[i];
});

let obj2 = {};
const test2 = nameRange.map((d, i) => {
  obj2[d] = palette[i];
});

function onMouseEnter(event, datum) {
  const main = d3.selectAll("path");
  main.classed("grey", true);

  //conditional on strokewidth

  if (this.getAttribute("stroke-width") < 0.3) {
    d3.select(this).classed("stroke", true).classed("grey", false);
  }

  if (this.getAttribute("stroke-width") > 0.3) {
    d3.select(this).classed("stroke", false).classed("grey", false);
  }

  d3.selectAll(".top").classed("top-fill", true);
  // main.style("stroke-width",c=>c.source)
  // d3.select(this).style("transform", `scale(1.2,1)`);
  // console.log(obj[event.source.name]);
  if (datum.source.height == 1) {
    tooltip.select("#tooltip-transformation").classed("mute", true);
    tooltip
      .select("#tooltip-target")
      .html(
        `<div id="target"><h3 style="color:${
          obj2[datum.source.name]
        }">Target ${datum.target.name.slice(
          0,
          datum.target.name.indexOf(" ")
        )}</h3>
        <p>${datum.target.name.slice(datum.target.name.indexOf(" "))}</p></div>`
      )
      .style("font-weight", "400");

    tooltip
      .select("#tooltip-goal")
      .html(
        `<div id="goal"><h2 style="color:${
          obj2[datum.source.name]
        }">Goal ${datum.target.name.slice(
          0,
          datum.source.name.indexOf(" ")
        )}</h2>
        <p style="font-size:1.2rem">${datum.source.name.slice(
          datum.source.name.indexOf(" ")
        )}</p></div>`
      )
      .style("font-weight", "400");
  }
  //   tooltip
  //     .select("#tooltip-goal")
  //     .html(
  //       `<div class="first-layer">
  //       <img src=${img} width="150px"/>
  //       <div class="text">
  //       <div class="goal-text">
  //       <h2 style="color:${obj2[datum.source.name]}">Goal ${
  //         datum.source.name
  //       }</h2>
  //       </div>
  //       <br>
  //       <div class="target">
  //       <h3>Target ${datum.target.name.slice(
  //         0,
  //         datum.target.name.indexOf(" ")
  //       )}</h3>
  //       <p>${datum.target.name.slice(datum.target.name.indexOf(" "))}</p>
  //       </div>
  //       <br>
  //       </div>
  //       </div>`
  //     )
  //     .style("font-weight", "400")
  //     .style("color", "#34495e");
  // }
  if (datum.source.height == 2) {
    tooltip.select("#tooltip-target").classed("mute", true);
    tooltip.select("#tooltip-transformation").classed("mute", true);
    tooltip
      .select("#tooltip-goal")
      .html(
        `<div id="goal"><h2 style="color:${
          obj2[datum.target.name]
        }">Goal ${datum.target.name.slice(
          0,
          datum.target.name.indexOf(" ")
        )}</h2>
      <p style="font-size:1.2rem">${datum.target.name.slice(
        datum.target.name.indexOf(" ")
      )}</p></div>`
      )
      .style("font-weight", "400");
  }

  tooltip.style("opacity", 1);

  // tooltip.style("color", "#34495e");
}

function onMouseLeave(event, datum) {
  d3.select(this).classed("stroke", false);
  const main = d3.selectAll("path").classed("grey", false);
  tooltip.style("opacity", 0);
  d3.selectAll(".top").classed("top-fill", false);
  tooltip.select("#tooltip-target").classed("mute", false);
  d3.select("#tooltip-transformation").classed("mute", false);
}

function onMouseEnter2(event, datum) {
  const main = d3.selectAll(".top");
  main.classed("grey", true);

  //conditional on strokewidth

  if (this.getAttribute("stroke-width") < 0.3) {
    d3.select(this).classed("stroke", true).classed("grey", false);
  }

  if (this.getAttribute("stroke-width") > 0.3) {
    d3.select(this).classed("stroke", false).classed("grey", false);
  }

  d3.selectAll(".top").classed("top-fill", true);
  d3.select(this).classed("top-fill", false);

  tooltip
    .select("#tooltip-transformation")
    .html(
      `<div id="transformation"><h2 style="color:${obj[datum.name]}">${
        datum.name
      }</h2></div>`
    )
    .style("font-weight", "400");
}

function onMouseLeave2(event, datum) {
  d3.select(this).classed("stroke", false);
  const main = d3.selectAll("path").classed("grey", false);
  tooltip.style("opacity", 0);
  d3.selectAll(".top").classed("top-fill", false);
}
