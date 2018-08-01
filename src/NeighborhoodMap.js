import React, { Component } from "react";

class NeighborhoodMap extends Component {
  render() {
    const style = {
      width: "100%",
      height: "100vh"
    };

    return (
      <div id="map-container">
        <div id="map" style={style} role="application" aria-label="Map" />
      </div>
    );
  }
}

export default NeighborhoodMap;
