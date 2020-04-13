
/* eslint-disable no-restricted-globals */
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
import fetchBuildingRooms from '../../indoor_directions_modules/fetchBuildingRooms';
import styles from './styles';
import { fromInteriorNavigationStart, fromExteriorNavigationStart } from '../../store/actions';
import buildings from '../../assets/polygons/polygons';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Set Initial region of the map
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
      buildingInfoData: {},
      showBuildingInfoModal: false,
      indoorRoomsList: []
    };
    this.turnInteriorModeOn = this.turnInteriorModeOn.bind(this);
    this.turnInteriorModeOff = this.turnInteriorModeOff.bind(this);
    this.setBuildingInfoModalVisibilityTo = this.setBuildingInfoModalVisibilityTo.bind(this);
    this.initiateNavigation = this.initiateNavigation.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  componentDidMount() {
    this.generateIndoorPredictionsForSearchBar();
    // setTimeout(() => {
    //   this.initiateNavigation(buildingStart, buildingEnd);
    // }, 2000);
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
   * Changes visibility of campus toggle when search bar is focused/blurred
   * @param {*} showCampusToggle - desired visibility boolean
   */
  setCampusToggleVisibility = (showCampusToggle) => {
    this.setState({
      showCampusToggle
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

  /**
   * gets the curretly tapped on building information from 'map' component
   * @param {object} buildingInfoData - New coordinates to be passed.
   */
  getBuildingInfoData = (buildingInfoData) => {
    this.setState({
      buildingInfoData,
      showBuildingInfoModal: true
    });
  }


  /**
   * sets the visibility of showing the building information
   * @param {boolean} visibility
   */
  setBuildingInfoModalVisibilityTo(visibility) {
    this.setState({
      showBuildingInfoModal: visibility
    });
  }

  /**
   * fetches all the possible indoor predictions for start point for any building and any floor
   */
  generateIndoorPredictionsForSearchBar = () => {
    const hallData = fetchBuildingRooms('H');
    const vlData = fetchBuildingRooms('VL');

    const indoorRoomsList = [];

    const vanier = buildings.find((building) => {
      return building.building === 'VL';
    });
    
    const hall = buildings.find((building) => {
      return building.building === 'H';
    });

    const hallRooms = Object.keys(hallData);
    const vlRooms = Object.keys(vlData);

    hallRooms.forEach((floor) => {
      hallData[floor].forEach((room) => {
        let roomString;
        const isNumeric = !isNaN(room);
        if (!isNumeric) {
          roomString = `H-${floor} ${room.toString().replace('_', ' ')}`;
        } else {
          roomString = `H-${room.toString()}`;
        }

        const currentAvailableRoom = {
          id: roomString,
          building: hall,
          description: roomString,
          place_id: 'ChIJtd6Zh2oayUwRAu_CnRIfoBw',
          dijkstraId: room,
          floor,
        };
        indoorRoomsList.push(currentAvailableRoom);
      });
    });

    vlRooms.forEach((floor) => {
      vlData[floor].forEach((room) => {
        let roomString;
        const isNumeric = !isNaN(room);
        if (!isNumeric) {
          roomString = `VL-${floor} ${room.toString().replace('_', ' ')}`;
        } else {
          roomString = `VL-${room.toString()}`;
        }
        const currentAvailableRoom = {
          id: roomString,
          building: vanier,
          description: roomString,
          place_id: 'ChIJDbfcNjIXyUwRcocn3RuPPiY',
          dijkstraId: room,
          floor,
        };
        indoorRoomsList.push(currentAvailableRoom);
      });
    });

    this.setState({
      indoorRoomsList
    });
  }

  /**
   * Changes visibility of directions search menus depending on context
   * @param {*} showDirectionsMenu - desired visibility boolean
   */
  changeVisibilityTo = (showDirectionsMenu) => {
    this.setState({
      showDirectionsMenu
    });
  };

  updateCurrentBuildingAddress = (childCurrentBuilding) => {
    this.setState({
      currentBuildingAddress: childCurrentBuilding
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
   *
   * @param {*} building
   * @param {*} region
   * Activates interior mode when building is clicked on
   * Uses the building data to render floors
   * TODO: place back region @eufekt
   */
  turnInteriorModeOn(building, region) {
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
  turnInteriorModeOff() {
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
          turnInteriorModeOn={this.turnInteriorModeOn}
          updatedRegion={this.state.presetRegion}
          polylineVisibility={this.state.showDirectionsMenu}
          getDestinationIfSet={this.getDestinationIfSet}
          updateRegionCloser={this.updateRegionCloser}
          nearbyMarkers={this.state.nearbyMarkers}
          getBuildingInfoData={this.getBuildingInfoData}
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
          indoorRoomsList={this.state.indoorRoomsList}
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
        />
        {this.state.showDirectionsMenu && (
          <OutdoorDirections
            initiateNavigation={this.initiateNavigation}
            getDestinationIfSet={this.state.destinationToGo}
            getRegion={this.getRegionFromOutdoorDirections}
            getRegionFromSearch={this.state.region}
            getCoordinates={this.getCoordinatesFromOutdoorDirections}
            changeVisibilityTo={this.changeVisibilityTo}
            navigation={this.props.navigation}
            currentBuildingPred={this.state.currentBuildingAddress}
            indoorRoomsList={this.state.indoorRoomsList}
          />
        )}
        {/* Building component contains all the interior floor views */}
        {this.state.interiorMode
        && (
          <IndoorDirections
            initiateNavigation={this.initiateNavigation}
            getDestinationIfSet={this.state.destinationToGo}
            getRegion={this.getRegionFromOutdoorDirections}
            getRegionFromSearch={this.state.region}
            getCoordinates={this.getCoordinatesFromOutdoorDirections}
            showBuildingInfoModal={this.state.showBuildingInfoModal}
            setBuildingInfoModalVisibilityTo={this.setBuildingInfoModalVisibilityTo}
            turnInteriorModeOff={this.turnInteriorModeOff}
            buildingInfoData={this.state.buildingInfoData}
            indoorRoomsList={this.state.indoorRoomsList}
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
