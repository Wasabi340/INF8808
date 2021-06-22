import * as menu from './scripts/menu.js'
import * as heatMaps from './scripts/heatMaps.js'
import * as lineGraphs from './scripts/lineGraphs.js'
import * as equation from './scripts/equation.js'

function build(){
    menu.build()
    heatMaps.build()
    lineGraphs.build()
    equation.build()
}

build()

window.addEventListener('resize', () => {
    build()
})