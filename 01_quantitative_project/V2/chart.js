async function drawChart() {
  // 1. Access data
  let dataset = await d3.csv("./data/score.csv");
  //remove world from region
  const datagoal = dataset.filter((d) => d.goal != "Overall");

  console.log(datagoal);

  datagoal.sort((a, b) => {
    a["Goals"] - b["Goals"];
  });

  // console.log(dataset);
  // console.log(dataworld);
  const regionAccessor = (d) => d.region;
  const goalAccessor = (d) => d.goal;
  const scoreAccessor = (d) => d.value;
  const colorAccessor = (d) => d.color;
  // console.log(regionAccessor(dataset[1]));

  // add metric function
  let goal = d3.groups(datagoal, goalAccessor).map((d) => d[0]);
  let region = d3.groups(datagoal, regionAccessor).map((d) => d[0]);
  // region.unshift("World");
  // region = region.slice(0, region.length - 1);

  console.log(goal);

  // region = region.slice(0, region.length - 1);

  const sumdata = d3.group(datagoal, (d) => d["Goals"]);
  console.log(sumdata);

  // 2. Create chart dimensions

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

  const getCoordinatesForAngle = (angle, offset = 1) => [
    Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
  ];

  // 3. Draw canvas

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
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
    // 6. Draw peripherals

    const peripherals = bounds.append("g");

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

    let barChart = bounds.append("g");

    barChart
      .selectAll("path")
      .data(datagoal.filter((d) => regionAccessor(d) == metric))
      .join("path")
      .attr("class", "bar-chart")
      .attr("fill", colorAccessor)
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

  drawArc("OECD members");
  // drawArc("World");
}
drawChart();
