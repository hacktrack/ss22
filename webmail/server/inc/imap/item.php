<?php
 
class IMAPItem extends CacheItem {
	static $fullFlags = '\\Answered \\Flagged \\Seen $Forwarded';

	public $msgExt;
	public $wmclass;

	 
	public function __construct($folder, $itemID, $rid,$size, $date, $flags, 
								$from, $to, $subject, $staticFlags, $priority, $color,
								$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
								$sto,$scc,$sbcc,$ssms,$message_id,$item_moved = 0,$file = '',$flag_update = false,
								$source_folder_id = false,$is_hidden = false,$dummy_id = false,$taglist = '')
	{
		$this->msgExt = '.imap';
		parent::__construct($folder, $itemID, $rid, $size, $date, $flags, 
							$from, $to, $subject, $staticFlags, $priority, $color,
							$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
							$sto,$scc,$sbcc,$ssms,$message_id,$item_moved,$file,$flag_update,
							$source_folder_id,$is_hidden,$dummy_id,$taglist);
		$this->wmclass = 'M';
	}

	 
	public static function decode(&$item, $staticFlags = false, $folder = false, $protocolHandler = false)
	{
		$item->from =  MailParse::quoteAddresses( $item->from ) ;
		$item->to =  MailParse::quoteAddresses( $item->to ) ;
		if($item->cc){
		    $item->cc =  MailParse::quoteAddresses( $item->cc ) ;
		}
		$item->sort_from = Tools::dbSortValue($item->from);
		$item->sort_to = Tools::dbSortValue($item->to);
		$item->subject = trim( MailParse::decodeMimeHeader($item->subject) );


		$item->color = 'Z';
		$item->flags = self::decodeFlags($item);
		if($item->flags & Item::FLAG_FLAGGED){
			$item->color = 1;	
		}
		if ($item->flags & Item::FLAG_COMPLETED){
			$item->color = 'Y';
		}

		$item->priority  = isset($item->priority) ? intval($item->priority) : Item::NORMAL_PRIORITY;
		$item->staticFlags = isset($staticFlags['flags']) ? $staticFlags['flags'] : 0;
		$item->sMimeStatus = isset($staticFlags['smime_status']) ? $staticFlags['smime_status'] : 0;
		$item->hasAttachments = isset($staticFlags['has_attachment']) ? $staticFlags['has_attachment'] : false;
		 		 		$item->date = $item->internaldate;
		$item->taglist = strval($item->keywords);
		if(!$item->date) $item->date = time();

  } 

	 
	 	public static function create(&$folder, $item = array(),$cache = array(), $file = false, $message = false, $bNoCache = false, $date = false,$passphrase = '')
	{
		$account = $folder->account;
		 
		$imap = IMAP::instance($account);
		
		$newID = $bNoCache;

		$item = $imap->createMessage($folder->name, $message, $file, $newID, $date);

		$staticFlags = parent::getStaticFlags($message,true,$file,$passphrase);
		self::decode($item, $staticFlags);

		if($bNoCache)
			$result = $newID;
		else
			 
			$result = parent::create($folder, $item, $cache,$file, $message);
		return $result;
	}
		
	
	 
	 	public function edit($file, $message = false, $item = array(),$cache = array(), $passphrase = '')
	{
		if(User::isClosedSession() && strtolower($_SESSION['DBTYPE'])!='sqlite'){
			$close = true;
			log_buffer("IMAPItem(".$this->folder->name."/".$this->itemID.")->sync() SESSION WRITE CLOSE","EXTENDED");
			User::restoreSession();
		}
		$folder = $this->folder;
		$account = $folder->account;

		 
		$imap = IMAP::instance($account);
		$color = $this->color;
		$tags = $this->getTagList();
		
		$imap->deleteMessage($folder->name, $this->rid);
		$item = $imap->createMessage($folder->name, $message, $file);
		$item->uid = IMAP::fixID($item->uid);
		$staticFlags = $this->getStaticFlags($message,true,$file,$passphrase);
		self::decode($item, $staticFlags);
		
		if($color && $color!=='Z'){
			$item->color = $color;
			$item->flags |= self::FLAG_FLAGGED;
		}
		$item->flags |= self::FLAG_SEEN;
		$imap->setFlags($folder->name,$item->uid,self::encodeFlags($item->flags));
		if($tags){
			$imap->setTagList($this->folder->name,$item->uid,$tags);
		}
		 
		$result = parent::edit($file, $message, $item, $cache);
		if($close && strtolower($_SESSION['DBTYPE'])!='sqlite'){
			
			log_buffer("IMAPItem(".$this->folder->name."/".$this->itemID.")->edit() SESSION WRITE CLOSE","EXTENDED");
			User::closeSession();
		}
	}
	 
	public function delete($cache = array(), $delayed = false)
	{
		$folder  = &$this->folder;
		$account = &$folder->account;
		$delayed = $account->isDelayed();
		if(!$delayed){
			 
			if (!$cache['imap']){
				$cache['imap'] = IMAP::instance($account);
			}
			$cache['imap']->deleteMessage($folder->name, $this->rid);
		}
		 
		return parent::delete($cache,$delayed);
	}


	 
	public function move($folder, $cache = array(), $delayed = false)
	{
		$account = $folder->account;
		$delayed = $account->isDelayed();
		 
		if (!$cache['imap']){
			$cache['imap'] = IMAP::instance($account);
		}
		if(!$delayed){
			$this->rid = $cache['imap']->moveMessage(
				$this->folder->name, 
				$this->rid,
				$folder->name
			);
		}
		 
		parent::move($folder, $cache, $delayed);
	}
	
	
	 
	 	public function copy($folder, $message = '',$cache = array(),$newID = '', $oldID = '', $delayed = false)
	{
		$account = $folder->account;
		if(!$cache['cache']){
			$cache['cache'] = Cache::instance($account->user);
			$fCache = false;
		} else $fCache = true;
		 
		if ($folder->isRemote()){
			$message = $cache['cache']->getMessage(
				$account->accountID, 
				$this->folder->folderID, 
				$this->itemID
			);
		}
		 
		if (!$cache['imap']){
			$cache['imap'] = IMAP::instance($account);
		}
		$oldID = $this->rid;
		$newID = $cache['imap']->moveMessage(
			$this->folder->name,
			$this->rid,
			$folder->name, 
			true
		);
		$oldID = $this->rid;
		 		$newID = false;
		 
		parent::copy($folder, $message, $cache, $newID, $oldID);
	}

	 
	 	public function setFlags($flags, $field = 'flags', $ex = false)
	{
		try{
			if ($field == 'flags') {
				Folder::checkRights($this->folder,Folder::RIGHT_MODIFY);
				 				if (!$this->checkSetFlags($flags, $field))
					return;
				$folder  = $this->folder;
				$account = $folder->account;
				$delayed = $account->isDelayed();
				if($ex){
					$delayed = false;
				}
				 
				if(!$delayed){
					$imap = IMAP::instance($account);
					$imap->setFlags($folder->name, $this->rid, self::encodeFlags($flags));
				}
			}
	
			
		}catch(Exc $e){
			$flags2 = self::encodeFlags($flags);
			log_buffer("IMAPItem->setFlags($flags2,$field,$ex) failed","EXTENDED");
		}
		
		 
		parent::setFlags($flags, $field);
	}
	
	public function markAsRead($ex = false)
	{
		if(!$this->flags || ($this->flags & Item::FLAG_SEEN) <= 0){
			$this->setFlags(Item::FLAG_SEEN,'flags',$ex);
		}
	}
	
	public function markAsUnread()
	{
		$this->unsetFlags(Item::FLAG_SEEN);
	}
	 
	 	protected function unsetFlags($flags, $field = 'flags')
	{
		try{
			Folder::checkRights($this->folder,Folder::RIGHT_MODIFY);
			 			if (!$this->checkUnsetFlags($flags, $field))
				return;
			
			if ($field == 'flags') {
				$folder  = $this->folder;
				$account = $folder->account;
				$delayed = $account->isDelayed();
				 
				if(!$delayed){
					$imap = IMAP::instance($account);
					$imap->unsetFlags($folder->name, $this->rid, self::encodeFlags($flags));
				}
			}
		
			 
			parent::unsetFlags($flags, $field);
		}catch(Exc $e){
			
		}
	}
	
	 
	public static function encodeFlags($flags)
	{
		$aFlags = array();
		$imapFlags = '';
		if ($flags & Item::FLAG_ANSWERED)
			 			$aFlags[] = '\\Answered';
			
		if ($flags & Item::FLAG_DELETED)
			 			$aFlags[] = '\\Deleted';
		if ($flags & Item::FLAG_DRAFT)
			 			$aFlags[] = '\\Draft';
		if ($flags & Item::FLAG_FLAGGED)
			 			$aFlags[] = '\\Flagged';
		if ($flags & Item::FLAG_SEEN)
			 			$aFlags[] = '\\Seen';
			if ($flags & Item::FLAG_FORWARDED)
			 			$aFlags[] = '$Forwarded';
		if ($flags & Item::FLAG_COMPLETED)
			 			$aFlags[] = '$Completed';

		$imapFlags = join(' ',$aFlags);
		return $imapFlags;
	}

	 
	public static function decodeFlags($item)
	{
		$flags = 0;
		$flags |= $item->answered ? Item::FLAG_ANSWERED : 0;
		$flags |= $item->deleted ? Item::FLAG_DELETED : 0;
		$flags |= $item->draft ? Item::FLAG_DRAFT : 0;
		$flags |= $item->flagged ? Item::FLAG_FLAGGED : 0;
		$flags |= $item->recent ? Item::FLAG_RECENT : 0;
		$flags |= $item->seen ? Item::FLAG_SEEN : 0;
		$flags |= $item->completed ? Item::FLAG_COMPLETED : 0;
		$flags |= (isset($item->forwarded) && $item->forwarded) ? Item::FLAG_FORWARDED : 0;
		return $flags;
	}

	 
	private function sync()
	{
		$folder  = $this->folder;
		$account = $folder->account;

		$imap = IMAP::instance($account);
						 
		$item = $imap->getItemDetails($folder->name, $this->rid, false);
		$flags = self::decodeFlags($item);

		 	}
	
	 
	public function getMessage()
	{
		$folder  = $this->folder;
		$account = $folder->account;

		 
		$message = parent::getMessage();

		if ($message === false) {
			 
			$imap = IMAP::instance($account);
			$message = $imap->getMessage($folder->name, $this->rid);

			 
			parent::createMessage($message);
			
			$this->sync();
		} else {
			 			$this->setFlags(Item::FLAG_SEEN);
		}
		return $message;
	}

	 
	public function autoCreateMessage($filename = null)
	{
		$folder  = $this->folder;
		$account = $folder->account;
		 
		if (parent::getMessage() !== false) {
			log_buffer("IMAPItem method autoCreateMessage invalid state","EXTENDED");
			throw new Exc('IMAPItem method autoCreateMessage invalid state');
		}
		$dir = dirname($filename);
		if(!is_dir($dir)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($dir,0777,true);
		}

		$loadIMAP = false;
		$path = null;
		 		if($this->file){
			$path = icewarp_get_message_path($folder->getPath(),$this->file);
			log_buffer("IMAPPAth for ".$folder->name." : ($this->file):".$path,"EXTENDED");
			if(!file_exists($path)){
				$loadIMAP = true;
			}else{
				slSystem::import('tools/icewarp');
				slToolsIcewarp::iw_copy($path,$filename);
			}
		}else{
			log_buffer("IMAPPath LOAD for ".$folder->name." : ($this->file):".$path,"EXTENDED");
			$loadIMAP = true;
		}
		if($loadIMAP){
			$imap = IMAP::instance($account);
			$imap->saveMessageToFile($folder->name, $this->rid, $filename);
		}

		Tools::checkMessageEnd($filename);
		 
		return true;
	}
  	
	public function getBody()
	{
		  
	}
	public function getTagList()
	{
		$folder  = $this->folder;
		$account = $folder->account;
		$imap = IMAP::instance($account);
		$tags = $imap->getTagList($folder->name,$this->rid);
		return $tags;
	}
	
	public function setTagList($tags,$updateTagList = true)
	{
		Folder::checkRights($this->folder,Folder::RIGHT_MODIFY);
		$folder  = $this->folder;
		$account = $folder->account;
		$gwAccount = $folder->account->gwAccount;
		$imap = IMAP::instance($account);
		$imap->setTagList($folder->name,$this->rid,$tags);
		if($gwAccount && $updateTagList == true){
			if(is_array($tags) && !empty($tags)){
				foreach($tags as $tag){
					Storage::addTag($gwAccount,$tag);
				}
			}
		}
		if (is_array($tags) && !empty($tags)) foreach($tags as $key => $val){
			$tags[$key] = urlencode($val);
		}
		@$tags = join(' ',$tags);
		$cache['cache'] = Cache::instance($_SESSION['user']);
		$cache['cache']->updateItem($this->itemID, array('taglist'=>$tags), $cache);
	}
	
	public function getLocalMessage($file = null)
	{
		 		$message = icewarp_get_message_path($this->folder->getPath(),$this->file);
		if(!file_exists($message)){
			if($this->source_folder_id){
				$oFolder = $this->folder->account->getFolderById($this->source_folder_id);
				$message = icewarp_get_message_path($oFolder->getPath(),$this->file);
				if(file_exists($message)){
					return $message;
				}
			}
			return $this->syncLocalMessage();
		}
		return $message;
	}
	
	public function syncLocalMessage()
	{
		$imap = IMAP::instance($this->folder->account);
		$file = $imap->syncItemFileID($this->folder->name,$this->rid);
		if($this->file!=$file){
			$update['msg_file'] = $file;
			$cache = Cache::instance($_SESSION['user']);
			$cache->updateItem($this->itemID,$update);
			$this->file = $file;
		}
		$message = icewarp_get_message_path($this->folder->getPath(),$this->file);
		
		if(!file_exists($message)){
			log_buffer("IMAP icewarp_get_message_path failed: [Path:".$this->folder->getPath().",File:".$this->file."]","EXTENDED");
			throw new Exc('imap_fileid_sync_failed');
		}
		return $message;
	}

}

?>
