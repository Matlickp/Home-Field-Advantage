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
        travelLayers.DEFAULT.eachLayer((layer) => {
            console.log(layer)
            if ((layer.teamname) && (layer.teamname != hometeamname)){
                console.log(teamdict[layer.teamname])
                console.log(teamdict[layer.teamname]["wins"])
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
                    console.log(popup)
                    popup.setLatLng(e.latlng).openOn(map)
    
                })
            }
        }
    )} 

    d3.json(geo_url).then((geoData) => {
        console.log(geoData)
        d3.json(url).then((data) => {

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

                var teamIcon = new baseIcon({iconUrl: "/static/images/nbalogos/" + teamname + ".png"})

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

                // teamMarker.bindPopup(teamname);
                teamMarker["teamname"] = teamname

                // teamMarker.on('mouseover', function () {
                //     this.openPopup();
                // })

                // teamMarker.on('mouseout', function () {
                //     this.closePopup();
                // })

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


                            // var circleIcon = L.divIcon({
                            //     iconSize: [100,100],
                            //     className: "circle-divicon" 
                            // })

                            // var indivIcon = L.marker(test2, {
                            //     icon: circleIcon
                            // })


                            Geodesic['teamname'] = instance
                            infoCircle['teamname'] = instance
                            // indivIcon['teamname'] = instance

                            // infoCircle.bindTooltip(vsString + wlString + "Win Percentage: " + pctstring + "%")
                            // Geodesic.bindTooltip(vsString + wlString + "Win Percentage: " + pctstring + "%")
                            Geodesic.on('mouseover', function() {
                                // console.log('boobs')
                                // this.openTooltip()
                                this.setStyle({opacity: 1})                                                              
                            })

                            Geodesic.on('mouseout', function() {
                                // console.log('boobs')
                                // this.openTooltip()
                                this.setStyle({opacity: .5})                            
                            })
                            
                        Geodesic.addTo(travelLayers.DEFAULT)
                        infoCircle.addTo(travelLayers.DEFAULT)
                        // indivIcon.on('add', function() {
                        //     var myIcon = document.querySelector('.circle-divicon')
                        //     setTimeout(function(){
                        //     myIcon.style.width = '5000px'
                        //     myIcon.style.height = '5000px'
                        //     myIcon.style.borderRadius = '50%'
                        //     myIcon.style.marginLeft = '-25px'
                        //     myIcon.style.marginTop = '-25px'
                        //     myIcon.style.backgroundColor = "blue"
                            
                        //   }, 1000)
                        // })
                        // indivIcon.addTo(travelLayers.DEFAULT)                            
                        }
                    })
                callMouseover(teamdict, hometeam)
                })
                teamMarker.addTo(travelLayers.DEFAULT)
            }
        })
    })
}



init()

// create a layer for each team on