var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value
let summary = document.querySelector("#summary");
summary.innerHTML = `<p>On average, at the age of <span>18</span>, women have 1 weeks less leisure time than men.`;

let comparison = {
  Men: { Leisure: 13, "Unpaid care work": 10, "Paid work or study": 4 },
  Women: { Leisure: 12, "Unpaid care work": 10, "Paid work or study": 4 },
};

let diff = {
  Leisure: 0,
  "Unpaid care work": 0,
  "Paid work or study": 0,
};

let waffle;
let leisureDiff, unpaidDiff, paidDiff;

//Section 2: Create Waffle Chart
let columns = 52,
  rows = 48,
  squareSize = 8,
  squareValue = 1,
  gap = 2,
  total = rows * columns,
  category = [
    "Leisure",
    "Unpaid care work",
    "Paid work or study",
    "Personal care",
    "Other",
  ],
  width = squareSize * columns + columns * gap + 25,
  height = squareSize * rows + rows * gap + 25;

let waffleData = [],
  // let newData,
  uniqueAge,
  colorWaffleScale,
  yWaffleScale;

d3.csv("../data/age.csv").then(function (data) {
  const dataGender = d3.groups(data, (d) => d.gender);
  // Initial setup
  dataGender.forEach((data) => {
    prepareData(data);
    initializeLayout();
    drawWaffle(data, waffleData, 18);
  });
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    clearLayout();
    const waffleGender = d3.groups(waffleData, (d) => d.gender);
    waffleGender.forEach((d) => {
      initializeLayout();
      drawWaffle(d, d[1], this.value);
    });
    output.innerHTML = this.value;
    if (this.value > 18) {
      calculator(data, this.value, comparison);
    } else {
      summary.innerHTML = `<p>On average, at the age of <span>18</span>, women have 1 weeks less leisure time than men.`;
    }
  };
});

function drawWaffle(data, data2, age) {
  let newData = data2.filter((d) => d.age <= age);
  waffle = d3
    .select("#waffle")
    .append("svg")
    .attr("id", data[0].toLowerCase())
    .attr("class", "watercolor")
    .attr("width", width)
    .attr("height", height);

  waffle
    .append("g")
    .selectAll("rect")
    .data(newData)
    .join("rect")
    .attr("width", squareSize)
    .attr("height", squareSize)
    .attr("fill", (d) => colorWaffleScale(d.category))
    .attr("x", function (d, i) {
      //group n squares for column
      colIndex = Math.floor(i % columns);
      return colIndex * squareSize + colIndex * gap;
    })
    .attr("y", (d) => yWaffleScale(d.age));
}

function prepareData(data) {
  //Preparere data
  sumstat = d3.groups(data[1], (d) => d.age);
  sumstat.forEach((age) => {
    age[1].forEach(function (d, i) {
      d.week = +d.week;
      d.units = Math.floor(d.week / squareValue);
      waffleData = waffleData.concat(
        Array(d.units + 1)
          .join(1)
          .split("")
          .map(function () {
            return {
              gender: data[0],
              age: +age[0],
              squareValue: squareValue,
              units: d.units,
              category: d.category,
            };
          })
      );
    });
  });

  // console.log(waffleData)
  uniqueAge = waffleData
    .map((d) => d.age)
    .reduce((acc, curr) => {
      if (!acc.includes(curr)) {
        acc.push(curr);
      }
      return acc;
    }, []);
}

function initializeLayout() {
  //initalize Layout
  yWaffleScale = d3
    .scaleBand()
    .range([0, height])
    .domain(uniqueAge)
    .padding(0.1);

  colorWaffleScale = d3
    .scaleOrdinal()
    .domain(category)
    .range(["#AFBAFC", "#FBBE85", "#92C5E1", "#F47F33", "#FEF793"]);
}

function calculator(data, sliderValue, comparison) {
  const gender = Object.keys(comparison);
  gender.forEach((g) => {
    para = Object.keys(comparison[g]);
    para.forEach((p) => {
      comparison[g][p] = data
        .filter((d) => d.gender == g && d.age <= sliderValue && d.category == p)
        .reduce((acc, curr) => {
          acc += Number(curr.week);
          return acc;
        }, 0);

      diff[p] = Math.abs(comparison["Men"][p] - comparison["Women"][p]);
    });
  });

  let summary = document.querySelector("#summary");
  summary.innerHTML = `<p>By age of <span>${sliderValue}</span>,women have ${diff["Leisure"]} weeks less leisure time and ${diff["Unpaid care work"]} weeks more unpaid care time than men. They also have ${diff["Paid work or study"]} weeks less paid work or study.</p>`;
}

function clearLayout() {
  d3.selectAll("#waffle").html("");
}
