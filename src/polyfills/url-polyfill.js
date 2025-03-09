// src/polyfills/url-polyfill.js
if (typeof global.URL === 'undefined') {
    global.URL = require('url').URL;
  }
  