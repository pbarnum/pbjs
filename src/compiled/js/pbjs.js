/**
 *  PB&Js | /src/dev/_Constructor/pbjs.router.js
 *  Author: Patrick Barnum
 *  Description: Information control through Modules.
 *  License: NULL
 */

//(function(window) {
//
//  var MODULE_NAME = "ROUTER";
//
//  // Is PBJS a valid object?
//  if (!window || !window.pbjs) {
//    throw new Error("PBJS does not exist!");
//  }
// 
//  pbjs.router = func
// 
//})(window);
/**
 *  PB&Js | /src/dev/_Constructor/pb.core.js
 *  Author: Patrick Barnum
 *  Description: Core functionality and namespace creation for the PB&Js suite
 *  License: NULL
 */

"use strict";

(function (window, document, undefined) {

  // Create the global object
  window.pbjs = function () {}; // Make pbjs a global object
  pbjs.core = function () {}; // Initialize the Core object
  pbjs.undefined = undefined; // Create a globally common 'undefined'
  pbjs.NAME = "pbjs";
  pbjs.VERSION = "0.0.1";

  /**
   *  Builds and returns a new pbjsObject id
   */
  pbjs.salt = function (len) {
    var pepper = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var length = 8;
    var str = "";
    var i = 0;

    // If the user's length is within reason, use it!
    if (parseInt(len) === len && len > 4 && len < 64) {
      length = len;
    }

    for (i; i < length; ++i) {
      str += pepper[parseInt(Math.random() * pepper.length)];
    }

    return str;
  };

  /**
   * Check the type of an object
   * @param  obj  The object in question
   * @param  type The type to check against
   * @return bool Returns true if types match
   */
  pbjs.isType = function (obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
  };

  pbjs.isString = function (obj) {
    return this.isType(obj, "string");
  };

  pbjs.isArray = function (obj) {
    return this.isType(obj, "array");
  };

  pbjs.isNumber = function (obj) {
    return (/^\d+$/g.test(obj)
    );
  };

  pbjs.isConstructor = function (obj, type) {
    return obj && obj.constructor === type;
  };

  pbjs.isDOMElement = function (element) {
    return element && element.nodeType;
  };

  pbjs.addClass = function (element, classes, callback) {
    if (this.isDOMElement(element)) {
      if (this.isArray(classes)) {
        classes = classes.split(' ');
      } else {
        classes = [];
      }

      while (classes.length) {
        var cls = classes.pop();
        if (!element.classList.contains(cls)) {
          element.classList.add(new String(cls));
        }
      }
    }
  };

  pbjs.insertSubString = function (original, substring, position) {
    if (substring === pbjs.undefined) {
      return original;
    } else if (!pbjs.isNumber(position)) {
      return original + substring;
    }
    return [original.slice(0, position), substring, original.slice(position)].join('');
  };

  //pbjs.forecasts = function(name, callback, namespace) {
  //  if (!name)
  //};

  /**
   *  Defines and returns a new PBJS Object
   */
  //pbjs.pbjsObject = function(parent) {
  //  this.uniqueId = this.salt();
  //  if (parent && parent) {
  //
  //  }
  //  this.parent = parent || pbjs.undefined;
  //};
  //
  //pbjs.pbjsObject.prototype = {
  //  newObject: this.constructor,
  //  getUniqueId: function() {
  //    return this.uniqueId;
  //  },
  //  getParent: function() {
  //    return this.parent;
  //  }
  //};

  /**
   *  Keep a record of all objects created
   */
  //pbjs.ledger = function() {
  //  this.
  //};

  pbjs.extend = function (original, merging) {
    for (var prop in merging) {
      if (this.isType(merging[prop], "object")) {
        original[prop] = original[prop] || {};
        arguments.callee(original[prop], merging[prop]);
      } else {
        original[prop] = merging[prop];
      }
    }
    return original;
  };

  /**
   *  Define Array.prototype.indexOf if not already
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
   */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      var k;
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;

      if (len === 0) {
        return -1;
      }

      var n = +fromIndex || 0;

      if (Math.abs(n) === Infinity) {
        n = 0;
      }

      if (n >= len) {
        return -1;
      }
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      while (k < len) {
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  //var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  //pbjs.observer = function(callback) {
  //  values = {};
  //  return {
  //    new MutationObserver(callback);
  //  };
  //};

  /**
   *  Helper function for creating DOM elements
   */
  pbjs.createElement = function (type, properties) {
    type = type.toString() || this.undefined;
    if (type === this.undefined) {
      return false;
    }

    var element = document.createElement(type);
    var prop;
    if (properties !== undefined) {
      for (prop in properties) {
        if (this.isArray(properties[prop])) {
          properties[prop] = properties[prop].join(';');
        }
        element.setAttribute(prop, properties[prop]);
      }
    }

    return element;
  };

  /**
   *  Helper function for clearing an element's dataset
   */
  pbjs.clearDataset = function (element) {
    if (this.isType(element.dataset, "object")) {
      return false;
    }

    var prop;
    for (prop in element.dataset) {
      delete element.dataset[prop];
    }
  };

  pbjs.isVowel = function (character) {
    if (character === this.undefined) {
      return false;
    }
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    var prop;
    for (prop in vowel) {
      if (vowel[prop] === character) {
        return prop;
      }
    }
    return false;
  };

  /**
   *  Error Handler
   *  @param {string} module    The module the error originated
   *  @param {string} reason    Human-readable error message
   *  @param {string} expected  String representation of the expected type
   *  @param {mixed}  received  The object provided
   */
  pbjs.error = function (module, reason, received, expected) {
    var offense = "";
    reason = reason || "No reason provided";

    // Check if we have the details
    if (received && expected) {
      offense = " Expected '" + expected + "', given '" + received + "'.";
    } else if (received) {
      offense = " Given '" + received + "'.";
    }

    // Tell the user where the error comes from
    if (module && this.isConstructor(module, String)) {
      module = module[0].toUpperCase() + module.slice(1);
    } else {
      module = "(Internal Error)";
    }

    // DANGER!
    throw new Error("PB&Js " + module + ": An error occurred with the following message: " + reason + "." + offense);
  };
})(window, document, undefined);

/*
make a xhr class -> html rest class -> form builder
                                    -> get
                                    -> post
*/
/**
 *  PB&Js | /pb.box.js
 *  Author: Patrick Barnum
 *  Description: Creates a manipulative pop up box.
 *  License: NULL
 */

(function (window) {

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  /**
   *  Private variables
   */
  var manager;
  var instance;
  var current;
  var boxes;

  /**
   *  Constructor
   */
  pbjs.box = function (options) {
    // Singleton
    if (pbjs.isArray(boxes)) {
      return this.create(options);
    }

    // Initialize global variables
    var manager = {
      boxes: [],
      current: null,

      /**
       * Returns a new id
       * @return  int     id
       */
      nextId: function () {
        var id = 1;
        if (this.boxes.length <= 0) return id;else for (var i in this.boxes) if (this.boxes[i].id > id) id = this.boxes[id].id;
        return id + 1;
      },

      /**
       * Get a box by its id
       * @param   int     id
       * @return  Object  The box
       */
      getBoxById: function (id) {
        for (var i in this.boxes) if (this.boxes[i].id == id) return this.boxes[i];
        return null;
      },

      /**
       * Sets the id of the current box
       * @param   int     id
       */
      setCurrent: function (id) {
        if (this.boxes.length <= 0) this.current = null;
        var box = this.getBoxById(id);
        if (box) this.current = box.id;else this.current = this.boxes[this.boxes.length - 1].id;
      },

      /**
       * Adds the box to the current set of boxes and adds
       * its element to the DOM
       */
      addBox: function (box) {
        ContentBox.prototype.created = true;
        this.boxes.push(box);
        this.setCurrent(box.id);
        document.body.appendChild(box.element);
      },

      /**
       * Removes a box from the manager and the DOM using its id
       * @param   int     The box id
       */
      removeBox: function (id) {
        // Loop through all boxes
        var box = this.getBoxById(id);

        // Remove the box from the DOM
        box.element.parentNode.removeChild(box.element);

        // Set the new current box
        this.setCurrent();

        // Remove the box
        /*box.parent*/this.boxes.splice(this.boxes.indexOf(box), 1);
      },

      /**
       * Find the DOM's highest z-index and return it plus 1
       * @return  int     Highest z-index plus 1
       */
      findZIndex: function () {
        var highestZ = 100;
        var elements = document.getElementsByTagName('*');
        if (!elements.length) return highestZ;
        for (var i = 0; i < elements.length; ++i) {
          var z = parseInt(elements[i].style.zIndex);
          if (z > highestZ) highestZ = z;
        }
        return highestZ + 1;
      }
    };

    this.getManager = function () {
      return manager;
    };

    this.undefined = 'undefined';
    this.CLASSES = {
      CONTAINER: 'cBox-container',
      TITLE_BAR: 'cBox-titleBar',
      BODY: 'cBox-body',
      TITLE: 'cBox-title',
      BUTTON: 'cBox-button',
      CLOSE: 'cBox-close',
      RESIZE: 'cBox-resize',
      ACTION_BAR: 'cBox-actionBar'
    };

    // Create a box on initialization when options are present
    if (options) {
      this.create(options);
    }

    return this;
  };

  /**
   * Creates new box
   */
  pbjs.box.prototype.create = function (options) {
    // Set the local object variable
    var self = this;
    var existingBoxes = this.getManager().boxes;

    // Make sure the options are defined
    options = options || {};
    //options.parent = options.parent || null;
    options.isMovable = typeof options.isMovable !== this.undefined ? options.isMovable : true;
    options.isScalable = typeof options.isScalable !== this.undefined ? options.isScalable : true;
    options.buttons = options.buttons || {};
    options.height = options.height || 480;
    options.width = options.width || 680;
    options.title = options.title || 'Content Box';
    options.body = options.body || '';

    this.callbacks = {};
    this.callbacks.beforeCreate = options.beforeCreate;
    this.callbacks.afterCreate = options.afterCreate;
    this.callbacks.beforeClose = options.beforeClose;

    // Before Create callback
    if (typeof this.callbacks.beforeCreate === 'function') {
      this.callbacks.beforeCreate(existingBoxes);
    }

    // Create the box
    var box = {};
    box.id = this.getManager().nextId();
    //box.parent = options.parent;
    box.height = options.height;
    box.width = options.width;
    box.element = createElement('div', {
      'id': 'cBox-' + box.id,
      'class': this.CLASSES.CONTAINER,
      'style': ['z-index:' + this.getManager().findZIndex(), 'height:' + options.height + 'px', 'width:' + options.width + 'px', 'top:' + (window.innerHeight / 2 - options.height / 2) + 'px', 'left:' + (window.innerWidth / 2 - options.width / 2) + 'px']
    });

    // Set the z-index and current box on element mouse down event
    box.element.addEventListener('mousedown', function (e) {
      var lastBox = self.getCurrent();
      if (lastBox) {
        var swapZ = lastBox.element.style.zIndex;
        lastBox.element.style.zIndex = box.element.style.zIndex;
        box.element.style.zIndex = swapZ;
      }
      self.getManager().setCurrent(box.id);
    }, true);

    // Set a local variable for the box element
    var boxElement = box.element;

    // Create the title bar
    var titleBar = createElement('div', {
      'id': this.CLASSES.TITLE_BAR + '-' + box.id,
      'class': this.CLASSES.TITLE_BAR
    });
    titleBar.innerHTML = '<span class="' + this.CLASSES.TITLE + '">' + options.title + '</span>';

    var onDown = {};
    var onMove = {};
    var onUp = {};
    if (options.isMovable) {
      // Title bar mouse down event
      onDown = function (e) {
        titleBar.dataset.zIndex = boxElement.style.zIndex;
        titleBar.dataset.diffTop = boxElement.offsetTop - e.clientY;
        titleBar.dataset.diffLeft = boxElement.offsetLeft - e.clientX;
        titleBar.dataset.active = 'true';
        boxElement.style.zIndex = self.getManager().findZIndex();

        // Prevent selection when dragging
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      };

      // Window mouse move event
      onMove = function (e) {
        if (titleBar.dataset.active !== 'true') {
          return 0;
        }

        var boxTop = boxElement.offsetTop;
        var boxLeft = boxElement.offsetLeft;
        var boxBottom = boxElement.offsetTop + boxElement.offsetHeight;
        var boxRight = boxElement.offsetLeft + boxElement.offsetWidth;

        var finalTop = e.clientY + Number(titleBar.dataset.diffTop);
        var finalLeft = e.clientX + Number(titleBar.dataset.diffLeft);

        if (finalTop < 0) {
          finalTop = 0;
        }
        if (finalTop + boxElement.offsetHeight > window.innerHeight) {
          finalTop = window.innerHeight - boxElement.offsetHeight;
        }
        if (finalLeft < 0) {
          finalLeft = 0;
        }
        if (finalLeft + boxElement.offsetWidth > window.innerWidth) {
          finalLeft = window.innerWidth - boxElement.offsetWidth;
        }

        boxElement.style.top = finalTop + 'px';
        boxElement.style.left = finalLeft + 'px';
      };

      // Window mouse up event
      onUp = function (e) {
        boxElement.style.zIndex = Number(titleBar.dataset.zIndex);
        clearDataset(titleBar);
      };
    }

    // Add the title bar events and append to the box
    titleBar.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    box.element.appendChild(titleBar);

    // Create the body element
    var body = createElement('div', {
      'id': this.CLASSES.BODY + '-' + box.id,
      'class': this.CLASSES.BODY
    });
    if (typeof options.body === 'function') {
      options.body(body);
    } else {
      body.innerHTML = options.body;
    }
    box.element.appendChild(body);

    // Create the close button
    var closeButton = createElement('a', {
      'class': this.CLASSES.BUTTON + ' ' + this.CLASSES.CLOSE,
      'href': 'javascript:void(0);'
    });
    closeButton.addEventListener('click', function (e) {
      self.close();
    }, false);
    closeButton.innerHTML = 'Close';

    // Create the action bar to house the buttons
    var actionBar = createElement('div', {
      'id': this.CLASSES.ACTION_BAR + '-' + box.id,
      'class': this.CLASSES.ACTION_BAR
    });
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.appendChild(closeButton);
    ul.appendChild(li);

    // Loop through all defined buttons
    for (button in options.buttons) {
      var b = options.buttons[button];
      b.href = b.href || 'javascript:void(0);';
      var li = document.createElement('li');
      var tmpClass = '';
      if (b['class'] != this.undefined) {
        if (b['class'].constructor === Array) {
          b['class'] = b['class'].join(' ');
        }
        tmpClass = ' ' + b['class'];
      }

      var a = createElement('a', {
        'class': this.CLASSES.BUTTON + tmpClass,
        'href': b.href
      });
      a.innerHTML = b.text;
      li.appendChild(a);
      ul.appendChild(li);
    }

    // Append the button list to the action bar and the action bar to the box
    actionBar.appendChild(ul);
    box.element.appendChild(actionBar);

    // Define the box resize events
    if (options.isScalable) {
      // Create draggable corner object
      var resize = createElement('div', {
        'id': this.CLASSES.RESIZE + '-' + box.id,
        'class': this.CLASSES.RESIZE
      });

      resize.addEventListener('mousedown', function (e) {
        resize.dataset.oHeight = boxElement.offsetHeight;
        resize.dataset.oWidth = boxElement.offsetWidth;
        resize.dataset.initY = e.clientY;
        resize.dataset.initX = e.clientX;
        resize.dataset.active = 'true';

        // Prevent selection when dragging
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      });

      window.addEventListener('mousemove', function (e) {
        if (resize.dataset.active !== 'true') {
          return 0;
        }

        var boxHeight = boxElement.offsetHeight;
        var boxWidth = boxElement.offsetWidth;

        var finalHeight = e.clientY - resize.dataset.initY + Number(resize.dataset.oHeight);
        var finalWidth = e.clientX - resize.dataset.initX + Number(resize.dataset.oWidth);

        if (finalHeight < 100) {
          finalHeight = 100;
        }
        if (finalWidth < 200) {
          finalWidth = 200;
        }

        boxElement.style.height = finalHeight + 'px';
        boxElement.style.width = finalWidth + 'px';
      });

      window.addEventListener('mouseup', function (e) {
        clearDataset(resize);
      });

      box.element.appendChild(resize);
    }

    // Add the box to the manager/DOM
    this.getManager().addBox(box);

    // After Create callback
    if (typeof this.callbacks.afterCreate === 'function') {
      this.callbacks.afterCreate(box);
    }

    return box;
  };

  /**
   *  Get current box
   *  @return  Object  The current box
   */
  pbjs.box.prototype.getCurrent = function () {
    return this.getManager().getBoxById(this.getManager().current);
  };

  /**
   *  Removes the box from the DOM and the manager.
   */
  pbjs.box.prototype.close = function () {
    var box = this.getCurrent();

    // Before close callback
    if (typeof this.callbacks.beforeClose === 'function') {
      this.callbacks.beforeClose(box);
    }

    if (box) {
      this.getManager().removeBox(box.id);
    }
  };

  /**
   *  Returns the Box manager
   */
  function getManager() {
    return _manager;
  }

  /**
   *  Returns the current Box
   */
  function getCurrent() {
    return _current;
  }

  /**
   *  Sets the current Box
   */
  function setCurrent(current) {
    _current = current;
  }

  /**
   *  Returns a new id
   *  @return  int     id
   */
  function nextId() {
    var id = 1;
    if (_manager.boxes.length <= 0) {
      return id;
    } else {
      var i;
      for (i = 0; i < _manager.boxes.length; ++i) {
        if (_manager.boxes[i].id > id) {
          id = _manager.boxes[id].id;
        }
      }
      return id + 1;
    }
  }

  /**
   *  Get a box by its id
   *  @param   int     id
   *  @return  Object  The box
   */
  function getBoxById(id) {
    var i;
    for (i = 0; i < _manager.boxes.length; ++i) {
      if (_manager.boxes[i].id == id) {
        return _manager.boxes[i];
      }
    }
    return null;
  }

  /**
   *  Sets the id of the current box
   *  @param   int     id
   */
  function setCurrent(id) {
    if (this.boxes.length <= 0) {
      this.current = null;
    }
    var box = this.getBoxById(id);
    if (box) {
      this.current = box.id;
    } else {
      this.current = this.boxes[this.boxes.length - 1].id;
    }
  }

  /**
   *  Adds the box to the current set of boxes and adds
   *  its element to the DOM
   */
  function addBox(box) {
    this.boxes.push(box);
    this.setCurrent(box.id);
    document.body.appendChild(box.element);
  }

  /**
   *  Removes a box from the manager and the DOM using its id
   *  @param   int     The box id
   */
  function removeBox(id) {
    // Loop through all boxes
    var box = this.getBoxById(id);

    // Remove the box from the DOM
    box.element.parentNode.removeChild(box.element);

    // Set the new current box
    this.setCurrent();

    // Remove the box
    /*box.parent*/this.boxes.splice(this.boxes.indexOf(box), 1);
  }

  /**
   *  Find the DOM's highest z-index and return it plus 1
   *  @return  int     Highest z-index plus 1
   */
  function findZIndex() {
    var highestZ = 100;
    var elements = document.getElementsByTagName('*');
    if (!elements.length) {
      return highestZ;
    }
    for (var i = 0; i < elements.length; ++i) {
      var z = parseInt(elements[i].style.zIndex);
      if (z > highestZ) {
        highestZ = z;
      }
    }
    return highestZ + 1;
  }
})(window);

/**
 *  PB&Js | /pbjs.snippet.js
 *  Author: Patrick Barnum
 *  Description: Code display.
 *  License: NULL
 */

"use strict";

(function (window) {

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

  pbjs.snippet = function (selector, options) {
    options = _compileOptions(options);
    var elements = document.querySelectorAll(selector) || [];
    for (var i = 0; i < elements.length; ++i) {
      _formatter(elements[i], options);
    }
  };

  function _formatter(element, options) {
    var lines = element.innerHTML.toString().split("\n");
    var lineNumber = 1;
    var tbody = pbjs.createElement('table', { 'class': CLASSES.table });
    var tbody = pbjs.createElement('tbody');

    // Loop through all lines found
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i].trim();
      var tr = pbjs.createElement('tr', { 'class': CLASSES.tableRow });
      var elNumber = _buildLineNumber(lineNumber);
      var elCode = pbjs.createElement('td', { 'class': CLASSES.tableCol });

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
    var td = pbjs.createElement('td', { 'class': CLASSES.tableCol });
    var span = pbjs.createElement('span', { 'class': CLASSES.lineNumber });
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

/**
 *  PB&Js | /pbjs.tips.js
 *  Author: Patrick Barnum
 *  Description: Tooltips for any occasion.
 *  License: NULL
 */

(function (window) {

  var MODULE_NAME = "TIPS";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  pbjs.tips = function () {};
})(window);
/**
 *  PB&Js | /pb.tree.js
 *  Author: Patrick Barnum
 *  Description: TreeView object.
 *  License: NULL
 */

"use strict";

/**
 *  pbTree's constructor function
 *
 *  @param {Object} options User-defined options
 *  @return {Object} this (container element)
 */
(function (window) {

  var MODULE_NAME = "trees";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  // Singleton
  if (pbjs.trees && pbjs.trees.constructor === Object) {
    return pbjs.trees.createTree(id, options);
  }

  /**
   *  Class Node
   *  Objects holding generic information in a tree structure
   */
  var Node = function (parent, element, label, children) {
    this.id = pbjs.salt();
    this.parent = this.validateParent(parent);
    this.element = pbjs.undefined;
    this.label = label || "";
    this.children = pbjs.undefined;
    this.opened = false;
    this.expandable = false;
    this.isLeaf = false;

    if (pbjs.isDOMElement(element)) {
      this.element = element;
    }

    if (pbjs.isArray(children)) {
      this.children = children;
    }
  };

  Node.prototype = {
    /**
     *  Is Open
     *  Checks if this Node is open
     *  @return {bool}
     */
    isOpen: function () {
      return this.opened;
    },

    /**
     *  Set Open
     *  Sets the Node either opened or closed
     *  @return null
     */
    setOpen: function (open) {
      this.opened = open;
    },

    /**
     *  Is Parent
     *  Checks if this is a parent Node
     *  @return {bool}
     */
    isParent: function () {
      return pbjs.isArray(this.children) && this.children.length > 0;
    },

    /**
     *  Validate Parent
     *  Returns the parent if the constructor is of type Node or pbjs.undefined
     *  @return {Node}  parent
     */
    validateParent: function (parent) {
      if (parent instanceof Node) {
        return parent;
      }
      return pbjs.undefined;
    },

    /**
     *  Get Node Parent
     *  Returns the parent Node
     *  @return {Node}  parent
     */
    getParent: function () {
      return this.parent;
    },

    /**
     *  Set Node Parent
     *  Sets the parent Node
     *  @return null
     */
    setParent: function (parent) {
      this.parent = this.validateParent(parent);
    },

    /**
     *
     */
    pushChildNode: function (node) {
      this.children = pbjs.isConstructor(this.children, Array) ? this.children : [];
      this.children.push(node);
    },

    /**
     *
     */
    popChildNode: function () {
      if (pbjs.isConstructor(this.children, Array) && this.children.length > 0) {
        return this.children.pop();
      }
      return pbjs.undefined;
    }

  };

  // Declare the Trees object
  pbjs.trees = function (id) {
    if (id && this.hasTree != pbjs.undefined && this.hasTree(id)) {
      return this.getTree(id);
    }

    // Array of trees
    this.forest = [];
    this._isValid = function () {
      return pbjs.isType(this.forest, "array");
    };

    return this;
  };

  /**
   *  Get all Trees
   *  Checks if the node contains any child Nodes
   *  @return {Boolean} parent
   */
  pbjs.trees.prototype.getAllTrees = function () {
    return pbjs.trees.container;
  };

  pbjs.trees.prototype.getTree = function (treeId) {
    var self = this;
    return function () {
      if (!pbjs.isArray(self.forest)) {
        return false;
      }

      var i = 0;
      for (i; i < self.forest.length; ++i) {
        if (self.forest[++i] && self.forest[i].id == treeId) {
          return this.forest[i];
        }
      }
    };
  };

  /**
   *  Is this a Tree?
   *  @param  {string}  id The id of the Tree object
   *  @return {bool}
   */
  pbjs.trees.prototype.isTree = function (id) {
    return pbjs.trees.forest[id] instanceof pbjs.trees.tree;
  };

  /**
   *  New Tree object
   *  Creates a new Tree object, adding to the "Forest"
   *  @param  {String}  id  The id of a DOM element
   *  @param  {Object}  options  The new Tree's options
   */
  pbjs.trees.prototype.createTree = pbjs.trees.tree = function (elementId, options) {
    // Id must be present, and is found in the DOM, so we know where to build
    this.container = document.getElementById(elementId);
    if (!pbjs.isDOMElement(this.container)) {
      pbjs.error(MODULE_NAME, "Could not initiate a new Tree object with the given element Id", elementId);
    }

    var self = this;

    /****************************************************************
     *                      Private Methods                         *
     ****************************************************************/
    /**
     * function searchTree ()
     *
     * Search function using Regex (search via node id AND node link text)
     */
    var searchTree = function () {
      var numOfResults, totalCount;

      this.root.find('a').closest('li').each(function () {
        searchArray.push($(this).clone());
      });

      totalCount = searchArray.length;

      $(options.search.selector).keyup(function (e) {
        // Shift code
        if (e.which === 16) {
          return false;
        }

        // Maybe without the \b boundary \b ???
        //var regStr;
        //if(String.fromCharCode(e.which) == '.')
        //{
        //    regStr = '^(?=.*?\\b(?:'+ this.value + '\\' + String.fromCharCode(e.which);
        //}
        //else
        //{
        //    regStr = '^(?=.*?\\b(?:'+ this.value + String.fromCharCode(e.which);
        //}
        //
        //// Slice off the capital letter of value entered and add the end boundary
        //regStr = regStr.slice(0, -1);
        //regStr = regStr +')+\\b)';
        //
        //// Replace any instance of a space with a new regex word boundary
        //regStr = regStr.replace(' ', ')+\\b)(?=.*?\\b(?:');

        var regStr;
        if (String.fromCharCode(e.which) == '.') {
          regStr = this.value + '\\' + String.fromCharCode(e.which);
        } else {
          regStr = this.value + String.fromCharCode(e.which);
        }

        var regex = new RegExp(regStr.slice(0, -1), 'ig');
        var $results = [];
        numOfResults = 0;

        $.each(searchArray, function () {
          var id = $(this).attr('id'),
              $link = $(this).find('a');

          if (id !== pbjs.undefined && id.match(regex) || $link.length > 0 && $link.text().match(regex)) {
            $results.push($(this));
            ++numOfResults;
          }
        });

        // If user provides a callback, return the results and how many
        if (options.search.callback && typeof options.search.callback === 'function') {
          options.search.callback($results, numOfResults, totalCount);
        }
      });
    };

    /**
     * function _showAll ()
     *
     * Open all of the nodes and show all of the lists.
     */
    var _showAll = function (node) {
      if (!(node instanceof Node) || !node.children) {
        return;
      }
    };

    /**
     * function _hideAll ()
     *
     * Close all of the nodes and hide all of the lists (except for root).
     */
    var _hideAll = function () {
      this.root.find('li.pbTree-subRoot').removeClass('pbTree-opened').addClass('pbTree-closed');
      this.root.find('ul').hide();
    };

    /**
     * function _ecButtons ()
     *
     * Define and add listeners to the expand/collapse links
     */
    var _ecButtons = function () {
      var obj = {};
      obj.container = pbjs.trees.tree._objects.expandCollapse;

      // The container must make room for the expand/collapse element
      this.container.style.paddingBottom = obj.container.style.offsetHeight;

      obj.expand = pbjs.createElement("a", {
        "class": "pbjs-tree-expand"
      });
      obj.collapse = pbjs.createElement("a", {
        "class": "pbjs-tree-collapse"
      });

      obj.expand.addEventListener("click", function () {
        pbjs.trees.tree.showAllNodes();
        return false; // disable default 'a' tag action
      });

      obj.collapse.addEventListener("click", function () {
        pbjs.trees.tree.hideAllNodes();
        return false; // disable default 'a' tag action
      });

      //obj.expand.addEventListener("click", function() {
      //  _showAll();
      //
      //  if (pbjs.trees.options.select.enable && pbjs.tree.) {
      //    this._objects.selected.show().css(_setSelTop());
      //  }
      //
      //  return false;
      //});

      //var $collapseAll = this._objects.expandCollapse.find('.pbTree-collapseAll')
      //.click(function() {
      //  _hideAll();
      //  nodes.root.animate({scrollTop: 0}, 10);
      //
      //  // Position the links back into frame
      //  this._objects.expandCollapse.css('bottom', 0);
      //
      //  if (options.select.enable) {
      //    this._objects.selected.hide();
      //  }
      //
      //  return false;
      //});

      obj.container.appendChild(obj.expand);
      obj.container.appendChild(obj.collapse);
      return obj;
    };

    /**
     * function _setState( object $this )
     *
     * Switch between opened and closed classes
     * @param {Object} $this
     */
    var _setState = function ($this) {
      $this.each(function () {
        $(this).toggleClass('pbTree-opened').toggleClass('pbTree-closed');

        if ($(this).hasClass('pbTree-opened')) {
          $(this).find('ul:first').show();
        } else {
          $(this).find('ul:first').hide();
        }
      });
    };

    /**
     * function _setSelTop ()
     * Set the top of the selected div to the top of the clicked node.
     *
     * @return {Object} The top position of the selected node.
     */
    var _setSelTop = function () {
      // If the node is already selected (searched for), highlight it
      if ($('a.pbTree-current').length > 0 && this.root.is(':visible')) {
        return {
          top: parseInt($('a.pbTree-current').position().top + this.root.position().top + nodes.root.scrollTop()),
          width: nodes.root[0].scrollWidth
        };
      }
      // Otherwise highlight the clicked node
      else {
          return {
            top: parseInt($('a.pbTree-current').position().top + nodes.root.scrollTop()),
            width: nodes.root[0].scrollWidth,
            display: 'none'
          };
        }
    };

    /**
     * _setDefaults ( options )
     *
     * Define and extend all default settings.
     *
     * @param {Object} options
     * @return {Object} options
     */
    var _setDefaults = function (options) {
      return pbjs.extend(options, {
        // "Expand/Collapse" all nodes
        "ecButtons": {
          "enable": true
          //showDefault: {
          //    show: true,
          //    class: pbjs.undefined
          //},
          //selector: pbjs.undefined
        },

        // Add a hover indicator
        "hover": {
          "enable": true
        },

        // Search box defaults
        "search": {
          "enable": false,
          "selector": pbjs.undefined,
          "callback": pbjs.undefined
        },

        // Add a selected indicator
        "select": {
          "enable": true
        },

        // Hide all nodes from the start
        "showall": false,

        // Indicate that the node has a child
        "showoccupied": {
          "enable": true,
          "style": {
            "fontWeight": "bold",
            "color": "#000000"
          }
        },

        // Add a tooltip to hover above the mouse
        "tooltip": {
          "enable": true,
          "offsetX": 10,
          "offsetY": 10
        }
      });
    };

    /**
     *  Grow the Tree Recursively
     *  Helper method for {@link #_growTree}
     *  @param Node parentNode Parent of the new Node object
     */
    var _growTreeRecursive = function (parentNode) {
      var parentNodeChildren = pbjs.undefined;
      var elementChildNodes;
      var node;
      var ul;
      var li;
      var i;
      var j;
      // get text node...
      if (parentNode instanceof Node && pbjs.isDOMElement(parentNode.element) && parentNode.element.children.length > 0) {
        // Loop through each LI element
        elementChildNodes = parentNode.element.children;
        for (i = 0; i < elementChildNodes.length; ++i) {
          node = new Node(parentNode, elementChildNodes[i]);
          li = elementChildNodes[i];
          ul = pbjs.undefined;

          // if(!$(this).children().is('a')) {
          //   $(this).addClass('pbTree-subRoot');

          //   if (!options._showAll) {
          //     $(this).children('ul').hide();
          //     $(this).addClass('pbTree-closed');
          //   }
          //   else {
          //     $(this).addClass('pbTree-opened');
          //   }
          // }

          // Loop through LI's children
          for (j = 0; j < li.children.length; ++j) {
            if (li.children[j].tagName == "SPAN") {
              node.label = li.children[j];
            } else if (li.children[j].tagName == "UL") {
              var childNode = _growTreeRecursive(new Node(node, li.children[j]));
              node.pushChildNode(childNode.children);
            } else if (li.children[j].tagName == 'A') {
              node.isLeaf = true;
            }
          }

          // Finally, add the node to the parent's children
          parentNode.pushChildNode(node);
        }
      }

      return parentNode;
    };

    /**
     *  Grow the Tree
     *  Breaks down the children DOM Elements provided by this.container
     */
    var _growTree = function (container) {
      var rootLevelNodes = container && container.children ? container.children : [];
      var i;
      for (i = 0; i < rootLevelNodes.length; ++i) {
        if (rootLevelNodes[i].tagName == "UL") {
          return _growTreeRecursive(new Node(pbjs.undefined, rootLevelNodes[i]));
        }
      }

      return new Node();
    };

    /**
     *  Grow the Tree Extras
     *  Creates and prepares the Tree's extra functionality
     *  @return Object The container object for all extras
     */
    var _getTreeExtras = function (options) {
      var _objects = {};

      // if (options) {
      //   if (options.tooltip.enabled) {
      //     if (pbjs.isModuleLoaded("tooltip")) {
      //       _objects.tooltip = pbjs.getModule(this.IDs.IDS.TOOLTIP);
      //     } else {
      //       _objects.tooltip = document.getElementById(this.IDs.IDS.TOOLTIP) || pbjs.createElement("div", {
      //         "id": this.IDs.IDS.TOOLTIP
      //       });
      //     }
      //   } else {
      //     _objects.tooltip = pbjs.undefined;
      //   }

      //   if (options.highlighter.enabled) {
      //     if (pbjs.isModuleLoaded("highlighter")) {
      //       _objects.highlighter = pbjs.getModule(this.IDs.IDS.HIGHLIGHTER);
      //     } else {
      //       _objects.highlighter = document.getElementById(this.IDs.IDS.HIGHLIGHTER) || pbjs.createElement("div", {
      //         "id": this.IDs.IDS.HIGHLIGHTER
      //       });
      //     }
      //   } else {
      //     _objects.highlighter = pbjs.undefined;
      //   }

      //   if (options.selected.enabled) {
      //     _objects.selected = document.getElementById(this.IDs.IDS.SELECTED) || pbjs.createElement("div", {
      //       "id": this.IDs.IDS.SELECTED
      //     });
      //   } else {
      //     _objects.selected = pbjs.undefined;
      //   }

      //   if (options.expandCollapse.enabled) {
      //     _objects.expandCollapse = document.getElementById(this.IDs.IDS.EXPANDCOLLAPSE) || pbjs.createElement("div", {
      //       "id": this.IDs.IDS.EXPANDCOLLAPSE
      //     });
      //   } else {
      //     _objects.expandCollapse = pbjs.undefined;
      //   }

      //   if (options.search.enabled) {
      //     if (pbjs.isModuleLoaded("search")) {
      //       _objects.search = pbjs.getModule(this.IDs.IDS.SEARCH);
      //     } else {
      //       _objects.search = document.getElementById(this.IDs.IDS.SEARCH) || pbjs.createElement("input", {
      //         "id": this.IDs.IDS.SEARCH,
      //         "type": "text",
      //         "placeholder": "Search..."
      //       });

      //       // Find out if the user has a search input or if we need to create one
      //       if (pbjs.isConstructor(options.search.selector, String) && parseInt(options.search.selector.length) > 0) {
      //         _extrasSearchTree();
      //       }
      //     }
      //   } else {
      //     _objects.search = pbjs.undefined;
      //   }
      // }

      return _objects;
    };
    /****************************************************************
     *                     /Private Methods                         *
     ****************************************************************/

    // Build the Node system for the Tree object
    this.root = _growTree(this.container);
    console.log(this.root);

    // Define all Tree extras
    this.options = _getTreeExtras(this.options);

    // Open node when requested
    if (options.showoccupied.enable) {
      _showAll();
    }

    // Add click listeners to each link
    // this.root.find('a').each(function()
    // {
    //   $(this).click(function()
    //   {
    //     if($('a.pbTree-current').length > 0)
    //     $('a.pbTree-current').removeClass('pbTree-current').removeAttr('style');

    //     if(options.showoccupied.enable)
    //     $(this).css(options.showoccupied.style);

    //     $(this).addClass('pbTree-current');
    //     if(options.select.enable)
    //     {
    //       this._objects.selected.show().css(_setSelTop());
    //     }
    //   });
    // });

    // User clicks on a node
    // this.root.click(function(e) {
    //   if ((this.root.has(e.target).length > 0 && $(e.target).hasClass('pbTree-subRoot')) || e.target) {
    //     var eNode = $(e.target);
    //     if(eNode.hasClass('pbTree-opened')) {
    //       _setState(eNode);

    //       if(options.select.enable && eNode.find('a.pbTree-current').length > 0)
    //       this._objects.selected.hide();
    //     }
    //     else {
    //       _setState(eNode);

    //       if(options.select.enable && eNode.find('a.pbTree-current').length > 0 && eNode.find('li.pbTree-closed').length <= 0) {
    //         this._objects.selected.css(_setSelTop()).show();
    //       }
    //     }
    //   }
    // })

    // // User moused-over a node
    // .mousemove(function(e) {
    //   if (options.hover.enable && this.root.has(e.target).length > 0 && ($(e.target).is('li') || $(e.target).is('a'))) {
    //     this._objects.highlighter.show().css({
    //       top: $(e.target).position().top + this.root.position().top + nodes.root.scrollTop(),
    //       width: nodes.root[0].scrollWidth
    //     });

    //     // Add the tool tip if enabled
    //     if (options.tooltip.enable) {
    //       var tex = $(e.target).text().split('\n')[0];
    //       this._objects.tooltip.text(tex).css({
    //         top: e.clientY + $(window).scrollTop() - options.tooltip.offsetY - this._objects.tooltip.outerHeight() + 'px',
    //         left: e.clientX - options.tooltip.offsetX + 'px'
    //       }).show();
    //     }
    //   }
    // })

    // // User left the node
    // .mouseleave(function() {
    //   if (options.hover.enable && options.tooltip.enable) {
    //     this._objects.highlighter.hide();
    //     this._objects.tooltip.hide();
    //   }
    // });

    // // User is scrolling through the container
    // nodes.root.scroll(function() {
    //   // Only show the selected div if the path is opened
    //   if (options.select.enable && $('a.pbTree-current').length > 0 && $('a.pbTree-current').parents('li.pbTree-closed').length <= 0) {
    //     this._objects.selected.css(_setSelTop()).show();
    //   }

    //   if (options.ecButtons.enable) {
    //     this._objects.expandCollapse.css({
    //       bottom: -(nodes.root.scrollTop()),
    //       left: nodes.root.scrollLeft()
    //     });
    //   }
    // });

    // this.root.show();

    // pbjs.trees.addTree(this);
    return this;
  };

  /**
   * $.fn.pbTree.findOne ( string id, bool hide )
   *
   * Select a specific node based its id
   *
   * @param {String} id
   * @param {Boolean} hide
   * @return {Object} this
   */
  pbjs.trees.tree.findNode = function (id, hide) {
    var $node = $('#' + id);

    if ($node.length > 0) {
      // Default is to hide everything except the query
      if (!hide || typeof hide !== 'boolean') {
        hide = true;
      }

      // Hide all if applicable
      if (hide) {
        _hideAll();
      }

      if ($('a.pbTree-current').length > 0) {
        $('a.pbTree-current').removeClass('pbTree-current');
      }

      $node.parentsUntil('ul.pbTree-root').show().addClass('pbTree-opened');

      // Select the node
      $node.children('a').addClass('pbTree-current').trigger('click');

      if (options.select.enable) {
        //<-- Can't figure out how to use the width of a hidden element
        this._objects.selected.hide().css(_setSelTop()).show();
      }
      return this;
    }

    return false;
  };

  /**
   *  Show All Nodes
   *  Opens all nodes and their children
   *  @return {int} The number of nodes affected
   */
  pbjs.trees.tree.prototype.showAllNodes = function () {
    var counter = 0;
    pbjs.trees.treeWalkRecursive(this, function (node) {
      if (!node.isVisible) {
        ++counter;
        node.setVisibility(true);
      }
    });

    if (this.options.select.enable) {
      this._objects.selected.setPosition();
    }
  };

  /**
   *  PB&Js Router Stuff
   *  {@link #pbjsRouter PBJS Router}
   *
   *  These callback methods will expose the functionality of the Tree for the PBJS CommuniKAY module.
   */
  /*var myRouter = new pbjs.router.newRouter();
  myRouter.get = function(callback) {
    if (!callback || pbjs.isConstructor(callback, Function)) {
      pbjs.error("Get requires a callback function, otherwise, why get the data?");
    }
    };
    // Final step for the router - register the Module
  pbjs.registerModule(MODULE_NAME, myRouter);*/
})(window);