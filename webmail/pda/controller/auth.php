<?php
require_once('inc/user.php');
slSystem::import('application/link');

 

 class slControllerAuth extends slControllerDefault
{	
	private $js=0;
	
	public function login()
	{
		$cookie = new slToolsCookie();
		$request = slRequest::instance();
		$result = new stdClass();
		$sUsername = $this->username;
		$sPassword = $this->password;
		$bCipher = $this->cipher?true:false;
		$aCipher = $this->acipher?true:false;
		@$sWindow = reset(array_keys($this->guiData['view']));
		$sView = $this->guiData['view'][$sWindow];
		
		define('EMAIL_LINK_FORMAT',"#__w_o#a target=#__w_q#_top#__w_q# href=#__w_q#index.html?_n[p][main]=mail.compose&to=$1#__w_q##__w_c#$1#__w_o#/a#__w_c#");
		define('LANGUAGE_PATH','../pda/language/');

		 
		$cookie->setcookie('lastUsername',$sUsername,mktime(0,0,0,1,1,2030),'/');
		$layout_settings = WebmailSettings::instance()->getPrivate('layout_settings');
		$forced_language = $layout_settings['@childnodes']['item'][0]['@childnodes']['language'][0]['@attributes']['access'] == 'view';
		
		if (!isset($_POST['nocookie']) && !$forced_language){
			$cookie->setcookie('lastLogin',strval($this->language)."|pda",mktime(0,0,0,1,1,2030),'/');
		}
		$cookie->setcookie('sess_suffix','pda',mktime(0,0,0,1,1,2030),'/');
	
		try{
			
			 			if($bCipher){
				WebmailIqAuth::checkServerKeys();
				$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
				$privateKey = openssl_pkey_get_private($privateData);
				openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($sPassword), $sPassword, $privateKey);
			}
			$usePermanentPrefix=($request->get('all.auto_login')==1 || $_COOKIE['permanentLogin']?true:false);
			
			$sSID = Tools::decideLoginType($sUsername, slToolsCrypt::decryptSymmetric($sPassword),'',$this->disable_ip_check,$usePermanentPrefix,true,$this->language);

			if($this->language){
				slSession::instance()->setMain('login_language',$this->language);
				if(!$forced_language){
					Storage::setActualLanguage($this->language);
				}
			}
			$oUser = &$_SESSION['user'];
			if(!is_object($oUser)){
				throw new Exc('session_no_user','session_no_user');
			}
			if($_SESSION['GUEST_ACCOUNT']==1){
				throw new Exc('account_is_guest');
			}
			
			$oPrimaryAccount = $oUser->getAccount($_SESSION['EMAIL']);
			
			 			$oPrimaryAccount->sync();
			try{
				$oInbox = $oPrimaryAccount->getFolder('INBOX');
				$oInbox->sync();
			}catch(Exc $e){
				$oPrimaryAccount->test();
			}


			
			if ($this->auto_login)
			{
				$cookie->setcookie('permanentLogin','i='.$sSID,mktime(0,0,0,1,1,2030),'/');
			}
			else
			{
				$cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
			}
			
			 			$cookie->setcookie('PHPSESSID_BASIC','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_PDA','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_PRO','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_LOGIN','',mktime(0,0,0,1,1,2030),'/');
			
			 			$cookie->setcookie('PHPSESSID_'.strtoupper($_REQUEST['to']?$_REQUEST['to']:'pda'),$sSID,mktime(0,0,0,1,1,2030),'/');
						
			$_SESSION['CTZ'] = $this->timezone;
			
			$result->redirect = true;
			 			$result->redirectURL = IceWarpAPI::instance()->getProperty('C_Webmail_URL').'/pda/index.html?_n[p][main]='.$this->target.'&_n[w]=main&_n[p][content]=grid.mail';
		}catch(Exc $e){
			if($this->language){
				$lang = slLanguage::instance($this->language);
				$_SESSION['LANGUAGE'] = $this->language;
			}
			 			 			$result->redirect = true;
			$path = $_POST['referer']?$_POST['referer']:$request->getReferer();  			$path = slLink::cutQueryString($path);
			$result->redirectURL = $path;
			$result->error = $e;
		}
		$_SESSION['LOGOUT_REFERER']=$_POST['referer']?$_POST['referer']:$request->getReferer();  		$_SESSION['jscheck']=$this->js;
		$session = slSession::instance();
		$session->sid = $sSID?$sSID:session_id();
		return $result;
	}
	
	public function logout()
	{
		$cookie = new slToolsCookie();
		$referer = $_SESSION['LOGOUT_REFERER'];
		$result = new stdClass();
		if(is_object($_SESSION['user'])){
			$_SESSION['user']->logout(true);
		}
		$result->redirect = true;
		if($referer){
			$referer = slLink::cutQueryString($referer);
			 			$result->redirectURL=$referer;
		}else{
			 			$result->redirectURL = slRequest::instance()->getPath().'?_n[p][main]=win.login&_n[w]=main';
		}
		$cookie->setcookie('PHPSESSID_PDA','',mktime(0,0,0,1,1,2000),'/');
		$cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
		return $result;
	}
	
	public function check( &$action , &$data )
	{
		$cookie = new slToolsCookie();
		parent::check( $action, $data );
		if (isset($data['all']['_n']['js']))
		{
			if ($data['all']['_n']['js']!='')
			{
				$this->js=$data['all']['_n']['js'];
			}
		}else{
			 			$this->js= true;
		}
		 		slControllerAuth::checkLanguage($data['form']['language'],$access);
		
		switch($action){
			case 'login':
				$this->timezone = $data['all']['ctz'];
				$this->username = $data['form']['username'];
				$this->cipher = isset($data['form']['password_rsa']);
				$this->acipher = isset($data['form']['direct']);
				$this->auto_login = $data['all']['auto_login']?true:false;
				$this->disable_ip_check = $data['form']['disable_ip_check'];
				$this->disable_ip_check = $this->disable_ip_check?true:false;
				$this->language = $data['form']['language'];
				$cookie->setcookie('pda_disable_ip_check',$this->disable_ip_check,mktime(0,0,0,1,1,2030),'/');
				$this->password = slToolsCrypt::encryptSymmetric($this->cipher ? $data['form']['password_rsa'] : $data['form']['password']);
				$this->target = $data['all']['_n']['p']['main'];
				if(!$this->target){
					$this->target = 'win.main';
				}
			break;
		}
	}
	
	private function checkLanguage(&$language ,&$access = '')
	{
		$domain = Tools::getHostDomain();
		 		$layoutGlobal = Storage::getDefaults('layout_settings');
		$layoutDomain = Storage::getDomainDefaults('layout_setttings',$domain);
		$layoutSettings = WebmailIqPublic::get('layout_settings', $layoutGlobal, $layoutDomain, false);
		$languageTag = $layoutSettings['@childnodes']['item'][0]['@childnodes']['language'];
		if($access == 'view'){
			$language = $languageTag[0]['@value'];
		}
		$access = $languageTag[0]['@attributes']['useraccess'];
		return $language;
	}

}


?>
