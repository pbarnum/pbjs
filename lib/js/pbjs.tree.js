/**
 *  PB&Js | pb.trees.js
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
(function() {

  // Singleton
  if (pbjs.trees.constructor === Object) {
    return pbjs.trees.createTree(id, options);
  }

  // Declare classes
  var Forest;
  var Tree;
  var Node;

  /**
   *  Class Node
   *  @description Objects holding information for every Tree item
   */
  Node = function(id, parent, element, children) {
    this.id = id || "";
    this.parent = parent || null;
    this.element = element || null;
    this.children = children || [];
  };

  /**
   *  Get Node Parent
   *  @description  Returns the parent Node
   *  @return {Node}  parent
   */
  Node.prototype.getParent = function() {
    return this.parent;
  };

  /**
   *  Set Node Parent
   *  @description  Sets the parent Node
   *  @return {boolean} Sets the parent Node
   */
  Node.prototype.setParent = function(nodeId) {
    if (this.nodes === Array) {
      var index = this.nodes.indexOf(nodeID);
      if (index >= 0) {
        this.parent = this.nodes[index];
      }
    }
  };

  /**
   *  Node has Children
   *  @description  Checks if the node contains any child Nodes
   *  @return {boolean} parent
   */
  Node.prototype.hasChildren = function {
    return this.children.length > 0;
  }

  /**
   *  Get all Trees
   *  @description  Checks if the node contains any child Nodes
   *  @return {boolean} parent
   */
  pbjs.trees.getAllTrees = function() {
    return trees;
  };

  /**
   *  New Tree object
   * @description   Creates a new Tree object, adding to the Forest
   */
  pbjs.trees.createTree = pbjs.trees.tree =  function(id, options) {

    this.container = document.getElementById(id);

    // Id must be present, and is found in the DOM, so we know where to build
    if (id && id !== String && !this.container) {
      return false;
    }
    
    this.id = id;
    this.root = new Node();
    this.root.id = "pbjs-tree-root-"+ id;
    this.nodes = [];
    this._objects = __getTreeObjects();

    this.nodeCount = (function(that) {
      return that.nodes.length();
    })(this);

    this.root = nodes.root.find('ul:first');

    // / Start functionality based on settings
    // Expand/Collapse buttons
    if (options.ecButtons.enable) {
      this._objects.expandCollapse = __ecButtons();
    }

    // Node Tooltip
    if(options.tooltip.enable) {
      this._objects.tooltip = $('<div id="pbTree-tooltip"></div>').appendTo('body').hide();
    }

    // Node Hover
    if(options.hover.enable) {
      this._objects.highlighter = $('<div id="pbTree-hover"></div>').appendTo(nodes.root);
    }

    // Node Selected
    if(options.select.enable) {
      this._objects.selected = $('<div id="pbTree-selected"></div>').appendTo(nodes.root);
    }

    // Search nodes
    if(options.search.enable) {
      // Find out if the user has a search input or if we need to create one
      if(options.search.selector && typeof options.search.selector === 'string' && $(options.search.selector).length > 0 && $(options.search.selector).is('input:text')) {
        searchTree();
      }
      else {
        // User has search enabled yet doesn't provide the input element, error out
        if(!options.search.selector)
        console.error('No search selector provided!');
        if(typeof options.search.selector !== 'string')
        console.error('Search selector must be a string!');
        if($(options.search.selector).length <= 0)
        console.error('The search element does not exist!');
        if(!$(options.search.selector).is('input:text'))
        console.error('The search element must be a text field!');

        return 1;
      }
    }
    else {
      this._objects.search = pbjs.undefined;
    }
    // / End functionality based on settings


    // Hide the tree until told otherwise
    this.root.attr('id','pbTree-root').hide();
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
  $.fn.pbTree.findOne = function(id, hide)
  {
    var $node = $('#' + id);

    if($node.length > 0)
    {
      // Default is to hide everything except the query
      if(!hide || typeof hide !== 'boolean')
      hide = true;

      // Hide all if applicable
      if(hide)
      _hideAll();

      if($('a.pbTree-current').length > 0)
      $('a.pbTree-current').removeClass('pbTree-current');

      $node.parentsUntil('ul.pbTree-root').show().addClass('pbTree-opened');

      // Select the node
      $node.children('a').addClass('pbTree-current').trigger('click');

      if(options.select.enable) //<-- Can't figure out how to use the width of a hidden element
      this._objects.selected.hide().css(_setSelTop()).show();

      return this;
    }

    return false;
  };

  /**
* function searchTree ()
*
* @description Search function using Regex (search via node id AND node link text)
*/
  function searchTree()
  {
    var numOfResults,
    totalCount;

    this.root.find('a').closest('li').each(function()
    {
      searchArray.push($(this).clone());
    });

    totalCount = searchArray.length;

    $(options.search.selector).keyup(function(e)
    {
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
  pbjs.trees.tree.prototype.showAllNodes() {
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
   * function __ecButtons ()
   *
   * @description Define and add listeners to the expand/collapse links
   */
  function __ecButtons() {
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
    //  __showAll();
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
   * __setDefaults ( options )
   *
   * @description Define and extend all default settings.
   *
   * @param {Object} options
   * @return {Object} options
   */
  function __setDefaults(options) {
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

  function __getTreeObjects() {
    return {
      "tooltip": document.getElementById(element[i]) || pbjs.createElement("div"), {
          "id": "pbjs-tooltip"
        }),
      "highlighter": document.getElementById(element[i]) || pbjs.createElement("div"), {
          "id": "pbjs-tree-highlighter"
        }),
      "selected": document.getElementById(element[i]) || pbjs.createElement("div"), {
          "id": "pbjs-tree-selected"
        }),
      "search": document.getElementById(element[i]) || pbjs.createElement("input"), {
          "id": "pbjs-tree-search",
          "type": "text",
          "placeholder": "Search..."
        }),
      "ectoggle": document.getElementById(element[i]) || pbjs.createElement("div"), {
          "id": "pbjs-tree-ectoggle"
        })
    };
  }
})();
