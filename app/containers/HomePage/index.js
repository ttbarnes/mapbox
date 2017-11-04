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
  selectEuropeCountriesList
} from 'containers/App/selectors';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

import { countrySelected } from './actions';
import reducer from './reducer';
import saga from './saga';

const accessToken = 'pk.eyJ1IjoidHRiYXJuZXMiLCJhIjoiY2o5aG96czd3MzVkcjMzcHlmN3Y2dHA4ZyJ9.3YyzhYPeosdM3D8C4JxmiQ';
const Map = ReactMapboxGl({ accessToken });

const polygonPaint = {
  'fill-color': '#6F788A',
  'fill-opacity': 1
};

const polygonPaintDisabled = {
  'fill-opacity': 0
};

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

  countryIsInSelectedList = (countryName) => this.state.selectedCountries.includes(countryName);

  handleOnChange = (ev) => {
    const { name, checked } = ev.target;

    this.props.onSelectCountry(name);

    const selectedCountries = this.state.selectedCountries;

    const createNewCountryObj = (name, checked) => {
      return {
        name: name,
        selected: true
      };
    }

    if (checked === true) {
      const newSelectedCountries = [name];
      this.setState({
        selectedCountries: [...this.state.selectedCountries, ...newSelectedCountries]
      });
    } else {
      const newSelectedCountries = this.state.selectedCountries.filter(e => e !== name);
      this.setState({
        selectedCountries: [...newSelectedCountries]
      });
    }
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

  doClickStuff = (ev) => this.changeCenter(ev.lngLat);

  render() {
    const { loading, error, repos, europeData, europeCountriesList } = this.props;
    const { selectedCountries, zoom, center } = this.state;

    return (
      <div>

        <div style={{ display: 'flex', width: '100%'}}>
        
          <div style={{ width: '20%', height: '100vh', overflowY: 'scroll', paddingLeft: '1em' }}>
            <h2>Map things</h2>
            <br />
            <p className="filter-label">Countries</p>
            {europeCountriesList.map((c) =>
              <div key={c}>
                <label>
                  <input type='checkbox' name={c} onChange={this.handleOnChange.bind(this)} /> {c}
                </label>
              </div>
            )}
          </div>

          <div style={{width: '80%'}}>
            <Map
              style='mapbox://styles/mapbox/streets-v8'
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
            
            {europeData.map((country) => {
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
                    onClick={this.doClickStuff}
                  />

                </Layer>
              )
            })}

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
  europeCountriesList: selectEuropeCountriesList()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withConnect,
)(HomePage);
