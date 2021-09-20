(function(){
	var ACCOUNT = '@@alfresco@@',
		DS = 'alfresco';

	function enabled() {
		return !!dataSet.get('accounts', [sPrimaryAccount, 'ALFRESCO']);
	}

	function getLastFolder(bFullPath) {
		var path = Cookie.get(['last_used_folder', 'K']) || ACCOUNT;
		if (bFullPath)
			return path;
		else
			return Path.split(path, true).fid;
	}

	function setLastFolder(folder) {
		return Cookie.set(['last_used_folder', 'K'], ACCOUNT + '/' + folder);
	}

	function getFolderInfo(folderId, aHandler) {
		if ((folderId && !dataSet.get(DS, [ACCOUNT, folderId, 'LOADED'])) || (!folderId && !dataSet.get(DS, [ACCOUNT]))){
			return WMFolders.list({
				aid: ACCOUNT,
				fid: folderId
			},'','', [parseFolder,[{aid:ACCOUNT, fid:folderId || ''}, aHandler]], [parseError,[folderId]]);
		}
		else
		if (aHandler)
			executeCallbackFunction(aHandler, true, {aid:ACCOUNT, fid:folderId || ''});
	};

	function parseFolder(aData, aFolder, aHandler){
		if (aData){

			//fillup path
			if (aFolder && ~aFolder.fid.indexOf('/')){
				var tmp, aPath = aFolder.fid.split('/');

				for(;aPath.length>1;){
					aPath.pop();
					tmp = aPath.join('/');
					if (!dataSet.get(DS,[ACCOUNT, tmp])){
						dataSet.add(DS,[ACCOUNT,tmp],{
							TYPE: 'F',
							RIGHTS: 'rwtl',
							LOADED: false
						}, true);
					}
				}
			}

			aData = aData[ACCOUNT];

			for(var fid in aData){
				dataSet.add(DS,[ACCOUNT,fid],{
					TYPE: aData[fid].TYPE,
					RIGHTS: aData[fid].RIGHTS,
					LOADED: fid == aFolder.fid
				}, true);

				if (aData[fid].SUBFOLDERS && aData[fid].SUBFOLDERS.FOLDERS){
					var aSubFolders = aData[fid].SUBFOLDERS.FOLDERS;
					for (var sfid in aSubFolders){
						if (!dataSet.get(DS, [ACCOUNT, fid + '/' + sfid])){
							dataSet.add(DS, [ACCOUNT, fid + '/' + sfid], {
								TYPE: aData[fid].TYPE,
								RIGHTS: aData[fid].RIGHTS,
								LOADED: false
							}, true);
						}
					}
				}

				dataSet.update(DS,[ACCOUNT,fid]);
			}

			if (aHandler)
				executeCallbackFunction(aHandler, true, aFolder || {aid:ACCOUNT});
		}
		else
		if (sFolder){
			//folder doesnt exist, resync

			if (aHandler)
				executeCallbackFunction(aHandler, false);
		}
	};

	function parseError(aData, id, sError, folderId){

		console.log('Alfresco', id, sError);

		//cleanup DS when folder doesn't exist
		if (folderId && id == '404'){

			var ds = dataSet.get(DS, [ACCOUNT]),
				bUpd = false;
			for (var fid in ds)	{
				if (fid == folderId || fid.indexOf(folderId+'/') === 0){
					delete ds[fid];
					bUpd = true;
				}
			}

			if (bUpd)
				dataSet.update(DS, [ACCOUNT]);
		}

		if (gui.notifier)
			gui.notifier._value({type: 'alert', args: {header: 'ALERTS::ALERT', text_plain: sError.escapeHTML()}});
	};

	window.Alfresco = {
		getLastFolder: getLastFolder,
		setLastFolder: setLastFolder,
		getFolderInfo: getFolderInfo,
		enabled: enabled
	};

})();