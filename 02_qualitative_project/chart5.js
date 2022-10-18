async function drawChart() {
  // 1. Access data
  let dataset = await d3.csv("./indicators.csv");
  const group = d3.group(
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
    .attr("height", dimensions.height);
  // .attr("transform", "rotate(180,0,0)");

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

  //4. Draw Scale
  const dataCircle = root.descendants();
  const circleScale = d3
    .scaleLinear()
    .domain(d3.extent(dataCircle, (d) => d.height))
    .range([1, 20]);

  //Draw Tree
  const linksGenerator = d3
    .linkRadial()
    .angle(function (d) {
      return (d.x / 180) * Math.PI;
    })
    .radius(function (d) {
      return d.y;
    });

  // Add the links between nodes:
  bounds
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linksGenerator)
    .style("fill", "none")
    .attr("stroke", "#ccc");

  //
  const defs = bounds.append("svg:defs");
  defs
    .append("svg:pattern")
    .attr("id", "image1")
    .attr("width", 20)
    .attr("height", 20)
    .attr("patternUnits", "useSpaceOnUse")
    .append("svg:image")
    .attr(
      "xlink:href",
      "https://raw.githubusercontent.com/muonius/msdv-major-studio-1/54b45a8dedcdd9f3662fa887e4f86b6808f5014e/02_qualitative_project/assets/1.png"
    )
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", 0)
    .attr("y", 0);
  // .attr("transform", "rotate(90)");
  // Add a circle for each node.
  bounds
    .selectAll("g")
    .data(dataCircle.slice(1))
    .join("g")
    .attr("transform", function (d) {
      return `rotate(${d.x - 90})
      translate(${d.y})`;
    })
    .append("circle")
    .attr("r", (d) => circleScale(d.height))
    .style("fill", "url(#image1)")
    .attr("stroke", "black")
    .style("stroke-width", 0.5);

  console.log(d3.extent(dataCircle, (d) => d.height));
  console.log(root.children[0].children[0].data);
}
drawChart();
