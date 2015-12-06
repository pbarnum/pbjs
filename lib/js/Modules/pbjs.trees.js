/**
 *  PB&Js | /pb.tree.js
 *  Author: Patrick Barnum
 *  Description: TreeView object.
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

  var MODULE_NAME = "trees";

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    pbjs.error(MODULE_NAME, "PBJS does not exist!");
  }

  // Singleton
  if (pbjs.trees.constructor === Object) {
    return pbjs.trees.createTree(id, options);
  }

  // Declare classes
  var Tree;
  var Node;

  /**
   *  Class Node
   *  @description Objects holding information for every Tree item
   */
  Node = function(parent, element, label, children) {
    this.id = pbjs.salt();
    this.parent = this.validateParent(parent);
    this.element = pbjs.undefined;
    if (pbjs.isDOMElement(element)) {
      this.element = element;
    }

    this.label = label;

    this.children = pbjs.undefined;
    if (pbjs.isConstructor(this.children, Array)) {
      this.children = children;
    }
  };

  Node.prototype = {

    /**
     *  Validate Parent
     *  @description  Returns the parent if the constructor is of type Node or pbjs.undefined
     *  @return {Node}  parent
     */
    "validateParent": function(parent) {
      if (pbjs.isConstructor(parent, Node)) {
        return parent;
      }
      return pbjs.undefined;
    },

    /**
     *  Get Node Parent
     *  @description  Returns the parent Node
     *  @return {Node}  parent
     */
    "getParent": function() {
      return this.parent;
    },

    /**
     *  Set Node Parent
     *  @description  Sets the parent Node
     *  @return null
     */
    "setParent": function(parent) {
      this.parent = this.validateParent(parent);
    },

    /**
     *  Node has Children
     *  @description  Checks if the node contains any child Nodes
     *  @return {boolean} parent
     */
    "hasChildren": function() {
      return pbjs.isConstructor(this.children, Array) && this.children.length > 0;
    },

    /**
     *
     */
    "pushChildNode": function(node) {
      this.children = pbjs.isConstructor(this.children, Array) ? this.children: [];
      this.children.push(node);
    },

    /**
     *
     */
    "popChildNode": function() {
      if (pbjs.isConstructor(this.children, Array) && this.children.length > 0) {
        return this.children.pop();
      }
      return pbjs.undefined;
    }

  };

  /**
   *  Get all Trees
   *  @description  Checks if the node contains any child Nodes
   *  @return {Boolean} parent
   */
  pbjs.trees.getAllTrees = function() {
    return trees;
  };

  /**
   *  New Tree object
   *  @description   Creates a new Tree object, adding to the Forest
   *  @param  {String}  id  The id of a DOM element
   *  @param  {Object}  options  The new Tree's options
   */
  pbjs.trees.createTree = pbjs.trees.tree =  function(id, options) {

    this.container = document.getElementById(id);

    // Id must be present, and is found in the DOM, so we know where to build
    if (!pbjs.isConstructor(this.container, String)) {
      pbjs.error("Trees");
    }

    // Check if this tree exists
    if (pbjs.trees.hasTree(id)) {
      return pbjs.trees.getTree(id);
    }

    this.id = id;
    this.root;

    // Define DOM classes
    this.IDs = {
      "ID": {
        "TOOLTIP": "pbjs-tooltip",
        "HIGHLIGHTER": "pbjs-highlighter",
        "SELECTED": "pbjs-tree-selected",
        "SEARCH": "pbjs-tree-search",
        "EXPANDCOLLAPSE": "pbjs-tree-expandcollapse"
      }
      //,
      //"CLASSES": {
      //
      //}
    };

    // Build the Node system for the Tree object
    _growTree();


    // Define all Tree extras
    this._objects = _getTreeExtras();


    // Hide the tree until told otherwise
    //this.root.attr('id','pbTree-root').hide();
    _brandAll();


    // Add click listeners to each link
    this.root.find('a').each(function()
    {
      $(this).click(function()
      {
        if($('a.pbTree-current').length > 0)
        $('a.pbTree-current').removeClass('pbTree-current').removeAttr('style');

        if(options.showoccupied.enable)
        $(this).css(options.showoccupied.style);

        $(this).addClass('pbTree-current');
        if(options.select.enable)
        {
          this._objects.selected.show().css(_setSelTop());
        }
      });
    });


    // User clicks on a node
    this.root.click(function(e) {
      if ((this.root.has(e.target).length > 0 && $(e.target).hasClass('pbTree-subRoot')) || e.target) {
        var eNode = $(e.target);
        if(eNode.hasClass('pbTree-opened')) {
          _setState(eNode);

          if(options.select.enable && eNode.find('a.pbTree-current').length > 0)
          this._objects.selected.hide();
        }
        else {
          _setState(eNode);

          if(options.select.enable && eNode.find('a.pbTree-current').length > 0 && eNode.find('li.pbTree-closed').length <= 0) {
            this._objects.selected.css(_setSelTop()).show();
          }
        }
      }
    })

    // User moused-over a node
    .mousemove(function(e) {
      if (options.hover.enable && this.root.has(e.target).length > 0 && ($(e.target).is('li') || $(e.target).is('a'))) {
        this._objects.highlighter.show().css({
          top: $(e.target).position().top + this.root.position().top + nodes.root.scrollTop(),
          width: nodes.root[0].scrollWidth
        });

        // Add the tool tip if enabled
        if (options.tooltip.enable) {
          var tex = $(e.target).text().split('\n')[0];
          this._objects.tooltip.text(tex).css({
            top: e.clientY + $(window).scrollTop() - options.tooltip.offsetY - this._objects.tooltip.outerHeight() + 'px',
            left: e.clientX - options.tooltip.offsetX + 'px'
          }).show();
        }
      }
    })

    // User left the node
    .mouseleave(function() {
      if (options.hover.enable && options.tooltip.enable) {
        this._objects.highlighter.hide();
        this._objects.tooltip.hide();
      }
    });


    // User is scrolling through the container
    nodes.root.scroll(function() {
      // Only show the selected div if the path is opened
      if (options.select.enable && $('a.pbTree-current').length > 0 && $('a.pbTree-current').parents('li.pbTree-closed').length <= 0) {
        this._objects.selected.css(_setSelTop()).show();
      }

      if (options.ecButtons.enable) {
        this._objects.expandCollapse.css({
          bottom: -(nodes.root.scrollTop()),
          left: nodes.root.scrollLeft()
        });
      }
    });

    this.root.show();

    return this;
  };

  /**
   * $.fn.pbTree.findOne ( string id, bool hide )
   *
   * @description Select a specific node based its id
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
   * function searchTree ()
   *
   * @description Search function using Regex (search via node id AND node link text)
   */
  function searchTree() {
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
  }

  /**
   * function _showAll ()
   *
   * @description Open all of the nodes and show all of the lists.
   */
  function _showAll() {
    this.root.find('li.pbTree-subRoot').removeClass('pbTree-closed').addClass('pbTree-opened');
    this.root.find('ul').show();
  }

  /**
   * function _hideAll ()
   *
   * @description Close all of the nodes and hide all of the lists (except for root).
   */
  function _hideAll() {
    this.root.find('li.pbTree-subRoot').removeClass('pbTree-opened').addClass('pbTree-closed');
    this.root.find('ul').hide();
  }

  /**
   * function _brandAll ()
   *
   * @description Add appropriate classes to all nodes (initialization).
   */
  function _brandAll() {
    this.root.find('li').each(function() {
      if(!$(this).children().is('a')) {
        $(this).addClass('pbTree-subRoot');

        if (!options._showAll) {
          $(this).children('ul').hide();
          $(this).addClass('pbTree-closed');
        }
        else {
          $(this).addClass('pbTree-opened');
        }
      }
    });

    if(options.showoccupied.enable) {
      this.root.find('li:has(a)').each(function() {
        $(this).css(options.showoccupied.style);
      });
    }
  }

  /**
   *  Show All Nodes
   *  @description Opens all nodes and their children
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
   * function _ecButtons ()
   *
   * @description Define and add listeners to the expand/collapse links
   */
  function _ecButtons() {
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
  }

  /**
   * function _setState( object $this )
   *
   * @description Switch between opened and closed classes
   * @param {Object} $this
   */
  function _setState($this) {
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
  function _setSelTop() {
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
  }

  /**
   * _setDefaults ( options )
   *
   * @description Define and extend all default settings.
   *
   * @param {Object} options
   * @return {Object} options
   */
  function _setDefaults(options) {
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
  }

  /**
   *  Grow the Tree Recursively
   *  Helper method for {@link #_growTree}
   *  @param Node parentNode Parent of the new Node object
   */
  function _growTreeRecursive(parentNode) {
    var parentNodeChildren = pbjs.undefined;
    var elementChildNodes;
    var node;
    var i;
    // get text node...
    if (pbjs.isConstructor(parentNode, Node) && parentNode.element.childNodes.length > 0) {
      elementChildNodes = parentNode.element.childNodes;
      for (i = 0; i < elementChildNodes.length; ++i) {
        node = new Node(parentNode, elementChildNodes[i], pbjs.undefined);
        if (node.element.tagName === "ul") {
          _growTreeRecursive(node);
        }
        parentNode.addChild(node);
      }
    }
  }

  /**
   *  Grow the Tree
   *  Breaks down the children DOM Elements provided by this.container
   */
  function _growTree() {
    this.root.element = pbjs.undefined;
    var rootLevelNodes = this.container.childNodes;
    var i;
    for (i = 0; i < rootLevelNodes.length; ++i) {
      if (rootLevelNodes[i].tagName == "ul") {
        this.root.element = rootLevelNodes[i];
        break;
      }
    }
    if (this.root.element === pbjs.undefined) {
      return false;
    }

    _growTreeRecursive(this.root);
  };

  /**
   *  Grow the Tree Extras
   *  Creates and prepares the Tree's extra functionality
   *  @return Object The container object for all extras
   */
  function _getTreeExtras() {
    var _objects = {};

    if (this.options.tooltip.enabled) {
      if (pbjs.isModuleLoaded("tooltip")) {
        _objects.tooltip = pbjs.getModule(this.IDs.IDS.TOOLTIP);
      } else {
        _objects.tooltip = document.getElementById(this.IDs.IDS.TOOLTIP) || pbjs.createElement("div", {
          "id": this.IDs.IDS.TOOLTIP
        });
      }
    } else {
      _objects.tooltip = pbjs.undefined;
    }
    
    if (this.options.highlighter.enabled) {
      if (pbjs.isModuleLoaded("highlighter")) {
        _objects.highlighter = pbjs.getModule(this.IDs.IDS.HIGHLIGHTER);
      } else {
        _objects.highlighter = document.getElementById(this.IDs.IDS.HIGHLIGHTER) || pbjs.createElement("div", {
          "id": this.IDs.IDS.HIGHLIGHTER
        });
      }
    } else {
      _objects.highlighter = pbjs.undefined;
    }
    
    if (this.options.selected.enabled) {
      _objects.selected = document.getElementById(this.IDs.IDS.SELECTED) || pbjs.createElement("div", {
        "id": this.IDs.IDS.SELECTED
      });
    } else {
      _objects.selected = pbjs.undefined;
    }
    
    if (this.options.expandCollapse.enabled) {
      _objects.expandCollapse = document.getElementById(this.IDs.IDS.EXPANDCOLLAPSE) || pbjs.createElement("div", {
        "id": this.IDs.IDS.EXPANDCOLLAPSE
      });
    } else {
      _objects.expandCollapse = pbjs.undefined;
    }
    
    if (this.options.search.enabled) {
      if (pbjs.isModuleLoaded("search")) {
        _objects.search = pbjs.getModule(this.IDs.IDS.SEARCH);
      } else {
        _objects.search = document.getElementById(this.IDs.IDS.SEARCH) || pbjs.createElement("input", {
          "id": this.IDs.IDS.SEARCH,
          "type": "text",
          "placeholder": "Search..."
        });
        
        // Find out if the user has a search input or if we need to create one
        if (pbjs.isConstructor(options.search.selector, String) && parseInt(options.search.selector.length) > 0) {
          _extrasSearchTree();
        }
      }
    } else {
      _objects.search = pbjs.undefined;
    }

    return _objects;
  }


  /**
   *  PB&Js Router Stuff
   *  {@link #pbjsRouter PBJS Router}
   *
   *  These callback methods will expose the functionality of the Tree for the PBJS CommuniKAY module.
   */
  var myRouter = new pbjs.router.newRouter();
  myRouter.get = function(callback) {
    if (!callback || pbjs.isConstructor(callback, Function)) {
      pbjs.error("Get requires a callback function, otherwise, why get the data?");
    }

  };

  // Final step for the router - register the Module
  pbjs.registerModule(MODULE_NAME, myRouter);

})(window);
