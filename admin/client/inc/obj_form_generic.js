/*****************************************************
 * Extension script: Generic object extension for FORM objects
 * Supported objects: obj_input
 *                    obj_text
 *                    obj_button
 *                    obj_checkbox
 *                    onj_select
 *****************************************************/
_me = obj_form_generic.prototype;
function obj_form_generic(){};

	_me._class = function(sClass){
		if(this._elmbox){
			addcss(this._elmbox,sClass);
		}
	}


	/**
	 * @brief: setting or getting the primitive value
	 * @param: v - sets value property for
	 * @date : 16.4.2006 16:30:26
	 **/
	_me._value = function(v){
		if (typeof v != 'undefined'){
			this.__eIN.value = v;
			if(this.__restrictions && this.__restrictions.length) this.__check();
		}
		else												//FFox 3.5 replace \r\n -> \n\n ?
			return this.__eIN.value.replace(/(\r\n)/gm,"\n").replace(/\n/gm,"\r\n");
	};

	// Setting API porperty Value object
	_me._setValue = function(apiprop) {
		var me = this;

		// Setting the value in the form
		if(apiprop.value==undefined && apiprop.default) {
			this._value(apiprop.default);
		} else {
			this._value(apiprop.value);
		}

		// Disable input for readonly values
		if(apiprop.readonly) {
			this._readonly(true);
		}

		// Hide field with access denied
		if(apiprop.denied) {
			// Hide the input
			this._main.setAttribute('is-hidden','1');
			var input = this._main.id.match(/\.input([a-z_]+)$/);
			if(input) {
				input = 'fi' + input[1];
				// Hide also the label if locatable
				var label = this._main.parentNode.parentNode;
				if(label.id.indexOf(input)==label.id.length-input.length) {
					label = label.getElementsByTagName('label');
					if(label.length) {
						label[0].style.display = 'none';
					}
				}
			}
		}

		// Monitor user changes and update the api property (only assign listener on first call)
		if(this.__apivalue==undefined) {
			this.__eIN.addEventListener('change',function(){
				me.__apivalue.value = this.value;
			},false);
		}

		this.__apivalue = apiprop;
	}

	_me._getValue = function() {
		return this.__apivalue;
	}

	_me._readonly = function() {
		this.__readonly = true;
		this._disabled(true);
	}

	/**
	 * @brief: control html property "disabled" for current htmlform object
	 * @param: b - boolean parametr
	 * @date: 16.4.2006 16:30:26
	 **/
	_me._disabled = function(b){
		if (typeof b == 'undefined')
			return this.__eIN.disabled;
		else
		if (b){
			this.__eIN.disabled = true;
			addcss(this._main,'disabled');
		}
		else
		if(!this.__readonly) {
			this.__eIN.disabled = false;
			removecss(this._main,'disabled');
		}
	};

	_me._getFocusElement = function (){
		return this.__eIN;
	};
	_me._focus = function(){
		
		if (navigator.os && navigator.os.name == "iOS")
			return true;

		var elm = this._getFocusElement();

		if (elm.offsetParent && elm.offsetParent.tagName != 'BODY'){
			elm.focus();
			return true;
		}

		return false;

/*		
		var pos = getSize(this.__eIN),
			h = window.innerHeight || window.document.body.clientHeight;

		if (pos.y+20<h)
			try{
				this.__eIN.focus();
				return true;
			}
			catch(r){}

	    return false;
*/
	};

	/**
	 * @brief: Updata method, keeps data synchronized
	 * @param: sDataSet - name of data set which is calling this method
	 * @date : 16.4.2006 16:30:26
	 **/
	_me.__update = function (sDataSet){
		if (!this._listener)
			this._listener = sDataSet;
		else
			if(sDataSet && this._listener != sDataSet) return;

		this._value(dataSet.get(this._listener,this._listenerPath));
	};
	
	_me._triggerLocalObey=function(method,args){
		if(this.__obeyLocalList && this.__obeyLocalList[method]){
			for(var key in this.__obeyLocalList[method]){
				this.__obeyLocalList[method][key].apply(this,args);
			}
		}
	}
	
	_me._obeyLocal=function(method,callback,id){
		if(!id){
			id=helper.uniqid();
		}
		this.__obeyLocalList=this.__obeyLocalList||{};
		this.__obeyLocalList[method]=this.__obeyLocalList[method]||{};
		this.__obeyLocalList[method][id]=callback;
	}
	
	_me._disobeyLocal=function(method,id){
		if(!id){
			id=helper.uniqid();
		}
		this.__obeyLocalList=this.__obeyLocalList||{};
		this.__obeyLocalList[method]=this.__obeyLocalList[method]||{};
		if(this.__obeyLocalList[method][id]){
			delete this.__obeyLocalList[method][id];
		}
	}