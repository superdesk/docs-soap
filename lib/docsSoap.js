'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var constants = require('./constants');
var parseHTML = require('./parseHTML');

var docsId = constants.docsId,
    elements = constants.elements,
    headers = constants.headers,
    styles = constants.styles;


var wrapNodeAnchor = function wrapNodeAnchor(node, href) {
  var anchor = document.createElement(elements.ANCHOR);
  anchor.href = href;
  anchor.appendChild(node.cloneNode(true));
  return anchor;
};

var wrapNodeInline = function wrapNodeInline(node, style) {
  var el = document.createElement(style);
  el.appendChild(node.cloneNode(true));
  return el;
};

var wrapNode = function wrapNode(inner, result) {
  var newNode = result.cloneNode(true);
  if (!inner) {
    return newNode;
  }
  if (inner.style && inner.style.fontWeight === styles.BOLD) {
    newNode = wrapNodeInline(newNode, elements.BOLD);
  }
  if (inner.style && inner.style.fontStyle === styles.ITALIC) {
    newNode = wrapNodeInline(newNode, elements.ITALIC);
  }
  if (inner.style && inner.style.textDecoration === styles.UNDERLINE) {
    newNode = wrapNodeInline(newNode, elements.UNDERLINE);
  }
  if (inner.style && inner.style.textDecoration === styles.STRIKETHROUGH) {
    newNode = wrapNodeInline(newNode, elements.STRIKETHROUGH);
  }
  if (inner.style && inner.style.verticalAlign === styles.SUPERSCRIPT) {
    newNode = wrapNodeInline(newNode, elements.SUPERSCRIPT);
  }
  if (inner.style && inner.style.verticalAlign === styles.SUBSCRIPT) {
    newNode = wrapNodeInline(newNode, elements.SUBSCRIPT);
  }
  return newNode;
};

var applyBlockStyles = function applyBlockStyles(dirty) {
  var node = dirty.cloneNode(true);
  var newNode = document.createTextNode(node.textContent);
  var styledNode = document.createTextNode('');
  if (node.childNodes[0] && node.childNodes[0].style) {
    styledNode = node.childNodes[0];
  }
  if (node.childNodes[0] && node.childNodes[0].nodeName === 'A') {
    // flow-ignore Flow doesn't recognize that a childNode can be an HTMLAnchorElement
    newNode = wrapNodeAnchor(newNode.cloneNode(true), node.childNodes[0].href);
    styledNode = node.childNodes[0].childNodes[0];
  }
  newNode = wrapNode(styledNode, newNode);
  return newNode;
};

var applyInlineStyles = function applyInlineStyles(dirty) {
  var node = dirty.cloneNode(true);
  var newNode = document.createTextNode(node.textContent);
  var styledNode = node;
  if (node.nodeName === 'A') {
    // flow-ignore Flow doesn't recognize that cloneNode() can return an HTMLAnchorElement
    newNode = wrapNodeAnchor(newNode, node.href);
    if (node.childNodes[0] && node.childNodes[0].style) {
      styledNode = node.childNodes[0];
    }
  }
  newNode = wrapNode(styledNode, newNode);
  return newNode;
};

var listTagNames = ['OL', 'UL', 'LI'];
var tableTagNames = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'COLGROUP', 'COL', 'TR', 'TH', 'TD', 'CAPTION'];
var tagsToPreserve = [].concat(listTagNames, tableTagNames);

var getCleanNode = function getCleanNode(node) {
  if (node.childNodes && (node.childNodes.length <= 1 || tagsToPreserve.includes(node.nodeName))) {
    var newWrapper = null;
    var newNode = document.createTextNode(node.textContent);
    if (tagsToPreserve.includes(node.nodeName) || typeof node.querySelector === 'function' // querySelector is not available for text nodes
    && node.querySelector(tagsToPreserve.join(',')) != null) {
      newWrapper = document.createElement(node.nodeName);
      newNode = document.createDocumentFragment();
      var items = [];
      for (var i = 0; i < node.childNodes.length; i++) {
        items.push.apply(items, _toConsumableArray(getCleanNode(node.childNodes[i])));
      }
      items.map(function (i) {
        return newNode.appendChild(i);
      });
    } else if (headers.indexOf(node.nodeName) !== -1) {
      newWrapper = document.createElement(node.nodeName);
      newNode = applyInlineStyles(node.childNodes[0]);
    } else if (node.nodeName === 'P') {
      newWrapper = document.createElement('p');
      newNode = applyBlockStyles(node);
    } else if (node.nodeName === 'BR') {
      newNode = node;
    } else {
      newWrapper = document.createElement('span');
      newNode = applyInlineStyles(node);
    }
    if (newWrapper) {
      newWrapper.appendChild(newNode);
      return [newWrapper];
    }
    return [node.cloneNode(true)];
  } else if (node.tagName === 'A') {
    return [applyInlineStyles(node)];
  }

  if (node.childNodes) {
    var nodes = [];
    for (var _i = 0; _i < node.childNodes.length; _i++) {
      nodes.push.apply(nodes, _toConsumableArray(getCleanNode(node.childNodes[_i])));
    }
    return nodes;
  }
  return [node];
};

/**
 * filter unwanted node
 * @param node
 * @returns {boolean}
 */
var filterNode = function filterNode(node) {
  return node.nodeType !== 8;
}; // Node.COMMENT_NODE = 8

/**
 * parses the given "dirty" clipboard content and returns a (mostly) clean
 * HTML document with only the HTML content you want
 * @param dirty
 * @returns {HTMLElement}
 */
var getCleanDocument = function getCleanDocument(dirty) {
  // create a new document to preserve the integrity of the original data
  var body = document.createElement('body');
  var nodes = dirty.childNodes;
  var filteredNodes = Array.from(nodes).filter(filterNode);
  var cleanNodes = [];

  // for each top level node, clean it up recursively
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = filteredNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      cleanNodes.push.apply(cleanNodes, _toConsumableArray(getCleanNode(node)));
    }

    // append all of the clean nodes to the new document
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  for (var i = 0; i < cleanNodes.length; i++) {
    body.appendChild(cleanNodes[i].cloneNode(true));
  }

  // all clean
  return body;
};

module.exports = function (clipboardContent) {
  if (typeof clipboardContent !== 'string') {
    throw new Error('Expected \'clipboardContent\' to be a string of HTML, received ' + (typeof clipboardContent === 'undefined' ? 'undefined' : _typeof(clipboardContent)));
  }
  if (clipboardContent.length <= 0) {
    throw new Error('Expected clipboardContent to have content, received empty string');
  }
  if (!clipboardContent.match(docsId)) {
    return parseHTML(clipboardContent.replace(/(\r\n|\n|\r)/, '')).outerHTML;
  }
  return getCleanDocument(parseHTML(clipboardContent.replace(/(\r\n|\n|\r)/, ''))).outerHTML;
};