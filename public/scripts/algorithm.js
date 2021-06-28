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

export function build () {
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

    button.attr('x', 10)
    .attr('y', 10)
    .attr('width', 50)
    .attr('height', 50)
    .attr('fill', 'blue')
    .on('click', handleMouseClick)

    let m = d3.select('.modal svg')

    let barWidth = 50
    let margin = 10

    m.selectAll('.algorithm rect')
    .data(fakeData.algorithms)
    .enter()
    .append('rect')
    .attr('class', 'algorithm')
    .attr('width', (d) => `${d.metric}%`)
    .attr('height', 50)
    .attr('y', (d, i) => i * (barWidth + margin))
    .attr('cursor', 'pointer')
    .on('click', algorithmSelection)
}

function handleMouseClick(){
    let modal = d3.select('#algorithm-selector')

    modal.style('display', 'block')

    let span = d3.select('.close')

    span.on('click', () => modal.style('display', 'none'))
}

function algorithmSelection(){
    console.log(d3.select(this).data()[0].name)
    let modal = d3.select('#algorithm-selector')
    modal.style('display', 'none')
}