<?php
require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/user.php');
require_once('inc/storage/storage.php');

class WebmailSettings
{
	private static $instance;
	private $cache;
	private $oUser;
	
	static public function instance($session = false)
	{
		if(!isset(self::$instance)){
			self::$instance = new WebmailSettings($session);
		}
		return self::$instance;
	}
	
	protected function __construct(&$session = false)
	{
		$this->session = &$session;
		$this->init();
	}
	
	public function init()
	{
		if(isset($_SESSION['user'])){
			$this->sDomain = $_SESSION['DOMAIN'];
			$this->oUser = &$_SESSION['user'];
			$this->oAccount = $this->oUser->getAccount($_SESSION['EMAIL']);
			$this->cache = &$_SESSION['BASIC']['SETTINGS'];
			$this->bLogged = true;
			$aLayoutSettings = $this->getPrivate('layout_settings');
			$aLoginSettings = $this->getPrivate('login_settings');
			$lang = slSession::instance()->getMain('login_language');
		} else {
			$this->sDomain = Tools::getHostDomain();
			$aLoginSettings = $this->getPublic('login_settings');
			$aLayoutSettings = $this->getPublic('layout_settings');
			$lang = explode('|',$_COOKIE['lastLogin'])[0];
			$this->bLogged = false;
		}
		$lang = $lang?$lang:$aLayoutSettings['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'];
		
		 		$this->version = $aLoginSettings['@childnodes']['item'][0]['@childnodes']['version'][0]['@value'];
		
		$this->lang = $lang;
		$this->welcome = $aLayoutSettings['@childnodes']['item'][0]['@childnodes']['login_title'][0]['@value'];
		if(!$this->lang){
			$this->lang = 'en';
		}
		 		 		slSystem::import('application/language');
		$lang =  slLanguage::instance($this->lang);
		if(!$this->welcome){
			$this->welcome = $lang->get('login','welcome');
		}
	}
	
	public function getPublic($sResourceName,$actual_domain = false)
	{
		 		$key = $actual_domain?$actual_domain:'global';
		if(!$this->cache['public'][$sResourceName][$key]['set']){
			$this->cache['public'][$sResourceName][$key]['set'] = true;
			$this->cache['public'][$sResourceName][$key]['data'] = $this->get(
				'public',
				$sResourceName,
				$actual_domain
			);
		}
		return $this->cache['public'][$sResourceName][$key]['data'];
	}
	
	public function getPrivate($sResourceName)
	{
		if(!$this->cache['private'][$sResourceName]['set']){
			$this->cache['private'][$sResourceName]['set'] = true;
			$this->cache['private'][$sResourceName]['data'] = $this->get(
				'private',
				$sResourceName
			);
		}
		return $this->cache['private'][$sResourceName]['data'];
	}
	
	public function getDefault($sResourceName)
	{
		switch($sResourceName){
			case 'skins':
				$aValues = array(
					'default'=>'Default'
				);
				break;
	
			case 'im':
				$aValues = array(
					'enter_send'=>1,
					'auto_chat'=>1,
					'auto_status'=>1
				);
				break;
	
			case 'mail_settings_default':
				$aValues = array(
					'spellchecker'=>'en',
					'html_message'=>0,
					'read_confirmation'=>0,
					'save_sent_message'=>1,
					'encrypt'=>0,
					'sign'=>0,
					'reply_to_address'=>'',
					'priority'=>3,
					'charset'=>'UTF-8'
				);
				break;
	
			case 'mail_settings_general':
				$aValues = array(
					'sound_notify'=>0,
					'autoupdate'=>0,
					'autoupdate_minutes'=>5,
					'move_to_trash'=>1,
					'forward_messages'=>'inline',
					'autosave'=>1,
					'autosave_minutes'=>5,
					'default_flag'=>'1',
					'auto_recipient_to_addressbook'=>'0',
					'auto_show_images'=>'0',
					'autoclear_trash_days'=>'30'
				);
				break;
	
			case 'layout_settings':
				$aValues = array(
					'skin'=>'default',
					'language'=>'en',
					'dgrid_preload'=>20,
					'logo'=>'logo.gif',
					'date_format'=>0,
					'time_format'=>0,
					'init_page'=>'i',
					'confirm_exit'=>1
				);
				break;
				
			case 'basic':
				$aValues = array(
					'dgrid_preload'=>20,
					'html_message'=>1
				);
				
				break;
			case 'homepage_settings':
				$aValues = array(
					'banner_height'=>60,
					'application'=>1
				);
				break;
	
			case 'calendar_settings':
				$aValues = array(
					'week_begins'=>'sunday',
					'begin_on_today'=>0,
					'day_begins'=>8,
					'day_ends'=>16
				);
				break;
	
			case 'default_calendar_settings':
				$aValues = array(
					'event_view'=> 'week_view',
					'event_show_as'=> 'S',
					'event_sharing'=> 'U',
					'contact_sharing'=> 'U',
					'journal_sharing'=> 'U',
					'note_sharing'=> 'U',
					'task_sharing'=> 'U'
				);
				break;
	
			case 'event_settings':
				$aValues = array(
					'time'=>0,
					'rm_type'=>'E',
					'email'=>''
				);
				break;
	
			case 'read_confirmation':
				$aValues = array(
					'text'=>slLanguage::instance()->get('email','reading_confirmation'),
					'subject'=>slLanguage::instance()->get('email','reading_confirmation_subject')
				);
				break;
	
			case 'signature':
				$aValues = array(
					'text'=>'',
					'to_top'=>1
				);
				break;
	
			case 'login_data':
				$aValues = array(
					'ie_6_warning_show_on'=>0
				);
				break;
	
			case 'forgot_settings':
				$aValues = array(
					'forgot'=>0,
					'mail'=>slLanguage::instance()->get('forgot_pass','email'),
					'subject'=>slLanguage::instance()->get('forgot_pass','subject')
				);
				break;
			case 'reset_settings':
				$aValues = array(
				'enabled'=>0,
				'mail'=>slLanguage::instance()->get('forgot_pass','email'),
				'subject'=>slLanguage::instance()->get('forgot_pass','subject')
				);
				break;	
			case 'restrictions':
				$aValues = array(
					'disable_otheraccounts'=>0,
					'disable_changepass'=>0,
					'disable_signup'=>1
				);
				break;
		}
		return $aValues;
	}
	
	public function get($sType,$sResourceName,$actual_domain = false)
	{
		if(!$actual_domain){
			$actual_domain = $_SESSION['DOMAIN'];
		}
		$this->prepare($actual_domain);
		if(isset($_SESSION['user'])){
			$this->oUser = $_SESSION['user'];
			$oAccount = $this->oUser->getAccount($_SESSION['EMAIL']);
			$oGWAccount = &$oAccount->gwAccount;
			 			if (!$oGWAccount->gwAPI->IsConnected()){
				$oGWAccount->sGWSessionID = $oGWAccount->gwAPI->OpenGroup("*");
			}
		}else{
			if($sType=='public'){
				if(!isset(PrivateAndPublic::$aPublicNamespace[$sResourceName])){
					try{
					throw new Exception('settings_unauthorized_access');
					}catch(Exception $e){
						print_r($e);die();
					}
				}
			}
		}
		switch($sResourceName) {
			 			 			case 'gw_mygroup':
				$aSettings = Storage::getMyGroup($oGWAccount);
				if ($sType == 'public')
					$aSettings = array();
				break;
			case 'autoresponder':
			case 'forwarder':
			case 'filter_rules':
			case 'antispam':
				$aSettings = Storage::getUserProperties($sResourceName);
				if ($sType == 'public')
					$aSettings = array();
			
				break;
			case 'holidays':
				if (!$oGWAccount->bLogged) {
					$error = true;
					break;
				}
				$aSettings = Storage::getAvailableHolidays($oGWAccount);
				break;
			case 'languages':
				$aSettings = Storage::getAvailableLanguages();
				break;
			case 'skins':
				$aSettings = Storage::getAvailableSkins();
				break;
			case 'certificate':
				$aSettings = Storage::getCertificates(true);
				break;
			case 'domains_settings':
				$aSettings = Storage::getAvailableDomains($sResourceName);
				break;
			case 'signup_domains':
				$aSettings = Storage::getSignupDomains($sResourceName);
				break;
			case 'global_settings':
				slSystem::import('tools/dom');
				$xmlSettings = Storage::getGlobalSettings();
				$xml = slToolsDOM::openFromString($xmlSettings);
				$aSettings = Tools::makeTreeFromXML($xml);
				break;
			case 'login_settings':
				$aSettings = Storage::getLoginSettings();
				break;
			case 'spellchecker_languages':
				slSystem::import('tools/dom');
				$xmlSettings = Storage::getSpellcheckerLanguages($sResourceName);
				$xml = slToolsDOM::openFromString($xmlSettings);
				$aSettings = Tools::makeTreeFromXML($xml);
				$aSettings = $aSettings['@childnodes']['spellchecker_languages'][0];
				break;
			case 'sip_calls':
				$aSettings = Storage::getSIPCallsHistory();
				break;
			case 'paths':
				$aSettings = Storage::getPaths();
				break;
			case 'streamhost':
				$aSettings = Storage::getStreamHosts();
			break;
			case 'aliases':
				$aliases = Storage::getAliases();
				$aliases = Storage::convertAliases($aliases);
				$aSettings = $aliases;
			break;
			case 'fonts':
				$aSettings = Storage::getAvailableFonts();
			break;

			case 'settings':
			 			default:
				if($sResourceName=='signature' && $sType=='private'){
					$aSettings = Storage::getSignatures($oGWAccount,$this->domain);
					break;
				}
				$aData['aGlobal'] = Storage::getDefaults($sResourceName);
				$aData['aDomain'] = Storage::getDomainDefaults($sResourceName,$this->domain);
				if($this->oUser) {
					$aData['aUser'] = Storage::getUserData($sResourceName);
				} else {
					$aData['aUser'] = false;
				}
				if($sType=='private') {
					$aSettings = WebmailIqPrivate::get($sResourceName,$aData['aGlobal'],$aData['aDomain'],$aData['aUser'],false);
				} else {
					if ($this->adminAsDomain){
						$rights = 2;
					}else{
						$rights = 1;
					}
					if(!$_SESSION['user']){
						$rights = 0;
					}
					 					$aSettings = WebmailIqPublic::get(
						$sResourceName,
						$aData['aGlobal'],
						$aData['aDomain'],
						false,
						$this->rights
					);
				}
				
				break;
				
		}
		$defaults = $this->getDefault($sResourceName);
		if($defaults) foreach($defaults as $key => $val){
			if(!isset($aSettings['@childnodes']['item'][0]['@childnodes'][$key])){
				$aSettings['@childnodes']['item'][0]['@childnodes'][$key][0]['@value'] = $val;
			}
		}
		return $aSettings;
	}
	
	public function setPublic($aActions,$actual_domain = false)
	{
		 		$this->set('public',$aActions,$actual_domain);
	}
	
	public function setPrivate($aActions)
	{
		 		$this->set('private',$aActions);
	}
	
	public function set($sType,$aResourceActions,$actual_domain = false)
	{
		$this->prepare($actual_domain);
		if($aResourceActions) foreach($aResourceActions as $sResourceName => $aActions){

			if(isset($_SESSION['user'])){
				$this->oUser = $_SESSION['user'];
				$oAccount = &$this->oUser->getAccount($_SESSION['EMAIL']);
				$oGWAccount = &$oAccount->gwAccount;
				 				if (!$oGWAccount->gwAPI->IsConnected()){
					$oGWAccount->sGWSessionID = $oGWAccount->gwAPI->OpenGroup("*");
				}
				if ($sType == 'public') {
					$default = Storage::getDefaults();
					$domain = Storage::getDomainDefaults(false, $this->domain);
					if ($this->adminAsDomain){
						$rights = '2';
					}else{
						$rights = @$_SESSION['ACCOUNT'];
					}
					$return = WebmailIqPublic::get($sResourceName, $default, $domain, false, $rights);
				} else {
					
					$return = Storage::getUserData();
				}
			}
			switch ($sResourceName) {
				 				case 'gw_mygroup':
					Storage::setMyGroup($oGWAccount, $aActions[0]['data']);
					break;
				case 'autoresponder':
				case 'forwarder':
				case 'filter_rules':
				case 'antispam':
					Storage::setUserProperties($sResourceName, $aActions[0]['data']);
					break;
				case 'certificate':
					Storage::setCertificates($oUser, $aActions);
					break;
					 				case 'domains_settings':
					Storage::removeAvailableDomains($aActions);
					break;
				case 'global_settings':
					if ($this->rights != 'admin' || $sType != 'public')
						throw new Exc('settings_access_denied');
	
					if ($aActions[0]['dataTree']['@childnodes']['database']) {
						$val = Tools::unhtmlspecialchars($aActions[0]['dataTree']['@childnodes']['database'][0]['@value']);
						$aActions[0]['data']['database'] = $val;
						$aActions[0]['dataTree']['@childnodes']['database'][0]['@value'] = $val;
					}
	
					$data = WebmailIqPublic::set($sResourceName, $aActions);
	
					Storage::setGlobalSettings(Tools::makeXMLStringFromTree($data, $sResourceName,true));
					break;
				case 'spellchecker_languages':
					break;
				case 'holidays':
					Storage::subscribeHolidays($oGWAccount, $aActions);
					break;
				case 'personalities':
					$fWrite = true;
					$settings[$sResourceName] = WebmailIqPrivate::set($sResourceName, $aActions, false, false, true);
					break;
				case 'imip_settings':
	
					foreach ($aActions[0]['data'] as $skey => $sval)
						@$aActions[0]['data'][$skey] = slToolsPHP::htmlspecialchars($sval);
	
					$fWrite = true;
					$settings[$sResourceName] = WebmailIqPrivate::set($sResourceName, $aActions, $this->
						adminAsDomain, $this->domain);
	
					break;
				case 'paths':
					Storage::setPaths($aActions);
					break;
				case 'aliases':
					$settings['aliases_data'] = Storage::setAliases($aActions,$return['@childnodes']['aliases_data']);
					break;
				case 'login_settings':
					 					unset($aActions[0]['data']['logging_type']);
					unset($aActions[0]['dataTree']['@childnodes']['logging_type']);
	
				case 'settings':
				default:
				
					$fWrite = true;
					if($sResourceName == 'default_folders' && $sType == 'private'){
						$_SESSION['user']->onStorageUpdate($return,$aActions);
					}
					if($sType=='public'){
						$settings[$sResourceName] = WebmailIqPublic::set(
							$sResourceName, 
							$aActions, 
							$this->adminAsDomain, 
							$this->domain
						);
					}else{
						$settings[$sResourceName] = WebmailIqPrivate::set(
							$sResourceName, 
							$aActions, 
							$this->adminAsDomain, 
							$this->domain
						);
					}
					break;
			}
		}
		PrivateAndPublic::updateSettings($settings,$sResourceName,$sType);
		$sResourceName = 'settings';
		 		if (is_array($settings) && $fWrite) {
			foreach ($settings as $key => $value)
				$return['@childnodes'][$key][0] = $value;

			$return = Tools::makeXMLStringFromTree($return, 'settings',true);
			switch ($this->rights) {
				case 'user':
					Storage::setUserDataStr($return, $sResourceName);
					break;
				case 'domain':
					if ($sType == 'public')
						Storage::setDomainDefaultsStr($return, $sResourceName, $this->domain);
					else
						Storage::setUserDataStr($return, $sResourceName);
					break;
				case 'admin':
					if ($sType == 'public'){
						Storage::setDefaultsStr($return, $sResourceName);
						
					}else
						Storage::setUserDataStr($return, $sResourceName);
					break;
			}
		}
	}
	
	public function prepare($actual_domain = false)
	{
		unset($this->adminAsDomain);
		unset($this->rights);
		unset($this->domain);
		
		switch (@$_SESSION['ACCOUNT']) {
			case 1:
				$this->rights = 'admin';
				 				if ($actual_domain) {
					$this->rights = 'domain';
					$this->adminAsDomain = true;
					$this->domain = $actual_domain;
				}
				break;
			case 2:
				$this->rights = 'domain';
				$this->domain = $_SESSION['DOMAIN'];
				break;
			case 0:
			default:
				$this->rights = 'user';
				if($actual_domain){
					$this->domain = $actual_domain;
				}else{
					if (!@$_SESSION['DOMAIN']) {
						$this->domain = Tools::getHostDomain();
					} else {
						$this->domain = @$_SESSION['DOMAIN'];
					}
				}
				break;
		}
	}

	
	public function clearCache($resource,$type = 'private',$actual_domain = false)
	{
		$key = $actual_domain?$actual_domain:'global';
		unset($this->cache[$type][$resource]);
	}
}
?>