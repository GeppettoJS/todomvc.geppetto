'use strict';

var log = _.partial(require('bows')('controllers'), "StartRouter");
var FilterRouter = require( '../routers/Filter' );

module.exports = function(){
};

_.extend( module.exports.prototype, {
    wiring : ['filterState'],

    execute : function(){
        log('#execute');
        var router = new FilterRouter( {
            controller : this.filterState
        } );
        this.context.wireValue('router', router);
        
        if( Backbone.history ){
            Backbone.history.start();
        }
    }
} );
