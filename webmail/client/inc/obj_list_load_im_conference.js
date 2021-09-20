function obj_list_load_im_conference(){};

obj_list_load_im_conference.prototype.__constructor = function(aData, aTmpData, aConference) {

 	addcss(this._main, 'obj_groupchat_event', 'obj_groupchat_conference');

	aTmpData.addon = true;
	this._draw('obj_list_load_im_message', 'main', aTmpData);
	this._draw('obj_groupchat_conference', 'addon');

	this.btn_accept._onclick = function(){
		storage.library('wm_conference');
		wm_conference.get(aConference).join();
	};

	this.btn_decline._onclick = function(){
		this._disabled(true);
		gui.frm_chat._send(getLang('CHAT::CONFERENCE_DECLINE_MSSG'));
	};

	this.btn_accept._disabled(false);
	this.btn_decline._disabled(false);
};
