import { isGlobal } from "./menu.js";

function getFakeData(){
    
    let data = {
        graphs: []
    }
    
    for(let i = 0; i < 40; i ++){
        data.graphs.push({
            name:`Case ${i+1}`,
            metric:Math.floor(Math.random() * 101),
            points:[]
        })
        for(let j = 0; j < 100; j++){
            data.graphs[i].points.push([Math.random()*101,Math.random()*101]);
        }
    }
    
    return data
}
const windowHeight = [0,7500];
const graphScale = d3.scaleLinear()
.domain([0, 40])
.range(windowHeight);

export function build () {
    //TODO these two variables are arbitrary to set the graphs to their proper size, find a way to set it 
    //Using maxHeight and other variables
    let windowHeight = [0,7500];
    let yAxisHeight = [150,20]
    console.log('building linegraphs')
    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '1700%')
    let g = d3.select('.line-graphs svg')
    
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height // Height for a linegraph is limited to a given size and is not bound by the bounding rect (TODO Experiment to find sweet spot)
    let margin = {
        top:0.05,
        bottom:0.03,
        left:0.20,
        right:0.20
    }
    let fakeData = getFakeData()

    let graphScale = d3.scaleLinear()
    .domain([0, fakeData.graphs.length])
    .range(windowHeight);

    let init = g.selectAll('g')
    .data(fakeData.graphs)
    .enter()
    .append('g')
    .attr('class','graph')

    init.append('text')
    .attr('class','name')
    .text((d)=>d.name)

    init.append('text')
    .attr('class', 'metric')
    .text((d)=>d.metric)

    let x = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left*maxWidth,maxWidth-margin.right*maxWidth]);

    let xAxis = init.append('g')
    .attr("transform", "translate(0," + 150 + ")")
    .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
    .domain([0, 100])
    .range(yAxisHeight);

    let yAxis = init.append("g")
    .attr("transform", "translate("+margin.left*maxWidth+",0)")
    .call(d3.axisLeft(y));

    init.append('defs').append('svg:clipPath')
    .attr('id','clip')
    .append('svg:rect')
    .attr('width', maxWidth-margin.right*maxWidth - margin.left*maxWidth)
    .attr('height', maxHeight - margin.top*maxHeight)
    .attr("x", margin.left*maxWidth)
    .attr("y", margin.top*maxHeight);

    let groups = g.selectAll('g.graph');
    groups.attr('transform',(d,i) => `translate(0 ,${graphScale(i)})`);

    let names = groups.selectAll('text.name')
    names.attr('x', maxWidth/2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')

    let metrics = groups.selectAll('text.metric')
    metrics.attr('x', margin.left*maxWidth/2)
    .attr('y', 75)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')


    init.selectAll('circle.point')
    .data((d)=>d.points)
    .enter()
    .append('circle')
    .attr('class','map')
    .attr("cx", function (d) { return x(d[0]); } )
    .attr("cy", function (d) { return y(d[1]); } )
    .attr("r", 3)
    .style("fill", "#440154ff" )
    .style("opacity", 0.5)
    /*let x = d3.scaleLinear()
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
    .call(d3.axisLeft(y));*/
    
    /*let brush = d3.brushX()
    .extent([[margin.left*maxWidth,margin.top*maxHeight],[maxWidth-margin.right*maxWidth,maxHeight-margin.bottom*maxHeight]])
    .on("end", updateChart);
    /*
    g.append('defs').append('svg:clipPath')
    .attr('id','clip')
    .append('svg:rect')
    .attr('width', maxWidth-margin.right*maxWidth - margin.left*maxWidth)
    .attr('height', maxHeight - margin.top*maxHeight)
    .attr("x", margin.left*maxWidth)
    .attr("y", margin.top*maxHeight)

    g = g.append('g')
    .attr("clip-path", "url(#clip)");

    g.append('g')
    .attr('class','brush')
    .call(brush)

    //Set all global variable (temp solution for testing remove later)
    globalXAxis = xAxis;
    globalX = x;
    globalG = g;
    globalBrush = brush;

    
    g.selectAll("circle")
    .data(fakeData.graphs[0].points)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", 8)
      .style("fill", "#440154ff" )
      .style("opacity", 0.5)*/
    
}
/**
 * Removes the graph specified by the given name from the viewable linegraphs
 * Additionally removes said graph from the saved graph list
 *
 * @param {string} title The title of the graph (This title matches the one saved within the graph object located in the graphList)
 */
export function removeGraph(title){

    /*
    console.log("Removing graph " + title)
    let graphToRemove = d3.select('.line-graphs svg').select(`.${title} svg`).remove()
    //Finds the graph matching the given title and removes it from the array
    if(isGlobal){
        currentGlobalGraphList.splice(currentGlobalGraphList.findIndex((graph) => graph.title.equals(title)),1)
    }else {
        currentCaseGraphList.splice(currentCaseGraphList.findIndex((graph) => graph.title.equals(title)),1)
    }
    redrawGraphs();
    */
}
/**
 * Adds the graph specified by the given name to the viewable linegraphs
 * Additionally adds said graph to the saved graph list
 *
 * @param {string} title The title of the graph (This title matches the one saved within the graph object located in the graphList)
 */
export function addGraph(title){
    let graphMargins = {
        top:0.05,
        bottom:0.05,
        right:0.2,
        left:0.2,
    }
    //TODO Query the data required for this entry before this 
    console.log("Adding graph " + title)
    let g = d3.select('.line-graphs svg')
    let graph = g.append('g')
    .attr('class','graph')
    .attr('id',title)
    let gridWidth = g.node().getBoundingClientRect().width
    let gridHeight = g.node().getBoundingClientRect().height
    let xExtremums = [0,100] //This value changes based on the given data of the graph
    let yExtremums = [0,100] //This value changes based on the given data of the graph
    let xScale = d3.scaleLinear()
    .domain(xExtremums)
    .range([graphMargins.left*gridWidth,gridWidth-graphMargins.right*gridWidth])
    let yScale = d3.scaleLinear()
    .domain(yExtremums)
    .range([150,20]);
    let xAxis = graph.append('g')
    .attr("transform", "translate(0," + 150 + ")")
    .call(d3.axisBottom(xScale));
    let yAxis = graph.append("g")
    .attr("transform", "translate("+graphMargins.left*gridWidth+",0)")
    .call(d3.axisLeft(yScale));
    
    graph.append('defs').append('svg:clipPath')
    .attr('id','clip')
    .append('svg:rect')
    .attr('width', gridWidth-graphMargins.right*gridWidth - graphMargins.left*gridWidth)
    .attr('height', gridHeight - graphMargins.top*gridHeight)
    .attr("x", graphMargins.left*gridWidth)
    .attr("y", graphMargins.top*gridHeight);

    graph.selectAll('circle.point')
    .data((d)=>d.points) //Select the data points of the given graph
    .enter()
    .append('circle')
    .attr('class','map')
    .attr("cx", function (d) { return xScale(d[0]); } )
    .attr("cy", function (d) { return yScale(d[1]); } )
    .attr("r", 3)
    .style("fill", "#440154ff" )
    .style("opacity", 0.5)

    let scatter = graph.append('g')
    .attr("clip-path", "url(#clip)");

    let brush = d3.brushX()
    .extent([[graphMargins.left*gridWidth,graphMargins.top*gridHeight],[gridWidth-graphMargins.right*gridWidth,gridHeight-graphMargins.bottom*gridHeight]])
    .on("end", updateChart);

    scatter.append('g')
    .attr("class", "brush")
    .call(brush);

    //TODO Add Metric and Title to graph
    

    let graphList = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    graphList.push({
        graph:graph,
        xExtremums:xExtremums,
        xAxis:xAxis,
        xScale:xScale,
        brush:brush
    })
    redrawGraphs();
}
/**
 * Swaps the view from global to case and vice versa.
 * This has the effect of removing all graphs of one view and replacing them with the graphs of the new view
 */
export function swapView(){
    let oldGraphs = (!isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    //Hide all the graphs from the other view before swapping
    oldGraphs.forEach( (entry) => {
        entry.graph.attr('display','none')
    })
    let newGraphs = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    //Make sure that the CSS display property is set to display the new graphs
    newGraphs.forEach( (entry) => {
        entry.graph.attr('display','inline')
    })
    isGlobalView = !isGlobalView
    console.log(`Changing linegraphs to the ${isGlobal ? 'global':'case'} view`)
}
/**
 * Global variable
 * @var {boolean} isGlobalView Is true when the current view is the global view (Otherwise, it is in the case view)
 */
let isGlobalView = true;
/**
 * Global variable
 * @var {boolean} currentGlobalGraphList List of all current graphs on the global view. The structure used is the following:
 * 
 * entry:{
 * 
 * graph: Object representing the HTML graph element (its encompassing g element)
 * 
 * xExtremums: Interval giving min/max of the X values of the graph
 * 
 * xAxis: The xAxis object of the graph
 * 
 * xScale: The xScale object of the graph
 * 
 * brush: Brush object associated with the graph
 * }
 */
let currentGlobalGraphList = [];
/**
 * Global variable
 * @var {boolean} currentCaseGraphList List of all current graphs on the case view. The structure used is the following:
 * 
 * entry:{
 * 
 * graph: Object representing the HTML graph element (its encompassing g element)
 * 
 * xExtremums: Interval giving min/max of the X values of the graph
 * 
 * xAxis: The xAxis object of the graph
 * 
 * xScale: The xScale object of the graph
 * 
 * brush: Brush object associated with the graph
 * }
 */
let currentCaseGraphList = [];
let lastGlobalSelection;
let lastCaseSelection;
let idleTimeout;
function idled() { idleTimeout = null; }
function updateChart({selection}){
    updateAllCharts(selection, (isGlobal) ? currentGlobalGraphList : currentCaseGraphList)
}
function updateAllCharts(selection,graphList){
    if(!selection){
        if(!idleTimeout)
            return idleTimeout = setTimeout(idled, 350);
        graphList.forEach( (entry) => {
            entry.xScale.domain(entry.xExtremums) //Set this domain to min/max of the dataset used
        })
    } else {
        graphList.forEach( (entry) => {
            entry.xScale.domain([ entry.xScale.invert(selection[0]), entry.xScale.invert(selection[1]) ]);
            entry.graph.select('.brush').call(entry.brush.move, null);
        })
        graphList.forEach( (entry) => {
            entry.XAxis.transition().duration(1000)
            .call(d3.axisBottom(entry.xScale))
            entry.graph.selectAll('circle').transition().duration(1000)
            .attr('cx',function (d) {return entry.xScale(d[0])})
        })
    }
}
/**
 * This function should be called when a graph is added/removed
 */
function redrawGraphs(){
    let graphsToRedraw = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    const displacement = 50; //Change this value to how far the graphs should be spaced
    graphsToRedraw.forEach((entry,index) => {
        //We only need to make sure each entry
        entry.graph.attr('transform',`translate (0, ${graphScale(index)}`);
    })
    updateAllCharts((isGlobal) ? lastGlobalSelection : lastCaseSelection,graphsToRedraw);
}