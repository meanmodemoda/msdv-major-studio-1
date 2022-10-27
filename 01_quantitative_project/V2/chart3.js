// set the dimensions and margins of the graph
const width = 400;
let dimensions = {
  width: width,
  height: width,
  radius: width / 2,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
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
d3.csv("./data/score.csv").then(function (data) {
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.region); // nest function allows to group the calculation per level of a factor
  const goal = d3.groups(data, (d) => d.goal).map((d) => d[0]);

  console.log(goal);
  // What is the list of groups?
  const region = new Set(data.map((d) => d.region));

  const regionAccessor = (d) => d.region;
  const goalAccessor = (d) => d.goal;
  const scoreAccessor = (d) => d.value;
  const colorAccessor = (d) => d.color;

  // console.log(allKeys);
  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg = d3
    .select("#my_dataviz")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left + dimensions.boundedRadius}px, ${
        dimensions.margin.top + dimensions.boundedRadius
      }px)`
    );

  // Add X axis --> it is a date format
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
});
