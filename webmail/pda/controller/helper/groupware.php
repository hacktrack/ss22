<?php
require_once('inc/user.php');


 

class slHelperGroupware extends slHelper
{
	public function check()
	{
		if($oUser = $_SESSION['user']){
			$oPrimaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			if($oPrimaryAccount->gw
			 && is_object($oPrimaryAccount->gwAccount) 
			 && $oPrimaryAccount->gwAccount->gwAPI->isConnected()){
				return true;
			}else{
				
				$result->redirect = true;
				$result->redirectURL = '?_n[w]=main&_n[p][main]=grid.mail&_s[data]=item.fdr&_s[type]=M&_s[id]=INBOX';
				slApplication::instance()->finish($result);
			}
		}
		
	}

}
?>