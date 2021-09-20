<?php
class slWidgetWysiwyg extends slWidget
{
	public function create($aConstruct)
	{
		 		$this->validateConfig($aConstruct);

		parent::create($aConstruct);

		$this->setTemplateData('name',$aConstruct['xml']->config->name);

		 		if (property_exists($aConstruct['xml']->config, 'dataindex')) {
			$data = $this->getDataFromParent($aConstruct['parent'], strval($aConstruct['xml']->config->dataindex));

			$this->setTemplateData('html', $data);
			$this->setTemplateData('text', slToolsString::removeHTML($data));
		}
		
		if (property_exists($aConstruct['xml']->config, 'tabindex')) {
			$this->setTemplateData('tabindex',$aConstruct['xml']->config->tabindex);
		}
		
		if (property_exists($aConstruct['xml']->config, 'id')) {
			$id = strval($aConstruct['xml']->config->id);
		} else {
			$id = uniqid();
		}

		$this->setTemplateData('format', $this->getFormat($aConstruct));
		$this->setTemplateData('id', $id);
		 
		 		$oSets = WebmailSettings::instance($session);
		$this->setTemplateData('fonts',$oSets->getPrivate('fonts'));

		 		$oGUI = slGUI::instance();
		$oGUI->setJavascript($this->objID);
		$oGUI->setStylesheet($this->objID);
	}

	 
	private function getDataFromParent(slWidget $oParent, $sDataIndex) {
		$aPathChunks = explode('::', $sDataIndex);
		$data        = $oParent->getTemplateData(current($aPathChunks));

		while ($next = next($aPathChunks)) {
			if (!array_key_exists($next, $data)) {
				return null;
			}

			$data = $data[$next];
		}

		return $data;
	}
	
	 
	private function getFormat($aConstruct) {
		$format = null;

		if (property_exists($aConstruct['xml']->config, 'formatindex')) {
			$format = $this->getDataFromParent($aConstruct['parent'], strval($aConstruct['xml']->config->formatindex));
		}

		 		if (!is_null($format)) {
			return $format;
		}

		 		if (property_exists($aConstruct['xml']->config, 'defaultformat')) {
			return strval($aConstruct['xml']->config->defaultformat);
		}

		 		return 'text/plain';
	}
	
	 
	private function validateConfig($aConstruct) {
		if (!property_exists($aConstruct['xml'], 'config')) {
			throw new Exception('Configuration is required for wysiwyg widget');
		}
		
		if (!property_exists($aConstruct['xml']->config, 'name')) {
			throw new Exception('Name of wysiwyg text field is required in widget configuration');
		}
	}
}