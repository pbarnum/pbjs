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