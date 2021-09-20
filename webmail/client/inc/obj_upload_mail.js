_me = obj_upload_mail.prototype;
function obj_upload_mail(){};

_me.__constructor = function(){
	var me = this;

	this._draw('obj_upload_mail','main',{disable_item:GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')=='1'});

	this.list = this._parent.attach;

	this.list._value = function(v){
		if (typeof v == 'undefined'){
			var out = [];
			for (var i in this.__idtable)
				if (this.__idtable[i]['class'] == 'attachment' && !this.__idtable[i]['fullpath']){
					if (this.__idtable[i]['removed'])
						out.push({uid:this.__idtable[i].id});
				}
				else
				if (!this.__idtable[i]['removed']){
					this.__idtable[i]['class'] = this.__idtable[i]['class'] || 'file';
					this.__idtable[i]['fullpath'] = this.__idtable[i]['fullpath'] || (this.__idtable[i]['folder']+"/"+this.__idtable[i]['id']);
					out.push(this.__idtable[i]);
				}

			return {attachments:out};
		}
		else
		if (v.attachments)
			for(var i in v.attachments)
				this._add(v.attachments[i].values);
	};

	////// FILE //////
	this.file._onuploadstart = function (){
		if (me._onuploadstart)
			me._onuploadstart();
	};
	this.file._onuploadprogress = function(){
		if (me._onuploadprogress)
			me._onuploadprogress.apply(me, arguments);
	};
	this.file._onuploadsuccess = function(file){
		me._add(file);

		if (me._onuploadsuccess)
			me._onuploadsuccess(file);
	};
	this.file._onuploadend = function (){
		if (me._onuploadend)
			me._onuploadend();
	};

	////// ITEM //////
	if (this.item)
		this.item._onclick = function (defaultFolderType){
			var sFolder;
			var allowed_folder_types = ['M', 'C', 'F', 'E', 'J', 'N', 'T', 'X'];

			if(Alfresco.enabled()) {
				allowed_folder_types.push('K');
				sFolder = Alfresco.getLastFolder();
			}

			if (!defaultFolderType) { //Documents folder is default
				defaultFolderType = 'F';
				sFolder = Mapping.getDefaultFolderForGWType('F');
				if (!dataSet.get('folders',[sPrimaryAccount,sFolder]))
					sFolder = '';
			}

			gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [me, '__addItems'], sPrimaryAccount,sFolder,'','r', false, allowed_folder_types, defaultFolderType);
		};
};

/**
 * PUBLIC                                OK;
 **/

_me._add = function(aArg){

	aArg.folder = this.file._getFolder();

	if (this.list._add(aArg) && this._onuploadsuccess)
		this._onuploadsuccess(aArg);
};

_me.__addItems = function (aItems) {
	if (this._onuploadstart)
		this._onuploadstart();
	var count = aItems.length;
	aItems.forEach(function (item, i) {
		var aItemsInfo = {aid: item.aid, fid: item.fid, iid: item.id, values: []};
		var me = this;
		WMItems.list(aItemsInfo, '', '', '', [function (aData) {
				var attachements = aData[item.aid][item.fid][item.id].ATTACHMENTS;
				var attachement = false;
				for (var j in attachements) {
					if (attachements[j].values.ATTDESC === item.title) {
						attachement = j;
						break;
					}
				}
				var out = {
					'name': item['title'],
					'attachement': attachement,
					'id': item['id'],
					'size': item['size'],
					'class': item['type'] || (item['embedded'] ? 'item' : 'itemlink'),
					'fullpath': item['fullpath']
				};

				if (out['class'] == 'item')
					for (var j in me.list.__idtable)
						if (me.list.__idtable[j]['id'] == item['id'] && me.list.__idtable[j]['class'] == 'item')
							continue;

				me.list._add(out);
				if(!--count) {
					if (me._onuploadend)
						me._onuploadend();
				}
			}]);
	}, this);
};


_me._dropzone = function(elm, body, css, callback) {

	//Local disk
	this.file._dropzone(elm, body, css, callback);

	//From Client
	if (GWOthers.getItem('RESTRICTIONS', 'disable_attach_item')<1){
		this.__eDropZoneTarget = elm || this._main;
		gui.frm_main.dnd.registr_drop(this,['item']);
	}
};

	_me._active_dropzone = function(v){
		if (v){
			this.__eDropZone = mkElement('div',{className:'dropzone'});
			this.__eDropZoneTarget.appendChild(this.__eDropZone);
			return this.__eDropZone;
		}
		else
		if (this.__eDropZone){
			if (this.__eDropZone.parentNode)
				this.__eDropZone.parentNode.removeChild(this.__eDropZone);

			this.__eDropZone = null;
		}
	};


	_me._ondrop = function(v){
		if ((v = v.value)){

			var sType = WMFolders.getType(v[0]),
				aCol = [];

			switch(sType){
				case 'M': aCol.push('SUBJECT'); break;
				case 'C': aCol.push('ITMCLASSIFYAS'); break;
				case 'F': aCol.push('EVNLOCATION', 'EVNCOMPLETE'); break;
				case 'E':
				case 'J':
				case 'N':
				case 'T': aCol.push('EVNTITLE'); break;
				default:  return;
			}

			//Search string
			for (var ids = [], i = 0; i<v.length;i++)
				if (v[i].iid)
					ids.push(WMItems.__serverID(v[i].iid));

			if (ids.length){
				var me = this;

				WMItems.list({aid:v[0].aid, fid:v[0].fid, values:aCol, filter:{search:'items:('+ ids.join(' OR ') +')'}},'','','',[function(aData){

					if (aData && (aData = aData[v[0].aid]) && (aData = aData[v[0].fid])){

						var out = [], tmp;

						for(var id in aData)
							if (Is.Object(aData[id]) && id !== '@'){

								tmp = {
									id:id,
									aid:v[0].aid,
									fid:v[0].fid,
									type:'item',
									fullpath:v[0].aid +'/'+ v[0].fid +'/'+ WMItems.__serverID(id)
								};

								if (aData[id].EVNCOMPLETE)
									tmp.size = aData[id].EVNCOMPLETE;

								switch (sType) {
									case 'M': tmp.title = (aData[id]['SUBJECT']?aData[id]['SUBJECT']+' - ':'') + WMItems.__serverID(id) +'.eml'; break;
									case 'C': tmp.title = (aData[id]['ITMCLASSIFYAS'] || WMItems.__serverID(id)) +'.vcf'; break;
									case 'F': tmp.title = aData[id]['EVNLOCATION']; break;
									case 'E':
									case 'J':
									case 'N':
									case 'T': tmp.title = (aData[id]['EVNTITLE'] || WMItems.__serverID(id)) +'.ics'; break;
								}

								out.push(tmp);
							}

						if (out.length)
							me.__addItems(out);
					}
				}]);

			}
		}
	};
