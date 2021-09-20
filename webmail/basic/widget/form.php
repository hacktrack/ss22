<?php
class slWidgetForm extends slWidgetFormAbstract
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		 		$gui =slGUI::instance();
		$this->setTemplateData( 'logo', $gui->getFile('css/images/', 'logo', true, '.gif') );
		try{
			$helperName = $this->getProperty('helper');
			$param = array('helper'=>$helperName,'widget'=>&$this);
			$helper = slHelperFactory::instance($param);
			$config['controller'] = strval($aConstruct['xml']->config->controller);
			$config['detail'] = strval($aConstruct['xml']->config->detail);
			$config['detail'] = (!isset($config['detail']) || strtolower($config['detail'])=='false')?false:true;
			$data = $helper->formWidget( $config );
			$this->setTemplateData($helperName,$data);
			if($data['item']){
				$this->setTemplateData('item',$data['item']);
			}
			$this->setTemplateData('info',$data['info']);
			$link = $data['info']['link'];
			$this->setTemplateData('container',$data['info']);
			
		}catch(Exception $e){
			$link = slRequest::instance()->getPath().'?'.slRequest::instance()->getQueryString();
			$link = str_replace('&amp;','&',$link);
		}
		$info = $this->getTemplateData('info');
		$info['link'] = $link;
			
		$this->setTemplateData('info',$info);
		 		try{
			$settings = WebmailSettings::instance();
			$welcome = $settings->welcome;
			$this->setTemplateData('login_title',$welcome);
		}catch(Exception $e){
		}
		if($aConstruct['xml']['enctype']){
			$this->setProperty('enctype',strval($aConstruct['xml']['enctype']));
		}
		if($aConstruct['xml']->config->parameters){
			$parameters =$aConstruct['xml']->config->parameters;
			
			$parameters = $gui->template(
				$parameters,
				array('_dlg'=>slControllerDialog::getCurrentDialogName())
			);
			$this->setTemplateData('parameters',$parameters );
		}
		$this->addDialogParameters($parameters);
	}
	
	public function setParameters(&$parameters,$add_dialog_parameters = true)
	{
		 		$parameters = slGUI::instance()->template(
			$parameters,
			array(
				'_dlg'=>slControllerDialog::getCurrentDialogName(),
				'id'=>slRequest::instance()->get('all._s.id')
			)
		);
		slSystem::import('controller/grid');
		$request = slRequest::instance();
		if(($sort = $request->get('get._s.sort'))!=false){
			$parameters=slControllerGrid::replaceURLVariable($parameters,'_s[sort]',rawurlencode($sort));
		}
		if(($search = $request->get('get._s.search'))!=false){
			$parameters=slControllerGrid::replaceURLVariable($parameters,'_s[search]',rawurlencode($search));
		}
		$this->setTemplateData('parameters',$parameters );
		if($add_dialog_parameters){
			$this->addDialogParameters($parameters);
		}
	}
	
	public function setRSA()
	{
		$hash = file_get_contents(WM_CONFIGPATH.'public.key');
		$this->setProperty( 'rsa', $hash);
		$this->setTemplateData( 'rsa', $hash );
	}
	
	public function addDialogParameters($parameters)
	{
		$request = slRequest::instance();
		if($dialog = $request->get('all._dlg.dialog')){
			if(is_array($dialog)){
				foreach($dialog as $key => $val){
					$parameters.='&_dlg[dialog]['.$key.']='.$val;
				}
				$this->setTemplateData('parameters',$parameters);
			}
		}
	}

}


?>