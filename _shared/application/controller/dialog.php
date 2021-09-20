<?php

class slControllerDialog extends slControllerDefault
{
	public function check(&$action,&$data)
	{
		parent::check($action,$data);
	}
	
	public function index($page = false,$template = array(),$error = false)
	{
		parent::index($page,$template,$error);
	}
	
	public function initDialog($argv = array())
	{
		 		if($argv['dialog']=='contact.select'){
			slSession::setPage('selected_contacts',array());
		}
		
		 		$dialogDotted = $argv['dialog'];
		$dialog = str_replace('.','_',$dialogDotted);
		$request = slRequest::instance();
		$session = slSession::instance();
		if(!$session->sid){
			$session->start();
		}
		$this->saveSentData($dialog);
		$dlgSettings = $request->get('form._dlg.'.$dialog);
		 		$target = $argv['parameters']['target']?$argv['parameters']['target']:'main';
		$navigation['pages'][$target] = $dialogDotted;
		$navigation['window'] = 'main';
		$this->application->setNavigation($navigation);
		 		$dlgParams = $argv['parameters']['parameters'];
		$this->setDialogParameters($dlgParams);
		$session->setMain('["dialogs"]["'.$dialog.'"]',$argv);
		if($argv['parameters']['link']){
			$result = new stdClass();
			$result->redirect = true;
			$result->redirectURL = $request->getPath().$argv['parameters']['link'].'&_dlg[controller]='.$argv['controller'].'&_dlg[action]='.$argv['action'].'&_dlg[id]='.$dialogDotted;
			$this->application->finish($result);
		}else{
			$this->index( 
				false, 
				array(
					'dialog'=>array(
						'action'=>slToolsPHP::htmlspecialchars($argv['action']),
						'controller'=>slToolsPHP::htmlspecialchars($argv['controller']),
					)
				),
				$argv['error']
			);
		}
	}

	
	static public function setDialogParameters($params,$nam = '',$rewrite = true)
	{
		$request = slRequest::instance();
		if(is_array($params) && count($params) > 0){
			foreach($params as $key=>$val){
				if($nam === ''){
					$sep = '';
				}else{
					$sep = '.';
				}
				$name = $nam.$sep.$key;
				self::setDialogParameters($val,$name,$rewrite);
			}
		} else{
			if($nam){
				if($rewrite || !$request->get($nam)){
					$request->set($nam,$params);
				}
			}
		}
	}
	
	
	public function processDialog( $argv= array())
	{
		 		$dialogDotted = $argv['dialog'];
		$dialog = str_replace('.','_',$dialogDotted);
		$request = slRequest::instance();
		
		switch($argv['parameters']['type']){
			case 'confirm':
				return $this->$dialog($argv);
			break;
			case 'select':
			 				$data = $request->data();
				$this->loadSentData($dialog,$argv);
				 				return $this->callOtherControllerAction(
					slToolsPHP::htmlspecialchars($argv['controller']),
					slToolsPHP::htmlspecialchars($argv['action']),
					 					$data
				);
			break;
		}
	}
	
	 	public function captcha($argv)
	{
		 		$request = slRequest::instance();
		$sUID = $request->get('all.captcha.uid');
		$sWord = $request->get('all.captcha.word');
		if(!$sUID){
			$this->saveSentData('captcha');
		}
		try{
			if(isset($sWord) && $sUID){
				slSystem::import('tools/captcha');
				$oCaptcha = new slToolsCaptcha();
				$oCaptcha->check($sUID,$sWord);
			}else{
				throw new Exception();
			}
			$this->loadSentData('captcha',$argv);
			return $this->callOtherControllerAction(
				slToolsPHP::htmlspecialchars($argv['controller']),
				slToolsPHP::htmlspecialchars($argv['action']),
				true
			);
		}catch(Exception $e){
			if($e->wmcode=='confirmation_retry_count'){
				$result = new stdClass();
				$result->redirect = true;
				$result->error = $e;
				$api = IceWarpAPI::instance();
				$result->redirectURL = $api->getProperty('C_Webmail_URL');
				return $result;
			}
			if($sUID){
				$argv['error'] = 'confirmation_word_mismatch';
				$this->loadSentData('captcha',$argv);
			}
			$argv['controller'] = slToolsPHP::htmlspecialchars($argv['controller']);
			$argv['action'] = slToolsPHP::htmlspecialchars($argv['action']);
			$argv['type'] = slToolsPHP::htmlspecialchars($argv['type']);
			return $this->initDialog($argv);
		}
	}

	static public function getCurrentDialogName()
	{
		if($dlg = slRequest::instance()->get('all._dlg')){
			if(is_array($dlg)){
				if($dlg['id']){
					return $dlg['id'];
				}
				$first = reset($dlg);
				$dlg = $first['referer']?$first['referer']:reset(array_keys($dlg));
			}
		}
		return $dlg;
	}
}

?>