<?php
 
abstract class PrivateAndPublic extends XMLRequestInterface
{
	private $aPaths = array(
		'public' => 'xml/public/',
		'private' => 'xml/private/'
	);
	protected static $aNonMergingResources = array(
		0 => 'shared_accounts'
	);
	protected static $aGWResources = array(
		0 => 'shared_accounts', 
		1 => 'gw_groups'
	);
	public static $aPublicNamespace = array(
		'login_settings' => 1,
		'layout_settings' => 1,
		'restrictions' => 1,
		'reset_settings' => 1,
		'forgot_settings' => 1,
		'languages' =>1,
		'signup_domains' => 1,
		'skins' => 1,
		'paths'=>1,
		'basic'=>1,
		'banner_options'=>1
	);

	public $prefix;
	public $oResources;
	public $adminAsDomain;
	public $oDOMDoc;
	public $oDOMQuery;
	public $rights;
	protected $sPP;
	public $domain;

	abstract public static function set($sResourceName, $aActions, $aAsD = false, $domain = false, $rewrite = false);
	abstract public static function get($sResourceName, $default, $domain, $user, $rights = false, $aAsD = false, $slave_domain = false);

	 
	protected function checkInputXML($oDoc)
	{
		if ($this->aAttrs['type'] == 'set' && !$this->aAttrs['sid']){
			throw new Exc('settings_access_denied');
		}
		 		foreach ($this->oResources as $oResource){
			$result[] = $oResource->tagName;
		}
		if ((@$_SESSION['ACCOUNT'] == 0 || @$_SESSION['ACCOUNT'] == 2) 
		&& !$this->aAttrs['sid']){
			foreach ($result as $res){
				if (!PrivateAndPublic::$aPublicNamespace[$res]){
					throw new Exc('settings_access_denied');
				}
			}
		}
		 		$this->prefix = $this->sPP . ":";
		if (!is_object($this->oResources->item(0))){
			throw new Exc('settings_missing_tag', 'resource');
		}

		switch (@$_SESSION['ACCOUNT']) {
			case 1:
				$this->rights = 'admin';
				 				if ($oDOMDomain = $this->oDOMDoc->getNode($this->prefix . "domain", $this->
					oDOMQuery)) {
					$this->rights = 'domain';
					$this->domain = $oDOMDomain->nodeValue;
					$this->adminAsDomain = true;
				}
				break;
			case 2:
				$this->rights = 'domain';
				$this->domain = $_SESSION['DOMAIN'];
				break;
			case 0:
			default:
				$this->rights = 'user';
				if (!@$_SESSION['DOMAIN']) {
					$this->domain = Tools::getHostDomain();
				} else {
					$this->domain = @$_SESSION['DOMAIN'];
				}
				break;
		}
	}

	protected function exeInputXML()
	{
		$aData['data'] = '';
		 		$fWrite = false;
		if ($this->aAttrs['sid']) {
			 			$oUser = User::load($this->aAttrs['sid']);
			$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
			$oGWAccount = &$oAccount->gwAccount;
			 			if (!$oGWAccount->gwAPI->IsConnected()){
				$oGWAccount->sGWSessionID = $oGWAccount->gwAPI->OpenGroup("*");
			}
			if ($this->aAttrs['type'] == 'set' && $this->sPP == 'public') {
				$default = Storage::getDefaults();
				$domain = Storage::getDomainDefaults(false, $this->domain);
				if ($this->adminAsDomain){
					$rights = '2';
				}else{
					$rights = @$_SESSION['ACCOUNT'];
				}
								
				$return = $this->get(false, $default, $domain, false, $rights, $this->adminAsDomain);
			} else {
				$return = Storage::getUserData();
				if(!$return){
					log_buffer("PrivateAndPublic::exeInputXML() : Settings are empty","EXTENDED");
				}
			}
		}
		switch ($this->aAttrs['type']) {
			case 'get':
				$this->sTemplateFile = 'webmailiqprivateandpublic_get';
				if (!file_exists(GLOBAL_SETTINGS_FILE)) {
					slSystem::import('tools/icewarp');
					slSystem::import('tools/filesystem');
					
					$settingsFolder = dirname(GLOBAL_SETTINGS_FILE);
					if (!is_dir($settingsFolder)){
						slToolsFilesystem::mkdir_r($settingsFolder, 0777, true);
					}
					slToolsIcewarp::iw_file_put_contents(
						GLOBAL_SETTINGS_FILE,
						file_get_contents(GLOBAL_SETTINGS_DEFAULT),
						LOCK_EX
					);
				}
				$error = false;
				
				foreach ($this->oResources as $oResource) {
					$data = array();
					$sResourceName = $oResource->tagName;
					$sResourceNames[] = $sResourceName;
					$result = array();
					$result['resourcename'] = $sResourceName;
					switch ($sResourceName) {
						 						case 'gw_mygroup':
							$result['items']['num'][0] = Storage::getMyGroup($oGWAccount,false);
							if ($this->sPP == 'public') {
								$result = array();
								$result['resourcename'] = $sResourceName;
							}
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/groups.tpl', $result));
							break;
						case 'autoresponder':
						case 'forwarder':
						case 'filter_rules':
						case 'antispam':
						case 'call_forwarding':
						case 'teamchat_notify':
							$result['items']['num'][0] = Storage::getUserProperties($sResourceName,false);
							if ($this->sPP == 'public') {
								$result = array();
								$result['resourcename'] = $sResourceName;
							}
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/account_properties.tpl', $result));
							break;
						case 'weather':
							if (!$oGWAccount->bLogged) {
								$error = true;
								break;
							}
							$result['holidays']['num'] = Storage::getAvailableHolidays($oGWAccount,'weather');
							if ($this->sPP == 'public')
								$result['resourcename'] = $sResourceName;
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/holidays.tpl', $result ));
							break;
						case 'holidays':
							if (!$oGWAccount->bLogged) {
								$error = true;
								break;
							}
							$result['holidays']['num'] = Storage::getAvailableHolidays($oGWAccount,'holidays');
							if ($this->sPP == 'public')
								$result['resourcename'] = $sResourceName;
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/holidays.tpl', $result));
							break;
						case 'languages':
							$result['items']['num'][0]['language']['num'] = Storage::getAvailableLanguages();
							if ($this->sPP == 'public')
								$result['resourcename'] = $sResourceName;
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/languages.tpl', $result));
							break;
						case 'skins':
							 
							$result['items']['num'][0]['skin']['num'] = Storage::getAvailableSkins();
							if ($this->sPP == 'public')
								$result['resourcename'] = $sResourceName;
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/skins.tpl', $result));
							break;
							break;
						case 'certificate':
							$result['items']['num'] = Storage::getCertificates();
							if ($this->sPP == 'public')
								$result['resourcename'] = $sResourceName;
							$result = Tools::htmlspecialchars_array($result);
							$aData['data'] .= trim(template('inc/templates/certificate.tpl', $result));
							break;
						case 'cookie_settings':
							$cookie_settings = Storage::getUserData($sResourceName);
							if ($this->sPP == 'public')
								$cookie_settings = '';
							 							$data = Tools::makeXMLStringFromTree($cookie_settings, 'cookie_settings',true);
							$aData['data'] .= $data;
							break;
						case 'domains_settings':
							$domains['items']['num'] = Storage::getAvailableDomains();
							$domains['resourcename'] = 'domains_settings';
							$domains = Tools::htmlspecialchars_array($domains);
							$data = trim(template('inc/templates/available_domains.tpl', $domains));
							$aData['data'] .= $data;
							break;
						case 'signup_domains':
							$domains['items']['num'] = Storage::getSignupDomains();
							$domains['resourcename'] = 'signup_domains';
							$domains = Tools::htmlspecialchars_array($domains);
							$data = trim(template('inc/templates/available_domains.tpl', $domains));
							$aData['data'] .= $data;
							break;
						case 'global_settings':
							$global_settings = Storage::getGlobalSettings();
							$aData['data'] .= $global_settings;
							break;
						case 'login_settings':
							$login_settings = Storage::getLoginSettings();
							$login_settings = Tools::htmlspecialchars_array($login_settings);
							$aData['data'] .= Tools::makeXMLStringFromTree($login_settings, $sResourceName);
							break;
						case 'spellchecker_languages':
							$aData['data'] .= Storage::getSpellcheckerLanguages($sResourceName);
							break;
						case 'sip_calls':
							$sip_calls['sip_calls']['num'] = Storage::getSIPCallsHistory();
							$sip_calls['resourcename'] = 'sip_calls';
							$sip_calls = Tools::htmlspecialchars_array($sip_calls);
							$data = trim(
								template(
									'inc/templates/sip_calls.tpl', 
									$sip_calls
								)
							);
							$aData['data'] .= $data;
							break;
						case 'paths':
							$paths = Storage::getPaths();
							$paths = Tools::htmlspecialchars_array($paths);
							$aData['data'] .= trim(template('inc/templates/paths.tpl', $paths));
							break;
						case 'streamhost':
							$streamhosts = Storage::getStreamHosts();
							$streamhosts = Tools::htmlspecialchars_array($streamhosts);
							$aData['data'] .= template('inc/templates/streamhost.tpl',$streamhosts);
						break;
						case 'password_policy':
							$aPolicy = array();
							$aPolicy['variables'] = array();
							$policy = Storage::getPasswordPolicy();
							if(is_array($policy) && !empty($policy)){
								foreach($policy as $var => $value){
									$variable['name'] = $var;
									$variable['value'] = $value;
									$aPolicy['variables'][] = $variable;
								}
								$aPolicy = Tools::htmlspecialchars_array($aPolicy);
							}
							$aData['data'] .= template('inc/templates/password_policy.tpl',$aPolicy);
						break;
						case 'timezones':
							$aTimezones['timezones'] = Storage::getTZIDList($oGWAccount);
							$aTimezones = Tools::htmlspecialchars_array($aTimezones);
							$aData['data'] .= template('inc/templates/timezones.tpl',$aTimezones);
						break;
						case 'licenses':
							$licences = Account::getLicense();
							$licences = Tools::htmlspecialchars_array($licences);
							$aData['data'] .= template('inc/templates/licenses.tpl',$licences);
							break;
						case 'tags':
							$aFilter = Storage::parseDOMFilter($this->oDOMDoc,$oResource,$this->sPP);
							$aTags['tags'] = Storage::getAvailableTags($oGWAccount,$aFilter);
							$aTags = Tools::htmlspecialchars_array($aTags);
							$aData['data'].= template('inc/templates/tags.tpl',$aTags);
						break;
						case 'fonts':
							$fonts = Storage::getAvailableFonts();
							$aFonts['fonts'] = Tools::htmlspecialchars_array($fonts);
							$aData['data'].= template('inc/templates/fonts.tpl',$aFonts);
						break;
						case 'aliases':
							$aliases = Storage::getAliases();
							$aliases = Storage::convertAliases($aliases);
							$aliases = Tools::htmlspecialchars_array($aliases);
							$aAliases['aliases'] = $aliases;
							$aData['data'].= template('inc/templates/aliases.tpl',$aAliases);
						break;
						case 'signature':
							if($this->sPP=='private'){
								$signatures = Storage::getSignatures($oGWAccount,$this->domain);
								$aData['data'] .= Tools::makeXMLStringFromTree($signatures, $sResourceName, true);
							}else{
								$user = Storage::getUserData($sResourceName);
								$domain = Storage::getDomainDefaults($sResourceName, $this->domain);
								$default = Storage::getDefaults($sResourceName);
								$rights = $this->adminAsDomain?2:$_SESSION['ACCOUNT'];
								$data = $this->get($sResourceName, $default, $domain, $user, $rights,$this->adminAsDomain);
								$signature = $data['@childnodes']['item'][0]['@childnodes']['text'][0]['@value'];
								 								$signature = preg_replace("/\?sid=([^&\s\"']{0,})('|\"|\s|&)/si","?sid=".$_SESSION['SID']."$2",$signature);
								 								$signature = preg_replace("/fullpath=({account})(%2F[^&\s\"']{0,})/si","fullpath=".urlencode($_SESSION['EMAIL'])."$2",$signature);
								$data['@childnodes']['item'][0]['@childnodes']['text'][0]['@value'] = $signature;
								$aData['data'] .= Tools::makeXMLStringFromTree($data, $sResourceName, true);
							}							
						break;
						case 'im':
							$user = Storage::getUserData($sResourceName);
							$domain = Storage::getDomainDefaults($sResourceName, $this->domain);
							$default = Storage::getDefaults($sResourceName);
							$rights = $this->adminAsDomain?2:$_SESSION['ACCOUNT'];
							$data = $this->get($sResourceName, $default, $domain, $user, $rights,$this->adminAsDomain);

							$oAcc = new IceWarpAccount();
							$oAcc->Open($_SESSION['EMAIL']);
							$value = $oAcc->GetProperty('U_IM_POLICY_MESSAGES_ROSTER_ONLY',$value ?? null);
							$data['@childnodes']['item'][0]['@childnodes']['privacy_policy'][0]['@value'] = $value;
							$aData['data'] .= Tools::makeXMLStringFromTree($data, $sResourceName, true);
							break;
						case 'settings':
							 						
						default:
							$slave_domain = false;
							$user = Storage::getUserData($sResourceName);
							$domain = Storage::getDomainDefaults($sResourceName, $this->domain);
							$default = Storage::getDefaults($sResourceName);
							if ($default === false) {
								$default = array();
							}
							if(isset($_SESSION['SLAVE_DOMAIN'])){
								$slave_domain = Storage::getDomainDefaults($sResourceName, $_SESSION['SLAVE_DOMAIN']);
							}
							if($sResourceName=='groups'){
								if( (  $_SESSION['ACCOUNT'] == 2
									|| $_SESSION['ACCOUNT'] == 1 && $this->adminAsDomain )
									&& $this->sPP=='public' ){
									$default = array();
								}
							}
							 							if ($this->adminAsDomain)
								$rights = '2';
							else
								$rights = @$_SESSION['ACCOUNT'];

							 							$data = $this->get($sResourceName, $default, $domain, $user, $rights,$this->adminAsDomain, $slave_domain);

							if ($sResourceName == 'imip_settings' || $sResourceName =='mail_settings_default') {
								self::setDefaults($user, $sResourceName);
							}
							if ($sResourceName == 'calendar_settings') {
								if(!isset($data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'])
								|| !$data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value']
								|| strtoupper($data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'])=='F'
								|| strtoupper($data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'])=='L'){							
									$data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'] = $_SESSION['CLIENT_TIMEZONE']?$_SESSION['CLIENT_TIMEZONE']:$_SESSION['SERVER_TIMEZONE'];
								}
								if($oGWAccount->IsConnected()){
									$data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'] = $oGWAccount->gwAPI->FunctionCall("GetMainTZID",$data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value']);
								}
							}
							if ($_SESSION['TCONLY']) {
								if($sResourceName == 'layout_settings' && isset($data['@childnodes']['item'][0]['@childnodes']['skin'][0]['@value'])){
									$data['@childnodes']['item'][0]['@childnodes']['skin'][0]['@value'] = 'default';
								}
								if($sResourceName == 'banner_options' && isset($data['@childnodes']['item'][0]['@childnodes']['top_type'][0]['@value'])){
									$data['@childnodes']['item'][0]['@childnodes']['top_type'][0]['@value'] = 'none';
								}
								if($sResourceName == 'restrictions' && isset($data['@childnodes']['item'][0]['@childnodes']['disable_gw_types'][0]['@value'])){
									$data['@childnodes']['item'][0]['@childnodes']['disable_gw_types'][0]['@value'] = 'CETNJQBWFSP';
								}
							}

							if ($sResourceName == 'mail_settings_general') {
								$data = $this->_addAutoclearSpamDays($data);
							}

							$aData['data'] .= Tools::makeXMLStringFromTree($data, $sResourceName, true);
							break;
					}
				}
				if ($error)
					log_buffer('Groupware initialization failed', 'ERROR');
				$this->aData = $aData;
				break;

			case 'set':
				 				foreach ($this->oResources as $oResource) {
					$sResourceName = $oResource->tagName;
					$sResourceNames[] = $sResourceName;
					$aActions = $this->getSentData($sResourceName);
					switch ($sResourceName) {
							 						case 'gw_mygroup':
							Storage::setMyGroup($oGWAccount, $aActions[0]['data']);
							break;
						case 'autoresponder':
						case 'forwarder':
						case 'filter_rules':
						case 'antispam':
						case 'call_forwarding':
						case 'teamchat_notify': 
							Storage::setUserProperties($sResourceName, $aActions[0]['data']);
							break;
						case 'certificate':
							Storage::setCertificates($oUser, $aActions);
							break;
						case 'cookie_settings':
							$sCookies = Tools::makeXMLStringFromTree(
											$this->set(
												$sResourceName,
												$aActions
											), 
											'cookie_settings',
											true  							);
							Storage::setUserDataStr($sCookies, $sResourceName);
							break;
							 						case 'domains_settings':
							Storage::removeAvailableDomains($aActions);
							break;
						case 'global_settings':
							if ($this->rights != 'admin' || $this->sPP != 'public')
								throw new Exc('settings_access_denied');

							if ($aActions[0]['dataTree']['@childnodes']['database']) {
								$val = $aActions[0]['dataTree']['@childnodes']['database'][0]['@value'];
								$aActions[0]['data']['database'] = $val;
								$aActions[0]['dataTree']['@childnodes']['database'][0]['@value'] = $val;
							}

							if ($aActions[0]['dataTree']['@childnodes']['upload_limit']) {
								$upload_limit = $aActions[0]['dataTree']['@childnodes']['upload_limit'][0]['@value'];
								 								file_put_contents('.user.ini','upload_max_filesize = '.$upload_limit.'M'.CRLF.'post_max_size = '.$upload_limit.'M'.CRLF);
								 								$_SESSION['UPLOAD_LIMIT'] = $upload_limit;
							}
							$api = createobject('api');
							$apisave = false;
							if ($aActions[0]['dataTree']['@childnodes']['logs']) {
								$apisave =  true;
								$api->SetProperty('C_Webmail_Logs',$aActions[0]['dataTree']['@childnodes']['logs'][0]['@value']);
							}
							if ($aActions[0]['dataTree']['@childnodes']['http_secure_cookie']) {
								$apisave =  true;
								$api->SetProperty('C_Webmail_HTTPSecureCookie',$aActions[0]['dataTree']['@childnodes']['http_secure_cookie'][0]['@value']);
							}
							if ($aActions[0]['dataTree']['@childnodes']['session_cookie']) {
								$apisave =  true;
								$api->SetProperty('C_WebMail_SessionCookie',$aActions[0]['dataTree']['@childnodes']['session_cookie'][0]['@value']);
							}
							if ($aActions[0]['dataTree']['@childnodes']['teamchat_notify']) {
								$apisave =  true;
								$api->SetProperty('C_TeamChat_Enable_Notification_Mails',$aActions[0]['dataTree']['@childnodes']['teamchat_notify'][0]['@value']);
							}
							if($apisave){
								$api->Save();
							}
							
							$data = $this->set($sResourceName, $aActions);
							$data = Tools::htmlspecialchars_array($data);
							
							Storage::setGlobalSettings(Tools::makeXMLStringFromTree($data, $sResourceName));
							break;
						case 'spellchecker_languages':
							break;
						case 'holidays':
							Storage::subscribeHolidays($oGWAccount, $aActions);
							break;
						case 'weather':
							Storage::subscribeHolidays($oGWAccount, $aActions,'weather');
							break;
						case 'personalities':
							$fWrite = true;
							$settings[$sResourceName] = $this->set($sResourceName, $aActions, false, false, true);
							break;
						case 'signature':
							if($aActions){
								foreach($aActions as $key => $aAction){
									$signature = slToolsString::purifyHTML($aAction['data']['text'], true, false);
									 									if($this->sPP=='public'){
										 										$signature = preg_replace("/\&amp;fullpath=(.*?)(%2F[^&\s\"']{0,})/si","&amp;fullpath={account}$2",$signature);	
									}
									$aActions[$key]['data']['text'] = $signature;
									$aActions[$key]['dataTree']['@childnodes']['text'][0]['@value'] = $signature;
									
								}
							}
							$fWrite = true;
							$settings[$sResourceName] = $this->set($sResourceName, $aActions, false, false, true);
							break;
						case 'aliases':
							$fWrite = true;
							$settings['aliases_data'] = Storage::setAliases($aActions,$return['@childnodes']['aliases_data']);
						break;
						case 'imip_settings':

							foreach ($aActions[0]['data'] as $skey => $sval)
								@$aActions[0]['data'][$skey] = $sval;

							$fWrite = true;
							$settings[$sResourceName] = $this->set($sResourceName, $aActions, $this->
								adminAsDomain, $this->domain);

							break;
						case 'paths':
							Storage::setPaths($aActions);
							break;
						case 'tags':
							Storage::setAvailableTags($oGWAccount,$aActions);
							break;
						 						case 'groups':
							$fWrite = true;
							$settings[$sResourceName] = Storage::setWholeArray($aActions);
							break;
						case 'im':
							$fWrite = true;
							if(isset($aActions[0]['data']['privacy_policy'])){
								$value = $aActions[0]['data']['privacy_policy'];
								unset($aActions[0]['data']['privacy_policy']);
								unset($aActions[0]['dataTree']['@childnodes']['privacy_policy']);
								$oAcc = new IceWarpAccount();
								$oAcc->Open($_SESSION['EMAIL']);
								$oAcc->SetProperty('U_IM_POLICY_MESSAGES_ROSTER_ONLY',$value);
								$oAcc->Save();
							}
							$settings[$sResourceName] = $this->set($sResourceName, $aActions, $this->
								adminAsDomain, $this->domain);
							break;
						 
						case 'login_settings':
							 							unset($aActions[0]['data']['logging_type']);
							unset($aActions[0]['dataTree']['@childnodes']['logging_type']);

						case 'calendar_settings':
							if($timezone = $aActions[0]['data']['timezone']){
								$timezone = $oGWAccount->gwAPI->FunctionCall("GetMainTZID",$timezone);
								 								$oGWAccount->setGroupTimezone($timezone);
								$_SESSION['CLIENT_TIME'] = $timezone;
							}
						case 'mail_settings_general':
							if (array_key_exists('autoclear_spam', $aActions[0]['data'])) {
								$this->_setAutoclearSpamDays($aActions);
								
								 								unset($aActions[0]['data']['autoclear_spam_days']);
								unset($aActions[0]['data']['autoclear_spam']);
								unset($aActions[0]['dataTree']['@childnodes']['autoclear_spam_days']);
								unset($aActions[0]['dataTree']['@childnodes']['autoclear_spam']);
							}

						case 'settings':
						default:
							$fWrite = true;
							if($sResourceName == 'default_folders' && $this->sPP == 'private'){
								$_SESSION['user']->onStorageUpdate($return,$aActions);
							}

							 							$settings[$sResourceName] = $this->set($sResourceName, $aActions, $this->
								adminAsDomain, $this->domain);
							break;
					}
				}

				 
				
				$this->updateSettings($settings,$sResourceName,$this->sPP);

				 				if (is_array($settings) && $fWrite) {
					foreach ($settings as $key => $value)
						$return['@childnodes'][$key][0] = $value;

					$return = Tools::makeXMLStringFromTree($return, 'settings', true);
					switch ($this->rights) {
						case 'user':
							Storage::setUserDataStr($return, $sResourceName);
							break;
						case 'domain':
							if ($this->sPP == 'public')
								Storage::setDomainDefaultsStr($return, $sResourceName, $this->domain);
							else
								Storage::setUserDataStr($return, $sResourceName);
							break;
						case 'admin':
							if ($this->sPP == 'public')
								Storage::setDefaultsStr($return, $sResourceName);
							else
								Storage::setUserDataStr($return, $sResourceName);
							break;
					}
				}


				break;
		}
	}

	public function updateSettings(&$aData,$resourcename = '',$sPP = '')
	{
		$aUpdate = array(array('DEFAULTCHARSET', 'mail_settings_default', 'charset'),
			array('IMIP_SUBJECT_INVITE', 'imip_settings', 'imip_subject_invite'), array('IMIP_SUBJECT_UPDATE',
			'imip_settings', 'imip_subject_update'), array('IMIP_SUBJECT_CANCEL',
			'imip_settings', 'imip_subject_cancel'), array('IMIP_SUBJECT_ACCEPT',
			'imip_settings', 'imip_subject_accept'), array('IMIP_SUBJECT_DECLINE',
			'imip_settings', 'imip_subject_decline'));

		foreach ($aUpdate as $aUp) {
			if ($aData[$aUp[1]]['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]['@value'] &&
				(!$aUp[3] || $this->sPP == $aUp[3])) {
				@$_SESSION[$aUp[0]] = $aData[$aUp[1]]['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]['@value'];
			}
			if (isset($aData[$aUp[1]]['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]) &&
				!isset($aData[$aUp[1]]['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]['@value']))
				@$_SESSION[$aUp[0]] = '';
		}
		if($logout_url = $aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['logout_url'][0]['@value']){
			if(!preg_match('/((http|https):\/\/)/si',$logout_url,$matches)){
				$logout_url = 'http://'.$logout_url;
				$aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['logout_url'][0]['@value'] = $logout_url;
			}
		}
		if($logo = $aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['login_logo'][0]['@value']){
			$aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['logo_uid'][0]['@value'] = md5(uniqid());
		}
		if($background = $aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['login_background_name'][0]['@value']){
			$aData['layout_settings']['@childnodes']['item'][0]['@childnodes']['login_background_uid'][0]['@value'] = md5(uniqid());
		}

		@$_SESSION['user']->imipDefaults();

		return true;
	}

	public function getSentData($sResourceName)
	{

		$result = array();
		$oDOMResource = $this->oDOMDoc->query($this->sPP . ':resources/' . $this->sPP .
			':' . $sResourceName . '/' . $this->sPP . ':item', $this->oDOMQuery);
		foreach ($oDOMResource as $oDOMItem) {
			$aItem['data'] = Tools::makeArrayFromXML($oDOMItem,true);
			$aItem['dataTree'] = Tools::makeTreeFromXML($oDOMItem);
			 			if ($aItem['uid'] = $oDOMItem->getAttribute("uid")) {
				 				if ($oDOMItem->hasChildNodes())
					$aItem['action'] = 'edit';
				else
					$aItem['action'] = 'delete';
				if($oDOMItem->getAttribute("action")){
					$aItem['action'] = $oDOMItem->getAttribute("action");
				}
			} else {
				$aItem['action'] = 'add';
			}
			$aResult[] = $aItem;
		}
		 		return $aResult;
	}

	public static function removeAttrs($data, $account)
	{
		if ($data['@childnodes']['item'])
			foreach ($data['@childnodes']['item'] as $itemID => $itemVal)
				foreach ($itemVal['@childnodes'] as $key => $val) {
					$itm = array();
					if ($rights = $val[0]['@attributes'][Storage::$rightType[$account]])
						$itm['@attributes']['access'] = $rights;

					if ($itm['@attributes']['access'] != 'none')
						$itm['@value'] = $val[0]['@value'];

					$data['@childnodes']['item'][0]['@childnodes'][$key][0] = $itm;
				}

		return $data;
	}

	private static function setDefaults(&$aData, $sResourceName)
	{
		$aUpdate = array(array('DEFAULTCHARSET', 'mail_settings_default', 'charset'),
			array('IMIP_SUBJECT_INVITE', 'imip_settings', 'imip_subject_invite'), array('IMIP_SUBJECT_UPDATE',
			'imip_settings', 'imip_subject_update'), array('IMIP_SUBJECT_CANCEL',
			'imip_settings', 'imip_subject_cancel'), array('IMIP_SUBJECT_ACCEPT',
			'imip_settings', 'imip_subject_accept'), array('IMIP_SUBJECT_DECLINE',
			'imip_settings', 'imip_subject_decline'));

		foreach ($aUpdate as $aUp) {
			if (!$aData['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]['@value'] && $sResourceName ==
				$aUp[1]) {
				$aData['@childnodes']['item'][0]['@childnodes'][$aUp[2]][0]['@value'] = @$_SESSION[$aUp[0]];
			}
		}

		return true;

	}

	 
	private function _setAutoclearSpamDays(array $aData) {
		if ('1' === $aData[0]['data']['autoclear_spam']) {
			$iAutoclearSpamDays = (int)$aData[0]['data']['autoclear_spam_days'];
		} else {
			$iAutoclearSpamDays = 0;
		}

		 		$iAutoclearSpamDays = $iAutoclearSpamDays > 255 ? 255 : $iAutoclearSpamDays;

		 		if ('private' === $this->sPP) {
			Storage::setUserAutoclearSpamDays($_SESSION['user']->email, $iAutoclearSpamDays);
		}

		 		if ('public' === $this->sPP && 'domain' === $this->rights) {
			Storage::setDomainAutoclearSpamDays($this->domain, $iAutoclearSpamDays);
		}
	}

	 
	private function _addAutoclearSpamDays(array $aData) {
		 		$bIsUserRequested = 'private' === $this->sPP;
		
		 		$bIsDomainRequested = 'public' === $this->sPP && 'domain' === $this->rights;

		if ($bIsUserRequested || $bIsDomainRequested) {
			if ($bIsUserRequested) {
				$iAutoclearSpamDays = Storage::getUserAutoclearSpamDays($_SESSION['user']->email);
			}

			if ($bIsDomainRequested) {
				$iAutoclearSpamDays = Storage::getDomainAutoclearSpamDays($this->domain);
			}

			$aData['@childnodes']['item'][0]['@childnodes']['autoclear_spam'] = [[
				'@value' =>  $iAutoclearSpamDays ? '1' : '0'
			]];
			$aData['@childnodes']['item'][0]['@childnodes']['autoclear_spam_days'] = [[
				'@value' => $iAutoclearSpamDays ? $iAutoclearSpamDays : ''
			]];
		}
		
		return $aData;
	}
}
?>
