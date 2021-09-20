<?php

 
abstract class CacheFolder extends Folder
{
	 
	public $account;

	 
	public $folderID;
	public $validity;
	public $unseen;
	public $sync_update;
	public $dateField;
	public $sync;
	public $itemClassName;
	public $errors;
	public $delayedSync;
	public $messages;
	public $path;

	 
	protected function __construct(&$account, $folderID, $name, $rights, $sync, $attributes,$path = false,$validity = false,$messages = 0, $unseen = 0,$sync_update = '')
	{
		$this->sync = $sync ? true : false;
		$this->account = &$account;
		$this->folderID = $folderID;
		$this->attributes = $attributes;
		$this->setPath($path);
		$this->validity = $validity;
		$this->messages = $messages;
		$this->unseen = $unseen;
		$this->sync_update = $sync_update;
		parent::__construct($name, $rights);
		if($this->account->primary){
			foreach(User::$mailFlags as $key=>$val){
				if($this->attributes & $val){
					$this->isDefault = true;
					$this->defaultType = $key;
					User::setDefaultFolder($this->name,$this->defaultType);
				 				}
			}
			if($account->folderClassName == 'LocalPOPFolder'){
				if($defaultType = User::isDefaultFolder($this->name)){
					$this->isDefault = true;
					$this->defaultType = $defaultType;
				}
			}
		}

	}

	 
	protected static function create(&$account, $name, $param = '', $createDual = true)
	{
		$rights = $param?$param:Folder::DEFAULT_RIGHTS;
		$parentFolderName = preg_replace('/\/[^\/]*$/', '', $name);

		if (isset($account->folders['main'][$parentFolderName]))
			$parentFolderID = $account->folders['main'][$parentFolderName]->folderID;
		else
			$parentFolderID = null;

		$cache = Cache::instance($_SESSION['user']);
		$create = (array('account_id' => $account->accountID, 'name' => $name, 'rights' => $rights));
		if($parentFolderID){
			$create['parent_folder_id'] = $parentFolderID;
		}
		return $cache->createFolder($create);
	}

	 
	public function delete($subfolders = 0)
	{
		$account = &$this->account;

		$cache = Cache::instance($_SESSION['user']);
		$cache->deleteFolder($account->accountID, $this->folderID, $subfolders);
		
		$fdr = $this->account->getFolder($this->name);
		if($fdr->isRemote()){
			$cache->deleteMessageDir($account->accountID,$this->folderID);
		}
	}

	public function deleteOlder($sDays)
	{
		 
		$account = &$this->account;

		$cache = Cache::instance($_SESSION['user']);
		$sTime = time() - $sDays * 86400;

		$aFilter['tag'] = 'id,rid,'.$this->dateField;
		$aFilter['sql'] = ' item_moved < ' . $sTime;

		$aOldItems = $this->getItems($aFilter);

		if ($aOldItems)
			$this->deleteItems($aOldItems);
	}

	public function moveItems(&$oFolder, $oItems = false, $aMovedID = false,$delayed = false)
	{
		$cache = Cache::instance($_SESSION['user']);
		return $cache->moveItems($this, $oFolder, $oItems, $aMovedID,$delayed);
	}

	public function copyItems(&$oFolder, $oItems = false, $aCopiedID = false)
	{
		$cache = Cache::instance($_SESSION['user']);
		return $cache->copyItems($this, $oFolder, $oItems, $aCopiedID);
	}
	public function deleteItems($oItems = false,$delayed = false)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		return $cache->deleteItems($this, $oItems,$delayed);
	}
	
	public function saveItems($oItems = false)
	{
		$time = time();
		$fname = 'emails_'.$time.'.zip';
		$filedir =  $_SESSION['user']->getUploadDir('zip').'/';
		$tempdir = $filedir.'files/'.$time.'/';
		$filename = $filedir.$fname;
		 		try{
			require_once(SHAREDLIB_PATH.'tools/zip.php');
			$zip = new slToolsZIP();
			$zip->setTempDir($tempdir);
			$zip->open($filename, ZIPCREATE);
		}catch(Exception $e){
			throw new Exc('ZIPError',"cannot open <$fname>");
		}
		
		if($oItems === false){
			$oItems = $this->getItems();
		}
		if(is_array($oItems)) foreach($oItems as $item) {
			$ifilename = $item->getSubjectFileName();
			$ifilename.='.eml';
			$ifile = $item->getMessageFile();
			if(!file_exists($ifile)){
				$item->autoCreateMessage($ifile);
			}
			$zip->addFile($ifile,$ifilename);
		}
		$zip->close();
		 		$folderID = date('Y-m-d-') . Tools::my_uniqid();
		$itemID = Tools::my_uniqid();
		$_SESSION['user']->addFileAttachment(
			$filename,
			$fname,
			'application/zip',
			$folderID,
			$itemID,
			true
		);
		return array(
			'fullpath'=>$folderID.'/'.$itemID,
			'class'=>'file',
			'file'=>$filename,
			'name'=>$fname,
			'type'=>'appliation/zip'
		);
	}

	public function emptyFolder($sDestinationAccount, $sDestinationFolder, $sFolderType)
	{
		$oUser = $_SESSION['user'];
		 		if ($sDestinationFolder && $sFolderType == 'M') {
			$oDestinationAccount = &$oUser->getAccount($sDestinationAccount);
			$oDestination = &$oDestinationAccount->getFolderWithAutoCreate($sDestinationFolder,
				'main');
			$this->moveItems($oDestination);
		} else {
			$this->deleteItems();
		}
		log_buffer("Emptying folder $this->name , folder is trash: ".($this->isTrash()?"yes": "no"), "EXTENDED");
		if($this->isTrash()){
			$subFolders = $this->getSubfolders();
			if(!empty($subFolders) && is_array($subFolders)){
				foreach($subFolders as $subfolder){
					try{
						$subfolder->delete();
					}catch(Exc $e){
						
					}
				}
			}
		}
	}

	 
	protected function rename($newName)
	{
		$account = $this->account;

		$cache = Cache::instance($_SESSION['user']);
		$cache->renameFolder($account->accountID, $this->folderID, $this->name, $newName);

		$this->name = $newName;
	}
	 
	public function setSubscription($state)
	{
		$account = $this->account;
		$cache = Cache::instance($_SESSION['user']);
		$cache->updateFolder($this->folderID, array('sync' => $state));
		$this->sync = $state ? true : false;
	}


	 
	public function getItems(&$aFilterTag = array('tag'=>'*'), $createObject = true, $ignoreHidden = true)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		 		return $cache->getItems($this, $aFilterTag, $this->itemClassName, $createObject, $ignoreHidden );
	}


	 
	public function getItem( $itemID, $cache = array(), $rid = false)
	{
		$fCache = true;
		if (!($cache['cache'] ?? null) instanceof Cache || empty($cache['cache']->connection)) {
			$cache = array();
			Cache::release();
			$cache['cache'] = Cache::instance($_SESSION['user']);
			$fCache = false;
		}
		 		return $cache['cache']->getItem($this, $this->itemClassName, $itemID, $fCache, $rid);
	}


	 
	public function getChildern($account)
	{
		$account = &$this->account;

		$cache = Cache::instance($_SESSION['user']);
		return $cache->getChildern($account, $account->folderClassName, $this->folderID);
	}

	 
	public function getParent($account = false)
	{
		$account = &$this->account;

		$cache = Cache::instance($_SESSION['user']);
		return $cache->getParent($account, $account->classPrefix . 'Folder', $this->
			folderID);
	}

	 
	protected function getGWFolder($name)
	{
		try {
			if ($this->account->gwAccount)
				$folder = $this->account->gwAccount->getFolder(MerakGWAPI::encode($name));
			else
				$folder = false;
		}
		catch (Exc$e) {
			$folder = false;
		}
		return $folder;
	}


	 
	public function countItems($flags = 0, $positive = true, $filter = "", $search = false)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		return $cache->countItems($this, $flags, $positive, $filter, $search);
	}

	public function markItems($flag, $oItems = false)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		$cache->markFolderItems($this->folderID, $flag, $oItems);
	}

	public function unmarkItems($flag, $oItems = false)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		$cache->unmarkFolderItems($this->folderID,$flag, $oItems);
	}

	 
	protected function syncItems($class, $aItemsID, $folder,$fields = 'item_id,rid,flags,color,msg_file,flag_update,source_folder_id,dummy_id,taglist')
	{
		log_buffer($this->name."->sync() FULL SYNC START","EXTENDED");
		$duplicated = array();
		$account = $this->account;
		 		$cache['cache'] = Cache::instance($_SESSION['user']);
        if($_SESSION['RESET_SYNC']){
            if(strpos($fields,'date')!==false){
                $fields.=','.$cache['cache']->dateField;
            }
        }
		$aCacheItemsID = $cache['cache']->getItemsID($this,true,$duplicated,$class,$fields);
		 		if(!empty($duplicated)){
			log_buffer($this->name."->sync() : Duplicated messages found:".print_r($duplicated,true),"EXTENDED");
			foreach($duplicated as $val){
				$itm['item_id'] = $val;
				$itm['flags'] = 0;
				$aCacheItemsID[] = $itm;
			}
		}		
		 		$protocolItem = $this->getProtocolItem($class);

		 		$result = $this->compareItems($aCacheItemsID,$aItemsID,$protocolItem,$cache,$class);
		

		 		$protocolItem->drop($this->name);

		 		$corrupted_id = $cache['cache']->getItemsIDByCondition($this,'flag_update = 0 AND (is_hidden = 1 OR dummy_id <> 0)');
		if($corrupted_id){
			foreach($corrupted_id as $itm){
				if($itm['dummy_id']){
					$dummy_itms = $cache['cache']->getItemsIDByCondition($this,'item_id = '.$itm['dummy_id']);	
				}
				$aCacheItemsID = slToolsPHP::array_merge($aCacheItemsID,$dummy_itms);
				
			log_buffer($this->name."->sync() Corrupted dummy ids: ".print_R($dummy_itms,true),"EXTENDED");
			}
			$aCacheItemsID = slToolsPHP::array_merge($aCacheItemsID,$corrupted_id);
			log_buffer($this->name."->sync() Corrupted ids: ".print_R($corrupted_id,true),"EXTENDED");
		
		}
				
		 		if ($aCacheItemsID) {
			log_buffer($this->name."->sync() Deleting items(count): ".count($aCacheItemsID),"EXTENDED");
			$this->deleteCachedItems($aCacheItemsID, $cache);
		}
		if($this->errors['item_insert_to_database']){
			log_buffer("Items that could not be inserted to db :".implode($this->errors['item_insert_to_database']),'ERROR');
		}

		
		log_buffer($this->name."->sync() FULL SYNC END result:".$result,"EXTENDED");
		return $result;
	}
	
	public function deleteCachedItems($aCacheItemsID,$cache = array())
	{
		if ($aCacheItemsID) {
			$cache['cache']->transaction();
			foreach ($aCacheItemsID as $rid => $itemID) {
				try{
					$cache['cache']->deleteItem(
						$this->account->accountID, 
						$this->folderID, 
						$itemID['item_id'],
						$cache
					);
					
				}catch(Exception $e){
				}
			}
			return $cache['cache']->commit();
		}else{
			return false;
		}
	}	
	public function getProtocolItem($class)
	{
		$account = &$this->account;
		 		if ($class == 'IMAPItem') {
			$protocolItem = IMAP::instance($account);
		} else if ($class == 'LocalPOPItem') {
			$protocolItem = LocalPOP::instance($account);
		} else if ($class == "POP3Item") {
			$protocolItem = POP3::instance($account);
		} else if ($class == "RSSItem") {
			$protocolItem = RSS::instance($account);
		}else if ($class =="SharedAccountItem"){
			$protocolItem = SharedAccounts::instance($account);
		}else if ($class =="RemindersItem"){
			$protocolItem = Reminders::instance($account);
		}
		return $protocolItem;
	}
	
	public function compareItems(&$aCacheItemsID,&$aItemsID,&$protocolItem,&$cache,$class)
	{
		log_buffer($this->name."->compareItems() START","EXTENDED");

		 		global $sTime,$sMicroTime;
		$aToSyncItems = array();
		if ($aItemsID) {
			$sequence = '';
			$sequences_chunk = array();
			$reset_sequence = false;
			$lastID = -10;
			$s = 0;
			$cache['cache']->transaction();
			foreach ($aItemsID as $oItem) {
				$update = array();
				$color = '';
				$flag_update = false;
				 				if ($class == 'IMAPItem') {
					$oItem->uid = IMAP::fixID($oItem->uid);
				}
				 				if (isset($aCacheItemsID[$oItem->uid])) {
					$itemID = $aCacheItemsID[$oItem->uid];
					log_buffer($this->name."->compareItems() [RID,UID] [".$oItem->uid.",".$itemID['item_id']."] compare started","EXTENDED");
					if ($class == 'IMAPItem') {
						$flags = IMAPItem::decodeFlags($oItem);

						if(($itemID['flag_update'] & 1)<=0) {
							$oldColor = $itemID['color'];
							if ($oItem->completed) {
								$itemID['color'] = 'Y';
							} elseif ($oItem->flagged) {
								if($itemID['color'] == 'Z' || $itemID['color'] == '') $itemID['color'] = '1';
							}else{
								$itemID['color'] = '';
							}
							if ($itemID['color'] != $oldColor) $update['color'] = $itemID['color'];
						}
						if (isset($flags)) {
							 							$newFlags = $flags | ($itemID['flags'] & ~ 63);
							if ($newFlags != $itemID['flags']){
								if(($itemID['flag_update'] & 1) <= 0){
									$update['flags'] = $newFlags;
								}
							}
						}
						 						if(isset($oItem->fileid)){
							$msgFile = $oItem->fileid;
							if($msgFile!=$itemID['msg_file']){
								$update['msg_file'] = $msgFile;
							}
						}
						if(isset($oItem->keywords)){
							$taglist = strval($oItem->keywords);
							if($taglist!=$itemID['taglist']){
								$update['taglist'] = $taglist;
							}
						}
                        if($_SESSION['RESET_SYNC'] && isset($oItem->internaldate)){
							if($oItem->internaldate!=$itemID['date']){
								$update['date'] = $oItem->internaldate;
							}
						}
						if(!empty($update)){
							$what = join(',',array_keys($update));
							$with = join(',',$update);
							
							log_buffer($this->name."->compareItems() update item [RID,UID] [".$oItem->uid.",".$itemID['item_id']."] (".$what."):(".$with.") ","EXTENDED");
							
							$cache['cache']->updateItem(
								$itemID['item_id'],
								$update,
								$cache
							);
						}else{
							log_buffer($this->name."->compareItems() no change ","EXTENDED");
							
						}
					}
					if($class == 'SharedAccountItem'){
						if($oItem->from!=$itemID['header_from']){
							$cache['cache']->updateItem(
								$itemID['item_id'], 
								array('header_from' => $oItem->from), 
								$cache
							);
						}
					}
					 					 					unset($aCacheItemsID[$oItem->uid]);
				} else {
					log_buffer($this->name."->compareItems() [RID] [".$oItem->uid."] is NEW ","EXTENDED");
					 					
					if(!$reset_sequence && ($lastID + 1 == ltrim($oItem->uid,'0'))){
					  $isOpenedSequence = true;	
					}else{
					  if($isOpenedSequence){
					    $sequence.=':'.$lastID.','.ltrim($oItem->uid,'0');	
					  }else{
					    $sequence.=($sequence?',':'').ltrim($oItem->uid,'0');
					  }
					  $isOpenedSequence = false;
					  $reset_sequence = false;	
					}
					$lastID = ltrim($oItem->uid,'0');
					if ($s++ >= CHUNK_SIZE*(sizeof($sequences_chunk)+1)){
						if ($isOpenedSequence){
						  $sequence.=':'.$lastID;	
						}else{
						  $sequence.=','.$lastID;
						}
						$isOpenedSequence = false;
						$sequences_chunk[] = $sequence;
						$sequence = '';
						$reset_sequence = true;
					}
					
					
					if(($class == 'IMAPItem')){
						if(($oItem->flags & Item::FLAG_DELETED) <= 0){
							 							$aToSyncItems[] = $oItem;
						}
					}else{
						$aToSyncItems[] = $oItem;
					}
				}
			}
			$cache['cache']->commit();
		}
		if($isOpenedSequence){
			$sequence.=':'.$lastID;
		}
		if($sequence){
			$sequences_chunk[] = $sequence;
		}
		log_buffer($this->name."->compareItems() to be added: ".count($aToSyncItems),"EXTENDED");			
		 		if ($aToSyncItems) {
			 			unset($aItemsID);
			$aChunkedItems = array_chunk($aToSyncItems, CHUNK_SIZE);
			 			unset($aToSyncItems);
			if ($aChunkedItems)
				foreach ($aChunkedItems as $chunkI => $aSyncItems) {
					
					$aMailItems = array();
					if ($class == 'LocalPOPItem') {
						foreach ($aSyncItems as $k => $v){
							try{
								$aMailItems[$k] = $protocolItem->getItem($this->name, $v->uid);
							}catch(Exc $e){
								
							}
						}
						
					} else if ($class == 'POP3Item') {
						foreach ($aSyncItems as $k => $v){
							try{
								$aMailItems[$k] = $protocolItem->getItemHeaders($this->name, $v->uid);
							}catch(Exc $e){
								
							}
						}
					} else if ($class == 'IMAPItem') {
						 						 						log_buffer("IMAP::getItems() START ($sequences_chunk[$chunkI])","EXTENDED");
						$aMailItems = $protocolItem->getItems($this->name, $sequences_chunk[$chunkI], FT_UID);
						log_buffer("IMAP::getItems() END","EXTENDED");
						
						 
					} else if ($class == "RSSItem" || $class == "SharedAccountItem") {
						$aMailItems = $aSyncItems;
					}
					
					$cache['cache']->transaction();
					foreach ($aMailItems as $oSyncItem) {
						if ($oSyncItem) {
							switch($class){
								case 'IMAPItem':
									IMAPItem::decode($oSyncItem,false,$this,$protocolItem);
								break;
								case 'LocalPOPItem':
									LocalPOPItem::decode($oSyncItem,false,$this,$protocolItem);
								break;
								case 'POP3Item':
									POP3Item::decode($oSyncItem,false,$this,$protocolItem);
								break;
								case 'SharedAccountItem':
									SharedAccountItem::decode($oSyncItem,false,$this,$protocolItem);
								break;
								case 'RemindersItem':
									RemindersItem::decode($oSyncItem,false,$this,$protocolItem);
								break;
								
							}
							 							if ($class == 'IMAPItem') {
								$sRID = IMAP::fixID($oSyncItem->uid);
							} else {
								$sRID = $oSyncItem->uid;
							}
							log_buffer($this->name."->compareItems() create item [RID] [".$sRID."]","EXTENDED");
							$item = array(
									'folder_id' => $this->folderID, 
									'rid' => $sRID,
									'size' => $oSyncItem->size, 
									'date' => $oSyncItem->date, 
									'flags' => $oSyncItem->flags ? $oSyncItem->flags : 0, 
									'header_from' => $oSyncItem->from, 
									'header_to' =>$oSyncItem->to, 
									'subject' => $oSyncItem->subject, 
									'static_flags' => $oSyncItem->staticFlags?$oSyncItem->staticFlags:0, 
									'priority' => $oSyncItem->priority?$oSyncItem->priority:0, 
									'color' => $oSyncItem->color?$oSyncItem->color:'Z',
									'smime_status' => $oSyncItem->sMimeStatus?$oSyncItem->sMimeStatus:0, 
									'has_attachment' => $oSyncItem->hasAttachments ? 'T' : 'F', 
									'body' => $oSyncItem->body ? $oSyncItem->body : null,
									'sort_from'=>Tools::dbSortValue($oSyncItem->from),
									'sort_to'=>Tools::dbSortValue($oSyncItem->to),
									'message_id'=>$oSyncItem->message_id,
									'msg_file'=>$oSyncItem->fileid,
									'taglist'=>$oSyncItem->taglist
							);
							$cache['cache']->createItem(
								$item,
								$cache
							);
						}
					}

					$cache['cache']->commit();
					$cache['cache']->suppressError = false;

					 					$duration = (time()-$sTime+microtime()-$sMicroTime)*1000;
					if($duration > $_SERVER["SERVER_TIMEOUT"]*0.75){
						$lockID = urlencode($_SESSION["EMAIL"]."/".$this->name);
						icewarp_releaselock($lockID);
						log_buffer($this->name."->compareItems() COMPARE TIMED OUT","EXTENDED");
						log_buffer($this->name."->compareItems(): LOCK RELEASED : ".$lockID,"EXTENDED");
						
						return false;
					}
				}
		}
		
		log_buffer($this->name."->compareItems() END","EXTENDED");
		return true;
	}
	
	static public function isJakubLog($folder = false)
	{
		return false;
	}
	
	public function syncTargetFolders($cache)
	{
		$result = true;
		$targetFolders = $cache['cache']->getTargetFoldersID($this);
		if(is_array($targetFolders)) foreach($targetFolders as $folder){
			log_buffer($this->name."->syncTargetFolders - FolderID : ".$folder." start","EXTENDED");
			$oFolder = $cache['cache']->getFolderById($this->account,'IMAPFolder',$folder);
			if($oFolder){
				$result = $result && $oFolder->syncDelayedActions(array(),false);
			}
			log_buffer($this->name."->syncTargetFolders - Name : ".$oFolder->name." completed","EXTENDED");
		}
		return $result;
	}
	
	public function syncDelayedActions($cache = array(),$sync_target_folders = true)
	{
		$this->delayedSync = true;
		 		global $sTime,$sMicroTime;
		 		 		$oldExecutionTime = ini_alter('max_execution_time',MAX_EXECUTION_TIME);
			
		if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
			log_buffer($this->name."->syncDelayedActions() SESSION WRITE CLOSE","EXTENDED");
			User::closeSession();
		}
		if(!$cache['cache']){
			$cache['cache'] = Cache::instance($_SESSION['user']);
		}
		$aDelayedItems = $cache['cache']->getDelayedItemsID($this,false);
		if($sync_target_folders && !$this->syncTargetFolders($cache)){
			return false;
		}
		$aUpdatedFlags = array();
		$aDeleted = array();
		$aMoved = array();
		if(is_array($aDelayedItems) && !empty($aDelayedItems)){
			foreach($aDelayedItems as $rid => $aItem){
				if($aItem['flag_update'] > 0){
					$itm = new stdClass();
					$itm->rid = $rid;
					$itm->itemID = $aItem['item_id'];
					$itm->flag_update = $aItem['flag_update'];
					if($aItem['flag_update'] & 4){						$itm->dummy_id = $aItem['dummy_id']; 
					}
					$itm->source_folder_id = $aItem['source_folder_id'];
					$fdrID = ($aItem['source_folder_id'])?$aItem['source_folder_id']:$this->folderID;
				}
				 				if($aItem['flag_update'] & 2){
					$aDeleted[$fdrID][$rid] = $itm;
				}else{
					 					if($aItem['flag_update'] & 1 ){
						$aUpdatedFlags[$fdrID][$aItem['flags']][$rid] = $itm;
					}
					 					if($aItem['flag_update'] & 4){
						$aMoved[$fdrID][$rid] = $itm;
					}
				}
			}
			
			if($aMoved || $aUpdatedFlags || $aDeleted){
				if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
					log_buffer($this->name."->syncDelayedActions() RESTORE SESSION","EXTENDED");
					User::restoreSession();
				}
				$imap = IMAP::instance($this->account);
				$close = true;
			}else{
				$close = false;
			}
			if($aMoved){
				$aMovedID = array();
				$count = 0;
				foreach($aMoved as $fdrID => $aMovedItems){
					log_buffer($this->name."->syncDelayedActions() Moving items: (".count($aMovedItems)."):","EXTENDED");
					$aMovedChunk = array_chunk($aMovedItems,IMAP_ITEM_CHUNK_SIZE);
					foreach($aMovedChunk as $oItems){
						$movedID = array();
						try{
							$oFolder = $this->folderID!=$fdrID?$cache['cache']->getFolderById($this->account,'IMAPFolder',$fdrID):$this;
							if($oFolder!==$this){
								$count+=count($oItems);
								$movedID = $imap->moveItems($oFolder,$this,$oItems);
								log_buffer($this->name."->syncDelayedActions() Moved ids from:(".$oFolder->name."):".join(',',array_keys($movedID)),"EXTENDED");
								log_buffer($this->name."->syncDelayedActions() Moved ids inserted into:(".$this->name."):".join(',',$movedID)." Count:".$count,"EXTENDED");
								log_buffer($this->name."->syncDelayedActions() Moved items total:".$count,"EXTENDED");
								if(!$aMovedID[$fdrID]){
									$aMovedID[$fdrID] = $movedID;
								}else{
									$aMovedID[$fdrID] = slToolsPHP::array_merge($aMovedID[$fdrID],$movedID);
								}						
							}
						 						}catch(Exc $e){
							$this->delayedErrorLog("Delayed MOVE items failed ",$oItems,$oFolder);
						}
						$cache['cache']->syncMoveItems($oFolder,$this,$oItems,$movedID);
						log_buffer($this->name."->syncDelayedActions() CACHE SYNCHRONIZED","EXTENDED");
						 						$duration = (time()-$sTime+microtime()-$sMicroTime)*1000;
						if($duration > $_SERVER["SERVER_TIMEOUT"]*0.75){
							log_buffer($this->name."->syncDelayedActions() end - MOVE TIMED OUT at ".$duration/1000,"EXTENDED");
							return false;
						}
					}
				}
			}
			if($aUpdatedFlags){
				foreach($aUpdatedFlags as $fdrID => $updatedFlags){
					$count = 0;
					try{
						 						 						$oFolder = &$this;
						$clearIDs = array();
						$aIDs = array();
						 						foreach($updatedFlags as $flag=> $items){
							log_buffer($this->name."->syncDelayedActions() Flagging items as ".IMAPItem::encodeFlags($flag).", Count:".count($items),"EXTENDED");
							
							foreach($items as $itm){
								$clearID = isset($aMovedID[$fdrID][$itm->rid])?$aMovedID[$fdrID][$itm->rid]:$itm->rid;
								$clearIDs[$clearID] = $clearID;
							}
						}
						$clearSequence = join(',',$clearIDs);
						
						$imap->unsetFlags(
							$oFolder->name,
							$clearSequence,
							IMAPItem::$fullFlags
						);
						log_buffer($this->name."->syncDelayedActions() Clearing item flags , Count:".count($clearIDs),"EXTENDED");
						 						foreach($updatedFlags as $flag=> $items){
							$aIDs = array();
							$cache['cache']->transaction();
							foreach($items as $itm){
								$rid = isset($aMovedID[$fdrID][$itm->rid])?$aMovedID[$fdrID][$itm->rid]:$itm->rid;
								$fu = isset($aMoved[$fdrID][$itm->rid])?$aMoved[$fdrID][$itm->rid]->flag_update:$itm->flag_update;
								$aIDs[$rid] = $rid;
								 								$cache['cache']->updateItem($itm->itemID,array('flag_update'=>$fu & ~1),$cache);  							}
							if(IMAPItem::encodeFlags($flag)){
								$sequence = join(',',$aIDs);
								$imap->setFlags(
									$oFolder->name,
									$sequence,
									IMAPItem::encodeFlags($flag)
								);
							}
							$count+=count($items);
							log_buffer($this->name."->syncDelayedActions() Flagged count total:(".$count.")","EXTENDED");
							
							$cache['cache']->commit();
						}
						
					 					}catch(Exc $e){
						$oItems = false;
						$this->delayedErrorLog("Delayed FLAG items failed ",$oItems,$oFolder);
					}
					 					$duration = (time()-$sTime+microtime()-$sMicroTime)*1000;
					if($duration > $_SERVER["SERVER_TIMEOUT"]*0.75){
						log_buffer($this->name."->syncDelayedActions() end - FLAGS TIMED OUT at ".$duration/1000,"EXTENDED");
						return false;
					}	
				}
			}
			if($aDeleted){
				$count = 0;
				foreach($aDeleted as $fdrID => $aDeletedItems){
					$oFolder = $this->folderID!=$fdrID?$cache['cache']->getFolderById($this->account,'IMAPFolder',$fdrID):$this;
					log_buffer($this->name."->syncDelayedActions() Deleting items in:".$oFolder->name." (".count($aDeletedItems)."):","EXTENDED");
					$aDeletedChunk = array_chunk($aDeletedItems,IMAP_ITEM_CHUNK_SIZE);
					foreach($aDeletedChunk as $oItems){
						try{
							$imap->deleteItems($oFolder,$oItems);
							$cache['cache']->deleteItems($oFolder,$oItems);
							$count+=count($oItems);
							log_buffer($this->name."->syncDelayedActions() Deleted items total:".$count,"EXTENDED");
						 						}catch(Exc $e){
							$this->delayedErrorLog("Delayed DELETE items failed ",$oItems,$oFolder);
						}
						 						$cache['cache']->updateFolder($oFolder->folderID,array('messages'=>$this->messages-$count));
						 						$duration = (time()-$sTime+microtime()-$sMicroTime)*1000;
						if($duration > $_SERVER["SERVER_TIMEOUT"]*0.75){
							log_buffer($this->name."->syncDelayedActions() end - DELETE TIMED OUT at ".$duration/1000,"EXTENDED");
							return false;
						}
					}
				}
			}
			if($close && strtolower($_SESSION['DBTYPE'])!='sqlite'){
				 
				log_buffer($this->name."->syncDelayedActions() SESSION WRITE CLOSE","EXTENDED");
				User::closeSession();
			}
		}
		
		ini_set('max_execution_time',$oldExecutionTime);
		if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
			log_buffer($this->name."->syncDelayedActions() RESTORE SESSION","EXTENDED");
			User::restoreSession();
		}
		$this->delayedSync = false;
		return true;
	}
	
	

	 	public function search(&$aFilterTag)
	{
		$cache = Cache::instance($_SESSION['user']);
		$oItems = $this->getItems($aFilterTag);

		return $oItems;
	}
	 	public function updateSearchFilter($result, $aFilterTag, $syncField = 'RID')
	{
		if ($result) {
			if (count($result) > DB_MAX_IDS_IN_QUERY){
				$resultCount = DB_MAX_IDS_IN_QUERY;
			}else{
				$resultCount = count($result);
			}
			$sql = '';
			if ($resultCount) {
				$sql =  '('.$syncField.' IN (\'';
				$sql.= implode('\',\'',$result);
				$sql .= '\'))';
			}
			if ($aFilterTag['sql']) {
				$aFilterTag['sql'] = " ( (" . $aFilterTag['sql'] . ") OR " . $sql . " ) ";
			} else {
				$aFilterTag['sql'] = $sql;
			}
		}else{
			if(!$aFilterTag['sql']){
				$aFilterTag['sql'] = 'RID = \'-1\'';
			}
		}
		$aFilterTag['sql'] = '('.$aFilterTag['sql'].')';
		unset($aFilterTag['fulltext']);
		return $aFilterTag;
	}
	
	 	public function setDefault($type,$updateSettings = true)
	{
		log_buffer("(".$this->name.")->setDefault() ".$type,"EXTENDED");
		$oldDefault = User::getDefaultFolder($type);
		User::setDefaultFolder($this->name,$type);
		$old = &$this->account->folders['main'][$oldDefault];
		$new = &$this->account->folders['main'][$this->name];
		$old->isDefault = false;
		$oldID = $old->folderID;
		$oldAttributes = $old->attributes;
		$newID = $new->folderID;
		$newAttributes = $new->attributes;
		if($this->isDefault()){
			unset($_SESSION['DEFAULT_FOLDERS'][$this->defaultType]);
			$unsetOld = true;
			$unsetType = $this->defaultType;
		}
		unset($old->defaultType);
		$new->isDefault = true;
		$new->defaultType = $type;
		$this->isDefault = true;
		$this->defaultType = $type;
		 		if($updateSettings){
			$data = Storage::getUserData();
			$default_folders = &$data['@childnodes']['default_folders'][0]['@childnodes']['item'][0]['@childnodes'];
			$default_folders[User::$mailFolders[$type]][0]['@value'] = $this->account->accountID.'/'.$this->name;
			if($unsetOld && $type!=$unsetType){
				unset($default_folders[User::$mailFolders[$unsetType]]);
			}
			$str = Tools::makeXMLStringFromTree($data,'settings',true);
			log_buffer("(".$this->name.")->setDefault() update settings: ".$str,"EXTENDED");
			Storage::setUserDataStr($str,'default_folders');
		}
		$oldAttributes &= ~(User::$mailFlags[$type] ?? 0);
		$newAttributes |= User::$mailFlags[$type];
		$cache = Cache::instance($_SESSION['user']);
		$cache->updateFolder($oldID,array('attributes'=>$oldAttributes));
		$cache->updateFolder($newID,array('attributes'=>$newAttributes));
		$new->attributes = $newAttributes;
	}
	
	public function getPath()
	{
		return $this->path;
	}
	
	public function setPath($path)
	{
		$this->path = $path;
	}
	
	public function isLocal()
	{
		if($this->account->primary && $this->getPath()){
			return true;
		}
		return false;
	}
	public function isRemote()
	{
		return !$this->isLocal();
	}
	
	private function delayedErrorLog($message,&$oItems = false ,$oFolder = false)
	{
		if($oItems){
			$failedids = array();
			foreach($oItems as $oItem){
				$failedids[$oItem->rid] = $oItem->rid;
			}
		}
		$failedids = join(",",$failedids);
		log_buffer($message.($oFolder?(" (Source: ".$oFolder->name):"")." Target: ".$this->name."\r\nRIDs:".$failedids,"DEBUG");
	}
}

 
?>
