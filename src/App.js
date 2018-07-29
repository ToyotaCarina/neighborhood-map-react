import React, { Component } from 'react';
import NeighborhoodMap from './NeighborhoodMap'
import LocationList from './LocationList'
import { push as Menu } from 'react-burger-menu'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.map;
    this.initMap = this.initMap.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.geocodeCity = this.geocodeCity.bind(this);
    this.callback = this.callback.bind(this);
  }


  state = {
    cityName: "Stavanger",
    cityLocation: {},
    places: []
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD0MMgs8WPQip9ftHRDeONPJxH8ZgjzYgs&callback=initMap')
    // this.setState({ cityLocation:  });
    // console.log(this.cityLocation);
  }

  initMap() {
    // let map;
    let service;
    let self = this;
    // this.geocodeCity();
    // this.findNearestBars();

    this.map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 51.509865, lng: -0.118092}
    });
    var requestGeocode = {'address': this.state.cityName};
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(requestGeocode, this.geocodeCallback.bind(this));
  }

  geocodeCallback(results, status) {
    let self = this;
    if (status === 'OK') {
      let requestNearestBar = {
        location: results[0].geometry.location,
        radius: '300',
        type: ['bar']
      };
      let service = new window.google.maps.places.PlacesService(self.map);
      service.nearbySearch(requestNearestBar, self.callback);
    }
  }

  callback(results, status) {
    let self = this;
    if (status == window.google.maps.places.PlacesServiceStatus.OK) {
      // this.setState({virtualMarkers: virtMarker});
      this.createMarkers(results);
    }
}

createMarkers(places) {
  let self = this;
  var bounds = new window.google.maps.LatLngBounds();
  var placesList = document.getElementById('places');

  for (var i = 0, place; place = places[i]; i++) {
    var image = {
      url: place.icon,
      size: new window.google.maps.Size(71, 71),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(17, 34),
      scaledSize: new window.google.maps.Size(25, 25)
    };

    var marker = new window.google.maps.Marker({
      map: self.map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    // var li = document.createElement('li');
    // li.textContent = place.name;
    // placesList.appendChild(li);

    bounds.extend(place.geometry.location);
  }
  self.map.fitBounds(bounds);
}

  showSettings (event) {
  event.preventDefault();

  }

  geocodeCity() {
      let self = this;
      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({'address': self.state.cityName}, function(results, status) {
        if (status === 'OK') {
          self.state.cityLocation = results[0].geometry.location;
        }
      });
    }

  // showListings() {
  //   var bounds = new google.maps.LatLngBounds();
  //   // Extend the boundaries of the map for each marker and display the marker
  //   for (var i = 0; i < markers.length; i++) {
  //     markers[i].setMap(map);
  //     bounds.extend(markers[i].position);
  //   }
  //   map.fitBounds(bounds);
  // }

  ////


  render() {
    const style = {
    width: '100vw',
    height: '100vh'
  }

    return (

      <div id="outer-container">
        <Menu
          isOpen
          noOverlay
          pageWrapId={ "page-wrap" }
          outerContainerId={ "outer-container" }>
          <div>
            <input id="places-search" type="text" placeholder="Bar name" />
            <button id="filter-btn"><i className="fa fa-filter"></i> Filter</button>
          </div>
          <a id="home" className="menu-item" href="/">Home</a>

        </Menu>
        <main id="page-wrap">
          <header>
            <h1>Bars in Stavanger</h1>
          </header>
          <section id="map-container">
              <div id="map" style={style} role="application" aria-label="Map">
              </div>
          </section>
        </main>
      </div>

    );
  }
}

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

export default App;
