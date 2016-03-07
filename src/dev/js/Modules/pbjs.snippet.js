/**
 *  PB&Js | /pbjs.snippet.js
 *  Author: Patrick Barnum
 *  Description: Code display.
 *  License: NULL
 */

"use strict";

(function(window) {

  var MODULE_NAME = "snippet";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  var CLASSES = {
    "table": pbjs.NAME + '-' + MODULE_NAME + '-' + 'table',
    "tableRow": pbjs.NAME + '-' + MODULE_NAME + '-' + 'row',
    "tableCol": pbjs.NAME + '-' + MODULE_NAME + '-' + 'col',
    "comment": pbjs.NAME + '-' + MODULE_NAME + '-' + 'comment',
    "lineNumber": pbjs.NAME + '-' + MODULE_NAME + '-' + 'ln'
  };

  pbjs.snippet = function(selector, options) {
    options = _compileOptions(options);
    var elements = document.querySelectorAll(selector) || [];
    for (var i = 0; i < elements.length; ++i) {
      _formatter(elements[i], options);
    }
  };

  function _formatter(element, options) {
    var lines = element.innerHTML.toString().split("\n");
    var lineNumber = 1;
    var tbody = pbjs.createElement('table', {'class':CLASSES.table});
    var tbody = pbjs.createElement('tbody');

    // Loop through all lines found
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i].trim();
      var tr = pbjs.createElement('tr', {'class':CLASSES.tableRow});
      var elNumber = _buildLineNumber(lineNumber);
      var elCode = pbjs.createElement('td', {'class':CLASSES.tableCol});

      // Is line empty?
      if (line.length <= 0) {
        continue;
      }

      // format comments
      var pos = pbjs.undefined;
      pos = line.indexOf(options.delimiters.singleComment);
      if (pos !== pbjs.undefined) {
        line = pbjs.insertSubString(line, '<span class="' + CLASSES.comment + '">', pos) + '</span>';
      }

      elCode.innerHTML = line;

      tr.appendChild(elNumber);
      tr.appendChild(elCode);
      tbody.appendChild(tr);
      ++lineNumber;
    }

    var table = pbjs.createElement('table');
    table.appendChild(tbody);

    element.innerHTML = "";
    element.appendChild(table);
  }

  function _buildLineNumber(number) {
    var td = pbjs.createElement('td', {'class':CLASSES.tableCol});
    var span = pbjs.createElement('span', {'class':CLASSES.lineNumber});
    span.innerHTML = number;
    td.appendChild(span);
    return td;
  }

  function _compileOptions(options) {
    return pbjs.extend({
      "regex": {
        "commentLine": /\/\//g,
        "commentBlock": /(\/\*)(\*\/)/g
      },
      "delimiters": {
        "singleComment": "//",
        "blockCommentStart": "/*",
        "blockCommentEnd": "*/"
      }
    }, options);
  }

})(window);
