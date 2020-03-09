// Store our API data
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// send request to the query URL
d3.json(queryUrl, function(data) {
  
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

// set radius
function radius(mag){
  return mag * 10000;
}

function styleSet(mag){
  if (mag > 5){
    return 'red'
  } else if (mag > 4) {
    return 'orange'
  } else if (mag > 3){
    return 'blue'
  } else if (mag > 2) {
    return 'yellow'
  } else if (mag > 1) {
    return 'green' 
  } else {
    return 'purple'
  }
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng){
      return L.circle(latlng,{
        radius: radius(earthquakeData.properties.mag),
        color:styleSet(earthquakeData.properties.mag),
        fillOpacity:2
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: 'pk.eyJ1Ijoia3Jicm93MDAiLCJhIjoiY2s2bnV2aDY0MTR0YzNlbnllenZzczk5diJ9.doyA7MQtVklp1Stbxu6Q7g'
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: 'pk.eyJ1Ijoia3Jicm93MDAiLCJhIjoiY2s2bnV2aDY0MTR0YzNlbnllenZzczk5diJ9.doyA7MQtVklp1Stbxu6Q7g'
  });

  // Define a baseMaps to hold our layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};

  var legend = L.control({position:'bottomleft'});

    legend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'info legend'),
       mag = [0,1,2,3,4,5,6],
       label = [];

    // loop to create severity
    for (var i = 0; i < mag.length; i++) {
      div.innerHTML +=
        'i style="background:' + styleSet(mag[i] + 1) + '"></i>' +
        mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+')
    }
    return div;
};

  legend.addTo(myMap);

