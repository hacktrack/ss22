<?php
 
class POP3Folder extends CacheFolder
{
	 	public $type;
	public $itemClassName;
	
	 	 
	public function __construct(&$account, $folderID, $name, $rights = Folder::DEFAULT_RIGHTS, $sync = false, $attributes = 0)
	{
		parent::__construct($account, $folderID, $name, $rights, $sync,$attributes);
		$this->type = 'M';
		$this->gw = false;
		$this->itemClassName = 'POP3Item';
	
  }

	 
	public static function create(&$account, $name, $param = '', $createDual = true)
	{
   		throw new Exc('folder_create');
	}


	 
	public function delete($subfolders = 0)
	{
	 throw new Exc('folder_delete');
	}

	 
	public function edit($parameters)
	{
	 throw new Exc('folder_edit');
	}

	
	 
	public function rename($newName)
	{
	 throw new Exc('folder_rename');
	}


	 
	public function deleteItems($oItems = false,$bNoCache = false)
	{
		$account = $this->account;
		
    $pop3= POP3::instance($account);
						 
    $pop3->deleteItems($this,$oItems);
    	if(!$bNoCache){
			parent::deleteItems($oItems);
    	}
	}

	 
	public function moveItems(&$oFolder,$oItems = false, $aMovedID = false, $delayed = false)
	{
		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		Folder::checkRights($this,Folder::RIGHT_DELETE);
		
		if(Folder::checkTransfer($this,$oFolder)){
			$aCopiedID = Folder::transferItems($oFolder,$oItems);
		}else{
			throw new Exc('item_move');
		}
		 
		parent::moveItems($oFolder,$oItems,$aMovedID);
	}
	 	
	public function copyItems(&$oFolder,$oItems = false, $aCopiedID = false)
	{
		Folder::checkRights($oFolder,Folder::RIGHT_WRITE);
		
		if(Folder::checkTransfer($this,$oFolder)){
			$aCopiedID = Folder::transferItems($oFolder,$oItems,true);
		}else{
			throw new Exc('item_copy');
		}
		 
		parent::copyItems($oFolder,$oItems,$aCopiedID);
	}

	 
	public function createItem($message,$file = false,$bNoCache = false)
	{
		return POP3Item::create($this, array(), array(), $file, $message, $bNoCache);
	}

	 
	public function sync()
	{

		$account = $this->account;

	 	$pop3 = POP3::instance($account);

	 	$lockID = $_SESSION["EMAIL"]."/".$this->name;
	if(!icewarp_getlock($lockID)){
		return;
	}
	
    $aItemsID = $pop3->getItemsID($this->name);

    $oldExecutionTime = ini_alter('max_execution_time',MAX_EXECUTION_TIME);

    parent::syncItems($this->itemClassName,$aItemsID,$this);

    ini_set('max_execution_time',$oldExecutionTime);
    icewarp_releaselock($lockID);
	}

  public function search(&$aFilterTag){
  	$sPhrase = $aFilterTag['fulltext'];
    if($_SESSION['FULLTEXT'])
      return parent::search($aFilterTag);   
    else{
      $lpop = POP3::instance($this->account);
      $aPaths = false;
      $result = $lpop->search($this,$sPhrase,$aPaths);
    }
      
    $aFilterTag = $this->updateSearchFilter($result,$aFilterTag,'ITEM_ID');

    $result = $this->getItems($aFilterTag);
    
    return $result;
  }

	public function setNotify($bValue){}

	public function setChannels($mailbox, $channels, $encoded = false){}
}

?>
