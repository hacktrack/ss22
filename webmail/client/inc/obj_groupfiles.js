_me = obj_groupfiles.prototype;
function obj_groupfiles(){};

/**
 */
_me.__constructor = function() {
	this.__options.notify = ['F', 'M', '-'];

	this._placeholder('CHAT::NOFILES');
};

	_me._onnotify = function(aData){

		var iid = WMItems.__clientID(aData.ITEM);

		switch(aData.ACTION){
		case 'add':
			if (!this.__aData[iid])
				this.__check_count();
				//this._request(true);
			break;

		case 'delete':
			if (this.__aData[iid])
				this._remove(this.__aData[iid].anchor, iid);
			break;

		case 'lock':
		case 'unlock':
		case 'update':
		case 'edit':
		 	if (this.__aData[iid] && this.__aData[iid].obj && this.__aData[iid].obj.__update)
		 		this.__aData[iid].obj.__update(true);
		}
	};


_me._request = function(bUpdate){
	if (this.__aRequestData.folder){

		this.__loading = 1;

		var aOrder = Cookie.get(['folders', this.__aRequestData.folder.aid, this.__aRequestData.folder.fid, 'files', 'sort']) || 'EVN_MODIFIED';
		var aSort = Cookie.get(['folders', this.__aRequestData.folder.aid, this.__aRequestData.folder.fid, 'files', 'sortdir']) || 'desc';
		var aFilter = {sort:aOrder + ' ' + aSort, limit:this.__options.preload, search:'gchat:files'};

		if (this.__aRequestData.offset)
			aFilter.offset = this.__aRequestData.offset;

		if (this.__aRequestData.filter)
			if (this.__aRequestData.filter.search)
				aFilter.search += ' and (' + this.__aRequestData.filter.search + ')';

		var aItemsInfo = {aid:this.__aRequestData.folder.aid, fid:this.__aRequestData.folder.fid, values:['EVN_ID','EVNTITLE','EVN_MODIFIED','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED','EVNCOMPLETE','EVNLOCKOWN_EMAIL', 'EVNLOCKOWN_ID','EVNFLAGS'], filter:aFilter};

		//Blank request to check count
		if (bUpdate){
			if (!this._refresh()){
				var me = this;
				WMItems.list(aItemsInfo,'','','',[function(aData){
					var aData = aData[me.__aRequestData.folder.aid];

					if ((aData = aData[me.__aRequestData.folder.fid])){
						me.__check_count(parseInt(aData['/']));
					}

				}]);
			}
		}
		//Request
		else
			WMItems.list(aItemsInfo,'','','',[this, '_response']);
	}
};

_me._response = function(aData, bUpdate, bSkipTime){
	if(this.__bSearch) {
		this._placeholder('CHAT::SEARCHNOFILES');
		this.__bSearch = false;
	} else {
		this._placeholder('CHAT::NOFILES');
	}
	if ((aData = aData[this.__aRequestData.folder.aid]) && (aData = aData[this.__aRequestData.folder.fid])){

		if (!this.__check_count(parseInt(aData['/'])))
			return;

		delete aData['/'];	//count
		delete aData['#'];
		delete aData['$'];
		delete aData['@'];

		var c = 0, row;
		for (var iid in aData){
			c++;

			if (this.__aData[iid]) continue;

			aData[iid].EVN_MODIFIED = parseInt(aData[iid].EVN_MODIFIED);
			aData[iid].iid = iid;

			this.__aData[iid] = {data:aData[iid]};

			row = false;
			switch(aData[iid].EVNCLASS){
				case 'M':
				case 'F':
					row = this._row('', '', iid);
					this.__aData[iid].anchor = row.anchor;
					this.__aData[iid].obj = this._create('item', 'obj_groupfiles_item', row.anchor,'', this.__aData[iid].data);
					break;
			}

		}

		if (!bSkipTime){
			if (c == this.__options.preload)
				this.__loading = 0;
			else
				this.__loading = 2;

			this.__aRequestData.offset += c;
		}
	}
	//clear on error
	else
	if (!aData){
		this._clear(true);
		return;
	}

	if (!bUpdate || this.__aRequestData.fetchnew)
		this._fetch();
};

	_me._oncontext = function(e, elm){
		var id, aData;
		if ((elm = Is.Child(elm,'SECTION', this._main)) && (id = elm.getAttribute('rel')) && this.__aData[id] && (aData = this.__aData[id].data)){

			addcss(elm,'active');

			var me = this,
				arr = [];

			switch (Path.extension(aData.EVNTITLE)) {
				case 'txt':
				case 'htm':
				case 'html':
					arr.push({"title": 'POPUP_ITEMS::OPEN', 'arg': [Item.editFile, [aData]]});
					break;

				case 'pdf':
					arr.push({"title": 'POPUP_ITEMS::OPEN', 'arg': [Item.openPDF, [aData]]});
					break;

				case 'mp3':
					if (gui.audio)
						arr.push({"title": 'ATTACHMENT::PLAY_SOUND', 'arg': [Item.playFile, [aData]]});
					break;

				default:
					if (Item.officeSupport(aData.EVNTITLE)) {

						var aArgAuto = [Item.officeOpen, [aData, [Item.downloadFile, [[aData.aid, aData.fid, aData.iid]]], Path.extension(aData.EVNTITLE)]];
						var aArgWeb = [Item.officeOpen, [aData, [Item.downloadFile, [[aData.aid, aData.fid, aData.iid]]], Path.extension(aData.EVNTITLE)]];
						var aArgWebView = [Item.officeOpen, [aData, [Item.downloadFile, [[aData.aid, aData.fid, aData.iid]]], Path.extension(aData.EVNTITLE), 'view']];
						var aArgExt = [Item.officeOpen, [aData, [Item.downloadFile, [[aData.aid, aData.fid, aData.iid]]], Path.extension(aData.EVNTITLE), 'external']];
						var bIWD = dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';

						arr.push({
							title: 'POPUP_ITEMS::OPEN',
							arg: aArgAuto,
							'nodes': [
								{"title": 'DOCUMENT::OPENDOCUMENT', 'arg': aArgWeb, disabled: !bIWD},
								{"title": 'DOCUMENT::OPENDOCUMENTVIEW', 'arg': aArgWebView, disabled: !bIWD},
								{"title": 'OFFICELAUNCHER::OFFICESUITE', 'arg': aArgExt}
							]
						});

					}
			}

			if (e.target && e.target.nodeName == 'INPUT'){
				if (hascss(e.target,'obj_input') && 'select' in e.target)
					arr.push({title: 'RICH::COPY', arg: [
						function () {
							if (e && e.target){
								e.target.select();
								try {
									document.execCommand('copy');
									gui.notifier && gui.notifier._value({type: 'clipboard_link'});
								} catch (err) {
									gui.notifier._value({type: 'alert', args: {header: '', text: 'ERROR::CLIPBOARD'}});
								}
							}
						}]
					});
				else
					return false;
			}
			else{
				arr.push({
					title: 'FORM_BUTTONS::RENAME', arg: [
						function () {
							me._editItem(id);
						}],
						disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid: me.__aRequestData.folder.aid, fid: me.__aRequestData.folder.fid}, 'modify'))
					},
					{title: '-'},
					{title: 'FORM_BUTTONS::REMOVE', css: 'color2', arg: [
						function () {

							//Removing locked item
							if (aData.EVNLOCKOWN_ID && aData.EVNLOCKOWN_ID !== sPrimaryAccountGWID){

								var frm = gui._create('remove', 'frm_confirm_threestates', '', 'noblur', [
									function () {
										TeamChatAPI.requestUnlock(aData.fid, aData.EVNTITLE, aData.EVNLOCKOWN_EMAIL, 'remove');
									}.bind(this)
								], 'CONFIRMATION::DELETE_ITEM_CONFIRMATION', 'CONFIRMATION::DELETE_LOCKED_ITEM', [aData.EVNLOCKOWN_EMAIL]);

								frm.x_btn_ok._value('DOCUMENT::REQUEST_UNLOCK');

								frm.x_btn_cancel._value('FORM_BUTTONS::REMOVE');
								frm.x_btn_cancel._onclick = function(){
									frm._destruct();
									me._removeItem(aData, elm);
								};
								addcss(frm.x_btn_cancel._main, 'color2');
								return;
							}

							me._removeItem(aData, elm);
						}],
						disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid: me.__aRequestData.folder.aid, fid: me.__aRequestData.folder.fid}, 'remove'))
				});
			}

			this.cmenu = gui._create("cmenu","obj_context",'','');
			this.cmenu._fill(arr);

/*
			this.cmenu._fill([
			e.target.nodeName !== 'INPUT' ? {title: 'FORM_BUTTONS::REMOVE', css: 'color2', arg: [function () {
						me._removeItem(aData, elm);
					}], disabled: !(aData.EVNOWNEREMAIL == sPrimaryAccount || WMFolders.getAccess({aid: me.__aRequestData.folder.aid, fid: me.__aRequestData.folder.fid}, 'remove'))} : false,

			e.target.nodeName === 'INPUT' && hascss(e.target.nodeName, '') ? {title: 'RICH::COPY', css: 'color1', arg: [function () {
						if (e.target && e.target.select) {
							e.target.select();
							try {
								document.execCommand('copy');
							} catch (err) {
								gui._create('alert','frm_alert','','','','','ERROR::CLIPBOARD');
							}
						}

					}.bind(this)], disabled: false} : false
		].filter(function (i) {
			return i;
		}));
*/

			this.cmenu._place(e.clientX,e.clientY);
			this.cmenu._onclose = function(){
				removecss(elm,'active');
			};

			return false;
		}

	};
