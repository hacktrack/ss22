function obj_accountinfo_features(){};
var _me = obj_accountinfo_features.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
	
	this._leftMenu=[
		{
			isdefault:true,
			name:'email',
			icon:'',
			value:'accountdetail::email',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'security',
			icon:'',
			value:'accountdetail::security',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'messaging',
			icon:'',
			value:'accountdetail::messaging',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'teamchat',
			icon:'',
			value:'accountdetail::teamchat',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'webclient',
			icon:'',
			value:'accountdetail::webclient',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'mobile_devices',
			icon:'',
			value:'accountdetail::mobile_devices',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'file_storage',
			icon:'',
			value:'accountdetail::file_storage',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		},
		{
			name:'web_documents',
			icon:'',
			value:'accountdetail::web_documents',
			onclick:function(e,name){
				me._tabClickHandler(name);
				return false;
			}
		}

	];
	/*
	this._parent._init({
		menu:{
			items:this._leftMenu
		}
	});
	*/
	
	this._parent.left_menu._fill(this._leftMenu);
	this._parent.left_menu._show();
	this._parent.left_menu.__hash_handler();
};

_me._load = function(domainAccount,isDomain)
{
	var me=this;
	me._domainAccount=domainAccount;
	me._isDomain=isDomain;
	
	me._draw('obj_accountinfo_features', '', {items:{}});
	
	// cancel
	this._parent.btn_cancel._onclick=function(e){
		this._parent._parent._close();
	};
	
	// save
	this._parent.btn_save._onclick=function(e){
		me._parent.btn_save._disabled(true);
		me._save();
	};
	
	var connection_list=[
		"toggle_smtp",
		'toggle_pop_imap',
		'toggle_archive',
		'toggle_antispam',
		'toggle_antivirus',
		'toggle_quarantine',
		"toggle_instant_messaging",
		'toggle_teamchat',
		'toggle_voip',
		'toggle_online_conferencing',
		'toggle_sms',
		'toggle_groupware',
		'toggle_webclient',
		'toggle_exchange_activesync',
		// 'toggle_syncml',
		'toggle_web_folders',
		'toggle_file_transfer',
		'toggle_web_documents'
	];

	for(var i=0; i<connection_list.length; i++){
		this[connection_list[i]]._related_image=connection_list[i]+"_image";
		this[connection_list[i]]._onchange=function(){
			document.getElementById(this._related_image).src=(this._checked()?document.getElementById(this._related_image).getAttribute('image-on'):document.getElementById(this._related_image).getAttribute('image-off'));
		};
	}

	var doit=function(callback){
		com[(me._isDomain?'domain':'user')].features(me._domainAccount,function(data){
			log.info(['accountinfofeatures-load-doit',data]);
			// email tab
				// smtp
				if(data.smtp){
					me.toggle_smtp.__source=data.smtp.source;
					me.toggle_smtp._checked(data.smtp.value);
					me.toggle_smtp._disabled(!data.smtp.editable);
				}else{
					global.setRight(me,0,'toggle_smtp',true);
				}
				// pop3imap
				if(me.pop3imap){
					me.toggle_pop_imap.__source=data.pop3imap.source;
					me.toggle_pop_imap._checked(data.pop3imap.value);
					me.toggle_pop_imap._disabled(!data.pop3imap.editable);
				}else{
					global.setRight(me,0,'toggle_pop_imap',true);
				}
				// archive
				if(data.archive){
					me.toggle_archive.__source=data.archive.source;
					me.toggle_archive._checked(data.archive.value);
					me.toggle_archive._disabled(!data.archive.editable);
				}else{
					global.setRight(me,0,'toggle_archive',true);
				}
			// security tab
				// antispam
				if(data.as){
					me.toggle_antispam.__source=data.as.source;
					me.toggle_antispam._checked(data.as.value);
					me.toggle_antispam._disabled(!data.as.editable);
				}else{
					global.setRight(me,0,'toggle_antispam',true);
				}
				// antivirus
				if(data.avscan){
					me.toggle_antivirus.__source=data.avscan.source;
					me.toggle_antivirus._checked(data.avscan.value);
					me.toggle_antivirus._disabled(!data.avscan.editable);
				}else{
					global.setRight(me,0,'toggle_antivirus',true);
				}

				// quarantine
				if(data.quarantine){
					me.toggle_quarantine.__source=data.quarantine.source;
					me.toggle_quarantine._checked(data.quarantine.value);
					me.toggle_quarantine._disabled(!data.quarantine.editable);
				}else{
					global.setRight(me,0,'toggle_quarantine',true);
				}
			// messaging
				// instant messaging
				if(data.im){
					me.toggle_instant_messaging.__source=data.im.source;
					me.toggle_instant_messaging._checked(data.im.value);
					me.toggle_instant_messaging._disabled(!data.im.editable);
				}else{
					global.setRight(me,0,'toggle_instant_messaging',true);
				}
				// voip
				if(data.sip){
					me.toggle_voip.__source=data.sip.source;
					me.toggle_voip._checked(data.sip.value);
					me.toggle_voip._disabled(!data.sip.editable);
				}else{
					global.setRight(me,0,'toggle_voip',true);
				}
				// online conferencing
				if(data.meeting){
					me.toggle_online_conferencing.__source=data.meeting.source;
					me.toggle_online_conferencing._checked(data.meeting.value);
					me.toggle_online_conferencing._disabled(!data.meeting.editable);
				}else{
					global.setRight(me,0,'toggle_online_conferencing',true);
				}
				// sms
				if(data.sms){
					me.toggle_sms.__source=data.sms.source;
					me.toggle_sms._checked(data.sms.value);
					me.toggle_sms._disabled(!data.sms.editable);
				}else{
					global.setRight(me,0,'toggle_sms',true);
				}
			// teamchat
				// enabled
				if(data.teamchat){
					me.toggle_teamchat.__source=data.teamchat.source;
					me.toggle_teamchat._checked(data.teamchat.value);
					me.toggle_teamchat._disabled(!data.teamchat.editable);
				}else{
					global.setRight(me,0,'toggle_teamchat',true);
					me._parent.left_menu._removeTab('teamchat');
				}
			// webclient
				var watcher=false;
				// groupware
				if(data.gw){
					me.toggle_groupware.__source=data.gw.source;
					me.toggle_groupware._checked(data.gw.value);
					me.toggle_groupware._disabled(!data.gw.editable);
					watcher=true;
				}else{
					global.setRight(me,0,'toggle_groupware',true);
				}
				// webclient
				if(data.webmail){
					me.toggle_webclient.__source=data.webmail.source;
					me.toggle_webclient._checked(data.webmail.value);
					me.toggle_webclient._disabled(!data.webmail.editable);
					watcher=true;
				}else{
					global.setRight(me,0,'toggle_webclient',true);
				}
				if(!watcher){
					me._parent.left_menu._removeTab('webclient');
				}
			// mobile devices
				// exchange activesync
				if(data.activesync){
					me.toggle_exchange_activesync.__source=data.activesync.source;
					me.toggle_exchange_activesync._checked(data.activesync.value);
					me.toggle_exchange_activesync._disabled(!data.activesync.editable);
				}else{
					global.setRight(me,0,'toggle_exchange_activesync',true);
				}
				// syncml
				// if(data.syncml){
				// 	me.toggle_syncml.__source=data.syncml.source;
				// 	me.toggle_syncml._checked(data.syncml.value);
				// 	me.toggle_syncml._disabled(!data.syncml.editable);
				// }else{
				// 	global.setRight(me,0,'toggle_syncml',true);
				// }
			// file storage
				// web folders (webdav)
				if(data.webdav){
					me.toggle_web_folders.__source=data.webdav.source;
					me.toggle_web_folders._checked(data.webdav.value);
					me.toggle_web_folders._disabled(!data.webdav.editable);
				}else{
					global.setRight(me,0,'toggle_web_folders',true);
				}
				// file transfer
				if(data.ftp){
					me.toggle_file_transfer.__source=data.ftp.source;
					me.toggle_file_transfer._checked(data.ftp.value);
					me.toggle_file_transfer._disabled(!data.ftp.editable);
				}else{
					global.setRight(me,0,'toggle_ftp',true);
				}
				// webdocuments
				if(data.webdocuments){
					me.toggle_web_documents.__source=data.webdocuments.source;
					me.toggle_web_documents._checked(data.webdocuments.value);
					me.toggle_web_documents._disabled(!data.webdocuments.editable);
				}else{
					global.setRight(me,0,'toggle_web_documents',true);
				}
		});
	}
	
	me._main.onclick=function(e){
		
	};
	
	me.timeout=setInterval(function(){
		if(storage.css_status('obj_accountinfo_features'))
		{
			clearInterval(me.timeout);
			doit();
		}
	},100);
}

_me._tabClickHandler=function(name){
	if(!this._activeFieldset){
		this._activeFieldset='email';
	}
	
	addcss(this._getAnchor(this._activeFieldset),'hide');
	removecss(this._getAnchor(name),'hide');
	this._parent._getAnchor('main_content').scrollTop = 0;
	this._activeFieldset=name;
}

_me._save=function(){
	var me=this;
	try
	{
		
		var toSavePack=[
			me.toggle_smtp,
			me.toggle_pop_imap,
			me.toggle_archive,
			me.toggle_antispam,
			me.toggle_antivirus,
			me.toggle_quarantine,
			me.toggle_instant_messaging,
			me.toggle_teamchat,
			me.toggle_voip,
			me.toggle_online_conferencing,
			me.toggle_sms,
			me.toggle_groupware,
			me.toggle_webclient,
			me.toggle_exchange_activesync,
			// me.toggle_syncml,
			me.toggle_web_folders,
			me.toggle_file_transfer,
			me.toggle_web_documents
		];
		var toSave=[];
		for(var key in toSavePack){
			if(toSavePack[key] && (typeof toSavePack[key].__source != 'undefined')){
				toSave.push(toSavePack[key]);
			}
		}
		
		var items = com[(me._isDomain?'domain':'user')]._prepareSet(toSave);
		//log.log(['SAVE',items]);
		
		var account='';
		if(me._domainAccount){
			account=me._domainAccount;
		}
		
		com[(me._isDomain?'domain':'user')].setData(account,items,[function(result){
			me._parent.btn_save._disabled(false);
			try
			{
				if(result.Array.IQ[0].QUERY[0].RESULT[0].VALUE==0){
					gui.message.error(getLang("error::save_unsuccessful"));
				}else{
					gui.message.toast(getLang("message::save_successfull"));
					me._close();
				}
			}
			catch(e)
			{
				log.error(e);
			}
		}]);
	}
	catch(e)
	{
		log.error(e);
	}
}
