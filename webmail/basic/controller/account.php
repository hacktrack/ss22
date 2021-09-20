<?php

class slControllerAccount extends slControllerDefault
{
	public function check(&$action, &$data)
	{
		switch($action){
			case 'sync':
				try{
					if(!($this->oUser = &$_SESSION['user'])){
						throw new Exc('Unauthorized');
					}
					if(!$this->oUser->aAccounts){
						throw new Exc('No Accounts');
					}
				}catch(Exception $e){
					$request = slRequest::instance();
					$result = new stdClass();
					$result->redirect = true;
					$result->redirectURL = $request->getPath().'?_n[w]=main&_n[p][main]=win.login';
					$result->error = $e;
				}
			break;
		}
		slApplication::instance()->finish($result);
	}
	
	public function sync()
	{
		$oAccount = $this->oUser->getAccount($_SESSION['EMAIL']);
		$oAccount->sync();
		 		$session = slSession::instance();
		$session->setMain('["sync"]["folder"]',array());
		 		$result = new stdClass();
		$result->redirect = true;
		$result->redirectURL = slRequest::instance()->getPath().'?_l=folder&p0=main&p1=content&p2=mail.main&p3=item.fdr&p4=INBOX&p5=M';
		return $result;
	 
		
	
	}


}