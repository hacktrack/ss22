/**
 * This helper guides user through process of recovering gw items from recovery folder. Shows dialogs 
 * for particular steps and calls callback function when all information is gathered.
 * 
 * @param Array   aIds         Standard ids array (0: account id, 1: folder id, 2: array of item ids)
 * @param Boolean bShowConfirm Show initial confirmation dialog
 * @param Array   aResponse    Callback configuration (argument for executeCallbackFunction)
 *								Note: folder mapping argument is added (format: [{source: 'xy', destination: 'xy'}, ...])
 * 
 * @return undefined
 */
function ItemsRecoverHelper(aIds, bShowConfirm, aResponse) {
	var
		aFilteredIds = [
			aIds[0],
			aIds[1],
			this.__dropIdsWithoutOriginalFolder(aIds)
		];

	this.__bShowConfirm = true === bShowConfirm;
	this.__aResponse = aResponse;
	this.__aIds = aFilteredIds;
	this.__aIdsOrig = aIds;
	this.__aFoldersMapping = [];
	this.__aDeletedFolders = this.__getDeletedFolders(aFilteredIds);
}

/**
 * Runs process of recovery
 * 
 * @return undefined
 */
ItemsRecoverHelper.prototype.process = function() {
	var oConfirmDialog;

	if (this.__bShowConfirm){
		oConfirmDialog = gui._create(
			'confirm',
			'frm_confirm',
			'',
			'',
			[this, '__recoveryConfirmed'],
			'POPUP_ITEMS::RECOVER',
			'CONFIRMATION::RECOVER_ITEM'
		);
		oConfirmDialog.x_btn_ok._value('POPUP_ITEMS::RECOVER');
	}
	else{
		this.__recoveryConfirmed();
	}
};

/**
 * Drops ids of items which doesn't have original folder in their data. Such items cannot be recovered
 * 
 * @param Array aIds Standard ids array (0: account id, 1: folder id, 2: array of item ids)
 * 
 * @return Array Filtered array
 */
ItemsRecoverHelper.prototype.__dropIdsWithoutOriginalFolder = function(aIds) {
	var i,
		oItem,
		aIdsWithOriginalFolder = [];

	for (i = 0; i < aIds[2].length; i++) {
		oItem = dataSet.get('items', [aIds[0], aIds[1], aIds[2][i]]);
		if (oItem.ITMORIGINALFOLDER && '' !== oItem.ITMORIGINALFOLDER) {
			aIdsWithOriginalFolder.push(aIds[2][i]);
		}
	}
	
	return aIdsWithOriginalFolder;
};

/**
 * Finishes recovery process by calling callback function in case there is something to recover
 * 
 * @return undefined
 */
ItemsRecoverHelper.prototype.__finishRecovery = function() {
	// Some ids was skipped - notify user
	if (this.__aIds[2].length < this.__aIdsOrig[2].length) {
		gui.notifier._value({type: 'alert', args: {text: 'RECOVERY::SOME_ITEMS_SKIPPED'}});
	}

	if (this.__aIds[2].length > 0) {
		executeCallbackFunction(this.__aResponse, this.__aFoldersMapping, this.__aIds);
	}
};

/**
 * Callback for recovery confirmation dialog (first step of process)
 * 
 * @return undefined
 */
ItemsRecoverHelper.prototype.__recoveryConfirmed = function() {
	// In case some items cannot be recovered because their original folders were deleted, gather mapping to new folders step by step
	if (this.__aDeletedFolders.length > 0) {
		this.__mapDeletedFolder();
	} else {
		this.__finishRecovery();
	}
};

/**
 * Checks if there are still some items that cannot be recovered (original folder was deleted). If so, it shows dialog for 
 * selecting alternate folder.
 * 
 * @return  undefined
 */
ItemsRecoverHelper.prototype.__mapDeletedFolder = function() {
	var oOrigFolder;

	oOrigFolder = this.__findFolderToBeMapped();
	
	if (undefined === oOrigFolder) {
		this.__finishRecovery();
	} else {
		gui._create(
			'confirm',
			'frm_confirm',
			'',
			'',
			[this, '__showSelectFolderDialog',[oOrigFolder]],
			'RECOVERY::CANNOT_BE_RECOVERED_TITLE',
			'RECOVERY::CANNOT_BE_RECOVERED_TEXT',
			[oOrigFolder.name, oOrigFolder.name]
		);
	}
};

/**
 * Shows folder select dialog
 * 
 * @param Object oOrigFolder Original folder info, format: {name: 'xy', type: 'xy'}
 * 
 * @return undefined
 */
ItemsRecoverHelper.prototype.__showSelectFolderDialog = function(oOrigFolder) {
	var sFolderType;

	// For teamchat items, show teamchat rooms selection
	if (-1 !== ['I', 'W'].indexOf(oOrigFolder.type)) {
		sFolderType = ['Y', 'I'];
	} else {
		sFolderType = oOrigFolder.type;
	}
	
	gui._create(
		'frm_select_folder',
		'frm_select_folder',
		'',
		'',
		'POPUP_ITEMS::MOVE_ITEM_TO',
		this.__aIds[0],
		this.__aIds[1],
		[this, '__folderSelected', [oOrigFolder]],
		false,
		false,
		sFolderType
	);
};

/**
 * Callback for folder selection dialog
 * 
 * @param String sAccountId          Account id
 * @param String sSelectedFolderName Name of selected folder
 * @param Object oOrigFolder         Original folder info, format: {name: 'xy', type: 'xy'}
 */
ItemsRecoverHelper.prototype.__folderSelected = function(sAccountId, sSelectedFolderName, oOrigFolder) {
	// User didn't selected any folder
	if ('__@@GWTRASH@@__' ===  sSelectedFolderName) {
		gui._create(
			'confirm',
			'frm_confirm',
			'',
			'',
			[this, '__showSelectFolderDialog',[oOrigFolder]],
			'RECOVERY::FOLDER_NOT_SELECTED_TITLE',
			'RECOVERY::FOLDER_NOT_SELECTED_TEXT'
		);

		return;
	}

	// Add the selected folder to the mapping
	this.__aFoldersMapping.push({
		'source' : oOrigFolder.name,
		'destination' : sSelectedFolderName
	});

	// Re-run mapping for case there is another deleted folder
	this.__mapDeletedFolder();
};

/**
 * Finds first of remaining folders which need to be mapped (were deleted and alternate folders must be selected)
 * 
 * @return undefined
 */
ItemsRecoverHelper.prototype.__findFolderToBeMapped = function() {
	var i;

	for (i = 0; i < this.__aDeletedFolders.length; i++) {
		if (!this.__isFolderMapped(this.__aDeletedFolders[i].name)) {
			return this.__aDeletedFolders[i];
		}
	}
};

/**
 * Checks recovered items and returns their original folders which were deleted
 * 
 * @param Array aIds Standard ids array (0: account id, 1: folder id, 2: array of item ids)
 * 
 * @return Array Original folders which were deleted, format: [{name: 'xy', type: 'xy'}, ...]
 */
ItemsRecoverHelper.prototype.__getDeletedFolders = function(aIds) {
	var i,
		oItem,
		aDeletedFolders = [],
		oFolders = dataSet.get('folders', [aIds[0]]);

	for (i = 0; i < aIds[2].length; i++) {
		oItem = dataSet.get('items', [aIds[0], aIds[1], aIds[2][i]]);
		if (!oFolders.hasOwnProperty(Path.slash(oItem.ITMORIGINALFOLDER))) {
			aDeletedFolders.push({
				'name' : oItem.ITMORIGINALFOLDER,
				'type' : oItem.ITMCLASS
			});
		}
	}
	
	return aDeletedFolders;
};

/**
 * Check if given folder is already mapped (alternate folder was already selected) 
 * 
 * @param String sFolderName Folder name
 * 
 * @return Boolean
 */
ItemsRecoverHelper.prototype.__isFolderMapped = function(sFolderName) {
	var i;

	for (i = 0; i < this.__aFoldersMapping.length; i++) {
		if (this.__aFoldersMapping[i].source === sFolderName) {
			return true;
		}
	}

	return false;
};