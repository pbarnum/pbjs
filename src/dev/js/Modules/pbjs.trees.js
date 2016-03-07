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
(function(window) {

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
  var Node = function(parent, element, label, children) {
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
    isOpen: function() {
      return this.opened;
    },

    /**
     *  Set Open
     *  Sets the Node either opened or closed
     *  @return null
     */
    setOpen: function(open) {
      this.opened = open;
    },

    /**
     *  Is Parent
     *  Checks if this is a parent Node
     *  @return {bool}
     */
    isParent: function() {
      return pbjs.isArray(this.children) && this.children.length > 0;
    },

    /**
     *  Validate Parent
     *  Returns the parent if the constructor is of type Node or pbjs.undefined
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
     *  Returns the parent Node
     *  @return {Node}  parent
     */
    getParent: function() {
      return this.parent;
    },

    /**
     *  Set Node Parent
     *  Sets the parent Node
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


  // Declare the Trees object
  pbjs.trees = function(id) {
    if (id && this.hasTree != pbjs.undefined && this.hasTree(id)) {
      return this.getTree(id);
    }

    // Array of trees
    this.forest = [];
    this._isValid = function() {
      return pbjs.isType(this.forest, "array");
    };

    return this;
  };

  /**
   *  Get all Trees
   *  Checks if the node contains any child Nodes
   *  @return {Boolean} parent
   */
  pbjs.trees.prototype.getAllTrees = function() {
    return pbjs.trees.container;
  };

  pbjs.trees.prototype.getTree = function(treeId) {
    var self = this;
    return (function() {
      if (!pbjs.isArray(self.forest)) {
        return false;
      }

      var i = 0;
      for (i; i < self.forest.length; ++i) {
        if (self.forest[++i] && self.forest[i].id == treeId) {
          return this.forest[i];
        }
      }
    });
  };
  
  /**
   *  Is this a Tree?
   *  @param  {string}  id The id of the Tree object
   *  @return {bool}
   */
  pbjs.trees.prototype.isTree = function(id) {
    return pbjs.trees.forest[id] instanceof pbjs.trees.tree;
  };

  /**
   *  New Tree object
   *  Creates a new Tree object, adding to the "Forest"
   *  @param  {String}  id  The id of a DOM element
   *  @param  {Object}  options  The new Tree's options
   */
  pbjs.trees.prototype.createTree = pbjs.trees.tree = function(elementId, options) {
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
    var searchTree = function() {
      var numOfResults,
      totalCount;

      this.root.find('a').closest('li').each(function() {
        searchArray.push($(this).clone());
      });

      totalCount = searchArray.length;

      $(options.search.selector).keyup(function(e) {
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
        }
        else {
          regStr = this.value + String.fromCharCode(e.which);
        }

        var regex = new RegExp(regStr.slice(0, -1), 'ig');
        var $results = [];
        numOfResults = 0;

        $.each(searchArray, function() {
          var id = $(this).attr('id'),
          $link = $(this).find('a');

          if ((id !== pbjs.undefined && id.match(regex)) || ($link.length > 0 && $link.text().match(regex))) {
            $results.push($(this));
            ++numOfResults;
          }
        });

        // If user provides a callback, return the results and how many
        if (options.search.callback && typeof options.search.callback === 'function'){
          options.search.callback($results, numOfResults, totalCount);
        }
      });
    };

    /**
     * function _showAll ()
     *
     * Open all of the nodes and show all of the lists.
     */
    var _showAll = function(node) {
      if (!(node instanceof Node) || !node.children ) {
        return;
      }
    };

    /**
     * function _hideAll ()
     *
     * Close all of the nodes and hide all of the lists (except for root).
     */
    var _hideAll = function() {
      this.root.find('li.pbTree-subRoot').removeClass('pbTree-opened').addClass('pbTree-closed');
      this.root.find('ul').hide();
    };

    /**
     * function _ecButtons ()
     *
     * Define and add listeners to the expand/collapse links
     */
    var _ecButtons = function() {
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

      obj.expand.addEventListener("click", function() {
        pbjs.trees.tree.showAllNodes();
        return false; // disable default 'a' tag action
      });

      obj.collapse.addEventListener("click", function() {
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
    var _setState = function($this) {
      $this.each(function() {
        $(this).toggleClass('pbTree-opened').toggleClass('pbTree-closed');

        if ($(this).hasClass('pbTree-opened')) {
          $(this).find('ul:first').show();
        } else {
          $(this).find('ul:first').hide();
        }
      });
    }

    /**
     * function _setSelTop ()
     * Set the top of the selected div to the top of the clicked node.
     *
     * @return {Object} The top position of the selected node.
     */
    var _setSelTop = function() {
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
    var _setDefaults = function(options) {
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
    var _growTreeRecursive = function(parentNode) {
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
    var _growTree = function(container) {
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
    var _getTreeExtras = function(options) {
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
  pbjs.trees.tree.findNode = function(id, hide) {
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

      if (options.select.enable) { //<-- Can't figure out how to use the width of a hidden element
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
  pbjs.trees.tree.prototype.showAllNodes = function() {
    var counter = 0;
    pbjs.trees.treeWalkRecursive(this, function(node) {
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
