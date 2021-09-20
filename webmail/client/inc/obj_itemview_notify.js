_me = obj_itemview_notify.prototype;
function obj_itemview_notify(){};

//// Notifications ////
_me.__constructor = function() {
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

		if ((aData.owner && aData.owner == this._pathName) || !this.__activeItemID)
			return;

		var current_folder_data = dataSet.get("folders", [this.__activeItemID[0], this.__activeItemID[1]]);
		if (current_folder_data && current_folder_data.RELATIVE_PATH === Path.slash(aData.FOLDER) && aData.ITEM === WMItems.__serverID(this.__activeItemID[2])){
			if (this._onnotify)
				this._onnotify(aData);
			this.__exeEvent('onnotify', null, {"data":aData, "owner":this});
		}
	};

	// Destructor for Notifier
	_me.__notify_off = function(){
		if (gui.socket)
			gui.socket.api._disobeyEvent('onnotify', [this, '__notify']);
	};