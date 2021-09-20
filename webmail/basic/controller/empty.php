<?php


class slControllerEmpty extends slControllerDefault
{

	public function index($page = false,$template = false,$dialog_error = false)
	{
		$session = slSession::instance();
		$sid = $session->getSID();
		$result = new stdClass();
		try{
			if(is_object($_SESSION['user']) && $_SESSION['user']->checkSession($sid)){
				$request = slRequest::instance();
				$url = $request->getPath().'?_n[w]=main&_n[p][main]=win.main.tree&_n[p][content]=mail.main';
				$result->redirect = true;
				$result->redirectURL = $url;
				return $result;
			 			}
		}catch(Exception $e){
			
		}
		$api = createobject('api');
		 		$path = '../';
		$result->redirect = true;
		$result->redirectURL = $path.'?interface=basic';
		$result->error = $e;
		return $result;
		 		 	}

}
?>