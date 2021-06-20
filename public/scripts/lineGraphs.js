function getFakeData(){
    
    let data = {
        points: []
    }
    
    for(let i = 0; i < 100; i ++){
        data.points[i] = [Math.random()*101,Math.random()*101]
    }
    
    return data
}
let globalXAxis;
let globalYAxis;
let globalX;
let globalY;
let globalG;
let globalBrush;
export function build () {
    console.log('building linegraphs')
    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '100%')
    let g = d3.select('.line-graphs svg')
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = 100 // Height for a linegraph is limited to a given size and is not bound by the bounding rect (TODO Experiment to find sweet spot)
    let margin = {
        top:0.05,
        bottom:0,
        left:0.20,
        right:0.20
    }
    let x = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left*maxWidth,maxWidth-margin.right*maxWidth]);
    let xAxis = g.append("g")
    .attr("transform", "translate(0," + maxHeight + ")")
    .call(d3.axisBottom(x));
    let y = d3.scaleLinear()
    .domain([100, 0])
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight]);
    let yAxis = g.append("g")
    .attr("transform", "translate("+margin.left*maxWidth+",0)")
    .call(d3.axisLeft(y));
    
    let brush = d3.brush()
    .extent([[margin.left*maxWidth,margin.top*maxHeight],[maxWidth-margin.right*maxWidth,maxHeight-margin.bottom*maxHeight]])
    .on("end", updateChart);
    
    g.append('g')
    .attr('class','brush')
    .call(brush)

    //Set all global variable (temp solution for testing remove later)
    globalXAxis = xAxis;
    globalYAxis = yAxis;
    globalX = x;
    globalY = y;
    globalG = g;
    globalBrush = brush;

    let fakeData = getFakeData()
    g.selectAll("circle")
    .data(fakeData.points)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", 8)
      .style("fill", "#440154ff" )
      .style("opacity", 0.5)
    
}
var idleTimeout;
function idled() { idleTimeout = null; }
function updateChart({selection}){
    console.log(selection)
    if(!selection){
        if (!idleTimeout)
            return idleTimeout = setTimeout(idled, 350);
        globalX.domain([0,100]); //These are the same as the x,y variables in the build function
        globalY.domain([100,0]);
    } else {
        globalX.domain([ globalX.invert(selection[0][0]), globalX.invert(selection[1][0]) ]);
        globalY.domain([ globalY.invert(selection[0][1]), globalY.invert(selection[1][1]) ]);
        globalG.select(".brush").call(globalBrush.move, null);
    }
    globalXAxis.transition().duration(1000).call(d3.axisBottom(globalX))
    globalYAxis.transition().duration(1000).call(d3.axisLeft(globalY))
    globalG.selectAll("circle")
    .transition().duration(1000)
    .attr("cx", function (d) { return globalX(d[0]); } )
    .attr("cy", function (d) { return globalY(d[1]); } )
}