function drawStack() {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width2 = 150 - margin.left - margin.right,
    height2 = 150 - margin.top - margin.bottom,
    category2 = [
      "Other",
      "Personal care",
      "Paid work or study",
      "Unpaid care work",
      "Leisure",
    ];

  let xStackScale, yStackScale, colorStackScale, stackGenerator;

  d3.csv("../data/country.csv").then(function (data) {
    // prepare data and stack generator
    const sumstat = d3.groups(data, (d) => d.Country);
    stackGenerator = d3.stack().keys(category2);
    initializeLayout();
    sumstat.forEach((d) => {
      drawData(d);
    });
  });

  function drawData(d) {
    const stackedData = stackGenerator(d[1]);
    // console.log(stackedData);
    const svg = d3
      .select("#stack")
      .append("svg")
      .attr("clases", d[0])
      .attr("width", width2 + margin.left + margin.right)
      .attr("height", height2 + margin.top + margin.bottom)
      // .attr("viewBox", "0 0 160 160")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      // .attr("transform", `translate(10) rotate(45)`)
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => colorStackScale(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .join("rect")
      .attr("class", "watercolor")
      .attr("x", (d) => xStackScale(d.data.Gender))
      .attr("y", (d) => yStackScale(d[1]))
      .attr("height", (d) => yStackScale(d[0]) - yStackScale(d[1]))
      .attr("width", xStackScale.bandwidth());
  }

  function initializeLayout() {
    colorStackScale = d3
      .scaleOrdinal()
      .domain(category2)
      .range(["#FEF793", "#F47F33", "#92C5E1", "#FBBE85", "#AFBAFC"]);

    xStackScale = d3
      .scaleBand()
      .domain(["Men", "Women"])
      .range([0, width2])
      .padding([0.05]);

    yStackScale = d3.scaleLinear().domain([0, 1]).range([height2, 0]);
  }
}
drawStack();
