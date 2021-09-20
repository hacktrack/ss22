<?php
class slWidgetMenu extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		
		if (isset($_GET['test'])) {$test=$_GET['test'];} else {$test='';}
		if ($test!="") {$mai[$test]=' style="display:block"';}
		$this->setTemplateData('menuActiveItem',$mai);
		$router = slRouter::instance();
		$link = $router->getLink('main','main','win.login','','auth','logout',true);
		$this->setTemplateData('link', array( 'logout' => $link ) );	
	}
}
?>