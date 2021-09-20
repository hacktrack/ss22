<?php
 
abstract class Folder
{
	 
	 
	const RIGHT_ADMIN  = 0x01;  
	const RIGHT_FOLDER_WRITE = 0x02;  
	const RIGHT_DELETE = 0x04;  
	const RIGHT_WRITE = 0x08;  
	const RIGHT_FOLDER_READ = 0x10;  
	const RIGHT_READ	= 0x20;  
	const RIGHT_MODIFY  = 0x80;  
	const RIGHT_FOLDER_DELETE = 0x100;
	const RIGHT_FOLDER_MODIFY = 0x200;
	const RIGHT_EXPUNGE = 0x400;
	const RIGHT_POST = 0x800;
	const RIGHT_SEEN	= 0x40;  
	const RIGHT_REMOVE	= 0x1000;  	const RIGHT_BITS	= 0x2000; 
	const RIGHT_INHERITED	= 0x4000;  	const RIGHT_SUBSCRIBED = 0x8000;
	 	const RIGHT_FOLDER_INVITE = 0x10000;
	const RIGHT_FOLDER_KICK = 0x20000;
	const RIGHT_FOLDER_EDIT_FOLDER = 0x40000;
	const RIGHT_FOLDER_EDIT_DOCUMENT = 0x80000;
	 	const DEFAULT_RIGHTS = 958;
	const FULL_RIGHTS = 959;
	 

	 	public $name;

	 	public $rights;
	
	 	public $rightsUpdated;
	
	 	public $gw;

	public $isDefault;
  	public $defaultType;
  	public $contentType;
  	public $type;
  	public $subscription_type;
  	public $attributes;
  	public $account;

	 
	protected function __construct($name, $rights)
	{
		$this->name	= $name;
		$this->rights = $rights;

		if($type = $this->isDefault()){
			$this->isDefault = true;
			$this->defaultType = $type;
		}
	}

	 
	protected static function create(&$account, $name, $param = '', $createDual = true)
	{
	}

	 
	abstract protected function delete();

	 
	abstract protected function rename($newName);
	
	abstract public function deleteItems($oItems = false);
	abstract public function moveItems(&$oFolder,$oItems = false);
	abstract public function copyItems(&$oFolder,$oItems = false);
	abstract public function setDefault($type,$updateSettings = true);
	abstract public function setSubscription($state);
	abstract public function setNotify($bValue);
	abstract public function setChannels($mailbox,$channels,$encoded = false);


	 
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
	}


	 
	public function getItem($itemID, $cache = array())
	{
	}


 
	final public function deleteItem($itemID,$cache = array(),$delayed = false, $datestamp = false, $following = false, $reason = ' ', $skip_trash = false, $skip_imip = false )
	{
		$item = $this->getItem($itemID,$cache);
		if ($this->gw){
			return $item->delete( $datestamp, $following, $reason, true , $skip_trash, $skip_imip);
		}else{
			return $item->delete($cache, $delayed, false, $reason);
		}
	}

	 
	public function transferItems(&$oFolder,$oItems = false,$copy = false)
	{
		 		if($oFolder->itemClassName=='POP3Item'){
			throw new Exc($copy?'item_copy':'item_move');
		}
		 		if ($oItems===false){
			$oItems = $this->getItems();
		}
		 		foreach($oItems as $item){
			$fileName = $item->getMessageFile();
			if(!file_exists($fileName)){
				$item->autoCreateMessage($fileName);
			}
			if(($oFolder->account->accountID[0] ?? null) == '@'){
				$newID = $oFolder->createItem($item, $fileName);
			}else{
				$newID = $oFolder->createItem(false,$fileName,true,$item->date);
			}

			if($oFolder->itemClassName=='IMAPItem'){
				$strFlags = IMAPItem::encodeFlags($item->flags);
				 				$strFlags = str_replace("\\Flagged","",$strFlags);
				$targetIMAP = IMAP::instance($oFolder->account);
				$targetIMAP->setFlags($oFolder->name,$newID,$strFlags);
				
			}
			$aResult[$item->rid] = $newID;
		}
		 		if(!$copy){
			$this->deleteItems($oItems,true,false);
		}
		
		
		return $aResult;
	}
	
	 
	static public function checkTransfer($oSource,&$oDest){
		if($oDest->type=='V'){
			$oDest = $oDest->getPrimary();
		}
		if($oSource->account->accountID!=$oDest->account->accountID){
			return true;
		} else {
			return false;
		}
	}
	
	 
	static public function checkRights(&$folder,$right)
	{
		if(!$folder->rights && $folder){
			 			$folder->rights = $folder->getMyRights($folder->name);
		}
		 		 		 		if (!($folder->rights & $right)) {
			$folder->rights = $folder->getMyRights($folder->name);
		}
		if($folder->rights & $right){
			return true;
		}else{
			throw new Exc('folder_insufficient_rights','Insufficient folder right ('.$right.') :'.$folder->name);
		}
	}
	
	static public function checkName($sFolderName)
	{
		 		if (!$sFolderName){
			throw new Exc('folder_missing_name');
		}
		 		 		if($sFolderName != self::trimFolder($sFolderName)){
			throw new Exc('folder_name_bad_char',$sFolderName);
		}
		 		if(preg_match("([\:\?\"\<\>\|])",$sFolderName,$matches)) {
			throw new Exc('folder_name_bad_char',$sFolderName);
		}
		if(mb_strlen($sFolderName,'UTF-8') > 255){
			throw new Exc('folder_name_too_long',$sFolderName);
		}
		if(in_array(strtoupper($sFolderName),Account::$aForbiddenFolders)){
			throw new Exc('autocreate_folder_name_reserved_word');
		}
		if($sFolderName != trim($sFolderName,'/\\')){
			throw new Exc('folder_name_bad_char',$sFolderName);
		}
	}
	
	static public function checkRename($sOldName,$sNewName)
	{
		self::checkName($sNewName);
		$sParent = substr($sNewName,0,strrpos($sNewName,'/'));
		$aOldNames = explode('/',$sOldName);
		$aNewNames = explode('/',$sNewName);
		if((count($aNewNames)>count($aOldNames)) && (strpos($sParent,$sOldName)!==false)) {
			throw new Exc('folder_move_to_subfolder',$sOldName.'=>'.$sNewName);
		}
		if($sParent==$sOldName) {
			throw new Exc('folder_move_to_self',$sOldName);
		}
		if(strpos($sOldName,'__@@VIRTUAL@@__')!==strpos($sNewName,'__@@VIRTUAL@@__')){
			throw new Exc('folder_move_error','Move virtual folder to normal folder or vice versa,old name: '.$sOldName.' new name:'. $sNewName);
		}
	}
	
	static public function trimFolder($sName)
	{
		if(($sParentDelimiter = strrpos($sName,'/'))!==false){
			$sToTrim = substr($sName,$sParentDelimiter+1);
			$sToTrim = trim($sToTrim);
			$sFolderName = substr($sName,0,$sParentDelimiter+1).$sToTrim;
			return $sFolderName;
		}else{
			return trim($sName);
		}
		
	}
	
	 
	abstract public function countItems($flags = 0);
	
 
		
	public function getAcl()
	{
		return array($this->account->accountID=>Folder::DEFAULT_RIGHTS);
	}
	
 
	
	public function setAcl($aList)
	{
		return true;
	}
	
	public function getMyRights()
	{
		return Folder::DEFAULT_RIGHTS;
	}
	

	static final public function rightsToBitValue($clientRights)
	{
		$wmRights = 0;
		foreach (str_split($clientRights) as $right) {
			switch ($right) {
				case 'a': $wmRights |= Folder::RIGHT_ADMIN; break;
				case 'r': $wmRights |= Folder::RIGHT_READ; break;
				case 'i': $wmRights |= Folder::RIGHT_WRITE; break;
				case 'w': $wmRights |= Folder::RIGHT_MODIFY; break;
				case 't': $wmRights |= Folder::RIGHT_DELETE; break;
				case 'l': $wmRights |= Folder::RIGHT_FOLDER_READ; break;
				case 'k': $wmRights |= Folder::RIGHT_FOLDER_WRITE;break;
				case 'x': 
					$wmRights |= Folder::RIGHT_FOLDER_MODIFY;
					$wmRights |= Folder::RIGHT_FOLDER_DELETE; 
				break;
				 				case '~':
					$wmRights |= Folder::RIGHT_REMOVE; 
				break;
				 				case '8':
					$wmRights |= Folder::RIGHT_INHERITED; 
				break;
				 				case 'b': $wmRights |= Folder::RIGHT_FOLDER_INVITE;break;
				case 'c': $wmRights |= Folder::RIGHT_FOLDER_KICK;break;
				case 'd': $wmRights |= Folder::RIGHT_FOLDER_EDIT_FOLDER;break;
				case 'e': $wmRights |= Folder::RIGHT_FOLDER_EDIT_DOCUMENT;break;
			}
		}
		return $wmRights;
	}
	
	static final public function rightsToString($rights,$name = '')
	{
		 		if(strtolower($name)=='inbox'){
			return 'riwtlka';
		}

		 		if ('' === $rights) {
			$rights = null;
		}

		 		$sRights = ($rights & Folder::RIGHT_READ ) ?'r':'';
		$sRights .= ($rights & Folder::RIGHT_WRITE ) ?'i':'';
		$sRights .= ($rights & Folder::RIGHT_MODIFY ) ?'w':'';
		$sRights .= ($rights & Folder::RIGHT_DELETE )?'t':'';
		 		$sRights .= ($rights & Folder::RIGHT_FOLDER_READ ) ?'l':'';
		$sRights .= ($rights & Folder::RIGHT_FOLDER_WRITE ) ?'k':'';
		 		$sRights .= (($rights & Folder::RIGHT_FOLDER_MODIFY) 
		|| ($rights & Folder::RIGHT_FOLDER_DELETE))?'x':'';
		 		$sRights .=  ($rights & Folder::RIGHT_ADMIN ) ?'a':'';
		 		$sRights .=  ($rights & Folder::RIGHT_FOLDER_INVITE ) ?'b':'';
		$sRights .=  ($rights & Folder::RIGHT_FOLDER_KICK ) ?'c':'';
		$sRights .=  ($rights & Folder::RIGHT_FOLDER_EDIT_FOLDER ) ?'d':'';
		$sRights .=  ($rights & Folder::RIGHT_FOLDER_EDIT_DOCUMENT ) ?'e':'';

		return $sRights;
	}
	
	static public function createDual($account,$folder)
	{
		if($account->account){
			$type = 'gw';
			$dualAccount = $account->account;
			 			$dualAccount->getFolders();
			$aFoldersCurrent = $dualAccount->folders[$type];
		} else if($account->gwAccount){
			$type = 'main';
			$dualAccount = $account->gwAccount;
			 			$account->getFolders();
			$aFoldersCurrent = $account->folders[$type];
		}else{
			 			return;
		}
		$aFolders = explode('/',$folder);
		$aFolders = array_reverse($aFolders);

		 		$iCount = count($aFolders);
		
		foreach($aFolders as $key => $fname){
			$sName = '';
			 			for ($i = 0; $i < ($iCount-$key); $i++){
				$sName .= $aFolders[$iCount-$i-1].(($i==$iCount-$key-1)?'':'/');
			}
			 			if (isset($aFoldersCurrent[$sName])){ 
				$sParentFolder = $sName;
				break;
				 			} else {
				if ($sName==$folder){
					$sNewFolder = $sName;
				} else {
					if(trim($sName,'/')!=trim($_SESSION['SHARED_PREFIX'],'/')){
						$aFoldersCreate[] = $sName;
					}
				}
			}
		}
		 		if (is_array($aFoldersCreate)) {
			$aFoldersCreate = array_reverse($aFoldersCreate);
			foreach($aFoldersCreate as $key => $treefolder){
				$result = $account->createFolder(
					array(
						'name'=>$treefolder,
						'type'=>'M',
						 						 						'virtual'=>false
					)
				);
				$dualAcl = $dualAccount->getAcl($treefolder);
				$dualInherited = $dualAccount->isInheritedACL($treefolder,$dualAcl);
				if(!$dualInherited){
					try{
						$account->setAcl($dualAcl,$treefolder,false);
					}catch(Exc $e){
						 						if(is_array($dualAcl)){
							throw $e;
						}
					}
				}
			}
		}
	}
	
	public function edit($parameters)
	{
		$sNewName = $parameters['name'];
		$sChannel = $parameters['channel'];
		$aChannels = $parameters['channels'];
		$sSubscribed = $parameters['subscription'];
		$sDefault = $parameters['default'];
		$bNotify = $parameters['notify'];
		$oAccount = &$this->account;
		 		$default = $this->isDefault();
		if($sNewName){
			Folder::checkName($sNewName);
			$this->rename($sNewName);
			if($default){
				$this->setDefault($this->defaultType,true);
				 				if($this->defaultType == 'C'){
					 					unset($oAccount->folders['addressbook']);
					unset($oAccount->account->folders['addressbook']);
				}
			}
		}
		$sName = $this->name;

		 		if(isset($sSubscribed)){
			$this->setSubscription($sSubscribed);
		}
		if($sDefault && !$sNewName){
			$this->setDefault($sDefault);
		}
		if(isset($bNotify)){
			$this->setNotify($bNotify);
		}
		if(is_array($aChannels)){
			$this->setChannels(null, $aChannels);
		}
	}
	
	public function markItems($flag, $oItems = false)
	{
		throw new Exc('folder_mark_non_mail',$this->name);
	}
	public function unmarkItems($flag, $oItems = false)
	{
		throw new Exc('folder_mark_non_mail',$this->name);
	}

	public function getType()
	{
		if($this->type == 'V'){
			return $this->contentType;
		}else{
			return $this->type;
		}
	}
	
	public function isDefault()
	{
		$list = User::getDefaultFolderList();
		if(is_array($list) && in_array($this->name,$list)){
			return array_search($this->name,$list);
		}else{
			return false;
		}
	}
	
	public function isRSS()
	{
		return ($this->attributes & 0x4000);
	}
	
	public function isSPAM()
	{
		return ($this->attributes & 0x400);
	}
	
	public function isTrash()
	{
		return ($this->attributes & 0x800);
	}
	
	public function isDraft()
	{
		return ($this->attributes & 0x200);
	}
	
	public function isArchiveSubfolder()
	{
		return $this->attributes & 0x10000;
	}
	
	public function isRestricted()
	{
		$type = $this->getType();
		if($type=='M' && $this->isRSS() && $this->name!='INBOX'){
			$type = 'R';
		}
		return self::isRestrictedType($type);
	}
	
	public function isSubscribed()
	{
		return $this->subscription_type;
	}
	
	public function isPublic()
	{
		return ($this->attributes & 0x1000);
	}

	public function isNoSelect()
	{
		return ($this->attributes & LATT_NOSELECT );
	}
	

	public function isShared()
	{
		return ($this->attributes & 0x2000);
	}
	
	public function isArchive()
	{
		if($_SESSION['ARCHIVE_INTEGRATE'] && $this->name==$_SESSION['ARCHIVE_INTEGRATE_NAME']){
			return true;
		}
		return false;
	}
	
	public function isResource()
	{
		if($_SESSION['RESOURCES_FOLDER'] && $_SESSION['RESOURCES_FOLDER']==$this->name){
			return true;
		}
		return false;
	}
	
	static public function isRestrictedType($type)
	{
		if(isset($_SESSION['RESTRICTIONS']) && isset($_SESSION['RESTRICTIONS'][$type])){
			return true;
		}
		return false;
	}
	
	static public function isSharedRoot($name)
	{
		if(strpos($name,$_SESSION['SHARED_PREFIX'])===0){
			$folder = substr($name,strlen($_SESSION['SHARED_PREFIX']));
			if(strpos(str_replace("\\",'/',$folder),'/')===false){
				return true;
			}
		}
		return false;
	}
	
	static public function hasSharedRoot($name)
	{
		if(strpos($name,$_SESSION['SHARED_PREFIX'])===0){
			return true;
		}
		return false;
	}
	
	static public function checkACLConsistence($acl_visible,$acl_invisible,&$acl)
	{
		if($acl_visible) foreach($acl_visible as $key=>$val){
			$match1[$key] = Folder::rightsToString($val);
		}
		if($acl_invisible) foreach($acl_invisible as $key=>$val){
			$match2[$key] = Folder::rightsToString($val);
		}
		if($match1!=$match2){
			if($acl_visible) foreach($acl_visible as $key=>$val){
				if(!isset($acl[$key])){
					$acl[$key] = $val;
				}
			}
			if($acl_invisible) foreach($acl_invisible as $key=>$val){
				if(!isset($acl_visible[$key]) && !isset($acl[$key])){
					$acl[$key] = Folder::RIGHT_REMOVE;
				}
			}
			return false;
		}
		return true;
	}


	
	public function getSubfolders()
	{
		$name = $this->name;
		if(is_array($this->account->folders['main']))
		foreach($this->account->folders['main'] as $mailFolder){
			if(strpos($mailFolder->name,$this->name.'/')===0){
				$result[] = $mailFolder;
			}
		}
		if(is_array($this->account->account->folders['gw']))
		foreach($this->account->account->folders['gw'] as $gwFolder){
			if(strpos($gwFolder->name,$this->name.'/')===0){
				$result[] = $gwFolder;
			}
		}
		return $result;
	}


	public function syncDelayedActions()
	{
		
	}

	protected function imapFilterTagsToSql($sql)
	{
		$imap = IMAP::instance($this->account);
		if(preg_match_all('/{FULLTEXT}([^{]+){\/FULLTEXT}/si',$sql,$matches,PREG_SET_ORDER)) {
			foreach ($matches as $match) {
				$replace = $match[0];
				$fulltext = $match[1];
				$ids = null;
				if($_SESSION['FULLTEXT_SUPPORT']) $ids = $imap->search($this->name, $fulltext);
				if ($ids) foreach ($ids as $key => $val) {
					$ids[$key] = IMAP::fixID($val);
				}
				$sql = str_replace($replace, $ids ? '(RID IN (\'' . join('\',\'', $ids) . '\'))' : '0 = 1', $sql);
			}
		}
		if(preg_match_all('/{TAG}([^{]+){\/TAG}/si',$sql,$matches,PREG_SET_ORDER)){
			foreach($matches as $match){
				$replace = $match[0];
				$tag = $match[1];
				$ids = $imap->search($this->name,'',$tag);
				if($ids) foreach($ids as $key=>$val){
					$ids[$key] = IMAP::fixID($val);
				}
				$sql = str_replace($replace, $ids ? '(RID IN (\''.join('\',\'',$ids).'\'))' : '0 = 1', $sql);
			}
		}
		return $sql;
	}

	public function createItemFile($aItem,$aTreeItem)
	{
		$itemClass = $this->getItemClass();
		if(!isset($aTreeItem['@childnodes'])){
			$item = $itemClass::createFile($this, $aTreeItem);
			return [$item];
		}

		$newTreeItem = $aTreeItem;
		$duplicateItems = array();
		foreach($aTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'] ?? [] as $akey => $attachment){
			unset($newTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment']);
			$class = $attachment['@childnodes']['values'][0]['@childnodes']['class'][0]['@value'];
			$path = $attachment['@childnodes']['values'][0]['@childnodes']['fullpath'][0]['@value'];
			$desc = $attachment['@childnodes']['values'][0]['@childnodes']['description'][0]['@value'];
			$att = array();
			$evnuid = '';
			switch(strtolower($class)){
				case 'file':
					$pathData = explode('/',$path);
					$att = $_SESSION['user']->getAttachments($pathData[0],$pathData[1]);
					break;
				case 'item':
					$pathData = Tools::parseFullPath($path,$class);

					$account_id = $pathData['account'];
					$folder_id = $pathData['folder'];
					$item_id = $pathData['item'];

					$account = $_SESSION['user']->getAccount($account_id);
					$folder = $account->getFolder($folder_id);
					$item = $folder->getItem($item_id);
					switch($folder->getType()){
						case 'F':
						case 'I':
							$part_id = $item->getFileAttachmentID();
							break;
						case 'M':
							$part_id = '1';
							break;
						default:
							throw new Exc('folder_invalid_type');
							break;
					}
					$file = $item->getAttachmentDataFile(
						$part_id,
						$att
					);
					$att['file'] = $file;
					break;
				case 'attachment':
					$pathData = Tools::parseFullPath($path, $class);

					$account_id = $pathData['account'];
					$folder_id = $pathData['folder'];
					$item_id = $pathData['item'];
					$part_id = $pathData['part'];
					if(($pos = strpos($pathData['item'],'|')) !== false) {
						$start_part_id = substr($pathData['item'],$pos+1);
						$item_id = substr($pathData['item'],0,$pos);
					}else{
						$start_part_id = '';
					}
					$att = array();
					$account = $_SESSION['user']->getAccount($account_id);

					$folder = $account->getFolder($folder_id);
					$item = $folder->getItem($item_id);
					if($start_part_id){
						$part_id = $start_part_id.'/'.$part_id;
					}
					$file = $item->getAttachmentDataFile(
						$part_id,
						$att
					);
					$evnuid = $item_id.'/'.$part_id;
					$att['file'] = $file;
					break;
			}
			$name = $desc?$desc:$att['name'];
			$name =trim($itemClass::fixAttachmentName($name));
			$attachment['@childnodes']['values'][0]['@childnodes']['description'][0]['@value'] = $name;
			$size = filesize($att['file']);
			$aItem['evntitle'] = $aItem['evnlocation'] = $aItem['evnrid'] = $name;
			$aItem['evncomplete'] = $size;
			if(!isset($aItem['evnuid']) && $evnuid){
				$newTreeItem['@childnodes']['values'][0]['@childnodes']['evnuid'][0]['@value'] = $evnuid;
				$aItem['evnuid'] = $evnuid;
			}
			$newTreeItem['@childnodes']['values'][0]['@childnodes']['evntitle'][0]['@value'] = $name;
			$newTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $name;
			$newTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'] = $name;
			$newTreeItem['@childnodes']['values'][0]['@childnodes']['evncomplete'][0]['@value'] = $size;

			$newTreeItem['@childnodes']['attachments'][0]['@childnodes']['attachment'][0] = $attachment;
			try{
				 				if($this->getType()=='F' || ($this->getType()=='I' && $aItem['evnclass']=='F')){
					if(!$itemClass::checkAttachmentName($name)){
						throw new Exc('attachment_name');
					}
				}
				$item = $itemClass::create($this,$aItem,$newTreeItem, $att);
				$result[] = $item;
			}catch(Exc $e){
				if($e->wmcode == 'item_duplicity'){
					 					if($this->isForceRename($aTreeItem)){
						$name = $itemClass::proposeFreeFileName($this, $e->getMessage());
						$aItem['evntitle'] = $aItem['evnlocation'] = $aItem['evnrid'] = $name;
						$newTreeItem['@childnodes']['values'][0]['@childnodes']['evntitle'][0]['@value'] = $name;
						$newTreeItem['@childnodes']['values'][0]['@childnodes']['evnlocation'][0]['@value'] = $name;
						$newTreeItem['@childnodes']['values'][0]['@childnodes']['evnrid'][0]['@value'] = $name;
						$item = $itemClass::create($this,$aItem,$newTreeItem, $att);
						$result[] = $item;
					}else{
						$duplicate = array();
						$duplicate['class'] = $class;
						$duplicate['fullpath'] = $path;
						$duplicate['name'] = $e->getMessage();
						$duplicate['freename'] = $itemClass::proposeFreeFileName($this, $duplicate['name']);
						$duplicateItems[] = $duplicate;
					}
				}else{
					throw $e;
				}
			}
			unset($item->aAddons);
		}
		if($duplicateItems){
			$error = '<duplicate>';
			foreach($duplicateItems as $duplicateItem){
				$error.='<item><class>'.$duplicateItem['class'].'</class>'.
					'<fullpath>'.$duplicateItem['fullpath'].'</fullpath>'.
					'<name>'.$duplicateItem['name'].'</name>'.
					'<freename>'.$duplicateItem['freename'].'</freename>'.
					'</item>';
			}
			$error .= '</duplicate>';
			throw new XMLExc('items_duplicity',$error);
		}
		return $result;
	}

	 
	protected function getFilteredItems(string $filter) : array
	{
		$search = new SearchTool();
		$search->setType($this->getType());
		$search->setAccount($this->account);
		$search->setFolder($this);
		$sql = $search->parse($filter, $aFilterTag);
		$aFilterTag = ['sql' => $sql];
		return $this->getItems($aFilterTag) ?? [];
	}

	 
	public function moveFiltered(string $filter, Folder $destinationFolder)
	{
		$this->moveItems($destinationFolder, $this->getFilteredItems($filter));
	}

	 
	public function deleteFiltered(string $filter)
	{
		$this->deleteItems($this->getFilteredItems($filter));
	}
}

 
?>
