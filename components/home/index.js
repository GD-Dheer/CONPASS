
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import decodePolyline from 'decode-google-map-polyline';
import TheMap from '../map';
import MapSearchBar from '../mapSearchBar';
import Location from '../location';
import CampusToggle from '../campusToggle';
import PathPolyline from '../pathPolyline';
import OutdoorDirections from '../directions/outdoorDirections';
import IndoorDirections from '../directions/indoorDirections';
import styles from './styles';
import Suggestions from '../suggestions';
import { fromInteriorNavigationStart, fromExteriorNavigationStart } from '../../store/actions';
import buildings from '../../assets/polygons/polygons';

const vanier = buildings.find((building) => {
  return building.building === 'VL';
});

const hall = buildings.find((building) => {
  return building.building === 'H';
});

const poiStart = {
  type: 'POI',
  definedPlace: 'Saint-Catherine, place Start',
  coordinates: {
    latitude: 45.527885,
    longitude: -73.547471,
  }
};

const poiEnd = {
  type: 'POI',
  definedPlace: 'Saint-Dominique, POI end',
  coordinates: {
    latitude: 45.526541,
    longitude: -73.598324,
  },
};

const buildingStart = {
  type: 'BUILDING',
  building: vanier,
  node: 'VL 201',
  coordinates: {
    latitude: vanier.latitude,
    longitude: vanier.longitude,
  }
};

const buildingEnd = {
  type: 'BUILDING',
  building: hall,
  node: 'H 201',
  coordinates: {
    latitude: hall.latitude,
    longitude: hall.longitude,
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Set Initial region of the map
      value: '',
      coordinates: [],
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: '',
        longitudeDelta: ''
      },
      presetRegion: {
        latitude: 45.492408,
        longitude: -73.582153,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04
      },
      interiorMode: false,
      nearbyMarkers: [],
      // current concordia bulding tapped on
      currentBuildingAddress: '',
      showDirectionsMenu: false,
      showCampusToggle: false,
      showSuggestionsList: false
    };
    this.interiorModeOn = this.interiorModeOn.bind(this);
    this.interiorModeOff = this.interiorModeOff.bind(this);
    this.initiateNavigation = this.initiateNavigation.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.initiateNavigation(buildingStart, buildingEnd);
    }, 2000);
  }

  /**
   * updates region and passes the new region 'map' component.
   * @param {object} newRegion - New region to be passed.
   */
  updateRegion = (newRegion) => {
    this.setState({
      presetRegion: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
    });
    this.setState({
      region: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
    });
  };

  updateRegionCloser = (newRegion) => {
    this.setState({
      presetRegion: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
    });
    this.setState({
      region: {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
    });
  }

  /**
   * Fetches the currently searched destination in order to automatically populate
   * destination option in directions mode
   * @param {object} destination - current selected destination
   */
  getDestinationIfSet = (destination) => {
    this.setState({ destinationToGo: destination });
  };

  /**
   * Changes visibility of directions search menus depending on context
   * @param {*} showDirectionsMenu - desired visibility boolean
   */
  changeVisibilityTo = (showDirectionsMenu) => {
    this.setState({
      showDirectionsMenu
    });
  };

  /**
   * Changes visibility of campus toggle when search bar is focused/blurred
   * @param {*} showCampusToggle - desired visibility boolean
   */
  setCampusToggleVisibility = (showCampusToggle) => {
    this.setState({
      showCampusToggle
    });
  };

  /**
   * updates coordinates and passes new coordinates 'Map' component.
   * @param {object} newCoordinates - New coordinates to be passed.
   */
  updateCoordinates = (newCoordinates) => {
    this.setState({
      coordinates: newCoordinates
    });
  };

  /**
   * gets new region from 'OutdoorDirections' component and updates region state
   * @param {object} region - New region to be passed.
   */
  getRegionFromOutdoorDirections = (region) => {
    this.updateRegion(region);
  };

  /**
   * gets new coordinates from 'OutdoorDirections' component and updates coordinates state
   * @param {object} coordinates - New coordinates to be passed.
   */
  getCoordinatesFromOutdoorDirections = (coordinates) => {
    this.updateCoordinates(coordinates);
  };

  /**
   * gets marker objects created from the SearchBar component to nearbyMarker state.
   * Also being passed to the Map component
   * @param {object} markers - pins of nearby locations.x`
   *      markers [{
   *        id: string,
   *        title: string,
   *        description: string,
   *        coordinates: {
   *          latitude: number,
   *           longitude: number
   *         }
   *    }]
   *
   */
  getNearbyMarkers=(markers) => {
    this.setState({ nearbyMarkers: markers });
  }

  updateCurrentBuildingAddress = (childCurrentBuilding) => {
    this.setState({
      currentBuildingAddress: childCurrentBuilding
    });
  };

  /**
   * gets the curretly tapped on building information from 'map' component
   * @param {object} suggestion - New coordinates to be passed.
   */
  getSuggestions = (suggestion) => {
    this.setState({
      suggestion,
      showSuggestionsList: true
    });
  }

  /**
   * sets the visibility of showing the building information
   * @param {object} suggestion - New coordinates to be passed.
   */
  setSuggestionVisibility = () => {
    this.setState({
      showSuggestionsList: false
    });
  }

  /**
   *
   * @param {*} building
   * @param {*} region
   * Activates interior mode when building is clicked on
   * Uses the building data to render floors
   * TODO: place back region @eufekt
   */
  interiorModeOn(building, region) {
    this.setState({
      // region,
      interiorMode: true,
      building
    });
  }

  /**
   *
   * Deactivates interior mode to return to outdoor map view
   */
  interiorModeOff() {
    this.setState({
      interiorMode: false,
      building: null
    });
  }

  async initiateNavigation(start, end, mode = 'walking') {
    const startCoordinates = {
      latitude: start.coordinates.latitude,
      longitude: start.coordinates.longitude
    };

    const endCoordinates = {
      latitude: end.coordinates.latitude,
      longitude: end.coordinates.longitude
    };

    const focusRegionStart = {
      latitude: startCoordinates.latitude,
      longitude: startCoordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    const polyline = await this.getWaypoints(startCoordinates.latitude,
      startCoordinates.longitude,
      endCoordinates.latitude,
      endCoordinates.longitude,
      mode);

    const { interiorMode } = this.state;
    const itinerary = { start, end };

    if (interiorMode) {
      console.log('trig from int');
      this.setState({
        showDirectionsMenu: true,
        presetRegion: focusRegionStart,
        coordinates: polyline
      }, () => { this.props.fromInteriorNavigationStart(itinerary); });
    } else {
      console.log('trig from ext');
      this.setState({
        showDirectionsMenu: true,
        presetRegion: focusRegionStart,
        coordinates: polyline,
      }, () => { this.props.fromExteriorNavigationStart(itinerary); });
    }

    // interior mode
    // const itinerary = {buildingStart, buildingEnd}
    // const itinerary = {buildingStart, poiEnd}

    // exteriorMode
    // const itinerary = {buildingStart, buildingEnd}
    // const itinerary = {buildingStart, poiEnd};
    // const itinerary = {poiStart, buildingEnd};
  }

  // eslint-disable-next-line react/sort-comp
  async getWaypoints(originLat, originLong, destinationLat, destinationLong, mode) {
    let waypoints;
    try {
      const key = 'AIzaSyBsMjuj6q76Vcna8G5z9PDyTH2z16fNPDk';
      const directionUrl = `https://maps.googleapis.com/maps/api/directions/json?key=${key}&origin=${originLat},${originLong}&destination=${destinationLat},${destinationLong}&mode=${mode}`;
      const result = await fetch(directionUrl);
      const json = await result.json();
      // eslint-disable-next-line camelcase
      const encryptedPath = json.routes[0]?.overview_polyline.points;
      if (encryptedPath) {
        const rawPolylinePoints = decodePolyline(encryptedPath);
        // Incompatible field names for direct decode. Need to do a trivial conversion.
        waypoints = rawPolylinePoints.map((point) => {
          return {
            latitude: point.lat,
            longitude: point.lng
          };
        });
      }
    } catch (err) {
      console.error(err);
    }

    return waypoints;
  }

  render() {
    return (
      <View style={styles.container}>
        {/* zIndex=1 */}
        <TheMap
          updatedCoordinates={this.state.coordinates}
          encryptedLine={this.state.encryptedLine}
          interiorModeOn={this.interiorModeOn}
          updatedRegion={this.state.presetRegion}
          polylineVisibility={this.state.showDirectionsMenu}
          getDestinationIfSet={this.getDestinationIfSet}
          updateRegionCloser={this.updateRegionCloser}
          nearbyMarkers={this.state.nearbyMarkers}
          getSuggestions={this.getSuggestions}
        />
        {!this.state.showDirectionsMenu && (
        <MapSearchBar
          getDestinationIfSet={this.getDestinationIfSet}
          navigation={this.props.navigation}
          updateRegion={this.updateRegion}
          changeVisibilityTo={this.changeVisibilityTo}
          setCampusToggleVisibility={this.setCampusToggleVisibility}
          currentBuildingPred={this.state.currentBuildingAddress}
          nearbyMarkers={this.getNearbyMarkers}
        />
        )}
        {this.state.showCampusToggle && (
          <CampusToggle
            updateRegion={this.updateRegion}
            visiblityState={!this.state.showDirectionsMenu}
          />
        )}
        <Location
          updateRegion={this.updateRegion}
          updateCurrentBuildingCallBack={this.updateCurrentBuildingAddress}
        />
        <PathPolyline
          changeVisibilityTo={this.changeVisibilityTo}
          newValue={this.state.value}
        />
        {this.state.showDirectionsMenu && (
          <OutdoorDirections
            getDestinationIfSet={this.state.destinationToGo}
            getRegion={this.getRegionFromOutdoorDirections}
            getRegionFromSearch={this.state.region}
            getCoordinates={this.getCoordinatesFromOutdoorDirections}
            changeVisibilityTo={this.changeVisibilityTo}
            navigation={this.props.navigation}
            currentBuildingPred={this.state.currentBuildingAddress}
          />
        )}
        {/* Building component contains all the interior floor views */}
        {this.state.interiorMode
        && (
          <IndoorDirections
            building={this.state.building}
            interiorModeOff={this.interiorModeOff}
            initiateNavigation={this.initiateNavigation}
          />
        )}
        {this.state.showSuggestionsList && this.state.interiorMode && (
        <Suggestions
          changeSuggestionVisibility={this.setSuggestionVisibility}
          getDirections={this.setDirections}
          suggestion={this.state.suggestion}
        />
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fromInteriorNavigationStart: (itinerary) => { dispatch(fromInteriorNavigationStart(itinerary)); },
    fromExteriorNavigationStart: (itinerary) => { dispatch(fromExteriorNavigationStart(itinerary)); }
  };
};

export default connect(null, mapDispatchToProps)(Home);
