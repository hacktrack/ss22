<?php
class slWidgetCompose extends slWidgetFormAbstract
{
	public function create($aConstruct)
	{
		$data = slRequest::instance();
		$to=$data->get('get.to');
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
		
		$sets = WebmailSettings::instance($session);
		$mail_settings_default = $sets->getPrivate('mail_settings_default');
		$restrictionsData = $sets->getPublic('restrictions');
		$externalData = $sets->getPrivate('external_settings');
		 		
		if (isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['font_family'][0]['@value']))
		{
			$font_family=$mail_settings_default['@childnodes']['item'][0]['@childnodes']['font_family'][0]['@value'];
		}
		else
		{
			$font_family="";
		}
		
		 		 		if (isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['font_size'][0]['@value']))
		{
			$font_size=$mail_settings_default['@childnodes']['item'][0]['@childnodes']['font_size'][0]['@value'];
		}
		else
		{
			$font_size="";
		}
		
		 		 		if (isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['text_direction'][0]['@value']))
		{
			$text_direction=$mail_settings_default['@childnodes']['item'][0]['@childnodes']['text_direction'][0]['@value'];
		}
		else
		{
			$text_direction="";
		}
		
		if (isset($mail_settings_default['@childnodes']['item'][0]['@childnodes']['from'][0]['@value']))
		{
			$alias=$mail_settings_default['@childnodes']['item'][0]['@childnodes']['from'][0]['@value'];
		}
		else
		{
			$alias="";
		}
		
		 		
		$fonts = $sets->getPrivate('fonts');
		
		 		
		if(isset($restrictionsData['@childnodes']['item'][0]['@childnodes']['disable_smart'][0]['@value']) && $restrictionsData['@childnodes']['item'][0]['@childnodes']['disable_smart'][0]['@value']==1)
		{
			$this->setTemplateData('disable_smart',true);
		}
		
		if(isset($restrictionsData['@childnodes']['item'][0]['@childnodes']['disable_dropbox'][0]['@value']) && $restrictionsData['@childnodes']['item'][0]['@childnodes']['disable_dropbox'][0]['@value']==1)
		{
			$this->setTemplateData('disable_dropbox',true);
		}
		else
		{
			if(isset($externalData['@childnodes']['item'][0]['@childnodes']['dropbox_app_key'][0]['@value']) && !empty($externalData['@childnodes']['item'][0]['@childnodes']['dropbox_app_key'][0]['@value']))
			{
				$this->setTemplateData('dropbox_app_key',$externalData['@childnodes']['item'][0]['@childnodes']['dropbox_app_key'][0]['@value']);
			}
			else
			{
				$this->setTemplateData('disable_dropbox',true);
			}
		}
		
		$this->setTemplateData('font_family',$font_family);
		$this->setTemplateData('font_size',$font_size);
		$this->setTemplateData('text_direction',$text_direction);
		$this->setTemplateData('alias',$alias);
		$this->setTemplateData('fonts',$fonts);
		
		 		
		$this->addVariable('_sent','1');
		$this->setProperty("jscheck",$_SESSION['jscheck']);
		$this->setTemplateData('to',$to);
		$this->setTemplateData('uid',$_SESSION["EMAIL"]);
		 
	}
	
}


?>