import { isGlobal } from "./menu.js";

const windowHeight = [0,7500];
const graphScale = d3.scaleLinear()
.domain([0, 40])
.range(windowHeight);

export function build (data) {
    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '1700%')
}
/**
 * Removes the graph specified by the given name from the viewable linegraphs
 * Additionally removes said graph from the saved graph list
 *
 * @param {string} title The title of the graph (This title matches the one saved within the graph object located in the graphList)
 */
export function removeGraph(title){

    let graphToRemove = d3.select('.line-graphs svg').select("#"+title.replace(" ","_")).remove()
    //Finds the graph matching the given title and removes it from the array
    if(isGlobal){
        let index = currentGlobalGraphList.findIndex((entry) => entry.title == title);
        if(index >= 0)
            currentGlobalGraphList.splice(currentGlobalGraphList.findIndex((entry) => entry.title == title),1)
    }else {
        let index = currentCaseGraphList.findIndex((entry) => entry.title == title)
        if(index >= 0)
            currentCaseGraphList.splice(currentCaseGraphList.findIndex((entry) => entry.title == title),1)
    }
    redrawGraphs();
    
}
/**
 * Adds the graph specified by the given name to the viewable linegraphs
 * Additionally adds said graph to the saved graph list
 *
 * @param {string} title The title of the graph (This title matches the one saved within the graph object located in the graphList)
 * @param {any[]} data The data representing the graph to be drawn
 */
export function addGraph(title,data){
    let graphMargins = {
        top:0.05,
        bottom:0.03,
        right:0.2,
        left:0.2,
    }
    let g = d3.select('.line-graphs svg')
    let graph = g.append('g')
    .attr('class',(isGlobal) ? 'case' : 'dimension')
    .attr('id',title.replace(" ","_"))

    graph.append('text')
    .attr('class',(isGlobal) ? 'case' : 'dimension')
    .attr('id','name')
    .text(title)

    if(isGlobal)
        graph.append('text')
        .attr('class', (isGlobal) ? 'case' : 'dimension')
        .attr('id','metric')
        .text(data.metric)
    let gridWidth = g.node().getBoundingClientRect().width
    let xExtremums = [0,2000] //This value changes based on the given data of the graph
    let yExtremums = [d3.min(data.dataPoints,(d) => d.value),d3.max(data.dataPoints,(d) => d.value)] //This value changes based on the given data of the graph
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

    graph.selectAll('circle')
    .data(data.dataPoints) //Select the data points of the given graph
    .enter()
    .append('circle')
    .attr('class',function (d) {return d.type})
    .attr("cx", function (d,i) { return xScale(i); } )
    .attr("cy", function (d,i) { return yScale(d.value); } )
    .attr("r", 3)
    .attr("fill", "#440154ff")
    .attr("opacity", 0.5)

    highlightPoints(currentHighlight)

    graph.select('#name')
    .attr('x', gridWidth/2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')

    graph.select('#metric')
    .attr('x', graphMargins.left*gridWidth/2)
    .attr('y', 75)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')

    let graphList = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    graphList.push({
        graph:graph,
        title:title
    })
    redrawGraphs();
}
/**
 * Global variable
 * @var {boolean} currentGlobalGraphList List of all current graphs on the global view. The structure used is the following:
 * 
 * entry:{
 * 
 * graph: Object representing the HTML graph element (its encompassing g element)
 * 
 * title: The graph's title
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
 * title: The graph's title
 * }
 */
let currentCaseGraphList = [];

/**
 * This function should be called when a graph is added/removed
 */
function redrawGraphs(){
    let graphsToRedraw = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    graphsToRedraw.forEach((entry,index) => {
        //We only need to make sure each entry
        entry.graph.attr('transform',`translate (0, ${graphScale(index)})`);
    })
}
let currentHighlight = 'none';
/**
 * 
 * @param {string} type The type of point to highlight
 */
export function highlightPoints(type){
    currentHighlight = type
    d3.select('.line-graphs svg')
    .selectAll((isGlobal) ? '.case' : '.dimension')
    .selectAll('circle')
    .attr('fill', "#440154ff")
    d3.select('.line-graphs svg')
    .selectAll((isGlobal) ? '.case' : '.dimension')
    .selectAll(`circle.${type}`)
    .attr("fill","#db0000ff")
}
/**
 * This function is used when all graphs must be removed from the grid such as when switching to a different case 
 */
export function deleteAllCurrentGraphs(){
    let graphsToDelete = (isGlobal) ? currentGlobalGraphList : currentCaseGraphList;
    let titleList = Array.from(graphsToDelete, (entry) => entry.title);
    titleList.forEach((title) => {
        removeGraph(title);
    })
}