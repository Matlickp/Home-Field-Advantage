function init() {
    console.log('howdy')
    var z = d3.scaleLinear()
            .domain([0, 50, 100])
            .range(["#a05d56","#476840"]);

    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var travelLayers = {
        DEFAULT: new L.LayerGroup()
    };

    var map = L.map("travel-chart-area", {
      center: [41.205333, -101.065578],
      zoom: 4.5,
      layers: [
        travelLayers.DEFAULT
      ]
    });
    
    

    var svg = d3.select(map.getPanes().overlayPane).append('svg')
        .attr("height", 1570)
        .attr("width", 800)

    var g = svg.append("g").attr("class", "leaflet-zoom-hide")

    lightMap.addTo(map);

    var overlays = {
        "Travel": travelLayers.DEFAULT
    };

    L.control.layers(null, overlays).addTo(map);

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
    function callMouseover(teamdict, hometeamname){ 
        opacityDict = {}
        opacityDict1 = {}
        travelLayers.DEFAULT.eachLayer((layer) => {
            tempdict = {}
            // layer.unbindTooltip();
            // id = getLayerId(layer)
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
            console.log(tempdict)
            console.log(travelLayers.DEFAULT.getLayer(cl))

            // if (layer.teamname == hometeamname){
            //     layer.bindTooltip(" ", {opacity: 0})
            // }


            if ((layer.teamname) && (layer.teamname != hometeamname)){
                mlatlngs = layer.latlng
                // console.log(teamdict[layer.teamname]["wins"])
                mOppoTeam = layer.teamname

                mWins = teamdict[layer.teamname]["wins"]
                mLosses = teamdict[layer.teamname]["losses"]
                teamString = hometeamname + " @ " + mOppoTeam + "<br>"
                winsString = "Wins: " + mWins + " Losses: " + mLosses + "<br>"

                var mPct = (mWins / (mWins + mLosses))
                var mPctrounded = Math.round(mPct * 100)/100
                var mPctstring = "Win Percentage: " + (Number.parseFloat(mPct).toPrecision(2)) + "%"
                layer.bindTooltip(teamString + winsString + mPctstring)
                layer.on('mouseover', function(e) {
    
                    var popup = e.target.getTooltip()
                    console.log(layer)
                    console.log(e.target)
                    console.log(opacityDict[mOppoTeam])
                    if (layer.options.icon) {
                        barg = travelLayers.DEFAULT.getLayer(opacityDict1[layer.teamname]["id"])
                        barg.setStyle({fillOpacity: 1})
                        zarg = travelLayers.DEFAULT.getLayer(opacityDict[layer.teamname]["id"])
                        zarg.setStyle({opacity: 1})
                        console.log(barg)
                        console.log(zarg)
                        console.log("zz")
                    }
                    popup.setLatLng(mlatlngs).openOn(map)
                })
                layer.on('mouseout', function(e) {
                    if (layer.options.icon) {
                        barg = travelLayers.DEFAULT.getLayer(opacityDict1[layer.teamname]["id"])
                        barg.setStyle({fillOpacity: .7})
                        zarg = travelLayers.DEFAULT.getLayer(opacityDict[layer.teamname]["id"])
                        zarg.setStyle({opacity: .7})
                        console.log(barg)
                        console.log(zarg)
                        console.log("zz")
                    }
                })
            }
        })
        console.log(opacityDict)
        console.log(opacityDict1)
    }

    map.on("overlayadd", function() {
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
        buildGraph();

    })
    function buildGraph(){
        d3.json(geo_url).then((geoData) => {
    
            console.log(geoData)
    
            var cityMarkers = [];
            var coordDict = {};
            var matchupDict  = {};
            for (var i = 0; i < geoData['geo'].length; i++) {
    
                var teamname = geoData['teamnames'][i];
                var allteams = geoData['teamnames']
                console.log(teamname);
                console.log(geoData['geoicons'][i].city)
                var geoLat = +geoData['geoicons'][i].lat;
                var geoLng = geoData['geoicons'][i].lng;
                var geoCoords = [geoLat, geoLng];
                console.log(geoCoords);
                coordDict[teamname] = geoCoords
    
                var baseIcon = L.Icon.extend({
                    options: {
                        iconSize: [50,50]
                        
                    }
                })      
    
                var teamIcon = new baseIcon({iconUrl: "/static/images/nbalogos/" + teamname + ".png", className: "team-icon"})
                teamIcon["teamname"] = teamname;
                teamIcon["ident"] = "imgicon"
    
                var teamMarker = L.marker(geoCoords, {icon: teamIcon});
    
                var cityLat = +geoData['geo'][i].lat;
                var cityLng = geoData['geo'][i].lng;
                var cityCoords = [cityLat, cityLng]
                console.log(cityCoords)
                var lineCoords = [geoCoords, cityCoords]
                console.log(lineCoords)
    
                var lineStart = new L.LatLng(geoLat, geoLng)
                var lineEnd = new L.LatLng(cityLat, cityLng)
    
                var Geodesic = L.geodesic([[lineStart, lineEnd]], {
                            weight: 2,
                            opacity: 1,
                            color: "black",
                            steps: 50
                        }).addTo(travelLayers.DEFAULT)

                var endCircle = L.circle(lineEnd, 7500, {
                    color: "black",
                    className: "end-line",
                    fillColor: "black",
                    fillOpacity: 1
                }).addTo(travelLayers.DEFAULT)
    
                teamMarker["teamname"] = teamname
    
    
                teamMarker.on('click', function() {
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
    
                    var latlngs = []
                    var hometeam = this.teamname;
                    console.log(hometeam);
                    var homecoords = coordDict[this.teamname];
                    var testcoords = coordDict['Atlanta Hawks']
                    console.log(geoData['matchup'])
                    console.log(geoData['matchup'][hometeam])
                    var teamdict = geoData['matchup'][hometeam]
                    allteams.forEach((instance) => {
    
                        if (hometeam != instance){
                            oppocoords = coordDict[instance]
                            var test1 = new L.LatLng(homecoords[0], homecoords[1])
                            var test2 = new L.LatLng(oppocoords[0], oppocoords[1])
    
                            var awaywins = teamdict[instance]['wins']
                            var awaylosses = teamdict[instance]['losses']
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
                                color: z(pct),
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
                            
                        Geodesic.addTo(travelLayers.DEFAULT)
                        infoCircle.addTo(travelLayers.DEFAULT)
                           
                        }
                    })
                callMouseover(teamdict, hometeam)
                })
    
            teamMarker.addTo(travelLayers.DEFAULT)
    
    
    
            }
        })
    }
    buildGraph()
}



init()

// create a layer for each team on