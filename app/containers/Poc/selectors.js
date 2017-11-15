import { createSelector } from 'reselect';

/**
 * Direct selector to the poc state domain
 */
const selectPocDomain = (state) => state && state.poc;

/**
 * Other specific selectors
 */


/**
 * Default selector used by Poc
 */

const makeSelectPoc = () => createSelector(
  selectPocDomain,
  (substate) => substate
);

export default makeSelectPoc;
export {
  selectPocDomain,
};
