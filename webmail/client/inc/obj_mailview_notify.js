_me = obj_mailview_notify.prototype;
function obj_mailview_notify(){};

//// Notifications DISABLED in XML ////
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

		if (aData.owner && aData.owner == this._pathName)
			return;

		if (aData['TYPE'] == 'item' && this.__aid == sPrimaryAccount && this.__fid && this.__fid == Path.slash(aData.FOLDER)){
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