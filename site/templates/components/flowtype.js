/*
* FlowType.JS with/without jQuery/Zepto.
* Adapted by Christian Dannie Storgaard (Cybolic). Based on:
*
* FlowType.JS 1.0
* Copyright (c) 2013, Simple Focus http://simplefocus.com/
*
* FlowType.JS by Simple Focus (http://simplefocus.com/)
* is licensed under the MIT License. Read a copy of the
* license in the LICENSE.txt file or at
* http://choosealicense.com/licenses/mit
*
* Thanks to Giovanni Difeterici (http://www.gdifeterici.com/)
*/

var FlowType = (function() {

    var addEvent = null,
        getWidth = null,
        setFontSize = null,
        setLineHeight = null,
        flowtype = null
    ;

        addEvent = function(element, eventName, callback) {
            if ( element.addEventListener ) {
                element.addEventListener( eventName, callback, false );
            } else if ( element.attachEvent ) {
                element.attachEvent( 'on'+eventName, callback );
            } else {
                element['on'+eventName] = callback;
            }
        };
        
        getWidth = function(element) { return element.clientWidth; };
        setFontSize = function(element, size) { element.style.fontSize = size; };
        setLineHeight = function(element, height) { element.style.lineHeight = height; };


    flowtype = function(element, options) {
        options = options || {};

        // Establish default settings/variables
        // ====================================
        options.maximum   = options.maximum   || 9999;
        options.minimum   = options.minimum   || 1;
        options.maxFont   = options.maxFont   || 9999;
        options.minFont   = options.minFont   || 1;
        options.fontRatio = options.fontRatio || 35;
        options.lineRatio = options.lineRatio || 1.45;

        // Do the magic math
        // =================
        changes = function(el) {
            var elw = getWidth(el),
                width = elw > options.maximum ? options.maximum : elw < options.minimum ? options.minimum : elw,
                fontBase = width / options.fontRatio,
                fontSize = fontBase > options.maxFont ? options.maxFont : fontBase < options.minFont ? options.minFont : fontBase
            ;

            setFontSize(el, fontSize + 'px');
            setLineHeight(el, fontSize * options.lineRatio + 'px');
        };

        // Make the magic visible
        // ======================
            // Attach the update method the DOM element
            element.updateFlowType = function(){changes(element);};

            // Make changes upon resize
            addEvent( window, 'resize', element.updateFlowType );

            // Set changes on load
            element.updateFlowType();
    };

        window.flowtype = flowtype;

}());

