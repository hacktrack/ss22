_me = frm_select_account.prototype;
function frm_select_account(){};

_me.__constructor = function(aResponse){

	this._modal(true);

	var me = this;

	this._title('SETTINGS::ACCOUNTS');
	this._size(300,500,true);

	this._create('tree_folder','obj_tree','main', 'folder_icons');

	var aFolders = dataSet.get('folders',[sPrimaryAccount]),
		aData = {};

	for(var fid in aFolders){
		if (aFolders[fid].SUBSCRIPTION_TYPE == 'account' && fid.indexOf(sPrimaryAccountSPREFIX) === 0 && !aFolders[fid].PUBLIC && (aFolders[fid].TYPE == 'VA' || aFolders[fid].TYPE == 'X') && aFolders[fid+'/INBOX']){

			var sMail = fid.substr(sPrimaryAccountSPREFIX.length);

			aData[sMail] = {
				arg:{
					aid: sPrimaryAccount,
					fid: fid
				},
				text: aFolders[fid].NAME || sMail,
				//ico: aFolders[fid].PUBLIC?'ico_shared':'ico_inbox'
				ico: 'ico_inbox'
			};
		}
	}

	// Redraw the folder tree
	this.tree_folder._fill(aData);

	this.tree_folder._onactivate = function(){
		me.x_btn_ok._disabled(false);
	};

	// This function is triggered when 'OK' button is pressed.
	this.x_btn_ok._disabled(true);
	this.x_btn_ok._onclick = function()
	{
		var aSelected = me.tree_folder._getActive();
		executeCallbackFunction(aResponse, aSelected[0]);
		me._destruct();
	};
};