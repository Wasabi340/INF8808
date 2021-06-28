import * as menu from './scripts/menu.js'
import * as heatMapsCases from './scripts/heatMapsCases.js'
import * as heatMapsDimensions from './scripts/heatMapsDimensions.js'
import * as lineGraphs from './scripts/lineGraphs.js'
import * as equation from './scripts/equation.js'
import * as metric from './scripts/metric.js'
import * as algorithm from './scripts/algorithm.js'


function build(data){
    menu.build(data)
    heatMapsCases.build(data)
    heatMapsDimensions.build(data)
    lineGraphs.build(data)
    equation.build(data)
    metric.build(data)
    algorithm.build(data)   
}

d3.csv("../assets/data/test.csv").then(function(data) {
    console.log(data[0]);
    build(data)

    window.addEventListener('resize', () => {
        build(data)
    })
});