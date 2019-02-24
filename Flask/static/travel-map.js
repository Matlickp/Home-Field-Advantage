function init() {
    console.log('howdy')
    var z = d3.scaleOrdinal()
            .range(["#a05d56", "#54824a"]);

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

    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
        console.log(point.x)
        console.log(point.y)
    }
    // var transform = d3.geo.transform({point: projectPoint}),
    //     path = d3.geo.path().projection(transform);

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
    function callMouseover(){ 
                    travelLayers.DEFAULT.eachLayer((layer) => {
                       layer.on('mouseover', function(e) {
                        console.log("layer")
                        var popup = e.target.getTooltip()
                        popup.setLatLng(e.latlng).openOn(map)
                        }) 
                    })} 

    console.log('why')
    d3.json(geo_url).then((geoData) => {
        console.log(geoData)
        d3.json(url).then((data) => {
/*            var states = geoData.state;
            var cities = geoData.city;
            var lats = geoData.lat;
            var lngs = geoData.lng;*/
            var cityMarkers = [];
            var coordDict = {};
            var matchupDict  = {};
            for (var i = 0; i < geoData['geo'].length; i++) {
                // var citiesObj = Object.assign({}, lat[])
                var teamname = geoData['teamnames'][i];
                var allteams = geoData['teamnames']
                console.log(teamname);
                console.log(geoData['geo'][i].city)
                var geoLat = +geoData['geo'][i].lat;
                var geoLng = geoData['geo'][i].lng;
                var geoCoords = [geoLat, geoLng];
                console.log(geoCoords);
                coordDict[teamname] = geoCoords

                var baseIcon = L.Icon.extend({
                    options: {
                        iconSize: [65,65]
                    }
                })      

                var teamIcon = new baseIcon({iconUrl: "/static/images/nbalogos/" + teamname + ".png"})

                var teamMarker = L.marker(geoCoords, {icon: teamIcon});

                teamMarker.bindPopup(teamname);
                teamMarker["teamname"] = teamname

                teamMarker.on('mouseover', function () {
                    this.openPopup();
                })

                teamMarker.on('mouseout', function () {
                    this.closePopup();
                    // console.log(this)
                })

                teamMarker.on('click', function() {
                    d3.selectAll("path")
                    .transition()
                    .duration(500)
                    .style("stroke-opacity", 0)
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
                            // console.log(oppocoords)
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
                                weight: 7,
                                opacity: 0.5,
                                color: z(pct),
                                steps: 50
                            })
                            // Geodesic.bindPopup(pctstring)
    
                            Geodesic.on('mouseover', function() {
                                // console.log('boobs')
                                // this.openPopup();
                            })

                            Geodesic.bindTooltip(vsString + wlString + "Win Percentage: " + pctstring + "%")
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
                        console.log(Geodesic)
                        Geodesic.addTo(travelLayers.DEFAULT)
                            
                        }


   
                    })
     
                    

                    // d3.selectAll("path").on("mouseover", function() {
                    //                 console.log("yeah")
                    //                 d3.select(this).style("stroke-opacity", 1)
                    //             })




                callMouseover()
                })


                teamMarker.addTo(travelLayers.DEFAULT)


            }


            console.log(coordDict);
            
        })
        

    })
    
}



init()

// create a layer for each team on