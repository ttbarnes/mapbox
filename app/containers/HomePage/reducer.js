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

import {
  CHANGE_USERNAME,
} from './constants';

// The initial state of the App
const initialState = {
  username: '',
  continents: {
    europe: dataEurope.features
  },
  selectedCountry: 'Poland'
}

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return Object.assign({}, state, {
        username: action.name.replace(/@/gi, '')
      });
    default:
      return state;
  }
}

export default homeReducer;
