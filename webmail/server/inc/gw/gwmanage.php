<?php
class GroupWareManagement 
{
	public $account;

	public function __construct()
	{
		$user = &$_SESSION['user'];
		$this->account = &$user->getAccount($_SESSION['EMAIL'])->gwAccount;
	}
	
	  
	public function getEmailCertificates($email){
		$gwAPI = &$this->account->gwAPI;
		$contacts = $this->getContactIDsByEmail($email);
		if($contacts) foreach ($contacts as $id) {
			$cert = $gwAPI->FunctionCall(
				'GetContactCertificate',
				$this->account->sGWSessionID,
				$id
			);
			if ($cert){
				$certs[] = $cert;
			}
		}
		if($certs){
			$cert = join(LF . LF, $certs);
		}
		if($cert){
			$list = Storage::parseCertificates($cert);
			$result = Storage::getCurrentCertificate($list);
		}else{
			return false;
		}
		return $result;
	}
	
	  
	public function addRecipientsToAddressBook($addresses) {
		$gwAPI = &$this->account->gwAPI;
		$email = $_SESSION['EMAIL'];
		if(!$gwAPI || !$gwAPI->IsConnected() || Folder::isRestrictedType('C')){
			return;
		}
		
		 
		$contacts_default = $_SESSION['user']->getDefaultFolder('C');
		
		try{
			$folder = $this->account->getFolder($contacts_default);
		}catch(Exc $e){
			throw new Exc('default_folder_missing','C');
		}
		$sessionID = $folder->openAccess();

		
		$domaindata = Storage::getDomainDefaults('default_calendar_settings',false);
		$defaultdata = Storage::getDefaults('default_calendar_settings');
		$userdata = Storage::getUserData('default_calendar_settings');
		$calendar_settings = WebmailIqPrivate::get('default_calendar_settings',$defaultdata,$domaindata,$userdata,0);
		 		if(isset($calendar_settings['@childnodes']['item'][0]['@childnodes']['contact_sharing'])){
			$sharing = $calendar_settings['@childnodes']['item'][0]['@childnodes']['contact_sharing'][0]['@value'];
			if(!$sharing){
				$sharing = 'P';
			}
		}else{
			$sharing = 'U';
		}
		
		foreach ($addresses as $item) {
			if ($gwAPI->FunctionCall('IsAddressBookEmail',$email,$item['address'],true))
				continue;
			if(!$item['display']){
				$item['display'] = substr($item['address'],0,strpos($item['address'],'@'));
			}
			$params = $gwAPI->CreateParamLine(array('ITMCLASSIFYAS' => $item['display'], 'ITMSHARETYPE' => $sharing, 'ITMCLASS' => 'C'));
			$id = $gwAPI->FunctionCall('AddContactInfo', $sessionID, $params);
			$params = $gwAPI->CreateParamLine(array('LCTEMAIL1' => $item['address'], 'LCTTYPE' => 'H'));
			$gwAPI->FunctionCall('AddContactLocation', $sessionID, $id, $params);
			
			 			$gwAPI->FunctionCall('AddContactInfo', $sessionID, '', $id);
		}
	}
	
	  
	private function getContactIDsByEmail($email){
		$gwAPI = &$this->account->gwAPI;
		$where = '((ITMCLASS IS NULL OR ITMCLASS=\'C\' OR ITMCLASS=\'\') AND (' .
							'LCTEMAIL1=' . self::quote($email) . ' OR ' .
							'LCTEMAIL2=' . self::quote($email) . ' OR ' .
							'LCTEMAIL3=' . self::quote($email) . '))';
		
		$folder =$this->account->account->getFolder('__@@ADDRESSBOOK@@__');
		$filter['sql'] = $where;
		$items = $folder->getItems($filter);
		if(is_array($items)) foreach($items as $item){
			$result[] = $item->item['ITM_ID'];
		}
		if(is_array($result)){
			return array_unique($result);
		}
	}
	
	
	public function getDistributionListItems($name,$oFolder = false)
	{
		 		$aFilter['sql'] = "(itmclassifyas = '" . str_replace("'", "''", $name) . "' OR itmtitle = '".str_replace("'", "''", $name)."') AND itmclass = 'L'";
		$aFilter['limit'] = "0,1";
		if(!$oFolder){
			$oFolder = $this->account->account->getFolder('__@@ADDRESSBOOK@@__');
		}
		$contacts = $oFolder->getItems($aFilter);

		if(!$contacts){
			throw new Exc('distribution_list_invalid_id',$name);
		}
		$oDL = reset($contacts);
		
		$sDLID = $oDL->item['ITM_ID'];
		
		$oDL = $oFolder->getItem($sDLID);

		$aAddons = $oDL->getAddons();
		$aLocations = $aAddons['location']->getData();

		return $aLocations;
	}
	  
	private static function quote($string) {
		return "'" . str_replace("'", "''", $string) . "'";
	}
	
}

?>
