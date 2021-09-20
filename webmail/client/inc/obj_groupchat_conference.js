_me = obj_groupchat_conference.prototype;
function obj_groupchat_conference(){};

_me.__constructor = function() {

	var linkextras = {};

	if (this.__aData.EVNLINKEXTRAS)
		linkextras = parseURL(this.__aData.EVNLINKEXTRAS);

	this._draw('obj_groupchat_conference', 'addon');

	if (linkextras.started == '1' && linkextras.id){
		this.btn_accept._onclick = function(){
			storage.library('wm_conference');
			wm_conference.get(linkextras.id).join();
		};

		this.btn_decline._onclick = function(){
			gui.frm_main.main._message(getLang('CHAT::CONFERENCE_DECLINE_MSSG'));
		};

		this.btn_accept._disabled(false);
		this.btn_decline._disabled(false);
	}
};

_me.__stop = function(){
	this.btn_accept._disabled(true);
	this.btn_decline._disabled(true);
};

_me.__update = function(){

	var aItemsInfo = {aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid, values:['EVN_CREATED', 'EVN_MODIFIED']};

	WMItems.list(aItemsInfo,'','','',[function(aData){

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])){

			//Body
			// if (this.__aData.EVNNOTE != aData.EVNNOTE)
			// 	this._init_body(aData);

			//Reactions
			this._init_reactions(aData);
		}

	}.bind(this)]);

};
