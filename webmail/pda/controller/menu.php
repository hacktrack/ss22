<?php
slSystem::import('controller/account',APP_PATH);
slSystem::import('controller/auth',APP_PATH);

class slControllerMenu extends slControllerDefault
{
	public function sync()
	{
		$accountController = new slControllerAccount($this->application);
		$action = 'sync';
		$accountController->check($action,$this->data);
		return $accountController->sync();
	}
	
	public function compose()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$result->redirect = true;
		 		$result->redirectURL.='index.html?_n[p][main]=mail.compose&_n[w]=main';
		return $result;
	}
	
	public function logout()
	{
		$authController = new slControllerAuth($this->application);
		$action = 'logout';
		$authController->check($action,$this->data);
		return $authController->logout();
	}
	 	public function go_to_main_page()
	{
		$result = new stdclass();
		$result->redirect = true;
		$result->redirectURL = 'index.html?_n[w]=main&_n[p][main]=grid.mail';
		return $result;
	}
}


?>