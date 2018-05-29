var docsSoap =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (html) {\n  var doc = void 0;\n  if (typeof DOMParser !== 'undefined') {\n    var parser = new DOMParser();\n    doc = parser.parseFromString(html, 'text/html');\n  } else {\n    doc = document.implementation.createHTMLDocument('');\n    doc.documentElement.innerHTML = html;\n  }\n  return doc.body;\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/parseHTML.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/parseHTML.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof2 = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _typeof = typeof Symbol === \"function\" && _typeof2(Symbol.iterator) === \"symbol\" ? function (obj) {\n  return typeof obj === \"undefined\" ? \"undefined\" : _typeof2(obj);\n} : function (obj) {\n  return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj === \"undefined\" ? \"undefined\" : _typeof2(obj);\n};\n\nfunction _toConsumableArray(arr) {\n  if (Array.isArray(arr)) {\n    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {\n      arr2[i] = arr[i];\n    }return arr2;\n  } else {\n    return Array.from(arr);\n  }\n}\n\nvar constants = __webpack_require__(3);\nvar parseHTML = __webpack_require__(0);\n\nvar docsId = constants.docsId,\n    elements = constants.elements,\n    headers = constants.headers,\n    styles = constants.styles;\n\nvar wrapNodeAnchor = function wrapNodeAnchor(node, href) {\n  var anchor = document.createElement(elements.ANCHOR);\n  anchor.href = href;\n  anchor.appendChild(node.cloneNode(true));\n  return anchor;\n};\n\nvar wrapNodeInline = function wrapNodeInline(node, style) {\n  var el = document.createElement(style);\n  el.appendChild(node.cloneNode(true));\n  return el;\n};\n\nvar wrapNode = function wrapNode(inner, result) {\n  var newNode = result.cloneNode(true);\n  if (!inner) {\n    return newNode;\n  }\n  if (inner.style && inner.style.fontWeight === styles.BOLD) {\n    newNode = wrapNodeInline(newNode, elements.BOLD);\n  }\n  if (inner.style && inner.style.fontStyle === styles.ITALIC) {\n    newNode = wrapNodeInline(newNode, elements.ITALIC);\n  }\n  if (inner.style && inner.style.textDecoration === styles.UNDERLINE) {\n    newNode = wrapNodeInline(newNode, elements.UNDERLINE);\n  }\n  if (inner.style && inner.style.textDecoration === styles.STRIKETHROUGH) {\n    newNode = wrapNodeInline(newNode, elements.STRIKETHROUGH);\n  }\n  if (inner.style && inner.style.verticalAlign === styles.SUPERSCRIPT) {\n    newNode = wrapNodeInline(newNode, elements.SUPERSCRIPT);\n  }\n  if (inner.style && inner.style.verticalAlign === styles.SUBSCRIPT) {\n    newNode = wrapNodeInline(newNode, elements.SUBSCRIPT);\n  }\n  return newNode;\n};\n\nvar applyBlockStyles = function applyBlockStyles(dirty) {\n  var node = dirty.cloneNode(true);\n  var newNode = document.createTextNode(node.textContent);\n  var styledNode = document.createTextNode('');\n  if (node.childNodes[0] && node.childNodes[0].style) {\n    styledNode = node.childNodes[0];\n  }\n  if (node.childNodes[0] && node.childNodes[0].nodeName === 'A') {\n    // flow-ignore Flow doesn't recognize that a childNode can be an HTMLAnchorElement\n    newNode = wrapNodeAnchor(newNode.cloneNode(true), node.childNodes[0].href);\n    styledNode = node.childNodes[0].childNodes[0];\n  }\n  newNode = wrapNode(styledNode, newNode);\n  return newNode;\n};\n\nvar applyInlineStyles = function applyInlineStyles(dirty) {\n  var node = dirty.cloneNode(true);\n  var newNode = document.createTextNode(node.textContent);\n  var styledNode = node;\n  if (node.nodeName === 'A') {\n    // flow-ignore Flow doesn't recognize that cloneNode() can return an HTMLAnchorElement\n    newNode = wrapNodeAnchor(newNode, node.href);\n    if (node.childNodes[0] && node.childNodes[0].style) {\n      styledNode = node.childNodes[0];\n    }\n  }\n  newNode = wrapNode(styledNode, newNode);\n  return newNode;\n};\n\nvar listTagNames = ['OL', 'UL', 'LI'];\nvar tableTagNames = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'COLGROUP', 'COL', 'TR', 'TH', 'TD', 'CAPTION'];\nvar tagsToPreserve = [].concat(listTagNames, tableTagNames);\n\nvar getCleanNode = function getCleanNode(node) {\n  if (node.childNodes && (node.childNodes.length <= 1 || tagsToPreserve.includes(node.nodeName))) {\n    var newWrapper = null;\n    var newNode = document.createTextNode(node.textContent);\n    if (tagsToPreserve.includes(node.nodeName) || node.querySelector(tagsToPreserve.join(',')) != null) {\n      newWrapper = document.createElement(node.nodeName);\n      newNode = document.createDocumentFragment();\n      var items = [];\n      for (var i = 0; i < node.childNodes.length; i++) {\n        items.push.apply(items, _toConsumableArray(getCleanNode(node.childNodes[i])));\n      }\n      items.map(function (i) {\n        return newNode.appendChild(i);\n      });\n    } else if (headers.indexOf(node.nodeName) !== -1) {\n      newWrapper = document.createElement(node.nodeName);\n      newNode = applyInlineStyles(node.childNodes[0]);\n    } else if (node.nodeName === 'P') {\n      newWrapper = document.createElement('p');\n      newNode = applyBlockStyles(node);\n    } else if (node.nodeName === 'BR') {\n      newNode = node;\n    } else {\n      newWrapper = document.createElement('span');\n      newNode = applyInlineStyles(node);\n    }\n    if (newWrapper) {\n      newWrapper.appendChild(newNode);\n      return [newWrapper];\n    }\n    return [node.cloneNode(true)];\n  }\n  if (node.childNodes) {\n    var nodes = [];\n    for (var _i = 0; _i < node.childNodes.length; _i++) {\n      nodes.push.apply(nodes, _toConsumableArray(getCleanNode(node.childNodes[_i])));\n    }\n    return nodes;\n  }\n  return [node];\n};\n\n/**\n * filter unwanted node\n * @param node\n * @returns {boolean}\n */\nvar filterNode = function filterNode(node) {\n  return node.nodeType !== 8;\n}; // Node.COMMENT_NODE = 8\n\n/**\n * parses the given \"dirty\" clipboard content and returns a (mostly) clean\n * HTML document with only the HTML content you want\n * @param dirty\n * @returns {HTMLElement}\n */\nvar getCleanDocument = function getCleanDocument(dirty) {\n  // create a new document to preserve the integrity of the original data\n  var body = document.createElement('body');\n  var nodes = dirty.childNodes;\n  var filteredNodes = Array.from(nodes).filter(filterNode);\n  var cleanNodes = [];\n\n  // for each top level node, clean it up recursively\n  var _iteratorNormalCompletion = true;\n  var _didIteratorError = false;\n  var _iteratorError = undefined;\n\n  try {\n    for (var _iterator = filteredNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n      var node = _step.value;\n\n      cleanNodes.push.apply(cleanNodes, _toConsumableArray(getCleanNode(node)));\n    }\n\n    // append all of the clean nodes to the new document\n  } catch (err) {\n    _didIteratorError = true;\n    _iteratorError = err;\n  } finally {\n    try {\n      if (!_iteratorNormalCompletion && _iterator.return) {\n        _iterator.return();\n      }\n    } finally {\n      if (_didIteratorError) {\n        throw _iteratorError;\n      }\n    }\n  }\n\n  for (var i = 0; i < cleanNodes.length; i++) {\n    body.appendChild(cleanNodes[i].cloneNode(true));\n  }\n\n  // all clean\n  return body;\n};\n\nmodule.exports = function (clipboardContent) {\n  if (typeof clipboardContent !== 'string') {\n    throw new Error('Expected \\'clipboardContent\\' to be a string of HTML, received ' + (typeof clipboardContent === 'undefined' ? 'undefined' : _typeof(clipboardContent)));\n  }\n  if (clipboardContent.length <= 0) {\n    throw new Error('Expected clipboardContent to have content, received empty string');\n  }\n  if (!clipboardContent.match(docsId)) {\n    return parseHTML(clipboardContent.replace(/(\\r\\n|\\n|\\r)/, '')).outerHTML;\n  }\n  return getCleanDocument(parseHTML(clipboardContent.replace(/(\\r\\n|\\n|\\r)/, ''))).outerHTML;\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/docsSoap.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/docsSoap.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// @flow\n\nvar docsSoap = __webpack_require__(1);\nvar parseHTML = __webpack_require__(0);\n\nmodule.exports = {\n  default: docsSoap,\n  docsSoap: docsSoap, //eslint-disable-line\n  parseHTML: parseHTML //eslint-disable-line\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./index.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar docsId = /id=\"docs\\-internal\\-guid/;\n\nvar styles = {\n  BOLD: '700',\n  ITALIC: 'italic',\n  UNDERLINE: 'underline',\n  STRIKETHROUGH: 'line-through',\n  SUPERSCRIPT: 'super',\n  SUBSCRIPT: 'sub'\n};\n\nvar elements = {\n  ANCHOR: 'a',\n  BOLD: 'strong',\n  ITALIC: 'em',\n  UNDERLINE: 'u',\n  STRIKETHROUGH: 'del',\n  SUPERSCRIPT: 'sup',\n  SUBSCRIPT: 'sub'\n};\n\nvar headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];\n\nmodule.exports = { docsId: docsId, styles: styles, elements: elements, headers: headers };\n\n//////////////////\n// WEBPACK FOOTER\n// ./lib/constants.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///./lib/constants.js?");

/***/ })
/******/ ]);