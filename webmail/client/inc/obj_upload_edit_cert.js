_me = obj_upload_edit_cert.prototype;
function obj_upload_edit_cert(){};

_me.__constructor = function(bPublic){
	var me = this;
    this.__idtable = [];
    this.__public = bPublic;

	this.attachments.__sortColumn = 'expires';

	if (this.__public)
		this.attachments._addColumns({name:{title:"DATAGRID_ITEMS_VIEW::SNDOWNER",width:100,mode:'%',arg:{sort:'asc'}},serial:{title:"CERTIFICATE::SERIAL",width:200,arg:{sort:'asc'}},expires:{title:"DATAGRID_ITEMS_VIEW::EXPIRES",width:100,arg:{sort:'asc'}}});
	else
		this.attachments._addColumns({name:{title:"DATAGRID_ITEMS_VIEW::SNDOWNER",width:100,mode:'%',arg:{sort:'asc'}},email:{title:"DATAGRID_ITEMS_VIEW::CONTACT_EMAIL",width:200,arg:{sort:'asc'}},expires:{title:"DATAGRID_ITEMS_VIEW::EXPIRES",width:100,arg:{sort:'asc'}}});

	this.attachments._ondblclick = function(e,elm,arg,sLineId){
		if (typeof sLineId != 'undefined') me.__viewItem([sLineId]);
	};

	this.attachments._oncontext = function(e,elm,arg,sLineId,sColumn){
		//Klikly jsme na místo bez položek?
		if (typeof sLineId == 'undefined') return;

		gui._create("cmenu","obj_context",'','',me);
		var aMenu = [{"title":'ATTACHMENT::SAVE','arg':[me,'_save',[sLineId]],disabled:arg['class'] == 'item'},
                    {"title":'ATTACHMENT::VIEW','arg':[me,'__viewItem',[[sLineId]]],disabled:arg['class'] == 'item'},
					{"title":'ATTACHMENT::REMOVE','arg':[me,'__deleteItems',[[sLineId]]], 'disabled':me.__disabled}];

		gui.cmenu._fill(aMenu);
		gui.cmenu._place(e.clientX,e.clientY);
	};

	/*
	this.download._onclick = function() {
		var v = me.attachments._value();
		if (v.length)
			me._save(v[0]);
	};
	*/

	this.view._onclick = function() {
		var v = me.attachments._value();
		if (v.length)
			me.__viewItem(v);
	};


	this.remove._onclick = function() {
		me.__deleteItems(me.attachments._value());
	};

	////// FILE //////
	this.file._onuploadsuccess = function(file){
		me._add(file);
	};
};

_me.__viewItem = function(aIDs) {
	for(var i in aIDs)
		if (this.__idtable[aIDs[i]].data)
			gui._create('certificate','frm_certificate','','',this.__idtable[aIDs[i]].data,this);
};

_me._value = function(v){
	if (typeof v == 'undefined'){
		var out = [];
		for (var i in this.__idtable)
			if (this.__idtable[i]['class'] == 'attachment' && !this.__idtable[i]['fullpath']){
				if (this.__idtable[i]['removed'])
				    out.push({uid:this.__idtable[i].id});
			}
			else
			if (!this.__idtable[i]['removed'])
				//out.push({values:{'class':this.__idtable[i]['class'] || 'file',description:this.__idtable[i]['name'],fullpath:this.__idtable[i]['fullpath'] || ((this.__idtable[i]['folder'] || this.file._getFolder())+"/"+this.__idtable[i]['id'])}});
				out.push({
                    'class':this.__idtable[i]['class'] || 'file',
					'fullpath':this.__idtable[i]['fullpath'] || ((this.__idtable[i]['folder'] || this.file._getFolder())+"/"+this.__idtable[i]['id']),
					'passphrase':this.__idtable[i]['passphrase']
					});

		return out;
	}
	else{
		if (v.path)
	        this._gwPath = v.path;//this.file._setFolder(v.path);

	    if (v.values)
			for(var i in v.values)
                this.__idtable.push(v.values[i]);

        this.__fillDataGrid();
	}
};

_me._add = function(aArg){

	if (!aArg.fullpath)
		aArg.folder = this.file._getFolder();

	aArg['class'] = aArg['class'] || 'file';

	if (/\.(p12|pfx)$/gi.test(aArg.name) || /\.(p12|pfx)$/gi.test(aArg.name))
	    gui._create('passphrase','frm_password','','',[this,'__infoQuery',[aArg]],'CERTIFICATE::PASSPHRASE');
	else
		this.__infoQuery('',aArg);
};

_me.__infoQuery = function (sPass, aArg){
	if (sPass)
	    aArg.passphrase = sPass;

	storage.library('wm_upload');
	var oUP = new wm_upload();
	    oUP.certificate(this.file._getFolder(), aArg.id,sPass,[this,'__infoResponse',[aArg]]);
};

_me.__infoResponse = function(aData,aArg){

	if (!aData)
		gui.notifier._value({type: 'alert', args: {header: '', text: 'CERTIFICATE::INVALID'}});
	else{
        if (!this.__public && aData.TYPE[0].VALUE == 'public')
			gui.notifier._value({type: 'alert', args: {header: '', text: 'CERTIFICATE::BADTYPE'}});
		else{
			aArg.data = aData.INFO[0];
			if (aData.INFO[0].SUBJECT){
                if (aData.INFO[0].SUBJECT[0].CN)
					aArg.name = aData.INFO[0].SUBJECT[0].CN[0].VALUE;
				if (aData.INFO[0].SUBJECT[0].EMAILADDRESS)
					aArg.email = aData.INFO[0].SUBJECT[0].EMAILADDRESS[0].VALUE;
			}
			if (aData.INFO[0].SERIALNUMBER)
				aArg.serial = aData.INFO[0].SERIALNUMBER[0].VALUE;
			if (aData.INFO[0].VALIDTO)
				aArg.expires = aData.INFO[0].VALIDTO[0].VALUE;

			this.__idtable.push(aArg);
		    this.__fillDataGrid();

			return;
		}
    }
};

_me._remove = function (id){
	if (typeof id == 'undefined'){
	    for(var i in this.__idtable)
	        this._remove(i);
	}
	else
	if (this.__idtable[id] && !this.__idtable[id].removed){
		this.__idtable[id].removed = true;

		this.__fillDataGrid();
	}
};

_me.__fillDataGrid = function(){

	var aData = {};

	for (var i in this.__idtable)
		if (!this.__idtable[i]['removed']){

            if (this.__public)
				aData[i] = {id:i,data:{name:this.__idtable[i].name, serial:this.__idtable[i].serial}};
			else
				aData[i] = {id:i,data:{name:this.__idtable[i].name, email:this.__idtable[i].email}};

            aData[i].arg = {path:this.__idtable[i].fullpath,'class':this.__idtable[i]['class']};

			if (this.__idtable[i].expires){
				aData[i].data.expires = [IcewarpDate.utct(this.__idtable[i].expires).format('L'), this.__idtable[i].expires];
			}
		}

	this.attachments._serverSort(aData);
};

_me.__deleteItems = function(aIDs) {
	for (var i in aIDs)
	    this._remove(aIDs[i]);
};


_me._save = function(id) {
	var aUrl = {'sid': dataSet.get('main', ['sid'])};

    if (this.__idtable[id]['class'] == 'attachment'){

		if (this.__public){
			aUrl['class'] = 'contact_certificate';
			aUrl.fullpath = WMItems.__serverID(this._gwPath)+'/'+this.__idtable[id].id;
		}
		else{
	        aUrl['class'] = 'personal_certificate';
			aUrl.fullpath = this.__idtable[id].id;
		}

	}
	else
	if (this.__idtable[id]['class'] != 'item'){
        aUrl['class'] = 'uploaded_certificate';
		aUrl.fullpath = this.file._getFolder() +'/'+ this.__idtable[id].id;
	}

	downloadItem(buildURL(aUrl));
};

_me._disabled = function(b){
	if (Is.Defined(b)){
		this.__disabled = b?true:false;

		this.remove._disabled(this.__disabled);
		this.file._disabled(this.__disabled);
	}
	else
		return this.__disabled;
};