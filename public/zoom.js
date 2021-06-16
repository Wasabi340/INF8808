// This function is here for the time being to avoid cluttering other files,
// However given its integration with graphs it will need to be placed in viz.js or wherever
// graphs will be generated from as it needs to use most of their attributes
// See https://www.d3-graph-gallery.com/graph/interactivity_zoom.html for the full example
var x = d3.scaleLinear()
    .domain([4, 8])
    .range([ 0, width ]);
  var xAxis = Svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 9])
    .range([ height, 0]);
  Svg.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = Svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Add brushing
  var brush = d3.brush()      // Add the brush feature using the d3.brush function
      .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = Svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Sepal_Length); } )
      .attr("cy", function (d) { return y(d.Petal_Length); } )
      .attr("r", 8)
      .style("fill", function (d) { return color(d.Species) } )
      .style("opacity", 0.5)

  // Add the brushing
  scatter
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout
  function idled() { idleTimeout = null; }
function updateChart() {
    extent = d3.event.selection;

    if (!extent) {
        if (!idleTimeout) 
            return idleTimeout = setTimeout(idled, 350);
        x.domain([0,1]); //TODO, Change 0,1 by the extremums of the x axis
        y.domain([0,1]); //TODO, Change 0,1 by the extremums of the y axis
    } else {
        //TODO Might need to redo these two lines as they used a 1D brush rather than 2D so extent is defined differently
        // Check https://github.com/d3/d3-brush/blob/main/src/brush.js#L162
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        y.domain([ y.invert(extent[0]), y.invert(extent[1]) ])
        scatter.select(".brush").call(brush.move, null);
    }
    XAxis.transition().duration(1000).call(d3.axisBottom(x))
    YAxis.transition().duration(1000).call(d3.axisLeft(y))
    scatter.selectAll("circle")
    .transition().duration(1000)
    .attr("cx", function (d) { return x(d.Sepal_Length); } )
    .attr("cy", function (d) { return y(d.Petal_Length); } )
    //TODO Find a way to propagate this event to the other existing graphs to match the same zoom
}