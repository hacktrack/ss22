<?php

class slControllerAccount extends slControllerDefault
{
	public function check(&$action, &$data)
	{
		parent::check($action,$data);
		if($this->param['original_action']=='dialog'){
			$action = $this->param['action'];
		}
		switch($action){
			case 'sync':
				if(!($this->oUser = &$_SESSION['user'])){
					throw new Exception('Unauthorized');
				}
				if(!$this->oUser->aAccounts){
					throw new Exception('No Accounts');
				}
			break;
		}
	}
	
	public function sync()
	{
		$result = new stdClass();
		$oAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
		$oAccount->sync();
		$oAccount->aSyncedFolders = array();
		 		foreach($oAccount->folders["main"] as $oFolder){
			if ($oFolder->sync){
				$oFolder->sync();
			}
		}
		$result->redirect = true;
		$result->back = true;
		 		return $result;
	}
}