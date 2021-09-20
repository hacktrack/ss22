<?php

class Reminders
{
	static private $instance;

	public $gwAccount;
	public $defaultRights;

    private function __construct(&$account)
	{
		$rights = Folder::RIGHT_READ;
		$rights |= Folder::RIGHT_FOLDER_READ;
		$this->defaultRights = $rights;
		if(!$account->gwAccount){
			throw new Exc('gw_init_error');
		}
		$this->account = &$account;
		$this->gwAccount = &$account->gwAccount;
	}
	
	static public function instance(&$account)
	{
		if(!isset(self::$instance)){
			self::$instance = new Reminders($account);
		}
		return self::$instance;
	}
	
	public function getItem($id)
	{
		$id = base64_decode($id);
		$id = explode('|',$id);
		$data['RMN_ID'] = $id[0];
		$data['EVN_ID'] = $id[1];
		$data['EVNRCR_ID'] = $id[2];
		$data['RMNTIME'] = $id[3];
		$data['RMNMINUTESBEFORE'] = $id[4];
		$data['RMNLASTACK'] = $id[5];
		$data['REMINDERUNIXTIME'] = $id[6];
		$data['EVNFOLDER'] = $id[7];
		$item = new RemindersItem($this,$data);
		return $item;
	}
	
	public function getItemsID()
	{
        return $this->getItems();
	}
	
	public function getItems(&$oFolder,$aFilter = array())
	{
        $items = [];
		$where=$aFilter['sql'];
		$interval = $aFilter['interval'];
		$ctz = $aFilter['timezone'];
		$string = $this->gwAccount->gwAPI->FunctionCall(
			'GetReminderList',
			$this->gwAccount->sGWSessionID,
			$interval.';;;;use_tzid=1',
			$where
		);
		$this->gwAccount->gwAPI->TZClearCache();
		$arr = MerakGWAPI::ParseParamLine($string);
		foreach($arr as $key => $listItem){
			 				 				 
				 
				
				 				 
				$item = new RemindersItem($oFolder,$listItem);
				$items[$item->itemID] = $item;
				$item = false;
			 		}
		return $items;
	}
	
	public function getFolders($refresh = true)
	{
		$result = new stdClass();
		$result->name = '__@@REMINDERS@@__';
		$result->rights = $this->defaultRights;
		return array(0=>$result);
	}

	public function drop()
	{
		
	}
}
?>