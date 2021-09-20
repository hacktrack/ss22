/* Parent class for inheritance */
_me = obj_item_search.prototype;
function obj_item_search(){};

/**
 * @brief: CONSTRUCTOR
 * @date : 24.5.2007 11:43:07
 **/
_me.__constructor = function(aFolder){
	this._SQL = '';
	var me = this;

	this._create('search','obj_suggest_search','main','obj_input_100');

	if (aFolder)
		this._setFolder(aFolder);

	this.search._onsubmit = function(){
        me._buildSQL();

		if (me._SQL)
			addcss(this._main,'active');
		else
			removecss(this._main,'active');

		if (me._onsearch) me._onsearch(me._value(),me.__string);
		me.__exeEvent('onsearch',null,{"sql":me._value,"string":me.__string,"owner":me});
	};

	//Clear search if blank input & blur
	this.search._onblur = function(){
		if (this._onsubmit && me._SQL != me._buildSQL())
			this._onsubmit();

		me._onblur && me._onblur();

		return true;
	};

	this.search._createWizard = function(){
		me.search.__eICO.onclick({});
	};

	//search icon
	this.search.__eICO.onclick = function(e){
		var e = e || window.event,
			aFolPath = me.search._getFolder(),
			sType = '',
			aFolder = {};

		if (aFolPath.fid){
			aFolder = dataSet.get('folders',[aFolPath.aid,aFolPath.fid]) || {};

			//	Default to Contacts type for __@@SHARED@@__ or __@@ADDRESSBOOK@@__
			sType = WMFolders.getType(aFolPath) || 'C';
		}

		if (!me.wizard){
			switch(sType){
			case 'W':
			case 'J':
				sType = 'E';

			case 'M':
				if (aFolder.RSS)
					sType = 'R';

			case 'E':
			case 'C':
			case 'F':
			case 'T':
			case 'N':

				addcss(me._main,'wizard');
				var pos = getSize(me.search._main),
					bSFolder = me._parent && me._parent._pathName=="gui.frm_main.stat" && GWOthers.getItem('RESTRICTIONS','disable_virtual') != '1';

				me.wizard = gui._create('search_wizard','obj_search_wizard','','search_wizard', sType, [
					function(v){
						if (Is.String(v)){
							me.search._value(v)
							if (me.search._onsubmit)
								me.search._onsubmit();
						}
						else
							me.search._focus();
					}
				], bSFolder);	// Show create search folder only for main search

				me.wizard._place(pos.x, pos.y + pos.h, pos.w);
				me.wizard.__removecss = function(){
					removecss(me._main,'wizard');
					delete me.wizard;
				};
				me.wizard._add_destructor('__removecss');
				me.wizard._value(me.search._value());

				//kill event
				if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
				return false;
			}
		}
		else
		if (me.wizard)
			me.wizard._destruct();

		me._focus();
		return;
	};

	//wizard reopens in obj_popup
	this.search.__eICO.onmousedown = function(e){
		var e = e || window.event;
		if (me.wizard){
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			return false;
		}
	};

	//Paste with Quotes
	if ('selectionStart' in this.search.__eIN){

		if ('paste' in window.document)
			AttachEvent(this.search.__eIN, 'paste', function(e){ me.__onpaste(); });
		else
		if ('onpaste' in window.document)
			AttachEvent(this.search.__eIN, 'onpaste', function(e){ me.__onpaste(); });

		AttachEvent(this.search.__eIN, 'onkeyup', function(e){

			if (me.__paste){
				var v = me.search._value();

				if (me.__paste.v != v){
					var s = v.substring(me.__paste.start, v.length-me.__paste.end);
					if (s.charAt(0) !== '"' && ~s.indexOf(' ')){

						//check for open guotes
						for (var i = 0, l = me.__paste.start, q = false; i<l; i++)
							if (v.charAt(i) === '"' && v.charAt(i-1) !== '\\')
								q = !q;

						if (!q){
							s = v.substr(0, me.__paste.start) + '"' + s.replace(/\\/g,"\\\\").replace(/([^\\])"/g,'$1\\"') + '"' + (me.__paste.end?v.substr(-me.__paste.end):'');
							me.search._value(s);
							me.search._setRange(s.length-me.__paste.end);
						}
					}
				}

				delete me.__paste;
			}

		});
	}
};

//Paste with Quotes
_me.__onpaste = function(){
	this.__paste = {
		v: this.search._value(),
		start: this.search.__eIN.selectionStart,
	 	end: this.search._value().length - this.search.__eIN.selectionEnd
	};
};

_me._getFolder = function(){
	return this.search._folder;
};

_me._setFolder = function(aFolder,sType){

	this.search._setFolder(aFolder,sType);

	/*
	//Add virtual Mask button for input
	var aMask = {clear:['&#xe036;',getLang('COMMON::CLEAR')]};

	//Actions
	this.search.__setMask(
		aMask,
		[function(id){
			switch(id){
			case 'clear':
				if (this.search._value()){
					this.search._value('');
					this.search._focus();
					if (this.search._onsubmit)
						this.search._onsubmit();
				}
			}
		}.bind(this)]
	);
	*/
};

_me._deactivate = function(){
	this._value('');
	removecss(this.search._main,'active');
};

_me._disabled = function(b){
	return this.search._disabled(b);
};

_me._focus = function(){
	return this.search._focus();
};

_me._select = function(){
	this.search._select();
};

_me._tabIndex = function(sContainer, i, oDock){
	this.search._tabIndex(sContainer, i, oDock);
};

_me._value = function(v, bActivate){
	if (Is.String(v)){
		this._SQL = v;
		this.search._value(v);

		if (v.length && bActivate)
			addcss(this.search._main,'active');
		else
			removecss(this.search._main,'active');
	}
	else
		return this._SQL || this._defaultSQL || '';
};

_me._setRange = function(pos1,pos2){
	return this.search._setRange(pos1,pos2);
};

/**
 * Abstract
 **/
_me._buildSQL = function(){
	return (this._SQL = this.search._value());
};