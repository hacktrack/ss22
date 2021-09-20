<?php
 class slWidgetWindow extends slWidget
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
		$title = $layout['@childnodes']['item'][0]['@childnodes']['title'][0]['@value'];
		$login_title = $layout['@childnodes']['item'][0]['@childnodes']['login_title'][0]['@value'];
		$language = slLanguage::instance();
		if(!$title){
			if($logged){
				$oAccount = $oUser->GetAccount($_SESSION['EMAIL']);
				$title = $oAccount->fullname?$oAccount->fullname.' <'.$_SESSION['EMAIL'].'>':$_SESSION['EMAIL'];
			}else{
				$title = slLanguage::get('login','title');
			}
		}
		
		$data = slRequest::instance();
		$at=str_replace(".",'_',$data->get('get._n.p.content'));
		if ($at!='')
		{
			$active[$at]=true;
			$theme=$at;
		} else {
			$active['none']=true;
			$theme='none';
		}
		if($dombase = $aConstruct['xml']->config->base){
			if($dombase->href){
				$base['href'] = strval($dombase->href);
			}
			if($dombase->target){
				$base['target'] = strval($dombase->target);
			}
			$this->setTemplateData('base',$base);
		}
		
		$this->setTemplateData('sid',$_SESSION['SID']);
		$this->setTemplateData('theme',$theme);
		$this->setTemplateData('title',$title);
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
