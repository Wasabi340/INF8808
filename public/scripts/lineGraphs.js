function getFakeData(){
    
    let data = {
        studyCases: []
    }
    
    for(let i = 0; i < 20; i++){
        
        data.studyCases.push({
            name:`Case ${i+1}`,
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
    console.log('building linegraphs')
    let g = d3.select('.line-graphs svg')
    let maxWidth = g.node().getBoundingClientRect().width
    let maxHeight = 100 // Height for a linegraph is limited to a given size and is not bound by the bounding rect (TODO Experiment to find sweet spot)
    let margin = {
        top:0.05,
        bottom:0,
        left:0.20,
        right:0.20
    }
    let fakeData = getFakeData()
    
    let verticalScale = d3.scaleLinear()
    .domain([0, fakeData.studyCases.length])
    .range([margin.top*maxHeight, maxHeight-margin.bottom*maxHeight])
    
    let horizontalScale = d3.scaleLinear()
    .domain([0,fakeData.studyCases[0].values.length])
    .range([margin.left*maxWidth,maxWidth-margin.right*maxWidth])
    
    let init = g.selectAll('g')
    .data(fakeData.studyCases)
    .enter()
    .append('g')

    d3.select('.line-graphs svg')
    .attr('width', '100%')
    .attr('height', '100%')
}