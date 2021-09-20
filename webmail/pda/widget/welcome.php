<?php

class slWidgetWelcome extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$language = slLanguage::instance();
		$request = slRequest::instance();
		$xml = $aConstruct['xml'];
		 		$this->setTemplateData('sid',$_SESSION['SID']);
		if($_SESSION['DISK_QUOTA']){
			$quota = $_SESSION['DISK_QUOTA'];
			$quota = $quota?round($quota/1024,2):'0';
			$this->setTemplateData('quota',(string) $quota);
			$mAccount = new MerakAccount();
			$mAccount->Open($_SESSION['EMAIL']);
			$size = $mAccount->GetProperty("U_MailboxSize");
			$size = $size?round($size/1024,2):'0';
			$this->setTemplateData('usage',(string) $size);
		}
		$user = $_SESSION['user'];
		$account = $user->getAccount($_SESSION['EMAIL']);
		$this->setTemplateData('gw_enabled',true);
		try{
			if(!$account->gwAccount->gwAPI->isConnected()){
				throw new Exc('gw_disabled');
			}
		}catch(Exc $e){
			$this->setTemplateData('gw_enabled',false);
		}
	}
}
?>