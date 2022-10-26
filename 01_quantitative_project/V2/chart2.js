async function drawChart() {
  // 1. Access data
  let dataset = await d3.csv("./data/score.csv");
  //remove world from region
  const datagoal = dataset.filter((d) => d["Goals"] != "Overall");

  console.log(datagoal);

  datagoal.sort((a, b) => {
    a["Goals"] - b["Goals"];
  });

  // console.log(dataset);
  // console.log(dataworld);
  const regionAccessor = (d) => d["Region"];
  const goalAccessor = (d) => d["Goals"];
  const scoreAccessor = (d) => d["Value"];
  const colorAccessor = (d) => d["Color"];
  // console.log(regionAccessor(dataset[1]));

  // add metric function
  let goal = d3.groups(datagoal, goalAccessor).map((d) => d[0]);
  let region = d3.groups(datagoal, regionAccessor).map((d) => d[0]);
  // region.unshift("World");
  // region = region.slice(0, region.length - 1);

  console.log(region);

  // region = region.slice(0, region.length - 1);

  const sumdata = d3.group(datagoal, (d) => d["Goals"]);
  console.log(sumdata);

  // 2. Create chart dimensions

  const width = 300;
  let dimensions = {
    width: width,
    height: 300,
    radius: width / 2,
    margin: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40,
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

  const getCoordinatesForAngle = (angle, offset = 1) => [
    Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
  ];

  // 4. Create scales

  const goalScale = d3
    .scaleBand()
    .domain(goal)
    .range([0, Math.PI * 2]);

  const worldScale = d3
    .scaleLinear()
    .domain([0, 100])
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

  // 5. Draw data
  // Draw sunburst chart
  function drawArc(metric) {
    // 3. Draw canvas

    const wrapper = d3
      .select("#wrapper")
      .selectAll("svg")
      .data(sumdata)
      .join("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left + dimensions.boundedRadius}px, ${
          dimensions.margin.top + dimensions.boundedRadius
        }px)`
      );
    // 6. Draw peripherals

    let barChart = bounds.append("g");

    barChart
      .selectAll("path")
      .data(sumdata)
      .join("path")
      .attr("class", "bar-chart")
      .attr("fill", colorAccessor)
      .attr("opacity", 0.7)
      .attr("fill", (d) => colorScale((d) => d[0]))
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return radiusScale((d) => d["Value"]);
          })
          .y(function (d) {
            return y(+d.n);
          })(d[1]);
      });

    //6. Draw Interaction
    const tooltip = d3.select("#tooltip");

    barChart.on("mouseover", onMouseEnter).on("mouseleave", onMouseLeave);

    function onMouseEnter(event, datum) {
      d3.select(this);
      // console.log(this);

      tooltip
        .select("#tooltip-region")
        .text(datum["Region"])
        .style("font-weight", "700");

      tooltip
        .select("#tooltip-goal")
        .text(datum["Goals"])
        .style("font-weight", "700")
        .style("color", datum["Color"]);
      // .style("font-size", "16px");

      tooltip
        .select("#tooltip-score")
        .text(`${datum["Value"]}%`)
        .style("font-weight", "700");

      //Format tooltip position
      const x = event.pageX;
      const y = event.pageY;

      // console.log(event.pageX);
      tooltip.style(
        "transform",

        `translate(` + `calc(-5% + ${x}px),` + `calc(5% + ${y}px)` + `)`
      );

      tooltip.style("opacity", 1);
    }

    function onMouseLeave(event) {
      d3.select(this);
      tooltip.style("opacity", 0);
    }
  }

  // drawArc("OECD members");
  drawArc("World");
}
drawChart();
