<?php
class slWidgetCompose extends slWidgetFormAbstract
{
	public function create($aConstruct)
	{
		$request = slRequest::instance();
		$to=$request->get('get.to');
		parent::create($aConstruct);
		try{
			$helperParam['helper'] = $this->getProperty('helper');
			$helperParam['widget'] = $this;
			$helper = slHelperFactory::instance($helperParam);
			$data = $helper->mailviewWidget( $param );
			$this->setTemplateData('item',$data['data']);
			$this->setTemplateData('info',$data['info']);
			$this->setTemplateData('container',$data['container']);
		}catch(Exception $e){
		}
		$this->addVariable('_sent','1');
		$this->setProperty("jscheck",$_SESSION['jscheck']);
		$this->setTemplateData('to',$to);
		$this->setTemplateData('jscheck',$to);
		$this->setTemplateData('action',$request->getURI(false));
	}
	
}


?>