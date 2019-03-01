var maxWidth = 1200;
var svgWidth, svgHeight, chartGroup, chartHeight, barGroup, barHeight, chartWidth, xScale, xScale1, botAxis, leftAxis, keys;
var sport, year, toggle;
var data = [];
var yearData, pctData;
var $container = $('#chart-area')
var svg = d3.select("#chart-area").append('svg');        
    xAxis = svg.select("#x-axis"),
    yAxis = svg.select("#y-axis");

var margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    };

var z = d3.scaleOrdinal()
            .range(["#8a89a6","#a05d56"]);



function init(){
    console.log(maxWidth)
    console.log(data)

    
        
    svgWidth = $container.width();
    svgHeight = 600;
    chartWidth = svgWidth - margin.left - margin.right; 
    chartHeight = 600 - margin.top - margin.bottom;




    svg 
        .attr("width", svgWidth)
        .attr("height", svgHeight)

        .style("border", "1px solid")

    var chartGroup = svg.append("g")
        .attr("id", "chart-group")
        .attr("transform", "translate(40,40)")


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
        .attr("font-size", 24)
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
                    'nfl': {'years': [2012,2013,2014,2015,2016],
                                'offset': 240,
                                'trianglex': 130},
                    'mlb': {'years': [2012,2013,2014,2015,2016,2017],
                                'offset': 340,
                                'trianglex': 230}
                    }]

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
        i=1
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
        console.log(years.length)
        if (i < years.length){
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
            i += 1
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


            var trackerPath = [{'nba': {'2012': [{"x": 30, "y": 10}, {"x": 30, "y": 20},
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
                                                        },
                                'nfl': {'2012': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 30, "y": 20}, {"x": 30, "y": 25}],
                                        '2013': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 105, "y": 20}, {"x": 105, "y": 25}],
                                        '2014': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 180, "y": 20}, {"x": 180, "y": 25}],
                                        '2015': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 255, "y": 20}, {"x": 255, "y": 25}],
                                        '2016': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 330, "y": 20}, {"x": 330, "y": 25}],
                                        '2017': [{"x": 130, "y": 10}, {"x": 130, "y": 20},
                                                        {"x": 405, "y": 20}, {"x": 405, "y": 25}]
                                                        },
                                'mlb': {'2012': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 30, "y": 20}, {"x": 30, "y": 25}],
                                        '2013': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 105, "y": 20}, {"x": 105, "y": 25}],
                                        '2014': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 180, "y": 20}, {"x": 180, "y": 25}],
                                        '2015': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 255, "y": 20}, {"x": 255, "y": 25}],
                                        '2016': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 330, "y": 20}, {"x": 330, "y": 25}],
                                        '2017': [{"x": 230, "y": 10}, {"x": 230, "y": 20},
                                                        {"x": 405, "y": 20}, {"x": 405, "y": 25}]
                                                        } }]

            var trackerFunction = d3.line()
                                    .x(d=> {return d.x})
                                    .y(d=> {return d.y});

            if (d3.selectAll(".tracker-line").empty()){
                var tracker = chartGroup.append("path")
                .attr("class", "tracker-line")
                .attr("d", trackerFunction(trackerPath[0][sport][String(year)]))
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", 1000)
                .attr("stroke-dashoffset", 1000)
                .attr("fill", "none")

            }
            if (!d3.selectAll(".tracker-line").empty()){
                d3.selectAll(".tracker-line")
                .transition()
                .attr("d", trackerFunction(trackerPath[0][sport][String(year)]))
                .attr("stroke-dasharray", 1000)
                .attr("stroke-dashoffset", 1000)
            }

            d3.selectAll(".toggle-buttons")
            .transition()
            .duration(650)
            .style("opacity", 0)
            .remove()
            if (sport == 'nba' ){
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
            }
        })  
    })

}

function buildChart(sport, year, toggle) {

    var url = ("/api/"+sport)

    var barHeight = chartHeight - 100
    
    d3.json(url).then((data) => {          

        var yearData = data[0][toggle].filter(function(item) {
            return item.year == year
        })

        var pctData = _.map(yearData, function(o) {
            return _.pick(o, 'team', 'home_pct', 'away_pct', 'away_win', 'away_loss', 'home_win', 'home_loss')
        })

        var keys = ['home_pct', 'away_pct']
        var keys2 = ['home', 'away']
        console.log(keys)
        console.log(data)
        console.log(yearData)
        console.log(pctData)

        var test = pctData.map(d=> { return keys2.map(function(key) { return {key: key + "_pct", value: d[key + "_pct"], w: d[key + "_win"], l: d[key + "_loss"]}; }); })
        console.log(test)
        
        yScale = d3.scaleLinear()
        .domain([0,100])
        .rangeRound([barHeight,100])

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

        g = chartGroup.append("g")
        .selectAll("g")
        .data(pctData)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + xScale(d['team']) + ",0)"; });
        
        d3.selectAll(".bar")
        .transition()
        .duration(650)
        .attr('height', 0)
        .remove()

        var bars = g.selectAll("rect")
        .data(function(d) { return keys2.map(function(key) { return {key: key + "_pct", value: d[key + "_pct"], w: d[key + "_win"], l: d[key + "_loss"], team: d["team"]}; }); });

        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => {return xScale1(d.key)})
            .attr("y", barHeight)
            .attr("width", xScale1.bandwidth())
            .attr("height", 0)
            .attr("fill", d=> {return z(d.key)})
            .style("opacity", .8)
            .merge(bars)
            .transition()
            .delay(function (d) {return Math.random()*850;})
            .duration(650)
            .attr("height", d=> {return barHeight - yScale(d.value)})
            .attr("y", d=> {return yScale(d.value)})
            .attr("x", d => {return xScale1(d.key)})
            .attr("width", xScale1.bandwidth())

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .html(function(d) {
                console.log(d)
                return (d.team + "<br>" + "Win: " + d.w + "  Loss: " + d.l + "<br>" + "Win %:     " + d.value)
            })
        chartGroup.call(toolTip)

        d3.selectAll("rect").on("mouseover", function(d) {
            console.log("mouseover")
            toolTip
                .offset([-10,0])
                .show(d, this)

            d3.select(this).style("opacity", 1)

            lineheight = d3.select(this).node()
            console.log(lineheight.height)
            console.log(lineheight.height.baseVal.value)

            svg.append("line")
                .attr("class", "measuring-line")
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("x1", 0)
                .attr("x2", chartWidth)
                .attr("y1", chartHeight - lineheight.height.baseVal.value - 60)
                .attr("y2", chartHeight - lineheight.height.baseVal.value - 60)
        })
        .on("mouseout", function(d) {
            toolTip.hide(d)
            d3.select(this).style("opacity", .8)
            d3.selectAll(".measuring-line")
            .remove()
        })

        function updateBars() {
            chartWidth = $('#chart-area').width() -80
            console.log(chartWidth)
            d3.selectAll(".bar")
                .transition()
                .duration(150)
                .attr('width', 0)
                .remove()

            var width = $('#chart-area').width()
            xScale.rangeRound([0, (width - margin.left - margin.right)])
            xScale1.rangeRound([0, xScale.bandwidth()])

            var botAxis = d3.axisBottom(xScale)

            d3.select("#x-axis")
            .transition()
            .call(botAxis)
            
           svg.attr("width", $('#chart-area').width())
            console.log($('#chart-area').width())

            g.attr("transform", function(d) { return "translate(" + xScale(d['team']) + ",0)"; });

            var bars = g.selectAll("rect")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); });

            bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", barHeight)
            .attr("width", xScale1.bandwidth())
            .attr("height", d=> {return barHeight - yScale(d.value)})
            .attr("fill", d=> {return z(d.key)})
            .style("opacity", .8)
            .merge(bars)
            .transition()
            .delay(250)
            .duration(250)
            .attr("height", d=> {return barHeight - yScale(d.value)})
            .attr("y", d=> {return yScale(d.value)})
            .attr("x", d => {return xScale1(d.key)})
            .attr("width", xScale1.bandwidth())           
        }
        function update() {
            updateBars()
        }

        W.addListener(update)

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
            .text(function(d) { if (d == 'home_pct') {return "Home"} if (d == 'away_pct') {return "Away"} })
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
init()