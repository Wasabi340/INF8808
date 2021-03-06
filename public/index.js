import * as menu from './scripts/menu.js'
import * as heatMapsCases from './scripts/heatMapsCases.js'
import * as heatMapsDimensions from './scripts/heatMapsDimensions.js'
import * as lineGraphs from './scripts/lineGraphs.js'
import * as metric from './scripts/metric.js'
import * as algorithm from './scripts/algorithm.js'
import * as highlightPoints from './scripts/hightlightPoints.js'


(function (d3) {

    Promise.all([
        d3.csv("../assets/data/case1-25.csv", d3.autoType),
        d3.csv("../assets/data/case1-50.csv", d3.autoType),
        d3.csv("../assets/data/case2-25.csv", d3.autoType),
        d3.csv("../assets/data/case2-50.csv", d3.autoType),
        d3.csv("../assets/data/case3-25.csv", d3.autoType),
        d3.csv("../assets/data/case3-50.csv", d3.autoType),
        d3.csv("../assets/data/case4-25.csv", d3.autoType),
        d3.csv("../assets/data/case4-50.csv", d3.autoType),
        d3.csv("../assets/data/case5-25.csv", d3.autoType),
        d3.csv("../assets/data/case5-50.csv", d3.autoType),
        d3.csv("../assets/data/case6-25.csv", d3.autoType),
        d3.csv("../assets/data/case6-50.csv", d3.autoType),
        d3.csv("../assets/data/case7-25.csv", d3.autoType),
        d3.csv("../assets/data/case7-50.csv", d3.autoType),
        d3.csv("../assets/data/case8-25.csv", d3.autoType),
        d3.csv("../assets/data/case8-50.csv", d3.autoType),
        d3.csv("../assets/data/case9-25.csv", d3.autoType),
        d3.csv("../assets/data/case9-50.csv", d3.autoType),
        d3.csv("../assets/data/case10-25.csv", d3.autoType),
        d3.csv("../assets/data/case10-50.csv", d3.autoType),
        d3.csv("../assets/data/case11-25.csv", d3.autoType),
        d3.csv("../assets/data/case11-50.csv", d3.autoType),
        d3.csv("../assets/data/case12-25.csv", d3.autoType),
        d3.csv("../assets/data/case12-50.csv", d3.autoType),
        d3.csv("../assets/data/case13-25.csv", d3.autoType),
        d3.csv("../assets/data/case13-50.csv", d3.autoType),
        d3.csv("../assets/data/case14-25.csv", d3.autoType),
        d3.csv("../assets/data/case14-50.csv", d3.autoType),
        d3.csv("../assets/data/case15-25.csv", d3.autoType),
        d3.csv("../assets/data/case15-50.csv", d3.autoType),
        d3.csv("../assets/data/case16-25.csv", d3.autoType),
        d3.csv("../assets/data/case16-50.csv", d3.autoType),
        d3.csv("../assets/data/case17-25.csv", d3.autoType),
        d3.csv("../assets/data/case17-50.csv", d3.autoType),
        d3.csv("../assets/data/case18-25.csv", d3.autoType),
        d3.csv("../assets/data/case18-50.csv", d3.autoType),
        d3.csv("../assets/data/case19-25.csv", d3.autoType),
        d3.csv("../assets/data/case19-50.csv", d3.autoType),
        d3.csv("../assets/data/case20-25.csv", d3.autoType),
        d3.csv("../assets/data/case20-50.csv", d3.autoType),
    ]).then(function(cases) {

        build()

        function build(){
            menu.build()
            heatMapsCases.build(cases)
            heatMapsDimensions.build(cases)
            lineGraphs.build()
            algorithm.build(cases)
            metric.build(cases)
            highlightPoints.build()
        }

        window.addEventListener('resize', () => {
            build()
        })

    }).catch(function(err) {
        console.log(err)
    })
})(d3)
