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

`;
