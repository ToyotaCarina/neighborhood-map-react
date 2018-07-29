import React, { Component } from 'react';
import NeighborhoodMap from './NeighborhoodMap'
import LocationList from './LocationList'

import './App.css';

class App extends Component {
  constructor() {
    super();
    // this.map;
    this.initMap = this.initMap.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.geocodeCity = this.geocodeCity.bind(this);
    this.callback = this.callback.bind(this);
    this.addPlace = this.addPlace.bind(this);
    this.filterPlaces = this.filterPlaces.bind(this);
  }


  state = {
    map: {},
    cityName: "Stavanger",
    cityLocation: {},
    places: []
  }

  componentDidMount() {
    window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD0MMgs8WPQip9ftHRDeONPJxH8ZgjzYgs&callback=initMap')
  }

  addPlace(place, marker) {
    place.marker = marker;
    this.setState(state => ({
      places: state.places.concat([place])
    }));
  }

  filterPlaces(inputText) {
    console.log('filter');
    inputText = inputText.toLowerCase();
    // let filteredPlaces = [];
    this.state.places.forEach(place => {
        if (place.name.toLowerCase().indexOf(inputText) > -1 || inputText === "") {
            place.marker.setVisible(true);
            // place.visible = true;
            // filteredPlaces.push(place);
        } else {
            place.marker.setVisible(false);
            // place.visible = false;
        }
    });
    this.forceUpdate()
    // console.log(this.state.places.filter(place => place.name.toLowerCase().indexOf(inputText) > -1));
    // console.log(inputText);

    // if (inputText == "") {
    //   this.setState({ visiblePlaces: this.state.places });
    // } else {
    //   this.setState(state => ({
    //     visiblePlaces: state.places.filter(place => place.name.toLowerCase().indexOf(inputText) > -1)
    //   }));
    // }

    // if (inputText == "") {
    //   this.setState({ visiblePlaces: this.state.places });
    // } else {
    //   this.setState(state => ({
    //     visiblePlaces: state.places.filter(place => place.name.toLowerCase().indexOf(inputText) > -1)
    //   }));
    // }


  }

  initMap() {
    // let map;
    let service;
    let self = this;
    var requestGeocode = {'address': this.state.cityName};
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(requestGeocode, this.geocodeCallback.bind(this));
  }

  geocodeCallback(results, status) {
    let self = this;
    if (status === 'OK') {
      // Creating map, based on city location
      this.map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: results[0].geometry.location
      });

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
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // this.setState({places: results});
        // this.initPlaces(results);
        // this.createMarkers();
        this.createMarkers(results);
      }
  }

  // initPlaces(results) {
  //   // Saving just N places from results
  //   let self = this;
  //   // let somePlaces = [];
  //   for (var i = 0, place; place = results[i]; i++) {
  //     if (i < 15) {
  //       // somePlaces.push(place);
  //       self.addPlace(place);
  //     }
  //   }
  //   // this.setState(state => ({
  //   //   places: somePlaces,
  //   //   visiblePlaces: somePlaces
  //   // }));
  // }
  //
  // createMarkers() {
  //   let self = this;
  //   var bounds = new window.google.maps.LatLngBounds();
  //
  //   for (var i = 0, place; place = this.state.places[i]; i++) {
  //
  //       var image = {
  //         url: place.icon,
  //         size: new window.google.maps.Size(71, 71),
  //         origin: new window.google.maps.Point(0, 0),
  //         anchor: new window.google.maps.Point(17, 34),
  //         scaledSize: new window.google.maps.Size(25, 25)
  //       };
  //
  //       var marker = new window.google.maps.Marker({
  //         map: self.map,
  //         icon: image,
  //         title: place.name,
  //         position: place.geometry.location
  //       });
  //       bounds.extend(place.geometry.location);
  //   }
  //   self.map.fitBounds(bounds);
  // }

createMarkers(places) {
  let self = this;
  var bounds = new window.google.maps.LatLngBounds();

  // Saving just N places.
  for (var i = 0, place; place = places[i]; i++) {
    if (i < 15) {
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
      // self.state.markers.concat(marker);
      self.addPlace(place, marker);
      // console.log(place);
      // console.log(marker);
      bounds.extend(place.geometry.location);
    }

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
        <LocationList
          places={this.state.places}
          onFilterPlaces={this.filterPlaces}/>
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