import React, { Component } from "react";
class LocationList extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.onFilterPlaces) {
      this.props.onFilterPlaces(this.state.value);
    }
  }

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.handleSubmit(event);
    }
  };

  handleClick(marker, event) {
    event.preventDefault();
    this.props.onPopulateInfoWindow(marker);
  }

  render() {
    const { markers } = this.props;
    return (
        <nav id="mySidenav" className="sidenav" style={{width: "0", visibility: "hidden"}}>
          <div>
            <input
              id="places-filter"
              type="text"
              aria-label="Filter bar list"
              placeholder="Bar name"
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
            <button id="filter-btn" onClick={this.handleSubmit} aria-label="Apply filter">
              <i className="fa fa-filter" /> Filter
            </button>
          </div>
          {markers.filter(marker => marker.getVisible() === true).map(marker => (
            <a
              style={{ cursor: "pointer" }}
              tabIndex="0"
              key={marker.place.name}
              className="menu-item"
              onClick={e => this.handleClick(marker, e)}
              onKeyPress={e => this.handleClick(marker,e)}
              role="button"
            >
              {marker.place.name}
            </a>
          ))}
        </nav>
    );
  }
}

export default LocationList;
