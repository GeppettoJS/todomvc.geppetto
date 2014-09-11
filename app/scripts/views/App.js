'use strict';
var log = _.partial(require('bows')('views'), "App");
var tpl = require( './templates/App.hbs' );
module.exports = Marionette.LayoutView.extend( {
    el       : '#todoapp',
    template : tpl,
    regions  : {
        header : '#header',
        main   : '#main',
        footer : '#footer'
    },
    ui : {
        main : '#main',
        footer: '#footer'
    },
    collectionEvents : {
        "all" : "toggleViews"
    },
    
    initialize : function(){
        this.collection.fetch();
    },
    
    onRender : function(){
        console.log('AppView#onRender');
        this.header.show( this.createHeaderView() );
        this.main.show( this.createTodoListView() );
        this.footer.show( this.createFooterView() );
        this.toggleViews();
    },
    toggleViews : function(){
        var show = this.collection.length > 0;
        this.ui.main.toggle(show);
        this.ui.footer.toggle(show);
    }
} );