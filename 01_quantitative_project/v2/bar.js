// set the dimensions and margins of the graph
const margin = { top: 30, right: 0, bottom: 30, left: 50 },
  width = 810 - margin.left - margin.right,
  height = 210 - margin.top - margin.bottom;

//Read the data
d3.csv("./data/score.csv").then(function (data) {
  // group the data: I want to draw one line per group
  const sumstat = d3.group(data, (d) => d.region); // nest function allows to group the calculation per level of a factor
  const goal = d3.groups(data, (d) => d.goal).map((d) => d[0]);

  console.log(goal);
  // What is the list of groups?
  allKeys = new Set(data.map((d) => d.region));

  // console.log(allKeys);
  // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
  const svg = d3
    .select("#my_dataviz")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  console.log(
    d3.extent(data, function (d) {
      return d.goal;
    })
  );

  // Add X axis --> it is a date format
  const x = d3.scaleBand().domain(goal).range([0, width]).padding(0.02);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(17));

  //Add Y axis
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y).ticks(5));

  // color palette
  const color = d3
    .scaleOrdinal()
    .domain(allKeys)
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

  const color2 = d3
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

  // Draw the line
  svg
    .selectAll(".bar")
    .data(function (d) {
      return d[1];
    })
    .join("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.goal);
    })
    .attr("y", function (d) {
      return y(+d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", (d) => color2(d.goal));

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
