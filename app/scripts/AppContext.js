'use strict';
var log = _.partial(require('bows')('app'), 'AppContext');
module.exports = Backbone.Geppetto.Context.extend( {
    initialize : function(){
        log('#initialize');
        this.wireCommands( {
            'app:bootstrap:requested' : [
                require( './controllers/BootstrapI18N' ),
                require( './controllers/BootstrapDomain' ),
                require( './controllers/StartRouter')
            ],
            'SetupI18N:execution:completed': [
                require( './controllers/BootstrapUI' )
            ]
        } );
    },
    
    start : function(){
        log('#start');
        this.dispatch( 'app:bootstrap:requested' );
    }
} );
