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
