<?php

class SizeFolder extends Folder
{
	public $type;
	public $groupOwnerEmail;
	public $count;
	public $account;
	public $folderID;

    public function __construct(SizeAccount &$account, $folderID)
	{
		$this->account = $account;
		$this->folderID = $folderID;
		$this->name = $folderID;
		$this->groupOwnerEmail = substr($folderID,strlen('__@@SIZE@@__') + 1);
		$this->type = 'A';
	}		
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		 		$gwAPI = &$this->account->gwAccount->gwAPI;

		$items = $gwAPI->FunctionCall(
			'GetFolderListWithSize',
			$this->account->gwAccount->sGWSessionID,
			$this->groupOwnerEmail
		);
		$items = $gwAPI->ParseParamLine($items);
		if($items){
			foreach($items as $item){
					$result[$item['FDR_ID']] = new SizeItem($this,$item);
			}
            $this->count = count($items);
		}
		return $result;
	}

	public function getSize()
	{
		return $this->account->gwAccount->gwAPI->FunctionCall(
			"GetGroupSize",
			$this->account->gwAccount->sGWSessionID,
			$this->groupOwnerEmail
		);
	}

	public function getQuota()
	{
		return $this->account->gwAccount->gwAPI->FunctionCall(
			"GetGroupQuota",
			$this->account->gwAccount->sGWSessionID,
			$this->groupOwnerEmail
		);		
	}

	public function countItems($flags = 0)
	{
		return $this->count;
	}
	
	public function getMyRights()
	{
		return array();
	}
	
	public function delete()
	{
		unset($this->account->folders['size'][$this->folderID]);	
	}
	
	public function rename($name)
	{
		return false;
	}
	
	public function deleteItems($oItems = false)
	{
		return false;
	}
	
	public function moveItems(&$oFolder, $oItems = false)
	{
		return false;
	}
	
	public function copyItems(&$oFolder, $oItems = false)
	{
		return false;
	}
	
	public function sync()
	{
		return true;
	}

    public function setDefault($type, $updateSettings = true){}

    public function setSubscription($state){}

    public function setNotify($bValue){}

    public function setChannels($mailbox, $channels, $encoded = false){}
}

?>