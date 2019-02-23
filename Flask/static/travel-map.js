function init() {
    console.log('howdy')

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


    console.log('why')
    d3.json(geo_url).then((geoData) => {
        console.log(geoData)
        d3.json(url).then((data) => {
/*            var states = geoData.state;
            var cities = geoData.city;
            var lats = geoData.lat;
            var lngs = geoData.lng;*/
            var cityMarkers = [];

            for (var i = 0; i < geoData['geo'].length; i++) {
                // var citiesObj = Object.assign({}, lat[])
                var teamname = geoData['teamnames'][i];
                console.log(teamname);
                console.log(geoData['geo'][i].city)
                var geoLat = +geoData['geo'][i].lat;
                var geoLng = geoData['geo'][i].lng;
                var geoCoords = [geoLat, geoLng];
                console.log(geoCoords);
                // console.log(geoLng)
                // console.log("lat: " + geoData[i].lat + "lng: " + geoData[i].lng);

                var baseIcon = L.Icon.extend({
                    options: {
                        iconSize: [65,65]
                    }
                })

                var teamIcon = new baseIcon({iconUrl: "/static/images/nbalogos/" + teamname + ".png"})

                var teamMarker = L.marker(geoCoords, {icon: teamIcon});

                teamMarker.bindPopup(teamname);

                teamMarker.on('mouseover', function () {
                    this.openPopup();
                })

                teamMarker.on('mouseout', function () {
                    this.closePopup();
                })

                teamMarker.addTo(travelLayers.DEFAULT)

            }

        })

    })
}
init()
