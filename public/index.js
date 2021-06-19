import * as heatMaps from './scripts/heatMaps.js'
import * as lineGraphs from './scripts/lineGraphs.js'

//initialize each svg
d3.selectAll('svg')
.attr('width', '100%')
.attr('height', '100%')

function build(){
    heatMaps.build()
    lineGraphs.build()
}

build()

window.addEventListener('resize', () => {
    build()
})