<?php

class slControllerBasic extends slControllerDefault
{
	private function browser_info($agent=null) {
		$known = array('msie', 'firefox', 'safari', 'webkit', 'opera', 'netscape','konqueror', 'gecko');
		$agent = strtolower($agent ? $agent : $_SERVER['HTTP_USER_AGENT']);
		$pattern = '#(?<browser>' . join('|', $known) .')[/ ]+(?<version>[0-9]+(?:\.[0-9]+)?)#';
		if (!preg_match_all($pattern, $agent, $matches)) return array();
		$i = count($matches['browser'])-1;
		return array('browser'=>$matches['browser'][$i],'version'=>$matches['version'][$i]);
	}
	
	public function index($page = false,$template = false,$dialog_error = false)
	{
		if($this->application->getPageID()=='win.login'){
			slRouter::instance()->redirect('../?interface=basic',true);
		}
		$gui = slGUI::instance($this->application);
		$browser=$this->browser_info();
		if($browser['browser']=='msie' && $browser['version']<7){$oldbrowser='a';}else{$oldbrowser=false;}
		$gui->setTemplateData(array('oldbrowser'=>$oldbrowser,"jscheck"=>$_SESSION['jscheck']));
		$request = slRequest::instance();
		$lastFolder = slSession::getPage('selected_contacts.folder');
		$currentFolder = $request->get('all._s.id');
		if($lastFolder!=$currentFolder){
			slSession::setPage('selected_contacts',array());
			slSession::setPage('selected_items',array());
		}
		slSession::setPage('selected_contacts.folder',$currentFolder);
		parent::index($page,$template,$dialog_error);
	}
}

?>