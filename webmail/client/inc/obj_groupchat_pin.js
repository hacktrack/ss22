_me = obj_groupchat_pin.prototype;
function obj_groupchat_pin(){};

_me.__constructor = function(aData) {

	if (aData.EVNLINKEXTRAS){
		var	ext = parseURL(aData.EVNLINKEXTRAS);

		if (aData.EVNCLASS == 'B'){

			var aItmData = clone(aData, true);

			for(var k in ext)
				if (ext.hasOwnProperty(k))
					aItmData[k.toUpperCase()] = ext[k];

			aItmData.iid = WMItems.__clientID(aData.EVNLINKID);
			delete aItmData.EVNLINKEXTRAS;

			this._create('item', 'obj_groupchat_message', 'addon','', aItmData);
		}
		else
		{

			var	aItmData = {
					aid: aData.aid,
					fid: aData.fid,
					iid: WMItems.__clientID(aData.EVNLINKID)
				};

			for(var k in ext)
				if (ext.hasOwnProperty(k))
					aItmData[k.toUpperCase()] = ext[k];

			//remove original commented item
			delete aItmData.EVNCOMLINKEXTRAS;

			switch(aItmData.EVNCLASS){
			case 'Y':
				this._create('item', 'obj_groupchat_mail', 'addon','', aItmData);
				break;

			case 'Z':
			case 'R':
				this._create('item', 'obj_groupchat_file', 'addon','', aItmData);
				break;

			case 'Q':
				this._create('item', 'obj_groupchat_event', 'addon','', aItmData);
				break;

			case 'S':
				this._create('item', 'obj_groupchat_conference', 'addon','', aItmData);
				break;

			case 'W':
				this._create('item', 'obj_groupchat_invite', 'addon','', aItmData);
				break;
			}
		}
	}

};

//traverse functions
_me._init_reactions = function(){
	this.item._init_reactions.apply(this.item, arguments);
};

_me.__update = function(){
	this.item.__update.apply(this.item, arguments);
};
