/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Text
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import i18n from 'i18n-js';
import styles from './styles';
import SetLocaleContext from '../../../../localization-context';

export default class OutdoorMapSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPredictions: true,
      originDescription: '',
      predictions: [],
      isMounted: false,
      prevCurrentBuilding: ''
    };
  }

  componentDidMount() {
    SetLocaleContext();
    this.setState({ isMounted: true });
  }

  /**
   * Retrieves predictions through googleAPI and conpass data from text entered in searchbar.
   * @param {string} origin - Text input from search bar
   */
  async onChangeOrigin(origin) {
    this.setState({ originDescription: origin.description });
    try {
      let currentBuilding;
      let prevCurrBuilding;
      if (this.props.currentBuildingPred !== this.state.prevCurrentBuilding) {
        currentBuilding = await this.updateCurrentBuilding();
        prevCurrBuilding = this.props.currentBuildingPred;
      }

      const json = await this.getGoogleApiPredictions(origin);
      const allPredictions = this.generateAllContextualPredictions(currentBuilding, origin.toLowerCase(), json.predictions);

      if (prevCurrBuilding) {
        this.setState({
          prevCurrentBuilding: prevCurrBuilding,
          predictions: allPredictions
        });
      } else {
        this.setState({
          predictions: allPredictions
        });
      }
    } catch (err) {
      console.error(err);
    }
  }


  /**
   * Retrieves predictions through Google's API for a given string
   * @param {String} destination - String to get predictions for
   * @returns {Promise} - Promise object represents Google's API json response
   */
  async getGoogleApiPredictions(origin) {
    const key = 'AIzaSyCqNODizSqMIWbKbO8Iq3VWdBcK846n_3w';
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${key}&input=${origin}&location=45.492409, -73.582153&radius=2000`;

    try {
      const result = await fetch(apiUrl);
      return await result.json();
    } catch (err) {
      console.error(err);
      return {};
    }
  }

  setOrigin = (origin) => {
    this.setState({ originDescription: origin.description });
    this.props.getOriginLatLong(origin.place_id);
  }

  /**
   * Concatenates custom indoor predictions with predictions from Google API
   * @param {string} - destination entered by user in search bar
   * @param {string} - googleApiPredictions
   */
  generateAllContextualPredictions(currentBuilding, origin, googleApiPredictions) {
    if (origin.length === 0) {
      return [];
    }

    const { indoorRoomsList } = this.props;

    if (indoorRoomsList) {
      const MAX_NUM_PREDICTIONS = 6;
      // contextual predictions based on user query
      const predictions = indoorRoomsList.filter((room) => {
        const roomData = room.description ? room.description.toUpperCase() : ''.toUpperCase();
        const textData = origin.toUpperCase();
        return roomData.indexOf(textData) > -1;
      });

      // if H- or VL- prefix entered by user only show relevant indoor predictions
      if (origin.startsWith('h-') || origin.startsWith('vl-')) {
        const allPredictions = currentBuilding
          ? [currentBuilding].concat(predictions.slice(0, MAX_NUM_PREDICTIONS - 1))
          : predictions.slice(0, MAX_NUM_PREDICTIONS);
        return allPredictions;
      }

      if (predictions.length === 0) {
        const allPredictions = currentBuilding ? [currentBuilding].concat(googleApiPredictions) : googleApiPredictions;
        return allPredictions;
      }

      if (googleApiPredictions && googleApiPredictions.length > 0) {
      // return mix of both google and relevant indoor predictions
        const googlePredictions = googleApiPredictions.slice(0, 2);

        const allPredictions = currentBuilding
          ? [currentBuilding].concat(googlePredictions.concat(predictions.slice(0, MAX_NUM_PREDICTIONS - 1)))
          : googlePredictions.concat(predictions.slice(0, MAX_NUM_PREDICTIONS));

        return allPredictions;
      }

      return predictions.slice(0, MAX_NUM_PREDICTIONS);
    }
    const allPredictions = currentBuilding ? [currentBuilding].concat(googleApiPredictions) : googleApiPredictions;
    return allPredictions;
  }


  /**
   * Sets currentBuilding state with a prediction of the current building the user is in
   */
  async updateCurrentBuilding() {
    try {
      const json = await this.getGoogleApiPredictions(this.props.currentBuildingPred);

      if (json.predictions.length > 0) {
        return json.predictions[0];
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  render() {
    const placeholder = this.state.isMounted ? i18n.t('search') : 'search';
    // Predictions mapped and formmated from the current state predictions
    const predictions = this.state.predictions && this.state.predictions.length > 0 ? this.state.predictions.map((prediction) => {
      return (
        <View key={prediction.id} style={styles.view}>
          <TouchableOpacity
            style={styles.Touch}
            onPress={() => {
              this.setOrigin(prediction);
              this.setState({ showPredictions: false });
              Keyboard.dismiss();
            }}
          >
            <Text key={prediction.id}>{prediction.description}</Text>
          </TouchableOpacity>
        </View>
      );
    }) : null;

    /**
     *
     * @param {*} origin
     * Controller function for searchBar component
     * manages contextual text entry
     */
    const onChangeText = (origin) => {
      return this.onChangeOrigin(origin);
    };

    /**
     * Controller function for searchBar component
     */
    const onBlur = () => {
      this.setState({ showPredictions: false });
    };

    /**
     * Controller function for searchBar component
     */
    const onClear = () => {
      this.setState({ showPredictions: true });
    };

    const containerStyle = {
      borderRadius: 10,
      borderWidth: 1,
      height: 45,
      justifyContent: 'center'
    };

    return (
      <View style={styles.container}>
        <View>
          <SearchBar
            platform="android"
            autoCorrect={false}
            padding={5}
            lightTheme
            containerStyle={containerStyle}
            placeholder={placeholder}
            onChangeText={onChangeText}
            value={this.state.originDescription}
            style={styles.SearchBar}
            onBlur={onBlur}
            onClear={onClear}
            blurOnSubmit
          />
        </View>
        {this.state.showPredictions && this.state.predictions ? predictions : null}
      </View>
    );
  }
}
