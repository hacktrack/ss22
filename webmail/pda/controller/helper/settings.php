<?php
require_once('inc/user.php');

 

class slHelperSettings extends slHelper
{
	public function check()
	{
		if(!$this->initialized){
			$this->get();
			$this->initialized = true;
		}
	}
	public function get()
	{
		$session = slSession::instance();
		 		if(!($data = $session->getMain('["cache"]["helper"]["settings"]["data"]'))){
			WebmailIqAuth::checkServerKeys();
			 
			$remember['login']='';
			$remember['password']='';
			$remember['type']='';
			if (isset($_COOKIE['icewarp_basic']))
			{
				$user_data=explode("|",$_COOKIE['icewarp_basic']);
				$remember['type']=$user_data[0];
				if ($user_data[0]==1)
				{
					$remember['login']=$user_data[1];
				}
				elseif($user_data[0]==2 || $user_data[0]==3)
				{
					$remember['login']=$user_data[1];
					if (substr_count($remember['password'],'HASH-')>0)
					{
						$remember['password']=str_replace("HASH-",'',$user_data[2]);
					}
					else
					{
						$remember['password']=$user_data[2];
					}
				}
			}
			$data['remember']=$remember;
			 

			$data['hash'] = file_get_contents(WM_CONFIGPATH.'public.key');
			if($oUser = $_SESSION['user']){
				$this->logged = true;
				$oPrimaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
				if($oPrimaryAccount->gw
				 && is_object($oPrimaryAccount->gwAccount)
				 && $oPrimaryAccount->gwAccount->gwAPI->isConnected()){
					$groupware['enabled'] = true;
				}else{
					$groupware['enabled'] = false;
				}
				$antispam['enabled'] = $_SESSION['SPAM_FOLDER']?true:false;
				$account = new IceWarpAccount;
				$account->Open($_SESSION['EMAIL']);
				$qsupport = $account->GetProperty('U_QuarantineSupport');
				$asupport = $account->GetProperty('U_ASSupport');
				$blacklist['enabled'] = $qsupport || $asupport;
				$whitelist['enabled'] = $blacklist['enabled'];
			}else{
				$this->logged = false;
			}
			$data['settings'] = $this->getDefault();
			$data['settings']['groupware'] = $groupware;
			$data['settings']['antispam'] = $antispam;
			$data['settings']['blacklist'] = $blacklist;
			$data['settings']['whitelist'] = $whitelist;
			if($this->logged){
				$session->setMain('["cache"]["helper"]["settings"]["init"]',1);
				$session->setMain('["cache"]["helper"]["settings"]["data"]',$data);
			}
		}
		$data['settings']['cookies'] = $_COOKIE;
		
		$data['sid']=session_id();
		$app = slApplication::instance();
		$gui = slGUI::instance($app);
		$gui->setTemplateData($data);
		return $data;
	}
	public function formWidget()
	{
		return $this->get();
	}

	public function getDefault()
	{
		$settings = WebmailSettings::instance();
		$aRestrictions = $settings->getPublic('restrictions');
		$aGlobal = $settings->getPublic('global_settings');
		$aLanguage = $settings->getPublic('layout_settings');
		$sLanguage =  $aLanguage['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'];
		$data['global']['logging_type'] = $aGlobal['@childnodes']['item'][0]['@childnodes']['logging_type'][0]['@value'];
		$aForgot = $settings->getPublic('reset_settings');
		$aForgot =$aForgot['@childnodes']['item'][0]['@childnodes'];

		 		$aForgot['enabled'][0]['@value']=false;
		 
		$data['logo_path']=APP_PATH.'skin/'.APP_SKIN.'/css/images/logo.gif';
		if (file_exists(APP_PATH.'skin/'.APP_SKIN.'/css/images/logo-custom.jpg'))
		{
			$data['logo_path']=APP_PATH.'skin/'.APP_SKIN.'/css/images/logo-custom.jpg';
		}
		elseif (file_exists(APP_PATH.'skin/'.APP_SKIN.'/css/images/logo-custom.gif'))
		{
			$data['logo_path']=APP_PATH.'skin/'.APP_SKIN.'/css/images/logo-custom.gif';
		}

		$forgotDisabled = !$aForgot['forgot'][0]['@value'];
		$aRestrictions =$aRestrictions['@childnodes']['item'][0]['@childnodes'];
		if(is_array($aRestrictions) && !empty($aRestrictions)){
				foreach($aRestrictions as $restriction => $value){
				$restrictions[$restriction] = $value[0]['@value'];
			}
		}
		if(!isset($restrictions['disable_signup'])){
			$restrictions['disable_signup'] = true;
		}

		 		$restrictions['disable_signup'] = true;
		 
		$data['signup']['domains'] = Storage::getSignupDomains();
		$data['restrictions'] = $restrictions;
		$data['restrictions']['disable_forgot'] =$forgotDisabled?1:0;

		if($this->logged){
			$default_folders = $settings->getPrivate('default_folders');
			$default_folders = $default_folders['@childnodes']['item'][0]['@childnodes'];
			if(is_array($default_folders) && !empty($default_folders)){
				foreach($default_folders as $name =>$default_folder){
					$pos = strpos($default_folder[0]['@value'],'/')+1;
					$data['default_folders'][$name] = substr($default_folder[0]['@value'],$pos);
				}
			}
			if(!$data['default_folders']['contacts']){
				$data['default_folders']['contacts'] = 'Contacts';
			}
			if(!$data['default_folders']['events']){
				$data['default_folders']['events'] = 'Events';
			}
			if(!$data['default_folders']['tasks']){
				$data['default_folders']['tasks'] = 'Tasks';
			}
			if(!$data['default_folders']['journal']){
				$data['default_folders']['journal'] = 'Journal';
			}
			if(!$data['default_folders']['notes']){
				$data['default_folders']['notes'] = 'Notes';
			}
			if(!$data['default_folders']['files']){
				$data['default_folders']['files'] = 'Files';
			}
			if(!$data['default_folders']['drafts']){
				$data['default_folders']['drafts'] = 'Drafts';
			}
			if(!$data['default_folders']['sent']){
				$data['default_folders']['sent'] = 'Sent';
			}
			if(!$data['default_folders']['trash']){
				$data['default_folders']['trash'] = 'Trash';
			}

			$aCalendarSettings = $settings->getPrivate('calendar_settings');
			@$aCalendarSettings = $aCalendarSettings['@childnodes']['item'][0]['@childnodes'];
			if($aCalendarSettings){
				foreach($aCalendarSettings as $name =>$settings){
					$data['calendar_settings'][$name] = $settings[0]['@value'];
				}
			}else{
				$data['calendar_settings']['week_begins'] = 'sunday';
				$data['calendar_settings']['day_begins'] = '8';
				$data['calendar_settings']['day_ends'] = '16';

			}
		}
		$langs = Storage::getAvailableLanguages();
		if(!$selected_language = explode('|',$_COOKIE['lastLogin'])[0]){
			$selected_language = $sLanguage?$sLanguage:'en';
		}
		foreach($langs as $key => $lang){
			$data['language'][$key]['value'] = $lang['lang'];
			$data['language'][$key]['name'] = $lang['name'];
			$data['language'][$key]['selected'] = $selected_language==$key?true:false;
		}
		$session = slSession::instance();
		$session->setMain(
			"['week_begins']",
			$data['calendar_settings']['week_begins']
		);
		return $data;
	}

	public function getPrivate($resource)
	{
		return WebmailSettings::instance()->getPrivate($resource);
	}


	public function getPublic($resource)
	{
		return WebmailSettings::instance()->getPublic($resource);
	}
}
?>