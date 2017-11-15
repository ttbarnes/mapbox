/**
 *
 * Poc
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';
import makeSelectPoc from './selectors';
import reducer from './reducer';

export class Poc extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        poc
      </div>
    );
  }
}

Poc.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  poc: makeSelectPoc(),
});

const withConnect = connect(mapStateToProps, {});

const withReducer = injectReducer({ key: 'poc', reducer });

export default compose(
  withReducer,
  withConnect,
)(Poc);
