/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectEurope,
  makeSelectContinents,
  makeSelectEuropeCountryCords,
  selectEuropeCountriesStatesList,
  selectUkCountiesList
} from 'containers/App/selectors';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import { countrySelected } from './actions';
import reducer from './reducer';
import saga from './saga';
import { mapboxAccessToken } from '../../config';
import {
  polygonPaint,
  polygonPaintDisabled,
  polygonPaintCounty
} from '../../styles';


const Map = ReactMapboxGl({ accessToken: mapboxAccessToken });
const ZOOM_INIT = 3.5;
const ZOOM_COUNTRY = 4;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      selectedCountries: [],
      zoom: [ZOOM_INIT],
      center: [-5.661948614921897, 54.55460317648385] // europe first coords
    }
  }

  changeCenter = (value) => {
    this.setState({
      center: value,
      zoom: [ZOOM_COUNTRY] 
    });
  }

  countryIsInSelectedList = (countryName) => this.state.selectedCountries.find((c) => c.name === countryName);

  countryStateIsInSelectedList = (countryStateName) => {
    const selectedCountries = this.state.selectedCountries;
    const result = selectedCountries.map((country) =>
      country.states.filter(s => s.name === countryStateName)
    );
    // todo: clean.
    const filteredResult = result[0] && result[0][0] && result[0][0].name;
    if (filteredResult) {
      return true;
    }
    return false;
  }

  handleOnChangeCountry = (name) => {
    this.props.onSelectCountry(name);

    const selectedCountries = this.state.selectedCountries;

    const newSelectedCountry = [{
      name,
      states: []
    }];

    this.setState({
      selectedCountries: [...this.state.selectedCountries, ...newSelectedCountry]
    });
  }

  changeSelectedCountriesAndStates(countryName, stateName) {
    const selectedCountries = this.state.selectedCountries;
    const countiesCountry = selectedCountries.find((c) => c.name === countryName);
    const newState = [
      {
        name: stateName
      }
    ];
    
    let newStatesObj = [];
    if (countiesCountry.states) {
      newStatesObj = [
        ...countiesCountry.states,
        ...newState
      ];
    } else {
      newStatesObj = [
        ...newState
      ];
    }

    countiesCountry.states = newStatesObj;
    const selectedCountriesWithoutNewCountry = selectedCountries.filter((c) => c.name !== countiesCountry.name);
    this.setState({
      selectedCountries: [...selectedCountriesWithoutNewCountry, countiesCountry]
    });
  }

  handleOnCheckboxChangeCountryState(ev) {
    const { name, checked, attributes } = ev.target;
    const countryName = attributes['data-country-name'].value;
    const _stateName = name;
    this.changeSelectedCountriesAndStates(countryName, _stateName);
  }

  handleMapOnChangeCountryState(ev) {
    const countryStateName = ev.feature.properties.name;
    this.changeSelectedCountriesAndStates('United Kingdom', countryStateName);
  }

  onMapCountryClick = (ev) => {
    const { lngLat } = ev.target;
    const { name_long } = ev.feature.properties;
    // this.changeCenter(ev.lngLat);  // disabled for now
    this.handleOnChangeCountry(name_long);
  }

  doMapHandleOnChangeCountry = (name) => {
    this.handleOnChangeCountry(name);
  }

  render() {
    const { loading, error, repos, europeData, europeCountriesStatesList, ukCounties } = this.props;
    const { selectedCountries, zoom, center } = this.state;

    return (
      <div>

        <div style={{ display: 'flex', width: '100%'}}>
        
          <div style={{ width: '20%', height: '100vh', overflowY: 'scroll', paddingLeft: '1em' }}>
            <h2>Map things</h2>
            <br />
            <p className="filter-label">Countries</p>
            {europeCountriesStatesList.map((c) => {
              const countryIsChecked = selectedCountries.find((country) => country.name === c.name);
              const countryIsCheckedStyle = countryIsChecked ? labelSelectedStyle : {};

              return (
                <div key={c.name}>
                  <label style={countryIsCheckedStyle}>
                    <input
                      type='checkbox'
                      name={c.name}
                      onChange={() => this.doMapHandleOnChangeCountry(c.name)}
                    /> {c.name}
                  </label>
                  {selectedCountries.find((country) => country.name === c.name) &&
                    <div style={{ marginLeft: '1em' }}>
                      {(c.states && c.states.length) && c.states.map((state) => {
                        const countyIsChecked = this.countryStateIsInSelectedList(state.name);
                        return (
                          <div key={`${c.name}-${state.name}`}>
                            <label style={countyIsChecked ? labelSelectedStyle : {}}>
                              <input
                                type='checkbox'
                                name={state.name}
                                data-country-name={c.name}
                                checked={countyIsChecked}
                                onChange={this.handleOnCheckboxChangeCountryState.bind(this)}
                              /> {state.name}
                            </label>
                          </div> 
                        );
                      }
                      )}
                    </div>
                  }
                </div>
              )
            })}
          </div>

          <div style={{width: '80%'}}>
            <Map
              style='mapbox://styles/mapbox/streets-v9'
              zoom={zoom}
              center={center}
              containerStyle={{
                height: '100vh',
                width: '100%',
                cursor: 'pointer'
              }}
              symbolLayout={{
                "text-field": "{place}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
              }}
            >
            
            {
              europeData.map((country) => {
                const countryLongName = country.properties.name_long;
                const countryIsChecked = this.countryIsInSelectedList(countryLongName);
                return (
                  <Layer
                    type="fill"
                    paint={countryIsChecked ? polygonPaint : polygonPaintDisabled}
                    key={countryLongName}
                  >
                    <Feature
                      coordinates={country.geometry.coordinates}
                      properties={country.properties}
                      onClick={this.onMapCountryClick.bind(this)}
                    />

                  </Layer>
                )
              })
            }

            {ukCounties.map((county) => {
              const countyIsChecked = this.countryStateIsInSelectedList(county.name);
              return (
                <Layer
                  type='fill'
                  paint={countyIsChecked ? polygonPaintCounty : polygonPaintDisabled}
                  key={county.name}
                >
                  <Feature
                    coordinates={county.geometry.coordinates[0]}
                    properties={county.properties}
                    onClick={this.handleMapOnChangeCountryState.bind(this)}
                  />

                </Layer>
              )}
            )}

            </Map>
          </div>

        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectCountry: (name) => dispatch(countrySelected(name))
  }
}

const mapStateToProps = createStructuredSelector({
  geoJsonData: makeSelectContinents(),
  europeData: makeSelectEurope(),
  getEuropeCountryCoords: makeSelectEuropeCountryCords(),
  europeCountriesStatesList: selectEuropeCountriesStatesList(),
  ukCounties: selectUkCountiesList(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withConnect,
)(HomePage);
