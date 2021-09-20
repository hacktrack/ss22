<?php

class slWidgetPanel extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$this->setTemplateData('id',$this->getProperty('id'));
		$this->setTemplateData('onclick',strval($aConstruct['xml']['onclick']));
	}
}

?>