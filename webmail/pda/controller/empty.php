<?php


class slControllerEmpty extends slControllerDefault
{
	public function index($page = false,$template = false,$dialog_error = false)
	{
		$session = slSession::instance();
		$result = new stdClass();
		 		$sid = $session->getSID();
		try{
			if(is_object($_SESSION['user']) && $_SESSION['user']->checkSession($sid)){
				$request = slRequest::instance();
				$skin = $this->getActualSkin();
				switch($skin){
					case 'apple':
						$url = $request->getPath().'?_n[w]=main&_n[p][main]=welcome';
					break;
					case 'pda':
					default:
						$url = $request->getPath().'?_n[w]=main&_n[p][main]=grid.mail';
					break;
				}
				$result->redirect = true;
				$result->redirectURL = $url;
				return $result;
			 			}
		}catch(Exception $e){
		
		}
		 		 		$path = '../';
    $result->redirect = true;
		$result->redirectURL = $path.'?interface=pda';
		$result->error = $e;
		return $result;
	}

}
?>