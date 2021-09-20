_me = obj_input_search.prototype;
function obj_input_search(){};

/**
 * @brief: CONSTRUCTOR,
 * @date : 21.3.2007 13:19:41
 **/
_me.__constructor = function(){
	var me = this;

	this.__setMask({'clear':['&#xe036;',getLang('COMMON::CLEAR')]},
		[function(id){
			if (id == 'clear'){
		        if (me._onsubmit){
		        	me._value('');
		        	me._onsubmit();
		        }
		        else
		        if (me._onkeyup)
		        	me._onkeyup({keyCode:27});

		        me._focus();
			}
		}]);

	this._main.appendChild(mkElement('a',{className:'input_ico',onclick:function(e){
		if (!me._onsubmit || !me._onsubmit())
			me._focus();
	}}));

	this._obeyEvent('change',[this,'__hasValue']);
	this._obeyEvent('onkeyup',[this,'__hasValue']);
};

_me.__hasValue = function(){
	if (this._value())
		addcss(this._main,'value');
	else
		removecss(this._main,'value');
};