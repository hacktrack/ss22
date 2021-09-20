/**
 * Call notificiation bar for frm_chat



 **/
_me = obj_chat_voip.prototype;
function obj_chat_voip(){};

_me.__constructor = function(){
	addcss(this._main.parentNode, 'sip');
	this._add_destructor('__destructor');

	var me = this;

	this.btn._onclick = function(){
		switch(dataSet.get('sip',['activity'])){
			case 'Ringing':
				// Ask SIP to decline incoming call
				me.__getSIP()._declineCall();
				return;

			case 'Calling':
			case 'Phoning':
				// Ask SIP to cancel ongoing call
				me.__getSIP()._hangup();
				return;

		}
	};

	this.mute._onclick = function(){
		if (dataSet.get('sip',['activity'])=="Phoning")
			me.__getSIP()._mute(!me.__getSIP()._mute());
	};

	this._getAnchor('info').onclick = function(e){
		switch(dataSet.get('sip',['activity'])){
			case 'Ringing':
				me.__getSIP()._answerCall();
				break;
		}
	};

	this._listen('sip');
};

_me.__update = function(){
	if (gui.frm_main.sip){
		var ds = dataSet.get('sip');
		if (ds && ds.state == 'online'){
			
			if (ds.muted)
				addcss(this.mute._main,'active');
			else
				removecss(this.mute._main,'active');

			switch (ds.activity){
				case 'Calling':
					this._info(getLang('IM::SIP_CALLING'));
					this.btn._value('DIAL::HANG_UP');
					this.mute._disabled(true);
					return;

				case 'Phoning':
					this._info(getLang('IM::SIP_INPROGRESS'));
					this.btn._value('DIAL::HANG_UP');
					this.mute._disabled(false);
					return;

				case 'Ringing':
					this._info(getLang('IM::SIP_INCOMMING'));
					this.btn._value('DIAL::DECLINE');
					this.mute._disabled(true);
					return;
			}
		}	

		this._destruct();
	}
};

_me._info = function(s){
	this._getAnchor('info').innerHTML = s?s.escapeHTML():'';
};

_me.__destructor = function (){
	if (this._main.parentNode)
		removecss(this._main.parentNode, 'sip');
};

_me.__getSIP = function(){
	return gui.frm_main.sip;
};
