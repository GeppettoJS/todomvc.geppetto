'use strict';
var log = _.partial(require('bows')('controllers'), 'BootstrapDomain');
module.exports = function( context ){
    log('#execute');
    context.wireSingleton( 'todoList', require( '../collections/TodoList' ) );
    context.wireSingleton( 'filterState', require( '../models/FilterState' ) );
    
};
