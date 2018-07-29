import React, { Component } from 'react';

class LocationList extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <nav>
        <ul class="links">
          <li> <a href="#">Home</a> </li>
          <li> <a href="#">About</a> </li>
          <li> <a href="#">Projects</a> </li>
          <li> <a href="#">Blog</a> </li>
          <li> <a href="#">Contacts</a> </li>
        </ul>
      </nav>
    );
  }
}

export default LocationList;
