<?php
 
class Mail extends slMail 
{
	protected $referenceItems = [];

	 
	public function __construct($charSet = 'UTF-8',$bRelay = false,$bAllowEmptyRecipient = false,$sHostName = false)
	{
		$this->PluginDir = SHAREDLIB_PATH.'mail/';
		parent::IsSMTP();

		$this->Host = $_SESSION['HOST']?$_SESSION['HOST']:'127.0.0.1';
		$this->BackupConnections = '';
		if($_SESSION['SECONDARY']['SMTP']){
			foreach($_SESSION['SECONDARY']['SMTP'] as $smtpConnection){
				$this->BackupConnections[]=$smtpConnection['HOST'].($smtpConnection['PORT']?':'.$smtpConnection['PORT']:'');
			}
			$this->BackupConnections = join(';',$this->BackupConnections);
		}
		$this->Hostname = $_SESSION['DOMAIN'] ? $_SESSION['DOMAIN'] : ($sHostName===false ? $_SERVER['SERVER_NAME'] : $sHostName);
		if(!$_SESSION['SMTP_HIDE_IP']){
			$this->Hostname.= ' ['.$_SERVER['REMOTE_ADDR'].']';
		}
		$this->Port = $_SESSION['PORT']?$_SESSION['PORT']:25;
		 		User::settingsGlobal();
		if($_SESSION['SMTP_AUTH']){
			if($_SESSION['user']){
				$oPrimaryAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
				$this->setSMTPAuth($_SESSION['SMTP_AUTH']);
				$this->setSMTPUsername($oPrimaryAccount->username);
				$this->setSMTPPassword($oPrimaryAccount->getPassword());
			}else{
				if($_SESSION['SMTP_AUTH'] && $_SESSION['SMTP_USER'] && $_SESSION['SMTP_PASS']){
					$this->setSMTPAuth($_SESSION['SMTP_AUTH']);
					$this->setSMTPUsername($_SESSION['SMTP_USER']);
					$this->setSMTPPassword($_SESSION['SMTP_PASS']);
				}
			}
		}
		 		$this->SMTPAutoTLS = $_SESSION['SMTP_SSLMETHOD']!=5 && $_SESSION['SMTP_SSLMETHOD']!=6;
		
		 		parent::SetLanguage('en', $this->PluginDir . 'language/');
		parent::SetRelay($bRelay);

		$this->relay = $bRelay;
		$this->bAllowEmptyRecipient = $bAllowEmptyRecipient;

		$this->setCharset($charSet?$charSet:$_SESSION['DEFAULTCHARSET']);
		$this->Encoding = 'quoted-printable';
		$this->XMailer  = 'IceWarp Mailer ' . $_SESSION['WM_VERSION'];
		$this->mime_encode_base64 = $_SESSION['MIME_ENCODE_BASE64'];
		$this->SmartAttachKey = $_SESSION['SMARTATTACH_HASH_KEY'];
		$this->personalCertificates = Storage::getPersonalCertificates();
		if($_SESSION['user']){
			$tempDir = User::getUploadDir('');
			$this->setTempDir($tempDir);
		}
	}

	public function addReferenceItem($reference)
	{
		$this->referenceItems[] = $reference;
	}
	
	public function encryptAndSign(&$fp, &$filename, $message = NULL)
	{
		try{
			return parent::encryptAndSign($fp,$filename, $message);
		}catch(Exception $e){
			throw new Exc($e->getMessage());
		}
	}
	
	function SetError($type,$msg)
	{
		throw new Exc('phpmailer_'.$type);
	}
	
	function SetSMTPError($type, $msg)
	{
		throw new Exc('SMTP_'.$type, $msg);
	}
	
	public function setBody($text, $html = '')
	{
		
		if ($html != '') {
			parent::IsHTML(true);
			$this->Body	= $html;
			$this->AltBody = $text;
		} else {
			parent::IsHTML(false);
			$this->Body = $text;
		}
	
		 		$this->Body = str_replace("\r","",$this->Body);
		$this->Body = str_replace("\n","\r\n",$this->Body);
	}
}

?>
