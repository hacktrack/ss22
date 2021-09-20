<?php


class slControllerEmpty extends slControllerDefault
{

	public function index($page = false,$template = false,$dialog_error = false)
	{
		$session = slSession::instance();
		$sid = $session->getSID();
		try{
			$request = slRequest::instance();
			if($_SESSION['PUBLIC_EMAIL']){
				$email = $_SESSION['PUBLIC_EMAIL'];
				$request->set('all.email',$email);
			}else if($request->get('all.email')){
				$email = $request->get('all.email');
			}else{
				$url = $request->getPath().'?_n[w]=main&_n[p][main]=win.login';
			}
			if($email){
				$url = $request->getPath().'?_n[w]=main&_n[p][main]=win.main.public&_n[p][content]=event.main&email='.$email;
			}
			$result = new stdClass();
			$result->redirect = true;
			$result->redirectURL = $url;
			return $result;
			 		}catch(Exception $e){
			
		}
		parent::index();
	}

}
?>