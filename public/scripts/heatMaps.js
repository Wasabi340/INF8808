function getFakeData(){
    
    let data = {
        studyCases: []
    }
    
    for(let i = 0; i < 20; i++){
        
        data.studyCases.push({
            metric:Math.floor(Math.random() * 101),
            values:[]
        })
        
        for (let j = 0; j < 24; j++){
            data.studyCases[i].values.push(j/24)
        }
    }
    
    return data
}

export function build () {
    console.log('building heatmaps')
    
    let g = d3.select('.heat-maps svg')
    
    let fakeData = getFakeData()

    let width = g.node().getBoundingClientRect().width
    let height = g.node().getBoundingClientRect().height

    let verticalScale = d3.scaleLinear()
        .domain([0,fakeData.studyCases.length])
        .range([0,height])

    let horizontalScale = d3.scaleLinear()
        .domain([0,fakeData.studyCases[0].values.length])
        .range([0,width*0.75])

    let colorScale = d3.scaleLinear()
        .domain([0, 0.33, 0.66, 1])
        .range(['blue', 'green', 'yellow', 'red'])
    
    g.selectAll('g')
    .data(fakeData.studyCases)
    .enter()
    .append('g')
    .attr('class', 'test')
    .attr('transform', (d, i) => `translate(0 ${verticalScale(i)})`)
    .selectAll('rect')
    .data((d) => d.values)
    .enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('x', (d, i) => horizontalScale(i))
    .attr('fill', (d) => colorScale(d))

    let groups = g.selectAll('g')

    groups.attr('transform', (d, i) => `translate(0 ${verticalScale(i)})`)

    let rects = groups.selectAll('rect')
    
    rects.attr('width', width*0.75/24)
    .attr('height', width*0.75/24*1.5)
    .attr('x', (d, i) => horizontalScale(i))
    .attr('fill', (d) => colorScale(d))
}