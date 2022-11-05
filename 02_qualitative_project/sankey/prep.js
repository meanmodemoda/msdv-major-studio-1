//1. Initiate Sankey
const _sankey = d3
  .sankey()
  .nodeWidth(0)
  .nodeAlign(d3.sankeyJustify)
  .nodePadding(1.5)
  .nodeSort(null)
  .iterations(5)
  .extent([
    [width / 1.45, 10],
    [width - 2, height - 75],
  ]);

const sankey = ({ nodes, links }) =>
  _sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

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

  // console.log(sankeydata.nodes);

  // return only the distinct / unique nodes

  let unique = [];

  sankeydata.nodes.forEach((d, i) => {
    if (!unique.includes(d.name)) unique.push(d.name);
  });
  // console.log(unique);
  sankeydata.nodes = Array.from(unique);

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
  graph.links.forEach((d, i) => {
    if (d.source.height == 2) {
      // d.x1 = d.x1 - 4;
      // d.source.x0 = d.source.x0 - 10;
      d.target.x0 = d.target.x0 - 10;
      d.target.x1 = d.target.x1 - 10;
    }
    // if (d.source.height == 1) {
    //   d.source.x1 = d.source.x1 + 20;
    //   // d.source.x0 = d.source.x0 - 50;
    // }
  });

  console.log(graph.links);
}

//helper function
const imgPicker = (str) => {
  const newStr = str.split(" ")[0].slice(0, 2);
  return newStr;
};

//helper function
const convertName = (name) => {
  if (name != "Other") {
    return name.slice(4);
  } else {
    return name;
  }
};
