<?php
 
class IMAPFolder extends CacheFolder {

	 	public $type;

	public $subscription_type;
	public $acl;
	public $smartSync;
	public $itemClassName;
	public $validity;
	public $unseen;
	public $last_sync_update;
	public $sync_update;
	public $isLocal;
	public $messages;
	public $toSync;
	public $fullSync;

	 	 
	public function __construct(&$account, $folderID, $name, $rights, $sync = false,$attributes = 0, $path = '',$validity = false,$messages = 0,$unseen = 0,$sync_update = '',$subscription_type = '0')
	{
		parent::__construct($account, $folderID, $name, $rights, $sync, $attributes,$path,$validity,$messages,$unseen,$sync_update);
		$this->last_sync_update = $sync_update;
		$this->type = 'M';
		if($this->isNoSelect()){
		  $this->type = 'X';	
		}
		$this->gw = false;
		$this->itemClassName = 'IMAPItem';
		$this->smartSync = $this->account->primary?true:false;
		$this->fullSync = $this->account->primary?false:true;
		$this->subscription_type = $subscription_type;
	}

	 
	public static function create(&$account, $name, $param = '',$createDual = true, $attributes = false)
	{
		$channels = $param;
		 		if($createDual){
			Folder::createDual($account,$name);
		}
		 		$imap = IMAP::instance($account);
		$rights = $imap->createMailbox($name, $account->accountID, $attributes);
		$rights = self::decodeRights($rights);
		
		 		$folderID = parent::create($account, $name, $rights);
		
		$folder =  new IMAPFolder($account, $folderID, $name, $rights, false, $attributes);
		if($channels){
			$folder->setChannels(null, $channels);
			$folder->channels = $channels;
		}
		return $folder;
	}


	 
	public function delete($bDeleteDual = true)
	{
		 		if(!$this->syncDelayedActions()){
			throw new Exc('delayed_action_timeout');
		}
		$account = $this->account;
		 		$oFolderParent = $this->getParent($account);
		$folders = krsort($account->folders["main"]);
		 		$imap = IMAP::instance($account);
		@$imap->deleteMailbox($this->name);
		 		parent::delete();
		 		unset($account->folders['main'][$this->name]);

		 		if(($oGWFolder = $this->getGWFolder($this->name)) && $bDeleteDual){
			$oGWFolder->delete(false);
		}
  		 		if ($oFolderParent) {
			   			   			  $oParentGWFolder = $this->getGWFolder($oFolderParent->name);
			  if (!($oParentGWFolder === false)) {
				  $bDeleteFlag = true;
			  }else{
			  	$bDeleteFlag = false;
			  }
			   			  $oChildern = $oFolderParent->getChildern($account);
			   			  if ($oChildern===false && $bDeleteFlag) {
					$oGWFolder = $this->getGWFolder($oFolderParent->name);
					if ($oGWFolder->type!='M') $oFolderParent->delete();
			  }
		}
	}

	 
	public function rename($newName,$bRenameDual = true,$checkExistance = true)
	{
		$account = $this->account;
		Folder::checkRename($this->name,$newName);
		
		if($checkExistance){
			try{
				 				$folder = $this->account->getFolder($newName);
				$exist = true;
			}catch(Exc $e){
			}
			if($exist){
				throw new Exc('folder_rename');
			}
		}
		
		$imap = IMAP::instance($account);
		$type = 'M';
		$oldName = $this->name;
		$parent = substr($newName,0,strrpos($newName,$imap->delimiter));

		 		if($parent){
			try{
				$oFolder = $account->getFolder($parent,$type);
			}catch(Exc $e){
				$setDefault = false;
				$parentFolder['name'] = $parent;
				foreach(User::getDefaultFolderList() as $type => $name){
					if($name==$parent){
						$setDefault = true;
						$defaultType = $type;
					}
					
				}
				$oParentFolder = $this->account->createFolder($parentFolder);
				if($setDefault){
					$oParentFolder->setDefault($defaultType);
				}
				 			}
		}
		 		$imap->renameMailbox($this->name, $newName);

		 		parent::rename($newName);
		
		 		$this->account = $_SESSION['user']->getAccount($this->account->accountID);

		 		unset($this->account->folders['main'][$oldName]);
		$this->account->folders['main'][$newName] = $this;
		 		if(($oGWFolder = $this->getGWFolder($oldName)) && $bRenameDual){
			$oGWFolder->rename($newName,false,false);
		}
		
	}

	 
	public function deleteItems($oItems = false,$bNoCache = false,$delayed = 'auto')
	{
		 		if($delayed == 'auto'){
			$delayed = $this->account->isDelayed();
		}
		 		Folder::checkRights($this,Folder::RIGHT_DELETE);
		if(!$delayed){
			$account = $this->account;
			$imap = IMAP::instance($account);
			if($oItems === false){
				$sequence = $this->getItemsSequence();
				$result = $imap->deleteItems($this,$oItems,$sequence);
			}else{	
				$result = $imap->deleteItems($this,$oItems);
			}
		}
		if(!$bNoCache){
			return parent::deleteItems($oItems,$delayed);
		}
		return $result;
	}
	
	public function clearCache()
	{
		parent::deleteItems();
	}
	
	 
	public function moveItems(&$oFolder,$oItems = false, $aMovedID = false, $delayed = false)
	{
		 		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		Folder::checkRights($this,Folder::RIGHT_DELETE);
		$delayed = $this->account->isDelayed();
		 		if(Folder::checkTransfer($this,$oFolder)){
			$delayed = false;
			$aMovedID = Folder::transferItems($oFolder,$oItems);
		 		}else{
			if(!$delayed){
				$account = $this->account;
				$imap = IMAP::instance($account);
				 				if($oItems === false){
					 					$sequence = $this->getItemsSequence();
					$aMovedID = $imap->moveItems($this,$oFolder,$oItems,false,$sequence);
				 				}else{	
					$aMovedID = $imap->moveItems($this,$oFolder,$oItems);
				}
			}
		}
		 
		 		return parent::moveItems($oFolder,$oItems,$aMovedID,$delayed);
	}
	 	
	public function copyItems(&$oFolder,$oItems = false, $aCopiedID = false)
	{
		
		 		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		$delayed = $this->account->isDelayed();
		if($delayed){
			if(!$this->syncDelayedActions()){
				throw new Exc('delayed_action_timeout');
			}
		}
		 		if(Folder::checkTransfer($this,$oFolder)){
			$aCopiedID = Folder::transferItems($oFolder,$oItems,true);
		 		}else{
			$imap = IMAP::instance($this->account);
			if($oItems === false){
				 				$sequence = $this->getItemsSequence();
				$aCopiedID = $imap->moveItems($this,$oFolder,$oItems,true,$sequence);
			 			}else{	
				$aCopiedID = $imap->moveItems($this,$oFolder,$oItems,true);
			}
		}
		 
		 		return parent::copyItems($oFolder,$oItems,$aCopiedID);
	}
	
	public function setAcl($aList,$bSetDual = true)
	{
		$this->account->setAcl($aList,$this->name,$bSetDual);
	}
	
	public function getAcl()
	{
		 
		$this->acl = $this->account->getAcl( $this->name );
		return $this->acl;
	}
	
	public function getMyRights()
	{
		if(!$this->rights){
			$this->rights =  $this->account->getMyRights( $this->name );
		}
		return $this->rights;
	}

	 
	public static function decodeRights($imapRights)
	{
		$wmRights = 0;

		if(strpos($imapRights,'a')!==false){
			$wmRights |= Folder::RIGHT_ADMIN;
		}
		if(strpos($imapRights,'r')!==false){
			$wmRights |= Folder::RIGHT_READ;
		}
		if(strpos($imapRights,'i')!==false){
			$wmRights |= Folder::RIGHT_WRITE;
		}
		if(strpos($imapRights,'w')!==false
		 && strpos($imapRights,'s')!==false){
			$wmRights |= Folder::RIGHT_WRITE;
			$wmRights |= Folder::RIGHT_MODIFY; 
		}
		if((strpos($imapRights,'t')!==false
		 	&& strpos($imapRights,'e')!==false) 
	 	|| strpos($imapRights,'d')!==false){		 			$wmRights |= Folder::RIGHT_DELETE;
			$wmRights |= Folder::RIGHT_EXPUNGE;
		}
		if(strpos($imapRights,'l')!==false){
			$wmRights |= Folder::RIGHT_FOLDER_READ;
		}
		if(strpos($imapRights,'k')!==false 
		|| strpos($imapRights,'c')!==false ){		 			$wmRights |= Folder::RIGHT_FOLDER_WRITE;
		}
		if(strpos($imapRights,'x')!==false
		|| strpos($imapRights,'c')!==false){		 			$wmRights |= Folder::RIGHT_FOLDER_DELETE; 
			$wmRights |= Folder::RIGHT_FOLDER_MODIFY; 
		}
		if(strpos($imapRights,'s')!==false){
			$wmRights |= Folder::RIGHT_SEEN;
		}
		if(strpos($imapRights,'p')!==false){
			$wmRights |= Folder::RIGHT_POST;
		}
		if(strpos($imapRights,'8')!==false){
			$wmRights |= Folder::RIGHT_INHERITED;
		}
		return $wmRights;
	}
	
	
	 	
	public static function encodeRights($wmRights)
	{
		$rights = '';
		 		if($wmRights & Folder::RIGHT_READ){
			$rights.='r';
		}
		 		if($wmRights & Folder::RIGHT_WRITE){
			$rights.='i';
			 			$rights.='p';
		}
		 		if($wmRights & Folder::RIGHT_MODIFY){
			 			$rights.='s';
			 			$rights.='w';
		}
		 		if($wmRights & Folder::RIGHT_DELETE){
			$rights.='et';
		}
		 		if($wmRights & Folder::RIGHT_FOLDER_READ){
			$rights.='l';
		}
		if($wmRights & Folder::RIGHT_FOLDER_WRITE){
			$rights.='k';
		}
		if($wmRights & Folder::RIGHT_FOLDER_DELETE 
		|| $wmRights & Folder::RIGHT_FOLDER_MODIFY){
			$rights.='x';
		}
		 		if($wmRights & Folder::RIGHT_ADMIN) $rights.='a';
		
		return $rights;
	}

	 
	public function createItem($message = false,$file = false,$bNoCache = false,$date = false)
	{
		return IMAPItem::create($this, array(), array(), $file, $message, $bNoCache, $date);
	}
	
	public function markItems( $flag , $oItems = false, $sequence = false )
	{
		$delayed = $this->account->isDelayed();
		try{
			Folder::checkRights($this,Folder::RIGHT_MODIFY);
			return parent::markItems( $flag,$oItems );
		}catch(Exc $e){
			
		}
		if(!$delayed){
			$account = $this->account;
			 			$imap = IMAP::instance( $account );
			if($sequence===false){
				$sequence = $this->getItemsSequence($oItems);
			}
			$imap->setFlags( $this->name, $sequence, IMAPItem::encodeFlags( $flag ) );
		}
	}

	public function unmarkItems( $flag, $oItems = false, $sequence = false  )
	{
		$delayed = $this->account->isDelayed();
		try{
			Folder::checkRights($this,Folder::RIGHT_MODIFY);
			return parent::unmarkItems( $flag,$oItems );
		}catch(Exc $e){
			
		}
		if(!$delayed){
			$account = $this->account;
			 			$imap = IMAP::instance( $account );
			if($sequence===false){
				$sequence = $this->getItemsSequence($oItems);
			}
			$imap->unsetFlags( $this->name, $sequence, IMAPItem::encodeFlags( $flag ) );
		}
	}

	 
	public function sync($acquire_lock = true)
	{	
		
		log_buffer($this->name."->sync(): start","EXTENDED");
		log_buffer($this->name."->fullSync = ".$this->fullSync.";","EXTENDED");
		log_buffer($this->name."->toSync = ".$this->toSync.";","EXTENDED");
		log_buffer($this->name."->sync_update = ".$this->sync_update.";","EXTENDED");
		log_buffer($this->name."->last_sync_update = ".$this->last_sync_update.";","EXTENDED");
		log_buffer($this->name."->isLocal = ".$this->isLocal().";","EXTENDED");
		$thisUpdate = array();
		 		$lockID = urlencode($_SESSION["EMAIL"]."/".$this->name);
		if($acquire_lock){
			if(!icewarp_getlock($lockID)){
				log_buffer($this->name."->sync():  LOCK ACQUIRE PROBLEM : ".$lockID,"EXTENDED");
				return;
			}else{	
				log_buffer($this->name."->sync():  LOCK ACQUIRED : ".$lockID,"EXTENDED");
			}
		}
		try{
			$account = $this->account;
			 			
			try{
				$imap = IMAP::instance($account);
				 				$imap->openMailbox($this->name); 
				$highestmodseq = $imap->getCapability("HIGHESTMODSEQ");
			}catch(Exc $e){
				if($acquire_lock){
					log_buffer($this->name."->sync():  LOCK RELEASED : ".$lockID,"EXTENDED");
					icewarp_releaselock($lockID);
				}
				log_buffer($this->name."->sync(): IMAP::instance() or IMAPFolder(".$this->name.")->openMailbox() problem","EXTENDED");
				return;
			}
			
			if(!$highestmodseq){
				log_buffer($this->name.": MODSEQ not supported on IMAP server => running FULL SYNC ","EXTENDED");
				$this->fullSync = true;
			}
			 			if(!$this->toSync && $this->last_sync_update==$this->sync_update){
				if(!$this->fullSync){
					if($acquire_lock){
						log_buffer($this->name."->sync():  LOCK RELEASED : ".$lockID,"EXTENDED");
						icewarp_releaselock($lockID);
					}
					log_buffer($this->name."->sync(): end (NOTHING CHANGED)","EXTENDED");
					return;
				}
			}
			if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
				log_buffer($this->name."->sync() SESSION WRITE CLOSE","EXTENDED");
				User::closeSession();
				$imap->close($account);
			}
			$oldExecutionTime = ini_alter('max_execution_time',MAX_EXECUTION_TIME);
			icewarp_perflog_begin();
			 			
			if($highestmodseq && $this->smartSync && $this->last_sync_update && !$this->fullSync){
				$syncResult = $this->smartSync();
			 			}else{
				$imap = IMAP::instance($account);
				$imap->openMailbox($this->name);
				$aItemsID = $imap->getItemsID($this->name);
				$syncResult = parent::syncItems($this->itemClassName,$aItemsID,$this);
				$imap->close($account);
				$thisUpdate = array();
				$thisUpdate['last_sync_update'] = $this->sync_update;
				$thisUpdate['sync_update'] = $this->sync_update;
				$thisUpdate['fullSync'] = false;
				$thisUpdate['toSync'] = false;
				$thisUpdate['isLocal'] = $this->isLocal();
				$thisUpdate['messages'] = $this->messages;
				$thisUpdate['unseen'] = $this->unseen;
			}
			if($syncResult && $highestmodseq && $this->sync_update){
				$this->updateCacheFolder(array('sync_update'=>$this->sync_update));
				$thisUpdate = array();
				$thisUpdate['last_sync_update'] = $this->sync_update;
				$thisUpdate['sync_update'] = $this->sync_update;
				$thisUpdate['toSync'] = false;
				$thisUpdate['fullSync'] = false;
				$thisUpdate['isLocal'] = $this->isLocal();
				$thisUpdate['messages'] = $this->messages;
				$thisUpdate['unseen'] = $this->unseen;
				log_buffer($this->name."->sync(): IMAPFolder(".$this->name.")->updateCacheFolder(".join("=>",array('sync_update'=>$this->sync_update)).") set ".$this->name."->last_sync_update=".$this->sync_update."; )","EXTENDED");
			}
			
		}catch(Exc $e){
			log_buffer("Sync Exc : ".print_r($e,true),"EXTENDED");
		}catch(Exception $e){
			log_buffer("Sync Exception : ".print_r($e,true),"EXTENDED");
		}
		 		if($acquire_lock){
			log_buffer($this->name."->sync():  LOCK RELEASED : ".$lockID,"EXTENDED");
			icewarp_releaselock($lockID);
		}
				
		icewarp_perflog_end('IMAPFolder->sync() ['.$this->name.']');
		 		ini_set('max_execution_time',$oldExecutionTime);	
		if(strtolower($_SESSION['DBTYPE'])!='sqlite'){
			log_buffer($this->name."->sync() RESTORE SESSION","EXTENDED");
			User::restoreSession();
		}

		if($thisUpdate){
			 			$account = User::getCurrentUser()->getAccount($this->account->accountID);
			$me = $account->getFolder($this->name);
			foreach($thisUpdate as $property => $value){
				$me->$property = $value;
			}
			log_buffer($this->name."->sync() Set properties : [".join(",",array_keys($thisUpdate))."] (".join(',',$thisUpdate).")","EXTENDED");
		}
		log_buffer($this->name."->sync() end","EXTENDED");
		return $syncResult;
	}
	
	public function smartSync($ignoreSequence = array())
	{
		log_buffer($this->name."->smartSync(): start","EXTENDED");
		
		 		$imap = IMAP::instance($this->account);
		
		log_buffer($this->name."->smartSync(): IMAP::instance()","EXTENDED");
		$cache = array();
		$cache['cache'] = Cache::instance($_SESSION['user']);
		log_buffer($this->name."->smartSync(): Cache::instance()","EXTENDED");
		 		$imap->openMailbox($this->name);  		 		$changedUID = $imap->getChangedUIDList($this->last_sync_update,$this->name);
		log_buffer($this->name."->smartSync(): Changed since last sync: VANISHED:[".$changedUID['vanished']."], CHANGED: [".$changedUID['changed']."]","EXTENDED");
		 		$result = true;
		if(isset($changedUID['changed'])){
			$protocolItem = $this->getProtocolItem($this->itemClassName);
			
			 			$ids['changed'] = $this->sequenceToUIDList($changedUID['changed']);
			$ids['changed'] = array_chunk($ids['changed'],IMAP_ITEM_CHUNK_SIZE);
			$chi = 0;
			foreach($ids['changed'] as $idsChunk){
				$chi++;
				$first = $idsChunk[0];
				$last = $idsChunk[count($idsChunk)-1];
				log_buffer($this->name."->smartSync(): Changed  - $chi. chunk ($first:$last)","EXTENDED");
				log_buffer($this->name."->smartSync(): Changed GET(Cache) start - $chi. chunk","EXTENDED");
				
				$condition = " rid IN('".join("','",$idsChunk)."')";   
				log_buffer($this->name."->smartSync(): CacheItems condition: ".$condition,"EXTENDED");
				
				$forceIndex = $cache['cache']->getForcedIndexSQL('IDX_item_rid');
				
				$aCacheItemsID = $cache['cache']->getItemsIDByCondition($this,$condition,'',$forceIndex);
				
				 				
				log_buffer($this->name."->smartSync(): Changed GET(Cache) end - $chi. chunk","EXTENDED");
				 				
				log_buffer($this->name."->smartSync(): Changed GET(IMAP) start - $chi. chunk","EXTENDED");
				$aItemsID = $imap->fetchFast(join(",",$idsChunk),FT_UID);
				
				 				log_buffer($this->name."->smartSync(): Changed GET(IMAP) end - $chi. chunk","EXTENDED");
				
				log_buffer($this->name."->smartSync(): Changed COMPARE start - $chi. chunk","EXTENDED");
				$subresult = $this->compareItems($aCacheItemsID,$aItemsID,$protocolItem,$cache,$this->itemClassName);
				$result = $subresult && $result;
				log_buffer($this->name."->smartSync(): Changed COMPARE end - $chi. chunk","EXTENDED");
				unset($aCacheItemsID);
				unset($aItemsID);
			}
		}
		 		if($changedUID['vanished']){
			
			$ids['vanished'] = $this->sequenceToUIDList($changedUID['vanished']);
			$ids['vanished'] = array_chunk($ids['vanished'],IMAP_ITEM_CHUNK_SIZE);
			$chi = 0;
			foreach($ids['vanished'] as $idsChunk){
				$chi++;
				$first = $idsChunk[0];
				$last = $idsChunk[count($idsChunk)-1];
				log_buffer($this->name."->smartSync(): Vanished  - $chi. chunk ($first:$last)","EXTENDED");
				log_buffer($this->name."->smartSync(): Vanished GET start - $chi. chunk","EXTENDED");
				$condition = " rid IN('".join("','",$idsChunk)."')";
				$forceIndex = $cache['cache']->getForcedIndexSQL('IDX_item_rid');
				 				$aCacheItemsID = $cache['cache']->getItemsIDByCondition($this,$condition,'',$forceIndex);
				
				log_buffer($this->name."->smartSync(): Vanished GET end - $chi. chunk","EXTENDED");
				log_buffer($this->name."->smartSync(): Vanished DELETE start - $chi. chunk","EXTENDED");
				if ($aCacheItemsID) {
					$subresult = $this->deleteCachedItems($aCacheItemsID, $cache);
					$result = $result && $subresult;
				}
				log_buffer($this->name."->smartSync(): Vanished DELETE end- $chi. chunk","EXTENDED");
				unset($aCacheItemsID);
				unset($aItemsID);
			}
		}
		log_buffer($this->name."->smartSync(): end RESULT: ".$result,"EXTENDED");
		return $result;
	}
	
	public function filterIDs(&$ids,$ignoreList)
	{
		if(is_array($ignoreList) && !empty($ignoreList)){
			foreach($ignoreList as $ignoreID){
				if(isset($ids[$ignoreID])){
					unset($ids[$ignoreID]);
				}
			}
		}	
	}

	public function sequenceToUIDList($sequence)
	{
		$parts = explode(",",$sequence);
		foreach($parts as $part){
			if(strpos($part,':')!==false){
				$range = explode(':',$part);
				for($i = $range[0];$i <= $range[1];$i++){
					$ids[] = IMAP::fixID($i);
				}
			}else{
				$ids[] = IMAP::fixID($part);
			}
		}

		return $ids;
	}
	
	
	public function search(&$aFilterTag)
	{
		$imap = IMAP::instance($this->account);
		 		$aFilterTag['sql'] = $this->filterTagsToSql($aFilterTag['sql']);
		if($aFilterTag['fulltext'] && $_SESSION['FULLTEXT_SUPPORT']){
			$sPhrase = $aFilterTag['fulltext'];
			if($_SESSION['FULLTEXT']){
				return parent::search($aFilterTag);
			} else {
				$result = $imap->search($this->name,$sPhrase);
				if($result) foreach($result as $key=>$val){
					$result[$key] = IMAP::fixID($val);
				}
			}
		}
		
		$aFilterTag = $this->updateSearchFilter($result,$aFilterTag);
		$result = $this->getItems($aFilterTag);
		return $result;
	}

	public function filterTagsToSql($sql)
	{
		return $this->imapFilterTagsToSql($sql);
	}
  
       private function getItemsSequence($oItems = false,&$inOtherFolder = array())
  {
  	if($oItems === false){
	  	$cache = Cache::instance( $_SESSION['user'] );
		$seq = $cache->query(
		'SELECT MIN(rid) AS lower,MAX(rid) AS upper FROM item'.
		' WHERE folder_id = '.$this->folderID
		);
		$result = $seq->fetch();
		return $result['lower'].':'.$result['upper'];
  	}else{
  		foreach($oItems as $oItem){
			$ids[] = $oItem->rid;
		}
		$sequence = join(',',$ids);
		return $sequence;
  	}
  }
  	public function setDefault($type,$updateSettings = true)
	{
		$imap = IMAP::instance($this->account);
		$mail_defaults = array(
			'D'=>'mail.drafts',
			'S'=>'mail.sentitems',
			'H'=>'mail.trash'
		);
		$imap->setDefaultFolder($this->name,$mail_defaults[$type]);
		parent::setDefault($type,$updateSettings);

	}
	
	public function getChannels()
	{
		$imap = IMAP::instance($this->account);
		return $imap->getChannels($this->name);
	}
	
	public function setChannels($mailbox, $channels, $encoded = false)
	{
		$imap = IMAP::instance($this->account);
		return $imap->setChannels($this->name,$channels);
	}
	
	public function updateFolderValidity($validity,&$update,&$sync)
	{
		if($this->validity && $validity && $validity!=$this->validity){
			log_buffer($this->name."->validity change : ".$this->validity."->".$validity,"EXTENDED");
			$cache = Cache::instance($_SESSION['user']);
			$update['uid_validity'] = $validity;
			$update['messages'] = 0;
			$update['unseen'] = 0;
			$update['sync_update'] = 0;
			$this->sync_update = 0;
			$this->unseen = 0;
			$this->messages = 0;
			$this->validity = $validity;
			unset($this->account->aSyncedFolders[$this->folderID]);
			if($this->validity){
				log_buffer($this->name."->clearCache();","EXTENDED");
				$this->clearCache();
				$sync = true;
			}
		}
	}
	
	public function updateFolderRights($rights,&$update)
	{
		if($this->rights!=$rights){
			log_buffer($this->name."->rights change : ".$this->rights."->".$rights,"EXTENDED");
			if($rights){
				$update['rights'] = $rights;
				$this->rights = $rights;
			}
		}
	}
	
	public function updateFolderPath($path,&$update)
	{
		if($this->getPath()!=$path){
			log_buffer($this->name."->path change :  : ".$this->getPath()."->".$path,"EXTENDED");
			$update['path'] = $path;
			$this->setPath($path);
		}
	}
	
	public function updateCacheFolder($update)
	{
		if(!empty($update)){
			$cache = Cache::instance($_SESSION['user']);
			$cache->updateFolder($this->folderID,$update);
		}
	}
	
	protected function updateCacheItems($unseen,$messages,$sync_update,&$update,&$sync)
	{
		if($this->unseen!=$unseen){
			$update['unseen'] = $unseen;
			$this->unseen = $unseen;
		}
		if($this->messages!=$messages){
			$update['messages'] = $messages;
			$this->messages = $messages;
		}
		if($sync_update && $this->sync_update!=$sync_update){
			log_buffer($this->name."->sync_update change : ".$this->sync_update."->".$sync_update."  >> set ".$this->name."->toSync = true;","EXTENDED");
			$this->toSync = true;
			$this->last_sync_update = $this->sync_update;
			$this->sync_update = $sync_update;
		}else{
			 			if($sync_update){
				log_buffer($this->name." set ".$this->name."->toSync = false;","EXTENDED");
				$this->toSync = false;
			}
		}
	}
	
	public function updateState($mailboxState)
	{
		log_buffer($this->name."->updateState() START","EXTENDED");
		$update = array();
		$sync = false;
		if($path = $mailboxState['path']){
			$this->updateFolderPath($path,$update);
		}
		if($rights = $mailboxState['rights'] ?? false){
			$rights = IMAPFolder::decodeRights($rights);
			$this->updateFolderRights($rights,$update);
		}
		if($validity = $mailboxState['validity']){
			$this->updateFolderValidity($validity,$update,$sync);
		}
		$unseen = $mailboxState['unseen'];
		$messages = $mailboxState['messages'];
		$sync_update = $mailboxState['sync_update'];
		log_buffer($this->name."->updateState() unseen:".$mailboxState['unseen'].", messages:".$mailboxState['messages'].", sync_update:".$mailboxState['sync_update'],"EXTENDED");
		$this->updateCacheItems($unseen,$messages,$sync_update,$update,$sync);
		$this->updateCacheFolder($update);
		$this->isLocal = ($mailboxState['local'] && $this->account->primary);
		if($sync){
			$this->sync(false);
		}
	}
	
	public function isLocal()
	{
		if($this->isLocal){
			return true;
		}
		return false;
	}
	
	public function countItems($flags = 0, $positive = true, $filter = "", $search = false)
	{
		$account = &$this->account;
		$cache = Cache::instance($_SESSION['user']);
		$count = $cache->countItems($this, $flags, $positive, $filter, $search);

		if(!$filter && !$search && $flags==0){
			if($this->messages!=$count){
				if($this->account->isDelayed()){
					 					$condition = '( flag_update > 1 OR date = -1 )';
					$delayedItemsID =  $cache->getItemsIDByCondition($this,$condition,'LIMIT 0,1');
					if(count($delayedItemsID)){
						log_buffer($this->name."->countItems : count messages in cache(".$count.") and imap(".$this->messages.") are inconsistent >> skip fullsync due to delayed actions","EXTENDED");
						$this->fullSync = false;
					}else{
						 						$imap = IMAP::instance($this->account);
						$state = $imap->getMailboxStatus($this->name);
						$modseq = $state->highestmodseq;
						$this->toSync = true;
						 						if($modseq <= $this->last_sync_update){
							$this->fullSync = true;
						}
						log_buffer($this->name."->countItems : count messages in cache(".$count.") and imap(".$this->messages.") are inconsistent >> set ".$this->name."->fullSync = ".$this->fullSync.";".$this->name."->toSync = true;","EXTENDED");
					}
				}else{
					$this->toSync = true;
					$this->fullSync = true;
				}
			}
		}

		return $count;
	}
	
	public function unsubscribe()
	{
		$imap = IMAP::instance($this->account);
		return $imap->unsubscribeFolder($this->name);
	}

	public function setNotify($bValue){}

	 
	protected function getFilteredItems(string $filter) : array
	{
		$aFilterTag = [];
		$imapSearch = null;
		if($_SESSION['FULLTEXT_SUPPORT']){
			$imapSearch = new \server\inc\imap\Search($this, $filter);
		}
		if(!$imapSearch instanceof \server\inc\imap\Search || !$imapSearch->isSearchEnabled() || !($aFilterTag['sql'] = $imapSearch->getSearchSql())) {
			require_once(SHAREDLIB_PATH . 'tools/search.php');
			$search = new SearchTool();
			$search->setType($this->getType());
			$search->setAccount($this->account);
			$search->setFolder($this);
			$aFilterTag = ['sql' => $search->parse($filter, $aFilterTag)];
		}
		return $this->getItems($aFilterTag) ?? [];
	}
}

?>
