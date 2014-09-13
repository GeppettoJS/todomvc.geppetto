'use strict';
var tpl = require( './templates/App.hbs' );
module.exports = Marionette.LayoutView.extend( {
    el       : '#todoapp',
    template : tpl,
    regions  : {
        header : '#header',
        main   : '#main',
        toolbar : '#footer'
    },
    ui : {
        main : '#main',
        toolbar: '#footer'
    },
    collectionEvents : {
        'all' : 'toggleViews'
    },
    
    initialize : function(){
        this.collection.fetch();
    },
    
    onRender : function(){
        this.header.show( this.createHeaderView() );
        this.main.show( this.createTodoListView() );
        this.toolbar.show( this.createToolbarView() );
        this.toggleViews();
    },
    toggleViews : function(){
        var show = this.collection.length > 0;
        this.ui.main.toggle(show);
        this.ui.toolbar.toggle(show);
    }
} );