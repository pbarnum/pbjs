/**
 *  PB&Js | /src/dev/_Constructor/pb.core.js
 *  Author: Patrick Barnum
 *  Description: Core functionality and namespace creation for the PB&Js suite
 *  License: NULL
 */

"use strict";

(function(window, document, undefined) {

  // Create the global object
  window.pbjs = function() {};  // Make pbjs a global object
  pbjs.core = function() {};    // Initialize the Core object
  pbjs.undefined = undefined;   // Create a globally common 'undefined'
  pbjs.NAME = "pbjs";
  pbjs.VERSION = "0.0.1";

  /**
   *  Builds and returns a new pbjsObject id
   */
  pbjs.salt = function(len) {
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
  pbjs.isType = function(obj, type) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
  };

  pbjs.isString = function(obj) {
    return this.isType(obj, "string");
  };

  pbjs.isArray = function(obj) {
    return this.isType(obj, "array");
  };

  pbjs.isNumber = function(obj) {
    return /^\d+$/g.test(obj);
  }

  pbjs.isConstructor = function(obj, type) {
    return obj && obj.constructor === type;
  };

  pbjs.isDOMElement = function(element) {
    return element && element.nodeType;
  };

  pbjs.addClass = function(element, classes, callback) {
    if (this.isDOMElement(element)) {
      if (this.isArray(classes)) {
        classes = classes.split(' ');
      }
      else {
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

  pbjs.insertSubString = function(original, substring, position) {
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

  pbjs.extend = function(original, merging) {
    for (var prop in merging) {
      if (this.isType(merging[prop], "object")) {
        original[prop] = original[prop] || {};
        arguments.callee(original[prop], merging[prop]);
      }
      else {
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
    Array.prototype.indexOf = function(searchElement, fromIndex) {
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
  }

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
  }

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
      offense = " Expected '"+ expected +"', given '"+ received +"'.";
    } else if (received) {
      offense = " Given '"+ received +"'.";
    }

    // Tell the user where the error comes from
    if (module && this.isConstructor(module, String)) {
      module = module[0].toUpperCase() + module.slice(1);
    } else {
      module = "(Internal Error)";
    }

    // DANGER!
    throw new Error("PB&Js "+ module +": An error occurred with the following message: "+ reason +"."+ offense);
  };

})(window, document, undefined);



/*
make a xhr class -> html rest class -> form builder
                                    -> get
                                    -> post
*/