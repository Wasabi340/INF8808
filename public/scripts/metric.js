export function build (data) {
    console.log('building metric')
    
    d3.select('.metric svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.metric svg')

    let metric = g.select('text').node() ? g.select('text') : g.append('text')

    let metricValue = 88

    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height

    metric.text(`Aggregated metric : ${metricValue}`)
    .attr('x', maxWidth/2)
    .attr('y', maxHeight/2)
    .attr('text-anchor', 'middle')
}