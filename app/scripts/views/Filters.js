'use strict';
var log = _.partial(require('bows')('views'), 'Filters');
var tpl = require( './templates/Filters.hbs' );

module.exports = Backbone.Marionette.ItemView.extend( {
    template    : tpl,
    ui          : {
        filters : 'li a',
        completed : '.completed a',
        active    : '.active a',
        all       : '.all a',
        summary   : '#todo-count'
    },
    modelEvents : {
        'change:filter' : 'updateFilterSelection'
    },
    
    updateFilterSelection      : function(){
        console.log(this.model.get( 'filter' ));
        this.ui.filters.removeClass( 'selected' );
        this.ui[this.model.get( 'filter' )].addClass( 'selected' );
    },
    onRender : function(){
        this.updateFilterSelection();
    }
} );