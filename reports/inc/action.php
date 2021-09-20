<?php

require_once ('application.php');
slSystem::import('api/challenge');

class ChallengeAction
{
	static protected $instance;
	private $reportID;
	
	public function __construct()
	{
		
		 		$this->api = IcewarpAPI::instance();
		$this->cache = ChallengeCache::instance();
		$this->report = Report::instance($this->cache);
		$this->spam = Spam::instance($this->cache);
		$this->quarantine = Quarantine::instance($this->cache);
		$this->admin = ChallengeCacheTable::instance('ChallengeCacheTable','admin',$this->cache);
		$this->adminS = ChallengeCacheTable::instance('ChallengeCacheTable','spam_admin',$this->cache);
		$this->adminQ = ChallengeCacheTable::instance('ChallengeCacheTable','quarantine_admin',$this->cache);
		 		$app = ChallengeApplication::instance();
		$this->setSkin( $app->getSkin() );
	}

	static public function instance()
	{
		if(!isset(self::$instance)){
			self::$instance = new ChallengeAction();
		}
		return self::$instance;
	}
	
	public function setSkin($skin)
	{
		$skin = slToolsFilesystem::securepath($skin);
		if(!$skin || $skin=='-1'){
			$skin = 'default';
		}
		if(!is_dir('skin/'.$skin)){
			ChallengeApplication::instance()->error('Skin directory does not exist: '.$skin);
		}
		$this->skin = $skin;
	}
	
	public function getSkin()
	{
		return $this->skin;
	}
	
	public function setReportID($reportID)
	{
		$this->reportID = $reportID;
	}

	public function getReportID()
	{
		return $this->reportID;
	}

	public function challengeResponse( $folder, $go, $word )
	{
		slSystem::import('api/challenge');
		$app = ChallengeApplication::instance();
		 		$skindata["title"] = $app->getLanguage('title');
		$skindata["request"] = $app->getLanguage( 'request' );
		$skindata["explanation"] = $app->getLanguage( 'explanation' );
		$skindata["thanks"] = $app->getLanguage( 'thanks' );
		$skindata["thanks2"] = $app->getLanguage( 'thanks2' );
		$skindata["copyright"] = $app->getLanguage( 'copyright' );
		$skindata["copyright2"] = $app->getLanguage( 'copyright2' );
		$skindata["reason"] = $app->getLanguage( 'reason' );
		$skindata["link"] = $app->getLanguage( 'link' );
		$skindata['skin'] = $this->getSkin();

		echo template( 'skin/'.$this->getSkin().'/top.tpl', $skindata );
		$draw_form = 0;
		$res_ok = 0;
		if ( $go ) {
			$item = $this->quarantine->getItemByFolder($folder);
			$auth = challengeresponseauthorize( $folder, $word );
			if ( $auth ) {
				$skindata["result"] = $app->getLanguage( 'result_ok' ); 
				$res_ok = 1;
				
				$api = IcewarpAPI::instance();
				if( $app->getLogging() > 0 ){
					$api->DoLog(
						$_SERVER['REMOTE_IP'],
						13,
						$item['itm_sender'],
						$item['itm_sender']." authorized message for ".$item['itm_recipient']." in folder:".$folder." authorized by word:".$word
					);
				}
			} else {
				$skindata["result"] = $app->getLanguage( 'result_error' );
				$res_ok = 0;
			}
		} elseif ( $folderstate = challengeresponsefolder( $folder ) ) { 
			switch( $folderstate ) {
				case 1:   					$skindata["folder"] = $folder;
					$skindata["hash"] = $hash;
					$draw_form = 1;
					break;
				case 2:   					$skindata["result"] = $app->getLanguage( 'result_already' );
					$res_ok = 1;
					break;
				case 3:   					$skindata["result"] = $app->getLanguage( 'result_black' );
					break;
			}
		} else {
			$skindata["result"] = $app->getLanguage( 'result_notfound' );
		}
		if ( $res_ok ) {
			$skindata["result_type"] = 'resultOk';
		} else {
			$skindata["result_type"] = 'resultError';
		}
		if ( $draw_form ) {
			echo template( 'skin/'.$this->getSkin().'/image.tpl', $skindata );
			echo template( 'skin/'.$this->getSkin().'/form.tpl', $skindata );
		} else {
			echo template( 'skin/'.$this->getSkin().'/result.tpl', $skindata );
		}
		if( $go && !$res_ok ){
			$folderstate = challengeresponsefolder( $folder );
			$skindata["folder"] = $folder;
			$skindata["hash"] = $hash;
			echo template( 'skin/'.$this->getSkin().'/image.tpl', $skindata );
			echo template( 'skin/'.$this->getSkin().'/form.tpl', $skindata );
		}
		echo template( 'skin/'.$this->getSkin().'/bottom.tpl', $skindata );
	}

	public function single($id, $hash, $action, $type, $part = '1')
	{
		$app = ChallengeApplication::instance();
		 		$skindata["sender"] = " ";
		$skindata["title"] = $app->getLanguage('action.fail.title');
		$skindata["failure"] = $app->getLanguage('action.fail.wrongid');
		 		if(!$part || $part=='1'){
			echo template('skin/'.$this->getSkin().'/actiontop.tpl', $skindata);
		}
		if($type == 2){
			$itmCache = &$this->quarantine;
		}else{
			$itmCache = &$this->spam;
		}
		 		$itm = $itmCache->getItem( $id );
		if (!$id 
		|| !$itm 
		||!file_exists($itm->getMessageFile())) {
			$skindata["error_happened"] = 1;
			
			if($itm){
				$skindata['sender'] = $itm->GetProperty('itm_sender');
			}

			
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
			return - 1;
		}
		if($itm && $itm->getProperty('itm_hash')!=$hash){
			$skindata['success'] = '';
			$skindata["title"] = $app->getLanguage('action.fail.failure');
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
			return - 1;
		}
		$skindata['sender'] = $itm->GetProperty('itm_sender');

		$this->processItem( $action, $this, $itm, $skindata, $message,$part );

		echo template('skin/'.$this->getSkin().'/actionbottom.tpl', $skindata);
		if ($skindata["error_happened"])
			return - 1;
		return 1;
	}
	 	public function account( $hash, $action, $account, $qMode, $sMode, $adminID = false )
	{
		$action = $action%10;
		$app = ChallengeApplication::instance();
		 		 		$skindata["title"] = $app->getLanguage('action.fail.title');
		$skindata["failure"] = $app->getLanguage('action.fail.wrongid');
		try{
			$r = $this->report->getItem( $this->reportID );
			if( !$r || !$r->check( $hash ) ){
				$app->error('challenge_invalid_hash', $hash);
			}
		}catch(Exception $e){
			$skindata['error_happened'] = 1;
		}

		if($adminID){
			$methodName = 'getAdminItems';
		}else{
			$methodName = 'getItems';
		}
		$spam = $this->spam->$methodName(
			$this->reportID,
			$account,
			$sMode,
			$send,
			false,
			true,
			'*',
			'object',
			'id',
			false,
			$adminID
		);
		$quarantine = $this->quarantine->$methodName(
			$this->reportID,
			$account,
			$qMode,
			$send,
			false,
			true,
			'*',
			'object',
			'id',
			false,
			$adminID
		);
		echo template('skin/'.$this->getSkin().'/actiontop.tpl', $skindata);
		foreach($spam as $spamItem){
			$index = $this->processItem(
				$action,
				$this,
				$spamItem,
				$skindata,
				$message
			);
		}
		
		foreach($quarantine as $quarantineItem){
			$index = $this->processItem(
				$action,
				$this,
				$quarantineItem,
				$skindata,
				$message
			);
		}
		
		if(!$quarantine && !$spam){
			$skindata["sender"] = $account;
			$skindata["title"] = $app->getLanguage('action.fail.title');
			$skindata["failure"] = $app->getLanguage('action.fail.wrongid');
			$skindata["error_happened"] = 1;
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
		
		}
		echo template('skin/'.$this->getSkin().'/actionbottom.tpl', $skindata);
		if ($skindata["error_happened"])
			return - 1;
		return 1;
	}
	
	public function admin( $hash, $action , $adminID, $qMode, $sMode )
	{
		$action = $action%20;
		$app = ChallengeApplication::instance();
		try{
			$r = $this->report->getItem( $this->reportID );
			if( !$r || !$r->check( $hash ) ){
				$app->error('challenge_invalid_hash',$hash);
			}
		}catch(Exception $e){
			$skindata['error_happened'] = 1;
		}
		$account = new IcewarpAccount();
		$admin = $this->admin->getItem( $adminID );
		if(!$admin){
			$skindata["sender"] = $adminID;
			$skindata["title"] = $app->getLanguage('action.admin.title');
			$skindata["failure"] = $app->getLanguage('action.admin.wrongid');
			$skindata["error"] = 1;
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
			die();
		}
		$account->Open( $admin->getProperty('email') );
		$adminUser = new ChallengeUser( $account );
		$list = $app->parseAdminFile( $adminUser->getPath('fileAdmin') );
		$list = $app->convertAdminList( $list );
		if($list['backup']){
			foreach($list['backup'] as $backupDomain){
				$backupItems = $this->quarantine->getBackupDomainAdminItems(
					$this->reportID,
					$backupDomain,
					$qMode,
					$send,
					false,
					true,
					'*',
					'object',
					'id',
					false,
					$adminID
				);
				if($backupItems){
					foreach($backupItems as $backupItem){
						$this->processItem(
							$action,
							$this,
							$backupItem,
							$skindata,
							$message
						);
					}
				}
			}
		}
		$noItems = true;
		foreach ($list['main'] as $dom => $accounts) {
			if ($accounts) {
				foreach ($accounts as $acc => $val) {
					$app->message("$acc");
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
					$spam = $this->spam->getAdminItems(
						$this->reportID,
						$acc,
						$sMode,
						$send,
						false,
						true,
						'*',
						'object',
						'id',
						false,
						$adminID
					);
					$quarantine = $this->quarantine->getAdminItems(
						$this->reportID,
						$acc,
						$qMode,
						$send,
						false,
						true,
						'*',
						'object',
						'id',
						false,
						$adminID
					);
					foreach($spam as $spamItem){
						$noItems = false;
						$this->processItem(
							$action,
							$this,
							$spamItem,
							$skindata,
							$message
						);
					}
					foreach($quarantine as $quarantineItem){
						$noItems = false;
						$this->processItem(
							$action,
							$this,
							$quarantineItem,
							$skindata,
							$message
						);
					}

				}
			}
		}
		if($noItems){
			$nospam = $nospam && false;
			$skindata["sender"] = " ";
			$skindata["title"] = $app->getLanguage('action.fail.title');
			$skindata["success"] = $app->getLanguage('action.fail.wrongid');
			$skindata["error"] = 1;
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
		}
	}
	
	public function processItem( $action , $handler, $itm, &$skindata, &$message, $part = '1' )
	{
		$app = ChallengeApplication::instance();
		$processed = true;
		$delete = false;
		if(strtolower(get_class($itm))=='quarantineitem'){
			$actionIndex = 'qaction';
		}else{
			$actionIndex = 'action';
		}
		if($itm->GetProperty('itm_flags') & ChallengeItem::FLAG_PROCESSED){
			$skindata["error_happened"] = 1;
			$skindata['sender'] = $itm->GetProperty('itm_sender');
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
			return - 1;
		}
		$itm->assignHandler( $handler );
		 		 		try{
			switch ($action) {
				case 1:
					$index = "authorize";
					$delete = true;
					$skindata["error_happened"] = !$itm->authorize();
					break;
				case 2:
				case 6:
					$index = "deliver";
					$delete = true;
					$skindata["error_happened"] = !$itm->deliver();
					break;
				case 3:
					$index = "delete";
					$delete = true;
					$skindata["error_happened"] = !$itm->delete();
					break;
				case 4:
				case 7:
					$index = "blacklist";
					$delete = true;
					$skindata["error_happened"] = !$itm->blacklist();
					break;
				case 5:
					$index = 'view';
					$message = $itm->show($part);
					$processed = false;
					$skindata['message'] = $message;
					$skindata['view'] = true;
					break;
				default:
					$index = "fail";
					$processed = false;
					$skindata["error_happened"] = 1;
					break;
			}
			 			$skindata["title"] = $app->getLanguage($actionIndex.'.' . $index . '.title');
			$skindata["success"] = $app->getLanguage($actionIndex.'.' . $index . '.success');
			$skindata["failure"] = $app->getLanguage($actionIndex.'.'. $index . '.failure');
			$skindata["sender"] = $itm->GetProperty('itm_sender');
			echo template('skin/'.$this->getSkin().'/actiononly.tpl', $skindata);
			$itm->done( $processed,$delete );
		}catch(Exception $e){
			 			echo $e->getMessage();
		}
		return $index;
	}
}

?>