/*
_oncreateOptionList()

*/
_me = obj_select.prototype;
function obj_select(){};

_me.__constructor = function(){
	var me = this;

	this._readonly(true);

	this.__idTable = {};
	this.__natSort = false;

	this.__eLBL = mkElement('label', {className:'unselectable'});
	this._main.appendChild(this.__eLBL);

	AttachEvent(this._main, 'onclick', function(e){
		if (!me._disabled()){
			var e = e || window.event;
			me._focus();

			if (me.block && me.block._destructed == false) {
				me.block._destruct();
			} else{
				me._show();
			}
		}
	});

	// KEY DOWN
	var oldVal = '';
	this.__eIN.onkeydown = function(e){
		var e = e || window.event;

		oldVal = this.value;

		switch (e.keyCode) {
			// Enter opens or closes dropdown
			case 13:
				if (!me.block || me.block._destructed)
					me._show();
				else
				if (me.block)
					me.block._destruct();

			// Esc closes dropdown (or closes window if no dropdown)
			case 9:
			case 27:
				if (me.block && !me.block._destructed && e.keyCode!=13) {
					// Remove dropdown
					me.block._destruct();
					// Esc handled no propagation
					if(e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
				}
				// Submit after esc or enter
				if(!this._readonly && me._onsubmit)
					me._onsubmit(e);

				// Avoid default browser action
				if (e.preventDefault)
					e.preventDefault();

				break;

			// Up
			case 38:
				var tmp = null;
				if (Is.Defined(me.__value)){
					for(var i in me.__idTable)
						if (me.__idTable.hasOwnProperty(i)){
							if (me.__value == i) break;
							tmp = i;
						}

					if (tmp != null)
						me._value(tmp);
				}
				return false;

			// Down
			case 40:
				var tmp = null;

				if (Is.Defined(me.__value)){
					for(var i in me.__idTable)
						if (me.__idTable.hasOwnProperty(i)){

							if (tmp!=null){
								tmp = i;
								break;
							}

							if (i == me.__value)
								tmp = me.__value;
						}

					if (tmp != null)
					 	me._value(tmp);
				}

				return false;
		}

		if (me._onkeydown) return me._onkeydown(e);
		me.__exeEvent('onkeydown',e,{"owner":me});

		return e.keyCode==13?false:true;
	};

	//Search
	this.__searchPointer = 0;
	this.__searchValue = '';
	AttachEvent(this.__eIN, 'onkeyup', function(e){
		if (!me._disabled() && me._readonly()){
			if (oldVal != this.value){
				oldVal = this.value;
				me._quickSearch();
			}
			else
				return false;
		}
	});
};

_me._setNatSort = function(bNatSort) {
	this.__natSort = bNatSort;
};

_me._quickSearch = function(){

	//Search
	var inp = this.__inputValue().toLowerCase(),
		old = this.__searchValue,
		resetPointer = false;

	if (old != inp && this._getTextValue().toLowerCase().indexOf(inp) != 0)
		resetPointer = true;

	if ((this.__searchValue = inp)){

		var res = [];
		for(var i in this.__idTable){
			var s = (Is.Object(this.__idTable[i])?this.__idTable[i][0]:this.__idTable[i]).toLowerCase();

			if (s.indexOf(inp) === 0){
				res.push(i);

				if (resetPointer || res.length-1 == this.__searchPointer){
					this.__searchPointer = resetPointer?1:this.__searchPointer+1;
					this._value(i);
					return;
				}
			}
		}

		if (!Is.Empty(res)){
			this.__searchPointer = 1;
			this._value(res[0]);
		}
		else{
			if (inp.length > 1){
				inp = inp.substr(-1);

				if (old != inp)
					this.__searchPointer = 0;

				this.__inputValue(inp);
				this._quickSearch();
			}
			else{
				this.__inputValue('');
			}
		}
	}
};

_me._show = function(e){
	setTimeout(function() {
		this.__searchPointer = 0;
	this.__searchValue = '';

		if (this._oncreateOptionList)
			this._oncreateOptionList();

		if (count(this.__idTable)){
			var pos = getSize(this._main),
				me = this;

			this.block = gui._create('block','obj_block_ext2','', 'bubble1 obj_select_plus ' + (this._custom_list_className || this._main.className || ''), this._main);

			this.block._place(pos.x,pos.y+pos.h-1);
			this.block._telemetry = 'off'; //Disable telemetry

			if (pos.w<500){
				this.block._main.style.visibility = 'hidden';
				this.block._main.style.minWidth = pos.w + 'px';
				this.block._main.style.maxWidth = '500px';
			}
			else
				this.block._main.style.width = pos.w + 'px';

			AttachEvent(this.block._main,'onclick', function (e){
				var e = e || window.event,
					elm = e.target || e.srcElement;

				if (elm.tagName != 'A')
					elm = Is.Child(elm, 'A', this);

				if (elm && elm.tagName == 'A'){

					// Focus field and add selected value from dropdown
					me._focus();

					me._value(elm.rel);

					if (me.block)
						me.block._destruct();

					if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;

					//Telemetry
					if (gui.telemetry)
						gui.telemetry._add({id: me._pathName, type: me._type});
				}
			});

			var elm2,
				elm = mkElement('div',{className:'maxbox'}),
				v = this._readonly()?this.__value:this.__inputValue();

			this.block._main.appendChild(elm);

			var keys = Object.keys(this.__idTable);
			if(this.__natSort) {
				keys.sort(function(a, b) {
					return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
				});
			}
			keys.forEach(function(i) {
				if (Is.Object(this.__idTable[i])){

					if (Is.Object(this.__idTable[i][0])){
						elm2 = mkElement('a',{rel:i, text:this.__idTable[i][0].text || '', className:this.__idTable[i][1], title:this.__idTable[i][2] || ''});

						if (this.__idTable[i][0].html)
							elm2.innerHTML += this.__idTable[i][0].html;
					}
					else{
						elm2 = mkElement('a',{rel:i,text:this.__idTable[i][0],className:this.__idTable[i][1],title:this.__idTable[i][2] || ''});
					}
				}
				else
					elm2 = mkElement('a',{rel:i,text:this.__idTable[i]});

				elm.appendChild(elm2);

				if (i == v){
					addcss(elm2,'active');
					this.__scrollActive(elm2);
				}
			}, this)
			elm.style.width = elm.offsetWidth + 'px';
			elm = null;

			//IE8
			if (pos.w<500){
				if (this.block._main.offsetWidth>500)
					this.block._main.style.width = '500px';

				this.block._main.style.visibility = 'visible';
			}

			if (this.block._main.offsetHeight>260)
				this.block._scrollbar(this.block._main.firstChild,this.block._main);

			// If there is not enough space down, then flip the dropdown _up_ instead (if there is enough space up available)
			if(gui.frm_main && gui.frm_main._main && (pos.y + pos.h + this.block._main.offsetHeight > gui.frm_main._main.offsetHeight) && (this.block._main.offsetHeight<pos.y))
				this.block._place(pos.x,pos.y-this.block._main.offsetHeight+1);

		}
		this.__exeEvent('show', e, {"owner": this});
	}.bind(this), 5);
};

_me.__scrollActive = function(elm){
	if (elm && this.block && this.block._main && this.block._main.firstChild.clientHeight<this.block._main.firstChild.scrollHeight){
		var pos1 = getSize(elm),
			pos2 = getSize(this.block._main.firstChild);

		if (pos1.y<pos2.y)
			this.block._main.firstChild.scrollTop += pos1.y-pos2.y;
		else
		if (pos1.y+pos1.h>pos2.y+pos2.h)
			this.block._main.firstChild.scrollTop += ((pos1.y+pos1.h)-(pos2.y+pos2.h));
	}
};

_me._fill = function(aData){
	this.__idTable = aData || {};
};

_me._fillLang = function(aData){
	this.__idTable = {};

	if (aData)
		for (var i in aData) {
			if (typeof aData[i] == 'object')
				this.__idTable[i] = [getLang(aData[i][0],aData[i][1]),aData[i][2]];
			else
				this.__idTable[i] = getLang(aData[i]);
		}
};

_me._value = function(v,bNoEvn){

	if (Is.Defined(v)){

		if (!this._readonly())
			this.__value = this.__inputValue();

 		if (v == this.__value){

			if (!bNoEvn){
				if (this._onselect)
					this._onselect(null);
				this.__exeEvent('onselect',null,{"owner":this});
			}

			return true;
		}
 		else
		// onbeforechange event
		if (!bNoEvn && this.__value){
			if (this._onbeforechange && this._onbeforechange(this.__value, v) === false)
				return;

			this.__exeEvent('onbeforechange',null,{"owner":this, "before":this.__value, "current":v});
		}

		var bBlock = this.block && this.block._destructed == false,
			bReturn = false;

		this.__value = v;

		if (this.__idTable[v]){
			bReturn = true;

			if (Is.Object(this.__idTable[v])){

				this._main.setAttribute('iw-value', this.__idTable[v][1]);
				//this._main.className = this._allcss +' '+ this.__idTable[v][1] + (this._readonly()?' readonly':'') + (this._disabled()?' disabled':'');

				if (this._readonly()){
					if (this.__idTable[v][2])
						this.__eLBL.title = this.__idTable[v][2];

					if (Is.Object(this.__idTable[v][0])){
						this.__eLBL.innerText = this.__idTable[v][0].text || '';
						if (this.__idTable[v][0].html)
							this.__eLBL.innerHTML += this.__idTable[v][0].html;
					}
					else
						this.__eLBL.innerText = this.__idTable[v][0];

				}
				else
					this.__eIN.value = Is.Object(this.__idTable[v][0])?this.__idTable[v][0].text || '':this.__idTable[v][0];
			}
			else{
				if (this._readonly())
					this.__eLBL.innerText = this.__idTable[v];
				else
					this.__eIN.value = this.__idTable[v];

				this._main.removeAttribute('iw-value');
				//this._main.className = this._allcss +' '+ (this._readonly()?' readonly':'') + (this._disabled()?' disabled':'');
			}

			if (bBlock){
				var elms = this.block._main.getElementsByTagName('A') || [];
				for (var i = elms.length-1;i>=0;i--){
					if (elms[i].rel == v){
						addcss(elms[i],'active');
						this.__scrollActive(elms[i]);
					}
					else
						removecss(elms[i],'active');
				}
			}
		}
		else
		if (!this._readonly())
			this.__inputValue(v);

		if (!bNoEvn){
			// onchange event
			if (this._onchange)
				this._onchange(null);
			this.__exeEvent('onchange',null,{"owner":this});

			if (this._onselect)
				this._onselect(null);
			this.__exeEvent('onselect',null,{"owner":this});
		}

		if(this.__restrictions)
			this.__check();

		return bReturn;
	}
	else
		return this._readonly()?this.__value:this.__inputValue();
};

_me._readonly = function(b){
	if (Is.Defined(b)){
		this.__readonly = !!b;
		if (b)
			addcss(this._main,'readonly');
		else
			removecss(this._main,'readonly');
	}
	else
		return this.__readonly;
};

	_me._getTextValue = function() {
		if (this._readonly()){
			if (Is.Defined(this.__value))
				return Is.Object(this.__idTable[this.__value])?this.__idTable[this.__value][0]:this.__idTable[this.__value];
			else
				return '';
		}
		else
			return this.__inputValue();
	};

	_me._getDataValue = function() {
		if (this._readonly()){
			if (Is.Defined(this.__value))
				return Is.Object(this.__idTable[this.__value])?this.__idTable[this.__value][1]:this.__idTable[this.__value];
		}

		return;
	};

	_me.__inputValue = function (v){
		if (Is.Defined(v)){
			this.__eIN.value = v;
			this.__eLBL.innerText = v;
		}
		else
			return this.__eIN.value || '';
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
