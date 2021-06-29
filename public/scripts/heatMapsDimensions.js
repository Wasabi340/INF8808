import { addGraph, deleteAllCurrentGraphs, removeGraph } from "./lineGraphs.js"

let fakeData

function rearrangeData(cases) {

    let data = {
        studyCases: [] //Dimensions
    }

    let algo = "Algo1"
    if (!d3.select('.algorithm svg').select('text').empty()) {
        algo = d3.select('.algorithm svg').select('text').property('value')
    }

    let selected_case = 1
    if (d3.select('#case-selector').property('value') != '') {
        selected_case = d3.select('#case-selector').property('value')
    }

    console.log(selected_case)

    let columns = Object.getOwnPropertyNames(cases[0][0])
    let dimensions = columns.slice(2, 54)
    
    let index = 0
    dimensions.forEach((dimension) => {
        let metric = null
        cases[selected_case-1]
        data.studyCases.push({
            name: dimension,
            metric: metric,
            dataPoints:[]
        })

        let min = 9999
        let max = 0
        cases[selected_case-1].forEach((point) => {
            if (point[dimension]<min) { min = point[dimension] }
            if (point[dimension]>max) { max = point[dimension] }
        })

        cases[selected_case-1].forEach((point) => {
            let pointValue = point[dimension]
            let pointType = (algo=="Algo1") ? point.Algo1_pointType : point.Algo2_pointType
            data.studyCases[index].dataPoints.push({value: pointValue, valueNorm:(pointValue-min)/(max-min), type: pointType})
        })
        index = index+1
    })

    data.studyCases.forEach(element => {

        let n = 50
        
        const res = [];
        for (let i = 0; i < element.dataPoints.length;) {
            let sum = 0;
            for(let j = 0; j < n; j++){
                sum += +element.dataPoints[i++].valueNorm || 0;
            };
            res.push(sum / n);
        }
        element.averagedValues = res
    });

    return data
}

export function build (cases) {

    console.log('yo')

    d3.select('.heat-maps svg')
    .attr('width', '100%')
    .attr('height', '250%')
    
    let g = d3.select('.heat-maps svg')
    
    fakeData = rearrangeData(cases)
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height
    let margin = {
        top:0.03,
        bottom:0.03,
        left:0.05,
        right:0.20
    }
    
    let verticalScale = d3.scaleLinear()
    .domain([0, fakeData.studyCases.length])
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight])
    
    let horizontalScale = d3.scaleLinear()
    .domain([0,fakeData.studyCases[0].averagedValues.length])
    .range([margin.left*maxWidth,maxWidth-margin.right*maxWidth])
    
    let minValue = 1
    let maxValue = 0

    fakeData.studyCases.forEach(element => {
        element.averagedValues.forEach(element => {
            if(element < minValue){
                minValue = element
            }
            if(element > maxValue){
                maxValue = element
            }
        });
    });

    let colorScale = d3.scaleLinear()
    .domain([minValue, minValue + (maxValue-minValue)/3,  minValue + (maxValue-minValue)/3 * 2, maxValue])
    .range(['blue', 'green', 'yellow', 'red'])

    let init = g.selectAll('g.dimension')
    .data(fakeData.studyCases)
    .enter()
    .append('g')
    .attr('class', 'dimension')
    
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
    .attr('number', (d,i) => d.number = i)
    .attr('cursor', 'pointer')
    
    init.selectAll('rect.map')
    .data((d) => d.averagedValues)
    .enter()
    .append('rect')
    .attr('class', 'map')
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
    
    let groups = g.selectAll('g.dimension')
    groups.attr('transform', (d, i) => `translate(0 ${verticalScale(i)})`)
    
    let names = groups.selectAll('text.name')
    names.attr('x', maxWidth/2)
    .attr('y', -5)
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
    rects.attr('width', maxWidth*(1-margin.left-margin.right)/fakeData.studyCases[0].averagedValues.length)
    .attr('height', 20)
    .attr('x', (d, i) => horizontalScale(i))
    .attr('fill', (d) => colorScale(d))

    d3.select('select.dimension').selectAll('option')
    .data(fakeData.studyCases)
    .enter()
    .append('option')
    .text((d,i) => `Case ${i+1}`)
    .attr('value', (d, i) => i+1)

    d3.select('select.dimension')
    .on('change', function() {
        turnAllOff(left);
        d3.selectAll('.heat-maps g.dimension').remove()
        build(cases);
        d3.selectAll('.dimension').style('display', 'block')
    })

    d3.selectAll('.dimension').style('display', 'none')
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

        if (d.on){
            let data = fakeData.studyCases[d.number]
            addGraph(d.name,data)
        } else {
            removeGraph(d.name)
        }
        return result
    })
}

function turnAllOff(left){

    d3.selectAll('.dimension .toggle')
    .transition()
    .duration(100)
    .attr('cx', (d) => {
        d.on = false
        return left
    })

    d3.selectAll('.dimension .switch')
    .attr('fill', 'silver')

    deleteAllCurrentGraphs();
}