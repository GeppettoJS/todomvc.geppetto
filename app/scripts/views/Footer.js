'use strict';
// Layout Footer View
// ------------------
var tpl = require('./templates/Footer.hbs');
module.exports = Backbone.Marionette.LayoutView.extend( {
    template : tpl,
    regions : {
        filters : '#filters'
    },

    events : {
        'click #clear-completed' : 'onClearClick'
    },

    collectionEvents : {
        'all' : 'render'
    },
    
    templateHelpers : {
        activeCountLabel : function(){
            return (this.activeCount === 1 ? 'item' : 'items') + ' left';
        }
    },

    serializeData : function(){
        var active = this.collection.getActive().length;
        var total = this.collection.length;

        return {
            activeCount    : active,
            totalCount     : total,
            completedCount : total - active
        };
    },

    onRender : function(){
        this.filters.show(this.createFiltersView());
    },

    onClearClick : function(){
        this.collection.clearCompleted();
    }
} );