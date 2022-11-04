//this is d3 version 5, first element passed in is datum
function onMouseEnter(event, datum) {
  console.log(datum);
  //color helper
  let obj = {};
  const test = connections.map((d, i) => {
    obj[d] = palette2[i];
  });

  let obj2 = {};
  const test2 = nameRange.map((d, i) => {
    obj2[d] = palette[i];
  });

  const tooltip = d3.select("#tooltip");
  const main = d3.selectAll("path");
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
  if (datum.source.height == 1) {
    let imgCode = imgPicker(datum.source.name);
    let img = `../assets/${imgCode}.png`;
    tooltip
      .select(".tooltip-goal")
      .html(
        `<div class="first-layer">
        <img src=${img} width="150px"/>
        <div class="text">
        <div class="goal-text">
        <h2 style="color:${obj2[datum.name]}">Goal ${datum.name}</h2>
        </div>
        <br>
        <div class="target">
        <h3>Target ${datum.target.name.slice(
          0,
          datum.target.name.indexOf(" ")
        )}</h3>
        <p>${datum.target.name.slice(datum.target.name.indexOf(" "))}</p>
        </div>
        <br>
        </div>
        </div>`
      )
      .style("font-weight", "400")
      .style("color", "#34495e");
  }
  if (datum.source.height == 2 && datum.source.name != "Other") {
    tooltip
      .data(connections)
      .select(".tooltip-goal")
      .html(
        `<div class="first-layer">
        <div class="text">
        <br>
        <h1 style="color:${obj[datum.source.name]}"> ${convertName(
          datum.source.name
        )}</h1>
        <p>is one of the six SDG Transformations that connects Goal ${
          datum.target.name
        } with other SDGs.</p>
        </div>
        </div>`
      )
      .style("font-weight", "400");
  }

  if (datum.source.name == "Other") {
    tooltip
      .data(connections)
      .select(".tooltip-goal")
      .html(
        `<div class="first-layer">
        <div class="text">
       <p>
        Goal ${datum.target.name}
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

function onMouseLeave(event, datum) {
  const tooltip = d3.select("#tooltip");
  const main = d3.selectAll("path");
  main.style("opacity", 1);
  d3.select(this);
  tooltip.style("opacity", 0);
}

function onMouseEnter2(event, datum) {
  console.log(datum);
}
