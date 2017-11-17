/*
 *
 * Poc actions
 *
 */
import {
  FETCH_LOADING,
  FETCH_SUCCESS,
  DEFAULT_ACTION
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION
  };
}

export function loading() {
  return {
    type: FETCH_LOADING
  };
}

export function success(data) {
  return {
    type: FETCH_SUCCESS,
    data
  };
}

const placeApiCall = (placeName) => {
  const endpoint = `https://api.foursquare.com/v2/venues/explore?client_id=X3K2GZS2YT2W3PIYND3ZJBFXODRVSFXRW0PQ1ZK2MYNKRI0K&client_secret=IED4LLCEO5AR1WHYHKN13TCF33040HYNESJ5C0XPX2M21AMD&v=20170801&limit=10&near=${placeName}&section=sights`;
  return endpoint;
};

const getData = (endpoint) => fetch(endpoint);

export function getPlaces(placeName) {
  return (dispatch) => {
    getData(placeApiCall(placeName))
      .then((res) => res.json())
      .then((data) => {
        const listOfPlaces = data.response.groups[0].items;
        dispatch(success(listOfPlaces));
      });
  };
}
