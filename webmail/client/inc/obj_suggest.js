/*****************************************************
 * Input form object with suggestions
 * This object provides opportunity to suggest users input by searching in given array
 * or by programming _query method and make queries to server for every input change.
 *
 * CSS
 *
 *
 * Parametrs:
 *          _min = int      // minimal no. of letters for suggestion
 *          _limit = int    // max no of suggestions
 *
 *			__minWidth		//minimal suggest block width
 *
 * Methods:
 *          _listen()
 *
 * Dynamic querying mode:
 *         obj._dynamic = true // choose query mode
 *         obj._listen('sDataSet')
 *         obj._query = function(){
 *                        this.__eIN.value // input value
 *                        this.__bTimer    // 500ms delay between querying is in progres
 *                        this.__bQuerying // querying is in progres
 *
 *                        <query>
 *
 *                        return Array;    // 2D array [string,string...]
 *                      }
 *
 * Object behaviour:
 *        onfocus   - check for suggestions
 *        onblur    - close suggestions
 *        onkeydown - enter - set value from suggested, close suggestions
 *                    right - set value from suggested
 *                    up/dn - change position in suggetstions
 *                            top pos. + up - close suggestions
 *                            top pos. + dn - check suggest
 *        onkeyup   - check for suggestions
 *
 *
 *
 * 2Do:
 * - doresit query timeout
 *****************************************************/

_me = obj_suggest.prototype;
function obj_suggest(){};

/**
 * @brief: CONSTRUCTOR, create input with suggestion form object to __eIN variable
 * @date : 20.4.2006 17:24:21
 **/
_me.__constructor = function(){
	if(!sPrimaryAccountGW)
		return;

	this.__hideTime;
	this.__showTime;
	this.__sLastSuggest = '';
	this.__sLastRequestString = '';
	this.__aQuery_data = [];

    this.__activeFirst = false;
    this.__active = -1;

	/* PUBLIC properties */
	this._min = 3;
	this._limit = 15;

	this.__cleanDS = true; // object relieve its DS
	this.__direction = 'down';


	/* listener for suggestion */
	this._listener_data;
	this._listenerPath_data;

    this._obeyEvent('onfocus',[this,'__onfocus']);
    this._obeyEvent('onblur',[this,'__onblur']);
	this._obeyEvent('onkeyup',[this,'__onkeyup']);
	this._obeyEvent('onkeydown',[this,'__onkeydown']);
	this._obeyEvent('onclick',[this,'__onclick']);

	gui._obeyEvent('click',[this,'__hide']);

	// add destructirs
    this._add_destructor('__destructor');
};

	_me.__onfocus = function(){

		if (this.__hideTime){
			window.clearTimeout(this.__hideTime);
			this.__hideTime = null;
		}

		if (this.__showTime)
			window.clearTimeout(this.__showTime);

		//MSIE Scrollbar fix
		if (this.__skipcycle) return;

		var me = this;
        this.__showTime = window.setTimeout(function(){
				try{
					me.__suggest();
				}
				catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
			},300);
	};

	_me.__onblur = function(){

		if (this.__showTime){
			window.clearTimeout(this.__showTime);
			this.__showTime = null;
		}

		if (this.__hideTime)
			window.clearTimeout(this.__hideTime);

		//MSIE Scrollbar fix
		if (this.__skipcycle){
			this._focus();
			this.__skipcycle = false;
		 	return;
		}

		var me = this;
		this.__hideTime = window.setTimeout(function(){
				try{
					me.__hide();

					/*													!!!!!!!!!!! REMOVED for obj_tag_suggest REMOVED !!!!!!!!!!!
			        if (me.__skipblur){
			            me.__skipblur = false;
						me._focus();
					}
					*/
				}
				catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}
			},10);
	};

	_me.__onkeydown = function(e){

		if (this.__showTime){
		    window.clearTimeout(this.__showTime);
		    this.__showTime = null;
		}

		switch(e.keyCode){
		case 38:  // Up
			if (this.suggest){
				this.__up();

				e.preventDefault();
				return;
			}
			break;
		case 40:  // Down
			if (this.suggest){
				this.__dn();

				e.preventDefault();
				return;
			}
			break;
		case 13:
			if (this.__aQuery_data[this.__active]){

				//direct
				if (!this.__sLastRequestString || this.__sLastRequestString == this._input_value()){
					this._qvalue(this.__aQuery_data[this.__active]);
				}
				this.__hide();
				e.preventDefault();
				return;
			}
			else
				this.__hide();
			break;

		case 27:
			if (this.suggest){
				e.preventDefault();
				e.cancelBubble = true;
				this.__hide();
			}
		}
	};

	_me.__onkeyup = function(e){
		if(!e.keyCode || inArray([9,40,38,13,27],e.keyCode)>-1) return;

		if (this.__showTime)
			window.clearTimeout(this.__showTime);
		this.__showTime = window.setTimeout("try{"+this._pathName+".__suggest();}catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}",300);
	};

	_me.__onclick = function(e){
		if (!e.contextmenu){
			if (this.__hideTime){
				window.clearTimeout(this.__hideTime);
				this.__hideTime = null;
			}

			if (this.__showTime)
				window.clearTimeout(this.__showTime);
			this.__showTime = window.setTimeout("try{"+this._pathName+".__suggest();}catch(e){gui._REQUEST_VARS.debug && console.log(this._name||false,e);}",300);
		}
	};
/*
	_me._onclose = function(e){

		if (this.suggest){
			e.preventDefault();
			e.cancelBubble = true;

			this.__hide();
			return false;
		}

		return true;
	};
	*/
/**
 * @brief: Show UL-LI suggestion element and align it with input
 * @date : 20.4.2006 17:27:33
 **/
_me.__show = function(aValues){

	if (this.__hideTime){
		window.clearTimeout(this.__hideTime);
		this.__hideTime = null;
	}

	if (!aValues || !aValues.length || this._destructed || !this.__hasFocus){
		this.__hide();
		return;
	}

	if (!this.suggest){
		this.suggest = gui._create('suggest','obj_block','','gui_suggest_block ' + this._type + '_plus');
		this.suggest._position('absolute');

		var me = this;
		this.suggest._main.onmousedown = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			//MSIE Scrollbar fix
			if (elm.tagName == 'DIV'){
				if (currentBrowser() != 'Mozilla')
					me.__skipcycle = true;

				return;
			}

			if (elm.tagName == 'SPAN')
				elm = elm.parentNode;

			if (elm.tagName == 'A'){
				var list = this.getElementsByTagName('A');
				for(var i = list.length-1; i>=0; i--)
					if (list[i]===elm){
						me.__skipblur = true;
						me.__active = i;
                        me._qvalue(me.__aQuery_data[i]);

						if (me._onmouseselect)
						 	me._onmouseselect();

						if (e.stopPropagation) e.stopPropagation();
							e.cancelBubble = true;

						me.__hide();
						return false;
					}
			}
		};

		this.suggest._main.onmousemove = function(e){
			var e = e || window.event;
			var elm = e.target || e.srcElement;
			if (elm.tagName == 'SPAN')
				elm = elm.parentNode;

			if (elm.tagName == 'A'){
				var list = this.getElementsByTagName('A');
				for(var i = list.length-1; i>=0; i--)
					if (list[i] === elm)
						me.__activate(elm,i);
					else
						removecss(list[i],'active');
			}
		};
	}

	//Prepare Active
	if (this.__active && this.__aQuery_data && this.__aQuery_data.length && this.__active>-1){
		var tmp,old = this.__aQuery_data[this.__active];
		if (Is.Array(old)) old = old[0];

		this.__active = this.__activeFirst?0:-1;
		if (old)
			for(var i in aValues){
				tmp = Is.Object(aValues[i])?aValues[i].value:aValues[i];
				if (tmp == old){
                	this.__active = i;
					break;
				}
			}
	}
	else
        this.__active = this.__activeFirst?0:-1;

	//Render
	var elm = mkElement('div');

	//Caption
	if (this.__caption){
		if (Is.Function(this.__caption))
			elm.appendChild(mkElement('h2', {innerHTML: this.__caption(this.__last_qdata) + '<span>'+ getLang('COMMON::ESC_MESSAGE') +'</span>'}));
		else
			elm.appendChild(mkElement('h2', {innerHTML: getLang(this.__caption, [(this.__last_qdata.length?mkElement('b', {text:'"'+this.__last_qdata+'"'}).outerHTML:'')]) + '<span>'+ getLang('COMMON::ESC_MESSAGE') +'</span>'}));
	}


	var j = 0, a;
	for(var i in aValues){
		j++;

		if (Is.Object(aValues[i])){

			a = mkElement('a');

			if ((aValues[i].value + aValues[i].hint).length>32)
				a.title = aValues[i].value + (aValues[i].hint?' '+ aValues[i].hint:'');

			if (aValues[i].css)
				a.className = aValues[i].css;

			a.innerHTML = (aValues[i].prefix || '') + (aValues[i].text || aValues[i].value).escapeHTML() + (aValues[i].hint?'<span>'+aValues[i].hint.escapeHTML()+'</span>':'');
		}
		else
			a = mkElement('a',{text:aValues[i]});

		elm.appendChild(a);
	}

	this.suggest._main.style.height = j>10?'287px':'auto';
	this.suggest._main.innerHTML = elm.outerHTML;

/*
	var j = 0;
	for(var i in aValues){
		j++;
		if (Is.Object(aValues[i])){

			if ((aValues[i].value + aValues[i].hint).length>32)
				out += '<a title="'+ (aValues[i].value + (aValues[i].hint?' '+ aValues[i].hint:'')).entityify() +'"';
			else
				out += '<a';

			out += (aValues[i].css?' class="'+ aValues[i].css +'">':'>') + (aValues[i].prefix || '') + aValues[i].value.escapeHTML() + (aValues[i].hint?'<span>'+aValues[i].hint.escapeHTML()+'</span>':'') +'</a>';
		}
		else
			out +='<a>'+ aValues[i].escapeHTML() +'</a>';
	}

	this.suggest._main.style.height = j>10?'287px':'auto';
	this.suggest._main.innerHTML = '<div>' + out + '</div>';
*/

	var oPos = getSize(this._main),
		h = this.suggest._main.offsetHeight;

	if (oPos.y + oPos.h + h>gui._main.clientHeight && oPos.y > gui._main.clientHeight - (oPos.y + oPos.h)){
		this.__direction = 'up';
		this.suggest._place(oPos.x,oPos.y-h,this.__minWidth || oPos.w);

		if (h>oPos.y)
			this.suggest._main.style.height = oPos.y + 'px';
	}
	else{
		this.__direction = 'down';
		this.suggest._place(oPos.x, oPos.y + oPos.h, this.__minWidth || oPos.w);

		if (oPos.y + oPos.h + h > gui._main.clientHeight)
			this.suggest._main.style.height = gui._main.clientHeight - (oPos.y + oPos.h) + 'px';
	}

	this.suggest._main.className = 'gui_suggest_block ' + this._type + '_plus ' + this.__direction;

	this.suggest._focus();

	var elm;
	if (this.__active>-1 && (elm = this.suggest._main.getElementsByTagName('A')[this.__active])){
		this.__activate(elm,this.__active);
		elm = null;
	}

	this.__aQuery_data = aValues;

	if (this._destructed)
		this.__hide();
};

/**
 * @brief: Hide UL-LI suggestion element and clear "active row"
 * @date : 21.4.2006 16:19:08
 **/
_me.__hide = function(){
	if (this.__hideTime){
		window.clearTimeout(this.__hideTime);
		this.__hideTime = '';
	}

	this.__aQuery_data = [];
    this.__active = -1;

	if (this.suggest){
		this.suggest._destruct();
		delete this.suggest;
	}

	this.__sLastSuggest = '';
};

_me.__activate = function(elm,id){
	this.__active = id;
	addcss(elm,'active');

	var ediv = this.suggest._main.firstChild;

	//Scroll
	if (ediv.scrollTop>elm.offsetTop)
		ediv.scrollTop = elm.offsetTop;
	else
	if (elm.offsetTop+elm.offsetHeight>ediv.scrollTop+ediv.clientHeight)
		ediv.scrollTop = elm.offsetTop + elm.offsetHeight - ediv.offsetHeight;
};

_me.__up = function(){

	var list, no = parseInt(this.__active,10);

	if (no && this.suggest && this.suggest._main && (list = this.suggest._main.getElementsByTagName('A'))){
		if (this.__direction == 'up' && no<0)
			no = list.length;

		for(var i = list.length-1; i>=0; i--)
			if (i == no-1)
				this.__activate(list[i],no-1);
			else
				removecss(list[i],'active');
	}
};
_me.__dn = function(){

	var list, no = parseInt(this.__active,10);

	if (this.suggest && this.suggest._main && (list = this.suggest._main.getElementsByTagName('A'))){

		if (list.length>no+1)
			for(var i = list.length-1; i>=0; i--)
				if (i == no+1)
					this.__activate(list[i],no+1);
				else
					removecss(list[i],'active');
	}
};

/**
 * @brief: Object destructor
 * @date : 21.4.2006 16:36:17
 **/
_me.__destructor = function(){

	gui._disobeyEvent('click',[this,'__hide']);

	if (this.__showTime){
		window.clearTimeout(this.__showTime);
		this.__showTime = null;
	}

	this.__hide();
};

_me.__suggest = function(){
	if (!this.__showTime) return;

	var inp = this._getFocusElement();
	if (this._destructed || !inp){
		this.__hide();
		return;
	}

	this.__input_value = inp.value;

	var v = this._qdata(this.__input_value);
	if (!v || v.length<this._min){
		this.__hide();
		return;
	}

	if (this.__sLastSuggest != v){
		this._query(v);
		this.__sLastSuggest = v;
	}
	else
	if (!this.suggest && !this._destructed && this._parse)
		this._parse();
};

_me._input_value = function(){
	var inp = this._getFocusElement();
	return this._destructed || !inp?'':this._qdata(inp.value);
};
