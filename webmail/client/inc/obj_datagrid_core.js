_me = obj_datagrid_core.prototype;
function obj_datagrid_core(){};

_me.__constructor = function(){
	var me = this;

	this._telemetry = 'off';

	// MSIE fix
	this._main.parentNode.style.overflow = 'hidden';

	//sort vars
	this.__sortColumn;
	this.__sortType;

	this._aData;
	this._aCols;

	this._cookiesEnabled = false;

	//search
	this._SQLfilter = '';
	this._SQLfilter_last = '';
	this._SQLfulltext = '';
	this._SQLfulltext_last = '';

	this.__value = [];
	this.__valueData = {};

	this.__cursor;

	//Drag Drop
	this.__dragtype = '';
	this.__dndtimer = '';

	//anchors
	this.__eHeader	= this._getAnchor('header');
	this.__eBody	= this._getAnchor('body');
	this.__eContainer1 = this._getAnchor('container1');
	this.__eContainer2 = this._getAnchor('container2');

	this._scrollbar(this.__eContainer2);

	//*** FOCUS
    // this._main[window.navigator.msPointerEnabled?'onmspointerup':'onclick'] = function(e){

	// 	//Disable focus for Tablet
	// 	var e = e || window.event;
    // 	if (e.pointerType && (e.pointerType == e.MSPOINTER_TYPE_TOUCH || e.pointerType == e.MSPOINTER_TYPE_PEN || e.pointerType == 'touch' || e.pointerType == 'pen'))
    // 		return;

	// 	me._focus();
	// };

	//*** RESIZE
	this.__move_timeout;
	this.__eHeader.onmousedown = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (e.button == 2 || elm == this) return true;

		if (elm.tagName == 'DIV' || elm.tagName == 'P'){
			var id = me.__getId(elm.id || elm.parentNode.id,'#');

			if (!id || !(id = id[0]))
				return;

			// move column
			if (elm.tagName == 'DIV'){
				if (me.__move_timeout)
					window.clearTimeout(me.__move_timeout);

				me.__move_timeout = window.setTimeout('try{'+me._pathName+'.__move("'+id+'",'+e.clientX+');}catch(err){gui._REQUEST_VARS.debug && console.log(this._name||false,err);}',400);
			}
			// resize
			else{
				elm = elm.parentNode;
				if (me._onresize) me._onresize(e,elm,id,me._aCols[id].arg);
				me.__exeEvent('onresize',e,{"arg":me._aCols[id].arg,"id":id,"elm":elm,"owner":me});
			}
		}
	};
	this.__eHeader.onmouseup = function(e){
		if (me.__move_timeout){
			window.clearTimeout(me.__move_timeout);
			me.__move_timeout = null;
		}
	};

	// Click on header to sort by that column data (or reverse sort if the column is previously selected)
	this.__eHeader.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName == 'P' || elm == this)
			return false;

		// clear Move or skip sorting
		if (me.__move_timeout) window.clearTimeout(me.__move_timeout);

		// vraci to blby ID kdyz se klikne mimo!
		elm = elm.id?elm:elm.parentNode;

		var id = elm.id;

		if (elm.tagName != 'DIV' || !id || !(id = me.__getId(id,'#')) || !(id = id[0])) return;

		//if (!me._aFolder && !me._listener) return;

		var arg = me._aCols[id].arg;
		if (!arg || !arg.sort) return;

		if (me.__sortColumn==null)
			me.__sortType = arg.sort=='desc'?1:0;
		else
		if (me.__sortColumn!=id){
			var tmp;
			if((tmp = me.__getElement([me.__sortColumn],'#')))
				removecss(tmp,'desc','asc');

			tmp = null;
			me.__sortType = arg.sort=='desc'?1:0;
		}
		else{
			removecss(elm,'desc','asc');
			me.__sortType = me.__sortType?0:1;
		}

		addcss(elm,me.__sortType?'desc':'asc');
		me._serverSort('',id,me.__sortType?'desc':'asc');

		if (me._onsort) me._onsort(e,elm,id,arg,(me.__sortType?'desc':'asc'));
		me.__exeEvent('onsort',e,{"arg":arg,"id":id,"type":(me.__sortType?'desc':'asc'),"elm":elm,"owner":me});

		//Telemetry reporting
		if (gui.telemetry)
			gui.telemetry._add({id:elm.id, type:me._type});
	};

	this.__eContainer2.onclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		//stop DnD
		if (me.__dndtimer)
			window.clearTimeout(me.__dndtimer);

		var id, arg = {};

		if (me._getFolder)
			arg = me._getFolder();

		if(elm.tagName=='DIV' && !elm.id && elm.parentNode.id)
			elm = elm.parentNode;

		if (elm.tagName != 'DIV' && elm!=this)
			elm = Is.Child(elm,'DIV');

		if (elm && elm.tagName == 'DIV' && elm.id && (id = me.__getId(elm.id))){
			if (id[0]){
				me._select_all = false;

				if (id[1] && me._aData[id[0]] && me._aData[id[0]].arg)
					arg = objConcat(arg,me._aData[id[0]].arg);

				if (e.type == 'contextmenu'){
					if (me._oncontext) me._oncontext(e,elm,arg,me._aData[id[0]].id,id[1]);
					me.__exeEvent('oncontext',e,{"arg":arg,"id":me._aData[id[0]].id,"cell":id[1],"elm":elm,"owner":me});
					return false;
				}

				if (id[1]){
					if (e.type == 'dblclick'){
						if (me._ondblclick)
							me._ondblclick(e,elm,arg,id[0],id[1]);

						me.__exeEvent('ondblclick',e,{"arg":arg,"id":id[0],"cell":id[1],"elm":elm,"owner":me});
						return true;
					}

					if (!me._select_single && (e.ctrlKey || e.metaKey)){
						var p, v = clone(me.__value);
						if ((p = inArray(v, id[0]))>-1)
							v.splice(p,1);
						else
							v.push(id[0]);

						me._value(v);
					}
					else
					if (!me._select_single && e.shiftKey)
						me.__blockselection(id[0],true);
					else
						me._value([id[0]]);

                    var aClickType = [];
					if (e.ctrlKey || e.metaKey)
						aClickType.push('CTRL');
					if (e.shiftKey)
						aClickType.push('SHIFT');

					if (me._onclick) me._onclick(e,elm,arg,id[0],id[1],aClickType);
					me.__exeEvent('onclick',e,{"arg":arg,"id":id[0],"cell":id[1],"elm":elm,"owner":me});
				}
			}
		}
		else
		    delete arg.iid;

		if (e.type == 'dblclick'){
			if (me._ondblclick)
				me._ondblclick(e,null,arg);

			me.__exeEvent('ondblclick',e,{"owner":me,"arg":arg});
		}
		else
		if (e.type == 'contextmenu'){
			if (me._oncontext)
				me._oncontext(e,null,arg);

			me.__exeEvent('oncontext',e,{"owner":me,"arg":arg});
			return false;
		}

		return true;
	};

	//*** SCROLLING
	this.__iScroll_left = 0;
	this.__eContainer2.onscroll = function(e){
		if (me.__iScroll_left != this.scrollLeft){
			me.__iScroll_left = this.scrollLeft;

			if(gui._rtl && this.scrollRight)
				me.__eHeader.style.marginRight = -this.scrollRight+'px';
			else
				me.__eHeader.style.marginLeft = -me.__iScroll_left+'px';
		}

		if (me.__selectByPosition)
			me._selectPosition();
	};

	this._getAnchor('noitems').oncontextmenu = this._getAnchor('noitems').ondblclick = function(e){
		var e = e || window.event,
			arg = {};

		if (me._getFolder)
			arg = me._getFolder();

		if (e.type == 'dblclick'){
			if (me._ondblclick)
				me._ondblclick(e,null,arg);

			me.__exeEvent('ondblclick',e,{"owner":me,"arg":arg});
			return true;
		}
		else
		if (e.type == 'contextmenu'){
			if (me._oncontext)
				me._oncontext(e,null,arg);

			me.__exeEvent('oncontext',e,{"owner":me,"arg":arg});
			return false;
		}
	};

	this._main.oncontextmenu = this.__eContainer2.onclick;

	//this._main.ondblclick = this.__eContainer2.onclick;
	this.__eContainer2.ondblclick = this.__eContainer2.onclick;

	//Drag and Drop
	this.__eContainer2.onmousedown = function(e){
		if (me.__dndtimer){
			window.clearTimeout(me.__dndtimer);
			delete me.__dndtimer;
		}
		else{

			var e = e || window.event;

			if (!me.__dragtype || e.button>1 || !me.__initdrag) return true;

			var elm = e.target || e.srcElement,
				id,x = e.clientX,y = e.clientY;

			if (elm.tagName == 'DIV' && elm.id && (id = me.__getId(elm.id)) && id[0] && id[1]){

				// Disable scrollbar for Safari browser
				if (navigator && navigator.browser && navigator.browser.application == 'Safari')
					me._disable_scrolbar(me.__eContainer2, true, true);

				gui._obeyEvent('mouseup',[me,'__dndDispatch']);
				me.__dndtimer = window.setTimeout(function(){ try{me.__initdrag(id[0],x,y);}catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}}, 500);
			}
		}
	};

	//KEYBOARD HANDLERs
	this._main.setAttribute('tabindex',-1);
	//IE trick
	if (~currentBrowser().indexOf('MSIE')){
		AttachEvent(this._main, 'onclick', function () {
			me._focus();
		});
	}

	AttachEvent(this._main, 'onfocus', function (e) {
		if (this.__blurTimeout) clearTimeout(this.__blurTimeout);
		addcss(me._main, 'focused');
	});

	AttachEvent(this._main, 'onblur', function (e) {
		this.__blurTimeout = setTimeout(function () {
			try {
				removecss(me._main, 'focused');
			} catch (r) {
				gui._REQUEST_VARS.debug && console.log(this._name || false, r);
			}
		}, 200);
	});

	AttachEvent(this._main, 'onkeydown', function (e) {
		var e = e || window.event,
			src = e.target || e.srcElement,
			preventDefault = false;

		//Do not catch keyDn from input
		if (Is.Defined(src.value))
			return;

		//Find next position
		switch (e.keyCode) {
			//Enter
			case 13:
				if (me.__value.length && me.__value[0]) {
					var data = me._aData[me.__value[0]];
					if (data) {
						var arg = data.arg || {};

						if (me._onclick)
							me._onclick(e, null, arg, me.__value[me.__value.length - 1], null, []);

						me.__exeEvent('onclick', null, {
							"arg": arg,
							"id": data.id,
							"owner": me
						});
					}
				}
				return;

				//PgUp
			case 33:
				preventDefault = e.shiftKey;
				if (me.__eContainer2.scrollTop == 0)
					me._selectPosition('top');
				else {

					var sCol, elm, v = me._value();
					if (v && (v = v[v.length - 1])) {
						if (me.__small)
							sCol = '*';
						else
							for (sCol in me._aCols)
								break;

						if (sCol && (elm = document.getElementById(me._pathName + '/' + v + '/' + sCol))) {
							var box = getSize(me.__eContainer2),
								pos = getSize(elm);

							if (pos.y > box.y && pos.y - pos.h > box.y) {
								me._selectPosition('top');
								return;
							}
						}
					}

					me._value([]);
					me.__selectByPosition = 'top';
					me.__eContainer2.scrollTop -= me.__eContainer2.offsetHeight;
				}
				return;
				//PgDn
			case 34:
				preventDefault = e.shiftKey;
				if (me.__eContainer2.scrollTop + me.__eContainer2.offsetHeight == me.__eContainer2.scrollHeight)
					me._selectPosition('bottom');
				else {

					var sCol, elm, v = me._value();
					if (v && (v = v[v.length - 1])) {
						if (me.__small)
							sCol = '*';
						else
							for (sCol in me._aCols)
								break;

						if (sCol && (elm = document.getElementById(me._pathName + '/' + v + '/' + sCol))) {
							var box = getSize(me.__eContainer2),
								pos = getSize(elm);

							if (pos.y + pos.h < box.y + box.h && pos.y + (2 * pos.h) < box.y + box.h) {
								me._selectPosition('bottom');
								return;
							}
						}
					}

					me._value([]);
					me.__selectByPosition = 'bottom';
					me.__eContainer2.scrollTop += me.__eContainer2.offsetHeight;
				}
				return;

				//End
			case 35:
				preventDefault = e.shiftKey;
				if (me.__eContainer2.scrollTop + me.__eContainer2.offsetHeight == me.__eContainer2.scrollHeight)
					me._selectPosition('bottom');
				else {
					me._value([]);
					me.__selectByPosition = 'bottom';
					me.__eContainer2.scrollTop = me.__eContainer2.scrollHeight;
				}
				return;
				//Home
			case 36:
				preventDefault = e.shiftKey;
				if (me.__eContainer2.scrollTop == 0)
					me._selectPosition('top');
				else {
					me._value([]);
					me.__selectByPosition = 'top';
					me.__eContainer2.scrollTop = 0;
				}
				return;

				//Left
			case 37:
				preventDefault = e.shiftKey;
				var s = 0;
				if ((s = me.__eContainer2.scrollLeft) > 0) {
					s -= 20;
					me.__eContainer2.scrollLeft = s < 0 ? 0 : s;
				}
				return;

				//Right
			case 39:
				preventDefault = e.shiftKey;
				me.__eContainer2.scrollLeft += 20;
				return;

				//Up
			case 38:
				preventDefault = e.shiftKey;
				if (me.__value.length) {
					var act = me.__value[me.__value.length - 1],
						iPos;
					for (var i in me._aData) {
						if (i == act) break;
						iPos = i;
					}

					if ((!e.shiftKey || me._select_single) && typeof iPos != 'undefined')
						me._value([iPos]);
				}
				break;

				//Down
			case 40:
				preventDefault = e.shiftKey;
				if (me.__value.length) {
					var act = me.__value[me.__value.length - 1],
						found = false;
					for (var iPos in me._aData) {
						if (found)
							break;
						if (iPos == act)
							found = true;
					}

					if (!e.shiftKey || me._select_single)
						me._value([iPos]);
				}
				break;

			default:
				//Select all in view (Ctrl+A)
				if (!me._select_single && e.ctrlKey && !e.altKey && e.keyCode == 65) {
					me._select_all = true;
					var tmp = [];
					for (var i in me._aData)
						tmp.push(i);
					me._value(tmp);
					e.preventDefault();
				}

				if (me._onkeydown) {
					setTimeout(function () {
						me._onkeydown(e);
					}, 0);
				}

				return;
		}

		if (preventDefault) {
			e.preventDefault();
		}

		//SHIFT + Up | Down
		if (!me._select_single && e.shiftKey && (e.keyCode == 38 || e.keyCode == 40))
			me.__blockselection(iPos);

		if (me._onkeypress)
			me._onkeypress(e);
	});

	//@Note: apply only on width change
	var eFrame = mkElement('iframe',{frameborder:0,name:this._pathName + "#frame", marginheight:0, marginwidth:0, src:"", id: this._pathName + '#frame'});
	this._main.appendChild(eFrame);
	eFrame.contentWindow.onresize = function(e){
		if (this.__width != eFrame.offsetWidth){
			this.__width = eFrame.offsetWidth;

			me.__exeEvent('onsize',e,{"width":this.__width,"owner":me});
		}
	};
};

_me._placeholder = function (sValue, bHTML){
	this._getAnchor('noitems')[bHTML?'innerHTML':'innerText'] = sValue || getLang('DATAGRID::NOITEMS');
};

_me.__dndDispatch = function(){

	// Enable scrollbar for Safari browser
	if (navigator && navigator.browser && navigator.browser.application == 'Safari')
		this._disable_scrolbar(this.__eContainer2, false, false);

	if (this.__dndtimer){
		window.clearTimeout(this.__dndtimer);
		delete this.__dndtimer;
	}
	return false; // for _disobeyEvent
};

_me._disabled = function(b){
	if (Is.Defined(b))
		window[b?'addcss':'removecss'](this._main,'disabled');
	else
		return hascss(this._main,'disabled');
};

_me._getFocusElement = function(){
	return this._main;
};
_me._focus = function(){
	this._getFocusElement().focus();
};
_me._selectFirst = function(){
    if (this.__eContainer2.scrollTop==0)
		for (var id in this._aData){
			this._value([id]);
			return true;
		}

	return false;
};


	/**
	 * Shift + click|Up|Dn
	 **/

	/*
	- pole realnych pozic v DG z $v
	- najit blok ve kterem je $act
	- smazat ostatni bloky

	#UP
	je-li $iPos v $v
		- smazat vse pod $iPos vcetne $iPos

	- ptidat iPos na konec $v

	#DOWN
	je-li $iPos v $v
		- smazat vse nad $iPos vcetne $iPos

	- ptidat iPos na konec $v
	*/

	_me.__blockselection = function(id,bClick){
		if (typeof id == 'undefined')
			return;

		var j, v = clone (this.__value);

		//ziskat 1. sloupec
		if (this.__small)
			j = '*';
		else
		for(j in this._aCols)
			break;

		//kdyz neni posledni z value -> smaz vse
		if (!this.__getElement([v[v.length-1],j])){
			this._value([id]);
			return;
		}

		//najdi bloky
		var elm,id_pos,aBlock = [];
		for(var i = v.length-1; i>=0; i--){
			if ((elm = this.__getElement([v[i], j]))){
				aBlock.push([v[i],elm.offsetTop/this._row_height]);

				//kdyby nove id uz bylo vybrano
				if (v[i] == id)
					id_pos = aBlock[aBlock.length-1][1];

				elm = null;
			}
			else
				v.splice(i,1);
		}

		//najdi pozici noveho id
		if (typeof id_pos == 'undefined')
			if ((elm = this.__getElement([id,j])))
				id_pos = elm.offsetTop/this._row_height;
			else
				return;

		//najdi aktualni pozici
		if (aBlock.length)
			var act = aBlock[0];
		else{
			this._value([id]);
			return;
		}

		//serad blok
		function sortblock (a,b){ return a[1]-b[1]; };
		aBlock.sort(sortblock);

		//najdi aktualni pozici v blocich
		for(var act_pos = -1,i = aBlock.length-1;i>=0;i--)
			if (act === aBlock[i])
				act_pos = i;

		//oriznout blok
		var tmp = act[1];
		if (act_pos)
			for (var i = act_pos-1;i>=0;i--){
				if (tmp == aBlock[i][1]+1)
					tmp = aBlock[i][1];
				else{
					aBlock = aBlock.slice(i+1);
					act_pos -= i+1;
					break;
				}
			}

		var tmp = act[1];
		for (var i = act_pos+1,j = aBlock.length-1;i<=j;i++){
			if (tmp == aBlock[i][1]-1)
				tmp = aBlock[i][1];
			else{
				aBlock = aBlock.slice(0,i);
				break;
			}
		}


		//DOLU
		if (act[1]<id_pos){
			if(bClick){
				aBlock = [];
				var bFound = false;
				for(var i in this._aData){
					//else
					if (i == act[0])
						bFound = true;

					if (bFound){
						aBlock.push([i]);
						if (i == id)
							break;
					}
				}

				aBlock.reverse();
			}
			//actual row in TOP
			else
			if (act_pos == 0 && aBlock.length>1 && id_pos-act[1]==1){
				aBlock.shift();
				aBlock.reverse();
			}
			//actual row in BOTTOM
			else
			if (act_pos == aBlock.length-1)
				aBlock.push([id]);
			//MIDDLE
			else{
				aBlock = aBlock.slice(act_pos+1);
				aBlock.reverse();
			}
		}
		//NAHORU
		else{
			if (bClick){
				var tmp = [],bFound = false;
				for(var i in this._aData){

					if (i == id)
						bFound = true;

					if (bFound)
						tmp.push([i]);

					if (i == act[0])
						break;
				}
				aBlock = tmp;
			}
			//actual row in BOTTOM
			else
			if (act_pos>0 && act_pos == aBlock.length-1)
				aBlock.pop();
			else
			//actual row in TOP
			if (act_pos == 0)
				aBlock.push([id]);
			//MIDDLE
			else
				aBlock = aBlock.slice(0,act_pos);
		}

		var out = [];
		for(var i in aBlock)
			out.push(aBlock[i][0]);

		this._value(out, !bClick);
	};

//ok
_me._value = function (v,bScroll,bTimer,bNoUpdate){
	if (typeof v == 'undefined')
		return clone(this.__value);
	else
	if (Is.Array(v)){
		var elm,tmpData = {};

		//clean keyboard scrolling
		this.__selectByPosition = '';

		//remove unselected
		for(var i in this.__value)
		    if (inArray(v,this.__value[i])<0/* || (bPreselect != this.__preselectValue)*/){
				if (this.__small){
					if ((elm = this.__getElement([this.__value[i],'*']))){
						removecss(elm,'active');
						elm = null;
					}
				}
				else
				for(var j in this._aCols)
					if ((elm = this.__getElement([this.__value[i],j]))){
						removecss(elm,'active');
						elm = null;
					}
			}

		this.__value = v;

		for(var i in v){
			if (this._aData[v[i]])
				tmpData[v[i]] = this._aData[v[i]];
			else
			if (this.__valueData[v[i]])
				tmpData[v[i]] = this.__valueData[v[i]];
			else
				tmpData[v[i]] = {id:v[i]};

			if (this.__small){
				if ((elm = this.__getElement([v[i],'*']))){
					addcss(elm,'active');
				}
			}
			else
			for(var j in this._aCols){
				if ((elm = this.__getElement([v[i],j]) || elm)){
					if (addcss(elm, 'active')<1)
						break;
				}
			}
		}

		this.__valueData = tmpData;

		//AUTO SCROLL
		if ((v.length == 1 || bScroll) && elm){

			//actual position
			var a1 = this.__eContainer2.scrollTop;

			//row position
			if (elm.offsetTop < a1)
				this.__eContainer2.scrollTop = elm.offsetTop;
			else{
				var a2 = this.__eContainer2.offsetHeight,
					row = elm.offsetTop + elm.offsetHeight;

				if (a1+a2 < row)
					this.__eContainer2.scrollTop = row - a2;
			}
		}

		elm = null;

		if (!bNoUpdate){
			if (this._onchange)
				this._onchange(this.__value);
			this.__exeEvent('onchange',null,{"value":this.__value,"owner":this});
		}

		if (this.info)
			this.info._value(this.__value.length,this.__total);
	}
};

/**
 * @brief: onresize handler
 * @scope: PROTECTED
 * @date : 13.10.2006 12:10:12
 *
 **/
_me._onresize = function(e,elm,id,arg){
	var me = this,
		bDynamic = false;

	gui._disobeyEvent('mousemove',[this,'__mmove_resize']);
	gui._disobeyEvent('mouseup',[this,'__mup_resize']);

	//get Resizing mode
	for(var i in this._aCols)
		if (this._aCols[i].mode == '%' && this._aCols[i].display != 'small'){
			bDynamic = true;
			break;
		}

	// Collect an measure of the moved column and the columns behind it
	var aCols = [], tmp = elm, sID, oCol = null, maxPos = 0;
	do {
		if (tmp.id && (sID = this.__getId(tmp.id,'#')[0]) && this._aCols[sID]){
			aCols.push({
				id:sID,
				headerElm: tmp,
				columnElm: this.__getElement([sID]),
				position: gui._rtl ? parseInt(tmp.style.right) : tmp.offsetLeft,
				width: tmp.offsetWidth,
				mode: this._aCols[sID].mode,
				type: this._aCols[sID].type
			});
		}
	}
	while((tmp = tmp.nextSibling) && tmp.id);

	if (!aCols.length)
		return;

	// check if there is any resizable column
	if (bDynamic){
		for (var i = 1, j = aCols.length; i<j; i++){
			if (aCols[i] && aCols[i].type != 'static'){
				oCol = aCols[i];
				break;
			}
		}

		if (oCol)
			maxPos = oCol.width;
		else
			return;
	}

	var difX = e.clientX,
		difS = this.__eContainer2.scrollLeft;

	this.__mmove_resize = function (e){

		var move = e.clientX - difX, // Real movement ± to left in pixels
			pos = gui._rtl ? -move : move + (me.__eContainer2.scrollLeft - difS);

		for (var i = 0, j = aCols.length; i<j; i++){
			// Resize selected column
			if (i==0){
				var w = gui._rtl ? aCols[0].width-move : aCols[0].width+move;

				if (w < me._col_width) {
					w = me._col_width;
					pos = w - aCols[0].width;
				}
				else
				if (bDynamic && (maxPos - me._col_width < pos)){
					pos = maxPos - me._col_width;
					w = pos + aCols[0].width;
				}

				aCols[0].newWidth = w;

				aCols[0].headerElm.style.width = w + 'px';
				if (aCols[0].columnElm)
					aCols[0].columnElm.style.width = w + 'px';

				if (!bDynamic && gui._rtl)
					me.__eHeader.style.marginRight = (me.__eContainer2.clientWidth - me.__eContainer2.scrollWidth + me.__eContainer2.scrollLeft) + 'px';
			}
			// Position columns behind it
			else{
				var s = aCols[i].position + pos;

				aCols[i].headerElm.style[gui._rtl?'right':'left'] = s + 'px';
				if (aCols[i].columnElm)
					aCols[i].columnElm.style[gui._rtl?'right':'left'] = s + 'px';

				if (bDynamic && oCol.headerElm === aCols[i].headerElm){
					oCol.newWidth = maxPos - pos;

					oCol.headerElm.style.width = oCol.newWidth + 'px';
					if (aCols[i].columnElm)
						oCol.columnElm.style.width = oCol.newWidth + 'px';

					break;
				}
			}
		}

	};


	this.__mup_resize = function (){
		gui._disobeyEvent('mousemove',[me,'__mmove_resize']);

		var iDynWidth = 0;
		if (bDynamic){
			// get width of all dynamic columns
			for (var i in me._aCols)
				if (me._aCols[i].mode == '%' && (elm = this.__getElement([i], '#'))){
					iDynWidth += elm.offsetWidth;
				}
		}

		// translate px to %
		for (var i = 0, j = aCols.length; i<j; i++){
			if (me._aCols[aCols[i].id] && Is.Defined(aCols[i].newWidth)){
				if (aCols[i].mode == '%')
					me._aCols[aCols[i].id].width = Math.round(aCols[i].newWidth/(iDynWidth/100),2);
				else
					me._aCols[aCols[i].id].width = aCols[i].newWidth;
			}
		}

		if (me._onresizeend) me._onresizeend(me._aCols);
		me.__exeEvent('onresizeend',null,{"cols":me._aCols,"owner":me});

		return false;
	};

	gui._obeyEvent('mouseup',[this,'__mup_resize']);
	gui._obeyEvent('mousemove',[this,'__mmove_resize']);
};


_me.__move = function(id,difX){
	var me = this;

	// Calculate total width of the grid
	// var totalWidth = 0, tmp = elm.parentNode.firstElementChild;
	// do {
	// 	totalWidth += tmp.offsetWidth;
	// } while (tmp = tmp.nextSibling);

	// Add column label as draggable object
	var elm = this.__getElement([id], '#').cloneNode(true);
	addcss(elm,'coldrag');
	this.__eHeader.appendChild(elm);

	var pos = getSize(elm);
		pos.l = elm.offsetLeft;
	if(gui._rtl)
		pos.r = parseInt(elm.style.right);

	var col = this._aCols[id];

	// Add element for showing column drop position
	var aelm = mkElement('div', {className:'arrow_div'});
	this.__eHeader.appendChild(aelm);

	var offX = 0, aCols = [],tmpX = 0,targetId = id, tmp;
	for(var i in this._aCols){
		if (this._aCols[i].display != 'small' && (tmp = this.__getElement([i], '#'))){
			aCols.push([tmpX, i]);
			tmpX += tmp.offsetWidth;
		}
	}
	if (tmpX)
		aCols.push([tmpX]);

	//destructor
	function mouseup(e){

		gui._disobeyEvent('mousemove',[mousemove]);
		gui._disobeyEvent('mouseup',[mouseup]);

		if (elm)
			elm.parentNode.removeChild(elm);
		if (aelm)
			aelm.parentNode.removeChild(aelm);

		if (targetId == id)
			me._addColumns(me._aCols);
		else{
			var tmp = {};
			for(var i in me._aCols){
				if (i == id)
					continue;

				if (i == targetId)
					tmp[id] = col;

				tmp[i] = me._aCols[i];
			}
			if (targetId == null)
				tmp[id] = col;

			me._addColumns(tmp);
		}

		if (me._onresizeend) me._onresizeend(me._aCols);
		me.__exeEvent('onresizeend',null,{"cols":me._aCols,"owner":me});
	};
	gui._obeyEvent('mouseup',[mouseup]);

	var difS = me.__eContainer2.scrollLeft;
	var scrollRight = me.__eContainer2.scrollRight || 0;
	var offX = difX - pos.x;

	function mousemove(e){
		var e = e || window.event,
			left = gui._rtl ? pos.r - (e.clientX - difX) : pos.l + (e.clientX - difX),
			prev,
			p = gui._rtl ? left + me.__eContainer2.scrollRight - scrollRight : left + me.__eContainer2.scrollLeft - difS;
		for (var i in aCols) {
			if (aCols[i][0] >= p + offX){
				next = i;
				break;
			}
			else
				prev = i;
		}

		if(!gui._rtl) left = p;

		if (left<0) left = 0;

		elm.style[gui._rtl?'right':'left'] = left + 'px';

		if (aCols[prev])
			if (typeof prev != 'undefined' && aCols[prev] && aCols[prev][1] != id && (!aCols[prev-1] || aCols[prev-1][1] != id)){

				aelm.style[gui._rtl?'right':'left'] = aCols[prev][0] + 'px';
				targetId = aCols[prev][1];
			}
			else
			{
				if (aCols[prev][1] == id)
					targetId = id;
				else
					targetId = null;

				aelm.style[gui._rtl?'right':'left'] = '';
			}
	};

	gui._obeyEvent('mousemove',[mousemove]);
};

/**
 * @brief: function for decoding ID attribute
 * @scope: PRIVATE
 * @date : 13.10.2006 12:21:29
 **/
_me.__getId = function(id,separator){
	if (id.indexOf(this._pathName+(separator || '/')) !== 0)
		return;
	else{
		var ids = id.substr(this._pathName.length+1).split(separator || '/');
		for (var i = ids.length-1;i>=0;i--)
			ids[i] = decodeURIComponent(ids[i]);

		return ids;
	}
};

_me.__getElement = function (id,separator){
	var tmp = [this._pathName];

	for(var i = 0;i<id.length;i++)
		tmp.push(encodeURIComponent(id[i]));

	return document.getElementById(tmp.join(separator || '/'));
};

/**
 * Initial function
 * add new columns
 * HTML column: <div class="col coldrag" style="left: 250px"><span></span><a href="">title</a></div>
 * DATA column: [{text:"column 1",width:250,css:'test',arg:{sort:'asc'}},...]
 *
 * @Date: 8.2.2008 9:31:13
 **/

_me._addColumns = function(aData){

	//avoid worthless refresh
	if (aData){
		if (Is.Empty(aData)){
			if (this.info)
				this.info._stop();

			this._aCols = {};
		}
		else
			this._aCols = aData;
	}
	else
	if (!this._aCols) return;

	this.__prevSort = this.__sortColumn;
	this.__prevSortType = this.__sortType;

	//Create header
	this.__eHeader.innerHTML = '';


	var sCSS = '', eCol, bDynamic = false;
	for(var i in this._aCols){

		//skip "small mode only" columns
		if (this._aCols[i]['display'] == 'small' || (this._aCols[i].hasOwnProperty('hideColumnFor') && -1 !== this._aCols[i].hideColumnFor.indexOf('all'))) {
			continue;
		}

		if (this._aCols[i].mode == '%')
			bDynamic = true;

		sCSS = this._aCols[i].css || '';
		if (this.__sortColumn == i)
			sCSS += (sCSS?' ':'') + (this.__sortType?'desc':'asc');

		eCol = mkElement('div', {id:this._pathName + '#' + i, className:'col '+ sCSS});

		if (this._aCols[i].type != 'static')
			eCol.appendChild(mkElement('p'));

		eCol.appendChild(mkElement('div',{unselectable:"on", innerHTML:this._aCols[i].text || (this._aCols[i].title?getLang(this._aCols[i].title, '', 2):'') || '&nbsp;'}));

		this.__eHeader.appendChild(eCol);
	}

	this.__fitwidth();

	if (bDynamic){
		this._obeyEvent('onsize',[this, '__fitwidth']);
		addcss(this._main, 'dynamic');
	}
	else{
		this._disobeyEvent('onsize',[this, '__fitwidth']);
		removecss(this._main, 'dynamic');
	}
};

_me.__fitwidth = function(){

	if (this.__small)
		return;

	var iWidth = 0, aDyn = [], w;
	for(var i in this._aCols){

		//skip "small mode only" columns
		if (this._aCols[i]['display'] == 'small' || (this._aCols[i].hasOwnProperty('hideColumnFor') && -1 !== this._aCols[i].hideColumnFor.indexOf('all'))) {
			continue;
		}

		w = parseInt(this._aCols[i].width || this._col_width, 10);

		aDyn.push({
			elm: this.__getElement([i],"#"),
			elm2: this.__getElement([i]),
			width: w,
			mode: this._aCols[i].mode
		});

		if (this._aCols[i].mode != '%')
			iWidth += w;
	}

	if (aDyn.length){
		var iOffset = 0,
			iDynOffset = 0,
			iDynWidth = Math.max(this.__eContainer2.offsetWidth - iWidth, 0),
			iControl = 0;

		for (var i = 0, j = aDyn.length;i<j;i++){

			aDyn[i].elm.style[gui._rtl?'right':'left'] = iOffset + 'px';
			if (aDyn[i].elm2)
				aDyn[i].elm2.style[gui._rtl?'right':'left'] = iOffset + 'px';

			//%
			if (aDyn[i].mode == '%'){

				if (iDynWidth>0){
					var v = aDyn[i].width;

					//When somehow % values are over 100
					if (v + iControl>100)
					 	v = 100 - iControl;

					var w = Math.ceil(iDynWidth/100*v);
					if (iDynOffset + w > iDynWidth)
					 	w = iDynWidth - iDynOffset;

					aDyn[i].elm.style.width = w + 'px';
					if (aDyn[i].elm2)
						aDyn[i].elm2.style.width = w + 'px';

					iControl += v;
					iOffset += w;
					iDynOffset += w;
				}
				else{
					aDyn[i].elm.style.width = this._col_width + 'px';
					if (aDyn[i].elm2)
						aDyn[i].elm2.style.width = this._col_width + 'px';

					iOffset += parseInt(this._col_width,10);
				}

			}
			//px
			else{
				aDyn[i].elm.style.width = aDyn[i].width + 'px';
				if (aDyn[i].elm2)
					aDyn[i].elm2.style.width = aDyn[i].width + 'px';

				iOffset += aDyn[i].width;
			}
		}
	}
};

/*
EDIT COLUMN
neni hotove, je treba doresit stop scrolling & refresh
*/
_me._editColumn = function(id,sColumn,aInpControl,aHandler){

	if (this._aData[id]){
		this._anchors['#edit'] = this._pathName +'/'+id+'/'+sColumn;

		var elm = this._getAnchor('#edit');
		if (elm){

			//stop scrolling
			this._disable_scrolbar(this.__eContainer2,true);

			//stop refresh

			//create edit object
			if (this.edit)
				this.edit._destruct();

			//Edit mode CSS
			addcss(elm,'edit');

			var edit = this._create('edit',aInpControl['type'] || 'obj_input','#edit','edit_column');
				edit.__returnScrollbar = function(){
					//Edit mode CSS
					try{ removecss(elm,'edit') }catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

					//start scrolling
					try{ this._parent._disable_scrolbar(this._parent.__eContainer2,false); }catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r)}

					//start refresh
				};
				edit._add_destructor('__returnScrollbar');

				edit._onblur = function(){
					this._onsubmit();
				};
				edit._onclose = function(e){
					this._destruct();
				};
				edit._onclick = function(e){
					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
					//return false;
				};
				edit._onsubmit = function(){
					if (!this._destructed) {
							if(aInpControl['restrictions'] && !edit._validate())
								return false;

							if (aHandler && edit.__oldValue != edit._value()){
							var sOut = executeCallbackFunction(aHandler,this._value());

							if (sOut !== false){
								this._destruct();

								if (Is.String(sOut))
									elm.innerHTML = sOut;
							}
						}
						else
							this._destruct();
					}
				};

			if (aInpControl['restrictions']) {
				if(aInpControl['restrictions'] instanceof Array)
					edit._restrict.apply(edit,aInpControl['restrictions']);
				else
					edit._restrict(aInpControl['restrictions']);
			}

			if (aInpControl['fill'])
			    edit._fill(aInpControl['fill']);

			if (aInpControl['value'])
				edit.__oldValue = aInpControl['value'];
			else
			if (Is.Array(this._aData[id].data[sColumn]))
				edit.__oldValue = this._aData[id].data[sColumn][1] || this._aData[id].data[sColumn][0];
			else
				edit.__oldValue = this._aData[id].data[sColumn];

			edit._value(edit.__oldValue);

			edit._focus(true);
		}
	}
};

/**
 * @brief  : fill grid with given data
 * @date   : 8.2.2008 10:33:26
 *
 * @example: aData = {<id>:
 *	{
 *		data:{'col1':{[str,sort str]},'col2':...},
 *		arg: {...}},
 *		css: '',
 *		display: small|all
 *	}
 *
 *	<div class="col" style="left: 250px">
 *		<div class="row" style="top: 20px">a</div>
 *		...
 *	</div>
 **/
_me._fill = function(aData,rowOffset){
	//Remove all adjecent objects (Edit mode)
	if (this.edit)
		return;
		//this.edit._destruct();

	if (aData){
		if (typeof rowOffset == 'undefined')
			this._aData = aData;
		else
		for(var i in aData)
			this._aData[i] = aData[i];
	}
	else
		var aData = this._aData;

	//Check if folder is new
	var bNewFolder = true;
	if (this._aFolderLast && this._aFolderLast.aid == this._aFolder.aid && this._aFolderLast.fid == this._aFolder.fid)
		bNewFolder = false;

	// set height
	if (typeof this.__total != 'undefined')
		this.__eBody.style.height = (this.__total * this._row_height) + 'px';

	var aCols = {},tmp,css,css2;

	if (this.__small){

		if (!bNewFolder && (tmp = this.__eBody.firstChild) && tmp.id == this._pathName+'/*'){
			aCols['*'] = tmp;

			//garbage cleaner
			if (typeof rowOffset == 'undefined')
				aCols['*'].innerHTML = '';
		}
		else{

			var child;
			while(child = this.__eBody.lastChild)
				this.__eBody.removeChild(child);

			// for(var en = this.__eBody.childNodes, i = en.length-1; i>=0; i--)
			// 	en[i].parentNode.removeChild(en[i]);

			var s = {width:'100%'};
			s[gui._rtl?'right':'left'] = 0;
			aCols['*'] = mkElement('div',{id:this._pathName+'/*',style: s,className:'col unicolumn'});

			if (this.__smallOptions && this.__smallOptions.css)
				addcss(aCols['*'], this.__smallOptions.css);

			this.__eBody.appendChild(aCols['*']);
		}

		this.__fillSort && this.__fillSort();
		this.__fillFilter && this.__fillFilter();

	}
	else{
		if ((tmp = this.__eBody.firstChild) && tmp.id == this._pathName+'/*')
			bNewFolder = true;

		//get columns
		if (!bNewFolder && this.__eBody.hasChildNodes()){
			for (var i in this._aCols)
				if ((tmp = this.__getElement([i]))){
					aCols[i] = tmp;

					//garbage cleaner
					if (typeof rowOffset == 'undefined')
						aCols[i].innerHTML = '';
				}
		}
		// create columns
		else{
			//destruct old body
			if (bNewFolder){
				var child;
				while(child = this.__eBody.lastChild)
					this.__eBody.removeChild(child);
			}

			for (var i in this._aCols){

				if (!this.__small && (this._aCols[i].display == 'small' || (this._aCols[i].hasOwnProperty('hideColumnFor') && -1 !== this._aCols[i].hideColumnFor.indexOf('all')))) {
					continue;
				}

				aCols[i] = mkElement('div',{id:this._pathName+'/'+encodeURIComponent(i)});
				this.__eBody.appendChild(aCols[i]);
				aCols[i].className = 'col ' + (this._aCols[i].css || '') + (this.__sortColumn == i?' sort':'');
			}

			this.__fitwidth();
		}
	}

	//revertovany pole kuli pomalosti inArray
	var val = {}, bChange = false;
	for(var i = this.__value.length;i--;){
		if (!this.__limit && !aData[this.__value[i]]){
			this.__value.splice(i,1);
			bChange = true;
		}
		else
			val[this.__value[i]] = 1;
	}

	// fill columns
	var tmp, str, offset, sTitle, cell, row;

	if (typeof rowOffset == 'undefined')
		offset = this.__offset * this._row_height;
	else
		offset = rowOffset;

	tmp = '';
	for (var i in aData){
		tmp = aData[i];

		css = [];
		tmp.css && css.push(tmp.css);

		if (val[i]){
			css.push('active');
			// if (this.__preselectValue)
			// 	css.push('preselected');
		}

		if (this.__small){
			row = mkElement('div', {
				id: this._pathName + '/' + encodeURIComponent(i) + '/*',
				style: {
					top: offset + 'px',
					height: this._row_height + 'px'
				},
				className: css.join(' ')
			});
			aCols['*'].appendChild(row);
		}

		for(var j in this._aCols){
            sTitle = '';
            css2 = [];
			str = '';

			if (this.__small){

				if (this._aCols[j]['display'] != 'all' && this._aCols[j]['display'] != 'small')
					continue;

				if (this._aCols[j].hasOwnProperty('hideColumnFor') && -1 !== this._aCols[j].hideColumnFor.indexOf('small')) {
					continue;
				}

				css = ['col_'+j];
				this._aCols[j].css && css.push(this._aCols[j].css);
			}
			else {
				if (this._aCols[j].hasOwnProperty('hideColumnFor') && -1 !== this._aCols[j].hideColumnFor.indexOf('all')) {
					continue;
				}

				if (this._aCols[j]['display'] == 'small')
					continue;
			}

			if (typeof tmp.data[j] == 'object'){
				if (tmp.data[j][0])
					str = tmp.data[j][0];

				//title
				if (tmp.data[j][2] && !window.navigator.msPointerEnabled && !('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)) // except edge
				    sTitle = tmp.data[j][2];

				//cell css
				if (tmp.data[j][3])
				    css2.push(tmp.data[j][3]);
			}
			else
			if (tmp.data[j])
				str = tmp.data[j];

			var attrs = {
				id: this._pathName + '/' + encodeURIComponent(i) + '/' + encodeURIComponent(j),
				className: [].concat(css, css2).join(' '),
				unselectable: 'on'
			};
			if(sTitle) {
				attrs.title = sTitle;
			}
			cell = mkElement('div', attrs);

			if (!this.__small){
				cell.style.top = offset+'px';
				cell.style.height = this._row_height+'px';
			}

			if (str){
				if(gui._rtl && this._aCols[j].bidi) {
					var bdi = document.createElement('bdi');
					bdi.appendChild(document.createTextNode(str));
					cell.appendChild(bdi);
				} else
				if (this._aCols[j].encode)
					cell.appendChild(document.createTextNode(str));
				else
					cell.innerHTML = str;
			}

			if (this.__small)
				row.appendChild(cell);
			else
			if (aCols[j])
				aCols[j].appendChild(cell);
		}

		offset += this._row_height;
	}

	// Show No Items Warning
	this._getAnchor('noitems').style.display = tmp?'none':'block';
	aCols = null;

	this.__sbar_init(this.__eContainer2,true);

	//Resize keeper
	if (!this.__reizeInterval && this.__check_size){
		var me = this;
		this._add_destructor('__clearInterval');
		this.__reizeInterval = setInterval(function(){ try{ if (me.__check_size) me.__check_size(); }catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}},2000);
	}

	//classic datagrid, If selected rows missing call onchange
	if (bChange){
		if (this._onchange)
			this._onchange(this.__value);

		this.__exeEvent('onchange',null,{"value":this.__value,"owner":this});
	}

	//select position
	if (this.__selectByPosition)
		this._selectPosition();

	if (this._select_all) {
		var tmp = this._value();
		this._value(tmp.concat(Object.getOwnPropertyNames(aData)));
	}
};

_me._selectPosition = function(sbp, bReturn){

	var sbp = sbp || this.__selectByPosition;

	if (sbp){

		this.__selectByPosition = ''; //can be safer

		if (this.__small)
			var sCol = '*';
		else
		for(var sCol in this._aCols)
			break;

		if (sCol){

			var elm, pos, pid, box = getSize(this.__eContainer2);

			for(var id in this._aData){
				if ((elm = document.getElementById(this._pathName +'/'+ id +'/'+ sCol))){
					pos = getSize(elm);
					switch (sbp){
						case 'top':
							if (pos.y>=box.y) {
								this._value([id]);
								return;
							}
							break;

						case 'bottom':
							if (pos.y+pos.h<=box.y+box.h)
								pid = id;
							else
							if (pid){
								this._value([pid]);
								return;
							}
							break;

						default:
							return;
					}
				}
			}

			if (pid)
				this._value([pid]);
		}
	}
};

_me.__clearInterval = function(){
	if (typeof this.__reizeInterval != 'undefined')
	    clearInterval(this.__reizeInterval);
};

_me._listen_data = function(sDataSet,aDataPath,bNoUpdate){
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;

	dataSet.obey(this,'_listener_data',sDataSet,bNoUpdate);
};

/**
 * Updates headers to reflect current sort column and order
 *
 * @returns {void}
 */
_me.__refreshHeaders = function () {
	var i, headers, header;

	headers = this.__eHeader.childNodes;
	for (i = 0; i < headers.length; i++) {
		header = headers[i];
		removecss(header, 'desc', 'asc');
		if (-1 !== this.__getId(header.id, '#').indexOf(this.__sortColumn)) {
			addcss(header, this.__sortType ? 'desc' : 'asc');
		}
	}
};

_me.__update = function(sName,aDPath){};
