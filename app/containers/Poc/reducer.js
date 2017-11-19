/*
 *
 * Poc reducer
 *
 */
import {
  FETCH_LOADING,
  FETCH_SUCCESS,
  FETCH_DIRECTIONS_SUCCESS
} from './constants';

const initialState = {
  places: [],
  directions: []
};

function pocReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LOADING:
      return state;
    case FETCH_SUCCESS:
      return {
        ...state,
        places: action.data
      };
    case FETCH_DIRECTIONS_SUCCESS:
      return {
        ...state,
        directions: [...state.directions, action.data]
      };
    default:
      return state;
  }
}

export default pocReducer;
