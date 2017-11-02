/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import dataEurope from '../../data/europe.json';
import { COUNTRIES_EUROPE } from '../../data/countries';

import {
  CHANGE_USERNAME,
  COUNTRY_SELECTED,
} from './constants';

// The initial state of the App
const initialState = {
  username: '',
  continents: {
    europe: dataEurope.features
  },
  europeCountriesList: COUNTRIES_EUROPE,
  selectedCountries: []
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case COUNTRY_SELECTED:
      return {
        ...state,
        selectedCountries: [...state.selectedCountries, action.name]
      };
    default:
      return state;
  }
}

export default homeReducer;
