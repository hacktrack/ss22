_me = obj_room_suggest.prototype;
function obj_room_suggest(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 29.1.2013
 **/
_me.__constructor = function(){
	var me = this;

	this.__activeFirst = true;

	this._min = 1;
	this._limit = 15;
	this._folder;

	this.__hints = [];

	//Scrollbar
	this.__block = this._getAnchor('container');
	this._scrollbar(this.__block, this._main);
	//always total scroll (5px)
	AttachEvent(this.__block,'onscroll', function(e){
		if (me.__block.scrollTop<5)
			me.__block.scrollTop = 0;
		else
		if (me.__block.scrollHeight - me.__block.scrollTop < me.__block.clientHeight+5)
			me.__block.scrollTop = me.__block.scrollHeight - me.__block.clientHeight;
	});
/*
	//Registr Drop
	if (gui.frm_main && gui.frm_main.dnd){
		//Drag and Drop
		this.__etag.onmousedown = function(e){

			if (me.__dndtimer){
				window.clearTimeout(me.__dndtimer);
				delete me.__dndtimer;
			}

			var e = e || window.event;
			if (e.button>1 || e.ctrlKey || !me.__initdrag) return;
			var elm = e.target || e.srcElement;

			if (elm == this || elm.tagName == 'INPUT') return;
			if (elm.tagName != 'SPAN')
				elm = Is.Child(elm,'SPAN');

			//fire the event :)
			if (elm) {
				var x = e.clientX, y = e.clientY;

				gui._obeyEvent('mouseup',[me,'__dndDispatch']);
				me.__dndtimer = setTimeout(function(){
					me.__initdrag(elm, x, y);
				},500);

				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
				return false;
			}
		};

		gui.frm_main.dnd.registr_drop(this,['rcp','jabber','item']);
	}
*/
	this._placeholder(getLang('POPUP_ITEMS::ENTER_EMAIL_ADDRESS'));
};

//decode input content
_me._decode = function(v){

	var aIN = MailAddress.splitEmails(v),
		//rx = /^([\w\-])+(\/[\w\-]+)+$/g,
		//rx = /(^\[)|(::.+)|]$/g,
		rx = /^(\[)|(\])$/g,
		aOut = [], path = [];

	for (var i in aIN){

		aIN[i] = aIN[i].replace(rx,'');
		path = aIN[i].split('::');

		if (path[0].indexOf('/')>0 && WMFolders.getType([sPrimaryAccount, path[0]]) == 'I'){

			aOut.push({tag: '['+ aIN[i] +']', label: path[1] || false});

				//Distrib
				// if (aIN[i].email.indexOf('[') === 0 && aIN[i].email.indexOf(']') === aIN[i].email.length - 1) {
				// 	aOut.push({tag: aIN[i].email, label: ((aIN[i].email.match(/\[.*::(.*)\]/) || [])[1]) || false, expand: true});
				// 	continue;
				// }

		}
		else
			aOut.push({tag:aIN[i], err:1});

		// //Distrib
		// if (aIN[i].indexOf('[') === 0 && aIN[i].indexOf(']') === aIN[i].length - 1) {
		// 	aOut.push({tag: aIN[i]});
		// }
		// else
		// if (rx.test(aIN[i]))
		// 	aOut.push({tag:'['+ aIN[i] +']'});
		// else
		// 	aOut.push({tag:aIN[i], err:1});
	}

	return aOut;
};

//OK Inherited
_me._qdata = function(v){

	var cart = this._getCartPos(),
		end = false, word = [0,0];

	for (var i=0, l=v.length; i<l; i++){
		switch(v.charAt(i)){
		case ',':
			if (cart<=i)
				end = true;
			else
				word = [i+1,i+1];

			break;

		default:
            	word[1] = i+1;
		}

		if (end) break;
	}

	v = v.substring(word[0],word[1]);
	this.__last_pos = [word[0],word[1],v];
	return v;
};

//OK (inherited)
_me._qvalue = function(v){
	if (Is.Object(v))
		v = v.value;

	if (typeof v != 'undefined'){
		var inp = this._getFocusedInput();
		if (inp){

			var old = inp._value();
			this._qdata(old);
			inp._value(old.substr(0,this.__last_pos[0]) + '[' + v + ']' + old.substr(this.__last_pos[1]));

			//Add New Imidietly
			if (inp._name == 'plus')
				this.__inpBlur('',{owner:inp});
		}
	}
};

//OK
_me._query = function(v){
	var sWord = v;
	if (v.indexOf('[')==0 && !(v = v.replace(/[\[\]]+/g,'')))
	    return;

	this.__last_qdata = {folder:v};

	var ds = dataSet.get('folders',[sPrimaryAccount],true),
		aValues = [];

	for(var sFolder in ds){
		if (ds[sFolder].TYPE === 'I'){

			var tmp = sFolder.split('/');
			if(ds[sFolder].NAME) {
				tmp.pop();
				tmp.push(ds[sFolder].NAME);
			}
			var folder = tmp.join('/').replace('/TeamChat/', '/');

			if (folder.toLowerCase().indexOf(v.toLowerCase())>-1){
				aValues.push({path:sFolder + '::' +folder/*(ds[sFolder].NAME || ds[sFolder].RELATIVE_PATH)*/, folder: folder});
				if (aValues.length == this._limit)
					break;
			}
		}
	}

	this._parse(sWord, aValues);
};

// OK
_me._parse = function(sWord,aValues){

	if (!aValues || this._input_value() != sWord){
		this.__show();
		this.__sLastRequestString = '';
		return;
	}

	//Concat Query and Cookie Data
	var sc = function (a,b){
		if (a.folder>b.folder)
			return 1;
		else
		if (a<b)
			return -1;
		else
			return 0;
	};

	aValues = aValues.sort(sc);

	var aOut = [];
	for(var i in aValues)
		if (aValues[i].folder != this.__last_qdata.folder)
			aOut.push({value:aValues[i].path, text:aValues[i].folder, css:'room'});

	if (aOut.length)
		this.__show(aOut);
	else
		this.__hide();

	this.__sLastRequestString = sWord;
	this.__sLastSuggest = sWord;
};