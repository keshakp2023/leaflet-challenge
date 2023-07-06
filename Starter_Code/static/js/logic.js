// Create the base layers.
var OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
        '<br> USGS Analyst: Kesha<a bref="https://github.com/keshakp2023/leaflet-challenge.git">Github Repo</a>'
});

var graphicMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' +
        '<br> USGS Analyst: Kesha<a bref="https://github.com/keshakp2023/leaflet-challenge.git">Github Repo</a>'
});


var USGSurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"



var baseMaps = {
    "Street Map View": OpenStreetMap,
    "graphic Map View": graphicMap
};

var earthquakes = new L.layerGroup();

var overlayMaps = {
    Earthquakes: earthquakes
};


var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [OpenStreetMap, earthquakes]
});


L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

////


d3.json(USGSurl).then(function (data) {
    console.log(data.features[0]);

    function markerSize(magnitude) {
        return magnitude * 4
    }

    function colorscale(depth) {
        return depth > 90 ? '#ec4d4d' :
                depth > 70 ? '#f89681' :
                    depth > 50 ? '#f0a137' :
                        depth > 30 ? '#f0d610' :
                            depth > 10 ? '#cff010' :
                                depth > -10 ? '#6cf010' :
                                    '#FFEDA0';
    }

    function MarkerInfo(feature) {
        return {
            radius: markerSize(feature.properties.mag),
            fillColor: colorscale(feature.geometry.coordinates[2]),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };

    }


    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: MarkerInfo,

        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(`
        <h3>${feature.properties.place}</h3>
        <hr>
        <p>${new Date(feature.properties.time)}</p>
        <h3>Magnitude: ${feature.properties.mag}</h3>
        <h3>Depth: ${feature.geometry.coordinates[2]}</h3>
        `);
        }


    }).addTo(myMap);


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div','legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += 
                '<i style="background:' + colorscale(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(myMap);
});

