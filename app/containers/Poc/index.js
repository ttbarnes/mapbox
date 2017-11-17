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

import injectReducer from 'utils/injectReducer';
import selectPocPlaces from './selectors';
import reducer from './reducer';
import { getPlaces } from './actions';

const styles = {
  paddingTop: '4em',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center'
};

const liStyle = {
  listStyleType: 'none',
  padding: '0.5em',
  marginBottom: '1em',
  display: 'inline-flex',
  width: '50%',
  textAlign: 'left'
};

export class Poc extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      selectedLocation: ''
    };
  }

  handleSelectOnChange = (ev) => {
    const location = ev.target.value;
    this.setState({
      selectedLocation: location
    });
    this.props.onGetSomePlaces(location);
  }

  render() {
    const tempPlaces = ['Belgium', 'London', 'Israel', 'Paris'];
    const { places } = this.props;
    const { selectedLocation } = this.state;

    return (
      <div style={styles}>
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
                  </div>
                </li>
              ))}
            </ul>
          : null}

        </div>


      </div>
    );
  }
}

Poc.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  onGetSomePlaces: PropTypes.func.isRequired,
  places: PropTypes.array
};

const mapStateToProps = createStructuredSelector({
  places: selectPocPlaces()
});

// const mapDispatchToProps = (dispatch) => {
//   return {
//     // onGetSomePlaces: (place) => dispatch(getPlaces(place))
//     onGetSomePlaces: (place) => dispatch(getPlaces(place))
//   }
// }


function mapDispatchToProps(dispatch) {
  return {
    // dispatch,
    onGetSomePlaces: (place) => dispatch(getPlaces(place))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'poc', reducer });

export default compose(
  withReducer,
  withConnect,
)(Poc);
