<?php
slSystem::import('controller/dialog');
try{
	slSystem::import('widget/form',APP_PATH);
}catch(Exception $e){
	try{
		slSystem::import('widget/form',APP_INCLUDE_PATH);
	}catch(Exception $e){
		slSystem::import('widget/form');
	}
}
class slWidgetMenu extends slWidgetForm
{
	public function format_bytes($size,$units=false)
	{
		if(!$units)
		{
			$units = array(' B', ' KB', ' MB', ' GB', ' TB');
		}
		for ($i = 0; $size >= 1024 && $i < 4; $i++) $size /= 1024;
		return round($size, 2).$units[$i];
	}
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		
		 
		$settings = WebmailSettings::instance();
		$language = slLanguage::instance();
		try{
			if(!$_SESSION['SID']){
				throw new Exception();
			}
			$oUser = User::load($_SESSION['SID']);
			$layout = $settings->getPrivate('layout_settings');
			$basic = $settings->getPrivate('basic');
			$logged = true;
			
			$helperName = $this->getProperty('helper');
			$param = array('helper'=>$helperName,'widget'=>&$this);
			$helper = slHelperFactory::instance($param);
			$config['controller'] = strval($aConstruct['xml']->config->controller);
			$data = $helper->formWidget( $config );
			$this->setTemplateData($helperName,$data);
			if($data['item']){
				$this->setTemplateData('item',$data['item']);
			}
			
			$helperConfig['helper'] = 'settings';
			$settingsHelper = slHelperFactory::instance($helperConfig);
			$settingsData = $settingsHelper->get();
			
			if(isset($settingsData['settings']['quota']))
			{
				
				$quota = $settingsData['settings']['quota'];
				$quota['mbox_quota']=(float)$quota['mbox_quota'];
				$quota['mbox_usage']=(float)$quota['mbox_usage'];
				
				
				$this->setTemplateData('usage',$quota['mbox_quota']);
				$this->setTemplateData('limit',$quota['mbox_usage']);
				
				$info['percentage']=round($quota['mbox_usage']/$quota['mbox_quota']*100);
				if ($info['percentage']>100){$info['percentage']=100;}
				
				$info['color']=array('r'=>round((170+(2.55*$info['percentage']/3))),'g'=>round((255-(2.55*$info['percentage']/3))),'b'=>170);
				$info['limit']=self::format_bytes(round($quota['mbox_quota']*1024,2),explode(',',$language->get('generic','sizes')));
				$info['usage']=self::format_bytes(round($quota['mbox_usage']*1024,2),explode(',',$language->get('generic','sizes')));
				$this->setTemplateData('quota',$info);
			}
			
			$this->setTemplateData('info',$data['info']);
			$this->setTemplateData('container',$data['info']);
			
		}catch(Exception $e){
			if(!$_SESSION['SID']){
				$logged = false;
			}
			$layout = $settings->getPublic('layout_settings');
		}
		$title = $layout['@childnodes']['item'][0]['@childnodes']['title'][0]['@value'];
		$login_title = $layout['@childnodes']['item'][0]['@childnodes']['login_title'][0]['@value'];
		
		if($logged){
			if(!$title){$title='';}else{$title.=' - ';}
			$oAccount = $oUser->GetAccount($_SESSION['EMAIL']);
			$title.=$oAccount->fullname?$oAccount->fullname:$_SESSION['EMAIL'];
		}elseif(!$title){
			$title = slLanguage::get('login','title');
		}
		
		
		 		if(isset($basic['@childnodes']['item'][0]['@childnodes']['menu_as_text'][0]['@value']))
		{
			$this->setTemplateData('menu_as_text',$basic['@childnodes']['item'][0]['@childnodes']['menu_as_text'][0]['@value']);
		}
		$this->setTemplateData('title',$title);
		 
		
		$data = slRequest::instance();
		$at=str_replace(".",'_',$data->get('get._n.p.content'));
		$sd['disabled']=false;
		if ($at!='')
		{
			$active[$at]=true;
			$theme=$at;
			if ($at=='mail_compose' || $at=='manage_folders' || $at=='contact_distribution' || $at=='settings' || $at=='settings_section') {$sd['disabled']='true';}
		}
		else
		{
			$theme='blue';
		}

		$stype=$data->get('all._s.type');
		if ($stype=='' && $at!='settings' && $at!='settings_section') {$stype='M';}
		$this->setTemplateData('sType',$stype);
		$this->setTemplateData('search',$sd);
        $this->setTemplateData('at',$at);

		 		$links=array();		$addedit = false;
		if(($dlg = slControllerDialog::getCurrentDialogName())
		|| $contact_distribution = $data->get('all.distribution_contact')){
			if($contact_distribution){
				$dlg = 'contact.distribution';
				$addedit = true;
			}
			switch($dlg){
				case 'mail.compose':
					$links=array(
						'm'=>slRequest::instance()->getPath().'?_c=message&_a[cancel_select]=1',
						'e'=>'#',
						'c'=>'#',
						'n'=>'#',
						't'=>'#'
					);
				break;
				case 'contact.distribution':
					 					if($addedit){
						$id = urlencode($data->get('all._s.distrib_id'));
						$folder = urlencode($data->get('all._s.id'));
						$link = 'index.html?_n[p][content]=contact.distribution&_n[p][main]=win.main.tree&_n[w]=main&_s[action]=session&_s[distrib_id]='.$id.'&_s[type]=C&_s[id]='.$folder;
						slGUI::instance()->setTemplateData(array('stornoLink'=>$link));
					 					}else{
						if(!$data->get('get._dlg')){
							 							slSystem::import('controller/item');
							$app = slApplication::instance();
							$item = new slControllerItem($app);
							$link = $item->getContinueLink();
							 						}else{
							$id = urlencode($data->get('all._s.distrib_id'));
							$folder = urlencode($data->get('all._s.id'));
							$link = 'index.html?_n[p][content]=contact.distribution&_n[p][main]=win.main.tree&_n[w]=main&_s[action]=session&_s[distrib_id]='.$id.'&_s[type]=C&_s[id]='.$folder.'&_s[distrib_folder]='.$folder;
							if($dfolder = urlencode($data->get('all._s.distrib_folder'))){
								$link = 'index.html?_n[p][content]=contact.distribution&_n[p][main]=win.main.tree&_n[w]=main&_s[action]=session&_s[distrib_id]='.$id.'&_s[type]=C&_s[id]='.$dfolder;
							}
						}
						
					}
					$links=array(
						'm'=>'#',
						'e'=>'#',
						'c'=>$link,
						'n'=>'#',
						't'=>'#'
					);
				break;
			}
			$this->setTemplateData('_dlg',$dlg);
		}
		if($aConstruct['xml']->config->parameters){
			 			$parameters = $gui->template(
				$parameters,
				array(
					'_dlg'=>slControllerDialog::getCurrentDialogName(),
					'id'=>slRequest::instance()->get('all._s.id')
				)
			);
			$this->setTemplateData('parameters',$parameters );
		}
		if($dialog = slRequest::instance()->get('all._dlg.dialog')){
			if(is_array($dialog)){
				foreach($dialog as $key => $val){
					$parameters.='&_dlg[dialog]['.$key.']='.$val;
				}
				$this->setTemplateData('parameters',$parameters);
			}
		}
		$this->setTemplateData('links',$links);

		$this->setTemplateData('activeMenuTab',$active);
		$this->setTemplateData('theme',$theme);
		$router = slRouter::instance();
		$link = $router->getLink('main', 'main', 'win.login', '&token=' . $_SESSION['SID'], 'auth', 'logout', true);
		$this->setTemplateData('link', array( 'logout' => $link ) );
		
		$note=array();
		$lang = slLanguage::instance();
		if ($data->get('get._n.p.content')=='manage.folders'){$note=$lang->get('manage_folders','select_folder');}
		if ($data->get('get.folder.active'))
		{
			$active_folder=explode('/',$data->get('get.folder.active'));
			$folder=$active_folder[count($active_folder)-1];
			if ($active_folder[count($active_folder)-1]=='#'){$folder='ROOT';}
			$note=$lang->get('manage_folders','perform_action').' <strong>"'.slToolsPHP::htmlspecialchars($folder).'"</strong>';
		}
		$this->setTemplateData('note',$note);
		
		$this->setTemplateData('sid',session_id());
	}

}

?>