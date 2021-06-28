import * as menu from './scripts/menu.js'
import * as heatMapsCases from './scripts/heatMapsCases.js'
import * as heatMapsDimensions from './scripts/heatMapsDimensions.js'
import * as lineGraphs from './scripts/lineGraphs.js'
import * as equation from './scripts/equation.js'
import * as metric from './scripts/metric.js'
import * as algorithm from './scripts/algorithm.js'


function build(){
    menu.build()
    heatMapsCases.build()
    heatMapsDimensions.build()
    lineGraphs.build()
    equation.build()
    metric.build()
    algorithm.build()
    
    d3.csv("../assets/data/test.csv").then(function(data) {
        console.log(data[0]);
      });
    
}
build()

window.addEventListener('resize', () => {
    build()
})