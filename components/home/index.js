
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { View } from 'react-native';
import TheMap from '../map';
import MapSearchBar from '../mapSearchBar';
import Location from '../location';
import CampusToggle from '../campusToggle';
import PathPolyline from '../pathPolyline';
import OutdoorDirections from '../directions/outdoorDirections';
import IndoorDirections from '../directions/indoorDirections';
import fetchBuildingRooms from '../../indoor_directions_modules/fetchBuildingRooms';
import styles from './styles';


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
    this.updateRegion = this.updateRegion.bind(this);
    // this.initiateNavigation = this.initiateNavigation.bind(this);
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
  setDestinationIfSelected = (destination) => {
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
  getNearbyMarkers = (markers) => {
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
   * Retreives location points (lat, lg) of places around SGW or LOY
   * depending on what the user searches for
   * @param {string} value - Value of whatever is inputed into the search bar
   */
  async getNearbyPlaces(value) {
    if (value.toLowerCase().includes('near sgw') || value.toLowerCase().includes('near loy')) {
      const formattedVal = value.substring(0, value.indexOf('near')).trim().replace(' ', '+');
      if (value.toLowerCase().includes('sgw')) {
        this.setState({
          region: {
            latitude: 45.492409,
            longitude: -73.582153,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }
        }, () => { this.setNearbyPlaces(formattedVal); });
      } else { // 'Loy' case
        this.setState({
          region: {
            latitude: 45.458295,
            longitude: -73.640353,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }
        }, () => { this.setNearbyPlaces(formattedVal); });
      }
    }
  }

  /**
   * Sets marker points (lat, lg) of places around SGW or LOY
   * that correspond to what user is searching for
   * @param {string} formattedVal - Amenity that user is looking for
   */
  async setNearbyPlaces(formattedVal) {
    const markers = [];
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${formattedVal}&location=${this.state.region.latitude},${this.state.region.longitude}&radius=2&key=${key}`;
    const georesult = await fetch(url);
    const gjson = await georesult.json();
    // pushing object to the markers. This is what is passed in the props
    gjson.results.map((result) => {
      return (markers.push({
        id: result.id,
        title: result.name,
        description: result.formatted_address,
        coordinates: {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng
        }
      }));
    });
    if (markers.length > 0) {
      // Updating the view
      this.updateRegion(this.state.region);
      this.getNearbyMarkers(markers);
    }
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
          description: roomString,
          place_id: 'ChIJtd6Zh2oayUwRAu_CnRIfoBw',
          dijkstraId: room,
          buidling: 'H',
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
          description: roomString,
          place_id: 'ChIJDbfcNjIXyUwRcocn3RuPPiY',
          dijkstraId: room,
          building: 'VL',
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
   * updates region and passes the new region 'map' component.
   * @param {object} newRegion - New region to be passed.
   */
  updateRegion(newRegion) {
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
  }

  /**
   *
   * @param {*} building
   * @param {*} region
   * Activates interior mode when building is clicked on
   * Uses the building data to render floors
   * TODO: place back region @eufekt
   */
  turnInteriorModeOn() {
    this.setState({
      // region,
      interiorMode: true,
    });
  }

  /**
   *
   * Deactivates interior mode to return to outdoor map view
   */
  turnInteriorModeOff() {
    this.setState({
      interiorMode: false,
    });
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
          setDestinationIfSelected={this.setDestinationIfSelected}
          updateRegionCloser={this.updateRegionCloser}
          nearbyMarkers={this.state.nearbyMarkers}
          getBuildingInfoData={this.getBuildingInfoData}
        />
        {!this.state.showDirectionsMenu && (
        <MapSearchBar
          setDestinationIfSelected={this.setDestinationIfSelected}
          navigation={this.props.navigation}
          updateRegion={this.updateRegion}
          changeVisibilityTo={this.changeVisibilityTo}
          setCampusToggleVisibility={this.setCampusToggleVisibility}
          currentBuildingPred={this.state.currentBuildingAddress}
          nearbyMarkers={this.getNearbyMarkers}
          indoorRoomsList={this.state.indoorRoomsList}
          getNearbyPlaces={this.getNearbyPlaces}
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
            getDestinationIfSelected={this.state.destinationToGo}
            updateRegion={this.updateRegion}
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
            getDestinationIfSelected={this.state.destinationToGo}
            updateRegion={this.updateRegion}
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

export default Home;
