<?php
class DevicesFolder extends Folder
{
	public $defaultRights;
	public $folderID;
	public $itemClassName;
	public $items;

    public function __construct()
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_MODIFY;
		$rights |= Folder::RIGHT_DELETE;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		$this->rights = $rights;
		$this->folderID = '__@@DEVICES@@__';
		$this->name = '__@@DEVICES@@__';
		$this->itemClassName = 'DevicesItem';
		$this->type = 'DEVICES';
	}
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		if(!$this->items){
			$api = createobject('API');
			$aFilterTag['email'] = $_SESSION['EMAIL'];
			$devices_xml_string = $api->ManageConfig("activesync/getdevicelistxml",$aFilterTag['email']);
			$devices_xml = simplexml_load_string($devices_xml_string);
			$result = array();
			
			if(!empty($devices_xml)){
				foreach($devices_xml as $device){
					$d['id']= strval($device['device_id']);
					$d['devicetype'] = strval($device->devicetype);
					$d['lastsync'] = strval($device->lastsync);
					$d['remotewipe'] = strval($device->remotewipe);
					$d['protocolversion'] = strval($device->protocolversion);
					$d['versionenforcement'] = strval($device->versionenforcement);
					$d['model'] = strval($device->model);
					$d['friendly_name'] = strval($device->friendly_name);
					$d['os'] = strval($device->os);
					$d['registered'] = strval($device->registered);
					
					$devicesItem = new DevicesItem($d);
					$this->items[] = $devicesItem;
				}
			}
		}else{
			return $this->items;
		}
		return $this->items;
	}
	
	public function getItem($itemID, $cache = array())
	{
		$items = $this->getItems();
		if(is_array($items) && !empty($items)){
			foreach($items as $item){
				if($item->itemID == $itemID){
					 					$api = createobject('API');
					$detailed_xml_string = $api->ManageConfig("activesync/getsettingsxml",$_SESSION['EMAIL'],$itemID);
					$item->settings_xml = $detailed_xml_string;
					return $item;
				}
			}
		}
	}
	
	public function getMyRights()
	{
		return $this->rights;
	}
	
	public function deleteItems($oItems = false)
	{
		if($oItems === false){
			$oItems = $this->getItems();
		}
		if($oItems){
			foreach($oItems as $oItem){
				$oItem->delete();
			}
		}
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
		throw new Exc('not_supported');
	}
	
	public function rename($newName)
	{
		throw new Exc('not_supported');
	}
	
	
	public function createItem($aItem)
	{
		throw new Exc('not_supported');
	}
	
	public function sync()
	{
		$this->items = false;
	}
	
	public function search($aFilterTag)
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