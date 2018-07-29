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
    // alert('A name was submitted: ' + this.state.value);
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

  render() {
    const {places} = this.props;

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
          <a key={place.name} className="menu-item">
            {place.name}
          </a>
        ))}


      </Menu>
    );
  }
}

export default LocationList;
