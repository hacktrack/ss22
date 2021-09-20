_me = obj_print.prototype;
function obj_print(){};

/**
 * @brief:
 * @date : 21.7.2014
 **/
_me.__constructor = function(s){
	var me = this;

	this._create('frame','obj_frame');

	this.frame._onresize = function(b){
		if (b){
			me.frame._resize = false;
			setTimeout(function(){ if (me.frame) me.frame._print();	},500);
		}
	};
};

_me._print = function(s, bText){
	if (Is.String(s)){
		this.frame._resize = true;
		this.frame._write(bText?s.escapeHTML().wrap():s);
	}
};