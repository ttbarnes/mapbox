import { createSelector } from 'reselect';

/**
 * Direct selector to the poc state domain
 */
const selectPoc = (state) => state && state.poc;

/**
 * Other specific selectors
 */


/**
 * Default selector used by Poc
 */

const selectPocPlaces = () => createSelector(
  selectPoc,
  (poc) => poc.places
);

export default selectPocPlaces;

export {
  selectPoc
};
