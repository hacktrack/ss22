<?php
 
class LocalPOPItem extends CacheItem
{
	public $msgExt;
	public $wmclass;

	 
	public function __construct($folder, $itemID, $rid,$size, $date, $flags, 
								$from, $to, $subject, $staticFlags, $priority, $color,
								$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
								$sto,$scc,$sbcc,$ssms,$message_id,$item_moved = 0)
	{
		$this->msgExt = '.tmp';
		parent::__construct($folder, $itemID, $rid, $size, $date, $flags, 
							$from, $to, $subject, $staticFlags, $priority, $color,
							$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
							$sto,$scc,$sbcc,$ssms,$message_id);
							
		$this->wmclass = 'M';
	}
	
	 
	public static function decode(&$item,$staticFlags = false,$folder = false,$protocolHandler = false)
	{
	    	$item->to = slToolsString::fixDistributionListHeader($item->to);
		$item->cc = slToolsString::fixDistributionListHeader($item->cc);
		$item->bcc = slToolsString::fixDistributionListHeader($item->bcc);
		 		 		if (!is_int($item->date))
		  $item->date = strtotime($item->date);

         if(!$item->date || $item->date == -1){
      $sDir = $protocolHandler->mailboxPath;
      
      $sName = strtolower($folder->name)=='inbox'?$sDir:(($sDir.$folder->name).'/');
      
      $sFilename = $sName.$item->uid.localpopmessageext;
      @$item->date = filectime($sFilename);
    }
 	}	
	
		 
	public static function create(&$folder,$item = array(),$cache = array(),$file = false, $message = false,$bNoCache = false)
	{
		$account = $folder->account;

		 
		$lpop = LocalPOP::instance($account);

		$newID = $bNoCache;

		$item = $lpop->createMessage($folder->name, $message, $file, $newID);
		if($bNoCache){
			$return = $newID;
		}else{
		 
			$return =  parent::create($folder, $item, $cache, $file, $message);
		}
		return $return;
	}

	 
	public function delete($cache = array(), $delayed = false)
	{
		$folder  = $this->folder;
		$account = $folder->account;
		
		 
		$lpop = LocalPOP::instance($account);
		$lpop->deleteMessage($folder->name, $this->rid);

		 
		return parent::delete($cache);
	}
	
	 
	public function edit($file ,$message = false, $item = array(), $cache = array())
	{
		$folder = $this->folder;
		$account = $folder->account;

		 
		$lpop = LocalPOP::instance($account);
		$item = $lpop->createMessage($folder->name, $message, $file);
		$lpop->deleteMessage($folder->name, $this->rid);

		 
		return parent::edit($file, $message, $item, $cache);
	}
	
	 
	public function move($folder, $cache = false, $delayed = false)
	{
		$account = $folder->account;

		 
		$lpop = LocalPOP::instance($account);
		$this->rid = $lpop->moveMessage($this->folder->name, $this->rid,
										$folder->name);
		 
		parent::move($folder, $cache);
	}	
	
	 
	public function copy($folder, $message = false,$cache = array(), $newID = '', $oldID = '', $delayed = false)
	{
	  $account = $folder->account;

		 
		  $fCahce = $cache;
			if($cache === false)
       $cache = Cache::instance($account->user);


		 		
		 
		$lpop = LocalPOP::instance($account);
		
		
		$this->rid = $lpop->moveMessage($this->folder->name, $this->rid,
										$folder->name, true);

		 
		parent::copy($folder, $message, $cache);
	}	
	
	 
	public function getMessage()
	{
		$folder  = $this->folder;
		$account = $folder->account;
    
    
		 
		$message = parent::getMessage();

		if ($message === false) {
			 
			$lpop = LocalPOP::instance($account);
			$message = $lpop->getMessage($folder->name, $this->rid);
			 
			parent::createMessage($message);
		} else {
			 			$this->setFlags(Item::FLAG_SEEN);
		}
		
		 		if (substr($message, -5) == "\r\n.\r\n") {
			$message = substr($message, 0, -5);
		} else if (substr($message, -3) == "\n.\n") {
			$message = substr($message, 0, -3);
		}
		
		return $message;
	}
	
	 
	public function autoCreateMessage($filename = null)
	{
		$folder  = $this->folder;
		$account = $folder->account;

		 
		if (parent::getMessage() === false) {

			 
			$lpop = LocalPOP::instance($account);
			
			$lpop->saveMessageToFile($folder->name, $this->rid, $filename);
			Tools::checkMessageEnd($filename);

		} else {
			 			$this->setFlags(Item::FLAG_SEEN);
		}
		return true;
	}

	public function markAsRead()
	{
		$this->setFlags(Item::FLAG_SEEN);
	}
 	public function markAsUnread()
	{
		$this->unsetFlags(Item::FLAG_SEEN);
	} 	
	 
	public function setFlags($flags, $field = 'flags')
	{
		 		if (!$this->checkSetFlags($flags, $field))
			return;
			
		 
		parent::setFlags($flags, $field);
	}

	 
	protected function unsetFlags($flags, $field = 'flags')
	{
		 		if (!$this->checkUnsetFlags($flags, $field))
			return;

		 
		parent::unsetFlags($flags, $field);
	}
	
	public function getServerPath()
	{
		$folder = $this->folder->name;
		$id = $this->rid;
		$lpop = LocalPOP::instance($this->folder->account);
		return $lpop->getItemPath($folder,$id);
	}
	
	public function getLocalMessage($file = null)
	{
		return $this->getServerPath();
	}
	
}
?>
