async function drawChart() {
  // 1. Access data
  let dataset = await d3.csv("./indicators.csv");
  group = d3.group(
    dataset,
    (d) => d["Transformation"],
    (d) => d["Goal"],
    (d) => d["Target"]
  );

  const root = d3.hierarchy(group);
  // console.log(hierarchy.children[0].data);

  //2. Draw Canvas
  const width = 800;
  let dimensions = {
    width: width,
    height: width,
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
    .attr("height", dimensions.height)
    .attr("transform", "rotate(270,0,0)");

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const cluster = d3
    .cluster()
    .size([dimensions.height+300, dimensions.width - 300]);

  cluster(root);

  //Draw Tree
  const dataCircle=root.descendants()

  const circleScale = d3.scaleRadial()
  .domain(d3.extent(dataCircle, d=>d.height))
  .range([1,7])
  // Add the links between nodes:
  bounds
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("d", function (d) {
      return (
        "M" +
        d.y +
        "," +
        d.x +
        "C" +
        (d.parent.y +50)+
        "," +
        d.x +
        " " +
        (d.parent.y + 50) +
        "," +
        d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
        " " +
        d.parent.y +
        "," +
        d.parent.x
      );
    })
    .style("fill", "none")
    .attr("stroke", "#ccc");

  // Add a circle for each node.
  bounds
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", function (d) {
      return `translate(${d.y},${d.x})`;
    })
    .append("circle")
    .attr("r", d=>circleScale(d.height))
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
    .style("stroke-width", 2);
}
drawChart();
