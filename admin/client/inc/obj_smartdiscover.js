_me = obj_smartdiscover.prototype;
function obj_smartdiscover(){};

/**
 * @brief:
 * @date : 26.10.2014
 **/
_me.__constructor = function(s){
	var me = this;
	
	storage.library('wm_smartdiscover');
	
	gui.frm_main.main._setHeadingButton('generic::save',function(){me._save();},'button text success');
	
	gui.frm_main.main._cleanHeadingButtonsAnchor();
	gui.frm_main.main._setAlternativeButtons(function(box,target_anchor){
		if(!box._alternativeButtons){
			box._alternativeButtons=[];
		}
		var btn = box._create('actions','obj_button',target_anchor);
		btn._value('smartdiscover::set_all_to_new_domain_name');
		btn._addcss('text primary');
		if(target_anchor=='heading_buttons_mobile'){btn._addcss('full',true);}
		
		btn._onclick=function(){me._changeAll();};

		box._alternativeButtons.push(btn);
	});
	//
	this._add_destructor('__onbeforedestruct');
	/* set onbefore destruct listener */
	
	me._settings={};
	
	me._settings.types={
		'*0':getLang("smartdiscover::standard"),
		'*1':getLang("smartdiscover::tls_ssl"),
		'*2':getLang("smartdiscover::no_ssl")
	}
	
	/* PREPARE BINDS */
	me._settings.binds={
		'c_mail_smtp_general_hostname':'input_public_hostname',
		'c_system_autodiscover_smtp':'input_smtp',
		'c_system_autodiscover_pop3':'input_pop3',
		'c_system_autodiscover_imap':'input_imap',
		'c_system_autodiscover_xmpp':'input_xmpp',
		'c_system_autodiscover_sip':'input_sip',
		
		'c_system_autodiscover_smtptype':'dropdown_smtp',
		'c_system_autodiscover_pop3type':'dropdown_pop3',
		'c_system_autodiscover_imaptype':'dropdown_imap',
		'c_system_autodiscover_xmpptype':'dropdown_xmpp',
		'c_system_autodiscover_siptype':'dropdown_sip',
		
		'c_activesync_url':'input_mobilesync',
		// 'c_syncml_url':'input_syncml',
		'c_gw_webdavurl':'input_webdav_smartattach',
		'c_webmail_url':'input_webclient',
		'c_webadmin_url':'input_webadmin',
		'c_gw_freebusyurl':'input_free_busy',
		'c_internetcalendar_url':'input_internet_calendar',
		'c_smsservice_url':'input_sms',
		'c_as_spamchallengeurl':'input_anti_spam_reports',
		
		'c_install_url':'input_install',
		'c_teamchat_api_url':'input_teamchat',
		'c_collaboration_api_url':'input_collaboration',
		'c_conference_api_url ':'input_conference'
	};
	/* */
};

/** obbefore destruct listener */
_me.__onbeforedestruct=function(){

}
/** */

_me._load=function(){
	var me=this;
	
	try
	{
		me._draw('obj_smartdiscover');
		
		// Prepare objects
		me.dropdown_smtp._fill(me._settings.types);
		me.dropdown_pop3._fill(me._settings.types);
		me.dropdown_imap._fill(me._settings.types);
		me.dropdown_xmpp._fill(me._settings.types);
		me.dropdown_sip._fill(me._settings.types);
		//
		
		/* bind elements with data.
		 * That causes request to server asking for values of variables
		 * set in binds settings and set these values to corresponding objects
		 */
		com.smartdiscover.bind(me,me._settings.binds,COM_TYPE_SERVER);
	}
	catch(e)
	{
		log.error([e,me]);
	}
}

_me._save=function(){
	com.policies.save(this,this._settings.binds,COM_TYPE_SERVER);
}

_me._changeAll=function(){
	var me=this;
	var popup=gui._create('popup','obj_popup');
	popup._init({
		name:'changeall',
		heading:{
			value:getLang('smartdiscover::set_all_to_new_domain_name')
		},
		template:'obj_smartdiscover_change_all',
		fixed:false,
		footer:'default',
		type:'default'
	});
	
	log.log(['smartdiscover-changeall',me.input_mobilesync._value()]);
	
	popup.main.input_url._value(me.input_public_hostname._value());
	
	popup.main.btn_save._onclick=function(){
		var url=popup.main.input_url._value();
		
		for(var key in me._settings.binds){
			if(me[me._settings.binds[key]] && me[me._settings.binds[key]]._type && me[me._settings.binds[key]]._type.substr(0,9)=='obj_input'){
				var old_value=me[me._settings.binds[key]]._value();
				var new_value=old_value.replace(/\:\/\/.*?(\/|$)/,"://"+url+'$1');
				if(old_value.search('://')==-1){
					new_value=url;
				}
				me[me._settings.binds[key]]._value(new_value);
			}
		}
		
		me._save();
		popup._close();
	
	}
}
