<?php
slSystem::import('widget/form',APP_PATH);
class slWidgetCaptcha extends slWidgetForm
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$request = slRequest::instance();
		
		if (isset($_COOKIE['lastLogin']))
		{
			$parts=explode('|',$_COOKIE['lastLogin']);
			$language = slLanguage::instance(slToolsPHP::htmlspecialchars($parts[0]));
		}
		else
		{
			$language = slLanguage::instance();
		}
		
		$captcha['uid'] = session_id();
		if(!$captcha['uid']){
			$captcha['uid'] = uniqid().uniqid();
		}
		$captcha['data'] = $request->get('all._dlg.data');
		$captcha['info'] = $language->get('login','captcha_info');
		$captcha['url'] = MODEL_PATH.'download.php?class=captcha&fullpath='.$captcha['uid'];
		$this->setTemplateData('captcha',$captcha);
	}
}
?>