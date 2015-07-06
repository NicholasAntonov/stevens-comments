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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _mainPage = __webpack_require__(3);
	
	var _mainPage2 = _interopRequireDefault(_mainPage);
	
	var _messages = __webpack_require__(16);
	
	var _messages2 = _interopRequireDefault(_messages);
	
	$(document).ready(function () {
	  _mithril2['default'].route(document.body, '/', {
	    '/': _mainPage2['default'],
	    '/messages': _messages2['default']
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
	
	var _utilityMessageController = __webpack_require__(4);
	
	var _wrapper = __webpack_require__(5);
	
	var _wrapper2 = _interopRequireDefault(_wrapper);
	
	var _postBox = __webpack_require__(13);
	
	var _postBox2 = _interopRequireDefault(_postBox);
	
	var _post = __webpack_require__(14);
	
	var _post2 = _interopRequireDefault(_post);
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return [_mithril2['default'].component(_wrapper2['default'], { main: (0, _mithril2['default'])('main.container', [_postBox2['default'], (0, _mithril2['default'])('ul', (0, _utilityMessageController.posts)().map(function (post, postPageIndex) {
	        return (0, _mithril2['default'])('li', _mithril2['default'].component(_post2['default'], { post: post, postPageIndex: postPageIndex }));
	      })), (0, _mithril2['default'])('.mode-switcher.z-depth-2', [(0, _mithril2['default'])('a.waves-effect.waves-green.btn-flat' + ((0, _utilityMessageController.sortingByTop)() ? '.green.lighten-2' : ''), { onclick: _utilityMessageController.sortByTop }, 'Top'), (0, _mithril2['default'])('a.waves-effect.waves-green.btn-flat' + ((0, _utilityMessageController.sortingByTop)() ? '' : '.green.lighten-2'), { onclick: _utilityMessageController.sortByNew }, 'New')])]) })];
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
	exports.sortByNew = sortByNew;
	exports.sortByTop = sortByTop;
	exports.updatePosts = updatePosts;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var posts = _mithril2['default'].prop([]);
	
	exports.posts = posts;
	var sortingByTop = _mithril2['default'].prop(false);
	
	exports.sortingByTop = sortingByTop;
	
	function sortByNew() {
	  sortingByTop(false);
	  updatePosts();
	}
	
	;
	
	function sortByTop() {
	  sortingByTop(true);
	  updatePosts();
	}
	
	;
	
	function updatePosts() {
	  var data = {
	    comments: 10
	  };
	
	  if (sortingByTop()) {
	    data.top = true;
	  }
	
	  console.log('updating posts with');
	  console.log(data);
	
	  _mithril2['default'].request({
	    method: 'GET',
	    url: 'api/post.php',
	    data: data
	  }).then(function (data) {
	    console.log('updated and recieved');
	    console.log(data);
	    posts(data);
	  });
	}
	
	;
	
	sortByNew();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(6);
	
	var _messageModal = __webpack_require__(10);
	
	var _messageModal2 = _interopRequireDefault(_messageModal);
	
	var _navPanel = __webpack_require__(12);
	
	var _navPanel2 = _interopRequireDefault(_navPanel);
	
	var _authenticate = __webpack_require__(7);
	
	var _authenticate2 = _interopRequireDefault(_authenticate);
	
	exports['default'] = {
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('.body', [(0, _mithril2['default'])('header', [(0, _mithril2['default'])('nav.top-nav', [(0, _mithril2['default'])('h1.center-align', { onclick: function onclick() {
	        return _mithril2['default'].route('/');
	      } }, 'Stevens Compliments and Crushes')])]), args.main, (0, _mithril2['default'])('footer.page-footer', [(0, _mithril2['default'])('.footer-copyright', [(0, _mithril2['default'])('.center-align.valign', '© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens')])]), (0, _utilityLoginController.loggedIn)() ? _navPanel2['default'] : _authenticate2['default'], _messageModal2['default']]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.login = login;
	exports.check = check;
	exports.attempt = attempt;
	exports.logout = logout;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _messageController = __webpack_require__(4);
	
	var _authenticate = __webpack_require__(7);
	
	var loggedIn = _mithril2['default'].prop(false);
	exports.loggedIn = loggedIn;
	check();
	
	function login(element, email, password) {
	  if (element.checkValidity()) {
	    $.ajax({
	      type: 'POST',
	      url: 'api/login.php',
	      dataType: 'json',
	      data: {
	        password: password,
	        email: email
	      },
	      success: check
	    });
	  }
	}
	
	;
	
	function check() {
	  _mithril2['default'].request({
	    method: 'GET',
	    dataType: 'json',
	    url: 'api/checkLogin.php'
	  }).then(function (data) {
	    loggedIn(JSON.parse(data));
	    (0, _messageController.updatePosts)();
	  });
	}
	
	;
	
	function attempt(func) {
	  var args = Array.prototype.slice.call(arguments, 1);
	  return function () {
	    loggedIn() ? func.apply(null, args) : (0, _authenticate.openAuthentication)();
	  };
	}
	
	function logout() {
	  $.post('api/logout.php', check);
	}
	
	;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.openAuthentication = openAuthentication;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _register = __webpack_require__(8);
	
	var _register2 = _interopRequireDefault(_register);
	
	var _login = __webpack_require__(9);
	
	var _login2 = _interopRequireDefault(_login);
	
	var _utilityLoginController = __webpack_require__(6);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	function openAuthentication() {
	  $('#combo-modal').openModal();
	}
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-module-container', [(0, _mithril2['default'])('.login-box.z-depth-2', { onclick: openAuthentication }, [(0, _mithril2['default'])('a', 'Log in / Register')]), (0, _mithril2['default'])('.modal[id=\'combo-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('p', 'Welcome to Stevens Compliments and Crushes. To prevent abuse and allow for a rich fully-featured experience, users are required to log in. Don\'t Worry! All your information will be kept anonymous.')]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#login-modal').openModal();
	      } }, 'Log In'), (0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#register-modal').openModal();
	      } }, 'Register')])]), _login2['default'], _register2['default']]);
	  }
	};

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
	
	var _utilityLoginController = __webpack_require__(6);
	
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
	          url: 'api/register.php',
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(6);
	
	exports['default'] = {
	  controller: function controller() {
	    var password = _mithril2['default'].prop(''),
	        email = _mithril2['default'].prop(''),
	        element = _mithril2['default'].prop();
	
	    return {
	      password: password,
	      email: email,
	      element: element
	    };
	  },
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.modal[id=\'login-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Log In'), (0, _mithril2['default'])('form.col.s12', { config: ctrl.element }, [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'login-email\'][required=\'\'][type=\'email\']', { onchange: _mithril2['default'].withAttr('value', ctrl.email), value: ctrl.email() }), (0, _mithril2['default'])('label[for=\'login-email\']', 'Email')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'login-password\'][required=\'\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.password), value: ctrl.password() }), (0, _mithril2['default'])('label[for=\'login-password\']', 'Password')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', { onclick: function onclick() {
	        return (0, _utilityLoginController.login)(ctrl.element(), ctrl.email(), ctrl.password());
	      } }, 'Log In')])]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.openMessageModal = openMessageModal;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityBind = __webpack_require__(11);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	var target = _mithril2['default'].prop();
	
	function openMessageModal(recipient) {
	  target(recipient);
	  $('#message-modal').openModal();
	}
	
	exports['default'] = {
	  controller: function controller() {
	    var content = _mithril2['default'].prop(''),
	        showName = _mithril2['default'].prop(false);
	
	    function send() {
	      $.ajax({
	        type: 'POST',
	        url: 'api/message.php',
	        dataType: 'json',
	        data: {
	          to: target(),
	          message: content(),
	          showName: showName()
	        },
	        success: function success() {
	          Materialize.toast('Message sent!', 4000);
	          content('');
	          $('#message-modal').closeModal();
	        },
	        error: (function (_error) {
	          function error() {
	            return _error.apply(this, arguments);
	          }
	
	          error.toString = function () {
	            return _error.toString();
	          };
	
	          return error;
	        })(function () {
	          return console.log(error.responseText);
	        })
	      });
	    }
	
	    return {
	      send: send,
	      content: content,
	      showName: showName
	    };
	  },
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.modal[id=\'message-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Private Message'), (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'message-textarea\'][length=\'1000\']', (0, _utilityBind2['default'])(ctrl.content)), (0, _mithril2['default'])('label[for=\'message-textarea\']', 'Send a private message!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m7', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'message-anon\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'message-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'message-name\'][name=\'named\'][type=\'radio\'][value=\'yes\']', { onchange: _mithril2['default'].withAttr('checked', ctrl.showName) }), (0, _mithril2['default'])('label[for=\'message-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m5', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'button\']', { onclick: ctrl.send }, ['Send ', (0, _mithril2['default'])('i.material-icons.right', 'send')])])])])])]);
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	exports["default"] = function (prop) {
	  return { onchange: _mithril2["default"].withAttr("value", prop), value: prop() };
	};
	
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(6);
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-box.z-depth-2', [(0, _mithril2['default'])('a', { onclick: function onclick() {
	        return _mithril2['default'].route('/messages');
	      } }, [(0, _mithril2['default'])('i.material-icons.side-icon', 'message')]), (0, _mithril2['default'])('a', { onclick: _utilityLoginController.logout }, [(0, _mithril2['default'])('i.material-icons.side-icon', 'power_settings_new')])]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityMessageController = __webpack_require__(4);
	
	var _utilityLoginController = __webpack_require__(6);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	var _utilityBind = __webpack_require__(11);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	exports['default'] = {
	  controller: function controller() {
	    var showName = _mithril2['default'].prop(0),
	        forName = _mithril2['default'].prop(''),
	        content = _mithril2['default'].prop(''),
	        element = _mithril2['default'].prop();
	
	    function post() {
	      if (element().checkValidity()) {
	        $.ajax({
	          type: 'POST',
	          url: 'api/userPost.php',
	          dataType: 'json',
	          data: {
	            post: content(),
	            for_name: forName(),
	            showName: showName()
	          },
	          success: function success() {
	            (0, _utilityMessageController.updatePosts)();
	          },
	          error: function error(_error) {
	            return console.log(_error.responseText);
	          }
	        });
	      }
	    }
	
	    return {
	      forName: forName,
	      content: content,
	      showName: showName,
	      element: element,
	      post: post
	    };
	  },
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('form.card-panel.hoverable', { config: ctrl.element }, [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('input[id=\'post-title\'][type=\'text\'][placeholder=\'Who are you complimenting?\']', (0, _utilityBind2['default'])(ctrl.forName)), (0, _mithril2['default'])('label[for=\'post-title\']')]), (0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea\'][length=\'1000\']', (0, _utilityBind2['default'])(ctrl.content)), (0, _mithril2['default'])('label[for=\'post-textarea\']', 'Submit a post!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon\'][name=\'named\'][type=\'radio\'][value=\'0\']'), (0, _mithril2['default'])('label[for=\'post-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name\'][name=\'named\'][type=\'radio\'][value=\'1\']', { onchange: _mithril2['default'].withAttr('checked', ctrl.showName) }), (0, _mithril2['default'])('label[for=\'post-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light.right[name=\'action\'][type=\'button\']', { onclick: (0, _utilityLoginController.attempt)(ctrl.post) }, ['Post', (0, _mithril2['default'])('i.material-icons.right', 'message')])])])]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityBind = __webpack_require__(11);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	var _utilityLoginController = __webpack_require__(6);
	
	var _messageModal = __webpack_require__(10);
	
	var _utilityMessageController = __webpack_require__(4);
	
	var _comment = __webpack_require__(15);
	
	var _comment2 = _interopRequireDefault(_comment);
	
	exports['default'] = {
	  controller: function controller(args) {
	
	    var commentText = _mithril2['default'].prop(''),
	        showName = _mithril2['default'].prop(0);
	
	    function deletePost() {
	      $.ajax({
	        type: 'POST',
	        url: 'api/userPost.php',
	        dataType: 'json',
	        data: {
	          'delete': args.post.p_id
	        },
	        success: function success() {
	          (0, _utilityMessageController.updatePosts)();
	        },
	        error: (function (_error) {
	          function error() {
	            return _error.apply(this, arguments);
	          }
	
	          error.toString = function () {
	            return _error.toString();
	          };
	
	          return error;
	        })(function () {
	          return console.log(error.responseText);
	        })
	      });
	    }
	
	    function submitComment() {
	      $.ajax({
	        type: 'POST',
	        url: 'api/comment.php',
	        dataType: 'json',
	        data: {
	          p_id: args.post.p_id,
	          comment: commentText(),
	          showName: showName()
	        },
	        success: function success() {
	          (0, _utilityMessageController.updatePosts)();
	        },
	        error: (function (_error2) {
	          function error() {
	            return _error2.apply(this, arguments);
	          }
	
	          error.toString = function () {
	            return _error2.toString();
	          };
	
	          return error;
	        })(function () {
	          return console.log(error.responseText);
	        })
	      });
	    }
	
	    function vote() {
	      if (args.post.value !== '1') {
	        $.ajax({
	          type: 'POST',
	          url: 'api/votePost.php',
	          dataType: 'json',
	          data: {
	            p_id: args.post.p_id,
	            up: true
	          },
	          success: function success() {
	            console.log('upvoting');
	            (0, _utilityMessageController.updatePosts)();
	          },
	          error: (function (_error3) {
	            function error() {
	              return _error3.apply(this, arguments);
	            }
	
	            error.toString = function () {
	              return _error3.toString();
	            };
	
	            return error;
	          })(function () {
	            return console.log(error.responseText);
	          })
	        });
	      }
	    }
	
	    return {
	      commentText: commentText,
	      deletePost: deletePost,
	      submitComment: submitComment,
	      showName: showName,
	      vote: vote
	    };
	  },
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('article.submission.card-panel.hoverable', [(0, _mithril2['default'])('h3', args.post.for_name), (0, _mithril2['default'])('aside.vote.left' + (args.post.value === '1' ? '.voted' : ''), [(0, _mithril2['default'])('i.small.material-icons', { onclick: (0, _utilityLoginController.attempt)(ctrl.vote) }, 'thumb_up'), (0, _mithril2['default'])('br'), (0, _mithril2['default'])('.count.center-align', args.post.votes)]), (0, _mithril2['default'])('.post-body', [(0, _mithril2['default'])('p.flow-text', [args.post.post, (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: (0, _utilityLoginController.attempt)(_messageModal.openMessageModal, args.post.ownage_id) }, args.post.name)])]), args.post.u_id !== -1 ? (0, _mithril2['default'])('button.btn.waves-effect.waves-light.red.right.tight[type=\'button\']', { onclick: ctrl.deletePost }, ['', (0, _mithril2['default'])('i.material-icons', 'delete')]) : '', (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea-' + args.postPageIndex + '\'][length=\'1000\']', (0, _utilityBind2['default'])(ctrl.commentText)), (0, _mithril2['default'])('label[for=\'post-textarea-' + args.postPageIndex + '\']', { onclick: ctrl.submitComment }, 'Submit a comment')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon-' + args.postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'post-anon-' + args.postPageIndex + '\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name-' + args.postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'yes\']', { onchange: _mithril2['default'].withAttr('checked', ctrl.showName) }), (0, _mithril2['default'])('label[for=\'post-name-' + args.postPageIndex + '\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light.right[name=\'action\'][type=\'button\']', { onclick: (0, _utilityLoginController.attempt)(ctrl.submitComment) }, ['Comment', (0, _mithril2['default'])('i.material-icons.right', 'chat_bubble_outline')])])])]), (0, _mithril2['default'])('.comments-container', args.post.comments.map(function (comment) {
	      return _mithril2['default'].component(_comment2['default'], { comment: comment, post: args.post });
	    }))]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityMessageController = __webpack_require__(4);
	
	var _messageModal = __webpack_require__(10);
	
	var _utilityLoginController = __webpack_require__(6);
	
	exports['default'] = {
	  controller: function controller(args) {
	
	    function deleteComment() {
	      $.ajax({
	        type: 'POST',
	        url: 'api/comment.php',
	        dataType: 'json',
	        data: {
	          'delete': args.comment.c_id
	        },
	        success: function success() {
	          (0, _utilityMessageController.updatePosts)();
	        },
	        error: function error(_error) {
	          return console.log(_error.responseText);
	        }
	      });
	    }
	
	    return {
	      deleteComment: deleteComment
	    };
	  },
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('blockquote', [args.comment.u_id !== -1 ? (0, _mithril2['default'])('button.btn.waves-effect.waves-light.red.right.tight[type=\'button\']', { onclick: ctrl.deleteComment }, ['', (0, _mithril2['default'])('i.material-icons', 'delete')]) : '', args.comment.comment, (0, _mithril2['default'])('br'), (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: (0, _utilityLoginController.attempt)(_messageModal.openMessageModal, args.comment.ownage_id) }, args.comment.name)]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _wrapper = __webpack_require__(5);
	
	var _wrapper2 = _interopRequireDefault(_wrapper);
	
	var _message = __webpack_require__(17);
	
	var _message2 = _interopRequireDefault(_message);
	
	exports['default'] = {
	  controller: function controller(args) {
	    var messages = _mithril2['default'].prop([]);
	
	    _mithril2['default'].request({
	      method: 'GET',
	      url: 'api/message.php',
	      data: {
	        start: 0,
	        count: 10
	      }
	    }).then(messages);
	
	    return {
	      messages: messages
	    };
	  },
	  view: function view(ctrl) {
	    return [_mithril2['default'].component(_wrapper2['default'], { main: (0, _mithril2['default'])('main.container', [(0, _mithril2['default'])('ul', ctrl.messages().map(function (message) {
	        return _mithril2['default'].component(_message2['default'], { message: message });
	      }))]) })];
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityBind = __webpack_require__(11);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	var _messageModal = __webpack_require__(10);
	
	var _utilityLoginController = __webpack_require__(6);
	
	exports['default'] = {
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('article.submission.card-panel.hoverable', [(0, _mithril2['default'])('.post-body', [(0, _mithril2['default'])('p.flow-text', [args.message.message, (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: (0, _utilityLoginController.attempt)(_messageModal.openMessageModal, args.message.ownage_id) }, args.message.name)])])]);
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjBkYTYwYzJkZDNlYjIwNjIzMmMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL34vd2VicGFjay9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9tYWluLXBhZ2UuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvdXRpbGl0eS9tZXNzYWdlLWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvd3JhcHBlci5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvYXV0aGVudGljYXRlLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3JlZ2lzdGVyLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2xvZ2luLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL21lc3NhZ2UtbW9kYWwuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvdXRpbGl0eS9iaW5kLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL25hdi1wYW5lbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9wb3N0LWJveC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9wb3N0LmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2NvbW1lbnQuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZXMuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7b0NDdENjLENBQVM7Ozs7cUNBRU4sQ0FBYTs7OztxQ0FDVCxFQUFZOzs7O0FBRWpDLEVBQUMsQ0FBRSxRQUFRLENBQUUsQ0FBQyxLQUFLLENBQUMsWUFBTTtBQUN4Qix3QkFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDMUIsUUFBRyx1QkFBTTtBQUNULGdCQUFXLHVCQUFVO0lBQ3RCLENBQUMsQ0FBQztFQUNKLENBQUMsQzs7Ozs7Ozs7QUNWRixLQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDeEMsTUFBSSxNQUFNLEdBQUcsaUJBQWlCO01BQUUsS0FBSyxHQUFHLGdCQUFnQjtNQUFFLE1BQU0sR0FBRyxpQkFBaUI7TUFBRSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQzVHLE1BQUksSUFBSSxHQUFHLElBQUUsQ0FBQyxRQUFRLENBQUM7QUFDdkIsTUFBSSxNQUFNLEdBQUcsc0NBQXNDO01BQUUsVUFBVSxHQUFHLDhCQUE4QixDQUFDO0FBQ2pHLE1BQUksWUFBWSxHQUFHLHlGQUF5RixDQUFDO0FBQzdHLE1BQUks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RSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO0FBQzFELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsV0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLElBQUksRUFBRTtPQUNyRztBQUNELFlBQUs7TUFDTDtLQUNEOztBQUVELFFBQUksd0JBQXdCLEVBQUU7QUFDN0IsU0FBSSxVQUFVLEdBQUcsS0FBSztBQUN0QixTQUFJLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsSUFBSSxNQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzRixVQUFJLFVBQVUsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNyRixpQkFBVSxHQUFHLElBQUk7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LENBQUMsQ0FDakksQ0FBQyxDQUNILENBQUMsQ0FDSCxDQUFDO0lBQ0g7RUFDRiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGIwZGE2MGMyZGQzZWIyMDYyMzJjXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQgbWFpbiBmcm9tICcuL21haW4tcGFnZSc7XHJcbmltcG9ydCBtZXNzYWdlcyBmcm9tICcuL21lc3NhZ2VzJztcclxuXHJcbiQoIGRvY3VtZW50ICkucmVhZHkoKCkgPT4ge1xyXG4gIG0ucm91dGUoZG9jdW1lbnQuYm9keSwgJy8nLCB7XHJcbiAgICAnLyc6IG1haW4sXHJcbiAgICAnL21lc3NhZ2VzJzogbWVzc2FnZXNcclxuICB9KTtcclxufSlcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9pbmRleC5qc1xuICoqLyIsInZhciBtID0gKGZ1bmN0aW9uIGFwcCh3aW5kb3csIHVuZGVmaW5lZCkge1xyXG5cdHZhciBPQkpFQ1QgPSBcIltvYmplY3QgT2JqZWN0XVwiLCBBUlJBWSA9IFwiW29iamVjdCBBcnJheV1cIiwgU1RSSU5HID0gXCJbb2JqZWN0IFN0cmluZ11cIiwgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCI7XHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2csIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge31cclxuXHJcblx0Ly8gY2FjaGluZyBjb21tb25seSB1c2VkIHZhcmlhYmxlc1xyXG5cdHZhciAkZG9jdW1lbnQsICRsb2NhdGlvbiwgJHJlcXVlc3RBbmltYXRpb25GcmFtZSwgJGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xyXG5cclxuXHQvLyBzZWxmIGludm9raW5nIGZ1bmN0aW9uIG5lZWRlZCBiZWNhdXNlIG9mIHRoZSB3YXkgbW9ja3Mgd29ya1xyXG5cdGZ1bmN0aW9uIGluaXRpYWxpemUod2luZG93KXtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1RhZ30gVGhlIERPTSBub2RlIHRhZ1xyXG5cdCAqIEBwYXJhbSB7T2JqZWN0PVtdfSBvcHRpb25hbCBrZXktdmFsdWUgcGFpcnMgdG8gYmUgbWFwcGVkIHRvIERPTSBhdHRyc1xyXG5cdCAqIEBwYXJhbSB7Li4ubU5vZGU9W119IFplcm8gb3IgbW9yZSBNaXRocmlsIGNoaWxkIG5vZGVzLiBDYW4gYmUgYW4gYXJyYXksIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIG0oKSB7XHJcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdHZhciBoYXNBdHRycyA9IGFyZ3NbMV0gIT0gbnVsbCAmJiB0eXBlLmNhbGwoYXJnc1sxXSkgPT09IE9CSkVDVCAmJiAhKFwidGFnXCIgaW4gYXJnc1sxXSB8fCBcInZpZXdcIiBpbiBhcmdzWzFdKSAmJiAhKFwic3VidHJlZVwiIGluIGFyZ3NbMV0pO1xyXG5cdFx0dmFyIGF0dHJzID0gaGFzQXR0cnMgPyBhcmdzWzFdIDoge307XHJcblx0XHR2YXIgY2xhc3NBdHRyTmFtZSA9IFwiY2xhc3NcIiBpbiBhdHRycyA/IFwiY2xhc3NcIiA6IFwiY2xhc3NOYW1lXCI7XHJcblx0XHR2YXIgY2VsbCA9IHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7fX07XHJcblx0XHR2YXIgbWF0Y2gsIGNsYXNzZXMgPSBbXTtcclxuXHRcdGlmICh0eXBlLmNhbGwoYXJnc1swXSkgIT0gU1RSSU5HKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKVxyXG5cdFx0d2hpbGUgKG1hdGNoID0gcGFyc2VyLmV4ZWMoYXJnc1swXSkpIHtcclxuXHRcdFx0aWYgKG1hdGNoWzFdID09PSBcIlwiICYmIG1hdGNoWzJdKSBjZWxsLnRhZyA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIGNlbGwuYXR0cnMuaWQgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiLlwiKSBjbGFzc2VzLnB1c2gobWF0Y2hbMl0pO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcclxuXHRcdFx0XHR2YXIgcGFpciA9IGF0dHJQYXJzZXIuZXhlYyhtYXRjaFszXSk7XHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgKHBhaXJbMl0gPyBcIlwiIDp0cnVlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDIpIDogYXJncy5zbGljZSgxKTtcclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgdHlwZS5jYWxsKGNoaWxkcmVuWzBdKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuWzBdXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKVxyXG5cdFx0XHRcdFx0Y2VsbC5hdHRyc1thdHRyTmFtZV0gPSBcIlwiIC8vY3JlYXRlIGtleSBpbiBjb3JyZWN0IGl0ZXJhdGlvbiBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGNlbGwuYXR0cnNbY2xhc3NBdHRyTmFtZV0gPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gY2VsbFxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIHBhcmVudENhY2hlLCBwYXJlbnRJbmRleCwgZGF0YSwgY2FjaGVkLCBzaG91bGRSZWF0dGFjaCwgaW5kZXgsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdC8vYGJ1aWxkYCBpcyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgY3JlYXRpb24vZGlmZmluZy9yZW1vdmFsIG9mIERPTSBlbGVtZW50cyBiYXNlZCBvbiBjb21wYXJpc29uIGJldHdlZW4gYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly90aGUgZGlmZiBhbGdvcml0aG0gY2FuIGJlIHN1bW1hcml6ZWQgYXMgdGhpczpcclxuXHRcdC8vMSAtIGNvbXBhcmUgYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly8yIC0gaWYgdGhleSBhcmUgZGlmZmVyZW50LCBjb3B5IGBkYXRhYCB0byBgY2FjaGVkYCBhbmQgdXBkYXRlIHRoZSBET00gYmFzZWQgb24gd2hhdCB0aGUgZGlmZmVyZW5jZSBpc1xyXG5cdFx0Ly8zIC0gcmVjdXJzaXZlbHkgYXBwbHkgdGhpcyBhbGdvcml0aG0gZm9yIGV2ZXJ5IGFycmF5IGFuZCBmb3IgdGhlIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91cyByZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLCBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhcyBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZSBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYSBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhIHZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy4gVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmUgbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmcgZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhcyByZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdCByZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXMgY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duIGZyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdCBgYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZCBkYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXggaW1wbGljaXQgYW5kIGV4cGxpY2l0IHJldHVybiBzdGF0ZW1lbnRzIChlLmcuIGZ1bmN0aW9uIGZvbygpIHtpZiAoY29uZCkgcmV0dXJuIG0oXCJkaXZcIil9XHJcblx0XHQvLy0gaXQgc2ltcGxpZmllcyBkaWZmaW5nIGNvZGVcclxuXHRcdC8vZGF0YS50b1N0cmluZygpIG1pZ2h0IHRocm93IG9yIHJldHVybiBudWxsIGlmIGRhdGEgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiBDb25zb2xlLmxvZyBpbiBGaXJlZm94IChiZWhhdmlvciBkZXBlbmRzIG9uIHZlcnNpb24pXHJcblx0XHR0cnkge2lmIChkYXRhID09IG51bGwgfHwgZGF0YS50b1N0cmluZygpID09IG51bGwpIGRhdGEgPSBcIlwiO30gY2F0Y2ggKGUpIHtkYXRhID0gXCJcIn1cclxuXHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHR2YXIgY2FjaGVkVHlwZSA9IHR5cGUuY2FsbChjYWNoZWQpLCBkYXRhVHlwZSA9IHR5cGUuY2FsbChkYXRhKTtcclxuXHRcdGlmIChjYWNoZWQgPT0gbnVsbCB8fCBjYWNoZWRUeXBlICE9PSBkYXRhVHlwZSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAocGFyZW50Q2FjaGUgJiYgcGFyZW50Q2FjaGUubm9kZXMpIHtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IG9mZnNldCArIChkYXRhVHlwZSA9PT0gQVJSQVkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSBjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcjtcclxuXHRcdFx0aWYgKGNhY2hlZC50YWcpIGNhY2hlZCA9IHt9OyAvL2lmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXMgdGhlIGJhc2UgY2FjaGVkIG5vZGUgaW5zdGVhZCBvZiBjb3B5aW5nIHRoZSB2aXJ0dWFsIGVsICgjMjc3KVxyXG5cdFx0XHRjYWNoZWQubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhVHlwZSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Ly9yZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhW2ldKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdC5hcHBseShbXSwgZGF0YSk7XHJcblx0XHRcdFx0XHRpLS0gLy9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdFx0bGVuID0gZGF0YS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBub2RlcyA9IFtdLCBpbnRhY3QgPSBjYWNoZWQubGVuZ3RoID09PSBkYXRhLmxlbmd0aCwgc3ViQXJyYXlDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdFx0Ly8xKSBjcmVhdGUgYSBtYXAgb2YgYWxsIGV4aXN0aW5nIGtleXMsIGFuZCBtYXJrIGFsbCBmb3IgZGVsZXRpb25cclxuXHRcdFx0Ly8yKSBhZGQgbmV3IGtleXMgdG8gbWFwIGFuZCBtYXJrIHRoZW0gZm9yIGFkZGl0aW9uXHJcblx0XHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0XHQvLzQpIGZvciBlYWNoIGtleSwgaGFuZGxlIGl0cyBjb3JyZXNwb25kaW5nIGFjdGlvbiBhcyBtYXJrZWQgaW4gcHJldmlvdXMgc3RlcHNcclxuXHRcdFx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiAsIE1PVkUgPSAzO1xyXG5cdFx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGVkLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSAmJiBjYWNoZWRbaV0uYXR0cnMgJiYgY2FjaGVkW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXhpc3RpbmdbY2FjaGVkW2ldLmF0dHJzLmtleV0gPSB7YWN0aW9uOiBERUxFVElPTiwgaW5kZXg6IGl9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgZ3VpZCA9IDBcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzICYmIGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2pdICYmIGRhdGFbal0uYXR0cnMgJiYgZGF0YVtqXS5hdHRycy5rZXkgPT0gbnVsbCkgZGF0YVtqXS5hdHRycy5rZXkgPSBcIl9fbWl0aHJpbF9fXCIgKyBndWlkKytcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzKSB7XHJcblx0XHRcdFx0dmFyIGtleXNEaWZmZXIgPSBmYWxzZVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCAhPSBjYWNoZWQubGVuZ3RoKSBrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdGVsc2UgZm9yICh2YXIgaSA9IDAsIGNhY2hlZENlbGwsIGRhdGFDZWxsOyBjYWNoZWRDZWxsID0gY2FjaGVkW2ldLCBkYXRhQ2VsbCA9IGRhdGFbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZENlbGwuYXR0cnMgJiYgZGF0YUNlbGwuYXR0cnMgJiYgY2FjaGVkQ2VsbC5hdHRycy5rZXkgIT0gZGF0YUNlbGwuYXR0cnMua2V5KSB7XHJcblx0XHRcdFx0XHRcdGtleXNEaWZmZXIgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChrZXlzRGlmZmVyKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXkgPSBkYXRhW2ldLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghZXhpc3Rpbmdba2V5XSkgZXhpc3Rpbmdba2V5XSA9IHthY3Rpb246IElOU0VSVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBleGlzdGluZ1trZXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4OiBpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcm9tOiBleGlzdGluZ1trZXldLmluZGV4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHwgJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBhY3Rpb25zID0gW11cclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3AgaW4gZXhpc3RpbmcpIGFjdGlvbnMucHVzaChleGlzdGluZ1twcm9wXSlcclxuXHRcdFx0XHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKTtcclxuXHRcdFx0XHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aClcclxuXHRcdFx0XHRcdG5ld0NhY2hlZC5ub2RlcyA9IGNhY2hlZC5ub2Rlcy5zbGljZSgpXHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoYW5nZTsgY2hhbmdlID0gY2hhbmdlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBERUxFVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZFtjaGFuZ2UuaW5kZXhdLm5vZGVzLCBjYWNoZWRbY2hhbmdlLmluZGV4XSk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDEpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZHVtbXksIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAwLCB7YXR0cnM6IHtrZXk6IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXl9LCBub2RlczogW2R1bW15XX0pXHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBkdW1teVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSAhPT0gY2hhbmdlLmVsZW1lbnQgJiYgY2hhbmdlLmVsZW1lbnQgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWRbY2hhbmdlLmluZGV4XSA9IGNhY2hlZFtjaGFuZ2UuZnJvbV1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGNoYW5nZS5lbGVtZW50XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IG5ld0NhY2hlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9lbmQga2V5IGFsZ29yaXRobVxyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNhY2hlQ291bnQgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0Ly9kaWZmIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcclxuXHRcdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGlmIChpdGVtID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghaXRlbS5ub2Rlcy5pbnRhY3QpIGludGFjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHQvL2ZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZSB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0XHRcdC8vdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0XHRcdHN1YkFycmF5Q291bnQgKz0gKGl0ZW0ubWF0Y2goLzxbXlxcL118XFw+XFxzKltePF0vZykgfHwgWzBdKS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzdWJBcnJheUNvdW50ICs9IHR5cGUuY2FsbChpdGVtKSA9PT0gQVJSQVkgPyBpdGVtLmxlbmd0aCA6IDE7XHJcblx0XHRcdFx0Y2FjaGVkW2NhY2hlQ291bnQrK10gPSBpdGVtXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFpbnRhY3QpIHtcclxuXHRcdFx0XHQvL2RpZmYgdGhlIGFycmF5IGl0c2VsZlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vdXBkYXRlIHRoZSBsaXN0IG9mIERPTSBub2RlcyBieSBjb2xsZWN0aW5nIHRoZSBub2RlcyBmcm9tIGVhY2ggaXRlbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkW2ldICE9IG51bGwpIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIGNhY2hlZFtpXS5ub2RlcylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9yZW1vdmUgaXRlbXMgZnJvbSB0aGUgZW5kIG9mIHRoZSBhcnJheSBpZiB0aGUgbmV3IGFycmF5IGlzIHNob3J0ZXIgdGhhbiB0aGUgb2xkIG9uZVxyXG5cdFx0XHRcdC8vaWYgZXJyb3JzIGV2ZXIgaGFwcGVuIGhlcmUsIHRoZSBpc3N1ZSBpcyBtb3N0IGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBzb21ld2hlcmUgZWFybGllciBpbiB0aGUgcHJvZ3JhbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBub2RlOyBub2RlID0gY2FjaGVkLm5vZGVzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChub2RlLnBhcmVudE5vZGUgIT0gbnVsbCAmJiBub2Rlcy5pbmRleE9mKG5vZGUpIDwgMCkgY2xlYXIoW25vZGVdLCBbY2FjaGVkW2ldXSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoIDwgY2FjaGVkLmxlbmd0aCkgY2FjaGVkLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEgIT0gbnVsbCAmJiBkYXRhVHlwZSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdHZhciB2aWV3cyA9IFtdLCBjb250cm9sbGVycyA9IFtdXHJcblx0XHRcdHdoaWxlIChkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHR2YXIgdmlldyA9IGRhdGEudmlldy4kb3JpZ2luYWwgfHwgZGF0YS52aWV3XHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXJJbmRleCA9IG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLnZpZXdzID8gY2FjaGVkLnZpZXdzLmluZGV4T2YodmlldykgOiAtMVxyXG5cdFx0XHRcdHZhciBjb250cm9sbGVyID0gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWQuY29udHJvbGxlcnNbY29udHJvbGxlckluZGV4XSA6IG5ldyAoZGF0YS5jb250cm9sbGVyIHx8IG5vb3ApXHJcblx0XHRcdFx0dmFyIGtleSA9IGRhdGEgJiYgZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLmtleVxyXG5cdFx0XHRcdGRhdGEgPSBwZW5kaW5nUmVxdWVzdHMgPT0gMCB8fCAoY2FjaGVkICYmIGNhY2hlZC5jb250cm9sbGVycyAmJiBjYWNoZWQuY29udHJvbGxlcnMuaW5kZXhPZihjb250cm9sbGVyKSA+IC0xKSA/IGRhdGEudmlldyhjb250cm9sbGVyKSA6IHt0YWc6IFwicGxhY2Vob2xkZXJcIn1cclxuXHRcdFx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0XHRcdGlmIChrZXkpIHtcclxuXHRcdFx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9XHJcblx0XHRcdFx0XHRkYXRhLmF0dHJzLmtleSA9IGtleVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KVxyXG5cdFx0XHRcdHZpZXdzLnB1c2godmlldylcclxuXHRcdFx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFkYXRhLnRhZyAmJiBjb250cm9sbGVycy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge307XHJcblx0XHRcdGlmICghY2FjaGVkLmF0dHJzKSBjYWNoZWQuYXR0cnMgPSB7fTtcclxuXHJcblx0XHRcdHZhciBkYXRhQXR0cktleXMgPSBPYmplY3Qua2V5cyhkYXRhLmF0dHJzKVxyXG5cdFx0XHR2YXIgaGFzS2V5cyA9IGRhdGFBdHRyS2V5cy5sZW5ndGggPiAoXCJrZXlcIiBpbiBkYXRhLmF0dHJzID8gMSA6IDApXHJcblx0XHRcdC8vaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdFx0aWYgKGRhdGEudGFnICE9IGNhY2hlZC50YWcgfHwgZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT0gT2JqZWN0LmtleXMoY2FjaGVkLmF0dHJzKS5zb3J0KCkuam9pbigpIHx8IGRhdGEuYXR0cnMuaWQgIT0gY2FjaGVkLmF0dHJzLmlkIHx8IGRhdGEuYXR0cnMua2V5ICE9IGNhY2hlZC5hdHRycy5rZXkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJhbGxcIiAmJiAoIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZSkpIHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiA9PT0gZmFsc2UpKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2Rlcyk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKClcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhLnRhZykgIT0gU1RSSU5HKSByZXR1cm47XHJcblxyXG5cdFx0XHR2YXIgbm9kZSwgaXNOZXcgPSBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwO1xyXG5cdFx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgbmFtZXNwYWNlID0gZGF0YS5hdHRycy54bWxucztcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwic3ZnXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwibWF0aFwiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRcdGlmIChkYXRhLmF0dHJzLmlzKSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZywgZGF0YS5hdHRycy5pcykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHRcdFx0XHRjYWNoZWQgPSB7XHJcblx0XHRcdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRcdFx0Ly9zZXQgYXR0cmlidXRlcyBmaXJzdCwgdGhlbiBjcmVhdGUgY2hpbGRyZW5cclxuXHRcdFx0XHRcdGF0dHJzOiBoYXNLZXlzID8gc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywge30sIG5hbWVzcGFjZSkgOiBkYXRhLmF0dHJzLFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDAgP1xyXG5cdFx0XHRcdFx0XHRidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgdHJ1ZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykgOlxyXG5cdFx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkXHJcblx0XHRcdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCA9IG9udW5sb2FkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdFx0XHQvL2VkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuIGV4aXN0LCBzbyBzZXQgaXQgYWdhaW4gYWZ0ZXIgY2hpbGRyZW4gaGF2ZSBiZWVuIGNyZWF0ZWRcclxuXHRcdFx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIHt2YWx1ZTogZGF0YS5hdHRycy52YWx1ZX0sIHt9LCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0XHRcdGlmIChoYXNLZXlzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCBjYWNoZWQuYXR0cnMsIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIGZhbHNlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vc2NoZWR1bGUgY29uZmlncyB0byBiZSBjYWxsZWQuIFRoZXkgYXJlIGNhbGxlZCBhZnRlciBgYnVpbGRgIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEsIGFyZ3MpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnNbXCJjb25maWdcIl0uYXBwbHkoZGF0YSwgYXJncylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNvbmZpZ3MucHVzaChjYWxsYmFjayhkYXRhLCBbbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWRdKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEgIT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Ly9oYW5kbGUgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbm9kZXM7XHJcblx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFwic3RyaW5nIG51bWJlciBib29sZWFuXCIuaW5kZXhPZih0eXBlb2YgZGF0YSkgPiAtMSA/IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpIDogZGF0YTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC52YWx1ZU9mKCkgIT09IGRhdGEudmFsdWVPZigpIHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRcdFx0aWYgKCFlZGl0YWJsZSB8fCBlZGl0YWJsZSAhPT0gJGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSBwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZWRpdGFibGUpIGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7IC8vd2FzIGEgdHJ1c3RlZCBzdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZXNbMF0ubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikge3JldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4fVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly9gY29uZmlnYCBpc24ndCBhIHJlYWwgYXR0cmlidXRlcywgc28gaWdub3JlIGl0XHJcblx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT0gXCJrZXlcIikgY29udGludWU7XHJcblx0XHRcdFx0XHQvL2hvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGFBdHRyID09PSBGVU5DVElPTiAmJiBhdHRyTmFtZS5pbmRleE9mKFwib25cIikgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBhdXRvcmVkcmF3KGRhdGFBdHRyLCBub2RlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJiB0eXBlLmNhbGwoZGF0YUF0dHIpID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gY2FjaGVkQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKHJ1bGUgaW4gZGF0YUF0dHIpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBTVkdcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJocmVmXCIpIG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIFwiaHJlZlwiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0XHQvLy0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET00gZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdFx0XHQvLy0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpcyB1c2VkIGFzIGEgc3RyaW5nLCBidXQgaXQncyBhbiBvYmplY3QgaW4ganNcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgIShhdHRyTmFtZSA9PT0gXCJsaXN0XCIgfHwgYXR0ck5hbWUgPT09IFwic3R5bGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJmb3JtXCIgfHwgYXR0ck5hbWUgPT09IFwidHlwZVwiIHx8IGF0dHJOYW1lID09PSBcIndpZHRoXCIgfHwgYXR0ck5hbWUgPT09IFwiaGVpZ2h0XCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIzM0OCBkb24ndCBzZXQgdGhlIHZhbHVlIGlmIG5vdCBuZWVkZWQgb3RoZXJ3aXNlIGN1cnNvciBwbGFjZW1lbnQgYnJlYWtzIGluIENocm9tZVxyXG5cdFx0XHRcdFx0XHRpZiAodGFnICE9PSBcImlucHV0XCIgfHwgbm9kZVthdHRyTmFtZV0gIT09IGRhdGFBdHRyKSBub2RlW2F0dHJOYW1lXSA9IGRhdGFBdHRyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8vc3dhbGxvdyBJRSdzIGludmFsaWQgYXJndW1lbnQgZXJyb3JzIHRvIG1pbWljIEhUTUwncyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdFx0aWYgKGUubWVzc2FnZS5pbmRleE9mKFwiSW52YWxpZCBhcmd1bWVudFwiKSA8IDApIHRocm93IGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8jMzQ4IGRhdGFBdHRyIG1heSBub3QgYmUgYSBzdHJpbmcsIHNvIHVzZSBsb29zZSBjb21wYXJpc29uIChkb3VibGUgZXF1YWwpIGluc3RlYWQgb2Ygc3RyaWN0ICh0cmlwbGUgZXF1YWwpXHJcblx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInZhbHVlXCIgJiYgdGFnID09PSBcImlucHV0XCIgJiYgbm9kZS52YWx1ZSAhPSBkYXRhQXR0cikge1xyXG5cdFx0XHRcdG5vZGUudmFsdWUgPSBkYXRhQXR0clxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXIobm9kZXMsIGNhY2hlZCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IG5vZGVzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XHJcblx0XHRcdGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdFx0dHJ5IHtub2Rlc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGVzW2ldKX1cclxuXHRcdFx0XHRjYXRjaCAoZSkge30gLy9pZ25vcmUgaWYgdGhpcyBmYWlscyBkdWUgdG8gb3JkZXIgb2YgZXZlbnRzIChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0pIHVubG9hZChjYWNoZWRbaV0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChub2Rlcy5sZW5ndGggIT0gMCkgbm9kZXMubGVuZ3RoID0gMFxyXG5cdH1cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4pIHtcclxuXHRcdFx0aWYgKHR5cGUuY2FsbChjYWNoZWQuY2hpbGRyZW4pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjYWNoZWQuY2hpbGRyZW5baV07IGkrKykgdW5sb2FkKGNoaWxkKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHVubG9hZChjYWNoZWQuY2hpbGRyZW4pXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpIHtcclxuXHRcdHZhciBuZXh0U2libGluZyA9IHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF07XHJcblx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0dmFyIGlzRWxlbWVudCA9IG5leHRTaWJsaW5nLm5vZGVUeXBlICE9IDE7XHJcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHRcdFx0aWYgKGlzRWxlbWVudCkge1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBuZXh0U2libGluZyB8fCBudWxsKTtcclxuXHRcdFx0XHRwbGFjZWhvbGRlci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgbmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSlcclxuXHRcdH1cclxuXHRcdGVsc2UgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgZGF0YSk7XHJcblx0XHR2YXIgbm9kZXMgPSBbXTtcclxuXHRcdHdoaWxlIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdICE9PSBuZXh0U2libGluZykge1xyXG5cdFx0XHRub2Rlcy5wdXNoKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0XHRpbmRleCsrXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXNcclxuXHR9XHJcblx0ZnVuY3Rpb24gYXV0b3JlZHJhdyhjYWxsYmFjaywgb2JqZWN0KSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0dHJ5IHtyZXR1cm4gY2FsbGJhY2suY2FsbChvYmplY3QsIGUpfVxyXG5cdFx0XHRmaW5hbGx5IHtcclxuXHRcdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSAkZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRcdHRoaXMuY2hpbGROb2RlcyA9ICRkb2N1bWVudC5jaGlsZE5vZGVzXHJcblx0XHR9LFxyXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobm9kZSlcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLCBjZWxsQ2FjaGUgPSB7fTtcclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPSBcImh0bWxcIikgY2VsbCA9IHt0YWc6IFwiaHRtbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBjZWxsfTtcclxuXHRcdGlmIChjZWxsQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIGNsZWFyKG5vZGUuY2hpbGROb2Rlcyk7XHJcblx0XHRpZiAoZm9yY2VSZWNyZWF0aW9uID09PSB0cnVlKSByZXNldChyb290KTtcclxuXHRcdGNlbGxDYWNoZVtpZF0gPSBidWlsZChub2RlLCBudWxsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2VsbCwgY2VsbENhY2hlW2lkXSwgZmFsc2UsIDAsIG51bGwsIHVuZGVmaW5lZCwgY29uZmlncyk7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gY29uZmlncy5sZW5ndGg7IGkgPCBsZW47IGkrKykgY29uZmlnc1tpXSgpXHJcblx0fTtcclxuXHRmdW5jdGlvbiBnZXRDZWxsQ2FjaGVLZXkoZWxlbWVudCkge1xyXG5cdFx0dmFyIGluZGV4ID0gbm9kZUNhY2hlLmluZGV4T2YoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gaW5kZXggPCAwID8gbm9kZUNhY2hlLnB1c2goZWxlbWVudCkgLSAxIDogaW5kZXhcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldHRlcnNldHRlcihzdG9yZSkge1xyXG5cdFx0dmFyIHByb3AgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHN0b3JlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cHJvcC50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cclxuXHRtLnByb3AgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuXHRcdC8vbm90ZTogdXNpbmcgbm9uLXN0cmljdCBlcXVhbGl0eSBjaGVjayBoZXJlIGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgaWYgc3RvcmUgaXMgbnVsbCBPUiB1bmRlZmluZWRcclxuXHRcdGlmICgoKHN0b3JlICE9IG51bGwgJiYgdHlwZS5jYWxsKHN0b3JlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2Ygc3RvcmUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2Ygc3RvcmUudGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkoc3RvcmUpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGdldHRlcnNldHRlcihzdG9yZSlcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSwgY29tcG9uZW50cyA9IFtdLCBjb250cm9sbGVycyA9IFtdLCBsYXN0UmVkcmF3SWQgPSBudWxsLCBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwLCBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHByZXZlbnRlZCA9IGZhbHNlLCB0b3BDb21wb25lbnQsIHVubG9hZGVycyA9IFtdO1xyXG5cdHZhciBGUkFNRV9CVURHRVQgPSAxNjsgLy82MCBmcmFtZXMgcGVyIHNlY29uZCA9IDEgY2FsbCBwZXIgMTYgbXNcclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBhcmdzKSB7XHJcblx0XHR2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IHRoaXNcclxuXHRcdH1cclxuXHRcdHZhciB2aWV3ID0gZnVuY3Rpb24oY3RybCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIGFyZ3MgPSBhcmdzLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGFyZ3MgPyBbY3RybF0uY29uY2F0KGFyZ3MpIDogW2N0cmxdKVxyXG5cdFx0fVxyXG5cdFx0dmlldy4kb3JpZ2luYWwgPSBjb21wb25lbnQudmlld1xyXG5cdFx0dmFyIG91dHB1dCA9IHtjb250cm9sbGVyOiBjb250cm9sbGVyLCB2aWV3OiB2aWV3fVxyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9XHJcblx0XHRyZXR1cm4gb3V0cHV0XHJcblx0fVxyXG5cdG0uY29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50KSB7XHJcblx0XHRyZXR1cm4gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdH1cclxuXHRtLm1vdW50ID0gbS5tb2R1bGUgPSBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgZXhpc3RzIGJlZm9yZSByZW5kZXJpbmcgYSB0ZW1wbGF0ZSBpbnRvIGl0LlwiKTtcclxuXHRcdHZhciBpbmRleCA9IHJvb3RzLmluZGV4T2Yocm9vdCk7XHJcblx0XHRpZiAoaW5kZXggPCAwKSBpbmRleCA9IHJvb3RzLmxlbmd0aDtcclxuXHRcdFxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdHVubG9hZGVyLmhhbmRsZXIuY2FsbCh1bmxvYWRlci5jb250cm9sbGVyLCBldmVudClcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyXHJcblx0XHR9XHJcblx0XHRlbHNlIHVubG9hZGVycyA9IFtdXHJcblx0XHRcclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgdHlwZW9mIGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoIWlzUHJldmVudGVkKSB7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiYWxsXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cm9vdHNbaW5kZXhdID0gcm9vdDtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSBjb21wb25lbnQgPSBzdWJjb21wb25lbnQoY29tcG9uZW50LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpXHJcblx0XHRcdHZhciBjdXJyZW50Q29tcG9uZW50ID0gdG9wQ29tcG9uZW50ID0gY29tcG9uZW50ID0gY29tcG9uZW50IHx8IHtjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9fTtcclxuXHRcdFx0dmFyIGNvbnN0cnVjdG9yID0gY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcFxyXG5cdFx0XHR2YXIgY29udHJvbGxlciA9IG5ldyBjb25zdHJ1Y3RvcjtcclxuXHRcdFx0Ly9jb250cm9sbGVycyBtYXkgY2FsbCBtLm1vdW50IHJlY3Vyc2l2ZWx5ICh2aWEgbS5yb3V0ZSByZWRpcmVjdHMsIGZvciBleGFtcGxlKVxyXG5cdFx0XHQvL3RoaXMgY29uZGl0aW9uYWwgZW5zdXJlcyBvbmx5IHRoZSBsYXN0IHJlY3Vyc2l2ZSBtLm1vdW50IGNhbGwgaXMgYXBwbGllZFxyXG5cdFx0XHRpZiAoY3VycmVudENvbXBvbmVudCA9PT0gdG9wQ29tcG9uZW50KSB7XHJcblx0XHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdID0gY29udHJvbGxlcjtcclxuXHRcdFx0XHRjb21wb25lbnRzW2luZGV4XSA9IGNvbXBvbmVudFxyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXJzW2luZGV4XVxyXG5cdFx0fVxyXG5cdH07XHJcblx0dmFyIHJlZHJhd2luZyA9IGZhbHNlXHJcblx0bS5yZWRyYXcgPSBmdW5jdGlvbihmb3JjZSkge1xyXG5cdFx0aWYgKHJlZHJhd2luZykgcmV0dXJuXHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlXHJcblx0XHQvL2xhc3RSZWRyYXdJZCBpcyBhIHBvc2l0aXZlIG51bWJlciBpZiBhIHNlY29uZCByZWRyYXcgaXMgcmVxdWVzdGVkIGJlZm9yZSB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWVcclxuXHRcdC8vbGFzdFJlZHJhd0lEIGlzIG51bGwgaWYgaXQncyB0aGUgZmlyc3QgcmVkcmF3IGFuZCBub3QgYW4gZXZlbnQgaGFuZGxlclxyXG5cdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiBmb3JjZSAhPT0gdHJ1ZSkge1xyXG5cdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdC8vd2hlbiByQUY6IGFsd2F5cyByZXNjaGVkdWxlIHJlZHJhd1xyXG5cdFx0XHRpZiAoJHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBuZXcgRGF0ZSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCkge1xyXG5cdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhdywgRlJBTUVfQlVER0VUKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmVkcmF3KCk7XHJcblx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7bGFzdFJlZHJhd0lkID0gbnVsbH0sIEZSQU1FX0JVREdFVClcclxuXHRcdH1cclxuXHRcdHJlZHJhd2luZyA9IGZhbHNlXHJcblx0fTtcclxuXHRtLnJlZHJhdy5zdHJhdGVneSA9IG0ucHJvcCgpO1xyXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcclxuXHRcdGlmIChjb21wdXRlUHJlUmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vaygpXHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHJvb3Q7IHJvb3QgPSByb290c1tpXTsgaSsrKSB7XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gY29tcG9uZW50c1tpXS5jb250cm9sbGVyICYmIGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MgPyBbY29udHJvbGxlcnNbaV1dLmNvbmNhdChjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzKSA6IFtjb250cm9sbGVyc1tpXV1cclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnRzW2ldLnZpZXcgPyBjb21wb25lbnRzW2ldLnZpZXcoY29udHJvbGxlcnNbaV0sIGFyZ3MpIDogXCJcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9hZnRlciByZW5kZXJpbmcgd2l0aGluIGEgcm91dGVkIGNvbnRleHQsIHdlIG5lZWQgdG8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKCk7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGxhc3RSZWRyYXdJZCA9IG51bGw7XHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZTtcclxuXHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7cGVuZGluZ1JlcXVlc3RzKyt9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdHBlbmRpbmdSZXF1ZXN0cyA9IE1hdGgubWF4KHBlbmRpbmdSZXF1ZXN0cyAtIDEsIDApO1xyXG5cdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCkgbS5yZWRyYXcoKVxyXG5cdH07XHJcblx0dmFyIGVuZEZpcnN0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2socHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9O1xyXG5cdHZhciByZWRpcmVjdCA9IG5vb3AsIHJvdXRlUGFyYW1zLCBjdXJyZW50Um91dGUsIGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZS5jYWxsKGFyZ3VtZW50c1sxXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgcm9vdCA9IGFyZ3VtZW50c1swXSwgZGVmYXVsdFJvdXRlID0gYXJndW1lbnRzWzFdLCByb3V0ZXIgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IHRydWVcclxuXHRcdFx0XHRcdG0ucm91dGUoZGVmYXVsdFJvdXRlLCB0cnVlKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGxpc3RlbmVyID0gbS5yb3V0ZS5tb2RlID09PSBcImhhc2hcIiA/IFwib25oYXNoY2hhbmdlXCIgOiBcIm9ucG9wc3RhdGVcIjtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT0gbm9ybWFsaXplUm91dGUocGF0aCkpIHtcclxuXHRcdFx0XHRcdHJlZGlyZWN0KHBhdGgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpXHJcblx0XHR9XHJcblx0XHQvL2NvbmZpZzogbS5yb3V0ZVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzWzBdLmFkZEV2ZW50TGlzdGVuZXIgfHwgYXJndW1lbnRzWzBdLmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgaXNJbml0aWFsaXplZCA9IGFyZ3VtZW50c1sxXTtcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHZhciB2ZG9tID0gYXJndW1lbnRzWzNdO1xyXG5cdFx0XHRlbGVtZW50LmhyZWYgPSAobS5yb3V0ZS5tb2RlICE9PSAncGF0aG5hbWUnID8gJGxvY2F0aW9uLnBhdGhuYW1lIDogJycpICsgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIHZkb20uYXR0cnMuaHJlZjtcclxuXHRcdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9tLnJvdXRlKHJvdXRlLCBwYXJhbXMsIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkpXHJcblx0XHRlbHNlIGlmICh0eXBlLmNhbGwoYXJndW1lbnRzWzBdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciBvbGRSb3V0ZSA9IGN1cnJlbnRSb3V0ZTtcclxuXHRcdFx0Y3VycmVudFJvdXRlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50c1sxXSB8fCB7fVxyXG5cdFx0XHR2YXIgcXVlcnlJbmRleCA9IGN1cnJlbnRSb3V0ZS5pbmRleE9mKFwiP1wiKVxyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9XHJcblx0XHRcdGZvciAodmFyIGkgaW4gYXJncykgcGFyYW1zW2ldID0gYXJnc1tpXVxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcylcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlXHJcblx0XHRcdGlmIChxdWVyeXN0cmluZykgY3VycmVudFJvdXRlID0gY3VycmVudFBhdGggKyAoY3VycmVudFBhdGguaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgKyBxdWVyeXN0cmluZztcclxuXHJcblx0XHRcdHZhciBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyBhcmd1bWVudHNbMl0gOiBhcmd1bWVudHNbMV0pID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSBhcmd1bWVudHNbMF07XHJcblxyXG5cdFx0XHRpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XHJcblx0XHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5W3Nob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIl0obnVsbCwgJGRvY3VtZW50LnRpdGxlLCBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGVcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRtLnJvdXRlLnBhcmFtID0gZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRpZiAoIXJvdXRlUGFyYW1zKSB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBjYWxsIG0ucm91dGUoZWxlbWVudCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIGJlZm9yZSBjYWxsaW5nIG0ucm91dGUucGFyYW0oKVwiKVxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV1cclxuXHR9O1xyXG5cdG0ucm91dGUubW9kZSA9IFwic2VhcmNoXCI7XHJcblx0ZnVuY3Rpb24gbm9ybWFsaXplUm91dGUocm91dGUpIHtcclxuXHRcdHJldHVybiByb3V0ZS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aClcclxuXHR9XHJcblx0ZnVuY3Rpb24gcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkge1xyXG5cdFx0cm91dGVQYXJhbXMgPSB7fTtcclxuXHJcblx0XHR2YXIgcXVlcnlTdGFydCA9IHBhdGguaW5kZXhPZihcIj9cIik7XHJcblx0XHRpZiAocXVlcnlTdGFydCAhPT0gLTEpIHtcclxuXHRcdFx0cm91dGVQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc3Vic3RyKHF1ZXJ5U3RhcnQgKyAxLCBwYXRoLmxlbmd0aCkpO1xyXG5cdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIoMCwgcXVlcnlTdGFydClcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKTtcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKTtcclxuXHRcdGlmKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXIpIHtcclxuXHRcdFx0aWYgKHJvdXRlID09PSBwYXRoKSB7XHJcblx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC86W15cXC9dKz9cXC57M30vZywgXCIoLio/KVwiKS5yZXBsYWNlKC86W15cXC9dKy9nLCBcIihbXlxcXFwvXSspXCIpICsgXCJcXC8/JFwiKTtcclxuXHJcblx0XHRcdGlmIChtYXRjaGVyLnRlc3QocGF0aCkpIHtcclxuXHRcdFx0XHRwYXRoLnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIga2V5cyA9IHJvdXRlLm1hdGNoKC86W15cXC9dKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSwgLTIpO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHJvdXRlUGFyYW1zW2tleXNbaV0ucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSlcclxuXHRcdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm47XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcblx0XHR2YXIgYXJncyA9IG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiICYmIGN1cnJlbnRUYXJnZXQuc2VhcmNoID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50VGFyZ2V0LnNlYXJjaC5zbGljZSgxKSkgOiB7fTtcclxuXHRcdHdoaWxlIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPSBcIkFcIikgY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZVxyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBzZXRTY3JvbGwoKSB7XHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlICE9IFwiaGFzaFwiICYmICRsb2NhdGlvbi5oYXNoKSAkbG9jYXRpb24uaGFzaCA9ICRsb2NhdGlvbi5oYXNoO1xyXG5cdFx0ZWxzZSB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhvYmplY3QsIHByZWZpeCkge1xyXG5cdFx0dmFyIGR1cGxpY2F0ZXMgPSB7fVxyXG5cdFx0dmFyIHN0ciA9IFtdXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xyXG5cdFx0XHR2YXIga2V5ID0gcHJlZml4ID8gcHJlZml4ICsgXCJbXCIgKyBwcm9wICsgXCJdXCIgOiBwcm9wXHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXVxyXG5cdFx0XHR2YXIgdmFsdWVUeXBlID0gdHlwZS5jYWxsKHZhbHVlKVxyXG5cdFx0XHR2YXIgcGFpciA9ICh2YWx1ZSA9PT0gbnVsbCkgPyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBPQkpFQ1QgPyBidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IEFSUkFZID8gdmFsdWUucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIGl0ZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldKSBkdXBsaWNhdGVzW2tleV0gPSB7fVxyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV1baXRlbV0pIHtcclxuXHRcdFx0XHRcdFx0ZHVwbGljYXRlc1trZXldW2l0ZW1dID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVtby5jb25jYXQoZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChpdGVtKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBtZW1vXHJcblx0XHRcdFx0fSwgW10pLmpvaW4oXCImXCIpIDpcclxuXHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkgc3RyLnB1c2gocGFpcilcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHIuam9pbihcIiZcIilcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhaXJzID0gc3RyLnNwbGl0KFwiJlwiKSwgcGFyYW1zID0ge307XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dmFyIHBhaXIgPSBwYWlyc1tpXS5zcGxpdChcIj1cIik7XHJcblx0XHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXSlcclxuXHRcdFx0dmFyIHZhbHVlID0gcGFpci5sZW5ndGggPT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKSA6IG51bGxcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAodHlwZS5jYWxsKHBhcmFtc1trZXldKSAhPT0gQVJSQVkpIHBhcmFtc1trZXldID0gW3BhcmFtc1trZXldXVxyXG5cdFx0XHRcdHBhcmFtc1trZXldLnB1c2godmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cdG0ucm91dGUuYnVpbGRRdWVyeVN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmdcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXHJcblx0XHJcblx0ZnVuY3Rpb24gcmVzZXQocm9vdCkge1xyXG5cdFx0dmFyIGNhY2hlS2V5ID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0Y2xlYXIocm9vdC5jaGlsZE5vZGVzLCBjZWxsQ2FjaGVbY2FjaGVLZXldKTtcclxuXHRcdGNlbGxDYWNoZVtjYWNoZUtleV0gPSB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkXHJcblx0fTtcclxuXHRmdW5jdGlvbiBwcm9waWZ5KHByb21pc2UsIGluaXRpYWxWYWx1ZSkge1xyXG5cdFx0dmFyIHByb3AgPSBtLnByb3AoaW5pdGlhbFZhbHVlKTtcclxuXHRcdHByb21pc2UudGhlbihwcm9wKTtcclxuXHRcdHByb3AudGhlbiA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSwgaW5pdGlhbFZhbHVlKVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cdC8vUHJvbWl6Lm1pdGhyaWwuanMgfCBab2xtZWlzdGVyIHwgTUlUXHJcblx0Ly9hIG1vZGlmaWVkIHZlcnNpb24gb2YgUHJvbWl6LmpzLCB3aGljaCBkb2VzIG5vdCBjb25mb3JtIHRvIFByb21pc2VzL0ErIGZvciB0d28gcmVhc29uczpcclxuXHQvLzEpIGB0aGVuYCBjYWxsYmFja3MgYXJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IChiZWNhdXNlIHNldFRpbWVvdXQgaXMgdG9vIHNsb3csIGFuZCB0aGUgc2V0SW1tZWRpYXRlIHBvbHlmaWxsIGlzIHRvbyBiaWdcclxuXHQvLzIpIHRocm93aW5nIHN1YmNsYXNzZXMgb2YgRXJyb3IgY2F1c2UgdGhlIGVycm9yIHRvIGJlIGJ1YmJsZWQgdXAgaW5zdGVhZCBvZiB0cmlnZ2VyaW5nIHJlamVjdGlvbiAoYmVjYXVzZSB0aGUgc3BlYyBkb2VzIG5vdCBhY2NvdW50IGZvciB0aGUgaW1wb3J0YW50IHVzZSBjYXNlIG9mIGRlZmF1bHQgYnJvd3NlciBlcnJvciBoYW5kbGluZywgaS5lLiBtZXNzYWdlIHcvIGxpbmUgbnVtYmVyKVxyXG5cdGZ1bmN0aW9uIERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHR2YXIgUkVTT0xWSU5HID0gMSwgUkVKRUNUSU5HID0gMiwgUkVTT0xWRUQgPSAzLCBSRUpFQ1RFRCA9IDQ7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsIHN0YXRlID0gMCwgcHJvbWlzZVZhbHVlID0gMCwgbmV4dCA9IFtdO1xyXG5cclxuXHRcdHNlbGZbXCJwcm9taXNlXCJdID0ge307XHJcblxyXG5cdFx0c2VsZltcInJlc29sdmVcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGZbXCJyZWplY3RcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJvbWlzZVtcInRoZW5cIl0gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spO1xyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRuZXh0LnB1c2goZGVmZXJyZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmluaXNoKHR5cGUpIHtcclxuXHRcdFx0c3RhdGUgPSB0eXBlIHx8IFJFSkVDVEVEO1xyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbihkZWZlcnJlZCkge1xyXG5cdFx0XHRcdHN0YXRlID09PSBSRVNPTFZFRCAmJiBkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSkgfHwgZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0aGVubmFibGUodGhlbiwgc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIG5vdFRoZW5uYWJsZUNhbGxiYWNrKSB7XHJcblx0XHRcdGlmICgoKHByb21pc2VWYWx1ZSAhPSBudWxsICYmIHR5cGUuY2FsbChwcm9taXNlVmFsdWUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBwcm9taXNlVmFsdWUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2YgdGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly8gY291bnQgcHJvdGVjdHMgYWdhaW5zdCBhYnVzZSBjYWxscyBmcm9tIHNwZWMgY2hlY2tlclxyXG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0XHRcdHRoZW4uY2FsbChwcm9taXNlVmFsdWUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzdWNjZXNzQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGVDYWxsYmFjaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlblxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0cmV0dXJuIGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiB0eXBlb2Ygc3VjY2Vzc0NhbGxiYWNrID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiB0eXBlb2YgZmFpbHVyZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZmFpbHVyZUNhbGxiYWNrKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkgdGhyb3cgZVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCI7XHJcblx0XHRcdFx0aWYgKC0tb3V0c3RhbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnByb21pc2UocmVzdWx0cyk7XHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGg7XHJcblx0XHR2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShvdXRzdGFuZGluZyk7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGFyZ3NbaV0udGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7cmV0dXJuIHZhbHVlfVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBjYWxsYmFja0tleSA9IFwibWl0aHJpbF9jYWxsYmFja19cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikpLnRvU3RyaW5nKDM2KTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe2Vycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJ9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybFxyXG5cdFx0XHRcdCsgKG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpXHJcblx0XHRcdFx0KyAob3B0aW9ucy5jYWxsYmFja0tleSA/IG9wdGlvbnMuY2FsbGJhY2tLZXkgOiBcImNhbGxiYWNrXCIpXHJcblx0XHRcdFx0KyBcIj1cIiArIGNhbGxiYWNrS2V5XHJcblx0XHRcdFx0KyBcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KTtcclxuXHRcdFx0JGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRcdGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSBvcHRpb25zLm9ubG9hZCh7dHlwZTogXCJsb2FkXCIsIHRhcmdldDogeGhyfSk7XHJcblx0XHRcdFx0XHRlbHNlIG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpZyA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgbWF5YmVYaHIgPSBvcHRpb25zLmNvbmZpZyh4aHIsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdGlmIChtYXliZVhociAhPSBudWxsKSB4aHIgPSBtYXliZVhoclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblx0XHRcdGlmIChkYXRhICYmICh0eXBlLmNhbGwoZGF0YSkgIT0gU1RSSU5HICYmIGRhdGEuY29uc3RydWN0b3IgIT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0cmV0dXJuIHhoclxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBiaW5kRGF0YSh4aHJPcHRpb25zLCBkYXRhLCBzZXJpYWxpemUpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiB4aHJPcHRpb25zLmRhdGFUeXBlICE9IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgcHJlZml4ID0geGhyT3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIjtcclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhkYXRhKTtcclxuXHRcdFx0eGhyT3B0aW9ucy51cmwgPSB4aHJPcHRpb25zLnVybCArIChxdWVyeXN0cmluZyA/IHByZWZpeCArIHF1ZXJ5c3RyaW5nIDogXCJcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplVXJsKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHRva2VucyA9IHVybC5tYXRjaCgvOlthLXpdXFx3Ky9naSk7XHJcblx0XHRpZiAodG9rZW5zICYmIGRhdGEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2Vuc1tpXSwgZGF0YVtrZXldKTtcclxuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1cmxcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCI7XHJcblx0XHR2YXIgc2VyaWFsaXplID0geGhyT3B0aW9ucy5zZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLnNlcmlhbGl6ZSB8fCBKU09OLnN0cmluZ2lmeTtcclxuXHRcdHZhciBkZXNlcmlhbGl6ZSA9IHhock9wdGlvbnMuZGVzZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLmRlc2VyaWFsaXplIHx8IEpTT04ucGFyc2U7XHJcblx0XHR2YXIgZXh0cmFjdCA9IGlzSlNPTlAgPyBmdW5jdGlvbihqc29ucCkge3JldHVybiBqc29ucC5yZXNwb25zZVRleHR9IDogeGhyT3B0aW9ucy5leHRyYWN0IHx8IGZ1bmN0aW9uKHhocikge1xyXG5cdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dC5sZW5ndGggPT09IDAgJiYgZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UgPyBudWxsIDogeGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0fTtcclxuXHRcdHhock9wdGlvbnMubWV0aG9kID0gKHhock9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0eGhyT3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwoeGhyT3B0aW9ucy51cmwsIHhock9wdGlvbnMuZGF0YSk7XHJcblx0XHR4aHJPcHRpb25zID0gYmluZERhdGEoeGhyT3B0aW9ucywgeGhyT3B0aW9ucy5kYXRhLCBzZXJpYWxpemUpO1xyXG5cdFx0eGhyT3B0aW9ucy5vbmxvYWQgPSB4aHJPcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdFx0dmFyIHVud3JhcCA9IChlLnR5cGUgPT09IFwibG9hZFwiID8geGhyT3B0aW9ucy51bndyYXBTdWNjZXNzIDogeGhyT3B0aW9ucy51bndyYXBFcnJvcikgfHwgaWRlbnRpdHk7XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gdW53cmFwKGRlc2VyaWFsaXplKGV4dHJhY3QoZS50YXJnZXQsIHhock9wdGlvbnMpKSwgZS50YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09IFwibG9hZFwiKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZS5jYWxsKHJlc3BvbnNlKSA9PT0gQVJSQVkgJiYgeGhyT3B0aW9ucy50eXBlKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHJlc3BvbnNlW2ldID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZVtpXSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHhock9wdGlvbnMudHlwZSkgcmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWZlcnJlZFtlLnR5cGUgPT09IFwibG9hZFwiID8gXCJyZXNvbHZlXCIgOiBcInJlamVjdFwiXShyZXNwb25zZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdH07XHJcblx0XHRhamF4KHhock9wdGlvbnMpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSwgeGhyT3B0aW9ucy5pbml0aWFsVmFsdWUpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblx0Ly9mb3IgaW50ZXJuYWwgdGVzdGluZyBvbmx5LCBkbyBub3QgdXNlIGBtLmRlcHMuZmFjdG9yeWBcclxuXHRtLmRlcHMuZmFjdG9yeSA9IGFwcDtcclxuXHJcblx0cmV0dXJuIG1cclxufSkodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gbTtcclxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gbX0pO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvfi9taXRocmlsL21pdGhyaWwuanNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9+L3dlYnBhY2svYnVpbGRpbi9tb2R1bGUuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcclxuXHJcbmltcG9ydCB7cG9zdHMsIHNvcnRpbmdCeVRvcCwgc29ydEJ5VG9wLCBzb3J0QnlOZXd9IGZyb20gJy4vdXRpbGl0eS9tZXNzYWdlLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHdyYXBwZXIgZnJvbSAnLi93cmFwcGVyJztcclxuaW1wb3J0IHBvc3RCb3ggZnJvbSAnLi9wb3N0LWJveCc7XHJcbmltcG9ydCBwb3N0Q29tcG9uZW50IGZyb20gJy4vcG9zdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIG0uY29tcG9uZW50KHdyYXBwZXIsIHttYWluOiBtKFwibWFpbi5jb250YWluZXJcIiwgW1xyXG4gICAgICAgIHBvc3RCb3gsXHJcbiAgICAgICAgbShcInVsXCIsXHJcbiAgICAgICAgICBwb3N0cygpLm1hcCgocG9zdCwgcG9zdFBhZ2VJbmRleCkgPT4gbSgnbGknLCBtLmNvbXBvbmVudChwb3N0Q29tcG9uZW50LCB7cG9zdCwgcG9zdFBhZ2VJbmRleH0pKSlcclxuICAgICAgICApLFxyXG4gICAgICAgIG0oJy5tb2RlLXN3aXRjaGVyLnotZGVwdGgtMicsIFtcclxuICAgICAgICAgIG0oYGEud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0JHsoc29ydGluZ0J5VG9wKCkpID8gJy5ncmVlbi5saWdodGVuLTInIDogJyd9YCwge29uY2xpY2s6IHNvcnRCeVRvcH0sICdUb3AnKSxcclxuICAgICAgICAgIG0oYGEud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0JHsoc29ydGluZ0J5VG9wKCkpID8gJycgOiAnLmdyZWVuLmxpZ2h0ZW4tMid9YCwge29uY2xpY2s6IHNvcnRCeU5ld30sICdOZXcnKSxcclxuICAgICAgICBdKVxyXG4gICAgICBdKX0pXHJcbiAgICBdO1xyXG4gIH1cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9tYWluLXBhZ2UuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuZXhwb3J0IGNvbnN0IHBvc3RzID0gbS5wcm9wKFtdKTtcblxuZXhwb3J0IGNvbnN0IHNvcnRpbmdCeVRvcCA9IG0ucHJvcChmYWxzZSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlOZXcgKCkge1xuICBzb3J0aW5nQnlUb3AoZmFsc2UpO1xuICB1cGRhdGVQb3N0cygpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRCeVRvcCAoKSB7XG4gIHNvcnRpbmdCeVRvcCh0cnVlKTtcbiAgdXBkYXRlUG9zdHMoKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQb3N0cygpIHtcbiAgbGV0IGRhdGEgPSB7XG4gICAgY29tbWVudHM6IDEwXG4gIH07XG5cbiAgaWYgKHNvcnRpbmdCeVRvcCgpKSB7XG4gICAgZGF0YS50b3AgPSB0cnVlO1xuICB9XG5cbiAgY29uc29sZS5sb2coJ3VwZGF0aW5nIHBvc3RzIHdpdGgnKTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgbS5yZXF1ZXN0KHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgdXJsOiAnYXBpL3Bvc3QucGhwJyxcbiAgICBkYXRhXG4gIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICBjb25zb2xlLmxvZygndXBkYXRlZCBhbmQgcmVjaWV2ZWQnKTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBwb3N0cyhkYXRhKVxuICB9KTtcbn07XG5cbnNvcnRCeU5ldygpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy91dGlsaXR5L21lc3NhZ2UtY29udHJvbGxlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IHtsb2dnZWRJbn0gZnJvbSAnLi91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IG1lc3NhZ2VNb2RhbCBmcm9tICcuL21lc3NhZ2UtbW9kYWwnO1xyXG5pbXBvcnQgbmF2UGFuZWwgZnJvbSAnLi9uYXYtcGFuZWwnO1xyXG5pbXBvcnQgYXV0aGVudGljYXRlIGZyb20gJy4vYXV0aGVudGljYXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgYXJncykge1xyXG4gICAgcmV0dXJuIG0oJy5ib2R5JywgW1xyXG4gICAgICBtKFwiaGVhZGVyXCIsIFtcclxuICAgICAgICBtKFwibmF2LnRvcC1uYXZcIiwgW1xyXG4gICAgICAgICAgbShcImgxLmNlbnRlci1hbGlnblwiLCB7b25jbGljazogKCkgPT4gbS5yb3V0ZSgnLycpfSwgXCJTdGV2ZW5zIENvbXBsaW1lbnRzIGFuZCBDcnVzaGVzXCIpXHJcbiAgICAgICAgXSlcclxuICAgICAgXSksXHJcbiAgICAgIGFyZ3MubWFpbixcclxuICAgICAgbShcImZvb3Rlci5wYWdlLWZvb3RlclwiLCBbXHJcbiAgICAgICAgbShcIi5mb290ZXItY29weXJpZ2h0XCIsIFtcclxuICAgICAgICAgIG0oXCIuY2VudGVyLWFsaWduLnZhbGlnblwiLCBcIsKpIDIwMTUgTmljaG9sYXMgQW50b25vdiAmIEJyaWFuIFphd2l6YXdhIGZvciBDUzU0NiBhdCBTdGV2ZW5zXCIpXHJcbiAgICAgICAgXSlcclxuICAgICAgXSksXHJcbiAgICAgIGxvZ2dlZEluKCkgPyBuYXZQYW5lbCA6IGF1dGhlbnRpY2F0ZSxcclxuICAgICAgbWVzc2FnZU1vZGFsXHJcbiAgICBdKTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvd3JhcHBlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IHt1cGRhdGVQb3N0c30gZnJvbSAnLi9tZXNzYWdlLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHtvcGVuQXV0aGVudGljYXRpb259IGZyb20gJy4uL2F1dGhlbnRpY2F0ZSc7XHJcblxyXG5leHBvcnQgY29uc3QgbG9nZ2VkSW4gPSBtLnByb3AoZmFsc2UpO1xyXG5jaGVjaygpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luIChlbGVtZW50LCBlbWFpbCwgcGFzc3dvcmQpIHtcclxuICBpZiAoZWxlbWVudC5jaGVja1ZhbGlkaXR5KCkpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgdXJsOiAnYXBpL2xvZ2luLnBocCcsXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICBlbWFpbFxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBjaGVja1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrICgpIHtcclxuICBtLnJlcXVlc3Qoe1xyXG4gICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgIHVybDogJ2FwaS9jaGVja0xvZ2luLnBocCdcclxuIH0pLnRoZW4oKGRhdGEpID0+IHtcclxuICAgbG9nZ2VkSW4oSlNPTi5wYXJzZShkYXRhKSk7XHJcbiAgIHVwZGF0ZVBvc3RzKCk7XHJcbiB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhdHRlbXB0IChmdW5jKSB7XHJcbiAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGxvZ2dlZEluKCkgPyBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpIDogb3BlbkF1dGhlbnRpY2F0aW9uKCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9nb3V0ICgpIHtcclxuICAkLnBvc3QoJ2FwaS9sb2dvdXQucGhwJywgY2hlY2spO1xyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3V0aWxpdHkvbG9naW4tY29udHJvbGxlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5pbXBvcnQgbG9naW4gZnJvbSAnLi9sb2dpbic7XG5cbmltcG9ydCBsb2dnZWRJbiwge2NoZWNrfSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQXV0aGVudGljYXRpb24gKCkge1xuICAkKCcjY29tYm8tbW9kYWwnKS5vcGVuTW9kYWwoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tbW9kdWxlLWNvbnRhaW5lcicsIFtcbiAgICAgIG0oJy5sb2dpbi1ib3guei1kZXB0aC0yJywge29uY2xpY2s6IG9wZW5BdXRoZW50aWNhdGlvbn0sIFtcbiAgICAgICAgbShcImFcIiwgXCJMb2cgaW4gLyBSZWdpc3RlclwiKVxuICAgICAgXSksXG4gICAgICBtKFwiLm1vZGFsW2lkPSdjb21iby1tb2RhbCddXCIsIFtcbiAgICAgICAgbShcIi5tb2RhbC1jb250ZW50XCIsIFtcbiAgICAgICAgICBtKFwicFwiLCBcIldlbGNvbWUgdG8gU3RldmVucyBDb21wbGltZW50cyBhbmQgQ3J1c2hlcy4gVG8gcHJldmVudCBhYnVzZSBhbmQgYWxsb3cgZm9yIGEgcmljaCBmdWxseS1mZWF0dXJlZCBleHBlcmllbmNlLCB1c2VycyBhcmUgcmVxdWlyZWQgdG8gbG9nIGluLiBEb24ndCBXb3JyeSEgQWxsIHlvdXIgaW5mb3JtYXRpb24gd2lsbCBiZSBrZXB0IGFub255bW91cy5cIilcbiAgICAgICAgXSksXG4gICAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcbiAgICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LmxlZnRcIiwge29uY2xpY2s6ICgpID0+IHskKCcjbG9naW4tbW9kYWwnKS5vcGVuTW9kYWwoKTt9fSwgXCJMb2cgSW5cIiksXG4gICAgICAgICAgbShcImEubW9kYWwtYWN0aW9uLm1vZGFsLWNsb3NlLndhdmVzLWVmZmVjdC53YXZlcy1ncmVlbi5idG4tZmxhdC5sZWZ0XCIsIHtvbmNsaWNrOiAoKSA9PiB7JCgnI3JlZ2lzdGVyLW1vZGFsJykub3Blbk1vZGFsKCk7fX0sIFwiUmVnaXN0ZXJcIilcbiAgICAgICAgXSlcbiAgICAgIF0pLFxuICAgICAgbG9naW4sXG4gICAgICByZWdpc3RlclxuICAgIF0pO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9hdXRoZW50aWNhdGUuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcclxuXHJcbmltcG9ydCB7Y2hlY2t9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbmFtZSA9IG0ucHJvcCgnJyksXHJcbiAgICAgIHBhc3N3b3JkID0gbS5wcm9wKCcnKSxcclxuICAgICAgcGFzc3dvcmRDb25maXJtYXRpb24gPSBtLnByb3AoJycpLFxyXG4gICAgICBlbWFpbCA9IG0ucHJvcCgnJyksXHJcbiAgICAgIGVsZW1lbnQgPSBtLnByb3AoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyICgpIHtcclxuICAgICAgICBmdW5jdGlvbiBub25Kc29uRXJyb3JzICh4aHIpIHtcclxuICAgICAgICAgIHJldHVybiB4aHIuc3RhdHVzID4gMjAwID8gSlNPTi5zdHJpbmdpZnkoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhc3N3b3JkKCkgIT09IHBhc3N3b3JkQ29uZmlybWF0aW9uKCkpIHtcclxuICAgICAgICAgIGFsZXJ0KFwicGFzc3dvcmRzIGRvIG5vdCBtYXRjaFwiKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQoKS5jaGVja1ZhbGlkaXR5KCkpIHtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnYXBpL3JlZ2lzdGVyLnBocCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBuYW1lOiBuYW1lKCksXHJcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkKCksXHJcbiAgICAgICAgICAgICAgZW1haWw6IGVtYWlsKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogY2hlY2tcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBwYXNzd29yZENvbmZpcm1hdGlvbixcclxuICAgICAgZW1haWwsXHJcbiAgICAgIHJlZ2lzdGVyLFxyXG4gICAgICBlbGVtZW50XHJcbiAgICB9XHJcbiAgfSxcclxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xyXG4gICAgcmV0dXJuIG0oXCIubW9kYWxbaWQ9J3JlZ2lzdGVyLW1vZGFsJ11cIiwgW1xyXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xyXG4gICAgICAgIG0oXCJoNFwiLCBcIlJlZ2lzdGVyXCIpLFxyXG4gICAgICAgIG0oXCJmb3JtLmNvbC5zMTJcIiwge2NvbmZpZzogY3RybC5lbGVtZW50fSwgW1xyXG4gICAgICAgICAgbShcIi5yb3dcIiwgW1xyXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xyXG4gICAgICAgICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnByZWZpeFwiLCBcImFjY291bnRfY2lyY2xlXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nbmFtZSddW3JlcXVpcmVkPScnXVtwYXR0ZXJuPS4rIC4rXVt0eXBlPSd0ZXh0J11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5uYW1lKSwgdmFsdWU6IGN0cmwubmFtZSgpfSksXHJcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbmFtZSddXCIsIFwiTmFtZVwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwibG9ja19vdXRsaW5lXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0ncGFzc3dvcmQnXVtyZXF1aXJlZD0nJ11bdHlwZT0ncGFzc3dvcmQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLnBhc3N3b3JkKSwgdmFsdWU6IGN0cmwucGFzc3dvcmQoKX0pLFxyXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bhc3N3b3JkJ11cIiwgXCJQYXNzd29yZFwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwibG9ja19vdXRsaW5lXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nY29uZmlybS1wYXNzd29yZCddW3JlcXVpcmVkPScnXVt0eXBlPSdwYXNzd29yZCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIGN0cmwucGFzc3dvcmRDb25maXJtYXRpb24pLCB2YWx1ZTogY3RybC5wYXNzd29yZENvbmZpcm1hdGlvbigpfSksXHJcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nY29uZmlybS1wYXNzd29yZCddXCIsIFwiQ29uZmlybSBQYXNzd29yZFwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwiZW1haWxcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdlbWFpbCddW3JlcXVpcmVkPScnXVt0eXBlPSdlbWFpbCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIGN0cmwuZW1haWwpLCB2YWx1ZTogY3RybC5lbWFpbCgpfSksXHJcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nZW1haWwnXVwiLCBcIkVtYWlsXCIpXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICBdKVxyXG4gICAgICAgIF0pXHJcbiAgICAgIF0pLFxyXG4gICAgICBtKFwiLm1vZGFsLWZvb3RlclwiLCBbXHJcbiAgICAgICAgbShcImEubW9kYWwtYWN0aW9uLm1vZGFsLWNsb3NlLndhdmVzLWVmZmVjdC53YXZlcy1ncmVlbi5idG4tZmxhdC5yaWdodFwiLCB7b25jbGljazogY3RybC5yZWdpc3Rlcn0sIFwiUmVnaXN0ZXJcIilcclxuICAgICAgXSlcclxuICAgIF0pO1xyXG4gIH1cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9yZWdpc3Rlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IHtjaGVjaywgbG9naW59IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcGFzc3dvcmQgPSBtLnByb3AoJycpLFxyXG4gICAgICBlbWFpbCA9IG0ucHJvcCgnJyksXHJcbiAgICAgIGVsZW1lbnQgPSBtLnByb3AoKTtcclxuXHJcblxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBlbWFpbCxcclxuICAgICAgZWxlbWVudFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcclxuICAgIHJldHVybiBtKFwiLm1vZGFsW2lkPSdsb2dpbi1tb2RhbCddXCIsIFtcclxuICAgICAgbShcIi5tb2RhbC1jb250ZW50XCIsIFtcclxuICAgICAgICBtKFwiaDRcIiwgXCJMb2cgSW5cIiksXHJcbiAgICAgICAgbShcImZvcm0uY29sLnMxMlwiLCB7Y29uZmlnOiBjdHJsLmVsZW1lbnR9LCBbXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwiZW1haWxcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdsb2dpbi1lbWFpbCddW3JlcXVpcmVkPScnXVt0eXBlPSdlbWFpbCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cigndmFsdWUnLCBjdHJsLmVtYWlsKSwgdmFsdWU6IGN0cmwuZW1haWwoKX0pLFxyXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J2xvZ2luLWVtYWlsJ11cIiwgXCJFbWFpbFwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwibG9ja19vdXRsaW5lXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nbG9naW4tcGFzc3dvcmQnXVtyZXF1aXJlZD0nJ11bdHlwZT0ncGFzc3dvcmQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZCksIHZhbHVlOiBjdHJsLnBhc3N3b3JkKCl9KSxcclxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdsb2dpbi1wYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIilcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgXSlcclxuICAgICAgXSksXHJcbiAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcclxuICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LnJpZ2h0XCIsIHtvbmNsaWNrOiAoKSA9PiBsb2dpbihjdHJsLmVsZW1lbnQoKSwgY3RybC5lbWFpbCgpLCBjdHJsLnBhc3N3b3JkKCkpfSwgIFwiTG9nIEluXCIpXHJcbiAgICAgIF0pXHJcbiAgICBdKTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbG9naW4uanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi91dGlsaXR5L2JpbmQnO1xuXG5jb25zdCB0YXJnZXQgPSBtLnByb3AoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5NZXNzYWdlTW9kYWwgKHJlY2lwaWVudCkge1xuICB0YXJnZXQocmVjaXBpZW50KTtcbiAgJCgnI21lc3NhZ2UtbW9kYWwnKS5vcGVuTW9kYWwoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudCA9IG0ucHJvcCgnJyksXG4gICAgICBzaG93TmFtZSA9IG0ucHJvcChmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBzZW5kICgpIHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnYXBpL21lc3NhZ2UucGhwJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRvOiB0YXJnZXQoKSxcbiAgICAgICAgICBtZXNzYWdlOiBjb250ZW50KCksXG4gICAgICAgICAgc2hvd05hbWU6IHNob3dOYW1lKClcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KCdNZXNzYWdlIHNlbnQhJywgNDAwMCk7XG4gICAgICAgICAgY29udGVudCgnJyk7XG4gICAgICAgICAgJCgnI21lc3NhZ2UtbW9kYWwnKS5jbG9zZU1vZGFsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoKSA9PiBjb25zb2xlLmxvZyhlcnJvci5yZXNwb25zZVRleHQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2VuZCxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBzaG93TmFtZVxuICAgIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIG0oXCIubW9kYWxbaWQ9J21lc3NhZ2UtbW9kYWwnXVwiLCBbXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICBtKFwiaDRcIiwgXCJQcml2YXRlIE1lc3NhZ2VcIiksXG4gICAgICAgIG0oXCJmb3JtXCIsIFtcbiAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5tYXRlcmlhbGl6ZS10ZXh0YXJlYVtpZD0nbWVzc2FnZS10ZXh0YXJlYSddW2xlbmd0aD0nMTAwMCddXCIsIGJpbmQoY3RybC5jb250ZW50KSksXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLXRleHRhcmVhJ11cIiwgXCJTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlIVwiKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIucm93XCIsIFtcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tN1wiLCBbXG4gICAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J21lc3NhZ2UtYW5vbiddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nbm8nXVwiKSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLWFub24nXVwiLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgbShcImlucHV0W2lkPSdtZXNzYWdlLW5hbWUnXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9J3llcyddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cignY2hlY2tlZCcsIGN0cmwuc2hvd05hbWUpfSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbWVzc2FnZS1uYW1lJ11cIiwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tNVwiLCBbXG4gICAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogY3RybC5zZW5kfSwgW1xuICAgICAgICAgICAgICAgIFwiU2VuZCBcIixcbiAgICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcInNlbmRcIilcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZS1tb2RhbC5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvcCkge1xuICByZXR1cm4ge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgcHJvcCksIHZhbHVlOiBwcm9wKCl9O1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy91dGlsaXR5L2JpbmQuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHtsb2dvdXR9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tYm94LnotZGVwdGgtMicsIFtcbiAgICAgIG0oJ2EnLCB7b25jbGljazogKCkgPT4gbS5yb3V0ZSgnL21lc3NhZ2VzJyl9LCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcIm1lc3NhZ2VcIilcbiAgICAgIF0pLFxuICAgICAgbSgnYScsIHtvbmNsaWNrOiBsb2dvdXR9LCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcInBvd2VyX3NldHRpbmdzX25ld1wiKVxuICAgICAgXSlcbiAgICBdKTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbmF2LXBhbmVsLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQge3VwZGF0ZVBvc3RzfSBmcm9tICcuL3V0aWxpdHkvbWVzc2FnZS1jb250cm9sbGVyJztcclxuaW1wb3J0IGxvZ2dlZEluLCB7Y2hlY2ssIGF0dGVtcHR9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcclxuaW1wb3J0IGJpbmQgZnJvbSAnLi91dGlsaXR5L2JpbmQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzaG93TmFtZSA9IG0ucHJvcCgwKSxcclxuICAgICAgZm9yTmFtZSA9IG0ucHJvcChcIlwiKSxcclxuICAgICAgY29udGVudCA9IG0ucHJvcChcIlwiKSxcclxuICAgICAgZWxlbWVudCA9IG0ucHJvcCgpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBvc3QgKCkge1xyXG4gICAgICBpZiAoZWxlbWVudCgpLmNoZWNrVmFsaWRpdHkoKSkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICB1cmw6ICdhcGkvdXNlclBvc3QucGhwJyxcclxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHBvc3Q6IGNvbnRlbnQoKSxcclxuICAgICAgICAgICAgZm9yX25hbWU6IGZvck5hbWUoKSxcclxuICAgICAgICAgICAgc2hvd05hbWU6IHNob3dOYW1lKClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdWNjZXNzOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZVBvc3RzKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IucmVzcG9uc2VUZXh0KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9yTmFtZSxcclxuICAgICAgY29udGVudCxcclxuICAgICAgc2hvd05hbWUsXHJcbiAgICAgIGVsZW1lbnQsXHJcbiAgICAgIHBvc3RcclxuICAgIH1cclxuICB9LFxyXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XHJcbiAgICByZXR1cm4gbShcImZvcm0uY2FyZC1wYW5lbC5ob3ZlcmFibGVcIiwge2NvbmZpZzogY3RybC5lbGVtZW50fSwgW1xyXG4gICAgICBtKFwiLmlucHV0LWZpZWxkXCIsIFtcclxuICAgICAgICBtKFwiaW5wdXRbaWQ9J3Bvc3QtdGl0bGUnXVt0eXBlPSd0ZXh0J11bcGxhY2Vob2xkZXI9J1dobyBhcmUgeW91IGNvbXBsaW1lbnRpbmc/J11cIiwgYmluZChjdHJsLmZvck5hbWUpKSxcclxuICAgICAgICBtKFwibGFiZWxbZm9yPSdwb3N0LXRpdGxlJ11cIilcclxuICAgICAgXSksXHJcbiAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xyXG4gICAgICAgIG0oXCJ0ZXh0YXJlYS5tYXRlcmlhbGl6ZS10ZXh0YXJlYVtpZD0ncG9zdC10ZXh0YXJlYSddW2xlbmd0aD0nMTAwMCddXCIsIGJpbmQoY3RybC5jb250ZW50KSksXHJcbiAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC10ZXh0YXJlYSddXCIsIFwiU3VibWl0IGEgcG9zdCFcIilcclxuICAgICAgXSksXHJcbiAgICAgIG0oXCIucm93XCIsIFtcclxuICAgICAgICBtKFwiLmNvbC5zMTIubThcIiwgW1xyXG4gICAgICAgICAgbShcImRpdlwiLCBbXHJcbiAgICAgICAgICAgIG0oXCJpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J3Bvc3QtYW5vbiddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nMCddXCIpLFxyXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdwb3N0LWFub24nXVwiLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiZGl2XCIsIFtcclxuICAgICAgICAgICAgbShcImlucHV0W2lkPSdwb3N0LW5hbWUnXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9JzEnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoJ2NoZWNrZWQnLCBjdHJsLnNob3dOYW1lKX0pLFxyXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdwb3N0LW5hbWUnXVwiLCBcIlN1Ym1pdCB3aXRoIG5hbWVcIilcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgXSksXHJcbiAgICAgICAgbShcIi5jb2wuczEyLm00XCIsIFtcclxuICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodC5yaWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogYXR0ZW1wdChjdHJsLnBvc3QpfSwgW1wiUG9zdFwiLCBtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcIm1lc3NhZ2VcIildKVxyXG4gICAgICAgIF0pXHJcbiAgICAgIF0pXHJcbiAgICBdKTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvcG9zdC1ib3guanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi91dGlsaXR5L2JpbmQnO1xuaW1wb3J0IHthdHRlbXB0fSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XG5pbXBvcnQge29wZW5NZXNzYWdlTW9kYWx9IGZyb20gJy4vbWVzc2FnZS1tb2RhbCc7XG5pbXBvcnQge3VwZGF0ZVBvc3RzfSBmcm9tICcuL3V0aWxpdHkvbWVzc2FnZS1jb250cm9sbGVyJztcblxuaW1wb3J0IGNvbW1lbnRDb21wb25lbnQgZnJvbSAnLi9jb21tZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuXG4gICAgbGV0IGNvbW1lbnRUZXh0ID0gbS5wcm9wKCcnKSxcbiAgICAgIHNob3dOYW1lID0gbS5wcm9wKDApO1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlUG9zdCAoKSB7XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHVybDogJ2FwaS91c2VyUG9zdC5waHAnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGVsZXRlOiBhcmdzLnBvc3QucF9pZFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgdXBkYXRlUG9zdHMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6ICgpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Ym1pdENvbW1lbnQgKCkge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB1cmw6ICdhcGkvY29tbWVudC5waHAnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcF9pZDogYXJncy5wb3N0LnBfaWQsXG4gICAgICAgICAgY29tbWVudDogY29tbWVudFRleHQoKSxcbiAgICAgICAgICBzaG93TmFtZTogc2hvd05hbWUoKVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgICAgdXBkYXRlUG9zdHMoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6ICgpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZvdGUgKCkge1xuICAgICAgaWYgKGFyZ3MucG9zdC52YWx1ZSAhPT0gJzEnKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgIHVybDogJ2FwaS92b3RlUG9zdC5waHAnLFxuICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcF9pZDogYXJncy5wb3N0LnBfaWQsXG4gICAgICAgICAgICB1cDogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Vwdm90aW5nJyk7XG4gICAgICAgICAgICB1cGRhdGVQb3N0cygpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6ICgpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1lbnRUZXh0LFxuICAgICAgZGVsZXRlUG9zdCxcbiAgICAgIHN1Ym1pdENvbW1lbnQsXG4gICAgICBzaG93TmFtZSxcbiAgICAgIHZvdGVcbiAgICB9O1xuICB9LFxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCwgYXJncykge1xuICAgIHJldHVybiBtKCdhcnRpY2xlLnN1Ym1pc3Npb24uY2FyZC1wYW5lbC5ob3ZlcmFibGUnLCBbXG4gICAgICBtKCdoMycsIGFyZ3MucG9zdC5mb3JfbmFtZSksXG4gICAgICBtKGBhc2lkZS52b3RlLmxlZnQkeygoYXJncy5wb3N0LnZhbHVlID09PSAnMScpPycudm90ZWQnOicnKX1gLCBbXG4gICAgICAgIG0oJ2kuc21hbGwubWF0ZXJpYWwtaWNvbnMnLCB7b25jbGljazogYXR0ZW1wdChjdHJsLnZvdGUpfSwgJ3RodW1iX3VwJyksXG4gICAgICAgIG0oJ2JyJyksXG4gICAgICAgIG0oJy5jb3VudC5jZW50ZXItYWxpZ24nLCBhcmdzLnBvc3Qudm90ZXMpXG4gICAgICBdKSxcbiAgICAgIG0oJy5wb3N0LWJvZHknLCBbXG4gICAgICAgIG0oJ3AuZmxvdy10ZXh0JywgW1xuICAgICAgICAgIGFyZ3MucG9zdC5wb3N0LFxuICAgICAgICAgIG0oXCJhLnF1b3RlLWJ5W3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIiwge29uY2xpY2s6IGF0dGVtcHQob3Blbk1lc3NhZ2VNb2RhbCwgYXJncy5wb3N0Lm93bmFnZV9pZCl9LCBhcmdzLnBvc3QubmFtZSlcbiAgICAgICAgXSksXG4gICAgICBdKSxcbiAgICAgICgoYXJncy5wb3N0LnVfaWQgIT09IC0xKSA/IG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodC5yZWQucmlnaHQudGlnaHRbdHlwZT0nYnV0dG9uJ11cIiwge29uY2xpY2s6IGN0cmwuZGVsZXRlUG9zdH0sIFtcIlwiLCBtKFwiaS5tYXRlcmlhbC1pY29uc1wiLCBcImRlbGV0ZVwiKV0pIDogXCJcIiksXG4gICAgICBtKFwiZm9ybVwiLCBbXG4gICAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xuICAgICAgICAgIG0oYHRleHRhcmVhLm1hdGVyaWFsaXplLXRleHRhcmVhW2lkPSdwb3N0LXRleHRhcmVhLSR7YXJncy5wb3N0UGFnZUluZGV4fSddW2xlbmd0aD0nMTAwMCddYCwgYmluZChjdHJsLmNvbW1lbnRUZXh0KSksXG4gICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LXRleHRhcmVhLSR7YXJncy5wb3N0UGFnZUluZGV4fSddYCwge29uY2xpY2s6IGN0cmwuc3VibWl0Q29tbWVudH0sIFwiU3VibWl0IGEgY29tbWVudFwiKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcIi5yb3dcIiwgW1xuICAgICAgICAgIG0oXCIuY29sLnMxMi5tOFwiLCBbXG4gICAgICAgICAgICBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgICAgbShgaW5wdXRbY2hlY2tlZD0nY2hlY2tlZCddW2lkPSdwb3N0LWFub24tJHthcmdzLnBvc3RQYWdlSW5kZXh9J11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSdubyddYCksXG4gICAgICAgICAgICAgIG0oYGxhYmVsW2Zvcj0ncG9zdC1hbm9uLSR7YXJncy5wb3N0UGFnZUluZGV4fSddYCwgXCJTdWJtaXQgYW5vbnltb3VzbHlcIilcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgIG0oYGlucHV0W2lkPSdwb3N0LW5hbWUtJHthcmdzLnBvc3RQYWdlSW5kZXh9J11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSd5ZXMnXWAsIHtvbmNoYW5nZTogbS53aXRoQXR0cignY2hlY2tlZCcsIGN0cmwuc2hvd05hbWUpfSksXG4gICAgICAgICAgICAgIG0oYGxhYmVsW2Zvcj0ncG9zdC1uYW1lLSR7YXJncy5wb3N0UGFnZUluZGV4fSddYCwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIuY29sLnMxMi5tNFwiLCBbXG4gICAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi53YXZlcy1lZmZlY3Qud2F2ZXMtbGlnaHQucmlnaHRbbmFtZT0nYWN0aW9uJ11bdHlwZT0nYnV0dG9uJ11cIiwge29uY2xpY2s6IGF0dGVtcHQoY3RybC5zdWJtaXRDb21tZW50KX0sIFtcIkNvbW1lbnRcIiwgbShcImkubWF0ZXJpYWwtaWNvbnMucmlnaHRcIiwgXCJjaGF0X2J1YmJsZV9vdXRsaW5lXCIpXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBtKFwiLmNvbW1lbnRzLWNvbnRhaW5lclwiLCBhcmdzLnBvc3QuY29tbWVudHMubWFwKChjb21tZW50KSA9PiBtLmNvbXBvbmVudChjb21tZW50Q29tcG9uZW50LCB7Y29tbWVudCwgcG9zdDogYXJncy5wb3N0fSkpKVxuICAgIF0pXG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3Bvc3QuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHt1cGRhdGVQb3N0c30gZnJvbSAnLi91dGlsaXR5L21lc3NhZ2UtY29udHJvbGxlcic7XG5pbXBvcnQge29wZW5NZXNzYWdlTW9kYWx9IGZyb20gJy4vbWVzc2FnZS1tb2RhbCc7XG5pbXBvcnQge2F0dGVtcHR9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuXG4gICAgZnVuY3Rpb24gZGVsZXRlQ29tbWVudCAoKSB7XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIHVybDogJ2FwaS9jb21tZW50LnBocCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkZWxldGU6IGFyZ3MuY29tbWVudC5jX2lkXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6ICgpID0+IHtcbiAgICAgICAgICB1cGRhdGVQb3N0cygpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogKGVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnJvci5yZXNwb25zZVRleHQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZGVsZXRlQ29tbWVudFxuICAgIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsLCBhcmdzKSB7XG4gICAgcmV0dXJuIG0oXCJibG9ja3F1b3RlXCIsIFtcbiAgICAgICgoYXJncy5jb21tZW50LnVfaWQgIT09IC0xKSA/IG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodC5yZWQucmlnaHQudGlnaHRbdHlwZT0nYnV0dG9uJ11cIiwge29uY2xpY2s6IGN0cmwuZGVsZXRlQ29tbWVudH0sIFtcIlwiLCBtKFwiaS5tYXRlcmlhbC1pY29uc1wiLCBcImRlbGV0ZVwiKV0pIDogXCJcIiksXG4gICAgICBhcmdzLmNvbW1lbnQuY29tbWVudCxcbiAgICAgIG0oXCJiclwiKSxcbiAgICAgIG0oXCJhLnF1b3RlLWJ5W3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIiwge29uY2xpY2s6IGF0dGVtcHQob3Blbk1lc3NhZ2VNb2RhbCwgYXJncy5jb21tZW50Lm93bmFnZV9pZCl9LCBhcmdzLmNvbW1lbnQubmFtZSlcbiAgICBdKTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvY29tbWVudC5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgd3JhcHBlciBmcm9tICcuL3dyYXBwZXInO1xuaW1wb3J0IG1lc3NhZ2VDb21wb25lbnQgZnJvbSAnLi9tZXNzYWdlJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoYXJncykge1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gbS5wcm9wKFtdKTtcblxuICAgIG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICB1cmw6ICdhcGkvbWVzc2FnZS5waHAnLFxuICAgICAgZGF0YToge1xuICAgICAgICBzdGFydDogMCxcbiAgICAgICAgY291bnQ6IDEwXG4gICAgICB9XG4gICAgfSkudGhlbihtZXNzYWdlcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbWVzc2FnZXNcbiAgICB9XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG0uY29tcG9uZW50KHdyYXBwZXIsIHttYWluOiBtKFwibWFpbi5jb250YWluZXJcIiwgW1xuICAgICAgICBtKCd1bCcsXG4gICAgICAgICAgY3RybC5tZXNzYWdlcygpLm1hcCgobWVzc2FnZSkgPT4gbS5jb21wb25lbnQobWVzc2FnZUNvbXBvbmVudCwge21lc3NhZ2V9KSlcbiAgICAgICAgKVxuICAgICAgXSl9KVxuICAgIF07XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL21lc3NhZ2VzLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCBiaW5kIGZyb20gJy4vdXRpbGl0eS9iaW5kJztcbmltcG9ydCB7b3Blbk1lc3NhZ2VNb2RhbH0gZnJvbSAnLi9tZXNzYWdlLW1vZGFsJztcbmltcG9ydCB7YXR0ZW1wdH0gZnJvbSAnLi91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsLCBhcmdzKSB7XG4gICAgcmV0dXJuIG0oJ2FydGljbGUuc3VibWlzc2lvbi5jYXJkLXBhbmVsLmhvdmVyYWJsZScsIFtcbiAgICAgIG0oJy5wb3N0LWJvZHknLCBbXG4gICAgICAgIG0oJ3AuZmxvdy10ZXh0JywgW1xuICAgICAgICAgIGFyZ3MubWVzc2FnZS5tZXNzYWdlLFxuICAgICAgICAgIG0oXCJhLnF1b3RlLWJ5W3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIiwge29uY2xpY2s6IGF0dGVtcHQob3Blbk1lc3NhZ2VNb2RhbCwgYXJncy5tZXNzYWdlLm93bmFnZV9pZCl9LCBhcmdzLm1lc3NhZ2UubmFtZSlcbiAgICAgICAgXSksXG4gICAgICBdKVxuICAgIF0pXG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL21lc3NhZ2UuanNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9