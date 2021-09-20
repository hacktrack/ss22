<?php
class slWidgetFolders extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		if($helperID = strval($aConstruct['xml']['helper']))
		{
			$xml = $aConstruct['xml'];
			$construct = array( 'helper' => $helperID );
			$helper = slHelperFactory::instance( $construct, $this );
			$aFolders = $helper->getSimpleList();
			$this->setTemplateData('folders', $aFolders );
			$this->setTemplateData('sid',session_id());
		}
	}
}
?>
