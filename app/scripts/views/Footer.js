'use strict';
var log = _.partial(require('bows')('views'), 'Footer');
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
    
    //todo: how is this with Handlebars?
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
        //todo: this definitely needs to go
        //this.$el.parent().toggle( this.collection.length > 0 );
        
        this.filters.show(this.createFiltersView());
    },

    onClearClick : function(){
        this.collection.clearCompleted();
    }
} );