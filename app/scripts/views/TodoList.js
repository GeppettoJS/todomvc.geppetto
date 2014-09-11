'use strict';

// Item List View
// --------------
//
// Controls the rendering of the list of items, including the
// filtering of activs vs completed items for display.
var tpl = require('./templates/TodoList.hbs');
var log = _.partial(require('bows')('views'), 'TodoList');
module.exports = Backbone.Marionette.CompositeView.extend( {
    template           : tpl,
    childViewContainer : '#todo-list',

    ui : {
        toggle : '#toggle-all'
    },

    events : {
        'click #toggle-all' : 'onToggleAllClick'
    },

    collectionEvents : {
        'all' : 'update'
    },
    
    modelEvents : {
        'change:filter' : 'render'
    },
    
    addChild : function( child ){
        var filteredOn = this.model.get( 'filter' );
        if( child.matchesFilter( filteredOn ) ){
            Marionette.CompositeView.prototype.addChild.apply( this, arguments );
        }
    },

    onRender : function(){
        this.update();
    },

    update : function(){
        this.ui.toggle.prop( 'checked', this.collection.isAllCompleted() );
        //this.$el.parent().toggle( !!this.collection.length );
    },

    onToggleAllClick : function( e ){
        this.collection.toggleAll(e.currentTarget.checked);
    }
} );