function init() {
    console.log('howdy')
    var z = d3.scaleLinear()
        .range(["#990000", "#004d00"]);

    var y = d3.scaleLinear()
        .range(["#990000", "#004d00"]);

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });


    var travelLayers = {
        nba: new L.LayerGroup(),
        nfl: new L.LayerGroup(),
        mlb: new L.LayerGroup()
    };

    var map = L.map("travel-chart-area", {
      center: [36.87962060502676, -95.2733064227219],
      zoom: 4.5,
      layers: [

        travelLayers.nba
      ]
    });
    
    

    var svg = d3.select(map.getPanes().overlayPane).append('svg')
        .attr("height", 1570)
        .attr("width", 800)

    var g = svg.append("g").attr("class", "leaflet-zoom-hide")

    lightMap.addTo(map);

    var overlays = {
        "NBA": travelLayers.nba,
        "NFL": travelLayers.nfl,
        "MLB": travelLayers.mlb
    };

    L.control.layers(overlays, null).addTo(map);

    var info = L.control({
        position: "topright"
    });

    info.onAdd = function() {
        var legendDiv = L.DomUtil.create("div", "legend");
        return legendDiv;
    }

    info.addTo(map);

    geo_url = "/api/nbageo";
    url = "/api/nba";
    function callMouseover(teamdict, teamdict_home, hometeamname, sport){ 
        opacityDict = {}
        opacityDict1 = {}
        travelLayers[sport].eachLayer((layer) => {
            tempdict = {}

            name = layer.teamname
            cl = layer._leaflet_id
            id = layer.ident

            tempdict["type"] = id
            tempdict["id"] = cl
            if (tempdict["type"] == "geoline"){
                opacityDict[layer.teamname] = tempdict
            }
            if (tempdict["type"] == "infocircle"){
                opacityDict1[layer.teamname] = tempdict
            }





            if ((layer.teamname) && (layer.teamname != hometeamname)){
                mlatlngs = layer.latlng
                // console.log(teamdict[layer.teamname]["wins"])
                mOppoTeam = layer.teamname
                    try{
                    mWins = teamdict[layer.teamname]["wins"]
                    mLosses = teamdict[layer.teamname]["losses"]
                    teamString = hometeamname + " @ " + mOppoTeam + "<br>"
                    winsString = "Away: " + mWins + "W " + mLosses + "L " 

                    mWins_home = teamdict_home[layer.teamname]["wins"]
                    mLosses_home = teamdict_home[layer.teamname]["losses"]
                    winsString_home = "Home: " + mWins_home + "W " + mLosses_home + "L<br>"

                    var mPct = (mWins / (mWins + mLosses))
                    var mPctrounded = (mPct * 100)
                    var mPctstring = "Away Win %: " + (mPctrounded.toFixed(2)) + "%<br>"

                    var mPctHome = (mWins_home / (mWins_home + mLosses_home))
                    var mPctroundedHome = (mPctHome * 100)
                    var mPctstringHome = "Home Win %: " + (mPctroundedHome.toFixed(2)) + "%<br><hr>"

                    var differenceString = "Home / Away Split: <strong>" + (mPctroundedHome - mPctrounded).toFixed(2) + "</strong>%"

                    layer.bindTooltip(teamString + winsString + winsString_home + mPctstring + mPctstringHome + differenceString)
                    layer.on('mouseover', function(e) {
        
                        var popup = e.target.getTooltip()
                        console.log(layer)
                        console.log(e.target)
                        console.log(opacityDict[mOppoTeam])
                        if (layer.options.icon) {
                            barg = travelLayers[sport].getLayer(opacityDict1[layer.teamname]["id"])
                            barg.setStyle({fillOpacity: 1})
                            zarg = travelLayers[sport].getLayer(opacityDict[layer.teamname]["id"])
                            zarg.setStyle({opacity: 1})
                            console.log(barg)
                            console.log(zarg)
                            console.log("zz")
                        }
                        popup.setLatLng(mlatlngs).openOn(map)
                    })
                    layer.on('mouseout', function(e) {
                        if (layer.options.icon) {
                            barg = travelLayers[sport].getLayer(opacityDict1[layer.teamname]["id"])
                            barg.setStyle({fillOpacity: .7})
                            zarg = travelLayers[sport].getLayer(opacityDict[layer.teamname]["id"])
                            zarg.setStyle({opacity: .7})
                            console.log(barg)
                            console.log(zarg)
                            console.log("zz")
                        }
                    })
                }catch(error) {console.log("no mouseover data")}
            }
        })
        console.log(opacityDict)
        console.log(opacityDict1)
    }

    map.on("baselayerchange", function(e) {
        console.log(this)
        console.log(e)
        console.log("layer change")
        d3.selectAll(".travel-arc")

            .style("stroke-opacity", 0)
            .remove();

        d3.selectAll(".travel-circle")

            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .remove();
        d3.selectAll(".team-icon")
            .remove()

        sportname = e.name
        console.log(sportname)
        buildGraph();

    })
    map.invalidateSize()

    map.on("move", function() {
        console.log(map.getCenter())
    })
    function buildGraph(){
        sportnames = ['nba', 'nfl', 'mlb']
        d3.json(geo_url).then((geoData) => {
    
            console.log(geoData)
    
            var cityMarkers = [];
            var coordDict = {};
            var matchupDict  = {};
            // NBA
            sportnames.forEach((sport) => {
            for (var i = 0; i < geoData['geo'][sport].length; i++) {
                 
                var teamname = geoData['teamnames'][sport][i];
                var allteams = geoData['teamnames'][sport]
                console.log(teamname)

                var geoLat = +geoData['geoicons'][sport][i].lat;
                var geoLng = geoData['geoicons'][sport][i].lng;
                var geoCoords = [geoLat, geoLng];
                coordDict[teamname] = geoCoords
    
                var baseIcon = L.Icon.extend({
                    options: {
                        iconSize: [50,50]
                        
                    }
                })      
    
                var teamIcon = new baseIcon({iconUrl: "/static/images/"+ sport + "logos/" + teamname + ".png", className: "icon-marker"})
                teamIcon["teamname"] = teamname;
                teamIcon["ident"] = "imgicon"
    
                var teamMarker = L.marker(geoCoords, {icon: teamIcon, className: "icon-marker"});
    
                var cityLat = +geoData['geo'][sport][i].lat;
                var cityLng = geoData['geo'][sport][i].lng;
                var cityCoords = [cityLat, cityLng]

                var lineCoords = [geoCoords, cityCoords]

    
                var lineStart = new L.LatLng(geoLat, geoLng)
                var lineEnd = new L.LatLng(cityLat, cityLng)
    
                var Geodesic = L.geodesic([[lineStart, lineEnd]], {
                            weight: 2,
                            opacity: 1,
                            color: "black",
                            steps: 50,
                            className: "icon-line"
                        }).addTo(travelLayers[sport])

                var endCircle = L.circle(lineEnd, 7500, {
                    color: "black",
                    className: "end-line",
                    fillColor: "black",
                    fillOpacity: 1,
                    className: "icon-line"
                }).addTo(travelLayers[sport])


    
                teamMarker["teamname"] = teamname
    
    
                teamMarker.on('click', function(e) {
                    d3.selectAll(".travel-arc")
                    .transition()
                    .duration(500)
                    .style("stroke-opacity", 0)
                    .remove();
    
                    d3.selectAll(".travel-circle")
                    .transition()
                    .duration(500)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .remove();

                    // if (sport != sportname){
                    //     travelLayers[sport].eachLayer((layer) => {
                    //         layer.unbindTooltip()
                    //     })
                    // }

                    console.log(e)

                    var latlngs = []
                    var hometeam = this.teamname;
                    e.target.bindTooltip(hometeam + ": Data for 2012-2017 Seasons")

                    console.log(hometeam);
                    var homecoords = coordDict[this.teamname];
                    var testcoords = coordDict['Atlanta Hawks']
                    console.log(geoData['matchup'][sport])
                    console.log(geoData['matchup'][sport][hometeam])
                    var teamdict = geoData['matchup'][sport]['away'][hometeam]
                    var teamdict_home = geoData['matchup'][sport]['home'][hometeam]
                    recordMinMax = []
                    recordMinMaxHome = []
                    console.log(teamdict)
                    allteams.forEach((recordname) => {

                        console.log(teamdict[recordname])
                        try {
                            var recordPct = (teamdict[recordname].wins / (teamdict[recordname].wins + teamdict[recordname].losses)) * 100
                            recordMinMax.push(recordPct)

                            var recordPctHome = (teamdict_home[recordname].wins / (teamdict_home[recordname].wins + teamdict_home[recordname].losses)) * 100
                            recordMinMaxHome.push(recordPctHome)
                            }
                        catch(error) {console.log("error")}
                    })
                    console.log(recordMinMax)

                    awaymax = d3.max(recordMinMax)
                    awaymin = d3.min(recordMinMax)

                    homemax = d3.max(recordMinMaxHome)
                    homemin = d3.min(recordMinMaxHome)

                    z.domain([awaymin, awaymax])
                    y.domain([homemin, homemax])

                    console.log(awaymax)


                    allteams.forEach((instance) => {
    
                        if (hometeam != instance){
                            try {
                                var oppocoords = coordDict[instance]
                                var test1 = new L.LatLng(homecoords[0], homecoords[1])
                                var test2 = new L.LatLng(oppocoords[0], oppocoords[1])
                                console.log(instance)
                                var awaywins = teamdict[instance]['wins']
                                var awaylosses = teamdict[instance]['losses']
                                var homewins = teamdict_home[instance]['wins']
                                var homelosses = teamdict_home[instance]['losses']
                                var home_pct = (homewins / (homewins + homelosses)) * 100
                                var pct = (awaywins / (awaywins + awaylosses)) * 100
                                var pctrounded = Math.round(pct * 100)/100
                                var pctstring = Number.parseFloat(pct).toPrecision(4)
                                var vsString = hometeam + " @ " + instance + ":<br>"
                                var wlString = "Win: " + awaywins + "  Loss: " + awaylosses + "<br>"
                                var Geodesic = L.geodesic([[test1, test2]], {
                                    weight: 4,
                                    opacity: 0.7,
                                    color: z(pct),
                                    steps: 50,
                                    className: "travel-arc"
                                })
                                var infoCircle = L.circle(test2, 150000, {
                                    color: y(home_pct),
                                    weight: 5,
                                    className: "travel-circle",
                                    fillColor: z(pct),
                                    fillOpacity: .7
                                })
        
        
                                Geodesic['teamname'] = instance
                                Geodesic['ident'] = "geoline"
                                infoCircle['teamname'] = instance
                                infoCircle['ident'] = "infocircle"
        
                                Geodesic.on('mouseover', function() {
        
                                    this.setStyle({opacity: 1})                                                              
                                })
        
                                Geodesic.on('mouseout', function() {
        
                                    this.setStyle({opacity: .5})                            
                                })
                                infoCircle.on('mouseover', function() {
        
                                    this.setStyle({fillOpacity: 1})                                                              
                                })
        
                                infoCircle.on('mouseout', function() {
        
                                    this.setStyle({fillOpacity: .5})                            
                                })
                                
                            Geodesic.addTo(travelLayers[sport])
                            infoCircle.addTo(travelLayers[sport])
                            }catch(error) {console.log(error)}
                        }
                    })
                callMouseover(teamdict, teamdict_home, hometeam, sport)
                })
    
            teamMarker.addTo(travelLayers[sport])
    
    
    
            }
            })
        })
    }
    buildGraph()
}



d3.selectAll('.toast').style('opacity', 1)

d3.select('#toast-button').on("click", function() {
    d3.select('.toast').remove()
})
init()

// create a layer for each team on