// set the dimensions and margins of the graph
const width = 300;
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

const svg = d3.select("#my_dataviz");

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
  displayData(data);
  appendImage();
});

function displayData(data) {
  // group the data: I want to draw one line per group

  const datagoal = data.filter((d) => d.goal != "Overall");
  const sumstat = d3.groups(datagoal, (d) => d.region); // nest function allows to group the calculation per level of a factor
  const goal = d3.groups(data, (d) => d.goal).map((d) => d[0]);

  console.log(goal);
  // get unique list of regions
  const region = Array.from(sumstat).map((d) => d[0]);
  const regionAccessor = (d) => d.region;
  const goalAccessor = (d) => d.goal;
  const scoreAccessor = (d) => d.value;
  const colorAccessor = (d) => d.color;

  console.log(region);
  // sumstat.forEach((d) => console.log(d));
  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  regionAlias = ["esa", "eeca", "laca", "mena", "oc", "oecd", "ss", "world"];
  // .selectAll("chart")
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
    //draw scales
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

    // Draw the path
    chart
      .append("g")
      .selectAll("path")
      .data(d[1])
      .join("path")
      .attr("class", "bar-chart")
      .attr("opacity", 0.7)
      .attr("fill", (d) => d.Color)
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

    //Add titles
    chart
      .append("g")
      .append("text")
      .attr("y", dimensions.boundedRadius + 45)
      .attr("x", 0)
      .text(d[0])
      .attr("text-anchor", "middle");
    // .style("fill", function (d) {
    //   return color(d[0]);
    // });

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
        .style("font-size", "12px")
        .text(r.split(" ")[0].slice(0, 2));
    });
  });
}

function appendImage() {
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
  for (let i = 1; i <= 17; i++) {
    menu
      .append("embed")
      // this is calling the svg that has the corressponding name w/ the attr
      .attr("src", "assets/" + i + ".svg")
      .attr("class", "graphic")
      .attr("class", goal[i])
      .attr("width", "80px");
  }
}

d3.selectAll(".graphic").on("click", function (e) {
  console.log(this.id);
  e.preventDefault();
});
