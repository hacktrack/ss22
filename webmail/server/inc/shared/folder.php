<?php

class SharedAccountFolder extends CacheFolder
{
	public $defaultRights;
	public $type;
	public $itemClassName;

    public function __construct(&$account,$folderID, $name,$rights = false, $sync= false,$attributes = false)
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		parent::__construct(
			$account, 
			$folderID, 
			$name, 
			$this->defaultRights, 
			$sync,
			$attributes
		);
		$this->itemClassName = 'SharedAccountItem';
		$this->type = 'SL';
	}

     
	public static function create(&$account, $name, $param = '',$createDual = true)
	{
		$folderID = parent::create($account, $name, SharedAccountFolder::DEFAULT_RIGHTS,$createDual);
		return new SharedAccountFolder($account,$folderID, $name);
	}
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		$aFilterTag['tag'] = 'subject,rid,flags,header_from,header_to';
		if(stripos( $aFilterTag['sql'],'lctemail1')!==false){
			 $aFilterTag['sql'] = str_ireplace('lctemail1','subject', $aFilterTag['sql']);
		}
		if(stripos($aFilterTag['orderby'],'lctemail1')!==false){
			$aFilterTag['orderby'] = str_ireplace('lctemail1','subject',$aFilterTag['orderby']);
		}
		if(stripos($aFilterTag['sql'],'itmtitle')!==false){
			$aFilterTag['sql'] = str_ireplace('itmtitle','header_from',$aFilterTag['sql']);
		}
		if(stripos($aFilterTag['orderby'],'itmtitle')!==false){
			$aFilterTag['orderby'] = str_ireplace('itmtitle','header_from',$aFilterTag['orderby']);
		}
		return parent::getItems($aFilterTag,$createObject,$ignoreHidden);
	}
	
	public function countItems($flags = 0, $positive = true, $filter = "", $search = false)
	{
		if($flags === Item::FLAG_SEEN){
			return 0;
		}
		 		if(stripos($filter,'lctemail1')!==false){
			$filter = str_ireplace('lctemail1','subject',$filter);
		}
		if(stripos($filter,'itmtitle')!==false){
			$filter = str_ireplace('itmtitle','header_from',$filter);
		}
		return parent::countItems($flags, $positive,$filter,$search);
	}

	public function edit($parameters = array())
	{
		throw new Exc('not_supported');
	}

	public function delete($subfolders = 0)
	{
		throw new Exc('not_supported');
	}

	public function deleteItems($oItems = false, $delayed = false)
	{
		throw new Exc('not_supported');
	}
	

	 
	public function sync()
	{
		 		$account = $this->account->account;
		 		$shared = SharedAccounts::instance($account);
		$aItemsID = $shared->getItemsID();
		 		parent::syncItems($this->itemClassName,$aItemsID,$this,'item_id,rid,flags,color,header_from');
	}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}

?>