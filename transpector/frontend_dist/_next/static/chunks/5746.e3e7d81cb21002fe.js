"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5746],{32067:function(e,r,t){var n=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,t=r&&e[r],n=0;if(t)return t.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(r,"__esModule",{value:!0}),r.MathJax=r.combineWithMathJax=r.combineDefaults=r.combineConfig=r.isObject=void 0;var a=t(73132);function o(e){return"object"==typeof e&&null!==e}function i(e,r){var t,a;try{for(var s=n(Object.keys(r)),c=s.next();!c.done;c=s.next()){var l=c.value;"__esModule"!==l&&(o(e[l])&&o(r[l])&&!(r[l]instanceof Promise)?i(e[l],r[l]):null!==r[l]&&void 0!==r[l]&&(e[l]=r[l]))}}catch(e){t={error:e}}finally{try{c&&!c.done&&(a=s.return)&&a.call(s)}finally{if(t)throw t.error}}return e}r.isObject=o,r.combineConfig=i,r.combineDefaults=function e(r,t,a){var i,s;r[t]||(r[t]={}),r=r[t];try{for(var c=n(Object.keys(a)),l=c.next();!l.done;l=c.next()){var u=l.value;o(r[u])&&o(a[u])?e(r,u,a[u]):null==r[u]&&null!=a[u]&&(r[u]=a[u])}}catch(e){i={error:e}}finally{try{l&&!l.done&&(s=c.return)&&s.call(c)}finally{if(i)throw i.error}}return r},r.combineWithMathJax=function(e){return i(r.MathJax,e)},void 0===t.g.MathJax&&(t.g.MathJax={}),t.g.MathJax.version||(t.g.MathJax={version:a.VERSION,_:{},config:t.g.MathJax}),r.MathJax=t.g.MathJax},18457:function(e,r,t){var n,a,o,i,s,c=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,t=r&&e[r],n=0;if(t)return t.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")};Object.defineProperty(r,"__esModule",{value:!0}),r.CONFIG=r.MathJax=r.Loader=r.PathFilters=r.PackageError=r.Package=void 0;var l=t(32067),u=t(91777),d=t(91777);Object.defineProperty(r,"Package",{enumerable:!0,get:function(){return d.Package}}),Object.defineProperty(r,"PackageError",{enumerable:!0,get:function(){return d.PackageError}});var f=t(64905);if(r.PathFilters={source:function(e){return r.CONFIG.source.hasOwnProperty(e.name)&&(e.name=r.CONFIG.source[e.name]),!0},normalize:function(e){var r=e.name;return r.match(/^(?:[a-z]+:\/)?\/|[a-z]:\\|\[/i)||(e.name="[mathjax]/"+r.replace(/^\.\//,"")),e.addExtension&&!r.match(/\.[^\/]+$/)&&(e.name+=".js"),!0},prefix:function(e){for(var t;(t=e.name.match(/^\[([^\]]*)\]/))&&r.CONFIG.paths.hasOwnProperty(t[1]);)e.name=r.CONFIG.paths[t[1]]+e.name.substr(t[0].length);return!0}},i=o=r.Loader||(r.Loader={}),s=l.MathJax.version,i.versions=new Map,i.ready=function(){for(var e,r,t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];0===t.length&&(t=Array.from(u.Package.packages.keys()));var a=[];try{for(var o=c(t),i=o.next();!i.done;i=o.next()){var s=i.value,l=u.Package.packages.get(s)||new u.Package(s,!0);a.push(l.promise)}}catch(r){e={error:r}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(e)throw e.error}}return Promise.all(a)},i.load=function(){for(var e,t,n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];if(0===n.length)return Promise.resolve();var o=[],s=function(e){var t=u.Package.packages.get(e);t||(t=new u.Package(e)).provides(r.CONFIG.provides[e]),t.checkNoLoad(),o.push(t.promise.then(function(){r.CONFIG.versionWarnings&&t.isLoaded&&!i.versions.has(u.Package.resolvePath(e))&&console.warn("No version information available for component ".concat(e))}))};try{for(var l=c(n),d=l.next();!d.done;d=l.next()){var f=d.value;s(f)}}catch(r){e={error:r}}finally{try{d&&!d.done&&(t=l.return)&&t.call(l)}finally{if(e)throw e.error}}return u.Package.loadAll(),Promise.all(o)},i.preLoad=function(){for(var e,t,n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];try{for(var o=c(n),i=o.next();!i.done;i=o.next()){var s=i.value,l=u.Package.packages.get(s);l||(l=new u.Package(s,!0)).provides(r.CONFIG.provides[s]),l.loaded()}}catch(r){e={error:r}}finally{try{i&&!i.done&&(t=o.return)&&t.call(o)}finally{if(e)throw e.error}}},i.defaultReady=function(){void 0!==r.MathJax.startup&&r.MathJax.config.startup.ready()},i.getRoot=function(){var e="//../../es5";if("undefined"!=typeof document){var r=document.currentScript||document.getElementById("MathJax-script");r&&(e=r.src.replace(/\/[^\/]*$/,""))}return e},i.checkVersion=function(e,t,n){return i.versions.set(u.Package.resolvePath(e),s),!!r.CONFIG.versionWarnings&&t!==s&&(console.warn("Component ".concat(e," uses ").concat(t," of MathJax; version in use is ").concat(s)),!0)},i.pathFilters=new f.FunctionList,i.pathFilters.add(r.PathFilters.source,0),i.pathFilters.add(r.PathFilters.normalize,10),i.pathFilters.add(r.PathFilters.prefix,20),r.MathJax=l.MathJax,void 0===r.MathJax.loader){(0,l.combineDefaults)(r.MathJax.config,"loader",{paths:{mathjax:o.getRoot()},source:{},dependencies:{},provides:{},load:[],ready:o.defaultReady.bind(o),failed:function(e){return console.log("MathJax(".concat(e.package||"?","): ").concat(e.message))},require:null,pathFilters:[],versionWarnings:!0}),(0,l.combineWithMathJax)({loader:o});try{for(var h=c(r.MathJax.config.loader.pathFilters),p=h.next();!p.done;p=h.next()){var y=p.value;Array.isArray(y)?o.pathFilters.add(y[0],y[1]):o.pathFilters.add(y)}}catch(e){n={error:e}}finally{try{p&&!p.done&&(a=h.return)&&a.call(h)}finally{if(n)throw n.error}}}r.CONFIG=r.MathJax.config.loader},91777:function(e,r,t){var n,a=this&&this.__extends||(n=function(e,r){return(n=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])})(e,r)},function(e,r){if("function"!=typeof r&&null!==r)throw TypeError("Class extends value "+String(r)+" is not a constructor or null");function t(){this.constructor=e}n(e,r),e.prototype=null===r?Object.create(r):(t.prototype=r.prototype,new t)}),o=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,t=r&&e[r],n=0;if(t)return t.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},i=this&&this.__read||function(e,r){var t="function"==typeof Symbol&&e[Symbol.iterator];if(!t)return e;var n,a,o=t.call(e),i=[];try{for(;(void 0===r||r-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(t=o.return)&&t.call(o)}finally{if(a)throw a.error}}return i},s=this&&this.__spreadArray||function(e,r,t){if(t||2==arguments.length)for(var n,a=0,o=r.length;a<o;a++)!n&&a in r||(n||(n=Array.prototype.slice.call(r,0,a)),n[a]=r[a]);return e.concat(n||Array.prototype.slice.call(r))};Object.defineProperty(r,"__esModule",{value:!0}),r.Package=r.PackageError=void 0;var c=t(18457),l=function(e){function r(r,t){var n=e.call(this,r)||this;return n.package=t,n}return a(r,e),r}(Error);r.PackageError=l;var u=function(){function e(r,t){void 0===t&&(t=!1),this.isLoaded=!1,this.isLoading=!1,this.hasFailed=!1,this.dependents=[],this.dependencies=[],this.dependencyCount=0,this.provided=[],this.name=r,this.noLoad=t,e.packages.set(r,this),this.promise=this.makePromise(this.makeDependencies())}return Object.defineProperty(e.prototype,"canLoad",{get:function(){return 0===this.dependencyCount&&!this.noLoad&&!this.isLoading&&!this.hasFailed},enumerable:!1,configurable:!0}),e.resolvePath=function(e,r){void 0===r&&(r=!0);var t={name:e,original:e,addExtension:r};return c.Loader.pathFilters.execute(t),t.name},e.loadAll=function(){var e,r;try{for(var t=o(this.packages.values()),n=t.next();!n.done;n=t.next()){var a=n.value;a.canLoad&&a.load()}}catch(r){e={error:r}}finally{try{n&&!n.done&&(r=t.return)&&r.call(t)}finally{if(e)throw e.error}}},e.prototype.makeDependencies=function(){var r,t,n=[],a=e.packages,l=this.noLoad,u=this.name,d=[];c.CONFIG.dependencies.hasOwnProperty(u)?d.push.apply(d,s([],i(c.CONFIG.dependencies[u]),!1)):"core"!==u&&d.push("core");try{for(var f=o(d),h=f.next();!h.done;h=f.next()){var p=h.value,y=a.get(p)||new e(p,l);0>this.dependencies.indexOf(y)&&(y.addDependent(this,l),this.dependencies.push(y),y.isLoaded||(this.dependencyCount++,n.push(y.promise)))}}catch(e){r={error:e}}finally{try{h&&!h.done&&(t=f.return)&&t.call(f)}finally{if(r)throw r.error}}return n},e.prototype.makePromise=function(e){var r=this,t=new Promise(function(e,t){r.resolve=e,r.reject=t}),n=c.CONFIG[this.name]||{};return n.ready&&(t=t.then(function(e){return n.ready(r.name)})),e.length&&(e.push(t),t=Promise.all(e).then(function(e){return e.join(", ")})),n.failed&&t.catch(function(e){return n.failed(new l(e,r.name))}),t},e.prototype.load=function(){if(!this.isLoaded&&!this.isLoading&&!this.noLoad){this.isLoading=!0;var r=e.resolvePath(this.name);c.CONFIG.require?this.loadCustom(r):this.loadScript(r)}},e.prototype.loadCustom=function(e){var r=this;try{var t=c.CONFIG.require(e);t instanceof Promise?t.then(function(){return r.checkLoad()}).catch(function(t){return r.failed("Can't load \""+e+'"\n'+t.message.trim())}):this.checkLoad()}catch(e){this.failed(e.message)}},e.prototype.loadScript=function(e){var r=this,t=document.createElement("script");t.src=e,t.charset="UTF-8",t.onload=function(e){return r.checkLoad()},t.onerror=function(t){return r.failed("Can't load \""+e+'"')},document.head.appendChild(t)},e.prototype.loaded=function(){var e,r,t,n;this.isLoaded=!0,this.isLoading=!1;try{for(var a=o(this.dependents),i=a.next();!i.done;i=a.next())i.value.requirementSatisfied()}catch(r){e={error:r}}finally{try{i&&!i.done&&(r=a.return)&&r.call(a)}finally{if(e)throw e.error}}try{for(var s=o(this.provided),c=s.next();!c.done;c=s.next())c.value.loaded()}catch(e){t={error:e}}finally{try{c&&!c.done&&(n=s.return)&&n.call(s)}finally{if(t)throw t.error}}this.resolve(this.name)},e.prototype.failed=function(e){this.hasFailed=!0,this.isLoading=!1,this.reject(new l(e,this.name))},e.prototype.checkLoad=function(){var e=this;((c.CONFIG[this.name]||{}).checkReady||function(){return Promise.resolve()})().then(function(){return e.loaded()}).catch(function(r){return e.failed(r)})},e.prototype.requirementSatisfied=function(){this.dependencyCount&&(this.dependencyCount--,this.canLoad&&this.load())},e.prototype.provides=function(r){var t,n;void 0===r&&(r=[]);try{for(var a=o(r),i=a.next();!i.done;i=a.next()){var s=i.value,l=e.packages.get(s);l||(c.CONFIG.dependencies[s]||(c.CONFIG.dependencies[s]=[]),c.CONFIG.dependencies[s].push(s),(l=new e(s,!0)).isLoading=!0),this.provided.push(l)}}catch(e){t={error:e}}finally{try{i&&!i.done&&(n=a.return)&&n.call(a)}finally{if(t)throw t.error}}},e.prototype.addDependent=function(e,r){this.dependents.push(e),r||this.checkNoLoad()},e.prototype.checkNoLoad=function(){var e,r;if(this.noLoad){this.noLoad=!1;try{for(var t=o(this.dependencies),n=t.next();!n.done;n=t.next())n.value.checkNoLoad()}catch(r){e={error:r}}finally{try{n&&!n.done&&(r=t.return)&&r.call(t)}finally{if(e)throw e.error}}}},e.packages=new Map,e}();r.Package=u},5746:function(e,r,t){var n=this&&this.__values||function(e){var r="function"==typeof Symbol&&Symbol.iterator,t=r&&e[r],n=0;if(t)return t.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(e,r){var t="function"==typeof Symbol&&e[Symbol.iterator];if(!t)return e;var n,a,o=t.call(e),i=[];try{for(;(void 0===r||r-- >0)&&!(n=o.next()).done;)i.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(t=o.return)&&t.call(o)}finally{if(a)throw a.error}}return i},o=this&&this.__spreadArray||function(e,r,t){if(t||2==arguments.length)for(var n,a=0,o=r.length;a<o;a++)!n&&a in r||(n||(n=Array.prototype.slice.call(r,0,a)),n[a]=r[a]);return e.concat(n||Array.prototype.slice.call(r))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(r,"__esModule",{value:!0}),r.RequireConfiguration=r.options=r.RequireMethods=r.RequireLoad=void 0;var s=t(23644),c=t(92715),l=i(t(48406)),u=t(32067),d=t(91777),f=t(18457),h=t(90786),p=t(36059),y=u.MathJax.config;function v(e,r){var t=e.options.require,a=t.allow,o=("["===r.substr(0,1)?"":t.prefix)+r;if(!(a.hasOwnProperty(o)?a[o]:a.hasOwnProperty(r)?a[r]:t.defaultAllow))throw new l.default("BadRequire",'Extension "%1" is not allowed to be loaded',o);d.Package.packages.has(o)?function e(r,t){var a,o=r.parseOptions.options.require,i=r.parseOptions.packageData.get("require").required,c=t.substr(o.prefix.length);if(0>i.indexOf(c)){i.push(c),function(r,t){void 0===t&&(t=[]);var a,o,i=r.parseOptions.options.require.prefix;try{for(var s=n(t),c=s.next();!c.done;c=s.next()){var l=c.value;l.substr(0,i.length)===i&&e(r,l)}}catch(e){a={error:e}}finally{try{c&&!c.done&&(o=s.return)&&o.call(s)}finally{if(a)throw a.error}}}(r,f.CONFIG.dependencies[t]);var l=s.ConfigurationHandler.get(c);if(l){var u=y[t]||{};l.options&&1===Object.keys(l.options).length&&l.options[c]&&((a={})[c]=u,u=a),r.configuration.add(c,r,u);var d=r.parseOptions.packageData.get("require").configured;l.preprocessors.length&&!d.has(c)&&(d.set(c,!0),h.mathjax.retryAfter(Promise.resolve()))}}}(e.configuration.packageData.get("require").jax,o):h.mathjax.retryAfter(f.Loader.load(o))}r.RequireLoad=v,r.RequireMethods={Require:function(e,r){var t=e.GetArgument(r);if(t.match(/[^_a-zA-Z0-9]/)||""===t)throw new l.default("BadPackageName","Argument for %1 is not a valid package name",r);v(e,t)}},r.options={require:{allow:(0,p.expandable)({base:!1,"all-packages":!1,autoload:!1,configmacros:!1,tagformat:!1,setoptions:!1}),defaultAllow:!0,prefix:"tex"}},new c.CommandMap("require",{require:"Require"},r.RequireMethods),r.RequireConfiguration=s.Configuration.create("require",{handler:{macro:["require"]},config:function(e,r){r.parseOptions.packageData.set("require",{jax:r,required:o([],a(r.options.packages),!1),configured:new Map});var t=r.parseOptions.options.require,n=t.prefix;if(n.match(/[^_a-zA-Z0-9]/))throw Error("Illegal characters used in \\require prefix");f.CONFIG.paths[n]||(f.CONFIG.paths[n]="[mathjax]/input/tex/extensions"),t.prefix="["+n+"]/"},options:r.options})}}]);