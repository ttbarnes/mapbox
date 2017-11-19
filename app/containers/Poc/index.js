/**
 *
 * Poc
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import injectReducer from 'utils/injectReducer';
import { selectPocPlaces, selectPocDirections } from './selectors';
import reducer from './reducer';
import { getPlaces, getDirections, getAllDirections } from './actions';
import { mapboxAccessToken } from '../../config';

import {
  pocContainerSyles,
  liStyle,
  selectedForPlanStyles,
  lineLayout,
  linePaint,
  directionsRowStyle,
  directionsColFirstStyle,
  directionsColLastStyle
} from '../../styles';

const Map = ReactMapboxGl({ accessToken: mapboxAccessToken });

export class Poc extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      selectedLocation: '',
      placesForPlan: []
    };
  }

  handleSelectOnChange = (ev) => {
    const location = ev.target.value;
    this.setState({
      selectedLocation: location
    });
    this.props.onGetSomePlaces(location);
  }

  addToPlan = (place) => {
    this.setState({
      placesForPlan: [...this.state.placesForPlan, place]
    });
  }

  makePlan = () => {
    this.setState({
      step: 2,
      placesForPlan: this.state.placesForPlan,
      selectedLocation: this.state.selectedLocation
    });

    const directionsArr = [];

    const placesForPlan = this.state.placesForPlan;

    const getLngLat = (place) => {
      const { lng, lat } = place.venue.location;
      return `${lng},${lat}`;
    };

    placesForPlan.reduce((previousPlace, currentPlace) => {
      const prevLngLatFormat = getLngLat(previousPlace);
      const currLngLatFormat = getLngLat(currentPlace);
      const lngLatFormat = `${prevLngLatFormat};${currLngLatFormat}`;
      const directionsObj = {
        prevName: previousPlace.venue.name,
        currentName: currentPlace.venue.name,
        lngLat: lngLatFormat
      };
      directionsArr.push(directionsObj);
      return currentPlace;
    });

    directionsArr.map((d) => this.props.onGetAllDirections(d));
  }

  minutesValue(str) {
    return str.toFixed();
  }


  render() {
    const tempPlaces = ['Belgium', 'London', 'Israel', 'Paris'];
    const { places, directions } = this.props;
    const { step, selectedLocation, placesForPlan } = this.state;

    return (
      <div style={pocContainerSyles}>
        {step === 1 &&
          <div>
            <p><b>Where do you want to go?</b></p>
            <select onChange={this.handleSelectOnChange}>
              <option>Select</option>
              {tempPlaces.map((place) =>
                <option value={place} key={place}>{place}</option>
              )}
            </select>

            {selectedLocation && <p>Some places you might want to see in <b><u>{selectedLocation}</u></b></p>}

            {places.length ?
              <ul>
                {places.map((p) => (
                  <li style={liStyle} key={p.venue.name}>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5em', background: '#EEE', width: '100%' }}>
                      <h3>{p.venue.name}</h3>
                      <p><small>{p.venue.stats.checkinsCount} people have checked in here</small></p>
                      <p><small>{p.venue.hereNow.count} people are there right now.</small></p>
                      <p><a href={p.venue.url}><small>Find out more</small></a></p>
                      <button onClick={() => this.addToPlan(p)}>Add to plan</button>
                    </div>
                  </li>
                ))}
              </ul>
            : null}

          </div>
        }

        {placesForPlan.length ?
          <div style={selectedForPlanStyles}>
            <p><b>Selected</b></p>
            <ul style={{ listStyleType: 'none' }}>
              {placesForPlan.map((p) => (
                <li key={p.venue.name}>
                  <p>{p.venue.name}</p>
                </li>
              ))}
            </ul>
            <button onClick={this.makePlan}>Create my plan</button>
          </div>
        : null}

        {step === 2 &&
          <div className="directions-container">
            {directions.length && directions.map((d, i) => (
              <div key={d.directionsData.uuid} style={directionsRowStyle}>
                <div style={directionsColFirstStyle}>
                  <h3>Step {i + 1}: {d.prevName} to {d.currentName}</h3>
                  <p>{this.minutesValue(d.directionsData.routes[0].duration / 60)} mins</p>
                </div>
                <div style={directionsColLastStyle}>
                  <Map
                    style="mapbox://styles/mapbox/streets-v9"
                    zoom="9"
                    containerStyle={{
                      height: '200px',
                      width: '300px'
                    }}
                  >
                    <Layer
                      type="line"
                      layout={lineLayout}
                      paint={linePaint}
                    >
                      <Feature
                        coordinates={d.directionsData.routes[0].geometry.coordinates}
                      />

                    </Layer>
                  </Map>
                </div>
              </div>
            ))}
          </div>
        }

      </div>
    );
  }
}

Poc.propTypes = {
  onGetSomePlaces: PropTypes.func.isRequired,
  onGetAllDirections: PropTypes.func.isRequired,
  places: PropTypes.array,
  directions: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
  places: selectPocPlaces(),
  directions: selectPocDirections()
});

function mapDispatchToProps(dispatch) {
  return {
    onGetSomePlaces: (place) => dispatch(getPlaces(place)),
    onGetDirections: (cords) => dispatch(getDirections(cords)),
    onGetAllDirections: (cords) => dispatch(getAllDirections(cords))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'poc', reducer });

export default compose(
  withReducer,
  withConnect,
)(Poc);
