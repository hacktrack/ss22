/**
 * TREE object is visual object for ordering array data into tree structure.
 *
 * Input array:
 * x[<p item>][link] = 'index.html'
 *            [childs][<ch item>][link]
 *                               [childs]...
 *
 * All items have its own ID identificator
 * ID = obj_tree._pathName + <name> + / + <name>...
 *
 * EVN: _onactivate
 *      _onclick
 *
 * doresit autoukladani do datasetu
 **/
_me = obj_tree.prototype;
function obj_tree(){};

_me.__constructor = function(){

	this._telemetry = 'id'; //telemetry log

	this.__value = [];		// array of open nodes (Real IDs)
	this._saveState = true;	// save __value into dataset saver
	this.__idtable;			// table of arguments mapped on each node
	this.__activeNode;
	this._tree;
	this._treeCookie;

	// this._autofocus = true;	//focus search input on click

	this.__filter = '';
	this.__filterOpen = [];

	var me = this;

	//search
	this.inp_search._onkeyup = function(e){
		var v = this._value();

		//Esc
		if (e.keyCode == 27){
			if (v === '')
				me._focus();
			else{
				this._value('');
				v = '';
			}
		}

		window[v.length?'addcss':'removecss'](me._main,'search');

		if (me.__filter!== v){
			me.__filter = v;
			me._fill();
		}
	};
	this.inp_search._onblur = function(){
		if (!this._value()) removecss(me._main,'search');
	};

	this.__eBody = this._getAnchor('body');
	this._scrollbar(this.__eBody,this.__eBody.parentNode);


	//IM focus
	var hasFocus = false;
	this._main.setAttribute('tabindex', -1);
	//IE trick
	if (~currentBrowser().indexOf('MSIE')){
		AttachEvent(this._main, 'onclick', function () {
			hasFocus = true;
		});
	}
	else{
		AttachEvent(this._main, 'onfocus', function () {
			hasFocus = true;
		});
	}
	AttachEvent(this._main, 'onblur', function () {
		hasFocus = false;
	});
	AttachEvent(this._main, 'onkeydown', function (e) {
		if (hasFocus && !e.isComposing && e.keyCode !== 229 && (e.key || '').length === 1)
			me.inp_search._focus();
	});


	this.__eBody.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			eli,id;

		switch(elm.tagName){
			case 'B':
				elm = Is.Child(elm,'DIV');

			case 'DIV':
				if (elm.parentNode.tagName == 'LI'){

					if (hascss(elm.parentNode,'active') || hascss(elm.parentNode,'menu')){
						var p = getSize(me._main),
							ctx;

						if (gui._rtl){
							ctx = e.clientX - p.x < 33;
						}
						else{
							ctx = p.x + p.w - e.clientX < 33;
						}

						if (ctx){

							e.cancelBubble = true;
							if (e.stopPropagation)
								e.stopPropagation();

							var p2 = getSize(elm);
							e = {
								srcElement: elm,
								clientX: gui._rtl ? p.x + 22 : p.x + p.w,
								clientY: p2.y + (p2.h / 2),
								type: 'contextmenu',
								originalType: e.type
							};
						}
					}
				}
				else
					break;

			case 'SPAN':
			case 'I'   :
			case 'U'   :

				eli = Is.Child(elm,'LI');
				id = eli.id.substr(me._pathName.length+1);

				if (elm.tagName == 'SPAN' && e.type != 'contextmenu'){
					me.__open(id);
					break;
				}

				var idt = me.__idtable[id]?clone(me.__idtable[id],true):{};

				if (!idt.disabled || e.type == 'contextmenu'){

					var realId = me._getRealId(id);

					if (e.type != 'contextmenu' && me._isSelectable(idt))
						me._setActive(realId);

					if (me._onclick) me._onclick(e,elm,realId,idt || {});
					me.__exeEvent('click',e,{"arg":idt,"id":realId,"elm":elm,"owner":me});
				}
				else{
					me.__open(id);
				}

				break;
		}

		return false;
	};

	//For MSIE10 Only
	// if (window.navigator.msPointerEnabled)
	// 	this.__eBody.onmspointerup = function(e){
	// 		var e = e || window.event;
	// 		if (me._autofocus && e.button == 0 && (!e.pointerType || (e.pointerType == e.MSPOINTER_TYPE_MOUSE) || (e.pointerType == 'mouse')))
	// 			me._focus();
	// 	};


	this.__eBody.ondblclick = function(e){
		var e = e || window.event;
		var elm = e.target || e.srcElement;

		switch(elm.tagName){
			case 'U':
			case 'B':
				if (me._ondblclick){
					var eli = Is.Child(elm,'LI'),
						id = eli.id.substr(me._pathName.length+1),
						idt = me.__idtable[id]?clone(me.__idtable[id],true):{};

					var realId = me._getRealId(id);

					if (me._ondblclick(e,elm,realId,idt || {})){
						me._setActive(realId);
						return;
					}
				}

			case 'I':
				var eli = Is.Child(elm,'LI');
				me.__open(eli.id.substr(me._pathName.length+1), hascss(eli,'root')?'plus':'');
		}
	};

	this.__eBody.oncontextmenu = this.__eBody.onclick;
};


_me._disabled = function(b){
	if (Is.Defined(b))
		window[b?'addcss':'removecss'](this._main,'disabled');
	else
		return hascss(this._main,'disabled');
};

_me._getFocusElement = function(){
	// return this.inp_search._getFocusElement();
	return this._main;
};
_me._focus = function(){
	// return this.inp_search._focus();
	return this._main.focus();
};

/**
 * @brief: redraw tree object
	[Events]
	.. [nodes]
	.. [arg]
	.... [aid] = admin@merakdemo.com
	.... [fid] = Events
	.... [ftype] = E
	.... [disabled] = false
	.. [text] = Calendar
	.. [title2] =
	.. [ico] = ico_e
	.. [itmclass] =
 *
 **/
_me._fill = function (aData){

	if (aData){
		this.__aData = aData;
	}
	else{
		if (this._listener_data)
			aData = dataSet.get(this._listener_data,this._listenerPath_data);
		else
		if (this.__aData)
			aData = clone(this.__aData, true);
	}

	if (aData){

		if (this.__filter){
			this.__filter = this.__filter.toLowerCase();

			var oFilter = this._filter(aData);
			var aOpen = oFilter.aOpen;
				aData = oFilter.aData;
		}

		if (this._filterRawData)
			aData = this._filterRawData(aData);

		this.__aFillData = this.__prepare_data?this.__prepare_data(aData):aData;
		this.__row(this.__aFillData);

		//Open all found nodes
		var filterOpen = [];
		if (this.__filter && aOpen.length){

			aOpen.forEach(function(id){

				this._getTreeId(id, true).forEach(function(treeId){
					this.__openup('minus',treeId);
				}.bind(this));

				id.split('/').forEach(function(v, i, a){
					filterOpen.push(a.slice(0, i+1).join('/'));
				}, this);

			},this);

			this.__filterOpen = this.__clear(filterOpen);
		}
	}
	else
		this.__eBody.innerHTML = '';

	this.__sbar_init(this.__eBody,true);
};

_me._filter = function (aData){
	var aData2 = {},
		aOpen = [];

	var	aKey = [],
		sName;

	for(var i in aData)
		aKey.push(i);
	aKey.sort();

	for(var sLast = '',i = aKey.length-1;i>=0;i--){

		if (aKey[i] == sLast)
			sLast = aKey[i].indexOf('/')>-1?aKey[i].substr(0,aKey[i].lastIndexOf('/')):aKey[i];
		else{
			if ((!aData[aKey[i]].NAME && aKey[i].toLowerCase().indexOf(this.__filter)>-1) ||	(aData[aKey[i]].NAME && aData[aKey[i]].NAME.toLowerCase().indexOf(this.__filter)>-1))
				sLast = aKey[i].indexOf('/')>-1?aKey[i].substr(0,aKey[i].lastIndexOf('/')):aKey[i];
			else{
				aKey.splice(i,1);
				continue;
			}
		}

		if ((sName = aData[aKey[i]].NAME?aData[aKey[i]].NAME:Path.basename(aKey[i])) && sName.toLowerCase().indexOf(this.__filter)>-1)
			aOpen.push(sLast?'/' + sLast:'');
	}

	if (aKey.length){
		aData2 = {};
		for(var i in aData)
			if (inArray(aKey,i)>-1)
				aData2[i] = aData[i];
	}

	return {aData:aData2, aOpen:aOpen};
};


_me._invalidateActive = function() {
	try{
		removecss(document.getElementById(this._getElmId(this._getTreeId(this.__activeNode))),'active');
	}
	catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}

	delete this.__activeNode;
};


_me._getActive = function(bNamed) {
	return Path.split(this.__activeNode,bNamed);
};

/**
 * @brief: set active node and open thread
 **/
_me._setActive = function(id, bNoOpen){

	var elm, treeId = this._getTreeId(id);
	if (this.__activeNode && this.__activeNode != id){
		elm = document.getElementById(this._getElmId(this._getTreeId(this.__activeNode)));
		if (elm)
			removecss(elm, 'active');
	}

	elm = document.getElementById(this._getElmId(treeId));
	if (elm && elm.parentNode){

		if (!bNoOpen){
			// Open parent node
			var iSPos;
			if ((iSPos = id.lastIndexOf('/')) > -1)
				this._open(id.substr(0,iSPos),'minus');
			else
				this._open(id,'minus');
		}

		addcss(elm,'active');

		//elm.scrollIntoView({block: "nearest", inline: "nearest"});
	}

	if (this._onactivate)
		this._onactivate(id, this.__activeNode != id);

	this.__activeNode = id;
	this.__exeEvent('activate',null,{"id":id,"owner":this});

	return !!elm;
};


/**
 * @brief: return DOM Element ID
 **/
_me._getElmId = function (id){
	return this._pathName +'/'+ id;
};

_me._parseElmId = function (id){
	return id.slice(this._pathName.length+1);
};

/**
 * @brief: recursiv method for creating ul-li tree structure
 * @scope: PRIVATE
 * @date : 12.5.2006 11:50:37
 **/
_me.__row = function(aData,child){
	var path='',elm1,elm2,elm3,elm4,liclass;

	/* create main UL element */
	elm1 = mkElement("ul");
	if (!child){
		this.__idtable = {};
		var iTop = this.__eBody.scrollTop;
		liclass = 'root';
	}
	else{
		path = child;
		liclass = 'none';
	}

	for(var i in aData){
		elm2 = mkElement("li",{"className":liclass + (aData[i]["liclass"]?' '+aData[i]["liclass"]:''),"id":this._pathName + '/' + path + (aData[i].id || i)});
		elm3 = mkElement("div",{"className":(aData[i]['ico']?'ico ' + aData[i]['ico']:'')});
		elm3.innerHTML = '<span class="plussign"></span><i></i>';

		if (aData[i]['arg'])
			this.__idtable[path + i] = aData[i]['arg'];

		/* link */
		if (aData[i]["arg"]["disabled"])
			elm4 = mkElement("span",{"className":'inactive'});
		else
			elm4 = mkElement("b");

		if (aData[i]["itmclass"])
			addcss(elm4,aData[i]["itmclass"]);

		elm4.innerHTML = (aData[i]['title']?getLang(aData[i]['title'],null,true):(aData[i]['text']?aData[i]['text']:i.toString().entityify()))/* + (aData[i]['title2']?'<u>'+aData[i]['title2']+'</u>':'')*/;  // Quote STRING !!!

		elm3.appendChild(elm4);
		aData[i].group && elm3.appendChild(mkElement('div', {text:aData[i].group,class:'unread-group'}));

		if (aData[i]['title2'])
			elm3.appendChild(mkElement('u',{innerHTML:aData[i]['title2']}));

		elm2.appendChild(elm3);

		if (aData[i]['nodes'] && !Is.Empty(aData[i]['nodes'])){
			/* set "minus" className for node with childs */
			addcss(elm2,'plus');
			removecss(elm2,'none');

			/* parse and append child nodes */
			elm2.appendChild(this.__row(aData[i]['nodes'],path + i + '/'));
		}
		// n++;
		elm1.appendChild(elm2);
	}

	/* set "end" className for last node with childs */
	if (elm2) addcss(elm2, 'end');

	/* destruct html elements */
	elm2 = null; elm3 = null; elm4 = null;

	/* append root UL into _main */
	if (!child){

		this.__eBody.innerHTML = '';
		this.__eBody.appendChild(elm1);

		elm1.className = 'fTree';

		/* open previously opened nodes */
		if (!Is.Empty(this.__value))
			this._value(this.__value);
		else
		if (this._listener)
			this.__update(this._listener);

		// active
		if (this.__activeNode){
			var bDoNotOpen = this._value().indexOf(Path.basedir(this.__activeNode)) == -1;
			this._setActive(this.__activeNode, bDoNotOpen);
		}

		this.__eBody.scrollTop = iTop;
		return;
	}

	/* return UL element */
	return elm1;
};


/**
 * @brief: apply given CSS to node and all parent nodes,
 *         if node is not set than function works over all nodes in __value
 * @scope: PUBLIC
 * @date : 14.5.2006 15:58:10
 **/
_me.__openup = function(css,id){
	css = css == 'minus'?'minus':'plus';
	var inv = css == 'minus'?'plus':'minus';
	var a;

	if (id)
		a = [id];
	else
		a = this.__value.map(this._getTreeId, this);

	for (var elm, newPath, i = 0; a[i]; i++){

		var newPath = Path.basedir(a[i]);
		if (newPath && a.indexOf(newPath) == -1)
			a.push(newPath);

		elm = document.getElementById(this._getElmId(a[i]));
		if (elm && elm.tagName == 'LI' && !hascss(elm, css) && hascss(elm, inv)){
			addcss(elm,css);
			removecss(elm, inv);
		}
	}
};

/**
 * open given tree-id node
 *
 * @param {string} id
 * @param {string} style
 * @returns
 */
_me.__open = function(id,style){
	this._open(this._getRealId(id), style);
};

_me._open = function(id,style){
	if (!id) return;

	this._getTreeId(id, true).forEach(function(treeId){

		var elm, elmid = this._getElmId(treeId);

		/* check whether element exists */
		if (!(elm = document.getElementById(elmid))) return;

		/* close Node */
		if (style == 'minus' || hascss(elm, 'plus')) {

			/* add node into __value array */
			this.__value.push(id);
			this.__value = this.__clear(this.__value);

			/* open parent Nodes */
			this.__openup('minus', treeId);
		}
		/* open node */
		else
		if (style == 'plus' || hascss(elm, 'minus')) {
			removecss(elm, 'minus');
			addcss(elm, 'plus');

			/* close node and all child nodes */
			for (var i = 0; i<this.__value.length; i++) {
				if (this.__value[i] == id) {
					try {

						this._getTreeId(this.__value[i], true).forEach(function(treeId){
							var tmp = document.getElementById(this._getElmId(treeId));
							if (tmp && hascss(tmp, 'minus')) {
								removecss(tmp, 'minus');
								addcss(tmp, 'plus');
							}
						}).bind(this);

					} catch (e) {
						gui._REQUEST_VARS.debug && console.log(this._name || false, e);
					}
					this.__value.splice(i, 1);
					break;
				}
			}

		} else {
			elm = null;
			var a = treeId.split("/");
			if (a.length > 1)
				this.__open(a.slice(0, -1).join("/"), 'minus');
			return;
		}

	}.bind(this));

	/* destruct elm var */
	elm = null;

	/* save opened threads into dataset */
	if (this._saveState && this._listener)
		this._saveme();

	if (this._treeCookie)
		Cookie.set([this._treeCookie], clone(this._value(), true));
};

_me._listen_cookie = function(sCookieName)
{
	this._treeCookie = sCookieName;
	this._value(Cookie.get([sCookieName]));
};

/**
 * @brief: listener for tree structure
 **/
_me._listen_data = function(sDataSet,aDataPath){
	this._listener_data = sDataSet;
	if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;
	dataSet.obey(this,'_listener_data',sDataSet);
};

/**
 * @brief: update method
 **/
_me.__update = function(sDataSet,aDataPath){

	/* no update section */
	if (this._norefresh){
		this._updateBuffer = true;
		return false;
	}
	else
		this._updateBuffer = false;

		/* update tree structure */
	if (this._listener_data == sDataSet){

		if (aDataPath && aDataPath[2] == 'RECENT'){
			var elm,elm2;
			if ((elm = document.getElementById(this._pathName+'/'+aDataPath[0]+'/'+aDataPath[1]))){

				var tmp = dataSet.get(sDataSet,[aDataPath[0], aDataPath[1]]);
					iRec = tmp.RECENT,
					elm2 = (elm2 = elm.getElementsByTagName('DIV')) && (elm2 = elm2[0].getElementsByTagName('U'))?elm2[0]:false;

				if ((parseInt(iRec) || parseInt(tmp.COUNT))>0){

					if (!elm2){
						elm2 = mkElement('U');
						elm.getElementsByTagName('DIV')[0].appendChild(elm2);
					}

					elm2.innerHTML = tmp.COUNT || ('&#8234;' + iRec.toString().escapeHTML());
					elm.classList.add('unread');
				}
				else{
					elm.classList.remove('unread');

					if (elm2) {
						var parent = document.getElementById(this._pathName+'/'+aDataPath[0]+'/'+aDataPath[1].split('/').slice(0, -1).join('/'));
						if(parent) {
							var count = parent.querySelector('div div.unread-group');
							if(count && parseInt(count.innerText)) {
								var new_count = parseInt(count.innerText)-elm2.innerText.match(/\d+/);
								if(new_count) {
									count.innerText = new_count;
								} else {
									count.parentNode.removeChild(count);
								}
							}
						}
						elm2.parentNode.removeChild(elm2);
					}
				}

				elm = null;
				elm2 = null;
				return;
			}
		}

		this._fill();
	}

	/* update opened nodes */
	if (this._listener == sDataSet)
		this._value(dataSet.get(this._listener,this._listenerPath,true));
};

/**
 * @brief: return all open nodes (only last child in thread) as array of string paths
 * @scope: PUBLIC
 * @date : 14.5.2006 17:33:56
 **/
_me._value = function (v){
	if (v && typeof(v) == 'object') {
		// close all nodes
		if (this.__value.length) this.__openup('plus');

		this.__value = this.__clear(v);

		var elm, treeId, sPath, aPath, fPath,
			ds = this._listener_data?dataSet.get(this._listener_data,this._listenerPath_data):null;

		for(var i = this.__value.length; i--;){
			if (typeof this.__value[i] !== 'string') {
				continue;
			}

			aPath = this.__value[i].split('/');
			fPath = Path.split(this.__value[i]);

			do{
				sPath = aPath.join('/');
				treeId = this._getTreeId(sPath, true);
				if (treeId.length){

					//add new path to the values (if folder doesn't exit in DS)
					if (sPath != this.__value[i] && (!this._listener_data || !ds[fPath[0]] || (fPath[1] && !ds[fPath[0]][fPath[1]]))){
						this.__value.splice(i,1,sPath);
					}

					break;
				}

				aPath.pop();
			}
			while(aPath.length);

			if (treeId.length){
				treeId.forEach(function(treeId){
					if ((elm = document.getElementById(this._getElmId(treeId)))){
						if (elm.tagName == 'LI' && elm.getElementsByTagName('UL').length>0){
							removecss(elm,'plus');
							addcss(elm,'minus');
						}
					}
				}.bind(this));
			}
			else
			//do not remove folders existing in DS
			if (!this._listener_data || !ds[fPath[0]] || (fPath[1] && !ds[fPath[0]][fPath[1]])){
				this.__value.splice(i,1);
			}
		}
	}
	else
		return this.__clear(this.__value);
};

/**
 * @brief: removes spare paths from array
 * @scope: PRIVATE
 * @date : 10.10.2019
 **/
_me.__clear = function(arr){
	return arrUnique(arr).sort();
};

_me._isSelectable = function(idt){
	return idt.ftype != "X";
};

/**
 * Used in obj_tree_folder to translate real->tree id
 *
 * @param {string} id
 * @returns {strying}
 */
_me._getTreeId = function(id, bArray){
	return bArray?[id]:id;
};

/**
 * Used in obj_tree_folder to translate tree->real id
 *
 * @param {string} id
 * @returns {strying}
 */
_me._getRealId = function(id){
	return id;
};


/**
 * @brief: optional onclick method
 * @param: e    - Event Handler (onclick event object)
 *         elm  - srcElement (link)
 *         id   - objects internal id (without pathName)
 *         arg  - item's arg section
 */
//_me._onclick = function(e,elm,id,arg){};
