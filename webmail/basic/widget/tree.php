<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('application/helper');
slSystem::import('io/router');

class slWidgetTree extends slWidget
{
	private function getIcoClass($ico)
	{
		$class=explode('.',$ico);
		unset($class[(count($class)-1)]);
		$class=join(".",$class);
		return $class;
	}

	private function getValues($node)
	{
		$node['_VALUES_']['ueid']=rawurlencode($node['_VALUES_']['id']);
		$node['_VALUES_']['uename']=rawurlencode($node['_VALUES_']['name']);

		$node['_VALUES_']['icoClass']=$this->getIcoClass($node['_VALUES_']['ico']);
		$node['_VALUES_']['linkedClass']='';
		$node['_VALUES_']['linked']=false;
		$node['_VALUES_']['url_name']=rawurlencode(str_replace('#/','',$node['_VALUES_']['id']));
		
		if (is_array($this->linked))
		{
			if (in_array($node['_VALUES_']['id'],$this->linked))
			{
				$node['_VALUES_']['linkedClass']=' linked';
				$node['_VALUES_']['linked']=true;
				if($_GET['_s']['type']=='C' && $node['_VALUES_']['isDefault'])
				{
					$node['_VALUES_']['link_name_forced']=$this->linked_names[$node['_VALUES_']['id']]['label'].",".'Address Book';
					$node['_VALUES_']['link_name']=$this->linked_names[$node['_VALUES_']['id']]['label'];
				}
				else
				{
					$node['_VALUES_']['link_name']=$this->linked_names[$node['_VALUES_']['id']]['label'];
				}
			}
			elseif($_GET['_s']['type']=='C' && $node['_VALUES_']['isDefault'])
			{
				$node['_VALUES_']['link_name_forced']='Address Book';
			}
		}
		
		if ($node['_VALUES_']['id']==$active)
		{
			$node['_VALUES_']['active']=true;
		}
		else
		{
			$node['_VALUES_']['active']=false;
		}
		
		 
		
		
		$node['_VALUES_']['_RIGHTS_']=array();

		$node['_VALUES_']['_RIGHTS_']['delete']=true;
		$node['_VALUES_']['_RIGHTS_']['empty']=true;
		$node['_VALUES_']['_RIGHTS_']['unlink']=true;
		$node['_VALUES_']['_RIGHTS_']['href']=true;
		$node['_VALUES_']['_RIGHTS_']['link']=true;
		$node['_VALUES_']['_RIGHTS_']['rename']=true;
		$node['_VALUES_']['_RIGHTS_']['add']=true;
		$node['_VALUES_']['_RIGHTS_']['showLinkCheckbox']=true;
		$node['_VALUES_']['_RIGHTS_']['default']=true;
		$node['_VALUES_']['_RIGHTS_']['showIcon']=true;

		if ($node['_VALUES_']['icoClass']=='ico_accounts')
		{
			$node['_VALUES_']['_RIGHTS_']['showLinkCheckbox']=false;
		}
		
		if ($node['_VALUES_']['step'])
		{
			$node['_VALUES_']['_RIGHTS_']['showLinkCheckbox']=false;
			if($node['_VALUES_']['icoClass']!='ico_accounts')
			{
				$node['_VALUES_']['_RIGHTS_']['showIcon']=false;
			}
		}

		if ($node['_VALUES_']['isDefault'])
		{
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			if ($node['_VALUES_']['type']=='C')
			{
				$node['_VALUES_']['_RIGHTS_']['unlink']=true;
				 			}
			$node['_VALUES_']['_RIGHTS_']['default']=false;
		}

		if (isset($node['_VALUES_']['public']) && $node['_VALUES_']['public'])
		{
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			$node['_VALUES_']['_RIGHTS_']['empty']=false;
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['add']=true;
			$node['_VALUES_']['_RIGHTS_']['showLinkCheckbox']=false;
			$node['_VALUES_']['_RIGHTS_']['default']=false;
			$node['_VALUES_']['_RIGHTS_']['href']=false;
		}
		
		if ($node['_VALUES_']['wmtype']=='X' || $node['_VALUES_']['wmtype']=='S')
		{
			$node['_VALUES_']['_RIGHTS_']['href']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			$node['_VALUES_']['_RIGHTS_']['empty']=false;
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['default']=false;
		}

		if ($node['_VALUES_']['subtype']=='inbox')
		{
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['default']=false;
		}

		if ($node['_VALUES_']['icoClass']=='ico_accounts')
		{
			$node['_VALUES_']['_RIGHTS_']['href']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			$node['_VALUES_']['_RIGHTS_']['empty']=false;
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['default']=false;
		}

		if ($node['_VALUES_']['subtype']=='spam')
		{
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
		}


		if ($node['_VALUES_']['_RIGHTS_']['delete'])
		{
			$node['_VALUES_']['_RIGHTS_']['empty']=true;
		}
		if ($node['_VALUES_']['_RIGHTS_']['delete'] && $node['_VALUES_']['_RIGHTS_']['empty'])
		{
			$node['_VALUES_']['_RIGHTS_']['dempty']=true;
		}

		 

		if ($node['_VALUES_']['disabled'])
		{
			$node['_VALUES_']['_RIGHTS_']['href']=false;
			$node['_VALUES_']['_RIGHTS_']['delete']=false;
			$node['_VALUES_']['_RIGHTS_']['link']=false;
			$node['_VALUES_']['_RIGHTS_']['unlink']=false;
			$node['_VALUES_']['_RIGHTS_']['empty']=false;
			$node['_VALUES_']['_RIGHTS_']['rename']=false;
			$node['_VALUES_']['_RIGHTS_']['dempty']=false;
		}
		
		 
		if (!is_numeric($node['_VALUES_']['rights']))
		{
			$rights=$node['_VALUES_']['rights'];
			if (strpos($rights,'t')===false){$node['_VALUES_']['_RIGHTS_']['empty']=false;}
			if (strpos($rights,'k')===false){$node['_VALUES_']['_RIGHTS_']['add']=false;}
			if (strpos($rights,'x')===false)
			{
				$node['_VALUES_']['_RIGHTS_']['rename']=false;
				$node['_VALUES_']['_RIGHTS_']['delete']=false;
			}
		}
		 
		 

		 

		return $node;
	}
	
	private function getTreeNode($node,$prev=array(),$last=false,$class="",$active)
	{
		 		
		$ui = slGUI::instance();
		$ret='<ul'.$class.'>';
		if (is_array($node))
		{

			$val='';
			
			if (isset($node['_VALUES_']))
			{

				if (isset($node['_VALUES_']['id']) && $node['_VALUES_']['name']!='')
				{
					$file = $ui->getFile('template','tree.item');
					
					 
					$node=$this->getValues($node,$active);
					 

					$data = slRequest::instance();
					$afolder=$data->get('get.folder.active');

					$folder=array();
					
					if ($node['_VALUES_']['id']==$afolder)
					{
						$ui = slGUI::instance();
		
						 						
						$replaceWhat=array('#/','#','~','INBOX','Sent','Drafts','Trash');
						$replaceFor=array('','Root','',slLanguage::instance()->get('common_folders','inbox'),slLanguage::instance()->get('common_folders','sent'),slLanguage::instance()->get('common_folders','drafts'),slLanguage::instance()->get('common_folders','trash'));
						$node['_VALUES_']['cid']=str_replace($replaceWhat,$replaceFor,$node['_VALUES_']['id']);
						$ui->setTemplateData(array('folder'=>$node['_VALUES_']));
					}

					$item=$ui->template($file,array('item'=>$node['_VALUES_'],'folder'=>$folder));
					$val=$item;
				}
			}

			$data = slRequest::instance();
			$afolder=str_replace(".",'_',$data->get('get.folder.active'));

			if (trim($val)!='')
			{
				$nodeClass='';

				if (count($prev)==0) {$nodeClass.='minus';}
				elseif (count($node)>1)
				{
					if ($_SESSION['jscheck']==1)
					{
						if (substr_count($afolder,$node['_VALUES_']['id'].'/')==0) {$nodeClass.='plus';} else{$nodeClass.='minus';}
					} else{$nodeClass.='minus';}
				}
				else {$nodeClass.='nopm';}

				if (count($prev)==0) {$nodeClass.=' nobg';}
				elseif ((count($prev)==1 && count($node)==1) || $last) {$nodeClass.=' end';}
				else {$nodeClass.='';}

				$ret.="<li class=\"$nodeClass\">".$val;
			}


			 			 

			$nc=count($node);
			$i=1;
			foreach ($node as $key=>$val)
			{
				if ($key!='_VALUES_')
				{
					if ($i==$nc) {$last=true;} else {$last=false;}
					$ret.=$this->getTreeNode($val,$node,$last,'',$active);
				}
				$i++;
			}
			$ret.="</li>";
		}

		return $ret."</ul>";
	}

	private function cleanTree($data,$type,$name='')
	{
		$donotdelete=false;
		
		if (isset($data['_VALUES_']['type']) && ($data['_VALUES_']['type']!=$type && $data['_VALUES_']['type']!='X'))
		{
			if(!$donotdelete)
			{
				unset($data);
			}
		}
		elseif(count($data)>=1)
		{
			$ico='folder_normal.gif';
			if(substr($name,0,1)=='~'){$ico='ico_accounts.gif';}
			if(!isset($data['_VALUES_'])){
				$values=array(
						'subtype'=>'common',
						'ico'=>$ico,
						'page'=>'x',
						'type'=>'M',
						'folderID'=>'x',
						'name'=>strval($name),
						'rights'=>'',
						'rightsUpdated'=>'',
						'gw'=>'',
						'sync'=>'',
						'path'=>'x',
						'validity'=>'',
						'messages'=>'',
						'unseen'=>'',
						'sync_update'=>'',
						'last_sync_update'=>'',
						'itemClassName'=>'',
						'fullSync'=>'',
						'folder'=>'x',
						'id'=>'x',
						'wmtype'=>'M',
						'disabled'=>true,
						'step'=>true
						 						 						 						 				);

				$data=array_reverse($data,true);
				$data['_VALUES_']=$values;
				$data=array_reverse($data,true);
			}
			foreach ($data as $key=>$val)
			{
				if ($key!='_VALUES_')
				{
					 					
					$ret=$this->cleanTree($val,$type,$key);
					$donotdelete=$ret['donotdelete'];
					$ret=$ret['ret'];
					
					if (empty($ret))
					{
						if(!$donotdelete)
						{
							unset($data[$key]);
						}
					}
					else
					{
						$donotdelete=true;
						$data[$key]=$ret;
					}
				}
				else
				{
					if ($val['type']!=$type)
					{
						$donotdelete=true;
						$data[$key]['disabled']=true;
					}
				}
			}
			if (count($data)==1 && $data['_VALUES_']['type']!=$type)
			{
				if(!$donotdelete)
				{
					unset($data);
				}
			}
		}
		return array('ret'=>$data,'donotdelete'=>$donotdelete);
	}

	private function getTreeFormated($tree,$active)
	{
		 		
		$data = slRequest::instance();
		$type = $data->get('all._s.type');

		$final=array();
		foreach ($tree as $val)
		{
			if (slHelperFolder::isDisplayFolder($val))
			{
				$parts=explode("/",$val['id']);

				 
				foreach($parts as $key=>$val2)
				{
					$parts[$key]=str_replace('\'',"\'",$val2);
				}

				 				$val['name']=str_replace('  ','&nbsp; ',$val['name']);

				if (!empty($parts))
				{
					$variable="final['".join("']['",$parts)."']['_VALUES_']";
					eval('$'.$variable.'=$val;');
				}
			}
		}

		 
		
		if (!$active)
		{
			$donotdelete=false;
			 			$clean=$this->cleanTree($final['#'],$type,$donotdelete);
			$clean=$clean['ret'];
			 			$final=array();
			$final['#']=$clean;
		}
		
		 		
		$formated_tree=$this->getTreeNode($final['#'],array(),false,' class="fTree"',$active);

		 
		return $formated_tree;
	}


	public function getBody(&$oXML)
	{
		 
		$ui = slGUI::instance();
		$tree='';

		$type=strval($oXML->config->type);
		$this->setTemplateData('treeType',array($type=>true));

		$data = slRequest::instance();
		 
		if ($type=='full')
		{
			$helperConstructor['helper'] = $this->getProperty('helper');
			$helper = slHelperFactory::instance($helperConstructor);
			$this->getLinkedFolders($helper);
			 
			$list=$this->getTemplateData('items');
			 			$active=$data->get('all.folder.active');
			
			 			
			$tree=$this->getTreeFormated($list,$active);
		}
		 

		$this->setTemplateData('tree',$tree);
		$file = $ui->getFile('template','tree');
		$result = $ui->template($file,$this->getProperty('aTemplate'));
		return $result;
		 
	}

	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$this->setProperty('root',new slWidgetTreeItem($this,0));
		$xml = $aConstruct['xml'];
		$this->setProperty('xml',$xml);
		$this->setProperty('id',strval($xml['id']));
		$this->setProperty('label',slLanguage::getLabel(strval($xml['label'])));
		$this->setProperty('targetData',slLanguage::getLabel(strval($xml->config->targetData)));
		$ui = slGUI::instance();
		$iconFile = $ui->getFile(
			'css/images/tree/',	 			'folder',	 			true,	 			'.gif'	 		);
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
		$this->loadComponents();
	}

	public function getLinkedFolders($helper)
	{
		$types = array('M','C','E','N','T','J','F');
		foreach($types as $type){
			$this->getLinkedFoldersByType($helper,$type);
		}

	}

	public function getLinkedFoldersByType($helper,$type)
	{
		$personal = $helper->getPersonalFolders($type);
		if (is_array($personal))
		{
			foreach($personal as $folder => $label){
				$this->linked[]='#/'.$folder;
				 				$label=str_replace('  ','&nbsp; ',$label);
				$this->linked_names['#/'.$folder]=$label;
			}
		}

	}

	public function loadComponents()
	{
		try{
			$this->getProperty('oComponents');
		}catch(Exception $e){
			try{
				$ui = slGUI::instance();
				$helperName = $this->getProperty('helper');
				$dataID = $this->getProperty('dataID');
				$construct = array('helper'=>$helperName);
				$helper = slHelperFactory::instance( $construct );
				
				$data = slRequest::instance();
				$active=$data->get('all.folder.active');
				if ($active)
				{
					$active = substr($active,2);
					$list = $helper->getDetail($dataID,$active);
				}
				else
				{
					$list = $helper->getList($dataID,true);
				}
				
				$this->buildFromList($list);
				
				$this->setProperty('oComponents',true);
			}catch(Exception $e){
				 				$this->buildFromXML($this->getProperty('root'),$this->getProperty('xml'));
				$this->generate();
				$this->setProperty('oComponents',true);
				 			}
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

			$treeitem = $root->addNode(strval($component["id"]),strval($component["label"]),strval($component["link"]));
			 			if ($component->children()){
				foreach($component->children() as $com){
					$this->buildFromXML($treeitem,$com);
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

class slWidgetTreeItem{

	public function __construct(&$parent,$id,$label = false,$link = false)
	{
		$this->id = $id;
		if (!$label){
			$this->label = $id;
		} else {
			$this->label = $label;
		}
		if ($link){
			$this->link = $link;
		}
		$this->parent = $parent;
	}

	public function addNode($id,$label,$link)
	{
		return $this->nodes[$id] = new slWidgetTreeItem($this,$id,$label,$link);
	}

	public function removeNode($node)
	{
		unset($this->nodes[$node->id]);
	}

	public function generate(&$result)
	{
		$tree = &$this->getTree();
		$itm['id'] = $this->id;
		$itm['name'] = slLanguage::getLabel($this->label);
		$itm['ico'] = 'folder.gif';
		$result[] = $itm;
		if ($this->nodes){
			foreach($this->nodes as $node){
			 $node->generate($result);
			}
		}
		return true;
	}

	public function getTree()
	{
		$pointer = &$this->parent;
		while($pointer->parent){
			$pointer = &$pointer->parent;
		}
		return $pointer;
	}
}
?>
