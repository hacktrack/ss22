<?php

 
class WebmailIqAuth extends XMLRequestInterface
{
	public $aSupportedMethods = Array(
		'rsa' => 1,
		'rsaip' => 1,
		'xmpp' => 1,
		'sip' => 1,
		'meeting' => 1,
		'plain' => 1,
		'websocket' => 1,
		'sid' => 1,
		'troubleshootingsession' => 1,
		'deletetroubleshooting' => 1,
	);

	public $oDOMMethod;
	public $oDOMCommand;
	public $oDOMURI;
	public $oDOMDigest;
	public $sDigest;
	public $oDOMLanguage;
	public $oDOMExternalIP;
	public $oDOMHashID;
	public $oDOMSessionID;
	public $oDOMFrom;
	public $oDOMSessionKeep;
	public $oDOMDisableIPCheck;
	public $sURI;
	public $sCommand = 'REGISTER';
	public $sHashID;
	public $sFrom;
	public $bSessionKeep;
	public $sUserCheck;
	 
	public $oDOMDoc;
	 
	public $oDOMQuery;
	public $autoLogin;
	public $sMethod = 'plain';
	public $sExternalIP = false;
	public $sDisableIPCheck;
	public $sSessionID;
	public $sLanguage;
	public $authToken;
	public $remember = false;
	public $troubleshootingSession;
	public $troubleshootingValidity;

	 
	public function __construct(DOMElement $oDOMQuery, slToolsDOM &$oDOMDoc, array &$attrs)
	{
		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->loadUser();
		$this->checkInputXML();
		$this->exeInputXML();
	}

	 
	private function checkInputXML()
	{
		 		if ($this->oDOMMethod = $this->oDOMDoc->getNode("auth:method",$this->oDOMQuery)) {
			$this->sMethod = strtolower($this->oDOMDoc->getNodeValue("auth:method",$this->oDOMQuery));
		}
		if (!isset($this->aSupportedMethods[$this->sMethod])) $this->sMethod = 'plain';

		if($this->sMethod == 'rsaip'){
			$this->sMethod = 'rsa';
			$this->sUserCheck = $this->oDOMDoc->getNodeValue("auth:username",$this->oDOMQuery);
		}
		if(strtolower($this->sMethod) == 'sip' || strtolower($this->sMethod) == 'websocket'){
			if ($this->oDOMCommand = $this->oDOMDoc->getNode("auth:command",$this->oDOMQuery)) {
				$this->sCommand = $this->oDOMDoc->getNodeValue("auth:command",$this->oDOMQuery);
			}
			if ($this->oDOMURI = $this->oDOMDoc->getNode("auth:uri",$this->oDOMQuery)) {
				$this->sURI = $this->oDOMDoc->getNodeValue("auth:uri",$this->oDOMQuery);
			}else if (strtolower($this->sMethod) == 'sip') {
				$this->sURI = 'sip:'.$_SESSION['DOMAIN'];
			}
		}
		if ($this->oDOMDigest = $this->oDOMDoc->getNode("auth:digest",$this->oDOMQuery)) {
			$this->sDigest = $this->oDOMDoc->getNodeValue("auth:digest",$this->oDOMQuery);
		}
		if ($this->oDOMLanguage= $this->oDOMDoc->getNode("auth:language",$this->oDOMQuery)) {
			$this->sLanguage = $this->oDOMDoc->getNodeValue("auth:language",$this->oDOMQuery);
		}
		if ($this->oDOMExternalIP = $this->oDOMDoc->getNode("auth:ip",$this->oDOMQuery)) {
			$this->sExternalIP = $this->oDOMDoc->getNodeValue("auth:ip",$this->oDOMQuery);
		}
		if ($this->oDOMHashID = $this->oDOMDoc->getNode("auth:hashid",$this->oDOMQuery)) {
			$this->sHashID = $this->oDOMDoc->getNodeValue("auth:hashid",$this->oDOMQuery);
		}
		if ($this->oDOMHashID = $this->oDOMDoc->getNode("auth:authtoken",$this->oDOMQuery)) {
			$this->authToken = $this->oDOMDoc->getNodeValue("auth:authtoken",$this->oDOMQuery);
			if ($this->oDOMHashID = $this->oDOMDoc->getNode("auth:remember",$this->oDOMQuery)) {
				$this->remember = $this->oDOMDoc->getNodeValue("auth:remember",$this->oDOMQuery);
			}
		}
		$this->setValFromDOMDoc($this->sSessionID, 'auth:session', $this->oDOMQuery);
		if ($this->oDOMFrom = $this->oDOMDoc->getNode("auth:from",$this->oDOMQuery)) {
			$this->sFrom = $this->oDOMDoc->getNodeValue("auth:from",$this->oDOMQuery);
		}
		if ($this->oDOMSessionKeep = $this->oDOMDoc->getNode("auth:keep",$this->oDOMQuery)) {
			$this->bSessionKeep = $this->oDOMDoc->getNodeValue("auth:keep",$this->oDOMQuery);
		}
		if ($this->oDOMDisableIPCheck = $this->oDOMDoc->getNode("auth:disable_ip_check",$this->oDOMQuery)) {
			$this->sDisableIPCheck = $this->oDOMDoc->getNodeValue("auth:disable_ip_check",$this->oDOMQuery);
			$this->sDisableIPCheck = ($this->sDisableIPCheck == 1 || $this->sDisableIPCheck == 'true');
		}
		if ($this->oDOMLanguage= $this->oDOMDoc->getNode("auth:auto_login",$this->oDOMQuery)) {
			$this->autoLogin = $this->oDOMDoc->getNodeValue("auth:auto_login",$this->oDOMQuery);
		}

		$this->setValFromDOMDoc($this->troubleshootingValidity, 'auth:validity', $this->oDOMQuery);
		$this->setValFromDOMDoc($this->troubleshootingSession, 'auth:troubleshootingSession', $this->oDOMQuery);
		if($this->aAttrs["type"] == 'set' && !$this->aAttrs['sid'] && !$this->sSessionID){
			$aMandatoryTags = Array('username','digest');
			if ($this->sMethod == 'rsa') $aMandatoryTags[] = 'method';
			foreach ($aMandatoryTags as $tag) {
				if (!$DOMnode = $this->oDOMDoc->getNode("auth:" . $tag, $this->oDOMQuery)) {
					throw new Exc('auth_missing_tag',$tag);
				}
			}
		}
		return true;
	}

     
	public static function createSidByAToken(string $aToken, $language, $remember = false, $ctz = null, string $interface = 'BASIC')
	{
		$cookie = new slToolsCookie();
		$user = IceWarpAPI::instance()->FunctionCall("GetTokenEmail", $aToken);
		$pass = IceWarpAPI::instance()->FunctionCall("GetTokenPassword", $aToken);
		$sid = User::login($user, $pass,"","",true,"",false, false, false, $language, $remember ? 'wm-perm' : 'wm');
		$_SESSION['jscheck'] = true;
		if($ctz) $_SESSION['CTZ'] = $ctz;
		$cookie->setcookie('PHPSESSID_'.strtoupper($interface),$sid,mktime(0,0,0,1,1,2030),'/');
		$cookie->setcookie('login_sid',$sid,mktime(0,0,0,1,1,2030),'/');
		$cookie->setcookie('PHPSESSID_LOGIN',null,-1,'/');
        if($remember){
           	$cookie->setcookie('permanentLogin','i=' . $sid, mktime(0,0,0,1,1,2030),'/');
        }else{
            $cookie->setcookie('permanentLogin','', mktime(0,0,0,1,1,2030),'/');
        }
        return $sid;
	}

    protected function getActionRsa()
	{
		$this->aData['method'] = "RSA";
		self::checkServerKeys();
		@$this->aData['hashId'] = file_get_contents(WM_CONFIGPATH.'public.key');
		@$this->aData['timestamp'] = time();
	}

	protected function getActionXmpp()
	{
		if(!$_SESSION['IM_SUPPORT']) throw new Exc('im is disabled');
		$this->aData['method'] = "XMPP";
		$sid = $this->aAttrs['sid'];
		$oUser = User::load($sid);
		$sPrimaryAccountID = $_SESSION['EMAIL'];
		$oPrimaryAccount = $oUser->getAccount($sPrimaryAccountID);
		$sPassword = $oPrimaryAccount->getPassword();
		$this->aData['digest'] = sha1($this->sHashID . $sPassword);
		$this->aData['xmpp_encryptedpassword'] = $_SESSION['XMPP_ENCRYPTEDPASSWORD'];
		$this->aData['xmpp_username'] = $_SESSION['XMPP_USERNAME'];
		$this->aData['xmpp_domain'] = $_SESSION['XMPP_DOMAIN'];

		if($_SESSION['XMPP_HOST']){
			$this->aData['xmpp_host'] = $_SESSION['XMPP_HOST'];
		}elseif($_SESSION['XMPP_PORT_GLOBAL'] != '' && $_SESSION['XMPP_PORT_GLOBAL'] != 5222){
			$this->aData['xmpp_host'] = $_SESSION['XMPP_HOST_GLOBAL'] . ':' . $_SESSION['XMPP_PORT_GLOBAL'];
		}else{
			$this->aData['xmpp_host'] = $_SESSION['XMPP_HOST_GLOBAL'];
		}
	}

	protected function getActionSid()
	{
		$this->aData['digest'] = self::createSidByAToken($this->authToken, $this->sLanguage, $this->remember);
		$this->aData['method'] = "SID";
	}

	protected function getActionSip()
	{
		$this->aData['method'] = "SIP";
		$api = IceWarpAPI::instance('Webmail');
		$sid = $this->aAttrs['sid'];
		$oUser = User::load($sid);
		$sPrimaryAccountID = $_SESSION['EMAIL'];
		$oPrimaryAccount = $oUser->getAccount($sPrimaryAccountID);
		$sAlias = reset($_SESSION['USER_ALIAS_ARRAY']);
		$sPassword = $oPrimaryAccount->getPassword();
		$key = 'user=' . urlencode($sAlias);
		$key .= '&pass=' . urlencode($sPassword);
		$key .= '&uri=' . urlencode($this->sURI);
		$key .= '&command=' . urlencode($this->sCommand);
		$this->aData['digest'] = $api->CryptData('DIGEST-MD5', $key,  $this->sHashID, true);
	}

	protected function getActionWebsocket()
	{
		$this->aData['method'] = "WEBSOCKET";
		$api = IceWarpAPI::instance('Webmail');
		$sid = $this->aAttrs['sid'];
		$oUser = User::load($sid);
		$sPrimaryAccountID = $_SESSION['EMAIL'];
		$oPrimaryAccount = $oUser->getAccount($sPrimaryAccountID);
		$sPassword = $oPrimaryAccount->getPassword();
		$alias = reset($_SESSION['USER_ALIAS_ARRAY']);
		$key = 'user=' . urlencode($alias);
		$key .= '&pass=' . urlencode($sPassword);
		$key .= '&uri=' . urlencode($this->sURI);
		$key .= '&algorithm=md5-sess';
		$key .= '&command=' . urlencode($this->sCommand);
		$this->aData['digest'] = base64_encode($api->CryptData('DIGEST-MD5', $key,  base64_decode($this->sHashID), true));
	}

	protected function getActionMeeting()
	{
		$oUser = $_SESSION['user'];
		$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
		if(!$oAccount->gwAccount) throw new Exc('groupware_init_failed');
		$this->aData['digest'] = $oAccount->gwAccount->gwAPI->FunctionCall("LoginMeetingUser", $oAccount->gwAccount->gwAPI->user, $oAccount->gwAccount->gwAPI->getPassword());
		$this->aData['method'] = 'meeting';
	}

	protected function getActionTroubleshooting()
	{
		$troubleshootingSessionId = str_replace('.','',uniqid('wmtr-',true));
		$oUser = $_SESSION['user'];
		$currentSession = session_id();
		session_write_close();
		session_id($troubleshootingSessionId);
		session_start();

		$_SESSION['created'] = time();
		$_SESSION['validity'] = $this->troubleshootingValidity;
		$_SESSION['expire'] = $expire = $_SESSION['created'] + $this->troubleshootingValidity;
		$_SESSION['user'] =  $oUser->email;
		$_SESSION['password'] = $oUser->getPassword(true);
		session_write_close();

		session_id($currentSession);
		session_start();
		$this->aData['digest'] = $troubleshootingSessionId;
		$this->aData['timestamp'] = $expire;
		$this->aData['method'] = "TROUBLESHOOTING";
	}

	protected function exeGetInputXML()
	{
		$this->sTemplateFile = 'webmailiqauth_get';
		$method = strtolower($this->sMethod);
		if ($method == 'rsa') return $this->getActionRsa();
		if ($method == 'xmpp') return $this->getActionXmpp();
		if ($method == 'sid') return $this->getActionSid();
		if ($method == 'sip') return $this->getActionSip();
		if ($method == 'websocket') return $this->getActionWebsocket();
		if ($method == 'meeting') return $this->getActionMeeting();
		if ($method == 'troubleshootingsession') return $this->getActionTroubleshooting();
		$this->aData['method'] = "PLAIN";
	}

	 
	protected function setActionTroubleshooting()
	{
		$currentSession = session_id();
		session_write_close();
		session_id($this->sSessionID);
		session_start();
		if(empty($_SESSION) || time() > ($_SESSION['expire'] ?? 0)){
			session_destroy();
			session_write_close();

			session_id($currentSession);
			session_start();
			throw new Exc('troubleshooting session invalid or expired');
		}
		$this->aAttrs['sid'] = User::login($_SESSION['user'], slToolsCrypt::decryptSymmetric($_SESSION['password']), '', $this->sMethod, true,'', false, false, false,false, 'wm-');
	}

	protected function setActionDeleteTroubleshooting()
	{
		 		if (session_id()) {
			session_commit();
		}

		 		session_start();
		$current_session_id = session_id();
		session_commit();

		 		session_id($this->sSessionID);
		session_start();
		session_destroy();
		session_commit();

		 		session_id($current_session_id);
		session_start();
		session_commit();
	}

	protected function setActionLogout(slToolsCookie $cookies)
	{
		 		$ret = '<?xml version="1.0" encoding="utf-8" ?><iq type="result"><query xmlns="webmail:iq:auth" /></iq>';
		$cookies->setcookie('permanentLogin', '', mktime(0, 0, 0, 1, 1, 2000), '/');
		ignore_user_abort(true);
		header("Content-Length: " . strlen($ret));
		header("Content-type: text/xml");
		header("Connection: close");
		echo $ret;
		ob_end_flush();
		flush();

		 		$account = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		if ($account->isDelayed()) {
			$account->syncDelayedFolders();
		}
		if (!$account->last_cacheclean || $account->last_cacheclean + (7 * DAY_LENGTH) < time()) {
			$aProperties['last_cacheclean'] = time();
			$cache = Cache::instance($_SESSION['user']);
			$cache->cleanup();
			$_SESSION['user']->editAccount($_SESSION['EMAIL'], $aProperties);
		}
		$_SESSION['user']->logout();
		$this->aAttrs['sid'] = '';
		 
		 		$this->aAttrs['do_not_respond'] = true;
	}

	protected function setActionLoginWebAdmin(IceWarpAPI $api)
	{
		$session = Tools::getWebAdminSession($this->sSessionID);
		if (!$session) throw new Exc('auth_webadmin_session_not_found');
		$login_type = $api->GetProperty('C_Accounts_Policies_Login_LoginSettings');
		if ($login_type == 0) {
			$login = substr($session[1], 0, strpos($session[1], '@'));
		} else {
			$login = $session[1];
		}
		if (isset($_COOKIE['lastLogin'])) {
			$parse = explode('|', $_COOKIE['lastLogin']);
			$lastLanguage = $parse[0];
		}
		$this->aAttrs['sid'] = User::login($login, urldecode(trim($session[8])), "", "", true, "", false, false, false, $lastLanguage ? $lastLanguage : '', $_GET['remember'] ? 'wm-perm' : 'wm');
		$_SESSION['LOGOUT_REFERER'] = IceWarpAPI::instance()->getProperty('C_Webmail_URL');
	}

	 
	protected function setActionSessionIdNoCheck(IceWarpAPI $api, slToolsCookie $cookies)
	{
		 		If ($this->sFrom && strtolower($this->sFrom) == 'webadmin') {
			return $this->setActionLoginWebAdmin($api);
		}

		 		$user = User::load($this->sSessionID);

		if (strpos($this->sSessionID, 'wm-perm') !== false) {
			 			$session_version = $_SESSION['WM_VERSION'];
			$current_version = $api->GetProperty('c_version');
			if ($current_version != $session_version) {
				$cookies->setCookie('login_sid', '', mktime(0, 0, 0, 1, 1, 2030), '/');
				$cookies->setcookie('permanentLogin', '', mktime(0, 0, 0, 1, 1, 2000), '/');
				session_destroy();
				throw new Exc('session_no_user');
			}
			 			$_SESSION['SETTINGS_API'] = false;
			$user->getData();
		}

		if (!$this->bSessionKeep) {
			unset($_SESSION['SID']);
			$session_backup = $_SESSION;
			@session_destroy();

			 
			$permanentPrefix = 'wm-';
			if (isset($_COOKIE['permanentLogin'])) {
				$permanentPrefix = 'wm-perm';
			}

			$newSID = str_replace('.', '', uniqid($permanentPrefix, true));
			session_id($newSID);

			session_start();
		} else {
			$newSID = $this->sSessionID;
		}
		 
		if (isset($_COOKIE['permanentLogin'])) {
			$cookies->setcookie('permanentLogin', 'i=' . $newSID, mktime(0, 0, 0, 1, 1, 2030), '/');
		} else {
			$cookies->setcookie('permanentLogin', '', mktime(0, 0, 0, 1, 1, 2000), '/');
		}
		 		$cookies->setcookie('PHPSESSID_PRO', '', mktime(0, 0, 0, 1, 1, 2030), '/');
		$cookies->setcookie('PHPSESSID_BASIC', '', mktime(0, 0, 0, 1, 1, 2030), '/');
		$cookies->setcookie('PHPSESSID_PDA', '', mktime(0, 0, 0, 1, 1, 2030), '/');
		$cookies->setcookie('PHPSESSID_LOGIN', '', mktime(0, 0, 0, 1, 1, 2030), '/');

		if ($session_backup){
			foreach ($session_backup as $key => $val) {
				$_SESSION[$key] = $val;
			}
		}
		$_SESSION['SID'] = $newSID;
		$this->aAttrs['sid'] = $newSID;
		$this->aAttrs['digest'] = $newSID;
	}

	 
	protected function sessionCheckUser()
	{
		if(!$this->sUserCheck) return true;
		session_id($this->sSessionID);
		session_start();
		if ($_SESSION['user']) {
			$primaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			$username = $primaryAccount->username;
			if ($username != $this->sUserCheck) {
				throw new Exc('session_no_user');
			}
		}
		return true;
	}

	 
	private function exeInputXML()
	{
		$hashID = '';
		$cookies = new slToolsCookie();

		if($this->aAttrs['type'] == 'get') return $this->exeGetInputXML();

		if($this->aAttrs['type'] != 'set') return;

		if($this->sMethod == 'troubleshootingsession') return $this->setActionTroubleshooting();
		if($this->sMethod == 'deletetroubleshooting') return $this->setActionDeleteTroubleshooting();
		 		if ($this->aAttrs['sid']) return $this->setActionLogout($cookies);
		$api = createobject('api');
		if ($this->sSessionID && !$this->sUserCheck) return $this->setActionSessionIdNoCheck($api, $cookies);
		$this->sessionCheckUser();
		 		 		$userName = $this->oDOMDoc->getNodeValue("auth:username", $this->oDOMQuery);
		$digest = $this->oDOMDoc->getNodeValue("auth:digest", $this->oDOMQuery);
		$cookie = false;

		$this->setValFromDOMDoc($cookie, 'auth:cookie',$this->oDOMQuery);

		 		if ($this->sMethod == 'rsa') {			$this->setActionRsa($cookies, $digest, $userName, $cookie);
		} else {  
			$sessionPrefix = ($this->autoLogin) ? 'wm-perm' : 'wm-';
			$this->aAttrs['sid'] = User::login($userName, $digest, $hashID, $this->sMethod, true, '', $cookie, $this->sExternalIP, $this->sDisableIPCheck, $this->sLanguage, $sessionPrefix, $this->sUserCheck ? $this->sSessionID : '');
		}

		if ($this->autoLogin) {
			$cookies->setcookie('permanentLogin', 'i=' . $this->aAttrs['sid'], mktime(0, 0, 0, 1, 1, 2030), '/');
			$cookies->setcookie('PHPSESSID_BASIC', $this->aAttrs['sid'], mktime(0, 0, 0, 1, 1, 2030), '/');
			$cookies->setcookie('PHPSESSID_PDA', $this->aAttrs['sid'], mktime(0, 0, 0, 1, 1, 2030), '/');
		} else {
			$cookies->setcookie('permanentLogin', '', mktime(0, 0, 0, 1, 1, 2000), '/');
		}

		 
		$cookies->setcookie('lastUsername', $userName, mktime(0, 0, 0, 1, 1, 2030), '/');
		$cookies->setcookie('lastLogin', strval($this->sLanguage) . "|pro", mktime(0, 0, 0, 1, 1, 2030), '/');
	}

	protected function setActionRsa($cookies, $digest, $userName, $cookie)
	{
		$hashID = $this->oDOMDoc->getNodeValue("auth:hashid", $this->oDOMQuery);
		$privateData = self::getServerData('private');
		$privateKey = self::getServerKey($privateData);
		openssl_private_decrypt(self::hexStringToBinary($digest), $password, $privateKey);
		$pInfo = Tools::parseURL($password);
		$password = urldecode($password);
		if (is_array($pInfo) && !empty($pInfo)) {
			$password = $pInfo['p'];
			$id = $pInfo['i'];
			if (isset($pInfo['t']) && abs(time() - $pInfo['t']) > 300) {
				trigger_error("Login Expired [" . time() . "/" . $pInfo['t'] . "]", E_USER_WARNING);
				throw new Exc('login_expired');
			}
		}

		$sessionPrefix = ($this->autoLogin) ? 'wm-perm' : 'wm-';
		if(!$id){  
			$this->aAttrs['sid'] = User::login($userName, $password, $hashID, null, true, '', $cookie, $this->sExternalIP, $this->sDisableIPCheck, $this->sLanguage, $sessionPrefix, $this->sUserCheck ? $this->sSessionID : '');
			return;
		}

		session_id(slToolsPHP::htmlspecialchars($id));
		session_start();
		unset($_SESSION['SID']);
		if (!isset($_SESSION['no_regenerate_id']) || $_SESSION['no_regenerate_id'] == false) session_regenerate_id(true);
		 
		session_id(str_replace('.', '', uniqid($sessionPrefix, true)));

		$sSID = session_id();
		if (!$_SESSION['user']) {
			$cookies->setcookie('permanentLogin', '', mktime(0, 0, 0, 1, 1, 2000), '/');
			@session_destroy();
			throw new Exc('session_no_user', 'session_no_user');
		}
		$_SESSION['SID'] = $sSID;
		$this->aAttrs['sid'] = $sSID;
	}
	
	public static function checkServerKeys() 
	{
		if(is_file(WM_CONFIGPATH.'public.key') && filesize(WM_CONFIGPATH.'public.key') < 512){
			@unlink(WM_CONFIGPATH.'public.key');
			@unlink(WM_CONFIGPATH.'private.key');
		}
		 		if (!is_file(WM_CONFIGPATH.'private.key')) {
			$pair = icewarp_openssl_generate_RSA(2048);
			if (!file_exists(WM_CONFIGPATH)) {
				slSystem::import('tools/filesystem');
				slToolsFilesystem::mkdir_r(WM_CONFIGPATH);
			}
			if(!@file_put_contents(WM_CONFIGPATH.'private.key', $pair['Private-PEM'])) return false;
			return (bool)@file_put_contents(WM_CONFIGPATH.'public.key', ltrim($pair['modulus'],'0'));
		}
		if (!is_file(WM_CONFIGPATH.'public.key')) {
			@unlink(WM_CONFIGPATH.'private.key');
			throw new Exc('rsa_create_key_pair');
		}
	}
	
	public static function getServerKey($data)
	{
		$privateKey = openssl_pkey_get_private($data);
		return $privateKey;
	}
	public static function getServerData($type = 'private')
	{
		slSystem::import('tools/filesystem');
		slToolsFilesystem::securePath($type);
		self::checkServerKeys();
		@$privateData = file_get_contents(WM_CONFIGPATH.$type.'.key');
		return $privateData;
	}
	public static function binaryToHexString($binary)
	{
		$binary = strrev($binary);
		$valueToHexChar = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
		$binaryLength = strlen($binary);
		$result = '';
		for ($i = 0; $i < $binaryLength; $i++) {
			$result .= $valueToHexChar[ord($binary[$i]) >> 4];
			$result .= $valueToHexChar[ord($binary[$i]) & 0x0F];
		}
		return ltrim($result, '0');
	}
	public static function hexStringToBinary($hexString) {
		$result = '';
		$hexStringLength = strlen($hexString);
		$i = 0;
		if ($hexStringLength % 2) {
			$result = chr(self::hexCharValue($hexString[0]));
			$i = 1;
		}
		for (; $i < $hexStringLength; $i += 2) {
			$result .= chr(self::hexCharValue($hexString[$i])*16 + self::hexCharValue($hexString[$i+1]));
		}
		return $result;
	}

	public static function hexCharValue($hexChar) {
		if ($hexChar == '') return 0;
		if ($hexChar <= '9') {
			if ($hexChar >= '0') return ord($hexChar) - ord('0');
			throw new Exc('auth_invalid_char');
		} else if ($hexChar <= 'F') {
			if ($hexChar >= 'A') return ord($hexChar) - ord('A') + 10;
			throw new Exc('auth_invalid_char');
		} else if ($hexChar <= 'f') {
			if ($hexChar >= 'a') return ord($hexChar) - ord('a') + 10;
			throw new Exc('auth_invalid_char');
		}
		throw new Exc('auth_invalid_char');
	}
}
?>
