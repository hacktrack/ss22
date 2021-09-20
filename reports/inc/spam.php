<?php

require_once ('cache.php');


class Spam extends ChallengeCacheTable
{

	static public function instance(&$cache)
	{
		$result = parent::instance('Spam', 'spam', $cache);
		$result->SYNC_ID = 'itm_folder';
		return $result;
	}
	
	public function getIDList( $user )
	{
		$type = $user->getAccountType();
		$path = $user->getPath('spam');
		$account = $user->account->EmailAddress;
		$list = array();
		$imap = $type == 0 ? 0 : 1;
		$extension = $imap ? ".imap" : ".tmp";
		if (($dirlist = scandir($path)) === false) {
			return $list;  		}
		$app = ChallengeApplication::instance();
		$app->message("$account (spam folder): ");
		if (count($dirlist)) {
			foreach ($dirlist as $file) {
				 				if ($file == "." || $file == ".." || is_dir($file)) {
					continue;
				}
				 				if (strpos($file, $extension) === false) {
					continue;
				}
				$msgPath = $path . $file;
				$id = substr($file,0,strrpos($file,'.'));
				if( ($pos = strpos($id,'-') ) !==false ){
					$id = substr(0,$pos);
				}
				$list[$id] = $msgPath;
			}
		}
		return $list;
	}
	
	public function getItemDetail( $newItem, $report_id, $account, $itemID, $adminID = false, $path = false )
	{
		slSystem::import('mail/parserlite');
		$ch = ChallengeApplication::instance();
		$ch->getFileTime($path, $msgDate, $msgTime);

		$msgParser = slMailParseLite::openFile( $path );
		$headers = $msgParser->getHeaders(array('subject', 'from', 'received'));
		$newItem = array();
		$newItem['itm_report_id'] = $report_id;
		$newItem['itm_hash'] = slToolsCrypt::createHash();
		$newItem['itm_subject'] = $headers["subject"];
		$newItem['itm_sender'] = $ch->getAddressOnly($headers['from']);
		if(!$newItem['itm_sender']){
			preg_match('/from ([^\s]{1,})/i',$headers['received'],$matches);
			$ip = $matches[1];
			$sender = 'blank:'.$ip;
			$newItem['itm_sender'] = $sender;
		}
		$newItem['itm_recipient'] = $account;
		$newItem['itm_date'] = (int)$msgDate;
		$newItem['itm_time'] = (int)$msgTime;
		$newItem['itm_folder'] = $itemID;
		if($adminID == false){
			$newItem['itm_seen_by_owner'] = $report_id;
		}
		$display = $ch->getDisplayDateTime($newItem['itm_date'],$newItem['itm_time']);
		$ch->message('Spam::getItemDetail From:'.$newItem['itm_sender'].', To:'.$newItem['itm_recipient'].', Subject:'.$newItem['itm_subject'].', Date: '.$display['date'].' '.$display['time']);
		
		return $newItem;
	}
	

	public function getWrapperClassName()
	{
		return 'SpamItem';
	}
	
	 
	public function getItems( $report_id, $account, $mode, &$send = false, $groupBy = false,$hasRecent = false,$fields = '*',$result = 'object',$id = 'id' )
	{
		
		$where ='itm_recipient = :itm_recipient';
		$values[':itm_recipient'] = $account;
		$where = 'itm_recipient = :itm_recipient';
		if( $mode == 1 ){
			$operation = '=';
			$where .= ' AND itm_report_id <= :itm_report_id AND (itm_seen_by_owner = :itm_report_id OR itm_seen_by_owner = 0)';
		}else{
			$operation = '<=';
			$where .= ' AND itm_report_id <= :itm_report_id';
		}
		$values[':itm_report_id'] = $report_id;
		$items = $this->query(
			'SELECT '.$fields.' FROM spam '.
			'WHERE '.$where.' '.
			' ORDER BY itm_date DESC,itm_time DESC',
			$values,
			$result,
			$id
		);
		
		if( ( $mode==1 && $hasRecent==true ) 
			|| ( $mode==2 && count($items) ) ){
			$send = true;
		}else{
			$items = array();
		}
		return $items;
	}
	
	public function getAdminItems( $report_id, $recipient, $mode, &$send = false, $groupBy = false,$hasRecent = false, $fields = '*', $result = 'object', $id = 'id', $sender = false, $adminID = false)
	{
		$values[':itm_recipient'] = $recipient;
		$values[':report_id'] = $report_id;
		if( $mode == 1 ){
			 			$modeCondition = ' AND spam.itm_report_id <= :report_id AND spam_admin.report_id = :report_id';
		}else{
			 			$modeCondition = ' AND spam.itm_report_id <= :report_id';
		}
		 		if($adminID == false){
			$adminCondition = ' AND spam_admin.admin_id = :admin_id';
			$values[':admin_id'] = $adminID;
		}
		$where['value'][':itm_report_id'] = $report_id;
		$query = 'SELECT '.$fields.' FROM spam_admin'.
			' LEFT JOIN spam ON spam_admin.spam_id = spam.id'.
			' WHERE spam.itm_recipient = :itm_recipient'.
			$adminCondition.
			$modeCondition.
			' ORDER BY spam.itm_date DESC,itm_time DESC';
		
		$items = $this->query( $query, $values, $result, $id );
		if( ( $mode==1 && $hasRecent==true && count($items) > 0  ) 
			|| ( $mode==2 && count($items) > 0 ) ){
			$send = true;
		}else{
			$send = false;
			$items = array();
		}
		return $items;
	}

}

?>