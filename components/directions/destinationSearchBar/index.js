/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  View, Keyboard, TouchableOpacity, Text
} from 'react-native';
import i18n from 'i18n-js';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from './styles';
import { sendEndDestination } from '../../../store/actions';

class DestinationSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      showPredictions: true,
      destination: this.props.getDestinationIfSelected,
      predictions: [],
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.drawPath !== this.props.drawPath || prevProps.getMode !== this.props.getMode) {
      this.props.drawPath();
    }
  }

  /**
  * Retrieves predictions through google's from text entered in searchbar.
  * @param {string} destination - Text input from search bar
  */
  async onChangeDestination(destination) {
    this.setState({ destination });
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${destination}&location=45.492409, -73.582153&radius=2000`;
    try {
      const result = await fetch(apiUrl);
      const json = await result.json();

      const allPredictions = this.generateAllContextualPredictions(destination.toLowerCase(), json.predictions);

      this.setState({
        predictions: allPredictions
      });
    } catch (err) {
      console.error(err);
    }
  }

  setDestination = (destination) => {
    // if the prediction is an indoor destination in the same current building, we do not need to
    // set lat long region
    const roomName = destination.description.toLowerCase();
    if ((roomName.startsWith('h-') && this.props.currentBuildingName === 'H')
     || (roomName.startsWith('vl-') && this.props.currentBuildingName === 'VL')) {
      this.setIndoorDestination(destination);
    } else {
      this.setOutdoorDestination(destination);
    }
  }

  /**
   * Sets indoor destination for directions between points in same building
   */
  setIndoorDestination = (destination) => {
    this.props.dijkstraHandler(destination.dijkstraId, destination.floor);
  }

  setOutdoorDestination = (destination) => {
    this.props.getDestinationLatLong(destination.place_id);
  }

  /**
   * Concatenates custom indoor predictions with predictions from Google API
   * @param {string} - destination entered by user in search bar
   * @param {string} - googleApiPredictions
   */
  generateAllContextualPredictions(destination, googleApiPredictions) {
    if (destination.length === 0) {
      return [];
    }

    const { indoorRoomsList } = this.props;
    const MAX_NUM_PREDICTIONS = 5;
    // contextual predictions based on user query
    const predictions = indoorRoomsList.filter((room) => {
      const roomData = room.description ? room.description.toUpperCase() : ''.toUpperCase();
      const textData = destination.toUpperCase();
      return roomData.indexOf(textData) > -1;
    });

    // if H- or VL- prefix entered by user only show relevant indoor predictions
    if (destination.startsWith('h-') || destination.startsWith('vl-')) {
      return predictions.slice(0, MAX_NUM_PREDICTIONS);
    }

    if (predictions.length === 0) {
      return googleApiPredictions;
    }

    // return mix of both google and relevant indoor predictions
    const googlePredictions = googleApiPredictions.slice(0, 2);
    const indoorPredictions = predictions.slice(0, 3);
    const mixedPredictions = indoorPredictions.concat(googlePredictions);

    return mixedPredictions;
  }

  selectPrediction(prediction) {
    this.setState({ destination: prediction.description });
    this.setDestination(prediction);
    this.setState({ showPredictions: false });
  }

  render() {
    const placeholder = this.state.isMounted ? i18n.t('destinationSearch') : 'Choose your destination';
    const predictions = this.state.predictions ? this.state.predictions.map((prediction) => {
      return (
        <View key={prediction.id} style={styles.view}>
          <TouchableOpacity
            style={styles.Touch}
            onPress={() => {
              this.selectPrediction(prediction);
              Keyboard.dismiss();
            }}
          >
            <Text key={prediction.id}>{prediction.description}</Text>
          </TouchableOpacity>
        </View>
      );
    }) : null;

    /**
     * Controller function for searchBar component
     */
    const onBlur = () => {
      this.setState({
        showPredictions: false,
      });
    };

    const onSubmit = (destination) => {
      return this.setDestination(destination);
    };

    return (
      <View style={styles.container}>
        <View>
          <SearchBar
            platform="android"
            lightTheme
            searchIcon={null}
            containerStyle={{
              borderRadius: 10,
              borderWidth: 1,
              height: 45,
              justifyContent: 'center'
            }}
            onSubmitEditing={onSubmit}
            placeholder={placeholder}
            onChangeText={(destination) => {
              return this.onChangeDestination(destination);
            }}
            value={this.state.destination}
            onBlur={onBlur}
            blurOnSubmit
          />
        </View>
        {
          this.state.showPredictions && predictions
            ? predictions : null
        }
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendEndDestination: (prediction) => { dispatch(sendEndDestination(prediction)); },
  };
};

export default connect(null, mapDispatchToProps)(DestinationSearchBar);
