'use strict';

var docsId = /id="docs\-internal\-guid/;

var styles = {
  BOLD: '700',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'line-through',
  SUPERSCRIPT: 'super',
  SUBSCRIPT: 'sub'
};

var elements = {
  ANCHOR: 'a',
  BOLD: 'strong',
  ITALIC: 'em',
  UNDERLINE: 'u',
  STRIKETHROUGH: 'del',
  SUPERSCRIPT: 'sup',
  SUBSCRIPT: 'sub'
};

var headers = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

module.exports = { docsId: docsId, styles: styles, elements: elements, headers: headers };