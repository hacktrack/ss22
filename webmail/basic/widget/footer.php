<?php
require_once( SHAREDLIB_PATH.'system.php');
 
class slWidgetFooter extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$oLanguage = slLanguage::instance();
		$mAPI = createobject('API');
		$sVersion = $mAPI->GetProperty('C_Niceversion');
		$sCopyright = sprintf($oLanguage->get('login','copyright'),$sVersion);
		$sCopyright = str_replace("$1",$sVersion,$sCopyright);
		$this->setTemplateData('copyright',$sCopyright);
	}
}

?>
