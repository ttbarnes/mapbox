/*
 *
 * Poc actions
 *
 */
import {
  FETCH_LOADING,
  FETCH_SUCCESS,
  FETCH_DIRECTIONS_SUCCESS,
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

export function directionsSuccess(data) {
  return {
    type: FETCH_DIRECTIONS_SUCCESS,
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

const directionsApiCall = (cords) => {
  const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/${cords}?geometries=geojson&access_token=pk.eyJ1IjoidHRiYXJuZXMiLCJhIjoiY2o5aG96czd3MzVkcjMzcHlmN3Y2dHA4ZyJ9.3YyzhYPeosdM3D8C4JxmiQ`;
  return endpoint;
};

export function getDirections(placeCoords) {
  return (dispatch) => {
    getData(directionsApiCall(placeCoords))
      .then((res) => res.json())
      .then((data) => {
        dispatch(directionsSuccess(data));
      });
  };
}

export function getAllDirections(place) {
  return (dispatch) => {
    dispatch(loading());
    getData(directionsApiCall(place.lngLat))
      .then((res) => res.json())
      .then((data) => {
        const placeWithDirectionsObj = {
          prevName: place.prevName,
          currentName: place.currentName,
          directionsData: data
        };
        dispatch(directionsSuccess(placeWithDirectionsObj));
      });
  };
}
