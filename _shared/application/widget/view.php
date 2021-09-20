<?php

class slWidgetView extends slWidget
{
	public function create($aConstruct)
	{
		$t = time();
		$m = microtime();
		parent::create($aConstruct);
		$sPageID = slSession::instance()->getMain('["pages"]["'.$this->getProperty('id').'"]');
		if(!$sPageID){
			if($aConstruct['xml']['default']){
				$sPageID = strval($aConstruct['xml']['default']);
			}else{
				$sPageID = 'default';
			}
		}
		$ui = slGUI::instance();
		$xmlPath = $ui->getFile('view',$sPageID,'.xml');
		slSession::setMain('actual_page',$this->getProperty('id'));
		if(!$xmlPath){
			throw new Exception('file_does_not_exist:'.slToolsPHP::htmlspecialchars($sPageID).'.xml');
		}
		$xml = slToolsXML::loadFile($xmlPath);
		$this->setProperty('xml',$xml);
		 	}
	
	public function getBody(&$oXML)
	{
		$t = time();
		$m = microtime();
		$xml = $this->getProperty('xml');
		$body = parent::getBody($xml);
		 		return $body;
	}
}
?>
