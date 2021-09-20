_me = frm_main_mail.prototype;
function frm_main_mail(){};

_me.__constructor = function(){
	var me = this;

	if (this._anchors['container'])
		this._create("mailview","obj_mailview",'container','','preview','',1);


	if (!this.list)
		this._create("list","obj_datagrid2_ext");

	/*
	this.list._onchange = function(){
		var b = (this._value().length?true:false);
		if (gui.frm_main.hmenu3 && gui.frm_main.hmenu3.__bEnabled != b){
			var aFolder = this._getFolder(),
				aView = Cookie.get(['views',aFolder.aid,aFolder.fid]);

			gui.frm_main.hmenu3._contextFill(aView.type, aFolder, (aView.view || 'nothing'), b);
		}
	};
	*/

	this.list.info = {_value:function(iSelect,iTotal){
		var aFolder = me.list._getFolder();
		gui.frm_main._title(dataSet.get('folders',[aFolder.aid,aFolder.fid,'NAME']) || Path.basename(aFolder.fid),iSelect,iTotal);
	}};

	this.list._tabIndex();
};

_me._changeview = function(sView){
	if (!sView)
		switch(this._type){
			case 'frm_main_mail': sView = 'mail_view_wide'; break;
			case 'frm_main_mail_wide': sView = 'mail_view_list'; break;
			case 'frm_main_mail_list': sView = 'mail_view'; break;
		}

	this._parent._selectView(this.list._getFolder(), sView, false, '', false, this.list._SQLsearch);
};

_me._showsearch = function(aFolder,bFocus,sFilter){
	if (aFolder){
		gui.frm_main.search._setFolder(aFolder);

		//Set Filter
		if (sFilter){
			this.list._SQLsearch = sFilter;
			gui.frm_main.search._value(sFilter,true); //'#' +
		}
		else
		if (GWOthers.getItem('LAYOUT_SETTINGS','keep_search') == '1'){
			this.list._SQLsearch = gui.frm_main.search._value();
		}
		else{
			this.list._SQLsearch = '';
			gui.frm_main.search._deactivate();
		}

		this.list._SQLfulltext = '';

		var me = this;
		gui.frm_main.search._onsearch = function(v,s){
			me.list._SQLsearch = v;
			me.list._SQLfulltext = s;
            me.list._serverSort();
		}

		if (bFocus)
			gui.frm_main.search._focus();
	}
};