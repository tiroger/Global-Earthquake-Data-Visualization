// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data.features),
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // We define a function for each feature in the features array
    // Creating a popup describing the place, time and magnitude of the earthquake
    function onEachFeature(feature, layer) {
      // console.log(feature.properties.mag)
      // console.log(feature.properties.place)
      // console.log(Date(feature.properties.time))
      layer.bindPopup("<h6> Location: " + feature.properties.place + "<h6>Magnitude: " + feature.properties.mag + "</h6>" +
        "</h6><hr><h6><i>"  + new Date(feature.properties.time) + "</i></h6>");
          }

      // Function to set the circle color based on the magnitude
      function circleColor(magnitude) {
          if (magnitude < 1) {
              return "#ccff33"
              }
          else if (magnitude < 2) {
              return "#ffff33"
            }
          else if (magnitude < 3) {
              return "#ffcc33"
              }
          else if (magnitude < 4) {
              return "#ff9933"
              }
          else if (magnitude < 5) {
              return "#ff6633"
          }
          else {
              return "#ff3333"
              }
          }

      // Function to create circles with magnitude as fill color
      function pointToLayer(feature,latlng) {
          return new L.circle(latlng, {
                  stroke: true,
                  color: "gray",
                  weight: .4,
                  fillOpacity: .6,
                  fillColor: circleColor(feature.properties.mag),
                  radius:  feature.properties.mag * 20000
              })
          }
      // Creating a GeoJSON layer containing the features array on the earthquakeData object
      // Run the onEachFeature function once for each piece of data in the array
      var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer
          });

      // Sending our earthquakes layer to the createMap function
      createMap(earthquakes);
    }

// Function to create the map
function createMap(earthquakes) {

    // Define outdoormap, light, and dark map layers
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Query to retrieve the faultline data
    var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

    // Creating the faultlines and adding to the faultline layer
    d3.json(faultlinequery, function (data) {
        L.geoJSON(data, {
            style: function () {
                return { color: "grey", fillOpacity: 0, weight: .5 }
            }
        }).addTo(faultLine)
    })
    // Creating the faultline layer
    var faultLine = new L.LayerGroup();

    // baseMaps objects to hold our base layers
    var baseMaps = {
        "Outdoor Map": outdoorsmap,
        "Light Map": grayscalemap,
        "Dark Map": satellitemap
    };

    // Creating overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        FaultLines: faultLine
    };

    // Creating the map with streetmap and earthquakes layers displayed on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [earthquakes, outdoorsmap]
    });

    // Creating a layer control
    // Passing in our baseMaps and overlayMaps
    // Adding the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);



    // color function to be used when creating the legend
    function circleColor(magnitude) {
        if (magnitude <= 1) {
            return "#ccff33"
        }
        else if (magnitude <= 2) {
            return "#ffff33"
        }
        else if (magnitude <= 3) {
            return "#ffcc33"
        }
        else if (magnitude <= 4) {
            return "#ff9933"
        }
        else if (magnitude <= 5) {
            return "#ff6633"
        }
        else {
            return "#ff3333"
        }
    }

    // Adding a legend to the map
    var legend = L.control({position: 'topleft'});

    legend.onAdd = function(map) {

      var div = L.DomUtil.create('div','info legend'),
          magnitudes = [0,1,2,3,4,5],
          labels = [];

      div.innerHTML += "<h6 style='margin:4px'>Magnitude</h6>"
      // loop through our density intervals and generate a label for each interval
      for (var i=0; i < magnitudes.length; i++){
        div.innerHTML +=
          '<i style="background:' + circleColor(magnitudes[i] + 1) + '"></i> ' +
          magnitudes[i] + (magnitudes[i+1]?'&ndash;' + magnitudes[i+1] +'<br>': '+');
        }
        return div;
    };
    legend.addTo(myMap);
};
