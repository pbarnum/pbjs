/**
 *  PB&Js | /_constructor/bbst.js
 *  Author: Patrick Barnum
 *  Description: Balanced Binary Search Tree
 *  License: NULL
 */

"use strict";

(function(window) {

  var MODULE_NAME = "BBST";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  // Declare classes
  var BalancedBinarySearchTree;

  /**
   *  Class Node
   *  Objects holding generic information in a tree structure
   */
  balancedBinarySearchTree = function(userObject) {
    this.id = pbjs.salt();
    this.parent = this.validateParent(parent);
    this.element = pbjs.undefined;
    this.label = label || "";
    this.children = pbjs.undefined;
    this.opened = false;

    if (pbjs.isDOMElement(element)) {
      this.element = element;
    }

    if (pbjs.isArray(children)) {
      this.children = children;
    }
  };

  Node.prototype = {
    length: function() {
      return this.nodes.length;
    },

    /**
     *  Is Open
     *  @description  Checks if this Node is open
     *  @return {bool}
     */
    isEmpty: function() {
      return this.nodes.length == 0;
    },

    /**
     *  Set Open
     *  @description  Sets the Node either opened or closed
     *  @return null
     */
    push: function() {
      
    },

    pop: function() {

    },

    /**
     *  Get Node Parent
     *  @description  Returns the parent Node
     *  @return {Node}  parent
     */
    getParent: function() {
      return this.parent;
    },

    /**
     *  Set Node Parent
     *  @description  Sets the parent Node
     *  @return null
     */
    setParent: function(parent) {
      this.parent = this.validateParent(parent);
    },

    /**
     *
     */
    pushChildNode: function(node) {
      this.children = pbjs.isConstructor(this.children, Array) ? this.children: [];
      this.children.push(node);
    },

    /**
     *
     */
    popChildNode: function() {
      if (pbjs.isConstructor(this.children, Array) && this.children.length > 0) {
        return this.children.pop();
      }
      return pbjs.undefined;
    }

  };

})(window);
