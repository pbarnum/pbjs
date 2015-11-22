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

  /**
   *  Helper function for creating DOM elements
   */
  pbjs.core.prototype.createElement = function (type, properties) {
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
  pbjs.core.prototype.clearDataset = function (element) {
    if ((element.constructor && element.dataset.constructor) !== Object) {
      return false;
    }

    var prop;
    for (prop in element.dataset) {
      delete element.dataset[prop];
    }
  }

})(window, document, undefined);
