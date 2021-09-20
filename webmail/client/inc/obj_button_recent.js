function obj_button_recent() {}

obj_button_recent.prototype.__constructor = function () {
	var unread = this._getRoomsWithUnreadCount();

	var aFill = ['CHAT::ALL', 'CHAT::RECENT', 'CHAT::UNSUBSCRIBED'];

	this._fill(aFill);
	this._obeyEvent('onchange', [this, '__onChange']);

	this._main.querySelector('.button[iw-id="2"]').appendChild(mkElement('div', {class: "badge " + (!unread ? 'empty' : ''), text: unread}));
	this._listen('folders');

	dataSet.on('cookies', ['recent'], this.__onUpdate, this);
	this._add_destructor('__removeListeners');
};

obj_button_recent.prototype.__removeListeners = function(){
	dataSet.off('cookies', ['recent'], this.__onUpdate);
};

obj_button_recent.prototype.__onChange = function (e, arg) {
	var value = arg.value;

	Cookie.set(['active_groupchat_view'], value);

	if ((gui.frm_main.bar.tree.add_container || {}).btn_add)
		gui.frm_main.bar.tree.add_container.btn_add._disabled(value == 3);

	gui.frm_main.bar.tree.slide._value(value);

	// gui.frm_main.bar.tree.folders.inp_search._value('');
	// gui.frm_main.bar.tree.folders.inp_search._onkeyup({keyCode:27});
	// gui.frm_main.bar.tree.folders.__filter = '';
};

obj_button_recent.prototype._getRoomsWithUnreadCount = function () {
	return (Object.keys(rooms = dataSet.get('folders', [sPrimaryAccount]))).filter(function (room_name) {
		return rooms[room_name].TYPE === 'I' && ~(dataSet.get('cookies', ['recent']) || []).indexOf(sPrimaryAccount + '/' + room_name) && rooms[room_name].RECENT && rooms[room_name].RECENT !== '0';
	}).length || 0;
};

obj_button_recent.prototype.__onUpdate = function (aData, sName, aDPath) {
	this.__update(sName, aDPath);
};

obj_button_recent.prototype.__update = function (sName, aDPath) {
	if (sName === 'cookies' || (aDPath && Array.isArray(aDPath))) {
		var unread = this._getRoomsWithUnreadCount(),
			badge = this._main.querySelector('.badge');

		if (badge){
			badge.firstChild.textContent = unread;
			badge.classList[unread ? 'remove' : 'add']('empty');
		}
	}
};


obj_button_recent.prototype.__unsubscribeRoom = function (row, arg, handler) {

	if (arg.method === 'unsubscribe'){
		var btn = this._getAnchor('buttons').querySelector('.button[iw-id="3"]');
		if (btn)
			removecss(btn,'bounce');
	}

	if (row){
		removecss(row,'active');

		row.style.transition = 'all 0.3s cubic-bezier(1, 0.01, 1, 0.01)';
		row.style.opacity = 0;
		row.style.transform = 'translateY(-800px)';

		if (browserEvent('transitionend')) {
			row.addEventListener(browserEvent('transitionend'), function () {
				if (arg.method === 'unsubscribe')
					this.__bounce();

				row.parentNode && row.parentNode.removeChild(row);
				if (handler)
					executeCallbackFunction(handler);

			}.bind(this));
		} else {
			setTimeout(function(){
				if (arg.method === 'unsubscribe')
					this.__bounce();

				row.parentNode && row.parentNode.removeChild(row);
				if (handler)
					executeCallbackFunction(handler);
			}, 0);
		}
	}
	else
	if (arg.method === 'unsubscribe'){
		this.__bounce();
	}
};
	obj_button_recent.prototype.__bounce = function () {
		var btn = this._getAnchor('buttons').querySelector('.button[iw-id="3"]');
		if (btn)
			addcss(btn,'bounce');
	};
