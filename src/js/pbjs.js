/**
* Content Box
* Written by Patrick Barnum
*
* Creates manipulative pop up boxes.
*
*/

/**
* Constructor
*/
function ContentBox(options)
{
  // Singleton
  if (ContentBox.prototype._instance)
  {
    // Didn't create the object
    ContentBox.prototype.created = false;
    return ContentBox.prototype._instance;
  }
  ContentBox.prototype._instance = this;

  // Created the object
  ContentBox.prototype.created = true;

  // Initialize global variables
  var manager = {
    boxes: [],
    current: null,

    /**
     * Returns a new id
     * @return  int     id
     */
    nextId: function()
    {
      var id = 1;
      if (this.boxes.length <= 0)
        return id;
      else
        for (var i in this.boxes)
          if (this.boxes[i].id > id)
            id = this.boxes[id].id;
      return id + 1;
    },

    /**
     * Get a box by its id
     * @param   int     id
     * @return  Object  The box
     */
    getBoxById: function(id)
    {
      for (var i in this.boxes)
        if (this.boxes[i].id == id)
          return this.boxes[i];
      return null;
    },

    /**
     * Sets the id of the current box
     * @param   int     id
     */
    setCurrent: function(id)
    {
      if (this.boxes.length <= 0)
        this.current = null;
      var box = this.getBoxById(id);
      if (box)
        this.current = box.id;
      else
        this.current = this.boxes[this.boxes.length - 1].id;
    },

    /**
        * Adds the box to the current set of boxes and adds
        * its element to the DOM
        */
    addBox: function(box)
    {
      ContentBox.prototype.created = true;
      this.boxes.push(box);
      this.setCurrent(box.id);
      document.body.appendChild(box.element);
    },

    /**
     * Removes a box from the manager and the DOM using its id
     * @param   int     The box id
     */
    removeBox: function(id)
    {
      // Loop through all boxes
      var box = this.getBoxById(id);

      // Remove the box from the DOM
      box.element.parentNode.removeChild(box.element);

      // Set the new current box
      this.setCurrent(/*box.parent*/);

      // Remove the box
      this.boxes.splice(this.boxes.indexOf(box), 1);
    },

    /**
     * Find the DOM's highest z-index and return it plus 1
     * @return  int     Highest z-index plus 1
     */
    findZIndex: function()
    {
      var highestZ = 100;
      var elements = document.getElementsByTagName('*');
      if (!elements.length)
        return highestZ;
      for (var i = 0; i < elements.length; ++i)
      {
        var z = parseInt(elements[i].style.zIndex);
        if (z > highestZ)
          highestZ = z;
      }
      return highestZ + 1;
    }
  };

  this.getManager = function()
  {
    return manager;
  };

  this.undefined = 'undefined';
  this.CLASSES = {
    CONTAINER:  'cBox-container',
    TITLE_BAR:  'cBox-titleBar',
    BODY:       'cBox-body',
    TITLE:      'cBox-title',
    BUTTON:     'cBox-button',
    CLOSE:      'cBox-close',
    RESIZE:     'cBox-resize',
    ACTION_BAR: 'cBox-actionBar'
  };

  // Create a box on initialization when options are present
  if (options)
    this.create(options);

  return this;
}

/**
 * Creates new box
 */
ContentBox.prototype.create = function(options)
{
  // Set the local object variable
  var self = this;
  var existingBoxes = this.getManager().boxes;

  // Make sure the options are defined
  options = options || {};
  //options.parent = options.parent || null;
  options.isMovable = typeof options.isMovable !== this.undefined ? options.isMovable : true;
  options.isScalable = typeof options.isScalable !== this.undefined ? options.isScalable : true;
  options.buttons = options.buttons || {};
  options.height = options.height || 480;
  options.width = options.width || 680;
  options.title = options.title || 'Content Box';
  options.body = options.body || '';

  this.callbacks = {};
  this.callbacks.beforeCreate = options.beforeCreate;
  this.callbacks.afterCreate = options.afterCreate;
  this.callbacks.beforeClose = options.beforeClose;

  // Before Create callback
  if (typeof this.callbacks.beforeCreate === 'function')
  {
    this.callbacks.beforeCreate(existingBoxes);
  }

  // Create the box
  var box = {};
  box.id = this.getManager().nextId();
  //box.parent = options.parent;
  box.height = options.height;
  box.width = options.width;
  box.element = createElement('div', {
    'id': 'cBox-'+ box.id,
    'class': this.CLASSES.CONTAINER,
    'style': [
      'z-index:'+ (this.getManager().findZIndex()),
      'height:'+ options.height +'px',
      'width:'+ options.width +'px',
      'top:'+ ((window.innerHeight / 2) - (options.height / 2)) +'px',
      'left:'+ ((window.innerWidth / 2) - (options.width / 2)) +'px'
    ]
  });

  // Set the z-index and current box on element mouse down event
  box.element.addEventListener('mousedown', function(e)
  {
    var lastBox = self.getCurrent();
    if (lastBox)
    {
      var swapZ = lastBox.element.style.zIndex;
      lastBox.element.style.zIndex = box.element.style.zIndex;
      box.element.style.zIndex = swapZ;
    }
    self.getManager().setCurrent(box.id);
  }, true);

  // Set a local variable for the box element
  var boxElement = box.element;

  // Create the title bar
  var titleBar = createElement('div', {
    'id': this.CLASSES.TITLE_BAR + '-' + box.id,
    'class': this.CLASSES.TITLE_BAR
  });
  titleBar.innerHTML = '<span class="' + this.CLASSES.TITLE + '">'+ options.title +'</span>';

  var onDown = {};
  var onMove = {};
  var onUp = {};
  if (options.isMovable)
  {
    // Title bar mouse down event
    onDown = function(e)
    {
      titleBar.dataset.zIndex = boxElement.style.zIndex;
      titleBar.dataset.diffTop = boxElement.offsetTop - e.clientY;
      titleBar.dataset.diffLeft = boxElement.offsetLeft - e.clientX;
      titleBar.dataset.active = 'true';
      boxElement.style.zIndex = self.getManager().findZIndex();

      // Prevent selection when dragging
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    };

    // Window mouse move event
    onMove = function(e)
    {
      if (titleBar.dataset.active !== 'true')
        return 0;

      var boxTop = boxElement.offsetTop;
      var boxLeft = boxElement.offsetLeft;
      var boxBottom = boxElement.offsetTop + boxElement.offsetHeight;
      var boxRight = boxElement.offsetLeft + boxElement.offsetWidth;

      var finalTop = e.clientY + Number(titleBar.dataset.diffTop);
      var finalLeft = e.clientX + Number(titleBar.dataset.diffLeft);

      if (finalTop < 0)
        finalTop = 0;
      if (finalTop + boxElement.offsetHeight > window.innerHeight)
        finalTop = window.innerHeight - boxElement.offsetHeight;
      if (finalLeft < 0)
        finalLeft = 0;
      if (finalLeft + boxElement.offsetWidth > window.innerWidth)
        finalLeft = window.innerWidth - boxElement.offsetWidth;

      boxElement.style.top = finalTop +'px';
      boxElement.style.left = finalLeft +'px';
    }

    // Window mouse up event
    onUp = function(e)
    {
      boxElement.style.zIndex = Number(titleBar.dataset.zIndex);
      clearDataset(titleBar);
    }
  }

  // Add the title bar events and append to the box
  titleBar.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  box.element.appendChild(titleBar);

  // Create the body element
  var body = createElement('div', {
    'id': this.CLASSES.BODY + '-' + box.id,
    'class': this.CLASSES.BODY
  });
  if (typeof options.body === 'function')
    options.body(body);
  else
    body.innerHTML = options.body;
  box.element.appendChild(body);

  // Create the close button
  var closeButton = createElement('a', {
    'class': this.CLASSES.BUTTON + ' ' + this.CLASSES.CLOSE,
    'href': 'javascript:void(0);'
  });
  closeButton.addEventListener('click', function(e){ self.close(); }, false);
  closeButton.innerHTML = 'Close';

  // Create the action bar to house the buttons
  var actionBar = createElement('div', {
    'id': this.CLASSES.ACTION_BAR + '-' + box.id,
    'class': this.CLASSES.ACTION_BAR
  });
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  li.appendChild(closeButton);
  ul.appendChild(li);

  // Loop through all defined buttons
  for (button in options.buttons)
  {
    var b = options.buttons[button];
    b.href = b.href || 'javascript:void(0);';
    var li = document.createElement('li');
    var tmpClass = '';
    if (b['class'] != this.undefined)
    {
      if (b['class'].constructor === Array)
        b['class'] = b['class'].join(' ');
      tmpClass = ' '+ b['class'];
    }

    var a = createElement('a', {
      'class': this.CLASSES.BUTTON + tmpClass,
      'href': b.href
    });
    a.innerHTML = b.text;
    li.appendChild(a);
    ul.appendChild(li);
  }

  // Append the button list to the action bar and the action bar to the box
  actionBar.appendChild(ul);
  box.element.appendChild(actionBar);

  // Define the box resize events
  if (options.isScalable)
  {
    // Create draggable corner object
    var resize = createElement('div', {
      'id': this.CLASSES.RESIZE + '-' + box.id,
      'class': this.CLASSES.RESIZE
    });

    resize.addEventListener('mousedown', function(e)
    {
      resize.dataset.oHeight = boxElement.offsetHeight;
      resize.dataset.oWidth = boxElement.offsetWidth;
      resize.dataset.initY = e.clientY;
      resize.dataset.initX = e.clientX;
      resize.dataset.active = 'true';

      // Prevent selection when dragging
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    });

    window.addEventListener('mousemove', function(e)
    {
      if (resize.dataset.active !== 'true')
        return 0;

      var boxHeight = boxElement.offsetHeight;
      var boxWidth = boxElement.offsetWidth;

      var finalHeight = e.clientY - resize.dataset.initY + Number(resize.dataset.oHeight);
      var finalWidth = e.clientX - resize.dataset.initX + Number(resize.dataset.oWidth);

      if (finalHeight < 100)
        finalHeight = 100;
      if (finalWidth < 200)
        finalWidth = 200;

      boxElement.style.height = finalHeight +'px';
      boxElement.style.width = finalWidth +'px';
    });

    window.addEventListener('mouseup', function(e)
    {
      clearDataset(resize);
    });

    box.element.appendChild(resize);
  }

  // Add the box to the manager/DOM
  this.getManager().addBox(box);

  // After Create callback
  if (typeof this.callbacks.afterCreate === 'function')
    this.callbacks.afterCreate(box);
};

/**
* Get current box
* @return  Object  The current box
*/
ContentBox.prototype.getCurrent = function()
{
  return this.getManager().getBoxById( this.getManager().current );
};

/**
* Removes the box from the DOM and the manager.
*/
ContentBox.prototype.close = function()
{
  var box = this.getCurrent();

  // Before close callback
  if (typeof this.callbacks.beforeClose === 'function')
    this.callbacks.beforeClose(box);

  if (box)
    this.getManager().removeBox(box.id);
};

/**
 *  PB&Js | pb.core.js
 *  Author: Patrick Barnum
 *  Description: Core functionality and namespace creation for the PB&Js suite
 *  License: NULL
 */

"use strict";

var pbjs = pbjs || {};

(function(pbjs, window, document, undefined) {

  pbjs.core = {};
  pbjs.core.prototype.extend = function (ns, nsString) {
    var parent = ns;
    var parts = nsString.split('.');
    var i;
    if (parts[0] == "pbjs") {
      parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; ++i) {
      if (parent[parts[i]] !== undefined) {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  }

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

  return pbjs;
})(pbjs, window, document, undefined);

/**
 * pbTree
 * 
 * Authored by Patrick Barnum
 * 
 * License: GNU Free Documentation License (GFDL)
 * This JavaScript class is written for the benefit of all, please feel free to use, modify, and redistribute while keeping this same license.
 * 
 * pbTree: A JavaScript class used to display a TreeView within a website.
 */

'use strict';

var $settings = {},     // Plugin settings
    searchArray = [],   // Object holding all searchable objects
    $container,         // Element containing TreeView
    $root,              // Root list of the TreeView
    $tooltip,           // Tooltip div
    $hoverDiv,          // Hover div
    $selDiv,            // Selected div
    $ecLinks,           // Expand/Collapse Links
    $searchBox,         // Search input container
    undefined;          // An undefined variable

/**
 * $.fn.pbTree ( object options )
 * 
 * @description pbTree's constructor function
 * 
 * @param {Object} options User-defined options
 * @return {Object} this (container element)
 */
var TreeView = function(options)
{
    $container = $(this);
    $root = $container.find('ul:first');
    $settings = _defaults(options);
    
    // / Start functionality based on settings
    // Expand/Collapse buttons
    if($settings.ecButtons.enable)
    {
        //if($settings.ecButtons.showDefault.show)
        //{
            $ecLinks = $('<div id="pbTree-ecLinks"><a class="pbTree-expandAll" href="#">Expand All</a><a class="pbTree-collapseAll" href="#">Collapse All</a></div>').appendTo($container);
        //}
        //else
        //{
        //    if(typeof $settings.ecButtons.showDefault.class !== 'string')
        //    {
        //        console.error('You must provide a selector for the "Expand All" and "Collapse All" actions');
        //        return 1;
        //    }
        //    
        //    $ecLinks
        //}
        
        _ecButtons();
    }
    
    // Node Tooltip
    if($settings.tooltip.enable)
    {
        $tooltip = $('<div id="pbTree-tooltip"></div>').appendTo('body').hide();
    }
    
    // Node Hover
    if($settings.hover.enable)
    {
        $hoverDiv = $('<div id="pbTree-hover"></div>').appendTo($container);
    }
    
    // Node Selected
    if($settings.select.enable)
    {
        $selDiv = $('<div id="pbTree-selected"></div>').appendTo($container);
    }
    
    // Search nodes
    if($settings.search.enable)
    {
        // Find out if the user has a search input or if we need to create one
        if($settings.search.selector && typeof $settings.search.selector === 'string' && $($settings.search.selector).length > 0 && $($settings.search.selector).is('input:text'))
        {
            searchTree();
        }
        else
        {
            // User has search enabled yet doesn't provide the input element, error out
            if(!$settings.search.selector)
                console.error('No search selector provided!');
            if(typeof $settings.search.selector !== 'string')
                console.error('Search selector must be a string!');
            if($($settings.search.selector).length <= 0)
                console.error('The search element does not exist!');
            if(!$($settings.search.selector).is('input:text'))
                console.error('The search element must be a text field!');
            
            return 1;
        }
    }
    else
    {
        $searchBox = undefined;
    }
    // / End functionality based on settings
    
    
    // Hide the tree until told otherwise
    $root.attr('id','pbTree-root').hide();
    _brandAll();
    
    
    // Add click listeners to each link
    $root.find('a').each(function()
    {
        $(this).click(function()
        {
            if($('a.pbTree-current').length > 0)
                $('a.pbTree-current').removeClass('pbTree-current').removeAttr('style');
            
            if($settings.showoccupied.enable)
                $(this).css($settings.showoccupied.style);
            
            $(this).addClass('pbTree-current');
            if($settings.select.enable)
            {
                $selDiv.show().css(_setSelTop());
            }
        });
    });
    
    
    // User clicks on a node
    $root.click(function(e)
    {
        if(($root.has(e.target).length > 0 && $(e.target).hasClass('pbTree-subRoot')) || e.target)
        {
            var eNode = $(e.target);
            if(eNode.hasClass('pbTree-opened'))
            {
                _setState(eNode);
                
                if($settings.select.enable && eNode.find('a.pbTree-current').length > 0)
                    $selDiv.hide();
            }
            else
            {
                _setState(eNode);
                
                if($settings.select.enable
                && eNode.find('a.pbTree-current').length > 0
                && eNode.find('li.pbTree-closed').length <= 0)
                {
                    $selDiv.css(_setSelTop()).show();
                }
            }
        }
    })
    
    // User moused-over a node
    .mousemove(function(e)
    {
        if($settings.hover.enable
        && $root.has(e.target).length > 0
        && ($(e.target).is('li') || $(e.target).is('a')))
        {
            $hoverDiv.show().css({
                top: $(e.target).position().top + $root.position().top + $container.scrollTop(),
                width: $container[0].scrollWidth
            });
            
            // Add the tool tip if enabled
            if($settings.tooltip.enable)
            {
                var tex = $(e.target).text().split('\n')[0];
                $tooltip.text(tex).css({
                    top: e.clientY + $(window).scrollTop() - $settings.tooltip.offsetY - $tooltip.outerHeight() + 'px',
                    left: e.clientX - $settings.tooltip.offsetX + 'px'
                }).show();
            }
        }
    })
    
    // User left the node
    .mouseleave(function()
    {
        if($settings.hover.enable && $settings.tooltip.enable)
        {
            $hoverDiv.hide();
            $tooltip.hide();
        }
    });
    
    
    // User is scrolling through the container
    $container.scroll(function()
    {
        // Only show the selected div if the path is opened
        if($settings.select.enable
        && $('a.pbTree-current').length > 0
        && $('a.pbTree-current').parents('li.pbTree-closed').length <= 0)
            $selDiv.css(_setSelTop()).show();
        
        if($settings.ecButtons.enable)
        {
            $ecLinks.css({
                bottom: -($container.scrollTop()),
                left: $container.scrollLeft()
            });
        }
    });
    
    $root.show();
    
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
        
        if($settings.select.enable) //<-- Can't figure out how to use the width of a hidden element
            $selDiv.hide().css(_setSelTop()).show();
    
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
    
    $root.find('a').closest('li').each(function()
    {
        searchArray.push($(this).clone());
    });
    
    totalCount = searchArray.length;
    
    $($settings.search.selector).keyup(function(e)
    {
        if(e.which === 16) // Shift code
        {
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
        if(String.fromCharCode(e.which) == '.')
        {
            regStr = this.value + '\\' + String.fromCharCode(e.which);
        }
        else
        {
            regStr = this.value + String.fromCharCode(e.which);
        }
        
        var regex = new RegExp(regStr.slice(0, -1), 'ig');
        var $results = [];
        numOfResults = 0;
        
        $.each(searchArray, function()
        {
            var id = $(this).attr('id'),
                $link = $(this).find('a');
            
            if((id !== undefined && id.match(regex)) || ($link.length > 0 && $link.text().match(regex)))
            {
                $results.push($(this));
                ++numOfResults;
            }
        });
        
        // If user provides a callback, return the results and how many
        if($settings.search.callback && typeof $settings.search.callback === 'function')
        {
            $settings.search.callback($results, numOfResults, totalCount);
        }
    });
}

/** 
 * function _showAll ()
 * 
 * @description Open all of the nodes and show all of the lists.
 */
function _showAll()
{
    $root.find('li.pbTree-subRoot').removeClass('pbTree-closed').addClass('pbTree-opened');
    $root.find('ul').show();
}

/** 
 * function _hideAll ()
 * 
 * @description Close all of the nodes and hide all of the lists (except for root).
 */
function _hideAll()
{
    $root.find('li.pbTree-subRoot').removeClass('pbTree-opened').addClass('pbTree-closed');
    $root.find('ul').hide();
}

/** 
 * function _brandAll ()
 * 
 * @description Add appropriate classes to all nodes (initialization).
 */
function _brandAll()
{
    $root.find('li').each(function()
    {
        if(!$(this).children().is('a'))
        {
            $(this).addClass('pbTree-subRoot');
        
            if(!$settings._showAll)
            {
                $(this).children('ul').hide();
                $(this).addClass('pbTree-closed');
            }
            else
            {
                $(this).addClass('pbTree-opened');
            }
        }
    });
    
    if($settings.showoccupied.enable)
    {
        $root.find('li:has(a)').each(function()
        {
            $(this).css($settings.showoccupied.style);
        });
    }
}

/** 
 * function _ecButtons ()
 * 
 * @description Define and add listeners to the expand/collapse links 
 */
function _ecButtons()
{
    $root.css({paddingBottom: $ecLinks.outerHeight()});
    
    var $expandAll = $ecLinks.find('.pbTree-expandAll')
    .click(function()
    {
        _showAll();
        
        if($settings.select.enable && $('a.pbTree-current').length > 0)
            $selDiv.show().css(_setSelTop());
        
        return false;
    }).appendTo($ecLinks);
    
    var $collapseAll = $ecLinks.find('.pbTree-collapseAll')
    .click(function()
    {
        _hideAll();
        $container.animate({scrollTop: 0}, 10);
        
        // Position the links back into frame
        $ecLinks.css('bottom', 0);
        
        if($settings.select.enable)
            $selDiv.hide();
        
        return false;
    }).appendTo($ecLinks);
}

/** 
 * function _setState( object $this )
 * 
 * @description Switch between opened and closed classes
 * @param {Object} $this
 */
function _setState($this)
{
    $this.each(function()
    {
        $(this).toggleClass('pbTree-opened').toggleClass('pbTree-closed');
        
        if($(this).hasClass('pbTree-opened'))
            $(this).find('ul:first').show();
        else
            $(this).find('ul:first').hide();
    });
}

/** 
 * function _setSelTop ()
 * Set the top of the selected div to the top of the clicked node.
 * 
 * @return {Object} The top position of the selected node.
 */
function _setSelTop()
{
    // If the node is already selected (searched for), highlight it
    if($('a.pbTree-current').length > 0 && $root.is(':visible'))
    {
        return {
            top: parseInt($('a.pbTree-current').position().top + $root.position().top + $container.scrollTop()),
            width: $container[0].scrollWidth
        };
    }
    // Otherwise highlight the clicked node
    else
    {
        return {
            top: parseInt($('a.pbTree-current').position().top + $container.scrollTop()),
            width: $container[0].scrollWidth,
            display: 'none'
        };
    }
}

/**
 * _defaults ( options )
 * 
 * @description Define and extend all default settings.
 * 
 * @param {Object} options
 * @return {Object} options
 */
function _defaults(options)
{
    return $.extend(true, {
        // "Expand/Collapse" all nodes
        ecButtons: {
            enable: true
            //showDefault: {
            //    show: true,
            //    class: undefined
            //},
            //selector: undefined
        },
        
        // Add a hover indicator
        hover: {
            enable: true
        },
        
        // Search box defaults
        search: {
            enable: false,
            selector: undefined,
            callback: undefined
        },
        
        // Add a selected indicator
        select: {
            enable: true
        },
        
        // Hide all nodes from the start
        showall: false,
        
        // Indicate that the node has a child
        showoccupied: {
            enable: true,
            style: {
                fontWeight: 'bold',
                color: '#000000'
            }
        },
        
        // Add a tooltip to hover above the mouse
        tooltip: {
            enable: true,
            offsetX: 10,
            offsetY: 10
        }
    }
    // Extend all of that with options
    , options); //<-- End of return
}
