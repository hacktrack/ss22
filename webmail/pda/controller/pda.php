<?php

class slControllerPda extends slControllerDefault
{
	public function index($page = false,$template = false,$dialog_error = false)
	{
		if($this->application->getPageID()=='win.login'){
			slRouter::instance()->redirect('../?interface=pda',true);
		}
		parent::index($page,$template,$dialog_error);
	}
}

?>