const margin = { top: 10, right: 30, bottom: 20, left: 50 },
  width2 = 200 - margin.left - margin.right,
  height2 = 150 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg2 = d3
  .select("#stack")
  .append("svg")
  .attr("width", width2 + margin.left + margin.right)
  .attr("height", height2 + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

category2 = [
  "Other",
  "Personal care",
  "Paid work or study",
  "Unpaid care work",
  "Leisure",
];

d3.csv("../data/country3.csv").then(function (data) {
  var color2 = d3
    .scaleOrdinal()
    .domain(category2)
    .range(["#FEF793", "#F47F33", "#92C5E1", "#FBBE85", "#AFBAFC"]);
  //.range(["#3C1900","#DDC0B4","#C99F88","#B17E65","#A16A54","#855137","#5F3310"])

  // const pivot = data.map((d) => {
  //   let obj = {};
  //   obj.country = d.country;
  //   obj.gender = d.gender;
  //   obj[d.category] = d.value;
  //   return obj;
  // });

  console.log(data);

  const filtered = data.filter((d) => d.country == "Mexico");

  const xScale = d3
    .scaleBand()
    .domain(["Men", "Women"])
    .range([0, width2])
    .padding([0.05]);

  const yScale = d3.scaleLinear().domain([0, 1]).range([height2, 0]);
  const stackedGen = d3.stack().keys(category2);
  const stackedData = stackedGen(data);
  console.log(stackedData[0]);

  svg2
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)

    .join("g")
    .attr("fill", (d) => color2(d.key))
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data((d) => d)
    .join("rect")
    .attr("class", "men")
    .attr("x", (d) => xScale(d.data["Gender"]))
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth());
});

// // .attr("y", function (d, i) {
// //   row = i / rows;
// //   return rows * squareSize - (row * squareSize + row * gap);
// // });
// // // .append("title")
// // //   .text(function (d,i)
// // //     {
// // //       return "Age range: " + data[d.groupIndex].age + " | " +  d.count + " , " + d.units + "%"
// // //     });

// // //add legend with categorical data
// // // var legend = d3
// // //   .select("#legend1")
// // //   .append("svg")
// // //   .attr("width", 100)
// // //   .attr("height", 150)
// // //   .append("g")
// // //   .selectAll("div")
// // //   .data(data)
// // //   .enter()
// // //   .append("g")
// // //   .attr("transform", function (d, i) {
// // //     return "translate(0," + i * 20 + ")";
// // //   });
// // // legend
// // //   .append("rect")
// // //   .attr("width", 18)
// // //   .attr("height", 18)
// // //   .style("fill", function (d, i) {
// // //     return color(i);
// // //   });
// // // legend
// // //   .append("text")
// // //   .attr("x", 25)
// // //   .attr("y", 13)
// // //   .text(function (d) {
// // //     return d.gender;
// // //   });

// // //add value of a unit square
// // var legend2 = d3
// //   .select("#legend")
// //   .select("svg")
// //   .append("g")
// //   .attr("transform", "translate(100,0)");
