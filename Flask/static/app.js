function init() {

    d3.select("#navbar-main")
    .attr("class", "navbar navbar-expand-md navbar-dark bg-dark")
    d3.select("svg").remove()
    var $container = $('#chart-area')
        
    var svgWidth = $container.width();
    var svgHeight = $container.width() * (1080/1920);

    console.log(svgWidth);
    console.log(svgHeight);
    console.log(Math.min(svgWidth, svgHeight));
    console.log($('#chart-area').height())
    //margins
    var margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    };

    //chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    console.log("chartheight:" + chartHeight)
    console.log("chartWidth:" + chartWidth)
    var tHeight = svgHeight - 50
    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
/*        .attr('viewBox','0 0 '+svgWidth +' '+tHeight )
        .attr('preserveAspectRatio','xMinYMin')*/


    var chartGroup = svg.append("g")
        .attr("id", "chart-group")
        .attr("transform", "translate(40,40)");

    chartGroup.append("text")
    .attr("y", -25)
    .attr("x", 0)
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
    .attr("y", -25)
    .attr("x",100)
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
    .attr("y", -25)
    .attr("x", 200)
    .attr("class", "topMenu")
    .attr("font-family", "Segoe UI Light")
    .attr("font-size", "2em")
    .attr("data-value", "mlb")
    .style("cursor", "default")
    .style("stroke", "black")
    .style("opacity", .5)
    .attr("dy", "1em")
    .text("MLB")

    chartGroup.append("text")
    .attr("class", "initial-text")
    .attr("y", chartHeight/2)
    .attr("x", chartWidth/2)
    .attr("font-family", "Segoe UI Light")
    .attr("font-size", "5em")
    .style("cursor", "default")
    .style("stroke", "black")
    .style("opacity", .5)
    .style("text-anchor", "middle")
    .text("Click on a Sport to Start Exploring")


    var sport = ""
    var year = ""
    var toggle = 'reg'
    var menuDict = [{'nba': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 140,
                                'trianglex': 30},
                    'nfl': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 240,
                                'trianglex': 130},
                    'mlb': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 340,
                                'trianglex': 230}
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

        d3.selectAll(".topSubLine")
        .remove()

        d3.selectAll(".tracker-line")
        .remove()

        d3.selectAll(".toggle-buttons")
        .transition()
        .duration(650)
        .style("opacity", 0)
        .remove()        

        
        sport = d3.select(this).attr("data-value")
        x = menuDict[0][sport]['offset']
        years = menuDict[0][sport]['years']
        console.log(x)
        ySpace = 25
        xSpace = 0
        years.forEach(year => {
            chartGroup.append("text")
            .attr("y", ySpace)
            .attr("x", 10 + xSpace)
            .attr("class", "topSubMenu")
            .attr("font-family", "Segoe UI Light")
            .attr("font-size", "1.3em")
            .attr("data-value", year)
            .style("cursor", "default")
            .style("stroke", "black")
            .style("opacity", 0)
            .attr("dy", "1em")
            .text(year);
            if (year != 2017) {
            chartGroup.append("line")
                .attr("class", "topSubLine")
                .attr("x1", xSpace + 67 )
                .attr("y1", ySpace + 7)
                .attr("x2", xSpace + 67)
                .attr("y2", ySpace + 7)
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .transition()
                .duration(650)
                .attr("y2", ySpace + 20)
            }


            xSpace += 75
        })


        d3.selectAll(".topSubMenu").transition()
        .duration(500)
        .style("opacity", .5)


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

            d3.selectAll(".initial-text")
            .remove()

            year = d3.select(this).attr("data-value")
            console.log(year)
            d3.selectAll(".topSubMenu")
            .style("opacity", .5)
            d3.select(this)
            .style("opacity", 1.0)
            buildChart(sport, year, toggle)


            var trackerPath = [{'2012': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 30, "y": 20}, {"x": 30, "y": 25}],
                            '2013': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 105, "y": 20}, {"x": 105, "y": 25}],
                            '2014': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 180, "y": 20}, {"x": 180, "y": 25}],
                            '2015': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 255, "y": 20}, {"x": 255, "y": 25}],
                            '2016': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 330, "y": 20}, {"x": 330, "y": 25}],
                            '2017': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
                                            {"x": 405, "y": 20}, {"x": 405, "y": 25}]
                                            }]
            console.log(trackerPath)
            console.log(trackerPath[0]['2012'])
            console.log(trackerPath[0][String(year)])
            var trackerFunction = d3.line()
                                    .x(d=> {return d.x})
                                    .y(d=> {return d.y});

        if (d3.selectAll(".tracker-line").empty()){
            var tracker = chartGroup.append("path")
            .attr("class", "tracker-line")
            .attr("d", trackerFunction(trackerPath[0][String(year)]))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", 1000)
            .attr("stroke-dashoffset", 1000)
            .attr("fill", "none")

            }
        if (!d3.selectAll(".tracker-line").empty()){
            d3.selectAll(".tracker-line")
            .transition()
            .attr("d", trackerFunction(trackerPath[0][String(year)]))
            .attr("stroke-dasharray", 1000)
            .attr("stroke-dashoffset", 1000)
        }

            d3.selectAll(".toggle-buttons")
            .transition()
            .duration(650)
            .style("opacity", 0)
            .remove()

            var dataToggle = chartGroup.append("text")
            .attr("y", 65)
            .attr("x", 10)
            .attr("class", "toggle-buttons")
            .attr("font-family", "Segoe UI Light")
            .attr("font-size", "1em")
            .attr("data-value", 'reg')
            .style("cursor", "default")
            .style("stroke", "black")
            .style("opacity", 0)
            .attr("dy", "1em")
            .text("Regular Season")
            .transition()
            .delay(650)
            .duration(650)
            .style("opacity", 1)

            var dataToggle = chartGroup.append("text")
            .attr("y", 65)
            .attr("x", 125)
            .attr("class", "toggle-buttons")
            .attr("font-family", "Segoe UI Light")
            .attr("font-size", "1em")
            .attr("data-value", 'playoffs')
            .style("cursor", "default")
            .style("stroke", "black")
            .style("opacity", 0)
            .attr("dy", "1em")
            .text("Playoffs")
            .transition()
            .delay(650)
            .duration(650)
            .style("opacity", .5)
        })  
    })


function buildChart(sport, year, toggle){
    var url = ("/api/"+sport)

    var barHeight = chartHeight - 100
    
    d3.json(url).then((data) => {
        console.log(data)
        console.log(data[0])
        
            

            var yearData = data[0][toggle].filter(function(item) {
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
            .rangeRound([barHeight,100])

            xScale = d3.scaleBand()
            .domain(pctData.map(d => {return d['team']}))
            .rangeRound([0, chartWidth])
            .padding(0.1)

            xScale1 = d3.scaleBand()
            .domain(keys).rangeRound([0, xScale.bandwidth()])
            .padding(0.05)

            var z = d3.scaleOrdinal()
            .range(["#8a89a6","#a05d56"]);

            var leftAxis = d3.axisLeft(yScale)
            var botAxis = d3.axisBottom(xScale)

            var chartGroup = d3.select("#chart-group")


            g = chartGroup.append("g")
            .selectAll("g")
            .data(pctData)
            .enter().append("g")
            .attr("transform", function(d) { return "translate(" + xScale(d['team']) + ",0)"; });
            
            var bars = g.selectAll(".bar")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); });

            d3.selectAll(".bar")
            .transition()
            .duration(650)
            .attr('height', 0)
            .remove()
            
            bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => {return xScale1(d.key)})
            .attr("y", barHeight)
            .attr("width", xScale1.bandwidth())
            .attr("height", 0)
            .attr("fill", d=> {return z(d.key)})
            .merge(bars)
            .transition()
            .delay(function (d) {return Math.random()*850;})
            .duration(650)
            .attr("height", d=> {return barHeight - yScale(d.value)})
            .attr("y", d=> {return yScale(d.value)})
            .attr("x", d => {return xScale1(d.key)})
            .attr("width", xScale1.bandwidth());
            ;
            

            if (d3.selectAll("#y-axis").empty()) { 
            chartGroup.append("g")
                .attr("id", "y-axis")
                .call(leftAxis);

            chartGroup.append("g")
                .attr("id", "x-axis")
                .attr("transform", `translate(0, ${barHeight})`)
                .call(botAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("font-size", "1.2em")
                    .attr("dx", "-10px")
                    .attr("dy", "0px")
                    .attr("transform", "rotate(-55)")

            }else if (!d3.selectAll("#y-axis").empty()) {
                d3.select("#x-axis")
                .transition()
                .call(botAxis)
                .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("font-size", "1.2em")
                    .attr("dx", "-10px")
                    .attr("dy", "0px")
                    .attr("transform", "rotate(-55)")
            }
            /*d3.select("#chart-area")
                .style("height", "100%")*/

            d3.selectAll(".legendrect")
            .transition()
            .duration(650)
            .style("opacity", 0)

            d3.selectAll(".legendtext")
            .transition()
            .duration(650)
            .style("opacity", 0)

            var legend = chartGroup.append("g")
              .attr("font-family", "sans-serif")
              .attr("class", "legend")
              .attr("font-size", 12)
              .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(0," + (i + 3) * 20 + ")"; });
            
            legend.append("rect")
              .attr("x", chartWidth - 19)
              .attr("class", "legendrect")
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill", z)
              .style("opacity", 0)
              .transition()
              .delay(650)
              .duration(650)
              .style("opacity", 1);

            legend.append("text")
                .attr("class", "legendtext")
              .attr("x", chartWidth - 24)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .text(function(d) { return d; })
              .style("opacity", 0)
              .transition()
              .delay(650)
              .duration(650)
              .style("opacity", 1);

            d3.selectAll(".toggle-buttons").on("click", function() {
                d3.selectAll(".toggle-buttons")
                    .transition()
                    .duration(650)
                    .style("opacity", .5)
                if (d3.select(this).attr("data-value") != toggle) {
                    toggle = d3.select(this).attr("data-value")
                    d3.select(this).transition()
                        .duration(650)
                        .style("opacity", 1)

                    buildChart(sport, year, toggle)

                }
            })


        })
    }
}


console.log("hello");
window.addEventListener('load', init, false)
window.addEventListener('resize', init, false)
window.addEventListener('resize', buildChart, false)



/*chartGroup.append("text")
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
    .text("MLB")*/