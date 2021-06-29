import { isGlobal } from "./menu.js";

export function build (cases) {
    console.log('building metric')
    
    d3.select('.metric svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.metric svg')

    let aggregatedMetric = g.append('text') //g.select('text').node() ? g.select('text') : g.append('text')
    let adaptiveMetric = g.append('text') //g.select('text').node() ? g.select('text') : g.append('text')

    aggregatedMetric.attr('id', 'aggregated-metric')
    adaptiveMetric.attr('id', 'adaptive-metric')
    
    let algo = "Algo1"
    if (!d3.select('.algorithm svg').select('text').empty()) {
        algo = d3.select('.algorithm svg').select('text').property('value')
    }

    let aggregatedMetricValue = (algo=="Algo1") ? cases[0][0].Algo1_aggregatedMetric : cases[0][0].Algo2_aggregatedMetric

    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height

    aggregatedMetric.text(`Aggregated metric : ${aggregatedMetricValue}`)
    .attr('x', maxWidth/2)
    .attr('y', maxHeight/2)
    .attr('text-anchor', 'middle')

    let selected_case = 1
    if (!d3.select('.dimension #case-selector').empty()) {
        selected_case = d3.select('#case-selector').property('value')
    }

    let adaptiveMetricValue = (algo=="Algo1") ? cases[selected_case-1][0].Algo1_adaptiveMetric : cases[selected_case-1][0].Algo2_adaptiveMetric

    adaptiveMetric.text(`Adaptive metric : ${adaptiveMetricValue}`)
    .attr('x', maxWidth/2)
    .attr('y', maxHeight/2)
    .attr('text-anchor', 'middle')

    if (isGlobal) {
    
        aggregatedMetric.style('display', 'block')
        adaptiveMetric.style('display', 'none')

    } else {

        aggregatedMetric.style('display', 'none')
        adaptiveMetric.style('display', 'block')

    }
}