// @flow
const constants = require('./constants');
const parseHTML = require('./parseHTML');

const { docsId, elements, headers, styles } = constants;

const wrapNodeAnchor = (
  node: Node,
  href: string
): HTMLAnchorElement => {
  const anchor = document.createElement(elements.ANCHOR);
  anchor.href = href;
  anchor.appendChild(node.cloneNode(true));
  return anchor;
};

const wrapNodeInline = (
  node: Node,
  style: string
): Node => {
  const el = document.createElement(style);
  el.appendChild(node.cloneNode(true));
  return el;
};

const wrapNode = (
  inner: Node,
  result: Node
): Node => {
  let newNode = result.cloneNode(true);
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

const applyBlockStyles = (
  dirty: Node
): Node => {
  const node = dirty.cloneNode(true);
  let newNode = document.createTextNode(node.textContent);
  let styledNode = document.createTextNode('');
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

const applyInlineStyles = (
  dirty: Node
): Node => {
  const node = dirty.cloneNode(true);
  let newNode = document.createTextNode(node.textContent);
  let styledNode = node;
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

const listTagNames = ['OL', 'UL', 'LI'];
const tableTagNames = ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'COLGROUP', 'COL', 'TR', 'TH', 'TD', 'CAPTION'];
const tagsToPreserve = [...listTagNames, ...tableTagNames];

const getCleanNode = (
  node: Node
): Array<Node> => {
  if (node.childNodes && (node.childNodes.length <= 1 || tagsToPreserve.includes(node.nodeName))) {
    let newWrapper = null;
    let newNode = document.createTextNode(node.textContent);
    if (
      tagsToPreserve.includes(node.nodeName)
      || (
        typeof node.querySelector === 'function' // querySelector is not available for text nodes
        && node.querySelector(tagsToPreserve.join(',')) != null
      )
    ) {
      newWrapper = document.createElement(node.nodeName);
      newNode = document.createDocumentFragment();
      const items = [];
      for (let i = 0; i < node.childNodes.length; i++) {
        items.push(...getCleanNode(node.childNodes[i]));
      }
      items.map((i: Node): Node => newNode.appendChild(i));
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
    const nodes = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      nodes.push(...getCleanNode(node.childNodes[i]));
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
const filterNode = (
  node: Node
): boolean => node.nodeType !== 8; // Node.COMMENT_NODE = 8

/**
 * parses the given "dirty" clipboard content and returns a (mostly) clean
 * HTML document with only the HTML content you want
 * @param dirty
 * @returns {HTMLElement}
 */
const getCleanDocument = (
  dirty: HTMLElement
): HTMLElement => {
  // create a new document to preserve the integrity of the original data
  const body = document.createElement('body');
  const nodes = dirty.childNodes;
  const filteredNodes = Array.from(nodes).filter(filterNode);
  const cleanNodes = [];

  // for each top level node, clean it up recursively
  for (const node of filteredNodes) {
    cleanNodes.push(...getCleanNode(node));
  }

  // append all of the clean nodes to the new document
  for (let i = 0; i < cleanNodes.length; i++) {
    body.appendChild(cleanNodes[i].cloneNode(true));
  }

  // all clean
  return body;
};

module.exports = (
  clipboardContent: string
): string => {
  if (typeof clipboardContent !== 'string') {
    throw new Error(`Expected 'clipboardContent' to be a string of HTML, received ${typeof clipboardContent}`);
  }
  if (clipboardContent.length <= 0) {
    throw new Error('Expected clipboardContent to have content, received empty string');
  }
  if (!clipboardContent.match(docsId)) {
    return parseHTML(clipboardContent.replace(/(\r\n|\n|\r)/, '')).outerHTML;
  }
  return getCleanDocument(parseHTML(clipboardContent.replace(/(\r\n|\n|\r)/, ''))).outerHTML;
};
