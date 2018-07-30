import React, { Component } from 'react';
import NeighborhoodMap from './NeighborhoodMap'
import LocationList from './LocationList'

import './App.css';

class App extends Component {
  constructor() {
    super();
    // this.map;
    this.infowindow;
    this.initMap = this.initMap.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.geocodeCity = this.geocodeCity.bind(this);
    this.callback = this.callback.bind(this);
    this.addPlace = this.addPlace.bind(this);
    this.filterPlaces = this.filterPlaces.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
    this.animateMarker = this.animateMarker.bind(this);
  }


  state = {
    map: {},
    // currentMark: {},
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
    this.state.places.forEach(place => {
        if (place.name.toLowerCase().indexOf(inputText) > -1 || inputText === "") {
            place.marker.setVisible(true);
        } else {
            place.marker.setVisible(false);
        }
    });
    this.infowindow.close();
    this.forceUpdate();

  }

  initMap() {
    // let map;
    this.mapStyles = [
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ];
    let service;
    let self = this;
    var requestGeocode = {'address': this.state.cityName};
    this.infowindow = new window.google.maps.InfoWindow({});
    window.google.maps.event.addListener(this.infowindow,'closeclick',function(){
      self.animateMarker(); //removes the marker
    });
    //using tominatim API for geocoding
    let nominatimUrl = "https://nominatim.openstreetmap.org/search?q=" + this.state.cityName +"&format=json";
    fetch(nominatimUrl).then(response => this.geocodeCallback(response));
    // var geocoder = new window.google.maps.Geocoder();
    // geocoder.geocode(requestGeocode, this.geocodeCallback.bind(this));
  }

  geocodeCallback(response) {
    let self = this;

    if (response.status === 200) {
      response.json().then( results => {
        // console.log(results[0].lat);
        // console.log(results[0].lon);
        // let location = {lat: 40.7713024, lng: -73.9632393};
        let location = {lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon)};
        console.log(location);
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: location,
            styles: this.mapStyles
        });

        let requestNearestBar = {
          location: location,
          radius: '500',
          type: ['bar'],
          rankby: 'distance'
        };
        let service = new window.google.maps.places.PlacesService(self.map);
        service.nearbySearch(requestNearestBar, self.callback);
      }
      );

    }


  }

  // geocodeCallback(results, status) {
  //   let self = this;
  //   if (status === 'OK') {
  //     // Creating map, based on city location
  //     this.map = new window.google.maps.Map(document.getElementById('map'), {
  //         zoom: 13,
  //         center: results[0].geometry.location
  //     });
  //
  //     let requestNearestBar = {
  //       location: results[0].geometry.location,
  //       radius: '300',
  //       type: ['bar']
  //     };
  //     let service = new window.google.maps.places.PlacesService(self.map);
  //     service.nearbySearch(requestNearestBar, self.callback);
  //   }
  // }

  callback(results, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // this.setState({places: results});
        // this.initPlaces(results);
        // this.createMarkers();
        this.createMarkers(results);
      }
  }

createMarkers(places) {
  let self = this;
  var bounds = new window.google.maps.LatLngBounds();

  // Saving just N places.
  for (var i = 0, place; place = places[i]; i++) {
    if (i < 15) {
      var image = {
        url: place.icon,
        // size: new window.google.maps.Size(71, 71),
        // origin: new window.google.maps.Point(0, 0),
        // anchor: new window.google.maps.Point(17, 34),
        scaledSize: new window.google.maps.Size(25, 25)
      };

      var marker = new window.google.maps.Marker({
        map: self.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
      marker.place = place;
      self.addPlace(place, marker);
      console.log(place);
      console.log(marker);
      marker.addListener('click', function() {
        self.populateInfoWindow(this);
      });

      bounds.extend(place.geometry.location);
    }

  }
  self.map.fitBounds(bounds);
}

animateMarker(marker) {
  this.state.places.forEach(place => {
    place.marker.setAnimation(null);
  });
  if (typeof marker !== "undefined") {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }

}


  populateInfoWindow(marker) {
    this.animateMarker(marker);
    // marker.setAnimation(window.google.maps.Animation.BOUNCE);
    console.log(marker.place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
    // Check to make sure the infowindow is not already opened on this marker.
    var place = marker.place;
    var imgStr = '';
    if (place.photos[0]) {
      imgStr = '<img class="card-img-top" src="' + place.photos[0].getUrl({'maxWidth': 286, 'maxHeight': 180})+ '" alt="' + marker.title+ '">"';
    }

    var adressStr = '<span class="font-weight-bold">Address: </span> ' + place.vicinity ;
    var ratingStr = '<span class="font-weight-bold">Rating: </span> ' + place.rating;
    var openedNowStr = '';
    if (place.opening_hours.open_now) {
      openedNowStr = '<span class="font-weight-bold">Hours: </span>';
      if (place.opening_hours.open_now === false) {
        openedNowStr = openedNowStr + '<span style="color:red">Closed now</span>';
      } else {
        openedNowStr = openedNowStr + '<span style="color:green">Open now</span>';
      }
    }

         var contentString = `
         <div class="card" style="width: 18rem;">
           ` + imgStr +`
           <div class="card-body">
             <h5 class="card-title">` + marker.title + `</h5>

             <p class="card-text">` + adressStr+ `</br>`  + ratingStr+ `</br>`  + openedNowStr + `</p>
             <a href="#" class="btn btn-primary">Go somewhere</a>
           </div>
         </div>
         `;

    let infowindow = this.infowindow;
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent(contentString);
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
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
    width: '100%',
    height: '90vh',
    // 'padding-top': '40px'
  }

    return (

      <div id="outer-container">
        <LocationList
          places={this.state.places}
          onPopulateInfoWindow={this.populateInfoWindow}
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
