'use strict';
var log = _.partial(require('bows')('models'), 'Todo');
// Todo Model
// ----------
module.exports = Backbone.Model.extend( {
    defaults : {
        title     : '',
        completed : false,
        created   : 0
    },

    initialize : function(){
        log('#initialize');
        if( this.isNew() ){
            this.set( 'created', Date.now() );
        }
    },

    toggle : function(){
        return this.set( 'completed', !this.isCompleted() );
    },

    isCompleted : function(){
        return this.get( 'completed' );
    },

    matchesFilter : function( filter ){
        if( filter === 'all' ){
            return true;
        }

        if( filter === 'active' ){
            return !this.isCompleted();
        }

        return this.isCompleted();
    }
} );
