_me = obj_lister_client.prototype;
function obj_lister_client(){};

_me.__bindobj = function(){
	var obj = window;
	try{
		this.__bind && this.__bind.split('.').forEach(function(part) {
			obj = obj[part];
		});
	}
	catch(er){
		obj = null;
	}
	return obj;
};

_me._bind = function(obj){

	//remove old bound object
	if (this.__bind){
		try{
		    this.__bind.__bindlist = null;
		    this.__bind = null;
		}
		catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}
	}

	//bind new object
	if (typeof obj == 'object' && obj._pathName)
		this.__bind = obj._pathName;
	else
	    return false;

	obj._bindlist(this._pathName);

	this.__value = 0;
	this._value(0);

	if (obj._aData){
		this.__range = obj._aData.length;
		if (this.__range) this._range(this.__range);
	}

	obj = null;
};
