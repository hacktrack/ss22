<?php


class slWidgetMenu_left extends slWidget
{
	public function getBody(&$oXML)
	{
		 
		$ui = slGUI::instance();
		$menu_left='';

		$type=strval($oXML->config->type);
		$this->setTemplateData('treeType',array($type=>true));

		$data = slRequest::instance();

		 

		$config['helper']='settings';
		$set = slHelperFactory::instance($config);
		 		 		 		$settings=$set->get();
		$settings=$settings['settings'];

		$topAction=array();

		$viewType=slRequest::instance()->get('all._s.type');

		$lang=slLanguage::instance();
		
		 
		if(isset($_SESSION['EMAIL'])){
			$this->setTemplateData('email',$_SESSION['EMAIL']);
		}
		
		if($viewType=='Q'){
			$topAction['text']=$lang->get('quarantine','add');
			$topAction['link']='#';
			$topAction['active']=false;
		}
		elseif($viewType=='QL'){
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=view.bwlist&p3=item.fdr';
			if (slRequest::instance()->get('all._s.id')) {
				$folder = urlencode(slRequest::instance()->get('all._s.id'));
			}else{
				$folder='Quarantine';
			}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('quarantine','add');
			$topAction['active']=false;
			if (slRequest::instance()->get('all.p2')=='view.bwlist')
			{
				$topAction['active']=true;
			}
		}
		elseif ($viewType=='C')
		{
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=contact.detail&p3=item.fdr';
			$folder = urlencode($settings['default_folders']['contacts']);
			if (slRequest::instance()->get('all._s.id')) {$folder=slRequest::instance()->get('all._s.id');}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('contact_main','add');
			$topAction['type']=$viewType;
			if (slRequest::instance()->get('all._n.p.content')=='contact.detail')
			{
				$topAction['active']=true;
			}
		}
		elseif ($viewType=='E')
		{
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=event.detail&p3=item.fdr&p4=';
			$folder = urlencode($settings['default_folders']['events']);
			if (slRequest::instance()->get('all._s.id')) {$folder=slRequest::instance()->get('all._s.id');}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('event_main','add');
			$topAction['type']=$viewType;
			if (slRequest::instance()->get('all._n.p.content')=='event.detail')
			{
				$topAction['active']=true;
			}
		}
		elseif ($viewType=='T')
		{
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=tasks.detail&p3=item.fdr&p4=';
			$folder = urlencode($settings['default_folders']['tasks']);
			if (slRequest::instance()->get('all._s.id')) {$folder=slRequest::instance()->get('all._s.id');}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('tasks_main','add');
			$topAction['type']=$viewType;
			if (slRequest::instance()->get('all._n.p.content')=='tasks.detail')
			{
				$topAction['active']=true;
			}
		}
		elseif ($viewType=='N')
		{
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=notes.detail&p3=item.fdr&p4=';
			$folder = urlencode($settings['default_folders']['notes']);
			if (slRequest::instance()->get('all._s.id')) {$folder=slRequest::instance()->get('all._s.id');}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('notes','add');
			$topAction['type']=$viewType;
			if (slRequest::instance()->get('all._n.p.content')=='notes.detail')
			{
				$topAction['active']=true;
			}
		}
		elseif ($viewType=='F')
		{
			$topAction['link']='?_l=folder&p0=main&p1=content&p2=file.detail&p3=item.fdr&p4=';
			$folder = urlencode($settings['default_folders']['files']);
			if (slRequest::instance()->get('all._s.id')) {$folder=slRequest::instance()->get('all._s.id');}
			$topAction['link'].='&p4='.$folder.'&_n[p][main]=win.main.tree&p5='.$viewType;
			$topAction['text']=$lang->get('files','add');
			$topAction['type']=$viewType;
			if (slRequest::instance()->get('all._n.p.content')=='file.detail')
			{
				$topAction['active']=true;
			}
		}
		else
		{
			$topAction['link']='?_n[p][content]=mail.compose&_n[p][main]=win.main.tree';
			$topAction['text']=$lang->get('tree','new_message');
			$topAction['type']='M';
			if (slRequest::instance()->get('all._n.p.content')=='mail.compose')
			{
				$topAction['active']=true;
			}
		}
		
		
		
		$this->setTemplateData('topAction',$topAction);

		 
		$links=array();
		 		slSystem::import('controller/dialog');
		if($dlg = slControllerDialog::getCurrentDialogName()){
			$links=array(
				'new'=>'#',
				'fm'=>'#'
			);
		}
		if($distrib = $data->get('get.distribution_contact')){
			$links = array(
				'new'=>'#',
				'fm'=>'#',
				'folders'=>'#'
			);
		}

		$this->setTemplateData('links',$links);


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
			elseif($np=='mail_compose')
			{
				$active['lmtnewmail']=true;
			}
			else
			{
				$blank=true;
			}
		}


		$this->setTemplateData('activeLeftMenuTab',$active);

		$type = $data->get('all._s.type');
		$type = $type?$type:'M';
		if($type=='S'){
			$helperConstructor['helper'] = 'settings';
			$helper = slHelperFactory::instance($helperConstructor);
			$sections = $helper->getSections();
			$personal = $sections['sections'];
			 		}else{
			$helperConstructor['helper'] = $this->getProperty('helper');
			$helper = slHelperFactory::instance($helperConstructor);
			$personal = $helper->getPersonalFolders($type);
			
			if (is_array($personal))
			{
				$i=0;
				foreach($personal as $folder => $fdr){
					$i++;
					if ($i==count($personal)) {$personal[$folder]['islast'] = true;}
					
					 
					 					$personal[$folder]['id'] = $folder;
					if($dlg = slControllerDialog::getCurrentDialogName()){
						$personal[$folder]['link_suffix'] = '&_dlg='.$dlg;
						if($dlg=='contact.distribution'){
							$df = $data->get('all._s.distrib_folder');
							$df = $df?$df:$data->get('all.container');
							$personal[$folder]['link_suffix'].=
								'&_s[distrib_id]='.$data->get('all._s.distrib_id').
								'&_s[distrib_folder]='.$df;
							$personal[$folder]['page'] = 'contact.select';
						}else{
							$personal[$folder]['page'] = $dlg;
						}
					}
					if($distrib){
						$personal[$folder]['link_suffix'] ='#';
					}
					$personal[$folder]['urlid'] = rawurlencode($folder);
					 					 	
					 	
					$personal[$folder]['active'] = ($at==str_replace('.','_',$folder) || ($blank && $folder=='INBOX' && $np!='settings'))?true:false;
					$personal[$folder]['link'] = '?_l=folder&p0=main&p1=content&p2='.$personal[$folder]['page'].'&p3=item.fdr&p4='.$personal[$folder]['urlid'].'&p5='.$personal[$folder]['type'].$link_suffix;
					 				}
			}
		}

		$this->setTemplateData('type',$type);
		
		$active=false;
		if(!is_iterable($personal)) $personal = [];
		foreach($personal as $key=>$val)
		{
			if ($val['active'])
			{
				$active=true;
			}
			$example=$val;
			 			 			 			$personal[$key]['label']=str_replace('  ','&nbsp; ',$val['label']);
		}
		
		 
		if($data->get('all.p5')=='M')
		{
			$archive['active']=false;
			if($data->get('all.p4')=='__@@ARCHIVE@@__')
			{
				$archive['active']=true;
				$active=true;
			}
			$archive['is_default']=false;
			$archive['id']='__@@ARCHIVE@@__';
			$archive['link']=str_replace('&p4='.$example['urlid'].'&','&p4='.rawurlencode('__@@ARCHIVE@@__').'&',$example['link']);
			$archive['urlid']=rawurlencode('__@@ARCHIVE@@__');
			 			$archive['label']=$lang->get('tree','archive');
			$personal['__@@ARCHIVE@@__']=$archive;
		}
		 
		
		if (!$active && $data->get('all.p5'))
		{
			$example['link']=str_replace('&p4='.$example['urlid'].'&','&p4='.rawurlencode($data->get('all.p4')).'&',$example['link']);
			
			$example['active']=true;
			$example['is_default']=false;
			$example['id']=$data->get('all.p5');
			$example['urlid']=rawurlencode($data->get('all.p4'));
			 			$example['label']=explode('/',$data->get('all.p4'));
			$example['label']=slToolsPHP::htmlspecialchars($example['label'][count($example['label'])-1]);
			
			$personal[$data->get('all.p4')]=$example;
		}
		
		 		
		$this->setTemplateData('leftMenu',$personal);
		 

		$type = $data->get('all._s.type');
		$type = $type?$type:'M';
		 
		$this->setTemplateData('folder_type',$type);

		$file = $ui->getFile('template','menu.left');
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
		$iconFile='';
		 
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
			$menu_leftitem = $root->addNode(
				strval($component["id"]),
				strval($component["label"]),
				strval($component["link"])
			);
			 			if ($component->children()){
				foreach($component->children() as $com){
					$this->buildFromXML($menu_leftitem,$com);
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