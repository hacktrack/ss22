<?php

class HipaaFolder extends Folder
{
	public $defaultRights;
	public $folderID;
	public $itemClassName;
	public $type;
	public $items;

    public function __construct($account,$name, $folderID)
	{
		$this->account = &$account;
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_MODIFY;
		$rights |= Folder::RIGHT_DELETE;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		$this->rights = $rights;
		$this->folderID = $folderID;
		$this->name = $name;
		$this->itemClassName = 'HipaaItem';
		$this->type = 'HIPAA';
	}

	public function getItems(&$aFilter = array(), $createObject = true, $ignoreHidden = true)
	{
		if($_SESSION['ACCOUNT']==0){
			throw new Exc('access_denied');
		}
		
		if(!function_exists('iw_email_sort')){
			function iw_email_sort($a,$b){
				return strcasecmp($a->item['email'],$b->item['email']);
			}
		}
		if(!function_exists('iw_fullname_sort')){
			function iw_fullname_sort($a,$b){
				return strcasecmp($a->item['name'],$b->item['name']);
			}
		}
		$aFilter['sql'] = 'u_type = 0';
		$orderby = explode(',',$aFilter['orderby']);
		$orderby = $orderby[0];
		$orderby = explode(' ',$orderby);
		
		$domain_name = $_SESSION['DOMAIN'];
		$account = new IceWarpAccount();
		if($account->FindInitQuery($domain_name, $aFilter['sql'])){
			while($account->FindNext()){
				
				$itm['name'] = $account->getProperty('u_name');
				$itm['category'] = $account->getProperty('u_authmodevalue')=='staff'?'staff':'patients';
				$itm['email'] = $account->EmailAddress;
				if($account->EmailAddress){	
					$result[$account->EmailAddress]	= new HipaaItem($this,$account->EmailAddress,$itm);
				}
			}
			
			$account->FindDone();
		}
		if($result){
			if($aFilter['orderby']){
				switch(strtolower($orderby[0])){
					case 'name':
						uasort($result,'iw_fullname_sort');
						break;
					case 'email':
						uasort($result,'iw_email_sort');
						break;
				}
			}
			if(strtolower($orderby[1])=='desc'){
				$result = array_reverse($result,true);
			}
			$count = 0;
			foreach($result as $key => $val){
				if(isset($aFilter['offset']) && isset($aFilter['limit'])){
					if(($count < $aFilter['offset']) || ($count > ($aFilter['offset'] + $aFilter['limit'])) ){
						unset($result[$key]);
					}
				}
				$count++;
			}
		}else{
			$result = array();
		}
		
		return $result;
	}

	public function getItem($itemID, $cache = array())
	{
		$items = $this->getItems();
		if(is_array($items) && !empty($items)){
			foreach($items as $item){
				if($item->itemID == $itemID){
					return $item;
				}
			}
		}
		throw new Exc('item_invalid_id',$itemID);
	}

	public function getMyRights()
	{
		return $this->rights;
	}

	public function deleteItems($oItems = false)
	{
		 
		$result = true;
		if($oItems){
			foreach($oItems as $oItem){
				$result = $result && $oItem->delete();
			}
		}
		return $result;
	}

	public function moveItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}

	public function copyItems(&$oFolder,$oItems = false)
	{
		throw new Exc('not_supported');
	}

	public function countItems($flag = 0)
	{
		$items = $this->getItems();
		return count($items);
	}

	public function delete()
	{
		throw new Exc('not_yet_supported');
	}

	public function rename($newName)
	{
		throw new Exc('not_yet_supported');
	}


	public function createItem($aItem)
	{
		$id = HipaaItem::create($this,$aItem);
		return $id;
	}

	public function sync()
	{
		$this->items = false;
	}

	public function search(&$aFilterTag)
	{
		return $this->getItems($aFilterTag);
	}

	public function emptyFolder()
	{
		$this->deleteItems();
	}

    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}

?>