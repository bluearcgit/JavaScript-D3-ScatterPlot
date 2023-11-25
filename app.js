async function draw() {
    // 1. Get Data///////////////////////////////////////////////////////////
    const dataset = await d3.json('data.json')
    /////////////////////////////////////////////////////////////////////////

    const xAccessor = (d) => d.currently.humidity
    const yAccessor = (d) => d.currently.apparentTemperature

    // 2. Draw Dimensions////////////////////////////////////////////////////
    let dimensions = {
        width: 800,
        height: 800,
        margin: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    }
    /////////////////////////////////////////////////////////////////////////
    dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom


    // 3. Draw Image/////////////////////////////////////////////////////////
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
    ////////////////////////////////////////////////////////////////////////

    // 4. Draw and translate g///////////////////////////////////////////////
    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
        )
    /////////////////////////////////////////////////////////////////////////


    // Scales//////////////////////////////////////////////////////////////
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .rangeRound([0, dimensions.ctrWidth])
        .clamp(true)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .rangeRound([dimensions.ctrHeight, 0]) //Flipping the y-axis
        .nice()
        .clamp(true)
    ///////////////////////////////////////////////////////////////////////// 


    // Draw Circles/////////////////////////////////////////////////////////
    ctr.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('cy', d => yScale(yAccessor(d)))
        .attr('r', 5)
        .attr('fill', 'red')
    /////////////////////////////////////////////////////////////////////////    

    // Draw Axes
    //x Axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat((d) => d * 100 + '%')

    // g for xAxis and Label
    const xAxisGroup = ctr.append('g')
        .call(xAxis)
        .style('transform', `translateY(${dimensions.ctrHeight}px)`)
        .classed('axis', true)

    // x Axis Lablel
    xAxisGroup.append('text')
        .attr('x', dimensions.ctrWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .attr('fill', 'black')
        .text('Humidity')

    //y Axis
    const yAxis = d3.axisLeft(yScale)

    // g for yAxis and Label
    const yAxisGroup = ctr.append('g')
        .call(yAxis)
        .classed('yxis', true)

    // y Axis Lablel
    yAxisGroup.append('text')
        .attr('x', - dimensions.ctrHeight / 2)
        .attr('y', - dimensions.margin.left + 20)
        .attr('fill', 'black')
        .html('Temperature &deg;F')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle')
}

draw()