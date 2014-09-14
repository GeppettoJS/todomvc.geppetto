'use strict';
var log = _.partial(require('bows')('collections'), 'TodoList');
var Todo = require('../models/Todo');

// Todo Collection
// ---------------
function reduceCompleted( left,
                          right ){
    return left && right.get( 'completed' );
}

module.exports = Backbone.Collection.extend( {
    model : Todo,

    localStorage : new Backbone.LocalStorage( 'todos-backbone-geppetto' ),
    
    initialize : function(){
        log('#initialize');
    },

    getCompleted : function(){
        return this.filter( this._isCompleted );
    },

    getActive : function(){
        return this.reject( this._isCompleted );
    },
    
    isAllCompleted : function(){
        return this.reduce( reduceCompleted, true );
    },
    
    toggleAll : function(isChecked){
        this.each( function( todo ){
            todo.save( { 'completed' : isChecked } );
        } );
    },

    clearCompleted : function(){
        var completed = this.getCompleted();
        completed.forEach( function( todo ){
            todo.destroy();
        } );
    },
    
    comparator : 'created',

    _isCompleted : function( todo ){
        return todo.isCompleted();
    }
} );