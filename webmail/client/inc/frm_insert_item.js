_me = frm_insert_item.prototype;
function frm_insert_item(){};

/**
 * Constructor
 *
 * @param {Boolean} bNoFolders      Shows dialog for selection only from files folder
 * @param {Array}   aAllowedFolders Array of folders allowed in left menu. I.e.: ['M', 'E', 'X' ...]
 *
 * @return {undefined}
 */
_me.__constructor = function(aResponse, sAccount, sFolder, sType, sRight, bNoFolders, aAllowedFolders, aPreselectedFolder) {

	this._default_folder = sFolder;
	this._default_account = sAccount;
	this._modal(true);

	var me = this;

	this._dataSet = 'tmp_'+this._name;
	this.__value = {};

	this._title('INSERT_ITEM::INSERT_ITEM');

	// Create form from template
	if (bNoFolders) {
		this._draw('frm_insert_item', 'main');
		this._size(800,500,true);
	} else {
		this._draw('frm_insert_item_folders', 'main');
		this._size(1000,500,true);

		aAllowedFolders.some(function(v,i,a){
			return v === 'F' && a.push('K')
		});
	}

	this._placeShift();

	//Datagrid init
	this.datagrid._default_values = function (sFolType){

		switch(sFolType){
			case 'I':
				return ['EVN_ID','EVNTITLE','EVN_MODIFIED','EVNTHUMBNAILID','EVNTHUMBNAILTIME','EVNPROCESSINGQUEUED','EVNCOMPLETE'];
			case 'K':
				return WMItems.default_values('F');
			default:
				return WMItems.default_values(sFolType);
		}
	};
	this.datagrid._listen_data(this._dataSet,'',true);
	this.datagrid._onchange = function(){
		if (this.__value.length>0){
			var val = {}, tmp;

			for (var i in this.__value)
			    if (me.__value[this.__value[i]])
                    val[this.__value[i]] = me.__value[this.__value[i]];
				else{
                    var f = this._getFolder();
                    if ((tmp = dataSet.get(this._listener_data,[f.aid,f.fid,this.__value[i]])))
						val[this.__value[i]] = tmp;
				}

			me.__value = val;
		}
	};
	this.datagrid._ondblclick = function(){
		me.x_btn_ok._onclick();
	};

	//Tree and filter init
	if (!bNoFolders) {
		this.filter.__filter = this.__filterTree.bind(this);

		if (TeamChatAPI && TeamChatAPI.teamChatOnly()) {
			aPreselectedFolder = 'X';
			aAllowedFolders = ['X', 'I'];
		}

		// In case only one folder is allowed:
		// - hide folders menu
		// - hide helper (it contains screenshot of selection of particular folder types)
		// - make drop zone to occupy whole dialog width
		if (1 === aAllowedFolders.length) {
			addcss(this._main,'nofilter');
		}

		if((aResponse[0].upload || aResponse[0].file)) {
			(aResponse[0].upload || aResponse[0].file)._dropzone(this._main.querySelector('.upload'), function () {
				return template.tmp('dropzone', {
					body: getLang('CHAT::DROP_BODY'),
					title: aResponse[0]._type === 'frm_main_chat' ? getLang('CHAT::DROP_TITLE', [Path.basename(aResponse[0].__fid)]) : getLang('ATTACHMENT::DROPZONE')
				});
			}, 'item');
			(aResponse[0].upload || aResponse[0].file).file._obeyEvent('onuploadstart', [function () {
				if (me && !me._destructed)
					me._destruct();

				return false;
			}]);
			this.upload_button._onclick = function() {
				(aResponse[0].upload || aResponse[0].file).__active_folder = [sAccount, sFolder];
				(aResponse[0].upload || aResponse[0].file)._click();
			};
		} else if(aAllowedFolders) {
			aAllowedFolders = aAllowedFolders.filter(function(folder) {
				return folder !== 'X';
			});
			aPreselectedFolder = aAllowedFolders[0];
		}

		//TREE
		this._create('tree_folder','obj_tree_folder2','tree','scroll', sAccount, sType)._opt = {privateRootActive:false};
		this.filter.__filter(aPreselectedFolder || 'X');

		aAllowedFolders && this.filter.__aTypes.forEach(function(type) {
			var elm = this.filter._getAnchor('buttons').querySelector('span.'+ type.toLowerCase());
			elm && elm.classList[!~aAllowedFolders.indexOf(type) ? 'add' : 'remove']('hidden');
		}, this);

		this.tree_folder._onactivate = function(id){

			var arg = Path.split(id, true),
				sType = dataSet.get("folders",[arg['aid'],arg['fid'],'TYPE']);

			if (me.radio)
				if (sType == 'M'){
					me.radio._disabled(true);
					me.radio._value('embedded');
				}
				else
					me.radio._disabled(false);

			me._search(arg);

			me.datagrid._SQLsearch = sType === 'I' ? 'gchat:files' : '';
			me.datagrid._SQLfulltext = '';
			me.datagrid._serverSort(arg);
			removecss(me._getAnchor('search'), 'active');
		};
	}

	me._getAnchor('search').onclick = function() {
		this.classList.add('active');
		this.querySelector('input').focus();
	};




	//Open folder
	if (sFolder){
		if (WMFolders.getType([sAccount,sFolder]) != 'X'){
			if (this.tree_folder)
				this.tree_folder._setActive ((sAccount || sPrimaryAccount)+'/'+sFolder);
			else
				this.datagrid._serverSort({aid:(sAccount || sPrimaryAccount),fid:sFolder});
		}

		this._search({aid:(sAccount || sPrimaryAccount),fid:sFolder});
	}

	// This function is triggered when 'OK' button is pressed.
	this.x_btn_ok._onclick = function() {

		var v = me.datagrid._value();

		if (v.length){
			var aItem, aResult = [], sType, tmp;
			for(var i in v){
                if (!(aItem = me.__value[v[i]])) continue;

                sType = WMFolders.getType(aItem);

				tmp = {
					'id': v[i],
					'fullpath': aItem.aid+'/'+aItem.fid+'/'+WMItems.__serverID(v[i]),
					'embedded': (!me.radio || me.radio._value() == 'embedded'),
					'aid':aItem.aid,
					'fid':aItem.fid
				};

				switch (sType) {
					case 'M': tmp.title = (aItem['SUBJECT']?aItem['SUBJECT']+' - ':'') + WMItems.__serverID(v[i]) +'.eml'; break;
					case 'C': tmp.title = aItem['ITMCLASSIFYAS']+'.vcf'; break;
					case 'I':
					case 'K':
					case 'F': tmp.title = aItem['EVNLOCATION']; tmp.size = aItem['EVNCOMPLETE']; break;
					case 'E':
					case 'J':
					case 'N':
					case 'T': tmp.title = aItem['EVNTITLE']+'.ics'; break;
					default:  tmp.title = getLang('INSERT_ITEM::UNTITLED');
				}

				aResult.push(tmp);
			}

			if (Is.Defined(aResponse))
				executeCallbackFunction(aResponse, aResult);
		}

		me._destruct();
	};

	this._onclose = function() {
		dataSet.remove(me._dataSet);
		if(aResponse[0] && (aResponse[0].upload || aResponse[0].file) && (aResponse[0].upload || aResponse[0].file).__remove_dropzone) {
			(aResponse[0].upload || aResponse[0].file).__remove_dropzone(this._main.querySelector('.upload'));
		}
		return true;
	};
};

_me._search = function (aFolder){

	this._create('search', 'obj_item_search','search','',aFolder);
	if (aFolder){

		if (!aFolder.ftype)
			aFolder.ftype = WMFolders.getType(aFolder);

		this._getAnchor('search').querySelector('.label').innerHTML = getLang(({F:'SEARCH::IN_FILES', C:'SEARCH::IN_CONTACTS', T:'SEARCH::IN_TASKS', E:'SEARCH::IN_CALENDARS', M:'SEARCH::IN_EMAILS', N:'SEARCH::IN_NOTES', I:'SEARCH::IN_FILES'})[aFolder.ftype] || 'MAIN_MENU::SEARCH');

		this.search._onsearch = function(v,s){
			if(dataSet.get("folders",[aFolder['aid'],aFolder['fid'],'TYPE']) === 'I') {
				if(v) {
					v += ' AND ';
				}
				v += 'gchat:files';
			}
			this._parent.datagrid._SQLsearch = v;
			this._parent.datagrid._SQLfulltext = s;
			this._parent.datagrid._serverSort();
		};
	}
};

_me.__customViewOn = function () {
	this._main.querySelector('.upload').classList.remove('hidden');
};

_me.__customViewOff = function () {
	this._main.querySelector('.upload').classList.add('hidden');
};

_me.__customViewLabel = function() {
	return getLang('ATTACHMENT::UPLOAD');
};

_me.__filterTree = function (id) {

	var oTree = this.tree_folder,
		activate = sPrimaryAccount + '/' + Mapping.getDefaultFolderForGWType(id);
	if (id === 'I') {
		activate = sPrimaryAccount + '/' + this._default_folder;
	}

	this.search.search._value('', true);
	oTree.__filter = '';

	this.__customViewOff();

	this._main.setAttribute('view', id);

	switch (id) {
		case 'I':
			oTree._filter_folder(['I', 'Y']);
			break;
		case 'M':
			oTree._filter_folder(['M', 'R', 'QL', 'Q']);
			activate = sPrimaryAccount + '/INBOX';
			break;
		case 'E':
			oTree._filter_folder(['E']);
			break;
		case 'B':
			oTree._filter_folder(['B', 'G', 'QL', 'Q']);
			activate = GWOthers.get('DEFAULT_FOLDERS','storage')['VALUES']['trash'];
			break;
		case 'X':
			oTree._filter_folder(['X']);
			this.__customViewOn();
			break;

		// display alfresco tree
		case 'K':

			oTree._filter_folder(['K']);

			if (this.alfresco_folder){
				var aPath = this.alfresco_folder._getActive();
				if (Is.String(aPath[1]))
					this.datagrid._serverSort({aid:aPath[0], fid:aPath[1]});
				break;
			}

			this._create('alfresco_folder','obj_tree_folder','tree','alfresco_folder noroot scroll', '@@alfresco@@');
			this.alfresco_folder._listen_data('alfresco');
			this.alfresco_folder._onactivate = function(id, bChange){
				if (bChange){
					var aPath = Path.split(id, true);
					this._search(aPath);

					this.datagrid._SQLsearch = '';
					this.datagrid._SQLfulltext = '';

					this.datagrid._serverSort(aPath);

					removecss(this._getAnchor('search'), 'active');

					if (this.radio){
						this.radio._disabled(true);
						this.radio._value('embedded');
					}
				}
			}.bind(this);

			this.alfresco_folder._onclick = function(e, elm, id){

				var aPath = Path.split(id, true);

				Alfresco.getFolderInfo(aPath.fid, [function(bOK, aFolder){
					if (bOK)
						Alfresco.setLastFolder(aFolder.fid);
				}]);
			};

			Alfresco.getFolderInfo();

			var sLastFolder;
			if (this._default_account == '@@alfresco@@' && this._default_folder)
				sLastFolder = this._default_folder;
			else
				sLastFolder = Alfresco.getLastFolder();

			if (sLastFolder){
				Alfresco.getFolderInfo(sLastFolder, [function(bOK, aFolder){
					if (bOK && aFolder.fid.length){
						this.alfresco_folder._setActive(Path.build(aFolder));
					}
				}.bind(this)]);
			}

			break;

		default:
			oTree._filter_folder([id]);
	}

	for (var i in this.filter.__aTypes) {
		(oTree._sFilterFolderType[this.filter.__aTypes[i]] ? addcss : removecss)(this.filter._getAnchor(this.filter.__aTypes[i]), 'active');
	}

	if (!~['X','K'].indexOf(id)){
	 	oTree._fill();
	 	oTree._setActive(activate);
	}
};
