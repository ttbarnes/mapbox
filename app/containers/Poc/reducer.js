/*
 *
 * Poc reducer
 *
 */
import {
  FETCH_LOADING,
  FETCH_SUCCESS
} from './constants';

const initialState = {
  places: []
};

function pocReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_LOADING:
      return state;
    case FETCH_SUCCESS:
      return Object.assign(
        {},
        {
          places: action.data
        }
      );
    default:
      return state;
  }
}

export default pocReducer;
