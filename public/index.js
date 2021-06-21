import * as menu from './scripts/menu.js'
import * as heatMaps from './scripts/heatMaps.js'
import * as lineGraphs from './scripts/lineGraphs.js'

function build(){
    menu.build()
    heatMaps.build()
    lineGraphs.build()
}

build()

window.addEventListener('resize', () => {
    build()
})