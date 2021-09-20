_me = obj_groupchat_invite.prototype;

function obj_groupchat_invite() {};

_me.__constructor = function (aData) {

	this._cangroup = false;

	if (aData.EVNLINKTYPE != '7' && aData.EVNLINKTYPE != '8') {
		var aTmp = {
			title: getLang(aData.EVNLINKTYPE == '5' ? 'CHAT::INVITED_USER' : 'CHAT::INVIT_VERIFIED')
		};

		if (aData.AccountName && aData.AccountEmail) {
			aTmp.user_name = aData.AccountName;
			aTmp.user_email = aData.AccountEmail;
			aTmp.full_email = MailAddress.createEmail(aData.AccountName, aData.AccountEmail, true);
		}

		this._draw('obj_groupchat_invite', 'addon', aTmp);
	}

};


_me.__update = function () {

	var aItemsInfo = {
		aid: this.__aData.aid,
		fid: this.__aData.fid,
		iid: this.__aData.iid,
		values: ['EVNNOTE', 'EVN_CREATED', 'EVN_MODIFIED', 'EVNLINKEXTRAS']
	};

	WMItems.list(aItemsInfo, '', '', '', [function (aData) {

		if (aData && (aData = aData[this.__aData.aid]) && (aData = aData[this.__aData.fid]) && (aData = aData[this.__aData.iid])) {

			//Body
			if (this.__aData.EVNNOTE != aData.EVNNOTE)
				this._init_body(aData);

			//Reactions
			this._init_reactions(aData);
		}

	}.bind(this)]);

};
