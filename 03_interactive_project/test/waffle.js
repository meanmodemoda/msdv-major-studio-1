var total = 0;
var columns = 52,
  rows = 48,
  squareSize = 8,
  squareValue = 1,
  gap = 2,
  theData = [];
category = [
  "Leisure",
  "Unpaid work",
  "Paid work or study",
  "Personal care",
  "Other",
];

d3.csv("../data/age.csv").then(function (data) {
  var color = d3
    .scaleOrdinal()
    .domain(category)
    .range(["#AFBAFC", "#FBBE85", "#92C5E1", "#F47F33", "#FEF793"]);
  //.range(["#3C1900","#DDC0B4","#C99F88","#B17E65","#A16A54","#855137","#5F3310"])
  const data1 = d3.groups(data, (d) => d.gender);

  data1.forEach((data) => {
    sumstat = d3.groups(data[1], (d) => d.age);
    //total
    total = rows * columns;
    //value of a square
    sumstat.forEach((age) => {
      // //remap data
      age[1].forEach(function (d, i) {
        d.week = +d.week;
        d.units = Math.floor(d.week / squareValue);
        theData = theData.concat(
          Array(d.units + 1)
            .join(1)
            .split("")
            .map(function () {
              return {
                age: +age[0],
                squareValue: squareValue,
                units: d.units,
                category: d.category,
              };
            })
        );
      });
    });

    width = squareSize * columns + columns * gap + 25;
    height = squareSize * rows + rows * gap + 25;

    const uniqueAge = theData
      .map((d) => d.age)
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, []);

    const yScale = d3
      .scaleBand()
      .range([0, height])
      .domain(uniqueAge)
      .padding(0.1);

    var waffle = d3
      .select("#waffle1")
      .append("svg")
      .attr("class", data[0].toLowerCase())
      .attr("width", width)
      .attr("height", height);

    waffle
      .append("g")
      .selectAll("rect")
      .data(theData)
      .join("rect")
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", function (d) {
        return color(d.category);
      })
      .attr("x", function (d, i) {
        //group n squares for column
        colIndex = Math.floor(i % columns);
        return colIndex * squareSize + colIndex * gap;
      })
      .attr("y", (d) => yScale(d.age));
  });
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
