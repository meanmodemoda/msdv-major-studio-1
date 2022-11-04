// 1.Set the dimensions and margins of the graph
const width = 250;
let dimensions = {
  width: width,
  height: width,
  radius: width / 2,
  margin: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  },
};

//Select svg
const svg = d3.select("#my_dataviz");

dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
dimensions.boundedRadius =
  dimensions.radius - (dimensions.margin.left + dimensions.margin.right) / 2;
innerRadius = 0;
outerRadius = dimensions.boundedWidth / 2;

//2. Read the data
d3.csv("../data/score.csv").then(function (data) {
  appendImage();
  displayData(data);
});

function displayData(data) {
  //Process the data
  const datagoal = data.filter((d) => d.goal != "Overall");
  //Group data for multiples
  const sumstat = d3.groups(datagoal, (d) => d.region);
  const sumgoal = d3.groups(datagoal, (d) => d.goal);
  const goal = d3.groups(data, (d) => d.goal).map((d) => d[0]);

  // Get unique list of regions
  const region = Array.from(sumstat).map((d) => d[0]);
  const regionAccessor = (d) => d.region;
  const goalAccessor = (d) => d.goal;
  const scoreAccessor = (d) => d.value;
  const colorAccessor = (d) => d.color;

  //For easy id names
  regionAlias = ["esa", "eeca", "laca", "mena", "oc", "oecd", "ss", "world"];

  //3. Draw chart for each sumstat group
  sumstat.forEach((d, i) => {
    const chart = svg
      .append("div")
      .attr("id", `${regionAlias[i]}`)
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("class", "multiple")
      .style(
        "transform",
        `translate(${dimensions.margin.left + dimensions.boundedRadius}px, ${
          dimensions.margin.top + dimensions.boundedRadius
        }px)`
      );

    //4. Draw scales
    const goalScale = d3
      .scaleBand()
      .domain(goal)
      .range([0, Math.PI * 2]);

    const radiusScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerRadius, outerRadius]);

    const colorScale = d3
      .scaleOrdinal()
      .domain(goal)
      .range([
        "#F4D6E6",
        "#FFEACF",
        "#D3E8D9",
        "#C0E4ED",
        "#F58B94",
        "#C78B9B",
        "#84BCE0",
        "#F4D6E6",
        "#FFEACF",
        "#D3E8D9",
        "#C0E4ED",
        "#F58B94",
        "#C78B9B",
        "#84BCE0",
        "#F58B94",
        "#C78B9B",
        "#84BCE0",
      ]);

    // color palette
    const color = d3
      .scaleOrdinal()
      .domain(region)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999",
      ]);

    // 6. Draw peripherals

    const peripherals = chart.append("g");

    const scoreTicks = radiusScale.ticks(4);
    // console.log(scoreTicks);
    // console.log(scoreTicks);

    const gridCircles = scoreTicks.forEach((d) =>
      peripherals
        .append("circle")
        .attr("r", radiusScale(d))
        .attr("class", "grid-line")
    );
    //draw region label text path
    const textPath = peripherals.append("g");

    //add white background to score label
    const tickLabelBackgrounds = scoreTicks.map((d) => {
      if (d != 0) {
        return peripherals
          .append("rect")
          .attr("y", -radiusScale(d) - 10)
          .attr("x", -18)
          .attr("width", 30)
          .attr("height", 20)
          .attr("fill", "#eceded");
      }
    });

    //add score label
    const tickLabels = scoreTicks.map((d) => {
      if (d != 0) {
        return peripherals
          .append("text")
          .attr("x", -12)
          .attr("y", -radiusScale(d) + 2)
          .attr("class", "tick-label-score")
          .text(`${d}%`);
      }
    });

    // 5. Draw charts
    chart
      .append("g")
      .selectAll("path")
      .data(d[1])
      .join("path")
      .attr("id", (d) =>
        d.goal
          .slice(3)
          .replace(/[^\w\s\']|_/g, "")
          .split(" ")
          .join("")
      )
      .attr("opacity", 0.7)
      .attr("fill", (d) => d.Color)
      .attr("class", (d) => "c" + d.Color.slice(1, 8))
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(innerRadius)
          .outerRadius((d) => radiusScale(scoreAccessor(d)))
          .startAngle((d) => goalScale(goalAccessor(d)))
          .endAngle((d) => goalScale(goalAccessor(d)) + goalScale.bandwidth())
          .padAngle(0.5)
          .padRadius(innerRadius)
      )
      .on("mouseover", onMouseEnter)
      .on("mouseleave", onMouseLeave);

    //Add titles
    chart
      .append("g")
      .append("text")
      .attr("y", dimensions.boundedRadius + 45)
      .attr("x", 0)
      .text(d[0])
      .attr("text-anchor", "middle");

    textPath
      .selectAll("path")
      .data(d[1])
      .join("path")
      .attr("opacity", 0)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(dimensions.boundedRadius)
          .outerRadius(dimensions.boundedRadius + 10)
          .startAngle((d) => goalScale(goalAccessor(d)) * 1.02)
          .endAngle((d) => goalScale(goalAccessor(d)) + goalScale.bandwidth())
          .padAngle(0.5)
          .padRadius(innerRadius)
      )
      .attr("id", function (d, i) {
        return "goal" + i;
      });

    //draw goal label
    goal.forEach((r, i) => {
      peripherals
        .append("text")
        .attr("class", "tick-label")
        .append("textPath")
        .attr("xlink:href", "#goal" + i)
        .style("font-size", "10px")
        .text(r.split(" ")[0].slice(0, 2));
    });

    //7. Draw Interaction
    const tooltip = d3.select("#tooltip");

    function onMouseEnter(event, datum) {
      const classy = d3.select(this).attr("class");
      // console.log(classy);

      console.log(this);
      //Find same classed items
      d3.selectAll(`.${classy}`)
        .style("stroke", "white")
        .style("stroke-width", "2");

      //Return all items' data and write into html tables
      let table = [];
      let values = [];
      let html = "";
      for (let d of sumgoal) {
        if (d[0] === datum.goal) {
          for (let d1 of d[1]) {
            table.push(d1.region);
            values.push(d1.value);
            html += `
          </tr><tr><td>${d1.region}</td><td>${d1.value}%</td></tr>`;
          }
        }
      }
      // console.log(html);

      tooltip
        .select("#tooltip-goal")
        .text(datum.goal)
        .style("font-weight", "700")
        .style("color", datum.Color);

      tooltip
        .select("#tooltip-region")
        .html(
          `<table><tr>
        <th>Region</th>
        <th>Score</th>
        </tr>${html}</table>`
        )
        .style("font-weight", "700");
      // .style("font-size", "16px");

      //Format tooltip position
      const x = event.pageX;
      const y = event.pageY;

      // console.log(event.pageX);
      tooltip.style(
        "transform",

        `translate(` + `calc(-6% + ${x}px),` + `calc(10% + ${y}px)` + `)`
      );

      tooltip.style("opacity", 1);
    }

    function onMouseLeave(event) {
      //remove tooltip
      const classy = d3.select(this).attr("class");
      d3.selectAll(`.${classy}`).style("stroke", "none");
      tooltip.style("opacity", 0);
    }
  });
}

function appendImage() {
  //add SDG icons
  const menu = d3.select("#menu");
  const goal = [
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
  //append images
  for (let i = 0; i < 17; i++) {
    menu
      .append("div")
      .attr("class", "container")
      .append("img")
      .attr("class", "graphic")
      // this is calling the svg that has the corressponding name w/ the attr
      .attr("src", "../assets/" + (i + 1) + ".svg")
      .attr("id", goal[i])
      .style("width", "65px");
    // .style("pointer-events", "visible");
  }

  //reason why mouse event couldn't fire was because imgs were buried, gave them a high z-index mouse event worked
  const imgs = d3.selectAll(".graphic").on("click", onClick);

  function onClick(event) {
    // console.log(
    //   this.id
    //     .slice(3)
    //     .replace(/[^\w\s\']|_/g, "")
    //     .split(" ")
    //     .join("")
    // );
    console.log(this);

    //select highlighted id
    const highlighted = d3.selectAll(
      `#${this.id
        .slice(3)
        .replace(/[^\w\s\']|_/g, "")
        .split(" ")
        .join("")}`
    );
    //set highlighted style and class
    highlighted
      .attr("class", "highlight")
      .style("stroke", "white")
      .style("stroke-width", "2");
    //remove highlighted style
    setTimeout(function () {
      d3.selectAll(".highlight").style("stroke", "none");
    }, 3000);
  }
}
