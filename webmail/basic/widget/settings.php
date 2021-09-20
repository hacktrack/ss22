<?php
class slWidgetSettings extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		 		 		 		 		 		$request = slRequest::instance();
		$level = strtolower($request->get('all.level'));
		if(!$level){
			$level = 'user';
		}
		 
		 		 
		$this->setProperty('level',$level);
		if($level == 'domain' || $level == 'admin'){
			if($domain = $request->get('all.domain')){
				if($domain == '__new'){
					$domain = false;
				}
				$this->setProperty('domain',$domain);
			}
		}
		$view = $request->get('all.view');
		if(!$view){
			$view = 'settings';
		}
		$this->setProperty('view',$view);
		if($view == 'section' || $view == 'dialog'){
			$section = $request->get('all.section');
			$this->setProperty('section',$section);
		}
		if($view == 'dialog'){
			$dialog = $request->get('all.dialog');
			$this->setProperty('dialog',$dialog);
			$this->setProperty('dlg_type',$request->get('all.dlg_type'));
			$this->setProperty('sTemplateFile',slGUI::instance()->getFile('template',$dialog));
		}
		if($view == 'settings'){
			$this->setProperty('sTemplateFile',slGUI::instance()->getFile('template','settings.list'));
		}
	}

	static public function checkViewAccess($userrights,$access,$level)
	{
		if($access){
			$access = explode('|',$access);
		}
		switch($userrights){
			 			case 0:
				if($level=='user'){
					if(!$access){
						return true;
					}else{
						if(in_array($level,$access)){
							return true;
						}
					}
				}
			break;
			 			case 1:
				if(!$access){
					return true;
				}else{
					if(in_array($level,$access)){
						return true;
					}
				}
			break;
			 			case 2:
				if($level=='domain' || $level=='user'){
					if(!$access){
						return true;
					}else{
						if(in_array($level,$access)){
							return true;
						}
					}
				}
			break;
			
		}
		return false;
	}

	public function getBody(&$oXML)
	{
		$ui = slGUI::instance();
		try{
			$templateOverride = $this->getProperty('templateOverride');
			$ui->setTemplateOverride($templateOverride);
		}catch(Exception $e){

		}
		$sBody = '';
		$aAnchor = array();
		try{
			$level = $this->getProperty('level');
		}catch(Exception $e){
			$level = 'user';
		}
		$cid = $this->getProperty('id');
		$view = $this->getProperty('view');
		switch($view){
			case 'settings':
				$settingsHelper['helper'] = 'settings';
				$settingsHelper['widget'] = $this;
				$settings = slHelperFactory::instance($settingsHelper);
				$sections = $settings->getSections($oXML);
				
				return slGUI::template($this->getTemplateFile(),$sections);
			break;
			case 'dialog':
			case 'section':
				try{
					$currentSection = $this->getProperty('section');
				}catch(Exception $e){
					throw new Exception('settings_section_missing');
				}

				if($oXML->section) foreach($oXML->section as $settingsSection){
					if(strval($settingsSection['id'])==$currentSection){
						
						 						$aConstruct['objID'] = 'section';
						$aConstruct['xml'] = $settingsSection;
						$aConstruct['parent'] = &$this;
						 						try{
							$oObjClass = slGUI::instance()->instanceWidget($aConstruct);
							$oObjClass->create($aConstruct);
							$sBody = $oObjClass->getBody( $settingsSection );

						 						 						 						}catch(Exc $e){
							return $e->XHTMLMessage();
						}
					}
				}
				if($view=='dialog'){
					try{
						$grids = $this->getProperty('grids');
						foreach($grids as $grid){
							if($grid->GetProperty('storage')==slRequest::instance()->get('all.storage')){
								$datagrid = $grid;
							}
						}
						$indexes = slRequest::instance()->Get('all.index');
						$indexes = explode('|',$indexes);
						$aTemplate = $datagrid->GetProperty('aTemplate');
						foreach($indexes as $index){
							$aTemplate['property']['rows'][$index]['selected'] = 1;
							if($aTemplate['property']['rows'][$index]['columns'])
								foreach($aTemplate['property']['rows'][$index]['columns'] as $n => $col){
								$aTemplate['property']['rows'][$index]['columns'][$n]['selected'] = 1;
							}
						}
						$this->setProperty('aTemplate',$aTemplate);
					}catch(Exception $e){
						
					}
					
					$sBody = $ui->template($this->getTemplateFile(),$this->getProperty('aTemplate'));
				}
			break;
		}
		$this->open($cid);
		if($templateOverride){
			$ui->clearTemplateOverride($templateOverride);
		}
		return $sBody;
	}
}


class slWidgetSection extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$settings = slSingleton::instance('slWidgetSettings');
		if($storage = strval($aConstruct['xml']['storage'])){
			$this->setProperty('storage',$storage);
		}else{
			
			try{
				$storage = $settings->GetProperty('storage');
				$this->setProperty('storage',$storage);
			}catch(Exception $e){

			}
		}
		$this->setProperty('account',$_SESSION['ACCOUNT']);
		if($settings->checkViewAccess($_SESSION['ACCOUNT'],$aConstruct['xml']['view'],'domain')){
			$access['domain'] = true;
		}
		if($settings->checkViewAccess($_SESSION['ACCOUNT'],$aConstruct['xml']['view'],'admin')){
			$access['admin'] = true;
		}
		$this->setProperty('access',$access);
		$available_domains = Storage::getAvailableDomains();
		if($available_domains){
			foreach($available_domains as $k => $domain){
				if($domain['domain']==slRequest::instance()->get('all.domain')){
					$available_domains[$k]['domain_selected'] = true;
				}
			}
		}
		if(slRequest::instance()->get('all.domain')=='__new'){
			$this->setProperty('new_domain',true);
		}
		if($this->getProperty('account')==2){
			$available_domains = array();
			$domain = array();
			$domain['domain'] = $_SESSION['DOMAIN'];
			if($domain['domain']==slRequest::instance()->get('all.domain')){
				$domain['domain_selected'] = true;
			}
			$available_domains[] = $domain;
		}
		$this->setProperty('available_domains',$available_domains);
		
	}

}

class slWidgetGroup extends slWidget
{
	public function create($aConstruct)
	{
		$settings = WebmailSettings::instance();
		$aRestrictions = $settings->getPrivate('restrictions');
		$aRestrictions =$aRestrictions['@childnodes']['item'][0]['@childnodes'];
		if(is_array($aRestrictions) && !empty($aRestrictions)){
				foreach($aRestrictions as $restriction => $value){
				$restrictions[$restriction] = $value[0]['@value'];
			}
		}
		
		
		parent::create($aConstruct);
		if($storage = strval($aConstruct['xml']['storage'])){
			$this->setProperty('storage',$storage);
		}else{
			$section = slSingleton::instance('slWidgetSection');
			try{
				$storage = $section->GetProperty('storage');
				$this->setProperty('storage',$storage);
			}catch(Exception $e){

			}
		}
		
		 		
		if(isset($restrictions[strval($aConstruct['xml']['restriction'])]) && $restrictions[strval($aConstruct['xml']['restriction'])])
		{
			$this->setProperty('restricted',true);
		}
		else
		{
			$this->setProperty('restricted',false);
		}
		$this->setProperty('label',slLanguage::instance()->getLabel(strval($aConstruct['xml']['label'])));
		
		
		 		$this->setProperty('description',slLanguage::instance()->getLabel(strval($aConstruct['xml']['description'])));
	}
	
	public function getBody(&$oXML)
	{
		$settings = slSingleton::instance('slWidgetSettings');
		
		if(!$settings->checkViewAccess($_SESSION['ACCOUNT'],$oXML['view'],$settings->GetProperty('level'))){
			return '';
		}
		$ui = slGUI::instance();
		try{
			$templateOverride = $this->getProperty('templateOverride');
			$ui->setTemplateOverride($templateOverride);
		}catch(Exception $e){
		}
		$sBody = '';
		$aAnchor = array();
		
		$cid = $this->getProperty('id');
		$is_inline = false;
		$inlineItems = array();
		if($oXML->option) foreach($oXML->option as $xml_option){
			 			$aConstruct['objID'] = 'option';
			$aConstruct['xml'] = $xml_option;
			$aConstruct['parent'] = &$this;
			 			try{
				$oObjClass = slGUI::instance()->instanceWidget($aConstruct);
				$oObjClass->create($aConstruct);
				$widget = $oObjClass->GetProperty('widget');
				$wid = $widget->GetProperty('id');
				$oid = $oObjClass->getProperty('id');
				$force = array();
				try{
					$oObjClass->getProperty('inline');
					if(!$is_inline){
						$i = 0;
						$oObjClass->setProperty('start_inline',true);
					}
					$oObjClass->setProperty('hide_force',true);
					$is_inline = true;
					$inlineItem = array();
					$inlineItem['class'] = &$oObjClass;
					$inlineItem['xml'] = &$xml_option;
					$inlineItem['id'] = $oid;
					$inlineItem['widget_id'] = $wid;
					$inlineItems[$i++] = $inlineItem;
					
				}catch(Exception $e){
					$this->processInlineItems($sBody,$inlineItems,$is_inline);
					$oObjClass->open($oid);
					$widget->open($wid);
					
					try{
						$widget->setProperty(
							'force_name',
							$oObjClass->getProperty('storage').'#'.
							$oObjClass->getProperty('variable')
						);
						$oObjClass->setProperty('widget',$widget);
					}catch(Exception $e){
						
					}
					
					$sBody .= '<tr>'.$oObjClass->getBody( $xml_option ).'</tr>';
				}

			 			 			 			}catch(Exc $e){
				return $e->XHTMLMessage();
			}
		}
		$this->processInlineItems($sBody,$inlineItems,$is_inline);
		$this->open($cid);
		$this->setTemplateData('body',$sBody);
		$this->setTemplateData('anchor',$aAnchor);
		$this->setTemplateData('property',(array) $this->pData);
		$sBody = slGUI::template($this->getTemplateFile() ,$this->getProperty('aTemplate'));
		if($templateOverride){
			$ui->clearTemplateOverride($templateOverride);
		}
		return $sBody;
	}
	
	public function processInlineItems(&$sBody,&$inlineItems,&$is_inline)
	{
		if($is_inline){
			$is_inline = false;
			$sBody .= '<tr><td colspan="2">';
			$j = 0;
			foreach($inlineItems as $iItem){
				try{
					
					$iItem['class']->open($iItem['id']);
					$w = $iItem['class']->GetProperty('widget');
					$w->open($iItem['widget_id']);
					try{
						$storage = $iItem['class']->getProperty('storage');
						$variable = $iItem['class']->getProperty('variable');
						$force[] = $storage.'#'.$variable;
					}catch(Exception $e){
						$sBody.='Kokot';
					}
					$iItem['class']->setProperty('hide_force',true);
					$w->SetProperty('hide_force',true);
					if($j++==count($inlineItems)-1){
						
						$iItem['class']->setProperty('hide_force',false);
						$w->SetProperty('hide_force',0);
						$w->setProperty(
							'force_name',
							join('|',$force)
						);
						$iItem['class']->setProperty('widget',$w);
					}
					$sBody.= $iItem['class']->getBody($iItem['xml']);
				}catch(Exception $e){
					
					$sBody.='Inline Items Error';
				}
			}
			$sBody.='</td></tr>';
			$inlineItems = array();
		}
	}

}

class slWidgetOption extends slWidget
{
	public function create($aConstruct)
	{
		$id = strval($aConstruct['xml']['id']);
		 		parent::create($aConstruct);
		$xml = &$aConstruct['xml'];
		$settingsHelper['helper'] = 'settings';
		$settingsHelper['widget'] = $this;
		$settings = slHelperFactory::instance($settingsHelper);
		if($storage = strval($xml['storage'])){
			$this->setProperty('storage',$storage);
		}else{
			$group = slSingleton::instance('slWidgetGroup');
			try{
				$storage = $group->GetProperty('storage');
				$this->setProperty('storage',$storage);
			}catch(Exception $e){

			}
		}
		$is_inline = false;
		if($inline = strtolower(strval($xml['inline']))){
			if($inline == 'true' || $inline == 1){
				$is_inline = true;
			}
		}
		if($view = strval($xml['view'])){
			$view = explode('|',$view);
		}
		$settingsWidget = slSingleton::instance('slWidgetSettings');
		$level = $settingsWidget->GetProperty('level');
		switch($level){
			case 'admin':
				$data = $settings->getPublic($storage);
			break;
			case 'domain':
				try{
					$domain = $settingsWidget->getProperty('domain');
				}catch(Exception $e){
					$domain = $_SESSION['DOMAIN'];
				}
				$data = $settings->getPublic($storage,$domain);
			break;
			case 'user':
				$data = $settings->getPrivate($storage);
			break;
		}
		
		if($variable = strval($xml['variable'])){
			$this->setProperty('variable',$variable);
			 			if($variable=='#array'){
				if($data['@childnodes']['item']) foreach($data['@childnodes']['item'] as $item){
					foreach($item['@childnodes'] as $var => $val){
						$row[$var] = $val[0]['@value'];
					}
					$rows[] = $row;
				}
				$data = $rows;
			}else{
				$value = $data['@childnodes']['item'][0]['@childnodes'][$variable][0]['@value'];
				$isset = isset($data['@childnodes']['item'][0]['@childnodes'][$variable][0]['@value']);
				$attributes = $data['@childnodes']['item'][0]['@childnodes'][$variable][0]['@attributes'];
			}
			switch($level){
				case 'admin':
					$data = $settings->getPublic($storage);
					if($attributes['access']){
						$domain_access = $attributes['access'];
					}
					if($attributes['useraccess']){
						$user_access = $attributes['useraccess'];
					}
					$access = 'full';
					$show_force_domain = true;
					$show_force_user = true;
					$force_domain = $domain_access=='view'?true:false;
					$force_user = $user_access=='view'?true:false;
				break;
				case 'domain':
					try{
						$domain = $settingsWidget->getProperty('domain');
					}catch(Exception $e){
						$domain = $_SESSION['DOMAIN'];
					}
					$data = $settings->getPublic($storage,$domain);
					if($attributes['access']){
						$domain_access = $attributes['access'];
					}
					if($attributes['useraccess']){
						$user_access = $attributes['useraccess'];
					}
					$access = $domain_access;
					$show_force_domain = false;
					$show_force_user = true;
					$force_user = $user_access=='view'?true:false;
					$force_user_disabled = $domain_access=='view'?true:false;
				break;
				case 'user':
					if($attributes['access']){
						$user_access = $attributes['access'];
					}
					if($attributes['useraccess'] && !$user_access){
						$user_access = $attributes['useraccess'];
					}
					$access = $user_access;
				break;
			}
		}
		
		$sectionWidget = slSingleton::instance('slWidgetSection');
		$sectionWidget->setProperty('domain',$domain);
		$sectionWidget->setProperty('level',$level);

		if(!$type = strval($xml['type'])){
			throw new Exc('UI:missing_settings_option_type');
		}
		$widget = slWidget::createWidget($type,$id?$id:false);
		foreach($xml->attributes() as $attr => $val){
			if($attr=='alabel'){
				$widget->SetProperty($attr,slLanguage::getLabel(strval($val)));
			}else{
				$widget->SetProperty($attr,strval($val));
			}
		}
		if($xml->config){
			if($widget->setProperty('config',$xml->config));
		}
		$widget->setLabel($xml['label'],true);
		$widget->setData($data);
		if($function = strval($xml['function'])){
			$value = $settings->storage_function(true,$value,$function,$variable);
		}
		$widget->setValue($value);
		if($widget->objID=='grid' && $this->getProperty('variable')!='#array'){
			$widget->setData($value);
		}
		if(!$isset && isset($xml['default'])){
			$widget->setValue(strval($xml['default']));
		}
		if($is_inline){
			$widget->setProperty('inline',true);
			$this->setProperty('inline',true);
		}
		$widget->setProperty('name','settings['.$storage.'][item]['.$variable.'][value]');
		$widget->setProperty('old_name','settings['.$storage.'][item]['.$variable.'][oldvalue]');
		if($function){
			$widget->setProperty('function_name','settings['.$storage.'][item]['.$variable.'][function]');
			$widget->setProperty('function_value',$function);
		}
		if($access == 'view'){
			$event['name'] = 'disabled';
			$event['value'] = 'disabled';
			$events[] = $event;
			$widget->SetProperty('events',$events);
		}
		$widget->setProperty('show_force_domain',$show_force_domain);
		$widget->setProperty('show_force_user',$show_force_user);
		$widget->setProperty('force_domain',$force_domain);
		$widget->setProperty('force_user',$force_user);
		$widget->setProperty('force_user_disabled',$force_user_disabled);
		$widget->setProperty('form_option',true);
		$this->setProperty('widget',$widget);
		if($view && !in_array($level,$view)){
			$this->setProperty('skip',true);
		}
	}

	public function getBody(&$oXML)
	{
		$ui = slGUI::instance();
		try{
			$templateOverride = $this->getProperty('templateOverride');
			$ui->setTemplateOverride($templateOverride);
		}catch(Exception $e){

		}
		try{
			$skip = $this->getProperty('skip');
			if($skip){
				return '';
			}
		}catch(Exception $e){
			
		}
		
		$sBody = '';
		$aAnchor = array();
		
		$cid = $this->getProperty('id');
		$widget = $this->getProperty('widget');
		$widget->SetProperty('hide_force',false);
		try{
			$hide_force = $this->getProperty('hide_force');
			if($hide_force){
				$widget->SetProperty('hide_force',true);
			}
		}catch(Exception $e){
			
		}
		if($widget->objID=='grid'){
			$settings = slSingleton::instance('slWidgetSettings');
			try{
				$grids = $settings->GetProperty('grids');
			}catch(Exception $e){
				
			}
			$grids[] = $widget;
			$settings->setProperty('grids',$grids);
		}
		$body = $widget->getBody($oXML);
		$this->setTemplateData('body',$body);
		$this->open($cid);
		return slGUI::template($this->getTemplateFile() ,$this->getProperty('aTemplate'));
	}
}
?>