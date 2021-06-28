//let rgb = d3.select(this).attr('fill').match(/\d+/g);
//return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] < 60 ? 'white' : 'black'

import { addGraph, removeGraph } from "./lineGraphs.js"

function getFakeData(){
    
    let data = {
        studyCases: []
    }

    //console.log(d3.select('.algorithm svg').select('text').property('name'))
    
    for(let i = 0; i < 40; i++){
        
        data.studyCases.push({
            name:`Case ${i+1}`,
            metric:Math.floor(Math.random() * 101),
            values:[]
        })
        
        for (let j = 0; j < 24; j++){
            data.studyCases[i].values.push(j/24)
        }
    }
    
    return data
}

function rearangeData(cases) {

    let data = {
        studyCases: []
    }

    let algo = "Algo1"
    if (!d3.select('.algorithm svg').select('text').empty()) {
        algo = d3.select('.algorithm svg').select('text').property('value')
    }
    
    let index = 0
    cases.forEach((case_study) => {
        let metric = (algo=="Algo1") ? case_study[0].Algo1_adaptiveMetric : case_study[0].Algo1_adaptiveMetric
        data.studyCases.push({
            name:`Case ${index+1}`,
            metric: metric, 
            values:[]
        })

        case_study.forEach((point) => {
            let pointValue = (algo=="Algo1") ? point.Algo1_loss_mae : case_study[0].point.Algo2_loss_mae
            let pointType = (algo=="Algo1") ? point.Algo1_pointType : case_study[0].point.Algo2_pointType
            data.studyCases[index].values.push({value: pointValue, type: pointType})
        })
        index = index+1
    })

    return data
}


export function build (cases) {
    console.log('building heatmaps')

    d3.select('.heat-maps svg')
    .attr('width', '100%')
    .attr('height', '200%')
    
    let g = d3.select('.heat-maps svg')
    
    let fakeData = rearangeData(cases)
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height
    let margin = {
        top:0.03,
        bottom:0.03,
        left:0.20,
        right:0.20
    }
    
    let verticalScale = d3.scaleLinear()
    .domain([0, fakeData.studyCases.length])
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight])
    
    let horizontalScale = d3.scaleLinear()
    .domain([0,fakeData.studyCases[0].values.length])
    .range([margin.left*maxWidth,maxWidth-margin.right*maxWidth])
    
    let colorScale = d3.scaleLinear()
    .domain([0, 6.66, 13.33, 20])
    .range(['blue', 'green', 'yellow', 'red'])

    let init = g.selectAll('g.case')
    .data(fakeData.studyCases)
    .enter()
    .append('g')
    .attr('class', 'case')
    
    init.append('text')
    .attr('class', 'name')
    .text((d)=>d.name)
    
    init.append('text')
    .attr('class', 'metric')
    .text((d)=>d.metric)
    
    init.append('rect')
    .attr('class', 'switch')
    .attr('cursor', 'pointer')
    
    init.append('circle')
    .attr('class', 'toggle')
    .attr('cursor', 'pointer')
    
    init.selectAll('rect.map')
    .data((d) => d.values)
    .enter()
    .append('rect')
    .attr('class', 'map')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
    
    let groups = g.selectAll('g.case')
    groups.attr('transform', (d, i) => `translate(0 ${verticalScale(i)})`)
    
    let names = groups.selectAll('text.name')
    names.attr('x', maxWidth/2)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    
    let metrics = groups.selectAll('text.metric')
    metrics.attr('x', margin.left*maxWidth/2)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')

    let switchWidth = margin.right*maxWidth * 0.60
    
    let left = maxWidth - margin.right*maxWidth/2 - switchWidth/2 + 10
    let right = maxWidth - margin.right*maxWidth/2 + switchWidth/2 - 10
    
    let switches = groups.selectAll('rect.switch')
    switches.attr('width', switchWidth)
    .attr('height', 20)
    .attr('x', maxWidth - margin.right*maxWidth/2 - margin.right*maxWidth * 0.60/2)
    .attr('y', 0)
    .attr('fill', 'silver')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('rx', 10)
    .attr('ry', 10)
    .on('click', function() { handleMouseClick(this, left, right) })
    
    let toggles = groups.selectAll('circle.toggle')
    
    toggles.attr('cx', left)
    .attr('cy', 10)
    .attr('r', 8)
    .attr('fill', 'white')
    .on('click', function() { handleMouseClick(this, left, right) })
    
    let rects = groups.selectAll('rect.map')
    rects.attr('width', maxWidth*(1-margin.left-margin.right)/24)
    .attr('height', 20)
    .attr('x', (d, i) => horizontalScale(i))
    .attr('fill', (d) => colorScale(d.value))
}

function handleMouseOver(){
    d3.select(this)
    .attr('height', 30)
    .attr('transform', 'translate(0, -5)')
}

function handleMouseOut(){
    d3.select(this)
    .attr('height', 20)
    .attr('transform', 'translate(0, 0)')
}

function handleMouseClick(g, left, right){
    d3.select(g.parentNode).select('.toggle')
    .transition()
    .duration(100)
    .attr('cx', (d) => {
        d.on = d.on || false
        let result =  d.on? left : right
        d3.select(g.parentNode).select('.switch')
        .attr('fill', d.on? 'silver' : 'black')
        d.on = !d.on

        console.log(`${d.name} is ${d.on? 'on' : 'off'}`)
        if (d.on){
            console.log("Calling linegraph build function for " + d.name)
            let data = {
                //This is the data to send over to the line graph to display it
                //values (number[]): Represented in which ever dimension we are toggling
                //pointType (string[]): Represented in the "Algo_XpointType" column
                //metric (number): Value is repeated over the array, but we only need a single value
                values:null,
                pointType:null,
                metric:null
            }
            addGraph(d.name,data)
        } else {
            console.log("Calling linegraph remove function for " + d.name)
            removeGraph(d.name)
        }
        return result
    })
}