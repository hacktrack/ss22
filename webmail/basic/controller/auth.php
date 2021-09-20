<?php
$disable_ip_check_override=false;

require_once('inc/user.php');
 slSystem::import('application/link');
slSystem::import('controller/dialog');
 

 class slControllerAuth extends slControllerDialog
{	
	private $js=0;
	
	public function check( &$action , &$data )
	{
		$cookie = new slToolsCookie();
		$cookie->setcookie('sess_suffix','basic',mktime(0,0,0,1,1,2030),'/');
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
				$this->username = $data['all']['username'];
				$this->auto_login = $data['all']['auto_login']?true:false;
				$this->cipher = isset($data['all']['password_rsa']);
				$this->acipher = isset($data['all']['direct']);
				 
				if(isset($data['all']['to']) && $data['all']['to']=='pro' && !$disable_ip_check_override){
					$this->disable_ip_check=false;
				}else{$this->disable_ip_check=true;
				}
				$this->language = $data['form']['language'];
				$cookie->setcookie('basic_disable_ip_check',$this->disable_ip_check,mktime(0,0,0,1,1,2030),'/');
				$this->password = slToolsCrypt::encryptSymmetric($this->cipher ? $data['all']['password_rsa'] : $data['all']['password']);
				$this->hashid = $data['all']['hash'];
				$this->external = (isset($data['all']['type']) && $data['all']['type']=='external');
				$this->target = $data['all']['_n']['p']['main'];
				if(!$this->target){
					$this->target = 'win.main.tree';
				}
				break;
			case 'resetpwd':
				$this->cipher = isset($data['all']['password_rsa']);
				$this->newPassword = $this->cipher ? $data['all']['password_rsa'] : $data['all']['password'];
				$this->checkPassword = $data['all']['passwordCheck'];
				$this->reset_hash = $data['all']['reset_hash'];
				$this->language = $data['form']['language'];
				$this->username = $data['all']['username'];
				if(!$this->reset_hash){
					throw new Exc('reset_password_no_hash');
				}
				break;
			case 'changepwd':
				$this->username = $data['all']['username'];
				$this->cipher = isset($data['all']['password_rsa']);
				$this->password = slToolsCrypt::encryptSymmetric($this->cipher ? $data['all']['password_rsa'] : $data['all']['password']);
				$this->newPassword = $data['all']['passwordNew'];
				$this->checkPassword = $data['all']['passwordCheck'];
				$this->language = $data['form']['language'];
				if(!$this->newPassword){
					throw new Exc('account_no_password');
				}
				break;
			case 'contact':
				$this->language = $data['all']['language'];
				break;
			case 'reset':
			case 'forgot':
				$this->language = $data['all']['language'];
				$this->referer = $data['all']['referer'];
				break;
			case 'signup':
				
				$lastLogin = $_COOKIE['lastLogin'];
				$lastLogin = explode('|',$lastLogin);
				$this->language = $data['form']['language']?$data['form']['language']:($lastLogin[0]?$lastLogin[0]:'en');
				$lang = slLanguage::instance($this->language);
				$this->referer = $data['all']['referer']?$data['all']['referer']:slRequest::instance()->getReferer();
				try{
					if(!$data['form']['signup_username']){
						throw new Exc('account_no_username','account_no_username');
					}
					if(!$data['form']['signup_password']){
						throw new Exc('account_no_password','account_no_password');
					}
					if($data['form']['signup_password']!=$data['form']['signup_confirmpassword']){
						throw new Exc('password_confirmation','password_confirmation');
					}
					$api = createobject('api');
					$res = $api->ManageConfig('passpolicy','','password='.$data['form']['signup_password'].'&mailbox='.$data['form']['signup_username']);
					if(!$res){
						$linkAdd='&pwpolicy=1';
						throw new Exc('account_signup_error',slToolsPHP::htmlspecialchars($lang->get('exceptions','account_signup_6')));
					}
				}catch(Exception $e){
					$request = slRequest::instance();
					$result = new stdClass();
					$result->redirect = true;
					$result->error = $e;
					$result->redirectURL = $this->referer.'?_n[w]=main&_n[p][main]=win.login&selfSignUp=1'.$linkAdd;
	
					$session = slSession::instance();
					$session->start();
					slApplication::instance()->finish($result);
				}
				break;
		}
		if($this->language){
			$lang = slLanguage::instance($this->language);
		}
	}

	 
	public function login()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$cookie = new slToolsCookie();
		$sUsername = $this->username;
		$sPassword = $this->password;
		$sHashID = $this->hashid;
		$bCipher = $this->cipher?true:false;
		$aCipher = $this->acipher?true:false;
		@$sWindow = reset(array_keys($this->guiData['view']));
		$sView = $this->guiData['view'][$sWindow];
		 		switch($_REQUEST['to']){
			case 'pro':
				define('EMAIL_LINK_FORMAT',"#__w_o#a href=#__w_q#mailto:$0#__w_q##__w_c#$1#__w_o#/a#__w_c#");
				define('LANGUAGE_PATH','../client/languages/');
			break;
			case 'pda':
				define('EMAIL_LINK_FORMAT',"#__w_o#a target=#__w_q#_top#__w_q# href=#__w_q#index.html?_n[p][main]=mail.compose&to=$1#__w_q##__w_c#$1#__w_o#/a#__w_c#");
				define('LANGUAGE_PATH','../pda/language/');
			break;
		}
		 
		$cookie->setcookie('lastUsername',$sUsername,mktime(0,0,0,1,1,2030),'/');
		$layout_settings = WebmailSettings::instance()->getPrivate('layout_settings');
		$forced_language = $layout_settings['@childnodes']['item'][0]['@childnodes']['language'][0]['@attributes']['access'] == 'view';
				
		if (!isset($_POST['nocookie'])){$cookie->setcookie('lastLogin',strval($this->language)."|".$_POST['to'],mktime(0,0,0,1,1,2030),'/');}
		
		try{
			 			if($bCipher){
				WebmailIqAuth::checkServerKeys();
				$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
				$privateKey = openssl_pkey_get_private($privateData);
				openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($sPassword), $sPassword, $privateKey);
			}
			
			$usePermanentPrefix = ($request->get('all.auto_login') == 1 || $_COOKIE['permanentLogin'] ? true : false);
			
			 			 			
			if(empty($sPassword) || substr_count($sPassword,'p=&')>0){
				throw new Exc('account_no_password');
			}

			$sSID = Tools::decideLoginType($sUsername, slToolsCrypt::decryptSymmetric($sPassword), $sHashID,$this->disable_ip_check,$usePermanentPrefix,true,$this->language);
			$session = slSession::instance();
			$session->sid = session_id($sSID);
			if($this->language){
				$session->setMain('login_language',$this->language);
				if(!$forced_language){
					Storage::setActualLanguage($this->language);
				}
			}
			if ($_REQUEST['to']=='pro')
			{
				$cookie->setcookie('login_sid',$sSID,mktime(0,0,0,1,1,2030),'/');
			}else{
				if($_SESSION['GUEST_ACCOUNT']==1){
					throw new Exc('account_is_guest');
				}
			}
			
			if ($this->auto_login){
				$cookie->setcookie('permanentLogin','i='.$sSID,mktime(0,0,0,1,1,2030),'/');
			}else{
				$cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
			}
			 			$cookie->setcookie('PHPSESSID_BASIC','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_PDA','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_PRO','',mktime(0,0,0,1,1,2030),'/');
			$cookie->setcookie('PHPSESSID_LOGIN','',mktime(0,0,0,1,1,2030),'/');
			
			
			$cookie->setcookie('PHPSESSID_'.strtoupper($_REQUEST['to']),$sSID,mktime(0,0,0,1,1,2030),'/');
			
			$oUser = &$_SESSION['user'];
			if(!is_object($oUser)){
				$no_user = true;
				throw new Exc('session_no_user','session_no_user');
			}
			if ($_REQUEST['to']!='pro'){
				$oPrimaryAccount = $oUser->getAccount($_SESSION['EMAIL']);
				 				$oPrimaryAccount->sync();
				if($oPrimaryAccount->isDelayed()){
					$oPrimaryAccount->syncDelayedFolders();
				}
				try{
					$oInbox = $oPrimaryAccount->getFolder('INBOX');
					 					$oInbox->sync();
				}catch(Exc $e){
					$oPrimaryAccount->test();
				}
			}
			$_SESSION['CTZ'] = $this->timezone;
			$result->redirect = true;
			if ($_REQUEST['to']=='pro')
			{
				 				 				$path='../';
				 				if (!isset($_REQUEST['ref']) && isset($_POST['ref']))
				{
					 					$_REQUEST['ref']=$_POST['ref'];
				}
				if (!isset($_REQUEST['ref']) && isset($_POST['referer']))
				{
					$_REQUEST['ref']=$_POST['referer'];
				}
				
				$referer=$path;
				$referer=slLink::cutQueryString($referer);
				$referer=slLink::removeErrorAndMessage($referer);
				
				$qs=array();
				if (!ini_get('session.use_cookies')) {$qs[]='sid='.$sSID;}
				if (isset($_GET['xml'])) {$qs[]='xml='.$_GET['xml'];}
				if (isset($_GET['debug'])) {$qs[]='debug='.$_GET['debug'];}
				if (isset($_GET['mailto'])) {$qs[]='mailto='.str_replace('+','%20',urlencode($_GET['mailto']));}
				if (isset($_GET['subject'])) {$qs[]='subject='.str_replace('+','%20',urlencode($_GET['subject']));}
				if (isset($_GET['video'])) {$qs[]='video='.$_GET['video'];}
				if (isset($_GET['telemetry'])) {$qs[]='telemetry='.$_GET['telemetry'];}
				if (isset($_GET['username'])) {$qs[]='username='.$_GET['username'];}
				if (isset($_GET['meeting'])) {$qs[]='meeting='.$_GET['meeting'];}
				
				if (isset($_GET['cc'])) {$qs[]='cc='.str_replace('+','%20',urlencode($_GET['cc']));}
				if (isset($_GET['bcc'])) {$qs[]='bcc='.str_replace('+','%20',urlencode($_GET['bcc']));}
				if (isset($_GET['body'])) {$qs[]='body='.str_replace('+','%20',urlencode($_GET['body']));}
				if (isset($_GET['sms'])) {$qs[]='sms='.$_GET['sms'];}
				if (isset($_GET['open'])) {$qs[]='open='.$_GET['open'];}
				if (isset($_GET['page'])) {$qs[]='page='.$_GET['page'];}
				if (isset($_GET['drafts_imap_id'])) {$qs[]='drafts_imap_id='.$_GET['drafts_imap_id'];}
				if (isset($_GET['RoomID'])) {$qs[]='RoomID='.$_GET['RoomID'];}
				if (isset($_GET['roomid'])) {$qs[]='roomid='.$_GET['roomid'];}
				if (isset($_GET['PostID'])) {$qs[]='PostID='.$_GET['PostID'];}
				if (isset($_GET['postid'])) {$qs[]='postid='.$_GET['postid'];}
				if (isset($_GET['from'])) {$qs[]='from='.$_GET['from'];}
				
				 				if (!empty($qs)) {$qs='?'.join('&',$qs);} else {$qs='';}
				if (isset($_REQUEST['ref'])) {if (empty($qs)){$qs.='';} $qs.='#ref='.$_REQUEST['ref'];}
				 				 				$result->redirectURL=$referer.$qs;
			} else {
				$result->redirectURL = $request->getPath().'?_n[p][main]='.$this->target.'&_n[w]=main&_n[p][content]=mail.main';
			}
			
			$referer = $_POST['referer']?$_POST['referer']:$request->getReferer();
			$referer=slLink::cutQueryString($referer);
			$_SESSION['LOGOUT_REFERER'] = $referer;
			
			
		}catch(Exc $e){
			if($this->language){
				$lang = slLanguage::instance($this->language);
				$_SESSION['LANGUAGE'] = $this->language;
			}
			 			$result->external=$this->external;
			$result->redirect = true;
			$path = $_POST['referer']?$_POST['referer']:$request->getReferer();			$path = slLink::cutQueryString($path);
			$result->redirectURL = $path;
			$result->redirectURL = slLink::removeErrorAndMessage($result->redirectURL);
			if(isset($_GET['meeting'])){$result->redirectURL.='?meeting='.$_GET['meeting'];}
			header("X-Error: ".$e->wmcode);
			$result->error = $e;
			$_SESSION['jscheck']=$this->js;
			return $result;
		}

		$_SESSION['jscheck']=$this->js;
		$session->setMain('["cache"]',NULL);
		return $result;
	}
	
	public function logout()
	{
		$referer = $_SESSION['LOGOUT_REFERER'];
		$referer = slLink::cutQueryString($referer);
		$cookie = new slToolsCookie();
		if(isset($_GET['changepwd']))
		{
			$referer='../?changepwd=1';
		}
		
		$request = slRequest::instance();
		try{
			if(is_object($_SESSION['user'])){
				$_SESSION['user']->logout(true);
			}
		}catch(Exception $e){
			
		}

		$cookie->setcookie('permanentLogin','',mktime(0,0,0,1,1,2000),'/');
		$result = new stdClass();
		$result->redirect = true;
		if($referer){
			$result->redirectURL = $referer;
		}else{
			$result->redirectURL = $request->getPath().'?_n[p][main]=win.login&_n[w]=main';
		}
		return $result;
	}
	
	 
	
	private function checkLanguage(&$language ,&$access = '')
	{
		$domain = Tools::getHostDomain();
		 		$layoutGlobal = Storage::getDefaults('layout_settings');
		$layoutDomain = Storage::getDomainDefaults('layout_setttings',$domain);
		$layoutSettings = WebmailIqPublic::get('layout_settings', $layoutGlobal, $layoutDomain, false);
		$languageTag = $layoutSettings['@childnodes']['item'][0]['@childnodes']['language'];
		$access = $languageTag[0]['@attributes']['useraccess'];
		if($access == 'view'){
			$language = $languageTag[0]['@value'];
		}
		return $language;
	}
	
	private function getPassword()
	{
		
	}
	
	private function getAdminEmail()
	{
		$api = createobject('api');
		$primary_domain = $api->getDomain(0);
		$dom=new IceWarpDomain();
	
		$domain = Tools::getHostDomain();
		$domain_admin_email=false;
		if($ret=$dom->open($domain)) {
			$domain_admin_email=$dom->GetProperty('D_AdminEmail');
		}
		if(!$domain_admin_email || empty($domain_admin_email)) {
			if($ret=$dom->open($primary_domain)) {
				$domain_admin_email=$dom->GetProperty('D_AdminEmail');
			}
		}
		if(!$domain_admin_email || empty($domain_admin_email)) {
			log_buffer('Cannot get administrator\'s email for domain ['.$domain.'] and primary domain ['.$primary_domain.']!','EXTENDED');
			$domain_admin_email=false;
		}
		
		return $domain_admin_email;
	}	
	
}


?>
