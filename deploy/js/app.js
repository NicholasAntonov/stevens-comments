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
	
	var _mainModule = __webpack_require__(3);
	
	var main = _interopRequireWildcard(_mainModule);
	
	$(document).ready(function () {
		_mithril2['default'].mount(document.body, main);
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
	
	    var loggedIn = _mithril2['default'].request({
	      method: 'GET',
	      url: 'checkLogin.php',
	      deserialize: function deserialize(value) {
	        return JSON.parse(value);
	      }
	    });
	
	    var name = _mithril2['default'].prop(''),
	        password = _mithril2['default'].prop(''),
	        passwordConfirmation = _mithril2['default'].prop(''),
	        email = _mithril2['default'].prop(''),
	        for_name = _mithril2['default'].prop(''),
	        postContent = _mithril2['default'].prop(''),
	        showName = _mithril2['default'].prop('0');
	
	    function register() {
	      $.post('register.php', {
	        name: name(),
	        password: password(),
	        email: email()
	      }, function (data) {
	        _mithril2['default'].request({
	          method: 'POST',
	          url: 'checkLogin.php',
	          extract: nonJsonErrors,
	          deserialize: function deserialize(value) {
	            return JSON.parse(value);
	          }
	        }).then(loggedIn, function (error) {
	          return console.log(error);
	        });
	        console.log(loggedIn());
	      });
	    }
	
	    function newPost() {
	      $.post('register.php', {
	        for_name: for_name(),
	        postContent: postContent(),
	        showName: showName()
	      });
	    }
	
	    function logout() {
	      $.post('logout.php');
	    }
	
	    function nonJsonErrors(xhr) {
	      return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText;
	    }
	
	    return {
	      posts: posts,
	      loggedIn: loggedIn,
	      name: name,
	      postContent: postContent,
	      for_name: for_name,
	      showName: showName,
	      password: password,
	      passwordConfirmation: passwordConfirmation,
	      email: email,
	      register: register
	    };
	  },
	  view: function view(ctrl) {
	    return [(0, _mithril2['default'])('header', [(0, _mithril2['default'])('nav.top-nav', [(0, _mithril2['default'])('h1.center-align', 'Stevens Compliments and Crushes')])]), (0, _mithril2['default'])('main.container', [(0, _mithril2['default'])('form.card-panel.hoverable', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('input[id=\'post-title\'][type=\'text\'][placeholder=\'Who are you complimenting?\']', { onchange: _mithril2['default'].withAttr('value', ctrl.for_name), value: ctrl.for_name() }), (0, _mithril2['default'])('label[for=\'post-title\']')]), (0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea\'][length=\'1000\']', { onchange: _mithril2['default'].withAttr('value', ctrl.postContent), value: ctrl.postContent() }), (0, _mithril2['default'])('label[for=\'post-textarea\']', 'Submit a post!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon\'][name=\'named\'][type=\'radio\'][value=\'0\']', { onchange: _mithril2['default'].withAttr('value', ctrl.showName), value: ctrl.showName() }), (0, _mithril2['default'])('label[for=\'post-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name\'][name=\'named\'][type=\'radio\'][value=\'1\']', { onchange: _mithril2['default'].withAttr('value', ctrl.showName), value: ctrl.showName() }), (0, _mithril2['default'])('label[for=\'post-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'submit\']', ['Post', (0, _mithril2['default'])('i.material-icons.right', 'message')])])])]), (0, _mithril2['default'])('ul', ctrl.posts().map(function (post, postPageIndex) {
	      return (0, _mithril2['default'])('li.submission.card-panel.hoverable', [(0, _mithril2['default'])('h3', post.for_name), (0, _mithril2['default'])('.vote.left', [(0, _mithril2['default'])('i.small.material-icons', 'thumb_up'), (0, _mithril2['default'])('br'), (0, _mithril2['default'])('.count.center-align', post.votes)]), (0, _mithril2['default'])('p.flow-text', [post.post, (0, _mithril2['default'])('a.quote-by[onclick=\'$(\'#message-modal\').openModal();\'][title=\'Send a private message\']', post.name)]), (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'post-textarea-' + postPageIndex + '\'][length=\'1000\']'), (0, _mithril2['default'])('label[for=\'post-textarea-' + postPageIndex + '\']', 'Submit a comment')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m8', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'post-anon-' + postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'post-anon-' + postPageIndex + '\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'post-name-' + postPageIndex + '\'][name=\'named\'][type=\'radio\'][value=\'yes\']'), (0, _mithril2['default'])('label[for=\'post-name-' + postPageIndex + '\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m4', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'submit\']', ['Comment', (0, _mithril2['default'])('i.material-icons.right', 'chat_bubble')])])])]), (0, _mithril2['default'])('.comments-container', post.comments.map(function (comment) {
	        return (0, _mithril2['default'])('blockquote', [comment.comment, (0, _mithril2['default'])('br'), (0, _mithril2['default'])('a.quote-by[onclick=\'$(\'#message-modal\').openModal();\'][title=\'Send a private message\']', comment.name)]);
	      }))]);
	    }))]), (0, _mithril2['default'])('footer.page-footer', [(0, _mithril2['default'])('.footer-copyright', [(0, _mithril2['default'])('.center-align.valign', '© 2015 Nicholas Antonov & Brian Zawizawa for CS546 at Stevens')])]), (0, _mithril2['default'])('.login-box.z-depth-2' + (ctrl.loggedIn() ? '' : '.hidden'), { onclick: function onclick() {
	        $('#combo-modal').openModal();
	      } }, [(0, _mithril2['default'])('a', 'Log in / Register')]), (0, _mithril2['default'])('.login-box.z-depth-2' + (ctrl.loggedIn() ? '.hidden' : ''), { onclick: function onclick() {
	        alert('implement messages');
	      } }, [[(0, _mithril2['default'])('i.material-icons.side-icon', 'message'), (0, _mithril2['default'])('i.material-icons.side-icon', 'power_settings_new')]]), (0, _mithril2['default'])('.modal[id=\'combo-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('p', 'Thanks for using this site. To prevent abuse and allow for a rich featured experience, users are required to log in. Don\'t Worry! All your information will be kept anonymous as long as you choose to keep it that way.')]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left]', { onclick: function onclick() {
	        $('#login-modal').openModal();
	      } }, 'Log In'), (0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.left', { onclick: function onclick() {
	        $('#register-modal').openModal();
	      } }, 'Register')])]), (0, _mithril2['default'])('.modal[id=\'login-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Log In'), (0, _mithril2['default'])('form.col.s12', [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'login-email\'][type=\'email\']'), (0, _mithril2['default'])('label[for=\'login-email\']', 'Email')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'login-password\'][type=\'password\']'), (0, _mithril2['default'])('label[for=\'login-password\']', 'Password')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', 'Log In')])]), (0, _mithril2['default'])('.modal[id=\'register-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Register'), (0, _mithril2['default'])('form.col.s12', [(0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'account_circle'), (0, _mithril2['default'])('input.validate[id=\'name\'][required=\'\'][pattern=.+ .+][type=\'text\']', { onchange: _mithril2['default'].withAttr('value', ctrl.name), value: ctrl.name() }), (0, _mithril2['default'])('label[for=\'name\']', 'Name')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'password\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.password), value: ctrl.password() }), (0, _mithril2['default'])('label[for=\'password\']', 'Password')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'lock_outline'), (0, _mithril2['default'])('input.validate[id=\'confirm-password\'][type=\'password\']', { onchange: _mithril2['default'].withAttr('value', ctrl.passwordConfirmation), value: ctrl.passwordConfirmation() }), (0, _mithril2['default'])('label[for=\'confirm-password\']', 'Confirm Password')])]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.input-field.col.s12', [(0, _mithril2['default'])('i.material-icons.prefix', 'email'), (0, _mithril2['default'])('input.validate[id=\'email\'][type=\'email\']', { onchange: _mithril2['default'].withAttr('value', ctrl.email), value: ctrl.email() }), (0, _mithril2['default'])('label[for=\'email\']', 'Email')])])])]), (0, _mithril2['default'])('.modal-footer', [(0, _mithril2['default'])('a.modal-action.modal-close.waves-effect.waves-green.btn-flat.right', { onclick: ctrl.register }, 'Register')])]),, (0, _mithril2['default'])('.modal[id=\'message-modal\']', [(0, _mithril2['default'])('.modal-content', [(0, _mithril2['default'])('h4', 'Message'), (0, _mithril2['default'])('form', [(0, _mithril2['default'])('.input-field.message-to', [(0, _mithril2['default'])('input.validate[disabled=\'\'][id=\'disabled\'][type=\'text\'][value=\'I am not editable\']'), (0, _mithril2['default'])('label[for=\'disabled\']', 'Recipient')]), (0, _mithril2['default'])('.input-field', [(0, _mithril2['default'])('textarea.materialize-textarea[id=\'message-textarea\'][length=\'1000\']'), (0, _mithril2['default'])('label[for=\'message-textarea\']', 'Submit a post!')]), (0, _mithril2['default'])('.row', [(0, _mithril2['default'])('.col.s12.m7', [(0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[checked=\'checked\'][id=\'message-anon\'][name=\'named\'][type=\'radio\'][value=\'no\']'), (0, _mithril2['default'])('label[for=\'message-anon\']', 'Submit anonymously')]), (0, _mithril2['default'])('div', [(0, _mithril2['default'])('input[id=\'message-name\'][name=\'named\'][type=\'radio\'][value=\'yes\']'), (0, _mithril2['default'])('label[for=\'message-name\']', 'Submit with name')])]), (0, _mithril2['default'])('.col.s12.m5', [(0, _mithril2['default'])('button.btn.waves-effect.waves-light[name=\'action\'][type=\'submit\']', ['Send ', (0, _mithril2['default'])('i.material-icons.right', 'send')])])])])])])];
	  }
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2FhOWIxNTFkNmE3MjI0ZDg5ZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vbWl0aHJpbC9taXRocmlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O29DQ3RDYyxDQUFTOzs7O3VDQUNELENBQWU7O0tBQXpCLElBQUk7O0FBRWhCLEVBQUMsQ0FBRSxRQUFRLENBQUUsQ0FBQyxLQUFLLENBQUMsWUFBTTtBQUN6Qix1QkFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztFQUM3QixDQUFDLEM7Ozs7Ozs7O0FDTEYsS0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO0FBQ3hDLE1BQUksTUFBTSxHQUFHLGlCQUFpQjtNQUFFLEtBQUssR0FBRyxnQkFBZ0I7TUFBRSxNQUFNLEdBQUcsaUJBQWlCO01BQUUsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUM1RyxNQUFJLElBQUksR0FBRyxJQUFFLENBQUMsUUFBUSxDQUFDO0FBQ3ZCLE1BQUksTUFBTSxHQUFHLHNDQUFzQztNQUFFLFVBQVUsR0FBRyw4QkFBOEIsQ0FBQztBQUNqRyxNQUFJLFlBQVksR0FBRyx5RkFBeUYsQ0FBQztBQUM3RyxNQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBYyxFQUFFOzs7QUFHeEIsTUFBSSxTQUFTLEVBQUUsU0FBUyxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixDQUFDOzs7QUFHeEUsV0FBUyxVQUFVLENBQUMsTUFBTSxFQUFDO0FBQzFCLFlBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzVCLFlBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0FBQzVCLHdCQUFxQixHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQzNFLHlCQUFzQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDO0dBQzNFOztBQUVELFlBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JuQixXQUFTLENBQUMsR0FBRztBQUNaLE9BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLE9BQUksUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2SSxPQUFJLEtBQUssR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNwQyxPQUFJLGFBQWEsR0FBRyxPQUFPLElBQUksS0FBSyxHQUFHLE9BQU8sR0FBRyxXQUFXLENBQUM7QUFDN0QsT0FBSSxJQUFJLEdBQUcsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQztBQUNuQyxPQUFJLEtBQUs7T0FBRSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLE9BQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw2REFBNkQsQ0FBQztBQUNoSCxVQUFPLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3BDLFFBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FDaEQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUMvQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUM3QyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDN0IsU0FBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxTQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFFLElBQUksQ0FBQztLQUNyRDtJQUNEOztBQUVELE9BQUksUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsT0FBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJ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SyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNO01BQ2hFLE1BQ0ksYUFBYSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xFLFdBQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUk7S0FDM0I7QUFDRCxRQUFJLENBQUMsTUFBTSxFQUFFOzs7O0FBSVosVUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxVQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7TUFDL0Q7OztBQUdELFVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxVQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDbEY7QUFDRCxTQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0QsV0FBTSxDQUFDLEtBQUssR0FBRyxLQUFLO0tBQ3BCO0lBQ0QsTUFDSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksUUFBUSxLQUFLLE1BQU0sRUFBRTtBQUM3QyxR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QUUsQ0FDakIsMEJBQUUsb0VBQW9FLEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLFVBQVUsQ0FBQyxDQUM5RyxDQUFDLENBQ0gsQ0FBQyxHQUFFLDBCQUFFLDhCQUE0QixFQUFFLENBQ2xDLDBCQUFFLGdCQUFnQixFQUFFLENBQ2xCLDBCQUFFLElBQUksRUFBRSxTQUFTLENBQUMsRUFDbEIsMEJBQUUsTUFBTSxFQUFFLENBQ1IsMEJBQUUseUJBQXlCLEVBQUUsQ0FDM0IsMEJBQUUsNEZBQW9GLENBQUMsRUFDdkYsMEJBQUUseUJBQXVCLEVBQUUsV0FBVyxDQUFDLENBQ3hDLENBQUMsRUFDRiwwQkFBRSxjQUFjLEVBQUUsQ0FDaEIsMEJBQUUseUVBQXFFLENBQUMsRUFDeEUsMEJBQUUsaUNBQStCLEVBQUUsZ0JBQWdCLENBQUMsQ0FDckQsQ0FBQyxFQUNGLDBCQUFFLE1BQU0sRUFBRSxDQUNSLDBCQUFFLGFBQWEsRUFBRSxDQUNmLDBCQUFFLEtBQUssRUFBRSxDQUNQLDBCQUFFLCtGQUFxRixDQUFDLEVBQ3hGLDBCQUFFLDZCQUEyQixFQUFFLG9CQUFvQixDQUFDLENBQ3JELENBQUMsRUFDRiwwQkFBRSxLQUFLLEVBQUUsQ0FDUCwwQkFBRSwyRUFBbUUsQ0FBQyxFQUN0RSwwQkFBRSw2QkFBMkIsRUFBRSxrQkFBa0IsQ0FBQyxDQUNuRCxDQUFDLENBQ0gsQ0FBQyxFQUNGLDBCQUFFLGFBQWEsRUFBRSxDQUNmLDBCQUFFLHVFQUFtRSxFQUFFLENBQUMsT0FBTyxFQUFDLDBCQUFFLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDdEgsQ0FBQyxDQUNILENBQUMsQ0FDSCxDQUFDLENBQ0gsQ0FBQyxDQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0w7RUFDRiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGNhYTliMTUxZDZhNzIyNGQ4OWU4XG4gKiovIiwiaW1wb3J0IG0gZnJvbSAnbWl0aHJpbCc7XG5pbXBvcnQgKiBhcyBtYWluIGZyb20gJy4vbWFpbi9tb2R1bGUnO1xuXG4kKCBkb2N1bWVudCApLnJlYWR5KCgpID0+IHtcblx0bS5tb3VudChkb2N1bWVudC5ib2R5LCBtYWluKTtcbn0pXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbmRleC5qc1xuICoqLyIsInZhciBtID0gKGZ1bmN0aW9uIGFwcCh3aW5kb3csIHVuZGVmaW5lZCkge1xyXG5cdHZhciBPQkpFQ1QgPSBcIltvYmplY3QgT2JqZWN0XVwiLCBBUlJBWSA9IFwiW29iamVjdCBBcnJheV1cIiwgU1RSSU5HID0gXCJbb2JqZWN0IFN0cmluZ11cIiwgRlVOQ1RJT04gPSBcImZ1bmN0aW9uXCI7XHJcblx0dmFyIHR5cGUgPSB7fS50b1N0cmluZztcclxuXHR2YXIgcGFyc2VyID0gLyg/OihefCN8XFwuKShbXiNcXC5cXFtcXF1dKykpfChcXFsuKz9cXF0pL2csIGF0dHJQYXJzZXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vO1xyXG5cdHZhciB2b2lkRWxlbWVudHMgPSAvXihBUkVBfEJBU0V8QlJ8Q09MfENPTU1BTkR8RU1CRUR8SFJ8SU1HfElOUFVUfEtFWUdFTnxMSU5LfE1FVEF8UEFSQU18U09VUkNFfFRSQUNLfFdCUikkLztcclxuXHR2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge31cclxuXHJcblx0Ly8gY2FjaGluZyBjb21tb25seSB1c2VkIHZhcmlhYmxlc1xyXG5cdHZhciAkZG9jdW1lbnQsICRsb2NhdGlvbiwgJHJlcXVlc3RBbmltYXRpb25GcmFtZSwgJGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xyXG5cclxuXHQvLyBzZWxmIGludm9raW5nIGZ1bmN0aW9uIG5lZWRlZCBiZWNhdXNlIG9mIHRoZSB3YXkgbW9ja3Mgd29ya1xyXG5cdGZ1bmN0aW9uIGluaXRpYWxpemUod2luZG93KXtcclxuXHRcdCRkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcclxuXHRcdCRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuY2xlYXJUaW1lb3V0O1xyXG5cdFx0JHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LnNldFRpbWVvdXQ7XHJcblx0fVxyXG5cclxuXHRpbml0aWFsaXplKHdpbmRvdyk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1RhZ30gVGhlIERPTSBub2RlIHRhZ1xyXG5cdCAqIEBwYXJhbSB7T2JqZWN0PVtdfSBvcHRpb25hbCBrZXktdmFsdWUgcGFpcnMgdG8gYmUgbWFwcGVkIHRvIERPTSBhdHRyc1xyXG5cdCAqIEBwYXJhbSB7Li4ubU5vZGU9W119IFplcm8gb3IgbW9yZSBNaXRocmlsIGNoaWxkIG5vZGVzLiBDYW4gYmUgYW4gYXJyYXksIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIG0oKSB7XHJcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdHZhciBoYXNBdHRycyA9IGFyZ3NbMV0gIT0gbnVsbCAmJiB0eXBlLmNhbGwoYXJnc1sxXSkgPT09IE9CSkVDVCAmJiAhKFwidGFnXCIgaW4gYXJnc1sxXSB8fCBcInZpZXdcIiBpbiBhcmdzWzFdKSAmJiAhKFwic3VidHJlZVwiIGluIGFyZ3NbMV0pO1xyXG5cdFx0dmFyIGF0dHJzID0gaGFzQXR0cnMgPyBhcmdzWzFdIDoge307XHJcblx0XHR2YXIgY2xhc3NBdHRyTmFtZSA9IFwiY2xhc3NcIiBpbiBhdHRycyA/IFwiY2xhc3NcIiA6IFwiY2xhc3NOYW1lXCI7XHJcblx0XHR2YXIgY2VsbCA9IHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7fX07XHJcblx0XHR2YXIgbWF0Y2gsIGNsYXNzZXMgPSBbXTtcclxuXHRcdGlmICh0eXBlLmNhbGwoYXJnc1swXSkgIT0gU1RSSU5HKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKVxyXG5cdFx0d2hpbGUgKG1hdGNoID0gcGFyc2VyLmV4ZWMoYXJnc1swXSkpIHtcclxuXHRcdFx0aWYgKG1hdGNoWzFdID09PSBcIlwiICYmIG1hdGNoWzJdKSBjZWxsLnRhZyA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIGNlbGwuYXR0cnMuaWQgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiLlwiKSBjbGFzc2VzLnB1c2gobWF0Y2hbMl0pO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcclxuXHRcdFx0XHR2YXIgcGFpciA9IGF0dHJQYXJzZXIuZXhlYyhtYXRjaFszXSk7XHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgKHBhaXJbMl0gPyBcIlwiIDp0cnVlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDIpIDogYXJncy5zbGljZSgxKTtcclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgdHlwZS5jYWxsKGNoaWxkcmVuWzBdKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuWzBdXHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0Y2VsbC5jaGlsZHJlbiA9IGNoaWxkcmVuXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ck5hbWUgJiYgYXR0cnNbYXR0ck5hbWVdICE9IG51bGwgJiYgYXR0cnNbYXR0ck5hbWVdICE9PSBcIlwiKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXR0cnNbYXR0ck5hbWVdKVxyXG5cdFx0XHRcdFx0Y2VsbC5hdHRyc1thdHRyTmFtZV0gPSBcIlwiIC8vY3JlYXRlIGtleSBpbiBjb3JyZWN0IGl0ZXJhdGlvbiBvcmRlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjbGFzc2VzLmxlbmd0aCA+IDApIGNlbGwuYXR0cnNbY2xhc3NBdHRyTmFtZV0gPSBjbGFzc2VzLmpvaW4oXCIgXCIpO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gY2VsbFxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZChwYXJlbnRFbGVtZW50LCBwYXJlbnRUYWcsIHBhcmVudENhY2hlLCBwYXJlbnRJbmRleCwgZGF0YSwgY2FjaGVkLCBzaG91bGRSZWF0dGFjaCwgaW5kZXgsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIHtcclxuXHRcdC8vYGJ1aWxkYCBpcyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IG1hbmFnZXMgY3JlYXRpb24vZGlmZmluZy9yZW1vdmFsIG9mIERPTSBlbGVtZW50cyBiYXNlZCBvbiBjb21wYXJpc29uIGJldHdlZW4gYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly90aGUgZGlmZiBhbGdvcml0aG0gY2FuIGJlIHN1bW1hcml6ZWQgYXMgdGhpczpcclxuXHRcdC8vMSAtIGNvbXBhcmUgYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0Ly8yIC0gaWYgdGhleSBhcmUgZGlmZmVyZW50LCBjb3B5IGBkYXRhYCB0byBgY2FjaGVkYCBhbmQgdXBkYXRlIHRoZSBET00gYmFzZWQgb24gd2hhdCB0aGUgZGlmZmVyZW5jZSBpc1xyXG5cdFx0Ly8zIC0gcmVjdXJzaXZlbHkgYXBwbHkgdGhpcyBhbGdvcml0aG0gZm9yIGV2ZXJ5IGFycmF5IGFuZCBmb3IgdGhlIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cclxuXHRcdC8vdGhlIGBjYWNoZWRgIGRhdGEgc3RydWN0dXJlIGlzIGVzc2VudGlhbGx5IHRoZSBzYW1lIGFzIHRoZSBwcmV2aW91cyByZWRyYXcncyBgZGF0YWAgZGF0YSBzdHJ1Y3R1cmUsIHdpdGggYSBmZXcgYWRkaXRpb25zOlxyXG5cdFx0Ly8tIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mIERPTSBlbGVtZW50cyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhlIGRhdGEgcmVwcmVzZW50ZWQgYnkgdGhlIHJlc3BlY3RpdmUgdmlydHVhbCBlbGVtZW50XHJcblx0XHQvLy0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLCBgY2FjaGVkYCBpcyAqYWx3YXlzKiBhIG5vbi1wcmltaXRpdmUgb2JqZWN0LCBpLmUuIGlmIHRoZSBkYXRhIHdhcyBhIHN0cmluZywgdGhlbiBjYWNoZWQgaXMgYSBTdHJpbmcgaW5zdGFuY2UuIElmIGRhdGEgd2FzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0Ly8tIGBjYWNoZWQgYWxzbyBoYXMgYSBgY29uZmlnQ29udGV4dGAgcHJvcGVydHksIHdoaWNoIGlzIHRoZSBzdGF0ZSBzdG9yYWdlIG9iamVjdCBleHBvc2VkIGJ5IGNvbmZpZyhlbGVtZW50LCBpc0luaXRpYWxpemVkLCBjb250ZXh0KVxyXG5cdFx0Ly8tIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuIGl0J3MgYW4gQXJyYXksIGl0IHJlcHJlc2VudHMgYSBsaXN0IG9mIGVsZW1lbnRzOyB3aGVuIGl0J3MgYSBTdHJpbmcsIE51bWJlciBvciBCb29sZWFuLCBpdCByZXByZXNlbnRzIGEgdGV4dCBub2RlXHJcblxyXG5cdFx0Ly9gcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0Ly9gcGFyZW50VGFnYCBpcyBvbmx5IHVzZWQgZm9yIGhhbmRsaW5nIGEgY29ybmVyIGNhc2UgZm9yIHRleHRhcmVhIHZhbHVlc1xyXG5cdFx0Ly9gcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0Ly9gcGFyZW50SW5kZXhgIGFuZCBgaW5kZXhgIGFyZSB1c2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG9mZnNldCBvZiBub2Rlcy4gVGhleSdyZSBhcnRpZmFjdHMgZnJvbSBiZWZvcmUgYXJyYXlzIHN0YXJ0ZWQgYmVpbmcgZmxhdHRlbmVkIGFuZCBhcmUgbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0Ly9gZGF0YWAgYW5kIGBjYWNoZWRgIGFyZSwgcmVzcGVjdGl2ZWx5LCB0aGUgbmV3IGFuZCBvbGQgbm9kZXMgYmVpbmcgZGlmZmVkXHJcblx0XHQvL2BzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhcyByZWNyZWF0ZWQgKGlmIHNvLCBhbmQgaWYgdGhpcyBub2RlIGlzIHJldXNlZCwgdGhlbiB0aGlzIG5vZGUgbXVzdCByZWF0dGFjaCBpdHNlbGYgdG8gdGhlIG5ldyBwYXJlbnQpXHJcblx0XHQvL2BlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXMgY29udGVudGVkaXRhYmxlXHJcblx0XHQvL2BuYW1lc3BhY2VgIGluZGljYXRlcyB0aGUgY2xvc2VzdCBIVE1MIG5hbWVzcGFjZSBhcyBpdCBjYXNjYWRlcyBkb3duIGZyb20gYW4gYW5jZXN0b3JcclxuXHRcdC8vYGNvbmZpZ3NgIGlzIGEgbGlzdCBvZiBjb25maWcgZnVuY3Rpb25zIHRvIHJ1biBhZnRlciB0aGUgdG9wbW9zdCBgYnVpbGRgIGNhbGwgZmluaXNoZXMgcnVubmluZ1xyXG5cclxuXHRcdC8vdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZCBkYXRhIGFyZSBlcXVpdmFsZW50IHRvIGVtcHR5IHN0cmluZ3NcclxuXHRcdC8vLSB0aGlzIHByZXZlbnRzIGxpZmVjeWNsZSBzdXJwcmlzZXMgZnJvbSBwcm9jZWR1cmFsIGhlbHBlcnMgdGhhdCBtaXggaW1wbGljaXQgYW5kIGV4cGxpY2l0IHJldHVybiBzdGF0ZW1lbnRzIChlLmcuIGZ1bmN0aW9uIGZvbygpIHtpZiAoY29uZCkgcmV0dXJuIG0oXCJkaXZcIil9XHJcblx0XHQvLy0gaXQgc2ltcGxpZmllcyBkaWZmaW5nIGNvZGVcclxuXHRcdC8vZGF0YS50b1N0cmluZygpIG1pZ2h0IHRocm93IG9yIHJldHVybiBudWxsIGlmIGRhdGEgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiBDb25zb2xlLmxvZyBpbiBGaXJlZm94IChiZWhhdmlvciBkZXBlbmRzIG9uIHZlcnNpb24pXHJcblx0XHR0cnkge2lmIChkYXRhID09IG51bGwgfHwgZGF0YS50b1N0cmluZygpID09IG51bGwpIGRhdGEgPSBcIlwiO30gY2F0Y2ggKGUpIHtkYXRhID0gXCJcIn1cclxuXHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHR2YXIgY2FjaGVkVHlwZSA9IHR5cGUuY2FsbChjYWNoZWQpLCBkYXRhVHlwZSA9IHR5cGUuY2FsbChkYXRhKTtcclxuXHRcdGlmIChjYWNoZWQgPT0gbnVsbCB8fCBjYWNoZWRUeXBlICE9PSBkYXRhVHlwZSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAocGFyZW50Q2FjaGUgJiYgcGFyZW50Q2FjaGUubm9kZXMpIHtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IG9mZnNldCArIChkYXRhVHlwZSA9PT0gQVJSQVkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSBjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcjtcclxuXHRcdFx0aWYgKGNhY2hlZC50YWcpIGNhY2hlZCA9IHt9OyAvL2lmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXMgdGhlIGJhc2UgY2FjaGVkIG5vZGUgaW5zdGVhZCBvZiBjb3B5aW5nIHRoZSB2aXJ0dWFsIGVsICgjMjc3KVxyXG5cdFx0XHRjYWNoZWQubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhVHlwZSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Ly9yZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhW2ldKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdC5hcHBseShbXSwgZGF0YSk7XHJcblx0XHRcdFx0XHRpLS0gLy9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdFx0bGVuID0gZGF0YS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBub2RlcyA9IFtdLCBpbnRhY3QgPSBjYWNoZWQubGVuZ3RoID09PSBkYXRhLmxlbmd0aCwgc3ViQXJyYXlDb3VudCA9IDA7XHJcblxyXG5cdFx0XHQvL2tleXMgYWxnb3JpdGhtOiBzb3J0IGVsZW1lbnRzIHdpdGhvdXQgcmVjcmVhdGluZyB0aGVtIGlmIGtleXMgYXJlIHByZXNlbnRcclxuXHRcdFx0Ly8xKSBjcmVhdGUgYSBtYXAgb2YgYWxsIGV4aXN0aW5nIGtleXMsIGFuZCBtYXJrIGFsbCBmb3IgZGVsZXRpb25cclxuXHRcdFx0Ly8yKSBhZGQgbmV3IGtleXMgdG8gbWFwIGFuZCBtYXJrIHRoZW0gZm9yIGFkZGl0aW9uXHJcblx0XHRcdC8vMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0XHQvLzQpIGZvciBlYWNoIGtleSwgaGFuZGxlIGl0cyBjb3JyZXNwb25kaW5nIGFjdGlvbiBhcyBtYXJrZWQgaW4gcHJldmlvdXMgc3RlcHNcclxuXHRcdFx0dmFyIERFTEVUSU9OID0gMSwgSU5TRVJUSU9OID0gMiAsIE1PVkUgPSAzO1xyXG5cdFx0XHR2YXIgZXhpc3RpbmcgPSB7fSwgc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gZmFsc2U7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2FjaGVkLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSAmJiBjYWNoZWRbaV0uYXR0cnMgJiYgY2FjaGVkW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0ZXhpc3RpbmdbY2FjaGVkW2ldLmF0dHJzLmtleV0gPSB7YWN0aW9uOiBERUxFVElPTiwgaW5kZXg6IGl9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgZ3VpZCA9IDBcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzICYmIGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGogPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkYXRhW2pdICYmIGRhdGFbal0uYXR0cnMgJiYgZGF0YVtqXS5hdHRycy5rZXkgPT0gbnVsbCkgZGF0YVtqXS5hdHRycy5rZXkgPSBcIl9fbWl0aHJpbF9fXCIgKyBndWlkKytcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzKSB7XHJcblx0XHRcdFx0dmFyIGtleXNEaWZmZXIgPSBmYWxzZVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCAhPSBjYWNoZWQubGVuZ3RoKSBrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdGVsc2UgZm9yICh2YXIgaSA9IDAsIGNhY2hlZENlbGwsIGRhdGFDZWxsOyBjYWNoZWRDZWxsID0gY2FjaGVkW2ldLCBkYXRhQ2VsbCA9IGRhdGFbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZENlbGwuYXR0cnMgJiYgZGF0YUNlbGwuYXR0cnMgJiYgY2FjaGVkQ2VsbC5hdHRycy5rZXkgIT0gZGF0YUNlbGwuYXR0cnMua2V5KSB7XHJcblx0XHRcdFx0XHRcdGtleXNEaWZmZXIgPSB0cnVlXHJcblx0XHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChrZXlzRGlmZmVyKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoZGF0YVtpXSAmJiBkYXRhW2ldLmF0dHJzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0uYXR0cnMua2V5ICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXkgPSBkYXRhW2ldLmF0dHJzLmtleTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmICghZXhpc3Rpbmdba2V5XSkgZXhpc3Rpbmdba2V5XSA9IHthY3Rpb246IElOU0VSVElPTiwgaW5kZXg6IGl9O1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWxzZSBleGlzdGluZ1trZXldID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGluZGV4OiBpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmcm9tOiBleGlzdGluZ1trZXldLmluZGV4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHwgJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBhY3Rpb25zID0gW11cclxuXHRcdFx0XHRcdGZvciAodmFyIHByb3AgaW4gZXhpc3RpbmcpIGFjdGlvbnMucHVzaChleGlzdGluZ1twcm9wXSlcclxuXHRcdFx0XHRcdHZhciBjaGFuZ2VzID0gYWN0aW9ucy5zb3J0KHNvcnRDaGFuZ2VzKTtcclxuXHRcdFx0XHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aClcclxuXHRcdFx0XHRcdG5ld0NhY2hlZC5ub2RlcyA9IGNhY2hlZC5ub2Rlcy5zbGljZSgpXHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoYW5nZTsgY2hhbmdlID0gY2hhbmdlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBERUxFVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZFtjaGFuZ2UuaW5kZXhdLm5vZGVzLCBjYWNoZWRbY2hhbmdlLmluZGV4XSk7XHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLnNwbGljZShjaGFuZ2UuaW5kZXgsIDEpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IElOU0VSVElPTikge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBkdW1teSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cdFx0XHRcdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZHVtbXksIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tjaGFuZ2UuaW5kZXhdIHx8IG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAwLCB7YXR0cnM6IHtrZXk6IGRhdGFbY2hhbmdlLmluZGV4XS5hdHRycy5rZXl9LCBub2RlczogW2R1bW15XX0pXHJcblx0XHRcdFx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2NoYW5nZS5pbmRleF0gPSBkdW1teVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSAhPT0gY2hhbmdlLmVsZW1lbnQgJiYgY2hhbmdlLmVsZW1lbnQgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWRbY2hhbmdlLmluZGV4XSA9IGNhY2hlZFtjaGFuZ2UuZnJvbV1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQubm9kZXNbY2hhbmdlLmluZGV4XSA9IGNoYW5nZS5lbGVtZW50XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNhY2hlZCA9IG5ld0NhY2hlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9lbmQga2V5IGFsZ29yaXRobVxyXG5cclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNhY2hlQ291bnQgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0Ly9kaWZmIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcclxuXHRcdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKHBhcmVudEVsZW1lbnQsIHBhcmVudFRhZywgY2FjaGVkLCBpbmRleCwgZGF0YVtpXSwgY2FjaGVkW2NhY2hlQ291bnRdLCBzaG91bGRSZWF0dGFjaCwgaW5kZXggKyBzdWJBcnJheUNvdW50IHx8IHN1YkFycmF5Q291bnQsIGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpO1xyXG5cdFx0XHRcdGlmIChpdGVtID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdGlmICghaXRlbS5ub2Rlcy5pbnRhY3QpIGludGFjdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHQvL2ZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZSB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0XHRcdC8vdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0XHRcdC8vdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0XHRcdHN1YkFycmF5Q291bnQgKz0gKGl0ZW0ubWF0Y2goLzxbXlxcL118XFw+XFxzKltePF0vZykgfHwgWzBdKS5sZW5ndGhcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBzdWJBcnJheUNvdW50ICs9IHR5cGUuY2FsbChpdGVtKSA9PT0gQVJSQVkgPyBpdGVtLmxlbmd0aCA6IDE7XHJcblx0XHRcdFx0Y2FjaGVkW2NhY2hlQ291bnQrK10gPSBpdGVtXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFpbnRhY3QpIHtcclxuXHRcdFx0XHQvL2RpZmYgdGhlIGFycmF5IGl0c2VsZlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vdXBkYXRlIHRoZSBsaXN0IG9mIERPTSBub2RlcyBieSBjb2xsZWN0aW5nIHRoZSBub2RlcyBmcm9tIGVhY2ggaXRlbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAoY2FjaGVkW2ldICE9IG51bGwpIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIGNhY2hlZFtpXS5ub2RlcylcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9yZW1vdmUgaXRlbXMgZnJvbSB0aGUgZW5kIG9mIHRoZSBhcnJheSBpZiB0aGUgbmV3IGFycmF5IGlzIHNob3J0ZXIgdGhhbiB0aGUgb2xkIG9uZVxyXG5cdFx0XHRcdC8vaWYgZXJyb3JzIGV2ZXIgaGFwcGVuIGhlcmUsIHRoZSBpc3N1ZSBpcyBtb3N0IGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBzb21ld2hlcmUgZWFybGllciBpbiB0aGUgcHJvZ3JhbVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBub2RlOyBub2RlID0gY2FjaGVkLm5vZGVzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChub2RlLnBhcmVudE5vZGUgIT0gbnVsbCAmJiBub2Rlcy5pbmRleE9mKG5vZGUpIDwgMCkgY2xlYXIoW25vZGVdLCBbY2FjaGVkW2ldXSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRhdGEubGVuZ3RoIDwgY2FjaGVkLmxlbmd0aCkgY2FjaGVkLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKGRhdGEgIT0gbnVsbCAmJiBkYXRhVHlwZSA9PT0gT0JKRUNUKSB7XHJcblx0XHRcdHZhciB2aWV3cyA9IFtdLCBjb250cm9sbGVycyA9IFtdXHJcblx0XHRcdHdoaWxlIChkYXRhLnZpZXcpIHtcclxuXHRcdFx0XHR2YXIgdmlldyA9IGRhdGEudmlldy4kb3JpZ2luYWwgfHwgZGF0YS52aWV3XHJcblx0XHRcdFx0dmFyIGNvbnRyb2xsZXJJbmRleCA9IG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJkaWZmXCIgJiYgY2FjaGVkLnZpZXdzID8gY2FjaGVkLnZpZXdzLmluZGV4T2YodmlldykgOiAtMVxyXG5cdFx0XHRcdHZhciBjb250cm9sbGVyID0gY29udHJvbGxlckluZGV4ID4gLTEgPyBjYWNoZWQuY29udHJvbGxlcnNbY29udHJvbGxlckluZGV4XSA6IG5ldyAoZGF0YS5jb250cm9sbGVyIHx8IG5vb3ApXHJcblx0XHRcdFx0dmFyIGtleSA9IGRhdGEgJiYgZGF0YS5hdHRycyAmJiBkYXRhLmF0dHJzLmtleVxyXG5cdFx0XHRcdGRhdGEgPSBwZW5kaW5nUmVxdWVzdHMgPT0gMCB8fCAoY2FjaGVkICYmIGNhY2hlZC5jb250cm9sbGVycyAmJiBjYWNoZWQuY29udHJvbGxlcnMuaW5kZXhPZihjb250cm9sbGVyKSA+IC0xKSA/IGRhdGEudmlldyhjb250cm9sbGVyKSA6IHt0YWc6IFwicGxhY2Vob2xkZXJcIn1cclxuXHRcdFx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gY2FjaGVkO1xyXG5cdFx0XHRcdGlmIChrZXkpIHtcclxuXHRcdFx0XHRcdGlmICghZGF0YS5hdHRycykgZGF0YS5hdHRycyA9IHt9XHJcblx0XHRcdFx0XHRkYXRhLmF0dHJzLmtleSA9IGtleVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoY29udHJvbGxlci5vbnVubG9hZCkgdW5sb2FkZXJzLnB1c2goe2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWR9KVxyXG5cdFx0XHRcdHZpZXdzLnB1c2godmlldylcclxuXHRcdFx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFkYXRhLnRhZyAmJiBjb250cm9sbGVycy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdFx0aWYgKCFkYXRhLmF0dHJzKSBkYXRhLmF0dHJzID0ge307XHJcblx0XHRcdGlmICghY2FjaGVkLmF0dHJzKSBjYWNoZWQuYXR0cnMgPSB7fTtcclxuXHJcblx0XHRcdHZhciBkYXRhQXR0cktleXMgPSBPYmplY3Qua2V5cyhkYXRhLmF0dHJzKVxyXG5cdFx0XHR2YXIgaGFzS2V5cyA9IGRhdGFBdHRyS2V5cy5sZW5ndGggPiAoXCJrZXlcIiBpbiBkYXRhLmF0dHJzID8gMSA6IDApXHJcblx0XHRcdC8vaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdFx0aWYgKGRhdGEudGFnICE9IGNhY2hlZC50YWcgfHwgZGF0YUF0dHJLZXlzLnNvcnQoKS5qb2luKCkgIT0gT2JqZWN0LmtleXMoY2FjaGVkLmF0dHJzKS5zb3J0KCkuam9pbigpIHx8IGRhdGEuYXR0cnMuaWQgIT0gY2FjaGVkLmF0dHJzLmlkIHx8IGRhdGEuYXR0cnMua2V5ICE9IGNhY2hlZC5hdHRycy5rZXkgfHwgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT0gXCJhbGxcIiAmJiAoIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZSkpIHx8IChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwiZGlmZlwiICYmIGNhY2hlZC5jb25maWdDb250ZXh0ICYmIGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiA9PT0gZmFsc2UpKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2Rlcyk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKClcclxuXHRcdFx0XHRpZiAoY2FjaGVkLmNvbnRyb2xsZXJzKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNhY2hlZC5jb250cm9sbGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhLnRhZykgIT0gU1RSSU5HKSByZXR1cm47XHJcblxyXG5cdFx0XHR2YXIgbm9kZSwgaXNOZXcgPSBjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwO1xyXG5cdFx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgbmFtZXNwYWNlID0gZGF0YS5hdHRycy54bWxucztcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwic3ZnXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YS50YWcgPT09IFwibWF0aFwiKSBuYW1lc3BhY2UgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRcdGlmIChkYXRhLmF0dHJzLmlzKSBub2RlID0gbmFtZXNwYWNlID09PSB1bmRlZmluZWQgPyAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkYXRhLnRhZywgZGF0YS5hdHRycy5pcykgOiAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnKTtcclxuXHRcdFx0XHRjYWNoZWQgPSB7XHJcblx0XHRcdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRcdFx0Ly9zZXQgYXR0cmlidXRlcyBmaXJzdCwgdGhlbiBjcmVhdGUgY2hpbGRyZW5cclxuXHRcdFx0XHRcdGF0dHJzOiBoYXNLZXlzID8gc2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywge30sIG5hbWVzcGFjZSkgOiBkYXRhLmF0dHJzLFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDAgP1xyXG5cdFx0XHRcdFx0XHRidWlsZChub2RlLCBkYXRhLnRhZywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGRhdGEuY2hpbGRyZW4sIGNhY2hlZC5jaGlsZHJlbiwgdHJ1ZSwgMCwgZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncykgOlxyXG5cdFx0XHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y2FjaGVkLnZpZXdzID0gdmlld3NcclxuXHRcdFx0XHRcdGNhY2hlZC5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzXHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY29udHJvbGxlcjsgY29udHJvbGxlciA9IGNvbnRyb2xsZXJzW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgJiYgY29udHJvbGxlci5vbnVubG9hZC4kb2xkKSBjb250cm9sbGVyLm9udW5sb2FkID0gY29udHJvbGxlci5vbnVubG9hZC4kb2xkXHJcblx0XHRcdFx0XHRcdGlmIChwZW5kaW5nUmVxdWVzdHMgJiYgY29udHJvbGxlci5vbnVubG9hZCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCA9IG9udW5sb2FkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jaGlsZHJlbiAmJiAhY2FjaGVkLmNoaWxkcmVuLm5vZGVzKSBjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXTtcclxuXHRcdFx0XHQvL2VkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuIGV4aXN0LCBzbyBzZXQgaXQgYWdhaW4gYWZ0ZXIgY2hpbGRyZW4gaGF2ZSBiZWVuIGNyZWF0ZWRcclxuXHRcdFx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIHt2YWx1ZTogZGF0YS5hdHRycy52YWx1ZX0sIHt9LCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0XHRcdGlmIChoYXNLZXlzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCBjYWNoZWQuYXR0cnMsIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIGZhbHNlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRcdFx0Y2FjaGVkLmNvbnRyb2xsZXJzID0gY29udHJvbGxlcnNcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHNob3VsZFJlYXR0YWNoID09PSB0cnVlICYmIG5vZGUgIT0gbnVsbCkgcGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSwgcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vc2NoZWR1bGUgY29uZmlncyB0byBiZSBjYWxsZWQuIFRoZXkgYXJlIGNhbGxlZCBhZnRlciBgYnVpbGRgIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdFx0aWYgKHR5cGVvZiBkYXRhLmF0dHJzW1wiY29uZmlnXCJdID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fTtcclxuXHJcblx0XHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEsIGFyZ3MpIHtcclxuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGEuYXR0cnNbXCJjb25maWdcIl0uYXBwbHkoZGF0YSwgYXJncylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNvbmZpZ3MucHVzaChjYWxsYmFjayhkYXRhLCBbbm9kZSwgIWlzTmV3LCBjb250ZXh0LCBjYWNoZWRdKSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGEgIT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Ly9oYW5kbGUgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbm9kZXM7XHJcblx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFwic3RyaW5nIG51bWJlciBib29sZWFuXCIuaW5kZXhPZih0eXBlb2YgZGF0YSkgPiAtMSA/IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpIDogZGF0YTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC52YWx1ZU9mKCkgIT09IGRhdGEudmFsdWVPZigpIHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRcdFx0aWYgKCFlZGl0YWJsZSB8fCBlZGl0YWJsZSAhPT0gJGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSBwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZWRpdGFibGUpIGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7IC8vd2FzIGEgdHJ1c3RlZCBzdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZXNbMF0ubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikge3JldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4fVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly9gY29uZmlnYCBpc24ndCBhIHJlYWwgYXR0cmlidXRlcywgc28gaWdub3JlIGl0XHJcblx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT0gXCJrZXlcIikgY29udGludWU7XHJcblx0XHRcdFx0XHQvL2hvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGFBdHRyID09PSBGVU5DVElPTiAmJiBhdHRyTmFtZS5pbmRleE9mKFwib25cIikgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBhdXRvcmVkcmF3KGRhdGFBdHRyLCBub2RlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJiB0eXBlLmNhbGwoZGF0YUF0dHIpID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gY2FjaGVkQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKHJ1bGUgaW4gZGF0YUF0dHIpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBTVkdcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJocmVmXCIpIG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIFwiaHJlZlwiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0XHQvLy0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET00gZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdFx0XHQvLy0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpcyB1c2VkIGFzIGEgc3RyaW5nLCBidXQgaXQncyBhbiBvYmplY3QgaW4ganNcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgIShhdHRyTmFtZSA9PT0gXCJsaXN0XCIgfHwgYXR0ck5hbWUgPT09IFwic3R5bGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJmb3JtXCIgfHwgYXR0ck5hbWUgPT09IFwidHlwZVwiIHx8IGF0dHJOYW1lID09PSBcIndpZHRoXCIgfHwgYXR0ck5hbWUgPT09IFwiaGVpZ2h0XCIpKSB7XHJcblx0XHRcdFx0XHRcdC8vIzM0OCBkb24ndCBzZXQgdGhlIHZhbHVlIGlmIG5vdCBuZWVkZWQgb3RoZXJ3aXNlIGN1cnNvciBwbGFjZW1lbnQgYnJlYWtzIGluIENocm9tZVxyXG5cdFx0XHRcdFx0XHRpZiAodGFnICE9PSBcImlucHV0XCIgfHwgbm9kZVthdHRyTmFtZV0gIT09IGRhdGFBdHRyKSBub2RlW2F0dHJOYW1lXSA9IGRhdGFBdHRyXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8vc3dhbGxvdyBJRSdzIGludmFsaWQgYXJndW1lbnQgZXJyb3JzIHRvIG1pbWljIEhUTUwncyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdFx0aWYgKGUubWVzc2FnZS5pbmRleE9mKFwiSW52YWxpZCBhcmd1bWVudFwiKSA8IDApIHRocm93IGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8jMzQ4IGRhdGFBdHRyIG1heSBub3QgYmUgYSBzdHJpbmcsIHNvIHVzZSBsb29zZSBjb21wYXJpc29uIChkb3VibGUgZXF1YWwpIGluc3RlYWQgb2Ygc3RyaWN0ICh0cmlwbGUgZXF1YWwpXHJcblx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInZhbHVlXCIgJiYgdGFnID09PSBcImlucHV0XCIgJiYgbm9kZS52YWx1ZSAhPSBkYXRhQXR0cikge1xyXG5cdFx0XHRcdG5vZGUudmFsdWUgPSBkYXRhQXR0clxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gY2xlYXIobm9kZXMsIGNhY2hlZCkge1xyXG5cdFx0Zm9yICh2YXIgaSA9IG5vZGVzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XHJcblx0XHRcdGlmIChub2Rlc1tpXSAmJiBub2Rlc1tpXS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdFx0dHJ5IHtub2Rlc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGVzW2ldKX1cclxuXHRcdFx0XHRjYXRjaCAoZSkge30gLy9pZ25vcmUgaWYgdGhpcyBmYWlscyBkdWUgdG8gb3JkZXIgb2YgZXZlbnRzIChzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpO1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0pIHVubG9hZChjYWNoZWRbaV0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChub2Rlcy5sZW5ndGggIT0gMCkgbm9kZXMubGVuZ3RoID0gMFxyXG5cdH1cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgdHlwZW9mIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpO1xyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNvbnRyb2xsZXI7IGNvbnRyb2xsZXIgPSBjYWNoZWQuY29udHJvbGxlcnNbaV07IGkrKykge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY29udHJvbGxlci5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4pIHtcclxuXHRcdFx0aWYgKHR5cGUuY2FsbChjYWNoZWQuY2hpbGRyZW4pID09PSBBUlJBWSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGlsZDsgY2hpbGQgPSBjYWNoZWQuY2hpbGRyZW5baV07IGkrKykgdW5sb2FkKGNoaWxkKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHVubG9hZChjYWNoZWQuY2hpbGRyZW4pXHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpIHtcclxuXHRcdHZhciBuZXh0U2libGluZyA9IHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF07XHJcblx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0dmFyIGlzRWxlbWVudCA9IG5leHRTaWJsaW5nLm5vZGVUeXBlICE9IDE7XHJcblx0XHRcdHZhciBwbGFjZWhvbGRlciA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHRcdFx0aWYgKGlzRWxlbWVudCkge1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBuZXh0U2libGluZyB8fCBudWxsKTtcclxuXHRcdFx0XHRwbGFjZWhvbGRlci5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKTtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHBsYWNlaG9sZGVyKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgbmV4dFNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSlcclxuXHRcdH1cclxuXHRcdGVsc2UgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmVlbmRcIiwgZGF0YSk7XHJcblx0XHR2YXIgbm9kZXMgPSBbXTtcclxuXHRcdHdoaWxlIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdICE9PSBuZXh0U2libGluZykge1xyXG5cdFx0XHRub2Rlcy5wdXNoKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0pO1xyXG5cdFx0XHRpbmRleCsrXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbm9kZXNcclxuXHR9XHJcblx0ZnVuY3Rpb24gYXV0b3JlZHJhdyhjYWxsYmFjaywgb2JqZWN0KSB7XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlID0gZSB8fCBldmVudDtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0dHJ5IHtyZXR1cm4gY2FsbGJhY2suY2FsbChvYmplY3QsIGUpfVxyXG5cdFx0XHRmaW5hbGx5IHtcclxuXHRcdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGh0bWw7XHJcblx0dmFyIGRvY3VtZW50Tm9kZSA9IHtcclxuXHRcdGFwcGVuZENoaWxkOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIik7XHJcblx0XHRcdGlmICgkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSAkZG9jdW1lbnQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRcdHRoaXMuY2hpbGROb2RlcyA9ICRkb2N1bWVudC5jaGlsZE5vZGVzXHJcblx0XHR9LFxyXG5cdFx0aW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRcdHRoaXMuYXBwZW5kQ2hpbGQobm9kZSlcclxuXHRcdH0sXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH07XHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdLCBjZWxsQ2FjaGUgPSB7fTtcclxuXHRtLnJlbmRlciA9IGZ1bmN0aW9uKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXTtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBET00gZWxlbWVudCBiZWluZyBwYXNzZWQgdG8gbS5yb3V0ZS9tLm1vdW50L20ucmVuZGVyIGlzIG5vdCB1bmRlZmluZWQuXCIpO1xyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0dmFyIGlzRG9jdW1lbnRSb290ID0gcm9vdCA9PT0gJGRvY3VtZW50O1xyXG5cdFx0dmFyIG5vZGUgPSBpc0RvY3VtZW50Um9vdCB8fCByb290ID09PSAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gZG9jdW1lbnROb2RlIDogcm9vdDtcclxuXHRcdGlmIChpc0RvY3VtZW50Um9vdCAmJiBjZWxsLnRhZyAhPSBcImh0bWxcIikgY2VsbCA9IHt0YWc6IFwiaHRtbFwiLCBhdHRyczoge30sIGNoaWxkcmVuOiBjZWxsfTtcclxuXHRcdGlmIChjZWxsQ2FjaGVbaWRdID09PSB1bmRlZmluZWQpIGNsZWFyKG5vZGUuY2hpbGROb2Rlcyk7XHJcblx0XHRpZiAoZm9yY2VSZWNyZWF0aW9uID09PSB0cnVlKSByZXNldChyb290KTtcclxuXHRcdGNlbGxDYWNoZVtpZF0gPSBidWlsZChub2RlLCBudWxsLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY2VsbCwgY2VsbENhY2hlW2lkXSwgZmFsc2UsIDAsIG51bGwsIHVuZGVmaW5lZCwgY29uZmlncyk7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gY29uZmlncy5sZW5ndGg7IGkgPCBsZW47IGkrKykgY29uZmlnc1tpXSgpXHJcblx0fTtcclxuXHRmdW5jdGlvbiBnZXRDZWxsQ2FjaGVLZXkoZWxlbWVudCkge1xyXG5cdFx0dmFyIGluZGV4ID0gbm9kZUNhY2hlLmluZGV4T2YoZWxlbWVudCk7XHJcblx0XHRyZXR1cm4gaW5kZXggPCAwID8gbm9kZUNhY2hlLnB1c2goZWxlbWVudCkgLSAxIDogaW5kZXhcclxuXHR9XHJcblxyXG5cdG0udHJ1c3QgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlLiR0cnVzdGVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB2YWx1ZVxyXG5cdH07XHJcblxyXG5cdGZ1bmN0aW9uIGdldHRlcnNldHRlcihzdG9yZSkge1xyXG5cdFx0dmFyIHByb3AgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHN0b3JlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cHJvcC50b0pTT04gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0cmV0dXJuIHN0b3JlXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cclxuXHRtLnByb3AgPSBmdW5jdGlvbiAoc3RvcmUpIHtcclxuXHRcdC8vbm90ZTogdXNpbmcgbm9uLXN0cmljdCBlcXVhbGl0eSBjaGVjayBoZXJlIGJlY2F1c2Ugd2UncmUgY2hlY2tpbmcgaWYgc3RvcmUgaXMgbnVsbCBPUiB1bmRlZmluZWRcclxuXHRcdGlmICgoKHN0b3JlICE9IG51bGwgJiYgdHlwZS5jYWxsKHN0b3JlKSA9PT0gT0JKRUNUKSB8fCB0eXBlb2Ygc3RvcmUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2Ygc3RvcmUudGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkoc3RvcmUpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGdldHRlcnNldHRlcihzdG9yZSlcclxuXHR9O1xyXG5cclxuXHR2YXIgcm9vdHMgPSBbXSwgY29tcG9uZW50cyA9IFtdLCBjb250cm9sbGVycyA9IFtdLCBsYXN0UmVkcmF3SWQgPSBudWxsLCBsYXN0UmVkcmF3Q2FsbFRpbWUgPSAwLCBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGwsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHByZXZlbnRlZCA9IGZhbHNlLCB0b3BDb21wb25lbnQsIHVubG9hZGVycyA9IFtdO1xyXG5cdHZhciBGUkFNRV9CVURHRVQgPSAxNjsgLy82MCBmcmFtZXMgcGVyIHNlY29uZCA9IDEgY2FsbCBwZXIgMTYgbXNcclxuXHRmdW5jdGlvbiBwYXJhbWV0ZXJpemUoY29tcG9uZW50LCBhcmdzKSB7XHJcblx0XHR2YXIgY29udHJvbGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IHRoaXNcclxuXHRcdH1cclxuXHRcdHZhciB2aWV3ID0gZnVuY3Rpb24oY3RybCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIGFyZ3MgPSBhcmdzLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpXHJcblx0XHRcdHJldHVybiBjb21wb25lbnQudmlldy5hcHBseShjb21wb25lbnQsIGFyZ3MgPyBbY3RybF0uY29uY2F0KGFyZ3MpIDogW2N0cmxdKVxyXG5cdFx0fVxyXG5cdFx0dmlldy4kb3JpZ2luYWwgPSBjb21wb25lbnQudmlld1xyXG5cdFx0dmFyIG91dHB1dCA9IHtjb250cm9sbGVyOiBjb250cm9sbGVyLCB2aWV3OiB2aWV3fVxyXG5cdFx0aWYgKGFyZ3NbMF0gJiYgYXJnc1swXS5rZXkgIT0gbnVsbCkgb3V0cHV0LmF0dHJzID0ge2tleTogYXJnc1swXS5rZXl9XHJcblx0XHRyZXR1cm4gb3V0cHV0XHJcblx0fVxyXG5cdG0uY29tcG9uZW50ID0gZnVuY3Rpb24oY29tcG9uZW50KSB7XHJcblx0XHRyZXR1cm4gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKVxyXG5cdH1cclxuXHRtLm1vdW50ID0gbS5tb2R1bGUgPSBmdW5jdGlvbihyb290LCBjb21wb25lbnQpIHtcclxuXHRcdGlmICghcm9vdCkgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgZXhpc3RzIGJlZm9yZSByZW5kZXJpbmcgYSB0ZW1wbGF0ZSBpbnRvIGl0LlwiKTtcclxuXHRcdHZhciBpbmRleCA9IHJvb3RzLmluZGV4T2Yocm9vdCk7XHJcblx0XHRpZiAoaW5kZXggPCAwKSBpbmRleCA9IHJvb3RzLmxlbmd0aDtcclxuXHRcdFxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2U7XHJcblx0XHR2YXIgZXZlbnQgPSB7cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1ByZXZlbnRlZCA9IHRydWU7XHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbDtcclxuXHRcdH19O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHVubG9hZGVyOyB1bmxvYWRlciA9IHVubG9hZGVyc1tpXTsgaSsrKSB7XHJcblx0XHRcdHVubG9hZGVyLmhhbmRsZXIuY2FsbCh1bmxvYWRlci5jb250cm9sbGVyLCBldmVudClcclxuXHRcdFx0dW5sb2FkZXIuY29udHJvbGxlci5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChpc1ByZXZlbnRlZCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgdW5sb2FkZXI7IHVubG9hZGVyID0gdW5sb2FkZXJzW2ldOyBpKyspIHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyXHJcblx0XHR9XHJcblx0XHRlbHNlIHVubG9hZGVycyA9IFtdXHJcblx0XHRcclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgdHlwZW9mIGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdLm9udW5sb2FkKGV2ZW50KVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoIWlzUHJldmVudGVkKSB7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiYWxsXCIpO1xyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cm9vdHNbaW5kZXhdID0gcm9vdDtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSBjb21wb25lbnQgPSBzdWJjb21wb25lbnQoY29tcG9uZW50LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpXHJcblx0XHRcdHZhciBjdXJyZW50Q29tcG9uZW50ID0gdG9wQ29tcG9uZW50ID0gY29tcG9uZW50ID0gY29tcG9uZW50IHx8IHtjb250cm9sbGVyOiBmdW5jdGlvbigpIHt9fTtcclxuXHRcdFx0dmFyIGNvbnN0cnVjdG9yID0gY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcFxyXG5cdFx0XHR2YXIgY29udHJvbGxlciA9IG5ldyBjb25zdHJ1Y3RvcjtcclxuXHRcdFx0Ly9jb250cm9sbGVycyBtYXkgY2FsbCBtLm1vdW50IHJlY3Vyc2l2ZWx5ICh2aWEgbS5yb3V0ZSByZWRpcmVjdHMsIGZvciBleGFtcGxlKVxyXG5cdFx0XHQvL3RoaXMgY29uZGl0aW9uYWwgZW5zdXJlcyBvbmx5IHRoZSBsYXN0IHJlY3Vyc2l2ZSBtLm1vdW50IGNhbGwgaXMgYXBwbGllZFxyXG5cdFx0XHRpZiAoY3VycmVudENvbXBvbmVudCA9PT0gdG9wQ29tcG9uZW50KSB7XHJcblx0XHRcdFx0Y29udHJvbGxlcnNbaW5kZXhdID0gY29udHJvbGxlcjtcclxuXHRcdFx0XHRjb21wb25lbnRzW2luZGV4XSA9IGNvbXBvbmVudFxyXG5cdFx0XHR9XHJcblx0XHRcdGVuZEZpcnN0Q29tcHV0YXRpb24oKTtcclxuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXJzW2luZGV4XVxyXG5cdFx0fVxyXG5cdH07XHJcblx0dmFyIHJlZHJhd2luZyA9IGZhbHNlXHJcblx0bS5yZWRyYXcgPSBmdW5jdGlvbihmb3JjZSkge1xyXG5cdFx0aWYgKHJlZHJhd2luZykgcmV0dXJuXHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlXHJcblx0XHQvL2xhc3RSZWRyYXdJZCBpcyBhIHBvc2l0aXZlIG51bWJlciBpZiBhIHNlY29uZCByZWRyYXcgaXMgcmVxdWVzdGVkIGJlZm9yZSB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWVcclxuXHRcdC8vbGFzdFJlZHJhd0lEIGlzIG51bGwgaWYgaXQncyB0aGUgZmlyc3QgcmVkcmF3IGFuZCBub3QgYW4gZXZlbnQgaGFuZGxlclxyXG5cdFx0aWYgKGxhc3RSZWRyYXdJZCAmJiBmb3JjZSAhPT0gdHJ1ZSkge1xyXG5cdFx0XHQvL3doZW4gc2V0VGltZW91dDogb25seSByZXNjaGVkdWxlIHJlZHJhdyBpZiB0aW1lIGJldHdlZW4gbm93IGFuZCBwcmV2aW91cyByZWRyYXcgaXMgYmlnZ2VyIHRoYW4gYSBmcmFtZSwgb3RoZXJ3aXNlIGtlZXAgY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdC8vd2hlbiByQUY6IGFsd2F5cyByZXNjaGVkdWxlIHJlZHJhd1xyXG5cdFx0XHRpZiAoJHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBuZXcgRGF0ZSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCkge1xyXG5cdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKTtcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlZHJhdywgRlJBTUVfQlVER0VUKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmVkcmF3KCk7XHJcblx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7bGFzdFJlZHJhd0lkID0gbnVsbH0sIEZSQU1FX0JVREdFVClcclxuXHRcdH1cclxuXHRcdHJlZHJhd2luZyA9IGZhbHNlXHJcblx0fTtcclxuXHRtLnJlZHJhdy5zdHJhdGVneSA9IG0ucHJvcCgpO1xyXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcclxuXHRcdGlmIChjb21wdXRlUHJlUmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vaygpXHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHJvb3Q7IHJvb3QgPSByb290c1tpXTsgaSsrKSB7XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdHZhciBhcmdzID0gY29tcG9uZW50c1tpXS5jb250cm9sbGVyICYmIGNvbXBvbmVudHNbaV0uY29udHJvbGxlci4kJGFyZ3MgPyBbY29udHJvbGxlcnNbaV1dLmNvbmNhdChjb21wb25lbnRzW2ldLmNvbnRyb2xsZXIuJCRhcmdzKSA6IFtjb250cm9sbGVyc1tpXV1cclxuXHRcdFx0XHRtLnJlbmRlcihyb290LCBjb21wb25lbnRzW2ldLnZpZXcgPyBjb21wb25lbnRzW2ldLnZpZXcoY29udHJvbGxlcnNbaV0sIGFyZ3MpIDogXCJcIilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9hZnRlciByZW5kZXJpbmcgd2l0aGluIGEgcm91dGVkIGNvbnRleHQsIHdlIG5lZWQgdG8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKCk7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGxhc3RSZWRyYXdJZCA9IG51bGw7XHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZTtcclxuXHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7cGVuZGluZ1JlcXVlc3RzKyt9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdHBlbmRpbmdSZXF1ZXN0cyA9IE1hdGgubWF4KHBlbmRpbmdSZXF1ZXN0cyAtIDEsIDApO1xyXG5cdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCkgbS5yZWRyYXcoKVxyXG5cdH07XHJcblx0dmFyIGVuZEZpcnN0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2socHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9O1xyXG5cdHZhciByZWRpcmVjdCA9IG5vb3AsIHJvdXRlUGFyYW1zLCBjdXJyZW50Um91dGUsIGlzRGVmYXVsdFJvdXRlID0gZmFsc2U7XHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZS5jYWxsKGFyZ3VtZW50c1sxXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgcm9vdCA9IGFyZ3VtZW50c1swXSwgZGVmYXVsdFJvdXRlID0gYXJndW1lbnRzWzFdLCByb3V0ZXIgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHRSb3V0ZSkgdGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgb25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IHRydWVcclxuXHRcdFx0XHRcdG0ucm91dGUoZGVmYXVsdFJvdXRlLCB0cnVlKVxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSBmYWxzZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGxpc3RlbmVyID0gbS5yb3V0ZS5tb2RlID09PSBcImhhc2hcIiA/IFwib25oYXNoY2hhbmdlXCIgOiBcIm9ucG9wc3RhdGVcIjtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT0gbm9ybWFsaXplUm91dGUocGF0aCkpIHtcclxuXHRcdFx0XHRcdHJlZGlyZWN0KHBhdGgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IHNldFNjcm9sbDtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSgpXHJcblx0XHR9XHJcblx0XHQvL2NvbmZpZzogbS5yb3V0ZVxyXG5cdFx0ZWxzZSBpZiAoYXJndW1lbnRzWzBdLmFkZEV2ZW50TGlzdGVuZXIgfHwgYXJndW1lbnRzWzBdLmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgaXNJbml0aWFsaXplZCA9IGFyZ3VtZW50c1sxXTtcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHZhciB2ZG9tID0gYXJndW1lbnRzWzNdO1xyXG5cdFx0XHRlbGVtZW50LmhyZWYgPSAobS5yb3V0ZS5tb2RlICE9PSAncGF0aG5hbWUnID8gJGxvY2F0aW9uLnBhdGhuYW1lIDogJycpICsgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIHZkb20uYXR0cnMuaHJlZjtcclxuXHRcdFx0aWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpO1xyXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZWxlbWVudC5kZXRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSk7XHJcblx0XHRcdFx0ZWxlbWVudC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9tLnJvdXRlKHJvdXRlLCBwYXJhbXMsIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkpXHJcblx0XHRlbHNlIGlmICh0eXBlLmNhbGwoYXJndW1lbnRzWzBdKSA9PT0gU1RSSU5HKSB7XHJcblx0XHRcdHZhciBvbGRSb3V0ZSA9IGN1cnJlbnRSb3V0ZTtcclxuXHRcdFx0Y3VycmVudFJvdXRlID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50c1sxXSB8fCB7fVxyXG5cdFx0XHR2YXIgcXVlcnlJbmRleCA9IGN1cnJlbnRSb3V0ZS5pbmRleE9mKFwiP1wiKVxyXG5cdFx0XHR2YXIgcGFyYW1zID0gcXVlcnlJbmRleCA+IC0xID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKSA6IHt9XHJcblx0XHRcdGZvciAodmFyIGkgaW4gYXJncykgcGFyYW1zW2ldID0gYXJnc1tpXVxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcylcclxuXHRcdFx0dmFyIGN1cnJlbnRQYXRoID0gcXVlcnlJbmRleCA+IC0xID8gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpIDogY3VycmVudFJvdXRlXHJcblx0XHRcdGlmIChxdWVyeXN0cmluZykgY3VycmVudFJvdXRlID0gY3VycmVudFBhdGggKyAoY3VycmVudFBhdGguaW5kZXhPZihcIj9cIikgPT09IC0xID8gXCI/XCIgOiBcIiZcIikgKyBxdWVyeXN0cmluZztcclxuXHJcblx0XHRcdHZhciBzaG91bGRSZXBsYWNlSGlzdG9yeUVudHJ5ID0gKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyBhcmd1bWVudHNbMl0gOiBhcmd1bWVudHNbMV0pID09PSB0cnVlIHx8IG9sZFJvdXRlID09PSBhcmd1bWVudHNbMF07XHJcblxyXG5cdFx0XHRpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XHJcblx0XHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5W3Nob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkgPyBcInJlcGxhY2VTdGF0ZVwiIDogXCJwdXNoU3RhdGVcIl0obnVsbCwgJGRvY3VtZW50LnRpdGxlLCBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGVcclxuXHRcdFx0XHRyZWRpcmVjdChtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRtLnJvdXRlLnBhcmFtID0gZnVuY3Rpb24oa2V5KSB7XHJcblx0XHRpZiAoIXJvdXRlUGFyYW1zKSB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBjYWxsIG0ucm91dGUoZWxlbWVudCwgZGVmYXVsdFJvdXRlLCByb3V0ZXMpIGJlZm9yZSBjYWxsaW5nIG0ucm91dGUucGFyYW0oKVwiKVxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV1cclxuXHR9O1xyXG5cdG0ucm91dGUubW9kZSA9IFwic2VhcmNoXCI7XHJcblx0ZnVuY3Rpb24gbm9ybWFsaXplUm91dGUocm91dGUpIHtcclxuXHRcdHJldHVybiByb3V0ZS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aClcclxuXHR9XHJcblx0ZnVuY3Rpb24gcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkge1xyXG5cdFx0cm91dGVQYXJhbXMgPSB7fTtcclxuXHJcblx0XHR2YXIgcXVlcnlTdGFydCA9IHBhdGguaW5kZXhPZihcIj9cIik7XHJcblx0XHRpZiAocXVlcnlTdGFydCAhPT0gLTEpIHtcclxuXHRcdFx0cm91dGVQYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKHBhdGguc3Vic3RyKHF1ZXJ5U3RhcnQgKyAxLCBwYXRoLmxlbmd0aCkpO1xyXG5cdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIoMCwgcXVlcnlTdGFydClcclxuXHRcdH1cclxuXHJcblx0XHQvLyBHZXQgYWxsIHJvdXRlcyBhbmQgY2hlY2sgaWYgdGhlcmUnc1xyXG5cdFx0Ly8gYW4gZXhhY3QgbWF0Y2ggZm9yIHRoZSBjdXJyZW50IHBhdGhcclxuXHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMocm91dGVyKTtcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKTtcclxuXHRcdGlmKGluZGV4ICE9PSAtMSl7XHJcblx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW2tleXMgW2luZGV4XV0pO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXIpIHtcclxuXHRcdFx0aWYgKHJvdXRlID09PSBwYXRoKSB7XHJcblx0XHRcdFx0bS5tb3VudChyb290LCByb3V0ZXJbcm91dGVdKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC86W15cXC9dKz9cXC57M30vZywgXCIoLio/KVwiKS5yZXBsYWNlKC86W15cXC9dKy9nLCBcIihbXlxcXFwvXSspXCIpICsgXCJcXC8/JFwiKTtcclxuXHJcblx0XHRcdGlmIChtYXRjaGVyLnRlc3QocGF0aCkpIHtcclxuXHRcdFx0XHRwYXRoLnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIga2V5cyA9IHJvdXRlLm1hdGNoKC86W15cXC9dKy9nKSB8fCBbXTtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSwgLTIpO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHJvdXRlUGFyYW1zW2tleXNbaV0ucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tpXSlcclxuXHRcdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm47XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcblx0XHR2YXIgYXJncyA9IG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiICYmIGN1cnJlbnRUYXJnZXQuc2VhcmNoID8gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50VGFyZ2V0LnNlYXJjaC5zbGljZSgxKSkgOiB7fTtcclxuXHRcdHdoaWxlIChjdXJyZW50VGFyZ2V0ICYmIGN1cnJlbnRUYXJnZXQubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPSBcIkFcIikgY3VycmVudFRhcmdldCA9IGN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZVxyXG5cdFx0bS5yb3V0ZShjdXJyZW50VGFyZ2V0W20ucm91dGUubW9kZV0uc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBzZXRTY3JvbGwoKSB7XHJcblx0XHRpZiAobS5yb3V0ZS5tb2RlICE9IFwiaGFzaFwiICYmICRsb2NhdGlvbi5oYXNoKSAkbG9jYXRpb24uaGFzaCA9ICRsb2NhdGlvbi5oYXNoO1xyXG5cdFx0ZWxzZSB3aW5kb3cuc2Nyb2xsVG8oMCwgMClcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhvYmplY3QsIHByZWZpeCkge1xyXG5cdFx0dmFyIGR1cGxpY2F0ZXMgPSB7fVxyXG5cdFx0dmFyIHN0ciA9IFtdXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xyXG5cdFx0XHR2YXIga2V5ID0gcHJlZml4ID8gcHJlZml4ICsgXCJbXCIgKyBwcm9wICsgXCJdXCIgOiBwcm9wXHJcblx0XHRcdHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wXVxyXG5cdFx0XHR2YXIgdmFsdWVUeXBlID0gdHlwZS5jYWxsKHZhbHVlKVxyXG5cdFx0XHR2YXIgcGFpciA9ICh2YWx1ZSA9PT0gbnVsbCkgPyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBPQkpFQ1QgPyBidWlsZFF1ZXJ5U3RyaW5nKHZhbHVlLCBrZXkpIDpcclxuXHRcdFx0XHR2YWx1ZVR5cGUgPT09IEFSUkFZID8gdmFsdWUucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIGl0ZW0pIHtcclxuXHRcdFx0XHRcdGlmICghZHVwbGljYXRlc1trZXldKSBkdXBsaWNhdGVzW2tleV0gPSB7fVxyXG5cdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV1baXRlbV0pIHtcclxuXHRcdFx0XHRcdFx0ZHVwbGljYXRlc1trZXldW2l0ZW1dID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gbWVtby5jb25jYXQoZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChpdGVtKSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBtZW1vXHJcblx0XHRcdFx0fSwgW10pLmpvaW4oXCImXCIpIDpcclxuXHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQoa2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKVxyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkgc3RyLnB1c2gocGFpcilcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHIuam9pbihcIiZcIilcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnN1YnN0cmluZygxKTtcclxuXHRcdFxyXG5cdFx0dmFyIHBhaXJzID0gc3RyLnNwbGl0KFwiJlwiKSwgcGFyYW1zID0ge307XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0dmFyIHBhaXIgPSBwYWlyc1tpXS5zcGxpdChcIj1cIik7XHJcblx0XHRcdHZhciBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXSlcclxuXHRcdFx0dmFyIHZhbHVlID0gcGFpci5sZW5ndGggPT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKSA6IG51bGxcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAodHlwZS5jYWxsKHBhcmFtc1trZXldKSAhPT0gQVJSQVkpIHBhcmFtc1trZXldID0gW3BhcmFtc1trZXldXVxyXG5cdFx0XHRcdHBhcmFtc1trZXldLnB1c2godmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBwYXJhbXNba2V5XSA9IHZhbHVlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cdG0ucm91dGUuYnVpbGRRdWVyeVN0cmluZyA9IGJ1aWxkUXVlcnlTdHJpbmdcclxuXHRtLnJvdXRlLnBhcnNlUXVlcnlTdHJpbmcgPSBwYXJzZVF1ZXJ5U3RyaW5nXHJcblx0XHJcblx0ZnVuY3Rpb24gcmVzZXQocm9vdCkge1xyXG5cdFx0dmFyIGNhY2hlS2V5ID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpO1xyXG5cdFx0Y2xlYXIocm9vdC5jaGlsZE5vZGVzLCBjZWxsQ2FjaGVbY2FjaGVLZXldKTtcclxuXHRcdGNlbGxDYWNoZVtjYWNoZUtleV0gPSB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkXHJcblx0fTtcclxuXHRmdW5jdGlvbiBwcm9waWZ5KHByb21pc2UsIGluaXRpYWxWYWx1ZSkge1xyXG5cdFx0dmFyIHByb3AgPSBtLnByb3AoaW5pdGlhbFZhbHVlKTtcclxuXHRcdHByb21pc2UudGhlbihwcm9wKTtcclxuXHRcdHByb3AudGhlbiA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSwgaW5pdGlhbFZhbHVlKVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cdC8vUHJvbWl6Lm1pdGhyaWwuanMgfCBab2xtZWlzdGVyIHwgTUlUXHJcblx0Ly9hIG1vZGlmaWVkIHZlcnNpb24gb2YgUHJvbWl6LmpzLCB3aGljaCBkb2VzIG5vdCBjb25mb3JtIHRvIFByb21pc2VzL0ErIGZvciB0d28gcmVhc29uczpcclxuXHQvLzEpIGB0aGVuYCBjYWxsYmFja3MgYXJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IChiZWNhdXNlIHNldFRpbWVvdXQgaXMgdG9vIHNsb3csIGFuZCB0aGUgc2V0SW1tZWRpYXRlIHBvbHlmaWxsIGlzIHRvbyBiaWdcclxuXHQvLzIpIHRocm93aW5nIHN1YmNsYXNzZXMgb2YgRXJyb3IgY2F1c2UgdGhlIGVycm9yIHRvIGJlIGJ1YmJsZWQgdXAgaW5zdGVhZCBvZiB0cmlnZ2VyaW5nIHJlamVjdGlvbiAoYmVjYXVzZSB0aGUgc3BlYyBkb2VzIG5vdCBhY2NvdW50IGZvciB0aGUgaW1wb3J0YW50IHVzZSBjYXNlIG9mIGRlZmF1bHQgYnJvd3NlciBlcnJvciBoYW5kbGluZywgaS5lLiBtZXNzYWdlIHcvIGxpbmUgbnVtYmVyKVxyXG5cdGZ1bmN0aW9uIERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHR2YXIgUkVTT0xWSU5HID0gMSwgUkVKRUNUSU5HID0gMiwgUkVTT0xWRUQgPSAzLCBSRUpFQ1RFRCA9IDQ7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsIHN0YXRlID0gMCwgcHJvbWlzZVZhbHVlID0gMCwgbmV4dCA9IFtdO1xyXG5cclxuXHRcdHNlbGZbXCJwcm9taXNlXCJdID0ge307XHJcblxyXG5cdFx0c2VsZltcInJlc29sdmVcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGZbXCJyZWplY3RcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJvbWlzZVtcInRoZW5cIl0gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spO1xyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRuZXh0LnB1c2goZGVmZXJyZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmluaXNoKHR5cGUpIHtcclxuXHRcdFx0c3RhdGUgPSB0eXBlIHx8IFJFSkVDVEVEO1xyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbihkZWZlcnJlZCkge1xyXG5cdFx0XHRcdHN0YXRlID09PSBSRVNPTFZFRCAmJiBkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSkgfHwgZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0aGVubmFibGUodGhlbiwgc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIG5vdFRoZW5uYWJsZUNhbGxiYWNrKSB7XHJcblx0XHRcdGlmICgoKHByb21pc2VWYWx1ZSAhPSBudWxsICYmIHR5cGUuY2FsbChwcm9taXNlVmFsdWUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBwcm9taXNlVmFsdWUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2YgdGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly8gY291bnQgcHJvdGVjdHMgYWdhaW5zdCBhYnVzZSBjYWxscyBmcm9tIHNwZWMgY2hlY2tlclxyXG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0XHRcdHRoZW4uY2FsbChwcm9taXNlVmFsdWUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzdWNjZXNzQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGVDYWxsYmFjaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlblxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0cmV0dXJuIGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiB0eXBlb2Ygc3VjY2Vzc0NhbGxiYWNrID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiB0eXBlb2YgZmFpbHVyZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZmFpbHVyZUNhbGxiYWNrKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkgdGhyb3cgZVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCI7XHJcblx0XHRcdFx0aWYgKC0tb3V0c3RhbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnByb21pc2UocmVzdWx0cyk7XHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGg7XHJcblx0XHR2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShvdXRzdGFuZGluZyk7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGFyZ3NbaV0udGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7cmV0dXJuIHZhbHVlfVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBjYWxsYmFja0tleSA9IFwibWl0aHJpbF9jYWxsYmFja19cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikpLnRvU3RyaW5nKDM2KTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe2Vycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJ9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybFxyXG5cdFx0XHRcdCsgKG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpXHJcblx0XHRcdFx0KyAob3B0aW9ucy5jYWxsYmFja0tleSA/IG9wdGlvbnMuY2FsbGJhY2tLZXkgOiBcImNhbGxiYWNrXCIpXHJcblx0XHRcdFx0KyBcIj1cIiArIGNhbGxiYWNrS2V5XHJcblx0XHRcdFx0KyBcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KTtcclxuXHRcdFx0JGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRcdGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSBvcHRpb25zLm9ubG9hZCh7dHlwZTogXCJsb2FkXCIsIHRhcmdldDogeGhyfSk7XHJcblx0XHRcdFx0XHRlbHNlIG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpZyA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgbWF5YmVYaHIgPSBvcHRpb25zLmNvbmZpZyh4aHIsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdGlmIChtYXliZVhociAhPSBudWxsKSB4aHIgPSBtYXliZVhoclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblx0XHRcdGlmIChkYXRhICYmICh0eXBlLmNhbGwoZGF0YSkgIT0gU1RSSU5HICYmIGRhdGEuY29uc3RydWN0b3IgIT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0cmV0dXJuIHhoclxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBiaW5kRGF0YSh4aHJPcHRpb25zLCBkYXRhLCBzZXJpYWxpemUpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiB4aHJPcHRpb25zLmRhdGFUeXBlICE9IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgcHJlZml4ID0geGhyT3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIjtcclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhkYXRhKTtcclxuXHRcdFx0eGhyT3B0aW9ucy51cmwgPSB4aHJPcHRpb25zLnVybCArIChxdWVyeXN0cmluZyA/IHByZWZpeCArIHF1ZXJ5c3RyaW5nIDogXCJcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplVXJsKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHRva2VucyA9IHVybC5tYXRjaCgvOlthLXpdXFx3Ky9naSk7XHJcblx0XHRpZiAodG9rZW5zICYmIGRhdGEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2Vuc1tpXSwgZGF0YVtrZXldKTtcclxuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1cmxcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHR2YXIgaXNKU09OUCA9IHhock9wdGlvbnMuZGF0YVR5cGUgJiYgeGhyT3B0aW9ucy5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpID09PSBcImpzb25wXCI7XHJcblx0XHR2YXIgc2VyaWFsaXplID0geGhyT3B0aW9ucy5zZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLnNlcmlhbGl6ZSB8fCBKU09OLnN0cmluZ2lmeTtcclxuXHRcdHZhciBkZXNlcmlhbGl6ZSA9IHhock9wdGlvbnMuZGVzZXJpYWxpemUgPSBpc0pTT05QID8gaWRlbnRpdHkgOiB4aHJPcHRpb25zLmRlc2VyaWFsaXplIHx8IEpTT04ucGFyc2U7XHJcblx0XHR2YXIgZXh0cmFjdCA9IGlzSlNPTlAgPyBmdW5jdGlvbihqc29ucCkge3JldHVybiBqc29ucC5yZXNwb25zZVRleHR9IDogeGhyT3B0aW9ucy5leHRyYWN0IHx8IGZ1bmN0aW9uKHhocikge1xyXG5cdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dC5sZW5ndGggPT09IDAgJiYgZGVzZXJpYWxpemUgPT09IEpTT04ucGFyc2UgPyBudWxsIDogeGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0fTtcclxuXHRcdHhock9wdGlvbnMubWV0aG9kID0gKHhock9wdGlvbnMubWV0aG9kIHx8ICdHRVQnKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0eGhyT3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwoeGhyT3B0aW9ucy51cmwsIHhock9wdGlvbnMuZGF0YSk7XHJcblx0XHR4aHJPcHRpb25zID0gYmluZERhdGEoeGhyT3B0aW9ucywgeGhyT3B0aW9ucy5kYXRhLCBzZXJpYWxpemUpO1xyXG5cdFx0eGhyT3B0aW9ucy5vbmxvYWQgPSB4aHJPcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdFx0dmFyIHVud3JhcCA9IChlLnR5cGUgPT09IFwibG9hZFwiID8geGhyT3B0aW9ucy51bndyYXBTdWNjZXNzIDogeGhyT3B0aW9ucy51bndyYXBFcnJvcikgfHwgaWRlbnRpdHk7XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gdW53cmFwKGRlc2VyaWFsaXplKGV4dHJhY3QoZS50YXJnZXQsIHhock9wdGlvbnMpKSwgZS50YXJnZXQpO1xyXG5cdFx0XHRcdGlmIChlLnR5cGUgPT09IFwibG9hZFwiKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZS5jYWxsKHJlc3BvbnNlKSA9PT0gQVJSQVkgJiYgeGhyT3B0aW9ucy50eXBlKSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHJlc3BvbnNlW2ldID0gbmV3IHhock9wdGlvbnMudHlwZShyZXNwb25zZVtpXSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHhock9wdGlvbnMudHlwZSkgcmVzcG9uc2UgPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkZWZlcnJlZFtlLnR5cGUgPT09IFwibG9hZFwiID8gXCJyZXNvbHZlXCIgOiBcInJlamVjdFwiXShyZXNwb25zZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoeGhyT3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdH07XHJcblx0XHRhamF4KHhock9wdGlvbnMpO1xyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSwgeGhyT3B0aW9ucy5pbml0aWFsVmFsdWUpO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cclxuXHQvL3Rlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24obW9jaykge1xyXG5cdFx0aW5pdGlhbGl6ZSh3aW5kb3cgPSBtb2NrIHx8IHdpbmRvdyk7XHJcblx0XHRyZXR1cm4gd2luZG93O1xyXG5cdH07XHJcblx0Ly9mb3IgaW50ZXJuYWwgdGVzdGluZyBvbmx5LCBkbyBub3QgdXNlIGBtLmRlcHMuZmFjdG9yeWBcclxuXHRtLmRlcHMuZmFjdG9yeSA9IGFwcDtcclxuXHJcblx0cmV0dXJuIG1cclxufSkodHlwZW9mIHdpbmRvdyAhPSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pO1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gbTtcclxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gbX0pO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL34vbWl0aHJpbC9taXRocmlsLmpzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0bW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufVxyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbiAqKi8iLCJpbXBvcnQgbSBmcm9tICdtaXRocmlsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHBvc3RzID0gbS5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIHVybDogJ3Bvc3QucGhwJyxcbiAgICAgIGRlc2VyaWFsaXplOiAodmFsdWUpID0+IEpTT04ucGFyc2UodmFsdWUpLFxuICAgICAgZGF0YToge1xuICAgICAgICBjb21tZW50czogMTBcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBsb2dnZWRJbiA9IG0ucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICB1cmw6ICdjaGVja0xvZ2luLnBocCcsXG4gICAgICBkZXNlcmlhbGl6ZTogKHZhbHVlKSA9PiBKU09OLnBhcnNlKHZhbHVlKVxuICAgIH0pO1xuXG4gICAgbGV0IG5hbWUgPSBtLnByb3AoJycpLFxuICAgICAgcGFzc3dvcmQgPSBtLnByb3AoJycpLFxuICAgICAgcGFzc3dvcmRDb25maXJtYXRpb24gPSBtLnByb3AoJycpLFxuICAgICAgZW1haWwgPSBtLnByb3AoJycpLFxuICAgICAgICBmb3JfbmFtZSA9IG0ucHJvcCgnJyksXG4gICAgICAgIHBvc3RDb250ZW50ID0gbS5wcm9wKCcnKSxcbiAgICAgICAgc2hvd05hbWUgPSBtLnByb3AoJzAnKTtcblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyICgpIHtcbiAgICAgICQucG9zdCgncmVnaXN0ZXIucGhwJywge1xuICAgICAgICAgIG5hbWU6IG5hbWUoKSxcbiAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQoKSxcbiAgICAgICAgICBlbWFpbDogZW1haWwoKVxuICAgICAgICB9LCBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICBtLnJlcXVlc3Qoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIHVybDogJ2NoZWNrTG9naW4ucGhwJyxcbiAgICAgICAgICAgIGV4dHJhY3Q6IG5vbkpzb25FcnJvcnMsXG4gICAgICAgICAgICBkZXNlcmlhbGl6ZTogKHZhbHVlKSA9PiBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgICAgIH0pLnRoZW4obG9nZ2VkSW4sIChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhsb2dnZWRJbigpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5mdW5jdGlvbiBuZXdQb3N0ICgpIHtcbiAgICAkLnBvc3QoJ3JlZ2lzdGVyLnBocCcsIHtcbiAgICAgICAgZm9yX25hbWU6IGZvcl9uYW1lKCksXG4gICAgICAgIHBvc3RDb250ZW50OiBwb3N0Q29udGVudCgpLFxuICAgICAgICBzaG93TmFtZTogc2hvd05hbWUoKVxuICAgIH0pXG59XG5cbiAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xuICAgICAgJC5wb3N0KCdsb2dvdXQucGhwJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9uSnNvbkVycm9ycyAoeGhyKSB7XG4gICAgICByZXR1cm4geGhyLnN0YXR1cyA+IDIwMCA/IEpTT04uc3RyaW5naWZ5KHhoci5yZXNwb25zZVRleHQpIDogeGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcG9zdHMsXG4gICAgICBsb2dnZWRJbixcbiAgICAgIG5hbWUsXG4gICAgICAgIHBvc3RDb250ZW50LFxuICAgICAgICBmb3JfbmFtZSxcbiAgICAgICAgc2hvd05hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHBhc3N3b3JkQ29uZmlybWF0aW9uLFxuICAgICAgZW1haWwsXG4gICAgICByZWdpc3RlclxuICAgIH1cbiAgfSxcbiAgdmlldzogZnVuY3Rpb24gKGN0cmwpIHtcbiAgICByZXR1cm4gW20oXCJoZWFkZXJcIiwgW1xuICAgICAgbShcIm5hdi50b3AtbmF2XCIsIFtcbiAgICAgICAgbShcImgxLmNlbnRlci1hbGlnblwiLCBcIlN0ZXZlbnMgQ29tcGxpbWVudHMgYW5kIENydXNoZXNcIilcbiAgICAgIF0pXG4gICAgXSksIG0oXCJtYWluLmNvbnRhaW5lclwiLCBbXG4gICAgICBtKFwiZm9ybS5jYXJkLXBhbmVsLmhvdmVyYWJsZVwiLCBbXG4gICAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xuICAgICAgICAgIG0oXCJpbnB1dFtpZD0ncG9zdC10aXRsZSddW3R5cGU9J3RleHQnXVtwbGFjZWhvbGRlcj0nV2hvIGFyZSB5b3UgY29tcGxpbWVudGluZz8nXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLmZvcl9uYW1lKSwgdmFsdWU6IGN0cmwuZm9yX25hbWUoKX0pLFxuICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bvc3QtdGl0bGUnXVwiKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcIi5pbnB1dC1maWVsZFwiLCBbXG4gICAgICAgICAgbShcInRleHRhcmVhLm1hdGVyaWFsaXplLXRleHRhcmVhW2lkPSdwb3N0LXRleHRhcmVhJ11bbGVuZ3RoPScxMDAwJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5wb3N0Q29udGVudCksIHZhbHVlOiBjdHJsLnBvc3RDb250ZW50KCl9KSxcbiAgICAgICAgICBtKFwibGFiZWxbZm9yPSdwb3N0LXRleHRhcmVhJ11cIiwgXCJTdWJtaXQgYSBwb3N0IVwiKVxuICAgICAgICBdKSxcbiAgICAgICAgbShcIi5yb3dcIiwgW1xuICAgICAgICAgIG0oXCIuY29sLnMxMi5tOFwiLCBbXG4gICAgICAgICAgICBtKFwiZGl2XCIsIFtcbiAgICAgICAgICAgICAgbShcImlucHV0W2NoZWNrZWQ9J2NoZWNrZWQnXVtpZD0ncG9zdC1hbm9uJ11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPScwJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5zaG93TmFtZSksIHZhbHVlOiBjdHJsLnNob3dOYW1lKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC1hbm9uJ11cIiwgXCJTdWJtaXQgYW5vbnltb3VzbHlcIilcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgIG0oXCJpbnB1dFtpZD0ncG9zdC1uYW1lJ11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPScxJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5zaG93TmFtZSksIHZhbHVlOiBjdHJsLnNob3dOYW1lKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0ncG9zdC1uYW1lJ11cIiwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIuY29sLnMxMi5tNFwiLCBbXG4gICAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi53YXZlcy1lZmZlY3Qud2F2ZXMtbGlnaHRbbmFtZT0nYWN0aW9uJ11bdHlwZT0nc3VibWl0J11cIiwgW1wiUG9zdFwiLG0oXCJpLm1hdGVyaWFsLWljb25zLnJpZ2h0XCIsIFwibWVzc2FnZVwiKV0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgIF0pLFxuICAgICAgbShcInVsXCIsIGN0cmwucG9zdHMoKS5tYXAoKHBvc3QsIHBvc3RQYWdlSW5kZXgpID0+IG0oXCJsaS5zdWJtaXNzaW9uLmNhcmQtcGFuZWwuaG92ZXJhYmxlXCIsIFtcbiAgICAgICAgICBtKFwiaDNcIiwgcG9zdC5mb3JfbmFtZSksXG4gICAgICAgICAgbShcIi52b3RlLmxlZnRcIiwgW1xuICAgICAgICAgICAgbShcImkuc21hbGwubWF0ZXJpYWwtaWNvbnNcIiwgXCJ0aHVtYl91cFwiKSxcbiAgICAgICAgICAgIG0oXCJiclwiKSxcbiAgICAgICAgICAgIG0oXCIuY291bnQuY2VudGVyLWFsaWduXCIsIHBvc3Qudm90ZXMpXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcInAuZmxvdy10ZXh0XCIsIFtwb3N0LnBvc3QgLG0oXCJhLnF1b3RlLWJ5W29uY2xpY2s9JyQoXFwnI21lc3NhZ2UtbW9kYWxcXCcpLm9wZW5Nb2RhbCgpOyddW3RpdGxlPSdTZW5kIGEgcHJpdmF0ZSBtZXNzYWdlJ11cIiwgcG9zdC5uYW1lKV0pLFxuICAgICAgICAgIG0oXCJmb3JtXCIsIFtcbiAgICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xuICAgICAgICAgICAgICBtKGB0ZXh0YXJlYS5tYXRlcmlhbGl6ZS10ZXh0YXJlYVtpZD0ncG9zdC10ZXh0YXJlYS0ke3Bvc3RQYWdlSW5kZXh9J11bbGVuZ3RoPScxMDAwJ11gKSxcbiAgICAgICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LXRleHRhcmVhLSR7cG9zdFBhZ2VJbmRleH0nXWAsIFwiU3VibWl0IGEgY29tbWVudFwiKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tOFwiLCBbXG4gICAgICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgICBtKGBpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J3Bvc3QtYW5vbi0ke3Bvc3RQYWdlSW5kZXh9J11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSdubyddYCksXG4gICAgICAgICAgICAgICAgICBtKGBsYWJlbFtmb3I9J3Bvc3QtYW5vbi0ke3Bvc3RQYWdlSW5kZXh9J11gLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxuICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgICAgICAgbShgaW5wdXRbaWQ9J3Bvc3QtbmFtZS0ke3Bvc3RQYWdlSW5kZXh9J11bbmFtZT0nbmFtZWQnXVt0eXBlPSdyYWRpbyddW3ZhbHVlPSd5ZXMnXWApLFxuICAgICAgICAgICAgICAgICAgbShgbGFiZWxbZm9yPSdwb3N0LW5hbWUtJHtwb3N0UGFnZUluZGV4fSddYCwgXCJTdWJtaXQgd2l0aCBuYW1lXCIpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tNFwiLCBbXG4gICAgICAgICAgICAgICAgbShcImJ1dHRvbi5idG4ud2F2ZXMtZWZmZWN0LndhdmVzLWxpZ2h0W25hbWU9J2FjdGlvbiddW3R5cGU9J3N1Ym1pdCddXCIsIFtcIkNvbW1lbnRcIixtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcImNoYXRfYnViYmxlXCIpXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSksXG4gICAgICAgICAgbShcIi5jb21tZW50cy1jb250YWluZXJcIiwgcG9zdC5jb21tZW50cy5tYXAoKGNvbW1lbnQpID0+IG0oXCJibG9ja3F1b3RlXCIsIFtjb21tZW50LmNvbW1lbnQsIG0oXCJiclwiKSwgbShcImEucXVvdGUtYnlbb25jbGljaz0nJChcXCcjbWVzc2FnZS1tb2RhbFxcJykub3Blbk1vZGFsKCk7J11bdGl0bGU9J1NlbmQgYSBwcml2YXRlIG1lc3NhZ2UnXVwiLCBjb21tZW50Lm5hbWUpXSkpICAgICAgICAgIClcbiAgICAgICAgXSkpXG4gICAgICApXG4gICAgXSksIG0oXCJmb290ZXIucGFnZS1mb290ZXJcIiwgW1xuICAgICAgbShcIi5mb290ZXItY29weXJpZ2h0XCIsIFtcbiAgICAgICAgbShcIi5jZW50ZXItYWxpZ24udmFsaWduXCIsIFwiwqkgMjAxNSBOaWNob2xhcyBBbnRvbm92ICYgQnJpYW4gWmF3aXphd2EgZm9yIENTNTQ2IGF0IFN0ZXZlbnNcIilcbiAgICAgIF0pXG4gICAgXSksbShgLmxvZ2luLWJveC56LWRlcHRoLTIke2N0cmwubG9nZ2VkSW4oKT9cIlwiOlwiLmhpZGRlblwifWAsIHtvbmNsaWNrOiAoKSA9PiB7JCgnI2NvbWJvLW1vZGFsJykub3Blbk1vZGFsKCk7fX0sIFtcbiAgICAgIG0oXCJhXCIsIFwiTG9nIGluIC8gUmVnaXN0ZXJcIilcbiAgICBdKSxtKGAubG9naW4tYm94LnotZGVwdGgtMiR7Y3RybC5sb2dnZWRJbigpP1wiLmhpZGRlblwiOlwiXCJ9YCwge29uY2xpY2s6ICgpID0+IHthbGVydCgnaW1wbGVtZW50IG1lc3NhZ2VzJyl9fSwgW1xuICAgICAgW20oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcIm1lc3NhZ2VcIiksIG0oXCJpLm1hdGVyaWFsLWljb25zLnNpZGUtaWNvblwiLCBcInBvd2VyX3NldHRpbmdzX25ld1wiKV0sXG4gICAgXSksbShcIi5tb2RhbFtpZD0nY29tYm8tbW9kYWwnXVwiLCBbXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICBtKFwicFwiLCBcIlRoYW5rcyBmb3IgdXNpbmcgdGhpcyBzaXRlLiBUbyBwcmV2ZW50IGFidXNlIGFuZCBhbGxvdyBmb3IgYSByaWNoIGZlYXR1cmVkIGV4cGVyaWVuY2UsIHVzZXJzIGFyZSByZXF1aXJlZCB0byBsb2cgaW4uIERvbid0IFdvcnJ5ISBBbGwgeW91ciBpbmZvcm1hdGlvbiB3aWxsIGJlIGtlcHQgYW5vbnltb3VzIGFzIGxvbmcgYXMgeW91IGNob29zZSB0byBrZWVwIGl0IHRoYXQgd2F5LlwiKVxuICAgICAgXSksXG4gICAgICBtKFwiLm1vZGFsLWZvb3RlclwiLCBbXG4gICAgICAgIG0oXCJhLm1vZGFsLWFjdGlvbi5tb2RhbC1jbG9zZS53YXZlcy1lZmZlY3Qud2F2ZXMtZ3JlZW4uYnRuLWZsYXQubGVmdF1cIiwge29uY2xpY2s6ICgpID0+IHskKCcjbG9naW4tbW9kYWwnKS5vcGVuTW9kYWwoKTt9fSwgXCJMb2cgSW5cIiksXG4gICAgICAgIG0oXCJhLm1vZGFsLWFjdGlvbi5tb2RhbC1jbG9zZS53YXZlcy1lZmZlY3Qud2F2ZXMtZ3JlZW4uYnRuLWZsYXQubGVmdFwiLCB7b25jbGljazogKCkgPT4geyQoJyNyZWdpc3Rlci1tb2RhbCcpLm9wZW5Nb2RhbCgpO319LCBcIlJlZ2lzdGVyXCIpXG4gICAgICBdKVxuICAgIF0pLG0oXCIubW9kYWxbaWQ9J2xvZ2luLW1vZGFsJ11cIiwgW1xuICAgICAgbShcIi5tb2RhbC1jb250ZW50XCIsIFtcbiAgICAgICAgbShcImg0XCIsIFwiTG9nIEluXCIpLFxuICAgICAgICBtKFwiZm9ybS5jb2wuczEyXCIsIFtcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJlbWFpbFwiKSxcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdsb2dpbi1lbWFpbCddW3R5cGU9J2VtYWlsJ11cIiksXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J2xvZ2luLWVtYWlsJ11cIiwgXCJFbWFpbFwiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nbG9naW4tcGFzc3dvcmQnXVt0eXBlPSdwYXNzd29yZCddXCIpLFxuICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdsb2dpbi1wYXNzd29yZCddXCIsIFwiUGFzc3dvcmRcIilcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgIF0pLFxuICAgICAgbShcIi5tb2RhbC1mb290ZXJcIiwgW1xuICAgICAgICBtKFwiYS5tb2RhbC1hY3Rpb24ubW9kYWwtY2xvc2Uud2F2ZXMtZWZmZWN0LndhdmVzLWdyZWVuLmJ0bi1mbGF0LnJpZ2h0XCIsICBcIkxvZyBJblwiKVxuICAgICAgXSlcbiAgICBdKSxtKFwiLm1vZGFsW2lkPSdyZWdpc3Rlci1tb2RhbCddXCIsIFtcbiAgICAgIG0oXCIubW9kYWwtY29udGVudFwiLCBbXG4gICAgICAgIG0oXCJoNFwiLCBcIlJlZ2lzdGVyXCIpLFxuICAgICAgICBtKFwiZm9ybS5jb2wuczEyXCIsIFtcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJhY2NvdW50X2NpcmNsZVwiKSxcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSduYW1lJ11bcmVxdWlyZWQ9JyddW3BhdHRlcm49LisgLitdW3R5cGU9J3RleHQnXVwiLCB7b25jaGFuZ2U6IG0ud2l0aEF0dHIoXCJ2YWx1ZVwiLCBjdHJsLm5hbWUpLCB2YWx1ZTogY3RybC5uYW1lKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nbmFtZSddXCIsIFwiTmFtZVwiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0ncGFzc3dvcmQnXVt0eXBlPSdwYXNzd29yZCddXCIsIHtvbmNoYW5nZTogbS53aXRoQXR0cihcInZhbHVlXCIsIGN0cmwucGFzc3dvcmQpLCB2YWx1ZTogY3RybC5wYXNzd29yZCgpfSksXG4gICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J3Bhc3N3b3JkJ11cIiwgXCJQYXNzd29yZFwiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJsb2NrX291dGxpbmVcIiksXG4gICAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtpZD0nY29uZmlybS1wYXNzd29yZCddW3R5cGU9J3Bhc3N3b3JkJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5wYXNzd29yZENvbmZpcm1hdGlvbiksIHZhbHVlOiBjdHJsLnBhc3N3b3JkQ29uZmlybWF0aW9uKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nY29uZmlybS1wYXNzd29yZCddXCIsIFwiQ29uZmlybSBQYXNzd29yZFwiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBtKFwiLnJvd1wiLCBbXG4gICAgICAgICAgICBtKFwiLmlucHV0LWZpZWxkLmNvbC5zMTJcIiwgW1xuICAgICAgICAgICAgICBtKFwiaS5tYXRlcmlhbC1pY29ucy5wcmVmaXhcIiwgXCJlbWFpbFwiKSxcbiAgICAgICAgICAgICAgbShcImlucHV0LnZhbGlkYXRlW2lkPSdlbWFpbCddW3R5cGU9J2VtYWlsJ11cIiwge29uY2hhbmdlOiBtLndpdGhBdHRyKFwidmFsdWVcIiwgY3RybC5lbWFpbCksIHZhbHVlOiBjdHJsLmVtYWlsKCl9KSxcbiAgICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nZW1haWwnXVwiLCBcIkVtYWlsXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIG0oXCIubW9kYWwtZm9vdGVyXCIsIFtcbiAgICAgICAgbShcImEubW9kYWwtYWN0aW9uLm1vZGFsLWNsb3NlLndhdmVzLWVmZmVjdC53YXZlcy1ncmVlbi5idG4tZmxhdC5yaWdodFwiLCB7b25jbGljazogY3RybC5yZWdpc3Rlcn0sIFwiUmVnaXN0ZXJcIilcbiAgICAgIF0pXG4gICAgXSksLG0oXCIubW9kYWxbaWQ9J21lc3NhZ2UtbW9kYWwnXVwiLCBbXG4gICAgICBtKFwiLm1vZGFsLWNvbnRlbnRcIiwgW1xuICAgICAgICBtKFwiaDRcIiwgXCJNZXNzYWdlXCIpLFxuICAgICAgICBtKFwiZm9ybVwiLCBbXG4gICAgICAgICAgbShcIi5pbnB1dC1maWVsZC5tZXNzYWdlLXRvXCIsIFtcbiAgICAgICAgICAgIG0oXCJpbnB1dC52YWxpZGF0ZVtkaXNhYmxlZD0nJ11baWQ9J2Rpc2FibGVkJ11bdHlwZT0ndGV4dCddW3ZhbHVlPSdJIGFtIG5vdCBlZGl0YWJsZSddXCIpLFxuICAgICAgICAgICAgbShcImxhYmVsW2Zvcj0nZGlzYWJsZWQnXVwiLCBcIlJlY2lwaWVudFwiKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIuaW5wdXQtZmllbGRcIiwgW1xuICAgICAgICAgICAgbShcInRleHRhcmVhLm1hdGVyaWFsaXplLXRleHRhcmVhW2lkPSdtZXNzYWdlLXRleHRhcmVhJ11bbGVuZ3RoPScxMDAwJ11cIiksXG4gICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLXRleHRhcmVhJ11cIiwgXCJTdWJtaXQgYSBwb3N0IVwiKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIG0oXCIucm93XCIsIFtcbiAgICAgICAgICAgIG0oXCIuY29sLnMxMi5tN1wiLCBbXG4gICAgICAgICAgICAgIG0oXCJkaXZcIiwgW1xuICAgICAgICAgICAgICAgIG0oXCJpbnB1dFtjaGVja2VkPSdjaGVja2VkJ11baWQ9J21lc3NhZ2UtYW5vbiddW25hbWU9J25hbWVkJ11bdHlwZT0ncmFkaW8nXVt2YWx1ZT0nbm8nXVwiKSxcbiAgICAgICAgICAgICAgICBtKFwibGFiZWxbZm9yPSdtZXNzYWdlLWFub24nXVwiLCBcIlN1Ym1pdCBhbm9ueW1vdXNseVwiKVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgbShcImRpdlwiLCBbXG4gICAgICAgICAgICAgICAgbShcImlucHV0W2lkPSdtZXNzYWdlLW5hbWUnXVtuYW1lPSduYW1lZCddW3R5cGU9J3JhZGlvJ11bdmFsdWU9J3llcyddXCIpLFxuICAgICAgICAgICAgICAgIG0oXCJsYWJlbFtmb3I9J21lc3NhZ2UtbmFtZSddXCIsIFwiU3VibWl0IHdpdGggbmFtZVwiKVxuICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBtKFwiLmNvbC5zMTIubTVcIiwgW1xuICAgICAgICAgICAgICBtKFwiYnV0dG9uLmJ0bi53YXZlcy1lZmZlY3Qud2F2ZXMtbGlnaHRbbmFtZT0nYWN0aW9uJ11bdHlwZT0nc3VibWl0J11cIiwgW1wiU2VuZCBcIixtKFwiaS5tYXRlcmlhbC1pY29ucy5yaWdodFwiLCBcInNlbmRcIildKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgXSlcbiAgICBdKV07XG4gIH1cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21haW4vbW9kdWxlLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==