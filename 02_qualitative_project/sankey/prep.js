function prepData(data) {
  const sankeydata = {
    nodes: [],
    links: [],
  };

  //trasform csv data into flow chart data
  data.forEach(function (d) {
    sankeydata.nodes.push({
      name: d.source,
    });
    sankeydata.nodes.push({
      name: d.target,
    });
    sankeydata.links.push({
      source: d.source,
      target: d.target,
      value: +d.value,
    });
  });

  // console.log(data[0]);

  // return only the distinct / unique nodes
  const unique = d3
    .nest()
    .key((d) => d.name)
    .entries(sankeydata.nodes);

  sankeydata.nodes = unique.map((d) => d.key);
  // console.log(sankeydata.nodes);

  // console.log(sankeydata.nodes);
  // loop through each link replacing the text with its index from node
  sankeydata.links.forEach(function (d, i) {
    sankeydata.links[i].source = sankeydata.nodes.indexOf(
      sankeydata.links[i].source
    );
    sankeydata.links[i].target = sankeydata.nodes.indexOf(
      sankeydata.links[i].target
    );
  });

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  sankeydata.nodes.forEach(function (d, i) {
    sankeydata.nodes[i] = {
      name: d,
    };
  });
  graph = sankey(sankeydata);
}
