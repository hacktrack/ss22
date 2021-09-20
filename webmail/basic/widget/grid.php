<?php
class slWidgetGrid extends slWidgetInput
{	
	public function create($aConstruct)
	{
		
		parent::create($aConstruct);
		$xml = $aConstruct['xml'];
		$language = slLanguage::instance();
		 		$oUI = slGUI::instance();
		$oUI->setStylesheet('grid');
		 		if( isset($_SESSION) && is_int( $_SESSION['GRID_LIMIT'] ) ){
			
			$this->setProperty( 'limit', $_SESSION['GRID_LIMIT'] );
		}else if($xml->config->limit){
			$this->setProperty( 'limit', strval($xml->config->limit) );
		}else{
			$this->setProperty( 'limit', 20 );
		}
		 		if($xml->config->controller){
			$this->setProperty( 'controller', strval($xml->config->controller) );
		}else{
			$this->setProperty( 'controller', 'grid' );
		}
		if($xml->config->view){
			$this->setProperty( 'view', strval($xml->config->view) );
		}
		if($xml->config->select->type){
			$select['type'] = strtolower(strval($xml->config->select->type));
			if($select['type']!='none' && $xml->config->select->variable){
				$select['variable'] = strval($xml->config->select->variable);
			}
		}else{
			$select['type'] = 'none';
		}
		
		$this->setProperty('select',$select);
		$this->setTemplateData('type', $select['type']);
		$this->setTemplateData( 'variable' , $select['variable']);
		
		
		$sets = WebmailSettings::instance($session);
		$restrictionsData = $sets->getPublic('restrictions');
		$sortstring=0;
		if (isset($restrictionsData['@childnodes']['item'][0]['@childnodes']['sortstring'][0]['@value']) && $restrictionsData['@childnodes']['item'][0]['@childnodes']['sortstring'][0]['@value']==1)
		{
			$sortstring=1;
		}
		$this->setTemplateData('restrictions',array('sortstring'=>$sortstring));
		
		 		if (isset($xml->config->fields->field))
		{
			$request = slRequest::instance();
			$sort = $request->get('all._s.sort');
			if(!$sort){
				$default = strval($xml->config->default->orderby);
				if(stripos($default,'DESC')!==false){
					$order = 'DESC';
					$sorder = 'ASC';
					$orderby = trim(str_ireplace('DESC','',$default));
				}else{
					$order = 'ASC';
					$sorder = 'DESC';
					$orderby = trim(str_ireplace('ASC','',$default));
				}
			}
			if($sort){
				$sort = explode(',',$sort);
				foreach($sort as $k => $srt){
					if(stripos($srt,'ASC')!==false){
						$order = 'ASC';
						$sorder = 'DESC';
						$sort[$k] = trim(str_ireplace('ASC','',$srt));
					}
					if(stripos($srt,'DESC')!==false){
						$order = 'DESC';
						$sorder = 'ASC';
						$sort[$k] = trim(str_ireplace('DESC','',$srt));
					}
				}
				$orderby = implode(',',$sort);
			}
			foreach($xml->config->fields->field as $field){
				$fld['column'] = strval($field);
				$fld['label'] = $language->getLabel($field['label']);
				$fld['sort'] = str_replace(' ','',strval($field['sort']));
				if(!$fld['sort']){
					if($fld['column']=='itmSortString')
					{
						$fld['sort'] = $fld['column'].','.'itmClassifyAs';
					}
					else
					{
						$fld['sort'] = $fld['column'];
					}
				}

				$fld['selected'] = substr_count($orderby,$fld['sort'])>0?true:false;
				$sort = explode(',',$fld['sort']);
				$aOrderBy = array();
				foreach($sort as $key=>$val){
					$aOrderBy[] = $val.' '.($fld['selected']?$sorder:$order);
				}
				$fld['orderby'] = implode(',',$aOrderBy);
				$cols[] = $fld['column'];
				
				 				if(strtolower($fld['sort'])=='false'){
					continue;
				}
				$fields[] = $fld;
			
				$type=explode(" ",$fld['orderby']);
				$fld['type']=$type[count($type)-1];
				 
				
				$forbasic[$fld['column']]=$fld;
				
				 
				
				if ($fld['selected'])
				{
					$actual=$fld;
				}
				
			}
		}

		$this->setProperty( 'fields', $fields );
		if (is_array($cols))
		{
			$this->setProperty( 'fieldsFlat', implode( ',', $cols ) );
		}
		 		$aButtons = $xml->config->buttons->button;
		if($aButtons){
			foreach($aButtons as $button){
				$aLabel = explode('|',strval($button["label"]));
				$aConfirm = explode('|',strval($button["confirm"]));
				if($button['restriction']){
					if(!$this->checkButtonRestriction($button)){
						continue;
					}
				}
				$buttons['num'][] = array
				(
					'name'=>strval($button["name"]),
					'css'=>strval($button["css"]),
					'label'=>strval($language->get($aLabel[0],$aLabel[1])),
					'confirm'=>$aConfirm?$language->get($aConfirm[0],$aConfirm[1]):false
				);
			}
		}
		
		 
		
		$this->setTemplateData( 'dSort', $forbasic );
		$this->setTemplateData( 'aSort', $actual );
		$this->setTemplateData('buttons',$buttons);
		 		if($helperName = strval($aConstruct['xml']['helper'])){
			 			$helperParam['widget'] = $this;
			$helperParam['helper'] = $helperName;
			$helper = slHelperFactory::instance( $helperParam );
			 			$sDataID = strval( $xml->config->data );
			$this->setProperty('data',$sDataID);
			 			if (is_array($cols))
			{
				foreach($cols as $key=>$column){
					switch (strtolower($column)) {
						case 'from':
							$cols[$key] = 'header_from';
							break;
						case 'tags':
							$cols[$key] = 'taglist';
							break;
						case 'to':
							$cols[$key] = 'header_to';
							break;
						case 'sms':
							$cols[$key] = 'header_sms';
							break;
						default:
							 							break;
					}
				}
				$config['columns'] = implode( ',', $cols );
			}
			if($xml->config->default->orderby){
				$config['orderby'] = strval($xml->config->default->orderby);
			}
			$config['data'] = $sDataID;
			 			$config['target'] = $this->getProperty('target');
			$config['limit'] = $this->getProperty('limit');
			$config['controller'] = $this->getProperty('controller');
			$config['link'] = isset($xml->config->link)?strval($xml->config->link):'item';
			$data = $helper->gridWidget( $config );
			$data['info']['sort'] = $orderby;
			$this->setTemplateData( 'info', $data['info'] );
			$this->setTemplateData( 'items' , $data['data'] );
			$this->setTemplateData( 'container' , $data['container'] );
		 		}else{
			 		}
		
		 
	}
	
	public function checkButtonRestriction($button)
	{
		$gui = slGUI::instance();
		$condition = $gui->template($button['restriction']);
		return eval($condition);
	}
	
	public function getBody(&$oXML)
	{
		 		
		try{
			$this->getProperty('form_option');
			try{
				$data = $this->getProperty('data');
			}catch(Exception $e){
				
			}
			$labels = $this->getProperty('labels');
			$labels = slLanguage::instance()->getLabel($labels);
			$labels = explode('|',$labels);
			foreach($labels as $col){
				$column['label'] = $col;
				$columns[] = $column;
			}
			
			$this->setProperty('columns',$columns);
			
			try{
				$variables = $this->getProperty('variables');
				$variables = explode('|',$variables);
			}catch(Exception $e){
				$variables = false;
			}
			$rowCount = 0;
			if($data) foreach($data as $item){
				if($variables){
					$i = 0;
					foreach($variables as $index => $variable){
						$row[$index]['value'] = $item[$variable];
						$row[$index]['row'] = $rowCount;
						$row[$index]['column'] = $i++;
					}
				}else{
					$i = 0;
					foreach($item as $index => $variable){
						$row[$i]['value'] = $variable;
						$row[$i]['row'] = $i;
						$row[$i]['column'] = $i++;
					}
				}
				$rows[$rowCount]['columns'] = $row;
				$rows[$rowCount]['row'] = $rowCount;
				$rowCount++;
			}
			$this->setProperty('rows',$rows);
			try{
				$config = $this->getProperty('config');
				$aButtons = $config->buttons->button;
				if($aButtons){
					foreach($aButtons as $button){
						$aLabel = explode('|',strval($button["label"]));
						$aConfirm = explode('|',strval($button["confirm"]));
						if($button['restriction']){
							if(!$this->checkButtonRestriction($button)){
								continue;
							}
						}
						$buttons['num'][] = array
						(
							'name'=>strval($button["name"]),
							'css'=>strval($button["css"]),
							'label'=>strval(slLanguage::instance()->get($aLabel[0],$aLabel[1])),
							'confirm'=>$aConfirm?slLanguage::instance()->get($aConfirm[0],$aConfirm[1]):false
						);
					}
				}
				$this->setTemplateData('buttons',$buttons);
			}catch(Exception $e){
				
			}
		}catch(Exception $e){
				
		}
		return parent::getBody($oXML);
	}
}

?>
