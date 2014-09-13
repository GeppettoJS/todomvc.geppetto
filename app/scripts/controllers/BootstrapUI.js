'use strict';
var log = _.partial(require('bows')('controllers'), 'BootstrapUI');
module.exports = function( context ){
    log('#execute');
    
    context.wireView( 'HeaderView', require( '../views/Header' ), {
        collection : 'todoList'
    } );
    
    context.wireView('FiltersView', require('../views/Filters'), {
        model : 'filterState'
    });
    
    context.wireView( 'ToolbarView', require( '../views/Toolbar' ), {
        collection : 'todoList',
        createFiltersView : 'FiltersView'
    } );
    
    context.wireView( 'TodoItemView', require( '../views/TodoItem' ) );
    
    context.wireView( 'TodoListView', require( '../views/TodoList' ), {
        collection : 'todoList',
        childView : 'TodoItemView',
        model: 'filterState'
    } );
    
    context.wireView( 'AppView', require( '../views/App' ), {
        createHeaderView : 'HeaderView',
        createToolbarView : 'ToolbarView',
        createTodoListView : 'TodoListView',
        collection : 'todoList'
    } );
    
    var factory = context.getObject('AppView');
    var view = factory();
    view.render();
};
