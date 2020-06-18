// Creating map object
var map = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4
    });

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {	
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10", 
    accessToken: API_KEY
    }).addTo(map);

// URL to All Earthquakes from the Past 7 Days
// Source: United States Geological Survey GeoJSON Feed (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting the GeoJSON data
d3.json(url).then(function(data) {

    // console.log(data.features);

    function getColor(mag) {
        return mag > 5 ? '#bd0026' :
               mag > 4 ? '#f03b20' :
               mag > 3 ? '#fd8d3c' :
               mag > 2 ? '#feb24c' :
               mag > 1 ? '#fed976' :
                        '#ffffb2';
    }

    function geojsonMarkerOptions(feature) {
        return {
            radius: feature.properties.mag * 2.5,
            fillColor: getColor(feature.properties.mag),
            color: "#606060",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        }
    };

    // Creating a GeoJSON layer with the retrieved data
    var geojson = L.geoJson(data.features, {
        // Using the pointToLayer option to create a CircleMarker
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: geojsonMarkerOptions,
        onEachFeature: function(feature, layer) {
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                      color: "#000000",
                      weight: 1.7,
                    });
                },
                // geojson.resetStyle method will reset the layer style to its default state (defined by our style function)
                // Code Source: https://leafletjs.com/examples/choropleth/
                mouseout: function(event) {
                    geojson.resetStyle(event.target)
                  },
            });
            layer.bindPopup(`<p><strong>Magnitude: </strong>${feature.properties.mag}<br><strong>Location: </strong>${feature.properties.place}<br>${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(map);

    // Creating a legend
    // Code Source: https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var labels = [];

        var legendInfo = "<h3>Earthquake<br>Magnitude</h3>";
        div.innerHTML = legendInfo;

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? ' &ndash; ' + magnitudes[i + 1] + '<br>' : ' +');
        }

        return div;
    };

    // Adding legend to the map
    legend.addTo(map);

});

