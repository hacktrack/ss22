<?php

 
require_once ('application.php');

 
class ChallengeUser
{
	 	public $email;
	private $isAdmin;
	private $quarantineSupport;
	public $quarantineMode;
	private $spamSupport;
	public $spamMode;
	 	private $pathsLoaded;


	 
	public function __construct(&$icewarpAccount)
	{
		$this->account = &$icewarpAccount;
		$this->email = $icewarpAccount->EmailAddress;
		$this->refresh();
	}
	
	public function __destruct()
	{
		unset($this->email);
		unset($this->isAdmin);
		unset($this->quarantineMode);
		unset($this->quarantineSupport);
		unset($this->spamSupport);
		unset($this->spamMode);
		unset($this->paths);
		unset($this->pathsLoaded);
	}

	 
	private function refresh()
	{
		$this->spamSupport = 'undefined';
		$this->quarantineSupport = 'undefined';
		$this->spamMode = 'undefined';
		$this->quarantineMode = 'undefined';
		$this->pathsLoaded = false;
	}

	 
	public function reset()
	{
		$this->getPaths();
		if (file_exists($this->getPath('fileSpam'))) {
			unlink($this->getPath('fileSpam'));
		}
		if (file_exists($this->getPath('fileQuarantine'))) {
			unlink($this->getPath('fileQuarantine'));
		}
		$this->message("All Messages set to NEW (Reset time access files)");
	}

	 
	public function getSpamMode()
	{

		if ($this->spamMode == 'undefined') {
			$this->getSpamSupport();
		}
		return $this->spamMode;
	}

	 
	public function getQuarantineMode()
	{
		if ($this->quarantineMode == 'undefined') {
			$this->getQuarantineSupport();
		}
		return $this->quarantineMode;
	}

	 
	public function isSpamAdmin()
	{
		if ($this->account->GetProperty('U_SpamAdmin')) {
			return true;
		} else {
			return false;
		}
	}


	 
	private function getSpamSupport()
	{
		if ($this->spamSupport == 'undefined') {
			$userSpamSupport = $this->account->GetProperty('U_SpamFolderSupport');
			$userASSupport = $this->account->GetProperty('U_ASSupport');
			if (!$userSpamSupport || !$userASSupport) {
				$this->spamSupport = false;
				$this->spamMode = false;
				return false;
			}
			$spamFolder = $this->account->GetProperty('U_SpamFolder');
			$challenge = ChallengeApplication::instance();
			$globalSupport = $challenge->getSettings('C_AS_SpamFReports');
			$enabled = $globalSupport;
			 			if ($spamFolder != 2) {
				 				if ($spamFolder == 0) {
					if ($challenge->getSettings('C_AS_UseSpamFolder') == 0) {
						$enabled = false;
					}
					 				} else {
					$enabled = false;
				}
			}
			$this->spamMode = $this->getReportMode($enabled);
			$this->spamSupport = $enabled;
			if ($enabled) {
				$this->getPaths();
			}
		}
		return $this->spamSupport;
	}

	 
	private function getQuarantineSupport()
	{
		if ($this->quarantineSupport == 'undefined') {
			$challenge = ChallengeApplication::instance();
			if (!$this->account->GetProperty('U_QuarantineSupport')) {
				$this->quarantineSupport = false;
				$this->quarantineMode = false;
				return;
			}
			$globalSupport = $challenge->getSettings('C_AS_SpamQReports');
			$enabled = $globalSupport;
			$this->quarantineMode = $this->getReportMode($enabled);
			$this->quarantineSupport = $enabled;
			if ($enabled) {
				$this->getPaths();
			}
		}
		return $this->quarantineSupport;
	}

	 
	private function getReportMode(&$enabled)
	{
		$challenge = ChallengeApplication::instance();
		$globalMode = $challenge->getSettings('C_AS_SpamQReportsMode');
		switch ($this->account->GetProperty("U_QuarantineReports")) {
			case 0:  				$enabled = false;
				$result = false;
				break;
			case 1:  				if ($enabled) {
					$result = $globalMode + 1;
				} else {
					$result = false;
				}
				break;
			case 2:  				$result = 1;
				$enabled = true;
				break;
			case 3:  				$result = 2;
				$enabled = true;
				break;
		}
		return $result;
	}

	 
	private function getPaths()
	{
		if ($this->pathsLoaded === false) {
			
			$this->path['mailbox'] = $this->account->GetProperty('U_FullMailboxPath');
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

	public function getAccountType()
	{
		if (!isset($this->accountType)) {
			$this->accountType = $this->account->GetProperty('U_AccountType');
		}
		return $this->accountType;
	}

	 
	private function error($msg)
	{
		$challenge = ChallengeApplication::instance();
		$challenge->error($msg);
	}

	 
	private function message($msg)
	{
		$challenge = ChallengeApplication::instance();
		$challenge->message($msg);
	}

}

?>