<?php
require_once ('cache.php');
slSystem::import('api/api');
slSystem::import('tools/php');

class Quarantine extends ChallengeCacheTable
{
	
	 
	public static $hashFields = ['itm_date', 'itm_time', 'itm_folder', 'itm_sender', 'itm_recipient', 'itm_subject'];

	static public function instance(&$cache)
	{
		$result =  parent::instance('Quarantine', 'quarantine', $cache);
		$result->SYNC_ID = 'sync_hash';
		return $result;
	}

	 
	public static function createItemHash(array $itemData) {
		$hashArray = [];
		
		foreach (self::$hashFields as $key) {
			if (array_key_exists($key, $itemData)) {
				$hashArray[] = $itemData[$key];
			} else {
				throw new Exception('Cannot generate hash: value "' . $key . '" missing in items data');
			}
		}

		return md5(implode('', $hashArray));
	}

	public function getItemDetail( $newItem, $report_id, $account, $itemID, $adminID = false, $path = false, $log = true)
	{
		$ch = ChallengeApplication::instance();
		$display = $ch->getDisplayDateTime($newItem['itm_date'],$newItem['itm_time']);
		if($log){
			$ch->message('Quarantine::getItemDetail From:'.$newItem['itm_sender'].', To:'.$newItem['itm_recipient'].', Subject:'.$newItem['itm_subject'].', Date: '.$display['date'].' '.$display['time']);
		}
		$newItem['itm_report_id'] = $report_id;
		if($adminID == false){
			$newItem['itm_seen_by_owner'] = $report_id;
		}
		return $newItem;
	}

	public function getItemByFolder($folder)
	{
		$api = IcewarpAPI::instance();
		 		$query = " WHERE SndAuthorized = '2' AND SndFolder = '$folder'";
		$query.=" ORDER BY SndCreatedOn DESC, SndCreatedAt DESC";
		 		$list_flat = $api->QuarantineList("", $query, 0);
		$array = explode("\n", trim($list_flat));
		 		if (count($array)) {
			foreach ($array as $subarray) {
				$line = explode(";", $subarray);
				if (count($line) < 8)
					continue;  				$record = array();
				$record['itm_hash'] = slToolsCrypt::createHash();
				$record['itm_subject'] = trim($line[7]);
				$record['itm_sender'] = trim($line[0]);
				$record['itm_recipient'] = trim($line[4]);
				$record['itm_date'] = trim($line[1]);
				$record['itm_time'] = trim($line[5]);
				$record['itm_folder'] = trim($line[2]);
				 			}
		}
		return $record;
	}

	public function getIDList( &$user )
	{
		$list = array();
		$api = IcewarpAPI::instance();
		
		$account = $user->account->EmailAddress;
		 		$query = " WHERE SndAuthorized = '2' AND SndOwner = '".icewarp_escape_db_string($account,'antispam')."'";
		 		$query .= " ORDER BY SndCreatedOn DESC, SndCreatedAt DESC";

		$list_flat = $api->QuarantineList("", $query, 0);
		$app = ChallengeApplication::instance();
		$app->message($account . ' (quarantine): ');

		 		 		 		$array = explode("\n", trim($list_flat));
		 		if (count($array)) {
			foreach ($array as $subarray) {
				$line = explode(";", $subarray);
				if (count($line) < 8)
					continue;  				$newItem = array();
				$newItem['itm_hash'] = slToolsCrypt::createHash();
				$newItem['itm_subject'] = trim($line[7]);
				$newItem['itm_sender'] = trim($line[0]);
				$newItem['itm_recipient'] = trim($line[4]);
				$newItem['itm_date'] = trim($line[1]);
				$newItem['itm_time'] = trim($line[5]);
				$newItem['itm_folder'] = trim($line[2]);
				$newItem['sync_hash'] = self::createItemHash($newItem);
				$result[$newItem['sync_hash']] = $newItem;
			}
		}
		return $result;
	}
	
	public function getWrapperClassName()
	{
		return 'QuarantineItem';
	}
	
	public function getAdminItems( $report_id, $recipient, $mode, &$send = false, $groupBy = false, $hasRecent = false, $fields = '*',$result = 'object', $id = 'id',$sender = false, $adminID = false)
	{
		$values[':itm_recipient'] = $recipient;
		$values[':report_id'] = $report_id;
		if( $mode == 1 ){
			 			$modeCondition = ' AND quarantine.itm_report_id <= :report_id AND quarantine_admin.report_id = :report_id';
		}else{
			 			$modeCondition = ' AND quarantine.itm_report_id <= :report_id';
		}
		 		if($adminID){
			$adminCondition = ' AND quarantine_admin.admin_id = :admin_id';
			$values[':admin_id'] = $adminID;
		}
		$query = 'SELECT '.$fields.' FROM quarantine_admin'.
			' LEFT JOIN quarantine ON quarantine_admin.quarantine_id = quarantine.id'.
			' WHERE quarantine.itm_recipient = :itm_recipient'.
			$adminCondition.
			$modeCondition.
			' ORDER BY quarantine.itm_date DESC,quarantine.itm_time DESC';

		$items = $this->query( $query, $values, $result, $id );
		if( ( $mode==1 && $hasRecent==true && count($items) > 0  ) 
			|| ( $mode==2 && count($items) > 0 ) ){
			$send = true;
		}else{
			$items = array();
		}
		return $items;
	}
	public function getBackupDomainIDList( $domain )
	{
		$list = array();
		$api = IcewarpAPI::instance();
		$account = new IceWarpAccount;
		 		$query = " WHERE SndAuthorized = '2' AND SndDomain = '".icewarp_escape_db_string($domain,'antispam')."'";
		 		$query .= " ORDER BY SndCreatedOn DESC, SndCreatedAt DESC";

		$list_flat = $api->QuarantineList("", $query, 0);
		$app = ChallengeApplication::instance();
		$app->message($domain . '(Backup accounts) : ');

		 		 		 		$array = explode("\n", trim($list_flat));
		 		if (count($array)) {
			foreach ($array as $subarray) {
				 				$line = explode(";", $subarray);
				if (count($line) < 8)
					continue;
				 				if($account->Open(trim($line[4]))){
					continue;
				}
				$newItem = array();
				$newItem['itm_hash'] = slToolsCrypt::createHash();
				$newItem['itm_subject'] = trim($line[7]);
				$newItem['itm_sender'] = trim($line[0]);
				$newItem['itm_recipient'] = trim($line[4]);
				$newItem['itm_date'] = trim($line[1]);
				$newItem['itm_time'] = trim($line[5]);
				$newItem['itm_folder'] = trim($line[2]);
				$newItem['itm_flags'] = ChallengeItem::FLAG_BACKUP_DOMAIN_ITEM;
				$result[$newItem['itm_folder']] = $newItem;
			}
		}
		return $result;
	}
	
	public function getBackupDomainItems($report_id, $domain, $mode, &$send = false, $groupBy = false, $hasRecent = true, $fields = '*',$result = 'object', $id = 'id')
	{
		
		$recordName = $this->getWrapperClassName();
		return $this->cache->retrieve( 
			$this->getTable(),
			$recordName,
			false, 
			'*',
			array(
				'condition'=>' itm_recipient LIKE :domain AND (itm_flags & :flags > 0)',
				'value'=>array(
					':domain'=>'%@'.$domain,
					':flags'=>ChallengeItem::FLAG_BACKUP_DOMAIN_ITEM
				)
			),
			0,
			0,
			'itm_date DESC,itm_time DESC',
			false,
			false,
			$groupBy,
			$result,
			$id
		);
	}
	public function getBackupDomainAdminItems($report_id, $domain, $mode, &$send = false, $groupBy = false, $hasRecent = false, $fields = '*',$result = 'object', $id = 'id',$sender = false, $adminID = false)
	{
		$values[':domain'] = '%@'.$domain;
		$values[':report_id'] = $report_id;
		$values[':flags']= ChallengeItem::FLAG_BACKUP_DOMAIN_ITEM;
		
		if( $mode == 1 ){
			 			$modeCondition = ' AND quarantine.itm_report_id <= :report_id AND quarantine_admin.report_id = :report_id';
		}else{
			 			$modeCondition = ' AND quarantine.itm_report_id <= :report_id';
		}
		if($adminID){
			$adminCondition = ' AND quarantine_admin.admin_id = :admin_id';
			$values[':admin_id'] = $adminID;
		}
		$query = 'SELECT '.$fields.' FROM quarantine_admin'.
			' LEFT JOIN quarantine ON quarantine_admin.quarantine_id = quarantine.id'.
			' WHERE (itm_flags & :flags > 0) AND quarantine.itm_recipient LIKE :domain'.
			$adminCondition.
			$modeCondition.
			' ORDER BY quarantine.itm_date DESC,quarantine.itm_time DESC';
		$items = $this->query( $query, $values, $result, $id );
		if( ( $mode==1 && $hasRecent==true ) 
			|| ( $mode==2 && count($items) > 0 ) ){
			$send = true;
		}else{
			$items = array();
		}
		return $items;
	}
	public function syncBackupDomain($domain, $report_id, &$hasRecent, $adminID = false, $relationStorage = false,&$newOut = array() )
	{
		$app = ChallengeApplication::instance();
		$relation = array();
		$relation['admin_id'] = $adminID;
		$relation['report_id'] = $report_id;
		$current = $this->getBackupDomainIDList( $domain);
		$adminItems = $this->getBackupDomainAdminItems( 
			$report_id, 
			$domain,
			2,
			$send,
			false,
			true,
			'id,itm_folder,itm_sender,itm_recipient', 
			'array',
			'itm_folder',
			false,
			$adminID
		);
		$personalItems = $this->getBackupDomainItems( 
			$report_id, 
			$domain, 
			2, 
			$send, 
			false, 
			true, 
			'*', 
			'array',
			'itm_folder'
		);
		
		$cached = slToolsPHP::array_merge($personalItems,$adminItems);
		$this->cache->transaction();
		foreach($current as $itemID => $itemPath){
			if(!isset($cached[$itemID])){
				 				try{
					$item = $this->getItemDetail(					$itemPath,
						$report_id,
						$domain, 
						$itemID, 
						$adminID,
						false,
						false
					);
				}catch(Exception $e){
					 					continue;
				}
				$cacheItem = $this->safeCreate( $item, true );
				$cacheID = $cacheItem->getID();
				$sender = $item['itm_sender'];
				$rcp = $item['itm_recipient'];
				$backupUsers[$rcp]['new'][$sender] = $sender;
				$hasRecent = true;
				echo '.';
			}else{
				$cacheID = $cached[$itemID]['id'];
				$sender = $cached[$itemID]['itm_sender'];
				$rcp = $cached[$itemID]['itm_recipient'];
				echo '.';
				$backupUsers[$rcp]['all'][$sender] = $sender;
			}
			 			if(!isset($personalItems[$itemID]) && $adminID == false){
				$item = array();
				$item['itm_seen_by_owner'] = $report_id;
				$this->update( array('id'=>$cacheID), $item, true );
				$newPersonal[$sender.'#'.$rcp] = $sender;
				$backupUsers[$rcp]['new'][$sender] = $sender;
			}else{
				$backupUsers[$rcp]['all'][$sender] = $sender;
				$existingPersonal[$sender.'#'.$rcp] = $sender.'#'.$rcp;
			}
			 			if(!isset($adminItems[$itemID]) && $adminID != false){
				$relation[$this->getTable().'_id'] = $cacheID;
				
				try{
					$relationStorage->create($relation , true);
				}catch(Exception $e){
					
				}
				$backupUsers[$rcp]['new'][$sender] = $sender;
				$newAdmin[$sender.'#'.$rcp] = $sender.'#'.$rcp;
			}else{
				$backupUsers[$rcp]['all'][$sender] = $sender;
				$existingAdmin[$sender.'#'.$rcp] = $sender.'#'.$rcp;
			}
			unset( $cached[$itemID] );
		}
		if(is_array($backupUsers) && !empty($backupUsers)){
			foreach($backupUsers as $backupKey => $backupUser){
				if(is_array($backupUser['new']) && !empty($backupUser['new'])){
					$app->message($backupKey.' (quarantine - new):');
					foreach($backupUser['new'] as $rcp){
						$app->message("Quarantine::syncBackupDomain(new) From: ".$rcp.', To: '.$backupKey);
					}
				}
				$app = ChallengeApplication::instance();
				if($app->getLogging()>3){
					if(is_array($backupUser['all']) && !empty($backupUser['all'])){
						$app->message($backupKey.' (quarantine - all):');
						foreach($backupUser['all'] as $rcp){
							$app->message("Quarantine::syncBackupDomain(all) From: ".$rcp.', To: '.$backupKey);
						}
					}
				}
			}
		}
		foreach($cached as $item){
			 			$this->delete( $item['id'], true );
			if($relationStorage){
				$condition[$this->getTable().'_id'] = $item['id'];
				$relationStorage->delete( $item['id'] ,true, $condition);
			}
		}
			 		if( $adminID != false ){
			$existing = &$existingAdmin;
			$new = &$newAdmin;
		}else{
			$existing = &$existingPersonal;
			$new = &$newPersonal;
		}
		foreach($existing as $key => $val){
			unset($new[$key]);
		}
		if(count($new)){
			$newOut = $new;
			$hasRecent  = true;
		}else{
			$hasRecent = false;
		}
		$this->cache->commit();
	}
}

?>