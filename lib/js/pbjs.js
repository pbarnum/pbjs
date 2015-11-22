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