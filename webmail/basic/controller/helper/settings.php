<?php
require_once('inc/user.php');

 

class slHelperSettings extends slHelper
{
	public static $storage_function;
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
				$quarantine['enabled'] = intval($_SESSION['QUARANTINE_SUPPORT']) || intval($_SESSION['WLIST_ENABLE']) || intval($_SESSION['BLIST_ENABLE']);
				$bwlist['enabled'] = $_SESSION['QUARANTINE_SUPPORT'];
				$bwlist['whitelist'] = intval($_SESSION['WLIST_ENABLE']);
				$bwlist['blacklist'] = intval($_SESSION['BLIST_ENABLE']);
				$mAccount = createobject('account');
				if ($_SESSION['DISK_QUOTA'] && $mAccount->Open($_SESSION['EMAIL'])){
					$quota["mbox_quota"] = $_SESSION['DISK_QUOTA'];
					$size = $mAccount->GetProperty("U_MailboxSize");
					$quota["mbox_usage"] = $size?$size:'0';
				}
			}else{
				$this->logged = false;
			}
			$data['settings'] = $this->getDefault();
			$data['settings']['groupware'] = $groupware;
			$data['settings']['antispam'] = $antispam;
			$data['settings']['quarantine'] = $quarantine;
			$data['settings']['bwlist'] = $bwlist;
			$data['settings']['quota'] = $quota;
			if(slRequest::instance()->get('all._s.type')){
				$data['settings']['foldertypes'][slRequest::instance()->get('all._s.type')]['selected'] = true;
			}
			$session->setMain('["cache"]["helper"]["settings"]["init"]',1);
			$session->setMain('["cache"]["helper"]["settings"]["data"]',$data);
		}
		$data['settings']['cookies'] = $_COOKIE;
		if($_SESSION['PUBLIC']){
			$data['settings']['default_folders']['events'] = $_SESSION['PUBLIC_CALENDAR']->name;
			$data['calendar_settings']['week_begins'] = 'sunday';
			$data['calendar_settings']['day_begins'] = '8';
			$data['calendar_settings']['day_ends'] = '16';
			$session = slSession::instance();
			$session->setMain(
				"['week_begins']",
				$data['calendar_settings']['week_begins']
			);
		}
		if(slRequest::instance()->get('all._s.type')){
			$data['settings']['foldertypes'][slRequest::instance()->get('all._s.type')]['selected'] = true;
		}
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
		$aRestrictions = $settings->getPrivate('restrictions');
		
		$aLogin = $settings->getPublic('login_settings');
		$aLanguage = $settings->getPublic('layout_settings');
		$sLanguage =  $aLanguage['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'];
		$data['global']['logging_type'] = $aLogin['@childnodes']['item'][0]['@childnodes']['logging_type'][0]['@value'];
		$aForgot = $settings->getPublic('reset_settings');
		$aForgot =$aForgot['@childnodes']['item'][0]['@childnodes'];

		 		$aForgot['enabled'][0]['@value']=false;
		 
		 		$data['logo_path']='skin/basic/images/logo.jpg';
		if (file_exists(APP_PATH.'skin/basic/images/logo-custom.jpg'))
		{
			$data['logo_path']=APP_PATH.'skin/basic/images/logo-custom.jpg';
		}
		elseif (file_exists(APP_PATH.'skin/basic/images/logo-custom.gif'))
		{
			$data['logo_path']=APP_PATH.'skin/basic/images/logo-custom.gif';
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
		if(isset($restrictions['disable_gw_types'])){
			foreach(str_split($restrictions['disable_gw_types']) as $val){
				$types[strtoupper($val)] = true;
			}
			$restrictions['disable_gw_types'] = $types;
		}

		 		$restrictions['disable_signup'] = true;
		 
		$data['signup']['domains'] = Storage::getSignupDomains();
		$data['restrictions'] = $restrictions;
		$data['restrictions']['disable_forgot'] =$forgotDisabled?1:0;


		if($this->logged){
			
			$aBasic = $settings->getPrivate('basic');
			$aBasic =$aBasic['@childnodes']['item'][0]['@childnodes'];
			if(is_array($aBasic) && !empty($aBasic)){
				foreach($aBasic as $variable => $value){
					if($variable=='dgrid_preload' && !$value[0]['@value']){
						$basic[$variable] = 20;
					}else{
						$basic[$variable] = $value[0]['@value'];	
					}
				}
			}
			$_SESSION['GRID_LIMIT'] = intval($basic['dgrid_preload']);
			$data['basic'] = $basic;
			$default_folders = $settings->getPrivate('default_folders');
			$default_folders = $default_folders['@childnodes']['item'][0]['@childnodes'];
			if(is_array($default_folders) && !empty($default_folders)){
				foreach($default_folders as $name =>$default_folder){
					$pos = strpos($default_folder[0]['@value'],'/')+1;
					$data['default_folders'][$name] = substr($default_folder[0]['@value'],$pos);
					 					 					
				}
			}
			if(!$data['default_folders']['events']){
				$data['default_folders']['events'] = 'Calendar';
			}
			 				$data['default_folders']['contacts'] = '__@@ADDRESSBOOK@@__';
			 
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
			$language = slLanguage::instance();
			if(!$data['default_folders']['drafts']){
				$data['default_folders']['drafts'] = $language->get('common_folders','drafts');
			}
			if(!$data['default_folders']['sent']){
				$data['default_folders']['sent'] = $language->get('common_folders','sent');
			}
			if(!$data['default_folders']['trash']){
				$data['default_folders']['trash'] = $language->get('common_folders','trash');
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

  	$data['foldertypes']['M']['type']='M';
			$data['foldertypes']['M']['label']=$language->get('folder_types','mail');
			if(!Folder::isRestrictedType('C')){
				$data['foldertypes']['C']['type']='C';
				$data['foldertypes']['C']['label']=$language->get('folder_types','contact');
			}
			if(!Folder::isRestrictedType('E')){
				$data['foldertypes']['E']['type']='E';
				$data['foldertypes']['E']['label']=$language->get('folder_types','event');
			}
			if(!Folder::isRestrictedType('T')){
				$data['foldertypes']['T']['type']='T';
				$data['foldertypes']['T']['label']=$language->get('folder_types','task');
			}
			if(!Folder::isRestrictedType('N')){
				$data['foldertypes']['N']['type']='N';
				$data['foldertypes']['N']['label']=$language->get('folder_types','note');
			}
			 
			if(!Folder::isRestrictedType('F')){
				$data['foldertypes']['F']['type']='F';
				$data['foldertypes']['F']['label']=$language->get('folder_types','file');
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
		$session->setMain(
			"['begin_on_today']",
			$data['calendar_settings']['begin_on_today']
		);
		return $data;
	}

	public function getPrivate($resource)
	{
		return WebmailSettings::instance()->getPrivate($resource);
	}


	public function getPublic($resource,$actual_domain = false)
	{
		return WebmailSettings::instance()->getPublic($resource,$actual_domain);
	}
	
	public function setPublic($aActions,$actual_domain = false)
	{
		 		WebmailSettings::instance()->setPublic($aActions,$actual_domain);
	}
	
	public function setPrivate($aActions)
	{
		 		WebmailSettings::instance()->setPrivate($aActions);
	}
	
	public function clearCache($resource,$type = 'private',$actual_domain = false)
	{
		WebmailSettings::instance()->clearCache($resource,$type,$actual_domain);
	}
	
	public function storage_function($get,$value,$function,$variable,&$set = false)
	{
		switch($function){
			case 'responder':
				 				if($get){
					$autoresponder = $this->getPrivate('autoresponder');
					foreach($autoresponder['properties']['num'] as $property){
						$data[$property['name']] = $property['value'];
					}
					 					switch($variable){
						case 'u_responderfrom':
						case 'u_respondersubject':
						case 'u_respondertext':
						
							$pom = $data['u_respondercontent'];
							$pom = Tools::cr2crlf($pom);
							preg_match('/\$\$setactualfrom\s([^\$]+)?\$\$/si',$pom,$matches);
							$data['u_responderfrom'] = $matches[1];
							if(!is_null($matches[0])) {
								$pom = str_replace($matches[0]."\r\n","",$pom);
								$pom = str_replace($matches[0],"",$pom);
							}
							preg_match('/\$\$setsubject\s([^\$]+)?\$\$/si',$pom,$matches);
							$data['u_respondersubject'] = $matches[1];
							if(!is_null($matches[0])) {
								$pom = str_replace($matches[0]."\r\n","",$pom);
								$pom = str_replace($matches[0],"",$pom);
							}
							$data['u_respondertext'] = $pom;
						default:
							$value = $data[$variable];
						break;
					}
				 				}else{
					self::$storage_function['autoresponder']['values'][$variable] = $value;
					if(count(self::$storage_function['autoresponder']['values'])==7){
						foreach(self::$storage_function['autoresponder']['values'] as $varName => $varVal){
							switch($varName){
								case 'u_respondersubject':
									if($varVal){
										self::$storage_function['autoresponder']['set']['u_respondercontent'] .= '$$setsubject '.$varVal."$$\n";
									}
								break;
								case 'u_respondertext':
									self::$storage_function['autoresponder']['set']['u_respondercontent'] .= str_replace(array('<html>','<head>','<title>','<body>','</html>','</head>','</title>','</body>'),array('','','','','','','',''),$varVal);
								break;
								case 'u_respondbetweenfrom':
								case 'u_respondbetweento':
									if($varVal['year'] && $varVal['month'] && $varVal['day']){
										self::$storage_function['autoresponder']['set'][$varName] = $varVal['year'].'/'
										.$varVal['month'].'/'.$varVal['day'];
									}else{
										self::$storage_function['autoresponder']['set'][$varName] = '';
									}
								break;
								default:
									self::$storage_function['autoresponder']['set'][$varName] = $varVal;
								break;
							}
						}
						$set['set'] = true;
						foreach(self::$storage_function['autoresponder']['set'] as $varName=>$varVal){
							switch($varName){
								default:
									$set['values'][$varName] = $varVal;
								break;
							}
						}
					}
				}
			break;
			case 'no_respond':
				if($get){
					$autoresponder = $this->getPrivate('autoresponder');
					foreach($autoresponder['properties']['num'] as $property){
						$data[$property['name']] = $property['value'];
					}
					$arr = explode("\n",$data['u_norespondfor']);
					if($arr) foreach($arr as $key=>$val){
						if($val){
							$value[$key]['email'] = $val;
						}
					}
				}else{
					
				}
			break;
			case 'signature':
				if ($get) {
					$value = str_replace(array('&amp;'), array('&'), $value);
				}
				 				else {
					$set['set'] = true;
					$set['values'][$variable] = str_replace(
						array('<html>', '<head>', '<title>', '<body>', '</html>', '</head>', '</title>', '</body>'),
						array('',       '',       '',        '',       '',        '',        '',         ''),
						slToolsString::purifyHTML($value)
					);
				}
			break;
			case 'forwarder':
				if($get){
					$forwarder = $this->getPrivate('forwarder');
					foreach($forwarder['properties']['num'] as $property){
						$data[$property['name']] = $property['value'];
					}
					switch($variable){
						default:
							$value = $data[$variable];
						break;
					}
				 				}else{
					self::$storage_function['forwarder']['values'][$variable] = $value;
					if(count(self::$storage_function['forwarder']['values'])==5){
						foreach(self::$storage_function['forwarder']['values'] as $varName => $varVal){
							self::$storage_function['forwarder']['set'][$varName] = $varVal;
						}
						
						$set['set'] = true;
						foreach(self::$storage_function['forwarder']['set'] as $varName=>$varVal){
							switch($varName){
								case 'u_null':
									if(self::$storage_function['forwarder']['set']['u_forwardto']==''){
										$set['values'][$varName] = 0;
									}else{
										$set['values'][$varName] = $varVal;
									}
								break;
								case 'u_forwardolderto':
									if(!self::$storage_function['forwarder']['set']['u_forwardolder']){
										$set['values'][$varName] = '';
									}else{
										$set['values'][$varName] = $varVal;
									}
								break;
								default:
									$set['values'][$varName] = $varVal;
								break;
							}
						}
					}
				}
				
				
			break;
			case 'changepwd':
				if(!$get){
					self::$storage_function['changepwd']['values'][$variable] = $value;
					if(count(self::$storage_function['changepwd']['values'])==3){
						
						$confirm = self::$storage_function['changepwd']['values']['confirmpassword'];
						$new = self::$storage_function['changepwd']['values']['newpassword'];
						$old = self::$storage_function['changepwd']['values']['oldpassword'];
						
						if($new || $old || $confirm){
							WebmailIqAuth::checkServerKeys();
							$privateData = file_get_contents(WM_CONFIGPATH.'private.key');
							$privateKey = openssl_pkey_get_private($privateData);
							
							openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($old), $sPassword, $privateKey);
							openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($new), $sNewPassword, $privateKey);
							openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($confirm), $sCheckPassword, $privateKey);
							
							if($sCheckPassword!=$sNewPassword){
								throw new Exc('password_confirmation');
							}
							
							$user = &$_SESSION['user'];
							$account = $user->getAccount($_SESSION['EMAIL']);
							$aProperties['password'] = $sNewPassword;
							$aProperties['oldPassword'] = $sPassword;
							
							$api = createobject('api');
							$res = $api->ManageConfig('passpolicy','','password='.$sNewPassword.'&mailbox='.$account->username);
							if(!$res){
								throw new Exc('account_signup_error',slToolsPHP::htmlspecialchars(slLanguage::instance($this->language)->get('exceptions','account_signup_6')));
							}
							$user->editAccount($_SESSION['EMAIL'],$aProperties,$sid,true);
							 						}
					}
				}
				
				break;
			
		}
		return $value;
	}
	
	public function getSections($oXML = false)
	{
		if(!$oXML){
			$sPath = slGUI::instance()->getFile('view','settings','.xml');
			if(!$sPath){
				throw new Exception('GUI:Descriptor file missing:'.slToolsPHP::htmlspecialchars($this->getView()));
			}

			$oXML = slToolsXML::loadFile($sPath);
			$oXML = $oXML->settings;
		}
		$level = strtolower(slRequest::instance()->get('all.level'));
		if(!$level){
			$level = 'user';
		}
		 
		 		 
		$data = $this->get();
		$restrictions = $data['settings']['restrictions'];
		if($oXML->section) foreach($oXML->section as $settingsSection){
			if(	$settingsSection['restriction']
			&&	$restrictions[strval($settingsSection['restriction'])]){
				continue;
			}
			slSystem::import('widget/settings',APP_PATH);
			if(!slWidgetSettings::checkViewAccess($_SESSION['ACCOUNT'],$settingsSection['view'],$level)){
				continue;
			}
			
			$section['label'] = slLanguage::instance()->getLabel($settingsSection['label']);
			$section['description'] = slLanguage::instance()->getLabel($settingsSection['description']);
			$section['id'] = strval($settingsSection['id']);
			$section['icon'] = strval($settingsSection['icon']);
			$section['link'] = slRequest::instance()->getPath();
			$section['link'].= '?_n[w]=main&_n[p][main]=win.main.tree&_n[p][content]=settings&_s[type]=S&view=section&section='.$section['id'].'&level='.$level;
			$section['active'] = $section['id']==slRequest::instance()->get('all.section')?true:false;
			$sections['sections'][] = $section;
		}
		$available_domains = Storage::getAvailableDomains();
		if($available_domains){
			foreach($available_domains as $k => $domain){
				if($domain['domain']==slRequest::instance()->get('all.domain')){
					$available_domains[$k]['domain_selected'] = true;
				}
			}
		}
		$sections['property']['level'] = slRequest::instance()->get('all.level')?slRequest::instance()->get('all.level'):'user';
		return $sections;
	}
}
?>
