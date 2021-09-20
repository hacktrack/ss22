<?php
require_once('inc/user.php');


 

class slHelperAuth extends slHelper
{
	public function check()
	{		
		$result = new stdClass();
		$result->redirect = false;
		if(!$_SESSION['user']){
			
			 			 			$path = '../';
			$result->redirect = true;
			 			$result->redirectURL = $path.'?interface=pda';
		}else{
			try{
				$cache = Cache::instance( $_SESSION['user'] );
				$_SESSION['user']->checkSession($_SESSION['SID']);
				$this->checkExpire();
			}catch(Exception $e){
				 				 				$path = '../';
				$result->redirect = true;
				 				$result->redirectURL = $path.'?interface=pda';
			}
		}
		slApplication::instance()->finish($result);
	}
	
	private function checkExpire()
	{
		 
	}
}


?>
