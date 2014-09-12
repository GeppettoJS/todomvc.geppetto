'use strict';
var log = _.partial(require('bows')('controllers'), 'BootstrapI18N');
var Handlebars = require('hbsfy/runtime');
module.exports = function(context){
    log('#execute');
    
    function translate( i18n_key,
                        options ){
        var context = options.data.root;
        var opts = (context)
            ? i18n.functions.extend( options.hash, context )
            : options.hash;
        if( options.fn ){
            opts.defaultValue = options.fn( context );
        }

        var result = i18n.t( i18n_key, opts );
        return new Handlebars.SafeString( result );
    }

    Handlebars.registerHelper( 't', translate );
    
    $.i18n.init( {
        lng : "en",
        fallbackLng: false,
        ns  : {
            namespaces : [
                'common',
                'todo'
            ],
            defaultNs  : 'common'
        }
    }, function( t ){
        context.dispatch( 'SetupI18N:execution:completed' );
    } );
    
};
