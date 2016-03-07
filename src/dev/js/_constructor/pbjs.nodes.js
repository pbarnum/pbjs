/**
 *  PB&Js | /_constructor/nodes.js
 *  Author: Patrick Barnum
 *  Description: Node object providing a base class.
 *  License: NULL
 */

"use strict";

/**
 *  @description pbTree's constructor function
 *
 *  @param {Object} options User-defined options
 *  @return {Object} this (container element)
 */
(function(window) {

  var MODULE_NAME = "nodes";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  // Declare classes
  var Node;

  /**
   *  Class Node
   *  Objects holding generic information in a tree structure
   */
  Node = function(parent, element, label, children) {
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
    /**
     *  Is Open
     *  @description  Checks if this Node is open
     *  @return {bool}
     */
    isOpen: function() {
      return this.opened;
    },

    /**
     *  Set Open
     *  @description  Sets the Node either opened or closed
     *  @return null
     */
    setOpen: function(open) {
      this.opened = open;
    },

    /**
     *  Is Parent
     *  @description  Checks if this is a parent Node
     *  @return {bool}
     */
    isParent: function() {
      return pbjs.isArray(this.children) && this.children.length > 0;
    },

    /**
     *  Validate Parent
     *  @description  Returns the parent if the constructor is of type Node or pbjs.undefined
     *  @return {Node}  parent
     */
    validateParent: function(parent) {
      if (parent instanceof Node) {
        return parent;
      }
      return pbjs.undefined;
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
