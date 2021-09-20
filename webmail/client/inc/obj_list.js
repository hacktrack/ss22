_me = obj_list.prototype;
function obj_list(){};

	_me.__constructor = function(){
		this.__idTable = {};
		this.__value = {};
		this.__multi = true;
		this.__disabled = false;

		/* set whole object unselectable for Mozilla, Safari, KHTML, MSIE */
        setSelectNone(this._main);

		var me = this;

		this._main.oncontextmenu = function(e){
			if(me.__disabled) return false;

			var e = e || window.event;
			var elm = e.target || e.srcElement;

			if (elm==this) return;

			if(elm.parentNode.tagName=='LI')
				elm = elm.parentNode;

			var id = elm.getAttribute('id').substr(me._pathName.length);

			me._selected(id);

			if (me._oncontext)
				me._oncontext(e, id, me.__idTable[id]);

			return false;
		};

		this._main.onclick = function(e){
			if(me.__disabled) return false;

			var e = e || window.event;
			var elm = e.target || e.srcElement;

			if(elm==this) return;

			if(elm.tagName!='B') { // Ignore b, used as button
				if(elm.parentNode.tagName=='LI')
					elm = elm.parentNode;

				var id = elm.getAttribute('id').substr(me._pathName.length);

				if(hascss(elm,'active') && (e.target || e.srcElement) && (e.target || e.srcElement).nodeName=='EM' && (!e.x && e.explicitOriginalTarget && e.explicitOriginalTarget.nodeType==1 && e.layerX && e.layerX < 20 || e.offsetX && e.offsetX > 108) && me._oncontext)
					me._oncontext(e,id,me.__idTable[id]);

				var etmp;
				/* multiselect */
				if (me.__multi && e.ctrlKey){
					//activate
					if (typeof me.__value[id] == 'undefined'){
						me.__value[id] = elm.getAttribute('id');
						addcss(elm,'active');
					}
					//deactivate
					else{
						delete me.__value[id];
						removecss(elm,'active');
					}
				}
				/* singleselect */
				else{
					for (var j in me.__value){
						 if (j != id){
							if ((etmp = document.getElementById(me.__value[j])))
								removecss(etmp,'active');

							delete me.__value[j];
						 }
					}
					me.__value[id] = elm.getAttribute('id');
					addcss(elm,'active');
				}
			}

			if(e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;

			if (me._onclick) me._onclick(e);	// Add id like dblclick?
			me.__exeEvent('onclick',e,{"owner":me});
		};

		this._main.ondblclick = function(e){
			var e = e || window.event;
			var elm = e.target || e.srcElement;

			if (elm.tagName != 'DIV' || elm==this) return;

			var id = elm.getAttribute('id').substr(me._pathName.length);

			if (me._ondblclick) me._ondblclick(e,id,me.__value[id]);
			me.__exeEvent('ondblclick',e,{"owner":me,"src":id,"value":me.__value[id]});
		};

	};

	_me._deselectall = function() {
		var ul = this._main.getElementsByTagName('LI');
		for(var i = ul.length; i;)
			removecss(ul[--i],'active');

		this.__value = {};
	}

	_me._emptylabel = function(sText) {
		if(sText==undefined)
			return this.__emptytext;
		else
			this.__emptytext = sText;
	}

	_me._multiple = function(b){
		if(typeof b == 'undefined') return this.__multi;

		b = b?true:false;

		// M->S, leave only first selected item
		if  (!b && !Is.Empty(this.__value)){
			var etmp,first = true;
			for (var i in this.__value){
				if  ((etmp = document.getElementById(this.__value[i]))){
					if (first){ first = false; continue; }
					removecss(etmp,'active');
					delete this.__value[i];
				}
			}
		}

		this.__multi = b;
	};

	_me._selected = function(v) {
		//return
		if (typeof v == 'undefined'){
			var out = [];
			for (var i in this.__value){
				out.push(i);
				if (!this.__multi) break;
			}
			return out;
		}
		//set
		else{
			if (!Is.Object(v)) v = [v];

			var etmp,id;
			for (var i in this.__value)
				if ((etmp = document.getElementById(this._pathName+ "#" +i))) removecss(etmp,'active');

			this.__value = [];

			for (var i in v){
				if (typeof this.__idTable[v[i]] == 'undefined') continue;

				id = this._pathName + "#" + v[i];
				this.__value[v[i]] = id;

				if ((etmp = document.getElementById(id))) addcss(etmp,'active');
			}
		}
	}

	_me._value = function(v){
		return this._selected(v);
	};

	_me._fill = function(oData){
		var tmp, id, text;

		this._main.innerHTML = '';
		this.__idTable = {};

		var ul = mkElement('ul');

		for(var i in oData) {
			if(oData[i].html)
				text = oData[i].html;
			else
				text = (typeof oData[i] == 'string' ? oData[i] : oData[i].text).escapeXML();

			id  = this._pathName + '#' +i;

			tmp = mkElement('li');
			tmp.setAttribute('id',id);

			if(oData[i].tooltip) {
				if(gui.tooltip)
					gui.tooltip._add(tmp,oData[i].tooltip);
				else
					tmp.title = oData[i].tooltip;
			}

			if(oData[i].css)
				tmp.className = oData[i].css;

			tmp.innerHTML = text;

			this.__idTable[i] = oData[i];

			ul.appendChild(tmp);

		}

		if(ul.hasChildNodes())
			this._main.appendChild(ul);
		else
		if (this.__emptytext) {
			tmp = mkElement('h3',{className:'empty'});
			tmp.innerHTML = this.__emptytext.escapeXML();
			this._main.appendChild(tmp);
		}

		var value = this._selected();
		if (value) this._selected(value);
	};

	_me._disabled = function(b){
		this.__disabled = (b?true:false);

		if (this.__disabled)
			addcss(this._main,'disabled');
		else
			removecss(this._main,'disabled');
	};

	_me.__update = function (sDataSet){
		if (!sDataSet) return;

		if (this._listener == sDataSet)
			this._value(dataSet.get(this._listener,this._listenerPath));
		else
		if (this._listener_data == sDataSet)
			this._fill(dataSet.get(this._listener_data,this._listenerPath_data));
	};

	_me._listen_data = function(sDataSet,aDataPath){
		this._listener_data = sDataSet;
		if (typeof aDataPath == 'object') this._listenerPath_data = aDataPath;
		dataSet.obey(this,'_listener_data',sDataSet);
	};
