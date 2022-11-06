This visualization is the second qualitative project in my Major Studio 1 class as part of the study of the MS Data Visualization program. It turns SDG's multi-layer structure into a Sankey tree format. I customized the Sankey diagram by changing the layout design and adding in additional SVG elements.

### Data

The data includes 6 SDG transformation focuses, 17 goals and 169 targets. I converted the data programatically from CSV to a Sankey node/link file format.

<img src="../assets/data_prep.png" width="600" alt="Data Prep">

### Prototype

Thanks to professor Richard The's guidance, I went through 3 rounds of iterations and was able to significantly improve the aesthetics and readability of the graph. The chart is built with d3.js and vanilla Javascript.

#### Sketch

<img src="./assets/sketch.JPG" width="500" alt="sketch">
<br>
[Current Iteration](https://muons.com/msdv-major-studio-1/01_quantitative_project/v3)

<img src="./assets/demo.gif" width="500" alt="Version 3">

In this final iternation, I was able to customize the existing Sankey format and adding in additional SVG elements and bind data to it. I also further improved the hover-over effect so the entire hierachical structure can be highlighted instead of just highlighting the links and nodes separately.

### Previous versions

#### Version 1

<img src="./assets/v1.png" width="500" alt="Version 1">

#### Version 2

<img src="./assets/v2.png" width="500" alt="Version 2">

In the first two iterations I was having trouble formatting the Sankey chart freely to suite my design and functional needs. I spent a signficant amount of time understanding the source code better and was able to eventually improve the visualization to its current iteration.
