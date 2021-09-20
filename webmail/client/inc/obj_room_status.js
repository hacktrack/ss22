function obj_room_status() {}

obj_room_status._STATUSES = {
	OFFLINE: 0,
	ONLINE: 3,
	TYPING: 1,
	COMMENTING: 2,
	BACKGROUND: 4
};
obj_room_status._WIDTH = 26;
obj_room_status._HEIGHT = 32;
obj_room_status._MAX_AVATARS = 10;

obj_room_status.prototype.__constructor = function () {

	this._folder = {};

	if (gui.socket) {
		this.__users = {};
		this.__list = [];

		gui.socket.api._obeyEvent('onStatusChange', [this, '__notify']);
		this._main.appendChild(this.__more = mkElement('div', {"class": "user more", "text": this.__list.length - this.__getMaxNumberOfAvatars()}));

		this._add_destructor('__notify_off');
	}

	gui._obeyEvent('resize', [this, '_removeOffline']);
};

obj_room_status.prototype.__getMaxNumberOfAvatars = function () {
	if(!(this._main || {}).parentNode) {
		return 0;
	}
	return Math.min(Math.floor(this._main.parentNode.clientWidth / obj_room_status._WIDTH), obj_room_status._MAX_AVATARS);
};

obj_room_status.prototype._setFolder = function (aFolder) {

	if (this._folder.fid && (this._folder.aid != aFolder.aid || this._folder.fid != aFolder.fid)){
		//cleanup
		this.__users = {};
		this.__list = [];

		while (this._main.firstChild) {
			this._main.removeChild(this._main.firstChild);
		}

		this._checkSize();
	}

	this._folder = aFolder;
};

obj_room_status.prototype.__notify = function (users) {

	if (this._destructed)
		return false;

	if (!this._folder.fid)
		return;

	var folder = dataSet.get('folders', [this._folder.aid, this._folder.fid]);
	if (users && users[0] && users[0].ATTRIBUTES && users[0].ATTRIBUTES.FOLDER !== folder.RELATIVE_PATH.replace('/', '\\')) {
		return;
	}

	users.forEach(function (user) {
		if(user.ATTRIBUTES.STATUSEMAIL === sPrimaryAccount) {
			return;
		}
		var email = user.ATTRIBUTES.STATUSEMAIL;
		var device = user.ATTRIBUTES.DEVICEID;
		var status = +user.ATTRIBUTES.STATUSID;

		if (status === obj_room_status._STATUSES.OFFLINE) {
			return this._removeUser(email, device);
		}

		if (!this.__users[email] || (this.__users[email].statuses[device] === void 0)) {
			this._addUser(email, device, status);
		} else if (this.__users[email].dom){
			this._moveUser(email, status);
			this.__users[email].dom && this.__users[email].dom.classList[status === obj_room_status._STATUSES.TYPING ? 'add' : 'remove']('typing');
		} else {
			this._removeUser(email, device);
			this._addUser(email, device, status);
		}

		this.__users[email] && (this.__users[email].statuses[device] = status);
	}, this);

	this._reOrder();
	this._removeOffline();
};

obj_room_status.prototype.__notify_off = function(){
	if (gui.socket)
		gui.socket.api._disobeyEvent('onStatusChange', [this, '__notify']);
};

obj_room_status.prototype._reOrder = function () {
	setTimeout(function () {
		var i = 0;
		this.__list = this.__list.filter(function(item) {
			return item.dom;
		});
		this.__list.slice(0, this.__getMaxNumberOfAvatars()).forEach(function (item) {
			var is_offline = true;
			for(var j in item.statuses) {
				if(item.statuses[j] !== obj_room_status._STATUSES.OFFLINE) {
					is_offline = false;
					break;
				}
			}
			if (!is_offline) {
				item.dom.style.transform = "translateX(" + (gui._rtl?-i:i) * obj_room_status._WIDTH + "px) translateY(" + obj_room_status._HEIGHT + "px)";
				i++;
				item.dom.style.opacity = 1;
			} else {
				item.dom.style.opacity = 0;
				//item.dom.style.transform = item.dom.style.transform.replace('translateY(' + obj_room_status._WIDTH + 'px)', 'translateY(0)');
			}
		});
		var min = Math.min(this.__list.length, this.__getMaxNumberOfAvatars());
		this.__list.slice(this.__getMaxNumberOfAvatars()).forEach(function (item) {
			item.dom.style.opacity = 0;
			item.dom.style.transform = "translateX(" + min * obj_room_status._WIDTH + "px) translateY(" + obj_room_status._HEIGHT + "px)";
		});
	}.bind(this), 5);
};
obj_room_status.prototype._removeOffline = function () {
	this.__removeOfflineTimeout && clearTimeout(this.__removeOfflineTimeout);
	this.__removeOfflineTimeout = setTimeout(function () {
		var change = false;

		this.__list.filter(function (item) {
			var is_offline = true;
			for(var i in item.statuses) {
				if(item.statuses[i] !== obj_room_status._STATUSES.OFFLINE) {
					is_offline = false;
					break;
				}
			}
			return is_offline;
		}).forEach(function (item) {
			if(!item.dom) {
				return;
			}
			item.dom.parentElement.removeChild(item.dom);
			delete this.__users[item.email];
			this.__list.splice(this.__list.indexOf(item), 1);

			change = true;
		}, this);

		change && this._checkSize();

		this._moreUsers();
	}.bind(this), 500);
};
obj_room_status.prototype._getIndex = function (status) {
	if (!this.__list.length) {
		return 0;
	}
	for (var i = 0; i < this.__list.length; i++) {
		var global_status = 0;
		for(var j in this.__list[i].statuses) {
			if(this.__list[i].statuses[j] > 0) {
				global_status = global_status ? Math.min(global_status, this.__list[i].statuses[j]) : this.__list[i].statuses[j];
			}
		}
		if (global_status >= status) {
			return i;
		}
	}
};
obj_room_status.prototype._moreUsers = function () {
	if (this.__list.length > this.__getMaxNumberOfAvatars()) {
		var amount = Math.min(this.__list.length, this.__getMaxNumberOfAvatars());
		this.__more.textContent = '+' + (this.__list.length - this.__getMaxNumberOfAvatars());
		this.__more.style.transform = "translateX(" + amount * obj_room_status._WIDTH + "px) translateY(" + obj_room_status._HEIGHT + "px)";
		this.__more.style.opacity = 1;
		this.__more.setAttribute('title', this.__list.slice(amount).map(function(user) { return user.email }).join("\n"));
	} else {
		this.__more.style.opacity = 0;
	}
};

obj_room_status.prototype._moveUser = function (email, status) {
	this.__list.splice(this.__list.indexOf(this.__users[email]), 1);
	var index = this._getIndex(status);
	this.__list.splice(index, 0, this.__users[email]);
};
obj_room_status.prototype._addUser = function (email, device, status) {

	if(!this.__users[email]) {
		var dom = this._createUser(email, status);
		this.__users[email] = {
			email: email, statuses: {},
			dom: dom
		};
		this._main.appendChild(dom);
		var index = this._getIndex(status);
		this.__list.splice(index, 0, this.__users[email]);

		this._checkSize();
	}
	this.__users[email].statuses[device] = status;
};
obj_room_status.prototype._removeUser = function (email, device) {
	this.__users[email] = this.__users[email] || {statuses: {}};
	this.__users[email].statuses[device] = obj_room_status._STATUSES.OFFLINE;
	this.__list.splice(this.__list.indexOf(this.__users[email]), 1);
	this.__list.push(this.__users[email]);
};
obj_room_status.prototype._createSpinner = function () {
	var spinner = mkElement('div', {class: "spinner"});
	for (var i = 1; i <= 3; i++) {
		spinner.appendChild(mkElement('div', {class: "bounce" + i}));
	}
	return spinner;
};

obj_room_status.prototype._createAvatar = function (user_email) {
	var avatar = mkElement('div', {class: 'img'});
	avatar.setAttribute('style', 'background-image: url("'+getAvatarURL(user_email) + '")');
	return avatar;
};
obj_room_status.prototype._createUser = function (user_email) {
	var div = mkElement('div', {"class": "user", "title": user_email});
	div.appendChild(this._createAvatar(user_email));
	div.appendChild(this._createSpinner());
	return div;
};

obj_room_status.prototype._checkSize = function(){
	for (var size = 0, style, i = 0; i < this.__list.length; i++) {
		if (this.__list[i].dom){
			style = getComputedStyle(this.__list[i].dom);
			size += (this.__list[i].dom.offsetWidth || 0) + parseInt(style.marginLeft || 0, 10);
		}
	}
	this.__exeEvent('onresize',null,{size:size});
};
