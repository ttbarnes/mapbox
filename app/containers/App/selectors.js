/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state && state.home || {};

const selectEurope = (state) => state.home.continents;

const selectEuropeCountriesStatesList = () => createSelector(
  selectHome,
  (homeState) => homeState.europeCountriesStatesList
);

const makeSelectContinents = () => createSelector(
  selectHome,
  (homeState) => homeState.continents
)

const makeSelectEurope = () => createSelector(
  selectHome,
  (homeState) => homeState && homeState.continents.europe
)

const makeSelectEuropeCountries = () => createSelector(
  makeSelectEurope,
  (europeState) => europeState.features
)

const selectUkCountiesList = () => createSelector(
  selectHome,
  (homeState) => homeState.ukCounties
)

const selectSelectedCountries = (state) => state.home.selectedCountries;

const makeSelectEuropeCountryCords = () => createSelector(
  selectHome,
  selectSelectedCountries,
  (homeState, selectedCountries) => () => {
    const lastSelectedCountry = selectedCountries[selectedCountries.length - 1];
    return homeState.continents.europe.find((country) => {
      if (country.properties.name_long === lastSelectedCountry) {
        return country;
      }
    });
  }
)

export {
  selectEuropeCountriesStatesList,
  makeSelectContinents,
  makeSelectEurope,
  makeSelectEuropeCountryCords,
  selectUkCountiesList
};
