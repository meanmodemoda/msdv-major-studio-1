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
  console.log(root.children[0].children[0].children[0].data);

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
    .attr("height", dimensions.height)
    .attr("transform", "rotate(90,0,0)");

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left + dimensions.radius}px, ${
        dimensions.margin.top + dimensions.radius
      }px)`
    );

  const cluster = d3.cluster().size([360, dimensions.radius - 69]);

  cluster(root);

  //Draw Tree

  const linksGenerator = d3
    .linkRadial()
    .angle(function (d) {
      return (d.x / 180) * Math.PI;
    })
    .radius(function (d) {
      return d.y;
    });

    const dataCircle=root.descendants()

  const circleScale = d3.scaleRadial()
  .domain(d3.extent(dataCircle, d=>d.height))
  .range([1,7])
  // Add the links between nodes:
  bounds
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linksGenerator)
    .style("fill", "none")
    .attr("stroke", "#ccc");

  // Add a circle for each node.
  bounds
    .selectAll("g")
    .data(root.descendants().slice(1))
    .join("g")
    .attr("transform", function (d) {
      return `rotate(${d.x - 90})
      translate(${d.y})`;
    })
    .append("circle")
    .attr("r", d=>circleScale(d.height))
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
    .style("stroke-width", 2);

    console.log(d3.extent(dataCircle, d=>d.height))
}
drawChart();
