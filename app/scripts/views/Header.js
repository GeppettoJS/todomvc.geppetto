'use strict';

// Layout Header View
// ------------------
var tpl = require('./templates/Header.hbs');
module.exports = Backbone.Marionette.ItemView.extend( {
    template : tpl,

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui       : {
        input : '#new-todo'
    },
    
    events : {
        'keypress #new-todo' : 'onInputKeypress'
    },
    
    onInputKeypress : function( e ){
        var ENTER_KEY = 13,
            todoText = this.ui.input.val().trim();

        if( e.which === ENTER_KEY && todoText ){
            this.collection.create( {
                title : todoText
            } );
            this.ui.input.val( '' );
        }
    }
} );
