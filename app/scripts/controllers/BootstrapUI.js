'use strict';
var log = _.partial( require( 'bows' )( 'controllers' ), 'BootstrapUI' );
module.exports = function( context ){
    log( '#execute' );

    context.wireView( 'HeaderView', require( '../views/Header' ), {
        collection : 'todoList'
    } );

    context.wireView( 'FiltersView', require( '../views/Filters' ), {
        model : 'filterState'
    } );

    context.wireView( 'ToolbarView', require( '../views/Toolbar' ), {
        collection        : 'todoList',
        createFiltersView : 'FiltersView'
    } );

    context.wireView( 'TodoItemView', require( '../views/TodoItem' ) );

    context.wireView( 'TodoListView', require( '../views/TodoList' ), {
        collection : 'todoList',
        childView  : 'TodoItemView',
        model      : 'filterState'
    } );

    context.wireView( 'InfoView', require( '../views/Info' ) );

    context.wireView( 'AppView', require( '../views/App' ), {
        createHeaderView   : 'HeaderView',
        createToolbarView  : 'ToolbarView',
        createTodoListView : 'TodoListView',
        collection         : 'todoList'
    } );

    function createViews( views ){
        views.forEach( function( viewName ){
            var factory = context.getObject( viewName );
            var view = factory();
            view.render();
        } );
    }

    createViews( ['AppView', 'InfoView'] );
};
