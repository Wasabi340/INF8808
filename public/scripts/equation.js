export function build (data) {
    console.log('building equation')

    d3.select('.equation svg')
    .attr('width', '100%')
    .attr('height', '100%')
    
    let g = d3.select('.equation svg')

    let terms = [
        {id:0,value:'M(r^d(t))',on:true},
        {id:1,value:'M(r^L_i(t))',on:true},
        {id:2,value:'r^d(t)',on:true},
        {id:3,value:'r^L_i(t)',on:true},
    ]

    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = g.node().getBoundingClientRect().height

    let equation = g.select('#computed').node() ? g.select('#computed') : g.append('text')

    equation.text('Computed equation : ' + computeEquation(terms))
    .attr('x', maxWidth/10)
    .attr('y', maxHeight/4)
    .attr('dominant-baseline', 'middle')
    .attr('id', 'computed')

    let highlight = g.select('#highlight').node() ? g.select('#highlight') : g.append('rect')

    let equationWidth = equation.node().getBoundingClientRect().width
    let equationHeight = equation.node().getBoundingClientRect().height

    highlight.attr('x', maxWidth/10)
    .attr('y', maxHeight/4 - equationHeight/2)
    .attr('width', equationWidth)
    .attr('height', equationHeight)
    .attr('fill', '#88A3CD')
    .attr('fill-opacity', 0)
    .attr('id', 'highlight')

    g.selectAll('rect.button')
    .data(terms)
    .enter()
    .append('rect')
    .attr('x', (d, i) => maxWidth/5 + 100 * i - 50)
    .attr('y', maxHeight/2 - 35)
    .attr('width', 100)
    .attr('height', 70)
    .attr('fill', 'LightGreen')
    .on('click', handleMouseClick)
    .attr('cursor', 'pointer')
    .attr('id', (d) => `button${d.id}`)
    .attr('class', 'button')

    g.selectAll('text.term')
    .data(terms)
    .enter()
    .append('text')
    .attr('class', 'term')
    .text((d) => d.value)
    .attr('x', (d, i) => maxWidth/5 + 100 * i)
    .attr('y', maxHeight/2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('pointer-events', 'none')
}

function computeEquation(terms){
    //'WS(d, L_i) = SUM (|M(r^d(t)) - M(r^L_i(t))| * |r^d(t) - r^L_i(t)|)'

    let builder = [
        {value:'|', on: terms[0].on || terms[1].on},
        {value:terms[0].value, on: terms[0].on},
        {value:' - ', on: terms[0].on && terms[1].on},
        {value:terms[1].value, on: terms[1].on},
        {value:'|', on: terms[0].on || terms[1].on},
        {value:' * ', on: (terms[0].on || terms[1].on) && (terms[2].on || terms[3].on)},
        {value:'|', on: terms[2].on || terms[3].on},
        {value:terms[2].value, on: terms[2].on},
        {value:' - ', on: terms[2].on && terms[3].on},
        {value:terms[3].value, on: terms[3].on},
        {value:'|', on: terms[2].on || terms[3].on},
    ]

    let equation = ''
    builder.forEach(element => {
        if(element.on){
            equation += element.value
        }
    });


    return `WS(d, L_i) = SUM ( ${equation} )`
}

function handleMouseClick(){

    let terms = d3.select(this.parentNode).selectAll('.term').data()
    let clicked = d3.select(this).data()[0]

    terms.forEach(element => {
        if(element.value == clicked.value){
            element.on = !element.on
        }
    });

    let equation = d3.select('#computed').text('Computed equation : ' + computeEquation(terms))
    
    d3.select(this.parentNode).select(`#button${clicked.id}`)
    .attr('fill', clicked.on ? 'LightGreen': 'pink')

    let equationWidth = equation.node().getBoundingClientRect().width
    
    d3.select('#highlight')
    .attr('width', equationWidth)
    .attr('fill-opacity', 0.5)
    .transition()
    .duration(300)
    .attr('fill-opacity', 0)
    .transition()
    .duration(300)
}