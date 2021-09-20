<?php
 
class User
{
	static public $sessionStore;
	static public $closed;
	 
	public $aAccounts;
	 
	public $userID;
	 
	public $username;
	 
	protected $password;
	 
	public $email;
	 	 
	 
	public $attachments;
	
	static public 	$mailFolders = array(
			'D'=>'drafts',
			'S'=>'sent',
			'H'=>'trash',
			'P'=>'templates'
		);
	static public	$mailFlags = array(
				'D'=>0x200,			 				'S'=>0x100,			 				'H'=>0x800,			 				'P'=>0x80000000000
			);
		
	static public	$gwFolders = array(
			'C'=>'contacts',
			'E'=>'events',
			'T'=>'tasks',
			'N'=>'notes',
			'J'=>'journal',
			'F'=>'files'
		);

	public $protocol;

	 
	protected function __construct($userID, $username, $password, $hashid, $mAccount)
	{
		 		$this->aAccounts = array();
		$this->userID	= $userID;
		$this->username  = $username;
		$this->password  = slToolsCrypt::encryptSymmetric($password);
		$this->email  = $mAccount->EmailAddress;
		$this->attachments = array();

		 		$this->getData($mAccount);
		
		 		$filename = User::getDir().UNAVAILABLE_FILE;
		if(file_exists($filename)) {
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_delete($filename);
		}
		 		$this->loadAccounts($_SESSION['MAILBOX'],$password, $mAccount);
		
		 		$primary = $this->getAccount($_SESSION['EMAIL']);
		 		if($primary && $primary->gwAccount){
			$timezone = $primary->gwAccount->gwAPI->FunctionCall(
				"GetVTimeZoneTZID"
			);
			$_SESSION['SERVER_TIMEZONE'] = $timezone;
			if(!$_SESSION['SERVER_TIMEZONE']){
				$_SESSION['SERVER_TIMEZONE'] = get_cfg_var("date.timezone");
			}
		}
		
		$timezone = $_SESSION['CLIENT_TIMEZONE']?$_SESSION['CLIENT_TIMEZONE']:$_SESSION['SERVER_TIMEZONE'];
		
		 		$ownerinfo = $primary->gwAccount->gwAPI->FunctionCall("GetOwnerInfo",$primary->gwAccount->gwAPI->sessid);
		$ownerinfo = $primary->gwAccount->gwAPI->ParseParamLine($ownerinfo);
		@$ownerinfo = reset($ownerinfo);
		$owntzid = $ownerinfo['OWNTZID'];
		$_SESSION['GW_OWNERID'] = $ownerinfo['GW_OWNERID']; 
		
		if($timezone){
			
			if($primary->gwAccount){
				$timezone = $primary->gwAccount->gwAPI->FunctionCall("GetMainTZID",$timezone);

				
				
				if ($owntzid!=$timezone){
					$primary->gwAccount->setGroupTimezone($timezone);
				}
			}
			$time1 = time();
			$time1 = $time1 - $time1%60;
		
			$juliandate = MerakGWAPI::unix2calendarDate($time1);
			$juliantime = MerakGWAPI::unix2calendarTime($time1);
			$iso8601 = MerakGWAPI::calendar2iso8601($juliandate,$juliantime);
			$iso8601 = $primary->gwAccount->gwAPI->FunctionCall("GetTZIDTime",$iso8601,'UTC/GMT',$timezone);
			$juliantime = MerakGWAPI::iso86012calendartime($iso8601);
			$juliandate = MerakGWAPI::iso86012calendardate($iso8601);
			$time2 = MerakGWAPI::calendar2unixTime($juliandate, $juliantime);
			$dt = $time2-$time1;
			$dt = $dt/60;
			$_SESSION['CLIENT_TIMEZONE_OFFSET'] = $dt;
		}	

		
		if(!$_SESSION['LAST_LOGIN_LOAD']){
			$oAccount = $this->getAccount($_SESSION['EMAIL']);
			$aProperties['current_time'] = time();
			if ($oAccount->last_time) {
				$aProperties['last_time'] = $oAccount->last_time;
			}
			if ($oAccount->last_ip) {
				$aProperties['last_ip'] = $oAccount->last_ip;
			}
			 
			if (!$oAccount->last_cleanup || $oAccount->last_cleanup!=1 ) {
				$aProperties['last_cleanup'] = 1;
				$this->cleanUp();
			}
			
			if(!$oAccount->colors_converted || $oAccount->last_cleanup!=1){
				if($this->convertColors($oAccount)){
					$aProperties['colors_converted'] = 1;
				}
			}
			
			$_SESSION['LAST_LOGIN_LOAD'] = true;
		}
		$aProperties['current_ip'] = $_SERVER['REMOTE_ADDR'];
		
		$this->editAccount($_SESSION['EMAIL'],$aProperties);
	}

	 
	public function getPassword(bool $encrypted = false)
	{
		if($encrypted) return $this->password;
		return slToolsCrypt::decryptSymmetric($this->password);
	}

	private function cleanUp(){
		$folder_old = User::getDir();
		icewarp_delete_files($folder_old,'.msg',true,0);
	}
	
	private function convertColors($oAccount)
	{
		if(!$oAccount->gwAccount){
			return false;
		}
		$language = $_SESSION['LANGUAGE'];
		$xmlFile = '../client/languages/'.$language.'/data.xml';
		$xmlData = slToolsXML::loadFile($xmlFile);
		
		$parameters['1'] = $xmlData->color_labels->important;
		$parameters['2'] = $xmlData->color_labels->business;
		$parameters['3'] = $xmlData->color_labels->personal;
		$parameters['4'] = $xmlData->color_labels->vacation;
		$parameters['5'] = $xmlData->color_labels->must_attend;
		$parameters['6'] = $xmlData->color_labels->travel_required;
		$parameters['7'] = $xmlData->color_labels->needs_preparation;
		$parameters['8'] = $xmlData->color_labels->birthday;
		$parameters['9'] = $xmlData->color_labels->anniversary;
		$parameters['A'] = $xmlData->color_labels->phone_call;
		
		$parameters = $oAccount->gwAccount->gwAPI->CreateParamLine($parameters);
		if(!$oAccount->gwAccount->gwAPI->groupsessid){
			$oAccount->gwAccount->gwAPI->OpenGroup();
		}
		return $oAccount->gwAccount->gwAPI->FunctionCall(
			"ConvertEvnColors",
			$oAccount->gwAccount->gwAPI->gid,
			$parameters
		);
	}

	 
	public function getData($merakAccount = null)
	{
		 		 		$api  = createobject('api');
		if(!$merakAccount instanceof MerakAccount){
			$merakAccount = createobject('account');
			$merakAccount->Open($this->email);
		}
		 		self::settingsAPI($api,$merakAccount,$this->email);
		self::settingsGlobal();
		self::settingsUser();
		 		
		switch(strtolower($_SESSION['DBTYPE'])){
			case 'sqlite':
				if (!$_SESSION['DB_CHECKED']) {
					log_buffer("Check DB SQlite","EXTENDED");
					$_SESSION['DB_CHECKED'] = self::checkDBSQlite();
				}	
				if(!$_SESSION['DB_CHECKED_BACKGROUND']){
					
					log_buffer("Check DB SQlite Background","EXTENDED");
					$_SESSION['DB_CHECKED_BACKGROUND'] = self::checkDBSQlite(true);
				}
				break;
			default:
				if (!$_SESSION['DB_CHECKED']) {
					$_SESSION['DB_CHECKED'] = self::checkDB();
					$version = $this->getVersion(true);
					if($version < WEBMAIL_DB_VERSION_BACKGROUND){
						$api->ManageConfig("system/upgradetask","upgradewebclient");
					}
					$_SESSION['DB_CHECKED_BACKGROUND'] = true;
				}
				break;
		}
		
	}
	static public function settingsAPI($api,$user,$email)
	{
		if(!$_SESSION['SETTINGS_API']){
			$domain = new MerakDomain();
			$domain->open($_SESSION['DOMAIN']);
			slSystem::import('tools/string');
			$t = time();
			$m = microtime();
				 			$_SESSION['TEMPPATH']	 = $api->GetProperty("C_System_Storage_Dir_TempPath");
			$_SESSION['MAILPATH']	 = $api->GetProperty("C_System_Storage_Dir_MailPath");
			 			 			$_SESSION['SERVER_ID'] = $api->GetProperty("C_PathServiceID");
			$_SESSION['SERVER_LOGGING_TYPE'] = $api->getProperty("C_Accounts_Policies_Login_LoginSettings");
			$_SESSION['WM_VERSION'] = $api->getProperty('C_Version');
			$_SESSION['CONFIGPATH']	= $api->GetProperty("c_configpath");
			$_SESSION['INSTALLPATH']  = $api->GetProperty("c_installpath");
			$_SESSION['CALNENDARPATH']  = $api->GetProperty("c_calendarpath");
			$_SESSION['SPAMPATH']  = $api->GetProperty("c_spampath");
			 			$_SESSION['ARCHIVE_INTEGRATE'] = $user->getProperty("U_ArchiveSupport");
			$_SESSION['ARCHIVE_INTEGRATE_NAME'] = $api->GetProperty("C_System_Tools_AutoArchive_IMAPArchiveName");
			$_SESSION['SOCKS_SUPPORT'] = $api->GetProperty('C_System_Services_Socks_Enabled');
			$_SESSION['SOCKS_HOST'] = $api->GetProperty('C_IM_SocksServerIP');
			$_SESSION['SOCKS_PORT'] = $api->GetProperty('C_System_Services_Socks_Port');
			$_SESSION['SOCKS_JID'] = $api->GetProperty('C_IM_SocksServerJID');
			$_SESSION['HTTP_PORT'] = $api->GetProperty('C_System_Services_Control_Port');
			$_SESSION['HTTPS_PORT'] = $api->GetProperty('C_System_Services_Control_SSLPort');
			$_SESSION['SMTP_HIDE_IP'] = $api->GetProperty('c_mail_smtp_delivery_hideip');
			$_SESSION['USE_LIBREOFFICE'] = false;
			
			$_SESSION['PERFORMANCE_LOG_THRESHOLD'] = $api->GetProperty('C_System_Log_Performance');
			$_SESSION['QUERY_LOG'] = $api->getProperty('c_system_sqllogtype');
			
			 			$_SESSION['LOGS'] = $api->getProperty("C_WebMail_Logs");
			$_SESSION['WMCONFIGPATH'] = WM_CONFIGPATH;
			$_SESSION['GUEST_ACCOUNT'] = $user->getProperty('u_isguestaccount');
			
			 			$_SESSION['USERDIR'] = $user->GetProperty("u_fullmailboxpath");
			$_SESSION['FULLNAME'] = slToolsString::removeHTML($user->GetProperty("u_name"));
			$_SESSION['ALTERNATIVE'] = $user->GetProperty("u_alternateemail");
			$_SESSION['RESOURCES_FOLDER'] = $api->getProperty("C_GW_Resources");
			$_SESSION['SPAM_FOLDER'] = $user->getProperty("U_SpamFolderSupport");
			$_SESSION['SPAM_FOLDER_NAME'] = $api->getProperty("C_AS_SpamFolderName");
			if(!$_SESSION['SPAM_FOLDER_NAME']){
				$_SESSION['SPAM_FOLDER_NAME'] = 'Spam';
			}
			$_SESSION['GROUPCHAT_SUPPORT'] = $user->getProperty("U_TeamChatSupport");
			$_SESSION['TWO_FACTOR_SUPPORT'] = intval($domain->getProperty("D_2F_ENABLED"));
			if($_SESSION['TWO_FACTOR_SUPPORT'] && $api->getProperty('c_smsservice_active')){
				$_SESSION['TWO_FACTOR_SUPPORT'] += intval($domain->getProperty("D_2F_SMS"));
			}
			$_SESSION['TWO_FACTOR_ENABLED'] = $user->getProperty("U_2F_ENABLED");
			$_SESSION['OFFICE_SUPPORT'] = $user->getProperty("U_WebDocumentsSupport");
			$_SESSION['MEETING_SUPPORT'] = ($_SESSION['GUEST_ACCOUNT'])?false:$user->getProperty("U_MeetingSupport");
			$_SESSION['MEETING_PROVIDER'] = ($_SESSION['GUEST_ACCOUNT'])?false:$user->getProperty("U_MeetingProvider");
			$_SESSION['SIP_SUPPORT'] = ($_SESSION['TCONLY'] || $_SESSION['GUEST_ACCOUNT'])?false:$user->getProperty("U_SIPSupport");
			$_SESSION['ACTIVESYNC_SUPPORT'] = $_SESSION['TCONLY']?false:$user->getProperty("U_ActiveSyncSupport");
			$_SESSION['IM_SUPPORT'] = ($_SESSION['TCONLY'] || $_SESSION['GUEST_ACCOUNT'])?false:$user->getProperty("U_IMSupport");
			$_SESSION['IM_HISTORY_SUPPORT'] = ($_SESSION['TCONLY'] || $_SESSION['GUEST_ACCOUNT'])?false:$api->getProperty("C_IM_UserHistory");
			$_SESSION['SMS_SUPPORT'] = $_SESSION['TCONLY']?false:$user->getProperty("U_SMSSupport");
			$_SESSION['GWTRASH_SUPPORT'] = $_SESSION['TCONLY']?false:$api->GetProperty("C_GW_KeepDeletedItems");
			$_SESSION['SHARING_SUPPORT'] = $user->getProperty("U_SharingAvailable");
			$_SESSION['SHARED_PREFIX']	 = $api->GetProperty("C_GW_SharedAccountPrefix");
			$_SESSION['DELIVERY_REPORT_SUPPORT'] = $_SESSION['TCONLY']?false:$api->getProperty('C_Accounts_Global_Accounts_DeliveryReports');
			$_SESSION['FULLTEXT_SUPPORT'] = filter_var($api->getProperty('C_System_Services_Fulltext_Enabled'), FILTER_VALIDATE_BOOLEAN);
			$_SESSION['TELEMETRY_SUPPORT'] = $api->getProperty('c_system_tools_wcstatistics_enabled');
			$_SESSION['SMTP_HEADER_FUNCTION'] = $api->getProperty('c_mail_smtp_other_headerfunctions');
			$_SESSION['SMTP_SSLMETHOD'] = $api->getProperty('c_system_adv_ext_sslservermethod');
			
			 			if($_SESSION['IM_SUPPORT']){
				$xmpp = $user->getProperty('u_xmpp_data');
				$data = Tools::parseURL($xmpp);
				if($data) foreach($data as $property => $value){
					$_SESSION['XMPP_'.strtoupper($property)] = $value;
				}
				$xmpp_support = $user->getProperty('u_xmpp_support_data');
				$data = Tools::parseURL($xmpp_support);
				if($data) foreach($data as $property => $value){
					$_SESSION['XMPP_'.strtoupper($property)] = $value;
				}
			}

			 			$sip = $user->getProperty('u_sip_data');
			$data = Tools::parseURL($sip);
			$_SESSION['SIP_HOST'] = $data['host'];
			$_SESSION['SIP_PORT'] = $data['port'];
			$_SESSION['SIP_HASH'] = $data['hash'];
			$_SESSION['SIP_USERNAME'] = $data['username'];
			$_SESSION['SIP_EXTENSION'] = $data['extension'];
			$_SESSION['SIP_DTMF'] = $data['dtmf_type'];
			
			$_SESSION['SIP_CALLERALIAS'] = $api->GetProperty('c_system_services_sip_calleralias');
			 			$authMode = $user->getProperty("U_AuthMode");
			if($authMode!=1 && $authMode!=2){
				$_SESSION['PASSWORD_EXPIRED'] = $user->getProperty("U_PasswordExpired");
			}
			 			if($user->GetProperty('U_WebDAVSupport')){
				$_SESSION['WEBDAV_URL'] = $api->GetProperty('C_GW_WebDAVURL');
			}
			 			$_SESSION['WEBMAIL_URL'] = $api->GetProperty('C_Webmail_URL');
			
			 			$_SESSION['WEBADMIN_URL'] = $api->GetProperty('C_Webadmin_URL');

			 			$_SESSION['TEAMCHATAPI_URL'] = (($_SERVER['HTTPS']=='ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ? 'https' : 'http') .'://'.$_SERVER['HTTP_HOST'].'/teamchatapi/';

			 			if ($quota = $user->GetProperty("U_MailboxQuota")) {
				$_SESSION['DISK_QUOTA']  = $quota;
			}
			 			if($_SESSION['SMS_SUPPORT']){
				$_SESSION['SMS_SENT_LAST'] = $user->GetProperty("U_SMS_SentLastMonth");
				$_SESSION['SMS_SENT'] = $user->GetProperty("U_SMS_SentThisMonth");
				$_SESSION['SMS_LIMIT'] = $user->GetProperty("U_SMS_SendLimit");
			}
			
			 			$domainMsgSize = $domain->GetProperty('d_usermsg');
			$_SESSION['MESSAGE_SIZE'] = $user->GetProperty("U_MaxMessageSize");
			if($_SESSION['MESSAGE_SIZE'] == 0){
				$_SESSION['MESSAGE_SIZE'] = $domainMsgSize;
			}
			
			 			if (!$api->GetProperty("C_Accounts_Policies_Login_LoginSettings")) {
				$_SESSION['MAILBOX'] = $user->GetProperty("u_mailbox");
			} else {
				 				$_SESSION['MAILBOX'] = $email;
			}
			
			 
			if($user->GetProperty("u_admin")) {
				$_SESSION['ACCOUNT'] = 1;
			} elseif(allowdadmin && $user->GetProperty("u_domainadmin")) {
				$_SESSION['ACCOUNT'] = 2;
			} else {
				$_SESSION['ACCOUNT'] = 0;
			}
			 			if($user->GetProperty("u_webadmin")){
				$_SESSION['ACCOUNT'] = 1;
			}
			$_SESSION['PRIMARY_DOMAIN'] = $api->getDomain(0);
			 			$_SESSION['REQUEST_UID'] = time();
			 			$_SESSION['TIMEZONE']  = $api->GetProperty("c_timezone");
			$_SESSION['SMARTATTACH_HASH_KEY'] = $api->GetProperty("c_smartattach_key");
			$_SESSION['ICEWARP_SERVER_ID'] = $api->GetProperty("C_Accounts_Policies_ServerId");
			 			 			 			 			if(!$api->getProperty('C_Accounts_Policies_Login_DisableDomainIPLogin'))
			{
				if($ipAddress = $domain->GetProperty('D_IPAddress')){
					$_SESSION['IMAPHOST'] = $ipAddress;
				}
			}
			
			$policy['enable'] = $api->GetProperty('C_Accounts_Policies_Pass_Enable');
			$policy['minlength'] = $api->GetProperty('C_Accounts_Policies_Pass_MinLength');
			$policy['digits'] = $api->GetProperty('C_Accounts_Policies_Pass_Digits');
			$policy['alpha'] = $api->GetProperty('C_Accounts_Policies_Pass_Alpha');
			$policy['upperalpha'] = $api->GetProperty('C_Accounts_Policies_Pass_UpperAlpha');
			$policy['nonalphanum'] = $api->GetProperty('C_Accounts_Policies_Pass_NonAlphaNum');
			$policy['useralias'] = $api->GetProperty('C_Accounts_Policies_Pass_UserAlias');
			$policy['expiration'] = $api->GetProperty('C_Accounts_Policies_Pass_Expiration');
			$policy['expireafter'] = $api->GetProperty('C_Accounts_Policies_Pass_ExpireAfter');
			$policy['notification'] = $api->GetProperty('C_Accounts_Policies_Pass_Notification');
			$policy['notifybefore'] = $api->GetProperty('C_Accounts_Policies_Pass_NotifyBefore');
			$policy['allowadminpass'] = $api->GetProperty('C_Accounts_Policies_Pass_AllowAdminPass');
			$policy['encrypt'] = $api->GetProperty('C_Accounts_Policies_Pass_Encrypt');
						
			$_SESSION['PASSWORD_POLICY'] = $policy;
			$_SESSION['RULES_SUPPORT'] = $user->GetProperty('U_BlackWhiteFilter');
			$_SESSION['SETTINGS_API'] = true;
			$_SESSION['USER_ALIAS_LIST_ARRAY'] = explode(';', $user->GetProperty('u_aliaslist'));
			$_SESSION['USER_ALIAS_ARRAY'] = explode(';', $user->GetProperty('u_alias'));
			$_SESSION['gw_keepdeleteditemsforceexpiration'] = $user->GetProperty('c_gw_keepdeleteditemsforceexpiration');
		}
	}
	

	
	public static function settingsGlobal()
	{
	
		if(!$_SESSION['SETTINGS_GLOBAL']) {
			
			if(!file_exists(GLOBAL_SETTINGS_FILE)) {
				$settingsDirectory = dirname(GLOBAL_SETTINGS_FILE);
				if(!is_dir($settingsDirectory)) {
					slSystem::import('tools/filesystem');
					slToolsFilesystem::mkdir_r($settingsDirectory, 0777, true);
				}
				slSystem::import('tools/icewarp');
				slToolsIcewarp::iw_file_put_contents(
					GLOBAL_SETTINGS_FILE,
					file_get_contents(GLOBAL_SETTINGS_DEFAULT),
					LOCK_EX
				);
			}
			try{
				slSystem::import('tools/dom');
				@$xml = slToolsDOM::open(GLOBAL_SETTINGS_FILE,true);
			}catch(Exc $e){
				$loaderState = libxml_disable_entity_loader(false);
				$loaderState = $loaderState?'true':'false';
				log_buffer("User::settingsGlobal() Corrupted file:[EntityLoader:".$loaderState."]: ".GLOBAL_SETTINGS_FILE,"EXTENEDED");
				throw new Exc('user_settings_global');
			}
			
			$settings = Tools::makeTreeFromXML($xml,false);
			$set = $settings['@childnodes']['global_settings'][0]['@childnodes']['item'][0]['@childnodes'];

			$_SESSION['ALWAYSHTTPS'] = filter_var($set['alwayshttps'][0]['@value'] ?? false, FILTER_VALIDATE_BOOLEAN);

			if(filter_var($set['alfresco_integration'][0]['@value'], FILTER_VALIDATE_BOOLEAN)){
				$_SESSION['@@ALFRESCO@@'] = new AlfrescoAccount($set['alfrescourl'][0]['@value'], $set['alfrescotoken'][0]['@value'], filter_var($set['alfrescosso'][0]['@value'], FILTER_VALIDATE_BOOLEAN));
			}

			 			$_SESSION['DBCONN'] = $set['dbconn'][0]['@value'];
			$_SESSION['DBUSER'] = $set['dbuser'][0]['@value'];
			$_SESSION['DBPASS'] = $set['dbpass'][0]['@value'];
			$_SESSION['DBSYNTAX'] = strtolower($set['dbsyntax'][0]['@value']);
			if(!$_SESSION['DBCONN']) {
				$_SESSION['DBCONN'] = 'sqlite:%WMUSERPATH%cache.db';
			}
			$arr = explode(":",$_SESSION['DBCONN']);
			$_SESSION['DBTYPE'] = strtoupper($arr[0]);
			if($arr[1]) {
				$_SESSION['PURECONN'] = $arr[1];
			}
			
			 			if(!$_SESSION['IMAPHOST']){
				$imaphosts = $set['imapserver'][0]['@value']?$set['imapserver'][0]['@value']:'127.0.0.1';
				if(strpos($imaphosts,';')!==false){
					$imaphosts = explode(';',$imaphosts);
					$i = 0;
					foreach($imaphosts as $imaphost){
						$imaphost = $imaphost?$imaphost:'127.0.0.1';
						if($i==0){
							$_SESSION['IMAPHOST'] = $imaphost;
						}else{
							$_SESSION['SECONDARY']['IMAP'][$i]['HOST'] = $imaphost;
						}
						$i++;
					}
				}else{
					$_SESSION['IMAPHOST'] = $imaphosts;
				}
			}
			$imapports = $set['imapport'][0]['@value']?$set['imapport'][0]['@value']:143;
			if(strpos($imapports,';')!==false){
				$imapports = explode(';',$imapports);
				$i = 0;
				foreach($imapports as $imapport){
					$imapport = $imapport?$imapport:143;
					if($i==0){
						$_SESSION['IMAPPORT'] = $imapport;
					}else{
						$_SESSION['SECONDARY']['IMAP'][$i]['PORT'] = $imapport;
					}
					$i++;
				}
				
			}else{
				$_SESSION['IMAPPORT'] = $imapports;
			}
			
			$smtpservers = $set['smtpserver'][0]['@value']?$set['smtpserver'][0]['@value']:'127.0.0.1';
			if(strpos($smtpservers,';')!==false){
				$smtpservers = explode(';',$smtpservers);
				$i = 0;
				foreach($smtpservers as $smtpserver){
					$smtpserver = $smtpserver?$smtpserver:'127.0.0.1';
					if($i==0){
						$_SESSION['HOST'] = $smtpserver;
					}else{
						$_SESSION['SECONDARY']['SMTP'][$i]['HOST'] = $smtpserver;
					}
					$i++;
				}
			}else{
				$_SESSION['HOST'] = $smtpservers;
			}
			$smtpports = $set['smtpport'][0]['@value']?$set['smtpport'][0]['@value']:25;
			if(strpos($smtpports,';')!==false){
				$smtpports = explode(';',$smtpports);
				$i = 0;
				foreach($smtpports as $smtpport){
					$smtpport = $smtpport?$smtpport:25;
					if($i==0){
						$_SESSION['PORT'] = $smtpport;
					}else{
						$_SESSION['SECONDARY']['SMTP'][$i]['PORT'] = $smtpport;
					}
					$i++;
				}
			
			}else{
				$_SESSION['PORT'] = $smtpports?$smtpports:25;
			}

			
			$xmppservers = $set['xmppserver'][0]['@value']?$set['xmppserver'][0]['@value']:'127.0.0.1';
			if(strpos($xmppservers,';')!==false){
				$xmppservers = explode(';',$xmppservers);
				$i = 0;
				foreach($xmppservers as $xmppserver){
					$xmppserver = $xmppserver?$xmppserver:'127.0.0.1';
					if($i==0){
						$_SESSION['XMPP_HOST_GLOBAL'] = $xmppserver;
					}else{
						$_SESSION['SECONDARY']['XMPP'][$i]['HOST'] = $xmppserver;
					}
					$i++;
				}
			}else{
				$_SESSION['XMPP_HOST_GLOBAL'] = $xmppservers;
			}
			
			$xmppports = $set['xmppport'][0]['@value']?$set['xmppport'][0]['@value']:'';
			if(strpos($xmppports,';')!==false){
				$xmppports = explode(';',$xmppports);
				$i = 0;
				foreach($xmppports as $xmppport){
					$xmppport = $xmppport?$xmppport:'';
					if($i==0){
						$_SESSION['XMPP_PORT_GLOBAL'] = $xmppport;
					}else{
						$_SESSION['SECONDARY']['XMPP'][$i]['PORT'] = $smtpport;
					}
					$i++;
				}
			
			}else{
				$_SESSION['XMPP_PORT_GLOBAL'] = $xmppports?$xmppports:'';
			}
			 			$_SESSION['RESET_SYNC'] = $set['reset_sync'][0]['@value'];
			 			$_SESSION['LOGGING_TYPE'] = $set['logging_type'][0]['@value'];
			 			$_SESSION['EXCEPTION_LOG'] = $set['logs'][0]['@value'];
			$_SESSION['DEBUG'] = $_SESSION['LOGS']>2?1:0;
			 			$_SESSION['FULLTEXT'] = $set['fulltext'][0]['@value']?$set['fulltext'][0]['@value']:0;
			 			if(isset($set['smtp_auth'][0]['@value'])){
				$_SESSION['SMTP_AUTH'] = ($set['smtp_auth'][0]['@value'] && $set['smtp_auth'][0]['@value']!='false')?$set['smtp_auth'][0]['@value']:0;
			}else{
				$_SESSION['SMTP_AUTH'] = 1;
			}
			if(isset($set['smtp_user'][0]['@value'])){
				$_SESSION['SMTP_USER'] = $set['smtp_user'][0]['@value'];
			}
			if(isset($set['smtp_pass'][0]['@value'])){
				$_SESSION['SMTP_PASS'] = $set['smtp_pass'][0]['@value'];
			}
			
			$_SESSION['COLLATE_ENABLE'] = $set['collate'][0]['@value']?$set['collate'][0]['@value']:false;
			 			$_SESSION['MIME_ENCODE_BASE64'] = $set['mime_encode'][0]['@value']=='base64'?true:false;
			 			$smime_cipher = isset($set['smime_cipher'][0]['@value']) ? $set['smime_cipher'][0]['@value'] : 'OPENSSL_CIPHER_AES_256_CBC';  			$_SESSION['SMIME_CIPHER'] = is_string($smime_cipher) ? constant($smime_cipher) : intval($smime_cipher);
			 			$_SESSION['UPLOAD_LIMIT'] = isset($set['upload_limit'][0]['@value'])?$set['upload_limit'][0]['@value']:intval(ini_get("upload_max_filesize"));
			 			$_SESSION['DISABLE_DELAY'] = isset($set['disable_delay'][0]['@value'])?$set['disable_delay'][0]['@value']:false;
			if(strtolower($_SESSION['DISABLE_DELAY'])=='false' || $_SESSION['DISABLE_DELAY']==0){
				$_SESSION['DISABLE_DELAY'] = false;
			}
			 			$_SESSION['PRIMARY_DOMAIN_AUTOFILL'] = isset($set['primary_domain_autofill'][0]['@value'])?$set['primary_domain_autofill'][0]['@value']:true;
			if(strtolower($_SESSION['PRIMARY_DOMAIN_AUTOFILL'])=='false' || $_SESSION['PRIMARY_DOMAIN_AUTOFILL']==0){
				$_SESSION['PRIMARY_DOMAIN_AUTOFILL'] = false;
			}
			
			$_SESSION['MANDATORY_CONTACT_FIELDS'] = isset($set['mandatory_contact_fields'][0]['@value'])?$set['mandatory_contact_fields'][0]['@value']:false;
			 			$_SESSION['OLD_SUPPORT'] = is_dir('../old/');
			
			$_SESSION['SETTINGS_GLOBAL'] = true;
		}
	}
static public function settingsUser()
{
	if (!$_SESSION['SETTINGS_USER']){
	
		 		 		 		 		 		$domaindata = Storage::getDomainDefaults('restrictions');
		$defaultdata = Storage::getDefaults('restrictions');
		$userdata = Storage::getDefaults('restrictions');
		$data = WebmailIqPrivate::get('restrictions',$defaultdata,$domaindata,$userdata,0);
		$restrictions = trim(strtoupper($data['@childnodes']['item'][0]
		['@childnodes']['disable_gw_types'][0]['@value']));

		for($i = 0;$i < strlen($restrictions);$i++) {
			$_SESSION['RESTRICTIONS'][strval($restrictions[$i])] = true;
		}
		 		if($_SESSION['TCONLY']){
			$_SESSION['RESTRICTIONS']['M'] = true;
			$_SESSION['RESTRICTIONS']['C'] = true;
			$_SESSION['RESTRICTIONS']['E'] = true;
			$_SESSION['RESTRICTIONS']['T'] = true;
			$_SESSION['RESTRICTIONS']['N'] = true;
			$_SESSION['RESTRICTIONS']['J'] = true;
			$_SESSION['RESTRICTIONS']['Q'] = true;
			$_SESSION['RESTRICTIONS']['B'] = true;
			$_SESSION['RESTRICTIONS']['W'] = true;
			$_SESSION['RESTRICTIONS']['F'] = true;
			$_SESSION['RESTRICTIONS']['S'] = true;
			$_SESSION['RESTRICTIONS']['P'] = true;
		}
		

		if($data['@childnodes']['item'][0]
		['@childnodes']['disable_virtual'][0]['@value'] == 1){
			$_SESSION['DISABLE_VIRTUAL'] = true;
		}

		$aDisable = $data['@childnodes']['item'][0]['@childnodes'];
		$_SESSION['DISABLE_OTHERACCOUNTS'] = 	($aDisable['disable_otheraccounts'][0]['@value']==1?true:false);
		
		$domaindata = Storage::getDomainDefaults('layout_settings',false);
		$defaultdata = Storage::getDefaults('layout_settings');
		$userdata = Storage::getUserData('layout_settings');
		$layout = WebmailIqPrivate::get('layout_settings',$defaultdata,$domaindata,$userdata,0);
		 		if($_SESSION['LANGUAGE']){
			$sActualLanguage = $_SESSION['LANGUAGE'];
		}else{
			$sActualLanguage = $layout
			['@childnodes']['item'][0]
			['@childnodes']['language'][0]
			['@value'];
			$sActualLanguage = $sActualLanguage?$sActualLanguage:'en';
		}
		
		 		if($layout['@childnodes']['item'][0]['@childnodes']['language'][0]['@attributes']['access'] != 'view'){
			Storage::setActualLanguage($sActualLanguage);
			$cookie = new slToolsCookie();
			$cookie->setcookie('lastLogin', $sActualLanguage . '|pro', mktime(0, 0, 0, 1, 1, 2030), '/');
		}else{
			$sActualLanguage = $layout['@childnodes']['item'][0]['@childnodes']['language'][0]['@value'];
		}

		$referer = $layout
		['@childnodes']['item'][0]
		['@childnodes']['logout_url'][0]['@value'];
		if($referer){
			$_SESSION['LOGOUT_REFERER'] = $referer;
		}
		$aAvailableLanguage = Storage::getAvailableLanguages();
		$aLanguageInfo = $aAvailableLanguage[$sActualLanguage];
		$_SESSION['COLLATION'] = $aLanguageInfo['collation']?$aLanguageInfo['collation']:false;
		$_SESSION['LANGUAGE_WEATHER'] = $aLanguageInfo['weather']?$aLanguageInfo['weather']:'EN';
		$_SESSION['LANGUAGE'] = $sActualLanguage;
		 		 		 		$domaindata = Storage::getDomainDefaults('mail_settings_default',false);
		$defaultdata = Storage::getDefaults('mail_settings_default');
		$userdata = Storage::getUserData('mail_settings_default');
		$data = WebmailIqPrivate::get('mail_settings_default',$defaultdata,$domaindata,$userdata,0);
		$_SESSION['DEFAULTCHARSET'] = $data['@childnodes']['item'][0]
		['@childnodes']['charset'][0]['@value'];
		if(!$_SESSION['DEFAULTCHARSET']) {
			$_SESSION['DEFAULTCHARSET'] = 'UTF-8';
		}
		$domaindata = Storage::getDomainDefaults('calendar_settings',false);
		$defaultdata = Storage::getDefaults('calendar_settings');
		$userdata = Storage::getUserData('calendar_settings');
		$data = WebmailIqPrivate::get('calendar_settings',$defaultdata,$domaindata,$userdata,0);
		
		$timezone = $data['@childnodes']['item'][0]['@childnodes']['timezone'][0]['@value'];
		if($timezone=='' || $timezone=='F' || $timezone=='L'){
			$_SESSION['CLIENT_TIMEZONE'] = false;
		}else{
			$_SESSION['CLIENT_TIMEZONE'] = $timezone;
		}
		 		$tempDir = User::getTempDir();
		if(!is_dir($tempDir)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($tempDir, 0777, true);
		}
		$_SESSION['SETTINGS_USER'] = true;
	}
}
	 	public static function imipDefaults()
	{
		 
	}
	 
	public function loadAccounts($user,$pass,$mAccount)
	{
		slSystem::import('tools/string');
		$primaryProtocol = ($mAccount->getProperty("U_AccountType")==0)?'local':'imap';
		$email = $mAccount->EmailAddress;
		$server = $_SESSION['IMAPHOST'];
		$port = $_SESSION['IMAPPORT'];
		 		$rss = file_exists($_SESSION['USERDIR']. SETTINGS_FOLDER . rssfile) && !Folder::isRestrictedType('R');
		 		$primaryProperties = array(
			'accountID' => $email,
			'gw' => true,
			'rss' => $rss,
			'protocol' => $primaryProtocol,
			'server' => $server,
			'port' => $port,
			'username' => $user,
			'password' => $pass,
			'account_type' => $_SESSION['ACCOUNT'],
			'alternative' => $_SESSION['ALTERNATIVE']
		);
		$this->protocol = $primaryProtocol;
		 		@$xml = slToolsXML::loadFile(User::getDir() . accountsfile);
		if (!$xml) {
			slSystem::import('tools/icewarp');
			@slToolsIcewarp::iw_delete(User::getDir() . accountsfile);
			$primaryProperties['fullname'] = $_SESSION['FULLNAME'];
			 			$this->appendAccount($primaryProperties, true);
			return;
		}
		 		slSystem::import('tools/dom');
		$doc = slToolsDOM::open(User::getDir() . accountsfile);
		$count = 0;
		$otherProperties = array();
		$updateAccounts = [];
		foreach ($doc->query('/accounts/account') as $accountNode) {
			$aID = $accountNode->getAttribute('id');
			 			if($count++==0 && $email!=$aID) {
				$accountNode->setAttribute('id',$email);
				 				$_SESSION['PREVIOUS_EMAIL'] = $aID;
				$aID = $email;
				$doc->save();
			}
			$primary = ($aID == $email)?true:false;
			$gw = ($accountNode->getAttribute('gw')=='true')?true:false;
			if (isset($this->aAccounts[$aID])) {
				continue;
			}
			 			if ($primary) {
				$sFullname = slToolsString::removeHTML($doc->getNodeValue('fullname', $accountNode));
				$primaryProperties['description'] = slToolsString::removeHTML($doc->getNodeValue('description', $accountNode));
				$primaryProperties['fullname'] = $sFullname?$sFullname:$_SESSION['FULLNAME'];
				if (!$_SESSION['LAST_LOGIN_LOAD']) {
					$primaryProperties['last_time'] = $doc->getNodeValue('current_time', $accountNode);
					$primaryProperties['last_ip'] = $doc->getNodeValue('current_ip', $accountNode);
					$primaryProperties['last_cleanup'] = $doc->getNodeValue('last_cleanup', $accountNode);
				}
				if($doc->getNode('last_cacheclean',$accountNode)){
					$primaryProperties['last_cacheclean'] = $doc->getNodeValue('last_cacheclean', $accountNode);
				}
				if($doc->getNode('colors_converted',$accountNode)){
					$primaryProperties['colors_converted'] = $doc->getNodeValue('colors_converted', $accountNode);
				}
				if($doc->getNode('sentfolder',$accountNode)){
					$primaryProperties['sentfolder'] = $doc->getNodeValue('sentfolder', $accountNode);
				}
				if($doc->getNode('trashfolder',$accountNode)){
					$primaryProperties['trashfolder'] = $doc->getNodeValue('trashfolder', $accountNode);
				}
				$primaryProperties['secondary'] = $_SESSION['SECONDARY'];
			}else{
				$pass = false;

				$pass = slToolsCrypt::decryptSymmetric($doc->getNodeValue('password', $accountNode));
				if (empty($pass)){
					$pass = $doc->getNodeValue('password', $accountNode);
					$updateAccounts[$aID] = true;
				}
				$otherProperties[] = array(
					'accountID' => $aID,
					'protocol' => $doc->getNodeValue('protocol', $accountNode),
					'server' => $doc->getNodeValue('server', $accountNode),
					'port' => intval($doc->getNodeValue('port', $accountNode)),
					'description' => slToolsString::removeHTML($doc->getNodeValue('description', $accountNode)),
					'fullname' => slToolsString::removeHTML($doc->getNodeValue('fullname', $accountNode)),
					'username' => $doc->getNodeValue('username', $accountNode),
					'gw'=>$gw,
					'password' => $pass,
					'valid'=>$accountNode->getAttribute('valid')?true:false,
					'sentfolder'=>$doc->getNodeValue('sentfolder', $accountNode),
					'trashfolder'=>$doc->getNodeValue('trashfolder', $accountNode)
				);
			}
		}
		if (!isset($primaryProperties['password'])) {
			$primaryProperties['password'] = $_SESSION['user']->getPassword();
		}
		 
		$this->appendAccount($primaryProperties, true);
		foreach ($otherProperties as $properties) {
			$this->appendAccount($properties, false, true);
			if(isset($updateAccounts[$properties['accountID']], $properties['password'], $this->aAccounts[$properties['accountID']])){
				$this->editAccount($properties['accountID'], ['password' => $properties['password']]);
			}
		}
	}
	
	public static function checkDB($background = false)
	{
		try{
			$lockID = 'webmail_upgrade';
			$lockID_background = 'webmail_upgrade_background';
			$nonsensetranslate = array(
					0=>0,
					1=>2,
					2=>1,
					3=>3
			);
			$query_log = $nonsensetranslate[$_SESSION['QUERY_LOG']];
			switch(strtolower($_SESSION['DBTYPE'])){
				 				case 'mysql':
				case 'odbc':
				case 'oci':
					if(!$background){
						if(!icewarp_getlock($lockID)){
							usleep(WM_LOCK_RETRY);
							if(!icewarp_getlock($lockID)){
								throw new Exc('unavailable');
							}
						}
					}else{
						if(!icewarp_getlock($lockID_background)){
							return true;
						}
					}
					$u = false;
					$db = new Cache($u,array('connection'=>$_SESSION['DBCONN'],'user'=>$_SESSION['DBUSER'],'pass'=>$_SESSION['DBPASS'],'query_log'=>$query_log,'syntax'=>$_SESSION['DBSYNTAX']));
					if($background){
						$db->checkTablesBackground();
					}else{
						$db->checkTables();
					}
					break;
				 				case 'sqlite':
					if(!defined('DB_MIGRATION'))
						return true;
					$lockID.=urlencode($_SESSION['EMAIL']);
					if(!$background){
						if(!icewarp_getlock($lockID)){
							usleep(WM_LOCK_RETRY);
							if(!icewarp_getlock($lockID)){
								throw new Exc('unavailable');
							}
						}
					}else{
						if(!icewarp_getlock($lockID_background)){
							return true;
						}
					}
					$path = User::getDir();
					$current_version = 0;
					$cacheFile = Cache::fixSQLitePath($_SESSION['PURECONN'],$_SESSION['USERNAME'],$_SESSION['DOMAIN'],$path);
					if(defined('DB_MIGRATION') && DB_MIGRATION===true){
						$cacheFile = substr(DB_MIGRATION_SOURCE,7);
					}				
					$u = false;
					$check = new Cache($u,array('connection'=>"sqlite:".$cacheFile,'query_log'=>$query_log));
					if($background){
						$check->checkTablesBackground();
					}else{
						$check->checkTables();
					}
					break;
			}
			icewarp_releaselock($background?$lockID_background:$lockID);
		}catch(Exc $e){
			if(!$background){
				icewarp_releaselock($background?$lockID_background:$lockID);
			}
			throw $e;
		}
		return true;
	}
	
	public function getVersion($background = false)
	{
		$nonsensetranslate = array(
				0=>0,
				1=>2,
				2=>1,
				3=>3
		);
		$query_log = $nonsensetranslate[$_SESSION['QUERY_LOG']];
		switch(strtolower($_SESSION['DBTYPE'])){
			 			case 'mysql':
			case 'odbc':
			case 'oci':
				$u = false;
				$db = new Cache($u,array('connection'=>$_SESSION['DBCONN'],'user'=>$_SESSION['DBUSER'],'pass'=>$_SESSION['DBPASS'],'query_log'=>$query_log,'syntax'=>$_SESSION['DBSYNTAX']));
				break;
			case 'sqlite':
				$path = User::getDir();
				$current_version = 0;
				$cacheFile = Cache::fixSQLitePath($_SESSION['PURECONN'],$_SESSION['USERNAME'],$_SESSION['DOMAIN'],$path);
				if(defined('DB_MIGRATION') && DB_MIGRATION===true){
					$cacheFile = substr(DB_MIGRATION_SOURCE,7);
				}
				$u = false;
				$check = new Cache($u,array('connection'=>"sqlite:".$cacheFile,'query_log'=>$query_log));
				break;
		}
		$version = $db->getVersion($background?'db_version_background':'db_version');
		return $version;
	}
	
	public function checkDBSQlite($background = false)
	{
		try{
			$lockID = 'webmail_upgrade';
			$lockID_background = 'webmail_upgrade_background';
			$nonsensetranslate = array(
					0=>0,
					1=>2,
					2=>1,
					3=>3
			);
			$query_log = $nonsensetranslate[$_SESSION['QUERY_LOG']];
			switch(strtolower($_SESSION['DBTYPE'])){
				 				case 'sqlite':
					$lockID.=urlencode($_SESSION['EMAIL']);
					if(!$background){
						if(!icewarp_getlock($lockID)){
							usleep(WM_LOCK_RETRY);
							if(!icewarp_getlock($lockID)){
								throw new Exc('unavailable');
							}
						}
					}else{
						if(!icewarp_getlock($lockID_background)){
							return true;
						}
					}
					$path = User::getDir();
					$current_version = 0;
					$cacheFile = Cache::fixSQLitePath($_SESSION['PURECONN'],$_SESSION['USERNAME'],$_SESSION['DOMAIN'],$path);
					if(defined('DB_MIGRATION') && DB_MIGRATION===true){
						$cacheFile = substr(DB_MIGRATION_SOURCE,7);
					}
					$u = false;

					
					$check = new Cache($u,array('connection'=>"sqlite:".$cacheFile,'query_log'=>$query_log));
					if($background){
						$check->checkTablesBackground();
					}else{
						$check->checkTables();
					}
				break;
			}
			icewarp_releaselock($background?$lockID_background:$lockID);
		}catch(Exc $e){
			if(!$background){
				icewarp_releaselock($background?$lockID_background:$lockID);
			}
			trigger_error(print_R($e,true));
		}
		return true;
	}
	
	 
	public static function login($username, $password, $hashid = "", $method = "",$bSaveLoginTime = true,$bEmailAddressLogin='',$cookie = false,$sExternalIP = false,$sDisableIPCheck = false,$sLanguage = false,$newSessionPrefix='',$forceSessionID = '',$removeUploadDir = true)
	{
		if($_SESSION['SESSION_COOKIE']){
			$set_cookie = true;
		}
		 		if($forceSessionID){
			session_id($forceSessionID);
		}else if ($newSessionPrefix != '') {
			session_id(str_replace('.','',uniqid($newSessionPrefix,true)));
		}
		@session_start();
		 		$mAccount = new MerakAccount();

		$_SESSION['WMSESS'] = '';

		self::settingsGlobal();
		 		if($bEmailAddressLogin==='') {
			$bEmailAddressLogin = $_SESSION['LOGGING_TYPE']?1:0;
		}
		 		$bMigrationTrigger = 1;
		$bMigrationFailTrigger = 1;
		
		$api = createobject('api');
		 		$iLogBits = pow($bEmailAddressLogin,2) + 2*pow($bMigrationTrigger,2) + 4*pow($bMigrationFailTrigger,2);
		if(strpos($username,'@')!==false && Tools::isabovechar($username)){
			$username = explode('@',$username);
			
			$username[1] = $api->UTF8ToIDN($username[1]);
			$username = join('@',$username);
		}

		 		$auth = $mAccount->AuthenticateUserHash($username, $password, $_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],$iLogBits);
		if(!$auth && $mAccount->FunctionCall("LastErr") == -10){
			throw new Exc('migration_in_progress');
		}
		if (intval($mAccount->GetProperty('U_AccountDisabled'))) {
			throw new Exc('account_disabled','account_disabled');
		}

		if (!$auth){
			self::checkLoginKeyPair();
			if(isset($_COOKIE['permanentLogin'])){
				session_destroy();
			}
			throw new Exc('login_invalid',$username,false,true,'login');
		}
		if (!$mAccount->ValidateUser(4)) {
			throw new Exc('login_account_valid',$mAccount->EmailAddress,false,true,'login');
		}
		if (!$mAccount->validateRemoteIP($_SERVER['REMOTE_ADDR'])) {
			throw new Exc('login_ip_invalid',$_SERVER['REMOTE_ADDR'],false,true,'login');
		}
		 		$_SESSION['EMAIL'] = $mAccount->EmailAddress;
		$_SESSION['TEAMCHAT_TOKEN'] = $mAccount->FunctionCall("GetUserTeamChatToken","","3600");
		$_SESSION['TEAMCHAT_TOKEN_EXPIRATION'] = time()+3600;
		$api->SetProperty('C_System_Logging_Maintenance_Identity',$_SESSION['EMAIL'].'/WebMail');
		
		$_SESSION['DISABLED'] = !$api->GetProperty('C_Webmail_Active');

		 		if($_SESSION['DISABLED']) {
			throw new Exc('wm_disabled','wm_disabled',false,true,'login');
		}
		
		$_SESSION['WMSESS'] = 'user='.$mAccount->EmailAddress.'&ip='.$_SERVER['REMOTE_ADDR'].'&time='.time().'&password='.slToolsCrypt::encryptSymmetric($password);
		$_SESSION['DOMAIN'] = substr($_SESSION['EMAIL'],strrpos($_SESSION['EMAIL'],'@')+1);
		if($_SESSION['DOMAIN']!=$mAccount->Domain){
			$_SESSION['SLAVE_DOMAIN'] = $mAccount->Domain;
		}
		$_SESSION['USERNAME'] = substr($_SESSION['EMAIL'],0,strrpos($_SESSION['EMAIL'],'@'));
		if($sLanguage){
			$_SESSION['LANGUAGE'] = $sLanguage;
		}
		$_SESSION['TCONLY'] = $_REQUEST['tconly'];
		
		$user = new User(0, $username, $password, $hashid, $mAccount);
		$_SESSION['user'] = $user;
		$_SESSION['EXTERNAL_IP'] = $sExternalIP;
		$_SESSION['IP_CHECK'] = !$sDisableIPCheck;
		$_SESSION['jscheck'] = stripos($_REQUEST['lastLogin'],'tablet')===false && stripos($_REQUEST['lastLogin'],'pda')===false;
		$_SESSION['USERDIR'] = $mAccount->getProperty('u_fullmailboxpath');
		 		$data = Storage::getUserData();
		
		log_buffer("User::login() line 872 User::syncDefaultFolders()","EXTENDED");
		$user->syncDefaultFolders($data);
		log_buffer("User::login() line 874 User::syncDefaultFoldersStorage()","EXTENDED");
		$user->syncDefaultFoldersStorage($data);
		$primaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		 		try {
			$primaryAccount->getFolder('INBOX');
		}catch (Exception $e){
			try {
				$primaryAccount->sync();
				$primaryAccount->syncFolders();
				$primaryAccount->getFolder('INBOX');
			}catch (Exc $e){}
		}
		 		if($removeUploadDir){
			$user->removeUploadDir();
		}
		 		@unlink($_SESSION['USERDIR'].'import_status.dat');
		$_SESSION['SID'] = session_id();
		if($cookie){
			if($_COOKIE['auth_cookie']){
				$_SESSION['AUTH_COOKIE'] = $cookie;
			}else{
				throw new Exc('session_cookie_mismatch');
			}
		}
		if($set_cookie && $bSaveLoginTime){
			$cookieObject = new slToolsCookie();
			$cookieObject->setcookie(SESSION_COOKIE_NAME,$_SESSION['SID'],0,'/');
		}

		if($_SESSION['TCONLY'] || $_SESSION['GUEST_ACCOUNT']){
			 			$primaryAccount->getFolders();
			$gwfolders = $primaryAccount->folders['gw'];
			$teamChatFolderExists = false;
			if(is_array($gwfolders)) foreach($gwfolders as $folder){
				if($folder->getType()=='I'){
					$teamChatFolderExists = true;
					break;
				}
			}
			if(!$teamChatFolderExists){
				session_destroy();
				throw new Exc('no_teamchat_folders');
			}
		}
        Storage::checkAliases($primaryAccount);

		$tags = Storage::getAvailableTags($primaryAccount->gwAccount);
		$_SESSION['tags'] = array_combine(array_column($tags,'TAGNAME'), $tags);

		return $_SESSION['SID'];
	}
	
	 
	public function logout($unsetSession = true)
	{
		 		if($this->aAccounts) foreach($this->aAccounts as $account) {
			if ($account->gwAccount) {
				$account->gwAccount->logout();
			}
		}
		if($unsetSession){
			 			$sLogServerID = $_SESSION['SERVER_ID'];
			$sLogs = $_SESSION['LOGS'];
			 			
			$_SESSION = array();
			if (isset($_COOKIE[session_name()])) {
				$cookie = new slToolsCookie();
				$cookie->setcookie(session_name(), '', time()-42000, '/');
			}
			@session_destroy();
			 			$_SESSION['SERVER_ID'] = $sLogServerID;
			$_SESSION['LOGS'] = $sLogs;
			 		}else{
			$_SESSION = array();
		}
	}
	 
	public static function load($sid)
	{
		 
		@session_id($sid);
		@session_start();

		self::checkSession($sid);

		$_SESSION['REQUEST_UID'] = time() + microtime(true);
		$_SESSION['SID'] = $sid;
		 		if(time() > $_SESSION['TEAMCHAT_TOKEN_EXPIRATION'] - 600 ){
			$primaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			$account = createobject('account');
			$account->AuthenticateUserHash($_SESSION['MAILBOX'],$primaryAccount->getPassword(),'','','1');
			$_SESSION['TEAMCHAT_TOKEN'] = $account->FunctionCall("GetUserTeamchatToken",$_SESSION['TEAMCHAT_TOKEN'],"3600");
			$_SESSION['TEAMCHAT_TOKEN_EXPIRATION'] = time() + 3600;
		}
		$api = createobject('API');
		$api->SetProperty('C_System_Logging_Maintenance_Identity',$_SESSION['EMAIL'].'/WebMail');
		$version = $api->getProperty('C_Version');
		if($_SESSION['WM_VERSION']!=$version){
			$_SESSION['DB_CHECKED'] = false;
			$_SESSION['DB_CHECKED_BACKGROUND'] = false;
			$attachments = $_SESSION['user']->attachments;
			log_buffer("Version changed ".$_SESSION['WM_VERSION']." => ".$version." : force relog","EXTENDED");
			self::login(
					$_SESSION['MAILBOX'],
					$_SESSION['user']->getAccount($_SESSION['EMAIL'])->getPassword(),
					"",
					"",
					false,
					$_SESSION['SERVER_LOGGING_TYPE'],
					false,
					$_SESSION['EXTERNAL_IP'],
					!$_SESSION['IP_CHECK'],
					false,
					'',
					'',
					false
			);
			$_SESSION['WM_VERSION'] = $version;
			$_SESSION['user']->attachments = $attachments;
		}
		return $_SESSION['user'];
	}
	
	
	 
	public static function getDir($root = false)
	{
		return $_SESSION['USERDIR'] . ($root ? '' : SETTINGS_FOLDER);
	}
	
	public static function getTempDir()
	{
		$username = $_SESSION['USERNAME'];
		$username = Tools::ReplaceReservedName($username);
		$dir = 'webmail/'.$_SESSION['DOMAIN'].'/'.$username.'/';
		return $_SESSION['TEMPPATH'].$dir;
	}

	 
	static public function getCurrentUser() {
		if (isset($_SESSION['user'])) {
			return $_SESSION['user'];
		}

		throw new Exc('session_no_user', 'session_no_user', false, true, 'login');
	}
	
	static public function checkSession($sid)
	{
		 		if (session_id() !== $sid) {
			throw new Exc('session_expired',session_id(),false,true,'login');
		} else if (!isset($_SESSION['user'])) {
			throw new Exc('session_no_user','session_no_user',false,true,'login');
		}
		$oPrimaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);

		 		if($_SESSION['IP_CHECK'] && $_SERVER['HTTPS']=='OFF'){
			$oPrimaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			 			if($oPrimaryAccount->current_ip != $_SERVER['REMOTE_ADDR']){
				if(!$_SESSION['EXTERNAL_IP'] || $_SESSION['EXTERNAL_IP']!=$_SERVER['REMOTE_ADDR']){
					throw new Exc('session_ip_mismatch','session_ip_mismatch',false,true,'login');
				}
			}
		}
		 		if(isset($_SESSION['AUTH_COOKIE']) && $_SESSION['AUTH_COOKIE']) {
			$checked = false;
			$browserCookie = explode('&',$_COOKIE['auth_cookie']);
			foreach($browserCookie as $accCookie){
				$accCookie = explode('=',$accCookie);
				if( $accCookie[0] == $_SESSION['MAILBOX'] ){
					if($_SESSION['AUTH_COOKIE'] == $accCookie[1]){
						$checked = true;
					}
				}
			}
			if(!$checked){
				throw new Exc('session_cookie_mismatch','session_cookie_mismatch',false,true,'login');
			}
		}
		return true;
	}
	
	 
	static public function getUploadDir($folder)
	{
		$uploadDir = User::getDir() . '~upload';
		if (!is_dir($uploadDir)) {
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($uploadDir, 0777, true);
		}
		$uploadFolder = $uploadDir. '/' . $folder;
		if (!is_dir($uploadFolder)) {
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($uploadFolder, 0777, true);
		}
		return $uploadFolder;
	}
	 
	private function removeUploadDir($folder = '')
	{
		if($folder) {
			$dir = User::getDir() . '~upload/' . md5($folder);
			if(!is_dir($dir)){
				$dir = User::getDir() . '~upload/' . $folder;
			}
		}else{
			$dir = User::getDir() . '~upload/';
		}
		
		
		$api  = createobject('api');
		$api->DeleteDirRecWithUpdate($dir);
	}
	 
	public function getAccounts()
	{
		return $this->aAccounts;
	}
	 
	public function getAccount($accountID)
	{
		if (isset($this->aAccounts[$accountID])) {
			return $this->aAccounts[$accountID];
		}elseif($accountID[0] == '@' && isset($_SESSION[strtoupper($accountID)])){
			return $_SESSION[strtoupper($accountID)];
		} else {
			throw new Exc('account_invalid_id',$accountID,false,true,'login');
		}
	}
	 
	public function createAccount($properties,$sAid = false)
	{
		slSystem::import('tools/string');
		 		if ($sAid == $this->email){
			throw new Exc("account_already_exists",$sAid); 
		}
		if($_SESSION['DISABLE_OTHERACCOUNTS']){
			throw new Exc('other_accounts_disabled');
		}
		 		if (!isset($properties['username'])){
			throw new Exc('account_no_username');
		}
		if (!isset($properties['password'])){
			throw new Exc('account_no_password');
		}
		 		if (!$properties['protocol']){
			$properties['protocol'] = 'imap';
		}
		if (!$properties['server']){
			$properties['server'] = '127.0.0.1';
		}
		if (!$properties['port']){
			$properties['port'] = '143';
		}
		$accountID = $properties["email"];
		 
		$file = User::getDir() . accountsfile;
		slSystem::import('tools/dom');
		$doc = slToolsDOM::open($file);
		if (!is_object($doc)) {
			$doc = new slToolsDOM($file);
			$accountsNode = $doc->appendChild(new DOMElement('accounts'));
		} else {
			$accountsNode = $doc->getNode('/accounts');
		}
		$accountNode = $doc->query('//accounts/account[@id="' . $accountID . '"]');
		$accountNode = $accountNode->item(0);
		if(!is_object($accountNode)){
		
			$properties['accountID'] = $accountID;
			$properties['gw'] = false;
			 
			$accountNode = $accountsNode->appendChild(new DOMElement('account'));
			$accountNode->setAttribute('id', $accountID);
			$accountNode->setAttribute('gw', $properties['gw'] ? 'true' : 'false');
			$accountNode->setAttribute('primary', 'false');
			$accountNode->appendChild(new DOMElement('name', slToolsPHP::htmlspecialchars($properties['name'])));
			$accountNode->appendChild(new DOMElement('description', slToolsPHP::htmlspecialchars(slToolsString::removeHTML($properties['description']))));
			$accountNode->appendChild(new DOMElement('fullname', slToolsPHP::htmlspecialchars(slToolsString::removeHTML($properties['fullname']))));
			$accountNode->appendChild(new DOMElement('protocol', slToolsPHP::htmlspecialchars($properties['protocol'])));
			$accountNode->appendChild(new DOMElement('server', slToolsPHP::htmlspecialchars($properties['server'])));
			$accountNode->appendChild(new DOMElement('port', $properties['port']));
			$accountNode->appendChild(new DOMElement('username', slToolsPHP::htmlspecialchars($properties['username'])));
			$accountNode->appendChild(new DOMElement('password', slToolsCrypt::encryptSymmetric(slToolsPHP::htmlspecialchars($properties['password']))));
			$accountNode->appendChild(new DOMElement('sentfolder', slToolsPHP::htmlspecialchars($properties['sentfolder'])));
			$accountNode->appendChild(new DOMElement('trashfolder', slToolsPHP::htmlspecialchars($properties['trashfolder'])));
			if($properties['valid']){
				$accountNode->setAttribute('valid', 1);
			}
			$doc->save($file);
		
			 
			$account = $this->appendAccount($properties, false);
		
		}
			
		return $account;
	}
	 
	public function deleteAccount($accountID,$check = true)
	{
		if($check){
			$oAccount = $this->getAccount($accountID);
			if(!$oAccount){
				throw new Exc('account_invalid_id',$accountID);
			}
			 			$oAccount->cleanUpCache();
		}
		 
		slSystem::import('tools/dom');
		$doc = slToolsDOM::open(User::getDir() . accountsfile);
		if (!is_object($doc)) {
			return;
		}

		 
		$accountNode = $doc->getNode('/accounts/account[@id="' . $accountID . '"]');
		if($accountNode){
			$accountNode->parentNode->removeChild($accountNode);
		}
		$doc->save();
		 		slSystem::import('tools/filesystem');
		slToolsFilesystem::rmdir(User::getDir()."~".$accountID,false,true);
		 		unset($this->aAccounts[$accountID]);
	}
	 
	public function editAccount($accountID, $properties, &$sid = false, $plainPassword = false, $relog = true)
	{
		slSystem::import('tools/string');
		 		unset($properties['gw']);
		unset($properties['type']);
		unset($properties['primary']);
		unset($properties['expired']);
		unset($properties['name']);
		 
		
		$sAid = $accountID;
		$account = &$this->aAccounts[$sAid];
		 		if (!$account){
			throw new Exc('account_invalid_id',$sAid);
		}
		 		$primary = ($_SESSION['EMAIL'] == $sAid);
		if(!$primary && $_SESSION['DISABLE_OTHERACCOUNTS']){
			throw new Exc('other_accounts_disabled');
		}
		$aProperties = $properties;
				 		 		 		slSystem::import('tools/dom');
		$doc = slToolsDOM::open(User::getDir() . accountsfile);
		if (!is_object($doc)) {
			$doc = new slToolsDOM();
			$accountsNode = $doc->createElement("accounts");
			$accountNode = $doc->createElement("account");
			$accountNode->setAttribute("id",$accountID);
			$accountNode = $accountsNode->appendChild($accountNode);
			$doc->appendChild($accountsNode);
		} else{
			$accountsNode = $doc->query('//accounts');
			$accountsNode = $accountsNode->item(0);
			$accountNode = $doc->query('//accounts/account[@id="' . $accountID . '"]');
			$accountNode = $accountNode->item(0);
			if(!is_object($accountNode)){
				$accountNode = $doc->createElement("account");
				$accountNode->setAttribute("id",$accountID);
				$accountNode = $accountsNode->appendChild($accountNode);
			}
		}
		
		
		
		 		if($accountID  == $_SESSION['EMAIL']) {
			unset($properties['fullname']);
			unset($properties['password']);
			unset($properties['email']);
		}
		
		if($properties['valid']){
			$accountNode->setAttribute('valid',1);
		}else{
			$accountNode->setAttribute('valid',0);
		}
		
		if($properties['description']){
			$properties['description'] = slToolsString::removeHTML($properties['description']);
		}
		if($properties['fullname']){
			$properties['fullname'] = slToolsString::removeHTML($properties['fullname']);
		}
		
		if(isset($properties)) {
			foreach ($properties as $property => $value) {
				if($property=='oldpassword' || $property=='acl'){
					continue;
				}
				$value = slToolsPHP::htmlspecialchars($value);
				if($property == 'password'){
					$value = slToolsCrypt::encryptSymmetric($value);
					$properties['password'] = $value;
				}
				if ($propertyNode = $doc->getNode($property, $accountNode)) {
					@$propertyNode->nodeValue = $value;
				}else{
					$propertyNode = $doc->createElement($property, $value);
					$accountNode->appendChild($propertyNode);
				}
			}
		}
		$doc->save(User::getDir() . accountsfile);
		 		 		 		 		if ($primary){
			 			if (isset($aProperties['username']) 
			|| isset($aProperties['password']) 
			|| isset($aProperties['alternative']) 
			|| isset($aProperties['fullname'])){
				$mUser = new MerakAccount();
				$mUser->open($sAid);
				 				if ($mUser) {
					 					if (isset($aProperties['username'])) {
						$mUser->SetProperty("u_name",$aProperties['username']);
						$mUser->Save();
					}
					 					if (isset($aProperties['password'])) {
						if(!$plainPassword){
							$password = '';
							 							@$privateKey = openssl_pkey_get_private(file_get_contents(WM_CONFIGPATH.'private.key'));	
							openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($aProperties['password']), $password, $privateKey);
							openssl_private_decrypt(WebmailIqAuth::hexStringToBinary($aProperties['oldpassword']), $oldPassword, $privateKey);
							
							$oldInfo = Tools::parseURL($oldPassword);
							if($oldInfo['p']){
								$oldPassword = $oldInfo['p'];
							}else{
								$oldPassword = urldecode($oldPassword);
							}
							$newInfo = Tools::parseURL($password);

							if($newInfo['p']){
								$password = $newInfo['p'];
							}else if(is_array($newInfo) && isset($newInfo['p'])){
								throw new Exc('account_empty_password');
							}else{
								$password = urldecode($password);
							}
							$aProperties['password'] = $password;
						}else{
							$password = $aProperties['password'];
							$oldPassword = $aProperties['oldPassword'];
						}
						 						if($_SESSION['SERVER_LOGGING_TYPE']){
							$aProperties['username'] = $sAid;
						}else{
							$sUsername = $mUser->getProperty("u_mailbox");
							 							$aProperties['username'] = $sUsername;						}
						 						if ($account->getPassword() != $oldPassword){
							if(!$mUser->AuthenticateUserHash($aProperties['username'],$oldPassword,$_SERVER['SERVER_NAME'],'||'.$_SERVER['REMOTE_ADDR'],pow($_SESSION['SERVER_LOGGING_TYPE'],2))){
								throw new Exc('account_old_password');
							}
						}
						 						$mUser->SetProperty("u_password",$password);
						if(!$mUser->Save()){
							if($mUser->LastErr == -6){
								throw new Exc('account_password_policy');
							}else if($mUser->LastErr < 0 ){
								throw new Exc('account_save_'.((-1)*$mUser->LastErr));
							}
						}
						 						if($relog){
							
							$sid = User::login(
								$aProperties['username'],
								$aProperties['password'],
								"",
								"",
								false,
								$_SESSION['SERVER_LOGGING_TYPE'],
								false,
								$_SESSION['EXTERNAL_IP'],
								!$_SESSION['IP_CHECK']
							);
							$cookie = new slToolsCookie();
							$cookie->setcookie("permanentLogin","",0,'/');
						}
					}
					 					if (isset($aProperties['alternative'])) {
						$mUser->SetProperty("u_alternateemail",$aProperties['alternative']);
						$mUser->Save();
					}
					 					if (isset($aProperties['fullname'])) {
						$mUser->SetProperty("u_name",$aProperties['fullname']);
						$mUser->Save();
						$_SESSION['FULLNAME'] = $aProperties['fullname'];
					}
				}
			}
			 			if($mUser){
				$mAccount = &$mUser;
			}else{
				$mAccount = new MerakAccount();
				$mAccount->open($sAid);
			}

			 			if ($mAccount->GetProperty('U_QuarantineSupport') == 1 && !Folder::isRestrictedType('Q')){
				$_SESSION['QUARANTINE_SUPPORT'] = true;
				$account->folders['quarantine'][Q_FOLDER_NAME] = QuarantineFolder::create($account,Q_FOLDER_NAME);
			}else{
				$_SESSION['QUARANTINE_SUPPORT'] = false;
			}
			 			if($mAccount->GetProperty('U_QuarantineSupport')){
				$_SESSION['WLIST_ENABLE'] = true;
				$_SESSION['BLIST_ENABLE'] = true;
			}else{
				if($mAccount->GetProperty('U_ASSupport')){
					$api = createobject('api');
					$_SESSION['WLIST_ENABLE'] = $api->GetProperty('C_AS_SpamWList');
					$_SESSION['BLIST_ENABLE'] = $api->GetProperty('C_AS_SpamBList');
				}else{
					$_SESSION['BLIST_ENABLE'] = false;
					$_SESSION['WLIST_ENABLE'] = false;
				}
			}
			if(Folder::isRestrictedType('B')){
				$_SESSION['BLIST_ENABLE'] = false;
			}
			if(Folder::isRestrictedType('W')){
				$_SESSION['WLIST_ENABLE'] = false;
			}
			if($_SESSION['WLIST_ENABLE']){
				$account->folders['quarantine'][W_FOLDER_NAME] = QuarantineFolder::create($account,W_FOLDER_NAME);
			}
			if($_SESSION['BLIST_ENABLE']){
				$account->folders['quarantine'][B_FOLDER_NAME] = QuarantineFolder::create($account,B_FOLDER_NAME);
			}
			
			
		 		}else{
			 			$aProp['username'] = $aProperties['username']?$aProperties['username']:$account->username;
			$aProp['sentfolder'] = $aProperties['sentfolder']?$aProperties['sentfolder']:$account->sentfolder;
			$aProp['trashfolder'] = $aProperties['trashfolder']?$aProperties['trashfolder']:$account->trashfolder;
			$aProp['password'] = $aProperties['password'] ? $aProperties['password'] : $account->getPassword();
			$aProp['description'] = isset($aProperties['description'])?$aProperties['description']:$account->description;
			$aProp['fullname'] = $aProperties['fullname']?$aProperties['fullname']:$account->fullname;
			$aProp['protocol'] = $aProperties['protocol']?$aProperties['protocol']:$account->protocol;
			$aProp['server'] = $aProperties['server']?$aProperties['server']:$account->server;
			$aProp['port'] = $aProperties['port']?$aProperties['port']:$account->port;
			$aProp['accountID'] = $account->accountID;
			$aProp['email'] = $account->accountID;
			
		 		 			if(($aProperties['protocol'] 
				&& $aProperties['protocol']!=$account->protocol)
		 		|| ($aProperties['server'] 
				&& $aProperties['server'] != $account->server )
		 		|| ($aProperties['port']
				&& $aProperties['port'] != $account->port )){
				 				 				$account->cleanUpCache();
				 				$this->deleteAccount($account->accountID);
				$account = $this->createAccount($aProp, false);
			}
		}
		 		$account->edit($properties);
		$this->aAccounts[$accountID] = $account;
		 		if($properties['acl']){
			if($account->gwAccount){
				$account->gwAccount->setAcl($properties['acl']);
			}else{
				$account->setAcl($properties['acl']);
			}
		}
	}
	
	 
	public function appendAccount($properties, $primary, $test = false)
	{
		$account = false;
		switch (strtolower($properties['protocol'])) {
			case  'local':
				try{
					$account = new LocalPOPAccount($this,$properties['accountID'],$primary,$properties);
				}catch(Exc $e){
					log_buffer("Unexpected account exception : ".print_r($e,true),"EXTENDED");
					$remove = true;
				}
				break;
			case 'pop3':
				try{
					$account = new POP3Account($this, $properties['accountID'],
					$properties['server'], $properties['port'],
					$properties['username'], $properties['password'], $primary,$properties);
				}catch(Exc $e){
					log_buffer("Unexpected account exception : ".print_r($e,true),"EXTENDED");
					$remove = true;
				}
				break;
			case 'imap':
				try{
					$account = new IMAPAccount($this, $properties['accountID'],
					$properties['server'], $properties['port'],
					$properties['username'], $properties['password'], $primary,$properties);
				}catch(Exc $e){
					log_buffer("Unexpected account exception : ".print_r($e,true),"EXTENDED");
					$remove = true;
				}
				break;
			default:
				throw new Exc('account_unknown_protocol',$properties['protocol'],false,true,'login');
				break;
		}
		if($remove && !$primary){
			$this->deleteAccount($properties['accountID'],false);
			return false;
		}
		if($test && !$properties['valid']){
			try{
				if(!$account->test()){
					return false;
				}else{
					$saveValidity = true;
				}
			}catch (Exc $e){
				return false;
			}
		}
		$account->charset = $_SESSION['DEFAULTCHARSET'];
		if ($properties['gw']==true) {
			 
			$gwAccount = new GroupWareAccount($properties['accountID'], $properties['password'], $account);
			$account->appendGroupWareAccount($gwAccount);
		}
		$account->description = $properties['description'];
		$account->fullname = $properties['fullname'];
		$account->sentfolder = $properties['sentfolder'];
		$account->trashfolder = $properties['trashfolder'];
		if ($primary) {
			
			$account->isGuest = $_SESSION['GUEST_ACCOUNT'];
			$account->colors_converted = $properties['colors_converted'];
			 			if ($properties['rss']==true) {
				if($account->protocol=='IMAP'){
					$rssAccount = new RSSAccount($this,$properties['accountID'].'_rss');
					$rssAccount->description = 'RSS';
					$rssAccount->convertToIMAP($account);
				}
			}
			$account->alternative = $properties['alternative'];
			$account->account_type = $properties['account_type'];
			 			$mAccount = new MerakAccount();
			$mAccount->Open($this->email);
			if ($mAccount->GetProperty('U_QuarantineSupport') == 1 && !Folder::isRestrictedType('Q')) {
				$account->folders['quarantine'][Q_FOLDER_NAME] = QuarantineFolder::create($account,Q_FOLDER_NAME);
			}
			if($mAccount->GetProperty('U_QuarantineSupport')){
				$_SESSION['QUARANTINE_SUPPORT'] = true;
				$_SESSION['WLIST_ENABLE'] = true;
				$_SESSION['BLIST_ENABLE'] = true;
			}else{
				$_SESSION['QUARANTINE_SUPPORT'] = false;
				if($mAccount->GetProperty('U_ASSupport')){
					$api = createobject('api');
					$_SESSION['WLIST_ENABLE'] = $api->GetProperty('C_AS_SpamWList');
					$_SESSION['BLIST_ENABLE'] = $api->GetProperty('C_AS_SpamBList');
				}else{
					$_SESSION['BLIST_ENABLE'] = false;
					$_SESSION['WLIST_ENABLE'] = false;
				}
			}
			
			if(Folder::isRestrictedType('B')){
				$_SESSION['BLIST_ENABLE'] = false;
			}
			if(Folder::isRestrictedType('W')){
				$_SESSION['WLIST_ENABLE'] = false;
			}
			if($_SESSION['WLIST_ENABLE']){
				$account->folders['quarantine'][W_FOLDER_NAME] = QuarantineFolder::create($account,W_FOLDER_NAME);
			}
			if($_SESSION['BLIST_ENABLE']){
				$account->folders['quarantine'][B_FOLDER_NAME] = QuarantineFolder::create($account,B_FOLDER_NAME);
			}
			 			$virtualAccount = new VirtualAccount($this,$properties['accountID'],$account);
			$account->folders['virtual'] = $virtualAccount->getFolders();
			$account->virtualAccount = &$virtualAccount;
			$account->secondary = $properties['secondary'];
		}
		$this->aAccounts[$properties['accountID']] = $account;
		
		if($saveValidity){
			 			$this->editAccount($properties['accountID'],array('valid'=>1));
		}
		return $account;
	}
	
	static public function checkSignupIP($ip)
	{
		$result = true;
		$api = IceWarpAPI::instance(defined('APP_IDENTITY')?APP_IDENTITY:'User::checkSignupIP');
		$xml = slToolsXML::loadFile($api->GetProperty('C_ConfigPath').'_webmail/server.xml');
		if($xml){
		  $signup_ips = $xml->item->signup_ips;
		  if($signup_ips){
		  	$result = false;
		  	$signup_ips = explode(';',$signup_ips);
		  	foreach($signup_ips as $allowed_ip_mask){
		  		if (slToolsString::cidrMatch($ip,$allowed_ip_mask))
		  		  return true;
		  	}
		  }	
		}
		return $result;	
	}
	
	static public function signupAccount($aProperties,$sCaptchaUID,$check = true)
	{
		$result = true;
		 		$sDomain = substr($aProperties['email'],strrpos($aProperties['email'],'@')+1);
		$domaindata = Storage::getDomainDefaults('restrictions',$sDomain);
		$defaultdata = Storage::getDefaults('restrictions');
		$data = WebmailIqPrivate::get('restrictions',$defaultdata,$domaindata,false,0);
		if(!isset($data['@childnodes']['item'][0]['@childnodes']['disable_signup'][0]['@value'])
				|| $data['@childnodes']['item'][0]['@childnodes']['disable_signup'][0]['@value']==1){
			throw new Exc('account_signup_disabled');
		}
		 		if($check){
			slSystem::import('tools/captcha');
			$oCaptcha = new slToolsCaptcha();
			$oCaptcha->check($sCaptchaUID,$aProperties['captcha']);
		}
		
		 		if(!User::checkSignupIP($_SERVER['REMOTE_ADDR'])){
			throw new Exc('account_signup_disabled_ip');
		}
		
		 		$oAccount = new MerakAccount();
		$oAccount->New_($aProperties['email']);
		$oAccount->SetProperty("u_type", 0);
		$oAccount->ApplyTemplate();
		
		$aNewAccount['u_alias'] = $aProperties['username'];
		$aNewAccount['u_password'] = $aProperties['password'];
		$aNewAccount['u_name'] = $aProperties['fullname']?$aProperties['fullname']:'';
		$aNewAccount['U_AlternateEmail'] = $aProperties['alternative'];
		
		foreach($aNewAccount as $property => $value){
			$result = $result && $oAccount->setProperty($property,$value);
		}
		
		$result = $result && $oAccount->Save();
		if(!$result){
			throw new Exc('account_signup_error',(-$oAccount->LastErr));
		}
		@session_destroy();
	}
	
	public function testAccount($aProperties)
	{
		$aProperties['accountID'] = strtolower($aProperties['email']);
		 		if(!isset($aProperties['password'])){
			try{
				$oAccount = $this->getAccount($aProperties['accountID']);
				$aProperties['password'] = $oAccount->getPassword();
			}catch(Exc $e){
				throw new Exc('account_missing_tag','password');
			}
		}
		
		if($this->aAccounts[$aProperties['accountID']]){
			$aProperties['accountID'] .='_TEST'; 
		}
		$this->appendAccount($aProperties, false);
		$oTestAccount = $this->getAccount($aProperties['accountID']);
		
		try{
			if(!$oTestAccount->test()){
				throw new Exc();
			}
		}catch(Exc $e){
			unset($this->aAccounts[$aProperties['accountID']]);
			throw new Exc('account_test_failed', $aProperties['email']);
		}
		unset($this->aAccounts[$aProperties['accountID']]);
	}
	
	 
	public function getAttachments($folder = false,$file = false)
	{
		if ($folder) {
			if (!isset($this->attachments[$folder])) {
				return array();
			}
			if($file){
				if(!isset($this->attachments[$folder][$file])){
					return array();
				}else{
					return $this->attachments[$folder][$file];
				}
			}
			return $this->attachments[$folder];
		} else {
			return $this->attachments;
		}
	}
	 
	public function addAttachment($uploadFileID, $folder, $itemID,$cid = false)
	{
		$md5folder = md5($folder);
		 
		$dir = $this->getUploadDir($md5folder);
		 
		$fName = $_FILES[$uploadFileID]['name'];
		$file =  Tools::randomFileName($dir.'/');
		 		log_buffer("Upload session [".($_SESSION['SID']?$_SESSION['SID']:'Unauthorized')."] PARAMETERS [ItemID:".$itemID.",FolderID:".$folderID.",Filepath:".$file."]","DEBUG");
		
		if (!move_uploaded_file($_FILES[$uploadFileID]['tmp_name'], $file)) {
			return false;
		}
		$api = createobject('api');
		$api->CacheFileWithUpdate($file);
		if ($cid) {
			$this->attachments[$folder][$itemID] = array(
				'file' => $file,
				'name' => $fName,
				'type' => $_FILES[$uploadFileID]['type'],
				'cid'  => $cid
			);
		} else {
			$this->attachments[$folder][$itemID] = array(
				'file' => $file,
				'name' => $fName,
				'type' => $_FILES[$uploadFileID]['type']
			);
		}
		return true;
	}
	 	public function addStringAttachment($attString,$attName,$attType,$folder,$itemID,$sMethod = '')
	{
		$md5folder = md5($folder);
		$attDir = $this->getUploadDir($md5folder);
		$attFile = Tools::randomFileName($attDir.'/');
		slSystem::import('tools/icewarp');
		slToolsIcewarp::iw_file_put_contents($attFile,$attString);
		$this->attachments[$folder][$itemID] = array(
			'file' => $attFile,
			'name'=> $attName,
			'type'=> $attType,
			'delete'=>false,
			'method'=>$sMethod
		);
		return true;
	}
	
	public function addFileAttachment($attFile,$attName,$attType,$folder,$itemID,$delete = false)
	{
		$this->attachments[$folder][$itemID] = array(
			'file' => $attFile,
			'name'=> $attName,
			'type'=> $attType,
			'delete'=>$delete
		);
	}
	
	public function countAttachments($folder)
	{
		return is_countable($this->attachments[$folder]) ? count($this->attachments[$folder]) : 0;
	}
	 
	public function removeAttachments($folder)
	{
		if (!isset($this->attachments[$folder])) {
			return;
		}
		$this->removeUploadDir($folder);
		unset($this->attachments[$folder]);
	}
	
	static public function closeSession($refStore = false)
	{
		self::$closed = true;
		if($refStore){
			self::$sessionStore = &$_SESSION;
		}
		session_write_close();
	}
	
	static public function restoreSession($refRestore = false)
	{
		self::$closed = false;
		@session_start();
		if($refRestore){
			$_SESSION = self::$sessionStore;
		}
	}
	static public function isClosedSession()
	{
		return self::$closed?true:false;
	}
	
	static public function setDefaultFolder($folder,$type)
	{
		if(!isset($_SESSION['DEFAULT_FOLDERS'][$type]) || $_SESSION['DEFAULT_FOLDERS'][$type]!=$folder){
			log_buffer("User::setDefaultFolder(". $folder.",".$type."); line 1768","EXTENDED");
		}
		$_SESSION['DEFAULT_FOLDERS'][$type] = $folder;
	}
	static public function getDefaultFolder($type)
	{
		return $_SESSION['DEFAULT_FOLDERS'][$type];
	}
	static public function getDefaultFolderList()
	{
		return $_SESSION['DEFAULT_FOLDERS'] ?? [];
	}
	
	static public function isDefaultFolder($folder)
	{
		return array_flip(self::getDefaultFolderList())[$folder];
	}

	static private function loadDefaultFoldersFromSettings($data = false)
	{
		if(!$data){
			$data = Storage::getUserData();
		}
		 		$folders = $data['@childnodes']['default_folders'][0]['@childnodes']['item'][0]['@childnodes'];
		 		$email = $_SESSION['PREVIOUS_EMAIL']?$_SESSION['PREVIOUS_EMAIL']:$_SESSION['EMAIL'];
		$names = array_merge(self::$mailFolders,self::$gwFolders);
		$types = array_flip($names);
		if(is_array($folders)) foreach($folders as $key => $folder){
			$name = str_replace($email.'/','',$folder[0]['@value']);
			self::setDefaultFolder($name,$types[strtolower($key)]);
		}
		if(isset($folders['ab']) && $folders['ab']){
			$_SESSION['CUSTOM_ADDRESS_BOOK'] = str_replace($email.'/','', $folders['ab'][0]['@value']);
		}
	}
	static private function setDefaultFoldersDefaults()
	{
		$list = self::getDefaultFolderList();
		$_SESSION['EXCEPTION_LOG'] = false;
		$names = array_merge(self::$mailFolders,self::$gwFolders);
		$types = array_flip($names);
		foreach($types as $name =>$type){
			if(!isset($list[$type])){
				if(isset(self::$gwFolders[$type])){
					$folder =  Storage::getDefaultGWFolder($name);
				}else{
					$folder = Storage::getDefaultMailFolder($name);
				}
				self::setDefaultFolder($folder,$type);
			}
		}
		$_SESSION['EXCEPTION_LOG'] = false;
	}
	
	static public function syncDefaultFolders($data = false)
	{
		 		self::loadDefaultFoldersFromSettings($data);
		 		self::setDefaultFoldersDefaults();
	}

	protected function getFolderNameWithoutAccount($folderName)
	{
		if(!preg_match('#^([^@\\/]+@[^@\\/]+)?[\\/]*(?P<folder>.*)#', $folderName, $matches)) return false;
		return $matches['folder'];
	}
	
	public function syncDefaultFoldersStorage($data = false)
	{
		$oAccount = $this->getAccount($_SESSION['EMAIL']);
		$list = self::getDefaultFolderList();
		if(!$data){
			$data = Storage::getUserData();
		}
		$default_folders = &$data['@childnodes']['default_folders'][0]['@childnodes']['item'][0]['@childnodes'];
		$changed = false;
		$folders = array_merge(self::$gwFolders,self::$mailFolders);
		log_buffer("User::syncDefaultFoldersStorage() start","EXTENDED");
		foreach($folders as $fdrType => $fdrTag){
			 			if(($settingFolder = $this->getFolderNameWithoutAccount($default_folders[$fdrTag][0]['@value'] ?? null)) === false) continue;

			if(isset($list[$fdrType])){
				 				if($settingFolder && $default_folders[$fdrTag][0]['@value'] != $_SESSION['EMAIL'].'/'.$settingFolder){
					$default_folders[$fdrTag][0]['@value'] = $_SESSION['EMAIL'].'/'.$settingFolder;
					$changed = true;
				}

				if($list[$fdrType] != $settingFolder){
					try{
						$type = '';
						$oFolder = $oAccount->getFolder($list[$fdrType],$type);
						 						$folderName = $this->getFolderNameWithoutAccount($list[$fdrType]);
						if($folderName !== false){
							log_buffer("User::syncDefaultFoldersStorage() Default folder changed from :".$settingFolder." to ".$folderName,"EXTENDED");
							$default_folders[$fdrTag][0]['@value'] = $_SESSION['EMAIL'].'/' . $folderName;
							$changed = true;
						}
					}catch(Exc $e){
						 						if(isset(self::$gwFolders[$fdrType])){
							$default_name =  Storage::getDefaultGWFolder($fdrTag);
						}else{
							$default_name = Storage::getDefaultMailFolder($fdrTag);
						}
						if($list[$fdrType]!=$default_name){
							unset($default_folders[$fdrTag]);
							log_buffer("User::syncDefaultFoldersStorage() Default folder does not exist any more($default_name): ".$list[$fdrType],"EXTENDED");
							$changed = true;
						}
					}
				}
			}else if ($settingFolder!=''){
				try{
					$type = '';
					$oFolder = $oAccount->getFolder($settingFolder,$type);
					
					if(isset($oAccount->folders[$type][$list[$fdrType]])){
						log_buffer("User::syncDefaultFoldersStorage() New default folder :".$settingFolder,"EXTENDED");
						$oAccount->folders[$type][$settingFolder]->isDefault = true;
						$oAccount->folders[$type][$settingFolder]->defaultType = $fdrType;
					}
				}catch(Exc $e){}
			}
		}
		 		$_SESSION['PREVIOUS_EMAIL'] = '';
		 		if($changed){
			$str = Tools::makeXMLStringFromTree($data,'settings',true);
			log_buffer("User::syncDefaultFoldersStorage() CHANGES :".$str,"EXTENDED");
			Storage::setUserDataStr($str,'settings');
		}else{
			log_buffer("User::syncDefaultFoldersStorage() NO CHANGES","EXTENDED");
		}
		log_buffer("User::syncDefaultFoldersStorage() end","EXTENDED");
	}
	
	
	public function onStorageUpdate(&$return,&$aActions)
	{
		$oAccount = $this->getAccount($_SESSION['EMAIL']);
		$folders = array_merge(self::$gwFolders,self::$mailFolders);
		 		$actualFolders = self::getDefaultFolderList();
		$newFolders = $aActions[0]['data'];
		foreach($folders as $fdrType=>$fdrTag){
			$newFolder = str_replace(
				$_SESSION['EMAIL'].'/',
				'',
				$newFolders[$fdrTag]
			);
			if($newFolder!=$actualFolders[$fdrType]){
				try{
					$oFolder = $oAccount->getFolder($newFolder);
					$oFolder->setDefault($fdrType,false);
					self::setDefaultFolder($newFolder,$fdrType);
				}catch(Exc $e){
					$default_folders = &$return['@childnodes']['default_folders'][0]['@childnodes']['item'][0]['@childnodes'];
					$oldValue = $default_folders[$fdrTag][0]['@value'];
					$aActions[0]['data'][$fdrTag] = $oldValue;
					$aActions[0]['dataTree']['@childnodes'][$fdrTag][0]['@value'] = $oldValue;
				}
			}
		}
	}
	
	static public function checkLoginKeyPair()
	{
		$publicfile = WM_CONFIGPATH.'public.key';
		$privatefile = WM_CONFIGPATH.'private.key';
		$public = file_get_contents($publicfile);
		$private = file_get_contents($privatefile);
		$pkey = openssl_pkey_get_private($private);
		$details = openssl_pkey_get_details($pkey);
		$modulus = WebmailIqAuth::binaryToHexString(strrev($details['rsa']['n']));
		if($modulus!=$public){
			log_buffer("Invalid key-pair","EXTENDED");
			@unlink($publicfile);
			@unlink($privatefile);
			throw new Exc('login_invalid_keypair');
		}
	}
}
?>
