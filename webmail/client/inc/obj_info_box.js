/*
 * Extension script: Info box object
 *
 */

_me = obj_info_box.prototype;
function obj_info_box(){};

/**
* @brief: Creates an info box with some content
* @date : 19.02.2013
* @author: martin
**/
_me.__constructor = function(){
	this.__eBox = this._getAnchor('box');
};

/*	Place info box
 *
 *	context argument is object with properties
 *		for where to put the info box (container element)
 *		and a which parent to use (parent element)
 *
 *	dimension argument specifies characteristics of the info box
 *		left, right, top defines distance (margin) to the parent element
 *		offset defince the vertical distance from the element top
 *		flip desides if the info box should flip if not enough space
 */
_me._context = function(context, dimension) {

	if (dimension==undefined)
		dimension = {};

	this._main.oncontextmenu = function(e) {
		return false;
	};

	var target = this.__eTarget = context.target;
	var box = this.__eBox;

	var leftpad = dimension.left || 5;
	var rightpad = dimension.right || 5;
	var toppad = dimension.top || 7;

	var offset = dimension.offset || 2;
	var flip = dimension.flip!=undefined ? dimension.flip : true;

	var rect = target.getBoundingClientRect();
	offsetX = context.x - rect.left;
	offsetY = context.y - rect.top;

	var x = rect.left, y = context.y;
	var elm = target;
	while (elm && elm.offsetParent) {
		elm = elm.offsetParent;
	}

	if(target.offsetHeight<50)
		y = target.getBoundingClientRect().top;

	var xspace = elm.offsetWidth;
	box.style.maxWidth = (xspace-leftpad-rightpad) + 'px';
	box.style.position = 'absolute';
	box.style.display = 'block';

	var yspace = elm.offsetHeight;
	var placing = toppad + y + offset + 10 + box.offsetHeight;
	if(flip && yspace<placing) {
		addcss(box,'up');
		box.style.bottom = ((elm.offsetHeight-y)+10-offset-4) + 'px';
	} else {
		addcss(box,'down');
		if(target.offsetHeight<50)
			y += target.offsetHeight;
		else if(offsetY<30)
			y += 30 - offsetY;

		box.style.top = (y+offset+10-7) + 'px';
	}

	var boxwidth = target.offsetWidth;
	var boxmid = boxwidth/2;
	var width = box.offsetWidth;
	var place = parseInt(x+boxmid-width/2);

	if(place < leftpad) { // Leaning to left side
		box.style.left = leftpad + 'px';
		box.style.right = 'auto';
		box.style[(hascss(box,'up')?'borderBottomLeftRadius':'borderTopLeftRadius')] = '3px';
	} else if(leftpad+x+width+rightpad > xspace) { // Leaning to right side
		box.style.left = 'auto';
		box.style.right = rightpad + 'px';
		box.style[(hascss(box,'up')?'borderBottomRightRadius':'borderTopRightRadius')] = '3px';
	} else { // Centered
		box.style.left = place + 'px';
	}


	box.style.zIndex = maxZIndex.get();
	this._main.style.display = 'none';
};

_me._show = function() {
	addcss(this._main,'show');
	this._main.style.display ='block';

	var box = this.__eBox.style;	// Interestingly, setting opacity directly on _main doesn't work
	box.opacity = box.opacity || 0;

	if(navigator.userAgent.indexOf('MSIE 8')!=-1)
		box.filter = "alpha(opacity="+parseInt(box.opacity*100)+")";	// Only IE8, remove when allowed

	if(this.__fade_interval)
		clearInterval(this.__fade_interval);

	this.__fade_interval = setInterval(function() {
		var opacity = parseFloat(box.opacity) + 0.1;
		if(opacity>0.95) {
			box.opacity = 1;
			clearInterval(this.__fade_interval);
		} else {
			box.opacity = opacity;
			if(navigator.userAgent.indexOf('MSIE 8')!=-1)
				box.filter = "alpha(opacity="+parseInt(opacity*100)+")";	// Only IE8, remove when allowed
		}
	},50);

};

_me._hide = function() {

	var me = this;
	var box = this.__eBox.style;

	removecss(this._main,'show');

	if(this.__fade_interval)
		clearInterval(this.__fade_interval);

	this.__fade_interval = setInterval(function() {
		var opacity = box.opacity - 0.1;

		if(opacity<0.05) {
			box.opacity = 0;
			clearInterval(me.__fade_interval);
			maxZIndex.remove(box.zIndex);
			me._destruct();
		} else {
			box.opacity = opacity;
			if(navigator.userAgent.indexOf('MSIE 8')!=-1)
				box.filter = "alpha(opacity="+parseInt(opacity*100)+")";	// Only IE8, remove when allowed
		}
	},50);

};

// Add content using text or html, should be properly escaped before
_me._content = function(sHtml) {
	if(sHtml==undefined)
		return this.__eBox.innerHTML;
	else
		this.__eBox.innerHTML = sHtml;
};

// Add content using a template and values
_me._template = function(template,values) {
	this._draw(template,'box',values);
};