export function build (data) {

    d3.select('#ad-m1').style('display', 'none')
    d3.select('#ad-m2').style('display', 'none')
    d3.select('#ad-m3').style('display', 'none')
    d3.select('#ad-m4').style('display', 'none')
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