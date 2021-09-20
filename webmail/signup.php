<?php
 if(!defined('SHAREDLIB_PATH')) {
    if (($sharedLibPath = realpath(__DIR__ . '/../_shared')) && is_dir($sharedLibPath)) {
        define('SHAREDLIB_PATH', $sharedLibPath . '/');
    } else {
        define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
    }
}
require_once(SHAREDLIB_PATH.'system.php');
 define('CLIENT','client');

class SignupAncestor
{
	 	private $licenseType;
	private $meeting;
	private $desktop;
	private $pda;
	private $directLogin;
	private $error;
	private $message;
	private $template;
	protected $templateData;
	
	 	private $interface;
	private $language;
	private $iso_language;
	private $languages;
	private $language_data;
	private $domains;
	private $reset_enabled;
	private $password_policy;

	public $policy;
	public $recommended_interface;
	public $OSName;
	public $OSCode;
	public $normal_login_exception;
	public $force_no_js;
	public $permanentLogin;
	public $normalLogin;
	public $forceLogin;
	public $encodeCredentials;
	public $webmail_url;
	public $settings;
	public $language_forced;
	public $language_label;
	public $skin;
	public $allowed_interfaces;
	public $preselected;
	public $username;
	public $password;
	public $forcedTemplate;
	public $eDataInfo;
	public $hash;
	public $facebook_disabled;
	public $twitter_disabled;
	public $facebook_link;
	public $twitter_link;
	public $banner_enabled;
	public $platform;
	public $mobile_help;
	public $lastLogin;
	public $cookie;
	public $global_settings;
	public $base;
	public $base_login;
	public $self;
	public $api;


    public function __construct()
	{
		$this->api = IceWarpAPI::instance(defined('APP_MAINTENANCE_IDENTITY')?APP_MAINTENANCE_IDENTITY:'Signup');
        $this->cacheWorkaround();
        $this->defines();
        $this->handleExternal();
		$this->processCookies();
		$this->getSettings();
		$this->errorHandler();
		$this->messageHandler();
		if(!defined('SESSION_COOKIE_NAME')){
			define('SESSION_COOKIE_NAME','PHPSESSID_LOGIN');
			ini_set('session.name',SESSION_COOKIE_NAME);
		}
		$this->permanentLogin();
		$this->ssoLogin();
	}
	
	private function getClearURI()
	{
		$uri=preg_replace('/\-\.\.\_\.\_\.\-\-\.\.\_[0-9].*\//','',$_SERVER['REQUEST_URI']);
		$uri=parse_url($uri);
		return $uri['path'];
	}
	
	private function maskMorseCode()
	{
		$uri_parsed=parse_url($_SERVER['REQUEST_URI']);
		if(empty($_SERVER['QUERY_STRING']))
		{
			if(preg_replace('/\-\.\.\_\.\_\.\-\-\.\.\_[0-9].*\//','',$_SERVER['PHP_SELF'])!=$_SERVER['PHP_SELF'])
			{
				header('Location: '.$this->getClearURI());
				die();
			}
		}
	}
	
	private function processVersionSwitcher()
	{
		 		@$serverData=slToolsXML::loadFile($this->api->GetProperty('C_ConfigPath')."_webmail/server.xml");
		
		if((!isset($_COOKIE['prefered_version']) || $_COOKIE['prefered_version']=='') && isset($serverData) && isset($serverData->item->prefered_version_default) && $serverData->item->prefered_version_default=='0')
		{
			$this->cookie->setcookie('prefered_version','0',mktime(0,0,0,1,1,2030),'/');
			$_COOKIE['prefered_version']=0;
		}
		
		if(isset($_GET['remove_persistence']))
		{
			 			$this->cookie->setcookie('prefered_version','1',mktime(0,0,0,1,1,2030),'/');
			$query=str_replace(array('&remove_persistence','remove_persistence'),array('',''),$_SERVER['QUERY_STRING']);
			header('Location: '.$this->getClearURI().(!empty($query)?'?'.$query:''));
			die();
		}
		elseif(!isset($_GET['meeting']) && isset($_COOKIE['prefered_version']) && $_COOKIE['prefered_version']==0)
		{
			if(file_exists('../old'))
			{
				header('Location: '.$this->getClearURI().'old/');
				die();
			}
			else
			{
				$this->cookie->setcookie('prefered_version','',0,'/');
				header('Location: '.$this->getClearURI());
				die();
			}
		}
		 	}
	
	private function generateFacebookLikeButtonLink($url)
	{
		$button_url_template="https://www.facebook.com/plugins/like.php?href={URL}&width&layout=button_count&action=like&show_faces=false&share=false&height=21";
		if(substr($url,0,2)=='//'){$url='http:'.$url;}
		$parsed_url=parse_url($url);
		if(!isset($parsed_url['scheme'])){
			$url='http://'.$url;
			$parsed_url=parse_url($url);
		}
		
		$link=$url;
		
		if(!(($parsed_url['host']=='www.facebook.com' || $parsed_url['host']=='facebook.com') && substr($parsed_url['path'],1,7)=='plugins')){
			$link=str_replace(array(
					'{URL}'
				),array(
					urlencode($url)
				),
				$button_url_template
			);
		}
		
		return $link;
	}
		
	public function draw()
	{
		$template = $this->getTemplate();
		$templateData = $this->getTemplateData();
		echo template($template,$templateData);
		if(session_id() && !$_SESSION['user']){
			@session_destroy();
		}
	}

	
	protected function getTemplateData()
	{
		$this->maskMorseCode();

		$this->templateData['query_string'] = (empty($_SERVER['QUERY_STRING'])?'':'?'.slToolsPHP::htmlspecialchars($_SERVER['QUERY_STRING']));
		$this->templateData['older_version_available'] = file_exists('../old');  		$this->templateData['request'] = slRequest::instance()->data();
		$this->templateData['banner_enabled'] = $this->banner_enabled;
		$this->templateData['lang'] = $this->language_data;
		$this->templateData['language'] = $this->language;
		$this->templateData['language_label'] = $this->translateLanguage($this->language,'English');
		$this->templateData['language_forced'] = $this->language_forced;
		$this->templateData['languages'] = $this->languages;
		$this->templateData['iso_language'] = $this->iso_language;
		$this->templateData['meetingID'] = (isset($_GET['meeting'])?$_GET['meeting']:'');

		if($this->error){
			$this->templateData['error'] = $this->error;
		}
		if($this->message){
			$this->templateData['message'] = $this->message;
		}
		if($this->normal_login_exception){
			$this->templateData['normal_login_exception'] = $this->normal_login_exception;
		}
		if($this->force_no_js){
			$this->templateData['force_no_js'] = $this->force_no_js;
		}
		$this->templateData['domains'] = $this->domains;
		$this->templateData['login_username_title'] = $this->settings['logging_type']?$this->language_data['login_screen']['email']:$this->language_data['login_screen']['user'];
		$this->templateData['interface'] = slToolsPHP::htmlspecialchars($this->interface);
		
		$this->templateData['allowed_interfaces'] = $this->allowed_interfaces;
		$this->templateData['recommended_interface'] = $this->recommended_interface;
		$this->templateData['username'] = slToolsPHP::htmlspecialchars($this->username);
		$this->templateData['settings'] = $this->settings;
		$this->templateData['permanentLogin'] = $this->permanentLogin;
		$this->templateData['eDataInfo'] = $this->eDataInfo;
		$this->templateData['ctz'] = date('Z')/60;
		$this->templateData['OSCode'] = $this->OSCode;
		$this->templateData['OSName'] = $this->OSName;
		$this->templateData['SIP_Port'] = $this->api->GetProperty('c_system_services_sip_port');
		 		$this->templateData['base'] = $this->base;
		$this->templateData['base_login'] = $this->base_login;
		$this->templateData['self'] = $this->self;
		$this->templateData['client'] = CLIENT;
		$this->templateData['filtered_query_string'] = self::getClearGet();
		$this->templateData['forceLogin'] = $this->forceLogin;
		$this->templateData['forceNoJS'] = $this->force_no_js;
		$this->templateData['post'] = $_POST;
		$this->templateData['get'] = $_GET;
		$this->templateData['json_get'] = json_encode($_GET);
		$this->templateData['hash'] = $this->hash;
		$this->templateData['lastLogin'] = $this->lastLogin;
		$this->templateData['meeting_id'] = ($_REQUEST['meeting']?$_REQUEST['meeting']:false);
		$this->templateData['meeting_supported'] = $this->OSCode=='device'?false:true;
		$this->templateData['mikogo_supported'] = (($this->OSCode=='mac' || $this->OSCode=='device') && !isset($_GET['siponly']))?false:true;
		$this->templateData['normal_login_exception'] = $this->normal_login_exception;
		$this->templateData['pwPolicy'] = $this->policy;
		$this->templateData['time'] = time();
		$this->templateData['url']['install'] = $this->api->GetProperty('C_Install_URL');
		$this->templateData['facebook_enabled'] = !$this->facebook_disabled;
		$this->templateData['twitter_enabled'] = !$this->twitter_disabled;
		$this->templateData['facebook_link'] = $this->generateFacebookLikeButtonLink($this->facebook_link);
		$this->templateData['facebook_page_to_like'] = $this->facebook_link;
		$this->templateData['twitter_link'] = $this->twitter_link;

		if($this->recommended_interface['main']['js']=='pda'){
			$login_action = 'pda/';
		}
		if($this->recommended_interface['main']['js']=='basic'){
			$login_action = 'basic/';
		}
		
		$this->templateData['filtered_query_string'] = self::getClearGet();
		
		$this->templateData['login_action'] = $login_action?$login_action:'basic/';

		return $this->templateData;
	}
	
	protected function getTemplateFile($defaultSkin,$template,$client='client')
	{
		if (file_exists(APP_INCLUDE_PATH.'templates/'.$template)){
			return APP_INCLUDE_PATH.'templates/'.$template;
		} else {
			return APP_INCLUDE_PATH.'templates/'.$template;
		}
	}
	
	protected function getTemplate()
	{		
		$mdr = self::mobileDeviceRecognition();
		$OS = self::getOS();
		$this->OSName = $OS['name'];
		$this->OSCode = $OS['code'];
		$this->pda = $mdr['pda'];
		$defaultSkin="";
		if(isset($this->skin)){
			$defaultSkin=$this->skin;
		}
		
		$this->normal_login_exception = $mdr['normal_login_exception'];
		$this->force_no_js = $mdr['force_no_js'];
		$this->desktop = $_REQUEST['to']=='pro'?true:false;
		$this->directLogin = ( 	isset($_REQUEST['sid']) || isset($_COOKIE['login_sid']) || isset($_REQUEST['atoken']) 
							 || isset($_REQUEST['frm']) || isset($_GET['!'])
							 ) && $this->licenseType!='simple';

		if (isset($_GET['meeting']) && !isset($_GET['member']) && (!isset($_COOKIE['lastUsername']) || isset($_GET['force']) || $this->OSCode=='device')){
			$this->meeting = $_GET['meeting'];
		}

		if(isset($_GET['pda'])){$this->pda=true;}
        $browserInfo = $this->browser_info();
		if (isset($_GET['videoBox'])) {
			$this->template = $this->getTemplateFile($defaultSkin, 'video.box.tpl', CLIENT);
		} elseif ($this->meeting) {
            
			 			if (!isset($_GET['old'])) {
				 
				$this->template = $this->getTemplateFile($defaultSkin, 'meeting.webrtc.tpl', CLIENT);
			} else {
				$this->template = $this->getTemplateFile($defaultSkin, 'meeting.tpl', CLIENT);
			}
		} elseif ($this->directLogin) {
			 			if (isset($_COOKIE['login_sid'])) {
				$this->templateData['activeSID'] = $_COOKIE['login_sid'];
			}
			if (isset($_REQUEST['sid'])) {
				$this->templateData['activeSID'] = $_REQUEST['sid'];
			}
			if (isset($_REQUEST['atoken'])) {
				$user = IceWarpAPI::instance()->FunctionCall("GetTokenEmail",$_REQUEST['atoken']);
				$pass = IceWarpAPI::instance()->FunctionCall("GetTokenPassword",$_REQUEST['atoken']);
				try{
					$sid = User::login(
						$user,
						$pass,
						"",
						"",
						true,
						"",
						false,
						false,
						false,
						$_GET['language'],
						$_GET['remember']?'wm-perm':'wm'
					);
					$this->templateData['activeSID'] = $sid;
					$this->cookie->setcookie('login_sid',$sid,mktime(0,0,0,1,1,2030),'/');
	                header("Location: ./ ");
					die();
				}catch(Exc $e){
					header("Location: ./?eid=".$e->wmcode);	
					die();
				}
			}
			$this->templateData['strict'] = true;
			if (($browserInfo['browser'] == 'msie' && $browserInfo['version'] < 8) || ($browserInfo['browser'] == 'opera' && $browserInfo['version'] < 9.8)) {
				$templateData['strict'] = false;
			}
			 			$lastLanguage = 'en';
			if (isset($_COOKIE['lastLogin'])) {
				$parse = explode('|', $_COOKIE['lastLogin']);
				$lastLanguage = $parse[0];
			}
			$this->cookie->setcookie('lastLogin', $lastLanguage . '|pro', mktime(0, 0, 0, 1, 1, 2030), '/');

			$this->template = $this->getTemplateFile($defaultSkin, 'advanced.tpl', CLIENT);
            
		} elseif (($this->pda && !$this->desktop)) {
			 			$this->template = $this->getTemplateFile($defaultSkin, $this->forcedTemplate ? $this->forcedTemplate : 'mobile.tpl', CLIENT);
		} else {
			 			if(($browserInfo['browser'] == 'msie' && $browserInfo['version'] <= 8)){
				return $this->template = $this->getTemplateFile($defaultSkin, $this->forcedTemplate ? $this->forcedTemplate : 'mobile.tpl', CLIENT);
			}
			$this->template = $this->getTemplateFile($defaultSkin, $this->forcedTemplate ? $this->forcedTemplate : 'pc.tpl', CLIENT);
		}
		return $this->template;
	}
	private function errorHandler()
	{
		if (isset($_GET['eid'])){
			$if=strtoupper($_COOKIE['sess_suffix']);
			$localCookie=ini_get('session.name');
			if(isset($_COOKIE['sess_suffix'])){
				if($if){
					$if = '_'.$if;
				}
			}else{
				$if = '_LOGIN';
			}
			define('SESSION_COOKIE_NAME','PHPSESSID'.$if);
			ini_set('session.name',SESSION_COOKIE_NAME);
			session_start();
			$location = $_SESSION['framework']['basic']['main']['error'][$_GET['eid']]['error'];
			$locationPDA = $_SESSION['framework']['pda']['main']['error'][$_GET['eid']]['error'];
			if (isset($location['message'])) {
				$eData=$location['message'];
				if (empty($eData)){
					$eData='<em>'.$location['eid'].'</em>';
				}
				$this->eDataInfo=$_SESSION['framework']['basic']['main']['error'][$_GET['eid']]['data'];
			} elseif (isset($locationPDA['message'])) {
				
				$eData=$locationPDA['eid'];
				if (empty($eData)){
					$eData='<em>'.$locationPDA['eid'].'</em>';
				}
				$this->eDataInfo=$_SESSION['framework']['pda']['main']['error'][$_GET['eid']]['data'];
			}
			else{
				unset($eData);
			}
			if (isset($this->eDataInfo)){
				if (isset($this->eDataInfo['form']) && is_array($this->eDataInfo['form'])){
					foreach($this->eDataInfo['form'] as $key=>$val){
						if (is_array($val)){
							$this->eDataInfo['form'][$key]=Tools::htmlspecialchars_array($val);
						}else{
							$this->eDataInfo['form'][$key]=slToolsPHP::htmlspecialchars($val);
						}
					}
				}
			}
			if(!$_SESSION['user']){
				session_destroy();
			}
			ini_set('session.name',$localCookie);
		}
		if (isset($_REQUEST['reason'])){
			$reason=slToolsPHP::htmlspecialchars($_REQUEST['reason']);
		}
		if (isset($reason)){
			$reason=strtolower($reason);
			if (isset($this->language_data['error'][$reason])){
				$error=strval($this->language_data['error'][$reason]);
			}else{
				$error=$reason;
			}
		}elseif ($eData){
			$error = $eData;
		}
		$this->error = $error?$error:false;
	}
	private function messageHandler()
	{
		if(isset($_GET['mid'])){
			$if=strtoupper($_COOKIE['sess_suffix']);
			$localCookie=ini_get('session.name');
			define('SESSION_COOKIE_NAME','PHPSESSID'.($if?'_'.$if:'_LOGIN'));
			ini_set('session.name',SESSION_COOKIE_NAME);
			session_start();
			$mData=$_GET['mid'];
			if(!$_SESSION['user']){
				session_destroy();
			}
		}else{
			unset($mData);
		}
		if (isset($_REQUEST['msg'])){
			$msg=slToolsPHP::htmlspecialchars($_REQUEST['msg']);
		}
		if (isset($msg)){
			$mData=$msg;
		}
		
		if ($mData){
			$mData=strtolower($mData);
			if (isset($this->language_data['message'][$mData])){
				$message=strval($this->language_data['message'][$mData]);
			}else{
				$message=$mData;
			}
			$this->message = $message;
		}else{
			$this->message = false;
		}
		
	}
	
	public function permanentLogin()
	{
		$this->encodeCredentials = false;
		if ($this->error) {
			$this->cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
			unset($_COOKIE['permanentLogin']);
		}
		 		if (!isset($_GET['*']) && isset($_COOKIE['permanentLogin'])) {
			$this->permanentLogin=$_COOKIE['permanentLogin'];
			if ($this->interface!='pro' && !isset($_GET['sid']) && !isset($_COOKIE['login_sid']) && !isset($_REQUEST['atoken'])){
				$_POST['to']=$this->interface;
				$_POST['direct']=1;
				$_POST['_n']['p']['main']='win.main.tree';
				$_POST['password']=$this->permanentLogin.'&t='.time();
				$_POST['username']='';
				$_POST['language']=$this->language;
				$_POST['auto_login']=1;
				$_POST['_c']='auth';
				$_POST['_n']['w']='main';
				$_POST['_n']['js']=1;
				$_POST['_a']['login']=1;
				$_POST['referer']=$this->self;
				$this->encodeCredentials=false;
			}else{
				if(!isset($_GET['sid']) && !isset($_COOKIE['login_sid'])  && !isset($_REQUEST['atoken'])){
					if(ini_get('session.use_cookies')){
						$qs=self::getClearGet();
						$this->normalLogin=true;
						session_id(str_replace('i=','',$this->permanentLogin));
						session_start();
						if (isset($_SESSION['EMAIL'])) {
							$account = createobject("account");
							if(!$account->Open($_SESSION['EMAIL'])){
								@session_destroy();
								$this->normalLogin=false;
							}
						} else {
							$this->normalLogin=false;
						}
						
						if($this->normalLogin) {
							$this->cookie->setcookie('login_sid',str_replace('i=','',$this->permanentLogin),mktime(0,0,0,1,1,2030),'/');
							header("HTTP/1.0 302 Moved Temporarely");
							header("Location: ./".$qs);
						} else {
							$this->cookie->setcookie('login_sid','',mktime(0,0,0,1,1,2000),'/');
							$this->cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
							header("HTTP/1.0 302 Moved Temporarely");
							header("Location: ./");
						}
					} else {
						$qs=self::getClearGet(array("sid=".str_replace('i=','',$this->permanentLogin)));
						header("HTTP/1.0 302 Moved Temporarely");
						header("Location: ".$qs);
					}
					die();
				}else{
					$this->forceLogin=true;
				}
			}
		}
	}
	
	static public function browser_info( $agent = null ) 
	{
		$known = array('msie', 'firefox', 'safari', 'webkit', 'opera', 'netscape','konqueror', 'gecko');
		$agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);
		$pattern = '#(?<browser>' . join('|', $known) .')[/ ]+(?<version>[0-9]+(?:\.[0-9]+)?)#';
		if (!preg_match_all($pattern, $agent, $matches)) return array();
		$i = count($matches['browser'])-1;
		return array('browser'=>$matches['browser'][$i],'version'=>$matches['version'][$i]);
	}
	
	public static function mobileDeviceRecognition()
	{
		$browser = self::browser_info();
		$ret=array();
		$ret['pda']=false;
		$ret['normal_login_exception']=false;
		 
		if (
				(
						substr_count($_SERVER['HTTP_USER_AGENT'],'Mobile')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'Berry')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'Opera Mini')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'Kindle')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'Silk')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'Symbian')>0 ||
						substr_count($_SERVER['HTTP_USER_AGENT'],'SymbOS')>0
				) &&
				substr_count($_SERVER['HTTP_USER_AGENT'],'iPad')==0
		)
		{
			$ret['pda']=true;
		}
		if (
				substr_count($_SERVER['HTTP_USER_AGENT'],'iPad')>0 ||
				substr_count($_SERVER['HTTP_USER_AGENT'],'Android')>0 ||
				substr_count($_SERVER['HTTP_USER_AGENT'],'Silk')>0 ||
				($browser['browser']=='msie' && $browser['version']<=7)
		)
		{
			$ret['normal_login_exception']=true;  		}
		 
	
		if(substr_count($_SERVER['HTTP_USER_AGENT'],'Silk')>0)
		{
			$ret['force_no_js']=true;
		}
	
		return $ret;
	}	
	
	public static function getOS()
	{
		$OSName='0';
		$OSCode='device';
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Mac")>0) {
			$OSName="Mac";$OSCode='mac';
		}
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Win")>0) {
			$OSName="Windows";$OSCode='windows';
		}
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Linux")>0) {
			$OSName='Linux';$OSCode='linux';
		}
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Symbian")>0 || substr_count($_SERVER['HTTP_USER_AGENT'],"SymbOS")>0 || substr_count($_SERVER['HTTP_USER_AGENT'],"Mobile")>0 || substr_count($_SERVER['HTTP_USER_AGENT'],"Android")>0 || substr_count($_SERVER['HTTP_USER_AGENT'],"armv")>0) {
			$OSName='0';$OSCode='device';
		}
		return array('name'=>$OSName,'code'=>$OSCode);
	}
	
	static public function getPlatform()
	{
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Android")>0) {
			$platform='and';
		}
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Win")>0) {
			$platform='win';
		}
		if (substr_count($_SERVER['HTTP_USER_AGENT'],"Mac")>0) {
			$platform='osx';
		}
		return $platform;
	} 

	public function noJSLogin()
	{
		 
		if (isset($_POST['to']) && !isset($_POST['contact'])){
			if ($this->encodeCredentials){
				$_POST['password']=urlencode($_POST['password']);
			}
			if ($_POST['to']=='pro') {
				$goto='basic';
			}else{
				if (isset($_POST['amitabletgotobasic']) && (substr_count($_SERVER['HTTP_USER_AGENT'],"Mobile")==0 && substr_count($_SERVER['HTTP_USER_AGENT'],"Android")>0)){
					$_POST['to']='basic';
				}
				 				if ($_POST['to']=='basic' || $_POST['to']=='pda') {
					$goto=$_POST['to'];
				} else {
					$goto='pda';
				}
				 				if ($goto=='pda'){
					$_POST['_n']['p']['main']='grid.mail';
				}
				 				if ($goto=='basic'){
					$_POST['_n']['p']['main']='win.main.tree';
				}
				if (isset($_POST['auto_login']) && $_POST['auto_login']=='1'){
					$_POST['auto_login']='1';
				}
			}
		
			
			 			session_start();
			if(!$_COOKIE['use_cookies']){
				$suffix='&PHPSESSID_LOGIN='.session_id();
			}else{
				$suffix = '';
			}
			$_SESSION['_unilogin']=$_POST;
			 			header("HTTP/1.0 302 Moved Temporarely");
			header("Location: ".$this->webmail_url.$goto."/index.html?l".$suffix.'&'.$_SERVER['QUERY_STRING']);
			die();
		}
	}
	
	private function getSettings()
	{		
		if (isset($_GET['postlike'])){
			foreach($_GET as $key=>$val) {
				$_POST[$key]=$val;
			}
		}
		
		require_once( WORKING_MODEL_PATH.'model/settings.php');
		$this->licenseType = Storage::getLicenseType();
		$this->webmail_url = $this->api->getProperty('C_Webmail_URL');
		$this->processVersionSwitcher();
		
		$request = slRequest::instance();
		$logging = $_SESSION['LOGS'];
		$session = slSession::instance($request,false);
		$_SESSION['LOGS'] = $logging;
		$this->settings = array();
		
	 	 		$url['install']=$this->api->GetProperty('C_Install_URL');
		$version=$this->api->GetProperty('C_Version');
		
		@$serverData=slToolsXML::loadFile($this->api->GetProperty('C_ConfigPath')."_webmail/server.xml");
		
		$sets = WebmailSettings::instance($session);
		$layoutData = $sets->getPublic('layout_settings');  
		$this->language_forced = $layoutData['@childnodes']['item'][0]['@childnodes']['language'][0]['@access'] = 'view';
		$restrictionsData = $sets->getPublic('restrictions');
		$resourcesData = $sets->getPublic('reset_settings');
		$languagesData = $sets->getPublic('languages');
		$languagesData=self::sortLanguages($languagesData);
		foreach($languagesData as $key=>$val){
			$languagesData[$key]['name']=self::translateLanguage($val['lang'],$val['name']);
		}
		if (is_array($languagesData)){
			$this->languages=$languagesData;
		}
		$this->global_settings = $sets->getPrivate('global_settings');
		 		$domainsData=false;
		if(isset($_GET['selfSignUp'])){
			$domainsData=Storage::getSignupDomains();
		}
		if (is_array($domainsData)){
			$this->domains=$domainsData;
		}
		 		$this->reset_enabled = false;
		if (isset($resourcesData['@childnodes']['item'][0]['@childnodes']['enabled'][0]['@value'])){
			$this->reset_enabled=$resourcesData['@childnodes']['item'][0]['@childnodes']['enabled'][0]['@value'];
		}
		 		$settings_language = $layoutData['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'];
		$browser_languages = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
		$sorted_browser_languages = [];
		if(count($browser_languages) && !empty($browser_languages[0])) {
			foreach($browser_languages as $lang) {
				$lang = explode(';q=', trim($lang));
				if(!isset($lang[1])) $lang[1] = 1;
				$lang[0] = substr(trim($lang[0]), 0,2);
				if(!$sorted_browser_languages[$lang[0]] || $lang[1]>$sorted_browser_languages[$lang[0]])
					$sorted_browser_languages[$lang[0]] = (float)$lang[1];
			}
			arsort($sorted_browser_languages);
		}

		if (empty($settings_language)) {
			$settings_language = 'en';	 			foreach ($sorted_browser_languages as $lang => $prio) {
				foreach ($this->languages as $val) {
					if($val['lang']==$lang) {
						$settings_language = $lang;
						break 2;
					}
				}
			}
		}
		if (!isset($_COOKIE['lastLogin'])){
			$this->language = $settings_language;
		}
		if (isset($_GET['language'])) {
			$this->language=$_GET['language'];
		}
		if (trim($this->language)==''){
			$this->language = $settings_language;
		}

		foreach ($this->languages as $key=>$val) {
			if ($this->language==$val['lang']) {
				$this->languages[$key]['selected']=true;
				$this->language_label = $val['name'];
			}
		}
		switch($this->language) {
			case 'cn': $this->iso_language = 'zh'; break;
			case 'dk': $this->iso_language = 'dn'; break;
			case 'jp': $this->iso_language = 'ja'; break;
			case 'kr': $this->iso_language = 'ko'; break;
			case 'se': $this->iso_language = 'sv'; break;
			default:
				$this->iso_language = $this->language;
		}
		$this->language_data = $this->getLanguage($this->language);

		 		$this->skin = $layoutData['@childnodes']['item'][0]['@childnodes']['skin'][0]['@value'];
		 		$this->settings['restrictions']=array();
		if (!empty($restrictionsData)){
			foreach($restrictionsData['@childnodes']['item'][0]['@childnodes'] as $key=>$val) {
				$this->settings['restrictions'][$key]=$val[0]['@value'];
			}
		}
		if(!isset($this->settings['restrictions']['contact_support'])){
			$this->settings['restrictions']['contact_support'] = 1;
		}
		if($this->settings['restrictions']['disable_languages']){
			$this->language = '';
		}
		
		$this->settings['restrictions']['forgot']=$this->reset_enabled;
		 		$this->settings['layout']=array();
		if (!empty($layoutData)){
			foreach($layoutData['@childnodes']['item'][0]['@childnodes'] as $key=>$val)	{
				$this->settings['layout'][$key]=$val[0]['@value'];
			}
		}
		 		$allowed_interfaces['basic']=false;
		$allowed_interfaces['advanced']=false;
		$allowed_interfaces['pda']=false;
		if (isset($layoutData['@childnodes']['item'][0]['@childnodes']['interfaces'][0]['@value']) 
		&& !empty($layoutData['@childnodes']['item'][0]['@childnodes']['interfaces'][0]['@value']))
		{
			$aAlowedInterfaces=$layoutData['@childnodes']['item'][0]['@childnodes']['interfaces'][0]['@value'];
			if (substr_count($aAlowedInterfaces,'a')>0) {
				$allowed_interfaces['advanced']=true;
			}
			if (substr_count($aAlowedInterfaces,'b')>0) {
				$allowed_interfaces['basic']=true;
			}
			if (substr_count($aAlowedInterfaces,'p')>0) {
				$allowed_interfaces['pda']=true;
			}
		} else {
			$allowed_interfaces['basic']=true;
			$allowed_interfaces['advanced']=true;
			$allowed_interfaces['pda']=true;
		}
		
		if (isset($this->settings['layout']['login_client']) && $this->settings['layout']['login_client']=='basic') {
			$this->interface=$this->settings['layout']['login_client'];
			$allowed_interfaces[$this->settings['layout']['login_client']]=true;
		}
		if($allowed_interfaces['advanced'] && $this->licenseType=='simple'){
			$allowed_interfaces['advanced'] = false;
		}
		$this->allowed_interfaces = $allowed_interfaces;

		if (isset($_REQUEST['interface'])){
			$this->preselected = $_REQUEST['interface'];
		}elseif(isset($this->lastLogin[1])){
			$this->preselected = $this->lastLogin[1];
		}else{
			$this->preselected = false;
		}
		 		$browserInfo=$this->browser_info();
		if (!isset($_REQUEST['interface'])){
			if (($browserInfo['browser']=='msie' && ($browserInfo['version'])<=7)){
				$this->preselected='basic';
			}
		}
		
		 		
		 		if (trim($this->settings['layout']['login_style'])=='') {
			$this->settings['layout']['login_style']='blue';
		}
		
		$this->username='';
		if (isset($_COOKIE['lastUsername'])) {
			$this->username=$_COOKIE['lastUsername'];
		}
		if (isset($_GET['password'])) {
			$this->password=$_GET['password'];
		}
		if (isset($_GET['username'])) {
			$this->username=$_GET['username'];
		}
		if ($this->username=='***') {
			$this->username='';
		}
		if (isset($_GET['interface'])) {
			switch($_GET['interface']){
				case 'pda':
					$this->forcedTemplate = 'mobile.tpl';
					break;
			}
			$this->interface=$_GET['interface'];
		}
		
		if (isset($this->eDataInfo['form']['to'])) {
			$this->interface=$this->eDataInfo['form']['to'];
		}
		$this->settings['logging_type']=(int) $serverData->item->logging_type;
		$this->language_data['login_screen']['copy']="<span title=\"".$version."\">".$this->language_data['login_screen']['copy'].' &copy; 1999-'.date('Y')."</span>";  		$this->language_data['login_screen']['copy_new']="<span class=\"copyright\">".$this->language_data['login_screen']['copy_new'].' &copy;'.date('Y')."</span>";  		$this->templateData['version'] = $version;
		$this->settings['layout']['login_logo']=$this->webmail_url.'server/download.php?class=logo&fullpath='.urlencode($_SERVER['HTTP_HOST']);
		$this->settings['main']=(array)$sets;
		 		WebmailIqAuth::checkServerKeys();
		$this->hash = @file_get_contents(WM_CONFIGPATH.'public.key');
		
		 		
		$this->facebook_disabled = $restrictionsData['@childnodes']['item'][0]['@childnodes']['facebook_disabled'][0]['@value'];
		$this->twitter_disabled = $restrictionsData['@childnodes']['item'][0]['@childnodes']['twitter_disabled'][0]['@value'];
		
		$this->facebook_link = $layoutData['@childnodes']['item'][0]['@childnodes']['facebook_link'][0]['@value'];
		$this->twitter_link = $layoutData['@childnodes']['item'][0]['@childnodes']['twitter_link'][0]['@value'];
		if(empty($this->facebook_link)){
			 			$this->facebook_link = 'https://www.facebook.com/IceWarpInc';
		}
		if(empty($this->twitter_link)){
			$this->twitter_link = 'https://twitter.com/icewarp';
		}
		
		if(isset($this->settings['restrictions']['disable_login_banners'])){
			$this->banner_enabled = $this->settings['restrictions']['disable_login_banners']==1?false:true;
		}else{
			$this->banner_enabled = true;
		}
		
		$this->platform = self::getPlatform();
		$this->mobile_help = array();
		switch($this->platform){
			case 'and':
				for($i = 0; $i < 4; $i++){
					$this->mobile_help[$i]['text'] = $this->language_data['utilities']['help_phone_and'.($i+1)];
					$this->mobile_help[$i]['num'] = $i+1;
				}
				break;
			case 'win':
				for($i = 0; $i < 2; $i++){
					$this->mobile_help[$i]['text'] = $this->language_data['utilities']['help_phone_win'.($i+1)];
					$this->mobile_help[$i]['num'] = $i+1;
				}
				break;
			case 'osx':
				for($i = 0; $i < 3; $i++){
					$this->mobile_help[$i]['text'] = $this->language_data['utilities']['help_ios'.($i+1)];
					$this->mobile_help[$i]['num'] = $i+1;
				}
				break;
		}
		$this->templateData['mobile_help'] = $this->mobile_help;
	}
	
	protected function getLanguage(&$language)
	{
		if(!file_exists(getcwd().'/../'.CLIENT.'/languages/'.$language.'/data.xml')){
			$language = 'en';
		}
		$language_data =(array) slToolsXML::loadFile(getcwd().'/../'.CLIENT.'/languages/'.$language.'/data.xml');
		foreach($language_data as $key=>$val){
			$language_data[$key]=(array)$val;
			if (is_array($language_data[$key])){
				foreach($language_data[$key] as $key2=>$val2){
					if(is_array($val2)){
						trigger_error('Duplicate language entry in ['.$language.'] lang.xml for '.$key.'/'.$key2,E_USER_WARNING);
						$val2=$val2[0];
					}
					$language_data[$key][$key2]=(string)$val2;
				}
			}
		}
		return $language_data;
	}
	
	private function sortLanguages($l)
	{
		$larray=array();
		$ldata=array();
		foreach($l as $val) {
			$larray[]=$val['lang'];
			$ldata[$val['lang']]=$val;
		}
		$languages=array("en","ar","bg","cs","dk","de","el","es","la","fa","fr","hr","is","it","kr","lv","hu","jp","nl","no","pl","pt","ru","sk","fi","se","th","tr","si");
		$ret=array();
		$used=array();
		foreach($languages as $val) {
			if(in_array($val,$larray)) {
				$ret[]=$ldata[$val];
				$used[]=$val;
			}
		}
		foreach($larray as $val) {
			if(!in_array($val,$used)){$ret[]=$ldata[$val];}
		}
		return $ret;
	}
	
	private function translateLanguage($code,$name)
	{
		$languages=array(
				"en"=>"English" ,
				"ar"=>"العربية" ,
				"cs"=>"Česky" ,
				"dk"=>"Dansk" ,
				"de"=>"Deutsch" ,
				"el"=>"ελληνικά" ,
				"es"=>"Español" ,
				"la"=>"Español - Sudamérica" ,
				"fr"=>"Français" ,
				"hr"=>"Hrvatski",
				"bg"=>"Български",
				"kr"=>"한국어" ,
				"lv"=>"Latvias",
				"hu"=>"Magyar" ,
				"jp"=>"日本語" ,
				"nl"=>"Nederlands" ,
				"no"=>"Norsk" ,
				"is"=>"Íslenska" ,
				"it"=>"Italiano" ,
				"pl"=>"Polski" ,
				"pt"=>"Português Brasileiro" ,
				"ru"=>"Русский" ,
				"sk"=>"Slovenčina" ,
				"fi"=>"Suomi" ,
				"se"=>"Svenska" ,
				"th"=>"ภาษาไทย" ,
				"tr"=>"Türkçe",
				"si"=>"Slovenščina"
		);
		if (isset($languages[$code])) {
			return $languages[$code];
		}
		return $name;
	}
	
	private function processCookies()
	{
		$this->interface='';
		if (isset($_COOKIE['lastLogin'])){
			$this->lastLogin=$_COOKIE['lastLogin'];
			$this->lastLogin=explode('|',$this->lastLogin);
			$this->language=$this->lastLogin[0];
			$this->interface=$this->lastLogin[1];
			if (isset($_GET['language'])) {
				$this->cookie->setcookie('lastLogin',$_GET['language'].'|'.$this->interface,mktime(0,0,0,1,1,2030),'/');
			}
		} else {
			if (isset($_GET['language'])) {
				$this->cookie->setcookie('lastLogin',$_GET['language'].'|-',mktime(0,0,0,1,1,2030),'/');
			}
		}
	}
	
	private function ssoLogin()
	{
		 
		if (!(
				isset($_REQUEST['sid']) ||
				isset($_COOKIE['login_sid']) ||
				isset($_REQUEST['frm']) ||
                isset($_REQUEST['atoken']) ||
				isset($_GET['!'])
		))
		{
			if(isset($this->global_settings['@childnodes']['global_settings'][0]['@childnodes']['item'][0]['@childnodes']))
			{
				$this->global_settings=$this->global_settings['@childnodes']['global_settings'][0]['@childnodes']['item'][0]['@childnodes'];
				if (isset($this->global_settings['sso_only'][0]['@value']) && $this->global_settings['sso_only'][0]['@value']==1)
				{
					header("HTTP/1.0 302 Moved Temporarely");
					header("Location: ./sso/");
					die();
				}
			}
		}
	}
	
	public function getLanguageItem($group,$item)
	{
		return $this->language_data[$group][$item];
	}

	
	public function getClearGet($qs=array())
	{
		 
		if (isset($_GET['xml'])) {
			$qs[]='xml='.$_GET['xml'];
		}
		if (isset($_GET['frm'])) {
			$qs[]='frm='.$_GET['frm'];
		}
		if (isset($_GET['debug'])) {
			$qs[]='debug='.urlencode($_GET['debug']);
		}
		if (isset($_GET['mailto'])) {
			$qs[]='mailto='.urlencode($_GET['mailto']);
		}
		if (isset($_GET['subject'])) {
			$qs[]='subject='.$_GET['subject'];
		}
		if (isset($_GET['video'])) {
			$qs[]='video='.$_GET['video'];
		}
		if (isset($_GET['telemetry'])) {
			$qs[]='telemetry='.$_GET['telemetry'];
		}
		if (isset($_GET['meeting'])) {
			$qs[]='meeting='.$_GET['meeting'];
		}
		if (isset($_GET['ref'])) {
			$qs[]='ref='.$_GET['ref'];
		}
		if (isset($_GET['username'])) {
			$qs[]='username='.$_GET['username'];
		}
		if (isset($_GET['password'])) {
			$qs[]='password='.$_GET['password'];
		}
		if (isset($_GET['drafts_imap_id'])) {
			$qs[]='drafts_imap_id='.$_GET['drafts_imap_id'];
		}
	
		if (isset($_GET['cc'])) {
			$qs[]='cc='.urlencode($_GET['cc']);
		}
		if (isset($_GET['bcc'])) {
			$qs[]='bcc='.urlencode($_GET['bcc']);
		}
		if (isset($_GET['body'])) {
			$qs[]='body='.urlencode($_GET['body']);
		}
		if (isset($_GET['sms'])) {
			$qs[]='sms='.$_GET['sms'];
		}
		if (isset($_GET['open'])) {
			$qs[]='open='.$_GET['open'];
		}
		if (isset($_GET['page'])) {
			$qs[]='page='.$_GET['page'];
		}
		if (isset($_GET['from'])) {
			$qs[]='from='.$_GET['from'];
		}
	
		if (!empty($qs)) {
			$qs='?'.join('&',$qs);
		} else {$qs='';
		}
		$qs=str_replace(array('<','>'),array('',''),$qs);
		 
		return $qs;
	}
    
    protected function cacheWorkaround()
    {
                 if(!defined('CLIENT')){define('CLIENT','client');}
        if ($_GET['cache'] != 'off'){

            @$serverData = slToolsXML::loadFile($this->api->GetProperty('C_ConfigPath')."_webmail/server.xml");
            $HTTPS = $_SERVER['HTTPS'] == 'ON' || filter_var($serverData->item->alwayshttps ?? false, FILTER_VALIDATE_BOOLEAN);

            $uri = explode('?',$_SERVER["REQUEST_URI"]);
            $uri = $uri[0];

            if (!preg_match('/\/$/',$uri))
                $uri = dirname($uri).'/';

			$base = 'http'.($HTTPS ? 's' : '').'://'.$_SERVER['HTTP_HOST'].'/-.._._.--.._'.max(filemtime(CLIENT.'/inc/javascript.js'), filemtime(CLIENT.'/inc/startscript.js')).$uri;
			$bundleFile = file_exists('bundle.min.js')?'bundle.min.js':'bundle.js';
			$frameworkFile = file_exists('framework.min.js')?'framework.min.js':'framework.js';
            $base_login = 'http'.($HTTPS ? 's' : '').'://'.$_SERVER['HTTP_HOST'].'/-.._._.--.._'.max(filemtime($bundleFile), filemtime($frameworkFile)).$uri;
            if ($_SERVER["REQUEST_URI"]!='') {$ruri=$_SERVER["REQUEST_URI"].'/';} else {$ruri='';}
            
            $self= 'http'.($HTTPS ? 's' : '').'://'.$_SERVER['HTTP_HOST'].$uri;
        }
        $this->base = $base;
        $this->base_login = $base_login;
        $this->self = $self;
    }
    
    
    protected function defines()
    {
	    $secure_cookie = $this->api->GetProperty('C_Webmail_HTTPSecureCookie');
		$secure_cookie = (strtolower(strval($secure_cookie))=='true' || intval($secure_cookie)==1)?true:false;
		if($secure_cookie){
			define('SECURE_COOKIE',true);
		}
        if(defined('SECURE_COOKIE') && SECURE_COOKIE){
       		header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        }     
    }
    
    private function handleExternal()
    {
    	 		if(isset($_REQUEST['password_secured']))
		{
			$protocol=(isset($_SERVER['SERVER_PROTOCOL'])?$_SERVER['SERVER_PROTOCOL']:'HTTP/1.0');
			$private_key = openssl_pkey_get_private(file_get_contents(WM_CONFIGPATH.'private.key'));
			$decoded='';
			openssl_private_decrypt(base64_decode($_REQUEST['password_secured']),$decoded,$private_key);
			 
			if(substr_count($decoded,'&t=')>0)
			{
				$parsed=array();
				parse_str($decoded,$parsed);
				if($parsed['t']+(5*60)<time())
				{
					 					header($protocol.' 403 CRC Failed');
					die();
				}
				elseif(isset($parsed['p']))
				{
					$decoded=$parsed['p'];
				}
				else
				{
					 					header($protocol.' 400 Bad request');
					die();
				}
			}
			else
			{
				header($protocol.' 200 Password not secured!');
			}
			
			if(isset($_GET['password_secured'])){$_GET['password']=urlencode($decoded);}
			if(isset($_POST['password_secured'])){$_POST['password']=urlencode($decoded);}
			$_REQUEST['password']=urlencode($decoded);
		}
		 		
		if(isset($_SERVER['HTTP_X_REMOTE_LOGIN']))
		{
			$private_key = openssl_pkey_get_private(file_get_contents(WM_CONFIGPATH.'private.key'));
			$private_details=openssl_pkey_get_details($private_key);
			header('X-RSA: '.urlencode(base64_encode($private_details['key'])));
			header('X-TIME: '.time());
			die('Content stripped');
		}
		
		 
		if(isset($_GET['drafts_imap_id']) && isset($_GET['sid'])){
			session_id($_GET['sid']);
			session_start();
			$_SESSION['no_regenerate_id']=true;
			session_write_close();
		}
		 
    }
}
?>