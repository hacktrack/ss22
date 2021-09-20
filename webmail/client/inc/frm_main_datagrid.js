_me = frm_main_datagrid.prototype;
function frm_main_datagrid(){};

_me.__constructor = function(){
	var me = this;

	if (this._anchors['container'])
		this._create("itemview","obj_itemview",'container','','preview');

	this._create("list","obj_datagrid2_ext");

	this.list.info = {_value:function(iSelect,iTotal){
		var aFolder = me.list._getFolder();
		gui.frm_main._title(dataSet.get('folders',[aFolder.aid,aFolder.fid,'NAME']) || Path.basename(aFolder.fid),iSelect,iTotal);
	}};

	this.list._tabIndex();
};

_me.__update = function(aFolder){
	if (!aFolder['aid'] || !aFolder['fid']) return;

	var aSort = Cookie.get(['views',aFolder.aid,aFolder.fid,'sort']);
	this.list._serverSort(aFolder,aSort['column'],aSort['type']);
};

_me._changeview = function(sView){

	if (!sView)
		switch(this._type){
			case 'frm_main_datagrid': sView = 'list_view'; break;
			case 'frm_main_datagrid_view': sView = 'list_wide'; break;
 			case 'frm_main_datagrid_wide': sView = 'list'; break;
		}

	this._parent._selectView(this.list._getFolder(),sView,false,'',false,this.list?this.list._SQLsearch:'');
};

/**
 * @Note: funkce ktera zobrazuje a skryva quicksearch toolbar
 * @Date: 28.5.2007 11:39:16
 **/
_me._showsearch = function(aFolder,bFocus,sFilter){

	if (aFolder){
		var me = this;
		var sFType = WMFolders.getType(aFolder);

		if (sFType == 'E'){
			if (!this.toolbar){
				addcss(this._main, 'toolbar');
				this._create('toolbar','obj_hmenu_calendar_view','','');
			}

			this.toolbar.__menu(aFolder);
		}
		else
		if (this.toolbar){
			this.toolbar._destruct();
			removecss(this._main, 'toolbar');
		}

/*
		if (GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1'){
			this.list._SQLsearch = gui.frm_main.search._value();
		}
		else{
			this.list._SQLsearch = '';
			gui.frm_main.search._deactivate();
		}
*/
		var old = gui.frm_main.search._getFolder(),
			keep = (old && WMFolders.getType(old) == WMFolders.getType(aFolder) && GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1');

		//Set Active Folder
		gui.frm_main.search._setFolder(aFolder);

		//Quick Upload

		if ((sFType == 'C' || sFType == 'F') && WMFolders.getAccess(aFolder,'write')){

			if (this.upload)
				this.upload._destruct();

			var sTarget = 'main';
			switch(this._type){
				case 'frm_main_datagrid_view':
	 			case 'frm_main_datagrid_wide':
	 				sTarget = 'list';
			}
			// sFType !== 'F' && addcss(this._main, 'quick');

			this._create('upload','obj_upload_edit', sTarget,'quick_upload', 'ATTACHMENT::QUICK_ADD', sFType == 'C'?'ATTACHMENT::QUICK_CONTACT':'');

			this.upload._onuploadstart = function() {
				me._uploading = true;
				me.list._create('progress', 'obj_upload_info', '', 'bottom');
			};

			this.upload._onuploadend = function(arg){
				me._uploading = false;
				if(this._destructed)
					return;

				me.list && me.list.progress && me.list.progress._destruct();

				var v = this._value();

				if (v && v.length && aFolder)
					if (sFType == 'C'){

						storage.library('wm_import');
						var oImport = new wm_import();

						for(var i = 0; i<v.length; i++)
							if (v[i].values && Path.extension(v[i].values.description) == 'vcf')
								oImport.import_data({'action':'vcard','account':aFolder.aid,'folder':aFolder.fid,'lines':0,'path':v[i].values.fullpath}, [
									function(bOK){
										if (bOK === true){

											me.__update(aFolder);

											if (gui.notifier)
												gui.notifier._value({type: 'item_saved', args: [aFolder.aid, aFolder.fid], group: 'quick_vcf'});
										}
									}]);
					}
					else{
						var now = new IcewarpDate(),
							aValues = {
								values:{
									EVNSHARETYPE:GWOthers.getItem('DEFAULT_CALENDAR_SETTINGS','file_sharing'),
									EVNSTARTDATE:now.format(IcewarpDate.JULIAN),
									EVNSTARTTIME:now.hour()*60 + now.minute()
								},
								ATTACHMENTS:v
							};

						WMItems.add([aFolder.aid, aFolder.fid], aValues, '', '','',[function(aResponse){
							me.__update(aFolder);
							if (Is.Array(aResponse) && aResponse[0] && gui.notifier)
								gui.notifier._value({type: 'item_saved', args: [aFolder.aid, aFolder.fid]});
						}]);
					}

				this.file._setFolder('');
				this._remove();
			};

			this.upload._onuploadsuccess = function(file){
				me.list && me.list.progress && me.list.progress._handler(null);
			};

			this.upload._onuploadprogress = function(file, a, b, xhr){
				me.list && me.list.progress && me.list.progress._value(file.name, a, b, [function(){xhr.abort()}]);
			};

			this.upload._dropzone(this._getAnchor(sTarget), function(){
				if (sFType == 'C')
					return template.tmp('dropzone',{title:getLang('CONTACT::DROP_TITLE'), body:getLang('CONTACT::DROP_BODY')});
				else
					return template.tmp('dropzone',{title:getLang('ATTACHMENT::DROP_TITLE'), body:getLang('ATTACHMENT::DROP_BODY')});
			}, 'item small');

		}
		else
		if (this.upload){
			this.upload.progress && this.upload.progress._destruct();
			this.upload._destruct();
			removecss(this._main,'quick');
		}

		//Set Filter
		if (sFilter){
			this.list._SQLsearch = sFilter;
			gui.frm_main.search._value(sFilter,true); //'#' +
		}
		else
		if (keep)
 			this.list._SQLsearch = gui.frm_main.search._value();
		else{
			this.list._SQLsearch = '';
			gui.frm_main.search._deactivate();
		}

		this.list._SQLfulltext = '';

		gui.frm_main.search._onsearch = function(v){

			//Search in from: for Black/White List
			if (v && aFolder.aid == sPrimaryAccount && aFolder.fid.indexOf('SPAM_QUEUE/') == 0 && v.indexOf('from:')<0)
				v = 'from:"'+v+'"';

			me.list._SQLsearch = v;
			me.list._serverSort();
		}

		if (bFocus)
			gui.frm_main.search._focus();
	}
	else
	if (this.list)
		this.list._SQLsearch = sFilter || '';
};
