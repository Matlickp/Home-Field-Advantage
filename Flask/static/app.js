function init() {
    
    var $container = $('#chart-area')
        
    var svgWidth = $container.width();
    var svgHeight = $container.height();

    console.log(svgWidth);
    console.log(svgHeight);
    console.log(Math.min(svgWidth, svgHeight));
    console.log($('#chart-area').height())
    //margins
    var margin = {
        top: 100,
        right: 40,
        bottom: 100,
        left: 120
    };

    //chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var tHeight = svgHeight - 50
    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .attr('viewBox','375 425 '+svgWidth +' '+tHeight )
        .attr('preserveAspectRatio','xMinYMin')


    var chartGroup = svg.append("g")
        .attr("id", "chart-group")
        .attr("transform", "translate(" + Math.min(svgWidth,svgHeight) / 2 + "," + Math.min(svgWidth,svgHeight) / 2 + ")");

    chartGroup.append("text")
    .attr("y", 0 - 25)
    .attr("x", 0 + margin.top)
    .attr("class", "topMenu")
    .attr("font-family", "Segoe UI Light")
    .attr("font-size", "2em")
    .attr("data-value", "nba")
    .style("cursor", "default")
    .style("stroke", "black")
    .style("opacity", .5)
    .attr("dy", "1em")
    .text("NBA")

    chartGroup.append("text")
    .attr("y", 0 -25)
    .attr("x", 0 + margin.top + 100)
    .attr("class", "topMenu")
    .attr("font-family", "Segoe UI Light")
    .attr("font-size", "2em")
    .attr("data-value", "nfl")
    .style("cursor", "default")
    .style("stroke", "black")
    .style("opacity", .5)
    .attr("dy", "1em")
    .text("NFL")

    chartGroup.append("text")
    .attr("y", 0 -25)
    .attr("x", 0 + margin.top + 200)
    .attr("class", "topMenu")
    .attr("font-family", "Segoe UI Light")
    .attr("font-size", "2em")
    .attr("data-value", "mlb")
    .style("cursor", "default")
    .style("stroke", "black")
    .style("opacity", .5)
    .attr("dy", "1em")
    .text("MLB")

    var sport = ""
    var year = ""
    var menuDict = [{'nba': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 100,
                                'trianglex': 130},
                    'nfl': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 200,
                                'trianglex': 230},
                    'mlb': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 300,
                                'trianglex': 330}
                    }]
    console.log(menuDict[0]['nba'])
    var topMenu = d3.selectAll(".topMenu")

    topMenu.on("mouseover", function() {
        if (d3.select(this).attr("data-value") != sport) {
            d3.select(this).transition()
            .duration(500)
            .style("opacity", 1.0)
        }
    })

    topMenu.on("mouseout", function() {
        if (d3.select(this).attr("data-value") != sport) {
            d3.select(this).transition()
            .duration(500)
            .style("opacity", .5)
        }
    })
    topMenu.on("click", function(){
        d3.selectAll(".topMenu")
        .style("opacity", .5)
        d3.select(this)
        .style("opacity", 1.0)

        d3.selectAll(".topSubMenu")
        .remove()

        d3.selectAll(".triangle").remove()


        

        
        sport = d3.select(this).attr("data-value")
        x = menuDict[0][sport]['offset']
        years = menuDict[0][sport]['years']
        console.log(x)
        ySpace = 20
        xSpace = 0
        years.forEach(year => {
            chartGroup.append("text")
            .attr("y", ySpace)
            .attr("x", 7 + x + xSpace)
            .attr("class", "topSubMenu")
            .attr("font-family", "Segoe UI Light")
            .attr("font-size", "1.3em")
            .attr("data-value", year)
            .style("cursor", "default")
            .style("stroke", "black")
            .style("opacity", 0)
            .attr("dy", "1em")
            .text(year)

            xSpace += 50
        })
        triangle = chartGroup.append("path")
        .attr("d", d3.symbol().type(d3.symbolTriangle))
        .attr("transform", "translate("+menuDict[0][sport]['trianglex']+ ",15) rotate(180)")
        .attr("class", "triangle")
        .style("fill", "black")
        .style("opacity", 0)

        d3.selectAll(".topSubMenu").transition()
        .duration(500)
        .style("opacity", .5)

        d3.selectAll(".triangle").transition()
        .duration(500)
        .style("opacity", 1)

        topSubMenu = d3.selectAll(".topSubMenu")

        topSubMenu.on("mouseover", function() {
            if (d3.select(this).attr("data-value") != year) {
                d3.select(this).transition()
                .duration(500)
                .style("opacity", 1.0)
            }
        })

        topSubMenu.on("mouseout", function() {
            if (d3.select(this).attr("data-value") != year) {
                d3.select(this).transition()
                .duration(500)
                .style("opacity", .5)
            }
        })

        topSubMenu.on("click", function() {
            year = d3.select(this).attr("data-value")
            console.log(year)
            d3.selectAll(".topSubMenu")
            .style("opacity", .5)
            d3.select(this)
            .style("opacity", 1.0)
            buildChart(sport, year)
        })  
    })



}
function buildChart(sport, year){
    var url = ("/api/"+sport)
    var $container = $('#chart-area')
        
    var svgWidth = $container.width();
    var svgHeight = $container.height();

    console.log(svgWidth);
    console.log(svgHeight);
    console.log(Math.min(svgWidth, svgHeight));
    console.log($('#chart-area').height())
    //margins
    var margin = {
        top: 100,
        right: 40,
        bottom: 100,
        left: 120
    };

    //chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var botHeight = chartHeight + 75
    
    d3.json(url).then((data) => {
        console.log(data)
        
        if (d3.selectAll("rect").empty()) {
            var yearData = data.filter(function(item) {
                return item.year == year
            })

            var pctData = _.map(yearData, function(o) {
                return _.pick(o, 'team', 'home_pct', 'away_pct')
            })

            var keys = ['home_pct', 'away_pct']
            console.log(keys)
            console.log(yearData)
            console.log(pctData)

            var test = pctData.map(d=> { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
            console.log(test)
            
            yScale = d3.scaleLinear()
            .domain([0,1])
            .rangeRound([chartHeight+75,100])

            xScale = d3.scaleBand()
            .domain(pctData.map(d => {return d['team']}))
            .rangeRound([0, chartWidth])
            .padding(0.1)

            xScale1 = d3.scaleBand()
            .domain(keys).rangeRound([0, xScale.bandwidth()])
            .padding(0.05)

            var leftAxis = d3.axisLeft(yScale)
            var botAxis = d3.axisBottom(xScale)

            var chartGroup = d3.select("#chart-group")


            chartGroup.append("g")
            .selectAll("g")
            .data(pctData)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + xScale(d['team']) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter()
            .append("rect")
            .attr("id", "rect-home")
            .attr("x", d => {return xScale1(d.key)})
            .attr("y", d=> {return yScale(d.value)})
            .attr("width", xScale1.bandwidth())
            .attr("height", 0)
            .attr("fill", "lightblue")

            chartGroup.append("g")
                .attr("id", "y-axis")
                .call(leftAxis);

            chartGroup.append("g")
                .attr("id", "x-axis")
                .attr("transform", `translate(0, ${botHeight})`)
                .call(botAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("font-size", "1.2em")
                    .attr("dx", "-10px")
                    .attr("dy", "0px")
                    .attr("transform", "rotate(-55)")

            /*d3.select("#chart-area")
                .style("height", "100%")*/

            

            
            d3.selectAll("rect")
            .transition()
            .duration(650)
            .attr("height", d=> {return botHeight - yScale(d.value)})

        }else if (!d3.selectAll("rect").empty()) {
            var yearData = data.filter(function(item) {
                return item.year == year
            })

            var pctData = _.map(yearData, function(o) {
                return _.pick(o, 'team', 'home_pct', 'away_pct')
            })

            var keys = ['home_pct', 'away_pct']
            console.log(keys)
            console.log(yearData)
            console.log(pctData)

            var test = pctData.map(d=> { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
            console.log(test)
            
            yScale = d3.scaleLinear()
            .domain([0,1])
            .rangeRound([chartHeight+75,100])

            xScale = d3.scaleBand()
            .domain(pctData.map(d => {return d['team']}))
            .rangeRound([0, chartWidth])
            .padding(0.1)

            xScale1 = d3.scaleBand()
            .domain(keys).rangeRound([0, xScale.bandwidth()])
            .padding(0.05)

            var leftAxis = d3.axisLeft(yScale)
            var botAxis = d3.axisBottom(xScale)

            var chartGroup = d3.select("#chart-group")

            d3.select("#x-axis")
            .transition()
            .call(botAxis)
            .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("font-size", "1.2em")
                    .attr("dx", "-10px")
                    .attr("dy", "0px")
                    .attr("transform", "rotate(-55)")

            chartGroup.selectAll("rect").remove()

            chartGroup.append("g")
            .selectAll("g")
            .data(pctData)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + xScale(d['team']) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter()
            .append("rect")
            .attr("id", "rect-home")
            .attr("x", d => {return xScale1(d.key)})
            .attr("y", d=> {return yScale(d.value)})
            .attr("width", xScale1.bandwidth())
            .attr("height", 0)
            .attr("fill", "lightblue")

            d3.selectAll("rect")
            .transition()
            .duration(650)
            .attr("height", d=> {return botHeight - yScale(d.value)})

        }



    })
}



console.log("hello");
window.addEventListener('load', init, false)



