_me = obj_list_load_notify.prototype;
function obj_list_load_notify(){};

//// Notifications ////
_me.__constructor = function() {
	if (this.__options)
		this.__options.notify = [];
	else
		this.__options = {notify:[]};

	// PUSH Notifications
	if (gui.socket){
		this._add_destructor('__notify_off');
		this._notification(true);
	}
};

_me._notification = function(b){
	if (gui.socket)
		if (b)
			gui.socket.api._obeyEvent('onnotify', [this, '__notify']);
		else
			this.__socket_off();
};

	_me.__notify = function(aData){

		if (this._destructed)
			return false;

		if (aData.owner && aData.owner == this._pathName)
			return;

		if (this.__aRequestData.folder){

			var f = dataSet.get('folders',[this.__aRequestData.folder.aid,this.__aRequestData.folder.fid]);

			aData['ITEM-TYPE'] = aData['ITEM-TYPE'] || '-';

			if (aData.FOLDER && aData.TYPE == 'item' && f.RELATIVE_PATH == Path.slash(aData.FOLDER) && f.OWNER == aData.EMAIL && (aData.ACTION == 'reaction' || ~inArray(this.__options.notify, aData['ITEM-TYPE']))){

				if (this._onnotify)
					this._onnotify(aData);

				this.__exeEvent('onnotify', null, {"data":aData, "owner":this});
			}
		}
	};

	// Destructor for Notifier
	_me.__notify_off = function(){
		if (gui.socket)
			gui.socket.api._disobeyEvent('onnotify', [this, '__notify']);
	};

//Send Local Notification
_me._fire = function (iid, sAction, arg, bNoUpdate){
	if (gui.socket){
		var t = WMFolders.getType(this.__aRequestData.folder);
		if (t){
			var f = dataSet.get('folders', [this.__aRequestData.folder.aid, this.__aRequestData.folder.fid]) || {
				RELATIVE_PATH: this.__aRequestData.folder.fid,
				TYPE:t,
				OWNER: sPrimaryAccount
			};

			var aOut = {
				'ACTION':sAction,
				'TYPE':'item',
				'ITEM':WMItems.__serverID(iid),
				'FOLDER':f.RELATIVE_PATH,
				'FOLDER-TYPE':t,
				'EMAIL':f.OWNER
			};

			if (this.__aData[iid] && this.__aData[iid].obj)
				aOut['ITEM-TYPE'] = this.__aData[iid].obj.__aData.EVNCLASS;

			if (Is.Object(arg))
				aOut = objConcat(arg || {}, aOut);

			if (bNoUpdate)
				aOut.owner = this._pathName;

			gui.socket.api._notify(aOut);

			return true;
		}
	}

	return false;
};