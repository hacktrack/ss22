<?php

require_once(SHAREDLIB_PATH.'system.php');

slSystem::import('mail/phpmailer');
slSystem::import('mail/smime');
slSystem::import('tools/filesystem');


class slMailException extends Exception {}

 
class slMail extends slPHPMailer {
	
	 
	public $bRelay;
	
	 
	public $bAllowEmptyRecipient;
	
	var $SmartAttach        = false;
	var $SmartAttachAccount = '';
	var $SmartAttachExpiration = '';
	var $SmartAttachAnnonymous = true;
	var $SmartAttachParams  = '';
	var $SmartAttachKey = '';
	
	var $CiperStrength = 0;
	var $PassPhrase = '';

	public $publicCertificates;
	public $personalCertificates;
	public $CipherStrength;

	 
	public function __construct($charSet = 'UTF-8',$bRelay = false,$bAllowEmptyRecipient = false)
	{
		$this->PluginDir = SHAREDLIB_PATH.'mail/';
		parent::IsSMTP();
		 		parent::SetLanguage('en', $this->PluginDir . 'language/');
		$this->setCharset($charSet);
		$this->setRelay($bRelay);
		$this->setAllowEmptyRecipient($bAllowEmptyRecipient);
		$this->Encoding = '8bit';
		
	}
	 
	public function setSendMode($mode)
	{
		parent::setMode($mode);
	}
	

	 
	public function setRelay($relay)
	{
		$this->relay = $relay;
	}
		
	 
	public function setFrom($address, $name = '', $setSender = true)
	{
		$this->From	 = self::addressToUTF8($address);
		
		
		if($this->FromName!=$this->From){
			$this->FromName = $this->quoteName($name);
		}
		if ($setSender) {
			$this->Sender = self::addressToUTF8($address);
		}
	}


	 
	public function addTo($address, $name = '')
	{
		parent::AddAddress($address, $name);
	}

	 
	public function addCC($address, $name = '')
	{
		parent::AddCC($address, $name);
	}

	 
	public function addBCC($address, $name = '')
	{
		parent::AddBCC($address, $name);
	}

	 
	 
	public function addReplyTo($address, $name = '')
	{
		parent::AddReplyTo($address, $name);
	}

	 
	public function setSubject($subject)
	{
		$this->Subject = $subject;
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

	 
	public function addAttachment($file, $type = "application/octet-stream", $name = '',$encoding = 'base64',$method = '', $encode = false,$dummy = false, $smart_params = false)
	{
		if (!is_file($file)){
			throw new Exception('attachment_file_not_found');
		}
	    if($type=='message/rfc822'){
	    	$encode = false;
	    }else{ 
	    	$encode = true;     
	    }
	     	    $ext = substr($name,strrpos($name,'.')+1);
	    if(strtolower($ext)=='mht' || strtolower($ext)=='mhtml'){
	    	$type = 'application/x-mimearchive';
	    }
	     	    
		parent::AddAttachment($file, $type, $name, $encoding, $method, $encode, $dummy, $smart_params);
	}
  

	 
	public function addEmbededAttachment($file, $type, $cid, $name = '')
	{
		if (!is_file($file)){
			throw new Exception('attachment_file_not_found');
		}
		if($type=='application/octet-stream'){
			$type = self::getMimeType($name);
		}
		parent::AddEmbeddedImage($file, $cid, $name, 'base64', $type);
	}
	

	 
	public function addHeader($header)
	{
		parent::AddCustomHeader($header);
	}

	 
	public function setPriority($priority)
	{
		switch ($priority) {
		case 'high':
			$this->Priority = 1;
			break;
		case 'normal':
			$this->Priority = 3;
			break;
		case 'low':
			$this->Priority = 5;
			break;
		}
	}

	 
	public function getMessage($charset='UTF-8')
	{
		$this->charSet  = $charset;

		if(!empty($this->AltBody))
			$this->ContentType = "multipart/alternative";
		$this->SetMessageType();
    	$tmpFile = slToolsFilesystem::randomFilename($this->getTempDir());
    	$tmpFP = fopen($tmpFile,'wb+');
    
		$this->CreateHeader($tmpFP);
		$this->CreateBody($tmpFP,$tmpFile);
		if( $this->EncryptMessage || $this->SignMessage ){
	  		$this->encryptAndSign($tmpFP,$tmpFile);
	  	}
	  	
	  	@fclose($tmpFP);

	  	 	  	$result = file_get_contents($tmpFile);
	  	@unlink($tmpFile);

	  	return $result;
  	}
	
  
	 
	public function getMessageTempFile($charset='UTF-8',$fix_address = true,$smarter_smart = true)
	{
		$this->charSet  = $charset;
		if(!empty($this->AltBody)){
			$this->ContentType = "multipart/alternative";
		}
		$this->SetMessageType();
    	$tmpFile = slToolsFilesystem::randomFilename($this->getTempDir());
   	 	$tmpFP = fopen($tmpFile,'wb+');
   	 	$tmpMsg = false;
		$this->CreateHeader($tmpFP,$tmpMsg);
		$this->CreateBody($tmpFP,$tmpFile,$smarter_smart);
	  	slSystem::import('tools/icewarp');
		slToolsIcewarp::iw_index($tmpFile);
		if( $this->EncryptMessage || $this->SignMessage ){
	  		$this->encryptAndSign($tmpFP,$tmpFile);
	  	}
	  	@fclose($tmpFP);

	  	return $tmpFile;
  }
  

	 
	public function send($header = false,$body = false,$charset = 'UTF-8',&$filename = false, $message_id = false, $deleteFile = true)
	{
		if($charset!==false){
			$this->setCharset($charset);
		}
		$charset = $this->charSet;
		return parent::Send($header,$body,$charset,$filename,$message_id);
	}
	
	 
	public function setCharset($charset)
	{
		slSystem::import('tools/charset');
		$charset = slToolsCharset::charsetOverride($charset);
		$this->charSet = $charset;
	}

	 
	public function encrypt()
	{
		$this->EncryptMessage = true;
	}

	 
	public function sign()
	{
		$this->SignMessage = true;
	}
	
	 
	public function encryptAndSign(&$fp, &$filename, $message = NULL)
	{
		if($this->rawRecipient){
			$recipient = $this->rawRecipient;
		}else{
			 			if (isset($this->to[0][0]))
				$recipient = $this->to[0][0];
			else if (isset($this->cc[0][0]))
				$recipient = $this->cc[0][0];
			else if (isset($this->bcc[0][0]))
				$recipient = $this->bcc[0][0];
			else{
				if($this->EncryptMessage){
					throw new Exception('smime_no_recipient');
				}
			}
		}
		slSystem::import('mail/smime');
		$smime = new slSMime();
		$smime->setCertificate($this->publicCertificates[strtoupper($recipient)], $recipient, 'public');
		$smime->setCertificate($this->personalCertificates[strtoupper($this->From)], $this->From, 'personal');
		$smime->setTempDir($this->getTempDir());
		$smime->processMessage(
			$fp,
			$filename,
			$recipient,
			$this->SignMessage,
			$this->EncryptMessage,
			$this->From,
			$errors,
			$this->CipherStrength,
			$this->PassPhrase
		);
	}
	
	public function sendSMS( $recipientList, $html = false )
	{
		 		$api = createobject('API');
		 		if($html){
			$body = slToolsString::removeHTML($this->Body);
		}else{
			$body = $this->AltBody?$this->AltBody:$this->Body;
		}
		 		$body = trim($body);
		$this->time  = time();
		 		$sender = $_SESSION['EMAIL'];
		 		$uniq_id = md5(uniqid(time()));
		$message_id = sprintf('<%s@%s>',$uniq_id,$this->SenderDomain());
		foreach($recipientList as $recipient){
			if($recipient['address']){
				if(strpos($recipient['address'],'@')){
					$number = substr($recipient['address'],0,strpos($recipient['address'],'@'));
				}else{
					$number = $recipient['address'];
				}
				$http = 'number=' . urlencode($number).
				'&name=' . urlencode($recipient['display']).
				'&data=' . urlencode($body).
				'&sender=' . urlencode($sender).
				'&msgid=' . urlencode($message_id).
				'&authenticated=1'.
				'&maxmsgs=5';
				$api->SMSHTTP( $http, true );
			}
		}
		return $message_id;
	}
	
	public function smartAttach($filename = null)
	{

		 		if($this->SmartAttach){
			$description = $this->getSmartAttachDescription();
		
			$gwparams = 'gwparams='.urlencode('evnnote='.urlencode($description));
		
			if($this->SmartAttachSourceFolders){
		    	$sourcefolders = '&sourcefolders='.urlencode(join(CRLF,$this->SmartAttachSourceFolders));
		    }else{
		    	$sourcefolders = '';
		    }

	    	$api = IceWarpAPI::instance('SharedLib/Mail/Mail');
			if(!$api->SmartAttach(
					$filename,
					$this->SmartAttachAccount,
					$this->SmartAttachExpiration,
					$this->SmartAttachAnnonymous,
					$gwparams.$sourcefolders
			)){
				switch($api->LastErr){
					case -21:
						throw new Exception('attachment_virus');
						break;
					case -22:
						throw new Exception('attachment_groupware_general');
						break;
					case -23:
						throw new Exception('attachment_webdav_disabled');
						break;
					case -24:
						throw new Exception('attachment_signed_message');
						break;
					case -27:
						throw new Exception('attachment_quota_exceeded');
						break;
					default:
						break;
				}
			}
		}
	}
	
	public function getSmartAttachDescription()
	{
		slSystem::import('tools/php');
		$recipients = slToolsPHP::array_merge($this->to,$this->cc,$this->bcc);
		foreach($recipients as $rcp){
			$recips[] = $rcp[1].'<'.$rcp[0].'>';
		}
		@$desc = "[SmartAttach] ".$this->Subject."\r\n| ".join(',',$recips);
		return $desc;
	}
	
	public function overrideRecipient($address)
	{
		$this->rawRecipient = $address;
	}
	
	
	public function setSMTPAuth($state)
	{
		$this->SMTPAuth = $state;
	}
	
	public function setSMTPUsername($username)
	{
		$this->Username = $username;
	}
	
	public function setSMTPPassword($password)
	{
		$this->Password = $password;
	}
	
	public function setAllowEmptyRecipient($state)
	{
		$this->bAllowEmptyRecipient = $state;
	}
	
	 
	public function errmsg()
	{
		return $this->ErrorInfo;
	}
	
	public function addHeadersIntoFile($filename,$headers = array())
	{
		$tempName = slToolsFilesystem::randomFilename($this->getTempDir());
		$tempFile = fopen($tempName,'w+');
		foreach($headers as $header){
			fwrite($tempFile,$header.$this->LE);
		}
		$sourceFile = fopen($filename,'r+');
		while($buffer = fread($sourceFile,65536)){
			fwrite($tempFile,$buffer);
		}
	
		
		@fclose($tempFile);
		slToolsIcewarp::iw_index($tempName);
		@fclose($sourceFile);
		@slToolsIcewarp::iw_delete($filename);
		@slToolsIcewarp::iw_move($tempName,$filename);
	}
	
	public function quoteName($name)
	{
		return $name;
	}

	static public function getMimeType ($filename)
	{
		$ext = strrpos($filename,'.');
		$type = substr( $filename, $ext + 1 );
		$type = strtolower($type);
	
		$mimetypes = array(
				'doc' => 'application/msword',
				'bin' => 'application/octet-stream',
				'lha' => 'application/octet-stream',
				'exe' => 'application/octet-stream',
				'dll' => 'application/octet-stream',
				'pdf' => 'application/pdf',
				'eps' => 'application/postscript',
				'ps' => 'application/postscript',
				'xls' => 'application/vnd.ms-excel',
				'ppt' => 'application/vnd.ms-powerpoint',
				'swf' => 'application/x-shockwave-flash',
				'tar' => 'application/x-tar',
				'zip' => 'application/zip',
				'mid' => 'audio/midi',
				'midi' => 'audio/midi',
				'mp2' => 'audio/mpeg',
				'mp3' => 'audio/mpeg',
				'm3u' => 'audio/x-mpegurl',
				'bmp' => 'image/bmp',
				'gif' => 'image/gif',
				'ief' => 'image/ief',
				'jpeg' => 'image/jpeg',
				'jpg' => 'image/jpeg',
				'jpe' => 'image/jpeg',
				'png' => 'image/png',
				'tiff' => 'image/tiff',
				'tif' => 'image/tiff',
				'xbm' => 'image/x-xbitmap',
				'wrl' => 'model/vrml',
				'vrml' => 'model/vrml',
				'css' => 'text/css',
				'html' => 'text/html',
				'htm' => 'text/html',
				'asc' => 'text/plain',
				'txt' => 'text/plain',
				'rtx' => 'text/richtext',
				'rtf' => 'text/rtf',
				'sgml' => 'text/sgml',
				'sgm' => 'text/sgml',
				'xml' => 'text/xml',
				'mpeg' => 'video/mpeg',
				'mpg' => 'video/mpeg',
				'mpe' => 'video/mpeg',
				'qt' => 'video/quicktime',
				'mov' => 'video/quicktime',
				'avi' => 'video/x-msvideo',
				'rar' => 'application/rar',
		);
	
		return ( $mimetypes[$type]?$mimetypes[$type]:'application/octet-stream');
	}
}

?>
