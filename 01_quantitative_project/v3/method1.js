// set the dimensions and margins of the graph
const width = 280;
let dimensions = {
  width: width,
  height: width,
  radius: width / 2,
  margin: {
    top: 30,
    right: 50,
    bottom: 30,
    left: 30,
  },
};
dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
dimensions.boundedRadius =
  dimensions.radius - (dimensions.margin.left + dimensions.margin.right) / 2;
innerRadius = 0;
outerRadius = dimensions.boundedWidth / 2;

//Read the data
d3.csv("./data/score.csv").then(function (data1) {
  // group the data: I want to draw one line per group
  const datagoal = data1.filter((d) => d.goal != "Overall");
  const data = data1.filter((d) => d.region != "World");
  // const dataworld = data1.filter((d) => (d.region = "World"));
  const sumstat = d3.group(data1, (d) => d.region); // nest function allows to group the calculation per level of a factor
  const goal = d3.groups(data1, (d) => d.goal).map((d) => d[0]);

  // What is the list of groups?
  const region = new Set(data.map((d) => d.region));

  const regionAccessor = (d) => d.region;
  const goalAccessor = (d) => d.goal;
  const scoreAccessor = (d) => d.value;
  const colorAccessor = (d) => d.color;

  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg = d3
    .selectAll("#my_dataviz")
    .selectAll("charts")
    .data(sumstat)
    .enter()
    .append("div")
    .attr("id", "a")
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

  const peripherals = svg.append("g");

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
        .attr("fill", "#f8f9fa");
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

  // Draw the line
  svg
    .selectAll("path")
    .data(function (d) {
      return d[1];
    })
    .join("path")
    .attr("class", "bar-chart")
    .attr("opacity", 0.7)
    .attr("fill", (d) => colorScale(goalAccessor(d)))
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
    );

  // .attr("d", function (d) {
  //   return d3
  //     .line()
  //     .x(function (d) {
  //       return x(d.goal);
  //     })
  //     .y(function (d) {
  //       return y(+d.value);
  //     })(d[1]);
  // });

  // Add titles
  svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function (d) {
      return d[0];
    })
    .style("fill", function (d) {
      return color(d[0]);
    });

  textPath
    .selectAll("path")
    .data(datagoal.filter((d) => regionAccessor(d) == "World"))
    .join("path")
    .attr("opacity", 0)
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(dimensions.boundedRadius)
        .outerRadius(dimensions.boundedRadius + 15)
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
      // .style("font-size", "8px")
      .text(r.split(" ")[0].slice(0, 2));
  });
});
