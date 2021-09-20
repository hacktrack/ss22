_me = obj_tree_list.prototype;
function obj_tree_list() {};

_me.__constructor = function () {
	this._recent = [];
	this._search_query = false;
	this._rowHeight = 48;	//shold be in /skin
	this._search_query = '';
	this._norefresh = false;

	this.__eBody = this._getAnchor('body');

	this._create('scrollbar', 'obj_scrollbar');
	this.scrollbar._scrollbar(this.__eBody, this.__eBody.parentElement);

	this.__eBody.onclick = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			room = '';

		if (elm === this.__eBody) return;
		while(!(room = elm.getAttribute('data-room'))){
			elm = elm.parentElement;
			if (elm == this.__eBody)
				break;
		}

		if (room){
			this.__clickOnRow(e, room);
			// e.stopPropagation();
		}

	}.bind(this);

	this.__eBody.oncontextmenu = function(e){
		var e = e || window.event,
			elm = e.target || e.srcElement,
			room = '';

		if (elm === this.__eBody) return;
		while(!(room = elm.getAttribute('data-room'))){
			elm = elm.parentElement;
			if (elm == this.__eBody)
				break;
		}

		if (room){
			this.__contextMenuForRow(e, room);
			// e.stopPropagation();
		}

	}.bind(this);

	//SEARCH
	this.inp_search._onkeyup = function(e){
		var v = this.inp_search._value();

		//Esc
		if (e.keyCode == 27){
			if (v === '')
				this._focus();
			else{
				this.inp_search._value('');
			}

			v = false;
		}

		window[v.length?'addcss':'removecss'](this._main,'search');
		this.__search(v);

	}.bind(this);

	this.inp_search._onblur = function(){
		if (!this.inp_search._value()) removecss(this._main,'search');
	}.bind(this);


	//Focus
	var hasFocus = false;
	this._main.setAttribute('tabindex', -1);

	//IE trick
	if (~currentBrowser().indexOf('MSIE')){
		AttachEvent(this._main, 'onclick', function () {
			hasFocus = true;
		});
	}
	else{
		AttachEvent(this._main, 'onfocus', function () {
			hasFocus = true;
		});
	}
	AttachEvent(this._main, 'onblur', function () {
		hasFocus = false;
	});
	AttachEvent(this._main, 'onkeydown', function (e) {
		if (hasFocus && !e.isComposing && e.keyCode !== 229 && (e.key || '').length === 1)
			this.inp_search._focus();
	}.bind(this));

	//LISTENERS
	dataSet.on('active_folder', null, this.__setActiveRow, this)
		.on('cookies', ['recent'], this._prepareData, this);
	this._add_destructor('__removeListeners');

	this._listen('folders');
};

	_me.__clickOnRow = function (e, room) {
		if (hascss(e.target || e.srcElement, 'close')){
			this.__removeRecent(room);
		}
		else{
			var roomPath = Path.split(room);
			//gui.frm_main.bar.tree.folders._setActive(room);
			gui.frm_main._selectView({aid: roomPath[0], fid: roomPath[1]});
		}
	};
	_me.__contextMenuForRow = function (e, room) {
		e.preventDefault();
		var cmenu = gui._create("cmenu", "obj_context_folder", '', '', this),
			room = Path.split(room)[1],
			rights = WMFolders.getRights({aid: sPrimaryAccount, fid: room});

		cmenu._fill([
			{'title': 'FORM_BUTTONS::RENAME', css:'ico2 edit_folder','arg': {aid: sPrimaryAccount, fid: room, ftype: 'I', method: 'rename_folder'}, disabled: !rights.edit_folder},
			{'title': 'FORM_BUTTONS::UNSUBSCRIBE', css:'ico2 archive_folder', 'arg': {aid: sPrimaryAccount, fid: room, ftype: 'I', method: 'unsubscribe', callback: function (folder_info) {

						gui.frm_main.bar.top.switch.__unsubscribeRoom(elm, {aid: sPrimaryAccount, fid: room}, folder_info, [this,'__update']);	// check response handler!!

					}.bind(this)}},
			rights.owner ? {'title': 'POPUP_FOLDERS::MEMBERS', css:'ico2 color1 members','arg': {aid: sPrimaryAccount, fid: room, method: 'share'}} : false,
			{'title': 'POPUP_ITEMS::DELETE', css:'ico2 color2 delete_folder', 'arg': {aid: sPrimaryAccount, fid: room, method: 'delete_folder'}, disabled: !rights.remove}
		].filter(Boolean));
		cmenu._place(e.clientX, e.clientY);
	};

_me.__removeListeners = function () {
	dataSet.off('active_folder', null, this.__setActiveRow)
	 	.off('cookies', ['recent'], this._prepareData);
};

/**
 * Check if Teamchat-service is running
 *
 * @returns Boolean
 */
_me._teamChatOnline = function(){
	var folders = dataSet.get('folders', [sPrimaryAccount]);
	for(var i in folders) {
		if(~['I', 'Y'].indexOf(folders[i].TYPE)) {
			return true;
		}
	}
	return false;
};

_me._prepareData = function(){

	// set from obj_context_folder.rename_folder
	if (this._norefresh) return;

	var aData = [],
		ds = dataSet.get('folders',[sPrimaryAccount]),
		recent = Cookie.get(['recent']) || [],
		active = dataSet.get('active_folder');

	var new_recent = recent.filter(function(room){
		var path = Path.split(room),
			parts = path[1].split('/'),
			folder = ds[path[1]];

		if (folder && folder.TYPE == "I" && folder.SYNC == '1'){

			//This block can be below Cookie update for better performance
			aData.push({
				room: room,
				name: folder.NAME || parts.pop(),
				group: parts.shift(),
				recent: folder.RECENT || 0,
				active: active === room
			});

			return true;
		}
	});

	//Update cookie
	if (recent.length !== new_recent.length && this._teamChatOnline()){
		Cookie.set(['recent'], new_recent);
		return; //to avoid double refresh
	}

	this._recent = new_recent;
	this._aData = aData;

	this._fill();
};

_me._getFocusElement = function(){
	return this._main;
};
_me._focus = function(){
	return this._main.focus();
};

_me._fill = function(aData){

	aData = aData || this._aData || [];

	var rows = {}, //already rendered row elements
		data_rows = aData.map(function(room){return room.room}); //rooms in aData

	//remove old rows
	[].forEach.call(this.__eBody.querySelectorAll('div[data-room]'), function(elm){
		var room = elm.getAttribute('data-room');
		if (!~data_rows.indexOf(room)){
			//animated remove
			elm.removeAttribute('data-room');
			addcss(elm, 'shrink');
			setTimeout(function(){
				elm && elm.parentNode && elm.parentNode.removeChild(elm);
			},300);
		}
		else
			rows[room] = elm;
	});

	window[aData.length?'removecss':'addcss'](this._main, 'empty');

	//Any search?
	var qs = (this._search_query || '').toLowerCase();

	(qs.length?aData.filter(function (room) {
		if (!~room.name.toLowerCase().indexOf(qs)){
			//hide filtered rows
			if (rows[room.room]) {
				rows[room.room].style.display = 'none';
			}

			return false;
		}

		return true;
	}):aData).forEach(function (room, i) {
		var row;

		//Row already exist
		if (rows[room.room]) {
			row = rows[room.room];
			row.innerHTML = '';
			row.style.display = 'block';
		}
		//Create new row envelope
		else {
			row = mkElement('div', {
				'class': 'recent-row',
				'data-room': room.room,
				'id': this._pathName + '/' + room.room //do we need it?
			});

			this.__eBody.appendChild(row);
		}

		//update content
		this.__createRowBody(row, room);

		//set current position
		row.style.transform = 'translateY(' + (i * this._rowHeight) + 'px)';
		row.style.transform.zIndex = 10 + i;

	}.bind(this));

};

_me._rename = function(arg){
	if (this.rename) this.rename._onclose();
	this._norefresh = true;

	var sLiId	= this._pathName+'/'+arg.aid + (arg.fid?'/'+arg.fid:''),
		hDiv = document.getElementById(sLiId).getElementsByTagName('DIV')[0];

	// hide link
	addcss(hDiv,'edit');

	// create editDiv anchor and ID to hDiv
	var sAnchor = sLiId + '#editDiv';
	this._anchors['editDiv'] = sAnchor;
	hDiv.id = sAnchor;

	// get value
	var nPos = arg.fid.lastIndexOf('/'),
		sParentName = arg.fid.substring(0,nPos),
		sFolderName = dataSet.get("folders", [arg['aid'],arg['fid'], 'NAME']) || arg.fid.substring(nPos + 1);

	// create obj_input in this' editDiv anchor
	var rename = this._create('rename','obj_input','editDiv');
		rename._restrict('![/\\\\:\?\"\<\>\|\~]+','','^.{1,255}$');

		// cancel "onclick" propagation to obj_tree
		rename.__eIN.onclick = function(e){
			var e = e || window.event;
			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			return false;
		};

		rename._value(sFolderName);
		rename._setRange(0,sFolderName.length);

		rename._onsubmit = function(e){
			if (this._checkError && this._checkError.length) return;

			var snew = (this._value() || '').trim();
			var sold = sFolderName;

			if (sold == snew){
				this._onclose();
				return;
			}

			var sNewFolderID = (sParentName ? sParentName + '/' : '') + snew;
			obj_context_folder.__moveFolder(arg.aid, arg.fid, sNewFolderID);

			this._onclose();
		};

		rename._onclose = function(e){

			if (this.rename._destructed) return false;

			this.rename._destruct();
			removecss(hDiv,'edit');

			// aby se zase prekresloval tree
			this._norefresh = false;
			if (!e || this._updateBuffer)
				this.__update(this._listener_data);
		}.bind(this);

		rename._onblur = rename._onclose;

	// remove anchor immediately (better solution)
	delete this._anchors['editDiv'];
};

_me.__createRowBody = function(row, room){

	//body
	row.appendChild(mkElement('div', {class: "body"},null,[
		mkElement('div', {class: "room-name", text:room.name}),
		mkElement('div', {class: "group-name", text:room.group})
	]));

	//control
	var control = mkElement('div', {
			class: "control"
		},
		null,
		mkElement('div', {
			class: "close"
		})
	);
	if (+room.recent>0){
		control.appendChild(mkElement('div', {class: "bubble", text:room.recent}));
		addcss(row, 'unread');
	}
	else
		removecss(row, 'unread');

	row.appendChild(control);

	window[room.active?'addcss':'removecss'](row,'active');
};

_me.__removeRecent = function (room) {
	var recent = Cookie.get(['recent']) || [];

	if (recent.length && this._teamChatOnline()){
		Cookie.set(['recent'], recent.filter(function(v){
			return v !== room;
		}));
	}
};

_me.__setActiveRow = function (room) {

	//update DOM
	[].forEach.call(this.__eBody.querySelectorAll('[data-room]'), function (row) {
		removecss(row,'active');
	});

	var row = this.__eBody.querySelector('[data-room="' + room + '"]');
	if (row) {

		//update this._aData
		this._aData.map(function(v){
			v.active = v.room === room;
			return v;
		});

		addcss(row,'active');
	}
};

_me.__search = function (query) {
	query = query || false;
	if (this._search_query !== query){
		this._search_query = query || false;
		this._fill();
	}
};

_me.__update = function () {
	if (this._teamChatOnline()) {
		if (this.__applyFoldersUnreadSnapshot())
			this.__saveFoldersUnreadSnapshot();
		else
			this._prepareData();
	}
};

_me.__saveFoldersUnreadSnapshot = function () {
	var ds = dataSet.get('folders', [sPrimaryAccount]),
		oSnapshot = {};

	for (var sFolder in ds) {
		if (ds.hasOwnProperty(sFolder) && 'I' === ds[sFolder]['TYPE']) {
			oSnapshot[sFolder] = {'recent' : parseInt(ds[sFolder]['RECENT'])};
		}
	}

	Cookie.set(['recent_folders_snapshot'], oSnapshot);
};

_me.__applyFoldersUnreadSnapshot = function () {

	var ds = dataSet.get('folders', [sPrimaryAccount]),
		oSnapshot = Cookie.get(['recent_folders_snapshot']),
		aRecent = Cookie.get(['recent']) || [],
		aFoldersWithNewPosts = [],
		bUpdate = false;

	for (var sFolder in ds) {
		// Skip invalid properties and non-teamchat room folders
		if (ds.hasOwnProperty(sFolder) &&  'I' === ds[sFolder]['TYPE']) {
			if (
				(!Is.Object(oSnapshot) && parseInt(ds[sFolder]['RECENT']) > 0) || // Case when snapshot wasn't taken yet - fill all rooms with unread posts
				(Is.Object(oSnapshot) && (!oSnapshot.hasOwnProperty(sFolder) || parseInt(ds[sFolder]['RECENT']) > oSnapshot[sFolder]['recent'])) // Case when new room appeared || new posts appeared in existing room
			) {
				aFoldersWithNewPosts.push(sPrimaryAccount + '/' + sFolder);
			}
		}
	}

	aFoldersWithNewPosts.forEach(function(path){
		if (!~aRecent.indexOf(path)) {
			aRecent.unshift(path);
			bUpdate = true;
		}
	});

	bUpdate && Cookie.set(['recent'], aRecent);

	return bUpdate;
};
