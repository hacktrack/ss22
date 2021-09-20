_me = obj_form_restrict.prototype;
function obj_form_restrict(){};

  /**
   * @brief  : activate value restrictions
   * @example:
   *           _restrict('regExp','error string',...)
   *           "error string" is optional parametr
   *
   * @result : ._checkError [...]
   * @date   : 25.4.2006 15:59:31
   **/
_me.__constructor = function(){
	this._checkError = [];
};
_me._restrict = function(){
	if (!arguments.length) {
		this.__restrictions = null;
		return false;
	}

	this.__restrictions = arguments;

	var inp = this._getFocusElement();
	if (inp) {

		AttachEvent(inp, 'oninput', function () {
			this.__check();
		}.bind(this));

		// Check initial value
		this.__check();

		return true;
	}
	else {
		return false;
	}
};

// Allow force check from outside
_me._validate = function() {
	return this.__check();
};

  /**
   * @brief: value check function
   * @date : 15.2.2007 16:09:57
   * @note : if expression starts with "!" than result is inverted
   **/
_me.__check = function(){

	if (!this.__restrictions || !this.__restrictions.length){
		/* Error -> Ok */
		if (this._checkError.length && this._onerror){
			this._checkError = [];
			removecss(this._main,'error');
			this._onerror(false);
		}

		return true;
	}
	var r = this.__restrictions,
		v = this._getFocusElement().value,
		checkError = [],
		x, invert, ok, re;

	for (var i = 0;i<r.length;i+=2)
		if (r[i]){

			ok = false;
			invert = false;

			if(r[i] instanceof RegExp)
				ok = r[i].test(v);
			else if (Is.Object(r[i]))
				ok = executeCallbackFunction(r[i],v)?true:false;
			else{
				//fast clone
				re = r[i];

				if (re.charAt(0)=="!"){
					invert = true;
					re = re.substr(1);
				}

				if (re.charAt(0)==">"){
					var number;

					if (re.charAt(re.length-1) == 'i') {
						if (v.match(/^[0-9]+$/) != null && (number = parseInt(v)) != NaN && number > re.substr(1,re.length-2))
							ok = true;
					}
					else
					if (v.match(/^[0-9.]+$/) != null && (number = parseFloat(v)) != NaN && number > re.substr(1))
						ok = true;
				}
				else
				if (re.charAt(0)=="<"){
					var number;
					if (re.charAt(re.length-1) == 'i') {
						if (v.match(/^[0-9]+i?$/) && (number = parseInt(v)) != NaN && number < re.substr(1,re.length-2))
							ok = true;
					}
					else
					if (v.match(/^[0-9.]+i?$/) && (number = parseFloat(v)) != NaN && number < re.substr(1))
						ok = true;
				}
				else{
					x = new RegExp(re,'gi');
					if (v.match(x)) ok = true;
				}
			}

			if ((ok && invert) || (!ok && !invert))
				checkError.push(r[i+1] || '');
		}

	// OK -> Error
	if (checkError.length){
		addcss(this._main,'error');

		if (this._onerror && !this._checkError.length){
			this._checkError = checkError;
			this._onerror(true);
		}
		else
			this._checkError = checkError;

		return;
	}
	else
	// Error -> Ok
	if (this._checkError && this._checkError.length){
		removecss(this._main,'error');

		this._checkError = [];
		if (this._onerror) this._onerror(false);
	}

	return true;
};
