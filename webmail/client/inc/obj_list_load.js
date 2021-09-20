_me = obj_list_load.prototype;
function obj_list_load(){};

/**
 *	obj_list_load
 *	bottom preloading list

	Public events:

		_onrefresh
		_onremove
		_onclick
		_oncontext

 */
_me.__constructor = function() {
	//Options
	this.__separators = [];
	this.__separator;

	this.__aRequestData = {counter:0};
	this.__loading = 2;

	this.__refresh = false;
	this.__norefresh = false;

	this.__aData = {};
	this.__idTable = {};

	//Init
	var me = this;

	this.__body = this._getAnchor('main');
	this.__w = this._main.offsetWidth;
	this.__h = this._main.offsetHeight;

	this.__sep1 = {};
	this.__sep2 = {};

	this._getAnchor('refresh').onclick = function(){
		if (me._onrefresh && me._refresh())
			me._onrefresh();
	};

	//Handlers
	this.__body.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (me._onclick)
			me._onclick(e, elm);

		me.__exeEvent('onclick',e,{"elm":elm,"owner":me});
	};

	this.__body.oncontextmenu = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			b = true;

		if (me._oncontext)
			b = me._oncontext(e, elm);

		me.__exeEvent('oncontext',e,{"elm":elm,"owner":me});

		return b;
	};

	this.__body.onscroll = function(e){

		if (me._destructed) return;

		if (me.__body.scrollHeight - me.__body.scrollTop < me.__body.clientHeight*1.2){
			if (!me.__loading)
				me._fetch();
		}

		//Refresh on top
		var top = me.__body.scrollTop;
		if (top<10 && me._refresh() && me._onrefresh)
			me._onrefresh();

		//move separators
		for(var elm1, elm2, i = me.__separators.length-1; i>=0; i--)
			if (top<me.__separators[i].offsetTop)
				elm2 = me.__separators[i];
			else{
				elm1 = me.__separators[i];
				break;
			}


		if (me.__separator !== elm1){
			if (me.__anim && me.__anim.parentNode)
				me.__anim.parentNode.removeChild(me.__anim);

			if (elm1){
				me.__separator = elm1;
				me.__anim = elm1.cloneNode(true);
				me.__anim.style.position = 'absolute';
				me._main.appendChild(me.__anim);
			}
			else{
				delete me.__anim;
				delete me.__separator;
			}
		}

		if (me.__anim)
			if (elm2 && top+me.__anim.offsetHeight>elm2.offsetTop){
				me.__anim.style.top = (elm2.offsetTop - top - me.__anim.offsetHeight) + 'px';
			}
			else
				me.__anim.style.top = 0;

		if (me._onscroll) me._onscroll();
		me.__exeEvent('onscroll',e,{"owner":me});
	};

	//Resize
	var t, eFrame = mkElement('iframe',{frameborder:0,name:this._pathName + "#frame", marginheight:0, marginwidth:0, src:"", id: this._pathName + '#frame'});
	this._main.appendChild(eFrame);
	eFrame.contentWindow.onresize = function (e){
		try {
			if (this.__innerHeight != this.innerHeight || this.__innerWidth != this.innerWidth){

				this.__innerHeight = this.innerHeight;
				this.__innerWidth = this.innerWidth;

				if (Is.Defined(t)) clearTimeout(t);

				t = setTimeout(function(){
					if (me && !me._destructed){
						me.__body.onscroll();

						if (me._onresize) me._onresize(e, me._main);
						me.__exeEvent('onresize',e,{"elm":me._main, "owner":me});
					}
				},500);
			}
		} catch(e) {}
	};

	//Scrollbar
	this._scrollbar(this.__body, this._main);
};

_me._refresh = function(b){
	if (Is.Defined(b)){
		if (b)
			addcss(this._main, 'refresh');
		else
			removecss(this._main, 'refresh');

		this.__refresh = b;
	}
	else
		return this.__refresh || false;
};

_me._clear = function(bNoRequest, bNoPlaceholder){
	this.__loading = 2;
	this.__w = 0;
	this.__h = 0;

	this.__aData = {};
	this.__aDataLink = {};
	this.__idTable = {};

	if (this.__refresh)
		removecss(this._main, 'refresh');
	removecss(this._main, 'loading');

	this._mask(false);

	this.__refresh = false;
	this.__norefresh = false;

	this.__separators = [];
	this.__sep1 = {};
	this.__sep2 = {};

	if (this.__anim && this.__anim.parentNode){
		this.__anim.parentNode.removeChild(this.__anim);
		delete this.__anim;
	}
	if (this.__anim_last && this.__anim_last.parentNode){
		this.__anim_last.parentNode.removeChild(this.__anim_last);
		delete this.__anim_last;
	}
	delete this.__separator;

	if (!bNoRequest)
		this.__aRequestData = {};
	// else
	// //if (!bNoPlaceholder)
	// 	addcss(this._main,'noitems');

	this.__aRequestData.counter = 0;
	this.__aRequestData.uniq = unique_id()*1;
	this._clean();

	//Clean body
	[].slice.call(this.__body.childNodes).reverse().forEach(function(elm){
		elm.parentNode.removeChild(elm);
	});
};

_me._fetch = function(){
	if (this.__loading == 0){
		var hmax = Math.min(this.__body.clientHeight || 1,  window.screen.height) * 1.2,
			elm, n = this.__body.childNodes;

		if (!n.length || !(elm = n[n.length-1]))
			elm = {offsetTop: 0, offsetHeight: 0};

		if (this._request && elm.offsetTop + elm.offsetHeight < hmax + this.__body.scrollTop){
			this._request();
			return true;
		}
	}

	return false;
};

_me._row = function(sHTML, sCSS, sRel){
	var anchor = this.__aRequestData.counter++,
		elm = mkElement('section', {id: this._pathName + '#' + anchor, innerHTML:sHTML || '', className: 'item' + (sCSS?' '+sCSS:'')});

	if (sRel)
		elm.setAttribute('rel', sRel);

	//removecss(this._main,'noitems');

	this.__body.appendChild(elm);

	return {anchor:anchor, elm:elm};
};

_me._separator = function(sHTML, sCSS){
	var anchor = this.__aRequestData.counter++;
		anchor = this._pathName + '#' + anchor;

	var	elm = mkElement('div', {id: anchor, innerHTML:sHTML || '', className: 'separator' + (sCSS?' '+sCSS:'')});

	this.__body.appendChild(elm);
	this.__separators.push(elm);
	return {anchor:anchor, elm:elm};
};

_me._remove = function(iAnchor, sData_id, bFire){
	//remove anchor objects
	this._clean(iAnchor);

	//remove SECTION
	var elm = this._getAnchor(iAnchor);
	if (elm){

		//Ungroup objects
		if (elm.nextSibling && /*(!hascss(elm,'group') || hascss(elm,'com')) &&*/ hascss(elm.nextSibling,'group'))
			this._ungroupNode(elm, elm.nextSibling);

		//Remove separator
		if (elm.previousSibling && hascss(elm.previousSibling,'separator') && (!elm.nextSibling || hascss(elm.nextSibling,'separator'))){
			var tmp = elm.previousSibling,
				p = inArray(this.__separators, tmp);

			if (p>-1){
				this.__separators.splice(p,1);
				tmp.parentNode.removeChild(tmp);
				this.__body.onscroll();
			}

			if (this.__sep1 && this.__sep1.row && this.__sep1.row.elm === elm)
				delete this.__sep1.row;
		}

		//ungroup
		if (this.__sep2 && this.__sep2.row && this.__sep2.row.elm === elm)
			delete this.__sep2.row;

		elm.parentNode.removeChild(elm);

		if (!this.__body.childElementCount)
			addcss(this._main,'noitems');
	}

	if (this._onremove)
		this._onremove(iAnchor, sData_id, bFire);

	this._fetch();
};

_me._ungroupNode = function(prev, elm){
	removecss(elm,'group');
};

_me._placeholder = function(v){
	var elm = this._getAnchor('placeholder');
	if (elm)
		elm.innerHTML = getLang(v);
};

_me._mask = function(b){
	if (b)
		addcss(this._main, 'mask');
	else
		removecss(this._main, 'mask');
};

//for testing
// _me._request = function(){

// };

// _me._response = function(){

// 	for(var i = 0; i<10; i++){
// 		this._row('#'+ (this.__tmp++));

// 		if (!(this.__tmp%10))
// 			this._separator(this.__tmp,'separator');
// 	}

// 	//Mandatory
// 	this.__loading = 0;
// 	this._fetch();
// };
