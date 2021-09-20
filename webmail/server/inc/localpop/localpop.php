<?php
 
class LocalPOP
{
	private static $instance;

	public $syncList;
	public $email;
	public $mAccount;
	public $mailboxPath;
	public $delimiter;
	public $mAPI;

	 
	public static function instance($account)
	{
		$email = $account->accountID;
		if (!isset(self::$instance[$email]))
		{
			self::$instance[$email] = new LocalPOP($email);
		}
		return self::$instance[$email];
	}

	 
	private function __construct($email)
	{
		$this->email = $email;
		$this->mAPI = createobject('API');
		$this->mAccount = new MerakAccount();
		if(!$this->mAccount->Open($email)){
			if(is_object($_SESSION['user'])){
				unset($_SESSION['user']->aAccounts[$this->email]);
			}
			throw new Exc('account_inaccessible');
		}
		$this->delimiter = '/';
		$this->mailboxPath = $this->getMailboxPath();
	}

	 
	 
	 
	public function getMailboxPath()
	{
		$userpath = $this->mAccount->getProperty("u_fullmailboxpath");
		return $userpath;
		 	}
	 
	public function getMailboxes()
	{
		$mailboxes = array();
		$api = createobject('API');
		$mailboxes = slToolsPHP::array_merge($mailboxes, $this->mailboxDirectories($this->
			mailboxPath, $api));
		return $mailboxes;
	}

	private function mailboxDirectories($path, $api)
	{
		$mailboxes = array();
		$mailboxes = icewarp_get_folder_list($path, 1);
		$mailboxes = Tools::explode_j(CRLF, $mailboxes);

		$_SESSION['SPAM_REMAP'] = false;
		$_SESSION['INBOX_REMAP'] = false;
		$inboxExists = false;
		$return = array();
		foreach ($mailboxes as $nr => $m)
		{
			$itm = new stdClass();
			$itm->name = substr(str_replace('\\', '/', $m), strlen($path), strlen($m) -
				strlen($path) - 1);
			$itm->rights = Folder::DEFAULT_RIGHTS;
			$itm->delimiter = $this->delimiter;
			 			if (substr($itm->name, 0, 5) == '~spam' && $_SESSION['SPAM_FOLDER'])
			{
				$_SESSION['SPAM_REMAP'] = true;
			}
			if (strtolower(substr($itm->name, 0, 5)) == 'inbox')
			{
				$_SESSION['INBOX_FOLDER'] = substr($itm->name, 0, 5);
				$_SESSION['INBOX_REMAP'] = true;
				if (strtolower($itm->name) == 'inbox'){
					$inboxExists = true;
				}
			}
			 			if (strtolower($itm->name == 'spam'))
			{
				continue;
			}
			$itm->name = $this->decode($itm->name);
			if($defaultType = User::isDefaultFolder($itm->name)){
				$itm->isDefault = true;
				$itm->defaultType = $defaultType;
			}

			if ($itm->name
			{
				0}
			!= '~' && strpos($itm->name, '~quarantine') === false)
			{
				$return[] = $itm;
			}
		}
		 		if (!$inboxExists)
		{
			$itm = new stdClass();
			$itm->name = 'INBOX';
			$itm->delimiter = $this->delimiter;
			$itm->rights = Folder::DEFAULT_RIGHTS;
			$return[] = $itm;
		}
		return $return;
	}


	 
	public function createMailbox($mailbox)
	{
		$mailbox = $this->encode($mailbox);
		 		if (file_exists($this->mailboxPath . $mailbox))
		{
			throw new Exc('folder_already_exists', $mailbox);
		}
		slSystem::import('tools/filesystem');
		 		if (slToolsFilesystem::securePath($mailbox) === false)
		{
			throw new Exc('folder_name_bad_char', $mailbox);
		}
		 		slSystem::import('tools/filesystem');
		$result = slToolsFilesystem::mkdir_r($this->mailboxPath . $mailbox, 0777, true);
		return $result;
	}

	 
	public function deleteMailbox($mailbox)
	{
		$mailbox = $this->encode($mailbox);
		
		slSystem::import('tools/filesystem');
		if (slToolsFilesystem::rmdir($this->mailboxPath . $mailbox, false, true) === false)
		{
			throw new Exc('folder_delete', $mailbox);
		}
	}

	 
	public function renameMailbox($oldMailbox, $newMailbox)
	{
		$oldMailbox = $this->encode($oldMailbox);
		$newMailbox = $this->encode($newMailbox);
		if (!is_dir($this->mailboxPath . $oldMailbox))
		{
			throw new Exc('folder_does_not_exist', $oldMailbox);
		}
		 		if (is_dir($this->mailboxPath . $newMailbox) && ($newMailbox == $oldMailbox))
		{
			throw new Exc('folder_already_exists', $newMailbox);
		}
		slSystem::import('tools/filesystem');
		slSystem::import('tools/icewarp');
		if (slToolsFilesystem::securePath($newMailbox) === false)
		{
			throw new Exc('folder_name_bad_char', $newMailbox);
		}
		if (slToolsIcewarp::iw_move($this->mailboxPath . $oldMailbox, $this->mailboxPath . $newMailbox)
			=== false)
		{
			throw new Exc('folder_rename');
		}
	}

	 
	public function emptyMailbox($mailbox)
	{	
		$mailbox = $this->getFolderPath($mailbox);
		$content = glob($mailbox . '*' . localpopmessageext);
		if ($content)
		{
			foreach ($content as $item)
			{
				if (!is_dir($item))
				{
					$this->mAPI->DeleteFileWithUpdate($item);
				}
			}
		}
	}

	public function getFolderPath($mailbox)
	{
		if (strtolower($mailbox) == 'inbox')
		{
			return $this->mailboxPath;
		} else
		{
			$mailbox = self::encode($mailbox);
			return $this->mailboxPath . $mailbox . $this->delimiter;
		}
	}

	 
	 
	 

	public function getItemPath($mailbox, $uid)
	{
		return $this->getFolderPath($mailbox) . $uid . localpopmessageext;
	}

	public function getItem($mailbox, $uid)
	{
		$itm = $this->getItemDetails($mailbox, $uid);
		return $itm;
	}


	 
	public function getItems($mailbox, $sequence = "1:*")
	{
		$mailbox = $this->encode($mailbox);
		$list = array();
		if (!$this->syncList[$mailbox])
		{
			$mbox = $this->getFolderPath($mailbox);
			$itms = glob($mbox . '*' . localpopmessageext);

			if ($itms)
				foreach ($itms as $path => $item)
				{
					
					preg_match('/([a-z0-9-]{0,})/si' . localpopmessageext, $item, $regs);
					$itm = $this->getItemDetails($mailbox, $regs[1]);
					$list[$itm->uid] = $itm;
					unset($itm);
				}
			$this->syncList[$mailbox] = $list;
		}
		if ($sequence != "1:*")
		{
			$range = explode(":", $sequence);
			$range[0] = $range[0] - 1;
			 			if ($range[1] == '*')
			{
				$range[1] = count($this->syncList[$mailbox]);
			}
			$list = array_slice($this->syncList[$mailbox], $range[0], $range[1] - $range[0]);
		}

		return $list;
	}

	 	public function msgNumber($uid, $items)
	{
		$number = 0;
		foreach ($items as $msg)
		{
			$number++;
			if (preg_replace('/e/i', '', $msg->uid) == preg_replace('/e/i', '', $uid))
			{
				return $number;
			}
		}
	}

	 
	public function getItemsID($mailbox, &$handle = false)
	{
		 		$mbox = $this->getFolderPath($mailbox);
		$itms = glob($mbox . '*' . localpopmessageext);
		$list = array();
		if ($itms)
			foreach ($itms as $item)
			{
				$item = basename($item);
				$item = substr($item,0,strrpos($item,'.'));
				$itm = new stdClass();
				$itm->uid = $item;
				$list[$itm->uid] = $itm;
				unset($itm);
			}
		return $list;
	}

	public function drop($mailbox)
	{
		unset($this->syncList[$mailbox]);
	}

	public function countItems($mailbox, &$itemsID = false)
	{
		$itemsID = $this->getItemsID($mailbox);
		return count($itemsID);
	}
	 
	 
	 

	 
	public function getMessage($mailbox, $uid)
	{
		 		 		$path = $this->getItemPath($mailbox, $uid);
		 		 
		$message = str_replace("\n.", "\n", file_get_contents($path));
		return $message;
	}


	 
	public function createMessage($mailbox, $message, $file, &$uid = false)
	{
		 		$mbox = $this->getFolderPath($mailbox);

		 		$path = null;
		$uid = false;
		while (!$uid || file_exists($path))
		{
			$uid = self::generateMessageName();
			$path = $this->getItemPath($mailbox, $uid);
		}
		if ($file === false)
		{
			 			file_put_contents($path, str_replace("\n.", "\n..", $message));
			$this->mAPI->CacheFileWithUpdate($path);
		} else
		{
			$this->mAPI->CopyFileWithUpdate($file, $path);
		}
		
		return $this->getMessageItem($message, $uid, 0, [], $file);
	}

	 
	private function getMessageItem($message, $uid, $flags = 0, $staticFlags = array
		(), $file = false)
	{
		$item = new stdClass();
		$headers = "";
		if ($file === false)
		{
			$separator = strpos($message, "\r\n\r\n");
			if ($separator === false)
			{
				$headers = $message;
			} else
			{
				$headers = substr($message, 0, $separator + strlen("\r\n\r\n"));
			}
			if ($headers)
			{
				$parser = new MailParse(false, false, false, false, '1', $headers);
				$msgHeaders = $parser->getHeaders();
			}
			$item->size = strlen($message);
		} else {
			$parser = new MailParse($file);
			$msgHeaders = $parser->getHeaders();
			$item->size = filesize($file);
		}

		$item->uid = $uid;
		$item->flags = $flags;
		$item->color = 'Z';
		$item->message_id = $msgHeaders['message-id'];
		$item->from = isset($msgHeaders['from']) ? $msgHeaders['from'] : '';
		$item->to = isset($msgHeaders['to']) ? $msgHeaders['to'] : '';
		$item->subject = isset($msgHeaders['subject']) ? $msgHeaders['subject'] : '';
		$item->priority = isset($msgHeaders['priority']) ? intval($msgHeaders['priority']) :
			Item::NORMAL_PRIORITY;
		$item->staticFlags = isset($staticFlags['flags']) ? $staticFlags['flags'] : 0;
		$item->sMimeStatus = isset($staticFlags['smime_status']) ? $staticFlags['smime_status'] :
			0;
		$item->hasAttachments = isset($staticFlags['has_attachment']) ? $staticFlags['has_attachment'] : false;
		$item->date = isset($msgHeaders['date']) ? $msgHeaders['date'] : '';
	     	    if(!$item->date || $item->date == -1){
	      @$item->date = filectime($file);
	    }
	    	 		$item->to = slMailParse::quoteAddresses($item->to);
		if($item->cc){
		    $item->cc = slMailParse::quoteAddresses($item->cc);
		}
   		if(!is_int($item->date)){
			$item->date = strtotime($item->date);
		}
		return $item;
	}

	 
	public function getItemDetails($mailbox, $uid)
	{
		 		 
		$file = $this->getItemPath($mailbox, $uid);
		return $this->getMessageItem(false, $uid, 0, array(), $file);
	}

	 
	private static function generateMessageName()
	{
		 		$prefix = date('YmdHis');
		 		$suffix = intval(mt_rand(0, 9999));
		if ($suffix < 10)
		{
			$suffix = '000' . $suffix;
		} else
			if ($suffix < 100)
			{
				$suffix = '00' . $suffix;
			} else
				if ($suffix < 1000)
				{
					$suffix = '0' . $suffix;
				}
		return $prefix . $suffix;
	}

	 
	public function deleteMessage($mailbox, $uid)
	{
		 		$path = $this->getItemPath($mailbox, $uid);
		if (!$this->mAPI->DeleteFileWithUpdate($path))
		{
			throw new Exc('item_delete', $uid);
		}
	}

	 
	public function moveMessage($srcMailbox, $uid, $dstMailbox, $copy = false)
	{

		$srcFolder = $this->getFolderPath($srcMailbox);
		$dstFolder = $this->getFolderPath($dstMailbox);
		if (!is_dir($srcFolder) || !is_dir($dstFolder))
			throw new Exc('folder_does_not_exist', $srcMailbox . "," . $dstMailbox);
		$nuid = $this->generateMessageName();
		$flags = explode("-", $uid);
		if ($flags[1])
		{
			$flags = $flags[1];
			$nuid .= '-' . $flags;
		}
		if (!$copy)
			$nuid = $uid;
		$srcPath = $this->getItemPath($srcMailbox, $uid);
		$dstPath = $this->getItemPath($dstMailbox, $nuid);
		if ($copy){
			if ($this->mAPI->CopyFileWithUpdate($srcPath, $dstPath) === false)
				throw new Exc('folder_copy', $srcMailbox . '=>' . $dstMailbox);
		} else {
			if ($this->mAPI->MoveFileWithUpdate($srcPath, $dstPath) === false)
				throw new Exc('folder_rename', $srcMailbox . '=>' . $dstMailbox);
		}
		return $nuid;
	}

	 
	public function deleteItems($oFolder, $oItems = false)
	{
		if ($oItems){
			foreach ($oItems as $oItem){
				$this->deleteMessage($oFolder->name, $oItem->rid);
			}
		} else{
			$this->emptyMailbox($oFolder->name);
		}
	}
	 
	public function moveItems(&$oSource, $oDest, $oItems = false, $bCopy = false)
	{
		if ($oItems)
		{
			foreach ($oItems as $oItem)
			{
				$aReturn[$oItem->rid] = $this->moveMessage($oSource->name, $oItem->rid, $oDest->
					name, $bCopy);
			}
		} else
		{
			$oItems = $this->getItemsID($oSource->name);
			foreach ($oItems as $oItem)
			{
				$aReturn[$oItem->uid] = $this->moveMessage($oSource->name, $oItem->uid, $oDest->
					name, $bCopy);
			}
		}
		return $aReturn;
	}

	public static function encode($mailbox)
	{
		$mailbox = mb_convert_encoding($mailbox, 'UTF7-IMAP', 'UTF-8');
		if ($_SESSION['SPAM_REMAP'] && preg_match("/(^spam$|^spam\/)/i", $mailbox, $matches)){
			$mailbox = preg_replace('#spam#i', "~spam", $mailbox, 1);
		}
		if ($_SESSION['INBOX_REMAP'])
			$mailbox = preg_replace('#INBOX#i', $_SESSION['INBOX_FOLDER'], $mailbox, 1);

		return $mailbox;
	}

	public static function decode($mailbox)
	{
		$mailbox = mb_convert_encoding($mailbox, 'UTF-8', 'UTF7-IMAP');
		if ($_SESSION['SPAM_REMAP'] && preg_match("/(^~spam$|(~spam\/))/i", $mailbox, $matches)){
			$mailbox = preg_replace('#~spam#i', "Spam", $mailbox, 1);
		}
		if ($_SESSION['INBOX_REMAP']){
			$mailbox = preg_replace('#' . $_SESSION['INBOX_FOLDER'] . '#', 'INBOX', $mailbox,
				1);
		}
		return $mailbox;
	}

	public function search($oFolder, $sPhrase, $aItems = false)
	{
		$mailbox = self::encode($oFolder->name);
		$sPath = $this->getFolderPath($mailbox);

		$search = Search::instance($sPath);
		$result = $search->search($sPhrase, 'tmp', false, $aItems);

		return $result;
	}

	public function getBody($mailbox, $itemID)
	{
		$sMailboxPath = $this->getFolderPath($this->encode($mailbox));
		return icewarp_get_message_content($sMailboxPath . '\/' . $itemID .
			localpopmessageext, '', DB_BODY_LIMIT, 0);
	}

	 
	public function saveMessageToFile($mailbox, $uid, $filename)
	{
		$dir = dirname($filename);

		if (!is_dir($dir)){
			slSystem::import('tools/filesystem');
			slToolsFilesystem::mkdir_r($dir,0777,true);
		}
		$source = $this->getItemPath($mailbox, $uid);

		$fs = fopen($source, 'rb');
		$fd = fopen($filename, 'wb+');

		$last = '';
		while ($line = fgets($fs))
		{
			if ($line[0] == '.' && $line[1] == '.')
				$line = substr($line, 1);

			fwrite($fd, $line);
		}

		fclose($fs);
		fclose($fd);
		slSystem::import('tools/icewarp');
		slToolsIcewarp::iw_index($filename);
		return true;
	}
}

?>
