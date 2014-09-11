'use strict';
// Todo List Item View
// -------------------
//
// Display an individual todo item, and respond to changes
// that are made to the item, including marking completed.
var log = _.partial(require('bows')('views'), 'TodoItem');
var tpl = require('./templates/TodoItem.hbs');
module.exports = Marionette.ItemView.extend( {
    tagName  : 'li',
    template : tpl,

    ui : {
        edit : '.edit'
    },

    events : {
        'click .destroy' : 'deleteModel',
        'dblclick label' : 'onEditClick',
        'keydown .edit'  : 'onEditKeypress',
        'focusout .edit' : 'onEditFocusout',
        'click .toggle'  : 'toggle'
    },

    modelEvents : {
        'change' : 'render'
    },
    
    onRender : function(){
        this.$el.removeClass( 'active completed' );

        if( this.model.get( 'completed' ) ){
            this.$el.addClass( 'completed' );
        }else{
            this.$el.addClass( 'active' );
        }
    },

    deleteModel : function(){
        this.model.destroy();
    },

    toggle : function(){
        this.model.toggle().save();
    },

    onEditClick : function(){
        this.$el.addClass( 'editing' );
        this.ui.edit.focus();
        this.ui.edit.val( this.ui.edit.val() );
    },

    onEditFocusout : function(){
        var todoText = this.ui.edit.val().trim();
        if( todoText ){
            this.model.set( 'title', todoText ).save();
            this.$el.removeClass( 'editing' );
        }else{
            this.destroy();
        }
    },

    onEditKeypress : function( e ){
        var ENTER_KEY = 13, ESC_KEY = 27;

        if( e.which === ENTER_KEY ){
            this.onEditFocusout();
            return;
        }

        if( e.which === ESC_KEY ){
            this.ui.edit.val( this.model.get( 'title' ) );
            this.$el.removeClass( 'editing' );
        }
    }
} );
