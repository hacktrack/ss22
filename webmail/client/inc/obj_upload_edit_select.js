_me = obj_upload_edit_select.prototype;
function obj_upload_edit_select(){};


_me.__constructor = function(){
	var me = this;
	this.__atts = {};
    this.__idtable = [];

    this.__itempath = '';

	this.attachments.__sortColumn = 'name';
	this.attachments._addColumns({
		ico:{width:20,css:'file_type',type:'static'},
		name:{title:"DATAGRID_ITEMS_VIEW::EVNFILENAME",width:100, mode:'%', encode: true, arg:{sort:'asc'}},
		size:{title:"DATAGRID_ITEMS_VIEW::EVNFILESIZE",width:100,css:'size',arg:{sort:'asc'}}
	});

	// If dropbox is allowed add functionality otherwise remove button
	if(GWOthers.getItem('RESTRICTIONS','disable_dropbox')>0)
		this.dropbox._destruct(); // Dropbox disabled, remove button
	else
		this.dropbox._onclick = function() {
			if(!(GWOthers.getItem('EXTERNAL_SETTINGS', 'dropbox_app_key') || '').length) // Dropbox but no app_key
				gui.notifier._value({type: 'alert', args: {header: 'DROPBOX::ERRORALERT', text: 'DROPBOX::MISSINGKEY'}});
			else if(typeof Dropbox == "undefined") // Dropbox failed loading
				gui.notifier._value({type: 'alert', args: {header: 'DROPBOX::ERRORALERT', text: 'DROPBOX::UNAVAILABLE'}});
			else
				Dropbox.choose({linkType: 'preview', success: function(files) {
					var aItems = [];
					for(var i in files)
						aItems.push({type: 'url', title: files[i].name, fullpath: files[i].link, size: files[i].bytes});
					me.__addItems(aItems);
				}});
		};

	this.attachments._ondblclick = function(e,elm,arg,id){
		if (arg && Is.Defined(arg.id)){
			me._save(arg.id, 'auto');
		}
	};

	this.attachments._oncontext = function(e,elm,arg,sLineId,sColumn){

		//Klikly jsme na místo bez položek?
		if (typeof sLineId == 'undefined') return;

		gui._create("cmenu","obj_context",'','',me);

		var aMenu = [],
			idtbl = me.__idtable[arg.id];

		var x = new RegExp(/\.eml$/ig);

		if (idtbl){
			if (idtbl['class'] == 'itemlink' || (idtbl['class'] == 'attachment' && (x.test(idtbl.name) || (sPrimaryAccountWebDAV && Item.officeSupport(idtbl.name))))){
				var bIWD =  dataSet.get('accounts', [sPrimaryAccount, 'OFFICE_SUPPORT']) == 'true';
				aMenu.push({
					title:'POPUP_ITEMS::OPEN',
					arg: [me,'_save',[sLineId,'force']],
					'nodes':[
						{"title":'DOCUMENT::OPENDOCUMENT','arg':[me,'_save',[sLineId,'edit']], disabled: !bIWD},
						{"title":'DOCUMENT::OPENDOCUMENTVIEW','arg':[me,'_save',[sLineId,'view']], disabled: !bIWD},
						{"title":'OFFICELAUNCHER::OFFICESUITE','arg':[me,'_save',[sLineId,'external']]}
					]
				});
			}
			else
			if (Path.extension(idtbl.name) == 'pdf'){
				aMenu.push({
					title:'POPUP_ITEMS::OPEN',
					arg: [me,'_save',[sLineId, 'force']]
				});
			}

			if (idtbl['class'] != 'itemlink'){
				aMenu.push(
					{"title":'ATTACHMENT::DOWNLOAD','arg':[me,'_save',[sLineId]]},
					{"title":'ATTACHMENT::DOWNLOAD_ALL','arg':[me,'_save',[]],disabled:me.__disable_save_all}
				);
			}
		}

		aMenu.push({"title":'ATTACHMENT::REMOVE','arg':[me,'_remove',[sLineId]],disabled:me.__disabled});

		gui.cmenu._fill(aMenu);
		gui.cmenu._place(e.clientX,e.clientY);
	};

	this.add_item._onclick = function() {
		// In case "Attach from webclient" is disabled, just show browser upload dialog
		if ('1' === GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')) {
			(me.upload || me.file)._click();
			return;
		}

		//Documents folder is default
		var sFolder = Mapping.getDefaultFolderForGWType('F');
		if (!dataSet.get('folders',[sPrimaryAccount,sFolder]))
			sFolder = '';

		gui._create('insert_item', 'frm_insert_item', '', '', [me, '__addItems'], sPrimaryAccount,sFolder,void 0, void 0, void 0, ['M', 'C', 'F', 'E', 'J', 'N', 'T', 'X']);
	};
	this.remove._onclick = function() {
		var out = [],
			vd = me.attachments.__valueData;
		for (var i in vd)
			out.push(vd[i].id);

		me.__deleteItems(out);
	};

	this.file._main.style.display = 'none';

	////// FILE //////
	this.file._onuploadstart = function(){
		me.__disable_save_all = true;
		me.attachments._create('progress', 'obj_upload_info', '', 'bottom');

		if (me._onuploadstart)
			me._onuploadstart();
	};
	this.file._onuploadprogress = function(file, a, b, xhr){
		me.attachments.progress._value(file.name, a, b, [function(){xhr.abort()}]);
	};
	this.file._onuploadsuccess = function(file){
		me.attachments.progress && me.attachments.progress._handler(null);
		me._add(file);
	};
	this.file._onuploadend = function (){
		me.__disable_save_all = false;
		me.attachments.progress && me.attachments.progress._destruct();

		if (me._onuploadend)
			me._onuploadend();
	};

	this._main.addEventListener('paste',function (e) {
		if(!me.file || !me.file.file || !me.file.file.__ondropfile) {
			return;
		}
		var items = (e.clipboardData || (e.originalEvent || {}).clipboardData || {}).items || (window.clipboardData || {}).files || [];
		for (var i = 0; i < items.length; i++) {
			if (items[i].getAsFile && items[i].type.indexOf('image') === 0) {
				var file = items[i].getAsFile();
				try {
					file = new File([file], 'clipboard-' + new IcewarpDate() + '.png', {
						type: items[i].type
					});
				} catch(e) {}
				me.file.file.__ondropfile([file]);
			}
		}
	});
};

_me._value = function(v){
	if (typeof v == 'undefined'){
		var out = [];

		for (var i in this.__idtable)
			if ((this.__idtable[i]['class'] == 'attachment' || this.__idtable[i]['class'] == 'P' || this.__idtable[i]['class'] == 'itemlink' || this.__idtable[i]['class'] == 'url') && !this.__idtable[i]['fullpath']){
				if (this.__idtable[i]['removed'])
					out.push({uid:this.__idtable[i].id});
			}
			else
			if (!this.__idtable[i]['removed'])
				out.push({values:{
					'class':this.__idtable[i]['class'] || 'file',
					description: this.__idtable[i]['name'],
					size: this.__idtable[i]['size'] || 0,
					fullpath: this.__idtable[i]['fullpath'] || ((this.__idtable[i]['folder'] || this.file._getFolder())+"/"+this.__idtable[i]['id'])}});

		return out;
	}
	else{

		if (v.path)
			this.__itempath = v.path;
		//this.file._setFolder(v.path);

	    if (v.values)
			for(var i in v.values)
                this.__idtable.push(v.values[i]);

        this.__fillDataGrid();
	}
};

_me._add = function(aArg){

	if (!aArg.fullpath)
		aArg.folder = this.file._getFolder();

	aArg['class'] = aArg['class'] || 'file';

	this.__idtable.push(aArg);

	//Add gui element
    this.__fillDataGrid();
};

_me._remove = function (id){
	if (typeof id == 'undefined'){
	    for(var i in this.__idtable)
	        if (!this.__idtable[id].removed)
	        	this._remove(i);
	}
	else
	if (this.__idtable[id] && !this.__idtable[id].removed){
		this.__idtable[id].removed = true;
		this.__fillDataGrid();
	}
};

_me.__fillDataGrid = function(){
	var aData = {};
	for (var i in this.__idtable)
		if (!this.__idtable[i]['removed'])
			aData[i] = {id:i,data:{ico:['','','','ico_'+ Path.extension(this.__idtable[i].name)],name:this.__idtable[i].name,size:[parseFileSize(this.__idtable[i].size || 0),parseInt(this.__idtable[i].size || 0)]},arg:{id:i}};

	this.attachments._serverSort(aData);
};

_me.__deleteItems = function(aIDs) {
	for (var i in aIDs)
	    this._remove(aIDs[i]);
};


_me._save = function(id,sMode) {

	//Save ALL
	if (typeof id == 'undefined'){
		var aUrl = {'sid':dataSet.get('main',['sid']),'class':'allattachments','fullpath':this.__itempath || this.file._getFolder()};
		downloadItem(buildURL(aUrl));
	}
	else
	//if ((id = this.attachments._aData[id].id)){
	if (this.__idtable[id]){
		var sClass = this.__idtable[id]['class'] || 'file',
			sFullPath = '';

		switch (sClass) {
			case 'P':
				sClass = 'attachment';
			case 'file':
			case 'attachment':
				if (sMode){
					switch(Path.extension(this.__idtable[id].name)){
						case 'eml':
							var aPath = this.__splitFullPath(this.__idtable[id]['fullpath'] || this.__itempath || this.file._getFolder());
							aPath[2] = WMItems.__clientID(aPath[2] + '|' + this.__idtable[id]['id']);
							OldMessage.openwindow(aPath);
							return;

						case 'pdf':
							if (sMode == 'force' || GWOthers.getItem('LAYOUT_SETTINGS','disable_pdf') != 1){
								var aPath = this.__splitFullPath(this.__itempath);
								var sPath = '';
								if(!aPath || !aPath.length) {
									sPath = 'server/download.php?' + buildURL({'sid': dataSet.get('main', ['sid']), 'class': sClass, 'fullpath': this.__idtable[id]['fullpath'] || ((this.__idtable[id]['folder'] || this.__itempath || this.file._getFolder())+'/'+this.__idtable[id]['id'])});
								} else {
									sPath = 'server/download.php?' + buildURL({'sid':dataSet.get('main',['sid']),'class':'attachment','fullpath':aPath[0]+'/'+aPath[1]+'/'+WMItems.__serverID(aPath[2])+'/'+this.__idtable[id]['id']});
								}
								if(currentBrowser().match(/^MSIE([6-9]|10)$/)) {
									downloadItem(sPath, true);
								} else {
									gui._create('pdf','frm_pdf')._load(sPath, this.__idtable[id].name);
								}
								return;
							}

						default:

							if (sPrimaryAccountWebDAV && this.__itempath && this.__idtable[id].ticket && Item.officeSupport(this.__idtable[id].name)){
								var aPath = this.__splitFullPath(this.__itempath);
								Item.officeOpen({aid:aPath[0],fid:aPath[1],iid:aPath[2],attid:this.__idtable[id].id}, [downloadItem,[this.__idtable[id].ticket,true]], Path.extension(this.__idtable[id].name), sMode);
								return;
							}
					}
				}

			case 'url':
			case 'item':
				sFullPath = this.__idtable[id]['fullpath'] || ((this.__idtable[id]['folder'] || this.__itempath || this.file._getFolder())+'/'+this.__idtable[id]['id']);
				if (this.__idtable[id].attachment){
					sFullPath += '/' + this.__idtable[id].attachment;
					sClass = 'attachment';
				}
				break;

			case 'itemlink':
				var aPath,aValues = '';

				//Just Added (has it's original fullpath)
				if (this.__idtable[id]['fullpath']){
					aPath = this.__splitFullPath(this.__idtable[id]['fullpath']);
					aPath[2] = this.__idtable[id].id;
				}
				//Already saved
				else
				if (this.__itempath){
					aPath = this.__splitFullPath(this.__itempath);
					var aValues = WMItems.list({"aid": aPath[0], "fid": aPath[1], "iid": aPath[2], "atid": this.__idtable[id].id});

					for (var sAccount in aValues)
						for (var sFolder in aValues[sAccount])
							for (var sItem in aValues[sAccount][sFolder]);

					aPath = [sAccount,sFolder,sItem];
					aValues = aValues[sAccount][sFolder][sItem];
				}

				Item.openwindow(aPath,aValues);
				return;
		}

		if (sFullPath) {
			var sUrl = buildURL({'sid': dataSet.get('main', ['sid']), 'class': sClass, 'fullpath': sFullPath});
			if(sClass=='url')
				openItem(sUrl,false,this.__idtable[id]['name']);
			else
				downloadItem(sUrl);
		}
	}
};
	_me.__splitFullPath = function(sPath) {

		var aRet = [];
		var nIndex;

		if ((nIndex = sPath.indexOf('/')) >= 0) {
			aRet[0] = sPath.substring(0, nIndex);
			sPath = sPath.substring(nIndex+1);
		} else return [];

		if ((nIndex = sPath.lastIndexOf('/')) >= 0) {
		    aRet[2] = sPath.substring(nIndex+1);
			sPath = sPath.substring(0, nIndex);
		} else return [];

		aRet[1] = sPath;

		return aRet;
	};

_me.__addItems = function(aItems) {

	for (var i in aItems) {
		var out = {
				'name': aItems[i]['title'],
				'attachment': aItems[i]['title'],
				'id': aItems[i]['id'],
				'size': aItems[i]['size'],
				'class': aItems[i]['type'] || (aItems[i]['embedded'] ? 'item' : 'itemlink'),
				'fullpath': aItems[i]['fullpath']
			};

		if (out['class'] == 'item')
			for (var j in this.__idtable)
				if (this.__idtable[j]['id'] == aItems[i]['id'] && this.__idtable[j]['class'] == 'item')
					continue;

		this._add(out);
	}
};

_me._disabled = function(b){
	if (Is.Defined(b)){
		this.__disabled = b?true:false;

		this.add_item._disabled(this.__disabled);
		this.remove._disabled(this.__disabled);
		this.file._disabled(this.__disabled);
		this.dropbox && this.dropbox._disabled(this.__disabled);
	}
	else
		return this.__disabled;
};
