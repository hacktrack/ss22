/*
 * Global tooltip imitating browser tooltip shown from title attribute during hover
 *
 * Accepts a single line title and an element to attach it to (with _add method).
 *
 * Optional argument args can specify custom coordinates (either exact as integers,
 * or relative to element, eg. "+45" or "-10" as string) and classname, eg. {x: 456, y: "+45", css: "warning"}
 *
 * Title can be changed afterwards with _title method.
 *
 * Martin Ekblom 2013
 */

_me = obj_tooltip.prototype;
function obj_tooltip(){};

// Construct tooltip and listen for clicks anywhere
_me.__constructor = function() {

	this.__active_tooltip = null;
	this.__pending_tooltip = null;
	this.__default_className = this._main.className;

	gui._obeyEvent('click',[this,'_hide']);

	this._position('absolute');
	this._zIndex();

};

// Add tooltip to element, will open and close automatically by hover
_me._add = function(elm,title,args) {

	var me = this,
		args = args || {};

	// Display tooltip when hovering
	AttachEvent(elm,'onmousemove',function(e){
		var m,
			rect = elm.getBoundingClientRect(),
			top = parseInt(rect.top),
			left = parseInt(rect.left),
			place = {x: args.x, y: args.y};

		// In case coordinates are relative (a string with + or -, eg. "+5"), calculate position relative to element position
		if(typeof args.x=="string" && (m = args.x.match(/^([+-])(.*)$/)))
			place.x = m[1]=='-' ? left - parseInt(m[2]) : left + parseInt(m[2]);
		else if(!args.x)
			place.x = e.clientX;

		if(typeof args.y=="string" && (m = args.y.match(/^([+-])(.*)$/)))
			place.y = m[1]=='-' ? top - parseInt(m[2]) : top + parseInt(m[2]);
		else if(!args.y)
			place.y = e.clientY;

		args.place = place;

		// Show tooltip (will be shown with delay)
		me._show(elm,title,args);
	});

	// If we are leaving the element, remove tooltip
	AttachEvent(elm,'onmouseout',function(e){
		e = e || window.event;

		if(!Is.Child(e.relatedTarget || e.toElement,elm))
			me._hide(elm);
	});

};

// Manually show tooltip (tooltip will be needed to _hide() manually also)
_me._show = function(elm,title,args) {
	var me = this,
		args = args || {},
		title = title;

	// Skip if we are already displaying or waiting for tooltip for this element
	if(this.__active_tooltip==elm) {
		// If we are waiting to close, skip it
		if(this.__close_timeout)
			clearTimeout(this.__close_timeout);
		// Set new timeout to close in 3 seconds
		if (args.hide !== false)
			this.__close_timeout = setTimeout(function(){
				try { me._hide() } catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
			},args.hide || 3000);
		// Only return, tooltip is already showing
		return;
	} else if(this.__pending_tooltip==elm) return; // We are already waiting for this tooltip to show, only return

	// Close any pending or displayed tooltip
	this._hide();

	// Add timeout for displaying tooltip
/*
	this.__tooltip_timeout = setTimeout((function(eTarget,sTitle,x,y,css,args){
		return function() {
			me.__display(eTarget,sTitle,x,y,css,args);
		}
	})(elm,title,args.x,args.y,args.css,args), args.delay || 200);

*/
	this.__tooltip_timeout = setTimeout(function(){	me.__display(elm,title,args)	}, args.delay || 200);

	// Remember that we are waiting for this tooltip to display
	this.__pending_tooltip = elm;
};

// Hide tooltip, normally happens automatically (by any click or after 3 seconds)
_me._hide = function(elm) {
	// Make sure the element really is the kind of element we expect
	if(!(elm && elm instanceof HTMLDivElement))
		elm = null;

	// If there is any upcoming tooltip, cancel it
	if(this.__tooltip_timeout) {
		clearTimeout(this.__tooltip_timeout);
		this.__pending_tooltip = null;
	}

	// If tooltip is open, restore and hide it (if specified only if shown for that element)
	if(this.__active_tooltip && (elm && this.__active_tooltip==elm || !elm)) {
		this._main.innerHTML = '';
		this.__active_tooltip = null;
		this._main.className = this.__default_className;
		this._main.style.display = 'none';
	}

	// Restore classname to original
	this._main.className = this.__default_className;

	// Clear auto-close timeout if necessary
	if(this.__close_timeout)
		clearTimeout(this.__close_timeout);
};

// Change label for an already active tooltip
_me._title = function(elm, sTitle) {
	if (elm) elm.setAttribute('x-tooltip', sTitle);
};

/* Internal implementation */

_me.__display = function(elm,sTitle,args) {

	var me = this,
		x = args.place?args.place.x:args.x,
		y = args.place?args.place.y:args.y,
		css = args.css;

	// Keep track of current state
	this.__pending_tooltip = null;
	this.__active_tooltip = elm;

	// Return if there is no element
	if(!elm || !elm.parentNode) return;

	// Explicitly set title overrides original title
	if (elm.getAttribute('x-tooltip'))
		sTitle = elm.getAttribute('x-tooltip');

	// Show tooltip at specified place
	this._place(x || '0', y || '0');

	if (args.html)
		this._main.innerHTML = sTitle;
	else
		this._main.appendChild(document.createTextNode(sTitle));

	this._main.style.display = 'block';

	// Add custom style class
	if (css)
		addcss(me._main,css);

	// Add three sec timeout to close tooltip again
	if (args.hide !== false)
		this.__close_timeout = setTimeout(function(){
			try { me._hide() } catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e)}
		},args.hide || 3000);

	this._focus();
};