/**
 *  PB&Js | pb.core.js
 *  Author: Patrick Barnum
 *  Description: Core functionality and namespace creation for the PB&Js suite
 *  License: NULL
 */

"use strict";

(function(window, document, undefined) {

  // Create the global object
  window.pbjs = function() {};
  pbjs.core = function() {};
  pbjs.undefined = undefined;

  /**
   *  
   */
  pbjs.pbjsObject = function(id) {
    this.id = "";
    if (id && parseInt(id.length) > 0) {
      this.id = id;
    } else {
      this.id = this.salt();
    }
    return this;
  };

  /**
   *  Builds and returns a new pbjsObject id
   */
  pbjs.pbjsObject.prototype.salt = function(len) {
    var salt = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var length = 8;
    var str = "";
    var i = 0;

    // If the user's length is within reason, use it!
    if (parseInt(len) === len && len > 7 && len < 64) {
      length = len;
    }

    for (i; i < length; ++i) {
      str += salt[parseInt(Math.random(0, salt.length))];
    }

    return str;
  };

  /**
   *  Defines and returns a new PBJS Object
   */
  pbjs.pbjsObject = pbjs.pbjsObject.newObject = function(id) {
    this.id = id || pbjs.pbjsObject.salt(8);
  };

  /**
   *  Keep a record of all objects created
   */
  pbjs.ledger = function() {
      return this.ledger || [];
    };
  
    pbjs.ledger.get
  };

  pbjs.extend = function(original, merging) {
    for (var prop in merging) {
      if (merging[prop] && merging[prop].constructor && merging[prop].constructor === Object) {
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
  
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  pbjs.observer = function(callback) {
    values = {};
    return {
      new MutationObserver(callback);
    };
  };

  /**
   *  Helper function for creating DOM elements
   */
  pbjs.createElement = function (type, properties) {
    if (type.constructor !== String) {
      return false;
    }

    var element = document.createElement(type);
    var prop;
    if (properties !== undefined) {
      for (prop in properties) {
        if (properties[prop].constructor === Array) {
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
    if ((element.constructor && element.dataset.constructor) !== Object) {
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
  
  pbjs.error = function (addonName, reason) {
    reason = reason || "No reason provided";
    throw new Error("PB&JS"+ addonName +": An error occurred with the following message: "+ reason +".");
  };

})(window, document, undefined);



/*
make a xhr class -> html rest class -> form builder
                                    -> get
                                    -> post
*/