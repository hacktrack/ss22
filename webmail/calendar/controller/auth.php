<?php
require_once('inc/user.php');


 

 class slControllerAuth extends slControllerDefault
{	
	private $js=0;
	
	public function login()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		try{
			session_start();
			$email = $this->username;
			$_SESSION['CTZ'] = $this->timezone;
			$account = new stdClass();
			$gwAccount = new GroupWareAccount('','',$account);
			if(!$email && !$_SESSION['PUBLIC_CALENDAR']){
				throw new Exc('Public Calendar: No email');
			}
			$gid = $gwAccount->gwAPI->OpenGroup('~'.$email);
			$list = $gwAccount->getFolders();
			if(is_array($list) &&!empty($list)) foreach($list as $folder){
				if($folder->getType()=='E' && $folder->isDefault()){
					$defaultEvents = $folder;
					break;
				}
			}
			if(!$defaultEvents){
				throw new Exc('Public Calendar: Can\'t retrieve default events folder');
			}
			
			$_SESSION['PUBLIC'] = true;
			if($email){
				$_SESSION['PUBLIC_EMAIL'] = $email;
			}
			$api = createobject('api');
			$_SESSION['TIMEZONE'] = $api->GetProperty("c_timezone");
			$_SESSION['PUBLIC_CALENDAR'] = $defaultEvents;
			if(!$this->language){
				$this->language = 'en';
			}
			slSession::instance()->setMain('login_language',$this->language);
			$interface = explode('|',$_COOKIE['lastLogin'])[1];
			setcookie('lastLogin',strval($this->language).'|'.$interface,mktime(0,0,0,1,1,2030),'/');
			
			$result->redirect = true;
			 			$result->redirectURL = $request->getPath().'?_n[p][content]=event.main&_n[p][main]=win.main.public&_n[w]=main';
			return $result;
		}catch(Exc $e){
			
			 			$result->redirect = true;
			$result->redirectURL = $request->getPath().'?_n[p][main]=win.login&_n[w]=main';
			$result->error = $e;
			return $result;
			
		}
		
		$_SESSION['jscheck']=$this->js;

		if (isset($_POST['remember']))
		{
			$this->remember=$_POST['remember'];
		}

		 
		if ($this->remember>0)
		{
			if ($this->remember==1)
			{
				$ld=$this->username;
			}
			elseif($this->remember==2 || $this->remember==3)
			{
				if ($this->password!='')
				{
					$pwd=$this->password;
				}
				else
				{
					$pwd='HASH-'.$this->hash;
				}
				$ld=$this->username."|".$pwd;
			}
			setcookie('icewarp_basic',$this->remember."|".$ld,time()+(3600*24*300),'/');
		}
		else
		{
			setcookie('icewarp_basic','',mktime(0,0,0,1,1,2000),'/');
		}
		
		$session = slSession::instance();
		$session->setMain('["cache"]',NULL);
		 
		
		return $result;
	}
	
	public function logout()
	{
		$result = new stdClass();
		$request = slRequest::instance();
		if(is_object($_SESSION['user'])){
			$_SESSION['user']->logout(true);
		}
		@session_destroy();
		$session = slSession::instance();
		$session->sid = false;
		$result->redirect = true;
		$result->redirectURL = $request->getPath().'?_n[p][main]=win.login&_n[w]=main&mid=logged_out';
		return $result;
	}
	
	public function check( &$action , &$data )
	{
		parent::check( $action, $data );
		if (isset($data['all']['_n']['js']))
		{
			if ($data['all']['_n']['js']!='')
			{
				$this->js=$data['all']['_n']['js'];
			}
		}
		
		switch($action){
			case 'login':
				$this->timezone = $data['all']['ctz'];
				$this->username = $data['all']['username'];
				$this->cipher = isset($data['all']['password_rsa']);
				$this->disable_ip_check = $data['form']['disable_ip_check'];
				$this->disable_ip_check = $this->disable_ip_check?true:false;
				$this->language = $data['all']['language'];
				setcookie('basic_disable_ip_check',$this->disable_ip_check,mktime(0,0,0,1,1,2030),'/');
				$this->password = slToolsCrypt::encryptSymmetric(($this->cipher ? $data['all']['password_rsa'] : $data['all']['password']) ?? '');
				$this->hashid = $data['all']['hash'];
				$this->target = $data['all']['_n']['p']['main'];
				if(!$this->target){
					$this->target = 'win.main';
				}
			break;
		}
	}

	 
}


?>
