<?php
require_once('inc/user.php');


 

class slHelperAuth extends slHelper
{
	public function check()
	{
		$request = slRequest::instance();
		$result = new stdClass();
		$result->redirect = false;
		$gui = slGUI::instance();
		
		$pages = $gui->application->pages;
		$page = $pages['main'];
		if($page=='win.main.public'){
			$request->set('all.public',true);
		}else{
			if(!$_SESSION['user']){
				try{
					throw new Exception('unauthorized');
				}catch(Exception $e){
					 					 					$path = '../';
					$result->redirect = true;
					 					$result->redirectURL = $path.'?interface=basic';
					$result->error = $e;
				}
			}else{
					
				try{
					$cache = Cache::instance( $_SESSION['user'] );
					$_SESSION['user']->checkSession($_SESSION['SID']);
					$this->checkExpire();
				}catch(Exception $e){
					 					 					$path = '../';
					$result->redirect = true;
					$result->redirectURL = $path.'?interface=basic';
					 					$result->error = $e;
				}
			}
		}
		
		slApplication::instance()->finish($result);
	}
	
	private function checkExpire()
	{
		 
	}
}


?>
