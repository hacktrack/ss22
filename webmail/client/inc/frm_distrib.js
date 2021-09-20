_me = frm_distrib.prototype;
function frm_distrib(){};

_me.__constructor = function() {
	this._defaultSize(-1,-1,700,570);

	this._draw('frm_distrib', 'main');

	this.__initForm('DISTRIB_LIST::DISTRIB_LIST');
};

_me.__loadItems = function() {
	if (!this.maintab) return;
	var me = this;

	// TAB1
	loadDataIntoForm(this.maintab.tab1,this._aValues);

	//Copy distrib name into window title
	this.maintab.tab1.ITMCLASSIFYAS._onkeyup = function(){
		var sTitle = this._value();
		if (sTitle){
			if (sTitle.length>32)
			    sTitle = sTitle.substr(0,32)+'...';

			me._title(sTitle + (me._aValues.ITMFOLDER?' ('+me._aValues.ITMFOLDER+')':''),true);
		}
		else
			me._title(getLang('DISTRIB_LIST::DISTRIB_LIST') + (me._aValues.ITMFOLDER?' ('+me._aValues.ITMFOLDER+')':''),true);
	};
	this.maintab.tab1.ITMCLASSIFYAS._onkeyup();
	this.maintab.tab1.ITMCLASSIFYAS._onerror = function(b){
		me.x_btn_ok._disabled(b);
	};
	if(this.maintab.tab1.ITMCLASSIFYAS._checkError.length)
		me.x_btn_ok._disabled(true);

	//backward compatibility (before v.10)
	if (this._aValues['ITMTITLE'] && !this._aValues['ITMCLASSIFYAS'])
		this.maintab.tab1.ITMCLASSIFYAS._value(this._aValues['ITMTITLE']);

	if (Is.Defined(this._aValues['LOCATIONS']))
		this.maintab.tab1.X_MEMBERS._value(this._aValues['LOCATIONS']);

	// TAB2 (attachments)
	this.maintab.tab2._onactive = function (bFirstTime) {
		if (bFirstTime){
			if (me._aValues['ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['ATTACHMENTS'])
					out.push({
						'name': me._aValues['ATTACHMENTS'][i]['values']['ATTDESC'],
						'class': me._aValues['ATTACHMENTS'][i]['values']['ATTTYPE'],
						'id': i,
						'ticket': me._aValues['ATTACHMENTS'][i]['values']['TICKET'],
						'fullpath': me._aValues.fullpath,
						'size': me._aValues['ATTACHMENTS'][i]['values']['ATTSIZE']}
						);

				if (me._aValues.fullpath)
					this.X_ATTACHMENTS._value({'values': out});
				else
					this.X_ATTACHMENTS._value({'path': me._sAccountID+'/'+me._sFolderID+'/'+WMItems.__serverID(me._sItemID), 'values': out});
			}
			else
			if (me._aValues['PUSH_ATTACHMENTS']){
				var out = [];
				for (var i in me._aValues['PUSH_ATTACHMENTS'])
					out.push({
						'name': me._aValues['PUSH_ATTACHMENTS'][i]['title'],
						'id': me._aValues['PUSH_ATTACHMENTS'][i]['id'],
						'size': me._aValues['PUSH_ATTACHMENTS'][i]['size'],
						'class': me._aValues['PUSH_ATTACHMENTS'][i]['embedded'] ? 'item' : 'itemlink',
						'fullpath': me._aValues['PUSH_ATTACHMENTS'][i]['fullpath']
					});

				this.X_ATTACHMENTS._value({
					path:me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].substr(0,me._aValues['PUSH_ATTACHMENTS'][0]['fullpath'].lastIndexOf('/')),
					values:out
				});
			}
		}
	}

	if (me._aValues['PUSH_ATTACHMENTS'])
		this.maintab.tab2._active();
};

_me.__saveItems = function(aValues) {

	var members;
	if (!Is.Empty(members = this.maintab.tab1.X_MEMBERS._value()))
		aValues['LOCATIONS'] = members;
	aValues['values']['ITMCLASS'] = 'L';

	// TAB2
	var attachments;
	if (this.maintab.tab2.X_ATTACHMENTS && !Is.Empty(attachments = this.maintab.tab2.X_ATTACHMENTS._value()))
		aValues['ATTACHMENTS'] = attachments;
};