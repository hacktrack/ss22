_me = frm_blackwhite.prototype;
function frm_blackwhite(){};

_me.__constructor = function(sAcc,sFol) {
	var bWhite = true;
	if (sFol.indexOf('Blacklist') > -1)
		bWhite = false;
	this._size(350,150,true);
	this._draw('frm_blackwhite', 'main');
	this._title('BLACKWHITE::' + (bWhite?'WHITE':'BLACK'));
	this._acc = sAcc;
	this._fol = sFol;
	
	var me = this;

	// This function is triggered when 'OK' button is pressed
	this.EMAIL._onerror = function(b){
		me.x_btn_ok._disabled(b);
	};
	this.EMAIL._restrict('.+');
	this.EMAIL._onsubmit = function(){
		me.x_btn_ok._onclick();
	};
	this.x_btn_ok._onclick = function() {

		var id = [sAcc, sFol],
			aValues = {'values':{}};

		storeDataFromForm(me, aValues['values']);
		
		if (aValues['values']['EMAIL'])
			WMItems.add(id, aValues, '', '','',[me,'_listFolder']);
		else
			me._destruct();
	};
};

_me._listFolder = function (){
	var aItems = dataSet.get('items');
	for(var sAccId in aItems)
	  for(var sFolId in aItems[sAccId]);
	  
	if (sAccId == this._acc && sFolId == this._fol) {

		var aSort = Cookie.get(['views',this._acc,this._fol,'sort']);

		gui.frm_main.main.list._serverSort({aid:this._acc,fid:this._fol},aSort['column'],aSort['type']);
	}
	this._destruct();
};