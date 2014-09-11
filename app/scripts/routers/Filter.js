'use strict';

// TodoList Router
// ---------------
//
// Handle routes to show the active vs complete todo items
var log = _.partial(require('bows')('routers'), 'Filter');
module.exports = Marionette.AppRouter.extend( {
    appRoutes   : {
        '*filter' : 'filterItems'
    },
    initialize: function(opts){
        log('#initialize');
    }
} );
