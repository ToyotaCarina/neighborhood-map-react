# Neighborhood Map (React)

Front-End Web Developer Nanodegree Program. Project 7: Neighborhood Map.
It's a single page application featuring a map of my neighborhood (Stavanger, Norway). Map includes highlighted locations of some drinking places. Besides Google Maps API, application uses Google Geolocation API to get coordinates of a city, Google Places API to get list of bars near that place and Foursquare API to extract place summary information. 
If Google API produces error, client will show an alert window. If Foursquare API returns error, infowindow on map with contain a notification text about that. 
Application has an offline mode, provided by React. Service worker is implemented only in the production build.

## Instructions

To get started developing right away:
* download repository to your machine
* install all project dependencies with `npm install`
* start the development server with `npm start`

To access offline mode run the application in the production build:
* build project with `npm run build`
* start server `serve -s build`
* navigate to http://localhost:5000/

## Built With

* [Create React App](https://github.com/facebookincubator/create-react-app)
* [Bootstrap](https://getbootstrap.com/)
* [Google Maps Platform](https://cloud.google.com/maps-platform/products/)
* [Foursqaure API](https://developer.foursquare.com/)
