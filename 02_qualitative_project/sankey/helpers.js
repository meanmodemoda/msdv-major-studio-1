const connections = [
  "01. Education, Gender, and Inequality",
  "02. Health, Wellbeing, and Demography",
  "03. Energy Decarbonisation and Sustainable Industry",
  "04. Sustainable Food, Land, Water, and Oceans",
  "05. Sustainable Cities and Communities",
  "06. Digital Revolution for Sustainable Development",
  "Other",
];

const shorty = [
  "Inequalities",
  "Health",
  "Industry",
  "Sustainability",
  "Communities",
  "Digital",
  "Other",
];

//change long text to short text
function swapText() {
  connections.forEach((d, i) => {
    shorthand[d] = shorty[i];
    return shorthand;
  });
}

const nameRange = [
  "01. No Poverty",
  "02. Zero Hunger",
  "03. Good Health and Well-Being",
  "04. Quality Education",
  "05. Gender Equality",
  "06. Clean Water and Sanitation",
  "07. Affordable and Clean Energy",
  "08. Decent Work and Economic Growth",
  "09. Industry, Innovation, and Infrastructure",
  "10. Reduced Inequalities",
  "11. Sustainable Cities and Communities",
  "12. Responsible Consumption and Production",
  "13. Climate Action",
  "14. LIfe below Water",
  "15. Life on Land",
  "16. Peace, Justice and Strong Institutions",
  "17. Partnerships for the Goals",
];

const palette = [
  "#E5233D",
  "#DEA739",
  "#4CA146",
  "#C7212E",
  "#EF402D",
  "#27BFE6",
  "#FBC412",
  "#A21D43",
  "#F26A2E",
  "#E01583",
  "#F89D2A",
  "#BF8D2C",
  "#407F46",
  "#2097D4",
  "#59BA48",
  "#126A9E",
  "#15496B",
];

const palette2 = [
  "#C6202E",
  "#4CA146",
  "#BF8D2D",
  "#2096D3",
  "#F79D2A",
  "#F26A2D",
  "#14699D",
];
