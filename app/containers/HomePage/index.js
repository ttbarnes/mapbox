/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {
  makeSelectEurope,
  makeSelectContinents,
  makeSelectEuropeCountryCords
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';

import ReactMapboxGl, { Layer, Feature, GeoJSONLayer, Source } from 'react-mapbox-gl';

import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const accessToken = 'pk.eyJ1IjoidHRiYXJuZXMiLCJhIjoiY2o5aG96czd3MzVkcjMzcHlmN3Y2dHA4ZyJ9.3YyzhYPeosdM3D8C4JxmiQ';
const Map = ReactMapboxGl({ accessToken });
const zoom = [3];
// const zoom = [12];

const polygonPaint = {
  'fill-color': '#6F788A',
  'fill-opacity': 1
};

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { loading, error, repos, geoJsonData } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    const belgiumCords = this.props.europeData.europe[0].geometry.coordinates;
    const denmarkCords = this.props.europeData.europe[9].geometry.coordinates;

    const selectedCountry = this.props.getEuropeCountryCoords('France');
    const selectedCountryCords = selectedCountry.geometry.coordinates;

    
    return (
      <div>
        <p>Mapbox</p>

        <Map
          style='mapbox://styles/mapbox/streets-v8'
          zoom={zoom}
          containerStyle={{
            height: '80vh',
            width: '100%'
          }}
          symbolLayout={{
            "text-field": "{place}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
          }}
        >
          <Layer
            type="fill"
            paint={polygonPaint}
          >
            <Feature coordinates={belgiumCords} />
          </Layer>

          <Layer
            type="fill"
            paint={polygonPaint}
          >
            <Feature coordinates={denmarkCords} />
          </Layer>

          <Layer
            type="fill"
            paint={polygonPaint}
          >
            <Feature coordinates={selectedCountryCords} />
          </Layer>

        </Map>

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

const mapStateToProps = createStructuredSelector({
  geoJsonData: makeSelectContinents(),
  europeData: makeSelectEurope(),
  getEuropeCountryCoords: makeSelectEuropeCountryCords()
});

const withConnect = connect(mapStateToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withConnect,
)(HomePage);
