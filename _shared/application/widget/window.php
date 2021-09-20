<?php

class slWidgetWindow extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);

	}
	public function getBody(&$oXML)
	{
		$sBody = '';
		$aBody = array();
		$ui = slGUI::instance();
		if($oXML) foreach($oXML as $sObjClass => $oObjXML){
			switch($sObjClass){
				case 'config':
				break;
				case 'helper':
					$this->createHelper( $oObjXML );
				break;
				default:
					 					$aConstruct['objID'] = strval($sObjClass);
					$aConstruct['xml'] = $oObjXML;
					$aConstruct['parent'] = &$this;
					 					$oObjClass = $ui->instanceWidget($aConstruct);
					if(is_object($oObjClass)){
						$oObjClass->create($aConstruct);
						$sBody .= $oObjClass->getBody($oObjXML);
					}
				break;
			}
		}
		$this->setTemplateData( 'language', slLanguage::instance()->getID()  );
		$this->setTemplateData( 'body', $sBody );
		 		$oUI = slGUI::instance();
		if(@$js = $oUI->getJavascript()){
			$this->setTemplateData('javascript',array_values($js));
		}
		if(@$css = $oUI->getStyleSheet()){
			$this->setTemplateData('stylesheet',array_values($css));
		}
		$sBody = slGUI::template($this->getTemplateFile(),$this->getProperty('aTemplate'));
		return $sBody;
	}
}
?>
