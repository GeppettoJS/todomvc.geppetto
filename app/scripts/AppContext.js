'use strict';
var log = _.partial(require('bows')('app'), "AppContext");
module.exports = Backbone.Geppetto.Context.extend( {
    initialize : function(){
        log('#initialize')
        this.wireCommands( {
            'app:bootstrap:requested' : [
                require( './controllers/BootstrapDomain' ),
                require( './controllers/BootstrapUI' ),
                require( './controllers/StartRouter')
            ]
        } );
    },
    
    start : function(){
        log('#start');
        this.dispatch( 'app:bootstrap:requested' );
        
        var factory = this.getObject('AppView');
        var view = factory();
        view.render();
    }
} );
