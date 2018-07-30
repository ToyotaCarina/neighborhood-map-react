import React, { Component } from 'react';
import { push as Menu } from 'react-burger-menu'
class LocationList extends Component {

  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.onFilterPlaces) {
      this.props.onFilterPlaces(this.state.value);
    }
  }

  handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    this.handleSubmit(event);
  }
}

handleClick(marker, event) {
  event.preventDefault();
  this.props.onPopulateInfoWindow(marker);
}

  render() {
    const {places, onPopulateInfoWindow} = this.props;

    return (
      <Menu
        isOpen
        noOverlay
        pageWrapId={ "page-wrap" }
        outerContainerId={ "outer-container" }>
        <div>
          <input id="places-filter" type="text" placeholder="Bar name" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
          <button id="filter-btn" onClick={this.handleSubmit}><i className="fa fa-filter"></i> Filter</button>
        </div>
        {places.filter(place => place.marker.getVisible() === true).map(place => (
          <a href="javascript:;" tabIndex="0" key={place.name} className="menu-item" onClick={e => this.handleClick(place.marker, e)} role="button">
            {place.name}
          </a>
        ))}
      </Menu>
    );
  }
}

export default LocationList;
