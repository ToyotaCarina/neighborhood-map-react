import React, { Component, PropTypes } from 'react';

class GoogleMap extends Component {

  componentDidMount() {
    this.map = new window.google.maps.Map(this.refs.map, {
      scrollwheel: true,
      zoom: 13,
      draggable: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.TOP_LEFT,
        style: window.google.maps.ZoomControlStyle.LARGE,
      },
      center: new window.google.maps.LatLng(60.16985569999999, 24.938379),
    });

    this.props.onGetMap(this.map);
  }

  render() {
    const mapStyle = {
      height: '100%',
      width: '100%',
    };

    return (
      <div ref="map" style={mapStyle}></div>
    );
  }
}

// GoogleMap.propTypes = {
//   onGetMap: PropTypes.func.isRequired,
// };

export default GoogleMap;
