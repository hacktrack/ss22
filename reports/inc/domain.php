<?php
require_once ('application.php');

 
class ChallengeDomain
{
	public function __construct(&$icewarpDomain)
	{
		$this->domain = &$icewarpDomain;
		$this->name = $icewarpDomain->Name;
		$this->pathsLoaded = false;
	}
	
	 
	private function getPaths()
	{
		if ($this->pathsLoaded === false) {
			$app = ChallengeApplication::instance();
			$this->path['mailbox'] = $app->getPath('mail').$this->name.'/';
			$this->path['spam'] = $this->path['mailbox'] . '~spam/';
			if (!is_dir($this->path['spam'])) {
				slToolsFilesystem::mkdir_r($this->path['spam']);
			}
			$this->path['quarantine'] = $this->path['spam'] . '~quarantine/';
			if (!is_dir($this->path['quarantine'])) {
				slToolsFilesystem::mkdir_r($this->path['quarantine']);
			}
			$this->path['fileQuarantine'] = $this->path['quarantine'] . 'quarantine.dat';
			$this->path['fileSpam'] = $this->path['spam'] . 'spam.dat';
			$this->path['fileAdmin'] = $this->path['mailbox'] . 'spamadmin.dat';
			$this->pathsLoaded = true;
		}
	}
	
	 
	public function getPath($index)
	{
		if (!$this->pathsLoaded) {
			$this->getPaths();
		}
		return $this->path[$index];
	}
}
	
?>