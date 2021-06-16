// This function is here for the time being to avoid cluttering other files,
// However given its integration with graphs it will need to be placed in viz.js or wherever
// graphs will be generated from as it needs to use most of their attributes
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
    }
    XAxis.transition().duration(1000).call(d3.axisBottom(x))
    YAxis.transition().duration(1000).call(d3.axisLeft(y))
    scatter.selectAll("circle")
    .transition().duration(1000)
    .attr("cx", function (d) { return x(d.Sepal_Length); } )
    .attr("cy", function (d) { return y(d.Petal_Length); } )
    //TODO Find a way to propagate this event to the other existing graphs to match the same zoom
}