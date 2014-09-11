!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";b.exports=Backbone.Geppetto.Context.extend({initialize:function(){this.wireCommands({"app:bootstrap:requested":[a("./controllers/BootstrapDomain"),a("./controllers/BootstrapUI"),a("./controllers/StartRouter")]})},start:function(){this.dispatch("app:bootstrap:requested"),this.getObject("AppView")}})},{"./controllers/BootstrapDomain":3,"./controllers/BootstrapUI":4,"./controllers/StartRouter":5}],2:[function(a,b){"use strict";function c(a,b){return a&&b.get("completed")}var d=a("../models/Todo");b.exports=Backbone.Collection.extend({model:d,localStorage:new Backbone.LocalStorage("todos-backbone-marionette"),getCompleted:function(){return this.filter(this._isCompleted)},getActive:function(){return this.reject(this._isCompleted)},isAllCompleted:function(){return this.collection.reduce(c,!0)},toggleAll:function(a){this.each(function(b){b.save({completed:a})})},clearCompleted:function(){var a=this.getCompleted();a.forEach(function(a){a.destroy()})},comparator:"created",_isCompleted:function(a){return a.isCompleted()}})},{"../models/Todo":8}],3:[function(a,b){"use strict";b.exports=function(b){b.mapSingleton("todoList",a("../collections/TodoList")),b.mapSingleton("filterState",a("../models/FilterState"))}},{"../collections/TodoList":2,"../models/FilterState":7}],4:[function(a,b){"use strict";b.exports=function(b){b.mapView("HeaderView",a("../views/Header"),{collection:"todoList"}),b.mapView("FiltersView",a("../views/Filters"),{model:"filterState"}),b.mapView("FooterView",a("../views/Footer"),{collection:"todoList",createFiltersView:"FiltersView"}),b.mapView("TodoItemView",a("../views/TodoItem")),b.mapView("TodoListView",a("../views/TodoList"),{collection:"todoList",childView:"TodoItemView",model:"filterState"}),b.mapView("AppView",a("../views/App"),{createHeaderView:"HeaderView",createFooterView:"FooterView",createTodoListView:"TodoListView"})}},{"../views/App":10,"../views/Filters":11,"../views/Footer":12,"../views/Header":13,"../views/TodoItem":14,"../views/TodoList":15}],5:[function(a,b){"use strict";var c=a("../routers/Filter");b.exports=function(){},_.extend(b.exports.prototype,{wiring:["filterState"],execute:function(){var a=new c({controller:this.filterState});this.context.mapValue("router",a),Backbone.history&&Backbone.history.start()}})},{"../routers/Filter":9}],6:[function(a){"use strict";var b=a("./AppContext"),c=new b;c.start()},{"./AppContext":1}],7:[function(a,b){"use strict";b.exports=Backbone.Model.extend({defaults:{filter:"all"},filterItems:function(a){var b=a&&a.trim()||"all";this.set("filter",b)}})},{}],8:[function(a,b){"use strict";b.exports=Backbone.Model.extend({defaults:{title:"",completed:!1,created:0},initialize:function(){this.isNew()&&this.set("created",Date.now())},toggle:function(){return this.set("completed",!this.isCompleted())},isCompleted:function(){return this.get("completed")},matchesFilter:function(a){return"all"===a?!0:"active"===a?!this.isCompleted():this.isCompleted()}})},{}],9:[function(a,b){"use strict";b.exports=Backbone.Router.extend({appRoutes:{"*filter":"filterItems"}})},{}],10:[function(a,b){"use strict";var c=a("./templates/App.hbs");b.exports=Marionette.LayoutView.extend({el:"#todoapp",template:c(),regions:{header:"#header",main:"#main",footer:"#footer"},render:function(){this.header.show(this.createHeaderView()),this.main.show(this.createTodoListView()),this.footer.show(this.createFooterView())}})},{"./templates/App.hbs":16}],11:[function(a,b){"use strict";var c=a("./templates/Filters.hbs");b.exports=Backbone.Marionette.ItemView.extend({template:c,ui:{filters:"ul a"},modelEvents:{"change:filter":"render"},render:function(){this.ui.filters.removeClass("selected"),this.ui[this.model.get("filter")].addClass("selected")}})},{"./templates/Filters.hbs":17}],12:[function(a,b){"use strict";var c=a("./templates/Footer.hbs");b.exports=Backbone.Marionette.LayoutView.extend({template:c,regions:{filtersRegion:"#filters"},ui:{completed:".completed a",active:".active a",all:".all a",summary:"#todo-count"},events:{"click #clear-completed":"onClearClick"},collectionEvents:{all:"render"},templateHelpers:{activeCountLabel:function(){return(1===this.activeCount?"item":"items")+" left"}},serializeData:function(){var a=this.collection.getActive().length,b=this.collection.length;return{activeCount:a,totalCount:b,completedCount:b-a}},onRender:function(){this.$el.parent().toggle(this.collection.length>0),this.filters.show(this.createFiltersView())},onClearClick:function(){this.collection.clearCompleted()}})},{"./templates/Footer.hbs":18}],13:[function(a,b){"use strict";var c=a("./templates/Header.hbs");b.exports=Backbone.Marionette.ItemView.extend({template:c,ui:{input:"#new-todo"},events:{"keypress #new-todo":"onInputKeypress"},onInputKeypress:function(a){var b=13,c=this.ui.input.val().trim();a.which===b&&c&&(this.collection.create({title:c}),this.ui.input.val(""))}})},{"./templates/Header.hbs":19}],14:[function(a,b){"use strict";var c=a("./templates/TodoItem.hbs");b.exports=Marionette.ItemView.extend({tagName:"li",template:c,ui:{edit:".edit"},events:{"click .destroy":"deleteModel","dblclick label":"onEditClick","keydown .edit":"onEditKeypress","focusout .edit":"onEditFocusout","click .toggle":"toggle"},modelEvents:{change:"render"},onRender:function(){this.$el.removeClass("active completed"),this.$el.addClass(this.model.get("completed")?"completed":"active")},deleteModel:function(){this.model.destroy()},toggle:function(){this.model.toggle().save()},onEditClick:function(){this.$el.addClass("editing"),this.ui.edit.focus(),this.ui.edit.val(this.ui.edit.val())},onEditFocusout:function(){var a=this.ui.edit.val().trim();a?(this.model.set("title",a).save(),this.$el.removeClass("editing")):this.destroy()},onEditKeypress:function(a){var b=13,c=27;return a.which===b?void this.onEditFocusout():void(a.which===c&&(this.ui.edit.val(this.model.get("title")),this.$el.removeClass("editing")))}})},{"./templates/TodoItem.hbs":20}],15:[function(a,b){"use strict";var c=a("./templates/TodoList.hbs");b.exports=Backbone.Marionette.CompositeView.extend({template:c,childViewContainer:"#todo-list",ui:{toggle:"#toggle-all"},events:{"click #toggle-all":"onToggleAllClick"},collectionEvents:{all:"update"},modelEvents:{"change:filter":"render"},addChild:function(a){var b=this.model.get("filter");a.matchesFilter(b)&&Backbone.Marionette.CompositeView.prototype.addChild.apply(this,arguments)},onRender:function(){this.update()},update:function(){this.ui.toggle.prop("checked",this.collection.isAllCompleted()),this.$el.parent().toggle(!!this.collection.length)},onToggleAllClick:function(a){this.collection.toggleAll(a.currentTarget.checked)}})},{"./templates/TodoList.hbs":21}],16:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({compiler:[6,">= 2.0.0-beta.1"],main:function(){return'<header id="header"></header>\n<section id="main"></section>\n<footer id="footer"></footer>\n'},useData:!0})},{"hbsfy/runtime":29}],17:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({compiler:[6,">= 2.0.0-beta.1"],main:function(){return'<ul>\n    <li class="all">\n        <a href="#/">All</a>\n    </li>\n    <li class="active">\n        <a href="#/active">Active</a>\n    </li>\n    <li class="completed">\n        <a href="#/completed">Completed</a>\n    </li>\n</ul>'},useData:!0})},{"hbsfy/runtime":29}],18:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({1:function(){return'class="hidden"'},compiler:[6,">= 2.0.0-beta.1"],main:function(a,b,c,d){var e,f,g="function",h=b.helperMissing,i=this.escapeExpression,j='<span id="todo-count">\n		<strong>'+i((f=null!=(f=b.activeCount||(null!=a?a.activeCount:a))?f:h,typeof f===g?f.call(a,{name:"activeCount",hash:{},data:d}):f))+"</strong> "+i((f=null!=(f=b.activeCountLabel||(null!=a?a.activeCountLabel:a))?f:h,typeof f===g?f.call(a,{name:"activeCountLabel",hash:{},data:d}):f))+'\n</span>\n<div id="filters"></div>\n<button id="clear-completed" ';return e=b.unless.call(a,null!=a?a.completedCount:a,{name:"unless",hash:{},fn:this.program(1,d),inverse:this.noop,data:d}),null!=e&&(j+=e),j+">\n    Clear completed ("+i((f=null!=(f=b.completedCount||(null!=a?a.completedCount:a))?f:h,typeof f===g?f.call(a,{name:"completedCount",hash:{},data:d}):f))+")\n</button>\n"},useData:!0})},{"hbsfy/runtime":29}],19:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({compiler:[6,">= 2.0.0-beta.1"],main:function(){return'<h1>todos</h1>\n<input id="new-todo" placeholder="What needs to be done?" autofocus>\n'},useData:!0})},{"hbsfy/runtime":29}],20:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({1:function(){return"checked"},compiler:[6,">= 2.0.0-beta.1"],main:function(a,b,c,d){var e,f,g="function",h=b.helperMissing,i='<div class="view">\n    <input class="toggle" type="checkbox" ';return e=b["if"].call(a,null!=a?a.completed:a,{name:"if",hash:{},fn:this.program(1,d),inverse:this.noop,data:d}),null!=e&&(i+=e),i+=">\n    <label>",f=null!=(f=b.title||(null!=a?a.title:a))?f:h,e=typeof f===g?f.call(a,{name:"title",hash:{},data:d}):f,null!=e&&(i+=e),i+='</label>\n    <button class="destroy"></button>\n</div>\n<input class="edit" value="',f=null!=(f=b.title||(null!=a?a.title:a))?f:h,e=typeof f===g?f.call(a,{name:"title",hash:{},data:d}):f,null!=e&&(i+=e),i+'">\n'},useData:!0})},{"hbsfy/runtime":29}],21:[function(a,b){var c=a("hbsfy/runtime");b.exports=c.template({compiler:[6,">= 2.0.0-beta.1"],main:function(){return'<input id="toggle-all" type="checkbox">\n<label for="toggle-all">Mark all as complete</label>\n<ul id="todo-list"></ul>\n'},useData:!0})},{"hbsfy/runtime":29}],22:[function(a,b,c){"use strict";var d=a("./handlebars/base"),e=a("./handlebars/safe-string")["default"],f=a("./handlebars/exception")["default"],g=a("./handlebars/utils"),h=a("./handlebars/runtime"),i=function(){var a=new d.HandlebarsEnvironment;return g.extend(a,d),a.SafeString=e,a.Exception=f,a.Utils=g,a.escapeExpression=g.escapeExpression,a.VM=h,a.template=function(b){return h.template(b,a)},a},j=i();j.create=i,j["default"]=j,c["default"]=j},{"./handlebars/base":23,"./handlebars/exception":24,"./handlebars/runtime":25,"./handlebars/safe-string":26,"./handlebars/utils":27}],23:[function(a,b,c){"use strict";function d(a,b){this.helpers=a||{},this.partials=b||{},e(this)}function e(a){a.registerHelper("helperMissing",function(){if(1===arguments.length)return void 0;throw new g("Missing helper: '"+arguments[arguments.length-1].name+"'")}),a.registerHelper("blockHelperMissing",function(b,c){var d=c.inverse,e=c.fn;if(b===!0)return e(this);if(b===!1||null==b)return d(this);if(k(b))return b.length>0?(c.ids&&(c.ids=[c.name]),a.helpers.each(b,c)):d(this);if(c.data&&c.ids){var g=q(c.data);g.contextPath=f.appendContextPath(c.data.contextPath,c.name),c={data:g}}return e(b,c)}),a.registerHelper("each",function(a,b){if(!b)throw new g("Must pass iterator to #each");var c,d,e=b.fn,h=b.inverse,i=0,j="";if(b.data&&b.ids&&(d=f.appendContextPath(b.data.contextPath,b.ids[0])+"."),l(a)&&(a=a.call(this)),b.data&&(c=q(b.data)),a&&"object"==typeof a)if(k(a))for(var m=a.length;m>i;i++)c&&(c.index=i,c.first=0===i,c.last=i===a.length-1,d&&(c.contextPath=d+i)),j+=e(a[i],{data:c});else for(var n in a)a.hasOwnProperty(n)&&(c&&(c.key=n,c.index=i,c.first=0===i,d&&(c.contextPath=d+n)),j+=e(a[n],{data:c}),i++);return 0===i&&(j=h(this)),j}),a.registerHelper("if",function(a,b){return l(a)&&(a=a.call(this)),!b.hash.includeZero&&!a||f.isEmpty(a)?b.inverse(this):b.fn(this)}),a.registerHelper("unless",function(b,c){return a.helpers["if"].call(this,b,{fn:c.inverse,inverse:c.fn,hash:c.hash})}),a.registerHelper("with",function(a,b){l(a)&&(a=a.call(this));var c=b.fn;if(f.isEmpty(a))return b.inverse(this);if(b.data&&b.ids){var d=q(b.data);d.contextPath=f.appendContextPath(b.data.contextPath,b.ids[0]),b={data:d}}return c(a,b)}),a.registerHelper("log",function(b,c){var d=c.data&&null!=c.data.level?parseInt(c.data.level,10):1;a.log(d,b)}),a.registerHelper("lookup",function(a,b){return a&&a[b]})}var f=a("./utils"),g=a("./exception")["default"],h="2.0.0";c.VERSION=h;var i=6;c.COMPILER_REVISION=i;var j={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:"== 1.x.x",5:"== 2.0.0-alpha.x",6:">= 2.0.0-beta.1"};c.REVISION_CHANGES=j;var k=f.isArray,l=f.isFunction,m=f.toString,n="[object Object]";c.HandlebarsEnvironment=d,d.prototype={constructor:d,logger:o,log:p,registerHelper:function(a,b){if(m.call(a)===n){if(b)throw new g("Arg not supported with multiple helpers");f.extend(this.helpers,a)}else this.helpers[a]=b},unregisterHelper:function(a){delete this.helpers[a]},registerPartial:function(a,b){m.call(a)===n?f.extend(this.partials,a):this.partials[a]=b},unregisterPartial:function(a){delete this.partials[a]}};var o={methodMap:{0:"debug",1:"info",2:"warn",3:"error"},DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(a,b){if(o.level<=a){var c=o.methodMap[a];"undefined"!=typeof console&&console[c]&&console[c].call(console,b)}}};c.logger=o;var p=o.log;c.log=p;var q=function(a){var b=f.extend({},a);return b._parent=a,b};c.createFrame=q},{"./exception":24,"./utils":27}],24:[function(a,b,c){"use strict";function d(a,b){var c;b&&b.firstLine&&(c=b.firstLine,a+=" - "+c+":"+b.firstColumn);for(var d=Error.prototype.constructor.call(this,a),f=0;f<e.length;f++)this[e[f]]=d[e[f]];c&&(this.lineNumber=c,this.column=b.firstColumn)}var e=["description","fileName","lineNumber","message","name","number","stack"];d.prototype=new Error,c["default"]=d},{}],25:[function(a,b,c){"use strict";function d(a){var b=a&&a[0]||1,c=l;if(b!==c){if(c>b){var d=m[c],e=m[b];throw new k("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+d+") or downgrade your runtime to an older version ("+e+").")}throw new k("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+a[1]+").")}}function e(a,b){if(!b)throw new k("No environment passed to template");if(!a||!a.main)throw new k("Unknown template object: "+typeof a);b.VM.checkRevision(a.compiler);var c=function(c,d,e,f,g,h,i,l,m){g&&(f=j.extend({},f,g));var n=b.VM.invokePartial.call(this,c,e,f,h,i,l,m);if(null==n&&b.compile){var o={helpers:h,partials:i,data:l,depths:m};i[e]=b.compile(c,{data:void 0!==l,compat:a.compat},b),n=i[e](f,o)}if(null!=n){if(d){for(var p=n.split("\n"),q=0,r=p.length;r>q&&(p[q]||q+1!==r);q++)p[q]=d+p[q];n=p.join("\n")}return n}throw new k("The partial "+e+" could not be compiled when running in runtime-only mode")},d={lookup:function(a,b){for(var c=a.length,d=0;c>d;d++)if(a[d]&&null!=a[d][b])return a[d][b]},lambda:function(a,b){return"function"==typeof a?a.call(b):a},escapeExpression:j.escapeExpression,invokePartial:c,fn:function(b){return a[b]},programs:[],program:function(a,b,c){var d=this.programs[a],e=this.fn(a);return b||c?d=f(this,a,e,b,c):d||(d=this.programs[a]=f(this,a,e)),d},data:function(a,b){for(;a&&b--;)a=a._parent;return a},merge:function(a,b){var c=a||b;return a&&b&&a!==b&&(c=j.extend({},b,a)),c},noop:b.VM.noop,compilerInfo:a.compiler},e=function(b,c){c=c||{};var f=c.data;e._setup(c),!c.partial&&a.useData&&(f=i(b,f));var g;return a.useDepths&&(g=c.depths?[b].concat(c.depths):[b]),a.main.call(d,b,d.helpers,d.partials,f,g)};return e.isTop=!0,e._setup=function(c){c.partial?(d.helpers=c.helpers,d.partials=c.partials):(d.helpers=d.merge(c.helpers,b.helpers),a.usePartial&&(d.partials=d.merge(c.partials,b.partials)))},e._child=function(b,c,e){if(a.useDepths&&!e)throw new k("must pass parent depths");return f(d,b,a[b],c,e)},e}function f(a,b,c,d,e){var f=function(b,f){return f=f||{},c.call(a,b,a.helpers,a.partials,f.data||d,e&&[b].concat(e))};return f.program=b,f.depth=e?e.length:0,f}function g(a,b,c,d,e,f,g){var h={partial:!0,helpers:d,partials:e,data:f,depths:g};if(void 0===a)throw new k("The partial "+b+" could not be found");return a instanceof Function?a(c,h):void 0}function h(){return""}function i(a,b){return b&&"root"in b||(b=b?n(b):{},b.root=a),b}var j=a("./utils"),k=a("./exception")["default"],l=a("./base").COMPILER_REVISION,m=a("./base").REVISION_CHANGES,n=a("./base").createFrame;c.checkRevision=d,c.template=e,c.program=f,c.invokePartial=g,c.noop=h},{"./base":23,"./exception":24,"./utils":27}],26:[function(a,b,c){"use strict";function d(a){this.string=a}d.prototype.toString=function(){return""+this.string},c["default"]=d},{}],27:[function(a,b,c){"use strict";function d(a){return j[a]}function e(a){for(var b=1;b<arguments.length;b++)for(var c in arguments[b])Object.prototype.hasOwnProperty.call(arguments[b],c)&&(a[c]=arguments[b][c]);return a}function f(a){return a instanceof i?a.toString():null==a?"":a?(a=""+a,l.test(a)?a.replace(k,d):a):a+""}function g(a){return a||0===a?o(a)&&0===a.length?!0:!1:!0}function h(a,b){return(a?a+".":"")+b}var i=a("./safe-string")["default"],j={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},k=/[&<>"'`]/g,l=/[&<>"'`]/;c.extend=e;var m=Object.prototype.toString;c.toString=m;var n=function(a){return"function"==typeof a};n(/x/)&&(n=function(a){return"function"==typeof a&&"[object Function]"===m.call(a)});var n;c.isFunction=n;var o=Array.isArray||function(a){return a&&"object"==typeof a?"[object Array]"===m.call(a):!1};c.isArray=o,c.escapeExpression=f,c.isEmpty=g,c.appendContextPath=h},{"./safe-string":26}],28:[function(a,b){b.exports=a("./dist/cjs/handlebars.runtime")},{"./dist/cjs/handlebars.runtime":22}],29:[function(a,b){b.exports=a("handlebars/runtime")["default"]},{"handlebars/runtime":28}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);