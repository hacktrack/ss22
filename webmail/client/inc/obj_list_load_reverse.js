_me = obj_list_load_reverse.prototype;
function obj_list_load_reverse(){};

/**
 * obj_list_load
 * bottom preloading list
 */
_me.__constructor = function() {

	this.__newitems = 0;

	this.__body.onscroll = function(e){

		if (this._destructed) return;

		if (this.__loading == 0 && this.__body.scrollTop < this.__body.clientHeight/4)
			this._fetch();
		else
		if (this.__aRequestData.fetchnew && this.__loading != 1 && this.__aRequestData.youngest)
			this._fetch();

		var top = this.__body.scrollTop;

		//move separators
		if (this.__separators.length){
			for(var elm1, elm2, i = this.__separators.length-1; i>=0; i--)
				if (top<this.__separators[i].offsetTop)
					elm2 = this.__separators[i];
				else{
					elm1 = this.__separators[i];
					break;
				}

			if (this.__separator !== elm1){
				if (this.__anim && this.__anim.parentNode)
					this.__anim.parentNode.removeChild(this.__anim);

				if (elm1){
					this.__separator = elm1;
					this.__anim = elm1.cloneNode(true);
					this._main.appendChild(this.__anim);
				}
				else{
					delete this.__anim;
					delete this.__separator;
				}
			}
		}

		if (this.__anim){
			if (elm2 && top+this.__anim.offsetHeight>elm2.offsetTop)
				this.__anim.style.top = (elm2.offsetTop - top - this.__anim.offsetHeight) + 'px';
			else
				this.__anim.style.top = 0;

			if (this.__anim_last)
				this.__anim_last.style.top = this.__anim.style.top;
		}
		else
		if (this.__anim_last){
			if (elm2 && top+this.__anim_last.offsetHeight>elm2.offsetTop)
				this.__anim_last.style.top = (elm2.offsetTop - top - this.__anim_last.offsetHeight) + 'px';
			else
				this.__anim_last.style.top = 0;
		}

		if (this._scroll()>50)
			addcss(this._main, 'refresh');
		else{
			removecss(this._main, 'refresh', 'newitem', 'scrollbtn');
			this._getAnchor('refresh').innerHTML = getLang('COMMON::SCROLL_DN');
			this.__newitems = 0;
		}

		if (this._onscroll) this._onscroll();
		this.__exeEvent('onscroll',e,{"owner":this});

	}.bind(this);

	this._getAnchor('refresh').innerHTML = getLang('COMMON::SCROLL_DN');
	this._getAnchor('refresh').onclick = function(){
		this._scroll(0);
	}.bind(this);
};

_me._scroll = function(v){
	if (Is.Number(v))
		this.__body.scrollTop = this.__body.scrollHeight - this.__body.clientHeight - v;
	else
		return this.__body.scrollHeight - this.__body.clientHeight - this.__body.scrollTop;
};

_me._scrollBy = function(y){
	if (this.__body.scrollBy)
		this.__body.scrollBy(0, y);
	else{
		this.__body.scrollTop = (this.__body.scrollTop + y);
	}
};

_me._row = function(sHTML, sCSS, sRel){

	var	anchor = this.__aRequestData.counter++,
		elm = mkElement('section', {id: this._pathName + '#' + anchor, innerHTML:sHTML || '', className: 'item' + (sCSS?' '+sCSS:'')});

	if (sRel)
		elm.setAttribute('rel', sRel);

	var offset = this.__body.scrollHeight - this.__body.clientHeight - this.__body.scrollTop;

	//Comments mode
	if (this.__pinned){
		if (this.__pinned.nextSibling == null)
			this.__body.appendChild(elm);
		else
			this.__body.insertBefore(elm, this.__pinned.nextSibling);
	}
	else
	if (this.__body.firstChild)
		this.__body.insertBefore(elm, this.__body.firstChild);
	else
		this.__body.appendChild(elm);

	this.__body.scrollTop = (this.__body.scrollHeight - this.__body.clientHeight - offset);

	return {anchor:anchor, elm:elm};
};

_me._separator = function(sHTML, sCSS, bLoose, bCleanup){
	var elm = mkElement('div', {innerHTML:sHTML || '', className: 'unselectable separator' + (sCSS?' '+sCSS:'')});

	if (bLoose)
		return {elm:elm};

	if (bCleanup)
		this.__separators = this.__separators.filter(function(separator) {
			if(separator && separator.innerHTML === sHTML) {
				this.__body.removeChild(separator);
				return false;
			}
			return true;
		}, this);


	var anchor = this.__aRequestData.counter++,
		offset = this.__body.scrollHeight - this.__body.clientHeight - this.__body.scrollTop;

	elm.setAttribute('id', this._pathName + '#' + anchor);

	if (this.__body.firstChild)
		this.__body.insertBefore(elm, this.__body.firstChild);
	else
		this.__body.appendChild(elm);

	this.__separators.unshift(elm);

	this.__body.scrollTop = (this.__body.scrollHeight - this.__body.clientHeight - offset);

	return {anchor:anchor, elm:elm};
};

_me._fetch = function(uid){

	if (uid && this.__aRequestData.uniq != uid)
		return;

	if (this.__loading == 0){

		var hmax = Math.min(this.__body.clientHeight,  window.screen.height);
		if (this.__body.scrollTop<hmax/4 || this.__body.scrollHeight<hmax){

			if (this._request){
				this._request(uid);
				return true;
			}

			return false;
		}
	}

	if (this.__loading != 1 && this.__aRequestData.fetchnew){

		if (this.__aRequestData.youngest || this.__loading == 2){

			//Note: clientHeight == 0 for display:none (inside inactive tab or popup), .offsetParent === null can be also used
			if (this.__body.clientHeight === 0 || (this.__body.scrollTop + this.__body.clientHeight > this.__body.scrollHeight*0.75 && this._request2)){
				this._request2(uid);
				return true;
			}
		}
		else{
			this._clear(true);
			this.__loading = 0;
		}
	}

	return false;
};

//load history (top)
//_me._request = function(){}

//load recent (bottom)
//_me._request2 = function(){}