<?php

class DevicesItem
{
	static $api;
	public $item;
	public $itemID;
	public $wmclass;
	public $accountID;
	public $deviceID;

    public function __construct($item)
	{
		$this->item = $item;
		$this->itemID = $item['id'];
		$this->accountID = $_SESSION['EMAIL'];
		$this->deviceID = $this->itemID;
		$this->folder = &$folder;
		$this->wmclass= 'DEVICES';
	}
	
	public function edit($parameters)
	{
		$result = false;
		 		if($parameters['friendly_name']){
			$name = $parameters['friendly_name'];
			$result = $this->callDeviceAction('setname',$name) && $result;
		}
		 		if($parameters['settings_xml']){
			$xml = $parameters['settings_xml'];
			$result = $this->callDeviceAction('setsettingsxml',$xml) && $result;
		}
		return $result;
	}
	
	public function setName($param)
	{
		
	}
	
	public function setWipe()
	{
		$this->callDeviceAction('SetWipe');
	}
	
	public function resetWipe()
	{
		$this->callDeviceAction('ResetWipe');
	}
	
	public function delete()
	{
		$this->callDeviceAction('Delete');
	}
	
	private function getAPI() 
	{
		if(!$this->api){
			$this->api = createobject('API');
		}
		return $this->api;
	}
	
	private function callDeviceAction($action, $param = '')
	{
		$api = $this->getAPI();
		switch(strtolower($action)){
			case 'setname':
				$command = '<setname account_id="'.$this->accountID.'" device_id="'.$this->deviceID.'">';
				$command.= $param;
				$command.='</setname>';
				break;
			case 'delete':
				$command = '<delete account_id="'.$this->accountID.'" device_id="'.$this->deviceID.'" />';
			break;
			case 'setwipe':
				$command = '<setwipe account_id="'.$this->accountID.'" device_id="'.$this->deviceID.'" />';
			break;
			case 'resetwipe':
				$command = '<resetwipe account_id="'.$this->accountID.'" device_id="'.$this->deviceID.'" />';
			break;
			case 'setsettingsxml':
				$command = '<setsettingsxml account_id="'.$this->accountID.'" device_id="'.$this->deviceID.'">';
				$command.= $param;
				$command.='</setsettingsxml>';
				break;
		}
		return $api->ManageConfig('activesync/processcommand',$command);
	}
	
	
	
}