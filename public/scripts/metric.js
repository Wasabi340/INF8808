export function build (cases) {
    console.log('building metric')
    
    d3.select('.metric svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.metric svg')

    let metric = g.select('text').node() ? g.select('text') : g.append('text')

    let algo = "Algo1"
    if (!d3.select('.algorithm svg').select('text').empty()) {
        algo = d3.select('.algorithm svg').select('text').property('value')
    }

    console.log(cases)
    
    let metricValue = (algo=="Algo1") ? cases[0][0].Algo1_aggregatedMetric : cases[0][0].Algo1_aggregatedMetric

    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height

    metric.text(`Aggregated metric : ${metricValue}`)
    .attr('x', maxWidth/2)
    .attr('y', maxHeight/2)
    .attr('text-anchor', 'middle')
}