import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import decodePolyline from 'decode-google-map-polyline';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {
  fromInteriorNavigationStart,
  fromExteriorNavigationStart
} from '../../../store/actions';
import OutdoorMapSearchBar from './outdoorMapSearchBar';
import DestinationSearchBar from '../destinationSearchBar';
import BackButton from '../backButton';
import CurrentLocation from '../currentLocation';
import Destination from '../destination';
import Car from './car';
import Bus from './bus';
import Walking from './walking';
import Bike from './bike';
import styles from './styles';

class OutdoorDirections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      mode: 'walking',
      destinationRegion: {
        latitude: '',
        longitude: '',
      },
      originRegion: {
        latitude: '',
        longitude: '',
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
    };
    this.initiateNavigation = this.initiateNavigation.bind(this);
    this.getOriginLatLong = this.getOriginLatLong.bind(this);
  }

  componentDidMount() {
    if (this.props.getRegionFromSearch && this.props.getRegionFromSearch.latitude !== '') {
      this.setState({
        destinationRegion: {
          latitude: this.props.getRegionFromSearch.latitude,
          longitude: this.props.getRegionFromSearch.longitude
        }
      });
      this.drawPath();
    }
  }


  /** Retrieves the current location of a user. */
  async getCurrentLocation() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.err('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  }


  /**
   * Gets the latitude and longitude of a chosen origin.
   * @param {string} userQuery - placeid of the origin to get latitude and longitude.
   */
  async getOriginLatLong(userQuery) {
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const geoUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&placeid=${userQuery}`;

    try {
      const georesult = await fetch(geoUrl);
      const gjson = await georesult.json();
      const locations = gjson.result.geometry.location;
      const region = {
        latitude: locations ? locations.lat : 45.492409,
        longitude: locations ? locations.lng : -73.582153,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };

      this.props.updateRegion(region);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Gets the latitude and longitude of a chosen destination.
   * @param {string} userQuery - placeid of the destination to get latitude and longitude.
   */
  async getDestinationLatLong(userQuery) {
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const geoUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${key}&placeid=${userQuery}`;

    try {
      const georesult = await fetch(geoUrl);
      const gjson = await georesult.json();
      const locations = gjson.result.geometry.location;
      this.setState({
        destinationRegion: {
          latitude: locations ? locations.lat : '',
          longitude: locations ? locations.lat : '',
        }
      });
      this.drawPath();
    } catch (err) {
      console.errror(err);
    }
  }

  /**
   * updates coordinates and passes new coordinates 'Home' component.
   * @param {object} newCoordinates - New coordinates to be passed.
   */
  updateCoordinates = (newCoordinates) => {
    this.props.getCoordinates(newCoordinates);
  };

  /**
* updates mode of transportation
* @param {string} mode - Mode of transport: driving, bicycling, transit or walking
*/
  updateMode = (mode) => {
    this.setState({
      mode,
    });
  }

  async drawPath() {
    try {
      await this.getCurrentLocation();
      const { location } = this.state;
      const urLatitude = location.coords.latitude;
      const urLongitude = location.coords.longitude;
      const key = 'AIzaSyBsMjuj6q76Vcna8G5z9PDyTH2z16fNPDk';
      const originLat = this.state.destinationRegion.latitude === 0
        ? urLatitude
        : this.state.destinationRegion.latitude;
      const originLong = this.state.destinationRegion.longitude === 0
        ? urLongitude
        : this.state.destinationRegion.longitude;
      const destinationLat = this.state.destinationRegion.latitude;
      const destinationLong = this.state.destinationRegion.longitude;
      const mode = this.props.getMode;
      const directionUrl = `https://maps.googleapis.com/maps/api/directions/json?key=${key}&origin=${originLat},${originLong}&destination=${destinationLat},${destinationLong}&mode=${mode}`;
      const result = await fetch(directionUrl);
      const json = await result.json();
      // eslint-disable-next-line camelcase
      const encryptedPath = json.routes[0]?.overview_polyline.points;
      if (encryptedPath) {
        const rawPolylinePoints = decodePolyline(encryptedPath);
        // Incompatible field names for direct decode. Need to do a trivial conversion.
        const waypoints = rawPolylinePoints.map((point) => {
          return {
            latitude: point.lat,
            longitude: point.lng
          };
        });
        this.updateCoordinates(waypoints);
      }
    } catch (err) {
      console.error(err);
    }
  }


  async initiateNavigation(start, end, mode = this.state.mode) {
    console.log('trig from ext');
    const itinerary = { start, end };

    // this.setState({
    //   coordinates: polyline,
    // }, () => { this.props.fromExteriorNavigationStart(itinerary); });

    // interior mode
    // const itinerary = {buildingStart, buildingEnd}
    // const itinerary = {buildingStart, poiEnd}

    // exteriorMode
    // const itinerary = {buildingStart, buildingEnd}
    // const itinerary = {buildingStart, poiEnd};
    // const itinerary = {poiStart, buildingEnd};
  }

  render() {
    return (
      <View style={styles.searchContainer}>
        <OutdoorMapSearchBar
          currentBuildingPred={this.props.currentBuildingPred}
          indoorRoomsList={this.props.indoorRoomsList}
          getOriginLatLong={this.getOriginLatLong}
        />
        <DestinationSearchBar
          drawPath={this.drawPath}
          getDestinationIfSelected={this.props.getDestinationIfSelected}
          getMode={this.state.mode}
          indoorRoomsList={this.props.indoorRoomsList}
          getDestinationLatLong={this.getDestinationLatLong}
        />
        <Car updateMode={this.updateMode} />
        <Bus
          navigation={this.props.navigation}
          updateMode={this.updateMode}
        />
        <Bike
          updateMode={this.updateMode}
        />
        <Walking
          updateMode={this.updateMode}
        />
        <View style={styles.container}>
          <BackButton
            changeVisibilityTo={this.props.changeVisibilityTo}
            coordinateCallback={this.updateCoordinates}
          />
          <CurrentLocation />
          <Destination />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fromInteriorNavigationStart: (itinerary) => {
      dispatch(fromInteriorNavigationStart(itinerary));
    },
    fromExteriorNavigationStart: (itinerary) => {
      dispatch(fromExteriorNavigationStart(itinerary));
    }
  };
};

export default connect(null, mapDispatchToProps)(OutdoorDirections);
