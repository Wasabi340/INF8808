export function build (cases) {
    console.log('building highlights')

    d3.select('.highlight-points svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.highlight-points svg')

    let combinations = [
        {id:'TP_button', target:'TP'},
        {id:'FP_button', target:'FP'},
        {id:'TN_button', target:'TN'},
        {id:'FN_button', target:'FN'}
    ]

    g.selectAll('rect.highlightButton')
    .data(combinations)
    .enter()
    .append('rect')
    .attr('class', 'highlightButton')
    .attr('id', (d) => d.id)
    .attr('width', 200)
    .attr('height', '80%')
    .attr('x', (d,i) => 220*i)
    .attr('fill', 'green')
    .attr('cursor', 'pointer')
    .on('click', handleMouseClick)
}

function handleMouseClick(){
    let data = d3.select(this).data()[0]
    
    d3.selectAll('.TP').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.FP').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.TN').style('fill', 'rgb(68,1,84)')
    d3.selectAll('.FN').style('fill', 'rgb(68,1,84)')
    d3.selectAll(`.${data.target}`).style('fill', 'red')

}