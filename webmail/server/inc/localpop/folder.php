<?php
 
class LocalPOPFolder extends CacheFolder
{
	 	public $type;  
	public $lpop;
	public $lPOP;
	public $itemClassName;
	
	 	 
	public function __construct(&$account, $folderID, $name, $rights = Folder::DEFAULT_RIGHTS, $sync = false, $attributes = 0)
	{
		parent::__construct($account, $folderID, $name, $rights, $sync, $attributes);
		$this->type = 'M';
		$this->lPOP = true;
		$this->itemClassName = 'LocalPOPItem';
	}
	
	 
	public static function create(&$account, $name, $param = '', $createDual = true)
	{

     
		$lpop = LocalPOP::instance($account);
    
     
    $lpop->createMailbox($name);
    
		 
		$folderID = parent::create($account, $name, Folder::DEFAULT_RIGHTS);

		return new LocalPOPFolder($account, $folderID, $name, Folder::DEFAULT_RIGHTS, false);
	}
	
	 
	public function delete($subfolders = 0)
	{
		$account = $this->account;
		
		 		$oFolderParent = $this->getParent($account);

		$lpop = LocalPOP::instance($account);

		$folders = krsort($account->folders["main"]);

		 
		foreach ($account->folders["main"] as $folder) {

			if (strpos($folder->name, $this->name . '/') !== 0)
				continue;
      
			@$lpop->deleteMailbox($folder->name);

			unset($account->folders['main'][$folder->name]);
		}   

		 
		@$lpop->deleteMailbox($this->name);
		
		 
		parent::delete();
		
		 
		unset($account->folders['main'][$this->name]);

		$oGWFolder = $this->getGWFolder($this->name);

		 		if ($oFolderParent){
			 			 			$oParentGWFolder = $this->getGWFolder($oFolderParent->name);
			if (!($oParentGWFolder === false))
				$bDeleteFlag = true;
			else  $bDeleteFlag = false;
          
		 		$oChildern = $oFolderParent->getChildern($account);   
          
		 		if ($oChildern===false && $bDeleteFlag){
			$oGWFolder = $this->getGWFolder($oFolderParent->name);
			if ($oGWFolder->type!='M') $oFolderParent->delete();
		}
	}	 

	}	

	 
	public function rename($newName,$bRenameDual = true,$checkExistance = true)
	{

		$account = $this->account;
		$lpop = LocalPOP::instance($account);
		$length = strlen($this->name);
		$parent = substr($newName,0,strrpos($newName,$lpop->delimiter));
		$oldName = $this->name;
		
		if($checkExistance){
			try{
				 				$folder = $this->account->gwAccount->getFolder($newName);
				$exist = true;
			}catch(Exc $e){
			}
			if($exist){
				throw new Exc('folder_rename');
			}
		}
		
		 		if($parent){
			try{
				$type = 'main';
				$oFolder = $account->getFolder($parent,$type);
			}catch(Exc $e){
				$lpop->createMailbox($parent);
			}
		}
		 
		$lpop->renameMailbox($this->name, $newName);
		 
		parent::rename($newName);
		
		 		$this->account = $_SESSION['user']->getAccount($this->account->accountID);
		
		 		unset($this->account->folders['main'][$oldName]);
		$this->account->folders['main'][$newName] = $this;
		
		 		if(($oGWFolder = $this->getGWFolder($oldName)) && $bRenameDual){
			$oGWFolder->rename($newName,false,false);
		}
		
	}

	public function deleteItems($oItems = false,$bNoCache = false)
	{
		$oAccount = $this->account;
		 		$oLPOP = LocalPOP::instance($oAccount);
		 		$result = $oLPOP->deleteItems($this,$oItems);
		 		if(!$bNoCache){
			return parent::deleteItems($oItems);
		}
		return $result;
	}
	 
	public function moveItems(&$oFolder,$oItems = false, $aMovedID = false, $delayed = false)
	{
		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		Folder::checkRights($this,Folder::RIGHT_DELETE);
		
		if(Folder::checkTransfer($this,$oFolder)){
			$aCopiedID = Folder::transferItems($oFolder,$oItems);
		}else{
			$account = $this->account;
			$lpop = LocalPOP::instance($account);
			$aMovedID = $lpop->moveItems($this, $oFolder, $oItems);
		}
		 
		parent::moveItems($oFolder,$oItems,$aMovedID);
	}
	 	
	public function copyItems(&$oFolder,$oItems = false, $aCopiedID = false)
	{
		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		
		if(Folder::checkTransfer($this,$oFolder)){
			$aCopiedID = Folder::transferItems($oFolder,$oItems,true);
		}else{
			$account = $this->account;
			$lpop = LocalPOP::instance($account);
			$aCopiedID = $lpop->moveItems($this, $oFolder, $oItems,true);
		}
		 
		parent::copyItems($oFolder,$oItems,$aCopiedID);
	}	
	
	 
	public function createItem($message, $file,$bNoCache = false)
	{
		return LocalPOPItem::create($this, array(), array(),$file, $message, $bNoCache);
	}	

	 
	public function sync()
	{
		$account = $this->account;
		$lpop = LocalPOP::instance($account);
		$aItems = $lpop->getItemsID($this->name);
		 		$lockID = $_SESSION["EMAIL"]."/".$this->name;
		if(!icewarp_getlock($lockID)){
			return;
		}
		$oldExecutionTime = ini_alter('max_execution_time',MAX_EXECUTION_TIME);
		parent::syncItems($this->itemClassName,$aItems,$this);
		ini_set('max_execution_time',$oldExecutionTime);   
		icewarp_releaselock($lockID);  
	}

	public function search(&$aFilterTag)
	{
		if(stripos($aFilterTag['sql'],'{TAG}')!==false){
		preg_match_all('/{TAG}([^{]+){\/TAG}/si',$aFilterTag['sql'],$matches,PREG_SET_ORDER);
		foreach($matches as $match){
			$replace = $match[0];
			$aFilterTag['sql'] = str_replace(
				$replace,
				'',
				$aFilterTag['sql']
			);
		}
	}
	if(stripos($aFilterTag['sql'],'{FULLTEXT}')!==false){
		preg_match_all('/{FULLTEXT}([^{]+){\/FULLTEXT}/si',$aFilterTag['sql'],$matches,PREG_SET_ORDER);
		foreach($matches as $match){
			$replace = $match[0];
			$sPhrase = $match[1];
			$aFilterTag['sql'] = str_replace(
				$replace,
				'',
				$aFilterTag['sql']
			);
		}
	}
	if(trim(str_ireplace($aFilterTag['sql'],array('NOT','(',')'),''))==''){
		$aFilterTag['sql'] = '0 = 1';
	}
	if($sPhrase = $aFilterTag['fulltext']){
		if($_SESSION['FULLTEXT'])
			return parent::search($aFilterTag);
		else{
			$lpop = LocalPOP::instance($this->account);
			$result = $lpop->search($this,$sPhrase);
		}
		$aFilterTag = $this->updateSearchFilter($result,$aFilterTag);
	}
	$result = $this->getItems($aFilterTag);
	return $result;
	}
  
  public function isLocal()
  {
  	return true;
  }
  	public function getLocalMessage($file = null)
	{
		return icewarp_get_message_path($this->getPath(),$file);
	}
	
	public function isSPAM()
	{
		if($_SESSION['SPAM_FOLDER'] && $this->name==$_SESSION['SPAM_FOLDER_NAME']){
			return true;
		}
		return false;
	}

	public function setNotify($bValue){}

	public function setChannels($mailbox, $channels, $encoded = false){}
}

?>
