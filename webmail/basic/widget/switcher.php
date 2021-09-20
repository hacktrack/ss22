<?php
 

class slWidgetSwitcher extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		
		$settings = WebmailSettings::instance();
		try{
			if(!$_SESSION['SID']){
				throw new Exception();
			}
			$oUser = User::load($_SESSION['SID']);
			$layout = $settings->getPrivate('layout_settings');
			$logged = true;
		}catch(Exception $e){
			$logged = false;
			$layout = $settings->getPublic('layout_settings');
		}
		
		$helperConfig['helper'] = 'settings';
		$helper = slHelperFactory::instance($helperConfig);
		$data = $helper->get();
		$this->setTemplateData('logout_referer',$_SESSION['LOGOUT_REFERER']);
		$ref=$_SESSION['LOGOUT_REFERER'];
		if ($ref=='../') {$ref='./';}
		
		if(isset($layout['@childnodes']['item'][0]['@childnodes']['interfaces'][0]['@value']))
		{
			$interfaces=$layout['@childnodes']['item'][0]['@childnodes']['interfaces'][0]['@value'];
		}
		else
		{
			$interfaces='abp';
		}
		
		$interfaces=array('pro'=>(substr_count($interfaces,'a')>0),'basic'=>(substr_count($interfaces,'b')>0),'pda'=>(substr_count($interfaces,'p')>0));
		if(!$interfaces['pro'] && !$interfaces['pda']){$interfaces=false;}
		if(isset($_SESSION['ACCOUNT']) || $_SESSION['ACCOUNT']==1)
		{
			$interfaces=array('pro'=>true,'basic'=>true,'pda'=>true);
		}
		
		$this->setTemplateData('interfaces',$interfaces);
		$this->setTemplateData('logout_referer_encoded',urlencode($ref));
		$this->setTemplateData('sid',session_id());
		$this->setTemplateData('licenseType',Storage::getLicenseType());
		$this->setTemplateData('admin_account',!($_SESSION['ACCOUNT']));
	}
}

?>