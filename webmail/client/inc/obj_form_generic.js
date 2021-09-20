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

	_me.__constructor = function(){
		this._telemetry = 'id'; //telemetry log
	};

	/**
	 * @brief: control html method "disabled" for current htmlform object
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
		else{
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

		if (elm.offsetParent && elm.offsetParent.tagName != 'BODY' && getComputedStyle(elm).visibility != 'hidden' && !elm.readonly && !elm.disabled){
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
			catch(r){gui._REQUEST_VARS.debug && console.log(this._name||false,r);}

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