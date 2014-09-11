'use strict';
var log = _.partial(require('bows')('models'), 'FilterState');
module.exports = Backbone.Model.extend({
    defaults : {
        filter : 'all'
    },
    
    initialize : function(){
        log('#initialize');
    },
    
    // Set the filter to show complete or all items
    filterItems : function( filter ){
        log('#filterItems');
        var newFilter = filter && filter.trim() || 'all';
        this.set( 'filter', newFilter );
    }
    
});
