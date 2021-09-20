_me = obj_input_search_auto.prototype;
function obj_input_search_auto(){};

/**
 * @brief: CONSTRUCTOR,
 * @date : 21.3.2007 13:19:41
 **/
_me.__constructor = function(){
	this.__timeout; //global variable for timeout session
    this._obeyEvent('onkeyup',[this,'__starttimer']);
    
	var me = this;
	this.__setMask({'clear':['&#xe036;',getLang('COMMON::CLEAR')]},
		[function(id){
			if (id == 'clear' && me._value()){
				me._value('');
                if (me._onsubmit)
                	me._onsubmit();
			}
		}]);

	this._onsubmit = function(){
		if (this.__timeout) clearTimeout(this.__timeout);
		this._search();
	};
};

_me.__starttimer = function(){
	if (this.__timeout) clearTimeout(this.__timeout);
	this.__timeout = setTimeout("try{"+this._pathName+"._search();}catch(er){gui._REQUEST_VARS.debug && console.log(this._name||false,er);}",1000);
};

_me._search = function(){
	if (this._onsearch) this._onsearch(this._value());
	this.__exeEvent('onsearch',null,{"owner":this,"value":this._value()});
};