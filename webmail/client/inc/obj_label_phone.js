_me = obj_label_phone.prototype;
function obj_label_phone(){};

_me.__constructor = function(){
	this.__showSMS = false;
};

_me._onclick = function(e){
	var v = this._value(),
		aMenu = [];

		

	if (v && (!this.__cmenu || this.__cmenu._destructed)){
		// SMS
		if (this.__showSMS && sPrimaryAccountSMS && (GWOthers.getItem('RESTRICTIONS', 'disable_sms') || 0)<1){
			aMenu.push({title:'MAIN_MENU::SMS', 'arg':[function(){
				NewMessage.compose({sms:v});
			}]});
		}

		// DIAL
		if (sPrimaryAccountSIP && (GWOthers.getItem('RESTRICTIONS', 'disable_sip') || 0)<1){
			aMenu.push({title:'MAIN_MENU::DIAL', 'arg':[function(){
				gui.frm_main._call(v);
			}]});
		}

		if (aMenu.length){
			// e.__source = {obj:this, skip:true, type:this._type, path:this._pathName};

			var pos = getSize(this._main);

			this.__cmenu = gui._create('cmenu','obj_context'),
			this.__cmenu._fill(aMenu);
			this.__cmenu._place(pos.x+pos.w/2,pos.y,'',3);

			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		}
	}
};

_me._sms = function(b){
	this.__showSMS = b?true:false;
};