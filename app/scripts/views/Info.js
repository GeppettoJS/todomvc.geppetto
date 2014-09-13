'use strict';

var tpl = require('./templates/Info.hbs');
module.exports = Marionette.ItemView.extend({
    template : tpl,
    el : "#info"
});