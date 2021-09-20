_me = frm_file.prototype;
function frm_file(){};

_me.__constructor = function() {
	this._skip_teamchat_choose_folder = arguments[6];
	var me = this;

	this._defaultSize(-1,-1,740,315);

	// Create 'OK' button
	this._create('x_btn_ok', 'obj_button', 'footer', 'noborder color1');
	this.x_btn_ok._value('FORM_BUTTONS::SAVE');

	//Prepare Upload Object
	if (!this._sItemID){
		this._size(740, this._skip_teamchat_choose_folder ? 290 : 315);
		this._resizable(false);
		this._draw('frm_file_main', 'main', {folders:(this._aValues.fullpath)?true:false, teamchat: !!this._skip_teamchat_choose_folder});
		this.__tab1 = this;

		this._create('X_ATTACHMENTS','obj_upload_edit','attach','noborder');

		//Add Blank File
		this.X_ATTACHMENTS._create('btn_blank','obj_button','controls','simple ico blank');
		this.X_ATTACHMENTS.btn_blank._value('FILE::BLANK_DOC');
		this.X_ATTACHMENTS.btn_blank._disabled(this.__readonly);
		this.X_ATTACHMENTS.btn_blank._main.onmousedown = function(e){
			var e = e || window.event;
			if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
		};
		this.X_ATTACHMENTS.btn_blank._onclick = function(e){

			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;

			if (this.cmenu && !this.cmenu._destructed){
				this.cmenu._destruct();
				delete this.cmenu;
				return;
			}

			var pos = getSize(this._main),
				aMenu = [
					{"title": 'MAIN_MENU::NEW_WORD', 'arg':'.docx'},
					{"title": 'MAIN_MENU::NEW_EXCEL', 'arg': '.xlsx'},
					{"title": 'MAIN_MENU::NEW_PPOINT', 'arg': '.pptx'},
					{"title": 'MAIN_MENU::NEW_TEXT', 'arg': '.txt'},
					{"title": 'MAIN_MENU::NEW_HTML', 'arg': '.html'}
				];

			this.cmenu = gui._create("cmenu","obj_context",'','',this),
			this.cmenu._fill(aMenu);
			this.cmenu._place(pos.x+(pos.w/2),pos.y+pos.h,'',1);
			this.cmenu._onclick = function(e, elm, id, arg) {
				if (arg){
					me.X_ATTACHMENTS._value({'values':[{"name":arg,"class":'document'}]});
					me.X_ATTACHMENTS._rename(me.X_ATTACHMENTS.list.__idtable.length-1);
				}
			};
		};

		//this.EVNNOTE._focus();
	}
	else{
		this._size(false, 585);
		this._draw(
			'frm_file',
			'main',
			{
				folders: (this._aValues.fullpath)?true:false,
				revisions:(this._aValues.REVISIONS?true:false),
				disable_html : !GWOthers.getItemAccess('MAIL_SETTINGS_DEFAULT','html_message') && '0' === GWOthers.getItem('MAIL_SETTINGS_DEFAULT','html_message')
			}
		);
		this.__tab1 = this.maintab.tab1;

		this._create('X_ATTACHMENTS','obj_upload_edit_single','attach','big noborder');
		this.X_ATTACHMENTS.list.__hasRemove = false;

		if (this._aValues.EVNLOCKOWN_ID && this._aValues.EVNLOCKOWN_ID != sPrimaryAccountGWID)
			this.__readonly = true;

		// Create 'New Revision' button
		/*
		this._create('x_btn_revision', 'obj_button', 'footer','ico ok noborder simple');
		this.x_btn_revision._value('FORM_BUTTONS::REVISION');
		this.x_btn_revision._onclick = function() {
			if (!me.x_btn_ok._disabled()){
				me.__revision = true;
				me.x_btn_ok._onclick();
			}
		};
		*/

		//this.EVNNOTE._focus();
	}

	if(this.__tab1.EVNNOTE) {
		//HTML Mode switcher
		this.__tab1.EVNNOTE.select._fillLang({'enabled': "COMPOSE::HTML", 'disabled': "COMPOSE::TEXT", 'code':'RICH::CODE'});
		this.__tab1.EVNNOTE.select._value('enabled');

		// Keyboard esc from rich text area to close window
		this.__tab1.EVNNOTE._onesc = function() {
			me._close(true);
		};

		this.__tab1.EVNNOTE._rtl && this.__tab1.EVNNOTE.__eFrame.contentDocument.body.setAttribute('dir', 'rtl');
		this.__tab1.EVNNOTE._onresize = function() {
			var frmtbl = me._getAnchor('main').querySelector('.popupmaindialog > .frmtbl');
			frmtbl && me._size(false, frmtbl.offsetHeight + 88);
		};
	} else {
		this._create('EVNNOTE', 'obj_chat_input', 'text', '', {
			smiles_enabled: GWOthers.getItem('CHAT', 'smiles') == '1'
		});
		this.EVNNOTE.input._placeholder(getLang('IM::COMMENT_PH'));
		this.EVNNOTE.input._onsubmit = function(){
			!me.x_btn_ok._disabled() && me.x_btn_ok._onclick();
		};
		this.EVNNOTE.input._onresize = function() {
			var frmtbl = me._getAnchor('main').querySelector('.popupmaindialog > .frmtbl');
			frmtbl && me._size(false, frmtbl.offsetHeight + 88);
		};
		this.EVNNOTE._folder({
			aid: this._sAccountID,
			fid: this._sFolderID
		});
	}

	// Create 'CANCEL' button
	this._create('x_btn_cancel', 'obj_button', 'footer','cancel noborder simple');
	this.x_btn_cancel._value('FORM_BUTTONS::CANCEL');
	this.x_btn_cancel._onclick = function() { me._destruct() };

	this.__tab1._getAnchor('msiebox') && msiebox(this.__tab1._getAnchor('msiebox'));

	if (this.x_btn_ok)
	this.x_btn_ok._disabled(true);

    this.X_ATTACHMENTS._disabled(this.__readonly);
    this.X_ATTACHMENTS._onchange = function(){

		//Title
		var sName = getLang('FILE::FILE');
		if (this.__idtable)
			for (var i = this.__idtable.length-1;i>-1;i--)
				if (!this.__idtable[i].removed && this.__idtable[i].name){
					sName = this.__idtable[i].description || this.__idtable[i].name || '';

					if (sName.length>64)
						sName = sName.substr(0,50)+'..'+ Path.extension(sName);

					break;
				}

		me._title(sName + (me._aValues.EVNFOLDER ? ' - ' + me._aValues.EVNFOLDER : '') + (me._aValues.EVNEXPIRE > 0 ? ' - ' + getLang('FILE::EXPIRE', [IcewarpDate.unix(me._aValues.EVNEXPIRE).format('L')]) : ''), true);

		//Form Buttons
		// me.__checkEnableForm();
	};

	this.__initForm('FILE::FILE');

	if (this.__tab1.x_folders) {
		if (this._sItemID){
			this.__tab1.x_folders._destruct();
			this.__tab1._getAnchor('folder').classList.add('readonly');
		} else {
			this.__tab1.x_folders._onclick = function(){
				gui._create('frm_select_folder','frm_select_folder','','','POPUP_FOLDERS::SELECT_FOLDER',me._sAccountID,me._sFolderID,[me,'__changeFolder'],true,true,['F','Y','I'],'',false,'wk');
			};
		}
	}

	//remove contextmenu
	this.X_ATTACHMENTS._onuploadstart = function(){
		if (this._parent.x_btn_ok)
			this._parent.x_btn_ok._disabled(true);
		if (this._parent.x_btn_cancel)
			this._parent.x_btn_cancel._disabled(true);
	};

	this.X_ATTACHMENTS._onuploadend = function(){
		me.__checkEnableForm();
		if (this._parent.x_btn_cancel)
			this._parent.x_btn_cancel._disabled(false);
	};

	//Registr DropZone
	if (!this.__readonly && this.X_ATTACHMENTS._dropzone)
		this.X_ATTACHMENTS._dropzone(this.__eContainer);

	if((((this._aValues['ATTACHMENTS'] || [])[0] || {})['values'] || {})['ATTDESC']) {
		this.X_ATTACHMENTS.btn_blank._disabled(true);
		this.X_ATTACHMENTS.file._disabled(true);
	}

	// disable scrolling in this dialog (focus or pressing the TAB key can do the scrolling at least at Firefox)
	// ...this is a workaround, not perfect solution, but it keeps current rendering as it is
	this.__tab1._getAnchor('main').onscroll = function() {
		me.__tab1._getAnchor('main').scrollTop = 0;
	}.bind(this);

	// Refresh list and preview in case tags were changed
	if (this.__tab1.EVNTYPE)
		this.__tab1.EVNTYPE.input._onChange = function(){
			this.__refreshView = true;
		}.bind(this);

	this.__checkEnableForm(void 0, false);
};

_me._onresize = function() {
	var
		dialogHeight = this._getAnchor('main').querySelector('.popupmaindialog').offsetHeight,
		height = dialogHeight - 300;
	height = Math.max(height, 90);
	this.__tab1.EVNNOTE._main.style.height = height + 'px';
};

//Update Save As
_me.__checkEnableForm = function(b, show_error){
	var disabled = false;
	show_error = show_error === void 0 ? true : show_error;
	if (this.x_btn_ok){
		var that = this;
		if(!this._getAnchor('name')) {
			that = this.maintab.tab1;
		}
		var is_filename = Is.Filename(that._getAnchor('name').value);
		if(is_filename) {
			that._getAnchor('name').classList.remove('error');
		} else if (show_error) {
			that._getAnchor('name').classList.add('error');
		}
		disabled = Is.Defined(b)?b:!is_filename;
		this.x_btn_ok._disabled(disabled);
	}
	return !disabled;
};

_me.__print = function(aValues){
	aValues = aValues.values;

	if (!gui.print)
		gui._create('print','frm_print');

	gui.print._add('F', aValues);
};

_me.__loadItems = function() {
	var me = this;

	if (this.__tab1.EVNNOTE.select){
		if (!this._aValues || !this._aValues.EVNDESCFORMAT || this._aValues.EVNDESCFORMAT.toLowerCase() != 'text/plain')
			this.__tab1.EVNNOTE.select._value('enabled');
		else
			this.__tab1.EVNNOTE.select._value('disabled');
	}

	this._title(getLang('FILE::FILE') + (this._aValues.EVNFOLDER?' - '+this._aValues.EVNFOLDER:'') + (this._aValues.EVNEXPIRE>0?' - '+getLang('FILE::EXPIRE',[IcewarpDate.unix(this._aValues.EVNEXPIRE).format('L')]):''),true);

	if (this._aValues['ATTACHMENTS'] || this._aValues['PUSH_ATTACHMENTS']){
		var out = [], tmp;
		for (var i in this._aValues['ATTACHMENTS']) {
			tmp = {
				'name': (this._aValues['ATTACHMENTS'][i]['values']['ATTDESC'] || '').unescapeHTML(),
				'class': this._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
				'id': i,
				'size': this._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']
			};

			if (this._aValues['ATTACHMENTS'][i]['values']['fullpath'])
				tmp.fullpath = this._aValues['ATTACHMENTS'][i]['values']['fullpath'];
			else
			if (this._aValues.fullpath)
				tmp.fullpath = this._aValues.fullpath;
			else
			if (this._sItemID)
				tmp.folder = this._sAccountID+'/'+this._sFolderID+'/'+WMItems.__serverID(this._sItemID);

			out.push(tmp);
		}

		if (this._aValues['PUSH_ATTACHMENTS']){
			this.X_ATTACHMENTS.list._value({
				path: this._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0, this._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
				values: [
					{
						'name': this._aValues['PUSH_ATTACHMENTS'][0]['title'],
						'id': this._aValues['PUSH_ATTACHMENTS'][0]['id'],
						'size': this._aValues['PUSH_ATTACHMENTS'][0]['size'],
						'class': this._aValues['PUSH_ATTACHMENTS'][0]['embedded'] ? 'item' : 'itemlink',
						'fullpath': this._aValues['PUSH_ATTACHMENTS'][0]['fullpath']
					}
				]
			});
		} else if (this._aValues.fullpath || !this._sItemID)
			this.X_ATTACHMENTS.list._value({'values': out});
		else
			this.X_ATTACHMENTS.list._value({'path': this._sAccountID+'/'+this._sFolderID+'/'+WMItems.__serverID(this._sItemID), 'values': out});

		//Focus to Blank file
		//if (out[0]['class'] == 'document')
			//this.X_ATTACHMENTS.list._rename(this.X_ATTACHMENTS.list.__idtable.length-1);
	//	else
			//this.__checkEnableForm(false);

		var extension;
		var mime = '';
		if (this._aValues.PUSH_ATTACHMENTS){
			extension = (this._aValues.PUSH_ATTACHMENTS[0].title || '').split('.').pop();
		} else if(Array.isArray(this._aValues['ATTACHMENTS'])) {
			extension = (this._aValues['ATTACHMENTS'][0]['values']['ATTDESC'] || '').split('.').pop();
		} else{
			Object.keys(this._aValues['ATTACHMENTS']).filter(function(key) {
				return this._aValues.ATTACHMENTS[key].values.ATTTYPE === 'attachment';
			}, this).forEach(function(key) {
				extension = (this._aValues.ATTACHMENTS[key].values.ATTDESC || '').split('.').pop();
				this._aValues.ATTACHMENTS[key].values.ATTPARAMS && (mime = this._aValues.ATTACHMENTS[key].values.ATTPARAMS.split('=')[1]);
			}, this);
		}

		this.X_ATTACHMENTS._main.style.display = 'none';

		var label;
		if(~mime.indexOf('video')) {
			label = getLang('ITEMVIEW::MIME_VIDEO');
		} else if(~mime.indexOf('audio')) {
			label = getLang('ITEMVIEW::MIME_SOUND');
		} else if(~mime.indexOf('image')) {
			label = getLang('ITEMVIEW::MIME_IMG');
		} else if(~mime.indexOf('template')) {
			label = getLang('ITEMVIEW::MIME_TPL');
		} else if(~mime.indexOf('spreadsheet') || ~mime.indexOf('ms-excel')) {
			label = getLang('ITEMVIEW::MIME_SS');
		} else if(~mime.indexOf('document') || ~mime.indexOf('msword')) {
			label = getLang('ITEMVIEW::MIME_DOC');
		} else if(~mime.indexOf('compressed')) {
			label = getLang('ITEMVIEW::MIME_ARCHIVE');
		} else {
			switch(extension.toLowerCase()) {
				case 'pdf':
					label = getLang('ITEMVIEW::MIME_PDF');
				break;
				case 'txt':
					label = getLang('ITEMVIEW::MIME_TXT');
				break;
				case 'docx':
					label = getLang('ITEMVIEW::MIME_DOC');
				break;
				case 'xlsx':
					label = getLang('ITEMVIEW::MIME_SS');
				break;
				case 'pptx':
					label = getLang('ITEMVIEW::MIME_PRESENTATION');
				break;
				default:
					label = getLang('ITEMVIEW::MIME_TXT');
				break;
			}
		}

		var that = this;
		if(!this._getAnchor('icon')) {
			that = this.maintab.tab1;
		} else {
			this.x_btn_ok._value('MAIN_MENU::NEW_DOCUMENT');
			this.x_btn_ok._main.classList.add('new_document');
		}

		that._getAnchor('icon').appendChild(mkElement('div', {
			className: 'icon ico_' + extension,
			text: label
		}));

		that._getAnchor('extension').textContent = '.' + extension;

		if (!WMFolders.getAccess({aid: this._sAccountID, fid: this._sFolderID}).write) {
			this._sFolderID = Mapping.getDefaultFolderForGWType('F');
			this._sAccountID = sPrimaryAccount;
		}
		this.__changeFolder(this._sAccountID, this._sFolderID, this._sItemID);

		if(this._skip_teamchat_choose_folder && ~['I', 'Y'].indexOf(WMFolders.getType([this._sAccountID, this._sFolderID]))) {
			this.__tab1.x_folders._destruct();
		} else {
			this.__tab1.x_folders._value('DOCUMENT::CHANGE_FOLDER');
		}

		that._getAnchor('name').value = this.X_ATTACHMENTS.__idtable[0].name.split('.').slice(0, -1).join('.');
		that._getAnchor('name').focus();
		that._getAnchor('name').setAttribute('placeholder', getLang('DOCUMENT::NAME_HELPER'));
		that._getAnchor('name').addEventListener('keyup', function(evn) {
			if(evn.keyCode === 13) {
				if(!this.__checkEnableForm()) {
					return;
				}
				evn.target.disabled = true;
				evn.target.setAttribute('disabled', 'disabled');
				evn.target.blur();
				return this.x_btn_ok._onclick();
			}
			for(var i in this.X_ATTACHMENTS.__idtable) {
				this.X_ATTACHMENTS.__idtable[i].description = that._getAnchor('name').value + '.' + extension;
			}

			//Title
			var sName = getLang('FILE::FILE');
			if (this.X_ATTACHMENTS.__idtable)
				for (var i = this.X_ATTACHMENTS.__idtable.length-1;i>-1;i--)
					if (!this.X_ATTACHMENTS.__idtable[i].removed && this.X_ATTACHMENTS.__idtable[i].name){
						sName = this.X_ATTACHMENTS.__idtable[i].description || this.X_ATTACHMENTS.__idtable[i].name;

						if (sName.length>64)
							sName = sName.substr(0,50)+'..'+ Path.extension(sName);

						break;
					}

			this._title(sName + (me._aValues.EVNFOLDER ? ' - ' + me._aValues.EVNFOLDER : '') + (me._aValues.EVNEXPIRE > 0 ? ' - ' + getLang('FILE::EXPIRE', [IcewarpDate.unix(me._aValues.EVNEXPIRE).format('L')]) : ''), true);

			this.__checkEnableForm();
		}.bind(this));

		this._colapsed = true;
		that._getAnchor('separator') && that._getAnchor('separator').addEventListener('click', function() {
			this._onresize();
			if(this._colapsed) {
				that._getAnchor('separator_text').textContent = getLang('DOCUMENT::SHOW_LESS_OPTIONS');
				that._getAnchor('separator').classList.add('less');
				var frmtbl = that._getAnchor('main').querySelector('.popupmaindialog > .frmtbl');
				frmtbl && this._size(false, frmtbl.offsetHeight + 88);
				this._resizable(true);
			} else {
				that._getAnchor('separator_text').textContent = getLang('DOCUMENT::SHOW_MORE_OPTIONS');
				that._getAnchor('separator').classList.remove('less');
				this._size(740, 315);
				this._resizable(false);
			}
			this._colapsed = !this._colapsed;
		}.bind(this));

		// this.__checkEnableForm(!this._aValues['PUSH_ATTACHMENTS']);
	}

	//General
	loadDataIntoForm(this.__tab1, this._aValues);
	if (this.__readonly && this.__tab1._type !== 'obj_tab'){
		this.EVNNOTE && this.EVNNOTE._disabled(true);
		this.EVNTYPE && this.EVNTYPE._readonly(true);
	}

	//Resources
	if (this.maintab && this.maintab['revisions'])
	this.maintab['revisions']._onactive = function (bFirstTime) {
		if (bFirstTime){
			//Layout
			msiebox(this._getAnchor('msiebox'));

			var btncheck = function (){
				var l = me.maintab['revisions'].list._value().length<1,
					b = me.x_btn_ok._disabled() || l || (me.__readonly?true:false);

				me.maintab['revisions'].download._disabled(l);
				me.maintab['revisions'].edit._disabled(b);
				me.maintab['revisions'].revert._disabled(b);
				me.maintab['revisions'].remove._disabled(b);
			};

			//DataGrid
			this.list.__sortColumn = 'DATE';
			this.list.__sortType = 'desc';
			this.list._addColumns({
				DATE:{title:"DATAGRID_ITEMS_VIEW::DATE",width:120,arg:{sort:'asc'}},
				OWNER:{title:"DATAGRID_ITEMS_VIEW::SNDOWNER",width:200,arg:{sort:'asc'}},
				COMMENT: {title: "MAIL_VIEW::COMMENT", width: 100, mode:'%', encode: true}
			});
			this.list._onchange = function(){
				btncheck();
			};
			this.list._fill2 = function(){
				var aData = [];
				for (var id in me._aValues['REVISIONS']){
					aData.push({data:{
						DATE:[IcewarpDate.unix(me._aValues['REVISIONS'][id].values.REVTIMESTAMP).format('L'),me._aValues['REVISIONS'][id].values.REVTIMESTAMP],
						OWNER:me._aValues['REVISIONS'][id].values.REVEMAIL,
						COMMENT:[me._aValues['REVISIONS'][id].values.REVCOMMENT,'',me._aValues['REVISIONS'][id].values.REVCOMMENT]
					},
					arg:{id:id}});
				}

				this._fill(aData);
				btncheck();
			};

/*
 [425b751de38f]
.. [values]
.... [REVID](string) = 425b751de38f
.... [REVHASH](string) = de893bbfa2ae667f1640abad07174341
.... [REVTIMESTAMP](string) = 1361972460
.... [REVOWNER](string) = 3f4e548304eb
.... [REVCOMMENT](string) = My first document revision

*/
			this.list._fill2();

			this.list._ondblclick = function(){
				this._parent.download._onclick();
			};
			this.list._oncontext = function(e,elm,arg,row,col){
				if (arg && arg.id){

					if (inArray(this._value(),row)<0)
						this._value([row]);

					var cmenu = gui._create('cmenu','obj_context');
						cmenu._fill([
							{title:'ATTACHMENT::DOWNLOAD',arg:[me.maintab.revisions.download,'_onclick']},
							{title:'ITEM::EDIT_COMMENT',arg:[me.maintab.revisions.edit,'_onclick'],disabled:me.maintab.revisions.edit._disabled()},
							{title:'ITEM::REVERT',arg:[me.maintab.revisions.revert,'_onclick'],disabled:me.maintab.revisions.revert._disabled()},
							{title:'ATTACHMENT::REMOVE',arg:[me.maintab.revisions.remove,'_onclick'],disabled:me.maintab.revisions.remove._disabled()}
						]);
						cmenu._place(e.clientX,e.clientY);
				}
			};

			//Buttons
			var click = function(){

				if (this._disabled()) return;

				for (var attid in me._aValues['ATTACHMENTS'])
					break;

				var v  = this._parent.list._value();
				if (attid && v){

					//Multiple
					if (this._name == 'remove'){
						var uids = [];
						for(var i in v)
							if (this._parent.list._aData[v[i]] && this._parent.list._aData[v[i]].arg)
								uids.push({uid:this._parent.list._aData[v[i]].arg.id});

						if (uids.length)
							WMItems.add([me._sAccountID,me._sFolderID,me._sItemID],{revisions:uids},'','','',[function(bOK){

								if (bOK == true){

									for(var i in uids)
										delete me._aValues['REVISIONS'][uids[i].uid];

									me.maintab.revisions.list._fill2();
								}
								//Error
								else{

								}
							}]);
					}
					else
					//Single
					if ((v = v[0]) && (v = this._parent.list._aData[v]) && (v = v.arg))
						switch (this._name)	{
							case 'download':
								downloadItem(buildURL({'sid': dataSet.get('main', ['sid']), 'class': 'revision', 'fullpath': me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID)+'|'+v.id+'/'+attid}));
								break;

							case 'edit':
								this._parent.list._editColumn(this._parent.list._value()[0],'COMMENT',{},[function(sComment){
									WMItems.add([me._sAccountID,me._sFolderID,me._sItemID],{revisions:[{uid:v.id, values:{revcomment:sComment}}]},'','','',[function(bOK){
										if (bOK == true)
											me._aValues['REVISIONS'][v.id].values.REVCOMMENT = sComment;

										me.maintab.revisions.list._fill2();
									}]);
									return sComment.escapeHTML();
								}]);
								break;

							case 'revert':
								WMItems.action({aid:me._sAccountID,fid:me._sFolderID,iid:me._sItemID,values:{revision:v.id}},'revert_to_revision',[function(bOK){
									me._destruct();
									Item.openwindow([me._sAccountID,me._sFolderID,me._sItemID]);
								}]);

								break;
						}
				}
			};

			this.download._onclick = click;
			this.edit._onclick = click;
			this.revert._onclick = click;
			this.remove._onclick = click;
		}
	};
	// this.__checkEnableForm();

};

_me.__changeFolder = function (sAccount, sFolder, sItem) {
	this._sAccountID = sAccount;
	this._sFolderID = sFolder;
	this._id = [sAccount, sFolder];

	if (sItem) {
		this._id.push(sItem);
	}

	var sPath, data = dataSet.get('folders', [sAccount, sFolder]);

	if (WMFolders.getType(this._id) == 'I' && data.OWNER && ~data.OWNER.indexOf('##internalservicedomain.icewarp.com##')){
		var yf = dataSet.get('folders', [sAccount, Path.basedir(sFolder)]);
		sPath = (yf.NAME || yf.RELATIVE_PATH) + '/' + data.NAME;
	}
	else{
		if (sFolder.indexOf(sPrimaryAccountSPREFIX) === 0)
			sFolder = sFolder.substr(sPrimaryAccountSPREFIX.length);

		if (data.NAME)
			sPath = Path.basedir(sFolder) + '/' + data.NAME;
		else
			sPath = sFolder;
	}

	(this._getAnchor('folder') ? this : this.maintab.tab1)._getAnchor('folder').textContent = sPath;

	//Update footer
	this.__sharetype();
};

_me.__saveItems = function(aValues) {

	var is_teamchat_folder = WMFolders.getType({aid: this._sAccountID, fid: this._sFolderID}) === 'I';

	if(this.__tab1.EVNNOTE.select && !is_teamchat_folder) {
		aValues['values']['EVNDESCFORMAT'] = (this.__tab1.EVNNOTE.select._value() === 'disabled')? 'text/plain':'text/html';
		this.__tab1.EVNNOTE.__output_format = aValues.values.EVNDESCFORMAT !== 'text/plain';
	} else {
		aValues['values']['EVNDESCFORMAT'] = 'text/plain';
		this.__tab1.EVNNOTE.__output_format = false;
	}
	if(is_teamchat_folder && this.__tab1.EVNNOTE.__doc) {
		aValues.values.EVNNOTE = this.__tab1.EVNNOTE.__doc.body.textContent.replace(/\n/g, ' ');
	} else {
		aValues.values.EVNNOTE = this.__tab1.EVNNOTE._value();
	}

	var addon;
	aValues['values']['EVNCLASS'] = 'F';
	if (!Is.Empty(addon = this.X_ATTACHMENTS.list._value())) {

		if (this._sItemID || addon.length == 1){
			aValues['values']['EVNLOCATION'] = aValues['values']['EVNTITLE'] = addon[addon.length-1]['values']['description'];
			aValues['values']['EVNRID'] = aValues['values']['EVNLOCATION'];
			aValues['values']['EVNCOMPLETE'] = this.X_ATTACHMENTS.list._getSize();
		}

		var now = new IcewarpDate();
		aValues['values']['EVNSTARTDATE'] = now.format(IcewarpDate.JULIAN);
		aValues['values']['EVNSTARTTIME'] = now.format(IcewarpDate.JULIAN_TIME);

		//EDIT since 7.10.2009 13:42:20
		if (this._sItemID && !Is.Empty(this._aValues) && addon.length>1){
            addon[1].uid = addon[0].uid;
            addon.shift();
		}

		//Rename on Item level
		if (addon.length == 1 && addon[0].values.description)
			aValues.values.EVNTITLE = aValues.values.EVNLOCATION = aValues.values.EVNRID = addon[0].values.description;

		aValues['ATTACHMENTS'] = addon;
	}
};

_me._openFileAndListFolder = function (bOk,aData,bAuto){

	this._listFolder(bOk,aData,bAuto);

	if(!bAuto && bOk === true && aData.name) {
		if (Item.officeSupport(aData.name)) {
			var arg = {
				EVN_ID: aData.teamchat_link || aData.id,
				EVNCLASS: aData.teamchat_link?'R':'F',
				EVNTITLE: aData.name,
				aid: this._id[0],
				fid: this._id[1],
				iid: WMItems.__clientID(aData.id)
			};

			Item.officeOpen(arg,[Item.downloadFile,[[arg['aid'], arg['fid'], arg['iid']]]],Path.extension(aData.name).toLowerCase());
		} else {
			Item.editFile([this._id[0], this._id[1], WMItems.__clientID(aData.id)]);
		}
	}
};
