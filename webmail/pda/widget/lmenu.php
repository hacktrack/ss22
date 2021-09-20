<?php


class slWidgetLmenu extends slWidget
{	
	public function getBody(&$oXML)
	{
		 
		$ui = slGUI::instance();
		$Lmenu='';
		
		$type=strval($oXML->config->type);
		$this->setTemplateData('treeType',array($type=>true));
		
		$data = slRequest::instance();
		
		 
		
		
		$at=str_replace(".",'_',$data->get('all._s.id'));
		$np=str_replace(".",'_',$data->get('all._n.p.content'));
		
		$blank=false;
		
		if ($at!='')
		{
			$active[$at]=true;
		}
		else
		{
			if ($np=='manage_folders')
			{
				$active['lmtfolders']=true;
			}
			elseif($np=='compose_mail')
			{
				$active['lmtnewmail']=true;
			}
			else
			{
				$blank=true;
			}
		}
		$this->setTemplateData('activeLeftMenuTab',$active);
		
			$helperConstructor['helper'] = $this->getProperty('helper');
			$helper = slHelperFactory::instance($helperConstructor);
			$personal = $helper->getPersonalFolders('M');
			
			if (is_array($personal))
			{
				foreach($personal as $folder => $fdr){
					 
					 					$personal[$folder]['id'] = $folder;
					$personal[$folder]['active'] = ($at==str_replace('.','_',$folder) || ($blank && $folder=='INBOX'))?true:false;
				}
			}
			
			
		$this->setTemplateData('leftMenu',$personal);
		
		 
		
		$file = $ui->getFile('template','lmenu');
		$result = $ui->template($file,$this->getProperty('aTemplate'));
		return $result;
		 
	}
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$xml = $aConstruct['xml'];
		$this->setProperty('xml',$xml);
		$this->setProperty('id',strval($xml['id']));
		$this->setProperty('label',slLanguage::getLabel(strval($xml['label'])));
		$this->setProperty('targetData',slLanguage::getLabel(strval($xml->config->targetData)));
		$ui = slGUI::instance();
		$iconFile = $ui->getFile(
			'css/images/Lmenu/',	 			'folder',	 			true,	 			'.gif'	 		);
		$iconPath = dirname($iconFile).'/';
		$this->setTemplateData('path',$iconPath);
		$this->setTemplateData('id',str_replace('.','_',strval($xml['id'])));
		if($xml['helper']){
			$this->setProperty('helper',strval($xml['helper']));
			$this->setProperty('dataID',strval($xml->config->data));
		}
		if($xml->config->link){
			$this->setProperty('link',strval($xml->config->link));
		}
	}
	
	  
	private function buildFromList($aList)
	{
		$ui = slGUI::instance();
		$router = slRouter::instance();
		try{
			$link = $this->getProperty('link');
		}catch(Exception $e){
			$link = false;
		}
		foreach($aList as $id =>$folder)
		{
			$linkParam['window'] = 'main';
			$linkParam['target'] = $this->getProperty('target');
			$linkParam['view'] = $folder['page'];
			$linkParam['data'] = $this->getProperty('targetData');
			$linkParam['type'] = $folder['type'];
			$linkParam['id'] = $folder['folder'];
			
			$aList[$id]['link'] = $router->getCompressedLink( 'folder' , $linkParam );
			 
			
		}
		
		if (isset($_GET['folder'])) {$folderInfo=$_GET['folder'];}
		if (isset($_POST['folder'])) {$folderInfo=$_POST['folder'];}
		
		 		$this->setTemplateData('items',$aList);
	}
	
	private function buildFromXML($root,$xml)
	{
		if ($xml && $xml->children())
		foreach($xml->children() as $cname => $component)
		{
			 			if (strtolower($cname)=='config'){
				continue;
			}
			$Lmenuitem = $root->addNode(strval($component["id"]),strval($component["label"]),strval($component["link"]));
			 			if ($component->children()){
				foreach($component->children() as $com){
					$this->buildFromXML($Lmenuitem,$com);
				}
			}
		}
	}
	
	public function generate()
	{
		$result = array();
		if ($this->getProperty('root')->nodes){
			foreach($this->getProperty('root')->nodes as $node){
				$node->generate($result);
			}
		}
		$this->setTemplateData('items',$result);
	}
}

?>