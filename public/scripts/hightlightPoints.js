export function build (cases) {
    console.log('building highlights')

    d3.select('.highlight-points svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.highlight-points svg')

    let combinations = [
        {id:'TP_button', name:'True positives', target:'TP'},
        {id:'FP_button', name:'False positives', target:'FP'},
        {id:'TN_button', name:'True negatives', target:'TN'},
        {id:'FN_button', name:'False negatives', target:'FN'},
        {id:'None_button', name:'None', target:'None'}
    ]

    g.append('text').text('Highlight points')
    .attr('x', 10)
    .attr('y', '50%')
    .attr('dominant-baseline', 'middle')

    g.selectAll('rect.highlightButton')
    .data(combinations)
    .enter()
    .append('rect')
    .attr('class', 'highlightButton')
    .attr('id', (d) => d.id)
    .attr('width', 150)
    .attr('height', '80%')
    .attr('x', (d,i) => 150 + 170*i)
    .attr('y', '10%')
    .attr('fill', 'silver')
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('stroke', 'black')
    .attr('cursor', 'pointer')
    .on('click', handleMouseClick)
    .on('mouseup', handleMouseUp)

    g.selectAll('text.highlightButton')
    .data(combinations)
    .enter()
    .append('text')
    .attr('class', 'highlightButton')
    .attr('x', (d,i) => 225 + 170*i)
    .attr('y', '50%')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
    .text((d) => d.name)
}

function handleMouseClick(){
    let data = d3.select(this).data()[0]

    d3.selectAll('rect.highlightButton').attr('fill', 'silver')
    d3.select(this).attr('fill', '#ff6666')
    
    d3.selectAll('.TP').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.FP').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.TN').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.FN').style('fill', 'rgb(68,1,84)')
    if(data.target != 'None'){
        d3.selectAll(`.${data.target}`).style('fill', 'red')
    }

}

function handleMouseUp(){
    d3.select(this).transition().duration(200).attr('fill', 'silver')
}