export function build () {
    console.log('building menu')
    
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

    g.selectAll('text')
    .data(tabs)
    .enter()
    .append('text')
    
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height
    let tabWidth = maxWidth/15
    let tabHeight = maxHeight/2
    
    const defs = g.append('defs')
    
    const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%').attr('y1', '75%').attr('x2', '0%').attr('y2', '100%')
    
    let colors = ['#E1D5E7', '#BCA7C7']

    linearGradient.selectAll('stop')
    .data(colors)
    .enter()
    .append('stop')
    .style('stop-color', function(d){ return d; })
    .attr('offset', function(d,i){
        return 100 * (i / (colors.length - 1)) + '%';
    })
    
    let rects = g.selectAll('rect')
    rects.attr('x', (d,i) => tabWidth * i + (i == 0 ? 0 : 5))
    .attr('y', maxHeight - tabHeight)
    .attr('width', tabWidth)
    .attr('height', tabHeight)
    .attr('fill', (d) => d.on? '#E1D5E7' : 'url(#gradient)')
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
            console.log(`switching to ${d.name} view`)
            d3.select(this.parentNode).selectAll('rect')
            .attr('fill', function(d) {
                d.on = !d.on
                return 'url(#gradient)'
            })

        }
        return '#E1D5E7'
    })
}