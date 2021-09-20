<?php

class GroupFolder extends Folder
{
	public $type;
	public $gwID;
	public $count;
	public $account;
	public $folderID;

    public function __construct(GroupAccount &$account, $folderID)
	{
		$this->account = $account;
		$this->name = $folderID;
		$this->gwID = substr($folderID,strlen('__@@GROUP@@__') + 1);
		$this->folderID = $folderID;
		$this->type = 'Z';
	}		
	
	public function getItems(&$aFilterTag = array(), $createObject = true, $ignoreHidden = true)
	{
		$from = 0;
		if($aFilterTag['offset']){
			$from = $aFilterTag['offset'];
			$sParameters = '&from='. $aFilterTag['offset'];
		}
		if($aFilterTag['limit']){
			$sParameters .= '&to='. ($from + $aFilterTag['limit'] - 1);
		}
		$sFilter = '';
		if($aFilterTag['email']){
			$sFilter .= '&email='.$aFilterTag['email'];
		}
		if($aFilterTag['name']){
			$sFilter .= '&name='.$aFilterTag['name'];
		}
		if($aFilterTag['everywhere']){
			$sFilter .= '&everywhere='.$aFilterTag['everywhere'];
		}
		if($aFilterTag['startswith']){
			$sFilter.= '&startswith=1';
		}
		
		
		$sParameters.= $sFilter?('&filter='.urlencode($sFilter)):'';
		$sParameters.= '&otherselect=ownerid';
		
		if($aFilterTag['noexpand']){
			$sParameters.= '&noexpand=1';
		}

		
		 		$gwAPI = &$this->account->gwAccount->gwAPI;
		$gwAccount = &$this->account->gwAccount;
		$gwFolder = $gwAccount->getFolder($this->gwID);
		$sFID = $gwFolder->openAccess();
		$items = $gwAPI->FunctionCall(
			'GetExpandedFolderMembers',
			$gwAccount->sGWSessionID,
			MerakGWAPI::encode($this->gwID),
			$sParameters
		);
		$items = $gwAPI->ParseParamLine($items);
		$this->count = $items[0]['FRTTOTALCOUNT']?$items[0]['FRTTOTALCOUNT']:0;
		if($items){
			foreach($items as $item){
				 				if($item['FRTEMAIL']=='@@totalcount@@'){
					$this->count = $item['FRTINDEX'];
				 				}else{
					$result[$item['FRTEMAIL']] = new GroupItem($this,$item);
				}
			}
		}
		return $result;
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
		unset($this->account->folders['group'][$this->folderID]);	
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