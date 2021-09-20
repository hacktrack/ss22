<?php
 
class POP3Item extends CacheItem
{
	public $wmclass;

	 
	public function __construct($folder, $itemID, $rid,$size, $date, $flags, 
								$from, $to, $subject, $staticFlags, $priority, $color,
								$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
								$sto,$scc,$sbcc,$ssms,$message_id)
	{
		parent::__construct($folder, $itemID, $rid, $size, $date, $flags, 
							$from, $to, $subject, $staticFlags, $priority, $color,
							$sMimeStatus, $hasAttachments,$body,$cc,$bcc,$sms,$sfrom,
							$sto,$scc,$sbcc,$ssms,$message_id);
		$this->wmclass = 'M';
	}
	
	 
	public static function decode(&$item, $staticFlags = false, $folder = false, $protocolHandler = false)
	{
		 		 		if (!is_int($item->date))
		  $item->date = strtotime($item->date);

         if(!$item->date || $item->date == -1 && $item->received){
      $aReceived = explode(";",$item->received,2);
      $item->date = strtotime(trim($aReceived[1]));
    }
    
         if(!$item->date || $item->date == -1){
      $item->date = time();
    }
		 		$item->to = slMailParse::quoteAddresses($item->to);
		if($item->cc){
		    $item->cc = slMailParse::quoteAddresses($item->cc);
		}
 	}	
	
		 
	public static function create(&$folder, $item = array(), $cache = array(),$file = false, $message = false,$bNoCache = false)
	{
		$account = $folder->account;

		 
		$pop3 = POP3::instance($account);

		$newID = $bNoCache;

		$item = $pop3->createMessage($folder->name, $message, $file, $newID);
		
		if($bNoCache)
		  return $newID;
		else
		 
		  return parent::create($folder, $item, $cache, $file, $message);
	}

	 
	public function delete($cache = array(), $delayed = false)
	{
		$folder  = $this->folder;
		$account = $folder->account;

		 
		$pop3 = POP3::instance($account);
		$pop3->deleteMessage($folder->name, $this->rid);

		 
		parent::delete($cache);
	}
	
	 
	public function edit($file, $message = false, $item = array(), $cache = array(), $passphrase = '')
	{
		$folder = $this->folder;
		$account = $folder->account;

		 
		$imap = IMAP::instance($account);
		
    	$item = $imap->createMessage($folder->name, $message, $file);

    	$imap->setFlags($folder->name,$item->uid,"\\Seen");
    
		$imap->deleteMessage($folder->name, $this->rid);

		if(!$message){
			$message = file_get_contents($file);
		}
		$staticFlags = parent::getStaticFlags($message,true,false,$passphrase);
		self::decode($item, $staticFlags);

		 
		return parent::edit($file, $message, $item, $cache);
	}	
	 
	public function move($folder, $cache = false, $delayed = false)
	{
		$account = $folder->account;

		 
		$pop3 = POP3::instance($account);
		$this->rid = $pop3->moveMessage($this->folder->name, $this->rid,
										$folder->name);
		 
		parent::move($folder, $cache);
	}	
	
	 
	public function copy($folder, $message = false, $cache = array(), $newID = '', $oldID = '', $delayed = false)
	{
	  $account = $folder->account;

		 
		  $fCahce = $cache;
			if($cache === false)
       $cache = Cache::instance($account->user);


		 		
		 
		$pop3 = POP3::instance($account);
		$this->rid = $pop3->moveMessage($this->folder->name, $this->rid,
										$folder->name, true);

		 
		parent::copy($folder, $message, $cache);
	}	
	
	 
	public function getMessage()
	{
		$folder  = $this->folder;
		$account = $folder->account;
    
    
		 
		$message = parent::getMessage();

		if ($message === false) {
			 
			$pop3 = POP3::instance($account);
			$message = $pop3->getMessage($folder->name, $this->rid);

			 
			parent::createMessage($message);
		} 
    
    else {
			 			$this->markAsRead();
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

			 
			$pop3 = POP3::instance($account);
			$message = $pop3->saveMessageToFile($folder->name, $this->rid, $filename);
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
	 
	protected function setFlags($flags, $field = 'flags')
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

	public function getLocalMessage($file = null){}
}
?>
