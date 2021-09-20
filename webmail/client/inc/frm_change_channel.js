_me = frm_change_channel.prototype;
function frm_change_channel(){};

/**
 * @brief   Form for adding folder.
 * Form has three input objects:
 *    - text input for name of the folder (folder must
 *    match this regular expr. /^ *[a-zA-Z0-9#\.\_\-]+[ a-zA-Z0-9#\.\_\-]*$/).
 *    - select box for folder type specification (mail, contact, event, journal, note, task).
 *    - folder three.
 * 'OK' button is active only if the name of the folder match the regular expr. above.
 *
 * @param[in]  sAccountID  [string] Only folders from this account will be listed because of
 * moving folders between accounts is disabled.
 * @param[in]  sFolderID   [string] Optional. Forder with this ID will be preselected.
 *
 * @see  objects/frm_add_folder.xml
 * @see  inc/frm_add_folder.js
 */
_me.__constructor = function(sAccountID, sFolderID){
	var me = this;

	this._title('POPUP_FOLDERS::CHANGE_CHANNEL');
	this._size(600,400,true);

	//Fill ListBox
	var aFolder = dataSet.get('folders',[sAccountID, sFolderID]);
	if (aFolder && !aFolder.RSS){
		me._destruct();
		return;
	}

	// Create formular from template
	this._draw('frm_change_channel', 'main');

	if (aFolder){
		// Disable buttons
		this.input_channel._disabled(true);
		this.x_rss_add._disabled(true);
		this.x_rss_remove._disabled(true);
		this.x_btn_ok._disabled(true);
		this.input_channels._disabled(true);

 		WMFolders.list({aid:sAccountID,fid:sFolderID},'','',[this,'__fill']);
	}

	this.x_rss_add._onclick = function() {
		var v = this._parent.input_channel._value().trim();
		if (v){
			var aData = {};
			if (this._parent.input_channels.__idTable)
				aData = this._parent.input_channels.__idTable;

			aData[v] = v;
			this._parent.input_channels._fill(aData);
			this._parent.input_channels._value(v);
		}

        this._parent.input_channel._value('');
        this._parent.input_channel._focus();
	};
	this.x_rss_edit._onclick = function() {
		var v = this._parent.input_channel._value().trim(),
			s = this._parent.input_channels._value();

		if (v && s && (s = s[0]))
			if (this._parent.input_channels.__idTable)
				delete this._parent.input_channels.__idTable[s];

        this._parent.x_rss_add._onclick();
	};
	this.x_rss_remove._onclick = function() {
		var s = this._parent.input_channels._value(),
			v = this._parent.input_channels.__idTable;

		if (s.length && v){
			for(var i in s)
				delete v[s[i]];

			this._parent.input_channels._fill(v);
		}
	};
	this.input_channel._onsubmit = function(){
		me.x_rss_add._onclick();
	};
	this.input_channels._ondblclick = function(){
		var s = this._value();
		if (s && (s = s[0]))
            this._parent.input_channel._value(s);
	};

	// This function is triggered when 'OK' button is pressed
	this.x_btn_ok._onclick = function() {
		var aChannels = [],
			v = this._parent.input_channels.__idTable;

		if (Is.Empty(v))
			this._parent.x_rss_add._onclick();

		for(var i in v)
			aChannels.push(i);

		if (!aChannels.length)
			aChannels.push('NULL');

		if (aFolder)
			WMFolders.add({'aid': sAccountID, 'fid': sFolderID, 'channel': aChannels, 'type': 'M'}, 'folders');
		else
			WMFolders.add({'aid': sAccountID, 'name': sFolderID, 'channel': aChannels, 'type': 'M'}, 'folders');

		me._destruct();
	}
};

_me.__fill = function(aData){
	var out = {},sel;
	for(var aid in aData)
		for (var fid in aData[aid])
			for (var i in aData[aid][fid].CHANNELS){
				if (aData[aid][fid].CHANNELS[i] == 'NULL')
					continue;

				if (!sel) sel = aData[aid][fid].CHANNELS[i];
				out[aData[aid][fid].CHANNELS[i]] = aData[aid][fid].CHANNELS[i];
			}

	this.input_channel._disabled(false);
	this.x_rss_add._disabled(false);
	this.x_rss_remove._disabled(false);
	this.input_channels._disabled(false);

	if (this.input_channels && typeof sel != 'undefined'){
		this.input_channels._fill(out);
		this.input_channels._value(sel);
	}

	this.x_btn_ok._disabled(false);
};