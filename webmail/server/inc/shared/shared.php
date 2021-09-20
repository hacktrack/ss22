<?php

class SharedAccounts
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
		$this->gwAccount = &$account->gwAccount;
	}
	
	static public function instance(&$account)
	{
		if(!isset(self::$instance)){
			self::$instance = new SharedAccounts($account);
		}
		return self::$instance;
	}
	public function getItemsID()
	{
		return $this->getItems();
	}
	public function getItems($aFilter = array())
	{
		$string = $this->gwAccount->gwAPI->FunctionCall(
			'GetShareAccountList',
			$this->gwAccount->gwAPI->sessid,
			75
		);
		$arr = MerakGWAPI::ParseParamLine($string);
		foreach($arr as $key => $listItem){
			$item = new stdClass();
			$item->uid = $listItem['FRTEMAIL'];
			$item->size = 0;
			$item->subject = $item->uid;
			$item->from = $listItem['OWNERNAME'];
			$item->to = 'dummy';
			$item->date = 0;
			 			if(!($listItem['FLAGS'] & 32) && ($listItem['FLAGS'] & 1)){
				$item->flags = 0;
				$list[$item->uid] = $item;
			}
			 			if(($listItem['FLAGS'] & 2) || ($listItem['FLAGS'] & 64)) {
				$item->flags = 4;
				$list[$item->uid] = $item;
			}
			$item = false; 
		}
		return $list;
	}
	
	public function getFolders($refresh = true)
	{
		$result = new stdClass();
		$result->name = '__@@SHARED@@__';
		$result->rights = $this->defaultRights;
		return array(0=>$result);
	}
	public function drop()
	{
		
	}
}
?>