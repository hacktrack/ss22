<?php
define('IMAP_ITEM_CHUNK_SIZE',1000);
 
 

class IMAP extends slObservable{
	 
	private $imap;

	 
	private $server;

	 
	public $delimiter;
	
	 
	public static $instance;
 	private static $aOpenedMailboxes;
 	public static $fullRights = 'lrswipkcdexta';
	public $initialOpen;
	public $lastMailbox;
	public $accountID;
	public $capabilities;

     
	 
	 

	 
	public static function instance($account) 
	{
		$index = $account->accountID;
		if($account->isGuest){
			throw new Exc('imap_open_guest');
		}
		if (!isset(self::$instance[$index])) {
			$imap = __CLASS__;
			self::$instance[$index] = new $imap(
				$account->server, 
				$account->port, 
				$account->username, 
				$account->getPassword(),
				$account->accountID, 
				$account->secondary,
				$account->charset,
				$account->current_ip
			);
			self::$instance[$index]->attach($account);
		}
    	return self::$instance[$index];
  }
  
   
  public function __clone()
  {
    throw new Exc('imap_clone');
  }

  public function msgNumber($uid)
  {
    return imap_msgno($this->imap,$uid);
  }
  
	
	 
	private function __construct($server, $port = 143, $username, $password, $accountID, $secondary = array(),$charset = 'UTF-8', $current_ip = '127.2.0.1')
	{
		try{
			$this->connect($server, $port, $username, $password, $accountID);
		}catch(Exc $e){
			if($e->wmcode=='imap_authenticate' || $e->wmcode=='account_does_not_exist'){
				throw $e;
			}
			$i = 1;
			log_buffer("1. IMAP connection failed: $server:$port / $username","WARNING");
			if($secondary['IMAP']){
				foreach($secondary['IMAP'] as $connection){
					try{
						$host = $connection['HOST'];
						$port = $connection['PORT']?$connection['PORT']:143;
						$this->connect($host, $port, $username, $password, $accountID);
					}catch(Exc $e){
						log_buffer(++$i.". IMAP connection failed: ".$host.":".$port." / $username","WARNING");
					}
				}
			}
		}
		if(!$this->imap){
			self::error('imap_open');
		}
		
		$capabilities = imap_capabilities($this->imap);
		foreach($capabilities as $key => $capability){
			if(is_array($capability)){
				foreach($capability as $subKey => $subVal){
					$this->capabilities[$key][$subKey] = true; 
				}
			}else{
				$this->capabilities[$key] = true;
			}
		}
		if($this->getCapability('METADATA')){
			imap_setmetadata($this->imap, "", "/public/vendor/icewarp/serverinfo/defaultcharset", $charset);
		}
		imap_setmetadata($this->imap, "", "/public/vendor/icewarp/serverinfo/clientip", $current_ip);
		$this->capabilities['HIGHESTMODSEQ'] = isset($this->capabilities['X-ICEWARP-SERVER']) ||  isset($this->capabilities['CONDSTORE']);
		$this->capabilities['SEARCH'] = isset($this->capabilities['MSEARCH']);
		
		 
		if($this->capabilities['X-ICEWARP-SERVER']){
			$this->delimiter = '/';
		}else{
			$list = imap_getmailboxes($this->imap, $this->server, 'INBOX');
			if (!is_array($list) || !$list) self::error('imap_delimiter_retrieval');
			$this->delimiter = $list[0]->delimiter;
		}
	}
	
	private function connect($server, $port, $username, $password, $accountID)
	{
		 		if ($port == 993) $attr = '/ssl/novalidate-cert'; else
		 		if ($port == '110') $attr ='/pop3/notls'; else
		 		if ($port == '995') $attr ='/pop3/ssl/novalidate-cert'; else
		 		$attr = '/notls';
		if(strpos($server,'::')!==false){
			$server = '['.$server.']';
		}
		$this->server = '{' . $server . ($port ? (':' . $port) : '') .  $attr . '}';
		
		@$this->imap = imap_open($this->server, $username, $password, OP_HALFOPEN);
		
		
		if ($this->imap === false){
			$errors = imap_errors();
			if($errors){
				foreach($errors as $error){
					if(stripos($error,'Unknown user or incorrect password')){
						$account = createobject('account');
						if (!$account->Open($accountID)){
							throw new Exc('account_does_not_exist',$username);
						}
						if(!$account->AuthenticateUser($username,$password,$_SERVER['REMOTE_ADDR'])){
							throw new Exc('imap_authenticate',$accountID);
						}
					}
				}
			}
			self::error('imap_open');
		}

		$this->accountID = $accountID;
		$this->initialOpen = true;
		return true;
	}

	 
	public function __destruct()
	{
		if(is_resource($this->imap)){
			imap_close($this->imap, CL_EXPUNGE);
		}
	}

	 
	public function close($account)
	{
		$index = $account->accountID;
		if($this->imap && !$this->initialOpen){
			imap_close($this->imap, CL_EXPUNGE);
		}
		unset(self::$instance[$index]);
	}

	 
	 
	 

	 
	public function getMailboxes($ownerID = 'owner')
	{
        $list = imap_getmailboxes($this->imap, $this->server, '*');
        if (!is_array($list)) self::error('imap_getmailboxes');
        $mailboxes = array();
        foreach ($list as $mailbox) {
            $name = preg_replace( '/^{[^}]*}/', '', $mailbox->name);
                         $mailbox->name	= $this->decode($name);
            $mailboxes[$mailbox->name] = $mailbox;
        }
        return $mailboxes;
	}

	 
	public function createMailbox($mailbox, $ownerID = 'owner',&$attributes = '')
	{
		$mbox	= $this->encode($mailbox);
		$mailbox = $this->server . $mbox;

		if (!imap_createmailbox($this->imap, $mailbox))
			self::error('imap_mailbox_create',$mailbox);
		
		if (!imap_subscribe($this->imap, $mailbox))
			self::error('imap_mailbox_subscribe',$mailbox);
		
		$info = imap_getmailboxes($this->imap, $this->server, $mailbox);
		$attributes = $info[0]->attributes?$info[0]->attributes:0;
		
		$result = $this->getMyRights($mbox);

		 		$this->lastMailbox = $mailbox;
		
		return $result;
	}

	 
	public function deleteMailbox($mailbox)
	{
		$this->openMailbox($mailbox);
		$mailbox = $this->server . $this->encode($mailbox);
		if (!imap_deletemailbox($this->imap, $mailbox))
			self::error('imap_mailbox_delete',$mailbox);
		return true;
	}

	 
	public function renameMailbox($oldMailbox, $newMailbox)
	{
		$oldMailbox = $this->server . $this->encode($oldMailbox);
		$newMailbox = $this->server . $this->encode($newMailbox);

		if (!imap_renamemailbox($this->imap, $oldMailbox, $newMailbox))
			self::error('imap_mailbox_rename',$oldMailbox.'=>'.$newMailbox);
	}

	 
	public function deleteItems($oFolder,$oItems = false,$sequence = false)
	{
		$this->openMailbox($oFolder->name);

	    if ($oItems){
	      $sequence = array();
	      foreach($oItems as $oItem)
	          $sequence[] = $oItem->rid;
	      $sequence = implode(",",$sequence);
	  	}
	    if (!imap_setflag_full($this->imap, $sequence, '\\Deleted',ST_UID) || !imap_expunge($this->imap)){
	  		self::error('imap_mailbox_delete_items');
	  	}
	}
	
	 
	public function moveItems(&$from, $to, $items = false,$copy = false,$sequence = false)
	{
		$this->openMailbox($from->name);
		$nrMessages = imap_check($this->imap)->Nmsgs;
		$target = $this->encode($to->name);
		if ($items!==false){
			$sequence = array();
	    	foreach($items as $item)
	    		$sequence[] = $item->rid;
    		if(count($sequence)>IMAP_ITEM_CHUNK_SIZE){
		    	$chunks = array_chunk($sequence,IMAP_ITEM_CHUNK_SIZE);
		    	$parts = array();
					if(is_array($chunks)) foreach($chunks as $part){
						$parts[] = implode(",",$part);
		  		}
	  		}else{
	  			$parts[0] = implode(",",$sequence);
	  		}
		  }else{
	  		$parts = self::splitSequence($sequence,$nrMessages);
		  }
	  	
	  	$aResult = array();
	  	foreach($parts as $part){
		    if ($copy){
		        if (!($aPartResult = imap_mail_copy($this->imap, $part, $target,CP_UID)) || !imap_expunge($this->imap)){
		    		$aPartResult = array();
		        }
		  	}else{
		  		if (!($aPartResult = imap_mail_move($this->imap, $part, $target,CP_UID)) || !imap_expunge($this->imap)){
					$aPartResult = array();
		        }
		    }
		    $aResult = $aResult + $aPartResult;
	    }
	    foreach($aResult as $rid => $newRid){
	    	$id = IMAP::fixID( $rid );
	    	$newID = IMAP::fixID( $newRid );
	    	unset($aResult[$rid]);
			$aResult[$id] = $newID;
	    }
	    if(!$aResult){
	    	throw new Exc('imap_mailbox_moveitems');
	    }
	    return $aResult;
	}
	
                
	public function countMailboxItems($mailbox)
	{
	  $this->openMailbox($mailbox);
      return imap_check($this->imap)->Nmsgs;
  	}

	 
	public function openMailbox($mailbox, $encoded = false)
	{
		 		if (!$encoded){
			$notencoded = $mailbox;
			$mailbox = $this->server . $this->encode($mailbox);
		}else{
			$notencoded = $this->decode($mailbox);
		}
		 		if ($this->lastMailbox == $mailbox){
			 			if($notencoded == 'INBOX' && $this->initialOpen==true){
				$this->initialOpen = false;
				$this->onFirstOpen($notencoded,$state,false);
				$this->onFolderOpen($notencoded,$state,false);
				$this->setState($state);
			}
			return true;
		}
		
		 		if (!@imap_reopen($this->imap, $mailbox)){
			self::error('imap_mailbox_open',$mailbox);
		}

		$this->lastMailbox = $mailbox;
		$this->onFirstOpen($notencoded,$state,false);
		$this->onFolderOpen($notencoded,$state,false);
		$this->setState($state);
		
		return true;
	}
	 
	 
	 


	 	public function getAcl($mailbox,$encoded = true,$decodeRights = true)
	{
		if(!$this->getCapability('ACL')){
			return array($this->accountID=>IMAPFolder::decodeRights(self::$fullRights));
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		@$acl = imap_getacl($this->imap, $mailbox);
		 		if($decodeRights){
			if($acl) foreach($acl as $email => $right){
				$result[$email] = IMAPFolder::decodeRights($right);
			}
			$acl = $result;
		}
		return $acl;
	}
	
	public function removeAcl($mailbox,$user,$encoded = true)
	{
		if(!$this->getCapability('ACL')){
			return true;
		}
		 		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		return @imap_deleteacl($this->imap,$mailbox,$user);
	}

	
	public function setAcl($mailbox,$aList,$encoded = true)
	{
		if(!$this->getCapability('ACL')){
			return true;
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		if(!is_array($aList)){
			self::error('imap_acl_empty');
		}
		foreach($aList as $email=>$right){
			$imapright = IMAPFolder::encodeRights($right);
			if($right & Folder::RIGHT_REMOVE){
				$this->removeAcl($mailbox,$email);
			}else{
				if(!@$result = imap_setacl($this->imap,$mailbox,$email,$imapright)){
					self::error('Cannot set Acl:'.$mailbox.' id:'.$email.' rights:'.$imapright);
				}
			}
		}
	}
	
	public function getMyRights($mailbox,$encoded = true)
	{
		if(!$this->getCapability('ACL')){
			return self::$fullRights;
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		$rights = @imap_myrights($this->imap,$mailbox);
		return $rights['rights'];
	}
	 
	 
	 

	 
	public function getItemsID($mailbox,$sequence = '1:*',$fUID = 0)
	{
		$this->openMailbox($mailbox);
		if ($num = imap_num_msg($this->imap)) {
			$list = $this->fetchFast($sequence,$fUID);
			if (!$list)
				self::error('imap_mailbox_message_list');

			return $list;
		}
		return array();
	}
	
  public function drop(){}
	
  public function getItems($mailbox,$sequence = '1:*',$fUID = 0)
	{
        $this->openMailbox($mailbox);
        if ($num = imap_num_msg($this->imap)) {
            $list = $this->fetchOverview($sequence, $fUID);
            if (!$list)
                self::error('imap_mailbox_message_list');
            return $list;
        }
        return array();
    }
	
	 
	public function fetchOverview($sequence,$fUID = 0)
	{	  
		return @imap_fetch_overview($this->imap, $sequence,$fUID);
	}
	
	 
	public function fetchFast($sequence,$fUID = 0)
	{
		return @imap_fetch_fast($this->imap, $sequence,$fUID);    
	}
	
	 
	private function fetchStructure($uid)
	{
		return @imap_fetchstructure($this->imap, $uid, FT_UID);
  }

	 
	private function fetchHeaders($uid, $parse = false)
	{	
    $headers = @imap_fetchheader($this->imap, $uid, FT_UID);

    if ($parse) {
			
      $tmp = new MailParse(false,false,false,false,'1',$headers);
			$h =  $tmp->getHeaders();
      		  
      return $h;
		} else {
			return $headers;
		}
  }
  
  public function getAllHeaders()
  {
    return @imap_headers($this->imap);
  }
	
	 
	public function getItemDetails($mailbox, $uid, $getHeaders = true, $item = false)
	{
    $this->openMailbox($mailbox);

    $sequence = @imap_msgno($this->imap, $uid);
        
    if (!$item) {
  		$list = $this->fetchFast($sequence);

  		if (!$list)
  			self::error('imap_message_details',$uid);
  		$result = reset($list);
    } else
      $result = $item;

		if ($getHeaders)
			$this->appendMessageHeaders($result);

		return $result;
	}
	
	 
	private function appendMessageHeaders(&$info, $headers = array())
	{
		if (!$headers) {
			$uid = $info->uid;
			$headers = $this->fetchHeaders($uid, true);
		}
			
		 		foreach ($headers as $key => $value) {
			$info->$key = $value;
		}
	}

	 
	 
	 

	 
	public function getMessage($mailbox, $uid)
	{
		if ($mailbox)
		 $this->openMailbox($mailbox);

		$headers = $this->fetchHeaders($uid);

		if ($headers === false) 
			self::error('imap_no_headers',$uid);

    $body = @imap_body($this->imap, $uid, FT_UID);

		if ($body === false)
			self::error('imap_no_body',$uid);
		return $headers . $body;
	}

	 
	public function saveMessageToFile($mailbox, $uid, $file)
	{
		if ($mailbox)
		 $this->openMailbox($mailbox);
		
		$headers = $this->fetchHeaders($uid);
		
		if ($headers === false) 
			self::error('imap_no_headers',$uid);
		slSystem::import('tools/icewarp');
    	slToolsIcewarp::iw_file_put_contents($file,$headers);
    
    	     	     	if(!imap_savebody_lowmemory($this->imap,$file, $uid)){
      		self::error('imap_no_body',$uid);
    	}
      	return true;
	}
	
	 
	public function createMessage($mailbox, $message, $file,&$newID = false, $date = false)
	{
    	$encoded_mailbox = $this->server . $this->encode($mailbox);

    	if(!$file){
    		 
  			 
  			if (!(@$result = imap_append($this->imap, $encoded_mailbox, $message, NULL, $date))){
  				self::error('imap_create_message');
  			}
  			
		  	$parser = new MailParse(false,false,false,false,'1',$message);
		  	$headers = $parser->getHeaders(true);
    	}else{
			 
			if (!(@$result = imap_append_file($this->imap, $encoded_mailbox, $file, NULL, $date)))
				self::error('imap_message_create');  
		
			$parser = new MailParse($file);
			$headers = $parser->getHeaders(true);  		

		}
		if ($mailbox!="INBOX" && !@imap_reopen($this->imap, $encoded_mailbox))
			self::error('imap_mailbox_open',$encoded_mailbox);  
		$result = @reset($this->fetchOverview($result,FT_UID));
		$newID = IMAP::fixID($result->uid);
		$this->appendMessageHeaders($result, $headers);
		return $result;
	}

	 
	public function deleteMessage($mailbox, $uid)
	{
		log_buffer("Opening Mailbox:".$mailbox,"DEBUG");
		$this->openMailbox($mailbox);

		$deleteResult  = imap_delete($this->imap, $uid, FT_UID);
		if($deleteResult){
			$expungeResult = imap_expunge($this->imap);
		}
	}

	 
	public function moveMessage($srcMailbox, $uid, $dstMailbox, $copy = false)
	{
		$this->openMailbox($srcMailbox);
		
		$mbox = $this->encode($dstMailbox);
		$mailbox = $this->server . $mbox;
		$msgID = $this->fetchOverview(imap_msgno($this->imap, $uid),FT_UID);
		$msgID = $msgID[0]->message_id;
		 
		if ($copy)
		{
			if (!(@$result = imap_mail_copy($this->imap, $uid, $mbox, CP_UID))
			|| !@imap_expunge($this->imap))
			{
				self::error('imap_message_copy',$uid);
			}
		} else {
			if (!(@$result = imap_mail_move($this->imap, $uid, $mbox, CP_UID))
				|| !@imap_expunge($this->imap))
			{
				self::error('imap_move_message',$uid);
			}
		}
		$result = IMAP::fixID(reset($result));
		return $result;
	}

	 
	public function setFlags($mailbox, $uid, $flags)
	{
		$this->openMailbox($mailbox);

		if (!@imap_setflag_full($this->imap, $uid, $flags, ST_UID))
			self::error('imap_flags_set',$uid);
	}

	 
	public function unsetFlags($mailbox, $uid, $flags)
	{
		$this->openMailbox($mailbox);

		if (!@imap_clearflag_full($this->imap, $uid, $flags, ST_UID))
			self::error('imap_flags_clear',$uid);
	}
		
	public function search($mailbox, $sPhrase, $sTag = false)
	{
		$this->openMailbox($mailbox);
		
		if($sPhrase){
			$sPhrase = 'ALL TEXT "'.$sPhrase.'"';
		}
		if($sTag){
			if(is_array($sTag)){
				foreach($sTag as $tag){
					$sPhrase.= " KEYWORD ".slToolsString::urlenquote($tag);
				}
			}else{
				$sPhrase.= " KEYWORD ".slToolsString::urlenquote($sTag);
			}
		}
		$result = imap_search($this->imap, $sPhrase, SE_UID);
		return $result;
	}
  
  public function getBody($mailbox,$itemID){
    $this->openMailbox($mailbox);
    return substr(imap_body($this->imap,$itemID,FT_UID|FT_PEEK),0,DB_BODY_LIMIT);     
  }
	
	
		 
	public function subscribeAccount($sAccountID)
	{
		try{
			 			$prefix = str_replace("\\","/",$_SESSION['SHARED_PREFIX']);
			return $this->createMailbox($prefix.$sAccountID,$this->accountID);
		}catch(Exc $e){
			return false;
		}
	}
	
	 
	public function unsubscribeAccount($sAccountID)
	{
		$prefix = str_replace("\\","/",$_SESSION['SHARED_PREFIX']);
		
		return $this->unsubscribeFolder($prefix.$sAccountID);
	}
	
	
	public function unsubscribeFolder($sFolder, $encoded = false)
	{
		if(!$encoded){
			$sFolder = $this->encode($sFolder);
		}
		$mailbox = $this->server.$sFolder;
		return imap_unsubscribe($this->imap,$mailbox);
	}
	 
	private function getNewMessage($msgID, $mailbox)
	{
		 
		$new = imap_search($this->imap, 'RECENT');

    if (!$new)
      $new = imap_search($this->imap,'UNFLAGGED');
			
      
    if(!$new)
       self::error('imap_message_not_found');
	
		 
		
		$sequence = $new[0].":*";
		
		$candidates = $this->fetchOverview($sequence);
		if($msgID){
      if (count($candidates) == 1) {
  		  $item = reset($candidates);
        if($item->message_id == $msgID)
  			 return $item;
  		} else {
  			foreach ($candidates as $item) {
  				if ($item->message_id == $msgID)
  					return $item;
  			}
  		}
		}
		 		self::error('imap_message_not_found');
	}

	 
	 
	 

	 
	public function encode($mailbox)
  {
    if ($this->delimiter != '/')
    	$mailbox = str_replace('/', $this->delimiter, $mailbox);
    
    return mb_convert_encoding($mailbox, 'UTF7-IMAP', 'UTF-8'); 
  }

   
  public function decode($mailbox)
  {
    $mailbox = mb_convert_encoding($mailbox, 'UTF-8', 'UTF7-IMAP');
    
    if ($this->delimiter != '/')
    $mailbox = str_replace($this->delimiter, '/', $mailbox);
    return $mailbox;
  }

	 
	private static function error($id,$message = '')
	{
		$errors = imap_errors();
		if ($errors && !$id)
			throw new Exc('imap_internal',$errors[0]);
		else 
			throw new Exc($id,$message);
	}
	
	static public function fixID( $id )
	{
		return str_pad($id, 10, '0', STR_PAD_LEFT);
	}

	
	public function splitSemicolon($str,$nrMessages = false)
	{
		$str = explode(':',$str);
		if ($str[1]=='*'){
			$str[1] = intval($nrMessages);
		}
		$count = intval($str[1]) - intval($str[0])+1;
		if($count > IMAP_ITEM_CHUNK_SIZE){
			$lower = intval($str[0]);
			$upper = intval($str[1]);
			$chunkCount = ceil($count/IMAP_ITEM_CHUNK_SIZE);
			for ($i = 1; $i <= $chunkCount;$i++){
				if ($i==$chunkCount){
					$upper = intval($str[1]);
				}else{
					$upper = intval($lower) + IMAP_ITEM_CHUNK_SIZE - 1;
				}
				$range[] = $lower.':'.$upper;
				$lower+=IMAP_ITEM_CHUNK_SIZE;
			}
		}else{
			$range[] = intval($str[0]).":".intval($str[1]);
		}
		return $range;
	}
	
	public function splitSequence($str,$nrMessages = false)
	{
		$range = array('sequences'=>array(),'ids'=>array());
		$str = explode(',',$str);
		foreach($str as $part){
			if(strpos($part,':')){
				$range['sequences'] = slToolsPHP::array_merge(
					$range['sequences'],
					self::splitSemicolon($part,$nrMessages)
				);
			}else{
				$range['ids'][] = $part;
			}
		}
		$result = $range['sequences'];
		if(count($range['ids'])>IMAP_ITEM_CHUNK_SIZE){
			$ids = array_chunk($range['ids'],IMAP_ITEM_CHUNK_SIZE);
			foreach($ids as $part){
				$result[] =implode(',',$part);
			}
		}
		return $result;
	}
	
	public function setDefaultFolder($name,$type)
	{
		if(!$this->getCapability('METADATA')){
			return true;
		}
		$mailbox = $this->encode($name);
		return imap_setmetadata(
			$this->imap,
			$mailbox,
			"/public/vendor/kolab/folder-type/value.shared",
			$type
		);
	}
	
	public function getChannels($mailbox,$encoded = false)
	{
		if(!$this->getCapability('METADATA')){
			return array();
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		$channels = imap_getmetadata(
			$this->imap,
			$mailbox,
			"/public/vendor/icewarp/rss-url/value.shared"
		);
		$channels = Tools::explode_j('|',$channels);
		return $channels;
	}
	
	public function setChannels($mailbox,$channels,$encoded = false)
	{
		if(!$this->getCapability('METADATA')){
			return true;
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		if(is_array($channels) && !empty($channels)){
			$channels = implode('|',$channels);
		}else{
			$channels = '""';
		}
		return imap_setmetadata(
			$this->imap,
			$mailbox,
			"/public/vendor/icewarp/rss-url/value.shared",
			$channels
		);
	}
	
	public function getKeyWords($mailbox,$uid,$encoded = false)
	{
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		 		$overview = imap_fetch_overview($this->imap,$uid,FT_UID);
		@$message = reset($overview);
		$tags = $message->keywords;
		return $tags;
	}
	public function getTagList($mailbox,$uid,$encoded = false)
	{
		 		if(!$encoded){
			$notencoded = $mailbox;
			$mailbox = $this->encode($mailbox);
		}else{
			$notencoded = $this->decode($mailbox);
		}
		$this->openMailbox($notencoded);
		$overview = imap_fetch_overview($this->imap,$uid,FT_UID);
		@$message = reset($overview);
		$tags = $message->keywords;
		 		@$tags = explode(" ",$tags);
		if(is_array($tags) && !empty($tags)){
			foreach($tags as $key => $val){
				$tags[$key] = slToolsString::urldequote($val);
			}
		}
		return $tags;
	}
	
	public function setTagList($mailbox,$uid,$tags,$encoded = false)
	{
		if(!$encoded){
			$notencoded = $mailbox;
			$mailbox = $this->encode($mailbox);
		}else{
			$notencoded = $this->decode($mailbox);
		}
		$this->openMailbox($notencoded);
		$full_tags = $this->getKeyWords($notencoded,$uid,true);
		if($full_tags){
			imap_clearflag_full($this->imap,$uid,$full_tags,FT_UID);
		}
		if(is_array($tags) && !empty($tags)){
			foreach($tags as $key => $val){
				$tags[$key] = slToolsString::urlenquote($val);
			}
		}
		@$tags = join(' ',$tags);
		return imap_setflag_full($this->imap,$uid,$tags,FT_UID);	
	}
	
	public function getFolderPath($mailbox,$encoded = false)
	{
		if(!$this->getCapability('METADATA')){
			return false;
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		$dirpath= imap_getmetadata(
			$this->imap,
			$mailbox,
			"/public/vendor/icewarp/folderinfo/fullfolderpath"
		);
		return $dirpath;
	}

     
	public function getMailboxStatus($mailbox,$encoded = false,$flags = SA_ALL)
	{
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		log_buffer("IMAP::getMailBoxStatus(".$this->server.$mailbox.")","EXTENDED");
		$status = imap_status($this->imap,$this->server.$mailbox,$flags);
		return $status;
	}
	
	public function getChangedUIDList($highestmodreq, $mailbox, $encoded = false)
	{
		if(!$this->getCapability('METADATA') || !$this->getCapability('HIGHESTMODSEQ')){
			return array();
		}
		if(!$encoded){
			$mailbox = $this->encode($mailbox);
		}
		$changedUID = imap_getmetadata(
			$this->imap,
			$mailbox,
			"/public/vendor/icewarp/folderinfo/changedsince/".$highestmodreq
		);
		$changedUID = Tools::parseURL($changedUID);
		return $changedUID;
	}
	
	public function msearch($location,&$aFilterTag,$aFolderIDs,$folderColumnPrefix = '',$itemColumnPrefix = '')
	{
		if(!$this->getCapability('SEARCH')){
			return array();
		}
		$location = '('.$location.')';
		 
		 		if(stripos($aFilterTag['sql'],'{TAG}')!==false){
			preg_match_all('/{TAG}([^{]+){\/TAG}/si',$aFilterTag['sql'],$matches,PREG_SET_ORDER);
			foreach($matches as $match){
				$replace = $match[0];
				$tag = $match[1];
				$ids = imap_msearch($this->imap,$location,'KEYWORD '.slToolsString::urlenquote($tag));
				$condition = array();
				if($ids) foreach($ids as $folder=>$list){
					$fdr = strtolower(trim($folder));
					$decoded_fdr = $this->decode($fdr);
					foreach($list as $key => $val){
						$ids_keyword[$fdr][$key] = IMAP::fixID($val);
					}
					if($ids_keyword[$fdr]){
						$condition[]='( '.$folderColumnPrefix.'folder_id = \''.$aFolderIDs[$decoded_fdr].'\' AND ('.$itemColumnPrefix.'RID IN (\''.join('\',\'',$ids_keyword[$fdr]).'\') ) )';
					}
				}
				
				$aFilterTag['sql'] = str_replace(
					$replace,
					!empty($condition)?' ( '.join(' OR ',$condition).' ) ':'0 = 1',
					$aFilterTag['sql']
				);
				unset($ids);
			}
		}
		
		if(stripos($aFilterTag['sql'],'{FULLTEXT}')!==false){

			preg_match_all('/{FULLTEXT}([^{]+){\/FULLTEXT}/si',$aFilterTag['sql'],$matches,PREG_SET_ORDER);
			foreach($matches as $match){
				$replace = $match[0];
				$fulltext = $match[1];
				$ids = imap_msearch($this->imap,$location,'TEXT '.$fulltext);
				if($ids) foreach($ids as $folder=>$list){
					$fdr = strtolower(trim($folder));
					$decoded_fdr = $this->decode($fdr);
					foreach($list as $key => $val){
						$ids_fulltext[$fdr][$key] = IMAP::fixID($val);
					}
					if($ids_fulltext[$fdr]){
						$condition[]='( '.$folderColumnPrefix.'folder_id = \''.$aFolderIDs[$decoded_fdr].'\' AND ('.$itemColumnPrefix.'RID IN (\''.join('\',\'',$ids_fulltext[$fdr]).'\') ) )';
					}
				}
				$aFilterTag['sql'] = str_replace(
					$replace,
					!empty($condition)?' ( '.join(' OR ',$condition).' ) ':'0 = 1',
					$aFilterTag['sql']
				);
				unset($ids);
			}
		}
		$result = slToolsPHP::array_merge($ids_keyword,$ids_fulltext);
		return $result;
	}
	
	public function syncItemFileID($folderID,$itemID)
	{
		$this->openMailbox($folderID);
		$item = $this->fetchFast($itemID,FT_UID);
		$item = reset($item);
		$fileid = $item->fileid;
		return $fileid;
	}
	
	 	public function onFolderOpen($mailbox,&$state,$ex = true)
	{
		log_buffer("IMAP::onFolderOpen(".$mailbox.") start","EXTENDED");
		foreach($this->aObservers as &$observer){
			if(!isset($observer->changed[$mailbox]) || !$observer->changed[$mailbox]){
				$status = $this->getMailboxStatus($mailbox,false);
				$log = '';
				if($status) foreach($status as $property => $val){
					$log.= $property.'=>'.$val.','; 
				}
				log_buffer("IMAP::onFolderOpen(".$mailbox.") status : ".$log,"EXTENDED");
				$state[$mailbox]['validity'] = $status->uidvalidity;
				$state[$mailbox]['messages'] = $status->messages;
				$state[$mailbox]['unseen'] = $status->unseen;
				$state[$mailbox]['sync_update'] = $status->highestmodseq;
				$state[$mailbox]['path'] = $this->getFolderPath($mailbox,false);
				$state[$mailbox]['local'] = $this->getCapability('X-ICEWARP-SERVER');
				if($ex){
					$this->setState($state);
				}
				$observer->changed[$mailbox] = true;
			}else{
				log_buffer("IMAP::onFolderOpen(".$mailbox.") NO CHANGE","EXTENDED");
			}
		}
	}
	
	public function onFirstOpen($mailbox,&$state,$ex = true)
	{
		log_buffer("IMAP::onFirstOpen(".$mailbox.") start","EXTENDED");
		foreach($this->aObservers as $observer){
			if(!$observer->sessionChanged[$mailbox]){
				$state[$mailbox]['local'] = $this->getCapability('X-ICEWARP-SERVER');
				$state[$mailbox]['rights'] = $this->getMyRights($mailbox,false);
				log_buffer("IMAP::onFolderOpen(".$mailbox.") rights : ".$state[$mailbox]['rights'],"EXTENDED");
				if($ex){
					$this->setState($state);
				}
				$observer->sessionChanged[$mailbox] = true;
			}else{
				log_buffer("IMAP::onFirstOpen(".$mailbox.") NO CHANGE","EXTENDED");
			}
		}
	}
	
	public function getCapability($capability)
	{
		if($this->capabilities[$capability]){
			return $this->capabilities[$capability];
		}else{
			return false;
		}
	}
	
	public function getImapResource()
    {
        return $this->imap;
    }
}

?>