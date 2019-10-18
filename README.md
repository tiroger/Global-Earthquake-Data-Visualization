## Background

![1-Logo](Images/1-Logo.png)

Welcome to the United States Geological Survey, or USGS for short! The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes. As a new hire, you will be helping them out with an exciting new project!

The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. For example, when you click on the data set 'All Earthquakes from the Past 7 Days', you will be given a JSON representation of that data. I used the URL of this JSON to pull in the data for visualization.


   I created a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes appear larger and darker in color.

   * It includes popups that provide additional information about the earthquake when a marker is clicked.

   * Included is a legend that provides context for your map data.


There is also a second data set on the map that illustrates the relationship between tectonic plates and seismic activity. I pulled in a second data set and visualized it along side the original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.
