_me = frm_revision.prototype;
function frm_revision(){};

_me.__constructor = function(aItemInfo,bFrm){
	var me = this;

	this._title('ITEM::NEW_REVISION');
	this._defaultSize(-1,-1,400,200);
	this._modal(true);

	if (bFrm){
		me.x_btn_ok._value('FORM_BUTTONS::REVISION');
		me.x_btn_cancel._value('FORM_BUTTONS::SKIP');
	}

	this._create('text','obj_text','main','obj_text100 noborder');
	this.text._placeholder(getLang('COMMON::COMMENT'));
	this.text._onsubmit = function(){
		me.x_btn_ok._onclick();
	};

	this.text._tabIndex();
	this.x_btn_ok._tabIndex();
	this.x_btn_cancel._tabIndex();

	this.x_btn_ok._onclick = function(){

		me.__hide();

		WMItems.add([aItemInfo.aid,aItemInfo.fid,aItemInfo.iid],{revisions:[{values:{revcomment:me.text._value()}}]},'','','',[function(bOK){
			//Error
			if (bOK == false)
				gui.notifier._value({type: 'alert', args: {header: '', text: 'ALERTS::CREATE_REVISION'}});
			else
		 	if (gui.notifier)
				gui.notifier._value({type: 'new_revision'});

			// Refresh Preview (again)
			if (gui.frm_main.main && gui.frm_main.main.itemview && dataSet.get('preview',[aItemInfo.aid,aItemInfo.fid,aItemInfo.iid])){
				dataSet.remove('preview','',true);
				Item.open([aItemInfo.aid,aItemInfo.fid,aItemInfo.iid]);
			}

			me._destruct();
		}]);
	};

	this.text._focus();
};