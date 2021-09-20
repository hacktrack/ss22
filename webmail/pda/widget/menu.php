<?php

class slWidgetMenu extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$data = slRequest::instance();
		$at=str_replace(".",'_',$data->get('get._n.p.content'));
		if ($at!='')
		{
			$active[$at]=true;
			$theme=$at;
		}
		else
		{
			$theme='blue';
		}
		$this->setTemplateData('activeMenuTab',$active);
		$this->setTemplateData('theme',$theme);
		$router = slRouter::instance();
		$link = $router->getLink('main','main','win.login','','auth','logout',true);
		$this->setTemplateData('link', array( 'logout' => $link ) );
		
		
		if($helper = strval($aConstruct['xml']['helper'])){
			$constructor['helper'] = $helper;
			$constructor['widget'] = $this;
			$h = slHelperFactory::instance($constructor);
			$data = $h->menuWidget( $defaults );
			$this->setTemplateData('menu',$data);
			$this->setTemplateData('container',$data['info']);
		}
	}
}

?>