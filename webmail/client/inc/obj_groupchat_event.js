_me = obj_groupchat_event.prototype;
function obj_groupchat_event(){};

_me.__constructor = function() {
	this.__fill(this.__aData);
};

_me.__fill = function(aData){

	if (this.btn_accept)
		this._clean(this.btn_accept._anchor);

	var aTmp = {},
		linkextras = {};

	if (aData.EVNLINKEXTRAS){

		linkextras = parseURL(aData.EVNLINKEXTRAS);
		if (linkextras){

			if (linkextras.EvnLinkInvalid == '1'){
				this._parent._remove(this._anchor, this.__aData.iid);
				return;
			}

			aTmp.title = linkextras.EvnTitle || '';
			aTmp.location = linkextras.EvnLocation;
			aTmp.conference = parseURL(linkextras.meeting_info || '').id;

			var a = new IcewarpDate(linkextras.EvnStartDate, {format:IcewarpDate.JULIAN});
			if (linkextras.EvnStartTime>=0){
				a.setTime(linkextras.EvnStartTime, true);
				aTmp.date = a.format('dddd, L LT');
			}
			else{
				aTmp.date = a.format('dddd, L');
			}
		}
	}

	this._draw('obj_groupchat_event', 'addon', aTmp);

	if (linkextras.EvnMyStatus == 'A'){
		this.btn_accept._value('ATTENDEES::STATUS_A');
		removecss(this.btn_accept._main, 'select');
	}
	else
	if (linkextras.EvnMyStatus == 'D'){
		this.btn_accept._value('ATTENDEES::STATUS_D');
		removecss(this.btn_accept._main, 'select');
	}
	else{
		var me = this;

		this.btn_accept._disabled(sPrimaryAccountGUEST === 1);
		this.btn_accept._onclick = function(e){
			if (!this.cmenu || this.cmenu._destructed){
				e.cancelBubble=true;
				if (e.stopPropagation)
					e.stopPropagation();
				if (e.preventDefault)
					e.preventDefault();

				var pos = getSize(this._main);

				this.cmenu = gui._create('cmenu','obj_context');
				this.cmenu._fill([
					{title:'FORM_BUTTONS::ACCEPT', arg:[me,'_action',['accept']]},
					{title:'FORM_BUTTONS::DECLINE', arg:[me,'_action',['decline']]}
				]);

				this.cmenu._place(pos.x+pos.w/2, pos.y+pos.h, '', 2);
				return false;
			}
		};
	}

	if(aTmp.conference) {
		this.btn_join._onclick = function() {
			storage.library('wm_conference');
			wm_conference.get(aTmp.conference).join();
		}
	}

	if (parseInt(linkextras.EvnAcceptedParticipantCount)>0){
		this.attendees._value(getLang('IM::PARTICIPANTS',[linkextras.EvnAcceptedParticipantCount]));
		this.attendees._disabled(false);
	}

	this.btn_info._onclick = function(){
		Item.openwindow([this.__aData.aid, this.__aData.fid, WMItems.__clientID(this.__aData.EVNLINKID)], '', '', 'E', [this, '__update']);
	}.bind(this);

	this._getAnchor('preview').onclick = function(e){
		e.cancelBubble=true;
		if (e.stopPropagation)
			e.stopPropagation();

		this.btn_info._onclick();

		return false;
	}.bind(this);
};

_me._action = function(name){

	this.btn_accept && this.btn_accept._disabled(true);

	var aItem = {aid:this.__aData.aid, fid:this.__aData.fid, iid:WMItems.__clientID(this.__aData.EVNLINKID)};

	switch(name){
		case 'decline':

			var frm = gui._create('decline','frm_text','','frm_ok_cancel', [
					function(s){
						aItem.reason = s;
						WMItems.imip(aItem, name, []);
					}.bind(this)],
					'EVENT::REASON');

				frm._onclose = function(){
					if (this.btn_accept)
						this.btn_accept._disabled(false);
				}.bind(this);

				frm.x_btn_ok._value('FORM_BUTTONS::DECLINE');
		break;

		case 'accept':
			WMItems.imip(aItem, name, []);
	}
};


_me.__update = function (bOK) {

	if (bOK == true && !this._destructed){
		WMItems.list({aid:this.__aData.aid, fid:this.__aData.fid, iid:this.__aData.iid},'','','',[function(aData){

			// refresh
			if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])){
				this.__fill(aData);

				//Reactions
				if (aData.EVN_METADATA){
					var meta = parseURL(aData.EVN_METADATA);
					aData.META_REACTIONS = meta.core_reactions_data?parseURL(meta.core_reactions_data):{};
				}
				else
				if (aData.EVNLINKEXTRAS){
					var linkextras = parseURL(aData.EVNLINKEXTRAS);
					if (linkextras.Evn_MetaData){
						this.__aData.REAVALUE = linkextras.ReaValue || '';
						var meta = parseURL(linkextras.Evn_MetaData);
						aData.REACTIONS = meta.core_reactions_data?parseURL(meta.core_reactions_data):{};
					}
				}

				this._init_reactions(aData);
			}
			// delete
			else
				this._parent._remove(this._anchor, this.__aData.iid);

		}.bind(this)]);
	}
};
