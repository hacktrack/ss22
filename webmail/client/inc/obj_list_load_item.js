_me = obj_list_load_item.prototype;
function obj_list_load_item(){};

_me.__constructor = function() {
	this.__options = {
		preload: 30
	};
};

_me._search = function(s){
	if (Is.Defined(s)){
		var aFilter = this.__aRequestData.filter?clone(this.__aRequestData.filter, true):{};
			aFilter.search = s;

		this.__bSearch = true;
		this._serverSort(this.__aRequestData.folder, true, aFilter);
	}
	else
	if (this.__aRequestData.filter)
		return this.__aRequestData.filter.search;
	else
		return '';
};

_me._serverSort = function(aFolder, bUpdate, aFilter){

	if (Is.Defined(aFilter))
		bUpdate = true;
	else
	if (!aFolder || (this.__aRequestData.folder && compareObj(this.__aRequestData.folder, aFolder, true)))
		aFilter = this.__aRequestData.filter;

	if (this.__aRequestData.folder)
		if (!bUpdate && ((!aFolder && this.__aRequestData.folder) || compareObj(this.__aRequestData.folder, aFolder, true))){
			this._request(true);
			return;
		}

	this._clear();

	this.__aRequestData.folder = aFolder;
	this.__aRequestData.offset = 0;
	this.__aRequestData.filter = aFilter;

	this.__loading = 0;

	if (WMFolders.getRights(this.__aRequestData.folder, 'kick'))
		addcss(this._main,'acc_remove');
	else
		removecss(this._main,'acc_remove');

	this._fetch();
};

_me._onrefresh = function(){
	if (this.__aRequestData.folder)
		this._serverSort(this.__aRequestData.folder, true);
};

_me.__check_count = function(count, bCheckData){

	if (!Is.Defined(count) || (this.__aRequestData.count && count != this.__aRequestData.count)){
		if (count === 0){
			this._clear(true);
			return false;
		}
		else{
			if (this.__body.scrollTop>10 || this.__norefresh){
				this._refresh(true);
				return true;
			}
			else{
				this._serverSort(this.__aRequestData.folder, true);
				return false;
			}
		}
	}

	if (count == 0 || (bCheckData && Is.Empty(this.__aData))){
		this._clear(true);
		addcss(this._main,'noitems');
	}
	else
		removecss(this._main,'noitems');

	return true;
};

	_me._editItem = function(id){
		if (Is.Defined(id) && this.__aData[id] && this.__aData[id].obj && !this.__aData[id].obj._destructed && this.__aData[id].obj._edit)
			return this.__aData[id].obj._edit(true);

		return false;
	};

	_me._removeItem = function(aData, elm){
		var me = this;
		WMItems.remove({aid:aData.aid, fid:aData.fid, iid:[aData.iid]},'','','',[function(bOK){
			if (bOK && me.__aRequestData.folder.aid == aData.aid && me.__aRequestData.folder.fid == aData.fid){
				if (elm && elm.id){
					var id = elm.id.substr(elm.id.lastIndexOf('#')+1);
					me._remove(id, aData.iid);
				}
			}
		}]);
	};

	_me._onremove = function(iAnchor, sData_id){
		//remove from aData
		if (this.__aData && this.__aData[sData_id])
			delete this.__aData[sData_id];

		if (this.__aRequestData.offset)
			this.__aRequestData.offset--;
	};