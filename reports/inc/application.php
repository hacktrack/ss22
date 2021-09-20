<?php

 

define('CHALLENGE_DB_VERSION', '4');
define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
define('APP_IDENTITY','Spam reports');
define('ARRAY_MERGE_KEY_SAFE',true);
require_once(SHAREDLIB_PATH.'system.php');

 slSystem::import('error/exception');
slSystem::import('api/api');
slSystem::import('api/domain');
slSystem::import('api/account');
slSystem::import('tools/crypt');
slSystem::import('tools/date');
slSystem::import('tools/filesystem');
slSystem::import('tools/php');
slSystem::import('mail/mail');

 require_once ('quarantine.php');
require_once ('spam.php');
require_once ('report.php');
require_once ('user.php');

 
class ChallengeApplication
{
	static protected $instance;

	public $version;
	public $os;
	 	public $dbConnection;
	private $dbUser;
	private $dbPass;
	private $dbType;
	
	 	private $mode;	
	 	private $reportType;
	 	private $logging;
	 	private $path;
	 	private $settings;
	 	public $language;
	
	 	private $report;
	private $quarantine;
	private $spam;
	private $admin;
	private $spamAdmin;
	private $quarantineAdmin;
		
	private $reportSent;
	 	private $qCount;
	private $sCount;
	 	private $adminAccounts;
	 	private $activeAccounts;
	 	public $reportSender;
	public $reportFrom;
	public $smtp;



	 
	protected function __construct()
	{
		$api = IcewarpAPI::instance();
		$enabled = $api->GetProperty('C_AS_SpamReportsEnabled');
		$this->version = $api->GetProperty('C_Version');
		$this->os = $api->GetProperty('C_OS');
		 		$skin = $api->getProperty('c_as_spamskin');
		$this->setSkin( $skin );
		 		$this->setPath('spam', $api->GetProperty('C_SpamPath'));
		$this->setPath('config', $api->GetProperty('C_ConfigPath'));
		$this->setPath('install', $api->GetProperty('C_InstallPath'));
		$this->setPath('mail', $api->GetProperty('C_System_Storage_Dir_MailPath'));
		$this->setPath('temp', $api->GetProperty('c_system_storage_dir_temppath').'reports/');
		$this->setPath('reports', $this->path['spam'] . 'reports/');
		if (!is_dir($this->getPath('reports'))) {
			slToolsFilesystem::mkdir_r($this->getPath('reports'));
		}
		if (!is_dir($this->getPath('temp'))) {
			slToolsFilesystem::mkdir_r($this->getPath('temp'));
		}
		 		$settingsFile = $this->getPath('spam') . 'spam.dat';
		$this->settings = $this->parseSettingsFile($settingsFile);
		 		if (!isset($_REQUEST['lang']) || !$_REQUEST['lang']) {
			$language = $this->getSettings('C_AS_SpamLang');
		} else {
			$language = $_REQUEST['lang'];
		}
		if (!$language) {
			$language = "en";
		}
		$this->ltr = ($language == 'ar' || $language == 'fa' || $language == 'he');

		$languageFile = "lang/" . slToolsFilesystem::securePath($language) . "/lang.xml";
		$this->language = $this->parseLanguageFile($languageFile);
		$this->parseSMTPSettings();
		$bypassFile = $this->getPath('reports').'bypass.dat';
		if(file_exists($bypassFile)){
			$this->bypass = file($bypassFile);
			foreach($this->bypass as $key => $val){
				$this->bypass[$key] = trim($val);
			}
		}
		if(!$enabled){
			$this->error('reports_are_disabled');
		}
		$this->dbConnection = $api->GetProperty('c_as_spamreportsdbconn');
		$this->dbUser = $api->GetProperty('c_as_spamreportsdbuser');
		$this->dbPass = $api->GetProperty('c_as_spamreportsdbpass');
		$this->dbLogging = $api->GetProperty('c_system_sqllogtype');
		$nonsensetranslate = array(
				0=>0,
				1=>2,
				2=>1,
				3=>3
		);
		$this->dbLogging = $nonsensetranslate[$this->dbLogging];
		 		if(!$this->dbConnection){
			$this->dbConnection = 'sqlite:%REPORTSDIR%reports.db';
		}
		
		$this->dbConnection = str_replace('%REPORTSDIR%',$this->getPath('reports'),$this->dbConnection);
		
		$arr = explode(":",$this->dbConnection,2);
		$this->dbType = strtoupper($arr[0]);
		if(preg_match("#dbname=([^;]{0,})#i",$this->dbConnection,$matches)) {
			$this->dbName = $matches[1];
		}
		if(preg_match("#host=([^;]{0,})#i",$this->dbConnection,$matches)) {
			$this->dbHost = $matches[1];
		}
		if($arr[1]) {
			$this->dbPure = $arr[1];
		}
		
		 		$this->database['type'] = $this->dbType;
		$this->database['host'] = $this->dbPure;
		$this->database['name'] = $this->dbName;
		$this->database['user'] = $this->dbUser;
		$this->database['pass'] = $this->dbPass;
		$this->database['logs'] = $this->dbLogging;
		$this->qCount = 0;
		$this->sCount = 0;
		$this->reportSent = false;
		 		try{
			$logLevel = $this->getSettings('C_AS_SpamReportsLogLevel');
		}catch(Exception $e){
			$logLevel = 0;
		}
		
		$this->setLogging( $logLevel );
		$this->setDebugging( $logLevel > 1 );
	}
	
	static public function instance()
	{
		if(!isset(self::$instance)){
			self::$instance = new ChallengeApplication();
		}
		return self::$instance;
	}
	
	 
	public function error($msg)
	{
		$args = func_get_args();
		$e = new ChallengeException($msg);
		$e->challengeCode = $msg;
		unset($args[0]);
		switch($msg){
			case 'challenge_language_file_missing':
			case 'challenge_language_file_corrupted':
				$msg = call_user_func_array('sprintf',array($msg.': %s',$args[1]));
				$e->challengeMsg = $msg;
				break;
			default:
				if(isset($this->language['exceptions'][$msg])){
					$msg = sprintf($this->language['exceptions'][$msg],$args[1],$args[2]);
					$e->challengeMsg = $msg;
				}
			break;
		}
		
		switch ($logging) {
			case null:
			case false:
			case '':
			case 0:
			case 1:
			case 2:			
			case 3:
			case 4:
				$api = IcewarpAPI::instance();
				$api->DoLog(
					$this->id,
					12,
					'Challenge',
					$time."\t".
					strip_tags($msg)
				);
				$api->DoLog(
					$this->id,
					13,
					'Challenge',
					$time."\t".
					strip_tags($msg)
				);
				break;
		}
		throw $e;
	}
	 
	public function message($msg,$logAs = 0)
	{
		static $msgCount;
		$logging = $this->getLogging();
		if($logAs > 0){
			$logging = $logAs;
		}
		switch ($logging) {
			case null:
			case false:
			case '':
			case 0:
				break;
			case 1:
			case 2:
				echo '.';
				if ($msgCount % 200 == 0) {
					echo '<br/>';
				}
				break;
			
			case 3:
			case 4:
				print_r($msg);
				echo '<br/>';
				$api = IcewarpAPI::instance();
				$api->DoLog(
					$this->id,
					13,
					'Challenge',
					$time."\t".
					strip_tags($msg)
				);
				break;
		}
		$msgCount++;
	}
	
	public function setStartTime( $t, $m )
	{
		$this->t = $t;
		$this->m = $m;
	}
	
	public function duration()
	{
		return (time()-$this->t+microtime()-$this->m);
	}
	
	 
	private function start($action, $id = 'challenge')
	{
		if ($this->isRunning($id)) {
			$this->error('challenge_already_running');
		} else {
			switch ($action) {
				case 'report':
					if(trim($_SERVER['REQUEST_URI'])!=''){
						$this->message('Spam reports start URI:'.$_SERVER['REQUEST_URI'],4);
					}else{
						$this->message('Spam reports start URI: executed from console',4);
					}
					$this->cache = ChallengeCache::instance();
					$this->report = Report::instance( $this->cache );
					$this->spam = Spam::instance( $this->cache );
					$this->quarantine = Quarantine::instance( $this->cache );
					$this->admin = ChallengeCacheTable::instance(
						'ChallengeCacheTable',
						'admin',
						$this->cache
					);
					$this->spamAdmin = ChallengeCacheTable::instance(
						'ChallengeCacheTable',
						'spam_admin',
						$this->cache
					);
					$this->quarantineAdmin = ChallengeCacheTable::instance(
						'ChallengeCacheTable',
						'quarantine_admin',
						$this->cache
					);
					$this->time = time();
					$this->hash = slToolsCrypt::createHash();
					$report = array('rep_hash' => $this->hash, 'rep_time' => $this->time);
					$r = $this->report->create($report);
					$this->id = $r->getID();
					break;
				default:
					break;
			}
		}
	}
	 
	private function stop($action, $id = 'challenge')
	{
		 		switch ($action) {
			case 'report':
				$cache = ChallengeCache::instance();
				if ($this->adminAccounts) {
					$this->processSpamAdmin($this->adminAccounts);
				}
				if ( !$this->reportSent ) {
					$this->report->delete($this->id);
				}
				$api = IcewarpAPI::instance();
				$activeAccounts = count($this->activeAccounts);
				$adminAccounts = count($this->adminAccounts);
				$time = $this->duration();
				if( $this->getLogging() > 0 ){
					$api->DoLog(
							$this->id,
							13,
							'Challenge',
							"\t".str_pad("Time",12," ").
							str_pad("Accounts",12," ").
							str_pad("Admins",12," ").
							str_pad("Spam",12," ").
							str_pad("Quarantine",12," ")
					);
					$api->DoLog(
						$this->id,
						13,
						'Challenge',
						"\t".str_pad($time,12," ").
						str_pad($activeAccounts,12," ").
						str_pad($adminAccounts,12," ").
						str_pad($this->sCount,12," ").
						str_pad($this->qCount,12," ")
					);
				}
				break;
			case 'reset':
				@unlink($this->database['host']);
				break;
		}
		 		slToolsIcewarp::my_icewarp_releaselock($id);
	}

	 
	private function isRunning($id = 'challenge')
	{
		return !slToolsIcewarp::my_icewarp_getlock($id);
	}

	 
	public function setLogging($level)
	{
		$this->logging = $level;
	}

	 
	public function getLogging()
	{
		return $this->logging;
	}
	 
	public function setDebugging($level)
	{
		$this->debug = $level;
	}

	 
	public function getDebugging()
	{
		return $this->debug;
	}
	
	 
	public function setPath($index, $path)
	{
		$this->path[$index] = $path;
	}

	 
	public function getPath($index)
	{
		if (!isset($this->path[$index])) {
			$this->error('challenge_invalid_path_variable',$index);
		}
		return $this->path[$index];
	}

	 
	public function getSettings($index)
	{
		if (!isset($this->settings[$index])) {
			$api = IcewarpAPI::instance();
			$this->settings[$index] = $api->GetProperty($index);
			 
		}
		return $this->settings[$index];
	}

	 
	public function getLanguage($index)
	{
		$val = slVariable::getDotted($index, $this->language);
		if (!isset($val)) {
			$val = '';
			 			 		}
		return $val;
	}

	 
	public function run($action, $domain = '', $account = '')
	{
		$this->filterDomain = $domain;
		$this->filterAccount = $account;
		$this->start($action);
		$this->iterateAccounts($action . 'Callback');
		$this->stop($action);
	}

	public function setMode($mode)
	{
		$this->mode = $mode;
	}

	 
	public function setReportType($reportType)
	{
		$this->reportType = $reportType;
	}

	 
	public function isBypass($value)
	{
		if(in_array($value,$this->bypass,false)){
			 			if($value == $this->filterDomain 
			|| $value == $this->filterAccount.'@'.$this->filterDomain){
				return false;
			}else{
				$this->message('Object bypassed : '.$value);
				return true;
			}
		}else{
			return false;
		}
	}

	 
	private function iterateAccounts($callback)
	{
		$api = IcewarpAPI::instance();
		$account = new IcewarpAccount();
		$domain = new IcewarpDomain();
		$domainCount = $api->GetDomainCount();
		for ($i = 0; $i < $domainCount; $i++) {
			$domainName = $api->GetDomain($i);
			if($this->isBypass($domainName)){
				continue;
			}
			 			if ($this->filterDomain && $this->filterDomain != $domainName) {
				continue;
			}
			$this->message("<hr><h2>Processing domain '$domainName'</h2>");
			$domain->Open($domainName);
			$domain->spamSupport = $domain->GetProperty('D_ASSupport');
			$domain->quarantineSupport = $domain->GetProperty('D_QuarantineSupport');
			if ($domain->spamSupport || $domain->quarantineSupport) {
				if ($this->filterAccount) {
					$filter = " u_alias like '%" . $this->filterAccount . "%'";
				} else {
					$filter = "";
				}
				if (!$account->FindInitQuery($domainName, $filter)) {
					$this->error("api_findinitquery",$domainName,$filter);
				}
				while ($account->FindNext()) {
					$email = $account->EmailAddress;
					if($this->filterAccount){
						$aliases = $account->GetProperty('u_alias');
						$aliases = explode(';',$aliases);
						if(!in_array($this->filterAccount,$aliases)){
							continue;
						}
					}
					if($this->isBypass($email)){
						continue;
					}
					$this->message("<h3>processing account '$email'</h3>");
					 					if ($account->GetProperty("U_Type")) {
						$this->message("Account skipped due to unsupported account type<br>");
						continue;
					}
					$this->$callback($domain, $account);

				}
				$account->FindDone();
				 				if($domain->GetProperty('D_type') == 3){
					$mode = $this->getSettings('C_AS_SpamQReportsMode');
					if($domain->quarantineSupport){
						$hasRecent = false;
						$new = array();
						$this->quarantine->syncBackupDomain(
							$domain->Name,
							$this->id,
							$hasRecent,
							false,
							false,
							$new
						);
						$items['q'] = $this->quarantine->getBackupDomainItems(
							$this->id,
							$domain->Name,
							$mode
						);
						$rcpItems = $this->splitRecipientItems($items);
						if(is_array($rcpItems) && !empty($rcpItems)){
							foreach($rcpItems as $rcp=>$rcpItemList){
								$hasNew = false;
								if($rcpItemList['q']) foreach($rcpItemList['q'] as $id=>$item){
									$key = $item->GetProperty('itm_sender').
										'#'.
										$item->GetProperty('itm_recipient');
									if(isset($new[$key])){
										$hasNew = true;
									}else{
										if($mode == 0){
											unset($rcpItemList['q'][$id]);
										}
									}
								}
								if($mode == 1 || $hasNew){
									$this->createMessage($mode + 1, 0, $rcpItemList, $rcp,true);
								}
							}
						}
					}
				}
			} else {
				$this->message('Domain skipped ( no quarantine or spam support )');
			}
		}
	}

	 
	private function reportCallback(&$domain, &$account)
	{
		$isAdmin = false;
		$items = array();
		$user = new ChallengeUser($account);
		 		if ($user->isSpamAdmin()) {
			$this->adminAccounts[] = $account->EmailAddress;
			$isAdmin = true;
		}
		 		$spamMode = $domain->spamSupport ? $this->getSpamMode($user) : false;
		$quarantineMode = $domain->quarantineSupport ? $this->getQuarantineMode($user) : false;

		$this->message('Spam Report Mode : <b>' . $this->getModeLabel($spamMode) .
			'</b>');
		$this->message('Quarantine Report Mode : <b>' . $this->getModeLabel($quarantineMode) .
			'</b>');
		 		if ($spamMode || $quarantineMode) {
			 			if ($spamMode) {
				
				$hasRecentS = false;
				$this->spam->sync(
					$user,
					$this->id,
					$hasRecentS
				);
				
				$items['s'] = $this->spam->getItems(
					$this->id,
					$account->EmailAddress,
					$spamMode,
					$send,
					false,
					$hasRecentS,
					'*',
					'object',
					'itm_sender'
				);
			}
			 			if ($quarantineMode) {
				$hasRecentQ = false;
				$this->quarantine->sync(
					$user, 
					$this->id,
					$hasRecentQ
				);
				$items['q'] = $this->quarantine->getItems(
					$this->id,
					$account->EmailAddress,
					$quarantineMode,
					$send,
					false,
					$hasRecentQ
				);
			}
			 			if($hasRecentQ){
				$this->qCount += count($items['q']);
			}
			 			if($hasRecentS){
				$this->sCount += count($items['s']);
			}
			 			if ($send && !$isAdmin) {
				$this->createMessage(
					$quarantineMode,
					$spamMode,
					$items,
					$account->EmailAddress 
				);
				$this->reportSent = true;
			}
			 			$this->markAccount( 
				$account->EmailAddress, 
				$hasRecentQ,
				$hasRecentS 
			);
		}
	}
	
	 
	public function createMessage( $quarantineMode, $spamMode, $blockItems , $email, $isBackup = false )
	{
		global $stime;
		$t = time();
		$m = microtime();
		$skindata = $this->createMessageData( $quarantineMode, $spamMode, $email, $isBackup );
		$content = $this->createMessageTop( $skindata );
		$content .= $this->createMessageBlock( $email, $blockItems, $skindata );
		$content .= $this->createMessageBottom( $skindata );
		$this->sendReportEmail( $skindata, $content );

		$stime += (time() - $t + microtime() - $m);
	}
	
	
	 
	public function createMessageData( $quarantineMode, $spamMode, $email,$isBackup =false )
	{
		 		$skindata = $this->getLanguage('list');
		$url = $this->getSettings('C_AS_SpamChallengeURL');
		$url = $url ? $url : 'http://mail.domain.com:32000/reports/';
		$link = $url . 'a.html';
		$RecDomain = explode("@", $email);
		$skindata['RecDomain'] = $recipient_domain = $RecDomain[1];
		$skindata['URL'] = str_ireplace("%%recipient_domain%%", $recipient_domain, $link);
		
		$skindata['header_sender'] = str_ireplace("%%recipient_domain%%", $recipient_domain, $this->reportSender['address']);
		$skindata['from'] = str_ireplace("%%recipient_domain%%", $recipient_domain, $this->reportFrom['address']);
		$skindata['fromName'] = $this->reportFrom['display'];
		$skindata['report_id'] = $this->id;
		$skindata['report_hash'] = $this->hash;
		$skindata['owner'] = $email;
		$skindata['qmode'] = $quarantineMode;
		$skindata['smode'] = $spamMode;
		$skindata['admin_action'] = $this->getLanguage('list.admin_action');
		$skindata['account_action'] = $this->getLanguage('list.account_action');
		$skindata['intro'] = $this->getLanguage('list.intro');
		$skindata['outro'] = $this->getLanguage('list.outro');
		$skindata['ltr'] = $this->ltr;
		if($isBackup){
			$api = IcewarpAPI::instance();
			$link = $api->GetProperty('C_WebAdmin_URL');
			$link.= '?view=gateway_login';
			$link_label = $this->getLanguage('gateway_link_label');
			$skindata['gateway_link'] = $link;
			$skindata['gateway_link_label'] = $link_label;
		}
		return $skindata;
	}
	
	public function createMessageTop( &$skindata )
	{
		return template( 'skin/'.$this->getSkin().'/list_top.tpl', $skindata );
	}
	public function createMessageAdminAction( &$skindata )
	{
		return template( 'skin/'.$this->getSkin().'/list_admin.tpl', $skindata );
	}
	
	private function createMessageBlock( $accountID, &$items, &$skindata )
	{
		$itms_spam = $itms_quarantine = array();
		if ($items['s']){
			foreach ($items['s'] as $s) {
				$itm = $s->property;
				$itm['itm_type'] = 1;
				$itm['itm_type_display'] = $this->getLanguage('list.type_spam');
				$itm['itm_display'] = $this->getDisplayDateTime($itm['itm_date'], $itm['itm_time']);
				$itm['itm_sender'] = slMail::addressToUTF8($itm['itm_sender']);
				$itm['itm_recipient'] = slMail::addressToUTF8($itm['itm_recipient']);
				$itm['itm_domain'] = slMail::addressToUTF8($itm['itm_domain'],true);
				$this->shortenItem($itm);
				$itms_spam[] = $itm;
			}
		}
		if ($items['q']){
			foreach ($items['q'] as $q) {
				$itm = $q->property;
				$itm['itm_type'] = 2;
				$itm['itm_type_display'] = $this->getLanguage('list.type_quarantine');
				$itm['itm_display'] = $this->getDisplayDateTime($itm['itm_date'], $itm['itm_time']);
				$itm['itm_sender'] = slMail::addressToUTF8($itm['itm_sender']);
				$itm['itm_recipient'] = slMail::addressToUTF8($itm['itm_recipient']);
				$itm['itm_domain'] = slMail::addressToUTF8($itm['itm_domain'],true);
				$this->shortenItem($itm);
				$itms_quarantine[] = $itm;
			}
		}
		if ($itms_quarantine || $itms_spam) {
			$skindata['id'] = $accountID;
			$skindata['label'] = slMail::addressToUTF8($accountID);
			if($itms_spam){
				$skindata['items_spam'] = $itms_spam;
			}
			if($itms_quarantine){
				$skindata['items_quarantine'] = $itms_quarantine;
			}
			$result = template('skin/'.$this->getSkin().'/list.tpl',$skindata);
			unset($skindata['items_spam']);
			unset($skindata['items_quarantine']);
			return $result;
		}
	}
	public function shortenItem(&$itm)
	{
		$check = 53;
		$cut = 50;
		$len = strlen($itm['itm_sender']);
		$itm['itm_sender_short'] = $len>$check?("...".iconv_substr($itm['itm_sender'],$len-$cut,$len,'utf-8')):$itm['itm_sender'];
		$len = strlen($itm['itm_recipient']);
		$itm['itm_recipient_short'] = $len>$check?("...".iconv_substr($itm['itm_recipient'],$len-$cut,$len,'utf-8')):$itm['itm_recipient'];
		$len = strlen($itm['itm_subject']);
		$itm['itm_subject_short'] = $len>$check?(iconv_substr($itm['itm_subject'],0,$cut,'utf-8')."..."):$itm['itm_subject'];
	}
	
	public function createMessageBottom( &$skindata )
	{
		return template( 'skin/'.$this->getSkin().'/list_bottom.tpl', $skindata );
	}
	
	public function sendReportEmail( &$skindata, &$content )
	{
		try{
			$mail = new slMail();
			$mail->setCharset('UTF-8');
			$mail->setTempDir($this->getPath('temp'));
			$mail->Sender = $skindata['header_sender'];
			$mail->Host = $this->smtp['HOST'];
			$mail->Port = $this->smtp['PORT'];
			$mail->SMTPAutoTLS = $this->smtp['AUTO_TLS'];
			$mail->BackupConnections = $this->smpt['BACKUP'];
			$mail->XMailer = 'IceWarp Mailer ' . $this->version;
			$mail->setFrom($skindata['from'],$skindata['fromName'],false);
			$subject = $this->getLanguage('list.msgsubject');
			$display = $this->getDisplayUnix(time());
			$subject = str_replace('%%Current_Date%%',$display['date'].' '.$display['time'],$subject);
			$mail->setSubject( $subject );
			$mail->setBody( '', $content );
			$mail->AddTo( $skindata['owner'] );
			$mail->send();
		}catch(Exception $e){
			if(file_exists($mail->getTempFile())){
				unlink($mail->getTempFile());
			}
			$this->message("Mail not sent:".$e->getMessage());
		}
	}

	 
	private function resetCallback(&$domain, &$account)
	{
		$user = new ChallengeUser($account);
		$user->reset();
	}

	private function emptyCallback(&$domain, &$account)
	{
	}

	private function testCallback(&$domain, &$account)
	{
	}

	 
	private function getModeLabel($mode)
	{
		switch (intval($mode)) {
			default:
			case 0:
				return 'Disabled';
				break;
			case 1:
				return 'New Items';
				break;
			case 2:
				return 'All Items';
				break;
		}
	}
	 	private function processSpamAdmin( $adminList )
	{
		$adminCached = $this->admin->retrieve(
			'*',
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			'array',
			'email'
		);
		
		$this->message("<br/>Processing Spam Administrators");
		$this->message("===============================");
		$account = new IcewarpAccount();
		foreach ($adminList as $adminEmail) {
			 			if(!$adminCached[$adminEmail]){
				$adminItem = $this->admin->create(
					array(
						'email'=>$adminEmail
					)
				);
				$adminID = $adminItem->getID();
			}else{
				$adminID = $adminCached[$adminEmail]['id'];
			}
			$this->message("<b>$adminEmail</b> is administrator for following mailboxes ");
			 			$account->Open( $adminEmail );
			$admin = new ChallengeUser( $account );
			 			$qMode = $this->getQuarantineMode($admin);
			$sMode = $this->getSpamMode($admin);
			if ( $qMode || $sMode ) {
				$accList = $this->parseAdminFile( $admin->path['fileAdmin'] );
				$accList = $this->convertAdminList( $accList );
			}
			 			$this->sendAdminEmail( $adminID, $accList, $admin, $send );
			unset($adminCached[$adminEmail]);
		}
		$this->cache->transaction();
		if($adminCached){
			foreach($adminCached as $toDelete){
				try{
					 					$this->admin->delete( $toDelete['id'] );
					 					$this->spamAdmin->delete(false,true,array('admin_id'=>$toDelete['id']));
					$this->quarantineAdmin->delete(false,true,array('admin_id'=>$toDelete['id']));
				}catch(Exception $e){
					
				}
			}
		}
		$this->cache->commit();
	}
	
	 	private function sendAdminEmail( $adminID, $list, &$adminUser, &$send )
	{
		$sendBackup = false;
		$sendOwned = false;
		$sendAdmin = false;
		 		$qMode = $this->getQuarantineMode($adminUser);
		$sMode = $this->getSpamMode($adminUser);

		 		$items['s'] = $this->spam->getItems(
			$this->id,
			$adminUser->email,
			$sMode,
			$sendOwned,
			false,
			$this->isAccountRecentSpam( $adminUser->email ),
			'*',
			'object',
			'itm_sender'
		);
		$items['q'] = $this->quarantine->getItems(
			$this->id,
			$adminUser->email,
			$qMode,
			$sendOwned,
			false,
			$this->isAccountRecentQuarantine( $adminUser->email )
		);
		$msgFileName = slToolsFilesystem::randomFilename();
		$msgFile = fopen( $msgFileName, 'w+' );
		 		$skindata = $this->createMessageData( $qMode, $sMode, $adminUser->email );
		 		$top = $this->createMessageTop( $skindata );
		$block = $this->createMessageBlock( $adminUser->email, $items, $skindata );
		$head = $top.$block;
		$skindata['admin_id'] = $adminID;
		 		if($list['backup']){
			$bItems['q'] = array();
			$hasRecent = false;
			$new = array();
			foreach($list['backup'] as $backupDomain){
				$q = array();
				$this->quarantine->syncBackupDomain(
					$backupDomain,
					$this->id,
					$hasRecent,
					$adminID,
					$this->quarantineAdmin,
					$new
				);
				$q = $this->quarantine->getBackupDomainAdminItems(
					$this->id,
					$backupDomain,
					$qMode,
					$sendBackup,
					false,
					$hasRecent,
					'*',
					'object',
					'id',
					false,
					$adminID
				);
				if(is_array($q)){
					$bitems['q'] = slToolsPHP::array_merge($bitems['q'],$q);
				}
			}
		}
		$hasAdminItems = false;
		 		if($sendBackup){
			$rcpItems = $this->splitRecipientItems($bitems);
			if(is_array($rcpItems) && !empty($rcpItems)){
				foreach($rcpItems as $rcp=>$rcpItemList){
					$hasNew = false;
					if($rcpItemList['q']) foreach($rcpItemList['q'] as $id=>$item){
						$key = $item->GetProperty('itm_sender').
						'#'.
						$item->GetProperty('itm_recipient');
						if(isset($new[$key])){
							$hasNew = true;
						}else{
							if($qMode == 0){
								unset($rcpItemList['q'][$id]);
							}
						}
					}
					if($qMode == 2 || $hasNew){
						$hasAdminItems = true;
						$block = $this->createMessageBlock( $rcp, $rcpItemList, $skindata );
						fwrite( $msgFile, $block );
					}
				}
			}
		}
		 		 		$domain = ChallengeApplication::getDomainOnly( $adminUser->email );
		if( isset( $list['main'][$domain][$adminUser->email] ) ){
			unset( $list['main'][$domain][$adminUser->email] );
		}
		

		 		$account = new IcewarpAccount();
		foreach ($list['main'] as $dom => $accounts) {
			if ($accounts) {
				foreach ($accounts as $acc => $val) {
					$items = array();
					$items['q'] = array();
					$items['s'] = array();
					$this->message("$acc");
					 					if(!$account->Open($acc)){
						continue;
					}
					$type = $account->GetProperty('u_type');
					 					if($type != 0 &&
						$type != 1 &&
						$type != 3 &&
						$type != 7
					){
						continue;
					}
					 					if($type==7 || $type==1){
						$accountSpamMode = 0;
					}else{
						$accountSpamMode = $sMode;
					}
					if ($qMode || $accountSpamMode) {
						$hasRecent = false;
						$user = new ChallengeUser( $account );
						$user->quarantineMode = $qMode;
						$user->spamMode = $accountSpamMode;
						if($qMode) {
							$this->quarantine->sync( 
								$user,
								$this->id,
								$hasRecent,
								$adminID,
								$this->quarantineAdmin
							);
							$items['q'] = $this->quarantine->getAdminItems(
								$this->id,
								$account->EmailAddress,
								$qMode,
								$sendAdmin1,
								false,
								$hasRecent,
								'*',
								'object',
								'id',
								false,
								$adminID
							);
						}
						if($accountSpamMode) {
							$this->spam->sync(
								$user,
								$this->id,
								$hasRecent,
								$adminID,
								$this->spamAdmin
							);
							$items['s'] = $this->spam->getAdminItems(
								$this->id,
								$account->EmailAddress,
								$accountSpamMode,
								$sendAdmin2,
								false,
								$hasRecent,
								'*',
								'object',
								'itm_sender',
								false,
								$adminID
							);
						}
						if($sendAdmin1 || $sendAdmin2){
							$globalAdminSend = true;
							$block = $this->createMessageBlock( 
								$account->EmailAddress, 
								$items, 
								$skindata 
							);
							fwrite( $msgFile, $block );
						}
					}
				}
			}
		}
		@fclose( $msgFile );
		$bottom = $this->createMessageBottom( $skindata );

		if( $globalAdminSend || $sendOwned || $sendBackup ){
			$this->reportSent = true;
			$adminAction = $this->createMessageAdminAction( $skindata );
			if($globalAdminSend || $sendBackup ){
				$head .= $adminAction;
			}
			if($globalAdminSend || $sendBackup ){
				$bottom = $adminAction.$bottom;
			}
			$message = $head . file_get_contents( $msgFileName ) . $bottom;
			
			$this->sendReportEmail( 
				$skindata,
				$message 
			);
		}
		@unlink($msgFileName);
	}

	public function splitRecipientItems($items)
	{
		if(is_array($items['q']) && !empty($items['q'])){
			foreach($items['q'] as $id => $quarantineItem){
				$rcp = $quarantineItem->GetProperty('itm_recipient');
				$rcpItems[$rcp]['q'][$id] = $quarantineItem;
			}
		}
		return $rcpItems;
	}

	public function convertAdminList($accList)
	{
		$account = new IcewarpAccount();
		$domain = new IcewarpDomain();
		$list = array();
		 		foreach ($accList['domains'] as $dom) {
			if(!$dom){
				continue;
			}
			if ($domain->Open($dom) < 0) {
				$this->message("API Problem : Could not open domain '$val'");
				continue;
			}
			if($domain->GetProperty('D_Type')==3){
				$list['backup'][$domain->Name] = $domain->Name;
			}
			 			if (!$account->FindInitQuery($dom, "")) {
				$this->error("api_findinitquery",$dom);
			}
			while ($account->FindNext()) {
				$listAcc = $account->EmailAddress;
				$listDom = self::getDomainOnly($listAcc);
				$list['main'][$listDom][$listAcc] = array();
			}
			$account->FindDone();
		}
		foreach ($accList['accounts'] as $acc) {
			if(!$acc){
				continue;
			}
			$list['main'][self::getDomainOnly($acc)][$acc] = array();
			 		}
		return $list;
	}

	private function isAccountRecentSpam($account)
	{
		return $this->activeAccounts[$account]['hasRecentS'];
	}
	
	private function isAccountRecentQuarantine($account)
	{
		return $this->activeAccounts[$account]['hasRecentQ'];
	}
	
	private function markAccount( $email, $hasRecentQ, $hasRecentS )
	{
		$this->activeAccounts[$email] = array();
		$this->activeAccounts[$email]['hasRecentQ'] = $hasRecentQ;
		$this->activeAccounts[$email]['hasRecentS'] = $hasRecentS;
	}
	
	private function isProcessed( $account )
	{
		return isset( $this->activeAccounts[$account] );
	}
	
	private function hasRecent( $account )
	{
		return $this->activeAccounts[$account]['recent'];
	}

	public function parseAdminFile($adminFile)
	{
		$list = array();
		 		if (@file_exists($adminFile)) {
			 			$acclist = file($adminFile);
			if (count($acclist)) {
				foreach ($acclist as $acc) {
					$acc = trim($acc);
					if(!$acc){
						continue;
					}
					 					if (strpos($acc, "@") === false) {
						$list['domains'][] = $acc;
					} else {  						$list['accounts'][] = $acc;
					}
				}
			}
		}
		return $list;
	}

	 
	public function parseSettingsFile($filename)
	{
		 
	}

	 
	public function parseLanguageFile($filename)
	{
		if (!file_exists($filename)) {
			$this->error('challenge_language_file_missing', $filename);
		}
		$languageXML = slToolsXML::loadFile($filename);
		if (!$languageXML) {
			$this->error('challenge_language_file_corrupted', $filename);
		}
		$result = array();
		foreach ($languageXML->ITEM as $val) {
			$result[strval($val["id"])] = strval($val["value"]);
		}
		foreach ($languageXML->LIST->ITEM as $val) {
			$result['list'][strval($val["id"])] = strval($val["value"]);
		}
		foreach ($languageXML->ACTIONS->children() as $name => $val) {
			foreach ($val->ITEM as $itmKey => $itmVal) {
				$result['action'][strtolower($name)][strval($itmVal["id"])] = strval($itmVal["value"]);
			}
		}
		foreach ($languageXML->QACTIONS->children() as $name => $val) {
			foreach ($val->ITEM as $itmKey => $itmVal) {
				$result['qaction'][strtolower($name)][strval($itmVal["id"])] = strval($itmVal["value"]);
			}
		}
		foreach ($languageXML->EXCEPTIONS->ITEM as $val) {
			$result['exceptions'][strval($val["id"])] = strval($val["value"]);
		}
		return $result;
	}

	private function parseSMTPSettings()
	{
		$api = IceWarpAPI::instance();
		$settingsFile = $api->getProperty("C_ConfigPath").'_webmail/server.xml';
		$settingsXML = slToolsXML::loadFile($settingsFile);
		
		$smtpservers = $settingsXML->item->smtpserver?strval($settingsXML->item->smtpserver):'127.0.0.1';
		$this->smtp['AUTO_TLS'] = $api->getProperty('c_system_adv_ext_sslservermethod')!=5 && $api->getProperty('c_system_adv_ext_sslservermethod')!=6;
		if(strpos($smtpservers,';')!==false){
			$smtpservers = explode(';',$smtpservers);
			$i = 0;
			foreach($smtpservers as $smtpserver){
				$smtpserver = $smtpserver?$smtpserver:'127.0.0.1';
				if($i==0){
					$this->smtp['HOST'] = $smtpserver;
				}else{
					$smtpbackup[$i]['HOST'] = $smtpserver;
				}
				$i++;
			}
		}else{
			$this->smtp['HOST'] = $smtpservers;
		}
		$smtpports = $settingsXML->item->smtpport?strval($settingsXML->item->smtpport):'25';
		if(strpos($smtpports,';')!==false){
			$smtpports = explode(';',$smtpports);
			$i = 0;
			foreach($smtpports as $smtpport){
				$smtpport = $smtpport?$smtpport:25;
				if($i==0){
					$this->smtp['PORT'] = $smtpport;
				}else{
					$smtpbackup[$i]['PORT'] = $smtpport;
				}
				$i++;
			}
		
		}else{
			$this->smtp['PORT'] = $smtpports?$smtpports:25;
		}
		$this->smtp['BACKUP'] = array();
		if($smtpbackup){
			foreach($smtpbackup as $smtpConnection){
				$this->smtp['BACKUP'][]=$smtpConnection['HOST'].($smtpConnection['PORT']?':'.$smtpConnection['PORT']:'');
			}
			$this->smtp['BACKUP'] = join(';',$this->smtp['BACKUP']);
		}
		$sender = $this->getSettings("C_AS_SpamReportMailSender");
		$from = $this->getSettings("C_AS_SpamReportMailFrom");
		$sender = mailparse_rfc822_parse_addresses($sender);
		$this->reportSender = reset($sender);
		if (!$from) {
			$this->reportFrom = $this->reportSender;
		} else {
			$from = mailparse_rfc822_parse_addresses($from);
			@$this->reportFrom = reset($from);
		}
	}
 	 
	static public function getFileTime($file, &$date, &$time)
	{
		 		if (file_exists($file)) {
			$udate = filemtime($file);
			 			$date = slToolsDate::unix2calendardate($udate);
			$time = slToolsDate::unix2calendartime($udate);
		} else {
			$date = $time = 0;  		}
	}

	static private function markFileTime($file, &$date, &$time)
	{
		$date = 0;
		$time = 0;
		$list = array();
		self::getFileTime($file, $date, $time);
		@touch($file);
	}

     
	static public function getAddressOnly($address)
	{
	    if(!preg_match('/((["\'])(.*?)\2)?\s?\<(?P<email>[^>]+)\>/i', $address, $matches)) return trim($address);
	    return trim($matches['email']);
	}

	static public function getDomainOnly($email)
	{
		return mb_substr($email, mb_strpos($email, '@', 0, 'utf-8') + 1, mb_strlen($email));
	}


	static public function getDisplayDateTime($date, $time)
	{
		
		$app = ChallengeApplication::instance();
		$unixtime = jdtounix($date);
		$unixtime+=$time;
		$timezone = $app->getSettings("C_TimeZone");
		$unixtime-=$timezone;
		$display = self::getDisplayUnix($unixtime);
		return $display;
	}
	
	static public function getDisplayUnix($unixtime)
	{
		$app = ChallengeApplication::instance();
		try{
			$dateFormat = $app->getSettings('C_AS_SpamReportsDateFormat');
			if(!$dateFormat || $dateFormat==-1){
				throw new Exception();
			}
		}catch(Exception $e){
			$dateFormat = 'd/m/Y';
		}
		try{
			$timeFormat = $app->getSettings('C_AS_SpamReportsTimeFormat');
			if(!$timeFormat || $timeFormat==-1){
				throw new Exception();
			}
		}catch(Exception $e){
			$timeFormat = 'H:i';
		}
		$display['date'] = slToolsDate::my_date($dateFormat,$unixtime);
		$display['time'] = slToolsDate::my_date($timeFormat,$unixtime);
		return $display;
	}

	 
	static public function extendByZeros($number, $count)
	{
		$len = $count - strlen($number);
		for ($i = $len; $i > 0; $i--)
			$number = "0" . $number;

		return $number;
	}
	
	public function setSkin($skin)
	{
		$skin = slToolsFilesystem::securepath($skin);
		if(!$skin || $skin=='-1'){
			$skin = 'default';
		}
		if(!is_dir('skin/'.$skin)){
			$this->error('Skin directory does not exist: '.$skin);
		}
		$this->skin = $skin;
	}
	
	public function getSkin()
	{
		return $this->skin;
	}
	
	 
	private function getSpamMode(ChallengeUser $user) {
		$sMode = $user->getSpamMode();
		$sMode = $this->reportType === 'quarantine' ? false : $sMode;
		return $sMode;
	}

	 
	private function getQuarantineMode(ChallengeUser $user) {
		$qMode = $user->getQuarantineMode();
		$qMode = $this->reportType === 'spam' ? false : $qMode;
		return $qMode;
	}
}

class ChallengeException extends Exception
{
	public $challengeMsg;
	public $challengeCode;
}
?>