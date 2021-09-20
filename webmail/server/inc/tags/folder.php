<?php

class TagsFolder extends Folder
{
	public $itemClassName;
	public $type;
	public $account;

    public function __construct(&$account, $name)
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->rights = $rights;
		$this->account = &$account;
		$this->itemClassName = 'TagsItem';
		$this->type = 'K';
		$this->name = $name;
	}
	
	 
	public static function create(&$account, $name, $param = '',$createDual = true)
	{
		return;
	}
	public static function createItem($aItem,$aTreeItem)
	{
		$primaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		return Storage::addTag($primaryAccount->gwAccount,$aItem['tagname'],$aItem['tagcolor']);
	}
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		$tags = TagsHandler::instance($this->account);
		$items = $tags->getItems($this,$aFilterTag);
		return $items;
	}
	
	public function countItems($flags = 0, $positive = true, $filter = "", $search = false,$fields = false,$folderID = false,$folder = false)
	{
		$tags = TagsHandler::instance($this->account);
		$count = $tags->countItems($this,$flags,$positive,$filter,$search,$folder);
		return $count;
	}

	 
	public function getItem($itemID, $cache = array())
	{
		$tags = TagsHandler::instance($this->account);
		$item = $tags->getItem($this,$itemID);
		return $item;
	}

	public function edit($parameters)
	{
		throw new Exc('not_supported');
	}
	
	public function rename($param)
	{
		throw new Exc('not_supported');
	}
	
	public function delete()
	{
		throw new Exc('not_supported');
	}

	public function deleteItems($oItems = false)
	{
		$result = true;
		if(is_array($oItems) && !empty($oItems)){
			foreach($oItems as $oItem){
				if ('1' !== $oItem->delete()) {
					$result = false;
				}
			}
		}
		
		return $result;
	}

	public function copyItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}
	
	public function moveItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}
	
	
	 
	public function sync()
	{
		return true;
	}
	
	public function getMyRights()
	{
		return Folder::DEFAULT_RIGHTS;
	}

    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}

?>