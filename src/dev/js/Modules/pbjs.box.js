/**
 *  PB&Js | /pb.box.js
 *  Author: Patrick Barnum
 *  Description: Creates a manipulative pop up box.
 *  License: NULL
 */

(function(window) {

  // Is PBJS a valid object?
  if (!window || !window.pbjs) {
    throw new Error("PBJS does not exist!");
  }

  /**
   *  Private variables
   */
  var manager;
  var instance;
  var current;
  var boxes;

  /**
   *  Constructor
   */
  pbjs.box = function(options) {
    // Singleton
    if (boxes.constructor === Array) {
      return this.create(options);
    }

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
    if (options) {
      this.create(options);
    }

    return this;
  }

  /**
   * Creates new box
   */
  pbjs.box.prototype.create = function(options) {
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
    if (typeof this.callbacks.beforeCreate === 'function') {
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
    box.element.addEventListener('mousedown', function(e) {
      var lastBox = self.getCurrent();
      if (lastBox) {
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
    if (options.isMovable) {
      // Title bar mouse down event
      onDown = function(e) {
        titleBar.dataset.zIndex = boxElement.style.zIndex;
        titleBar.dataset.diffTop = boxElement.offsetTop - e.clientY;
        titleBar.dataset.diffLeft = boxElement.offsetLeft - e.clientX;
        titleBar.dataset.active = 'true';
        boxElement.style.zIndex = self.getManager().findZIndex();

        // Prevent selection when dragging
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      };

      // Window mouse move event
      onMove = function(e) {
        if (titleBar.dataset.active !== 'true') {
          return 0;
        }

        var boxTop = boxElement.offsetTop;
        var boxLeft = boxElement.offsetLeft;
        var boxBottom = boxElement.offsetTop + boxElement.offsetHeight;
        var boxRight = boxElement.offsetLeft + boxElement.offsetWidth;

        var finalTop = e.clientY + Number(titleBar.dataset.diffTop);
        var finalLeft = e.clientX + Number(titleBar.dataset.diffLeft);

        if (finalTop < 0) {
          finalTop = 0;
        }
        if (finalTop + boxElement.offsetHeight > window.innerHeight) {
          finalTop = window.innerHeight - boxElement.offsetHeight;
        }
        if (finalLeft < 0) {
          finalLeft = 0;
        }
        if (finalLeft + boxElement.offsetWidth > window.innerWidth) {
          finalLeft = window.innerWidth - boxElement.offsetWidth;
        }

        boxElement.style.top = finalTop +'px';
        boxElement.style.left = finalLeft +'px';
      }

      // Window mouse up event
      onUp = function(e) {
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
    if (typeof options.body === 'function') {
      options.body(body);
    } else {
      body.innerHTML = options.body;
    }
    box.element.appendChild(body);

    // Create the close button
    var closeButton = createElement('a', {
      'class': this.CLASSES.BUTTON + ' ' + this.CLASSES.CLOSE,
      'href': 'javascript:void(0);'
    });
    closeButton.addEventListener('click', function(e) {
      self.close();
    }, false);
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
    for (button in options.buttons) {
      var b = options.buttons[button];
      b.href = b.href || 'javascript:void(0);';
      var li = document.createElement('li');
      var tmpClass = '';
      if (b['class'] != this.undefined) {
        if (b['class'].constructor === Array) {
          b['class'] = b['class'].join(' ');
        }
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
    if (options.isScalable) {
      // Create draggable corner object
      var resize = createElement('div', {
        'id': this.CLASSES.RESIZE + '-' + box.id,
        'class': this.CLASSES.RESIZE
      });

      resize.addEventListener('mousedown', function(e) {
        resize.dataset.oHeight = boxElement.offsetHeight;
        resize.dataset.oWidth = boxElement.offsetWidth;
        resize.dataset.initY = e.clientY;
        resize.dataset.initX = e.clientX;
        resize.dataset.active = 'true';

        // Prevent selection when dragging
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      });

      window.addEventListener('mousemove', function(e) {
        if (resize.dataset.active !== 'true') {
          return 0;
        }

        var boxHeight = boxElement.offsetHeight;
        var boxWidth = boxElement.offsetWidth;

        var finalHeight = e.clientY - resize.dataset.initY + Number(resize.dataset.oHeight);
        var finalWidth = e.clientX - resize.dataset.initX + Number(resize.dataset.oWidth);

        if (finalHeight < 100) {
          finalHeight = 100;
        }
        if (finalWidth < 200) {
          finalWidth = 200;
        }

        boxElement.style.height = finalHeight +'px';
        boxElement.style.width = finalWidth +'px';
      });

      window.addEventListener('mouseup', function(e) {
        clearDataset(resize);
      });

      box.element.appendChild(resize);
    }

    // Add the box to the manager/DOM
    this.getManager().addBox(box);

    // After Create callback
    if (typeof this.callbacks.afterCreate === 'function') {
      this.callbacks.afterCreate(box);
    }
  };

  /**
   *  Get current box
   *  @return  Object  The current box
   */
  pbjs.box.prototype.getCurrent = function() {
    return this.getManager().getBoxById( this.getManager().current );
  };

  /**
   *  Removes the box from the DOM and the manager.
   */
  pbjs.box.prototype.close = function() {
    var box = this.getCurrent();

    // Before close callback
    if (typeof this.callbacks.beforeClose === 'function') {
      this.callbacks.beforeClose(box);
    }

    if (box) {
      this.getManager().removeBox(box.id);
    }
  };

  /**
   *  Returns the Box manager
   */
  function getManager() {
    return _manager;
  }

  /**
   *  Returns the current Box
   */
  function getCurrent() {
    return _current;
  }

  /**
   *  Sets the current Box
   */
  function setCurrent(current) {
    _current = current;
  }

  /**
   *  Returns a new id
   *  @return  int     id
   */
  function nextId() {
    var id = 1;
    if (_manager.boxes.length <= 0) {
      return id;
    } else {
      var i;
      for (i = 0; i < _manager.boxes.length; ++i) {
        if (_manager.boxes[i].id > id) {
          id = _manager.boxes[id].id;
        }
      }
      return id + 1;
    }
  }

  /**
   *  Get a box by its id
   *  @param   int     id
   *  @return  Object  The box
   */
  function getBoxById(id) {
    var i;
    for (i = 0; i < _manager.boxes.length; ++i) {
      if (_manager.boxes[i].id == id) {
        return _manager.boxes[i];
      }
    }
    return null;
  }

  /**
   *  Sets the id of the current box
   *  @param   int     id
   */
  function setCurrent(id) {
    if (this.boxes.length <= 0) {
      this.current = null;
    }
    var box = this.getBoxById(id);
    if (box) {
      this.current = box.id;
    } else {
      this.current = this.boxes[this.boxes.length - 1].id;
    }
  }

  /**
   *  Adds the box to the current set of boxes and adds
   *  its element to the DOM
   */
  function addBox(box) {
    this.boxes.push(box);
    this.setCurrent(box.id);
    document.body.appendChild(box.element);
  }

  /**
   *  Removes a box from the manager and the DOM using its id
   *  @param   int     The box id
   */
  function removeBox(id) {
    // Loop through all boxes
    var box = this.getBoxById(id);

    // Remove the box from the DOM
    box.element.parentNode.removeChild(box.element);

    // Set the new current box
    this.setCurrent(/*box.parent*/);

    // Remove the box
    this.boxes.splice(this.boxes.indexOf(box), 1);
  }

  /**
   *  Find the DOM's highest z-index and return it plus 1
   *  @return  int     Highest z-index plus 1
   */
  function findZIndex() {
    var highestZ = 100;
    var elements = document.getElementsByTagName('*');
    if (!elements.length) {
      return highestZ;
    }
    for (var i = 0; i < elements.length; ++i) {
      var z = parseInt(elements[i].style.zIndex);
      if (z > highestZ) {
        highestZ = z;
      }
    }
    return highestZ + 1;
  }

})(window);
