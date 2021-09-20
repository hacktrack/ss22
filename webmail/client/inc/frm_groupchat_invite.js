_me = frm_groupchat_invite.prototype;
function frm_groupchat_invite(){};

_me.__constructor = function(aFolder, aResponse, sMail) {
	var me = this;

	this._title('CHAT::INVITE');

	this._size(500,400,true);

	this._create('folder','obj_label','header')._value(dataSet.get('folders', [aFolder.aid, aFolder.fid, 'NAME']) || Path.basename(aFolder.fid));
	this._create('btn_invite','obj_button','footer','noborder color1 add2')._value('CONFERENCE::INVITE');
	this.btn_invite._disabled(true);

	this._create('btn_close','obj_button','footer','noborder cancel')._value('FORM_BUTTONS::CLOSE');

	this._draw('frm_groupchat_invite', 'main', {disable_ab:(GWOthers.getItem('RESTRICTIONS', 'disable_gw_types') || '').indexOf('c')>-1 || gui._REQUEST_VARS['tconly'] || sPrimaryAccountGUEST});

	//Height fix
	msiebox(this._getAnchor('msiebox'));

	this._scrollbar(this._getAnchor('main'));

	this.rcp._onchange = function(){
		this._parent.btn_invite._disabled(this._value().length<1);
	};
	sMail && me.rcp._value(sMail);

	if (this.btn_to)
		this.btn_to._onclick = function(){
			if (!me.address || me.address._destructed)
				me.address = gui._create('add_address', 'frm_addaddress', '', '', [function(bOK, aData){
					if (bOK)
						me.rcp._value(aData.to.join(','));
				}], {to: "DATAGRID_ITEMS_VIEW::TO"}, {to: me.rcp._value()}, 'to', true, false, true);
		};

	this.btn_invite._onclick = function(){

		var aDistribList = MailAddress.findDistribList({'to': this._parent.rcp._value()});

		var aItemInfo = {
				aid:aFolder.aid,
				fid:aFolder.fid,
				xmlarray:{
					TO:[{VALUE:aDistribList.to}],
					COMMENT:[{VALUE:this._parent.note._value()}]
				}
			};

		if (!Is.Empty(aDistribList.distrib)){
			storage.library('wm_messages');
			aItemInfo.xmlarray.DISTRIB = wm_messages.parse_distrib(aDistribList.distrib);
		}

		me.__hide();

		WMFolders.action(aItemInfo,'','','add_member','',[function(bOK){
			if (bOK){
				executeCallbackFunction(aResponse);
				me._destruct();
			}
			//error
			else{
				gui.notifier._value({type: 'alert', args: {header: '', text: 'FORM_FOLDERS::INVITE_ERROR'}});
				me.__show();
			}
		}]);
	};
	this.btn_close._onclick = function(){me._destruct()};
};
