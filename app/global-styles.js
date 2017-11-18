import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }
  .mapboxgl-missing-css{
    display: none;
  }

  label,
  input[type="checkbox"] {
    cursor: pointer;
  }

  label {
    display: flex;
    align-items: center;
    margin: 0.5em 0;
    font-size: .8em;
  }
  input {
    margin-right: 0.5em;
  }

  .filter-label {
    font-weight: bold;
    text-decoration: underline;
  }

  .mapboxgl-popup {
      position: absolute;
      top: 0;
      left: 0;
      display: -webkit-flex;
      display: flex;
      will-change: transform;
      pointer-events: none;
  }
  .mapboxgl-popup-anchor-center,
  .mapboxgl-popup-anchor-top,
  .mapboxgl-popup-anchor-top-left,
  .mapboxgl-popup-anchor-top-right {
      -webkit-flex-direction: column;
      flex-direction: column;
  }
  .mapboxgl-popup-anchor-bottom,
  .mapboxgl-popup-anchor-bottom-left,
  .mapboxgl-popup-anchor-bottom-right {
      -webkit-flex-direction: column-reverse;
      flex-direction: column-reverse;
  }
  .mapboxgl-popup-anchor-left {
      -webkit-flex-direction: row;
      flex-direction: row;
  }
  .mapboxgl-popup-anchor-right {
      -webkit-flex-direction: row-reverse;
      flex-direction: row-reverse;
  }
  .mapboxgl-popup-tip {
      width: 0;
      height: 0;
      border: 10px solid transparent;
      z-index: 1;
  }
  .mapboxgl-popup-anchor-center .mapboxgl-popup-tip {
      display: none;
  }
  .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
      -webkit-align-self: center;
      align-self: center;
      border-top: none;
      border-bottom-color: #fff;
  }
  .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
      -webkit-align-self: flex-start;
      align-self: flex-start;
      border-top: none;
      border-left: none;
      border-bottom-color: #fff;
  }
  .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
      -webkit-align-self: flex-end;
      align-self: flex-end;
      border-top: none;
      border-right: none;
      border-bottom-color: #fff;
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
      -webkit-align-self: center;
      align-self: center;
      border-bottom: none;
      border-top-color: #fff;
  }
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
      -webkit-align-self: flex-start;
      align-self: flex-start;
      border-bottom: none;
      border-left: none;
      border-top-color: #fff;
  }
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
      -webkit-align-self: flex-end;
      align-self: flex-end;
      border-bottom: none;
      border-right: none;
      border-top-color: #fff;
  }
  .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
      -webkit-align-self: center;
      align-self: center;
      border-left: none;
      border-right-color: #fff;
  }
  .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
      -webkit-align-self: center;
      align-self: center;
      border-right: none;
      border-left-color: #fff;
  }
  .mapboxgl-popup-close-button {
      position: absolute;
      right: 0;
      top: 0;
      border: none;
      border-radius: 0 3px 0 0;
      cursor: pointer;
      background-color: rgba(0,0,0,0);
  }
  .mapboxgl-popup-close-button:hover {
      background-color: rgba(0,0,0,0.05);
  }
  .mapboxgl-popup-content {
      position: relative;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.10);
      padding: 10px 10px 15px;
      pointer-events: auto;
  }
  .mapboxgl-popup-anchor-top-left .mapboxgl-popup-content {
      border-top-left-radius: 0;
  }
  .mapboxgl-popup-anchor-top-right .mapboxgl-popup-content {
      border-top-right-radius: 0;
  }
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-content {
      border-bottom-left-radius: 0;
  }
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-content {
      border-bottom-right-radius: 0;
  }


  select {
      border: solid 2px #CCC;
      padding: 1em;
      margin-bottom: 2em;
  },

  ul,
  li {
      margin: 0;
      padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
      margin-top: 0;
      margin-bottom: 0.5em;
  }

  p {
      margin:0 0 0.25em 0;
  }
  button {
      background: #BADA55;
      float: right;
      max-width: 180px;
  }

`;
