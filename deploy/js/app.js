/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _main = __webpack_require__(3);
	
	var main = _interopRequireWildcard(_main);
	
	$(document).ready(function () {
	  _mithril2['default'].route(document.body, '/', {
	    '/': main
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";
	
	var m = (function app(window, undefined) {
		var OBJECT = "[object Object]",
		    ARRAY = "[object Array]",
		    STRING = "[object String]",
		    FUNCTION = "function";
		var type = ({}).toString;
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g,
		    attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
		var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
		var noop = function noop() {};
	
		// caching commonly used variables
		var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;
	
		// self invoking function needed because of the way mocks work
		function initialize(window) {
			$document = window.document;
			$location = window.location;
			$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
			$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
		}
	
		initialize(window);
	
		/**
	  * @typedef {String} Tag
	  * A string that looks like -> div.classname#id[param=one][param2=two]
	  * Which describes a DOM node
	  */
	
		/**
	  *
	  * @param {Tag} The DOM node tag
	  * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	  * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	  *
	  */
		function m() {
			var args = [].slice.call(arguments);
			var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1] || "view" in args[1]) && !("subtree" in args[1]);
			var attrs = hasAttrs ? args[1] : {};
			var classAttrName = "class" in attrs ? "class" : "className";
			var cell = { tag: "div", attrs: {} };
			var match,
			    classes = [];
			if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string");
			while (match = parser.exec(args[0])) {
				if (match[1] === "" && match[2]) cell.tag = match[2];else if (match[1] === "#") cell.attrs.id = match[2];else if (match[1] === ".") classes.push(match[2]);else if (match[3][0] === "[") {
					var pair = attrParser.exec(match[3]);
					cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" : true);
				}
			}
	
			var children = hasAttrs ? args.slice(2) : args.slice(1);
			if (children.length === 1 && type.call(children[0]) === ARRAY) {
				cell.children = children[0];
			} else {
				cell.children = children;
			}
	
			for (var attrName in attrs) {
				if (attrs.hasOwnProperty(attrName)) {
					if (attrName === classAttrName && attrs[attrName] != null && attrs[attrName] !== "") {
						classes.push(attrs[attrName]);
						cell.attrs[attrName] = "" //create key in correct iteration order
						;
					} else cell.attrs[attrName] = attrs[attrName];
				}
			}
			if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");
	
			return cell;
		}
		function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
			//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
			//the diff algorithm can be summarized as this:
			//1 - compare `data` and `cached`
			//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
			//3 - recursively apply this algorithm for every array and for the children of every virtual element
	
			//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
			//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
			//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
			//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
			//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node
	
			//`parentElement` is a DOM element used for W3C DOM API calls
			//`parentTag` is only used for handling a corner case for textarea values
			//`parentCache` is used to remove nodes in some multi-node cases
			//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
			//`data` and `cached` are, respectively, the new and old nodes being diffed
			//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
			//`editable` is a flag that indicates whether an ancestor is contenteditable
			//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
			//`configs` is a list of config functions to run after the topmost `build` call finishes running
	
			//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
			//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
			//- it simplifies diffing code
			//data.toString() might throw or return null if data is the return value of Console.log in Firefox (behavior depends on version)
			try {
				if (data == null || data.toString() == null) data = "";
			} catch (e) {
				data = "";
			}
			if (data.subtree === "retain") return cached;
			var cachedType = type.call(cached),
			    dataType = type.call(data);
			if (cached == null || cachedType !== dataType) {
				if (cached != null) {
					if (parentCache && parentCache.nodes) {
						var offset = index - parentIndex;
						var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
						clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
					} else if (cached.nodes) clear(cached.nodes, cached);
				}
				cached = new data.constructor();
				if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
				cached.nodes = [];
			}
	
			if (dataType === ARRAY) {
				//recursively flatten array
				for (var i = 0, len = data.length; i < len; i++) {
					if (type.call(data[i]) === ARRAY) {
						data = data.concat.apply([], data);
						i--; //check current index again and flatten until there are no more nested arrays at that index
						len = data.length;
					}
				}
	
				var nodes = [],
				    intact = cached.length === data.length,
				    subArrayCount = 0;
	
				//keys algorithm: sort elements without recreating them if keys are present
				//1) create a map of all existing keys, and mark all for deletion
				//2) add new keys to map and mark them for addition
				//3) if key exists in new list, change action from deletion to a move
				//4) for each key, handle its corresponding action as marked in previous steps
				var DELETION = 1,
				    INSERTION = 2,
				    MOVE = 3;
				var existing = {},
				    shouldMaintainIdentities = false;
				for (var i = 0; i < cached.length; i++) {
					if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
						shouldMaintainIdentities = true;
						existing[cached[i].attrs.key] = { action: DELETION, index: i };
					}
				}
	
				var guid = 0;
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i] && data[i].attrs && data[i].attrs.key != null) {
						for (var j = 0, len = data.length; j < len; j++) {
							if (data[j] && data[j].attrs && data[j].attrs.key == null) data[j].attrs.key = "__mithril__" + guid++;
						}
						break;
					}
				}
	
				if (shouldMaintainIdentities) {
					var keysDiffer = false;
					if (data.length != cached.length) keysDiffer = true;else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
						if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
							keysDiffer = true;
							break;
						}
					}
	
					if (keysDiffer) {
						for (var i = 0, len = data.length; i < len; i++) {
							if (data[i] && data[i].attrs) {
								if (data[i].attrs.key != null) {
									var key = data[i].attrs.key;
									if (!existing[key]) existing[key] = { action: INSERTION, index: i };else existing[key] = {
										action: MOVE,
										index: i,
										from: existing[key].index,
										element: cached.nodes[existing[key].index] || $document.createElement("div")
									};
								}
							}
						}
						var actions = [];
						for (var prop in existing) actions.push(existing[prop]);
						var changes = actions.sort(sortChanges);
						var newCached = new Array(cached.length);
						newCached.nodes = cached.nodes.slice();
	
						for (var i = 0, change; change = changes[i]; i++) {
							if (change.action === DELETION) {
								clear(cached[change.index].nodes, cached[change.index]);
								newCached.splice(change.index, 1);
							}
							if (change.action === INSERTION) {
								var dummy = $document.createElement("div");
								dummy.key = data[change.index].attrs.key;
								parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
								newCached.splice(change.index, 0, { attrs: { key: data[change.index].attrs.key }, nodes: [dummy] });
								newCached.nodes[change.index] = dummy;
							}
	
							if (change.action === MOVE) {
								if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
									parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null);
								}
								newCached[change.index] = cached[change.from];
								newCached.nodes[change.index] = change.element;
							}
						}
						cached = newCached;
					}
				}
				//end key algorithm
	
				for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
					//diff each item in the array
					var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
					if (item === undefined) continue;
					if (!item.nodes.intact) intact = false;
					if (item.$trusted) {
						//fix offset of next element if item was a trusted string w/ more than one html element
						//the first clause in the regexp matches elements
						//the second clause (after the pipe) matches text nodes
						subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || [0]).length;
					} else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
					cached[cacheCount++] = item;
				}
				if (!intact) {
					//diff the array itself
	
					//update the list of DOM nodes by collecting the nodes from each item
					for (var i = 0, len = data.length; i < len; i++) {
						if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes);
					}
					//remove items from the end of the array if the new array is shorter than the old one
					//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
					for (var i = 0, node; node = cached.nodes[i]; i++) {
						if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]]);
					}
					if (data.length < cached.length) cached.length = data.length;
					cached.nodes = nodes;
				}
			} else if (data != null && dataType === OBJECT) {
				var views = [],
				    controllers = [];
				while (data.view) {
					var view = data.view.$original || data.view;
					var controllerIndex = m.redraw.strategy() == "diff" && cached.views ? cached.views.indexOf(view) : -1;
					var controller = controllerIndex > -1 ? cached.controllers[controllerIndex] : new (data.controller || noop)();
					var key = data && data.attrs && data.attrs.key;
					data = pendingRequests == 0 || cached && cached.controllers && cached.controllers.indexOf(controller) > -1 ? data.view(controller) : { tag: "placeholder" };
					if (data.subtree === "retain") return cached;
					if (key) {
						if (!data.attrs) data.attrs = {};
						data.attrs.key = key;
					}
					if (controller.onunload) unloaders.push({ controller: controller, handler: controller.onunload });
					views.push(view);
					controllers.push(controller);
				}
				if (!data.tag && controllers.length) throw new Error("Component template must return a virtual element, not an array, string, etc.");
				if (!data.attrs) data.attrs = {};
				if (!cached.attrs) cached.attrs = {};
	
				var dataAttrKeys = Object.keys(data.attrs);
				var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0);
				//if an element is different enough from the one in cache, recreate it
				if (data.tag != cached.tag || dataAttrKeys.sort().join() != Object.keys(cached.attrs).sort().join() || data.attrs.id != cached.attrs.id || data.attrs.key != cached.attrs.key || m.redraw.strategy() == "all" && (!cached.configContext || cached.configContext.retain !== true) || m.redraw.strategy() == "diff" && cached.configContext && cached.configContext.retain === false) {
					if (cached.nodes.length) clear(cached.nodes);
					if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload();
					if (cached.controllers) {
						for (var i = 0, controller; controller = cached.controllers[i]; i++) {
							if (typeof controller.onunload === FUNCTION) controller.onunload({ preventDefault: noop });
						}
					}
				}
				if (type.call(data.tag) != STRING) return;
	
				var node,
				    isNew = cached.nodes.length === 0;
				if (data.attrs.xmlns) namespace = data.attrs.xmlns;else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
	
				if (isNew) {
					if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
					cached = {
						tag: data.tag,
						//set attributes first, then create children
						attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
						children: data.children != null && data.children.length > 0 ? build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) : data.children,
						nodes: [node]
					};
					if (controllers.length) {
						cached.views = views;
						cached.controllers = controllers;
						for (var i = 0, controller; controller = controllers[i]; i++) {
							if (controller.onunload && controller.onunload.$old) controller.onunload = controller.onunload.$old;
							if (pendingRequests && controller.onunload) {
								var onunload = controller.onunload;
								controller.onunload = noop;
								controller.onunload.$old = onunload;
							}
						}
					}
	
					if (cached.children && !cached.children.nodes) cached.children.nodes = [];
					//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
					if (data.tag === "select" && "value" in data.attrs) setAttributes(node, data.tag, { value: data.attrs.value }, {}, namespace);
					parentElement.insertBefore(node, parentElement.childNodes[index] || null);
				} else {
					node = cached.nodes[0];
					if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
					cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
					cached.nodes.intact = true;
					if (controllers.length) {
						cached.views = views;
						cached.controllers = controllers;
					}
					if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null);
				}
				//schedule configs to be called. They are called after `build` finishes running
				if (typeof data.attrs["config"] === FUNCTION) {
					var context = cached.configContext = cached.configContext || {};
	
					// bind
					var callback = function callback(data, args) {
						return function () {
							return data.attrs["config"].apply(data, args);
						};
					};
					configs.push(callback(data, [node, !isNew, context, cached]));
				}
			} else if (typeof data != FUNCTION) {
				//handle text nodes
				var nodes;
				if (cached.nodes.length === 0) {
					if (data.$trusted) {
						nodes = injectHTML(parentElement, index, data);
					} else {
						nodes = [$document.createTextNode(data)];
						if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
					}
					cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
					cached.nodes = nodes;
				} else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
					nodes = cached.nodes;
					if (!editable || editable !== $document.activeElement) {
						if (data.$trusted) {
							clear(nodes, cached);
							nodes = injectHTML(parentElement, index, data);
						} else {
							//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
							//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
							if (parentTag === "textarea") parentElement.value = data;else if (editable) editable.innerHTML = data;else {
								if (nodes[0].nodeType === 1 || nodes.length > 1) {
									//was a trusted string
									clear(cached.nodes, cached);
									nodes = [$document.createTextNode(data)];
								}
								parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
								nodes[0].nodeValue = data;
							}
						}
					}
					cached = new data.constructor(data);
					cached.nodes = nodes;
				} else cached.nodes.intact = true;
			}
	
			return cached;
		}
		function sortChanges(a, b) {
			return a.action - b.action || a.index - b.index;
		}
		function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
			for (var attrName in dataAttrs) {
				var dataAttr = dataAttrs[attrName];
				var cachedAttr = cachedAttrs[attrName];
				if (!(attrName in cachedAttrs) || cachedAttr !== dataAttr) {
					cachedAttrs[attrName] = dataAttr;
					try {
						//`config` isn't a real attributes, so ignore it
						if (attrName === "config" || attrName == "key") continue;
						//hook event handlers to the auto-redrawing system
						else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
							node[attrName] = autoredraw(dataAttr, node);
						}
						//handle `style: {...}`
						else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
							for (var rule in dataAttr) {
								if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule];
							}
							for (var rule in cachedAttr) {
								if (!(rule in dataAttr)) node.style[rule] = "";
							}
						}
						//handle SVG
						else if (namespace != null) {
							if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);else if (attrName === "className") node.setAttribute("class", dataAttr);else node.setAttribute(attrName, dataAttr);
						}
						//handle cases that are properties (but ignore cases where we should use setAttribute instead)
						//- list and form are typically used as strings, but are DOM element references in js
						//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
						else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type" || attrName === "width" || attrName === "height")) {
							//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
							if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr;
						} else node.setAttribute(attrName, dataAttr);
					} catch (e) {
						//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
						if (e.message.indexOf("Invalid argument") < 0) throw e;
					}
				}
				//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
				else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
					node.value = dataAttr;
				}
			}
			return cachedAttrs;
		}
		function clear(nodes, cached) {
			for (var i = nodes.length - 1; i > -1; i--) {
				if (nodes[i] && nodes[i].parentNode) {
					try {
						nodes[i].parentNode.removeChild(nodes[i]);
					} catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					cached = [].concat(cached);
					if (cached[i]) unload(cached[i]);
				}
			}
			if (nodes.length != 0) nodes.length = 0;
		}
		function unload(cached) {
			if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) {
				cached.configContext.onunload();
				cached.configContext.onunload = null;
			}
			if (cached.controllers) {
				for (var i = 0, controller; controller = cached.controllers[i]; i++) {
					if (typeof controller.onunload === FUNCTION) controller.onunload({ preventDefault: noop });
				}
			}
			if (cached.children) {
				if (type.call(cached.children) === ARRAY) {
					for (var i = 0, child; child = cached.children[i]; i++) unload(child);
				} else if (cached.children.tag) unload(cached.children);
			}
		}
		function injectHTML(parentElement, index, data) {
			var nextSibling = parentElement.childNodes[index];
			if (nextSibling) {
				var isElement = nextSibling.nodeType != 1;
				var placeholder = $document.createElement("span");
				if (isElement) {
					parentElement.insertBefore(placeholder, nextSibling || null);
					placeholder.insertAdjacentHTML("beforebegin", data);
					parentElement.removeChild(placeholder);
				} else nextSibling.insertAdjacentHTML("beforebegin", data);
			} else parentElement.insertAdjacentHTML("beforeend", data);
			var nodes = [];
			while (parentElement.childNodes[index] !== nextSibling) {
				nodes.push(parentElement.childNodes[index]);
				index++;
			}
			return nodes;
		}
		function autoredraw(callback, object) {
			return function (e) {
				e = e || event;
				m.redraw.strategy("diff");
				m.startComputation();
				try {
					return callback.call(object, e);
				} finally {
					endFirstComputation();
				}
			};
		}
	
		var html;
		var documentNode = {
			appendChild: function appendChild(node) {
				if (html === undefined) html = $document.createElement("html");
				if ($document.documentElement && $document.documentElement !== node) {
					$document.replaceChild(node, $document.documentElement);
				} else $document.appendChild(node);
				this.childNodes = $document.childNodes;
			},
			insertBefore: function insertBefore(node) {
				this.appendChild(node);
			},
			childNodes: []
		};
		var nodeCache = [],
		    cellCache = {};
		m.render = function (root, cell, forceRecreation) {
			var configs = [];
			if (!root) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
			var id = getCellCacheKey(root);
			var isDocumentRoot = root === $document;
			var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
			if (isDocumentRoot && cell.tag != "html") cell = { tag: "html", attrs: {}, children: cell };
			if (cellCache[id] === undefined) clear(node.childNodes);
			if (forceRecreation === true) reset(root);
			cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
			for (var i = 0, len = configs.length; i < len; i++) configs[i]();
		};
		function getCellCacheKey(element) {
			var index = nodeCache.indexOf(element);
			return index < 0 ? nodeCache.push(element) - 1 : index;
		}
	
		m.trust = function (value) {
			value = new String(value);
			value.$trusted = true;
			return value;
		};
	
		function gettersetter(store) {
			var prop = function prop() {
				if (arguments.length) store = arguments[0];
				return store;
			};
	
			prop.toJSON = function () {
				return store;
			};
	
			return prop;
		}
	
		m.prop = function (store) {
			//note: using non-strict equality check here because we're checking if store is null OR undefined
			if ((store != null && type.call(store) === OBJECT || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
				return propify(store);
			}
	
			return gettersetter(store);
		};
	
		var roots = [],
		    components = [],
		    controllers = [],
		    lastRedrawId = null,
		    lastRedrawCallTime = 0,
		    computePreRedrawHook = null,
		    computePostRedrawHook = null,
		    prevented = false,
		    topComponent,
		    unloaders = [];
		var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
		function parameterize(component, args) {
			var controller = function controller() {
				return (component.controller || noop).apply(this, args) || this;
			};
			var view = function view(ctrl) {
				if (arguments.length > 1) args = args.concat([].slice.call(arguments, 1));
				return component.view.apply(component, args ? [ctrl].concat(args) : [ctrl]);
			};
			view.$original = component.view;
			var output = { controller: controller, view: view };
			if (args[0] && args[0].key != null) output.attrs = { key: args[0].key };
			return output;
		}
		m.component = function (component) {
			return parameterize(component, [].slice.call(arguments, 1));
		};
		m.mount = m.module = function (root, component) {
			if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
			var index = roots.indexOf(root);
			if (index < 0) index = roots.length;
	
			var isPrevented = false;
			var event = { preventDefault: function preventDefault() {
					isPrevented = true;
					computePreRedrawHook = computePostRedrawHook = null;
				} };
			for (var i = 0, unloader; unloader = unloaders[i]; i++) {
				unloader.handler.call(unloader.controller, event);
				unloader.controller.onunload = null;
			}
			if (isPrevented) {
				for (var i = 0, unloader; unloader = unloaders[i]; i++) unloader.controller.onunload = unloader.handler;
			} else unloaders = [];
	
			if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
				controllers[index].onunload(event);
			}
	
			if (!isPrevented) {
				m.redraw.strategy("all");
				m.startComputation();
				roots[index] = root;
				if (arguments.length > 2) component = subcomponent(component, [].slice.call(arguments, 2));
				var currentComponent = topComponent = component = component || { controller: function controller() {} };
				var constructor = component.controller || noop;
				var controller = new constructor();
				//controllers may call m.mount recursively (via m.route redirects, for example)
				//this conditional ensures only the last recursive m.mount call is applied
				if (currentComponent === topComponent) {
					controllers[index] = controller;
					components[index] = component;
				}
				endFirstComputation();
				return controllers[index];
			}
		};
		var redrawing = false;
		m.redraw = function (force) {
			if (redrawing) return;
			redrawing = true;
			//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
			//lastRedrawID is null if it's the first redraw and not an event handler
			if (lastRedrawId && force !== true) {
				//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
				//when rAF: always reschedule redraw
				if ($requestAnimationFrame === window.requestAnimationFrame || new Date() - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
				}
			} else {
				redraw();
				lastRedrawId = $requestAnimationFrame(function () {
					lastRedrawId = null;
				}, FRAME_BUDGET);
			}
			redrawing = false;
		};
		m.redraw.strategy = m.prop();
		function redraw() {
			if (computePreRedrawHook) {
				computePreRedrawHook();
				computePreRedrawHook = null;
			}
			for (var i = 0, root; root = roots[i]; i++) {
				if (controllers[i]) {
					var args = components[i].controller && components[i].controller.$$args ? [controllers[i]].concat(components[i].controller.$$args) : [controllers[i]];
					m.render(root, components[i].view ? components[i].view(controllers[i], args) : "");
				}
			}
			//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
			if (computePostRedrawHook) {
				computePostRedrawHook();
				computePostRedrawHook = null;
			}
			lastRedrawId = null;
			lastRedrawCallTime = new Date();
			m.redraw.strategy("diff");
		}
	
		var pendingRequests = 0;
		m.startComputation = function () {
			pendingRequests++;
		};
		m.endComputation = function () {
			pendingRequests = Math.max(pendingRequests - 1, 0);
			if (pendingRequests === 0) m.redraw();
		};
		var endFirstComputation = function endFirstComputation() {
			if (m.redraw.strategy() == "none") {
				pendingRequests--;
				m.redraw.strategy("diff");
			} else m.endComputation();
		};
	
		m.withAttr = function (prop, withAttrCallback) {
			return function (e) {
				e = e || event;
				var currentTarget = e.currentTarget || this;
				withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
			};
		};
	
		//routing
		var modes = { pathname: "", hash: "#", search: "?" };
		var redirect = noop,
		    routeParams,
		    currentRoute,
		    isDefaultRoute = false;
		m.route = function () {
			//m.route()
			if (arguments.length === 0) return currentRoute;
			//m.route(el, defaultRoute, routes)
			else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
				var root = arguments[0],
				    defaultRoute = arguments[1],
				    router = arguments[2];
				redirect = function (source) {
					var path = currentRoute = normalizeRoute(source);
					if (!routeByValue(root, router, path)) {
						if (isDefaultRoute) throw new Error("Ensure the default route matches one of the routes defined in m.route");
						isDefaultRoute = true;
						m.route(defaultRoute, true);
						isDefaultRoute = false;
					}
				};
				var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
				window[listener] = function () {
					var path = $location[m.route.mode];
					if (m.route.mode === "pathname") path += $location.search;
					if (currentRoute != normalizeRoute(path)) {
						redirect(path);
					}
				};
				computePreRedrawHook = setScroll;
				window[listener]();
			}
			//config: m.route
			else if (arguments[0].addEventListener || arguments[0].attachEvent) {
				var element = arguments[0];
				var isInitialized = arguments[1];
				var context = arguments[2];
				var vdom = arguments[3];
				element.href = (m.route.mode !== "pathname" ? $location.pathname : "") + modes[m.route.mode] + vdom.attrs.href;
				if (element.addEventListener) {
					element.removeEventListener("click", routeUnobtrusive);
					element.addEventListener("click", routeUnobtrusive);
				} else {
					element.detachEvent("onclick", routeUnobtrusive);
					element.attachEvent("onclick", routeUnobtrusive);
				}
			}
			//m.route(route, params, shouldReplaceHistoryEntry)
			else if (type.call(arguments[0]) === STRING) {
				var oldRoute = currentRoute;
				currentRoute = arguments[0];
				var args = arguments[1] || {};
				var queryIndex = currentRoute.indexOf("?");
				var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
				for (var i in args) params[i] = args[i];
				var querystring = buildQueryString(params);
				var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
				if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;
	
				var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];
	
				if (window.history.pushState) {
					computePreRedrawHook = setScroll;
					computePostRedrawHook = function () {
						window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					};
					redirect(modes[m.route.mode] + currentRoute);
				} else {
					$location[m.route.mode] = currentRoute;
					redirect(modes[m.route.mode] + currentRoute);
				}
			}
		};
		m.route.param = function (key) {
			if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()");
			return routeParams[key];
		};
		m.route.mode = "search";
		function normalizeRoute(route) {
			return route.slice(modes[m.route.mode].length);
		}
		function routeByValue(root, router, path) {
			routeParams = {};
	
			var queryStart = path.indexOf("?");
			if (queryStart !== -1) {
				routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
				path = path.substr(0, queryStart);
			}
	
			// Get all routes and check if there's
			// an exact match for the current path
			var keys = Object.keys(router);
			var index = keys.indexOf(path);
			if (index !== -1) {
				m.mount(root, router[keys[index]]);
				return true;
			}
	
			for (var route in router) {
				if (route === path) {
					m.mount(root, router[route]);
					return true;
				}
	
				var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "/?$");
	
				if (matcher.test(path)) {
					path.replace(matcher, function () {
						var keys = route.match(/:[^\/]+/g) || [];
						var values = [].slice.call(arguments, 1, -2);
						for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i]);
						m.mount(root, router[route]);
					});
					return true;
				}
			}
		}
		function routeUnobtrusive(e) {
			e = e || event;
			if (e.ctrlKey || e.metaKey || e.which === 2) return;
			if (e.preventDefault) e.preventDefault();else e.returnValue = false;
			var currentTarget = e.currentTarget || e.srcElement;
			var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
			while (currentTarget && currentTarget.nodeName.toUpperCase() != "A") currentTarget = currentTarget.parentNode;
			m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args);
		}
		function setScroll() {
			if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;else window.scrollTo(0, 0);
		}
		function buildQueryString(object, prefix) {
			var duplicates = {};
			var str = [];
			for (var prop in object) {
				var key = prefix ? prefix + "[" + prop + "]" : prop;
				var value = object[prop];
				var valueType = type.call(value);
				var pair = value === null ? encodeURIComponent(key) : valueType === OBJECT ? buildQueryString(value, key) : valueType === ARRAY ? value.reduce(function (memo, item) {
					if (!duplicates[key]) duplicates[key] = {};
					if (!duplicates[key][item]) {
						duplicates[key][item] = true;
						return memo.concat(encodeURIComponent(key) + "=" + encodeURIComponent(item));
					}
					return memo;
				}, []).join("&") : encodeURIComponent(key) + "=" + encodeURIComponent(value);
				if (value !== undefined) str.push(pair);
			}
			return str.join("&");
		}
		function parseQueryString(str) {
			if (str.charAt(0) === "?") str = str.substring(1);
	
			var pairs = str.split("&"),
			    params = {};
			for (var i = 0, len = pairs.length; i < len; i++) {
				var pair = pairs[i].split("=");
				var key = decodeURIComponent(pair[0]);
				var value = pair.length == 2 ? decodeURIComponent(pair[1]) : null;
				if (params[key] != null) {
					if (type.call(params[key]) !== ARRAY) params[key] = [params[key]];
					params[key].push(value);
				} else params[key] = value;
			}
			return params;
		}
		m.route.buildQueryString = buildQueryString;
		m.route.parseQueryString = parseQueryString;
	
		function reset(root) {
			var cacheKey = getCellCacheKey(root);
			clear(root.childNodes, cellCache[cacheKey]);
			cellCache[cacheKey] = undefined;
		}
	
		m.deferred = function () {
			var deferred = new Deferred();
			deferred.promise = propify(deferred.promise);
			return deferred;
		};
		function propify(promise, initialValue) {
			var prop = m.prop(initialValue);
			promise.then(prop);
			prop.then = function (resolve, reject) {
				return propify(promise.then(resolve, reject), initialValue);
			};
			return prop;
		}
		//Promiz.mithril.js | Zolmeister | MIT
		//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
		//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
		//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
		function Deferred(successCallback, failureCallback) {
			var RESOLVING = 1,
			    REJECTING = 2,
			    RESOLVED = 3,
			    REJECTED = 4;
			var self = this,
			    state = 0,
			    promiseValue = 0,
			    next = [];
	
			self["promise"] = {};
	
			self["resolve"] = function (value) {
				if (!state) {
					promiseValue = value;
					state = RESOLVING;
	
					fire();
				}
				return this;
			};
	
			self["reject"] = function (value) {
				if (!state) {
					promiseValue = value;
					state = REJECTING;
	
					fire();
				}
				return this;
			};
	
			self.promise["then"] = function (successCallback, failureCallback) {
				var deferred = new Deferred(successCallback, failureCallback);
				if (state === RESOLVED) {
					deferred.resolve(promiseValue);
				} else if (state === REJECTED) {
					deferred.reject(promiseValue);
				} else {
					next.push(deferred);
				}
				return deferred.promise;
			};
	
			function finish(type) {
				state = type || REJECTED;
				next.map(function (deferred) {
					state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue);
				});
			}
	
			function thennable(then, successCallback, failureCallback, notThennableCallback) {
				if ((promiseValue != null && type.call(promiseValue) === OBJECT || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
					try {
						// count protects against abuse calls from spec checker
						var count = 0;
						then.call(promiseValue, function (value) {
							if (count++) return;
							promiseValue = value;
							successCallback();
						}, function (value) {
							if (count++) return;
							promiseValue = value;
							failureCallback();
						});
					} catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						failureCallback();
					}
				} else {
					notThennableCallback();
				}
			}
	
			function fire() {
				var _again = true;
	
				_function: while (_again) {
					then = undefined;
					_again = false;
	
					// check if it's a thenable
					var then;
					try {
						then = promiseValue && promiseValue.then;
					} catch (e) {
						m.deferred.onerror(e);
						promiseValue = e;
						state = REJECTING;
						_again = true;
						continue _function;
					}
					thennable(then, function () {
						state = RESOLVING;
						fire();
					}, function () {
						state = REJECTING;
						fire();
					}, function () {
						try {
							if (state === RESOLVING && typeof successCallback === FUNCTION) {
								promiseValue = successCallback(promiseValue);
							} else if (state === REJECTING && typeof failureCallback === "function") {
								promiseValue = failureCallback(promiseValue);
								state = RESOLVING;
							}
						} catch (e) {
							m.deferred.onerror(e);
							promiseValue = e;
							return finish();
						}
	
						if (promiseValue === self) {
							promiseValue = TypeError();
							finish();
						} else {
							thennable(then, function () {
								finish(RESOLVED);
							}, finish, function () {
								finish(state === RESOLVING && RESOLVED);
							});
						}
					});
				}
			}
		}
		m.deferred.onerror = function (e) {
			if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e;
		};
	
		m.sync = function (args) {
			var method = "resolve";
			function synchronizer(pos, resolved) {
				return function (value) {
					results[pos] = value;
					if (!resolved) method = "reject";
					if (--outstanding === 0) {
						deferred.promise(results);
						deferred[method](results);
					}
					return value;
				};
			}
	
			var deferred = m.deferred();
			var outstanding = args.length;
			var results = new Array(outstanding);
			if (args.length > 0) {
				for (var i = 0; i < args.length; i++) {
					args[i].then(synchronizer(i, true), synchronizer(i, false));
				}
			} else deferred.resolve([]);
	
			return deferred.promise;
		};
		function identity(value) {
			return value;
		}
	
		function ajax(options) {
			if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
				var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + Math.round(Math.random() * 1e16).toString(36);
				var script = $document.createElement("script");
	
				window[callbackKey] = function (resp) {
					script.parentNode.removeChild(script);
					options.onload({
						type: "load",
						target: {
							responseText: resp
						}
					});
					window[callbackKey] = undefined;
				};
	
				script.onerror = function (e) {
					script.parentNode.removeChild(script);
	
					options.onerror({
						type: "error",
						target: {
							status: 500,
							responseText: JSON.stringify({ error: "Error making jsonp request" })
						}
					});
					window[callbackKey] = undefined;
	
					return false;
				};
	
				script.onload = function (e) {
					return false;
				};
	
				script.src = options.url + (options.url.indexOf("?") > 0 ? "&" : "?") + (options.callbackKey ? options.callbackKey : "callback") + "=" + callbackKey + "&" + buildQueryString(options.data || {});
				$document.body.appendChild(script);
			} else {
				var xhr = new window.XMLHttpRequest();
				xhr.open(options.method, options.url, true, options.user, options.password);
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status >= 200 && xhr.status < 300) options.onload({ type: "load", target: xhr });else options.onerror({ type: "error", target: xhr });
					}
				};
				if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				}
				if (options.deserialize === JSON.parse) {
					xhr.setRequestHeader("Accept", "application/json, text/*");
				}
				if (typeof options.config === FUNCTION) {
					var maybeXhr = options.config(xhr, options);
					if (maybeXhr != null) xhr = maybeXhr;
				}
	
				var data = options.method === "GET" || !options.data ? "" : options.data;
				if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
					throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
				}
				xhr.send(data);
				return xhr;
			}
		}
		function bindData(xhrOptions, data, serialize) {
			if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
				var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
				var querystring = buildQueryString(data);
				xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "");
			} else xhrOptions.data = serialize(data);
			return xhrOptions;
		}
		function parameterizeUrl(url, data) {
			var tokens = url.match(/:[a-z]\w+/gi);
			if (tokens && data) {
				for (var i = 0; i < tokens.length; i++) {
					var key = tokens[i].slice(1);
					url = url.replace(tokens[i], data[key]);
					delete data[key];
				}
			}
			return url;
		}
	
		m.request = function (xhrOptions) {
			if (xhrOptions.background !== true) m.startComputation();
			var deferred = new Deferred();
			var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
			var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
			var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
			var extract = isJSONP ? function (jsonp) {
				return jsonp.responseText;
			} : xhrOptions.extract || function (xhr) {
				return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText;
			};
			xhrOptions.method = (xhrOptions.method || "GET").toUpperCase();
			xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
			xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
			xhrOptions.onload = xhrOptions.onerror = function (e) {
				try {
					e = e || event;
					var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
					var response = unwrap(deserialize(extract(e.target, xhrOptions)), e.target);
					if (e.type === "load") {
						if (type.call(response) === ARRAY && xhrOptions.type) {
							for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i]);
						} else if (xhrOptions.type) response = new xhrOptions.type(response);
					}
					deferred[e.type === "load" ? "resolve" : "reject"](response);
				} catch (e) {
					m.deferred.onerror(e);
					deferred.reject(e);
				}
				if (xhrOptions.background !== true) m.endComputation();
			};
			ajax(xhrOptions);
			deferred.promise = propify(deferred.promise, xhrOptions.initialValue);
			return deferred.promise;
		};
	
		//testing API
		m.deps = function (mock) {
			initialize(window = mock || window);
			return window;
		};
		//for internal testing only, do not use `m.deps.factory`
		m.deps.factory = app;
	
		return m;
	})(typeof window != "undefined" ? window : {});
	
	if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;else if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
		return m;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(4);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	var _messageModal = __webpack_require__(5);
	
	var _messageModal2 = _interopRequireDefault(_messageModal);
	
	var _navPanel = __webpack_require__(6);
	
	var _navPanel2 = _interopRequireDefault(_navPanel);
	
	var _authenticate = __webpack_require__(7);
	
	var _authenticate2 = _interopRequireDefault(_authenticate);
	
	exports['default'] = {
	  controller: function controller() {
	    var posts = _mithril2['default'].request({
	      method: 'GET',
	      url: 'post.php',
	      deserialize: function deserialize(value) {
	        return JSON.parse(value);
	      },
	      data: {
	        comments: 10
	      }
	    });
	
	    function logout() {
	      $.post('logout.php');
	    }
	
	    return {
	      posts: posts
	    };
	  },
	  view: function view(ctrl) {
	    return [(0, _mithril2['default'])('header', [(0, _mithril2['default'])('nav.top-nav', [(0, _mithril2['default'])('h1.center-align', 'Stevens Compliments and Crushes')])]), (0, _mithril2['default'])('main.container', [(0, _mithril2['default'])('form.card-panel.hoverable', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('input[id=\'post-title\'][type=\'text\'][placeholder=\'Who are you complimenting?\']'), (0, _mithril2['default'])('label[for=\'post-title\']')]), (0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea\'][length=\'1000\']'), (0, _mithril2['default'])('label[for=\'post-textarea\']', 'Submit a post!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon\'][name=\'named\'][type=\'radio\'][value=\'0\']'), (0, _mithril2['default'])('label[for=\'post-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name\'][name=\'named\'][type=\'radio\'][value=\'1\']'), (0, _mithril2['default'])('label[for=\'post-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'submit\']', ['Post', (0, _mithril2['default'])('i.material-icons.right', 'message')])])])]), (0, _mithril2['default'])('ul', ctrl.posts().map(function (post, postPageIndex) {
	      return (0, _mithril2['default'])('li.submission.card-panel.hoverable', [(0, _mithril2['default'])('h3', post.for_name), (0, _mithril2['default'])('.vote.left', [(0, _mithril2['default'])('i.small.material-icons', 'thumb_up'), (0, _mithril2['default'])('br'), (0, _mithril2['default'])('.count.center-align', post.votes)]), (0, _mithril2['default'])('p.flow-text', [post.post, (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: function onclick() {
	          $('#message-modal').openModal();
	        } }, post.name)]), (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea-' + postPageIndex + '\'][length=\'1000\']'), (0, _mithril2['default'])('label[for=\'post-textarea-' + postPageIndex + '\']', 'Submit a comment')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon-' + postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'post-anon-' + postPageIndex + '\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name-' + postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'yes\']'), (0, _mithril2['default'])('label[for=\'post-name-' + postPageIndex + '\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'submit\']', ['Comment', (0, _mithril2['default'])('i.material-icons.right', 'chat_bubble')])])])]), (0, _mithril2['default'])('.comments-container', post.comments.map(function (comment) {
	        return (0, _mithril2['default'])('blockquote', [comment.comment, (0, _mithril2['default'])('br'), (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: function onclick() {
	            $('#message-modal').openModal();
	          } }, comment.name)]);
	      }))]);
	    }))]), (0, _mithril2['default'])('footer.page-footer', [(0, _mithril2['default'])('.footer-copyright', [(0, _mithril2['default'])('.center-align.valign', '© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens')])]), (0, _utilityLoginController2['default'])() ? _navPanel2['default'] : _authenticate2['default'], _messageModal2['default']];
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.check = check;
	exports.logout = logout;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var loggedIn = _mithril2['default'].prop(false);
	check();
	
	function check() {
	  _mithril2['default'].request({
	    method: 'GET',
	    dataType: 'json',
	    url: 'checkLogin.php'
	  }).then(function (data) {
	    return loggedIn(JSON.parse(data));
	  });
	  console.log(loggedIn());
	}
	
	;
	
	function logout() {
	  $.post('logout.php', check);
	}
	
	;
	
	exports['default'] = loggedIn;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	exports["default"] = {
	  view: function view(ctrl) {
	    return (0, _mithril2["default"])(".modal[id='message-modal']", [(0, _mithril2["default"])(".modal-content", [(0, _mithril2["default"])("h4", "Private Message"), (0, _mithril2["default"])("form", [(0, _mithril2["default"])(".input-field.message-to", [(0, _mithril2["default"])("input.validate[disabled=''][id='disabled'][type='text']"), (0, _mithril2["default"])("label[for='disabled']", "Recipient")]), (0, _mithril2["default"])(".input-field", [(0, _mithril2["default"])("textarea.materialize-textarea[id='message-textarea'][length='1000']"), (0, _mithril2["default"])("label[for='message-textarea']", "Send a private message!")]), (0, _mithril2["default"])(".row", [(0, _mithril2["default"])(".col.s12.m7", [(0, _mithril2["default"])("div", [(0, _mithril2["default"])("input[checked='checked'][id='message-anon'][name='named'][type='radio'][value='no']"), (0, _mithril2["default"])("label[for='message-anon']", "Submit anonymously")]), (0, _mithril2["default"])("div", [(0, _mithril2["default"])("input[id='message-name'][name='named'][type='radio'][value='yes']"), (0, _mithril2["default"])("label[for='message-name']", "Submit with name")])]), (0, _mithril2["default"])(".col.s12.m5", [(0, _mithril2["default"])("button.btn.waves-effect.waves-light[name='action'][type='submit']", ["Send ", (0, _mithril2["default"])("i.material-icons.right", "send")])])])])])]);
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(4);
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-box.z-depth-2', [(0, _mithril2['default'])('a', [(0, _mithril2['default'])('i.material-icons.side-icon', 'message')]), (0, _mithril2['default'])('a', { onclick: _utilityLoginController.logout }, [(0, _mithril2['default'])('i.material-icons.side-icon', 'power_settings_new')])]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _register = __webpack_require__(8);
	
	var _register2 = _interopRequireDefault(_register);
	
	var _utilityLoginController = __webpack_require__(4);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-module-container', [(0, _mithril2['default'])('.login-box.z-depth-2', { onclick: function onclick() {
	        $('#combo-modal').openModal();
	      } }, [(0, _mithril2['default'])('a', 'Log in / Register')]), (0, _mithril2['default'])('.modal[id=\'combo-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('p', 'Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don\'t Worry! All your information will be kept anonymous as long as you choose to keep it that way.')]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#login-modal').openModal();
	      } }, 'Log In'), (0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#register-modal').openModal();
	      } }, 'Register')])]), (0, _mithril2['default'])('.modal[id=\'login-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Log In'), (0, _mithril2['default'])('form.col.s12', [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'login-email\'][type=\'email\']'), (0, _mithril2['default'])('label[for=\'login-email\']', 'Email')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'login-password\'][type=\'password\']'), (0, _mithril2['default'])('label[for=\'login-password\']', 'Password')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', 'Log In')])]), _register2['default']]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(4);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	exports['default'] = {
	  controller: function controller() {
	    var name = _mithril2['default'].prop(''),
	        password = _mithril2['default'].prop(''),
	        passwordConfirmation = _mithril2['default'].prop(''),
	        email = _mithril2['default'].prop(''),
	        element = _mithril2['default'].prop();
	
	    function register() {
	      function nonJsonErrors(xhr) {
	        return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText;
	      }
	
	      if (password() !== passwordConfirmation()) {
	        alert('passwords do not match');
	      }
	
	      if (element().checkValidity()) {
	        $.ajax({
	          type: 'POST',
	          url: 'register.php',
	          dataType: 'json',
	          data: {
	            name: name(),
	            password: password(),
	            email: email()
	          },
	          success: _utilityLoginController.check
	        });
	      }
	    }
	
	    return {
	      name: name,
	      password: password,
	      passwordConfirmation: passwordConfirmation,
	      email: email,
	      register: register,
	      element: element
	    };
	  },
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.modal[id=\'register-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Register'), (0, _mithril2['default'])('form.col.s12', { config: ctrl.element }, [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'account_circle'), (0, _mithril2['default'])('input.validate[id=\'name\'][required=\'\'][pattern=.+ .+][type=\'text\']', { onchange: _mithril2['default'].withAttr('value', ctrl.name), value: ctrl.name() }), (0, _mithril2['default'])('label[for=\'name\']', 'Name')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'password\'][required=\'\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.password), value: ctrl.password() }), (0, _mithril2['default'])('label[for=\'password\']', 'Password')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'confirm-password\'][required=\'\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.passwordConfirmation), value: ctrl.passwordConfirmation() }), (0, _mithril2['default'])('label[for=\'confirm-password\']', 'Confirm Password')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'email\'][required=\'\'][type=\'email\']', { onchange: _mithril2['default'].withAttr('value', ctrl.email), value: ctrl.email() }), (0, _mithril2['default'])('label[for=\'email\']', 'Email')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', { onclick: ctrl.register }, 'Register')])]);
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWQ2MzU1MzE4ZGE1Mzc0OTdmOWIiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL34vd2VicGFjay9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9tYWluLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3V0aWxpdHkvbG9naW4tY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9tZXNzYWdlLW1vZGFsLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL25hdi1wYW5lbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9hdXRoZW50aWNhdGUuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvcmVnaXN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7b0NDdENjLENBQVM7Ozs7aUNBQ0QsQ0FBUTs7S0FBbEIsSUFBSTs7QUFFaEIsRUFBQyxDQUFFLFFBQVEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxZQUFNO0FBQ3hCLHdCQUFFLEtBQUssQ0FBQyxR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QUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUMsQ0FBQyxFQUN4SywwQkFBRSxpQ0FBK0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUN2RCxDQUFDLENBQ0gsQ0FBQyxFQUNGLDBCQUFFLE1BQU0sRUFBRSxDQUNSLDBCQUFFLHNCQUFzQixFQUFFLENBQ3hCLDBCQUFFLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxFQUNyQywwQkFBRSw2REFBdUQsRUFBRSxFQUFDLFFBQVEsRUFBRSxxQkFBRSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLENBQUMsRUFDNUgsMEJBQUUsc0JBQW9CLEVBQUUsT0FBTyxDQUFDLENBQ2pDLENBQUMsQ0FDSCxDQUFDLENBQ0gsQ0FBQyxDQUNILENBQUMsRUFDRiwwQkFBRSxlQUFlLEVBQUUsQ0FDakIsMEJBQUUsb0VBQW9FLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLFVBQVUsQ0FBQyxDQUM5RyxDQUFDLENBQ0gsQ0FBQyxDQUFDO0lBQ0o7RUFDRiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDlkNjM1NTMxOGRhNTM3NDk3ZjliXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgKiBhcyBtYWluIGZyb20gJy4vbWFpbic7XG5cbiQoIGRvY3VtZW50ICkucmVhZHkoKCkgPT4ge1xuICBtLnJvdXRlKGRvY3VtZW50LmJvZHksICcvJywge1xuICAgICcvJzogbWFpblxuICB9KTtcbn0pXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2luZGV4LmpzXG4gKiovIiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0dmFyIE9CSkVDVCA9IFwiW29iamVjdCBPYmplY3RdXCIsIEFSUkFZID0gXCJbb2JqZWN0IEFycmF5XVwiLCBTVFJJTkcgPSBcIltvYmplY3QgU3RyaW5nXVwiLCBGVU5DVElPTiA9IFwiZnVuY3Rpb25cIjtcclxuXHR2YXIgdHlwZSA9IHt9LnRvU3RyaW5nO1xyXG5cdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZywgYXR0clBhcnNlciA9IC9cXFsoLis/KSg/Oj0oXCJ8J3wpKC4qPylcXDIpP1xcXS87XHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IC9eKEFSRUF8QkFTRXxCUnxDT0x8Q09NTUFORHxFTUJFRHxIUnxJTUd8SU5QVVR8S0VZR0VOfExJTkt8TUVUQXxQQVJBTXxTT1VSQ0V8VFJBQ0t8V0JSKSQvO1xyXG5cdHZhciBub29wID0gZnVuY3Rpb24oKSB7fVxyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdC8vIHNlbGYgaW52b2tpbmcgZnVuY3Rpb24gbmVlZGVkIGJlY2F1c2Ugb2YgdGhlIHdheSBtb2NrcyB3b3JrXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSh3aW5kb3cpe1xyXG5cdFx0JGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cdFx0JGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG5cdFx0JGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblx0XHQkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUod2luZG93KTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEB0eXBlZGVmIHtTdHJpbmd9IFRhZ1xyXG5cdCAqIEEgc3RyaW5nIHRoYXQgbG9va3MgbGlrZSAtPiBkaXYuY2xhc3NuYW1lI2lkW3BhcmFtPW9uZV1bcGFyYW0yPXR3b11cclxuXHQgKiBXaGljaCBkZXNjcmliZXMgYSBET00gbm9kZVxyXG5cdCAqL1xyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7VGFnfSBUaGUgRE9NIG5vZGUgdGFnXHJcblx0ICogQHBhcmFtIHtPYmplY3Q9W119IG9wdGlvbmFsIGtleS12YWx1ZSBwYWlycyB0byBiZSBtYXBwZWQgdG8gRE9NIGF0dHJzXHJcblx0ICogQHBhcmFtIHsuLi5tTm9kZT1bXX0gWmVybyBvciBtb3JlIE1pdGhyaWwgY2hpbGQgbm9kZXMuIENhbiBiZSBhbiBhcnJheSwgb3Igc3BsYXQgKG9wdGlvbmFsKVxyXG5cdCAqXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gbSgpIHtcclxuXHRcdHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdFx0dmFyIGhhc0F0dHJzID0gYXJnc1sxXSAhPSBudWxsICYmIHR5cGUuY2FsbChhcmdzWzFdKSA9PT0gT0JKRUNUICYmICEoXCJ0YWdcIiBpbiBhcmdzWzFdIHx8IFwidmlld1wiIGluIGFyZ3NbMV0pICYmICEoXCJzdWJ0cmVlXCIgaW4gYXJnc1sxXSk7XHJcblx0XHR2YXIgYXR0cnMgPSBoYXNBdHRycyA/IGFyZ3NbMV0gOiB7fTtcclxuXHRcdHZhciBjbGFzc0F0dHJOYW1lID0gXCJjbGFzc1wiIGluIGF0dHJzID8gXCJjbGFzc1wiIDogXCJjbGFzc05hbWVcIjtcclxuXHRcdHZhciBjZWxsID0ge3RhZzogXCJkaXZcIiwgYXR0cnM6IHt9fTtcclxuXHRcdHZhciBtYXRjaCwgY2xhc3NlcyA9IFtdO1xyXG5cdFx0aWYgKHR5cGUuY2FsbChhcmdzWzBdKSAhPSBTVFJJTkcpIHRocm93IG5ldyBFcnJvcihcInNlbGVjdG9yIGluIG0oc2VsZWN0b3IsIGF0dHJzLCBjaGlsZHJlbikgc2hvdWxkIGJlIGEgc3RyaW5nXCIpXHJcblx0XHR3aGlsZSAobWF0Y2ggPSBwYXJzZXIuZXhlYyhhcmdzWzBdKSkge1xyXG5cdFx0XHRpZiAobWF0Y2hbMV0gPT09IFwiXCIgJiYgbWF0Y2hbMl0pIGNlbGwudGFnID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIiNcIikgY2VsbC5hdHRycy5pZCA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIuXCIpIGNsYXNzZXMucHVzaChtYXRjaFsyXSk7XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzNdWzBdID09PSBcIltcIikge1xyXG5cdFx0XHRcdHZhciBwYWlyID0gYXR0clBhcnNlci5leGVjKG1hdGNoWzNdKTtcclxuXHRcdFx0XHRjZWxsLmF0dHJzW3BhaXJbMV1dID0gcGFpclszXSB8fCAocGFpclsyXSA/IFwiXCIgOnRydWUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hpbGRyZW4gPSBoYXNBdHRycyA/IGFyZ3Muc2xpY2UoMikgOiBhcmdzLnNsaWNlKDEpO1xyXG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSAmJiB0eXBlLmNhbGwoY2hpbGRyZW5bMF0pID09PSBBUlJBWSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5bMF1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuXHRcdFx0aWYgKGF0dHJzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkge1xyXG5cdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gY2xhc3NBdHRyTmFtZSAmJiBhdHRyc1thdHRyTmFtZV0gIT0gbnVsbCAmJiBhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChhdHRyc1thdHRyTmFtZV0pXHJcblx0XHRcdFx0XHRjZWxsLmF0dHJzW2F0dHJOYW1lXSA9IFwiXCIgLy9jcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgY2VsbC5hdHRyc1thdHRyTmFtZV0gPSBhdHRyc1thdHRyTmFtZV1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGNsYXNzZXMubGVuZ3RoID4gMCkgY2VsbC5hdHRyc1tjbGFzc0F0dHJOYW1lXSA9IGNsYXNzZXMuam9pbihcIiBcIik7XHJcblx0XHRcclxuXHRcdHJldHVybiBjZWxsXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgcGFyZW50Q2FjaGUsIHBhcmVudEluZGV4LCBkYXRhLCBjYWNoZWQsIHNob3VsZFJlYXR0YWNoLCBpbmRleCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykge1xyXG5cdFx0Ly9gYnVpbGRgIGlzIGEgcmVjdXJzaXZlIGZ1bmN0aW9uIHRoYXQgbWFuYWdlcyBjcmVhdGlvbi9kaWZmaW5nL3JlbW92YWwgb2YgRE9NIGVsZW1lbnRzIGJhc2VkIG9uIGNvbXBhcmlzb24gYmV0d2VlbiBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvL3RoZSBkaWZmIGFsZ29yaXRobSBjYW4gYmUgc3VtbWFyaXplZCBhcyB0aGlzOlxyXG5cdFx0Ly8xIC0gY29tcGFyZSBgZGF0YWAgYW5kIGBjYWNoZWRgXHJcblx0XHQvLzIgLSBpZiB0aGV5IGFyZSBkaWZmZXJlbnQsIGNvcHkgYGRhdGFgIHRvIGBjYWNoZWRgIGFuZCB1cGRhdGUgdGhlIERPTSBiYXNlZCBvbiB3aGF0IHRoZSBkaWZmZXJlbmNlIGlzXHJcblx0XHQvLzMgLSByZWN1cnNpdmVseSBhcHBseSB0aGlzIGFsZ29yaXRobSBmb3IgZXZlcnkgYXJyYXkgYW5kIGZvciB0aGUgY2hpbGRyZW4gb2YgZXZlcnkgdmlydHVhbCBlbGVtZW50XHJcblxyXG5cdFx0Ly90aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgaXMgZXNzZW50aWFsbHkgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzIHJlZHJhdydzIGBkYXRhYCBkYXRhIHN0cnVjdHVyZSwgd2l0aCBhIGZldyBhZGRpdGlvbnM6XHJcblx0XHQvLy0gYGNhY2hlZGAgYWx3YXlzIGhhcyBhIHByb3BlcnR5IGNhbGxlZCBgbm9kZXNgLCB3aGljaCBpcyBhIGxpc3Qgb2YgRE9NIGVsZW1lbnRzIHRoYXQgY29ycmVzcG9uZCB0byB0aGUgZGF0YSByZXByZXNlbnRlZCBieSB0aGUgcmVzcGVjdGl2ZSB2aXJ0dWFsIGVsZW1lbnRcclxuXHRcdC8vLSBpbiBvcmRlciB0byBzdXBwb3J0IGF0dGFjaGluZyBgbm9kZXNgIGFzIGEgcHJvcGVydHkgb2YgYGNhY2hlZGAsIGBjYWNoZWRgIGlzICphbHdheXMqIGEgbm9uLXByaW1pdGl2ZSBvYmplY3QsIGkuZS4gaWYgdGhlIGRhdGEgd2FzIGEgc3RyaW5nLCB0aGVuIGNhY2hlZCBpcyBhIFN0cmluZyBpbnN0YW5jZS4gSWYgZGF0YSB3YXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLCBjYWNoZWQgaXMgYG5ldyBTdHJpbmcoXCJcIilgXHJcblx0XHQvLy0gYGNhY2hlZCBhbHNvIGhhcyBhIGBjb25maWdDb250ZXh0YCBwcm9wZXJ0eSwgd2hpY2ggaXMgdGhlIHN0YXRlIHN0b3JhZ2Ugb2JqZWN0IGV4cG9zZWQgYnkgY29uZmlnKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQpXHJcblx0XHQvLy0gd2hlbiBgY2FjaGVkYCBpcyBhbiBPYmplY3QsIGl0IHJlcHJlc2VudHMgYSB2aXJ0dWFsIGVsZW1lbnQ7IHdoZW4gaXQncyBhbiBBcnJheSwgaXQgcmVwcmVzZW50cyBhIGxpc3Qgb2YgZWxlbWVudHM7IHdoZW4gaXQncyBhIFN0cmluZywgTnVtYmVyIG9yIEJvb2xlYW4sIGl0IHJlcHJlc2VudHMgYSB0ZXh0IG5vZGVcclxuXHJcblx0XHQvL2BwYXJlbnRFbGVtZW50YCBpcyBhIERPTSBlbGVtZW50IHVzZWQgZm9yIFczQyBET00gQVBJIGNhbGxzXHJcblx0XHQvL2BwYXJlbnRUYWdgIGlzIG9ubHkgdXNlZCBmb3IgaGFuZGxpbmcgYSBjb3JuZXIgY2FzZSBmb3IgdGV4dGFyZWEgdmFsdWVzXHJcblx0XHQvL2BwYXJlbnRDYWNoZWAgaXMgdXNlZCB0byByZW1vdmUgbm9kZXMgaW4gc29tZSBtdWx0aS1ub2RlIGNhc2VzXHJcblx0XHQvL2BwYXJlbnRJbmRleGAgYW5kIGBpbmRleGAgYXJlIHVzZWQgdG8gZmlndXJlIG91dCB0aGUgb2Zmc2V0IG9mIG5vZGVzLiBUaGV5J3JlIGFydGlmYWN0cyBmcm9tIGJlZm9yZSBhcnJheXMgc3RhcnRlZCBiZWluZyBmbGF0dGVuZWQgYW5kIGFyZSBsaWtlbHkgcmVmYWN0b3JhYmxlXHJcblx0XHQvL2BkYXRhYCBhbmQgYGNhY2hlZGAgYXJlLCByZXNwZWN0aXZlbHksIHRoZSBuZXcgYW5kIG9sZCBub2RlcyBiZWluZyBkaWZmZWRcclxuXHRcdC8vYHNob3VsZFJlYXR0YWNoYCBpcyBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIGEgcGFyZW50IG5vZGUgd2FzIHJlY3JlYXRlZCAoaWYgc28sIGFuZCBpZiB0aGlzIG5vZGUgaXMgcmV1c2VkLCB0aGVuIHRoaXMgbm9kZSBtdXN0IHJlYXR0YWNoIGl0c2VsZiB0byB0aGUgbmV3IHBhcmVudClcclxuXHRcdC8vYGVkaXRhYmxlYCBpcyBhIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBhbiBhbmNlc3RvciBpcyBjb250ZW50ZWRpdGFibGVcclxuXHRcdC8vYG5hbWVzcGFjZWAgaW5kaWNhdGVzIHRoZSBjbG9zZXN0IEhUTUwgbmFtZXNwYWNlIGFzIGl0IGNhc2NhZGVzIGRvd24gZnJvbSBhbiBhbmNlc3RvclxyXG5cdFx0Ly9gY29uZmlnc2AgaXMgYSBsaXN0IG9mIGNvbmZpZyBmdW5jdGlvbnMgdG8gcnVuIGFmdGVyIHRoZSB0b3Btb3N0IGBidWlsZGAgY2FsbCBmaW5pc2hlcyBydW5uaW5nXHJcblxyXG5cdFx0Ly90aGVyZSdzIGxvZ2ljIHRoYXQgcmVsaWVzIG9uIHRoZSBhc3N1bXB0aW9uIHRoYXQgbnVsbCBhbmQgdW5kZWZpbmVkIGRhdGEgYXJlIGVxdWl2YWxlbnQgdG8gZW1wdHkgc3RyaW5nc1xyXG5cdFx0Ly8tIHRoaXMgcHJldmVudHMgbGlmZWN5Y2xlIHN1cnByaXNlcyBmcm9tIHByb2NlZHVyYWwgaGVscGVycyB0aGF0IG1peCBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy4gZnVuY3Rpb24gZm9vKCkge2lmIChjb25kKSByZXR1cm4gbShcImRpdlwiKX1cclxuXHRcdC8vLSBpdCBzaW1wbGlmaWVzIGRpZmZpbmcgY29kZVxyXG5cdFx0Ly9kYXRhLnRvU3RyaW5nKCkgbWlnaHQgdGhyb3cgb3IgcmV0dXJuIG51bGwgaWYgZGF0YSBpcyB0aGUgcmV0dXJuIHZhbHVlIG9mIENvbnNvbGUubG9nIGluIEZpcmVmb3ggKGJlaGF2aW9yIGRlcGVuZHMgb24gdmVyc2lvbilcclxuXHRcdHRyeSB7aWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhLnRvU3RyaW5nKCkgPT0gbnVsbCkgZGF0YSA9IFwiXCI7fSBjYXRjaCAoZSkge2RhdGEgPSBcIlwifVxyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdHZhciBjYWNoZWRUeXBlID0gdHlwZS5jYWxsKGNhY2hlZCksIGRhdGFUeXBlID0gdHlwZS5jYWxsKGRhdGEpO1xyXG5cdFx0aWYgKGNhY2hlZCA9PSBudWxsIHx8IGNhY2hlZFR5cGUgIT09IGRhdGFUeXBlKSB7XHJcblx0XHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChwYXJlbnRDYWNoZSAmJiBwYXJlbnRDYWNoZS5ub2Rlcykge1xyXG5cdFx0XHRcdFx0dmFyIG9mZnNldCA9IGluZGV4IC0gcGFyZW50SW5kZXg7XHJcblx0XHRcdFx0XHR2YXIgZW5kID0gb2Zmc2V0ICsgKGRhdGFUeXBlID09PSBBUlJBWSA/IGRhdGEgOiBjYWNoZWQubm9kZXMpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGNsZWFyKHBhcmVudENhY2hlLm5vZGVzLnNsaWNlKG9mZnNldCwgZW5kKSwgcGFyZW50Q2FjaGUuc2xpY2Uob2Zmc2V0LCBlbmQpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChjYWNoZWQubm9kZXMpIGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yO1xyXG5cdFx0XHRpZiAoY2FjaGVkLnRhZykgY2FjaGVkID0ge307IC8vaWYgY29uc3RydWN0b3IgY3JlYXRlcyBhIHZpcnR1YWwgZG9tIGVsZW1lbnQsIHVzZSBhIGJsYW5rIG9iamVjdCBhcyB0aGUgYmFzZSBjYWNoZWQgbm9kZSBpbnN0ZWFkIG9mIGNvcHlpbmcgdGhlIHZpcnR1YWwgZWwgKCMyNzcpXHJcblx0XHRcdGNhY2hlZC5ub2RlcyA9IFtdXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGFUeXBlID09PSBBUlJBWSkge1xyXG5cdFx0XHQvL3JlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZS5jYWxsKGRhdGFbaV0pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdFx0ZGF0YSA9IGRhdGEuY29uY2F0LmFwcGx5KFtdLCBkYXRhKTtcclxuXHRcdFx0XHRcdGktLSAvL2NoZWNrIGN1cnJlbnQgaW5kZXggYWdhaW4gYW5kIGZsYXR0ZW4gdW50aWwgdGhlcmUgYXJlIG5vIG1vcmUgbmVzdGVkIGFycmF5cyBhdCB0aGF0IGluZGV4XHJcblx0XHRcdFx0XHRsZW4gPSBkYXRhLmxlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHRcdC8va2V5cyBhbGdvcml0aG06IHNvcnQgZWxlbWVudHMgd2l0aG91dCByZWNyZWF0aW5nIHRoZW0gaWYga2V5cyBhcmUgcHJlc2VudFxyXG5cdFx0XHQvLzEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdFx0Ly8zKSBpZiBrZXkgZXhpc3RzIGluIG5ldyBsaXN0LCBjaGFuZ2UgYWN0aW9uIGZyb20gZGVsZXRpb24gdG8gYSBtb3ZlXHJcblx0XHRcdC8vNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpbiBwcmV2aW91cyBzdGVwc1xyXG5cdFx0XHR2YXIgREVMRVRJT04gPSAxLCBJTlNFUlRJT04gPSAyICwgTU9WRSA9IDM7XHJcblx0XHRcdHZhciBleGlzdGluZyA9IHt9LCBzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSBmYWxzZTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYWNoZWQubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldICYmIGNhY2hlZFtpXS5hdHRycyAmJiBjYWNoZWRbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IHRydWU7XHJcblx0XHRcdFx0XHRleGlzdGluZ1tjYWNoZWRbaV0uYXR0cnMua2V5XSA9IHthY3Rpb246IERFTEVUSU9OLCBpbmRleDogaX1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBndWlkID0gMFxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGlmIChkYXRhW2ldICYmIGRhdGFbaV0uYXR0cnMgJiYgZGF0YVtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbal0gJiYgZGF0YVtqXS5hdHRycyAmJiBkYXRhW2pdLmF0dHJzLmtleSA9PSBudWxsKSBkYXRhW2pdLmF0dHJzLmtleSA9IFwiX19taXRocmlsX19cIiArIGd1aWQrK1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChzaG91bGRNYWludGFpbklkZW50aXRpZXMpIHtcclxuXHRcdFx0XHR2YXIga2V5c0RpZmZlciA9IGZhbHNlXHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoICE9IGNhY2hlZC5sZW5ndGgpIGtleXNEaWZmZXIgPSB0cnVlXHJcblx0XHRcdFx0ZWxzZSBmb3IgKHZhciBpID0gMCwgY2FjaGVkQ2VsbCwgZGF0YUNlbGw7IGNhY2hlZENlbGwgPSBjYWNoZWRbaV0sIGRhdGFDZWxsID0gZGF0YVtpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkQ2VsbC5hdHRycyAmJiBkYXRhQ2VsbC5hdHRycyAmJiBjYWNoZWRDZWxsLmF0dHJzLmtleSAhPSBkYXRhQ2VsbC5hdHRycy5rZXkpIHtcclxuXHRcdFx0XHRcdFx0a2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGtleXNEaWZmZXIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2ldICYmIGRhdGFbaV0uYXR0cnMpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGtleSA9IGRhdGFbaV0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCFleGlzdGluZ1trZXldKSBleGlzdGluZ1trZXldID0ge2FjdGlvbjogSU5TRVJUSU9OLCBpbmRleDogaX07XHJcblx0XHRcdFx0XHRcdFx0XHRlbHNlIGV4aXN0aW5nW2tleV0gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGFjdGlvbjogTU9WRSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGZyb206IGV4aXN0aW5nW2tleV0uaW5kZXgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQ6IGNhY2hlZC5ub2Rlc1tleGlzdGluZ1trZXldLmluZGV4XSB8fCAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGFjdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKVxyXG5cdFx0XHRcdFx0dmFyIGNoYW5nZXMgPSBhY3Rpb25zLnNvcnQoc29ydENoYW5nZXMpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0NhY2hlZCA9IG5ldyBBcnJheShjYWNoZWQubGVuZ3RoKVxyXG5cdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzID0gY2FjaGVkLm5vZGVzLnNsaWNlKClcclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hhbmdlOyBjaGFuZ2UgPSBjaGFuZ2VzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXIoY2FjaGVkW2NoYW5nZS5pbmRleF0ubm9kZXMsIGNhY2hlZFtjaGFuZ2UuaW5kZXhdKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gSU5TRVJUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGR1bW15ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRcdFx0XHRcdFx0ZHVtbXkua2V5ID0gZGF0YVtjaGFuZ2UuaW5kZXhdLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShkdW1teSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDAsIHthdHRyczoge2tleTogZGF0YVtjaGFuZ2UuaW5kZXhdLmF0dHJzLmtleX0sIG5vZGVzOiBbZHVtbXldfSlcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGR1bW15XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBNT1ZFKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdICE9PSBjaGFuZ2UuZWxlbWVudCAmJiBjaGFuZ2UuZWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlLmVsZW1lbnQsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZFtjaGFuZ2UuaW5kZXhdID0gY2FjaGVkW2NoYW5nZS5mcm9tXVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tjaGFuZ2UuaW5kZXhdID0gY2hhbmdlLmVsZW1lbnRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FjaGVkID0gbmV3Q2FjaGVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL2VuZCBrZXkgYWxnb3JpdGhtXHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgY2FjaGVDb3VudCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHQvL2RpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHRcdHZhciBpdGVtID0gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBjYWNoZWQsIGluZGV4LCBkYXRhW2ldLCBjYWNoZWRbY2FjaGVDb3VudF0sIHNob3VsZFJlYXR0YWNoLCBpbmRleCArIHN1YkFycmF5Q291bnQgfHwgc3ViQXJyYXlDb3VudCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKCFpdGVtLm5vZGVzLmludGFjdCkgaW50YWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGl0ZW0uJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdC8vZml4IG9mZnNldCBvZiBuZXh0IGVsZW1lbnQgaWYgaXRlbSB3YXMgYSB0cnVzdGVkIHN0cmluZyB3LyBtb3JlIHRoYW4gb25lIGh0bWwgZWxlbWVudFxyXG5cdFx0XHRcdFx0Ly90aGUgZmlyc3QgY2xhdXNlIGluIHRoZSByZWdleHAgbWF0Y2hlcyBlbGVtZW50c1xyXG5cdFx0XHRcdFx0Ly90aGUgc2Vjb25kIGNsYXVzZSAoYWZ0ZXIgdGhlIHBpcGUpIG1hdGNoZXMgdGV4dCBub2Rlc1xyXG5cdFx0XHRcdFx0c3ViQXJyYXlDb3VudCArPSAoaXRlbS5tYXRjaCgvPFteXFwvXXxcXD5cXHMqW148XS9nKSB8fCBbMF0pLmxlbmd0aFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHN1YkFycmF5Q291bnQgKz0gdHlwZS5jYWxsKGl0ZW0pID09PSBBUlJBWSA/IGl0ZW0ubGVuZ3RoIDogMTtcclxuXHRcdFx0XHRjYWNoZWRbY2FjaGVDb3VudCsrXSA9IGl0ZW1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWludGFjdCkge1xyXG5cdFx0XHRcdC8vZGlmZiB0aGUgYXJyYXkgaXRzZWxmXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly91cGRhdGUgdGhlIGxpc3Qgb2YgRE9NIG5vZGVzIGJ5IGNvbGxlY3RpbmcgdGhlIG5vZGVzIGZyb20gZWFjaCBpdGVtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRbaV0gIT0gbnVsbCkgbm9kZXMucHVzaC5hcHBseShub2RlcywgY2FjaGVkW2ldLm5vZGVzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3JlbW92ZSBpdGVtcyBmcm9tIHRoZSBlbmQgb2YgdGhlIGFycmF5IGlmIHRoZSBuZXcgYXJyYXkgaXMgc2hvcnRlciB0aGFuIHRoZSBvbGQgb25lXHJcblx0XHRcdFx0Ly9pZiBlcnJvcnMgZXZlciBoYXBwZW4gaGVyZSwgdGhlIGlzc3VlIGlzIG1vc3QgbGlrZWx5IGEgYnVnIGluIHRoZSBjb25zdHJ1Y3Rpb24gb2YgdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIHNvbWV3aGVyZSBlYXJsaWVyIGluIHRoZSBwcm9ncmFtXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG5vZGU7IG5vZGUgPSBjYWNoZWQubm9kZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKG5vZGUucGFyZW50Tm9kZSAhPSBudWxsICYmIG5vZGVzLmluZGV4T2Yobm9kZSkgPCAwKSBjbGVhcihbbm9kZV0sIFtjYWNoZWRbaV1dKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggPCBjYWNoZWQubGVuZ3RoKSBjYWNoZWQubGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAoZGF0YSAhPSBudWxsICYmIGRhdGFUeXBlID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0dmFyIHZpZXdzID0gW10sIGNvbnRyb2xsZXJzID0gW11cclxuXHRcdFx0d2hpbGUgKGRhdGEudmlldykge1xyXG5cdFx0XHRcdHZhciB2aWV3ID0gZGF0YS52aWV3LiRvcmlnaW5hbCB8fCBkYXRhLnZpZXdcclxuXHRcdFx0XHR2YXIgY29udHJvbGxlckluZGV4ID0gbS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImRpZmZcIiAmJiBjYWNoZWQudmlld3MgPyBjYWNoZWQudmlld3MuaW5kZXhPZih2aWV3KSA6IC0xXHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBjb250cm9sbGVySW5kZXggPiAtMSA/IGNhY2hlZC5jb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdIDogbmV3IChkYXRhLmNvbnRyb2xsZXIgfHwgbm9vcClcclxuXHRcdFx0XHR2YXIga2V5ID0gZGF0YSAmJiBkYXRhLmF0dHJzICYmIGRhdGEuYXR0cnMua2V5XHJcblx0XHRcdFx0ZGF0YSA9IHBlbmRpbmdSZXF1ZXN0cyA9PSAwIHx8IChjYWNoZWQgJiYgY2FjaGVkLmNvbnRyb2xsZXJzICYmIGNhY2hlZC5jb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTEpID8gZGF0YS52aWV3KGNvbnRyb2xsZXIpIDoge3RhZzogXCJwbGFjZWhvbGRlclwifVxyXG5cdFx0XHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHRcdFx0aWYgKGtleSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge31cclxuXHRcdFx0XHRcdGRhdGEuYXR0cnMua2V5ID0ga2V5XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkKSB1bmxvYWRlcnMucHVzaCh7Y29udHJvbGxlcjogY29udHJvbGxlciwgaGFuZGxlcjogY29udHJvbGxlci5vbnVubG9hZH0pXHJcblx0XHRcdFx0dmlld3MucHVzaCh2aWV3KVxyXG5cdFx0XHRcdGNvbnRyb2xsZXJzLnB1c2goY29udHJvbGxlcilcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWRhdGEudGFnICYmIGNvbnRyb2xsZXJzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKFwiQ29tcG9uZW50IHRlbXBsYXRlIG11c3QgcmV0dXJuIGEgdmlydHVhbCBlbGVtZW50LCBub3QgYW4gYXJyYXksIHN0cmluZywgZXRjLlwiKVxyXG5cdFx0XHRpZiAoIWRhdGEuYXR0cnMpIGRhdGEuYXR0cnMgPSB7fTtcclxuXHRcdFx0aWYgKCFjYWNoZWQuYXR0cnMpIGNhY2hlZC5hdHRycyA9IHt9O1xyXG5cclxuXHRcdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpXHJcblx0XHRcdHZhciBoYXNLZXlzID0gZGF0YUF0dHJLZXlzLmxlbmd0aCA+IChcImtleVwiIGluIGRhdGEuYXR0cnMgPyAxIDogMClcclxuXHRcdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0XHRpZiAoZGF0YS50YWcgIT0gY2FjaGVkLnRhZyB8fCBkYXRhQXR0cktleXMuc29ydCgpLmpvaW4oKSAhPSBPYmplY3Qua2V5cyhjYWNoZWQuYXR0cnMpLnNvcnQoKS5qb2luKCkgfHwgZGF0YS5hdHRycy5pZCAhPSBjYWNoZWQuYXR0cnMuaWQgfHwgZGF0YS5hdHRycy5rZXkgIT0gY2FjaGVkLmF0dHJzLmtleSB8fCAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImFsbFwiICYmICghY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluICE9PSB0cnVlKSkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluID09PSBmYWxzZSkpIHtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCkgY2xlYXIoY2FjaGVkLm5vZGVzKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKVxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBjb250cm9sbGVyLm9udW5sb2FkID09PSBGVU5DVElPTikgY29udHJvbGxlci5vbnVubG9hZCh7cHJldmVudERlZmF1bHQ6IG5vb3B9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGRhdGEudGFnKSAhPSBTVFJJTkcpIHJldHVybjtcclxuXHJcblx0XHRcdHZhciBub2RlLCBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRcdGlmIChkYXRhLmF0dHJzLnhtbG5zKSBuYW1lc3BhY2UgPSBkYXRhLmF0dHJzLnhtbG5zO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJtYXRoXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGlzTmV3KSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuYXR0cnMuaXMpIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZywgZGF0YS5hdHRycy5pcyk7XHJcblx0XHRcdFx0ZWxzZSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcpO1xyXG5cdFx0XHRcdGNhY2hlZCA9IHtcclxuXHRcdFx0XHRcdHRhZzogZGF0YS50YWcsXHJcblx0XHRcdFx0XHQvL3NldCBhdHRyaWJ1dGVzIGZpcnN0LCB0aGVuIGNyZWF0ZSBjaGlsZHJlblxyXG5cdFx0XHRcdFx0YXR0cnM6IGhhc0tleXMgPyBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCB7fSwgbmFtZXNwYWNlKSA6IGRhdGEuYXR0cnMsXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogZGF0YS5jaGlsZHJlbiAhPSBudWxsICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCA/XHJcblx0XHRcdFx0XHRcdGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCB0cnVlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSA6XHJcblx0XHRcdFx0XHRcdGRhdGEuY2hpbGRyZW4sXHJcblx0XHRcdFx0XHRub2RlczogW25vZGVdXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCAmJiBjb250cm9sbGVyLm9udW5sb2FkLiRvbGQpIGNvbnRyb2xsZXIub251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkLiRvbGRcclxuXHRcdFx0XHRcdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyAmJiBjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIG9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQgPSBub29wXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWRcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuICYmICFjYWNoZWQuY2hpbGRyZW4ubm9kZXMpIGNhY2hlZC5jaGlsZHJlbi5ub2RlcyA9IFtdO1xyXG5cdFx0XHRcdC8vZWRnZSBjYXNlOiBzZXR0aW5nIHZhbHVlIG9uIDxzZWxlY3Q+IGRvZXNuJ3Qgd29yayBiZWZvcmUgY2hpbGRyZW4gZXhpc3QsIHNvIHNldCBpdCBhZ2FpbiBhZnRlciBjaGlsZHJlbiBoYXZlIGJlZW4gY3JlYXRlZFxyXG5cdFx0XHRcdGlmIChkYXRhLnRhZyA9PT0gXCJzZWxlY3RcIiAmJiBcInZhbHVlXCIgaW4gZGF0YS5hdHRycykgc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywge3ZhbHVlOiBkYXRhLmF0dHJzLnZhbHVlfSwge30sIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5vZGUgPSBjYWNoZWQubm9kZXNbMF07XHJcblx0XHRcdFx0aWYgKGhhc0tleXMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIGNhY2hlZC5hdHRycywgbmFtZXNwYWNlKTtcclxuXHRcdFx0XHRjYWNoZWQuY2hpbGRyZW4gPSBidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgZmFsc2UsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVycy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzXHJcblx0XHRcdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoc2hvdWxkUmVhdHRhY2ggPT09IHRydWUgJiYgbm9kZSAhPSBudWxsKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0Ly9zY2hlZHVsZSBjb25maWdzIHRvIGJlIGNhbGxlZC4gVGhleSBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGAgZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0XHRpZiAodHlwZW9mIGRhdGEuYXR0cnNbXCJjb25maWdcIl0gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dmFyIGNvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0IHx8IHt9O1xyXG5cclxuXHRcdFx0XHQvLyBiaW5kXHJcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSwgYXJncykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YS5hdHRyc1tcImNvbmZpZ1wiXS5hcHBseShkYXRhLCBhcmdzKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y29uZmlncy5wdXNoKGNhbGxiYWNrKGRhdGEsIFtub2RlLCAhaXNOZXcsIGNvbnRleHQsIGNhY2hlZF0pKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YSAhPSBGVU5DVElPTikge1xyXG5cdFx0XHQvL2hhbmRsZSB0ZXh0IG5vZGVzXHJcblx0XHRcdHZhciBub2RlcztcclxuXHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV07XHJcblx0XHRcdFx0XHRpZiAoIXBhcmVudEVsZW1lbnQubm9kZU5hbWUubWF0Y2godm9pZEVsZW1lbnRzKSkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FjaGVkID0gXCJzdHJpbmcgbnVtYmVyIGJvb2xlYW5cIi5pbmRleE9mKHR5cGVvZiBkYXRhKSA+IC0xID8gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSkgOiBkYXRhO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLnZhbHVlT2YoKSAhPT0gZGF0YS52YWx1ZU9mKCkgfHwgc2hvdWxkUmVhdHRhY2ggPT09IHRydWUpIHtcclxuXHRcdFx0XHRub2RlcyA9IGNhY2hlZC5ub2RlcztcclxuXHRcdFx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0Y2xlYXIobm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2Nvcm5lciBjYXNlOiByZXBsYWNpbmcgdGhlIG5vZGVWYWx1ZSBvZiBhIHRleHQgbm9kZSB0aGF0IGlzIGEgY2hpbGQgb2YgYSB0ZXh0YXJlYS9jb250ZW50ZWRpdGFibGUgZG9lc24ndCB3b3JrXHJcblx0XHRcdFx0XHRcdC8vd2UgbmVlZCB0byB1cGRhdGUgdGhlIHZhbHVlIHByb3BlcnR5IG9mIHRoZSBwYXJlbnQgdGV4dGFyZWEgb3IgdGhlIGlubmVySFRNTCBvZiB0aGUgY29udGVudGVkaXRhYmxlIGVsZW1lbnQgaW5zdGVhZFxyXG5cdFx0XHRcdFx0XHRpZiAocGFyZW50VGFnID09PSBcInRleHRhcmVhXCIpIHBhcmVudEVsZW1lbnQudmFsdWUgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChlZGl0YWJsZSkgZWRpdGFibGUuaW5uZXJIVE1MID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKG5vZGVzWzBdLm5vZGVUeXBlID09PSAxIHx8IG5vZGVzLmxlbmd0aCA+IDEpIHsgLy93YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2Rlc1swXSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRub2Rlc1swXS5ub2RlVmFsdWUgPSBkYXRhXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSk7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHRmdW5jdGlvbiBzb3J0Q2hhbmdlcyhhLCBiKSB7cmV0dXJuIGEuYWN0aW9uIC0gYi5hY3Rpb24gfHwgYS5pbmRleCAtIGIuaW5kZXh9XHJcblx0ZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhub2RlLCB0YWcsIGRhdGFBdHRycywgY2FjaGVkQXR0cnMsIG5hbWVzcGFjZSkge1xyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gZGF0YUF0dHJzKSB7XHJcblx0XHRcdHZhciBkYXRhQXR0ciA9IGRhdGFBdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdHZhciBjYWNoZWRBdHRyID0gY2FjaGVkQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHRpZiAoIShhdHRyTmFtZSBpbiBjYWNoZWRBdHRycykgfHwgKGNhY2hlZEF0dHIgIT09IGRhdGFBdHRyKSkge1xyXG5cdFx0XHRcdGNhY2hlZEF0dHJzW2F0dHJOYW1lXSA9IGRhdGFBdHRyO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvL2Bjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGVzLCBzbyBpZ25vcmUgaXRcclxuXHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJjb25maWdcIiB8fCBhdHRyTmFtZSA9PSBcImtleVwiKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdC8vaG9vayBldmVudCBoYW5kbGVycyB0byB0aGUgYXV0by1yZWRyYXdpbmcgc3lzdGVtXHJcblx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YUF0dHIgPT09IEZVTkNUSU9OICYmIGF0dHJOYW1lLmluZGV4T2YoXCJvblwiKSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRub2RlW2F0dHJOYW1lXSA9IGF1dG9yZWRyYXcoZGF0YUF0dHIsIG5vZGUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBgc3R5bGU6IHsuLi59YFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwic3R5bGVcIiAmJiBkYXRhQXR0ciAhPSBudWxsICYmIHR5cGUuY2FsbChkYXRhQXR0cikgPT09IE9CSkVDVCkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGNhY2hlZEF0dHIgPT0gbnVsbCB8fCBjYWNoZWRBdHRyW3J1bGVdICE9PSBkYXRhQXR0cltydWxlXSkgbm9kZS5zdHlsZVtydWxlXSA9IGRhdGFBdHRyW3J1bGVdXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBjYWNoZWRBdHRyKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCEocnVsZSBpbiBkYXRhQXR0cikpIG5vZGUuc3R5bGVbcnVsZV0gPSBcIlwiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIFNWR1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAobmFtZXNwYWNlICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImhyZWZcIikgbm9kZS5zZXRBdHRyaWJ1dGVOUyhcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiwgXCJocmVmXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwiY2xhc3NOYW1lXCIpIG5vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIGNhc2VzIHRoYXQgYXJlIHByb3BlcnRpZXMgKGJ1dCBpZ25vcmUgY2FzZXMgd2hlcmUgd2Ugc2hvdWxkIHVzZSBzZXRBdHRyaWJ1dGUgaW5zdGVhZClcclxuXHRcdFx0XHRcdC8vLSBsaXN0IGFuZCBmb3JtIGFyZSB0eXBpY2FsbHkgdXNlZCBhcyBzdHJpbmdzLCBidXQgYXJlIERPTSBlbGVtZW50IHJlZmVyZW5jZXMgaW4ganNcclxuXHRcdFx0XHRcdC8vLSB3aGVuIHVzaW5nIENTUyBzZWxlY3RvcnMgKGUuZy4gYG0oXCJbc3R5bGU9JyddXCIpYCksIHN0eWxlIGlzIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgaW4gbm9kZSAmJiAhKGF0dHJOYW1lID09PSBcImxpc3RcIiB8fCBhdHRyTmFtZSA9PT0gXCJzdHlsZVwiIHx8IGF0dHJOYW1lID09PSBcImZvcm1cIiB8fCBhdHRyTmFtZSA9PT0gXCJ0eXBlXCIgfHwgYXR0ck5hbWUgPT09IFwid2lkdGhcIiB8fCBhdHRyTmFtZSA9PT0gXCJoZWlnaHRcIikpIHtcclxuXHRcdFx0XHRcdFx0Ly8jMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCBvdGhlcndpc2UgY3Vyc29yIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdFx0XHRcdGlmICh0YWcgIT09IFwiaW5wdXRcIiB8fCBub2RlW2F0dHJOYW1lXSAhPT0gZGF0YUF0dHIpIG5vZGVbYXR0ck5hbWVdID0gZGF0YUF0dHJcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0Ly9zd2FsbG93IElFJ3MgaW52YWxpZCBhcmd1bWVudCBlcnJvcnMgdG8gbWltaWMgSFRNTCdzIGZhbGxiYWNrLXRvLWRvaW5nLW5vdGhpbmctb24taW52YWxpZC1hdHRyaWJ1dGVzIGJlaGF2aW9yXHJcblx0XHRcdFx0XHRpZiAoZS5tZXNzYWdlLmluZGV4T2YoXCJJbnZhbGlkIGFyZ3VtZW50XCIpIDwgMCkgdGhyb3cgZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvLyMzNDggZGF0YUF0dHIgbWF5IG5vdCBiZSBhIHN0cmluZywgc28gdXNlIGxvb3NlIGNvbXBhcmlzb24gKGRvdWJsZSBlcXVhbCkgaW5zdGVhZCBvZiBzdHJpY3QgKHRyaXBsZSBlcXVhbClcclxuXHRcdFx0ZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIiAmJiB0YWcgPT09IFwiaW5wdXRcIiAmJiBub2RlLnZhbHVlICE9IGRhdGFBdHRyKSB7XHJcblx0XHRcdFx0bm9kZS52YWx1ZSA9IGRhdGFBdHRyXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZWRBdHRyc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBjbGVhcihub2RlcywgY2FjaGVkKSB7XHJcblx0XHRmb3IgKHZhciBpID0gbm9kZXMubGVuZ3RoIC0gMTsgaSA+IC0xOyBpLS0pIHtcclxuXHRcdFx0aWYgKG5vZGVzW2ldICYmIG5vZGVzW2ldLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0XHR0cnkge25vZGVzW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZXNbaV0pfVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7fSAvL2lnbm9yZSBpZiB0aGlzIGZhaWxzIGR1ZSB0byBvcmRlciBvZiBldmVudHMgKHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIxOTI2MDgzL2ZhaWxlZC10by1leGVjdXRlLXJlbW92ZWNoaWxkLW9uLW5vZGUpXHJcblx0XHRcdFx0Y2FjaGVkID0gW10uY29uY2F0KGNhY2hlZCk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSkgdW5sb2FkKGNhY2hlZFtpXSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCAhPSAwKSBub2Rlcy5sZW5ndGggPSAwXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHVubG9hZChjYWNoZWQpIHtcclxuXHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJiB0eXBlb2YgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKCk7XHJcblx0XHRcdGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jb250cm9sbGVycykge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBjb250cm9sbGVyLm9udW5sb2FkID09PSBGVU5DVElPTikgY29udHJvbGxlci5vbnVubG9hZCh7cHJldmVudERlZmF1bHQ6IG5vb3B9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKGNhY2hlZC5jaGlsZHJlbikge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZC5jaGlsZHJlbikgPT09IEFSUkFZKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IGNhY2hlZC5jaGlsZHJlbltpXTsgaSsrKSB1bmxvYWQoY2hpbGQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoY2FjaGVkLmNoaWxkcmVuLnRhZykgdW5sb2FkKGNhY2hlZC5jaGlsZHJlbilcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dmFyIG5leHRTaWJsaW5nID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XTtcclxuXHRcdGlmIChuZXh0U2libGluZykge1xyXG5cdFx0XHR2YXIgaXNFbGVtZW50ID0gbmV4dFNpYmxpbmcubm9kZVR5cGUgIT0gMTtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cdFx0XHRpZiAoaXNFbGVtZW50KSB7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIG5leHRTaWJsaW5nIHx8IG51bGwpO1xyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocGxhY2Vob2xkZXIpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBuZXh0U2libGluZy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCBkYXRhKTtcclxuXHRcdHZhciBub2RlcyA9IFtdO1xyXG5cdFx0d2hpbGUgKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gIT09IG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdG5vZGVzLnB1c2gocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSk7XHJcblx0XHRcdGluZGV4KytcclxuXHRcdH1cclxuXHRcdHJldHVybiBub2Rlc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhdXRvcmVkcmF3KGNhbGxiYWNrLCBvYmplY3QpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHR0cnkge3JldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSl9XHJcblx0XHRcdGZpbmFsbHkge1xyXG5cdFx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgaHRtbDtcclxuXHR2YXIgZG9jdW1lbnROb2RlID0ge1xyXG5cdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0aWYgKGh0bWwgPT09IHVuZGVmaW5lZCkgaHRtbCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKTtcclxuXHRcdFx0aWYgKCRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAhPT0gbm9kZSkge1xyXG5cdFx0XHRcdCRkb2N1bWVudC5yZXBsYWNlQ2hpbGQobm9kZSwgJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlICRkb2N1bWVudC5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdFx0dGhpcy5jaGlsZE5vZGVzID0gJGRvY3VtZW50LmNoaWxkTm9kZXNcclxuXHRcdH0sXHJcblx0XHRpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKVxyXG5cdFx0fSxcclxuXHRcdGNoaWxkTm9kZXM6IFtdXHJcblx0fTtcclxuXHR2YXIgbm9kZUNhY2hlID0gW10sIGNlbGxDYWNoZSA9IHt9O1xyXG5cdG0ucmVuZGVyID0gZnVuY3Rpb24ocm9vdCwgY2VsbCwgZm9yY2VSZWNyZWF0aW9uKSB7XHJcblx0XHR2YXIgY29uZmlncyA9IFtdO1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIERPTSBlbGVtZW50IGJlaW5nIHBhc3NlZCB0byBtLnJvdXRlL20ubW91bnQvbS5yZW5kZXIgaXMgbm90IHVuZGVmaW5lZC5cIik7XHJcblx0XHR2YXIgaWQgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHR2YXIgaXNEb2N1bWVudFJvb3QgPSByb290ID09PSAkZG9jdW1lbnQ7XHJcblx0XHR2YXIgbm9kZSA9IGlzRG9jdW1lbnRSb290IHx8IHJvb3QgPT09ICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudE5vZGUgOiByb290O1xyXG5cdFx0aWYgKGlzRG9jdW1lbnRSb290ICYmIGNlbGwudGFnICE9IFwiaHRtbFwiKSBjZWxsID0ge3RhZzogXCJodG1sXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IGNlbGx9O1xyXG5cdFx0aWYgKGNlbGxDYWNoZVtpZF0gPT09IHVuZGVmaW5lZCkgY2xlYXIobm9kZS5jaGlsZE5vZGVzKTtcclxuXHRcdGlmIChmb3JjZVJlY3JlYXRpb24gPT09IHRydWUpIHJlc2V0KHJvb3QpO1xyXG5cdFx0Y2VsbENhY2hlW2lkXSA9IGJ1aWxkKG5vZGUsIG51bGwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjZWxsLCBjZWxsQ2FjaGVbaWRdLCBmYWxzZSwgMCwgbnVsbCwgdW5kZWZpbmVkLCBjb25maWdzKTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb25maWdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBjb25maWdzW2ldKClcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KTtcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleFxyXG5cdH1cclxuXHJcblx0bS50cnVzdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZSA9IG5ldyBTdHJpbmcodmFsdWUpO1xyXG5cdFx0dmFsdWUuJHRydXN0ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0dGVyc2V0dGVyKHN0b3JlKSB7XHJcblx0XHR2YXIgcHJvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkgc3RvcmUgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRwcm9wLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblxyXG5cdG0ucHJvcCA9IGZ1bmN0aW9uIChzdG9yZSkge1xyXG5cdFx0Ly9ub3RlOiB1c2luZyBub24tc3RyaWN0IGVxdWFsaXR5IGNoZWNrIGhlcmUgYmVjYXVzZSB3ZSdyZSBjaGVja2luZyBpZiBzdG9yZSBpcyBudWxsIE9SIHVuZGVmaW5lZFxyXG5cdFx0aWYgKCgoc3RvcmUgIT0gbnVsbCAmJiB0eXBlLmNhbGwoc3RvcmUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBzdG9yZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiBzdG9yZS50aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShzdG9yZSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKVxyXG5cdH07XHJcblxyXG5cdHZhciByb290cyA9IFtdLCBjb21wb25lbnRzID0gW10sIGNvbnRyb2xsZXJzID0gW10sIGxhc3RSZWRyYXdJZCA9IG51bGwsIGxhc3RSZWRyYXdDYWxsVGltZSA9IDAsIGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbCwgY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbCwgcHJldmVudGVkID0gZmFsc2UsIHRvcENvbXBvbmVudCwgdW5sb2FkZXJzID0gW107XHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkuYXBwbHkodGhpcywgYXJncykgfHwgdGhpc1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZpZXcgPSBmdW5jdGlvbihjdHJsKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgYXJncyA9IGFyZ3MuY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHRcdFx0cmV0dXJuIGNvbXBvbmVudC52aWV3LmFwcGx5KGNvbXBvbmVudCwgYXJncyA/IFtjdHJsXS5jb25jYXQoYXJncykgOiBbY3RybF0pXHJcblx0XHR9XHJcblx0XHR2aWV3LiRvcmlnaW5hbCA9IGNvbXBvbmVudC52aWV3XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9XHJcblx0XHRpZiAoYXJnc1swXSAmJiBhcmdzWzBdLmtleSAhPSBudWxsKSBvdXRwdXQuYXR0cnMgPSB7a2V5OiBhcmdzWzBdLmtleX1cclxuXHRcdHJldHVybiBvdXRwdXRcclxuXHR9XHJcblx0bS5jb21wb25lbnQgPSBmdW5jdGlvbihjb21wb25lbnQpIHtcclxuXHRcdHJldHVybiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0fVxyXG5cdG0ubW91bnQgPSBtLm1vZHVsZSA9IGZ1bmN0aW9uKHJvb3QsIGNvbXBvbmVudCkge1xyXG5cdFx0aWYgKCFyb290KSB0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2UgZW5zdXJlIHRoZSBET00gZWxlbWVudCBleGlzdHMgYmVmb3JlIHJlbmRlcmluZyBhIHRlbXBsYXRlIGludG8gaXQuXCIpO1xyXG5cdFx0dmFyIGluZGV4ID0gcm9vdHMuaW5kZXhPZihyb290KTtcclxuXHRcdGlmIChpbmRleCA8IDApIGluZGV4ID0gcm9vdHMubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHR2YXIgaXNQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHRcdHZhciBldmVudCA9IHtwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlzUHJldmVudGVkID0gdHJ1ZTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsO1xyXG5cdFx0fX07XHJcblx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0dW5sb2FkZXIuaGFuZGxlci5jYWxsKHVubG9hZGVyLmNvbnRyb2xsZXIsIGV2ZW50KVxyXG5cdFx0XHR1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0aWYgKGlzUHJldmVudGVkKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCB1bmxvYWRlcjsgdW5sb2FkZXIgPSB1bmxvYWRlcnNbaV07IGkrKykgdW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IHVubG9hZGVyLmhhbmRsZXJcclxuXHRcdH1cclxuXHRcdGVsc2UgdW5sb2FkZXJzID0gW11cclxuXHRcdFxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzW2luZGV4XSAmJiB0eXBlb2YgY29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQoZXZlbnQpXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIGNvbXBvbmVudCA9IHN1YmNvbXBvbmVudChjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSlcclxuXHRcdFx0dmFyIGN1cnJlbnRDb21wb25lbnQgPSB0b3BDb21wb25lbnQgPSBjb21wb25lbnQgPSBjb21wb25lbnQgfHwge2NvbnRyb2xsZXI6IGZ1bmN0aW9uKCkge319O1xyXG5cdFx0XHR2YXIgY29uc3RydWN0b3IgPSBjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wXHJcblx0XHRcdHZhciBjb250cm9sbGVyID0gbmV3IGNvbnN0cnVjdG9yO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW91bnQgcmVjdXJzaXZlbHkgKHZpYSBtLnJvdXRlIHJlZGlyZWN0cywgZm9yIGV4YW1wbGUpXHJcblx0XHRcdC8vdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpcyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyO1xyXG5cdFx0XHRcdGNvbXBvbmVudHNbaW5kZXhdID0gY29tcG9uZW50XHJcblx0XHRcdH1cclxuXHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyZXR1cm4gY29udHJvbGxlcnNbaW5kZXhdXHJcblx0XHR9XHJcblx0fTtcclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2VcclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uKGZvcmNlKSB7XHJcblx0XHRpZiAocmVkcmF3aW5nKSByZXR1cm5cclxuXHRcdHJlZHJhd2luZyA9IHRydWVcclxuXHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SUQgaXMgbnVsbCBpZiBpdCdzIHRoZSBmaXJzdCByZWRyYXcgYW5kIG5vdCBhbiBldmVudCBoYW5kbGVyXHJcblx0XHRpZiAobGFzdFJlZHJhd0lkICYmIGZvcmNlICE9PSB0cnVlKSB7XHJcblx0XHRcdC8vd2hlbiBzZXRUaW1lb3V0OiBvbmx5IHJlc2NoZWR1bGUgcmVkcmF3IGlmIHRpbWUgYmV0d2VlbiBub3cgYW5kIHByZXZpb3VzIHJlZHJhdyBpcyBiaWdnZXIgdGhhbiBhIGZyYW1lLCBvdGhlcndpc2Uga2VlcCBjdXJyZW50bHkgc2NoZWR1bGVkIHRpbWVvdXRcclxuXHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdGlmICgkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IG5ldyBEYXRlIC0gbGFzdFJlZHJhd0NhbGxUaW1lID4gRlJBTUVfQlVER0VUKSB7XHJcblx0XHRcdFx0aWYgKGxhc3RSZWRyYXdJZCA+IDApICRjYW5jZWxBbmltYXRpb25GcmFtZShsYXN0UmVkcmF3SWQpO1xyXG5cdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtsYXN0UmVkcmF3SWQgPSBudWxsfSwgRlJBTUVfQlVER0VUKVxyXG5cdFx0fVxyXG5cdFx0cmVkcmF3aW5nID0gZmFsc2VcclxuXHR9O1xyXG5cdG0ucmVkcmF3LnN0cmF0ZWd5ID0gbS5wcm9wKCk7XHJcblx0ZnVuY3Rpb24gcmVkcmF3KCkge1xyXG5cdFx0aWYgKGNvbXB1dGVQcmVSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rKClcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRmb3IgKHZhciBpID0gMCwgcm9vdDsgcm9vdCA9IHJvb3RzW2ldOyBpKyspIHtcclxuXHRcdFx0aWYgKGNvbnRyb2xsZXJzW2ldKSB7XHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIgJiYgY29tcG9uZW50c1tpXS5jb250cm9sbGVyLiQkYXJncyA/IFtjb250cm9sbGVyc1tpXV0uY29uY2F0KGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MpIDogW2NvbnRyb2xsZXJzW2ldXVxyXG5cdFx0XHRcdG0ucmVuZGVyKHJvb3QsIGNvbXBvbmVudHNbaV0udmlldyA/IGNvbXBvbmVudHNbaV0udmlldyhjb250cm9sbGVyc1tpXSwgYXJncykgOiBcIlwiKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL2FmdGVyIHJlbmRlcmluZyB3aXRoaW4gYSByb3V0ZWQgY29udGV4dCwgd2UgbmVlZCB0byBzY3JvbGwgYmFjayB0byB0aGUgdG9wLCBhbmQgZmV0Y2ggdGhlIGRvY3VtZW50IHRpdGxlIGZvciBoaXN0b3J5LnB1c2hTdGF0ZVxyXG5cdFx0aWYgKGNvbXB1dGVQb3N0UmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2soKTtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbDtcclxuXHRcdGxhc3RSZWRyYXdDYWxsVGltZSA9IG5ldyBEYXRlO1xyXG5cdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0fVxyXG5cclxuXHR2YXIgcGVuZGluZ1JlcXVlc3RzID0gMDtcclxuXHRtLnN0YXJ0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtwZW5kaW5nUmVxdWVzdHMrK307XHJcblx0bS5lbmRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cGVuZGluZ1JlcXVlc3RzID0gTWF0aC5tYXgocGVuZGluZ1JlcXVlc3RzIC0gMSwgMCk7XHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID09PSAwKSBtLnJlZHJhdygpXHJcblx0fTtcclxuXHR2YXIgZW5kRmlyc3RDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJub25lXCIpIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzLS1cclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0XHR9XHJcblx0XHRlbHNlIG0uZW5kQ29tcHV0YXRpb24oKTtcclxuXHR9XHJcblxyXG5cdG0ud2l0aEF0dHIgPSBmdW5jdGlvbihwcm9wLCB3aXRoQXR0ckNhbGxiYWNrKSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpcztcclxuXHRcdFx0d2l0aEF0dHJDYWxsYmFjayhwcm9wIGluIGN1cnJlbnRUYXJnZXQgPyBjdXJyZW50VGFyZ2V0W3Byb3BdIDogY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUocHJvcCkpXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly9yb3V0aW5nXHJcblx0dmFyIG1vZGVzID0ge3BhdGhuYW1lOiBcIlwiLCBoYXNoOiBcIiNcIiwgc2VhcmNoOiBcIj9cIn07XHJcblx0dmFyIHJlZGlyZWN0ID0gbm9vcCwgcm91dGVQYXJhbXMsIGN1cnJlbnRSb3V0ZSwgaXNEZWZhdWx0Um91dGUgPSBmYWxzZTtcclxuXHRtLnJvdXRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHQvL20ucm91dGUoKVxyXG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiBjdXJyZW50Um91dGU7XHJcblx0XHQvL20ucm91dGUoZWwsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyAmJiB0eXBlLmNhbGwoYXJndW1lbnRzWzFdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciByb290ID0gYXJndW1lbnRzWzBdLCBkZWZhdWx0Um91dGUgPSBhcmd1bWVudHNbMV0sIHJvdXRlciA9IGFyZ3VtZW50c1syXTtcclxuXHRcdFx0cmVkaXJlY3QgPSBmdW5jdGlvbihzb3VyY2UpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9IGN1cnJlbnRSb3V0ZSA9IG5vcm1hbGl6ZVJvdXRlKHNvdXJjZSk7XHJcblx0XHRcdFx0aWYgKCFyb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSkge1xyXG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdFJvdXRlKSB0aHJvdyBuZXcgRXJyb3IoXCJFbnN1cmUgdGhlIGRlZmF1bHQgcm91dGUgbWF0Y2hlcyBvbmUgb2YgdGhlIHJvdXRlcyBkZWZpbmVkIGluIG0ucm91dGVcIilcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gdHJ1ZVxyXG5cdFx0XHRcdFx0bS5yb3V0ZShkZWZhdWx0Um91dGUsIHRydWUpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSBtLnJvdXRlLm1vZGUgPT09IFwiaGFzaFwiID8gXCJvbmhhc2hjaGFuZ2VcIiA6IFwib25wb3BzdGF0ZVwiO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSAkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXVxyXG5cdFx0XHRcdGlmIChtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIikgcGF0aCArPSAkbG9jYXRpb24uc2VhcmNoXHJcblx0XHRcdFx0aWYgKGN1cnJlbnRSb3V0ZSAhPSBub3JtYWxpemVSb3V0ZShwYXRoKSkge1xyXG5cdFx0XHRcdFx0cmVkaXJlY3QocGF0aClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsO1xyXG5cdFx0XHR3aW5kb3dbbGlzdGVuZXJdKClcclxuXHRcdH1cclxuXHRcdC8vY29uZmlnOiBtLnJvdXRlXHJcblx0XHRlbHNlIGlmIChhcmd1bWVudHNbMF0uYWRkRXZlbnRMaXN0ZW5lciB8fCBhcmd1bWVudHNbMF0uYXR0YWNoRXZlbnQpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHZhciBpc0luaXRpYWxpemVkID0gYXJndW1lbnRzWzFdO1xyXG5cdFx0XHR2YXIgY29udGV4dCA9IGFyZ3VtZW50c1syXTtcclxuXHRcdFx0dmFyIHZkb20gPSBhcmd1bWVudHNbM107XHJcblx0XHRcdGVsZW1lbnQuaHJlZiA9IChtLnJvdXRlLm1vZGUgIT09ICdwYXRobmFtZScgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiAnJykgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdmRvbS5hdHRycy5ocmVmO1xyXG5cdFx0XHRpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRlbGVtZW50LmRldGFjaEV2ZW50KFwib25jbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0XHRlbGVtZW50LmF0dGFjaEV2ZW50KFwib25jbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvL20ucm91dGUocm91dGUsIHBhcmFtcywgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSlcclxuXHRcdGVsc2UgaWYgKHR5cGUuY2FsbChhcmd1bWVudHNbMF0pID09PSBTVFJJTkcpIHtcclxuXHRcdFx0dmFyIG9sZFJvdXRlID0gY3VycmVudFJvdXRlO1xyXG5cdFx0XHRjdXJyZW50Um91dGUgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHZhciBhcmdzID0gYXJndW1lbnRzWzFdIHx8IHt9XHJcblx0XHRcdHZhciBxdWVyeUluZGV4ID0gY3VycmVudFJvdXRlLmluZGV4T2YoXCI/XCIpXHJcblx0XHRcdHZhciBwYXJhbXMgPSBxdWVyeUluZGV4ID4gLTEgPyBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRSb3V0ZS5zbGljZShxdWVyeUluZGV4ICsgMSkpIDoge31cclxuXHRcdFx0Zm9yICh2YXIgaSBpbiBhcmdzKSBwYXJhbXNbaV0gPSBhcmdzW2ldXHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKVxyXG5cdFx0XHR2YXIgY3VycmVudFBhdGggPSBxdWVyeUluZGV4ID4gLTEgPyBjdXJyZW50Um91dGUuc2xpY2UoMCwgcXVlcnlJbmRleCkgOiBjdXJyZW50Um91dGVcclxuXHRcdFx0aWYgKHF1ZXJ5c3RyaW5nKSBjdXJyZW50Um91dGUgPSBjdXJyZW50UGF0aCArIChjdXJyZW50UGF0aC5pbmRleE9mKFwiP1wiKSA9PT0gLTEgPyBcIj9cIiA6IFwiJlwiKSArIHF1ZXJ5c3RyaW5nO1xyXG5cclxuXHRcdFx0dmFyIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPSAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IGFyZ3VtZW50c1syXSA6IGFyZ3VtZW50c1sxXSkgPT09IHRydWUgfHwgb2xkUm91dGUgPT09IGFyZ3VtZW50c1swXTtcclxuXHJcblx0XHRcdGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcclxuXHRcdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbFxyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0d2luZG93Lmhpc3Rvcnlbc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXShudWxsLCAkZG9jdW1lbnQudGl0bGUsIG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXSA9IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbihrZXkpIHtcclxuXHRcdGlmICghcm91dGVQYXJhbXMpIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIHJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpXHJcblx0XHRyZXR1cm4gcm91dGVQYXJhbXNba2V5XVxyXG5cdH07XHJcblx0bS5yb3V0ZS5tb2RlID0gXCJzZWFyY2hcIjtcclxuXHRmdW5jdGlvbiBub3JtYWxpemVSb3V0ZShyb3V0ZSkge1xyXG5cdFx0cmV0dXJuIHJvdXRlLnNsaWNlKG1vZGVzW20ucm91dGUubW9kZV0ubGVuZ3RoKVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZUJ5VmFsdWUocm9vdCwgcm91dGVyLCBwYXRoKSB7XHJcblx0XHRyb3V0ZVBhcmFtcyA9IHt9O1xyXG5cclxuXHRcdHZhciBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKFwiP1wiKTtcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcocGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSk7XHJcblx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigwLCBxdWVyeVN0YXJ0KVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEdldCBhbGwgcm91dGVzIGFuZCBjaGVjayBpZiB0aGVyZSdzXHJcblx0XHQvLyBhbiBleGFjdCBtYXRjaCBmb3IgdGhlIGN1cnJlbnQgcGF0aFxyXG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhyb3V0ZXIpO1xyXG5cdFx0dmFyIGluZGV4ID0ga2V5cy5pbmRleE9mKHBhdGgpO1xyXG5cdFx0aWYoaW5kZXggIT09IC0xKXtcclxuXHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJba2V5cyBbaW5kZXhdXSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIHJvdXRlIGluIHJvdXRlcikge1xyXG5cdFx0XHRpZiAocm91dGUgPT09IHBhdGgpIHtcclxuXHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlLnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpLnJlcGxhY2UoLzpbXlxcL10rL2csIFwiKFteXFxcXC9dKylcIikgKyBcIlxcLz8kXCIpO1xyXG5cclxuXHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRoKSkge1xyXG5cdFx0XHRcdHBhdGgucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdO1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMik7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykgcm91dGVQYXJhbXNba2V5c1tpXS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2ldKVxyXG5cdFx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gcm91dGVVbm9idHJ1c2l2ZShlKSB7XHJcblx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUud2hpY2ggPT09IDIpIHJldHVybjtcclxuXHRcdGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRlbHNlIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHRcdHZhciBhcmdzID0gbS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIgJiYgY3VycmVudFRhcmdldC5zZWFyY2ggPyBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRUYXJnZXQuc2VhcmNoLnNsaWNlKDEpKSA6IHt9O1xyXG5cdFx0d2hpbGUgKGN1cnJlbnRUYXJnZXQgJiYgY3VycmVudFRhcmdldC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9IFwiQVwiKSBjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlXHJcblx0XHRtLnJvdXRlKGN1cnJlbnRUYXJnZXRbbS5yb3V0ZS5tb2RlXS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aCksIGFyZ3MpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHNldFNjcm9sbCgpIHtcclxuXHRcdGlmIChtLnJvdXRlLm1vZGUgIT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpICRsb2NhdGlvbi5oYXNoID0gJGxvY2F0aW9uLmhhc2g7XHJcblx0XHRlbHNlIHdpbmRvdy5zY3JvbGxUbygwLCAwKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZFF1ZXJ5U3RyaW5nKG9iamVjdCwgcHJlZml4KSB7XHJcblx0XHR2YXIgZHVwbGljYXRlcyA9IHt9XHJcblx0XHR2YXIgc3RyID0gW11cclxuXHRcdGZvciAodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3BcclxuXHRcdFx0dmFyIHZhbHVlID0gb2JqZWN0W3Byb3BdXHJcblx0XHRcdHZhciB2YWx1ZVR5cGUgPSB0eXBlLmNhbGwodmFsdWUpXHJcblx0XHRcdHZhciBwYWlyID0gKHZhbHVlID09PSBudWxsKSA/IGVuY29kZVVSSUNvbXBvbmVudChrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IE9CSkVDVCA/IGJ1aWxkUXVlcnlTdHJpbmcodmFsdWUsIGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gQVJSQVkgPyB2YWx1ZS5yZWR1Y2UoZnVuY3Rpb24obWVtbywgaXRlbSkge1xyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV0pIGR1cGxpY2F0ZXNba2V5XSA9IHt9XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XVtpdGVtXSkge1xyXG5cdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlXHJcblx0XHRcdFx0XHRcdHJldHVybiBtZW1vLmNvbmNhdChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGl0ZW0pKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIG1lbW9cclxuXHRcdFx0XHR9LCBbXSkuam9pbihcIiZcIikgOlxyXG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpXHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSBzdHIucHVzaChwYWlyKVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHN0ci5qb2luKFwiJlwiKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nKHN0cikge1xyXG5cdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT09IFwiP1wiKSBzdHIgPSBzdHIuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHJcblx0XHR2YXIgcGFpcnMgPSBzdHIuc3BsaXQoXCImXCIpLCBwYXJhbXMgPSB7fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHBhaXJzW2ldLnNwbGl0KFwiPVwiKTtcclxuXHRcdFx0dmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKVxyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYWlyLmxlbmd0aCA9PSAyID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pIDogbnVsbFxyXG5cdFx0XHRpZiAocGFyYW1zW2tleV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwocGFyYW1zW2tleV0pICE9PSBBUlJBWSkgcGFyYW1zW2tleV0gPSBbcGFyYW1zW2tleV1dXHJcblx0XHRcdFx0cGFyYW1zW2tleV0ucHVzaCh2YWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHBhcmFtc1trZXldID0gdmFsdWVcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYXJhbXNcclxuXHR9XHJcblx0bS5yb3V0ZS5idWlsZFF1ZXJ5U3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZ1xyXG5cdG0ucm91dGUucGFyc2VRdWVyeVN0cmluZyA9IHBhcnNlUXVlcnlTdHJpbmdcclxuXHRcclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHRjbGVhcihyb290LmNoaWxkTm9kZXMsIGNlbGxDYWNoZVtjYWNoZUtleV0pO1xyXG5cdFx0Y2VsbENhY2hlW2NhY2hlS2V5XSA9IHVuZGVmaW5lZFxyXG5cdH1cclxuXHJcblx0bS5kZWZlcnJlZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWRcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIHByb3BpZnkocHJvbWlzZSwgaW5pdGlhbFZhbHVlKSB7XHJcblx0XHR2YXIgcHJvcCA9IG0ucHJvcChpbml0aWFsVmFsdWUpO1xyXG5cdFx0cHJvbWlzZS50aGVuKHByb3ApO1xyXG5cdFx0cHJvcC50aGVuID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpLCBpbml0aWFsVmFsdWUpXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblx0Ly9Qcm9taXoubWl0aHJpbC5qcyB8IFpvbG1laXN0ZXIgfCBNSVRcclxuXHQvL2EgbW9kaWZpZWQgdmVyc2lvbiBvZiBQcm9taXouanMsIHdoaWNoIGRvZXMgbm90IGNvbmZvcm0gdG8gUHJvbWlzZXMvQSsgZm9yIHR3byByZWFzb25zOlxyXG5cdC8vMSkgYHRoZW5gIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHN5bmNocm9ub3VzbHkgKGJlY2F1c2Ugc2V0VGltZW91dCBpcyB0b28gc2xvdywgYW5kIHRoZSBzZXRJbW1lZGlhdGUgcG9seWZpbGwgaXMgdG9vIGJpZ1xyXG5cdC8vMikgdGhyb3dpbmcgc3ViY2xhc3NlcyBvZiBFcnJvciBjYXVzZSB0aGUgZXJyb3IgdG8gYmUgYnViYmxlZCB1cCBpbnN0ZWFkIG9mIHRyaWdnZXJpbmcgcmVqZWN0aW9uIChiZWNhdXNlIHRoZSBzcGVjIGRvZXMgbm90IGFjY291bnQgZm9yIHRoZSBpbXBvcnRhbnQgdXNlIGNhc2Ugb2YgZGVmYXVsdCBicm93c2VyIGVycm9yIGhhbmRsaW5nLCBpLmUuIG1lc3NhZ2Ugdy8gbGluZSBudW1iZXIpXHJcblx0ZnVuY3Rpb24gRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spIHtcclxuXHRcdHZhciBSRVNPTFZJTkcgPSAxLCBSRUpFQ1RJTkcgPSAyLCBSRVNPTFZFRCA9IDMsIFJFSkVDVEVEID0gNDtcclxuXHRcdHZhciBzZWxmID0gdGhpcywgc3RhdGUgPSAwLCBwcm9taXNlVmFsdWUgPSAwLCBuZXh0ID0gW107XHJcblxyXG5cdFx0c2VsZltcInByb21pc2VcIl0gPSB7fTtcclxuXHJcblx0XHRzZWxmW1wicmVzb2x2ZVwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZltcInJlamVjdFwiXSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5wcm9taXNlW1widGhlblwiXSA9IGZ1bmN0aW9uKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjayk7XHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG5leHQucHVzaChkZWZlcnJlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURUQ7XHJcblx0XHRcdG5leHQubWFwKGZ1bmN0aW9uKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0c3RhdGUgPT09IFJFU09MVkVEICYmIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKSB8fCBkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaywgbm90VGhlbm5hYmxlQ2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgdHlwZS5jYWxsKHByb21pc2VWYWx1ZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHByb21pc2VWYWx1ZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiB0aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBjb3VudCBwcm90ZWN0cyBhZ2FpbnN0IGFidXNlIGNhbGxzIGZyb20gc3BlYyBjaGVja2VyXHJcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwO1xyXG5cdFx0XHRcdFx0dGhlbi5jYWxsKHByb21pc2VWYWx1ZSwgZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHN1Y2Nlc3NDYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVybjtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdGZhaWx1cmVDYWxsYmFjaygpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5vdFRoZW5uYWJsZUNhbGxiYWNrKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGZpcmUoKSB7XHJcblx0XHRcdC8vIGNoZWNrIGlmIGl0J3MgYSB0aGVuYWJsZVxyXG5cdFx0XHR2YXIgdGhlbjtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHR0aGVuID0gcHJvbWlzZVZhbHVlICYmIHByb21pc2VWYWx1ZS50aGVuXHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRyZXR1cm4gZmlyZSgpXHJcblx0XHRcdH1cclxuXHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFSkVDVElORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIHR5cGVvZiBzdWNjZXNzQ2FsbGJhY2sgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHN1Y2Nlc3NDYWxsYmFjayhwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNUSU5HICYmIHR5cGVvZiBmYWlsdXJlQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBmYWlsdXJlQ2FsbGJhY2socHJvbWlzZVZhbHVlKTtcclxuXHRcdFx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKClcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwcm9taXNlVmFsdWUgPT09IHNlbGYpIHtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IFR5cGVFcnJvcigpO1xyXG5cdFx0XHRcdFx0ZmluaXNoKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9LCBmaW5pc2gsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblx0bS5kZWZlcnJlZC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYgKHR5cGUuY2FsbChlKSA9PT0gXCJbb2JqZWN0IEVycm9yXVwiICYmICFlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkubWF0Y2goLyBFcnJvci8pKSB0aHJvdyBlXHJcblx0fTtcclxuXHJcblx0bS5zeW5jID0gZnVuY3Rpb24oYXJncykge1xyXG5cdFx0dmFyIG1ldGhvZCA9IFwicmVzb2x2ZVwiO1xyXG5cdFx0ZnVuY3Rpb24gc3luY2hyb25pemVyKHBvcywgcmVzb2x2ZWQpIHtcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0cmVzdWx0c1twb3NdID0gdmFsdWU7XHJcblx0XHRcdFx0aWYgKCFyZXNvbHZlZCkgbWV0aG9kID0gXCJyZWplY3RcIjtcclxuXHRcdFx0XHRpZiAoLS1vdXRzdGFuZGluZyA9PT0gMCkge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucHJvbWlzZShyZXN1bHRzKTtcclxuXHRcdFx0XHRcdGRlZmVycmVkW21ldGhvZF0ocmVzdWx0cylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZGVmZXJyZWQgPSBtLmRlZmVycmVkKCk7XHJcblx0XHR2YXIgb3V0c3RhbmRpbmcgPSBhcmdzLmxlbmd0aDtcclxuXHRcdHZhciByZXN1bHRzID0gbmV3IEFycmF5KG91dHN0YW5kaW5nKTtcclxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0YXJnc1tpXS50aGVuKHN5bmNocm9uaXplcihpLCB0cnVlKSwgc3luY2hyb25pemVyKGksIGZhbHNlKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBkZWZlcnJlZC5yZXNvbHZlKFtdKTtcclxuXHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH07XHJcblx0ZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtyZXR1cm4gdmFsdWV9XHJcblxyXG5cdGZ1bmN0aW9uIGFqYXgob3B0aW9ucykge1xyXG5cdFx0aWYgKG9wdGlvbnMuZGF0YVR5cGUgJiYgb3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCIpIHtcclxuXHRcdFx0dmFyIGNhbGxiYWNrS2V5ID0gXCJtaXRocmlsX2NhbGxiYWNrX1wiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSkudG9TdHJpbmcoMzYpO1xyXG5cdFx0XHR2YXIgc2NyaXB0ID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcblxyXG5cdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gZnVuY3Rpb24ocmVzcCkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblx0XHRcdFx0b3B0aW9ucy5vbmxvYWQoe1xyXG5cdFx0XHRcdFx0dHlwZTogXCJsb2FkXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiByZXNwXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IHVuZGVmaW5lZFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5vbmVycm9yKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwiZXJyb3JcIixcclxuXHRcdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0XHRzdGF0dXM6IDUwMCxcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiBKU09OLnN0cmluZ2lmeSh7ZXJyb3I6IFwiRXJyb3IgbWFraW5nIGpzb25wIHJlcXVlc3RcIn0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25sb2FkID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsXHJcblx0XHRcdFx0KyAob3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPiAwID8gXCImXCIgOiBcIj9cIilcclxuXHRcdFx0XHQrIChvcHRpb25zLmNhbGxiYWNrS2V5ID8gb3B0aW9ucy5jYWxsYmFja0tleSA6IFwiY2FsbGJhY2tcIilcclxuXHRcdFx0XHQrIFwiPVwiICsgY2FsbGJhY2tLZXlcclxuXHRcdFx0XHQrIFwiJlwiICsgYnVpbGRRdWVyeVN0cmluZyhvcHRpb25zLmRhdGEgfHwge30pO1xyXG5cdFx0XHQkZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XHJcblx0XHRcdHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgdHJ1ZSwgb3B0aW9ucy51c2VyLCBvcHRpb25zLnBhc3N3b3JkKTtcclxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG5cdFx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIG9wdGlvbnMub25sb2FkKHt0eXBlOiBcImxvYWRcIiwgdGFyZ2V0OiB4aHJ9KTtcclxuXHRcdFx0XHRcdGVsc2Ugb3B0aW9ucy5vbmVycm9yKHt0eXBlOiBcImVycm9yXCIsIHRhcmdldDogeGhyfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiYgb3B0aW9ucy5kYXRhICYmIG9wdGlvbnMubWV0aG9kICE9PSBcIkdFVFwiKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9wdGlvbnMuZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UpIHtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvKlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuY29uZmlnID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBtYXliZVhociA9IG9wdGlvbnMuY29uZmlnKHhociwgb3B0aW9ucyk7XHJcblx0XHRcdFx0aWYgKG1heWJlWGhyICE9IG51bGwpIHhociA9IG1heWJlWGhyXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkYXRhID0gb3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgfHwgIW9wdGlvbnMuZGF0YSA/IFwiXCIgOiBvcHRpb25zLmRhdGFcclxuXHRcdFx0aWYgKGRhdGEgJiYgKHR5cGUuY2FsbChkYXRhKSAhPSBTVFJJTkcgJiYgZGF0YS5jb25zdHJ1Y3RvciAhPSB3aW5kb3cuRm9ybURhdGEpKSB7XHJcblx0XHRcdFx0dGhyb3cgXCJSZXF1ZXN0IGRhdGEgc2hvdWxkIGJlIGVpdGhlciBiZSBhIHN0cmluZyBvciBGb3JtRGF0YS4gQ2hlY2sgdGhlIGBzZXJpYWxpemVgIG9wdGlvbiBpbiBgbS5yZXF1ZXN0YFwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdHhoci5zZW5kKGRhdGEpO1xyXG5cdFx0XHRyZXR1cm4geGhyXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJpbmREYXRhKHhock9wdGlvbnMsIGRhdGEsIHNlcmlhbGl6ZSkge1xyXG5cdFx0aWYgKHhock9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiICYmIHhock9wdGlvbnMuZGF0YVR5cGUgIT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBwcmVmaXggPSB4aHJPcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA8IDAgPyBcIj9cIiA6IFwiJlwiO1xyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpO1xyXG5cdFx0XHR4aHJPcHRpb25zLnVybCA9IHhock9wdGlvbnMudXJsICsgKHF1ZXJ5c3RyaW5nID8gcHJlZml4ICsgcXVlcnlzdHJpbmcgOiBcIlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB4aHJPcHRpb25zLmRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XHJcblx0XHRyZXR1cm4geGhyT3B0aW9uc1xyXG5cdH1cclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemVVcmwodXJsLCBkYXRhKSB7XHJcblx0XHR2YXIgdG9rZW5zID0gdXJsLm1hdGNoKC86W2Etel1cXHcrL2dpKTtcclxuXHRcdGlmICh0b2tlbnMgJiYgZGF0YSkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBrZXkgPSB0b2tlbnNbaV0uc2xpY2UoMSk7XHJcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UodG9rZW5zW2ldLCBkYXRhW2tleV0pO1xyXG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2tleV1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybFxyXG5cdH1cclxuXHJcblx0bS5yZXF1ZXN0ID0gZnVuY3Rpb24oeGhyT3B0aW9ucykge1xyXG5cdFx0aWYgKHhock9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdHZhciBpc0pTT05QID0geGhyT3B0aW9ucy5kYXRhVHlwZSAmJiB4aHJPcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIjtcclxuXHRcdHZhciBzZXJpYWxpemUgPSB4aHJPcHRpb25zLnNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuc2VyaWFsaXplIHx8IEpTT04uc3RyaW5naWZ5O1xyXG5cdFx0dmFyIGRlc2VyaWFsaXplID0geGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSA9IGlzSlNPTlAgPyBpZGVudGl0eSA6IHhock9wdGlvbnMuZGVzZXJpYWxpemUgfHwgSlNPTi5wYXJzZTtcclxuXHRcdHZhciBleHRyYWN0ID0gaXNKU09OUCA/IGZ1bmN0aW9uKGpzb25wKSB7cmV0dXJuIGpzb25wLnJlc3BvbnNlVGV4dH0gOiB4aHJPcHRpb25zLmV4dHJhY3QgfHwgZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdHJldHVybiB4aHIucmVzcG9uc2VUZXh0Lmxlbmd0aCA9PT0gMCAmJiBkZXNlcmlhbGl6ZSA9PT0gSlNPTi5wYXJzZSA/IG51bGwgOiB4aHIucmVzcG9uc2VUZXh0XHJcblx0XHR9O1xyXG5cdFx0eGhyT3B0aW9ucy5tZXRob2QgPSAoeGhyT3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XHJcblx0XHR4aHJPcHRpb25zLnVybCA9IHBhcmFtZXRlcml6ZVVybCh4aHJPcHRpb25zLnVybCwgeGhyT3B0aW9ucy5kYXRhKTtcclxuXHRcdHhock9wdGlvbnMgPSBiaW5kRGF0YSh4aHJPcHRpb25zLCB4aHJPcHRpb25zLmRhdGEsIHNlcmlhbGl6ZSk7XHJcblx0XHR4aHJPcHRpb25zLm9ubG9hZCA9IHhock9wdGlvbnMub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0XHR2YXIgdW53cmFwID0gKGUudHlwZSA9PT0gXCJsb2FkXCIgPyB4aHJPcHRpb25zLnVud3JhcFN1Y2Nlc3MgOiB4aHJPcHRpb25zLnVud3JhcEVycm9yKSB8fCBpZGVudGl0eTtcclxuXHRcdFx0XHR2YXIgcmVzcG9uc2UgPSB1bndyYXAoZGVzZXJpYWxpemUoZXh0cmFjdChlLnRhcmdldCwgeGhyT3B0aW9ucykpLCBlLnRhcmdldCk7XHJcblx0XHRcdFx0aWYgKGUudHlwZSA9PT0gXCJsb2FkXCIpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlLmNhbGwocmVzcG9uc2UpID09PSBBUlJBWSAmJiB4aHJPcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykgcmVzcG9uc2VbaV0gPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlW2ldKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoeGhyT3B0aW9ucy50eXBlKSByZXNwb25zZSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRlZmVycmVkW2UudHlwZSA9PT0gXCJsb2FkXCIgPyBcInJlc29sdmVcIiA6IFwicmVqZWN0XCJdKHJlc3BvbnNlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0fTtcclxuXHRcdGFqYXgoeGhyT3B0aW9ucyk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlLCB4aHJPcHRpb25zLmluaXRpYWxWYWx1ZSk7XHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH07XHJcblxyXG5cdC8vdGVzdGluZyBBUElcclxuXHRtLmRlcHMgPSBmdW5jdGlvbihtb2NrKSB7XHJcblx0XHRpbml0aWFsaXplKHdpbmRvdyA9IG1vY2sgfHwgd2luZG93KTtcclxuXHRcdHJldHVybiB3aW5kb3c7XHJcblx0fTtcclxuXHQvL2ZvciBpbnRlcm5hbCB0ZXN0aW5nIG9ubHksIGRvIG5vdCB1c2UgYG0uZGVwcy5mYWN0b3J5YFxyXG5cdG0uZGVwcy5mYWN0b3J5ID0gYXBwO1xyXG5cclxuXHRyZXR1cm4gbVxyXG59KSh0eXBlb2Ygd2luZG93ICE9IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBtO1xyXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiBtfSk7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9+L21pdGhyaWwvbWl0aHJpbC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL34vd2VicGFjay9idWlsZGluL21vZHVsZS5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IGxvZ2dlZEluIGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcclxuXHJcbmltcG9ydCBtZXNzYWdlTW9kYWwgZnJvbSAnLi9tZXNzYWdlLW1vZGFsJztcclxuaW1wb3J0IG5hdlBhbmVsIGZyb20gJy4vbmF2LXBhbmVsJztcclxuaW1wb3J0IGF1dGhlbnRpY2F0ZSBmcm9tICcuL2F1dGhlbnRpY2F0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHBvc3RzID0gbS5yZXF1ZXN0KHtcclxuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICB1cmw6ICdwb3N0LnBocCcsXHJcbiAgICAgIGRlc2VyaWFsaXplOiAodmFsdWUpID0+IEpTT04ucGFyc2UodmFsdWUpLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgY29tbWVudHM6IDEwXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XHJcbiAgICAgICQucG9zdCgnbG9nb3V0LnBocCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBvc3RzXHJcbiAgICB9XHJcbiAgfSxcclxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xyXG4gICAgcmV0dXJuIFttKFwiaGVhZGVyXCIsIFtcclxuICAgICAgbShcIm5hdi50b3AtbmF2XCIsIFtcclxuICAgICAgICBtKFwiaDEuY2VudGVyLWFsaWduXCIsIFwiU3RldmVucyBDb21wbGltZW50cyBhbmQgQ3J1c2hlc1wiKVxyXG4gICAgICBdKVxyXG4gICAgXSksIG0oXCJtYWluLmNvbnRhaW5lclwiLCBbXHJcbiAgICAgIG0oXCJmb3JtLmNhcmQtcGFuZWwuaG92ZXJhYmxlXCIsIFtcclxuICAgICAgICBtKFwiLmlucHV0LWZpZWxkXCIsIFtcclxuICAgICAgICAgIG0oXCJpbnB1dFtpZD0ncG9zdC10aXRsZSddW3R5cGU9J3RleHQnXVtwbGFjZWhvbGRlcj0nV2hvIGFyZSB5b3UgY29tcGxpbWVudGluZz8nXVwiKSxcclxuICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bvc3QtdGl0bGUnXVwiKVxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xyXG4gICAgICAgICAgbShcInRleHRhcmVhLm1hdGVyaWFsaXplLXRleHRhcmVhW2lkPSdwb3N0LXRleHRhcmVhJ11bbGVuZ3RoPScxMDAwJ11cIiksXHJcbiAgICAgICAgICBtKFwibGFiZWxbZm9yPSdwb3N0LXRleHRhcmVhJ11cIiwgXCJTdWJtaXQgYSBwb3N0IVwiKVxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIG0oXCIucm93XCIsIFtcclxuICAgICAgICAgIG0oXCIuY29sLnMxMi5tOFwiLCBbXHJcbiAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J3Bvc3QtYW5vbiddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nMCddXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bvc3QtYW5vbiddXCIsIFwiU3VibWl0IGFub255bW91c2x5XCIpXHJcbiAgICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgICBtKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICBtKFwiaW5wdXRbaWQ9J3Bvc3QtbmFtZSddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nMSddXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bvc3QtbmFtZSddXCIsIFwiU3VibWl0IHdpdGggbmFtZVwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLmNvbC5zMTIubTRcIiwgW1xyXG4gICAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi53YXZlcy1lZmZlY3Qud2F2ZXMtbGlnaHRbbmFtZT0nYWN0aW9uJ11bdHlwZT0nc3VibWl0J11cIiwgW1wiUG9zdFwiLCBtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcIm1lc3NhZ2VcIildKVxyXG4gICAgICAgICAgXSlcclxuICAgICAgICBdKVxyXG4gICAgICBdKSxcclxuICAgICAgbShcInVsXCIsIGN0cmwucG9zdHMoKS5tYXAoKHBvc3QsIHBvc3RQYWdlSW5kZXgpID0+IG0oXCJsaS5zdWJtaXNzaW9uLmNhcmQtcGFuZWwuaG92ZXJhYmxlXCIsIFtcclxuICAgICAgICAgIG0oXCJoM1wiLCBwb3N0LmZvcl9uYW1lKSxcclxuICAgICAgICAgIG0oXCIudm90ZS5sZWZ0XCIsIFtcclxuICAgICAgICAgICAgbShcImkuc21hbGwubWF0ZXJpYWwtaWNvbnNcIiwgXCJ0aHVtYl91cFwiKSxcclxuICAgICAgICAgICAgbShcImJyXCIpLFxyXG4gICAgICAgICAgICBtKFwiLmNvdW50LmNlbnRlci1hbGlnblwiLCBwb3N0LnZvdGVzKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwicC5mbG93LXRleHRcIiwgW3Bvc3QucG9zdCAsIG0oXCJhLnF1b3RlLWJ5W3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIix7b25jbGljazogKCkgPT4geyAkKCcjbWVzc2FnZS1tb2RhbCcpLm9wZW5Nb2RhbCgpfX0sIHBvc3QubmFtZSldKSxcclxuICAgICAgICAgIG0oXCJmb3JtXCIsIFtcclxuICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZFwiLCBbXHJcbiAgICAgICAgICAgICAgbShgdGV4dGFyZWEubWF0ZXJpYWxpemUtdGV4dGFyZWFbaWQ9J3Bvc3QtdGV4dGFyZWEtJHtwb3N0UGFnZUluZGV4fSddW2xlbmd0aD0nMTAwMCddYCksXHJcbiAgICAgICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LXRleHRhcmVhLSR7cG9zdFBhZ2VJbmRleH0nXWAsIFwiU3VibWl0IGEgY29tbWVudFwiKVxyXG4gICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgbShcIi5yb3dcIiwgW1xyXG4gICAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tOFwiLCBbXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgICAgbShgaW5wdXRbY2hlY2tlZD0nY2hlY2tlZCddW2lkPSdwb3N0LWFub24tJHtwb3N0UGFnZUluZGV4fSddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nbm8nXWApLFxyXG4gICAgICAgICAgICAgICAgICBtKGBsYWJlbFtmb3I9J3Bvc3QtYW5vbi0ke3Bvc3RQYWdlSW5kZXh9J11gLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICBtKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgICAgICAgbShgaW5wdXRbaWQ9J3Bvc3QtbmFtZS0ke3Bvc3RQYWdlSW5kZXh9J11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSd5ZXMnXWApLFxyXG4gICAgICAgICAgICAgICAgICBtKGBsYWJlbFtmb3I9J3Bvc3QtbmFtZS0ke3Bvc3RQYWdlSW5kZXh9J11gLCBcIlN1Ym1pdCB3aXRoIG5hbWVcIilcclxuICAgICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgbShcIi5jb2wuczEyLm00XCIsIFtcclxuICAgICAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdzdWJtaXQnXVwiLCBbXCJDb21tZW50XCIsIG0oXCJpLm1hdGVyaWFsLWljb25zLnJpZ2h0XCIsIFwiY2hhdF9idWJibGVcIildKVxyXG4gICAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICBdKSxcclxuICAgICAgICAgIG0oXCIuY29tbWVudHMtY29udGFpbmVyXCIsIHBvc3QuY29tbWVudHMubWFwKChjb21tZW50KSA9PiBtKFwiYmxvY2txdW90ZVwiLCBbY29tbWVudC5jb21tZW50LCBtKFwiYnJcIiksIG0oXCJhLnF1b3RlLWJ5W3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIix7b25jbGljazogKCkgPT4geyAkKCcjbWVzc2FnZS1tb2RhbCcpLm9wZW5Nb2RhbCgpfX0sIGNvbW1lbnQubmFtZSldKSkgICAgICAgICAgKVxyXG4gICAgICAgIF0pKVxyXG4gICAgICApXHJcbiAgICBdKSwgbShcImZvb3Rlci5wYWdlLWZvb3RlclwiLCBbXHJcbiAgICAgIG0oXCIuZm9vdGVyLWNvcHlyaWdodFwiLCBbXHJcbiAgICAgICAgbShcIi5jZW50ZXItYWxpZ24udmFsaWduXCIsIFwiwqkgMjAxNSBOaWNob2xhcyBBbnRvbm92ICYgQnJpYW4gWmF3aXphd2EgZm9yIENTNTQ2IGF0IFN0ZXZlbnNcIilcclxuICAgICAgXSlcclxuICAgIF0pLFxyXG4gICAgbG9nZ2VkSW4oKSA/IG5hdlBhbmVsIDogYXV0aGVudGljYXRlLFxyXG4gICAgbWVzc2FnZU1vZGFsXTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWFpbi5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5sZXQgbG9nZ2VkSW4gPSBtLnByb3AoZmFsc2UpO1xuY2hlY2soKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrICgpIHtcbiAgbS5yZXF1ZXN0KHtcbiAgIG1ldGhvZDogXCJHRVRcIixcbiAgIGRhdGFUeXBlOiAnanNvbicsXG4gICB1cmw6ICdjaGVja0xvZ2luLnBocCdcbiB9KS50aGVuKChkYXRhKSA9PiBsb2dnZWRJbihKU09OLnBhcnNlKGRhdGEpKSk7XG4gY29uc29sZS5sb2cobG9nZ2VkSW4oKSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgJC5wb3N0KCdsb2dvdXQucGhwJywgY2hlY2spO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbG9nZ2VkSW47XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3V0aWxpdHkvbG9naW4tY29udHJvbGxlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIG0oXCIubW9kYWxbaWQ9J21lc3NhZ2UtbW9kYWwnXVwiLCBbXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICBtKFwiaDRcIiwgXCJQcml2YXRlIE1lc3NhZ2VcIiksXG4gICAgICAgIG0oXCJmb3JtXCIsIFtcbiAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLm1lc3NhZ2UtdG9cIiwgW1xuICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2Rpc2FibGVkPScnXVtpZD0nZGlzYWJsZWQnXVt0eXBlPSd0ZXh0J11cIiksXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdkaXNhYmxlZCddXCIsIFwiUmVjaXBpZW50XCIpXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcIi5pbnB1dC1maWVsZFwiLCBbXG4gICAgICAgICAgICBtKFwidGV4dGFyZWEubWF0ZXJpYWxpemUtdGV4dGFyZWFbaWQ9J21lc3NhZ2UtdGV4dGFyZWEnXVtsZW5ndGg9JzEwMDAnXVwiKSxcbiAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J21lc3NhZ2UtdGV4dGFyZWEnXVwiLCBcIlNlbmQgYSBwcml2YXRlIG1lc3NhZ2UhXCIpXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcIi5yb3dcIiwgW1xuICAgICAgICAgICAgbShcIi5jb2wuczEyLm03XCIsIFtcbiAgICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgbShcImlucHV0W2NoZWNrZWQ9J2NoZWNrZWQnXVtpZD0nbWVzc2FnZS1hbm9uJ11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSdubyddXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J21lc3NhZ2UtYW5vbiddXCIsIFwiU3VibWl0IGFub255bW91c2x5XCIpXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXRbaWQ9J21lc3NhZ2UtbmFtZSddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0neWVzJ11cIiksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbWVzc2FnZS1uYW1lJ11cIiwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tNVwiLCBbXG4gICAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdzdWJtaXQnXVwiLCBbXCJTZW5kIFwiLG0oXCJpLm1hdGVyaWFsLWljb25zLnJpZ2h0XCIsIFwic2VuZFwiKV0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL21lc3NhZ2UtbW9kYWwuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHtsb2dvdXR9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tYm94LnotZGVwdGgtMicsIFtcbiAgICAgIG0oJ2EnLCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcIm1lc3NhZ2VcIilcbiAgICAgIF0pLFxuICAgICAgbSgnYScsIHtvbmNsaWNrOiBsb2dvdXR9LCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcInBvd2VyX3NldHRpbmdzX25ld1wiKVxuICAgICAgXSlcbiAgICBdKTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbmF2LXBhbmVsLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCByZWdpc3RlciBmcm9tICcuL3JlZ2lzdGVyJztcblxuaW1wb3J0IGxvZ2dlZEluLCB7Y2hlY2t9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tbW9kdWxlLWNvbnRhaW5lcicsIFtcbiAgICAgIG0oJy5sb2dpbi1ib3guei1kZXB0aC0yJywge29uY2xpY2s6ICgpID0+IHskKCcjY29tYm8tbW9kYWwnKS5vcGVuTW9kYWwoKTt9fSwgW1xuICAgICAgICBtKFwiYVwiLCBcIkxvZyBpbiAvIFJlZ2lzdGVyXCIpXG4gICAgICBdKSxcbiAgICAgIG0oXCIubW9kYWxbaWQ9J2NvbWJvLW1vZGFsJ11cIiwgW1xuICAgICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICAgIG0oXCJwXCIsIFwiVGhhbmtzIGZvciB1c2luZyB0aGlzIHNpdGUuIFRvIHByZXZlbnQgYWJ1c2UgYW5kIGFsbG93IGZvciBhIHJpY2ggZmVhdHVyZWQgZXhwZXJpZW5jZSwgdXNlcnMgYXJlIHJlcXVpcmVkIHRvIGxvZyBpbi4gRG9uJ3QgV29ycnkhIEFsbCB5b3VyIGluZm9ybWF0aW9uIHdpbGwgYmUga2VwdCBhbm9ueW1vdXMgYXMgbG9uZyBhcyB5b3UgY2hvb3NlIHRvIGtlZXAgaXQgdGhhdCB3YXkuXCIpXG4gICAgICAgIF0pLFxuICAgICAgICBtKFwiLm1vZGFsLWZvb3RlclwiLCBbXG4gICAgICAgICAgbShcImEubW9kYWwtYWN0aW9uLm1vZGFsLWNsb3NlLndhdmVzLWVmZmVjdC53YXZlcy1ncmVlbi5idG4tZmxhdC5sZWZ0XCIsIHtvbmNsaWNrOiAoKSA9PiB7JCgnI2xvZ2luLW1vZGFsJykub3Blbk1vZGFsKCk7fX0sIFwiTG9nIEluXCIpLFxuICAgICAgICAgIG0oXCJhLm1vZGFsLWFjdGlvbi5tb2RhbC1jbG9zZS53YXZlcy1lZmZlY3Qud2F2ZXMtZ3JlZW4uYnRuLWZsYXQubGVmdFwiLCB7b25jbGljazogKCkgPT4geyQoJyNyZWdpc3Rlci1tb2RhbCcpLm9wZW5Nb2RhbCgpO319LCBcIlJlZ2lzdGVyXCIpXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oXCIubW9kYWxbaWQ9J2xvZ2luLW1vZGFsJ11cIiwgW1xuICAgICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICAgIG0oXCJoNFwiLCBcIkxvZyBJblwiKSxcbiAgICAgICAgICBtKFwiZm9ybS5jb2wuczEyXCIsIFtcbiAgICAgICAgICAgIG0oXCIucm93XCIsIFtcbiAgICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5jb2wuczEyXCIsIFtcbiAgICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJlbWFpbFwiKSxcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQudmFsaWRhdGVbaWQ9J2xvZ2luLWVtYWlsJ11bdHlwZT0nZW1haWwnXVwiKSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdsb2dpbi1lbWFpbCddXCIsIFwiRW1haWxcIilcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbShcIi5yb3dcIiwgW1xuICAgICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnByZWZpeFwiLCBcImxvY2tfb3V0bGluZVwiKSxcbiAgICAgICAgICAgICAgICBtKFwiaW5wdXQudmFsaWRhdGVbaWQ9J2xvZ2luLXBhc3N3b3JkJ11bdHlwZT0ncGFzc3dvcmQnXVwiKSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdsb2dpbi1wYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIilcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSksXG4gICAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcbiAgICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LnJpZ2h0XCIsICBcIkxvZyBJblwiKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICByZWdpc3RlclxuICAgIF0pO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9hdXRoZW50aWNhdGUuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IGxvZ2dlZEluLCB7Y2hlY2t9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG5hbWUgPSBtLnByb3AoJycpLFxuICAgICAgcGFzc3dvcmQgPSBtLnByb3AoJycpLFxuICAgICAgcGFzc3dvcmRDb25maXJtYXRpb24gPSBtLnByb3AoJycpLFxuICAgICAgZW1haWwgPSBtLnByb3AoJycpLFxuICAgICAgZWxlbWVudCA9IG0ucHJvcCgpO1xuXG4gICAgICBmdW5jdGlvbiByZWdpc3RlciAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIG5vbkpzb25FcnJvcnMgKHhocikge1xuICAgICAgICAgIHJldHVybiB4aHIuc3RhdHVzID4gMjAwID8gSlNPTi5zdHJpbmdpZnkoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhc3N3b3JkKCkgIT09IHBhc3N3b3JkQ29uZmlybWF0aW9uKCkpIHtcbiAgICAgICAgICBhbGVydChcInBhc3N3b3JkcyBkbyBub3QgbWF0Y2hcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtZW50KCkuY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJ3JlZ2lzdGVyLnBocCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBuYW1lOiBuYW1lKCksXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCgpLFxuICAgICAgICAgICAgICBlbWFpbDogZW1haWwoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGNoZWNrXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBwYXNzd29yZENvbmZpcm1hdGlvbixcbiAgICAgIGVtYWlsLFxuICAgICAgcmVnaXN0ZXIsXG4gICAgICBlbGVtZW50XG4gICAgfVxuICB9LFxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKFwiLm1vZGFsW2lkPSdyZWdpc3Rlci1tb2RhbCddXCIsIFtcbiAgICAgIG0oXCIubW9kYWwtY29udGVudFwiLCBbXG4gICAgICAgIG0oXCJoNFwiLCBcIlJlZ2lzdGVyXCIpLFxuICAgICAgICBtKFwiZm9ybS5jb2wuczEyXCIsIHtjb25maWc6IGN0cmwuZWxlbWVudH0sIFtcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJhY2NvdW50X2NpcmNsZVwiKSxcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSduYW1lJ11bcmVxdWlyZWQ9JyddW3BhdHRlcm49LisgLitdW3R5cGU9J3RleHQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLm5hbWUpLCB2YWx1ZTogY3RybC5uYW1lKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbmFtZSddXCIsIFwiTmFtZVwiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0ncGFzc3dvcmQnXVtyZXF1aXJlZD0nJ11bdHlwZT0ncGFzc3dvcmQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLnBhc3N3b3JkKSwgdmFsdWU6IGN0cmwucGFzc3dvcmQoKX0pLFxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdwYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIilcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcIi5yb3dcIiwgW1xuICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5jb2wuczEyXCIsIFtcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwibG9ja19vdXRsaW5lXCIpLFxuICAgICAgICAgICAgICBtKFwiaW5wdXQudmFsaWRhdGVbaWQ9J2NvbmZpcm0tcGFzc3dvcmQnXVtyZXF1aXJlZD0nJ11bdHlwZT0ncGFzc3dvcmQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLnBhc3N3b3JkQ29uZmlybWF0aW9uKSwgdmFsdWU6IGN0cmwucGFzc3dvcmRDb25maXJtYXRpb24oKX0pLFxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdjb25maXJtLXBhc3N3b3JkJ11cIiwgXCJDb25maXJtIFBhc3N3b3JkXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIucm93XCIsIFtcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXG4gICAgICAgICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnByZWZpeFwiLCBcImVtYWlsXCIpLFxuICAgICAgICAgICAgICBtKFwiaW5wdXQudmFsaWRhdGVbaWQ9J2VtYWlsJ11bcmVxdWlyZWQ9JyddW3R5cGU9J2VtYWlsJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5lbWFpbCksIHZhbHVlOiBjdHJsLmVtYWlsKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nZW1haWwnXVwiLCBcIkVtYWlsXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcbiAgICAgICAgbShcImEubW9kYWwtYWN0aW9uLm1vZGFsLWNsb3NlLndhdmVzLWVmZmVjdC53YXZlcy1ncmVlbi5idG4tZmxhdC5yaWdodFwiLCB7b25jbGljazogY3RybC5yZWdpc3Rlcn0sIFwiUmVnaXN0ZXJcIilcbiAgICAgIF0pXG4gICAgXSk7XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3JlZ2lzdGVyLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==