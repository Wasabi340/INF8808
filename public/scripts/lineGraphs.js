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
let globalXAxis;
let globalX;
let globalG;
let globalBrush;
export function build () {
    console.log('building linegraphs')
    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '100%')
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
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight]);

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
    .attr("transform", "translate(0," + maxHeight + ")")
    .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
    .domain([100, 0])
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight]);

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
    .attr('y', 0)
    .attr('text-anchor', 'middle')

    let metrics = groups.selectAll('text.metric')
    metrics.attr('x', margin.left*maxWidth/2)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')


    init.selectAll('circle.point')
    .data((d)=>d.points)
    .enter()
    .append('circle')
    .attr('class','map')
    .attr("cx", function (d) { return x(d[0]); } )
    .attr("cy", function (d) { return y(d[1]); } )
    .attr("r", 8)
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
let idleTimeout;
function idled() { idleTimeout = null; }
function updateChart({selection}){
    if(!selection){
        if (!idleTimeout)
            return idleTimeout = setTimeout(idled, 350);
        globalX.domain([0,100]); //These are the same as the x,y variables in the build function
    } else {
        globalX.domain([ globalX.invert(selection[0]), globalX.invert(selection[1]) ]);
        globalG.select(".brush").call(globalBrush.move, null);
    }
    globalXAxis.transition().duration(1000).call(d3.axisBottom(globalX))
    globalG.selectAll("circle")
    .transition().duration(1000)
    .attr("cx", function (d) { return globalX(d[0]); } )
}