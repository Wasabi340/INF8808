const colors = [
    {
        id:'globalGrad',
        grad:['#E1D5E7','#BCA7C7']
    },
    {
        id:'caseGrad',
        grad:['#D5E8D4','#A5C4A3']
    }
]
export let isGlobal = true;

export function build () {
    
    d3.select('.menu svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.menu svg')
    
    let tabs = [
        {
            name:'Global',
            on:true
        },
        {
            name:'Case',
            on:false
        }
    ]
    
    g.selectAll('rect')
    .data(tabs)
    .enter()
    .append('rect')
    .attr('cursor', 'pointer')
    
    g.selectAll('text')
    .data(tabs)
    .enter()
    .append('text')
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height
    let tabWidth = maxWidth/15
    let tabHeight = maxHeight/2
    
    const defs = g.select('defs').node() ? g.select('defs') : g.append('defs')
    
    const linearGradient = defs.selectAll('linearGradient')
    .data(colors)
    .enter()
    .append('linearGradient')
    .attr('id', (d) => d.id)
    .attr('x1', '0%').attr('y1', '75%').attr('x2', '0%').attr('y2', '100%')
    
    linearGradient.selectAll('stop')
    .data((d,i) => colors[i].grad)
    .enter()
    .append('stop')
    .style('stop-color', function(d){ return d; })
    .attr('offset', function(d,i){
        return 100 * (i / (2 - 1)) + '%';
    })
    
    let rects = g.selectAll('rect')
    rects.attr('x', (d,i) => tabWidth * i + (i == 0 ? 0 : 5))
    .attr('y', maxHeight - tabHeight)
    .attr('width', tabWidth)
    .attr('height', tabHeight)
    .attr('fill', (d,i) => d.on? colors[i].grad[0] : `url(#${colors[i].id})`)
    .on('click', handleMouseClick)
    
    let texts = g.selectAll('text')
    texts.attr('x', (d,i) => tabWidth * i + (i == 0 ? 0 : 5) + tabWidth/2)
    .attr('y', maxHeight - tabHeight/2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d)=>d.name)
    .attr('pointer-events', 'none')
}

function handleMouseClick(data){
    
    d3.select(this)
    .attr('fill', function(d){
        if(!d.on){
            isGlobal = (d.name == 'Global');
            document.getElementsByClassName('dashboard')[0].style.backgroundColor = (d.name == 'Global' ? '#E1D5E7' : '#D5E8D4')
            d3.select(this.parentNode).selectAll('rect')
            .attr('fill', function(d,i) {
                d.on = !d.on
                return `url(#${colors[i].id})`
            })

            let visible = isGlobal ? 'case' : 'dimension'
            let hidden = isGlobal ? 'dimension' : 'case'

            d3.selectAll(`.${visible}`).style('display', 'block')
            d3.selectAll(`.${hidden}`).style('display', 'none')

            if (isGlobal) {
    
                d3.select('#aggregated-metric').style('display', 'block')
                d3.select('#adaptive-metric').style('display', 'none')

                d3.select('#ad-m1').style('display', 'none')
                d3.select('#ad-m2').style('display', 'none')
                d3.select('#ad-m3').style('display', 'none')
                d3.select('#ad-m4').style('display', 'none')
                d3.select('#ag-m1').style('display', 'block')
        
            } else {
        
                d3.select('#aggregated-metric').style('display', 'none')
                d3.select('#adaptive-metric').style('display', 'block')

                d3.select('#ag-m1').style('display', 'none')
                d3.select('#ad-m1').style('display', 'block')
                d3.select('#ad-m2').style('display', 'block')
                d3.select('#ad-m3').style('display', 'block')
                d3.select('#ad-m4').style('display', 'block')
        
            }

            
        }
        return colors[d.name == 'Global' ? 0 : 1].grad[0]
    })


}