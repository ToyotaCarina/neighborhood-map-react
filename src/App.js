import React, { Component } from "react";
import NeighborhoodMap from "./NeighborhoodMap";
import LocationList from "./LocationList";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    // change credientials with yours
    this.clientIDFoursquare =
     "IUNHX2L1TOYTE0MRSXQS2JYC5YKJQQSIS4YIBAFONGVLJBGN";
    this.clientSecretFoursquare =
      "YHYV4N52MD5TJKQWPNDRQAXSBD4TVLOLK1BYQISEHXMOA5NE";
    this.initMap = this.initMap.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.callback = this.callback.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.filterMarkers = this.filterMarkers.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
    this.animateMarker = this.animateMarker.bind(this);
    this.generateInfowindowContent = this.generateInfowindowContent.bind(this);
    this.getFourSquareData = this.getFourSquareData.bind(this);
    this.foursquareCallback = this.foursquareCallback.bind(this);
  }

  state = {
    cityName: "Stavanger",
    markers: []
  };

  componentDidMount() {
    window.initMap = this.initMap;
    window.gm_authFailure = this.gm_authFailure;
    loadJS(
      "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD0MMgs8WPQip9ftHRDeONPJxH8ZgjzYgs&callback=initMap"
    );
  }

  addMarker(marker, place) {
    marker.place = place;
    this.setState(state => ({
      markers: state.markers.concat([marker])
    }));
  }

  filterMarkers(inputText) {
    inputText = inputText.toLowerCase();
    this.state.markers.forEach(marker => {
      if (
        marker.title.toLowerCase().indexOf(inputText) > -1 ||
        inputText === ""
      ) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    });
    this.infowindow.close();
    this.forceUpdate();
  }

  initMap() {
    this.mapStyles = [
      {
        featureType: "poi.business",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }
    ];
    let self = this;
    var requestGeocode = { address: this.state.cityName };
    self.infowindow = new window.google.maps.InfoWindow({});
    window.google.maps.event.addListener(
      this.infowindow,
      "closeclick",
      function() {
        self.animateMarker();
      }
    );
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(requestGeocode, this.geocodeCallback.bind(this));
  }

  gm_authFailure() {
    window.alert("Authentication to Google Maps API failed"); // here you define your authentication failed message
  };

  geocodeCallback(results, status) {
    let self = this;
    if (status === "OK") {
      // Creating map, based on city location
      this.map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: results[0].geometry.location,
        styles: this.mapStyles
      });
      // Searches bars in neighborhood
      let requestNearestBar = {
        location: results[0].geometry.location,
        radius: "300",
        type: ["bar"]
      };
      let service = new window.google.maps.places.PlacesService(self.map);
      service.nearbySearch(requestNearestBar, self.callback);
    } else {
      alert("Can not geocode city name to coordinates");
    }
  }

  callback(results, status) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      this.createMarkers(results);
    } else {
      alert("Can not retreive Bar data");
    }
  }

  createMarkers(places) {
    let self = this;
    var bounds = new window.google.maps.LatLngBounds();

    // Saving just 15 places from reponse.
    for (var i = 0; i < 15; i++) {
      var place = places[i];
      var image = {
        url: place.icon,
        scaledSize: new window.google.maps.Size(25, 25)
      };

      var marker = new window.google.maps.Marker({
        map: self.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      marker.place = place;
      self.addMarker(marker, place);
      marker.addListener("click", function() {
        self.populateInfoWindow(this);
      });
      bounds.extend(place.geometry.location);
      //Using Foursqare API to get additional information
      this.getFourSquareData(place, self.state.cityName);
    }
    self.map.fitBounds(bounds);
  }

  getFourSquareData(place, cityName) {
    // Since data I retrieve from Foursquare API is additional data,
    // if request fails, infowindow will show text error
    // user doesnt have to get an alert.
    var url =
      "https://api.foursquare.com/v2/venues/search?v=20180323 " +
      "&client_id=" +
      this.clientIDFoursquare +
      "&client_secret=" +
      this.clientSecretFoursquare +
      "&near=" +
      cityName +
      "&query=" +
      place.name +
      "&limit=1";
    url = encodeURI(url);
    console.log(url);
    fetch(url)
      .then(response => this.foursquareCallback(response, place))
      .catch(error => {
        place.foursquare = { error: "Foursquare API error: " + error };
      });
  }

  foursquareCallback(response, place) {
    if (response.status !== 200) {
      place.foursquare = { error: "Foursquare API error: " + response.status };
    } else {
      response.json().then(info => {
        if (
          info.response.venues.length > 0 &&
          info.response.venues[0].hereNow &&
          info.response.venues[0].hereNow.summary
        ) {
          let placeSummary = info.response.venues[0].hereNow.summary;
          place.foursquare = { placeSummary: placeSummary };
        }
      });
    }
  }

  animateMarker(marker) {
    this.state.markers.forEach(m => {
      m.setAnimation(null);
    });
    if (typeof marker !== "undefined") {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
    }
  }

  generateInfowindowContent(marker) {
    var place = marker.place;
    var imgStr = "";
    if (place.photos[0]) {
      imgStr =
        '<img class="card-img-top" src="' +
        place.photos[0].getUrl({ maxWidth: 286, maxHeight: 180 }) +
        '" alt="' +
        marker.title +
        '">';
    }
    var adressStr =
      '<span class="font-weight-bold">Address: </span> ' + place.vicinity;
    var ratingStr =
      '<span class="font-weight-bold">Rating: </span> ' + place.rating;
    var openedNowStr = "";
    if (place.opening_hours.open_now) {
      openedNowStr = '<span class="font-weight-bold">Hours: </span>';
      if (place.opening_hours.open_now === false) {
        openedNowStr =
          openedNowStr + '<span style="color:red">Closed now</span>';
      } else {
        openedNowStr =
          openedNowStr + '<span style="color:green">Open now</span>';
      }
    }
    var foursquareInfo = '';
    if (place.foursquare) {
      if (place.foursquare.placeSummary) {
        foursquareInfo =
          '<span class="font-weight-bold">Here now: </span>' +
          place.foursquare.placeSummary;
      }
      else if (place.foursquare.error) {
        foursquareInfo =
          '<small>' +
          'Could not retreive additional data from Foursquare</br>'+
          place.foursquare.error + '</small>';
      }
    }

    var contentString =
      '<div class="card" style="width: 18rem;"> ' +
      imgStr +
      '<div class="card-body"> ' +
      '<h5 class="card-title">' +
      marker.title +
      "</h5> " +
      '<p class="card-text">' +
      adressStr +
      "</br>" +
      ratingStr +
      "</br>" +
      openedNowStr +
      "</br>" +
      foursquareInfo +
      "</p>" +
      "</div>" +
      "</div>";
    return contentString;
  }

  populateInfoWindow(marker) {
    this.animateMarker(marker);
    var contentString = this.generateInfowindowContent(marker);
    let infowindow = this.infowindow;
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent(contentString);
      infowindow.open(this.map, marker);
      infowindow.addListener("closeclick", function() {
        infowindow.marker = null;
      });
    }
  }

  render() {
    return (
      <div id="outer-container">
        <LocationList
          markers={this.state.markers}
          onPopulateInfoWindow={this.populateInfoWindow}
          onFilterPlaces={this.filterMarkers}
        />
        <main id="page-wrap">
          <header>
            <h1>Bars in Stavanger</h1>
          </header>
          <NeighborhoodMap />
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
  script.onerror = function () {
    alert("Google Maps can not be loaded. Try again later.");
  };
  ref.parentNode.insertBefore(script, ref);

}

export default App;
