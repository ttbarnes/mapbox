/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.home;

const selectEurope = (state) => state && state.home.continents;

const makeSelectContinents = () => createSelector(
  selectHome,
  (homeState) => homeState.continents
)

const makeSelectEurope = () => createSelector(
  selectHome,
  (homeState) => homeState && homeState.continents
)

const makeSelectEuropeCountries = () => createSelector(
  makeSelectEurope,
  (europeState) => europeState.features
)

const selectSelectedCountry = (state) => state.home.selectedCountry;

const makeSelectEuropeCountryCords = () => createSelector(
  selectHome,
  selectSelectedCountry,
  (homeState, selectedCountry) => () => {
    return homeState.continents.europe.find((country) => {
      if (country.properties.name_long === selectedCountry) {
        return country;
      }
    });
  }
)

export {
  makeSelectContinents,
  makeSelectEurope,
  makeSelectEuropeCountryCords
};
