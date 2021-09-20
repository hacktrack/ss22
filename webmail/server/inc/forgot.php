<?php
 

class Forgot
{
	private static $sDefaultMessage = "Dear <b>%FULLNAME%</b>,<br/><br/>Your logging information:<br/><br/>Username:<b>%USER%</b><br/>Password:<b>%PASSWORD%</b><br/><br/>This email was sent to :<b>%EMAIL% %ALTEMAIL%</b>";
	private static $sDefaultSubject = "Your lost password for %FULLNAME%";

	public $bMessageSet;
	public $bSubjectSet;
	public $sMessage;
	public $bHTML;
	public $sEncoding;
	public $sSubject;
	public $oMail;
	public $sEmail;
	public $sAlternativeEmail;
	public $sFullname;
	public $sPassword;
	public $oAPIAccount;
	public $sUser;

     	public function __construct($sEmail,$sEncoding = 'UTF-8')
	{
		$this->sEmail = $sEmail;
		$this->sEncoding = $sEncoding;

		$this->oMail = new Mail($sEncoding);
		$this->oAPIAccount = new MerakAccount();

		$this->bSubjectSet = false;
		$this->bMessageSet = false;

		$this->getAccountInfo();
	}

	public function send()
	{
		$this->compose();

		if(!$this->oMail->send()){
			return 0;
		}else{
			$return[0]['mail'] = $this->sEmail;
			if($this->sAlternativeEmail){
				$return[1]['mail'] = $this->sAlternativeEmail;
			}
			return $return;
		}
	}

	public function setSubject($sSubject)
	{
		 $this->updateMailSubject($sSubject);
		 $this->bSubjectSet = true;
	}
	
	public function setMessage($sMessage,$bHTML = false)
	{
		$this->updateMailMessage($sMessage,$bHTML);
		$this->bMessageSet = true;
	}

	private function compose()
	{
		 		$aDomain = Storage::getDomainDefaults('global_settings');
		$aGlobal = Storage::getDefaults('global_settings');
		$aData = WebmailIqPublic::get('global_settings',$aGlobal,$aDomain,false);
		$sSMTPServer = strval($aData['@childnodes']['item'][0]['@childnodes']['smtpserver'][0]['@value']);
		$sSMTPPort = strval($aData['@childnodes']['item'][0]['@childnodes']['smtpport'][0]['@value']);
		
		if($sSMTPServer){
			$this->oMail->Host = $sSMTPServer;
		}
		if($sSMTPPort){
			$this->oMail->Port = $sSMTPPort;
		}
		$this->oMail->setFrom($this->sEmail);
		$this->oMail->addTo($this->sEmail);

		if($this->sAlternativeEmail)
			$this->oMail->addTo($this->sAlternativeEmail);
			
		if(!$this->bMessageSet || !$this->bSubjectSet){
			$server = Storage::getDefaults('forgot_settings');
			$domain = Storage::getDomainDefaults('forgot_settings');
			$settings = WebmailIqPublic::get('forgot_settings', $server, $domain, false);
			$settings = $settings['@childnodes']['item'][0]['@childnodes'];
			if($settings['forgot'][0]['@value']!=1){
				throw new Exc('forgot_disabled','disable');
			}
			$body = $settings['mail'][0]['@value'];
			$subject = $settings['subject'][0]['@value'];
			
			if(!$body || !$subject){
				
				$server = Storage::getDefaults('layout_settings');
				$domain = Storage::getDomainDefaults('layout_settings');
				$layout = WebmailIqPublic::get('layout_settings', $server, $domain, false );
				$layout = $layout['@childnodes']['item'][0]['@childnodes'];
				$language = $layout['language'][0]['@value'];
				$language = $language?$language:'en';
				$languageFile = '../client/languages/'.$language.'/data.xml';
				$languageXML = slToolsXML::loadFile($languageFile);
				$settingsMessage = strval($languageXML->forgot_pass->email);
				$settingsSubject = strval($languageXML->forgot_pass->subject);
			}
			$body = $body?$body:$settingsMessage;
			$subject = $subject?$subject:$settingsSubject;
		}
		if(!$this->bMessageSet){
			$this->updateMailMessage($body);
		}
		if(!$this->bSubjectSet){
			$this->updateMailSubject($subject);
		}
	}

	private function updateMailMessage($sMessage,$bHTML = false)
	{
		$this->sMessage = $sMessage;
		$this->bHTML = $bHTML;
		$this->sMessage = $this->replaceVariables($this->sMessage);
		if($this->bHTML){
			$this->oMail->setBody(false,$this->sMessage);
		}else{
			$this->oMail->setBody($this->sMessage,'');
		}
	}

	private function updateMailSubject($sSubject)
	{
		if($this->sEncoding!='UTF-8'){
			$this->sSubject = Tools::my_iconv($this->sEncoding,'',$this->replaceVariables($sSubject));
		}else{
			$this->sSubject = $this->replaceVariables($sSubject);
		}
		 $this->oMail->setSubject($this->sSubject);
	}

	private function replaceVariables($string)
	{
		$string = str_replace("%FULLNAME%",$this->sFullname,$string);
		$string = str_replace("%USERNAME%",$this->sUser,$string);
		$string = str_replace("%USER%",$this->sUser,$string);
		$string = str_replace("%PASSWORD%",$this->sPassword,$string);
		$string = str_replace("%EMAIL%",$this->sEmail,$string);
		$string = str_replace("%ALTEMAIL%",$this->sAlternativeEmail,$string);

		$string = str_replace("%REMOTEIP%",$_SERVER['REMOTE_ADDR'],$string);

		return $string;
	}

	private function getAccountInfo()
	{
		if(!$this->oAPIAccount->Open($this->sEmail)){
			throw new Exc('account_does_not_exist',$this->sEmail);
		}
		$this->sAlternativeEmail = trim($this->oAPIAccount->GetProperty("U_AlternateEmail"));
		$this->sFullname = $this->oAPIAccount->GetProperty("U_Name");
		$this->sPassword = '*';		$this->sUser = $this->oAPIAccount->GetProperty("U_Mailbox");
	}
}
?>