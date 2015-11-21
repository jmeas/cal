global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('sinon-chai'));

require('babel-core/register');
require('./setup')();

var jsdom = require('jsdom').jsdom;
var document = jsdom('<html><head></head><body></body></html>');
var window = document.defaultView;
var navigator = window.navigator = {
  userAgent: 'NodeJS JSDom',
  appVersion: ''
};

global.jsdom = jsdom;
global.window = window;
global.document = document;
global.navigator = navigator;
