/**
 * Horizontal menu object
 *
 * <p item>	is text content of menu
 *			if value is equal to '-' than <hr> tag is used instead of link
 *
 * Input array example:
 * x[<p item>]	[arg] = obj | string
 *				[disabled]
 *				[css] = 'className'
 *				[nodes][<ch item>]	[arg]
 *									[css]
 *									[nodes]
 **/
_me = obj_hmenu.prototype;
function obj_hmenu(){};

_me.__constructor = function(){
	this._telemetry = 'off';
	this.__idtable = {};

	var me = this;

	//onmspointerup fix part 1
	if (window.navigator.msPointerEnabled){
		this._main.onmspointerdown = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName!='A')
				elm = Is.Child(elm, 'A', this);

			me.__pointerTarget = elm.id || null;
		};

		this._main.onclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName!='A')
				elm = Is.Child(elm, 'A', this);

			if (elm && elm.id){
				var id = elm.id.substr(me._pathName.length+1);

				if (me.__idtable[id] && !me.__idtable[id].disabled && me.__idtable[id].keep){
					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
					return false;
				}
			}
		};
	}

	this._main[window.navigator.msPointerEnabled?'onmspointerup':'onclick'] = function(e){

		var e = e || window.event,
			elm = e.target || e.srcElement;

		if (elm.tagName!='A')
			elm = Is.Child(elm, 'A', this);

		//onmspointerup fix part 2
		if (e.type == 'MSPointerUp' && this.onmspointerdown && elm.id && (!me.__pointerTarget || me.__pointerTarget !== elm.id)){
			me.__pointerTarget = null;
			return;
		}
		me.__pointerTarget = null;


		if (elm){
			// parse id
			var id = elm.id.substr(me._pathName.length+1);
	        if (me.__idtable[id] && !me.__idtable[id].disabled){
				var arg = me.__idtable[id].arg;

				if (me.__idtable[id].handler){
					if (!me.__idtable[id].keep && me.__close) me.__close();

					executeCallbackFunction(me.__idtable[id].handler,me,elm,id,arg);
				}

				if (arg) {
					if (me.__idtable[id] && !me.__idtable[id].keep && me.__close) me.__close();

					me.__exeEvent('onclick',e,{"arg":arg,"id":id,"elm":elm,"owner":me});
					if (me._onclick)
						me._onclick(e,elm,id,arg);
				}

				if (me.__idtable[id] && me.__idtable[id].keep){
					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
				}
			}
		}

		//Anchor
		if ((elm = Is.Child(e.target || e.srcElement, 'LI', this)) && (elm = elm.firstChild) && elm.tagName == 'DIV' && Is.Defined(elm.id)){
			/*
			var id = elm.id.substr(me._pathName.length+1);

			if (me.__idtable[id].keep){
				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
			}
			else
				*/
			return true;
		}

		return false;
	};

	this._main.oncontextmenu = function (e){
		return false;
	};

	//Telemetry reporting
	if (gui.telemetry)
		this._obeyEvent('onclick',[function(e,arg){

			var out = {id:me._pathName, type:me._type};

			if (arg){
				out.id += '/' + arg.id;

				if (me.__idtable && me.__idtable[arg.id]){
					if (me.__idtable[arg.id].label)
						out.label = me.__idtable[arg.id].label;

					if (Is.String(me.__idtable[arg.id].arg))
						out.arg = me.__idtable[arg.id].arg;
				}
			}

			if (me._owner && me._owner._pathName)
				out.owner = me._owner._pathName;

			gui.telemetry._add(out);

		}]);
};

/* Telemetry Parser */
_me.__telemetry = function(id, elm, data){

	//is Option id
	if (id.indexOf('/')>-1){

		//check owner obj
		if (data.OWNER && (!this._owner || data.OWNER != this._owner._pathName))
			return false;

		//check id
		var id = id.substr(this._pathName.length+1).split('#').shift();
		if (id && !this.__idtable[id])
			return false;

		//check arg
		if (data.ARG && this.__idtable[id].arg != data.ARG)
			return false;

		//check label
		if (data.LABEL && this.__idtable[id].label != data.LABEL)
			return false;
	}
};

_me._fill = function (aData){

	this._clear();

	// retrieve data from dataset
	if (typeof aData == 'undefined'){
		if (this._listener)
			aData = dataSet.get(this._listener,this._listenerPath);
		else
		if (this.__aData)
			aData = this.__aData;
	}
	else
		this.__aData = aData;

	if (aData)
		this.__row(aData,'');
};

_me._clear = function (){
	// clear all sub-objects
	this._clean();

	// clear the hmenu window
	var ul;
	if ((ul = this._main.getElementsByTagName('ul')) && (ul = ul[0]))
		ul.parentNode.removeChild(ul);
};

_me.__row = function(aData,child,bSkipNodes){
	var path,elm1,elm2,me = this;

	/* create main UL element */
	elm1 = mkElement("ul",{className:'root'});

	if (!child) {
		// prepare path
		this.__idtable = {};
		path = '';
	}
	else
		path = child + '/';

	var n = 0;
	for(var i in aData){

		// pulldown configuration
		if (aData[i].config){
			if (aData[i].config.css);
			addcss(elm1,aData[i].config.css);
			continue;
		}

		elm2 = mkElement("li");
		elm2.__key = i;
		elm2.__path = path + n;

		if (!bSkipNodes && (aData[i]['nodes'] || aData[i]['callback']) && !aData[i]['disabled']){
			elm2.onmouseover = function(e){
				clearTimeout(this.timeout);
				if (!hascss(this,'active')){

					var elm = this.getElementsByTagName("UL")[0];

					if (aData[this.__key]['callback']){

						if (elm)
							this.removeChild(elm);

						var rows = executeCallbackFunction(aData[this.__key]['callback'], e, this.__key, aData[this.__key]);
						if (rows){
							if (rows instanceof Element)
								elm = rows;
							else
								elm = me.__row(rows, this.__path);
						}
						else
						if (rows === false)
							return;

						this.insertBefore(elm,this.firstChild);

						//Extend mouseEvent by arg2 attribute
						elm.onclick = function(e){
							if (aData[i]['arg2'])
								e.__arg2 = aData[i]['arg2'];
						};
					}
					else
					if (!elm){
						elm = me.__row(aData[this.__key]['nodes'],this.__path);
					}

					if (elm && !elm.parentNode){
						//Extend mouseEvent by arg2 attribute
						elm.onclick = function(e){
							if (aData[i]['arg2'])
								e.__arg2 = aData[i]['arg2'];
						};

						this.insertBefore(elm, this.firstChild);
					}

					addcss(this,'active');
					addcss(elm1,'submenu');

					var xBody = document.getElementsByTagName('body')[0].clientWidth,
						yBody = document.getElementsByTagName('body')[0].clientHeight,
						aPos = getSize(elm);

					//X
					if (xBody<aPos.x+aPos.w)
						addcss(this,'left');

					if (gui._rtl && aPos.x < 10)
						addcss(this, 'right');

					//Y
					if (yBody<aPos.y+aPos.h)
						elm.style.marginTop = (yBody-aPos.y-aPos.h) + 'px';

					elm = null;
				}
			};

			elm2.onmouseout = function(e){
				this.timeout = setTimeout(function() {
					removecss(this,'active','left','right');
					removecss(elm1,'submenu');
				}.bind(this), 5);
			};
		}

		/* space */
		if (aData[i]['title'] == ' '){
			addcss(elm2,'space');

			if (aData[i]['css'])
				addcss(elm2,aData[i]['css']);

			delete aData[i]['nodes'];
		}
		else
		/* horizontal line */
		if (aData[i]['title'] == '-'){

			addcss(elm2,'hr');

			if (aData[i]['css'])
				addcss(elm2,aData[i]['css']);

			delete aData[i]['nodes'];
		}
		else
		/* blank, create Anchor*/
		if (aData[i]['anchor']){
			this._anchors[aData[i]['anchor']] = this._pathName + '/' + path + '#' + aData[i]['anchor'];

			this.__idtable[path + '#' + aData[i]['anchor']] = {keep:aData[i]['keep']};

			if (aData[i]['css'])
				addcss(elm2,aData[i]['css']);

			elm2.appendChild(mkElement('div',{id:this._anchors[aData[i]['anchor']]}));

			delete aData[i]['nodes'];
		}
		else
		if (aData[i]['html'] || aData[i]['element']){
			if (aData[i]['css'])
				addcss(elm2,aData[i]['css']);

			elm2.appendChild(aData[i]['element'] || mkElement('div',{innerHTML:aData[i]['html']}));

			delete aData[i]['nodes'];
		}
		/* link */
		else{
			this.__idtable[path + n] = {};

			if (aData[i]['arg'])
				this.__idtable[path + n].arg = aData[i]['arg'];

			if (aData[i]['handler'])
				this.__idtable[path + n].handler = aData[i]['handler'];

			this.__idtable[path + n].keep = aData[i]['keep'];

			this.__idtable[path + n].string = aData[i]['title'] || aData[i]['text'];


			var css = '';
			if (aData[i]['css'])
				css = aData[i]['css'];

			if (aData[i]['nodes'] || aData[i]['callback']) {
				css += ' nodes';
				this.__idtable[path + n].nodes = true;
			}

			if (aData[i]['disabled'] || aData[i]['caption']){
				if (aData[i]['disabled'])
					css += ' disabled';
				if (aData[i]['caption'])
					css += ' caption';

				this.__idtable[path + n] = {"disabled":true};
			}

			var inner_str = '<' + (aData[i]['tag'] || 'span') + (aData[i]['css2']?' class="'+aData[i]['css2']+'"':'') +'>';
			if (typeof aData[i]['title'] == 'string'){
				inner_str += (aData[i]['title'].length?getLang(aData[i]['title']):'&nbsp;') + '</span>';

				this.__idtable[path + n].label = aData[i]['title'];
			}
			else
			if (typeof aData[i]['text'] != 'undefined'){
				inner_str += (aData[i]['text'].length?aData[i]['text']:'') + '</span>';

				this.__idtable[path + n].label = aData[i]['title'];
			}
			else
				inner_str += i + '</' + (aData[i]['tag'] || 'span') + '>';

			elm2.className = css;

			var a = mkElement('a', {
				id: this._pathName + '/' + path + n,
				title: aData[i]['title2'] ? getLang(aData[i]['title2']).entityify() : '',
				unselectable: 'on'
			});
			a.innerHTML = inner_str;
			elm2.appendChild(a);
		}

		n++;
		elm1.appendChild(elm2);
	}

	/* set "end" className for last node with childs */
	if (elm2){
		addcss(elm2,'end');
		/* destruct html elements */
		elm2 = null;
	}

	/* append root UL element into _main */
	if (!child) {
		this._main.appendChild(elm1);
		return;
	}

	/* return UL element */
	return elm1;
};


_me.__update = function(){
	this._fill();
};

/**
 * @brief: optional onclick method
 * @param: e    - Event Handler (onclick event object)
 *         elm  - srcElement (link)
 *         id   - objects internal id (without pathName)
 *         arg  - item's arg section
 *
 * _me._onclick = function(e,elm,id,arg){};
 */
