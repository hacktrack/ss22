// INIT script

/**
 * @brief : Initial class for IceWarp WebMail
 * @date  : 6.3.2006 19:01:49
 * @status: draft
 * @require: storage
 *
 */

function cInit(aLogin){
	var aLogin = aLogin || {};

	//remove HTML
	document.getElementsByTagName('body')[0].innerHTML = '';

	//Unique Session ID Number (to avoid avatar img cache)
	window.sSessionUID = unique_id();

	//Create httprequet
	window.request = new cRequest('/icewarpapi/');

	//create gui
	window.gui = new cObject('gui');
	
	storage.library('ts_helpers');
	storage.library('constants_ext');
	storage.library('global_ext');
	storage.library('wm_generic');
	storage.library('obj_generic');
	// load helpers methods
	storage.library('helpers_ext');
	storage.library('punycode_ext');
	storage.library('chartist.min');
	storage.library('dataset');
	//
	
	var query_string=location.href.split('#')[0].split('?');
	if(query_string[1]){
		query_string=helper.parse_query(query_string[1]);
	}else{
		query_string={};
	}
	
	storage.library('class_errorhandler');
	
	var logger_settings={verbosity:LOGGER_ERROR};
	if(query_string.frm){
		logger_settings={verbosity:LOGGER_ALL};
	}
	
	if(query_string.alert){
		logger_settings.type=LOGGER_ALERT;
	}
	window.log=new logger(logger_settings);
	
	// create setTitle function
	gui._setTitle=function(title){
		document.title=helper.htmlspecialchars(title);
	}
	
	if(location.search.search('proxy')>=0){
		window.request = new cRequest('./server/proxy.php?com');
	}

	if(aLogin.sid){
		dataSet.add('main',['sid'],aLogin.sid);
		Cookies.set('waid',aLogin.sid,{ expires: 1, path: '/admin/' });
	}else{
		if(Cookies.get('waid') && Cookies.get('waid')==''){
			Cookies.remove('waid', { path: '/admin' });
			Cookies.remove('waid', { path: '/admin/' });
			location.reload();
		}
		else{
			dataSet.add('main',['sid'],Cookies.get('waid'));
		}
	}
	
	//document.getElementsByTagName('head')[0].appendChild(mkElement('link',{"rel":'stylesheet',"type":'text/css',"href":'client/skins/default/css/index.css'}));
	
	gui._REQUEST_VARS = query_string;

	//load language
	if(Cookies.get('wall') && Cookies.get('wall')!=''){
		storage.language(Cookies.get('wall'));
	}
	else
	{
		storage.language('en');
	}
	
	// set default title
	gui._setTitle(getLang('generic::icewarp_webadmin'));

	/** */
	// load big files
	if(!query_string.frm || query_string.frm!='full'){
		storage.css('style');
	}
	if(!query_string.frm){
		storage.library('javascript');
		storage.template('templates');
		storage.preloadObj();
	}
	/** */
	storage.library('wm_general');
	storage.library('wm_domain');
	storage.library('wm_server');
	storage.library('wm_resources');
	storage.library('wm_licence');
	storage.library('wm_user');
	//


	//registr connection manager 
	gui._create('connection','obj_connection');

	//registr function to global variable, must be here because it will be used
	window.oWM_INIT = this;
	
	/* load initial settings and similar global information. Once loaded, load main frame */
	gui._globalInfo={
		domainRightsRaw:[],
		serverRightsRaw:[],
		getDomainRights:function(name){
			var raw=gui._globalInfo.domainRightsRaw;
			for(var i=0; i<raw.length; i++){
				try{
					if(raw[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase()==name.toLowerCase()){
						return (raw[i].PROPERTYRIGHT[0].VALUE.toString()!="0"&&raw[i].PROPERTYRIGHT[0].VALUE.toString()!="3"?true:false);
					}
				}catch(e){}
			}
			return false;
		},
		getServerRights:function(name){
			var raw=gui._globalInfo.serverRightsRaw;
			for(var i=0; i<raw.length; i++){
				try{
					if(raw[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase()==name.toLowerCase()){
						return (raw[i].PROPERTYRIGHT[0].VALUE.toString()!="0"&&raw[i].PROPERTYRIGHT[0].VALUE.toString()!="3"?true:false);
					}
				}catch(e){}
			}
			return false;
		},
		// parse settings given by CSS (cool, heh?)
		css: {
			backgrounds: helper.loadCSSManagedSettings("css-backgrounds"),
			settings: helper.loadCSSManagedSettings("css-settings"),
			colors: helper.loadCSSManagedSettings("css-colors")
		},
		_update:function(callback){
	/* ************* UPDATE ************** */
	
			// get critical settings and other info from API
			log.info('sherlock-sktnvus-#0');
			com.general.sessionInfo(function(result){
				if(
					result.Array.IQ[0].QUERY[0].RESULT &&
					result.Array.IQ[0].QUERY[0].RESULT[0].DOMAIN &&
					result.Array.IQ[0].QUERY[0].RESULT[0].DOMAIN[0].VALUE &&
					result.Array.IQ[0].QUERY[0].RESULT[0].EMAIL &&
					result.Array.IQ[0].QUERY[0].RESULT[0].EMAIL[0].VALUE &&
					result.Array.IQ[0].QUERY[0].RESULT[0].ADMINTYPE &&
					result.Array.IQ[0].QUERY[0].RESULT[0].ADMINTYPE[0].VALUE
				)
				{
					// set global info
					try
					{
						for(var key in result.Array.IQ[0].QUERY[0].RESULT[0]){
							if(result.Array.IQ[0].QUERY[0].RESULT[0][key][0] && result.Array.IQ[0].QUERY[0].RESULT[0][key][0].VALUE){
								gui._globalInfo[key.toLowerCase()]=result.Array.IQ[0].QUERY[0].RESULT[0][key][0].VALUE;
							}
						}
						var name = result.Array.IQ[0].QUERY[0].RESULT[0].NAME;
						gui._globalInfo.fullname= name ? 
							(name[0].NAME[0].VALUE?
								name[0].NAME[0].VALUE+" ":"")+
							(name[0].SURNAME[0].VALUE?
								name[0].SURNAME[0].VALUE:"") : '';
						
						if(result.Array.IQ[0].QUERY[0].RESULT[0].IMAGE){
							gui._globalInfo.userimage="data:"+result.Array.IQ[0].QUERY[0].RESULT[0].IMAGE[0].CONTENTTYPE[0].VALUE+";base64,"+result.Array.IQ[0].QUERY[0].RESULT[0].IMAGE[0].BASE64DATA[0].VALUE;
						}
					}
					catch(e)
					{
						log.error(["init-sessioninfo",e]);
					}
					
					gui._activeDomain=gui._globalInfo.domain;
					
					// if last logged user is not the same as current user, go to main page
					if(Cookies.get('wala')){
						if(Cookies.get('wala')!=gui._globalInfo.email){
							location.hash="";
						}
					}
					Cookies.set('wala',gui._globalInfo.email,{ expires: 1, path: '/admin/' });
					
					// Load domain rights
					com.domain.rights(gui._globalInfo.domain,[
						'V_CreateUser',
						'V_CreateMailingList',
						'V_CreateGroup',
						'V_CreateResource',
						'V_DeleteUser',
						'V_DeleteMailingList',
						'V_DeleteGroup',
						'V_DeleteResource',
						'V_CreateDomain'
					],function(result){
						
						if(
							result.Array.IQ[0].QUERY[0].RESULT &&
							result.Array.IQ[0].QUERY[0].RESULT[0].ITEM &&
							result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0]
						)
						{
							log.log(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM);
							gui._globalInfo.domainRightsRaw=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
							
							// load server rights
							com.server.rights([
								'V_SpamQueues'
							],function(result){
								
								if(
									result.Array.IQ[0].QUERY[0].RESULT &&
									result.Array.IQ[0].QUERY[0].RESULT[0].ITEM &&
									result.Array.IQ[0].QUERY[0].RESULT[0].ITEM[0]
								)
								{
									log.log(result.Array.IQ[0].QUERY[0].RESULT[0].ITEM);
									gui._globalInfo.serverRightsRaw=result.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
									
									gui._globalInfo.licence = {};
									gui._globalInfo.resources = {};
									gui._globalInfo.accountProperties = {};
									if(+gui._globalInfo.isgateway) {
										return callback();
									}
									// load webadmin settings
									var domain = new Domain(gui._globalInfo.domain);
									domain.getSettings(['layout_settings_admin','restrictions'],function(settings){
										gui._globalInfo.resources = settings;

										// Get and save licence information
										com.licence.get(function(result){
											try
											{
												// Licence is returned as already parsed data, just save it
												gui._globalInfo.licence = result;

												com.user.info(gui._globalInfo.email,function(response){
													var items = response.Array.IQ[0].QUERY[0].RESULT[0].ITEM;
													
													for(var i=0; i<items.length; i++){
														if(items[i].PROPERTYVAL[0].VAL) {
															gui._globalInfo.accountProperties[items[i].APIPROPERTY[0].PROPNAME[0].VALUE.toLowerCase()] = items[i].PROPERTYVAL[0].VAL[0].VALUE;
														}
													}
													/** **************************************/
													/** CALL CALLBACK */
													try
													{
														callback();
													}
													catch(e)
													{
														log.error(['init-resourceshandler-callback',e]);
														alert(getLang('error::fatal_communication_error #6'));
													}
												});
											}
											catch(e) {
												log.error(['init-resourceshandler-webadmin',e]);
												alert(getLang('error::fatal_communication_error #5'));
											}
										});
									});
								}
								else
								{
									alert(getLang('error::fatal_communication_error #3'));
								}
								
							});
							//
							
						}
						else
						{
							alert(getLang('error::fatal_communication_error #2'));
						}
						
					});
					//
					
				}
				else
				{
					alert(getLang('error::fatal_communication_error #1'));
				}
			});
			/**/

	/* ************* /UPDATE ************** */
		}
	};
	
	gui._globalInfo._update(function(){
		// load main frame
		gui._create('frm_main','frm_main');
	});
	
	
	/* Change observer */
	gui._changeObserver={};
	gui._changeObserver.listeners={};
	gui._changeObserver.assignListener=function(id,callback){
		gui._changeObserver.listeners[id]=callback;
	}
	gui._changeObserver.clearListener=function(id){
		delete gui._changeObserver.listeners[id];
	}
	gui._changeObserver.assignTrigger=function(elm){
		log.log(['init-changeobserver','Assigning observer',elm]);
		var f=(elm._onclick?'_onclick':'onclick');
		var oc=elm[f];
		elm._CO_oc=oc;
		elm._CO_f=f;
		elm[f]=function(e){
			var changed=false;
			for(var key in gui._changeObserver.listeners){
				try
				{
					if(gui._changeObserver.listeners[key]()){
						changed=true;
					}
				}
				catch(e)
				{
					gui._changeObserver.clearListener(key);
				}
			}

			if(changed)
			{
				gui.message.warning(getLang("warning::changes_found"),false,[
					{
						value:getLang("generic::cancel"),
						type:'text borderless',
						method:'close'
					},
					{
						value:getLang("generic::do_not_save"),
						type:'text error',
						onclick:function(closeCallback){
							closeCallback();
							oc(e);
						}
					},
					{
						value:getLang("generic::save"),
						type:'success text',
						onclick:function(closeCallback){
							
							for(var key in gui._changeObserver.listeners){
								try
								{
									gui._changeObserver.listeners[key](function(){
										closeCallback();
										oc(e);
									},closeCallback);
								}
								catch(e)
								{
									gui._changeObserver.clearListener(key);
								}
							}
						}
					}
				]);
			}
			else
			{
				oc(e);
			}
		};
		return false;
	}
	gui._changeObserver.clearTrigger=function(elm){
		elm[elm._CO_f]=elm._CO_oc;
	}
	/** */


	return;
};

function logout(ignore_session, callback) {
	function removeCookie(name) {
		['', '/', '/admin', '/admin/', location.pathname, location.pathname + '/'].forEach(function(path) {
			Cookies.remove(name, { path: path });
		});
	}
	var handler = function() {
		log.info('go logout');
		removeCookie('waid');
		removeCookie('wala');
		var url = Cookies.get('ware');
		if (url) {
			removeCookie('ware');
			if (callback) {
				callback(url);
			} else {
				location.href = url;
			}
		} else {
			if (callback) {
				callback();
			} else {
				location.reload();
			}
		}
		log.info('should logout');
	}
	
	if (ignore_session) {
		handler();
		return true;
	}
	
	com.server.logout(handler);
}
///////////////////////////
function initPRO(aData){
	new cInit(aData);
};
