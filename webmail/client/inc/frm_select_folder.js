_me = frm_select_folder.prototype;
function frm_select_folder(){};

/**
 * @brief   Universal form for selecting folder.
 * This form is used e.g. for moving folder (in inc/obj_context_folder.js) or for
 * moving or copying items (in inc/obj_context_item.js).
 * Form contains only one 'obj_tree_folder' for selection.
 *
 * @param[in]  sMainLabel  [string] Label of the popup window.
 * @param[in]  sLabel      [string] TODO
 * @param[in]  sAccountID  [string] Optional, used together with 'sFolderID' for
 * preselecting folder in the tree.
 * @param[in]  sFolderID   [string] Optional, when 'sAccountID' isn't specified, this
 * argument is ignored.
 * @param[in]  aResponse   [array]  Optional callback function, has form [object, method, [arg3, arg4, ...]].
 *	Arg1 and arg2 are taken from selected folder and have IDs of selected account and selected folder:
 *		- arg1 = selected account, e.g. 'admin@merakdemo.com
 *		- arg2 = selected folder, e.g. 'INBOX'
 *
 *	Example:
 *		- [this, '__moveFolder']   Call __moveFolder(sSelectedAccount, sSelectedFolder)
 *		- [this, '__copyOrMoveItem', ['copy', arg['aid']]     Call  __copyOrMoveItem(sSelectedAccount, sSelectedFolder, 'copy', arg['aid'])
 *
 * @param[in]  bDisableAccounts  [boolean]   When true, selection of the account will disable 'OK' button.
 *    Used in moving items, where moving item directly under account is disabled, item must
 *    always be in some folder.
 * @param[in]  bOneAccount       [boolean]   When true, only selected account will be listed
 * @param[in]  sFilterType      [string]   When specified, only folders of that type will be listed. (Types can be 'M', 'C', 'J, ...)
 *
 * @see  objects/frm_select_folder.xml
 * @see  inc/frm_select_folder.js
 */
_me.__constructor = function(sMainLabel, sAccountID, sFolderID, aResponse, bDisableAccounts, bOneAccount, sFilterType, sFilterRights, bDisableNewButton, sFilterRightsOr, bFilterPublic, bForceShowFolderIcons){

	this._modal(true);

	var me = this,
		sFullFolderPath = '',
		aFilterType = Array.isArray(sFilterType) ? sFilterType : (sFilterType || '').split(',').filter(Boolean),
		bAlfresco = ~aFilterType.indexOf('K');

	if (sMainLabel)
		this._title(sMainLabel);

	if (bDisableNewButton || bAlfresco)
		this._size(300,500,true);
	else
		this._size(350,500,true);

	// Create formular from template
	if (bAlfresco){
		this._create('tree_folder','obj_tree_folder','main','alfresco_folder noroot', '@@alfresco@@');
		this.tree_folder._listen_data('alfresco');
		this.tree_folder._onclick = function(e, elm, id){

			var aPath = Path.split(id, true);

			Alfresco.getFolderInfo(aPath.fid, [function(bOK, aFolder){
				if (bOK)
					Alfresco.setLastFolder(aFolder.fid);
			}]);
		};
	}
	else{
		this._create('tree_folder','obj_tree_folder2', void 0, bForceShowFolderIcons ? 'icons' : '', sAccountID && bOneAccount ? sAccountID : void 0);
	}

	if (sAccountID)
	{
		if (sAccountID == sPrimaryAccount &&  sFolderID == '__@@VIRTUAL@@__/__@@EVENTS@@__')
			sFolderID = Mapping.getDefaultFolderForGWType('E');

		// TODO function _setActive also opens folder, it's strange
		// var aPreselectFolder = [sAccountID];
		// var sPartialPath = sAccountID;
		// var aSplitFolder = sFolderID.split('/');
		// for (var dir in aSplitFolder) {
		// 	sPartialPath += '/'+aSplitFolder[dir];
		// 	aPreselectFolder.push(sPartialPath);
		// }
		// this.tree_folder._value(aPreselectFolder);

		// Set type of the items to be filetered
		if (bOneAccount)
			this.tree_folder.sFilterAccountId = sAccountID;
	}

	if (bFilterPublic)
		this.tree_folder._filter_public(true);

	if (sFilterRights)
		this.tree_folder._filter_rights(sFilterRights);

	if (sFilterRightsOr)
		this.tree_folder._filter_rights_or(sFilterRightsOr);

	if (sFolderID)
		sFullFolderPath = sAccountID + '/' + sFolderID;
	else
	if (bAlfresco)
		sFullFolderPath = Alfresco.getLastFolder(true);
	else {
		sFullFolderPath = aFilterType.map(function(ft) {
			return Cookie.get(['last_used_folder', ft]);
		}).filter(function(fp) {
			return !!fp;
		}) || sAccountID;
	}

	if (bAlfresco){
		Alfresco.getFolderInfo();

		if (sFullFolderPath){
			var aPath = Path.split(sFullFolderPath,true);
			if (aPath.fid){
				Alfresco.getFolderInfo(aPath.fid, [function(bOK, aFolder){
					if (bOK && aFolder.fid.length){
						this.tree_folder._setActive(Path.build(aFolder));
					}
				}.bind(this)]);
			}
		}
	}
	else{
		if (aFilterType.length)
			this.tree_folder._filter_folder(aFilterType);

		this.tree_folder._setActive(sFullFolderPath);
		this.tree_folder._listen_cookie('select_folder_tree');
	}

	// Redraw the folder tree
	if ((sAccountID && bOneAccount) || aFilterType.length){
		this.tree_folder._fill();
	}

	if (sFullFolderPath){
		this.tree_folder._open(sFullFolderPath, 'minus');
	}
	else{
		var ds = dataSet.get('folders');
		for(var sFullFolderPath in ds)
			this.tree_folder._open(sFullFolderPath,'minus');
	}

	if (bDisableAccounts)
	{
		// Set initial state of 'OK' button. When some folder is selected permit 'OK button, disable otherwise.
		if (this.tree_folder._getActive()[1])
			this.x_btn_ok._disabled(false);
		else
			this.x_btn_ok._disabled(true);

		// Set callback function. When folder is selected permit 'OK' button, disable otherwise.
		this.tree_folder._obeyEvent('activate',[function(e){
			var path = me.tree_folder._getActive(true);
			if (path.fid.length)
				me.x_btn_ok._disabled(false);
			else
				me.x_btn_ok._disabled(true);
		}]);
	}

	// This function is triggered when 'OK' button is pressed.
	this.x_btn_ok._onclick = function()
	{
		// When user has specified callback function call it with two first arguments
		// sSelectedAccount, sSelectedFolder and the rest of user provided parameters.
		// E.g. [this, '__copyOrMoveItem', ['copy', arg['aid']]     Call  __copyOrMoveItem(sSelectedAccount, sSelectedFolder, 'copy', arg['aid'])
		var aSelected = me.tree_folder._getActive();
		if(aFilterType.length) {
			var folderType = WMFolders.getType({ aid: aSelected[0], fid: aSelected[1] });
			Cookie.set(['last_used_folder', folderType], aSelected[0] + '/' + aSelected[1]);
		} else {
			Cookie.set(['last_used_folder', ''], aSelected[0] + '/' + aSelected[1]);
		}
		executeCallbackFunction(aResponse, aSelected[0], aSelected[1]);
		me._destruct();
	};

	if (!bDisableNewButton && !bAlfresco) {
		this._create('x_btn_new_folder', 'obj_button', 'footer','simple noborder x_btn_right');
		this.x_btn_new_folder._value('FORM_BUTTONS::NEW_FOLDER');
		this.x_btn_new_folder._onclick = function() {
			var aSelected = me.tree_folder._getActive();
			gui._create('frm_add_folder','frm_add_folder','','',aSelected[0] || sPrimaryAccount,aSelected[1],void 0,bOneAccount);
		};
	}

	this.tree_folder.inp_search._placeholder(getLang('POPUP_FOLDERS::FILTER_FOLDERS'));
	this.tree_folder.inp_search._focus(true);
};
