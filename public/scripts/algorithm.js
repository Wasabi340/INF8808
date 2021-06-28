function getFakeData(){
    
    let data = {
        algorithms: []
    }
    
    for(let i = 0; i < 5; i++){
        
        data.algorithms.push({
            name:`Algorithm ${i + 1}`,
            metric:Math.floor(Math.random() * 101),
        })
    }
    
    return data
}

export function build (data) {
    console.log('building algorithm')

    d3.select('.algorithm svg')
    .attr('width', '100%')
    .attr('height', '100%')

    d3.select('.modal svg')
    .attr('width', '100%')
    .attr('height', '90%')
    
    let g = d3.select('.algorithm svg')

    let fakeData = getFakeData()

    let button = g.select('#button').node() ? g.select('#button') : g.append('rect')
    let text = g.select('#selected-algorithm').node() ? g.select('#selected-algorithm') : g.append('text')

    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height

    button.attr('fill', 'white')
    .attr('id', 'button')
    .on('click', handleMouseClick)

    text.attr('x', maxHeight * 0.2)
    .attr('y', maxHeight/2)
    .attr('id', 'selected-algorithm')
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
    .attr('value', fakeData.algorithms[0].name)
    .text(fakeData.algorithms[0].name)

    let textWidth = text.node().getBoundingClientRect().width
    let textHeight = text.node().getBoundingClientRect().height

    button.attr('x', maxHeight * 0.2 - (textWidth * 0.05))
    .attr('y', maxHeight/2 - (textHeight * 1.1)/2)
    .attr('width', textWidth * 1.1)
    .attr('height', textHeight * 1.1)
    .attr('cursor', 'pointer')


    let m = d3.select('.modal svg')

    let barWidth = 50
    let margin = 10

    m.selectAll('rect.algorithm')
    .data(fakeData.algorithms)
    .enter()
    .append('rect')
    .attr('fill', 'gray')
    .attr('stroke', 'black')
    .attr('class', 'algorithm')
    .attr('width', (d) => `${d.metric/100*70}%`)
    .attr('height', 50)
    .attr('x', '20%')
    .attr('y', (d, i) => i * (barWidth + margin))
    .attr('cursor', 'pointer')
    .on('click', algorithmSelection)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

    m.selectAll('text.name')
    .data(fakeData.algorithms)
    .enter()
    .append('text')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.name)
    .attr('fill', 'black')
    .attr('class', 'name')
    .attr('x', '5%')
    .attr('y', (d, i) => i * (barWidth + margin) + 25)
    .attr('cursor', 'pointer')
    .on('click', algorithmSelection)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)

    m.selectAll('text.metric')
    .data(fakeData.algorithms)
    .enter()
    .append('text')
    .attr('dominant-baseline', 'middle')
    .text((d) => d.metric)
    .attr('fill', 'black')
    .attr('class', 'metric')
    .attr('x', (d) => `${21 + d.metric/100*70}%`)
    .attr('y', (d, i) => i * (barWidth + margin) + 25)
    .attr('cursor', 'pointer')
    .on('click', algorithmSelection)
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
}

function handleMouseClick(){
    let modal = d3.select('#algorithm-selector')

    modal.style('display', 'block')

    let span = d3.select('.close')

    span.on('click', () => modal.style('display', 'none'))
}

function handleMouseOver(){
    d3.select(this).style('opacity', 0.75)
}

function handleMouseOut(){
    d3.select(this).style('opacity', 1)
}

function algorithmSelection(){

    let selection = d3.select(this).data()[0]

    d3.select('#selected-algorithm').attr('value', selection.name).text(selection.name)
    d3.select('.metric text').text(`Aggregated metric : ${selection.metric}`)

    let modal = d3.select('#algorithm-selector')
    modal.style('display', 'none')
}