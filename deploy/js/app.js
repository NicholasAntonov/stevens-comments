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
	
	var _messages = __webpack_require__(15);
	
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
	
	var _wrapper = __webpack_require__(4);
	
	var _wrapper2 = _interopRequireDefault(_wrapper);
	
	var _postBox = __webpack_require__(12);
	
	var _postBox2 = _interopRequireDefault(_postBox);
	
	var _post = __webpack_require__(13);
	
	var _post2 = _interopRequireDefault(_post);
	
	exports['default'] = {
	  controller: function controller() {
	    var posts = _mithril2['default'].prop([]);
	
	    _mithril2['default'].request({
	      method: 'GET',
	      url: 'api/post.php',
	      data: {
	        comments: 10
	      }
	    }).then(posts);
	
	    return {
	      posts: posts
	    };
	  },
	  view: function view(ctrl) {
	    return [_mithril2['default'].component(_wrapper2['default'], { main: (0, _mithril2['default'])('main.container', [_postBox2['default'], (0, _mithril2['default'])('ul', ctrl.posts().map(function (post, postPageIndex) {
	        return (0, _mithril2['default'])('li', _mithril2['default'].component(_post2['default'], { post: post, postPageIndex: postPageIndex }));
	      }))]) })];
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(5);
	
	var _messageModal = __webpack_require__(9);
	
	var _messageModal2 = _interopRequireDefault(_messageModal);
	
	var _navPanel = __webpack_require__(11);
	
	var _navPanel2 = _interopRequireDefault(_navPanel);
	
	var _authenticate = __webpack_require__(6);
	
	var _authenticate2 = _interopRequireDefault(_authenticate);
	
	exports['default'] = {
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('.body', [(0, _mithril2['default'])('header', [(0, _mithril2['default'])('nav.top-nav', [(0, _mithril2['default'])('h1.center-align', 'Stevens Compliments and Crushes')])]), args.main, (0, _mithril2['default'])('footer.page-footer', [(0, _mithril2['default'])('.footer-copyright', [(0, _mithril2['default'])('.center-align.valign', '© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens')])]), (0, _utilityLoginController.loggedIn)() ? _navPanel2['default'] : _authenticate2['default'], _messageModal2['default']]);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.check = check;
	exports.attempt = attempt;
	exports.logout = logout;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _authenticate = __webpack_require__(6);
	
	var loggedIn = _mithril2['default'].prop(false);
	exports.loggedIn = loggedIn;
	check();
	
	function check() {
	  _mithril2['default'].request({
	    method: 'GET',
	    dataType: 'json',
	    url: 'api/checkLogin.php'
	  }).then(function (data) {
	    return loggedIn(JSON.parse(data));
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
	  $.post('logout.php', check);
	}
	
	;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.openAuthentication = openAuthentication;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _register = __webpack_require__(7);
	
	var _register2 = _interopRequireDefault(_register);
	
	var _login = __webpack_require__(8);
	
	var _login2 = _interopRequireDefault(_login);
	
	var _utilityLoginController = __webpack_require__(5);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	function openAuthentication() {
	  $('#combo-modal').openModal();
	}
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-module-container', [(0, _mithril2['default'])('.login-box.z-depth-2', { onclick: openAuthentication }, [(0, _mithril2['default'])('a', 'Log in / Register')]), (0, _mithril2['default'])('.modal[id=\'combo-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('p', 'Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don\'t Worry! All your information will be kept anonymous as long as you choose to keep it that way.')]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#login-modal').openModal();
	      } }, 'Log In'), (0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#register-modal').openModal();
	      } }, 'Register')])]), _login2['default'], _register2['default']]);
	  }
	};

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
	
	var _utilityLoginController = __webpack_require__(5);
	
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(5);
	
	exports['default'] = {
	  controller: function controller() {
	    var password = _mithril2['default'].prop(''),
	        email = _mithril2['default'].prop(''),
	        element = _mithril2['default'].prop();
	
	    function login() {
	      if (element().checkValidity()) {
	        $.ajax({
	          type: 'POST',
	          url: 'api/login.php',
	          dataType: 'json',
	          data: {
	            password: password(),
	            email: email()
	          },
	          success: _utilityLoginController.check
	        });
	      }
	    }
	
	    return {
	      password: password,
	      email: email,
	      login: login,
	      element: element
	    };
	  },
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.modal[id=\'login-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Log In'), (0, _mithril2['default'])('form.col.s12', { config: ctrl.element }, [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'login-email\'][required=\'\'][type=\'email\']', { onchange: _mithril2['default'].withAttr('value', ctrl.email), value: ctrl.email() }), (0, _mithril2['default'])('label[for=\'login-email\']', 'Email')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'login-password\'][required=\'\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.password), value: ctrl.password() }), (0, _mithril2['default'])('label[for=\'login-password\']', 'Password')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', { onclick: ctrl.login }, 'Log In')])]);
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
	exports.openMessageModal = openMessageModal;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityBind = __webpack_require__(10);
	
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
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityLoginController = __webpack_require__(5);
	
	exports['default'] = {
	  view: function view(ctrl) {
	    return (0, _mithril2['default'])('.login-box.z-depth-2', [(0, _mithril2['default'])('a', { onclick: function onclick() {
	        return _mithril2['default'].route('/messages');
	      } }, [(0, _mithril2['default'])('i.material-icons.side-icon', 'message')]), (0, _mithril2['default'])('a', { onclick: _utilityLoginController.logout }, [(0, _mithril2['default'])('i.material-icons.side-icon', 'power_settings_new')])]);
	  }
	};
	module.exports = exports['default'];

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
	
	var _utilityLoginController = __webpack_require__(5);
	
	var _utilityLoginController2 = _interopRequireDefault(_utilityLoginController);
	
	var _utilityBind = __webpack_require__(10);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	exports['default'] = {
	  controller: function controller() {
	    var showName = _mithril2['default'].prop(0),
	        forName = _mithril2['default'].prop(''),
	        content = _mithril2['default'].prop(''),
	        element = _mithril2['default'].prop();
	
	    function post() {
	      if (element().checkValidity()) {
	        console.log(showName());
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
	            return document.location.reload(true);
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
	    return (0, _mithril2['default'])('form.card-panel.hoverable', { config: ctrl.element }, [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('input[id=\'post-title\'][type=\'text\'][placeholder=\'Who are you complimenting?\']', (0, _utilityBind2['default'])(ctrl.forName)), (0, _mithril2['default'])('label[for=\'post-title\']')]), (0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea\'][length=\'1000\']', (0, _utilityBind2['default'])(ctrl.content)), (0, _mithril2['default'])('label[for=\'post-textarea\']', 'Submit a post!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon\'][name=\'named\'][type=\'radio\'][value=\'0\']'), (0, _mithril2['default'])('label[for=\'post-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name\'][name=\'named\'][type=\'radio\'][value=\'1\']', { onchange: _mithril2['default'].withAttr('checked', ctrl.showName) }), (0, _mithril2['default'])('label[for=\'post-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'button\']', { onclick: (0, _utilityLoginController.attempt)(ctrl.post) }, ['Post', (0, _mithril2['default'])('i.material-icons.right', 'message')])])])]);
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
	
	var _utilityBind = __webpack_require__(10);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	var _utilityLoginController = __webpack_require__(5);
	
	var _messageModal = __webpack_require__(9);
	
	var _comment = __webpack_require__(14);
	
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
	          return document.location.reload(true);
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
	          return document.location.reload(true);
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
	            return document.location.reload(true);
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
	    return (0, _mithril2['default'])('article.submission.card-panel.hoverable', [(0, _mithril2['default'])('h3', args.post.for_name), (0, _mithril2['default'])('aside.vote.left' + (args.post.value === '1' ? '.voted' : ''), [(0, _mithril2['default'])('i.small.material-icons', { onclick: (0, _utilityLoginController.attempt)(ctrl.vote) }, 'thumb_up'), (0, _mithril2['default'])('br'), (0, _mithril2['default'])('.count.center-align', args.post.votes)]), (0, _mithril2['default'])('.post-body', [(0, _mithril2['default'])('p.flow-text', [args.post.post, (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: (0, _utilityLoginController.attempt)(_messageModal.openMessageModal, args.post.ownage_id) }, args.post.name)])]), args.post.u_id !== -1 ? (0, _mithril2['default'])('button.btn.waves-effect.waves-light.red.right.tight[type=\'button\']', { onclick: ctrl.deletePost }, ['', (0, _mithril2['default'])('i.material-icons', 'delete')]) : '', (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea-' + args.postPageIndex + '\'][length=\'1000\']', (0, _utilityBind2['default'])(ctrl.commentText)), (0, _mithril2['default'])('label[for=\'post-textarea-' + args.postPageIndex + '\']', { onclick: ctrl.submitComment }, 'Submit a comment')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon-' + args.postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'post-anon-' + args.postPageIndex + '\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name-' + args.postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'yes\']', { onchange: _mithril2['default'].withAttr('checked', ctrl.showName) }), (0, _mithril2['default'])('label[for=\'post-name-' + args.postPageIndex + '\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'button\']', { onclick: (0, _utilityLoginController.attempt)(ctrl.submitComment) }, ['Comment', (0, _mithril2['default'])('i.material-icons.right', 'chat_bubble')])])])]), (0, _mithril2['default'])('.comments-container', args.post.comments.map(function (comment) {
	      return _mithril2['default'].component(_comment2['default'], { comment: comment, post: args.post });
	    }))]);
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
	
	var _messageModal = __webpack_require__(9);
	
	var _utilityLoginController = __webpack_require__(5);
	
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
	          return document.location.reload(true);
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _wrapper = __webpack_require__(4);
	
	var _wrapper2 = _interopRequireDefault(_wrapper);
	
	var _message = __webpack_require__(16);
	
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _mithril = __webpack_require__(1);
	
	var _mithril2 = _interopRequireDefault(_mithril);
	
	var _utilityBind = __webpack_require__(10);
	
	var _utilityBind2 = _interopRequireDefault(_utilityBind);
	
	var _messageModal = __webpack_require__(9);
	
	var _utilityLoginController = __webpack_require__(5);
	
	exports['default'] = {
	  view: function view(ctrl, args) {
	    return (0, _mithril2['default'])('article.submission.card-panel.hoverable', [(0, _mithril2['default'])('.post-body', [(0, _mithril2['default'])('p.flow-text', [args.message.message, (0, _mithril2['default'])('a.quote-by[title=\'Send a private message\']', { onclick: (0, _utilityLoginController.attempt)(_messageModal.openMessageModal, args.message.ownage_id) }, args.message.name)])])]);
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTEyMTkwMjk4ZjEyZTk0ZjNjZDciLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9+L21pdGhyaWwvbWl0aHJpbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL34vd2VicGFjay9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9tYWluLXBhZ2UuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvd3JhcHBlci5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvYXV0aGVudGljYXRlLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3JlZ2lzdGVyLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2xvZ2luLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL21lc3NhZ2UtbW9kYWwuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvdXRpbGl0eS9iaW5kLmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL25hdi1wYW5lbC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9wb3N0LWJveC5qcyIsIndlYnBhY2s6Ly8vQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9wb3N0LmpzIiwid2VicGFjazovLy9DOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2NvbW1lbnQuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZXMuanMiLCJ3ZWJwYWNrOi8vL0M6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7b0NDdENjLENBQVM7Ozs7cUNBRU4sQ0FBYTs7OztxQ0FDVCxFQUFZOzs7O0FBRWpDLEVBQUMsQ0FBRSxRQUFRLENBQUUsQ0FBQyxLQUFLLENBQUMsWUFBTTtBQUN4Qix3QkFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDMUIsUUFBRyx1QkFBTTtBQUNULGdCQUFXLHVCQUFVO0lBQ3RCLENBQUMsQ0FBQztFQUNKLENBQUMsQzs7Ozs7Ozs7QUNWRixLQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDeEMsTUFBSSxNQUFNLEdBQUcsaUJBQWlCO01BQUUsS0FBSyxHQUFHLGdCQUFnQjtNQUFFLE1BQU0sR0FBRyxpQkFBaUI7TUFBRSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQzVHLE1BQUksSUFBSSxHQUFHLElBQUUsQ0FBQyxRQUFRLENBQUM7QUFDdkIsTUFBSSxNQUFNLEdBQUcsc0NBQXNDO01BQUUsVUFBVSxHQUFHLDhCQUE4QixDQUFDO0FBQ2pHLE1BQUksWUFBWSxHQUFHLHlGQUF5RixDQUFDO0FBQzdHLE1BQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFjLEVBQUU7OztBQUd4QixNQUFJLFNBQVMsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVB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LFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO0FBQzFELFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsV0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLElBQUksRUFBRTtPQUNyRztBQUNELFlBQUs7TUFDTDtLQUNEOztBQUVELFFBQUksd0JBQXdCLEVBQUU7QUFDN0IsU0FBSSxVQUFVLEdBQUcsS0FBSztBQUN0QixTQUFJLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsSUFBSSxNQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzRixVQUFJLFVBQVUsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNyRixpQkFBVSxHQUFHLElBQUk7QUFDakIsYUFBSztPQUNMO01BQ0Q7O0FBRUQsU0FBSSxVQUFVLEVBQUU7QUFDZixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMs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QUFFLGNBQVUsSUFBSSxFQUFFO0FBQ3BCLFlBQU8sQ0FDTCxxQkFBRSxTQUFTLHVCQUFVLEVBQUMsSUFBSSxFQUFFLDBCQUFFLGdCQUFnQixFQUFFLENBQzlDLDBCQUFFLElBQUksRUFDSixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTztnQkFBSyxxQkFBRSxTQUFTLHVCQUFtQixFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUMsQ0FBQztRQUFBLENBQUMsQ0FDM0UsQ0FDRixDQUFDLEVBQUMsQ0FBQyxDQUNMLENBQUM7SUFDSDtFQUNGOzs7Ozs7Ozs7Ozs7Ozs7b0NDL0JhLENBQVM7Ozs7d0NBRU4sRUFBZ0I7Ozs7eUNBQ0YsQ0FBaUI7O21EQUMxQixDQUE0Qjs7c0JBRW5DO0FBQ2IsT0FBSSxFQUFFLGNBQVUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUMxQixZQUFPLDBCQUFFLHlDQUF5QyxFQUFFLENBQ2xELDBCQUFFLFlBQVksRUFBRSxDQUNkLDBCQUFFLGFBQWEsRUFBRSxDQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUNwQiwwQkFBRSw4Q0FBNEMsRUFBRSxFQUFDLE9BQU8sRUFBRSw0QkFSNUQsT0FBTyxnQkFEUCxnQkFBZ0IsRUFTc0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQ2pJLENBQUMsQ0FDSCxDQUFDLENBQ0gsQ0FBQztJQUNIO0VBQ0YiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA5MTIxOTAyOThmMTJlOTRmM2NkN1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IG1haW4gZnJvbSAnLi9tYWluLXBhZ2UnO1xyXG5pbXBvcnQgbWVzc2FnZXMgZnJvbSAnLi9tZXNzYWdlcyc7XHJcblxyXG4kKCBkb2N1bWVudCApLnJlYWR5KCgpID0+IHtcclxuICBtLnJvdXRlKGRvY3VtZW50LmJvZHksICcvJywge1xyXG4gICAgJy8nOiBtYWluLFxyXG4gICAgJy9tZXNzYWdlcyc6IG1lc3NhZ2VzXHJcbiAgfSk7XHJcbn0pXHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvaW5kZXguanNcbiAqKi8iLCJ2YXIgbSA9IChmdW5jdGlvbiBhcHAod2luZG93LCB1bmRlZmluZWQpIHtcclxuXHR2YXIgT0JKRUNUID0gXCJbb2JqZWN0IE9iamVjdF1cIiwgQVJSQVkgPSBcIltvYmplY3QgQXJyYXldXCIsIFNUUklORyA9IFwiW29iamVjdCBTdHJpbmddXCIsIEZVTkNUSU9OID0gXCJmdW5jdGlvblwiO1xyXG5cdHZhciB0eXBlID0ge30udG9TdHJpbmc7XHJcblx0dmFyIHBhcnNlciA9IC8oPzooXnwjfFxcLikoW14jXFwuXFxbXFxdXSspKXwoXFxbLis/XFxdKS9nLCBhdHRyUGFyc2VyID0gL1xcWyguKz8pKD86PShcInwnfCkoLio/KVxcMik/XFxdLztcclxuXHR2YXIgdm9pZEVsZW1lbnRzID0gL14oQVJFQXxCQVNFfEJSfENPTHxDT01NQU5EfEVNQkVEfEhSfElNR3xJTlBVVHxLRVlHRU58TElOS3xNRVRBfFBBUkFNfFNPVVJDRXxUUkFDS3xXQlIpJC87XHJcblx0dmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9XHJcblxyXG5cdC8vIGNhY2hpbmcgY29tbW9ubHkgdXNlZCB2YXJpYWJsZXNcclxuXHR2YXIgJGRvY3VtZW50LCAkbG9jYXRpb24sICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUsICRjYW5jZWxBbmltYXRpb25GcmFtZTtcclxuXHJcblx0Ly8gc2VsZiBpbnZva2luZyBmdW5jdGlvbiBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgd2F5IG1vY2tzIHdvcmtcclxuXHRmdW5jdGlvbiBpbml0aWFsaXplKHdpbmRvdyl7XHJcblx0XHQkZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcblx0XHQkbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XHJcblx0XHQkY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LmNsZWFyVGltZW91dDtcclxuXHRcdCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5zZXRUaW1lb3V0O1xyXG5cdH1cclxuXHJcblx0aW5pdGlhbGl6ZSh3aW5kb3cpO1xyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQHR5cGVkZWYge1N0cmluZ30gVGFnXHJcblx0ICogQSBzdHJpbmcgdGhhdCBsb29rcyBsaWtlIC0+IGRpdi5jbGFzc25hbWUjaWRbcGFyYW09b25lXVtwYXJhbTI9dHdvXVxyXG5cdCAqIFdoaWNoIGRlc2NyaWJlcyBhIERPTSBub2RlXHJcblx0ICovXHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LCBvciBzcGxhdCAob3B0aW9uYWwpXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0XHR2YXIgaGFzQXR0cnMgPSBhcmdzWzFdICE9IG51bGwgJiYgdHlwZS5jYWxsKGFyZ3NbMV0pID09PSBPQkpFQ1QgJiYgIShcInRhZ1wiIGluIGFyZ3NbMV0gfHwgXCJ2aWV3XCIgaW4gYXJnc1sxXSkgJiYgIShcInN1YnRyZWVcIiBpbiBhcmdzWzFdKTtcclxuXHRcdHZhciBhdHRycyA9IGhhc0F0dHJzID8gYXJnc1sxXSA6IHt9O1xyXG5cdFx0dmFyIGNsYXNzQXR0ck5hbWUgPSBcImNsYXNzXCIgaW4gYXR0cnMgPyBcImNsYXNzXCIgOiBcImNsYXNzTmFtZVwiO1xyXG5cdFx0dmFyIGNlbGwgPSB7dGFnOiBcImRpdlwiLCBhdHRyczoge319O1xyXG5cdFx0dmFyIG1hdGNoLCBjbGFzc2VzID0gW107XHJcblx0XHRpZiAodHlwZS5jYWxsKGFyZ3NbMF0pICE9IFNUUklORykgdGhyb3cgbmV3IEVycm9yKFwic2VsZWN0b3IgaW4gbShzZWxlY3RvciwgYXR0cnMsIGNoaWxkcmVuKSBzaG91bGQgYmUgYSBzdHJpbmdcIilcclxuXHRcdHdoaWxlIChtYXRjaCA9IHBhcnNlci5leGVjKGFyZ3NbMF0pKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkgY2VsbC50YWcgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiI1wiKSBjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl07XHJcblx0XHRcdGVsc2UgaWYgKG1hdGNoWzFdID09PSBcIi5cIikgY2xhc3Nlcy5wdXNoKG1hdGNoWzJdKTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSBhdHRyUGFyc2VyLmV4ZWMobWF0Y2hbM10pO1xyXG5cdFx0XHRcdGNlbGwuYXR0cnNbcGFpclsxXV0gPSBwYWlyWzNdIHx8IChwYWlyWzJdID8gXCJcIiA6dHJ1ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBjaGlsZHJlbiA9IGhhc0F0dHJzID8gYXJncy5zbGljZSgyKSA6IGFyZ3Muc2xpY2UoMSk7XHJcblx0XHRpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIHR5cGUuY2FsbChjaGlsZHJlblswXSkgPT09IEFSUkFZKSB7XHJcblx0XHRcdGNlbGwuY2hpbGRyZW4gPSBjaGlsZHJlblswXVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGNlbGwuY2hpbGRyZW4gPSBjaGlsZHJlblxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBhdHRycykge1xyXG5cdFx0XHRpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7XHJcblx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBjbGFzc0F0dHJOYW1lICYmIGF0dHJzW2F0dHJOYW1lXSAhPSBudWxsICYmIGF0dHJzW2F0dHJOYW1lXSAhPT0gXCJcIikge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGF0dHJzW2F0dHJOYW1lXSlcclxuXHRcdFx0XHRcdGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gXCJcIiAvL2NyZWF0ZSBrZXkgaW4gY29ycmVjdCBpdGVyYXRpb24gb3JkZXJcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBjZWxsLmF0dHJzW2F0dHJOYW1lXSA9IGF0dHJzW2F0dHJOYW1lXVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSBjZWxsLmF0dHJzW2NsYXNzQXR0ck5hbWVdID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIGNlbGxcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBwYXJlbnRDYWNoZSwgcGFyZW50SW5kZXgsIGRhdGEsIGNhY2hlZCwgc2hvdWxkUmVhdHRhY2gsIGluZGV4LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSB7XHJcblx0XHQvL2BidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbCBvZiBET00gZWxlbWVudHMgYmFzZWQgb24gY29tcGFyaXNvbiBiZXR3ZWVuIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vdGhlIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQvLzEgLSBjb21wYXJlIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIHdoYXQgdGhlIGRpZmZlcmVuY2UgaXNcclxuXHRcdC8vMyAtIHJlY3Vyc2l2ZWx5IGFwcGx5IHRoaXMgYWxnb3JpdGhtIGZvciBldmVyeSBhcnJheSBhbmQgZm9yIHRoZSBjaGlsZHJlbiBvZiBldmVyeSB2aXJ0dWFsIGVsZW1lbnRcclxuXHJcblx0XHQvL3RoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBpcyBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXMgcmVkcmF3J3MgYGRhdGFgIGRhdGEgc3RydWN0dXJlLCB3aXRoIGEgZmV3IGFkZGl0aW9uczpcclxuXHRcdC8vLSBgY2FjaGVkYCBhbHdheXMgaGFzIGEgcHJvcGVydHkgY2FsbGVkIGBub2Rlc2AsIHdoaWNoIGlzIGEgbGlzdCBvZiBET00gZWxlbWVudHMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBkYXRhIHJlcHJlc2VudGVkIGJ5IHRoZSByZXNwZWN0aXZlIHZpcnR1YWwgZWxlbWVudFxyXG5cdFx0Ly8tIGluIG9yZGVyIHRvIHN1cHBvcnQgYXR0YWNoaW5nIGBub2Rlc2AgYXMgYSBwcm9wZXJ0eSBvZiBgY2FjaGVkYCwgYGNhY2hlZGAgaXMgKmFsd2F5cyogYSBub24tcHJpbWl0aXZlIG9iamVjdCwgaS5lLiBpZiB0aGUgZGF0YSB3YXMgYSBzdHJpbmcsIHRoZW4gY2FjaGVkIGlzIGEgU3RyaW5nIGluc3RhbmNlLiBJZiBkYXRhIHdhcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIGNhY2hlZCBpcyBgbmV3IFN0cmluZyhcIlwiKWBcclxuXHRcdC8vLSBgY2FjaGVkIGFsc28gaGFzIGEgYGNvbmZpZ0NvbnRleHRgIHByb3BlcnR5LCB3aGljaCBpcyB0aGUgc3RhdGUgc3RvcmFnZSBvYmplY3QgZXhwb3NlZCBieSBjb25maWcoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dClcclxuXHRcdC8vLSB3aGVuIGBjYWNoZWRgIGlzIGFuIE9iamVjdCwgaXQgcmVwcmVzZW50cyBhIHZpcnR1YWwgZWxlbWVudDsgd2hlbiBpdCdzIGFuIEFycmF5LCBpdCByZXByZXNlbnRzIGEgbGlzdCBvZiBlbGVtZW50czsgd2hlbiBpdCdzIGEgU3RyaW5nLCBOdW1iZXIgb3IgQm9vbGVhbiwgaXQgcmVwcmVzZW50cyBhIHRleHQgbm9kZVxyXG5cclxuXHRcdC8vYHBhcmVudEVsZW1lbnRgIGlzIGEgRE9NIGVsZW1lbnQgdXNlZCBmb3IgVzNDIERPTSBBUEkgY2FsbHNcclxuXHRcdC8vYHBhcmVudFRhZ2AgaXMgb25seSB1c2VkIGZvciBoYW5kbGluZyBhIGNvcm5lciBjYXNlIGZvciB0ZXh0YXJlYSB2YWx1ZXNcclxuXHRcdC8vYHBhcmVudENhY2hlYCBpcyB1c2VkIHRvIHJlbW92ZSBub2RlcyBpbiBzb21lIG11bHRpLW5vZGUgY2FzZXNcclxuXHRcdC8vYHBhcmVudEluZGV4YCBhbmQgYGluZGV4YCBhcmUgdXNlZCB0byBmaWd1cmUgb3V0IHRoZSBvZmZzZXQgb2Ygbm9kZXMuIFRoZXkncmUgYXJ0aWZhY3RzIGZyb20gYmVmb3JlIGFycmF5cyBzdGFydGVkIGJlaW5nIGZsYXR0ZW5lZCBhbmQgYXJlIGxpa2VseSByZWZhY3RvcmFibGVcclxuXHRcdC8vYGRhdGFgIGFuZCBgY2FjaGVkYCBhcmUsIHJlc3BlY3RpdmVseSwgdGhlIG5ldyBhbmQgb2xkIG5vZGVzIGJlaW5nIGRpZmZlZFxyXG5cdFx0Ly9gc2hvdWxkUmVhdHRhY2hgIGlzIGEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgYSBwYXJlbnQgbm9kZSB3YXMgcmVjcmVhdGVkIChpZiBzbywgYW5kIGlmIHRoaXMgbm9kZSBpcyByZXVzZWQsIHRoZW4gdGhpcyBub2RlIG11c3QgcmVhdHRhY2ggaXRzZWxmIHRvIHRoZSBuZXcgcGFyZW50KVxyXG5cdFx0Ly9gZWRpdGFibGVgIGlzIGEgZmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIGFuIGFuY2VzdG9yIGlzIGNvbnRlbnRlZGl0YWJsZVxyXG5cdFx0Ly9gbmFtZXNwYWNlYCBpbmRpY2F0ZXMgdGhlIGNsb3Nlc3QgSFRNTCBuYW1lc3BhY2UgYXMgaXQgY2FzY2FkZXMgZG93biBmcm9tIGFuIGFuY2VzdG9yXHJcblx0XHQvL2Bjb25maWdzYCBpcyBhIGxpc3Qgb2YgY29uZmlnIGZ1bmN0aW9ucyB0byBydW4gYWZ0ZXIgdGhlIHRvcG1vc3QgYGJ1aWxkYCBjYWxsIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHJcblx0XHQvL3RoZXJlJ3MgbG9naWMgdGhhdCByZWxpZXMgb24gdGhlIGFzc3VtcHRpb24gdGhhdCBudWxsIGFuZCB1bmRlZmluZWQgZGF0YSBhcmUgZXF1aXZhbGVudCB0byBlbXB0eSBzdHJpbmdzXHJcblx0XHQvLy0gdGhpcyBwcmV2ZW50cyBsaWZlY3ljbGUgc3VycHJpc2VzIGZyb20gcHJvY2VkdXJhbCBoZWxwZXJzIHRoYXQgbWl4IGltcGxpY2l0IGFuZCBleHBsaWNpdCByZXR1cm4gc3RhdGVtZW50cyAoZS5nLiBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0Ly8tIGl0IHNpbXBsaWZpZXMgZGlmZmluZyBjb2RlXHJcblx0XHQvL2RhdGEudG9TdHJpbmcoKSBtaWdodCB0aHJvdyBvciByZXR1cm4gbnVsbCBpZiBkYXRhIGlzIHRoZSByZXR1cm4gdmFsdWUgb2YgQ29uc29sZS5sb2cgaW4gRmlyZWZveCAoYmVoYXZpb3IgZGVwZW5kcyBvbiB2ZXJzaW9uKVxyXG5cdFx0dHJ5IHtpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEudG9TdHJpbmcoKSA9PSBudWxsKSBkYXRhID0gXCJcIjt9IGNhdGNoIChlKSB7ZGF0YSA9IFwiXCJ9XHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0dmFyIGNhY2hlZFR5cGUgPSB0eXBlLmNhbGwoY2FjaGVkKSwgZGF0YVR5cGUgPSB0eXBlLmNhbGwoZGF0YSk7XHJcblx0XHRpZiAoY2FjaGVkID09IG51bGwgfHwgY2FjaGVkVHlwZSAhPT0gZGF0YVR5cGUpIHtcclxuXHRcdFx0aWYgKGNhY2hlZCAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHBhcmVudENhY2hlICYmIHBhcmVudENhY2hlLm5vZGVzKSB7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0ID0gaW5kZXggLSBwYXJlbnRJbmRleDtcclxuXHRcdFx0XHRcdHZhciBlbmQgPSBvZmZzZXQgKyAoZGF0YVR5cGUgPT09IEFSUkFZID8gZGF0YSA6IGNhY2hlZC5ub2RlcykubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Y2xlYXIocGFyZW50Q2FjaGUubm9kZXMuc2xpY2Uob2Zmc2V0LCBlbmQpLCBwYXJlbnRDYWNoZS5zbGljZShvZmZzZXQsIGVuZCkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGNhY2hlZC5ub2RlcykgY2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3I7XHJcblx0XHRcdGlmIChjYWNoZWQudGFnKSBjYWNoZWQgPSB7fTsgLy9pZiBjb25zdHJ1Y3RvciBjcmVhdGVzIGEgdmlydHVhbCBkb20gZWxlbWVudCwgdXNlIGEgYmxhbmsgb2JqZWN0IGFzIHRoZSBiYXNlIGNhY2hlZCBub2RlIGluc3RlYWQgb2YgY29weWluZyB0aGUgdmlydHVhbCBlbCAoIzI3NylcclxuXHRcdFx0Y2FjaGVkLm5vZGVzID0gW11cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YVR5cGUgPT09IEFSUkFZKSB7XHJcblx0XHRcdC8vcmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheVxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlLmNhbGwoZGF0YVtpXSkgPT09IEFSUkFZKSB7XHJcblx0XHRcdFx0XHRkYXRhID0gZGF0YS5jb25jYXQuYXBwbHkoW10sIGRhdGEpO1xyXG5cdFx0XHRcdFx0aS0tIC8vY2hlY2sgY3VycmVudCBpbmRleCBhZ2FpbiBhbmQgZmxhdHRlbiB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZSBuZXN0ZWQgYXJyYXlzIGF0IHRoYXQgaW5kZXhcclxuXHRcdFx0XHRcdGxlbiA9IGRhdGEubGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgbm9kZXMgPSBbXSwgaW50YWN0ID0gY2FjaGVkLmxlbmd0aCA9PT0gZGF0YS5sZW5ndGgsIHN1YkFycmF5Q291bnQgPSAwO1xyXG5cclxuXHRcdFx0Ly9rZXlzIGFsZ29yaXRobTogc29ydCBlbGVtZW50cyB3aXRob3V0IHJlY3JlYXRpbmcgdGhlbSBpZiBrZXlzIGFyZSBwcmVzZW50XHJcblx0XHRcdC8vMSkgY3JlYXRlIGEgbWFwIG9mIGFsbCBleGlzdGluZyBrZXlzLCBhbmQgbWFyayBhbGwgZm9yIGRlbGV0aW9uXHJcblx0XHRcdC8vMikgYWRkIG5ldyBrZXlzIHRvIG1hcCBhbmQgbWFyayB0aGVtIGZvciBhZGRpdGlvblxyXG5cdFx0XHQvLzMpIGlmIGtleSBleGlzdHMgaW4gbmV3IGxpc3QsIGNoYW5nZSBhY3Rpb24gZnJvbSBkZWxldGlvbiB0byBhIG1vdmVcclxuXHRcdFx0Ly80KSBmb3IgZWFjaCBrZXksIGhhbmRsZSBpdHMgY29ycmVzcG9uZGluZyBhY3Rpb24gYXMgbWFya2VkIGluIHByZXZpb3VzIHN0ZXBzXHJcblx0XHRcdHZhciBERUxFVElPTiA9IDEsIElOU0VSVElPTiA9IDIgLCBNT1ZFID0gMztcclxuXHRcdFx0dmFyIGV4aXN0aW5nID0ge30sIHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNhY2hlZC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0gJiYgY2FjaGVkW2ldLmF0dHJzICYmIGNhY2hlZFtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0c2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIGd1aWQgPSAwXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycyAmJiBkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtqXSAmJiBkYXRhW2pdLmF0dHJzICYmIGRhdGFbal0uYXR0cnMua2V5ID09IG51bGwpIGRhdGFbal0uYXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykge1xyXG5cdFx0XHRcdHZhciBrZXlzRGlmZmVyID0gZmFsc2VcclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggIT0gY2FjaGVkLmxlbmd0aCkga2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRlbHNlIGZvciAodmFyIGkgPSAwLCBjYWNoZWRDZWxsLCBkYXRhQ2VsbDsgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXSwgZGF0YUNlbGwgPSBkYXRhW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRDZWxsLmF0dHJzICYmIGRhdGFDZWxsLmF0dHJzICYmIGNhY2hlZENlbGwuYXR0cnMua2V5ICE9IGRhdGFDZWxsLmF0dHJzLmtleSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoa2V5c0RpZmZlcikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIga2V5ID0gZGF0YVtpXS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWV4aXN0aW5nW2tleV0pIGV4aXN0aW5nW2tleV0gPSB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfTtcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgZXhpc3Rpbmdba2V5XSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBNT1ZFLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpbmRleDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudDogY2FjaGVkLm5vZGVzW2V4aXN0aW5nW2tleV0uaW5kZXhdIHx8ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR2YXIgYWN0aW9ucyA9IFtdXHJcblx0XHRcdFx0XHRmb3IgKHZhciBwcm9wIGluIGV4aXN0aW5nKSBhY3Rpb25zLnB1c2goZXhpc3RpbmdbcHJvcF0pXHJcblx0XHRcdFx0XHR2YXIgY2hhbmdlcyA9IGFjdGlvbnMuc29ydChzb3J0Q2hhbmdlcyk7XHJcblx0XHRcdFx0XHR2YXIgbmV3Q2FjaGVkID0gbmV3IEFycmF5KGNhY2hlZC5sZW5ndGgpXHJcblx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXMgPSBjYWNoZWQubm9kZXMuc2xpY2UoKVxyXG5cclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGFuZ2U7IGNoYW5nZSA9IGNoYW5nZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gREVMRVRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWRbY2hhbmdlLmluZGV4XS5ub2RlcywgY2FjaGVkW2NoYW5nZS5pbmRleF0pO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAxKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdFx0XHRcdFx0XHRkdW1teS5rZXkgPSBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGR1bW15LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMCwge2F0dHJzOiB7a2V5OiBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5fSwgbm9kZXM6IFtkdW1teV19KVxyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tjaGFuZ2UuaW5kZXhdID0gZHVtbXlcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IE1PVkUpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gIT09IGNoYW5nZS5lbGVtZW50ICYmIGNoYW5nZS5lbGVtZW50ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShjaGFuZ2UuZWxlbWVudCwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2NoYW5nZS5pbmRleF0gfHwgbnVsbClcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkW2NoYW5nZS5pbmRleF0gPSBjYWNoZWRbY2hhbmdlLmZyb21dXHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBjaGFuZ2UuZWxlbWVudFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYWNoZWQgPSBuZXdDYWNoZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vZW5kIGtleSBhbGdvcml0aG1cclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjYWNoZUNvdW50ID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdC8vZGlmZiBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIGNhY2hlZCwgaW5kZXgsIGRhdGFbaV0sIGNhY2hlZFtjYWNoZUNvdW50XSwgc2hvdWxkUmVhdHRhY2gsIGluZGV4ICsgc3ViQXJyYXlDb3VudCB8fCBzdWJBcnJheUNvdW50LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRpZiAoaXRlbSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHRcdFx0XHRpZiAoIWl0ZW0ubm9kZXMuaW50YWN0KSBpbnRhY3QgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAoaXRlbS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0Ly9maXggb2Zmc2V0IG9mIG5leHQgZWxlbWVudCBpZiBpdGVtIHdhcyBhIHRydXN0ZWQgc3RyaW5nIHcvIG1vcmUgdGhhbiBvbmUgaHRtbCBlbGVtZW50XHJcblx0XHRcdFx0XHQvL3RoZSBmaXJzdCBjbGF1c2UgaW4gdGhlIHJlZ2V4cCBtYXRjaGVzIGVsZW1lbnRzXHJcblx0XHRcdFx0XHQvL3RoZSBzZWNvbmQgY2xhdXNlIChhZnRlciB0aGUgcGlwZSkgbWF0Y2hlcyB0ZXh0IG5vZGVzXHJcblx0XHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IChpdGVtLm1hdGNoKC88W15cXC9dfFxcPlxccypbXjxdL2cpIHx8IFswXSkubGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Ugc3ViQXJyYXlDb3VudCArPSB0eXBlLmNhbGwoaXRlbSkgPT09IEFSUkFZID8gaXRlbS5sZW5ndGggOiAxO1xyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50KytdID0gaXRlbVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaW50YWN0KSB7XHJcblx0XHRcdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3VwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyIHRoYW4gdGhlIG9sZCBvbmVcclxuXHRcdFx0XHQvL2lmIGVycm9ycyBldmVyIGhhcHBlbiBoZXJlLCB0aGUgaXNzdWUgaXMgbW9zdCBsaWtlbHkgYSBidWcgaW4gdGhlIGNvbnN0cnVjdGlvbiBvZiB0aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbm9kZTsgbm9kZSA9IGNhY2hlZC5ub2Rlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIGNsZWFyKFtub2RlXSwgW2NhY2hlZFtpXV0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhICE9IG51bGwgJiYgZGF0YVR5cGUgPT09IE9CSkVDVCkge1xyXG5cdFx0XHR2YXIgdmlld3MgPSBbXSwgY29udHJvbGxlcnMgPSBbXVxyXG5cdFx0XHR3aGlsZSAoZGF0YS52aWV3KSB7XHJcblx0XHRcdFx0dmFyIHZpZXcgPSBkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlld1xyXG5cdFx0XHRcdHZhciBjb250cm9sbGVySW5kZXggPSBtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC52aWV3cyA/IGNhY2hlZC52aWV3cy5pbmRleE9mKHZpZXcpIDogLTFcclxuXHRcdFx0XHR2YXIgY29udHJvbGxlciA9IGNvbnRyb2xsZXJJbmRleCA+IC0xID8gY2FjaGVkLmNvbnRyb2xsZXJzW2NvbnRyb2xsZXJJbmRleF0gOiBuZXcgKGRhdGEuY29udHJvbGxlciB8fCBub29wKVxyXG5cdFx0XHRcdHZhciBrZXkgPSBkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXlcclxuXHRcdFx0XHRkYXRhID0gcGVuZGluZ1JlcXVlc3RzID09IDAgfHwgKGNhY2hlZCAmJiBjYWNoZWQuY29udHJvbGxlcnMgJiYgY2FjaGVkLmNvbnRyb2xsZXJzLmluZGV4T2YoY29udHJvbGxlcikgPiAtMSkgPyBkYXRhLnZpZXcoY29udHJvbGxlcikgOiB7dGFnOiBcInBsYWNlaG9sZGVyXCJ9XHJcblx0XHRcdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZDtcclxuXHRcdFx0XHRpZiAoa2V5KSB7XHJcblx0XHRcdFx0XHRpZiAoIWRhdGEuYXR0cnMpIGRhdGEuYXR0cnMgPSB7fVxyXG5cdFx0XHRcdFx0ZGF0YS5hdHRycy5rZXkgPSBrZXlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQpIHVubG9hZGVycy5wdXNoKHtjb250cm9sbGVyOiBjb250cm9sbGVyLCBoYW5kbGVyOiBjb250cm9sbGVyLm9udW5sb2FkfSlcclxuXHRcdFx0XHR2aWV3cy5wdXNoKHZpZXcpXHJcblx0XHRcdFx0Y29udHJvbGxlcnMucHVzaChjb250cm9sbGVyKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghZGF0YS50YWcgJiYgY29udHJvbGxlcnMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoXCJDb21wb25lbnQgdGVtcGxhdGUgbXVzdCByZXR1cm4gYSB2aXJ0dWFsIGVsZW1lbnQsIG5vdCBhbiBhcnJheSwgc3RyaW5nLCBldGMuXCIpXHJcblx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9O1xyXG5cdFx0XHRpZiAoIWNhY2hlZC5hdHRycykgY2FjaGVkLmF0dHJzID0ge307XHJcblxyXG5cdFx0XHR2YXIgZGF0YUF0dHJLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5hdHRycylcclxuXHRcdFx0dmFyIGhhc0tleXMgPSBkYXRhQXR0cktleXMubGVuZ3RoID4gKFwia2V5XCIgaW4gZGF0YS5hdHRycyA/IDEgOiAwKVxyXG5cdFx0XHQvL2lmIGFuIGVsZW1lbnQgaXMgZGlmZmVyZW50IGVub3VnaCBmcm9tIHRoZSBvbmUgaW4gY2FjaGUsIHJlY3JlYXRlIGl0XHJcblx0XHRcdGlmIChkYXRhLnRhZyAhPSBjYWNoZWQudGFnIHx8IGRhdGFBdHRyS2V5cy5zb3J0KCkuam9pbigpICE9IE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSB8fCBkYXRhLmF0dHJzLmlkICE9IGNhY2hlZC5hdHRycy5pZCB8fCBkYXRhLmF0dHJzLmtleSAhPSBjYWNoZWQuYXR0cnMua2V5IHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiYWxsXCIgJiYgKCFjYWNoZWQuY29uZmlnQ29udGV4dCB8fCBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gIT09IHRydWUpKSB8fCAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcImRpZmZcIiAmJiBjYWNoZWQuY29uZmlnQ29udGV4dCAmJiBjYWNoZWQuY29uZmlnQ29udGV4dC5yZXRhaW4gPT09IGZhbHNlKSkge1xyXG5cdFx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoKSBjbGVhcihjYWNoZWQubm9kZXMpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJiB0eXBlb2YgY2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPT09IEZVTkNUSU9OKSBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpXHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb250cm9sbGVycykge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIGNvbnRyb2xsZXIub251bmxvYWQgPT09IEZVTkNUSU9OKSBjb250cm9sbGVyLm9udW5sb2FkKHtwcmV2ZW50RGVmYXVsdDogbm9vcH0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoZGF0YS50YWcpICE9IFNUUklORykgcmV0dXJuO1xyXG5cclxuXHRcdFx0dmFyIG5vZGUsIGlzTmV3ID0gY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMDtcclxuXHRcdFx0aWYgKGRhdGEuYXR0cnMueG1sbnMpIG5hbWVzcGFjZSA9IGRhdGEuYXR0cnMueG1sbnM7XHJcblx0XHRcdGVsc2UgaWYgKGRhdGEudGFnID09PSBcInN2Z1wiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XHJcblx0XHRcdGVsc2UgaWYgKGRhdGEudGFnID09PSBcIm1hdGhcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MXCI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaXNOZXcpIHtcclxuXHRcdFx0XHRpZiAoZGF0YS5hdHRycy5pcykgbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKTtcclxuXHRcdFx0XHRlbHNlIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZyk7XHJcblx0XHRcdFx0Y2FjaGVkID0ge1xyXG5cdFx0XHRcdFx0dGFnOiBkYXRhLnRhZyxcclxuXHRcdFx0XHRcdC8vc2V0IGF0dHJpYnV0ZXMgZmlyc3QsIHRoZW4gY3JlYXRlIGNoaWxkcmVuXHJcblx0XHRcdFx0XHRhdHRyczogaGFzS2V5cyA/IHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIHt9LCBuYW1lc3BhY2UpIDogZGF0YS5hdHRycyxcclxuXHRcdFx0XHRcdGNoaWxkcmVuOiBkYXRhLmNoaWxkcmVuICE9IG51bGwgJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwID9cclxuXHRcdFx0XHRcdFx0YnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIHRydWUsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0XHRcdFx0ZGF0YS5jaGlsZHJlbixcclxuXHRcdFx0XHRcdG5vZGVzOiBbbm9kZV1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVycy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNhY2hlZC52aWV3cyA9IHZpZXdzXHJcblx0XHRcdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkICYmIGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCkgY29udHJvbGxlci5vbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWQuJG9sZFxyXG5cdFx0XHRcdFx0XHRpZiAocGVuZGluZ1JlcXVlc3RzICYmIGNvbnRyb2xsZXIub251bmxvYWQpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZCA9IG5vb3BcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkLiRvbGQgPSBvbnVubG9hZFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2RlcykgY2FjaGVkLmNoaWxkcmVuLm5vZGVzID0gW107XHJcblx0XHRcdFx0Ly9lZGdlIGNhc2U6IHNldHRpbmcgdmFsdWUgb24gPHNlbGVjdD4gZG9lc24ndCB3b3JrIGJlZm9yZSBjaGlsZHJlbiBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRcdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIFwidmFsdWVcIiBpbiBkYXRhLmF0dHJzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCB7dmFsdWU6IGRhdGEuYXR0cnMudmFsdWV9LCB7fSwgbmFtZXNwYWNlKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bm9kZSA9IGNhY2hlZC5ub2Rlc1swXTtcclxuXHRcdFx0XHRpZiAoaGFzS2V5cykgc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywgY2FjaGVkLmF0dHJzLCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdGNhY2hlZC5jaGlsZHJlbiA9IGJ1aWxkKG5vZGUsIGRhdGEudGFnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZGF0YS5jaGlsZHJlbiwgY2FjaGVkLmNoaWxkcmVuLCBmYWxzZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWU7XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSAmJiBub2RlICE9IG51bGwpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHQvL3NjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYCBmaW5pc2hlcyBydW5uaW5nXHJcblx0XHRcdGlmICh0eXBlb2YgZGF0YS5hdHRyc1tcImNvbmZpZ1wiXSA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgY29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgfHwge307XHJcblxyXG5cdFx0XHRcdC8vIGJpbmRcclxuXHRcdFx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbihkYXRhLCBhcmdzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdLmFwcGx5KGRhdGEsIGFyZ3MpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRjb25maWdzLnB1c2goY2FsbGJhY2soZGF0YSwgW25vZGUsICFpc05ldywgY29udGV4dCwgY2FjaGVkXSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhICE9IEZVTkNUSU9OKSB7XHJcblx0XHRcdC8vaGFuZGxlIHRleHQgbm9kZXNcclxuXHRcdFx0dmFyIG5vZGVzO1xyXG5cdFx0XHRpZiAoY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0bm9kZXMgPSBbJGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGRhdGEpXTtcclxuXHRcdFx0XHRcdGlmICghcGFyZW50RWxlbWVudC5ub2RlTmFtZS5tYXRjaCh2b2lkRWxlbWVudHMpKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2Rlc1swXSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBcInN0cmluZyBudW1iZXIgYm9vbGVhblwiLmluZGV4T2YodHlwZW9mIGRhdGEpID4gLTEgPyBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKSA6IGRhdGE7XHJcblx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRcdG5vZGVzID0gY2FjaGVkLm5vZGVzO1xyXG5cdFx0XHRcdGlmICghZWRpdGFibGUgfHwgZWRpdGFibGUgIT09ICRkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdFx0XHRjbGVhcihub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vY29ybmVyIGNhc2U6IHJlcGxhY2luZyB0aGUgbm9kZVZhbHVlIG9mIGEgdGV4dCBub2RlIHRoYXQgaXMgYSBjaGlsZCBvZiBhIHRleHRhcmVhL2NvbnRlbnRlZGl0YWJsZSBkb2Vzbid0IHdvcmtcclxuXHRcdFx0XHRcdFx0Ly93ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgcHJvcGVydHkgb2YgdGhlIHBhcmVudCB0ZXh0YXJlYSBvciB0aGUgaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50ZWRpdGFibGUgZWxlbWVudCBpbnN0ZWFkXHJcblx0XHRcdFx0XHRcdGlmIChwYXJlbnRUYWcgPT09IFwidGV4dGFyZWFcIikgcGFyZW50RWxlbWVudC52YWx1ZSA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGVkaXRhYmxlKSBlZGl0YWJsZS5pbm5lckhUTUwgPSBkYXRhO1xyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAobm9kZXNbMF0ubm9kZVR5cGUgPT09IDEgfHwgbm9kZXMubGVuZ3RoID4gMSkgeyAvL3dhcyBhIHRydXN0ZWQgc3RyaW5nXHJcblx0XHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZCk7XHJcblx0XHRcdFx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5vZGVzWzBdLm5vZGVWYWx1ZSA9IGRhdGFcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcihkYXRhKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgY2FjaGVkLm5vZGVzLmludGFjdCA9IHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHNvcnRDaGFuZ2VzKGEsIGIpIHtyZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleH1cclxuXHRmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKG5vZGUsIHRhZywgZGF0YUF0dHJzLCBjYWNoZWRBdHRycywgbmFtZXNwYWNlKSB7XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBkYXRhQXR0cnMpIHtcclxuXHRcdFx0dmFyIGRhdGFBdHRyID0gZGF0YUF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0dmFyIGNhY2hlZEF0dHIgPSBjYWNoZWRBdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdGlmICghKGF0dHJOYW1lIGluIGNhY2hlZEF0dHJzKSB8fCAoY2FjaGVkQXR0ciAhPT0gZGF0YUF0dHIpKSB7XHJcblx0XHRcdFx0Y2FjaGVkQXR0cnNbYXR0ck5hbWVdID0gZGF0YUF0dHI7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vYGNvbmZpZ2AgaXNuJ3QgYSByZWFsIGF0dHJpYnV0ZXMsIHNvIGlnbm9yZSBpdFxyXG5cdFx0XHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImNvbmZpZ1wiIHx8IGF0dHJOYW1lID09IFwia2V5XCIpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0Ly9ob29rIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBhdXRvLXJlZHJhd2luZyBzeXN0ZW1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkYXRhQXR0ciA9PT0gRlVOQ1RJT04gJiYgYXR0ck5hbWUuaW5kZXhPZihcIm9uXCIpID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdG5vZGVbYXR0ck5hbWVdID0gYXV0b3JlZHJhdyhkYXRhQXR0ciwgbm9kZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vaGFuZGxlIGBzdHlsZTogey4uLn1gXHJcblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJzdHlsZVwiICYmIGRhdGFBdHRyICE9IG51bGwgJiYgdHlwZS5jYWxsKGRhdGFBdHRyKSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoY2FjaGVkQXR0ciA9PSBudWxsIHx8IGNhY2hlZEF0dHJbcnVsZV0gIT09IGRhdGFBdHRyW3J1bGVdKSBub2RlLnN0eWxlW3J1bGVdID0gZGF0YUF0dHJbcnVsZV1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBydWxlIGluIGNhY2hlZEF0dHIpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIShydWxlIGluIGRhdGFBdHRyKSkgbm9kZS5zdHlsZVtydWxlXSA9IFwiXCJcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgU1ZHXHJcblx0XHRcdFx0XHRlbHNlIGlmIChuYW1lc3BhY2UgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiaHJlZlwiKSBub2RlLnNldEF0dHJpYnV0ZU5TKFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLCBcImhyZWZcIiwgZGF0YUF0dHIpO1xyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJjbGFzc05hbWVcIikgbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGRhdGFBdHRyKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgY2FzZXMgdGhhdCBhcmUgcHJvcGVydGllcyAoYnV0IGlnbm9yZSBjYXNlcyB3aGVyZSB3ZSBzaG91bGQgdXNlIHNldEF0dHJpYnV0ZSBpbnN0ZWFkKVxyXG5cdFx0XHRcdFx0Ly8tIGxpc3QgYW5kIGZvcm0gYXJlIHR5cGljYWxseSB1c2VkIGFzIHN0cmluZ3MsIGJ1dCBhcmUgRE9NIGVsZW1lbnQgcmVmZXJlbmNlcyBpbiBqc1xyXG5cdFx0XHRcdFx0Ly8tIHdoZW4gdXNpbmcgQ1NTIHNlbGVjdG9ycyAoZS5nLiBgbShcIltzdHlsZT0nJ11cIilgKSwgc3R5bGUgaXMgdXNlZCBhcyBhIHN0cmluZywgYnV0IGl0J3MgYW4gb2JqZWN0IGluIGpzXHJcblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyTmFtZSBpbiBub2RlICYmICEoYXR0ck5hbWUgPT09IFwibGlzdFwiIHx8IGF0dHJOYW1lID09PSBcInN0eWxlXCIgfHwgYXR0ck5hbWUgPT09IFwiZm9ybVwiIHx8IGF0dHJOYW1lID09PSBcInR5cGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJ3aWR0aFwiIHx8IGF0dHJOYW1lID09PSBcImhlaWdodFwiKSkge1xyXG5cdFx0XHRcdFx0XHQvLyMzNDggZG9uJ3Qgc2V0IHRoZSB2YWx1ZSBpZiBub3QgbmVlZGVkIG90aGVyd2lzZSBjdXJzb3IgcGxhY2VtZW50IGJyZWFrcyBpbiBDaHJvbWVcclxuXHRcdFx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikgbm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0clxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHQvL3N3YWxsb3cgSUUncyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyB0byBtaW1pYyBIVE1MJ3MgZmFsbGJhY2stdG8tZG9pbmctbm90aGluZy1vbi1pbnZhbGlkLWF0dHJpYnV0ZXMgYmVoYXZpb3JcclxuXHRcdFx0XHRcdGlmIChlLm1lc3NhZ2UuaW5kZXhPZihcIkludmFsaWQgYXJndW1lbnRcIikgPCAwKSB0aHJvdyBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIzM0OCBkYXRhQXR0ciBtYXkgbm90IGJlIGEgc3RyaW5nLCBzbyB1c2UgbG9vc2UgY29tcGFyaXNvbiAoZG91YmxlIGVxdWFsKSBpbnN0ZWFkIG9mIHN0cmljdCAodHJpcGxlIGVxdWFsKVxyXG5cdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyA9PT0gXCJpbnB1dFwiICYmIG5vZGUudmFsdWUgIT0gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRub2RlLnZhbHVlID0gZGF0YUF0dHJcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNhY2hlZEF0dHJzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7bm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSl9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHt9IC8vaWdub3JlIGlmIHRoaXMgZmFpbHMgZHVlIHRvIG9yZGVyIG9mIGV2ZW50cyAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE5MjYwODMvZmFpbGVkLXRvLWV4ZWN1dGUtcmVtb3ZlY2hpbGQtb24tbm9kZSlcclxuXHRcdFx0XHRjYWNoZWQgPSBbXS5jb25jYXQoY2FjaGVkKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldKSB1bmxvYWQoY2FjaGVkW2ldKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobm9kZXMubGVuZ3RoICE9IDApIG5vZGVzLmxlbmd0aCA9IDBcclxuXHR9XHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKTtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBjb250cm9sbGVyOyBjb250cm9sbGVyID0gY2FjaGVkLmNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNvbnRyb2xsZXIub251bmxvYWQgPT09IEZVTkNUSU9OKSBjb250cm9sbGVyLm9udW5sb2FkKHtwcmV2ZW50RGVmYXVsdDogbm9vcH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoY2FjaGVkLmNoaWxkcmVuKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2FjaGVkLmNoaWxkcmVuW2ldOyBpKyspIHVubG9hZChjaGlsZClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQuY2hpbGRyZW4udGFnKSB1bmxvYWQoY2FjaGVkLmNoaWxkcmVuKVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPSAxO1xyXG5cdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblx0XHRcdGlmIChpc0VsZW1lbnQpIHtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgbmV4dFNpYmxpbmcgfHwgbnVsbCk7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcilcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIG5leHRTaWJsaW5nLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpXHJcblx0XHR9XHJcblx0XHRlbHNlIHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpO1xyXG5cdFx0dmFyIG5vZGVzID0gW107XHJcblx0XHR3aGlsZSAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSAhPT0gbmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0bm9kZXMucHVzaChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdFx0aW5kZXgrK1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGVzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHRyeSB7cmV0dXJuIGNhbGxiYWNrLmNhbGwob2JqZWN0LCBlKX1cclxuXHRcdFx0ZmluYWxseSB7XHJcblx0XHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBodG1sO1xyXG5cdHZhciBkb2N1bWVudE5vZGUgPSB7XHJcblx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHRpZiAoaHRtbCA9PT0gdW5kZWZpbmVkKSBodG1sID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodG1sXCIpO1xyXG5cdFx0XHRpZiAoJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICE9PSBub2RlKSB7XHJcblx0XHRcdFx0JGRvY3VtZW50LnJlcGxhY2VDaGlsZChub2RlLCAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgJGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0XHR0aGlzLmNoaWxkTm9kZXMgPSAkZG9jdW1lbnQuY2hpbGROb2Rlc1xyXG5cdFx0fSxcclxuXHRcdGluc2VydEJlZm9yZTogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG5vZGUpXHJcblx0XHR9LFxyXG5cdFx0Y2hpbGROb2RlczogW11cclxuXHR9O1xyXG5cdHZhciBub2RlQ2FjaGUgPSBbXSwgY2VsbENhY2hlID0ge307XHJcblx0bS5yZW5kZXIgPSBmdW5jdGlvbihyb290LCBjZWxsLCBmb3JjZVJlY3JlYXRpb24pIHtcclxuXHRcdHZhciBjb25maWdzID0gW107XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgcGFzc2VkIHRvIG0ucm91dGUvbS5tb3VudC9tLnJlbmRlciBpcyBub3QgdW5kZWZpbmVkLlwiKTtcclxuXHRcdHZhciBpZCA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdHZhciBpc0RvY3VtZW50Um9vdCA9IHJvb3QgPT09ICRkb2N1bWVudDtcclxuXHRcdHZhciBub2RlID0gaXNEb2N1bWVudFJvb3QgfHwgcm9vdCA9PT0gJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA/IGRvY3VtZW50Tm9kZSA6IHJvb3Q7XHJcblx0XHRpZiAoaXNEb2N1bWVudFJvb3QgJiYgY2VsbC50YWcgIT0gXCJodG1sXCIpIGNlbGwgPSB7dGFnOiBcImh0bWxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogY2VsbH07XHJcblx0XHRpZiAoY2VsbENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSBjbGVhcihub2RlLmNoaWxkTm9kZXMpO1xyXG5cdFx0aWYgKGZvcmNlUmVjcmVhdGlvbiA9PT0gdHJ1ZSkgcmVzZXQocm9vdCk7XHJcblx0XHRjZWxsQ2FjaGVbaWRdID0gYnVpbGQobm9kZSwgbnVsbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNlbGwsIGNlbGxDYWNoZVtpZF0sIGZhbHNlLCAwLCBudWxsLCB1bmRlZmluZWQsIGNvbmZpZ3MpO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvbmZpZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIGNvbmZpZ3NbaV0oKVxyXG5cdH07XHJcblx0ZnVuY3Rpb24gZ2V0Q2VsbENhY2hlS2V5KGVsZW1lbnQpIHtcclxuXHRcdHZhciBpbmRleCA9IG5vZGVDYWNoZS5pbmRleE9mKGVsZW1lbnQpO1xyXG5cdFx0cmV0dXJuIGluZGV4IDwgMCA/IG5vZGVDYWNoZS5wdXNoKGVsZW1lbnQpIC0gMSA6IGluZGV4XHJcblx0fVxyXG5cclxuXHRtLnRydXN0ID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhbHVlID0gbmV3IFN0cmluZyh2YWx1ZSk7XHJcblx0XHR2YWx1ZS4kdHJ1c3RlZCA9IHRydWU7XHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBnZXR0ZXJzZXR0ZXIoc3RvcmUpIHtcclxuXHRcdHZhciBwcm9wID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSBzdG9yZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHByb3AudG9KU09OID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHQvL25vdGU6IHVzaW5nIG5vbi1zdHJpY3QgZXF1YWxpdHkgY2hlY2sgaGVyZSBiZWNhdXNlIHdlJ3JlIGNoZWNraW5nIGlmIHN0b3JlIGlzIG51bGwgT1IgdW5kZWZpbmVkXHJcblx0XHRpZiAoKChzdG9yZSAhPSBudWxsICYmIHR5cGUuY2FsbChzdG9yZSkgPT09IE9CSkVDVCkgfHwgdHlwZW9mIHN0b3JlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHN0b3JlLnRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHN0b3JlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBnZXR0ZXJzZXR0ZXIoc3RvcmUpXHJcblx0fTtcclxuXHJcblx0dmFyIHJvb3RzID0gW10sIGNvbXBvbmVudHMgPSBbXSwgY29udHJvbGxlcnMgPSBbXSwgbGFzdFJlZHJhd0lkID0gbnVsbCwgbGFzdFJlZHJhd0NhbGxUaW1lID0gMCwgY29tcHV0ZVByZVJlZHJhd0hvb2sgPSBudWxsLCBjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsLCBwcmV2ZW50ZWQgPSBmYWxzZSwgdG9wQ29tcG9uZW50LCB1bmxvYWRlcnMgPSBbXTtcclxuXHR2YXIgRlJBTUVfQlVER0VUID0gMTY7IC8vNjAgZnJhbWVzIHBlciBzZWNvbmQgPSAxIGNhbGwgcGVyIDE2IG1zXHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgYXJncykge1xyXG5cdFx0dmFyIGNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIChjb21wb25lbnQuY29udHJvbGxlciB8fCBub29wKS5hcHBseSh0aGlzLCBhcmdzKSB8fCB0aGlzXHJcblx0XHR9XHJcblx0XHR2YXIgdmlldyA9IGZ1bmN0aW9uKGN0cmwpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSBhcmdzID0gYXJncy5jb25jYXQoW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdFx0XHRyZXR1cm4gY29tcG9uZW50LnZpZXcuYXBwbHkoY29tcG9uZW50LCBhcmdzID8gW2N0cmxdLmNvbmNhdChhcmdzKSA6IFtjdHJsXSlcclxuXHRcdH1cclxuXHRcdHZpZXcuJG9yaWdpbmFsID0gY29tcG9uZW50LnZpZXdcclxuXHRcdHZhciBvdXRwdXQgPSB7Y29udHJvbGxlcjogY29udHJvbGxlciwgdmlldzogdmlld31cclxuXHRcdGlmIChhcmdzWzBdICYmIGFyZ3NbMF0ua2V5ICE9IG51bGwpIG91dHB1dC5hdHRycyA9IHtrZXk6IGFyZ3NbMF0ua2V5fVxyXG5cdFx0cmV0dXJuIG91dHB1dFxyXG5cdH1cclxuXHRtLmNvbXBvbmVudCA9IGZ1bmN0aW9uKGNvbXBvbmVudCkge1xyXG5cdFx0cmV0dXJuIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcclxuXHR9XHJcblx0bS5tb3VudCA9IG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblx0XHRcclxuXHRcdHZhciBpc1ByZXZlbnRlZCA9IGZhbHNlO1xyXG5cdFx0dmFyIGV2ZW50ID0ge3ByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNQcmV2ZW50ZWQgPSB0cnVlO1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGw7XHJcblx0XHR9fTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCB1bmxvYWRlcjsgdW5sb2FkZXIgPSB1bmxvYWRlcnNbaV07IGkrKykge1xyXG5cdFx0XHR1bmxvYWRlci5oYW5kbGVyLmNhbGwodW5sb2FkZXIuY29udHJvbGxlciwgZXZlbnQpXHJcblx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSBudWxsXHJcblx0XHR9XHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gdW5sb2FkZXIuaGFuZGxlclxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB1bmxvYWRlcnMgPSBbXVxyXG5cdFx0XHJcblx0XHRpZiAoY29udHJvbGxlcnNbaW5kZXhdICYmIHR5cGVvZiBjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZChldmVudClcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKCFpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImFsbFwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJvb3RzW2luZGV4XSA9IHJvb3Q7XHJcblx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikgY29tcG9uZW50ID0gc3ViY29tcG9uZW50KGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKVxyXG5cdFx0XHR2YXIgY3VycmVudENvbXBvbmVudCA9IHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IGNvbXBvbmVudCB8fCB7Y29udHJvbGxlcjogZnVuY3Rpb24oKSB7fX07XHJcblx0XHRcdHZhciBjb25zdHJ1Y3RvciA9IGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3BcclxuXHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBuZXcgY29uc3RydWN0b3I7XHJcblx0XHRcdC8vY29udHJvbGxlcnMgbWF5IGNhbGwgbS5tb3VudCByZWN1cnNpdmVseSAodmlhIG0ucm91dGUgcmVkaXJlY3RzLCBmb3IgZXhhbXBsZSlcclxuXHRcdFx0Ly90aGlzIGNvbmRpdGlvbmFsIGVuc3VyZXMgb25seSB0aGUgbGFzdCByZWN1cnNpdmUgbS5tb3VudCBjYWxsIGlzIGFwcGxpZWRcclxuXHRcdFx0aWYgKGN1cnJlbnRDb21wb25lbnQgPT09IHRvcENvbXBvbmVudCkge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XSA9IGNvbnRyb2xsZXI7XHJcblx0XHRcdFx0Y29tcG9uZW50c1tpbmRleF0gPSBjb21wb25lbnRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJldHVybiBjb250cm9sbGVyc1tpbmRleF1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHZhciByZWRyYXdpbmcgPSBmYWxzZVxyXG5cdG0ucmVkcmF3ID0gZnVuY3Rpb24oZm9yY2UpIHtcclxuXHRcdGlmIChyZWRyYXdpbmcpIHJldHVyblxyXG5cdFx0cmVkcmF3aW5nID0gdHJ1ZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SWQgaXMgYSBwb3NpdGl2ZSBudW1iZXIgaWYgYSBzZWNvbmQgcmVkcmF3IGlzIHJlcXVlc3RlZCBiZWZvcmUgdGhlIG5leHQgYW5pbWF0aW9uIGZyYW1lXHJcblx0XHQvL2xhc3RSZWRyYXdJRCBpcyBudWxsIGlmIGl0J3MgdGhlIGZpcnN0IHJlZHJhdyBhbmQgbm90IGFuIGV2ZW50IGhhbmRsZXJcclxuXHRcdGlmIChsYXN0UmVkcmF3SWQgJiYgZm9yY2UgIT09IHRydWUpIHtcclxuXHRcdFx0Ly93aGVuIHNldFRpbWVvdXQ6IG9ubHkgcmVzY2hlZHVsZSByZWRyYXcgaWYgdGltZSBiZXR3ZWVuIG5vdyBhbmQgcHJldmlvdXMgcmVkcmF3IGlzIGJpZ2dlciB0aGFuIGEgZnJhbWUsIG90aGVyd2lzZSBrZWVwIGN1cnJlbnRseSBzY2hlZHVsZWQgdGltZW91dFxyXG5cdFx0XHQvL3doZW4gckFGOiBhbHdheXMgcmVzY2hlZHVsZSByZWRyYXdcclxuXHRcdFx0aWYgKCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgbmV3IERhdGUgLSBsYXN0UmVkcmF3Q2FsbFRpbWUgPiBGUkFNRV9CVURHRVQpIHtcclxuXHRcdFx0XHRpZiAobGFzdFJlZHJhd0lkID4gMCkgJGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxhc3RSZWRyYXdJZCk7XHJcblx0XHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXcsIEZSQU1FX0JVREdFVClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHJlZHJhdygpO1xyXG5cdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCkge2xhc3RSZWRyYXdJZCA9IG51bGx9LCBGUkFNRV9CVURHRVQpXHJcblx0XHR9XHJcblx0XHRyZWRyYXdpbmcgPSBmYWxzZVxyXG5cdH07XHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKTtcclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHRpZiAoY29tcHV0ZVByZVJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2soKVxyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGkgPSAwLCByb290OyByb290ID0gcm9vdHNbaV07IGkrKykge1xyXG5cdFx0XHRpZiAoY29udHJvbGxlcnNbaV0pIHtcclxuXHRcdFx0XHR2YXIgYXJncyA9IGNvbXBvbmVudHNbaV0uY29udHJvbGxlciAmJiBjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzID8gW2NvbnRyb2xsZXJzW2ldXS5jb25jYXQoY29tcG9uZW50c1tpXS5jb250cm9sbGVyLiQkYXJncykgOiBbY29udHJvbGxlcnNbaV1dXHJcblx0XHRcdFx0bS5yZW5kZXIocm9vdCwgY29tcG9uZW50c1tpXS52aWV3ID8gY29tcG9uZW50c1tpXS52aWV3KGNvbnRyb2xsZXJzW2ldLCBhcmdzKSA6IFwiXCIpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vYWZ0ZXIgcmVuZGVyaW5nIHdpdGhpbiBhIHJvdXRlZCBjb250ZXh0LCB3ZSBuZWVkIHRvIHNjcm9sbCBiYWNrIHRvIHRoZSB0b3AsIGFuZCBmZXRjaCB0aGUgZG9jdW1lbnQgdGl0bGUgZm9yIGhpc3RvcnkucHVzaFN0YXRlXHJcblx0XHRpZiAoY29tcHV0ZVBvc3RSZWRyYXdIb29rKSB7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vaygpO1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBudWxsXHJcblx0XHR9XHJcblx0XHRsYXN0UmVkcmF3SWQgPSBudWxsO1xyXG5cdFx0bGFzdFJlZHJhd0NhbGxUaW1lID0gbmV3IERhdGU7XHJcblx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHR9XHJcblxyXG5cdHZhciBwZW5kaW5nUmVxdWVzdHMgPSAwO1xyXG5cdG0uc3RhcnRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uKCkge3BlbmRpbmdSZXF1ZXN0cysrfTtcclxuXHRtLmVuZENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRwZW5kaW5nUmVxdWVzdHMgPSBNYXRoLm1heChwZW5kaW5nUmVxdWVzdHMgLSAxLCAwKTtcclxuXHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgPT09IDApIG0ucmVkcmF3KClcclxuXHR9O1xyXG5cdHZhciBlbmRGaXJzdENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PSBcIm5vbmVcIikge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLVxyXG5cdFx0XHRtLnJlZHJhdy5zdHJhdGVneShcImRpZmZcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgbS5lbmRDb21wdXRhdGlvbigpO1xyXG5cdH1cclxuXHJcblx0bS53aXRoQXR0ciA9IGZ1bmN0aW9uKHByb3AsIHdpdGhBdHRyQ2FsbGJhY2spIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCB0aGlzO1xyXG5cdFx0XHR3aXRoQXR0ckNhbGxiYWNrKHByb3AgaW4gY3VycmVudFRhcmdldCA/IGN1cnJlbnRUYXJnZXRbcHJvcF0gOiBjdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShwcm9wKSlcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvL3JvdXRpbmdcclxuXHR2YXIgbW9kZXMgPSB7cGF0aG5hbWU6IFwiXCIsIGhhc2g6IFwiI1wiLCBzZWFyY2g6IFwiP1wifTtcclxuXHR2YXIgcmVkaXJlY3QgPSBub29wLCByb3V0ZVBhcmFtcywgY3VycmVudFJvdXRlLCBpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlO1xyXG5cdG0ucm91dGUgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vbS5yb3V0ZSgpXHJcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGN1cnJlbnRSb3V0ZTtcclxuXHRcdC8vbS5yb3V0ZShlbCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpXHJcblx0XHRlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIHR5cGUuY2FsbChhcmd1bWVudHNbMV0pID09PSBTVFJJTkcpIHtcclxuXHRcdFx0dmFyIHJvb3QgPSBhcmd1bWVudHNbMF0sIGRlZmF1bHRSb3V0ZSA9IGFyZ3VtZW50c1sxXSwgcm91dGVyID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHRyZWRpcmVjdCA9IGZ1bmN0aW9uKHNvdXJjZSkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gY3VycmVudFJvdXRlID0gbm9ybWFsaXplUm91dGUoc291cmNlKTtcclxuXHRcdFx0XHRpZiAoIXJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0Um91dGUpIHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgZGVmYXVsdCByb3V0ZSBtYXRjaGVzIG9uZSBvZiB0aGUgcm91dGVzIGRlZmluZWQgaW4gbS5yb3V0ZVwiKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlXHJcblx0XHRcdFx0XHRtLnJvdXRlKGRlZmF1bHRSb3V0ZSwgdHJ1ZSlcclxuXHRcdFx0XHRcdGlzRGVmYXVsdFJvdXRlID0gZmFsc2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBsaXN0ZW5lciA9IG0ucm91dGUubW9kZSA9PT0gXCJoYXNoXCIgPyBcIm9uaGFzaGNoYW5nZVwiIDogXCJvbnBvcHN0YXRlXCI7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9ICRsb2NhdGlvblttLnJvdXRlLm1vZGVdXHJcblx0XHRcdFx0aWYgKG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiKSBwYXRoICs9ICRsb2NhdGlvbi5zZWFyY2hcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9IG5vcm1hbGl6ZVJvdXRlKHBhdGgpKSB7XHJcblx0XHRcdFx0XHRyZWRpcmVjdChwYXRoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGw7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0oKVxyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50c1swXS5hZGRFdmVudExpc3RlbmVyIHx8IGFyZ3VtZW50c1swXS5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGlzSW5pdGlhbGl6ZWQgPSBhcmd1bWVudHNbMV07XHJcblx0XHRcdHZhciBjb250ZXh0ID0gYXJndW1lbnRzWzJdO1xyXG5cdFx0XHR2YXIgdmRvbSA9IGFyZ3VtZW50c1szXTtcclxuXHRcdFx0ZWxlbWVudC5ocmVmID0gKG0ucm91dGUubW9kZSAhPT0gJ3BhdGhuYW1lJyA/ICRsb2NhdGlvbi5wYXRobmFtZSA6ICcnKSArIG1vZGVzW20ucm91dGUubW9kZV0gKyB2ZG9tLmF0dHJzLmhyZWY7XHJcblx0XHRcdGlmIChlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGVsZW1lbnQuZGV0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYXR0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zLCBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5KVxyXG5cdFx0ZWxzZSBpZiAodHlwZS5jYWxsKGFyZ3VtZW50c1swXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgb2xkUm91dGUgPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdGN1cnJlbnRSb3V0ZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHNbMV0gfHwge31cclxuXHRcdFx0dmFyIHF1ZXJ5SW5kZXggPSBjdXJyZW50Um91dGUuaW5kZXhPZihcIj9cIilcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHF1ZXJ5SW5kZXggPiAtMSA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFJvdXRlLnNsaWNlKHF1ZXJ5SW5kZXggKyAxKSkgOiB7fVxyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV1cclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpXHJcblx0XHRcdHZhciBjdXJyZW50UGF0aCA9IHF1ZXJ5SW5kZXggPiAtMSA/IGN1cnJlbnRSb3V0ZS5zbGljZSgwLCBxdWVyeUluZGV4KSA6IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJndW1lbnRzWzJdIDogYXJndW1lbnRzWzFdKSA9PT0gdHJ1ZSB8fCBvbGRSb3V0ZSA9PT0gYXJndW1lbnRzWzBdO1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gc2V0U2Nyb2xsXHJcblx0XHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeVtzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID8gXCJyZXBsYWNlU3RhdGVcIiA6IFwicHVzaFN0YXRlXCJdKG51bGwsICRkb2N1bWVudC50aXRsZSwgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdCRsb2NhdGlvblttLnJvdXRlLm1vZGVdID0gY3VycmVudFJvdXRlXHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0aWYgKCFyb3V0ZVBhcmFtcykgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgY2FsbCBtLnJvdXRlKGVsZW1lbnQsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSBiZWZvcmUgY2FsbGluZyBtLnJvdXRlLnBhcmFtKClcIilcclxuXHRcdHJldHVybiByb3V0ZVBhcmFtc1trZXldXHJcblx0fTtcclxuXHRtLnJvdXRlLm1vZGUgPSBcInNlYXJjaFwiO1xyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpIHtcclxuXHRcdHJvdXRlUGFyYW1zID0ge307XHJcblxyXG5cdFx0dmFyIHF1ZXJ5U3RhcnQgPSBwYXRoLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0aWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XHJcblx0XHRcdHJvdXRlUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnN1YnN0cihxdWVyeVN0YXJ0ICsgMSwgcGF0aC5sZW5ndGgpKTtcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR2V0IGFsbCByb3V0ZXMgYW5kIGNoZWNrIGlmIHRoZXJlJ3NcclxuXHRcdC8vIGFuIGV4YWN0IG1hdGNoIGZvciB0aGUgY3VycmVudCBwYXRoXHJcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJvdXRlcik7XHJcblx0XHR2YXIgaW5kZXggPSBrZXlzLmluZGV4T2YocGF0aCk7XHJcblx0XHRpZihpbmRleCAhPT0gLTEpe1xyXG5cdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltrZXlzIFtpbmRleF1dKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgcm91dGUgaW4gcm91dGVyKSB7XHJcblx0XHRcdGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG5cdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFwiXlwiICsgcm91dGUucmVwbGFjZSgvOlteXFwvXSs/XFwuezN9L2csIFwiKC4qPylcIikucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIik7XHJcblxyXG5cdFx0XHRpZiAobWF0Y2hlci50ZXN0KHBhdGgpKSB7XHJcblx0XHRcdFx0cGF0aC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIGtleXMgPSByb3V0ZS5tYXRjaCgvOlteXFwvXSsvZykgfHwgW107XHJcblx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSByb3V0ZVBhcmFtc1trZXlzW2ldLnJlcGxhY2UoLzp8XFwuL2csIFwiXCIpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXHJcblx0XHRcdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltyb3V0ZV0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiByb3V0ZVVub2J0cnVzaXZlKGUpIHtcclxuXHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS53aGljaCA9PT0gMikgcmV0dXJuO1xyXG5cdFx0aWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGVsc2UgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cdFx0dmFyIGFyZ3MgPSBtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIiAmJiBjdXJyZW50VGFyZ2V0LnNlYXJjaCA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpIDoge307XHJcblx0XHR3aGlsZSAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Lm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgIT0gXCJBXCIpIGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0LnBhcmVudE5vZGVcclxuXHRcdG0ucm91dGUoY3VycmVudFRhcmdldFttLnJvdXRlLm1vZGVdLnNsaWNlKG1vZGVzW20ucm91dGUubW9kZV0ubGVuZ3RoKSwgYXJncylcclxuXHR9XHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPSBcImhhc2hcIiAmJiAkbG9jYXRpb24uaGFzaCkgJGxvY2F0aW9uLmhhc2ggPSAkbG9jYXRpb24uaGFzaDtcclxuXHRcdGVsc2Ugd2luZG93LnNjcm9sbFRvKDAsIDApXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGJ1aWxkUXVlcnlTdHJpbmcob2JqZWN0LCBwcmVmaXgpIHtcclxuXHRcdHZhciBkdXBsaWNhdGVzID0ge31cclxuXHRcdHZhciBzdHIgPSBbXVxyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBvYmplY3QpIHtcclxuXHRcdFx0dmFyIGtleSA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcHJvcCArIFwiXVwiIDogcHJvcFxyXG5cdFx0XHR2YXIgdmFsdWUgPSBvYmplY3RbcHJvcF1cclxuXHRcdFx0dmFyIHZhbHVlVHlwZSA9IHR5cGUuY2FsbCh2YWx1ZSlcclxuXHRcdFx0dmFyIHBhaXIgPSAodmFsdWUgPT09IG51bGwpID8gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgOlxyXG5cdFx0XHRcdHZhbHVlVHlwZSA9PT0gT0JKRUNUID8gYnVpbGRRdWVyeVN0cmluZyh2YWx1ZSwga2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBBUlJBWSA/IHZhbHVlLnJlZHVjZShmdW5jdGlvbihtZW1vLCBpdGVtKSB7XHJcblx0XHRcdFx0XHRpZiAoIWR1cGxpY2F0ZXNba2V5XSkgZHVwbGljYXRlc1trZXldID0ge31cclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldW2l0ZW1dKSB7XHJcblx0XHRcdFx0XHRcdGR1cGxpY2F0ZXNba2V5XVtpdGVtXSA9IHRydWVcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG1lbW8uY29uY2F0KGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoaXRlbSkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gbWVtb1xyXG5cdFx0XHRcdH0sIFtdKS5qb2luKFwiJlwiKSA6XHJcblx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHN0ci5wdXNoKHBhaXIpXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gc3RyLmpvaW4oXCImXCIpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcoc3RyKSB7XHJcblx0XHRpZiAoc3RyLmNoYXJBdCgwKSA9PT0gXCI/XCIpIHN0ciA9IHN0ci5zdWJzdHJpbmcoMSk7XHJcblx0XHRcclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHZhciBwYWlyID0gcGFpcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG5cdFx0XHR2YXIga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXHJcblx0XHRcdHZhciB2YWx1ZSA9IHBhaXIubGVuZ3RoID09IDIgPyBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSkgOiBudWxsXHJcblx0XHRcdGlmIChwYXJhbXNba2V5XSAhPSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChwYXJhbXNba2V5XSkgIT09IEFSUkFZKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV1cclxuXHRcdFx0XHRwYXJhbXNba2V5XS5wdXNoKHZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgcGFyYW1zW2tleV0gPSB2YWx1ZVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhcmFtc1xyXG5cdH1cclxuXHRtLnJvdXRlLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXHJcblx0bS5yb3V0ZS5wYXJzZVF1ZXJ5U3RyaW5nID0gcGFyc2VRdWVyeVN0cmluZ1xyXG5cdFxyXG5cdGZ1bmN0aW9uIHJlc2V0KHJvb3QpIHtcclxuXHRcdHZhciBjYWNoZUtleSA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdGNsZWFyKHJvb3QuY2hpbGROb2RlcywgY2VsbENhY2hlW2NhY2hlS2V5XSk7XHJcblx0XHRjZWxsQ2FjaGVbY2FjaGVLZXldID0gdW5kZWZpbmVkXHJcblx0fVxyXG5cclxuXHRtLmRlZmVycmVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZFxyXG5cdH07XHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlLCBpbml0aWFsVmFsdWUpIHtcclxuXHRcdHZhciBwcm9wID0gbS5wcm9wKGluaXRpYWxWYWx1ZSk7XHJcblx0XHRwcm9taXNlLnRoZW4ocHJvcCk7XHJcblx0XHRwcm9wLnRoZW4gPSBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkocHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCksIGluaXRpYWxWYWx1ZSlcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHQvL1Byb21pei5taXRocmlsLmpzIHwgWm9sbWVpc3RlciB8IE1JVFxyXG5cdC8vYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BKyBmb3IgdHdvIHJlYXNvbnM6XHJcblx0Ly8xKSBgdGhlbmAgY2FsbGJhY2tzIGFyZSBjYWxsZWQgc3luY2hyb25vdXNseSAoYmVjYXVzZSBzZXRUaW1lb3V0IGlzIHRvbyBzbG93LCBhbmQgdGhlIHNldEltbWVkaWF0ZSBwb2x5ZmlsbCBpcyB0b28gYmlnXHJcblx0Ly8yKSB0aHJvd2luZyBzdWJjbGFzc2VzIG9mIEVycm9yIGNhdXNlIHRoZSBlcnJvciB0byBiZSBidWJibGVkIHVwIGluc3RlYWQgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGltcG9ydGFudCB1c2UgY2FzZSBvZiBkZWZhdWx0IGJyb3dzZXIgZXJyb3IgaGFuZGxpbmcsIGkuZS4gbWVzc2FnZSB3LyBsaW5lIG51bWJlcilcclxuXHRmdW5jdGlvbiBEZWZlcnJlZChzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0dmFyIFJFU09MVklORyA9IDEsIFJFSkVDVElORyA9IDIsIFJFU09MVkVEID0gMywgUkVKRUNURUQgPSA0O1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzLCBzdGF0ZSA9IDAsIHByb21pc2VWYWx1ZSA9IDAsIG5leHQgPSBbXTtcclxuXHJcblx0XHRzZWxmW1wicHJvbWlzZVwiXSA9IHt9O1xyXG5cclxuXHRcdHNlbGZbXCJyZXNvbHZlXCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmW1wicmVqZWN0XCJdID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKCFzdGF0ZSkge1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLnByb21pc2VbXCJ0aGVuXCJdID0gZnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKTtcclxuXHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCkge1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bmV4dC5wdXNoKGRlZmVycmVkKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0XHR9O1xyXG5cclxuXHRcdGZ1bmN0aW9uIGZpbmlzaCh0eXBlKSB7XHJcblx0XHRcdHN0YXRlID0gdHlwZSB8fCBSRUpFQ1RFRDtcclxuXHRcdFx0bmV4dC5tYXAoZnVuY3Rpb24oZGVmZXJyZWQpIHtcclxuXHRcdFx0XHRzdGF0ZSA9PT0gUkVTT0xWRUQgJiYgZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpIHx8IGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdGhlbm5hYmxlKHRoZW4sIHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrLCBub3RUaGVubmFibGVDYWxsYmFjaykge1xyXG5cdFx0XHRpZiAoKChwcm9taXNlVmFsdWUgIT0gbnVsbCAmJiB0eXBlLmNhbGwocHJvbWlzZVZhbHVlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2YgcHJvbWlzZVZhbHVlID09PSBGVU5DVElPTikgJiYgdHlwZW9mIHRoZW4gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdC8vIGNvdW50IHByb3RlY3RzIGFnYWluc3QgYWJ1c2UgY2FsbHMgZnJvbSBzcGVjIGNoZWNrZXJcclxuXHRcdFx0XHRcdHZhciBjb3VudCA9IDA7XHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0c3VjY2Vzc0NhbGxiYWNrKClcclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0ZmFpbHVyZUNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bm90VGhlbm5hYmxlQ2FsbGJhY2soKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmlyZSgpIHtcclxuXHRcdFx0Ly8gY2hlY2sgaWYgaXQncyBhIHRoZW5hYmxlXHJcblx0XHRcdHZhciB0aGVuO1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHRoZW4gPSBwcm9taXNlVmFsdWUgJiYgcHJvbWlzZVZhbHVlLnRoZW5cclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdHJldHVybiBmaXJlKClcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HO1xyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgdHlwZW9mIHN1Y2Nlc3NDYWxsYmFjayA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gc3VjY2Vzc0NhbGxiYWNrKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RJTkcgJiYgdHlwZW9mIGZhaWx1cmVDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGZhaWx1cmVDYWxsYmFjayhwcm9taXNlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFJFU09MVklOR1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZTtcclxuXHRcdFx0XHRcdHJldHVybiBmaW5pc2goKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHByb21pc2VWYWx1ZSA9PT0gc2VsZikge1xyXG5cdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gVHlwZUVycm9yKCk7XHJcblx0XHRcdFx0XHRmaW5pc2goKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0sIGZpbmlzaCwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goc3RhdGUgPT09IFJFU09MVklORyAmJiBSRVNPTFZFRClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdH1cclxuXHRtLmRlZmVycmVkLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRpZiAodHlwZS5jYWxsKGUpID09PSBcIltvYmplY3QgRXJyb3JdXCIgJiYgIWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5tYXRjaCgvIEVycm9yLykpIHRocm93IGVcclxuXHR9O1xyXG5cclxuXHRtLnN5bmMgPSBmdW5jdGlvbihhcmdzKSB7XHJcblx0XHR2YXIgbWV0aG9kID0gXCJyZXNvbHZlXCI7XHJcblx0XHRmdW5jdGlvbiBzeW5jaHJvbml6ZXIocG9zLCByZXNvbHZlZCkge1xyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0XHRyZXN1bHRzW3Bvc10gPSB2YWx1ZTtcclxuXHRcdFx0XHRpZiAoIXJlc29sdmVkKSBtZXRob2QgPSBcInJlamVjdFwiO1xyXG5cdFx0XHRcdGlmICgtLW91dHN0YW5kaW5nID09PSAwKSB7XHJcblx0XHRcdFx0XHRkZWZlcnJlZC5wcm9taXNlKHJlc3VsdHMpO1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWRbbWV0aG9kXShyZXN1bHRzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKTtcclxuXHRcdHZhciBvdXRzdGFuZGluZyA9IGFyZ3MubGVuZ3RoO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkob3V0c3RhbmRpbmcpO1xyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRhcmdzW2ldLnRoZW4oc3luY2hyb25pemVyKGksIHRydWUpLCBzeW5jaHJvbml6ZXIoaSwgZmFsc2UpKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGRlZmVycmVkLnJlc29sdmUoW10pO1xyXG5cclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHRmdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge3JldHVybiB2YWx1ZX1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgY2FsbGJhY2tLZXkgPSBcIm1pdGhyaWxfY2FsbGJhY2tfXCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIFwiX1wiICsgKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlMTYpKS50b1N0cmluZygzNik7XHJcblx0XHRcdHZhciBzY3JpcHQgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuXHJcblx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSBmdW5jdGlvbihyZXNwKSB7XHJcblx0XHRcdFx0c2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcclxuXHRcdFx0XHRvcHRpb25zLm9ubG9hZCh7XHJcblx0XHRcdFx0XHR0eXBlOiBcImxvYWRcIixcclxuXHRcdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IHJlc3BcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cclxuXHRcdFx0XHRvcHRpb25zLm9uZXJyb3Ioe1xyXG5cdFx0XHRcdFx0dHlwZTogXCJlcnJvclwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHN0YXR1czogNTAwLFxyXG5cdFx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IEpTT04uc3RyaW5naWZ5KHtlcnJvcjogXCJFcnJvciBtYWtpbmcganNvbnAgcmVxdWVzdFwifSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHR3aW5kb3dbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRzY3JpcHQuc3JjID0gb3B0aW9ucy51cmxcclxuXHRcdFx0XHQrIChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKVxyXG5cdFx0XHRcdCsgKG9wdGlvbnMuY2FsbGJhY2tLZXkgPyBvcHRpb25zLmNhbGxiYWNrS2V5IDogXCJjYWxsYmFja1wiKVxyXG5cdFx0XHRcdCsgXCI9XCIgKyBjYWxsYmFja0tleVxyXG5cdFx0XHRcdCsgXCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSk7XHJcblx0XHRcdCRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR2YXIgeGhyID0gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcclxuXHRcdFx0eGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlLCBvcHRpb25zLnVzZXIsIG9wdGlvbnMucGFzc3dvcmQpO1xyXG5cdFx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkgb3B0aW9ucy5vbmxvYWQoe3R5cGU6IFwibG9hZFwiLCB0YXJnZXQ6IHhocn0pO1xyXG5cdFx0XHRcdFx0ZWxzZSBvcHRpb25zLm9uZXJyb3Ioe3R5cGU6IFwiZXJyb3JcIiwgdGFyZ2V0OiB4aHJ9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0aWYgKG9wdGlvbnMuc2VyaWFsaXplID09PSBKU09OLnN0cmluZ2lmeSAmJiBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5tZXRob2QgIT09IFwiR0VUXCIpIHtcclxuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIilcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAob3B0aW9ucy5kZXNlcmlhbGl6ZSA9PT0gSlNPTi5wYXJzZSkge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC8qXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5jb25maWcgPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dmFyIG1heWJlWGhyID0gb3B0aW9ucy5jb25maWcoeGhyLCBvcHRpb25zKTtcclxuXHRcdFx0XHRpZiAobWF5YmVYaHIgIT0gbnVsbCkgeGhyID0gbWF5YmVYaHJcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGRhdGEgPSBvcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiB8fCAhb3B0aW9ucy5kYXRhID8gXCJcIiA6IG9wdGlvbnMuZGF0YVxyXG5cdFx0XHRpZiAoZGF0YSAmJiAodHlwZS5jYWxsKGRhdGEpICE9IFNUUklORyAmJiBkYXRhLmNvbnN0cnVjdG9yICE9IHdpbmRvdy5Gb3JtRGF0YSkpIHtcclxuXHRcdFx0XHR0aHJvdyBcIlJlcXVlc3QgZGF0YSBzaG91bGQgYmUgZWl0aGVyIGJlIGEgc3RyaW5nIG9yIEZvcm1EYXRhLiBDaGVjayB0aGUgYHNlcmlhbGl6ZWAgb3B0aW9uIGluIGBtLnJlcXVlc3RgXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0eGhyLnNlbmQoZGF0YSk7XHJcblx0XHRcdHJldHVybiB4aHJcclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gYmluZERhdGEoeGhyT3B0aW9ucywgZGF0YSwgc2VyaWFsaXplKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5tZXRob2QgPT09IFwiR0VUXCIgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZSAhPSBcImpzb25wXCIpIHtcclxuXHRcdFx0dmFyIHByZWZpeCA9IHhock9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpIDwgMCA/IFwiP1wiIDogXCImXCI7XHJcblx0XHRcdHZhciBxdWVyeXN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmcoZGF0YSk7XHJcblx0XHRcdHhock9wdGlvbnMudXJsID0geGhyT3B0aW9ucy51cmwgKyAocXVlcnlzdHJpbmcgPyBwcmVmaXggKyBxdWVyeXN0cmluZyA6IFwiXCIpXHJcblx0XHR9XHJcblx0XHRlbHNlIHhock9wdGlvbnMuZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcclxuXHRcdHJldHVybiB4aHJPcHRpb25zXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZVVybCh1cmwsIGRhdGEpIHtcclxuXHRcdHZhciB0b2tlbnMgPSB1cmwubWF0Y2goLzpbYS16XVxcdysvZ2kpO1xyXG5cdFx0aWYgKHRva2VucyAmJiBkYXRhKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2Vuc1tpXS5zbGljZSgxKTtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSh0b2tlbnNbaV0sIGRhdGFba2V5XSk7XHJcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdXJsXHJcblx0fVxyXG5cclxuXHRtLnJlcXVlc3QgPSBmdW5jdGlvbih4aHJPcHRpb25zKSB7XHJcblx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG5cdFx0dmFyIGlzSlNPTlAgPSB4aHJPcHRpb25zLmRhdGFUeXBlICYmIHhock9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiO1xyXG5cdFx0dmFyIHNlcmlhbGl6ZSA9IHhock9wdGlvbnMuc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5zZXJpYWxpemUgfHwgSlNPTi5zdHJpbmdpZnk7XHJcblx0XHR2YXIgZGVzZXJpYWxpemUgPSB4aHJPcHRpb25zLmRlc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSB8fCBKU09OLnBhcnNlO1xyXG5cdFx0dmFyIGV4dHJhY3QgPSBpc0pTT05QID8gZnVuY3Rpb24oanNvbnApIHtyZXR1cm4ganNvbnAucmVzcG9uc2VUZXh0fSA6IHhock9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbih4aHIpIHtcclxuXHRcdFx0cmV0dXJuIHhoci5yZXNwb25zZVRleHQubGVuZ3RoID09PSAwICYmIGRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlID8gbnVsbCA6IHhoci5yZXNwb25zZVRleHRcclxuXHRcdH07XHJcblx0XHR4aHJPcHRpb25zLm1ldGhvZCA9ICh4aHJPcHRpb25zLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKTtcclxuXHRcdHhock9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKHhock9wdGlvbnMudXJsLCB4aHJPcHRpb25zLmRhdGEpO1xyXG5cdFx0eGhyT3B0aW9ucyA9IGJpbmREYXRhKHhock9wdGlvbnMsIHhock9wdGlvbnMuZGF0YSwgc2VyaWFsaXplKTtcclxuXHRcdHhock9wdGlvbnMub25sb2FkID0geGhyT3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGUgPSBlIHx8IGV2ZW50O1xyXG5cdFx0XHRcdHZhciB1bndyYXAgPSAoZS50eXBlID09PSBcImxvYWRcIiA/IHhock9wdGlvbnMudW53cmFwU3VjY2VzcyA6IHhock9wdGlvbnMudW53cmFwRXJyb3IpIHx8IGlkZW50aXR5O1xyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHVud3JhcChkZXNlcmlhbGl6ZShleHRyYWN0KGUudGFyZ2V0LCB4aHJPcHRpb25zKSksIGUudGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoZS50eXBlID09PSBcImxvYWRcIikge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGUuY2FsbChyZXNwb25zZSkgPT09IEFSUkFZICYmIHhock9wdGlvbnMudHlwZSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlc3BvbnNlLmxlbmd0aDsgaSsrKSByZXNwb25zZVtpXSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2VbaV0pXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmICh4aHJPcHRpb25zLnR5cGUpIHJlc3BvbnNlID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGVmZXJyZWRbZS50eXBlID09PSBcImxvYWRcIiA/IFwicmVzb2x2ZVwiIDogXCJyZWplY3RcIl0ocmVzcG9uc2UpXHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGUpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHhock9wdGlvbnMuYmFja2dyb3VuZCAhPT0gdHJ1ZSkgbS5lbmRDb21wdXRhdGlvbigpXHJcblx0XHR9O1xyXG5cdFx0YWpheCh4aHJPcHRpb25zKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UsIHhock9wdGlvbnMuaW5pdGlhbFZhbHVlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHJcblx0Ly90ZXN0aW5nIEFQSVxyXG5cdG0uZGVwcyA9IGZ1bmN0aW9uKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUod2luZG93ID0gbW9jayB8fCB3aW5kb3cpO1xyXG5cdFx0cmV0dXJuIHdpbmRvdztcclxuXHR9O1xyXG5cdC8vZm9yIGludGVybmFsIHRlc3Rpbmcgb25seSwgZG8gbm90IHVzZSBgbS5kZXBzLmZhY3RvcnlgXHJcblx0bS5kZXBzLmZhY3RvcnkgPSBhcHA7XHJcblxyXG5cdHJldHVybiBtXHJcbn0pKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KTtcclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IG07XHJcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIG19KTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL34vbWl0aHJpbC9taXRocmlsLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0bW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvfi93ZWJwYWNrL2J1aWxkaW4vbW9kdWxlLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQgd3JhcHBlciBmcm9tICcuL3dyYXBwZXInO1xyXG5pbXBvcnQgcG9zdEJveCBmcm9tICcuL3Bvc3QtYm94JztcclxuaW1wb3J0IHBvc3RDb21wb25lbnQgZnJvbSAnLi9wb3N0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcG9zdHMgPSBtLnByb3AoW10pO1xyXG5cclxuICAgIG0ucmVxdWVzdCh7XHJcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgdXJsOiAnYXBpL3Bvc3QucGhwJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGNvbW1lbnRzOiAxMFxyXG4gICAgICB9XHJcbiAgICB9KS50aGVuKHBvc3RzKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwb3N0c1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIG0uY29tcG9uZW50KHdyYXBwZXIsIHttYWluOiBtKFwibWFpbi5jb250YWluZXJcIiwgW1xyXG4gICAgICAgIHBvc3RCb3gsXHJcbiAgICAgICAgbShcInVsXCIsXHJcbiAgICAgICAgICBjdHJsLnBvc3RzKCkubWFwKChwb3N0LCBwb3N0UGFnZUluZGV4KSA9PiBtKCdsaScsIG0uY29tcG9uZW50KHBvc3RDb21wb25lbnQsIHtwb3N0LCBwb3N0UGFnZUluZGV4fSkpKVxyXG4gICAgICAgIClcclxuICAgICAgXSl9KVxyXG4gICAgXTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWFpbi1wYWdlLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQge2xvZ2dlZElufSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XHJcblxyXG5pbXBvcnQgbWVzc2FnZU1vZGFsIGZyb20gJy4vbWVzc2FnZS1tb2RhbCc7XHJcbmltcG9ydCBuYXZQYW5lbCBmcm9tICcuL25hdi1wYW5lbCc7XHJcbmltcG9ydCBhdXRoZW50aWNhdGUgZnJvbSAnLi9hdXRoZW50aWNhdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsLCBhcmdzKSB7XHJcbiAgICByZXR1cm4gbSgnLmJvZHknLCBbXHJcbiAgICAgIG0oXCJoZWFkZXJcIiwgW1xyXG4gICAgICAgIG0oXCJuYXYudG9wLW5hdlwiLCBbXHJcbiAgICAgICAgICBtKFwiaDEuY2VudGVyLWFsaWduXCIsIFwiU3RldmVucyBDb21wbGltZW50cyBhbmQgQ3J1c2hlc1wiKVxyXG4gICAgICAgIF0pXHJcbiAgICAgIF0pLFxyXG4gICAgICBhcmdzLm1haW4sXHJcbiAgICAgIG0oXCJmb290ZXIucGFnZS1mb290ZXJcIiwgW1xyXG4gICAgICAgIG0oXCIuZm9vdGVyLWNvcHlyaWdodFwiLCBbXHJcbiAgICAgICAgICBtKFwiLmNlbnRlci1hbGlnbi52YWxpZ25cIiwgXCLCqSAyMDE1IE5pY2hvbGFzIEFudG9ub3YgJiBCcmlhbiBaYXdpemF3YSBmb3IgQ1M1NDYgYXQgU3RldmVuc1wiKVxyXG4gICAgICAgIF0pXHJcbiAgICAgIF0pLFxyXG4gICAgICBsb2dnZWRJbigpID8gbmF2UGFuZWwgOiBhdXRoZW50aWNhdGUsXHJcbiAgICAgIG1lc3NhZ2VNb2RhbFxyXG4gICAgXSk7XHJcbiAgfVxyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3dyYXBwZXIuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcclxuXHJcbmltcG9ydCB7b3BlbkF1dGhlbnRpY2F0aW9ufSBmcm9tICcuLi9hdXRoZW50aWNhdGUnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvZ2dlZEluID0gbS5wcm9wKGZhbHNlKTtcclxuY2hlY2soKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVjayAoKSB7XHJcbiAgbS5yZXF1ZXN0KHtcclxuICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICB1cmw6ICdhcGkvY2hlY2tMb2dpbi5waHAnXHJcbiB9KS50aGVuKChkYXRhKSA9PiBsb2dnZWRJbihKU09OLnBhcnNlKGRhdGEpKSk7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXR0ZW1wdCAoZnVuYykge1xyXG4gIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBsb2dnZWRJbigpID8gZnVuYy5hcHBseShudWxsLCBhcmdzKSA6IG9wZW5BdXRoZW50aWNhdGlvbigpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ291dCAoKSB7XHJcbiAgJC5wb3N0KCdsb2dvdXQucGhwJywgY2hlY2spO1xyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3V0aWxpdHkvbG9naW4tY29udHJvbGxlci5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5pbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5pbXBvcnQgbG9naW4gZnJvbSAnLi9sb2dpbic7XG5cbmltcG9ydCBsb2dnZWRJbiwge2NoZWNrfSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQXV0aGVudGljYXRpb24gKCkge1xuICAkKCcjY29tYm8tbW9kYWwnKS5vcGVuTW9kYWwoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tbW9kdWxlLWNvbnRhaW5lcicsIFtcbiAgICAgIG0oJy5sb2dpbi1ib3guei1kZXB0aC0yJywge29uY2xpY2s6IG9wZW5BdXRoZW50aWNhdGlvbn0sIFtcbiAgICAgICAgbShcImFcIiwgXCJMb2cgaW4gLyBSZWdpc3RlclwiKVxuICAgICAgXSksXG4gICAgICBtKFwiLm1vZGFsW2lkPSdjb21iby1tb2RhbCddXCIsIFtcbiAgICAgICAgbShcIi5tb2RhbC1jb250ZW50XCIsIFtcbiAgICAgICAgICBtKFwicFwiLCBcIlRoYW5rcyBmb3IgdXNpbmcgdGhpcyBzaXRlLiBUbyBwcmV2ZW50IGFidXNlIGFuZCBhbGxvdyBmb3IgYSByaWNoIGZlYXR1cmVkIGV4cGVyaWVuY2UsIHVzZXJzIGFyZSByZXF1aXJlZCB0byBsb2cgaW4uIERvbid0IFdvcnJ5ISBBbGwgeW91ciBpbmZvcm1hdGlvbiB3aWxsIGJlIGtlcHQgYW5vbnltb3VzIGFzIGxvbmcgYXMgeW91IGNob29zZSB0byBrZWVwIGl0IHRoYXQgd2F5LlwiKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcIi5tb2RhbC1mb290ZXJcIiwgW1xuICAgICAgICAgIG0oXCJhLm1vZGFsLWFjdGlvbi5tb2RhbC1jbG9zZS53YXZlcy1lZmZlY3Qud2F2ZXMtZ3JlZW4uYnRuLWZsYXQubGVmdFwiLCB7b25jbGljazogKCkgPT4geyQoJyNsb2dpbi1tb2RhbCcpLm9wZW5Nb2RhbCgpO319LCBcIkxvZyBJblwiKSxcbiAgICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LmxlZnRcIiwge29uY2xpY2s6ICgpID0+IHskKCcjcmVnaXN0ZXItbW9kYWwnKS5vcGVuTW9kYWwoKTt9fSwgXCJSZWdpc3RlclwiKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBsb2dpbixcbiAgICAgIHJlZ2lzdGVyXG4gICAgXSk7XG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL2F1dGhlbnRpY2F0ZS5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xyXG5cclxuaW1wb3J0IHtjaGVja30gZnJvbSAnLi91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBuYW1lID0gbS5wcm9wKCcnKSxcclxuICAgICAgcGFzc3dvcmQgPSBtLnByb3AoJycpLFxyXG4gICAgICBwYXNzd29yZENvbmZpcm1hdGlvbiA9IG0ucHJvcCgnJyksXHJcbiAgICAgIGVtYWlsID0gbS5wcm9wKCcnKSxcclxuICAgICAgZWxlbWVudCA9IG0ucHJvcCgpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVnaXN0ZXIgKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIG5vbkpzb25FcnJvcnMgKHhocikge1xyXG4gICAgICAgICAgcmV0dXJuIHhoci5zdGF0dXMgPiAyMDAgPyBKU09OLnN0cmluZ2lmeSh4aHIucmVzcG9uc2VUZXh0KSA6IHhoci5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQoKSAhPT0gcGFzc3dvcmRDb25maXJtYXRpb24oKSkge1xyXG4gICAgICAgICAgYWxlcnQoXCJwYXNzd29yZHMgZG8gbm90IG1hdGNoXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCgpLmNoZWNrVmFsaWRpdHkoKSkge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICB1cmw6ICdhcGkvcmVnaXN0ZXIucGhwJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUoKSxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQoKSxcclxuICAgICAgICAgICAgICBlbWFpbDogZW1haWwoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBjaGVja1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIHBhc3N3b3JkQ29uZmlybWF0aW9uLFxyXG4gICAgICBlbWFpbCxcclxuICAgICAgcmVnaXN0ZXIsXHJcbiAgICAgIGVsZW1lbnRcclxuICAgIH1cclxuICB9LFxyXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XHJcbiAgICByZXR1cm4gbShcIi5tb2RhbFtpZD0ncmVnaXN0ZXItbW9kYWwnXVwiLCBbXHJcbiAgICAgIG0oXCIubW9kYWwtY29udGVudFwiLCBbXHJcbiAgICAgICAgbShcImg0XCIsIFwiUmVnaXN0ZXJcIiksXHJcbiAgICAgICAgbShcImZvcm0uY29sLnMxMlwiLCB7Y29uZmlnOiBjdHJsLmVsZW1lbnR9LCBbXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwiYWNjb3VudF9jaXJjbGVcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSduYW1lJ11bcmVxdWlyZWQ9JyddW3BhdHRlcm49LisgLitdW3R5cGU9J3RleHQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLm5hbWUpLCB2YWx1ZTogY3RybC5uYW1lKCl9KSxcclxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSduYW1lJ11cIiwgXCJOYW1lXCIpXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICBdKSxcclxuICAgICAgICAgIG0oXCIucm93XCIsIFtcclxuICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5jb2wuczEyXCIsIFtcclxuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdwYXNzd29yZCddW3JlcXVpcmVkPScnXVt0eXBlPSdwYXNzd29yZCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIGN0cmwucGFzc3dvcmQpLCB2YWx1ZTogY3RybC5wYXNzd29yZCgpfSksXHJcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0ncGFzc3dvcmQnXVwiLCBcIlBhc3N3b3JkXCIpXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICBdKSxcclxuICAgICAgICAgIG0oXCIucm93XCIsIFtcclxuICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5jb2wuczEyXCIsIFtcclxuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdjb25maXJtLXBhc3N3b3JkJ11bcmVxdWlyZWQ9JyddW3R5cGU9J3Bhc3N3b3JkJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5wYXNzd29yZENvbmZpcm1hdGlvbiksIHZhbHVlOiBjdHJsLnBhc3N3b3JkQ29uZmlybWF0aW9uKCl9KSxcclxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdjb25maXJtLXBhc3N3b3JkJ11cIiwgXCJDb25maXJtIFBhc3N3b3JkXCIpXHJcbiAgICAgICAgICAgIF0pXHJcbiAgICAgICAgICBdKSxcclxuICAgICAgICAgIG0oXCIucm93XCIsIFtcclxuICAgICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5jb2wuczEyXCIsIFtcclxuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJlbWFpbFwiKSxcclxuICAgICAgICAgICAgICBtKFwiaW5wdXQudmFsaWRhdGVbaWQ9J2VtYWlsJ11bcmVxdWlyZWQ9JyddW3R5cGU9J2VtYWlsJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5lbWFpbCksIHZhbHVlOiBjdHJsLmVtYWlsKCl9KSxcclxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdlbWFpbCddXCIsIFwiRW1haWxcIilcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgXSlcclxuICAgICAgXSksXHJcbiAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcclxuICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LnJpZ2h0XCIsIHtvbmNsaWNrOiBjdHJsLnJlZ2lzdGVyfSwgXCJSZWdpc3RlclwiKVxyXG4gICAgICBdKVxyXG4gICAgXSk7XHJcbiAgfVxyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3JlZ2lzdGVyLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQge2NoZWNrfSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHBhc3N3b3JkID0gbS5wcm9wKCcnKSxcclxuICAgICAgZW1haWwgPSBtLnByb3AoJycpLFxyXG4gICAgICBlbGVtZW50ID0gbS5wcm9wKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBsb2dpbiAoKSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQoKS5jaGVja1ZhbGlkaXR5KCkpIHtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgdXJsOiAnYXBpL2xvZ2luLnBocCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQoKSxcclxuICAgICAgICAgICAgICBlbWFpbDogZW1haWwoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBjaGVja1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBsb2dpbixcclxuICAgICAgZWxlbWVudFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcclxuICAgIHJldHVybiBtKFwiLm1vZGFsW2lkPSdsb2dpbi1tb2RhbCddXCIsIFtcclxuICAgICAgbShcIi5tb2RhbC1jb250ZW50XCIsIFtcclxuICAgICAgICBtKFwiaDRcIiwgXCJMb2cgSW5cIiksXHJcbiAgICAgICAgbShcImZvcm0uY29sLnMxMlwiLCB7Y29uZmlnOiBjdHJsLmVsZW1lbnR9LCBbXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwiZW1haWxcIiksXHJcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdsb2dpbi1lbWFpbCddW3JlcXVpcmVkPScnXVt0eXBlPSdlbWFpbCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cigndmFsdWUnLCBjdHJsLmVtYWlsKSwgdmFsdWU6IGN0cmwuZW1haWwoKX0pLFxyXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J2xvZ2luLWVtYWlsJ11cIiwgXCJFbWFpbFwiKVxyXG4gICAgICAgICAgICBdKVxyXG4gICAgICAgICAgXSksXHJcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGQuY29sLnMxMlwiLCBbXHJcbiAgICAgICAgICAgICAgbShcImkubWF0ZXJpYWwtaWNvbnMucHJlZml4XCIsIFwibG9ja19vdXRsaW5lXCIpLFxyXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nbG9naW4tcGFzc3dvcmQnXVtyZXF1aXJlZD0nJ11bdHlwZT0ncGFzc3dvcmQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgY3RybC5wYXNzd29yZCksIHZhbHVlOiBjdHJsLnBhc3N3b3JkKCl9KSxcclxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdsb2dpbi1wYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIilcclxuICAgICAgICAgICAgXSlcclxuICAgICAgICAgIF0pXHJcbiAgICAgICAgXSlcclxuICAgICAgXSksXHJcbiAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcclxuICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LnJpZ2h0XCIsIHtvbmNsaWNrOiBjdHJsLmxvZ2lufSwgIFwiTG9nIEluXCIpXHJcbiAgICAgIF0pXHJcbiAgICBdKTtcclxuICB9XHJcbn07XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbG9naW4uanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi91dGlsaXR5L2JpbmQnO1xuXG5jb25zdCB0YXJnZXQgPSBtLnByb3AoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5NZXNzYWdlTW9kYWwgKHJlY2lwaWVudCkge1xuICB0YXJnZXQocmVjaXBpZW50KTtcbiAgJCgnI21lc3NhZ2UtbW9kYWwnKS5vcGVuTW9kYWwoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGVudCA9IG0ucHJvcCgnJyksXG4gICAgICBzaG93TmFtZSA9IG0ucHJvcChmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBzZW5kICgpIHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnYXBpL21lc3NhZ2UucGhwJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRvOiB0YXJnZXQoKSxcbiAgICAgICAgICBtZXNzYWdlOiBjb250ZW50KCksXG4gICAgICAgICAgc2hvd05hbWU6IHNob3dOYW1lKClcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KCdNZXNzYWdlIHNlbnQhJywgNDAwMCk7XG4gICAgICAgICAgY29udGVudCgnJyk7XG4gICAgICAgICAgJCgnI21lc3NhZ2UtbW9kYWwnKS5jbG9zZU1vZGFsKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoKSA9PiBjb25zb2xlLmxvZyhlcnJvci5yZXNwb25zZVRleHQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2VuZCxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBzaG93TmFtZVxuICAgIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsKSB7XG4gICAgcmV0dXJuIG0oXCIubW9kYWxbaWQ9J21lc3NhZ2UtbW9kYWwnXVwiLCBbXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICBtKFwiaDRcIiwgXCJQcml2YXRlIE1lc3NhZ2VcIiksXG4gICAgICAgIG0oXCJmb3JtXCIsIFtcbiAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkXCIsIFtcbiAgICAgICAgICAgIG0oXCJ0ZXh0YXJlYS5tYXRlcmlhbGl6ZS10ZXh0YXJlYVtpZD0nbWVzc2FnZS10ZXh0YXJlYSddW2xlbmd0aD0nMTAwMCddXCIsIGJpbmQoY3RybC5jb250ZW50KSksXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLXRleHRhcmVhJ11cIiwgXCJTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlIVwiKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIucm93XCIsIFtcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tN1wiLCBbXG4gICAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J21lc3NhZ2UtYW5vbiddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nbm8nXVwiKSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLWFub24nXVwiLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgbShcImlucHV0W2lkPSdtZXNzYWdlLW5hbWUnXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9J3llcyddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cignY2hlY2tlZCcsIGN0cmwuc2hvd05hbWUpfSksXG4gICAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbWVzc2FnZS1uYW1lJ11cIiwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tNVwiLCBbXG4gICAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogY3RybC5zZW5kfSwgW1xuICAgICAgICAgICAgICAgIFwiU2VuZCBcIixcbiAgICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcInNlbmRcIilcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZS1tb2RhbC5qc1xuICoqLyIsImltcG9ydCBtIGZyb20gJ21pdGhyaWwnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvcCkge1xuICByZXR1cm4ge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgcHJvcCksIHZhbHVlOiBwcm9wKCl9O1xufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy91dGlsaXR5L2JpbmQuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHtsb2dvdXR9IGZyb20gJy4vdXRpbGl0eS9sb2dpbi1jb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xuICAgIHJldHVybiBtKCcubG9naW4tYm94LnotZGVwdGgtMicsIFtcbiAgICAgIG0oJ2EnLCB7b25jbGljazogKCkgPT4gbS5yb3V0ZSgnL21lc3NhZ2VzJyl9LCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcIm1lc3NhZ2VcIilcbiAgICAgIF0pLFxuICAgICAgbSgnYScsIHtvbmNsaWNrOiBsb2dvdXR9LCBbXG4gICAgICAgIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcInBvd2VyX3NldHRpbmdzX25ld1wiKVxuICAgICAgXSlcbiAgICBdKTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbmF2LXBhbmVsLmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XHJcblxyXG5pbXBvcnQgbG9nZ2VkSW4sIHtjaGVjaywgYXR0ZW1wdH0gZnJvbSAnLi91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXInO1xyXG5pbXBvcnQgYmluZCBmcm9tICcuL3V0aWxpdHkvYmluZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHNob3dOYW1lID0gbS5wcm9wKDApLFxyXG4gICAgICBmb3JOYW1lID0gbS5wcm9wKFwiXCIpLFxyXG4gICAgICBjb250ZW50ID0gbS5wcm9wKFwiXCIpLFxyXG4gICAgICBlbGVtZW50ID0gbS5wcm9wKCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcG9zdCAoKSB7XHJcbiAgICAgIGlmIChlbGVtZW50KCkuY2hlY2tWYWxpZGl0eSgpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2hvd05hbWUoKSk7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgIHVybDogJ2FwaS91c2VyUG9zdC5waHAnLFxyXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgcG9zdDogY29udGVudCgpLFxyXG4gICAgICAgICAgICBmb3JfbmFtZTogZm9yTmFtZSgpLFxyXG4gICAgICAgICAgICBzaG93TmFtZTogc2hvd05hbWUoKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHN1Y2Nlc3M6ICgpID0+IGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSxcclxuICAgICAgICAgIGVycm9yOiAoZXJyb3IpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvck5hbWUsXHJcbiAgICAgIGNvbnRlbnQsXHJcbiAgICAgIHNob3dOYW1lLFxyXG4gICAgICBlbGVtZW50LFxyXG4gICAgICBwb3N0XHJcbiAgICB9XHJcbiAgfSxcclxuICB2aWV3OiBmdW5jdGlvbiAoY3RybCkge1xyXG4gICAgcmV0dXJuIG0oXCJmb3JtLmNhcmQtcGFuZWwuaG92ZXJhYmxlXCIsIHtjb25maWc6IGN0cmwuZWxlbWVudH0sIFtcclxuICAgICAgbShcIi5pbnB1dC1maWVsZFwiLCBbXHJcbiAgICAgICAgbShcImlucHV0W2lkPSdwb3N0LXRpdGxlJ11bdHlwZT0ndGV4dCddW3BsYWNlaG9sZGVyPSdXaG8gYXJlIHlvdSBjb21wbGltZW50aW5nPyddXCIsIGJpbmQoY3RybC5mb3JOYW1lKSksXHJcbiAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC10aXRsZSddXCIpXHJcbiAgICAgIF0pLFxyXG4gICAgICBtKFwiLmlucHV0LWZpZWxkXCIsIFtcclxuICAgICAgICBtKFwidGV4dGFyZWEubWF0ZXJpYWxpemUtdGV4dGFyZWFbaWQ9J3Bvc3QtdGV4dGFyZWEnXVtsZW5ndGg9JzEwMDAnXVwiLCBiaW5kKGN0cmwuY29udGVudCkpLFxyXG4gICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bvc3QtdGV4dGFyZWEnXVwiLCBcIlN1Ym1pdCBhIHBvc3QhXCIpXHJcbiAgICAgIF0pLFxyXG4gICAgICBtKFwiLnJvd1wiLCBbXHJcbiAgICAgICAgbShcIi5jb2wuczEyLm04XCIsIFtcclxuICAgICAgICAgIG0oXCJkaXZcIiwgW1xyXG4gICAgICAgICAgICBtKFwiaW5wdXRbY2hlY2tlZD0nY2hlY2tlZCddW2lkPSdwb3N0LWFub24nXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9JzAnXVwiKSxcclxuICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC1hbm9uJ11cIiwgXCJTdWJtaXQgYW5vbnltb3VzbHlcIilcclxuICAgICAgICAgIF0pLFxyXG4gICAgICAgICAgbShcImRpdlwiLCBbXHJcbiAgICAgICAgICAgIG0oXCJpbnB1dFtpZD0ncG9zdC1uYW1lJ11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPScxJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKCdjaGVja2VkJywgY3RybC5zaG93TmFtZSl9KSxcclxuICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC1uYW1lJ11cIiwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXHJcbiAgICAgICAgICBdKVxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIG0oXCIuY29sLnMxMi5tNFwiLCBbXHJcbiAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi53YXZlcy1lZmZlY3Qud2F2ZXMtbGlnaHRbbmFtZT0nYWN0aW9uJ11bdHlwZT0nYnV0dG9uJ11cIiwge29uY2xpY2s6IGF0dGVtcHQoY3RybC5wb3N0KX0sIFtcIlBvc3RcIiwgbShcImkubWF0ZXJpYWwtaWNvbnMucmlnaHRcIiwgXCJtZXNzYWdlXCIpXSlcclxuICAgICAgICBdKVxyXG4gICAgICBdKVxyXG4gICAgXSk7XHJcbiAgfVxyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3Bvc3QtYm94LmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCBiaW5kIGZyb20gJy4vdXRpbGl0eS9iaW5kJztcbmltcG9ydCB7YXR0ZW1wdH0gZnJvbSAnLi91dGlsaXR5L2xvZ2luLWNvbnRyb2xsZXInO1xuaW1wb3J0IHtvcGVuTWVzc2FnZU1vZGFsfSBmcm9tICcuL21lc3NhZ2UtbW9kYWwnO1xuXG5pbXBvcnQgY29tbWVudENvbXBvbmVudCBmcm9tICcuL2NvbW1lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XG5cbiAgICBsZXQgY29tbWVudFRleHQgPSBtLnByb3AoJycpLFxuICAgICAgc2hvd05hbWUgPSBtLnByb3AoMCk7XG5cbiAgICBmdW5jdGlvbiBkZWxldGVQb3N0ICgpIHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgdXJsOiAnYXBpL3VzZXJQb3N0LnBocCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkZWxldGU6IGFyZ3MucG9zdC5wX2lkXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6ICgpID0+IGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSxcbiAgICAgICAgZXJyb3I6ICgpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Ym1pdENvbW1lbnQgKCkge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB1cmw6ICdhcGkvY29tbWVudC5waHAnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcF9pZDogYXJncy5wb3N0LnBfaWQsXG4gICAgICAgICAgY29tbWVudDogY29tbWVudFRleHQoKSxcbiAgICAgICAgICBzaG93TmFtZTogc2hvd05hbWUoKVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAoKSA9PiBkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQodHJ1ZSksXG4gICAgICAgIGVycm9yOiAoKSA9PiBjb25zb2xlLmxvZyhlcnJvci5yZXNwb25zZVRleHQpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2b3RlICgpIHtcbiAgICAgIGlmIChhcmdzLnBvc3QudmFsdWUgIT09ICcxJykge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICB1cmw6ICdhcGkvdm90ZVBvc3QucGhwJyxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBfaWQ6IGFyZ3MucG9zdC5wX2lkLFxuICAgICAgICAgICAgdXA6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Y2Nlc3M6ICgpID0+IGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSxcbiAgICAgICAgICBlcnJvcjogKCkgPT4gY29uc29sZS5sb2coZXJyb3IucmVzcG9uc2VUZXh0KVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29tbWVudFRleHQsXG4gICAgICBkZWxldGVQb3N0LFxuICAgICAgc3VibWl0Q29tbWVudCxcbiAgICAgIHNob3dOYW1lLFxuICAgICAgdm90ZVxuICAgIH07XG4gIH0sXG4gIHZpZXc6IGZ1bmN0aW9uIChjdHJsLCBhcmdzKSB7XG4gICAgcmV0dXJuIG0oJ2FydGljbGUuc3VibWlzc2lvbi5jYXJkLXBhbmVsLmhvdmVyYWJsZScsIFtcbiAgICAgIG0oJ2gzJywgYXJncy5wb3N0LmZvcl9uYW1lKSxcbiAgICAgIG0oYGFzaWRlLnZvdGUubGVmdCR7KChhcmdzLnBvc3QudmFsdWUgPT09ICcxJyk/Jy52b3RlZCc6JycpfWAsIFtcbiAgICAgICAgbSgnaS5zbWFsbC5tYXRlcmlhbC1pY29ucycsIHtvbmNsaWNrOiBhdHRlbXB0KGN0cmwudm90ZSl9LCAndGh1bWJfdXAnKSxcbiAgICAgICAgbSgnYnInKSxcbiAgICAgICAgbSgnLmNvdW50LmNlbnRlci1hbGlnbicsIGFyZ3MucG9zdC52b3RlcylcbiAgICAgIF0pLFxuICAgICAgbSgnLnBvc3QtYm9keScsIFtcbiAgICAgICAgbSgncC5mbG93LXRleHQnLCBbXG4gICAgICAgICAgYXJncy5wb3N0LnBvc3QsXG4gICAgICAgICAgbShcImEucXVvdGUtYnlbdGl0bGU9J1NlbmQgYSBwcml2YXRlIG1lc3NhZ2UnXVwiLCB7b25jbGljazogYXR0ZW1wdChvcGVuTWVzc2FnZU1vZGFsLCBhcmdzLnBvc3Qub3duYWdlX2lkKX0sIGFyZ3MucG9zdC5uYW1lKVxuICAgICAgICBdKSxcbiAgICAgIF0pLFxuICAgICAgKChhcmdzLnBvc3QudV9pZCAhPT0gLTEpID8gbShcImJ1dHRvbi5idG4ud2F2ZXMtZWZmZWN0LndhdmVzLWxpZ2h0LnJlZC5yaWdodC50aWdodFt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogY3RybC5kZWxldGVQb3N0fSwgW1wiXCIsIG0oXCJpLm1hdGVyaWFsLWljb25zXCIsIFwiZGVsZXRlXCIpXSkgOiBcIlwiKSxcbiAgICAgIG0oXCJmb3JtXCIsIFtcbiAgICAgICAgbShcIi5pbnB1dC1maWVsZFwiLCBbXG4gICAgICAgICAgbShgdGV4dGFyZWEubWF0ZXJpYWxpemUtdGV4dGFyZWFbaWQ9J3Bvc3QtdGV4dGFyZWEtJHthcmdzLnBvc3RQYWdlSW5kZXh9J11bbGVuZ3RoPScxMDAwJ11gLCBiaW5kKGN0cmwuY29tbWVudFRleHQpKSxcbiAgICAgICAgICBtKGBsYWJlbFtmb3I9J3Bvc3QtdGV4dGFyZWEtJHthcmdzLnBvc3RQYWdlSW5kZXh9J11gLCB7b25jbGljazogY3RybC5zdWJtaXRDb21tZW50fSwgXCJTdWJtaXQgYSBjb21tZW50XCIpXG4gICAgICAgIF0pLFxuICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgbShcIi5jb2wuczEyLm04XCIsIFtcbiAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgICBtKGBpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J3Bvc3QtYW5vbi0ke2FyZ3MucG9zdFBhZ2VJbmRleH0nXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9J25vJ11gKSxcbiAgICAgICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LWFub24tJHthcmdzLnBvc3RQYWdlSW5kZXh9J11gLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgICAgbShgaW5wdXRbaWQ9J3Bvc3QtbmFtZS0ke2FyZ3MucG9zdFBhZ2VJbmRleH0nXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9J3llcyddYCwge29uY2hhbmdlOiBtLndpdGhBdHRyKCdjaGVja2VkJywgY3RybC5zaG93TmFtZSl9KSxcbiAgICAgICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LW5hbWUtJHthcmdzLnBvc3RQYWdlSW5kZXh9J11gLCBcIlN1Ym1pdCB3aXRoIG5hbWVcIilcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcIi5jb2wuczEyLm00XCIsIFtcbiAgICAgICAgICAgIG0oXCJidXR0b24uYnRuLndhdmVzLWVmZmVjdC53YXZlcy1saWdodFtuYW1lPSdhY3Rpb24nXVt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogYXR0ZW1wdChjdHJsLnN1Ym1pdENvbW1lbnQpfSwgW1wiQ29tbWVudFwiLCBtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcImNoYXRfYnViYmxlXCIpXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBtKFwiLmNvbW1lbnRzLWNvbnRhaW5lclwiLCBhcmdzLnBvc3QuY29tbWVudHMubWFwKChjb21tZW50KSA9PiBtLmNvbXBvbmVudChjb21tZW50Q29tcG9uZW50LCB7Y29tbWVudCwgcG9zdDogYXJncy5wb3N0fSkpKVxuICAgIF0pXG4gIH1cbn07XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBDOi9kZXYvcHJvamVjdHMvY29tbWVudHMvc3JjL3Bvc3QuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IHtvcGVuTWVzc2FnZU1vZGFsfSBmcm9tICcuL21lc3NhZ2UtbW9kYWwnO1xuaW1wb3J0IHthdHRlbXB0fSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29udHJvbGxlcjogZnVuY3Rpb24gKGFyZ3MpIHtcblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUNvbW1lbnQgKCkge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICB1cmw6ICdhcGkvY29tbWVudC5waHAnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGVsZXRlOiBhcmdzLmNvbW1lbnQuY19pZFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiAoKSA9PiBkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQodHJ1ZSksXG4gICAgICAgIGVycm9yOiAoZXJyb3IpID0+IGNvbnNvbGUubG9nKGVycm9yLnJlc3BvbnNlVGV4dClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkZWxldGVDb21tZW50XG4gICAgfTtcbiAgfSxcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwsIGFyZ3MpIHtcbiAgICByZXR1cm4gbShcImJsb2NrcXVvdGVcIiwgW1xuICAgICAgKChhcmdzLmNvbW1lbnQudV9pZCAhPT0gLTEpID8gbShcImJ1dHRvbi5idG4ud2F2ZXMtZWZmZWN0LndhdmVzLWxpZ2h0LnJlZC5yaWdodC50aWdodFt0eXBlPSdidXR0b24nXVwiLCB7b25jbGljazogY3RybC5kZWxldGVDb21tZW50fSwgW1wiXCIsIG0oXCJpLm1hdGVyaWFsLWljb25zXCIsIFwiZGVsZXRlXCIpXSkgOiBcIlwiKSxcbiAgICAgIGFyZ3MuY29tbWVudC5jb21tZW50LFxuICAgICAgbShcImJyXCIpLFxuICAgICAgbShcImEucXVvdGUtYnlbdGl0bGU9J1NlbmQgYSBwcml2YXRlIG1lc3NhZ2UnXVwiLCB7b25jbGljazogYXR0ZW1wdChvcGVuTWVzc2FnZU1vZGFsLCBhcmdzLmNvbW1lbnQub3duYWdlX2lkKX0sIGFyZ3MuY29tbWVudC5uYW1lKVxuICAgIF0pO1xuICB9XG59O1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogQzovZGV2L3Byb2plY3RzL2NvbW1lbnRzL3NyYy9jb21tZW50LmpzXG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5cbmltcG9ydCB3cmFwcGVyIGZyb20gJy4vd3JhcHBlcic7XG5pbXBvcnQgbWVzc2FnZUNvbXBvbmVudCBmcm9tICcuL21lc3NhZ2UnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbnRyb2xsZXI6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBtLnByb3AoW10pO1xuXG4gICAgbS5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIHVybDogJ2FwaS9tZXNzYWdlLnBocCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICBjb3VudDogMTBcbiAgICAgIH1cbiAgICB9KS50aGVuKG1lc3NhZ2VzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlc1xuICAgIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcbiAgICByZXR1cm4gW1xuICAgICAgbS5jb21wb25lbnQod3JhcHBlciwge21haW46IG0oXCJtYWluLmNvbnRhaW5lclwiLCBbXG4gICAgICAgIG0oJ3VsJyxcbiAgICAgICAgICBjdHJsLm1lc3NhZ2VzKCkubWFwKChtZXNzYWdlKSA9PiBtLmNvbXBvbmVudChtZXNzYWdlQ29tcG9uZW50LCB7bWVzc2FnZX0pKVxuICAgICAgICApXG4gICAgICBdKX0pXG4gICAgXTtcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZXMuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuaW1wb3J0IGJpbmQgZnJvbSAnLi91dGlsaXR5L2JpbmQnO1xuaW1wb3J0IHtvcGVuTWVzc2FnZU1vZGFsfSBmcm9tICcuL21lc3NhZ2UtbW9kYWwnO1xuaW1wb3J0IHthdHRlbXB0fSBmcm9tICcuL3V0aWxpdHkvbG9naW4tY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwsIGFyZ3MpIHtcbiAgICByZXR1cm4gbSgnYXJ0aWNsZS5zdWJtaXNzaW9uLmNhcmQtcGFuZWwuaG92ZXJhYmxlJywgW1xuICAgICAgbSgnLnBvc3QtYm9keScsIFtcbiAgICAgICAgbSgncC5mbG93LXRleHQnLCBbXG4gICAgICAgICAgYXJncy5tZXNzYWdlLm1lc3NhZ2UsXG4gICAgICAgICAgbShcImEucXVvdGUtYnlbdGl0bGU9J1NlbmQgYSBwcml2YXRlIG1lc3NhZ2UnXVwiLCB7b25jbGljazogYXR0ZW1wdChvcGVuTWVzc2FnZU1vZGFsLCBhcmdzLm1lc3NhZ2Uub3duYWdlX2lkKX0sIGFyZ3MubWVzc2FnZS5uYW1lKVxuICAgICAgICBdKSxcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxufTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIEM6L2Rldi9wcm9qZWN0cy9jb21tZW50cy9zcmMvbWVzc2FnZS5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=