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
	
	private function getTreeNode($node,$prev=array(),$last=false,$class="",$active)
	{	
		$ui = slGUI::instance();
		$ret='<ul'.$class.'>';
		if (is_array($node))
		{				
			$val='';
			if (isset($node['_VALUES_']))
			{	
				$node['_VALUES_']['ueid']=rawurlencode($node['_VALUES_']['id']);
				if (isset($node['_VALUES_']['id']) && $node['_VALUES_']['name']!='')
				{							
					$file = $ui->getFile('template','treeItem');
					$node['_VALUES_']['icoClass']=$this->getIcoClass($node['_VALUES_']['ico']);
					$node['_VALUES_']['linkedClass']='';
					$node['_VALUES_']['linked']=false;
					if (is_array($this->linked))
					{
						if (in_array($node['_VALUES_']['id'],$this->linked)) 
						{
							$node['_VALUES_']['linkedClass']=' linked';
							$node['_VALUES_']['linked']=true;
						}
					}
					
					if ($node['_VALUES_']['id']==rawurlencode($active))
					{
						$node['_VALUES_']['active']=true;
					}
					else
					{
						$node['_VALUES_']['active']=false;
					}
					
					 					 						$item=template($file,array('item'=>$node['_VALUES_']));
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
			
			
			 			foreach ($node as $key=>$val)
			{
				if ($val['_VALUES_']['type']!='M')
				{
					unset($node[$key]);
				}
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
	
	private function getTreeFormated($tree,$active)
	{
		foreach ($tree as $val)
		{
			$parts=explode("/",$val['id']);
			$variable="final['".join("']['",$parts)."']['_VALUES_']";
			eval('$'.$variable.'=$val;');
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
			$personal = $helper->getPersonalFolders('M');
			
			if (is_array($personal))
			{
				foreach($personal as $folder => $label){
					$linked[]='#/'.$folder;
				}
			}
			$this->linked=$linked;
			 
			
			$list=$this->getTemplateData('items');
			 			$active=$data->get('all.folder.active');
			$tree=$this->getTreeFormated($list,$active);
		}
		 
		
		 
		if ($type=='simple')
		{
	echo "Simple";
		 
		$at=str_replace(".",'_',$data->get('all._s.id'));
		$np=str_replace(".",'_',$data->get('all._n.p.content'));
		
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
			else
			{
				$active['lmtnewmail']=true;
			}
		}
		$this->setTemplateData('activeLeftMenuTab',$active);
		$helperConstructor['helper'] = $this->getProperty('helper');
		$helper = slHelperFactory::instance($helperConstructor);
		$personal = $helper->getPersonalFolders('M');
		
		if (is_array($personal))
		{
			foreach($personal as $folder => $label){
				$leftMenu[]= array(
					'id'=>$folder,
					'label'=>$label,
					'active'=>($at==$folder)?true:false
				);
			}
		}
			
		$this->setTemplateData('leftMenu',$leftMenu);
		
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
				$list = $helper->getList($dataID,true);
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