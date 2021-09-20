function frm_addroom_main(){};

frm_addroom_main.prototype = {
    __constructor:function(view){
        view.data = {};
        view.title('CHAT::ADD_ROOM_TITLE');
		view.buttons({'btn_cancel':{value:'FORM_BUTTONS::CANCEL'}});

		this._getAnchor('private').onclick = function(){
			view.view('private');
		}.bind(this);

		var bPublic = !!view.parent._getGroups().length;

		// if (bPublic && view.parent.__data.fid){
		// 	bPublic = !!~(dataSet.get('folders',[view.parent.__data.aid, view.parent.__data.fid, 'RIGHTS']) || '').indexOf('k') && dataSet.get('folders',[view.parent.__data.aid, Path.basedir(view.parent.__data.fid), 'PRIVATE_ROOT']) !== "true";
		// }

		if (bPublic){
			this._getAnchor('public').onclick = function(){
				view.view('public');
			}.bind(this);
		}
		else
			addcss(this._getAnchor('public'), 'disabled');
    }
};