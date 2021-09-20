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
			$basic = $settings->getPrivate('basic');
			$logged = true;
		}catch(Exception $e){
			$logged = false;
			$layout = $settings->getPublic('layout_settings');
			$basic = $settings->getPublic('basic');
		}
		 		
		$title = $layout['@childnodes']['item'][0]['@childnodes']['title'][0]['@value'];
		$login_title = $layout['@childnodes']['item'][0]['@childnodes']['login_title'][0]['@value'];
		$language = slLanguage::instance();
		
		if($logged){
			if(!$title){$title='';}else{$title.=' - ';}
			$oAccount = $oUser->GetAccount($_SESSION['EMAIL']);
			$title.=$oAccount->fullname?$oAccount->fullname.' <'.$_SESSION['EMAIL'].'>':$_SESSION['EMAIL'];
		}elseif(!$title){
			$title = slLanguage::get('login','title');
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
		
		 
		$type = $data->get('all._s.type');
		$type = $type?$type:'M';
		 
		
		if(isset($basic['@childnodes']['item'][0]['@childnodes']['high_contrast'][0]['@value']))
		{
			$this->setTemplateData('high_contrast',$basic['@childnodes']['item'][0]['@childnodes']['high_contrast'][0]['@value']);
		}
		if(isset($basic['@childnodes']['item'][0]['@childnodes']['swipe'][0]['@value']))
		{
			$this->setTemplateData('swipe',$basic['@childnodes']['item'][0]['@childnodes']['swipe'][0]['@value']);
		}
		if(isset($basic['@childnodes']['item'][0]['@childnodes']['shortcuts'][0]['@value']))
		{
			$this->setTemplateData('disableshortcuts',$basic['@childnodes']['item'][0]['@childnodes']['shortcuts'][0]['@value']);
		}
		
		$this->setTemplateData('theme',$theme);
		$this->setTemplateData('folder_type',$type);
		$this->setTemplateData('title',$title);
	}
	
	public function getBody(&$oXML)
	{
		$aAnchor = array();
		$sBody = '';
		$aBody = array();
		
		$aIDs = array();
		$cid = $this->getProperty('id');
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
						$aIDs[] = $oObjClass->getProperty('id');
						if($aConstruct['xml']['pregenerate']){
							$pregenerated[$oObjClass->getProperty('id')] = $oObjClass->getBody($oObjXML);
						}
						 
					}
				break;
			}
		}
		$this->open($cid);
		$i = 0;
		if($oXML) foreach($oXML as $sObjClass => $oObjXML){
			switch($sObjClass){
				case 'config':
				break;
				case 'helper':
				break;
				default:
					 					$body = "";
					 					$sClass = 'slWidget'.ucfirst(strval($sObjClass));
					$oObjClass = slSingleton::instance($sClass);
					$oObjClass->open($aIDs[$i]);
					if(is_object($oObjClass)){
						if($oObjXML['pregenerate']){
							$body = $pregenerated[$aIDs[$i++]];
						}else{
							$i++;
							$body = $oObjClass->getBody($oObjXML);
						}
						if($anchor = strval($oObjXML['anchor'])){
							$aAnchor[$anchor] = $body;
						}
						$anchoronly = strval($oObjXML['anchoronly']);
						if(!$anchoronly
						|| strtolower($anchoronly)=='false'
						|| strtolower($anchoronly)=='0'
						){
							$sBody .= $body;
						}
					}
				break;
			}
		}
		 
		 
		$this->open($cid);
		$this->setTemplateData( 'language', slLanguage::instance()->getID()  );
		$this->setTemplateData( 'body', $sBody );
		$this->setTemplateData( 'anchor',$aAnchor);
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
