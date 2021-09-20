/*
 *	Expandable content container based on vertical space
 *	with optional header and footer content - this is
 *	basically just a shortcut to make a browser independent
 *	footer, content, header with expandable core and scrollbars
 *
 *	Using flexbox model (IE10, Opera12, Gecko, Webkit) instead of tables and js resize for IE 8 & 9
 *	W3C Candidate Recommendation: http://www.w3.org/TR/css3-flexbox/ (for now browser prefixed draft spec used)
 *
 *	Martin Ekblom 2012
 */

_me = obj_container.prototype;
function obj_container(){};

/**
 * @brief: CONSTRUCTOR, create create expandable container for content
 * @date : 15.11.2012
 **/
_me.__constructor = function(){
	var me = this;

	this._scrollbar(this._getAnchor('core'),this._getAnchor('core').parentNode);

	var eHeader = this.__eHeader = this._getAnchor('header');
	var eExpander = this.__eExpander = this._getAnchor('core').parentNode
	var eFooter = this.__eFooter = this._getAnchor('footer');

	// Non CSS solution for IE 8 and 9
	if(/MSIE [89]/.test(navigator.userAgent)) {
		// Using good old ie hack
		function iebox(e) {
			var dh = eHeader.offsetHeight + eFooter.offsetHeight;
			eExpander.style.height = (me._main.offsetHeight - dh) + 'px';
		}
		eHeader.onresize = iebox;
		this._main.onresize = iebox;
		eFooter.onresize = iebox;
		// Resize now to current size
		iebox();
	}

	// Using CSS table display for older versions of Opera (before v 12.1)
	if(/^Opera/i.test(navigator.userAgent) && window.getComputedStyle && window.getComputedStyle(gui.test.content._main,null).display!='flex') {
		this._tablerize();
	}

};	

// This function converts the flexbox to a css table (imitating old tablestyle design)
_me._tablerize = function () {
	var tr1 = this._main.appendChild(document.createElement('div'));
	tr1.appendChild(this.__eHeader);
	var tr2 = this._main.appendChild(document.createElement('div'));
	tr2.appendChild(this.__eExpander);
	var tr3 = this._main.appendChild(document.createElement('div'));
	tr3.appendChild(this.__eFooter);

	this._main.style.display = 'table';
	tr1.style.display = tr2.style.display = tr3.style.display = 'table-row';
	this.__eHeader.style.display = this.__eExpander.style.display = this.__eFooter.style.display = 'table-cell';
	this.__eExpander.style.height = '100%';
}