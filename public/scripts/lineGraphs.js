export function build () {
    console.log('building linegraphs')

    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '100%')
}