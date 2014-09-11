(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('app'), "AppContext");
module.exports = Backbone.Geppetto.Context.extend( {
    initialize : function(){
        log('#initialize')
        this.wireCommands( {
            'app:bootstrap:requested' : [
                require( './controllers/BootstrapDomain' ),
                require( './controllers/BootstrapUI' ),
                require( './controllers/StartRouter')
            ]
        } );
    },
    
    start : function(){
        log('#start');
        this.dispatch( 'app:bootstrap:requested' );
        
        var factory = this.getObject('AppView');
        var view = factory();
        view.render();
    }
} );

},{"./controllers/BootstrapDomain":3,"./controllers/BootstrapUI":4,"./controllers/StartRouter":5,"bows":22}],2:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('collections'), 'TodoList');
var Todo = require('../models/Todo');

// Todo Collection
// ---------------
function reduceCompleted( left,
                          right ){
    return left && right.get( 'completed' );
}

module.exports = Backbone.Collection.extend( {
    model : Todo,

    localStorage : new Backbone.LocalStorage( 'todos-backbone-marionette' ),
    
    initialize : function(){
        log('#initialize');
    },

    getCompleted : function(){
        return this.filter( this._isCompleted );
    },

    getActive : function(){
        return this.reject( this._isCompleted );
    },
    
    isAllCompleted : function(){
        return this.reduce( reduceCompleted, true );
    },
    
    toggleAll : function(isChecked){
        this.each( function( todo ){
            todo.save( { 'completed' : isChecked } );
        } );
    },

    clearCompleted : function(){
        var completed = this.getCompleted();
        completed.forEach( function( todo ){
            todo.destroy();
        } );
    },
    
    comparator : 'created',

    _isCompleted : function( todo ){
        return todo.isCompleted();
    }
} );
},{"../models/Todo":8,"bows":22}],3:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('controllers'), "BootstrapDomain");
module.exports = function( context ){
    log('#execute')
    context.wireSingleton( 'todoList', require( '../collections/TodoList' ) );
    context.wireSingleton( 'filterState', require( '../models/FilterState' ) );
    
};

},{"../collections/TodoList":2,"../models/FilterState":7,"bows":22}],4:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('controllers'), "BootstrapUI");
module.exports = function( context ){
    log('#execute');
    context.wireView( 'HeaderView', require( '../views/Header' ), {
        collection : 'todoList'
    } );
    context.wireView('FiltersView', require('../views/Filters'), {
        model : 'filterState'
    });
    context.wireView( 'FooterView', require( '../views/Footer' ), {
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
        createFooterView : 'FooterView',
        createTodoListView : 'TodoListView',
        collection : 'todoList'
    } );
};

},{"../views/App":10,"../views/Filters":11,"../views/Footer":12,"../views/Header":13,"../views/TodoItem":14,"../views/TodoList":15,"bows":22}],5:[function(require,module,exports){
'use strict';

var log = _.partial(require('bows')('controllers'), "StartRouter");
var FilterRouter = require( '../routers/Filter' );

module.exports = function(){
};

_.extend( module.exports.prototype, {
    wiring : ['filterState'],

    execute : function(){
        log('#execute');
        var router = new FilterRouter( {
            controller : this.filterState
        } );
        this.context.wireValue('router', router);
        
        if( Backbone.history ){
            Backbone.history.start();
        }
    }
} );

},{"../routers/Filter":9,"bows":22}],6:[function(require,module,exports){
'use strict';
var debug = require('bows')('TodoMVC.Geppetto');

debug.log('starting up');

var AppContext = require('./AppContext');
var app = new AppContext();
app.start();
},{"./AppContext":1,"bows":22}],7:[function(require,module,exports){
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

},{"bows":22}],8:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('models'), 'Todo');
// Todo Model
// ----------
module.exports = Backbone.Model.extend( {
    defaults : {
        title     : '',
        completed : false,
        created   : 0
    },

    initialize : function(){
        log('#initialize');
        if( this.isNew() ){
            this.set( 'created', Date.now() );
        }
    },

    toggle : function(){
        return this.set( 'completed', !this.isCompleted() );
    },

    isCompleted : function(){
        return this.get( 'completed' );
    },

    matchesFilter : function( filter ){
        if( filter === 'all' ){
            return true;
        }

        if( filter === 'active' ){
            return !this.isCompleted();
        }

        return this.isCompleted();
    }
} );

},{"bows":22}],9:[function(require,module,exports){
'use strict';

// TodoList Router
// ---------------
//
// Handle routes to show the active vs complete todo items
var log = _.partial(require('bows')('routers'), 'Filter');
module.exports = Marionette.AppRouter.extend( {
    appRoutes   : {
        '*filter' : 'filterItems'
    },
    initialize: function(opts){
        log('#initialize');
    }
} );

},{"bows":22}],10:[function(require,module,exports){
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
},{"./templates/App.hbs":16,"bows":22}],11:[function(require,module,exports){
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
},{"./templates/Filters.hbs":17,"bows":22}],12:[function(require,module,exports){
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
},{"./templates/Footer.hbs":18,"bows":22}],13:[function(require,module,exports){
'use strict';
var log = _.partial(require('bows')('views'), 'Header');

// Layout Header View
// ------------------
var tpl = require('./templates/Header.hbs');
module.exports = Backbone.Marionette.ItemView.extend( {
    template : tpl,

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui       : {
        input : '#new-todo'
    },
    
    events : {
        'keypress #new-todo' : 'onInputKeypress'
    },
    
    onInputKeypress : function( e ){
        var ENTER_KEY = 13,
            todoText = this.ui.input.val().trim();

        if( e.which === ENTER_KEY && todoText ){
            this.collection.create( {
                title : todoText
            } );
            this.ui.input.val( '' );
        }
    }
} );

},{"./templates/Header.hbs":19,"bows":22}],14:[function(require,module,exports){
'use strict';
// Todo List Item View
// -------------------
//
// Display an individual todo item, and respond to changes
// that are made to the item, including marking completed.
var log = _.partial(require('bows')('views'), 'TodoItem');
var tpl = require('./templates/TodoItem.hbs');
module.exports = Marionette.ItemView.extend( {
    tagName  : 'li',
    template : tpl,

    ui : {
        edit : '.edit'
    },

    events : {
        'click .destroy' : 'deleteModel',
        'dblclick label' : 'onEditClick',
        'keydown .edit'  : 'onEditKeypress',
        'focusout .edit' : 'onEditFocusout',
        'click .toggle'  : 'toggle'
    },

    modelEvents : {
        'change' : 'render'
    },
    
    onRender : function(){
        this.$el.removeClass( 'active completed' );

        if( this.model.get( 'completed' ) ){
            this.$el.addClass( 'completed' );
        }else{
            this.$el.addClass( 'active' );
        }
    },

    deleteModel : function(){
        this.model.destroy();
    },

    toggle : function(){
        this.model.toggle().save();
    },

    onEditClick : function(){
        this.$el.addClass( 'editing' );
        this.ui.edit.focus();
        this.ui.edit.val( this.ui.edit.val() );
    },

    onEditFocusout : function(){
        var todoText = this.ui.edit.val().trim();
        if( todoText ){
            this.model.set( 'title', todoText ).save();
            this.$el.removeClass( 'editing' );
        }else{
            this.destroy();
        }
    },

    onEditKeypress : function( e ){
        var ENTER_KEY = 13, ESC_KEY = 27;

        if( e.which === ENTER_KEY ){
            this.onEditFocusout();
            return;
        }

        if( e.which === ESC_KEY ){
            this.ui.edit.val( this.model.get( 'title' ) );
            this.$el.removeClass( 'editing' );
        }
    }
} );

},{"./templates/TodoItem.hbs":20,"bows":22}],15:[function(require,module,exports){
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
},{"./templates/TodoList.hbs":21,"bows":22}],16:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<header id=\"header\"></header>\n<section id=\"main\"></section>\n<footer id=\"footer\"></footer>\n";
  },"useData":true});

},{"hbsfy/runtime":31}],17:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "    <li class=\"all\">\n        <a href=\"#/\">All</a>\n    </li>\n    <li class=\"active\">\n        <a href=\"#/active\">Active</a>\n    </li>\n    <li class=\"completed\">\n        <a href=\"#/completed\">Completed</a>\n    </li>\n";
  },"useData":true});

},{"hbsfy/runtime":31}],18:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
  return "class=\"hidden\"";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<span id=\"todo-count\">\n		<strong>"
    + escapeExpression(((helper = (helper = helpers.activeCount || (depth0 != null ? depth0.activeCount : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"activeCount","hash":{},"data":data}) : helper)))
    + "</strong> "
    + escapeExpression(((helper = (helper = helpers.activeCountLabel || (depth0 != null ? depth0.activeCountLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"activeCountLabel","hash":{},"data":data}) : helper)))
    + "\n</span>\n<ul id=\"filters\"></ul>\n<button id=\"clear-completed\" ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.completedCount : depth0), {"name":"unless","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + ">\n    Clear completed ("
    + escapeExpression(((helper = (helper = helpers.completedCount || (depth0 != null ? depth0.completedCount : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"completedCount","hash":{},"data":data}) : helper)))
    + ")\n</button>\n";
},"useData":true});

},{"hbsfy/runtime":31}],19:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<h1>todos</h1>\n<input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus>\n";
  },"useData":true});

},{"hbsfy/runtime":31}],20:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
  return "checked";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"view\">\n    <input class=\"toggle\" type=\"checkbox\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.completed : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += ">\n    <label>";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</label>\n    <button class=\"destroy\"></button>\n</div>\n<input class=\"edit\" value=\"";
  stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\">\n";
},"useData":true});

},{"hbsfy/runtime":31}],21:[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<input id=\"toggle-all\" type=\"checkbox\">\n<label for=\"toggle-all\">Mark all as complete</label>\n<ul id=\"todo-list\"></ul>\n";
  },"useData":true});

},{"hbsfy/runtime":31}],22:[function(require,module,exports){
(function() {
  function checkColorSupport() {
    var chrome = !!window.chrome,
        firefox = /firefox/i.test(navigator.userAgent),
        firefoxVersion;

    if (firefox) {
        var match = navigator.userAgent.match(/Firefox\/(\d+\.\d+)/);
        if (match && match[1] && Number(match[1])) {
            firefoxVersion = Number(match[1]);
        }
    }
    return chrome || firefoxVersion >= 31.0;
  }

  var yieldColor = function() {
    var goldenRatio = 0.618033988749895;
    hue += goldenRatio;
    hue = hue % 1;
    return hue * 360;
  };

  var inNode = typeof window === 'undefined',
      ls = !inNode && window.localStorage,
      debugKey = ls.andlogKey || 'debug',
      debug = ls[debugKey],
      logger = require('andlog'),
      bind = Function.prototype.bind,
      hue = 0,
      padLength = 15,
      noop = function() {},
      colorsSupported = ls.debugColors || checkColorSupport(),
      bows = null,
      debugRegex = null,
      moduleColorsMap = {};

  debugRegex = debug && debug[0]==='/' && new RegExp(debug.substring(1,debug.length-1));

  var logLevels = ['log', 'debug', 'warn', 'error', 'info'];

  //Noop should noop
  for (var i = 0, ii = logLevels.length; i < ii; i++) {
      noop[ logLevels[i] ] = noop;
  }

  bows = function(str) {
    var msg, colorString, logfn;
    msg = (str.slice(0, padLength));
    msg += Array(padLength + 3 - msg.length).join(' ') + '|';

    if (debugRegex && !str.match(debugRegex)) return noop;

    if (!bind) return noop;

    if (colorsSupported) {
      if(!moduleColorsMap[str]){
        moduleColorsMap[str]= yieldColor();
      }
      var color = moduleColorsMap[str];
      msg = "%c" + msg;
      colorString = "color: hsl(" + (color) + ",99%,40%); font-weight: bold";

      logfn = bind.call(logger.log, logger, msg, colorString);

      logLevels.forEach(function (f) {
        logfn[f] = bind.call(logger[f] || logfn, logger, msg, colorString);
      });
    } else {
      logfn = bind.call(logger.log, logger, msg);
      logLevels.forEach(function (f) {
        logfn[f] = bind.call(logger[f] || logfn, logger, msg);
      });
    }

    return logfn;
  };

  bows.config = function(config) {
    if (config.padLength) {
      padLength = config.padLength;
    }
  };

  if (typeof module !== 'undefined') {
    module.exports = bows;
  } else {
    window.bows = bows;
  }
}).call();

},{"andlog":23}],23:[function(require,module,exports){
// follow @HenrikJoreteg and @andyet if you like this ;)
(function () {
    var inNode = typeof window === 'undefined',
        ls = !inNode && window.localStorage,
        out = {};

    if (inNode) {
        module.exports = console;
        return;
    }

    var andlogKey = ls.andlogKey || 'debug'
    if (ls && ls[andlogKey] && window.console) {
        out = window.console;
    } else {
        var methods = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),
            l = methods.length,
            fn = function () {};

        while (l--) {
            out[methods[l]] = fn;
        }
    }
    if (typeof exports !== 'undefined') {
        module.exports = out;
    } else {
        window.console = out;
    }
})();

},{}],24:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

Handlebars['default'] = Handlebars;

exports["default"] = Handlebars;
},{"./handlebars/base":25,"./handlebars/exception":26,"./handlebars/runtime":27,"./handlebars/safe-string":28,"./handlebars/utils":29}],25:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "2.0.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 6;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function(name) {
    delete this.helpers[name];
  },

  registerPartial: function(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(/* [args, ]options */) {
    if(arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = {data: data};
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function(context, options) {
    if (!options) {
      throw new Exception('Must pass iterator to #each');
    }

    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    var contextPath;
    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));

            if (contextPath) {
              data.contextPath = contextPath + i;
            }
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) {
              data.key = key;
              data.index = i;
              data.first = (i === 0);

              if (contextPath) {
                data.contextPath = contextPath + key;
              }
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = {data:data};
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function(message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function(obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, message) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, message);
      }
    }
  }
};
exports.logger = logger;
var log = logger.log;
exports.log = log;
var createFrame = function(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
};
exports.createFrame = createFrame;
},{"./exception":26,"./utils":29}],26:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],27:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;
var createFrame = require("./base").createFrame;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new Exception("No environment passed to template");
  }
  if (!templateSpec || !templateSpec.main) {
    throw new Exception('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  var invokePartialWrapper = function(partial, indent, name, context, hash, helpers, partials, data, depths) {
    if (hash) {
      context = Utils.extend({}, context, hash);
    }

    var result = env.VM.invokePartial.call(this, partial, name, context, helpers, partials, data, depths);

    if (result == null && env.compile) {
      var options = { helpers: helpers, partials: partials, data: data, depths: depths };
      partials[name] = env.compile(partial, { data: data !== undefined, compat: templateSpec.compat }, env);
      result = partials[name](context, options);
    }
    if (result != null) {
      if (indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    lookup: function(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function(i, data, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths) {
        programWrapper = program(this, i, fn, data, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(this, i, fn);
      }
      return programWrapper;
    },

    data: function(data, depth) {
      while (data && depth--) {
        data = data._parent;
      }
      return data;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = Utils.extend({}, common, param);
      }

      return ret;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  var ret = function(context, options) {
    options = options || {};
    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
  };
  ret.isTop = true;

  ret._setup = function(options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function(i, data, depths) {
    if (templateSpec.useDepths && !depths) {
      throw new Exception('must pass parent depths');
    }

    return program(container, i, templateSpec[i], data, depths);
  };
  return ret;
}

exports.template = template;function program(container, i, fn, data, depths) {
  var prog = function(context, options) {
    options = options || {};

    return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
  };
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data, depths) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data, depths: depths };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":25,"./exception":26,"./utils":29}],28:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],29:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/* istanbul ignore next */
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (string == null) {
    return "";
  } else if (!string) {
    return string + '';
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}

exports.appendContextPath = appendContextPath;
},{"./safe-string":28}],30:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":24}],31:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":30}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
