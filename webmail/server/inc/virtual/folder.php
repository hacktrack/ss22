<?php

class VirtualFolder extends Folder
{
	public $type;
	public $folderID;
	public $autoSubscribe;
	public $nonExistingFolders;
	public $class;
	public $alreadySearched;
	public $search;
	public $sync;
	public $sharetype;
	public $folders;
	public $primary;
	public $contentType;
	public $account;

    public function __construct(&$account, $name, $type, &$folders, $primary, $search = false,$sync = false,$autoSubscribe = false,$sharetype = false)
	{
		$this->type = 'V';
		$this->name = $name;
		$this->folderID = $name;
		$this->contentType = $type;
		$this->class = '';
		$this->account = &$account;
		$this->primary = $primary;
		$this->search = $search;
		$this->alreadySearched = false;
		$this->sync = $sync;
		$this->sharetype = $sharetype;
		$this->autoSubscribe = $autoSubscribe;
		$this->init($folders);
	}
	
	
	public function init($folders)
	{
		switch($this->contentType){
			case 'M':
				switch(strtolower($this->account->account->protocol)){
					case 'imap':
						$this->class = 'IMAPItem';
					break;
					case 'local':
						$this->class = 'LocalPOPItem';
					break;
					case 'pop3':
						$this->class = 'POP3Item';
					break;
				}
				$account = &$this->account->account;
				break;
			case 'R':
				if($this->contentType=='R'){
					$this->class = 'RSSItem';
				}
				$account = &$this->account->account;
				$this->gw = false;
				break;
			case 'C':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				$account = &$this->account->account->gwAccount;
				$this->gw = true;
				$this->class = 'GroupWareItem';
				break;
		}
		$this->initFolders( $account, $folders );
	}
	
	public function importItem($type,$data)
	{
		if($this->isEmpty()){
			return;
		}
		switch($this->contentType){
			case 'C':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				$folder = $this->getPrimary();
				return GroupWareItem::import($folder, $type, $data, false);
			break;
		}
	}
	
	public function initFolders( &$account, $folders )
	{
		unset($this->folders);
		unset($this->nonExistingFolders);
		if(is_array($folders) && !empty($folders)){
 			foreach($folders as $folder){
				if(!$this->autoSubscribe){
					try{
						$oFolder = $account->getFolder($folder);
						$this->folders[$folder] = $oFolder;
					}catch(Exc $e){
						if($this->getType()!='M' && $this->getType()!='R'){
							$primaryAccount = &$account->account;
						}else{
							$primaryAccount = &$account;
						}
						 						try{
							$oFolder = $primaryAccount->getFolder($folder);
							if($oFolder->type=='V'){
								if($oFolder->isEmpty()){
									$this->folders['@@ALL@@#'.$this->getType()] = '@@ALL@@#'.$this->getType();
								}else{
									foreach($oFolder->folders as $fdr){
										$this->folders[$fdr->name] = $fdr;
									}
								}
							}
						}catch(Exception $e){
							$this->nonExistingFolders[$folder] = $folder;	
						}
					}
				}else{
					$oFolder = new GroupWareFolder($account,$folder,'E');
					$this->folders[$folder] = $oFolder;
				}
			}
		}
	}
	
	static public function create(&$account,$name,$param = '',$createDual = true,$folders = array(),$primary = false,$search = false,$sync = false,$autosubscribe = false, $sharetype = false)
	{
		$type = $param;
		$virtual = VirtualHandler::instance($account);
		$virtual->createFolder($name,$type,$folders,$primary,$search,$sync,$autosubscribe,$sharetype);
		$fdr = new VirtualFolder($account, $name, $type, $folders, $primary, $search, $sync,$autosubscribe, $sharetype);
		return $fdr;
	}

	public function getItem($itemID,$bAddons = WITH_ADDONS,$ctz = 0,$instanceDate = 0,$fields = '*',&$part_id = '',$cache = array())
	{
		switch($this->contentType){
			case 'M':
				$item = $this->createItemFromID($itemID,$cache);
				return $item;
				break;
			case 'C':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				if($this->account->account->gwAccount){
					$groupware = &$this->account->account->gwAccount->gwAPI;
					$item = $groupware->getItem(
							$itemID,
							$this,
							$bAddons,
							$ctz,
							$instanceDate,
							$fields,
							$part_id
					);
					return $item;
				}
				break;
		}
	}
	public function getItems( &$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		if(!$this->alreadySearched && $this->search){
            if($this->getType() == 'M' && $_SESSION['FULLTEXT_SUPPORT']){
                $imapSearch = new \server\inc\imap\Search($this, $this->search);
            }
            if($imapSearch instanceof \server\inc\imap\Search && $imapSearch->isSearchEnabled()) {
                $condition = $imapSearch->getSearchSql();
            }else {
                require_once(SHAREDLIB_PATH . 'tools/search.php');
                $search = new SearchTool();
                $search->setType($this->getType());
                $search->setAccount($this->account);
                $search->setFolder($this);

                $condition = $search->parse($this->search);
            }
			
			if($aFilterTag['sql']){
				$aFilterTag['sql'] ='('.$aFilterTag['sql'].') AND ('.$condition.')';
			}else{
				$aFilterTag['sql'] = '('.$condition.')';
			}
			
			
			if((strpos($aFilterTag['sql'],'{TAG}')!==false && $this->getType()=='M')
				|| (strpos($aFilterTag['sql'],'{FULLTEXT}')!==false && $this->getType()=='M')){
				return $this->search($aFilterTag,true);
			}
		}

		if(!$this->isEmpty()){
			try{
				$folder = $this->getPrimary();
			}catch(Exc $e){
				
			}
			if($folder){
				if($folder->getType()!=$this->getType()){
					throw new Exc('inconsistent_folder_types');
				}
			}
		}

		if($this->folderID == '__@@VIRTUAL@@__/__@@MEETINGS@@__'){
            if(!empty($aFilterTag['sql'] ?? null)) $aFilterTag['sql'] = '('.$aFilterTag['sql'].') AND ';
            $aFilterTag['sql'] = ($aFilterTag['sql'] ?? '') . 'EvnMeetingId IS NOT NULL AND EvnMeetingId <> \'\'';
            $aFilterTag['holidays'] = false;
        }
		switch($this->contentType){
			case 'M':
			case 'R':
				$cache = Cache::instance($this->account->account->user);
				$items = $cache->getItems(
					$this, 
					$aFilterTag,
					$this->class,
					true,
					true
				);
				
				if($items){
					$icache['cache'] = $cache;
					foreach($items as $key => $item){
						try{
							$itemFolder = $this->findFolder($item->original_folder_id);
							unset($items[$key]->folder);
							$items[$key]->folder = $itemFolder;
						}catch(Exc $e){
							log_buffer("Virtual folder problem(getItems):".print_r($e,true),'ERROR');
						}
					}
				}
				break;
			case 'C':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				if($this->account->account->gwAccount){
					$groupware = &$this->account->account->gwAccount->gwAPI;
					$items = $groupware->getItems(
						$aFilterTag,
						$this
					);
				}
				break;
		}
		return $items;
	}
	public function createItemFromID($itemID,&$cache = array())
	{
		$account = &$this->account;
		if (!isset($cache['cache'])){
			$cache = array();
			$cache['cache'] = Cache::instance($_SESSION['user']);
			$fCache = false;
		}else{
			$fCache = true;
		}
		$item = $cache['cache']->getItem($this,$this->class,$itemID,'*',$fCache);
		
		$itemFolder = $this->findFolder($item->original_folder_id);
		unset($item->folder);
		$item->folder = $itemFolder;
		return $item;
	}
	
	public function findFolder($folderID)
	{
		$aAccounts = $_SESSION['user']->getAccounts();
		foreach($aAccounts as $oAccount){
			if(is_array($oAccount->folders['main'])
			 && !empty($oAccount->folders['main'])){
				foreach($oAccount->folders['main'] as $folder){
					if($folder->folderID == $folderID){
						return $folder;
					}
				}
			}
		}
		return false;
	}
	
	public function countItems($flags = 0, $positive = true,$filter = "",$search = false, $fields = '',$folderID = false,$folder = false,$alreadySearched = false)
	{
		
		require_once(SHAREDLIB_PATH.'tools/search.php');
		$searchTool = new SearchTool();
		$searchTool->setType($this->getType());
		$searchTool->setAccount($this->account);
		$searchTool->setFolder($this);
		$condition = $searchTool->parse($this->search);
		
		if($flags == Item::FLAG_SEEN 
			&&	(strpos($condition,'{FULLTEXT}')!==false 
				|| strpos($condition,'{TAG}')!==false
				)
		){
			return 0;
		}
		if($this->search && !$alreadySearched){
			if($filter){
				$filter ='('.$filter.') AND ('.$condition.')';
			}else{
				$filter = '('.$condition.')';
			}
		}
		
		
		switch($this->contentType){
			case 'M':
			case 'R':
				$cache = Cache::instance($_SESSION['user']);
				try{
					return $cache->countItems(
						$this,
						$flags,
						$positive,
						$filter,
						$search,
						$fields
					);
				}catch(Exception $e){
					
				}
				break;
			case 'C':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				$groupware = &$this->account->account->gwAccount->gwAPI;
				return $groupware->countItems(
					$this,
					$flags,
					$positive,
					$filter,
					$search,
					$fields
				);
				break;
		}
	}
	 	public function deleteItems( $oItems = false,$cache = false, $delayed = 'auto', $reason = '', $ignore_reason = false, $skip_trash = false)
	{
		if(is_array($oItems) && !empty($oItems)){
			foreach($oItems as $oItem){
				$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id, $cache);
				$aItemsToDelete[$oItem->folder->folderID]['items'][] = $item;
				$aItemsToDelete[$oItem->folder->folderID]['folder'] = $item->folder;
			}
			if($aItemsToDelete)foreach($aItemsToDelete as $folderItems){
				try{
					if($folderItems['folder']){
						$result = $folderItems['folder']->deleteItems($folderItems['items'],$cache,$delayed,$reason,$ignore_reason,$skip_trash);
					}
				}catch(Exc $e){
					if($e->wmcode=='item_decline_reason' || $e->wmcode=='item_decline_failed_id'){
						throw $e;
					}
				}
			}
		}
		return $result;
	}
	
	public function moveItems( &$oFolder, $oItems = false, $cache = false)
	{
        if(!is_array($oItems) || empty($oItems)) return true;
        $aItemsToMove = [];
        foreach($oItems as $oItem){
            if($oItem->folder->folderID == $oFolder->folderID) continue;
            if(!$oItem instanceof Item || !$oItem->folder instanceof Folder) $oItem = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id, $cache);
            $aItemsToMove[$oItem->folder->folderID]['items'][] = $oItem;
            $aItemsToMove[$oItem->folder->folderID]['folder'] = $oItem->folder;
        }
        foreach($aItemsToMove as $folderItems){
            try{
                $folderItems['folder']->moveItems($oFolder, $folderItems['items']);
            }catch(Exc $e){}
        }
		return true;
	}
	
	public function copyItems( &$oFolder,$oItems = false )
	{
		 		if(is_array($oItems) && !empty($oItems)){
			foreach($oItems as $oItem){
				if($this->getType()!='M' || ($oItem->folder->folderID != $oFolder->folderID)){
					$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id);
					$aItemsToCopy[$oItem->folder->folderID]['items'][] = $item;
					$aItemsToCopy[$oItem->folder->folderID]['folder'] = $item->folder;
				}
			}
			if($aItemsToCopy)foreach($aItemsToCopy as $folderItems){
				try{
					$result = $folderItems['folder']->copyItems($oFolder,$folderItems['items']);
				}catch(Exc $e){
				}
			}
		}
		if(is_array($result)){
			return $result;
		}else{
			return true; 
		}
	}	
	
	public function emptyFolder($sDestinationAccount,$sDestinationFolder)
	{
		 		 		 			 			$oAccount= $_SESSION['user']->getAccount($sDestinationAccount);
			$oFolder = $oAccount->getFolder($sDestinationFolder);
			$sDestinationFolderID = $oFolder->folderID;
			$filter = array('tag'=>'rid');
			$oItems = $this->getItems($filter);
			if(is_array($oItems) && !empty($oItems)){
				foreach($oItems as $oItem){
					if($oItem->folder->folderID != $sDestinationFolderID){
						$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id);
						$aItemsToMove[$oItem->folder->folderID]['items'][] = $item;
						$aItemsToMove[$oItem->folder->folderID]['folder'] = $item->folder;
					}else{
						$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id);
						$aItemsToDelete[$oItem->folder->folderID]['items'][] = $item;
						$aItemsToDelete[$oItem->folder->folderID]['folder'] = $item->folder;
					}
				}
				if($aItemsToDelete){
					foreach($aItemsToDelete as $folderItems){
						try{
							$folderItems['folder']->deleteItems($folderItems['items']);
						}catch(Exc $e){
						}
					}
				}
				
				if($aItemsToMove){
					foreach($aItemsToMove as $folderItems){
						try{
							$folderItems['folder']->moveItems($oFolder,$folderItems['items']);
						}catch(Exc $e){
						}
					}
				}
			}
		 	}
	public function markItems($flag,$oItems = false)
	{
		 		 		 			if($oItems===false){
				$filter = array('tag'=>'rid');
				$oItems = $this->getItems($filter);
			}
			 			if(is_array($oItems) && !empty($oItems)){
				foreach($oItems as $oItem){
					$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id);
					$aItemsToMark[$oItem->folder->folderID]['items'][] = $item;
					$aItemsToMark[$oItem->folder->folderID]['folder'] = $item->folder;
				}
				if($aItemsToMark)foreach($aItemsToMark as $folderItems){
					try{
						$folderItems['folder']->markItems($flag,$folderItems['items']);
					}catch(Exc $e){
					}
				}
			}
		 	}
	
	public function unmarkItems($flag,$oItems = false)
	{
		 		 		 			if($oItems===false){
				$filter = array('tag'=>'rid');
				$oItems = $this->getItems($filter);
			}
			 			if(is_array($oItems) && !empty($oItems)){
				foreach($oItems as $oItem){
					$item = $this->getItem($oItem->itemID,NO_ADDONS,0,0,'*',$part_id);
					$aItemsToMark[$oItem->folder->folderID]['items'][] = $item;
					$aItemsToMark[$oItem->folder->folderID]['folder'] = $item->folder;
				}
				if($aItemsToMark)foreach($aItemsToMark as $folderItems){
					try{
						$folderItems['folder']->unmarkItems($flag,$folderItems['items']);
					}catch(Exc $e){
					}
				}
			}
		 	}
	
	 
	public function createItem($param1=false,$param2=false,$param3=false)
	{
		if($this->isEmpty()){
			return;
		}
		$folder = $this->getPrimary();
		return $folder->createItem($param1,$param2,$param3);
	}
	
	 	public function getAcl()
	{
		if($this->isEmpty()){
			return ;
		}
		$folder = $this->getPrimary();
		return $folder->getAcl();
	}

	public function setAcl($acl,$bSetDual = true)
	{
		if($this->isEmpty()){
			return;
		}
		$folder = $this->getPrimary();
		return $folder->setAcl($acl,$bSetDual);
	}
	
	public function getMyRights()
	{
		if($this->isEmpty()){
			return Folder::rightsToBitValue('rwtlkx');
		}else{
			try{
				$folder = $this->getPrimary();
				if(!is_object($folder)){
					throw new Exc('no_folder');
				}
				$rights = $folder->getMyRights();
				$rights |= Folder::RIGHT_FOLDER_READ;
				$rights |= Folder::RIGHT_FOLDER_WRITE;
				if($this->name!='__@@VIRTUAL@@__/__@@EVENTS@@__'){
					$rights |= Folder::RIGHT_FOLDER_DELETE; 
					$rights |= Folder::RIGHT_FOLDER_MODIFY; 
				}
				return $rights;
			}catch(Exc $e){
				if($this->name=='__@@VIRTUAL@@__/__@@EVENTS@@__'){
					return Folder::rightsToBitValue('rwtlk');
				}else{
					return Folder::rightsToBitValue('rwtlkx');
				}
			}
		}
	}
	public function delete()
	{
		$virtual = VirtualHandler::instance($this->account);
		unset($this->account->folders[$this->name]);
		return $virtual->deleteFolder($this->name);
	}
	
	public function rename( $newName )
	{
		$virtual = VirtualHandler::instance($this->account);
		$virtual->editFolder($this->name,$newName);
	}

	
	public function search( &$aFilterTag,$alreadySearched = false)
	{
		$sPhrase = $aFilterTag['fulltext'];
		if(!$alreadySearched && $this->search){
			require_once(SHAREDLIB_PATH.'tools/search.php');
			$search = new SearchTool();
			$search->setType($this->getType());
			$search->setAccount($this->account);
			$search->setFolder($this);
			$condition = $search->parse($this->search);
			if($aFilterTag['sql']){
				$aFilterTag['sql'] ='('.$aFilterTag['sql'].') AND ('.$condition.')';
			}else{
				$aFilterTag['sql'] = '('.$condition.')';
			}
		}
		
		 		if($this->isEmpty()){
			$folders = $this->account->account->folders['main'];
			$allFolders = true;
		}else{
			$folders = $this->folders;
			$allFolders = false;
		}
		if($this->account->account->acc_type=='imap'){
			$imap = IMAP::instance($this->account->account);
			if($folders){
				$imapQuery = 'mailboxes (';
				foreach($folders as $folder){
					$aFolderIDs[strtolower($folder->name)] = $folder->folderID;
					$folderNames[] = $imap->encode($folder->name);
				}
				$imapQuery.=join(' ',$folderNames);
				$imapQuery.=')';
				if($allFolders){
					$imapQuery = 'personal';
				}
			}
			if($allFolders){
				switch(strtoupper($_SESSION['DBTYPE'])){
					case 'MYSQL':
					 					 						$folderColumnPrefix = 'f.';
						$itemColumnPrefix = 'i.';
						break;
					default:
						$folderColumnPrefix = '';
						$itemColumnPrefix = '';
						break;
				}
			}
			$result = $imap->msearch($imapQuery,$aFilterTag,$aFolderIDs,$folderColumnPrefix,$itemColumnPrefix);
			$resultFilter = $result;
		}else{
			if($folders){
				foreach($folders as $folder){
					$filter['sql'] = $aFilterTag['sql'];
					$filter['fulltext'] = $sPhrase;
					$result[$folder->name] = $folder->search($filter);
					if(rtrim(ltrim($filter['sql'],'('),')')!='0'){
						$resultFilter[] = '(folder_id=\''.$folder->folderID.'\' AND '.$filter['sql'].')';
					}
				}
			}
		}
		
		if(!$resultFilter){
			$aFilterTag['sql'] = '(0 = 1)';
		}else{
			$aFilterTag['sql'] = join(' OR ',$resultFilter);
		}
		$this->alreadySearched = true;
		$result = $this->getItems($aFilterTag);
		$this->alreadySearched = false;
		return $result;
	}
	
	
	
	public function deleteOlder( $thanDays )
	{
		return true;
	}
	
	public function sync($delayed = false)
	{
		if(is_array($this->folders) && !empty($this->folders)){
			foreach($this->folders as $folder){
				try{
					if($delayed){
						$aToSyncFolders[$this->getType()][$folder->name] = $folder;
					}else{
						 						if($folder && !$folder->sync){
							if(get_class($folder)=='IMAPFolder'){
								if(!$folder->syncDelayedActions())
									return false;
							}
							$folder->sync();
						}
					}
				}catch(Exc $e){
					
				}
			}
		}
		return $aToSyncFolders;
	}
	public function edit($parameters)
	{
		$sNewName = $parameters['name']?$parameters['name']:false;
		$sNewFolders = isset($parameters['folders'])?$parameters['folders']:false;
		$setFolders = isset($parameters['folders']);
		$sNewPrimary = $parameters['primary']?$parameters['primary']:false;
		$sNewSearch = isset($parameters['search'])?$parameters['search']:false;
		$sNewSubscribed = isset($parameters['subscription'])?$parameters['subscription']:false;
		$sNewShareType = isset($parameters['sharetype'])?$parameters['sharetype']:false;
		$virtual = VirtualHandler::instance($this->account);
		$virtual->editFolder(
			$this->name,
			$sNewName, 
			$sNewFolders, 
			$sNewPrimary,
			$sNewSearch,
			$sNewSubscribed,
			$sNewShareType
		);
		$name = $sNewName?$sNewName:$this->name;
		$fdrs = $this->folders?$this->folders:array();
		$folders = $setFolders?$sNewFolders:array_keys($fdrs);
		$primary = $sNewPrimary?$sNewPrimary:$this->primary;
		$search = $sNewSearch!==false?$sNewSearch:$this->search;
		$sync = $sNewSubscribed?$sNewSubscribed:$this->sync;
		$sharetype = $sNewShareType?$sNewShareType:$this->sharetype;
		
		$fdr = new VirtualFolder(
			$this->account,
			$name,
			$this->contentType,
			$folders,
			$primary,
			$search,
			$sync,
			false,
			$sharetype
		);
		$this->name = $name;
		$this->primary = $primary;
		$this->search = $search;
		$this->sync = $sync;
		$this->sharetype = $sharetype;
		$this->init($folders);
		unset($this->account->folders[$this->name]);
		$this->account->folders[$name] = $fdr;
		
	}
	
	public function isEmpty()
	{
	    return empty($this->folders ?? null);
	}
	
	public function getPrimary()
	{
		 		if(!is_object($this->folders[$this->primary])){
			if(!$this->isEmpty()){
				$newPrimary = reset($this->folders);
				$this->edit(array('primary'=>$newPrimary->name));
				return $newPrimary;
			}
			throw new Exc('folder_does_not_exist',$this->primary);
		}
		return $this->folders[$this->primary];
	}
	
	public function getContactList($private = false,$format = false)
	{
		switch($this->contentType){
			case 'C':
				$contacts = array();
				if($this->account->account->gwAccount){
					$groupware = &$this->account->account->gwAccount->gwAPI;
					$contacts = $groupware->getContactList(
						$this,
						$private,
						$format
					);
				}
				return $contacts;
			break;
			case 'M':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				throw new Exception('virtual_getcontactlist_type');
			break;
		}
	}
	
	public function saveAddressesToFile(&$file, $addresses, $separator = delimiterchar, $private = true)
	{
		switch($this->contentType){
			case 'C':
				GroupWareFolder::saveAddressesToFile($file,$addresses,$separator,$private);
			break;
			case 'M':
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'G':
			case 'Y':
			case 'I':
				throw new Exception('virtual_saveaddressestofile_type');
			break;
		}
	}
	
	public function saveItems($oItems = false)
	{
		 		if($this->getType()!='M'){
			return $this->account->gwAPI->saveItems($this,$oItems);
		}else{
			if(is_array($oItems) && !empty($oItems)){
				$fname = 'emails_'.time().'.zip';
				$filedir =  $_SESSION['user']->getUploadDir('zip').'/';
				$tempdir = $filedir.'files/';
				$filename = $filedir.$fname;
				 				try{
					require_once(SHAREDLIB_PATH.'tools/zip.php');
					$zip = new slToolsZIP();
					$zip->setTempDir($tempdir);
					$zip->open($filename, ZIPCREATE);
				}catch(Exception $e){
					throw new Exc('ZIPError',"cannot open <$filename>");
				}
				foreach($oItems as $oItem) {
					$item = $this->getItem($oItem->itemID);
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
					'class'=>'file'
				);
			}
		}
	}
	
	public function openAccess()
	{
		return $this->account->gwAPI->openAccess($this);
	}
	
	public function __call($name,$args)
	{
		echo "Virtual folder error: unsupported method";
		print_R(array($name,$args));die();
	}
	
	public function setDefault($type,$updateSettings = true)
	{

	}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}

    public function filterTagsToSql($sql)
    {
        if ($this->getType() == 'M') {
            $sql = $this->imapFilterTagsToSql($sql);
        }
        return $sql;
    }
}

?>