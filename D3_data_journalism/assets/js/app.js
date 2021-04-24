// Setting the dimensions for the SVG container
var svgWidth = 800, svgHeight = 560;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 75,
    left: 40
  };
  
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Selecting the body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(journalData) {
    journalData.poverty = +journalData.poverty;
    journalData.healthcare = +journalData.healthcare;
    return journalData;
}).then(function(journalData){
    console.log(journalData);

// Create scale functions
var xLinearScale = d3.scaleLinear()
  .domain([8, d3.max(journalData, function(d){
  return +d.poverty;
  })])
  .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
  .domain([2, d3.max(journalData, function(d){
  return +d.healthcare;
  })]).range([chartHeight, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append Axes to the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);
  
chartGroup.append("g")
  .call(leftAxis);

// Create Circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .classed("stateCircle", true);

// Populating the circle with abbreviation
chartGroup.selectAll("div")
    .data(journalData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .classed("stateText", true)
    .attr("alignment-baseline", "central")

// Initialize the tool tip
var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([-10, 40])
  .html(function(d) {
    return (`${d.abbr}<br>Healthcare: ${d.healthcare}%<br>Poverty: ${d.poverty}%`);
  });

// Create tooltip in the chart
chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
circlesGroup.on("click", function(journalData) {
  toolTip.show(journalData, this);
})

// on-mouse out event
.on("mouseout", function(journalData, index) {
  toolTip.hide(journalData);
});

// Create axes labels for both axes
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - chartMargin.left -4)
  .attr("x", 0 - (chartHeight / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");
  

chartGroup.append("text")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
  .attr("class", "axisText")
  .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});