<?php
 
class WebmailIqAccounts extends XMLRequestInterface
{
	 public $sAccountID;

	public $oEmail;
	public $sCTZ;
	public $oDOMAcl;
	public $sGetAction;
	public $oDOMDoc;
	public $oDOMQuery;
	public $acl;
	public $bForceGWReload;
	public $sAction;
	public $sCaptchaUID;
	public $aSubscribtionAccount;
	public $iTwoFactorType;
	public $sTwoFactorSMS;
	public $sTwoFactorCode;
	public $sTwoFactorPassword;
	public $sTwoFactorKey;

	 
	public function __construct($oDOMQuery,&$oDOMDoc,&$attrs)
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
		 		if ($this->aAttrs['type'] == 'set') {
		
			 
			if (!$oDOMAccount = $this->oDOMDoc->getNode("accounts:account",$this->oDOMQuery)){
				throw new Exc('account_missing_tag','account');
			}
			 
			$aActions = array(
				'edit'=>1,
				'add' =>1,
				'delete'=>1,
				'sync'=>1,
				'refresh'=>1,
				'test'=>1,
				'signup'=>1,
				'subscribe'=>1,
				'unsubscribe'=>1,
				'subscribe_folder'=>1,
				'unsubscribe_folder'=>1,
				'reset_two_factor'=>1,
				'confirm_two_factor'=>1,
				'setup_two_factor'=>1,
				'manual_two_factor'=>1
			);
			$this->sAction = $oDOMAccount->getAttribute("action"); 
			$this->aAttrs['action'] = $this->sAction;
			 			if(!$this->aAttrs['sid']){
				parent::checkFreeAction('webmail:iq:accounts',$this->sAction);
			}
			if (isset($aActions[$this->sAction]))
			{
				if (
						($this->sAction=='add' 
						|| $this->sAction=="test" 
						|| $this->sAction=="signup") 
					&& ($this->oEmail = $this->oDOMDoc->getNode("accounts:email",$oDOMAccount))
				){
					$this->sAccountID = $this->oDOMDoc->getNodeValue("accounts:email",$oDOMAccount);
				} else { 
					if (!$this->sAccountID = $oDOMAccount->getAttribute("uid")) {
						throw new Exc('account_missing_id');
					}
				}
			}	else {
				throw new Exc('account_invalid_action',$this->sAction);
			}
		 		}else{
			if ($oDOMAccount = $this->oDOMDoc->getNode("accounts:account",$this->oDOMQuery)){
				$this->sAccountID = $oDOMAccount->getAttribute('uid');
				$this->sGetAction = $oDOMAccount->getAttribute('action');
			}
			if ($oDOMCTZ = $this->oDOMDoc->getNode("accounts:ctz",$this->oDOMQuery)){
				$this->sCTZ = $oDOMCTZ->nodeValue;
			}
		}
		 		switch($this->sAction){
			case 'subscribe':
			case 'unsubscribe':
			case 'subscribe_folder':
			case 'unsubscribe_folder':
				foreach($this->oDOMDoc->query('accounts:subscription',$oDOMAccount) as $oDOMSubscriptionAccount){
					$this->aSubscribtionAccount[] = $oDOMSubscriptionAccount->nodeValue;
				}
				if(!$this->aSubscribtionAccount){
					throw new Exc('account_subscribe_missing_account');
				}
				
			break;
			case 'edit':
				 				if($this->oDOMAcl = $this->oDOMDoc->getNode('accounts:acl',$oDOMAccount)){
					foreach($this->oDOMDoc->query('accounts:right',$this->oDOMAcl) as $oDOMRight){
						if(!$email = $oDOMRight->getAttribute('email')){
							throw new Exc('account_missing_attribute','email');
						}
						$this->acl[$email] = Folder::rightsToBitValue($oDOMRight->nodeValue);
					}
				}
			break;
			case 'signup':
				 				if($oDOMCaptcha = $this->oDOMDoc->getNode('accounts:captcha',$oDOMAccount)){
					$this->sCaptchaUID = $oDOMCaptcha->getAttribute('uid');
				}
				if(!$this->sCaptchaUID){
					throw new Exc('empty_captcha');
				}
			break;
			case 'sync':
			case 'refresh':
				if($oDOMForceGW = $this->oDOMDoc->getNode('accounts:force_gw',$oDOMAccount)){
					$this->bForceGWReload =  $this->oDOMDoc->getNodeValue('accounts:force_gw',$oDOMAccount);
					$this->bForceGWReload = $this->bForceGWReload?true:false;
				}
				break;
			case 'setup_two_factor':
					if($oDOMTwoFactorType = $this->oDOMDoc->getNode('accounts:two_factor_type',$oDOMAccount)){
						$this->iTwoFactorType =  $this->oDOMDoc->getNodeValue('accounts:two_factor_type',$oDOMAccount);
					}
					if($oDOMTwoFactorSMS = $this->oDOMDoc->getNode('accounts:two_factor_phone',$oDOMAccount)){
						$this->sTwoFactorSMS =  $this->oDOMDoc->getNodeValue('accounts:two_factor_phone',$oDOMAccount);
					}
				break;
			case 'reset_two_factor':
					if($oDOMTwoFactorcode = $this->oDOMDoc->getNode('accounts:two_factor_code',$oDOMAccount)){
						$this->sTwoFactorCode =  $this->oDOMDoc->getNodeValue('accounts:two_factor_code',$oDOMAccount);
					}
				break;
			case 'confirm_two_factor':
				if($oDOMTwoFactorcode = $this->oDOMDoc->getNode('accounts:two_factor_code',$oDOMAccount)){
					$this->sTwoFactorCode =  $this->oDOMDoc->getNodeValue('accounts:two_factor_code',$oDOMAccount);
				}
				if($oDOMTwoFactorPassword = $this->oDOMDoc->getNode('accounts:password',$oDOMAccount)){
					$this->sTwoFactorPassword =  $this->oDOMDoc->getNodeValue('accounts:password',$oDOMAccount);
				}
			break;
			case 'manual_two_factor':
				if($oDOMTwoFactorKey = $this->oDOMDoc->getNode('accounts:two_factor_key',$oDOMAccount)){
					$this->sTwoFactorKey =  $this->oDOMDoc->getNodeValue('accounts:two_factor_key',$oDOMAccount);
				}
			break;
		}
	}
	 
	private function exeInputXML()
	{
		 		$oUser = &$_SESSION['user'];
		$aAccounts = &$oUser->aAccounts;
		 		$sAid	= $this->sAccountID;
		switch ($this->aAttrs['type']) {
			case 'get':
				$this->sTemplateFile = 'webmailiqaccounts_get';
				switch($this->sGetAction){
					case 'license':
						if($this->sAccountID){
							$account = &$aAccounts[$this->sAccountID];
							$licenseInfo = $account->getLicense();
						}
						$list = array($account->accountID=>$account);
						$this->aData['aid']  = $account->accountID;
					break;
					default:
					 					if($this->sAccountID){
						$account = &$aAccounts[$this->sAccountID];
						if($account->gwAccount && $account->gwAccount->bLogged){
							$account->gwAccount->getAcl();
							$account->acl = $account->gwAccount->acl;
						}else{
							$account->getAcl();
						}
						$list = array($account->accountID=>$account);
						$this->aData['aid']  = $account->accountID;
					}else{
						$list = $aAccounts;
					}
					
					break;
				
			}
			 
			$this->aData = $this->cnvAccounts($list,false,$licenseInfo);
			break;
			case 'set':
				$this->sTemplateFile = 'webmailiqaccounts_set';
				 				$oDOMAccountinp = $this->oDOMDoc->getNode("accounts:account",$this->oDOMQuery);
				$aProperties = Tools::makeArrayFromXML($oDOMAccountinp,true);
				if(!isset($aProperties['email']) || !$aProperties['email']){
					$aProperties['email'] = $sAid;
				}
				 				if(isset($aProperties['protocol']) && $aProperties['protocol'] == 'pop3'){
					$api = new MerakAccount();
					 					 					if($api->Open($aProperties['email'])){
						$sType = $api->getProperty('U_AccountType');
						if($sType > 0){
							$aProperties['protocol'] = 'imap';
							$aProperties['port'] = '143';
						}else{
							$aProperties['protocol'] = 'local';
						}
					}
				}
				switch ($this->sAction){
					 					case 'add':
						$oUser->testAccount($aProperties);
						 						$aProperties['valid'] = 1;
						$oUser->createAccount($aProperties,$sAid);
					break;
					 					case 'edit':
						if($this->acl){
							$aProperties['acl'] = $this->acl;
						}
						$oAccount = $oUser->getAccount($sAid);
						if(!$oAccount->primary && ($aProperties['username'] || $aProperties['password'])){
							$oUser->testAccount($aProperties);
						}
						$aProperties['valid'] = 1;
						$sid = false;
						$oUser->editAccount($sAid, $aProperties, $sid);
						 						if($sid){
							$this->aAttrs['sid'] = $sid;
						}
					break;
					 					case 'delete':
						$oUser->deleteAccount($sAid);
					break;
					 					case 'sync':
					case 'refresh':
						 						$api = new MerakAccount();
						$_SESSION['OFFICE_SUPPORT'] = $api->getProperty("U_WebDocumentsSupport");
						 						if (isset($aAccounts[$sAid])) {
							$oAccount = &$_SESSION['user']->aAccounts[$sAid];
						}
						else {
							throw new Exc('account_does_not_exist', $sAid);
						}
						
						$oAccount->aSyncedFolders = array();
						 						$oAccount->sync($this->bForceGWReload);
						
						log_buffer("SYNC folders start","EXTENDED");
						$oAccount->syncFolders();
						 						log_buffer("SYNC folders end","EXTENDED");
						$folders = $oAccount->getFolders(false);
						if($gwtrash = $oAccount->getGWTrash()){
							$folders[$gwtrash->name] = $gwtrash;
						}
						log_buffer("GET folders end","EXTENDED");
						$this->aData['aid']  = $sAid;

						 						if($_SESSION['DISK_QUOTA'] ?? false){
							$mAccount = createobject('account');
							if ($mAccount->Open($oAccount->accountID)){
								$this->aData["mbox_quota"] = $_SESSION['DISK_QUOTA'];
								$size = $mAccount->GetProperty("U_MailboxSize");
								$this->aData["mbox_usage"] = $size?$size:'0';
							}
						}

						log_buffer("QUOTA end","EXTENDED");
						$this->aData['folder']['num'] = WebmailIqFolders::cnvFolders($folders,false,$_SESSION['refreshed']);
						$_SESSION['refreshed'] = false;
						$this->sTemplateFile='webmailiqfolders_get';
							
						log_buffer("CONVERT folders end","EXTENDED");
						unset($_SESSION['sync'][$sAid]);
					break;
					 					case 'test':
						$oUser->testAccount($aProperties);
					break;
					 					case 'signup':
						User::signupAccount($aProperties,$this->sCaptchaUID);
					break;
					 					case 'subscribe':
						 						$oAccount = &$oUser->getAccount($this->sAccountID);
						if($oAccount->gwAccount && $oAccount->gwAccount->bLogged){
							try{
								$oAccount->gwAccount->subscribe($this->aSubscribtionAccount);
							}catch(Exc $e){
								$error = $e;
							}
						}
						
						 						if($oAccount->protocol=='IMAP'){
							$oAccount->subscribe($this->aSubscribtionAccount);
							$oAccount->sync();
						}
					break;
					 					case 'unsubscribe':
						 						$oAccount = $oUser->getAccount($this->sAccountID);
						 						if($oAccount->protocol=='IMAP'){
							$oAccount->unsubscribe($this->aSubscribtionAccount);
						}
						if($oAccount->gwAccount && $oAccount->gwAccount->bLogged){
							try{
							$oAccount->gwAccount->unsubscribe($this->aSubscribtionAccount);
							}catch(Exc $e){
								$error = $e;
							}
						}
					break;
					case 'subscribe_folder':
					case 'unsubscribe_folder':
						 						$oAccount = $oUser->getAccount($this->sAccountID);
						 						if($oAccount->protocol=='IMAP'){
							foreach($this->aSubscribtionAccount as $sFolder){
								$oAccount->unsubscribeFolder($sFolder);
							}
						}
						if($oAccount->gwAccount && $oAccount->gwAccount->bLogged){
							try{
								foreach($this->aSubscribtionAccount as $sFolder){
									$oAccount->gwAccount->unsubscribeFolder($sFolder);
								}
							}catch(Exc $e){
								$error = $e;
							}
						}
						break;
					case 'reset_two_factor':
						$oAccount = $oUser->getAccount($this->sAccountID);
						$oAccount->twoFactorReset($this->sTwoFactorCode);
						break;
					case 'setup_two_factor':
						$oAccount = $oUser->getAccount($this->sAccountID);
						$oAccount->twoFactorSetup($this->iTwoFactorType,$this->sTwoFactorSMS);
						break;
					case 'confirm_two_factor':
						$oAccount = $oUser->getAccount($this->sAccountID);
						$oAccount->twoFactorConfirm($this->sTwoFactorCode,$this->sTwoFactorPassword);
						break;
					case 'manual_two_factor':
						$oAccount = $oUser->getAccount($this->sAccountID);
						$this->aData['totp_secret'] = $oAccount->twoFactorManual($this->sTwoFactorKey);
						break;
				}
			break;
		}
		log_buffer("IQ:Accounts:END","EXTENDED");
	}
	 
	 public function cnvAccounts($accounts,$noshared = false,$license = false)
	 {
		if (!$accounts || !is_array($accounts)){
			return;
		}
		$aData = array();
		$account = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		$gwAPI = &$account->gwAccount->gwAPI;
		$mAccount = new MerakAccount();
		foreach($accounts as $key => $oAccount){
			if ($noshared && $oAccount->shared){
				continue;
			}
			 			$aAcc = array(); 
			$aAcc["id"] = $key;
			$aAcc["gw"] = $oAccount->isGroupWare($logged)?'true':'false';
			if (!$logged){
				$aAcc["gw"] = 'false';
			}
			$aAcc["port"] = $oAccount->port;
			$aAcc["protocol"] = (strtolower($oAccount->protocol)=='local' || strtolower($oAccount->protocol)=='pop3')?'pop3':'imap';
			$aAcc["username"] = $oAccount->username;
			$aAcc["sentfolder"] = $oAccount->sentfolder;
			$aAcc["trashfolder"] = $oAccount->trashfolder;

			if (!$oAccount->primary){
				if($oAccount->acc_type=='rss'){
					$aAcc["acc_type"] = $oAccount->acc_type;
				}else{
					if($_SESSION['DISABLE_OTHERACCOUNTS']){
						continue;
					}
				}
			}else {
				$aAcc["alternative"] = $oAccount->alternative;
				switch ($oAccount->account_type) {
					case 1:
						$aAcc["acc_type"] = 'admin';
						break;
					case 2:
						$aAcc["acc_type"] = 'domainadmin';
						break;
					default:
						$aAcc["acc_type"] = 'user';
						break;
				}
			}
			$aAcc["current_ip"] = $oAccount->current_ip;
			$aAcc["last_time"] = $oAccount->last_time;
			$aAcc["current_time"] = $oAccount->current_time;
			$aAcc["last_ip"] = $oAccount->last_ip;
			$aAcc["server"] = $oAccount->server;
			$aAcc["primary"] = $oAccount->primary?'true':'false';
			if ($oAccount->primary && $_SESSION['PASSWORD_EXPIRED']){
				$aAcc["pass_expired"] = 'true';
			}
			$aAcc["not_primary"] = $oAccount->primary?false:true;
			$aAcc["fullname"] = $oAccount->fullname;
			$aAcc["description"] = $oAccount->description;
			if($_SESSION['DISK_QUOTA'] || $_SESSION['SMS_SUPPORT']){
				$mAccount->Open($oAccount->accountID);
			}
			
			if ($_SESSION['DISK_QUOTA']){
				$aAcc["mbox_quota"] = $_SESSION['DISK_QUOTA'];
				$size = $mAccount->GetProperty("U_MailboxSize");
				$aAcc["mbox_usage"] = $size?$size:'0';
			}

			$aAcc['keepdeleteditemsforceexpiration'] = $_SESSION['gw_keepdeleteditemsforceexpiration'];

			if($_SESSION['SMS_SUPPORT']){
				$_SESSION['SMS_SENT_LAST'] = $mAccount->GetProperty("U_SMS_SentLastMonth");
				$_SESSION['SMS_SENT'] = $mAccount->GetProperty("U_SMS_SentThisMonth");
				$_SESSION['SMS_LIMIT'] = $mAccount->GetProperty("U_SMS_SendLimit");
			}
			
			$aAcc['sms_limit'] = $_SESSION['SMS_LIMIT']?$_SESSION['SMS_LIMIT']:0;
			$aAcc['sms_sent'] = $_SESSION['SMS_SENT']?$_SESSION['SMS_SENT']:0;
			$aAcc['sms_sent_last'] = $_SESSION['SMS_SENT_LAST']?$_SESSION['SMS_SENT_LAST']:0;
			$aAcc['message_size'] = $_SESSION['MESSAGE_SIZE']?$_SESSION['MESSAGE_SIZE']:0;
			
			if ($oAccount->primary){
				if($oAccount->gwAccount->gwAPI->deviceID){
					$aAcc['device_id'] = $oAccount->gwAccount->gwAPI->deviceID;
				}
				 				$aAcc["gwtrash_support"] = $_SESSION['GWTRASH_SUPPORT']?'true':'false';
				$aAcc["meeting_support"] = $_SESSION['MEETING_SUPPORT']?'true':'false';
				$aAcc["meeting_provider"] = $_SESSION['MEETING_PROVIDER'];
				$aAcc["sip_support"] = $_SESSION['SIP_SUPPORT']?'true':'false';
				$aAcc["sip_host"] = $_SESSION['SIP_HOST'];
				$aAcc["sip_port"] = $_SESSION['SIP_PORT'];
				$aAcc["sip_hash"] = $_SESSION['SIP_HASH'];
				$aAcc["sip_dtmf"] = $_SESSION['SIP_DTMF'];
				$aAcc["sip_username"] = $_SESSION['SIP_USERNAME'];
				$aAcc["sip_extension"] = $_SESSION['SIP_EXTENSION'];
				$aAcc["sip_calleralias"] = $_SESSION['SIP_CALLERALIAS'];
				$aAcc["activesync_support"] = $_SESSION['ACTIVESYNC_SUPPORT']?'true':'false';
				$aAcc["resources"] = $_SESSION['RESOURCES_FOLDER']?$_SESSION['RESOURCES_FOLDER']:false;
				$aAcc["im_support"] = $_SESSION['IM_SUPPORT']?'true':'false';
				$aAcc["im_history_support"] = $_SESSION['IM_HISTORY_SUPPORT']?'true':'false';
				$aAcc["sms_support"] = $_SESSION['SMS_SUPPORT']?'true':'false';
				$aAcc["socks_support"] = $_SESSION['SOCKS_SUPPORT']?'true':'false';
				$aAcc["http_port"] = $_SESSION['HTTP_PORT'];
				$aAcc["https_port"] = $_SESSION['HTTPS_PORT'];
				$aAcc["sharing_support"] = $_SESSION['SHARING_SUPPORT']?'true':'false';
				$aAcc["delivery_support"] = $_SESSION['DELIVERY_REPORT_SUPPORT']?'true':'false';
				$aAcc["rules_support"] = $_SESSION['RULES_SUPPORT']?'true':'false';
				$aAcc['old_support'] = $_SESSION['OLD_SUPPORT']?'true':'false';
				$aAcc["upload_limit"] = $_SESSION['UPLOAD_LIMIT'];
				$aAcc["shared_prefix"] = $_SESSION['SHARED_PREFIX'];
				$aAcc['timezone_offset'] = strval($_SESSION['CLIENT_TIMEZONE_OFFSET']);
				$aAcc['fulltext_support'] = $_SESSION['FULLTEXT_SUPPORT']?'true':'false';
				$aAcc['telemetry_support'] = $_SESSION['TELEMETRY_SUPPORT']?'true':'false';
				$aAcc['groupchat_support'] = $_SESSION['GROUPCHAT_SUPPORT']?'true':'false';
				$aAcc['two_factor_support'] = $_SESSION['TWO_FACTOR_SUPPORT'];
				$aAcc['two_factor_enabled'] = $_SESSION['TWO_FACTOR_ENABLED']?'true':'false';
				$aAcc['smtp_header_function'] = $_SESSION['SMTP_HEADER_FUNCTION']?'true':'false';
				if($_SESSION['ARCHIVE_INTEGRATE']){
					$aAcc['archive_prefix'] = $_SESSION['ARCHIVE_INTEGRATE_NAME'];
				}
				If ($_SESSION['MANDATORY_CONTACT_FIELDS']){
					$aAcc['mandatory_contact_fields'] = $_SESSION['MANDATORY_CONTACT_FIELDS'];
				}
				if($_SESSION['GUEST_ACCOUNT']){
					$aAcc['guest_account'] = true;
				}
				if($_SESSION['WEBDAV_URL']){
					$aAcc['webdav_url'] = $_SESSION['WEBDAV_URL'];
				}
				if($_SESSION['WEBADMIN_URL']){
					$aAcc['webadmin_url'] = $_SESSION['WEBADMIN_URL'];
				}
				if($_SESSION['TEAMCHATAPI_URL']){
					$aAcc['teamchatapi_url'] = $_SESSION['TEAMCHATAPI_URL'];
				}
			
				$aAcc['client_url'] = $_SESSION['WEBMAIL_URL'];
				if($logged){
					if(empty($_SESSION['GW_OWNERID'])){
						$sInfo = $oAccount->gwAccount->gwAPI->FunctionCall('GetOwnerInfo',$oAccount->gwAccount->gwAPI->sessid);
						$aInfo = $oAccount->gwAccount->gwAPI->ParseParamLine($sInfo);
						$aAcc['gw_ownerid'] = $aInfo[0]['OWN_ID'];
						$_SESSION['GW_OWNERID'] = $aAcc['gw_ownerid'];
					}else{
						$aAcc['gw_ownerid'] = $_SESSION['GW_OWNERID'];
					}
				}
				$aAcc['xmpp_history_supported'] = $_SESSION['XMPP_HISTORY_SUPPORTED'];
				$aAcc['xmpp_filetransfer_supported'] = $_SESSION['XMPP_FILETRANSFER_SUPPORTED'];
				$aAcc['use_libreoffice'] = $_SESSION['USE_LIBREOFFICE']?'true':'false';
				$aAcc['office_support'] = $_SESSION['OFFICE_SUPPORT']?'true':'false';
				$aAcc['alfresco'] = isset($_SESSION['@@ALFRESCO@@']) ? 'true' : 'false';
				if($_SESSION['ICEWARP_SERVER_ID']){
					$aAcc['icewarp_server_id'] = $_SESSION['ICEWARP_SERVER_ID'];
				}
			}
			
			if (!$aAcc["description"]){
				$aAcc["description"] = $oAccount->fullname;
			}
			if($oAccount->acl){
				foreach($oAccount->acl as $owner=>$right){
					$r['email'] = $owner;
					$r['right'] = Folder::rightsToString($right);
					$aAcc['acl'][] = $r;
				}
			}
			if($license){
				$aAcc['license']=$license;
			}
			 			$aData['accounts']['num'][$key] = $aAcc;
			$aAcc = array();
		};
		return $aData;
	}
}
?>
