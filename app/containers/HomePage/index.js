/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
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

const accessToken = 'pk.eyJ1IjoidHRiYXJuZXMiLCJhIjoiY2o5aG96czd3MzVkcjMzcHlmN3Y2dHA4ZyJ9.3YyzhYPeosdM3D8C4JxmiQ';
const Map = ReactMapboxGl({ accessToken });

const polygonPaint = {
  'fill-color': '#bcda2c',
  'fill-opacity': 0.7
};

const polygonPaintCounty = {
  'fill-color': '#536c05',
  'fill-opacity': 1
};

const polygonPaintDisabled = {
  'fill-opacity': 0
};

const labelSelectedStyle = {
  fontWeight: 'bold'
}


export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      selectedCountries: [],
      zoom: [3.5],
      center: [-5.661948614921897, 54.55460317648385] // europe first coords
    }
  }

  changeCenter = (value) => {
    this.setState({
      center: value,
      zoom: [5]
    });
  }

  countryIsInSelectedList = (countryName) => this.state.selectedCountries.find((c) => c.name === countryName);

  countryStateIsInSelectedList = (countryName, stateName) => {
    const country = this.state.selectedCountries.find((c) => countryName === countryName);
    const countryStateIsSelected = country.states && country.states.includes(stateName);
    return countryStateIsSelected;
  }

  handleOnChangeCountry = (ev) => {
    const { name, checked } = ev.target;

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

  handleOnChangeCountryState(ev) {
    const { name, checked, attributes } = ev.target;
    const countryName = attributes['data-country-name'].value;
    const _stateName = name;
    const selectedCountries = this.state.selectedCountries;
    const countiesCountry = selectedCountries.find((c) => c.name === countryName);
    const newState = [
      {
        name: _stateName
      }
    ];
    const newStatesObj = [
      ...countiesCountry.states,
      ...newState
    ];

    countiesCountry.states = newStatesObj;
    const selectedCountriesWithoutNewCountry = this.state.selectedCountries.filter((c) => c.name !== countiesCountry.name);
    this.setState({
      selectedCountries: [...selectedCountriesWithoutNewCountry, countiesCountry ]
    });
  }

  selectedCountriesWithGeo() {
    const result = [];
    const lastSelectedCountry = this.state.selectedCountries[this.state.selectedCountries.length - 1];
    if (lastSelectedCountry) {
      const countryWithCords = this.props.getEuropeCountryCoords(lastSelectedCountry.name); 
      result.push(countryWithCords);
    }
    return result;
  }

  onCountryClick = (ev) => this.changeCenter(ev.lngLat);

  onCountyClick = (ev) => {
    const stateName = ev.feature.properties.name;
    this.handleOnChangeCountryState(stateName);
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
            {europeCountriesStatesList.map((c) =>
              <div key={c.name}>
                <label style={selectedCountries.find((country) => country.name === c.name) ? labelSelectedStyle : {}}>
                  <input type='checkbox' name={c.name} onChange={this.handleOnChangeCountry.bind(this)} /> {c.name}
                </label>
                {selectedCountries.find((country) => country.name === c.name) &&
                  <div style={{ marginLeft: '1em' }}>
                    {(c.states && c.states.length) && c.states.map((state) => {
                      return (
                        <div key={`${c.name}-${state.name}`}>
                          <label>
                            <input
                              type='checkbox'
                              name={state.name}
                              data-country-name={c.name}
                              onChange={this.handleOnChangeCountryState.bind(this)}
                            /> {state.name}
                          </label>
                        </div> 
                      );
                    }
                    )}
                  </div>
                }
              </div>
            )}
          </div>

          <div style={{width: '80%'}}>
            <Map
              style='mapbox://styles/mapbox/streets-v9'
              zoom={zoom}
              center={center}
              containerStyle={{
                height: '100vh',
                width: '100%'
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
                      onClick={this.onCountryClick}
                    />

                  </Layer>
                )
              })
            }

            {
            selectedCountries[0] && selectedCountries[0].states && selectedCountries[0].states.map((county) => {
              const countyGeoData = ukCounties.find((c) => c.name === county.name)
              return (
                <Layer
                  type="fill"
                  paint={polygonPaintCounty}
                  key={countyGeoData.name}
                >
                  <Feature
                    coordinates={countyGeoData.geometry.coordinates[0]}
                    properties={countyGeoData.properties}
                    onClick={this.onCountyClick}
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
