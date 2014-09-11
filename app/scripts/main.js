'use strict';
var debug = require('bows')('TodoMVC.Geppetto');

debug.log('starting up');

var AppContext = require('./AppContext');
var app = new AppContext();
app.start();