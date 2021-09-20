/*
 * Extension script: Info button form object
 *
 * INHERITS FROM obj_form_generic and obj_button
 *
 * Note: will work reliable only for buttons wider than 20px  
 * and will set and require overflow auto for containing element
 * (and a speech bubble with approximate minimum dimensions 50x30px)
 */

_me = obj_info_button.prototype;
function obj_info_button(){};

/**
* @brief: Creates button with speech bubble when clicked
* @date : 30.10.2012
* @author: martin
**/
_me.__constructor = function(){
	this.__eIN.value = "";

	var elm = document.createElement('div');

	var bubble = document.createElement('div');
	bubble.className = 'bubble';
	elm.appendChild(bubble);
	var flap = document.createElement('div');
	flap.className = 'flap';
	flap.appendChild(document.createElement('div'));
	elm.appendChild(flap);

	this._main.appendChild(elm);
	elm.className = this._type;

	bubble.style.zIndex = maxZIndex.get();
	flap.style.zIndex = maxZIndex.get();

	bubble.style.display = 'none';
	flap.style.display = 'none';

	var container = this._main.parentNode.parentNode.parentNode;

	var me = this;
	var open = false;
	this.__eInfo = bubble;

	function close(e) {
		var trg = e ? e.target : event.srcElement;
		while(trg.nodeName!='BODY') {
			if(trg==me._main) break;
			trg = trg.parentNode;
		}
		if(trg.nodeName=='BODY') {	// Close only if outside bubble
			bubble.style.display = 'none';
			flap.style.display = 'none';
			removecss(me._main,'open');
			gui._disobeyEvent('click',[me,close]);
			open = false;
		}
	}

	this._main.parentNode.style.overflow = 'visible';

	this.__eIN.onclick = this._main.onclick = function (e){
		// Show/hide speech bubble on click
		if(!e) {
			e = window.event;
			e.target = e.srcElement;
		}

		if(this == e.target) {
			if (!me._disabled()){
				if(!open) {
					addcss(me._main,'open');

					var y = this.offsetHeight;
					if(container.offsetHeight/2<this.offsetTop) {
						bubble.style.bottom = (y+2) + 'px';
						flap.style.top = '-3px';
						addcss(flap,'up');
					} else {
						bubble.style.top = (y-2) + 'px';
						flap.style.bottom = '0px';
						addcss(flap,'down');
					}

					var x = this.offsetWidth/2 - 14;
					flap.style.left = x + 'px';

					var m = me._main.parentNode.offsetWidth;
					bubble.style.maxWidth = (m - 10) + 'px';
					bubble.style.display = 'block';
					var w = bubble.offsetWidth;
					var l = this.parentNode.offsetLeft;
					var r = m - l - this.offsetWidth;
					if(w/2 > l) { // Leaning to left side
						bubble.style.left = (-l+5) + 'px';
						bubble.style[(hascss(flap,'up')?'borderBottomLeftRadius':'borderTopLeftRadius')] = (l+x)<7 ? (l+x) + 'px' : '7px';
					} else if(w/2 > r) { // Leaning to right side
						bubble.style.left = 'auto';
						bubble.style.right = (-r+3) + 'px';
						bubble.style[(hascss(flap,'up')?'borderBottomRightRadius':'borderTopRightRadius')] = (r+x)<7 ? (r+x) + 'px' : '7px';
					} else { // Centered
						bubble.style.left = (-w/2 + 15) + 'px';
					}
					flap.style.display = 'block';

					gui._obeyEvent('click',[me,close]);

					open = true;

				} else
					close({target:document.body});

				if (elm == me._main)
					me._focus();

				if (me._onclick)
					me._onclick(e);

			}
			if(e.stopPropagation) e.stopPropagation();
			return false;
		}
	}
	// Clicking on the flap will also close bubble
	this._main.onclick = function(e) {
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if(open && elm.nodeType==1 && elm.nodeName=='DIV') {
			close(e);
		}
	}

};

_me._content = function(sHtml) {
	if(sHtml==undefined)
		return this.__eInfo.innerHTML;
	else
		this.__eInfo.innerHTML = sHtml;
}
