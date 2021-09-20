/*****************************************************
 * TextArea form object
 *
 * @2Do: swiss inherite __update from generic!
 *****************************************************/

_me = obj_label.prototype;
function obj_label(){};

/**
 * @brief: CONSTRUCTOR, create label HTML element to __eIN variable
 * @date : 20.4.2006 17:24:21
 **/
_me.__constructor = function(bLink){
	this._escape = false; //Encode HTML special chars

	/* creates ELM directly, because simlicity of object */
	if (bLink)
		this.__eIN = mkElement('a',{name:this._pathName+'#main',id:this._pathName+'#main',href:''});
	else
		this.__eIN = mkElement('label',{name:this._pathName+'#main',id:this._pathName+'#main'});

	this._main.appendChild(this.__eIN);
	this.__eIN.className = this._type;

	var me = this;
	this._main.onclick = function(e){
		e = e || window.event;
		if (!me._disabled || !me._disabled()){
			if (me._onclick) return me._onclick(e);
			me.__exeEvent('onclick',e,{"owner":me});
		}
	};
};

/**
 * @brief: get label content
 *         set label content
 * @param: v - html content of label element
 * @date : 20.4.2006 18:02:11
 **/
_me._value = function(v){
	if (typeof v != 'undefined') {

		if (this._escape)
			this.__eIN.innerHTML = v.toString().escapeHTML();
		else
			this.__eIN.innerHTML = v;

		//onchange
		if (this._onchange) this._onchange();
		this.__exeEvent('onchange',null,{"owner":this});
	}
	else
		return this.__eIN.innerHTML;
};

_me._title = function(v){
	if (Is.Defined(v))
		this.__eIN.title = v;
	else
		return this.__eIN.title;
};

/**
 * @brief: Updata method, keeps content synchronized
 * @param: sDataSet - name of data set which is calling this method
 **/
_me.__update = function (sDataSet){
	if (!this._listener)
		this._listener = sDataSet;
	else
	if(sDataSet && this._listener != sDataSet) return;

	this._value(dataSet.get(this._listener,this._listenerPath));
};

/**
* @brief: binds label to checkbox or radio button
* @param: sElmName - name of binded form element
**/
_me._bind = function(sElmName){
	this.__eIN.setAttribute("for",sElmName);
};