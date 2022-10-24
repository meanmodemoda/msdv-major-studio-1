async function drawChart() {
  // 1. Access data
  let dataset = await d3.csv("./data/score.csv");
  //remove world from region
  const dataregion = dataset.filter((d) => d["Goals"] != "Overall");

  console.log(dataregion);

  dataregion.sort((a, b) => {
    a["Goals"] - b["Goals"];
  });

  const dataworld = dataset.filter((d) => d["Region"] == "World");
  // console.log(dataset);
  // console.log(dataworld);
  const regionAccessor = (d) => d["Region"];
  const goalAccessor = (d) => d["Goals"];
  const scoreAccessor = (d) => d["Value"];
  const colorAccessor = (d) => d["Color"];
  // console.log(regionAccessor(dataset[1]));

  // add metric function
  let goal = d3
    .groups(dataregion, goalAccessor, regionAccessor)
    .map((d) => d[0]);

  // region.unshift("World");
  // region = region.slice(0, region.length - 1);

  console.log(goal);

  // region = region.slice(0, region.length - 1);

  const sumdata = d3.group(dataregion, (d) => d["Goals"]);
  // console.log(sumdata);

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
    .data(dataregion.filter((d) => regionAccessor(d) == "World"))
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

  //draw region label
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

  // 5. Draw data
  // Draw sunburst chart
  function drawArc(metric) {
    let barChart = bounds
      .selectAll(".bar-chart")
      .data(dataregion.filter((d) => regionAccessor(d) == metric));

    barChart.exit().remove();

    const newBarChart = barChart.enter().append("g").attr("class", "bar-chart");

    newBarChart.append("path");

    barChart = newBarChart.merge(barChart);

    const bars = barChart
      .select("path")
      .transition()
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

    //Draw world arc chart
    let worldChart = bounds
      .selectAll(".world-chart")
      .data(dataworld.filter((d) => goalAccessor(d) == metric));

    worldChart.exit().remove();

    const newWorldChart = worldChart
      .enter()
      .append("g")
      .attr("class", "world-chart");

    newWorldChart.append("path");

    worldChart = newWorldChart.merge(worldChart);

    const world = worldChart
      .transition()
      .select("path")
      .attr("fill", colorAccessor)
      .attr("opacity", 0.7)
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(0)
          .outerRadius(70)
          .startAngle(0)
          .endAngle((d) => worldScale(scoreAccessor(d)))
      );

    //add white box behind world label
    worldChart
      .append("rect")
      .attr("y", -12)
      .attr("x", -26)
      .attr("width", 50)
      .attr("height", 20)
      .attr("fill", "#f8f9fa")
      .attr("opacity", 1);

    //add world Label
    const worldLabel = worldChart
      .append("text")
      .attr("x", -24)
      .attr("y", 0)
      .text("World")
      .attr("class", "tick-label")
      .style("font-size", "1em");

    //6. Draw Interaction
    const tooltip = d3.select("#tooltip");

    barChart.on("mouseover", onMouseEnter).on("mouseleave", onMouseLeave);

    worldChart.on("mouseover", onMouseEnter).on("mouseleave", onMouseLeave);

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

  d3.selectAll(".swiper-slide").on("click", function (e) {
    console.log(this.id);
    e.preventDefault();
    drawArc(this.id);
  });

  drawArc("World");
  // const chartLabel = bounds.append("g");
  // chartLabel

  //in svg you can't use z-index

  // 6. Draw peripherals, part II

  // 7. Set up interactions
}
drawChart();
