<?php
 

class slWidgetQuota extends slWidget
{
	public function format_bytes($size)
	{
		$units = array(' B', ' KB', ' MB', ' GB', ' TB');
		for ($i = 0; $size >= 1024 && $i < 4; $i++) $size /= 1024;
		return round($size, 2).$units[$i];
	}
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$helperConfig['helper'] = 'settings';
		$helper = slHelperFactory::instance($helperConfig);
		$data = $helper->get();
		if(isset($data['settings']['quota']))
		{
			$quota = $data['settings']['quota'];
			$quota['mbox_quota']=(float)$quota['mbox_quota'];
			$quota['mbox_usage']=(float)$quota['mbox_usage'];
			
			$this->setTemplateData('usage',$quota['mbox_quota']);
			$this->setTemplateData('limit',$quota['mbox_usage']);
			
			$info['percentage']=round($quota['mbox_usage']/$quota['mbox_quota']*100);
			$info['limit']=self::format_bytes($quota['mbox_quota']*1024);
			$info['usage']=self::format_bytes($quota['mbox_usage']*1024);
			
			$this->setTemplateData('quota',$info);
		}
	}
}

?>