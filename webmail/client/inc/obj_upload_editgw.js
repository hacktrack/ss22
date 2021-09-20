_me = obj_upload_editgw.prototype;
function obj_upload_editgw(){};

_me.__constructor = function(sTypes){
	var me = this;
	this._create('add_item','obj_button','controls','ico img big gw simple');
	this.add_item._title('FORM_BUTTONS::ADD_ITEM');
	this.add_item._onclick = function (){

		//Documents folder is default
		var sFolder = Mapping.getDefaultFolderForGWType('F');
		if (!dataSet.get('folders',[sPrimaryAccount,sFolder]))
			sFolder = '';

		gui._create('insert_item', 'frm_insert_item', '', 'frm_insert_item_nobottomdiv', [me, '__addItems'], sPrimaryAccount,sFolder,sTypes,'r', false, ['M', 'C', 'F', 'E', 'J', 'N', 'T', 'X']);
	};
};

_me.__addItems = function(aItems) {

	for (var i in aItems) {
		var out = {
				'name': aItems[i]['title'],
				'id': aItems[i]['id'],
				'size': aItems[i]['size'],
				'class': aItems[i]['type'] || (aItems[i]['embedded'] ? 'item' : 'itemlink'),
				'fullpath': aItems[i]['fullpath']
			};

		if (out['class'] == 'item')
			for (var j in this.__idtable)
				if (this.list.__idtable[j]['id'] == aItems[i]['id'] && this.list.__idtable[j]['class'] == 'item')
					continue;

		this.list._add(out);
	}
};