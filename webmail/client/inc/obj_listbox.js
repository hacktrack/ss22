_me = obj_listbox.prototype;
function obj_listbox(){};

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

			if (elm.tagName != 'DIV' || elm==this) return;

            var id = elm.getAttribute('id').substr(me._pathName.length+1);

			if (me._oncontext)
            	me._oncontext(e, id, me.__idTable[id]);

			return false;
		};

		this._main.onclick = function(e){

			if (me.__disabled) return false;

			var e = e || window.event,
				elm = e.target || e.srcElement,
				checkbox = false;

			if (elm == this) return;

			//checkbox
			if (elm.tagName == 'SPAN'){
				elm = elm.parentNode;
				checkbox = true;
			}

			var id = elm.getAttribute('id').substr(me._pathName.length+1);

			if (checkbox){
				me._checked(id, me.__idTable[id].checked?false:true);
			}
			else{
				// multiselect
				if (me.__multi && e.ctrlKey){

					//activate
					var v = me._value(),
						p = inArray(v, id);

					if (p<0){
						v.push(id);
						me._value(v);
					}
					//deactivate
					else{
						v.splice(p,1);
						me._value(v);
					}
				}
				// singleselect
				else
					me._value(id);
			}

			if (me._onclick) me._onclick(e, id, me.__idTable[id]);
			me.__exeEvent('onclick',e,{"owner":me, id:id, data:me.__idTable[id]});
		};

		this._main.ondblclick = function(e){
			var e = e || window.event,
				elm = e.target || e.srcElement;

			if (elm.tagName != 'DIV' || elm==this) return;

			var id = elm.getAttribute('id').substr(me._pathName.length+1);

			if (me._ondblclick) me._ondblclick(e,id,me.__value[id]);
			me.__exeEvent('ondblclick',e,{"owner":me,"src":id,"value":me.__value[id]});
		};

	};

	_me._multiple = function(b){
		if (typeof b == 'undefined') return this.__multi;
		if (!(this.__multi = b?true:false))
			this._value(this._value());
	};

	_me._value = function(v, bNoUpdate) {
		//return
		if (typeof v == 'undefined'){
			var out = [];
			for (var i in this.__value){
				out.push(this.__value[i]);
				if (!this.__multi) break;
			}
			return out;
		}
		//set
		else{
			if (!Is.Object(v)) v = [v];

			var etmp;
			for (var i in this.__value)
				if ((etmp = document.getElementById(this._pathName + '/' + this.__value[i])))
					removecss(etmp,'active');

			this.__value = [];

			for (var i in v){
				if (typeof this.__idTable[v[i]] == 'undefined') continue;

				this.__value.push(v[i]);

				if ((etmp = document.getElementById(this._pathName + '/' + v[i]))){
					addcss(etmp,'active');
					etmp.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
				}

				if (!this.__multi)
					break;
			}

			if (!bNoUpdate){
				if (this._onchange) this._onchange();
				this.__exeEvent('onchange',null,{"owner":this});
			}
		}
	};

	_me._checked = function(id, b){
		if (Is.Defined(id) && this.__idTable[id])
			if (Is.Defined(b)){
				var b = b?true:false;
				if (!this.__idTable[id].disabled && this.__idTable[id].checked != b){
					this.__idTable[id].checked = b;

					var elm = document.getElementById(this._pathName + '/' + id);
					if (elm)
						window[b?'addcss':'removecss'](elm, 'checked');

					if (this._oncheck) this._oncheck(id, this.__idTable[id]);
					this.__exeEvent('oncheck',null,{"owner":this, id:id, data:this.__idTable[id]});
				}
			}
			else
				return this.__idTable[id].checked?true:false;
	};

	_me._fill = function(aData){
		var elm;

		this._main.innerHTML = '';
		this.__idTable = {};

		for (var i in aData){

			this.__idTable[i] = aData[i];
			elm = mkElement('div', {id:this._pathName + '/' + i});

			if (Is.String(aData[i]))
				elm.innerHTML = (aData[i] || '').escapeHTML();
			else{
				if (Is.Defined(aData[i].checked))
					elm.appendChild(mkElement('span'));

				elm.appendChild(document.createTextNode(aData[i].title || ''));

				if (aData[i].css)
					addcss(elm, aData[i].css);

				if (aData[i].checked)
					addcss(elm, 'checked');
				if (aData[i].disabled)
					addcss(elm, 'disabled');
			}

			this._main.appendChild(elm);
		}

		this._value(this._value());
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