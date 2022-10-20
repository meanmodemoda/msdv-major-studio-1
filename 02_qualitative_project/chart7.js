async function drawChart() {
  // 1. Access data
  let dataset1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  let dataset2 = [1, 2, 3, 4, 5, 6, 7];

  //2. Draw Canvas
  const width = 800;
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
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  //4. Draw Scale

  const scale1 = d3
    .scaleLinear()
    .domain(d3.extent(dataset1))
    .range([0, dimensions.boundedWidth]);

  const scale2 = d3
    .scaleLinear()
    .domain(d3.extent(dataset2))
    .range([100, dimensions.boundedWidth - 100]);

  const yScale = d3.scaleLinear().domain;
  // .paddingInner(1);

  //Draw Tree

  const topCircle = bounds.append("g");

  topCircle
    .selectAll("g")
    .data(dataset1)
    .join("g")
    .append("circle")
    .attr("r", 7)
    .attr("cy", 100)
    .attr("cx", (d) => scale1(d))
    .style("fill", "red")
    .attr("stroke", "black")
    .style("stroke-width", 0.5);

  const bottomCircle = bounds.append("g");

  bottomCircle
    .selectAll("g")
    .data(dataset2)
    .join("g")
    .append("circle")
    .attr("r", 7)
    .attr("cy", 300)
    .attr("cx", (d) => scale2(d))
    .style("fill", "green")
    .attr("stroke", "black")
    .style("stroke-width", 0.5);

  console.log(scale1(dataset1[9]));

  // Add the links between nodes:

  //
  // const defs = bounds.append("svg:defs");
  // defs
  //   .append("svg:pattern")
  //   .attr("id", "image1")
  //   .attr("width", 20)
  //   .attr("height", 20)
  //   .attr("patternUnits", "useSpaceOnUse")
  //   .append("svg:image")
  //   .attr(
  //     "xlink:href",
  //     "https://raw.githubusercontent.com/muonius/msdv-major-studio-1/54b45a8dedcdd9f3662fa887e4f86b6808f5014e/02_qualitative_project/assets/1.png"
  //   )
  //   .attr("width", 20)
  //   .attr("height", 20)
  //   .attr("x", 0)
  //   .attr("y", 0);
  // .attr("transform", "rotate(90)");
  // Add a circle for each node.
}
drawChart();
