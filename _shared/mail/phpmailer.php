<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('mail/smime');
slSystem::import('tools/filesystem');
slSystem::import('tools/string');
slSystem::import('tools/charset');

abstract class slPHPMailer
{
         var $Priority           = "";
    var $charSet            = "UTF-8";
    var $ContentType        = "text/plain";
    var $Encoding           = "8bit";
    var $ErrorInfo          = "";
    var $From               = "root@localhost";
    var $FromName           = "Root User";
    var $Sender             = "";
    var $Subject            = "";
    var $Body               = "";
    var $AltBody            = "";
    var $WordWrap           = 900;
    var $Mailer             = "mail";
    var $Sendmail           = "/usr/sbin/sendmail";
    var $PluginDir          = "";
    var $Version            = "1.73";
    var $XMailer            = "";
    var $ConfirmReadingTo   = "";
    var $Hostname           = "127.0.0.1";
    var $SignMessage        = false;
    var $EncryptMessage     = false;
    var $SmartAttach        = false;
    var $SmartAttachAccount = '';
    var $SmartAttachExpiration = '';
    var $SmartAttachAnnonymous = true;
    var $SmartAttachParams  = '';
    var $SmartAttachSourceFolders  = array();
    var $tempDir  = '/';
    var $tempFile  = '';
    public $BackupConnections;

    
    
          
    var $Host        = "127.0.0.1";
     
    var $Port        = 25;
    
    var $Helo        = "";
    var $SMTPAuth     = false;
    var $SMTPSecure   = "";
    var $SMTPAutoTLS  = true;
    var $Username     = "";
    var $Password     = "";
    var $Timeout      = 120;
    var $SMTPDebug    = false;
    var $SMTPKeepAlive = false;
    

         var $smtp            = NULL;
    var $to              = array();
    var $cc              = array();
    var $bcc             = array();
    var $ReplyTo         = array();
    var $attachment      = array();
    var $CustomHeader    = array();
    var $message_type    = "";
    var $boundary        = array();
    var $language        = array();
    var $error_count     = 0;
    var $LE              = "\r\n";
    var $sendMode = 'file';
    var $iMIP = false;

    public $time;
    public $message_id;
    public $rawRecipient;
    public $relay;
    public $AuthType;
    public $last_message_id;
    public $DeferredDelivery;
    public $SmartAttachKey;
    public $mime_encode_base64;
    public $smartAttach;

    abstract public function setCharset($charset);

    function PHPMailer($charset){
	     $this->charSet = $charset; 
    }

    function IsHTML($bool) {
        if($bool == true)
            $this->ContentType = "text/html";
        else
            $this->ContentType = "text/plain";
    }

    function IsSMTP() {
        $this->Mailer = "smtp";
    }

    function IsMail() {
        $this->Mailer = "mail";
    }

    function IsSendmail() {
        $this->Mailer = "sendmail";
    }

    function IsQmail() {
        $this->Sendmail = "/var/qmail/bin/sendmail";
        $this->Mailer = "sendmail";
    }
    
    public function sendAsIMIP($status)
    {
    	$this->iMIP = $status;
    }
    
         function AddAddress($address, $name = "") {
    	$address = self::addressToIDN($address);
        $cur = count($this->to);
        $this->to[$cur][0] = trim($address);
        $this->to[$cur][1] = $name;
    }

    function AddCC($address, $name = "") {
    	$address = self::addressToIDN($address);
        $cur = count($this->cc);
        $this->cc[$cur][0] = trim($address);
        $this->cc[$cur][1] = $name;
    }

    function AddBCC($address, $name = "") {
    	$address = self::addressToIDN($address);
        $cur = count($this->bcc);
        $this->bcc[$cur][0] = trim($address);
        $this->bcc[$cur][1] = $name;
    }

    function AddReplyTo($address, $name = "") {
    	$address = self::addressToIDN($address);
        $cur = count($this->ReplyTo);
        $this->ReplyTo[$cur][0] = trim($address);
        $this->ReplyTo[$cur][1] = $name;
    }

    function setMode( $mode )
    {
      $this->sendMode = $mode;
    }

         function Send($header = false,$body = false,$charset = 'UTF-8',&$filename = false,$message_id = false, $deleteFile = true) 
    {
    	$this->time = time();
    	if($message_id){
    		$this->message_id = $message_id;
    	}
    	
    	$result = true;
    	if($this->sendMode=='file'){
	    	$filename = $this->prepareMessageTempFile($charset,$filename,$header,$body);
	    	if((count($this->to) + count($this->cc) + count($this->bcc)) < 1){
	    		$this->SetError('no_rcpt',$this->Lang("provide_address"));
	    		return false;
	    	}
	    	$result = $this->sendFromPreparedFile($filename,$deleteFile,false,false,false);
    	}else{
    		if($charset) {
    			$this->setCharset($charset);
    		}
    		if((count($this->to) + count($this->cc) + count($this->bcc)) < 1)
    		{
    			$this->SetError('no_rcpt',$this->Lang("provide_address"));
    			return false;
    		}
    		if(!empty($this->AltBody)){
    			$this->ContentType = "multipart/alternative";
    		}
    		$this->error_count = 0;
    		$this->SetMessageType();
    		
    		$message = "";
    		$filename = false;
    		$fp = false;
    		
    		if (!$header) $this->CreateHeader($fp, $message);
    		else $this->messageOutput($fp,$message,$header . "\r\n");
            $messageFile = false;
    		if (!$body) $this->CreateBody($fp,$messageFile, $message);
    		else $this->messageOutput($fp,$message,$body);
    		
    		if($this->smartAttach){
    			$this->smartAttach();
    		}
    		if($this->EncryptMessage || $this->SignMessage){
    		    $filename = null;
    			$this->encryptAndSign($message, $filename);
    		}
    		
    		switch($this->Mailer)
    		{
    			case "sendmail":
    				$result = $this->SendmailSend($filename, $fp, $message);
    				break;
    			case "mail":
    				$result = $this->MailSend($filename, $fp, $message);
    				break;
    			case "smtp":
    				$result = $this->SmtpSend($filename, $fp, $message);
    				break;
    			default:
    				$this->SetError('mailer_support',$this->Mailer . $this->Lang("mailer_not_supported"));
    				$result = false;
    			break;
    		}
    	}
    	return $result;
    }
    
    function messageOutput(&$fp,&$message,$string)
    {
      if($this->sendMode == 'file'){
        fwrite($fp,$string);
      }else{
        $message.=$string;
      }
    }

    function SendmailSend($filename, &$fp, &$message) {
        if ($this->Sender != "")
            $sendmail = sprintf("%s -oi -f %s -t", $this->Sendmail, $this->Sender);
        else
            $sendmail = sprintf("%s -oi -t", $this->Sendmail);

        if(!@$mail = popen($sendmail, "w"))
        {
            $this->SetError('sendmail_open',$this->Lang("execute") . $this->Sendmail);
            return false;
        }

        if ($this->SignMessage || $this->EncryptMessage)
          $this->encryptAndSign($fp, $filename, $message);
        
        if($this->sendMode == 'file'){
	        fseek($fp,0);
	        while($buffer = fread($fp,16384)){
	        	fputs($mail,$buffer);        	
	        }
        }else{
          fputs($mail,$message);
        }
        
        $result = pclose($mail) >> 8 & 0xFF;
        if($result != 0)
        {
            $this->SetError('sendmail_send',$this->Lang("execute") . $this->Sendmail);
            return false;
        }

        return true;
    }

    function MailSend($filename, &$fp, &$message) {
        $to = "";
        for($i = 0; $i < count($this->to); $i++)
        {
            if($i != 0) { $to .= ", "; }
            $to .= $this->to[$i][0];
        }

        if ($this->SignMessage || $this->EncryptMessage) {
          $this->encryptAndSign($fp,$filename, $message);
        }
          if($this->sendMode == 'file'){
            $message = file_get_contents($filename);
          }
		      $delimiter = strpos($message, "\r\n");
		      $header = substr($message, 0, $delimiter);
		      $body = substr($message, $delimiter);
        

        if ($this->Sender != "" && strlen(ini_get("safe_mode"))< 1)
        {
            $old_from = ini_get("sendmail_from");
            ini_set("sendmail_from", $this->Sender);
            $params = sprintf("-oi -f %s", $this->Sender);
            $rt = @mail($to, $this->EncodeHeader($this->Subject), $body, 
                        $header, $params);
        }
        else
            $rt = @mail($to, $this->EncodeHeader($this->Subject), $body, $header);

        if (isset($old_from))
            ini_set("sendmail_from", $old_from);

        if(!$rt)
        {
            $this->SetError('mail_send',$this->Lang("instantiate"));
            return false;
        }

        return true;
    }

		function SenderDomain() {
			return substr($this->From, strrpos($this->From, '@') + 1);
		}

    function SmtpSend(&$filename,&$fp, &$message) {

        include_once($this->PluginDir . "smtp.php");

        $error = "";
        $bad_rcpt = array();

        if(!$this->SmtpConnect()){
        	return false;
        }

        $smtp_from = ($this->Sender == "") ? $this->From : $this->Sender;
        $smtp_from = $this->addressToIDN($smtp_from);
        
        if(!$this->smtp->Mail($smtp_from))
        {
            $error = $this->Lang("from_failed") . $smtp_from;
            $this->SetSMTPError("from_failed", $smtp_from);
            $this->smtp->Reset();
            return false;
        }
        if($this->rawRecipient){
        	if(!$this->smtp->Recipient($this->addressToIDN($this->rawRecipient))){
        		$bad_rcpt[] = $this->rawRecipient;
				$aErrorMsg[$this->rawRecipient] = slToolsPHP::htmlspecialchars($this->smtp->error['smtp_msg']);
        	}
        }else{
			if (count($this->to)+count($this->cc)+count($this->bcc) > 1){
			  if($this->Port!='25'){
			  	$host = $this->Host.'#'.$this->Port;
			  }else{
			  	$host = $this->Host;
			  }
			  $prefix = $this->relay?("@".$host.":"):"";
			}else
			  $prefix = "";
			
			for($i = 0; $i < count($this->to); $i++)
			{
			    if(!$this->smtp->Recipient($prefix.$this->addressToIDN($this->to[$i][0]))){
			        $bad_rcpt[] = $prefix.$this->to[$i][0];
			        $aErrorMsg[$this->to[$i][0]] = slToolsPHP::htmlspecialchars($this->smtp->error['smtp_msg']);
			    }
			}
			for($i = 0; $i < count($this->cc); $i++)
			{
			    if(!$this->smtp->Recipient($prefix.$this->addressToIDN($this->cc[$i][0]))){
			        $bad_rcpt[] = $prefix.$this->cc[$i][0];
			        $aErrorMsg[$this->cc[$i][0]] = slToolsPHP::htmlspecialchars($this->smtp->error['smtp_msg']);
			    }
			}
			
			for($i = 0; $i < count($this->bcc); $i++)
			{
			    if(!$this->smtp->Recipient($prefix.$this->addressToIDN($this->bcc[$i][0]))){
			        $bad_rcpt[] = $prefix.$this->bcc[$i][0];
			        $aErrorMsg[$this->bcc[$i][0]] = slToolsPHP::htmlspecialchars($this->smtp->error['smtp_msg']);
			    }
			}
        }
        
        
        if(count($bad_rcpt) > 0)
        {
            for($i = 0; $i < count($bad_rcpt); $i++)
            {
                if($i != 0) { $error .= ", "; }
                $error .= $bad_rcpt[$i];
            }
            foreach($aErrorMsg as $key => $msg){
            	$aErrorMsg[$key] = $msg.'('.$key.')';
            }

            $errormsg = implode('<br/>',$aErrorMsg);
            
            $this->SetSMTPError("recipients_failed", $errormsg);
            $this->smtp->Reset();
            return false;
        }

        if(!$this->smtp->Data($filename,$message,$this->sendMode)){
            $error_msg = slToolsPHP::htmlspecialchars($this->smtp->error['smtp_msg']);
            $this->SetSMTPError("data_not_accepted", $error_msg);
            $this->smtp->Reset();
            return false;
        }

        if($this->SMTPKeepAlive == true)
            $this->smtp->Reset();
        else            
            $this->SmtpClose();

        return true;
    }

    function SmtpConnect() 
    {
    	slSystem::import('mail/smtp');
        if($this->smtp == NULL)  $this->smtp = new slSMTP(); 

        $this->smtp->do_debug = $this->SMTPDebug;
        $host = $this->Host.($this->BackupConnections?';'.$this->BackupConnections:'');
        $hosts = explode(";", $host);
        $index = 0;
        $connection = ($this->smtp->Connected()); 

        while($index < count($hosts) && $connection == false){

        	         	if(preg_match('/(\[(.+?)\])(:([0-9]+))?/si',$hosts[$index],$matches)){
        		$host = $matches[1];
        		$port = $matches[3]; 
        	         	}else if(strstr($hosts[$index], ":"))
                list($host, $port) = explode(":", $hosts[$index]);
                         else {
                $host = $hosts[$index];
                $port = $this->Port;
            }
            
            $hostinfo = array();
            if (!preg_match('/^((ssl|tls):\/\/)*([a-zA-Z0-9\.-]*):?([0-9]*)$/', trim($hosts[$index]), $hostinfo)) {
                                 continue;
            }
            $prefix = "";
            $secure = $this->SMTPSecure;
            $tls = ($this->SMTPSecure == 'tls');
            if ('ssl' == $hostinfo[2] or ('' == $hostinfo[2] && 'ssl' == $this->SMTPSecure)) {
                $prefix = 'ssl://';
                $tls = false;                  $secure = 'ssl';
            } elseif ($hostinfo[2] == 'tls') {
                $tls = true;
                                 $secure = 'tls';
            }    
            if($port == 465){
            	$secure = 'ssl';
            	$tls = false;
            	$prefix = 'ssl://';
            }
                         $sslext = defined('OPENSSL_ALGO_SHA1');
            if ('tls' === $secure || 'ssl' === $secure) {
                                 if (!$sslext) {
                                         throw new phpmailerException($this->lang('extension_missing').'openssl', self::STOP_CRITICAL);
                }
            }    
            if($this->smtp->Connect($prefix.$host, $port, $this->Timeout)){
            	
                $this->smtp->Hello($this->ServerHostname());
                                                                                                     if ($this->SMTPAutoTLS && $sslext && $secure != 'ssl' && $this->smtp->getServerExt('STARTTLS')) {
                    $tls = true;
                }
                if ($tls) {
                     if (!$this->smtp->startTLS()) {
                         throw new Exception($this->lang('connect_host'));
                     }
                                           $this->smtp->Hello($this->ServerHostname());
                }        

                if($this->SMTPAuth){
                    if(!$this->smtp->Authenticate($this->Username, 
                                                  $this->Password,
                                                  $this->AuthType)){
                        $this->SetError('smtp_auth',$this->Lang("authenticate"));
                        $this->smtp->Reset();
                        $connection = false;
                    }
                }
                $connection = true;
                return $connection;
            }
            $index++;
        }
        if(!$connection)
            $this->SetError('smtp_connect',$this->Lang("connect_host"));

        return $connection;
    }

     
    function SmtpClose() {
        if($this->smtp != NULL){
            if($this->smtp->Connected()){
                $this->smtp->Quit();
                $this->smtp->Close();
            }
        }
    }

    function SetLanguage($lang_type, $lang_path = "language/") {
        if(file_exists($lang_path.'phpmailer.lang-'.$lang_type.'.php'))
            include($lang_path.'phpmailer.lang-'.$lang_type.'.php');
        else if(file_exists($lang_path.'phpmailer.lang-en.php'))
            include($lang_path.'phpmailer.lang-en.php');
        else {
            $this->SetError('language',"Could not load language file");
            return false;
        }
        global $PHPMAILER_LANG;
        $this->language = $PHPMAILER_LANG;
        return true;
    }
    
    function setRelay($relay)
    {
    	$this->relay = $relay;
    }
    
    function AddrAppend($type, $addr) {
        $addr_str = $type . ": ";
        $addr_str .= $this->AddrFormat($addr[0]);

        if(count($addr) > 1){
            for($i = 1; $i < count($addr); $i++){
            	$addr_str .= ", \r\n\t" . $this->AddrFormat($addr[$i]);
            }
        }
        $addr_str .= $this->LE;

        return $addr_str;
    }

    function AddrFormat($addr,$charset = false) {
        if(empty($addr[1]) || $addr[0]==$addr[1]){
            $formatted = $addr[0];
        }else{
        	$quote = '';
			$quote = preg_match("/(\"|'|;|,|@|<|>|\\\\|\\s)/si",$addr[1])?"\"":"";
			$name = $this->putheader($addr[1],$this->charSet,true,$quote);
			$address = self::addressToIDN($addr[0]);
			$formatted = $quote.$name.$quote. " <" . 
                         $address . ">";
        }

        return $formatted;
    }
    

    function WrapText($message, $length, $qp_mode = false) 
    {	
    	return wordwrap($message,$length);
    }

    function SetWordWrap() 
    {
        if($this->WordWrap < 1)
            return;
            
        switch($this->message_type)
        {
           case "alt":
                          case "alt_attachments":
              $this->AltBody = $this->WrapText($this->AltBody, $this->WordWrap);
              break;
           default:
              $this->Body = $this->WrapText($this->Body, $this->WordWrap);
              break;
        }
    }

    function CreateHeader(&$fp = false, &$message = '') 
    {
        $result = "";
        $this->charSet = 'UTF-8';
        if($this->message_id){
        	$this->last_message_id = $this->message_id;
        	$uniq_id = md5(uniqid(time()));
        }else{
        	$uniq_id = md5(uniqid(time()));
        	$this->last_message_id = sprintf('<%s@%s>',$uniq_id,self::addressToIDN($this->SenderDomain()));
        }
        
        $uniq_id = md5(uniqid(time()));
        $this->boundary[1] = "b1_" . $uniq_id;
        $this->boundary[2] = "b2_" . $uniq_id;
        $this->boundary[3] = "b3_" . $uniq_id;

        $bSingleAttachmentOnly = false;

        if($this->DeferredDelivery){
        	$this->messageOutput($fp,$message,$this->HeaderLine("Deferred-Delivery", $this->DeferredDelivery ));
        	$this->messageOutput($fp,$message,$this->HeaderLine("Date", $this->DeferredDelivery ));
        }else{
        	$this->messageOutput($fp,$message,$this->HeaderLine("Date", $this->RFCDate()));
        }

        $from[0][0] = self::addressToIDN($this->From);
        if($this->Sender == "")
            $this->messageOutput($fp,$message,$this->AddrAppend("Return-Path", $from));
        else
            $this->messageOutput($fp,$message,$this->AddrAppend("Return-Path", array(0=>array(self::addressToIDN($this->Sender)))));

        if($this->Mailer != "mail"){
            if(count($this->to) > 0){
                $this->messageOutput($fp,$message,$this->AddrAppend("To", $this->to));
            } else if (count($this->cc) == 0){
                             	                                               }
            if(count($this->cc) > 0) {
                $this->messageOutput($fp,$message,$this->AddrAppend("Cc", $this->cc));
            }
        }

        $from = array();
        $from[0][0] = trim(self::addressToIDN($this->From));
        $from[0][1] = $this->FromName;
        $this->messageOutput($fp,$message,$this->AddrAppend('From', $from));

        if((($this->Mailer == "sendmail") || ($this->Mailer == "mail")) && (count($this->bcc) > 0))
            $this->messageOutput($fp,$message,$this->AddrAppend("Bcc", $this->bcc));

        if(count($this->ReplyTo) > 0)
            $this->messageOutput($fp,$message,$this->AddrAppend("Reply-to", $this->ReplyTo));

       $this->messageOutput($fp,$message,"Subject: ".$this->putheader($this->Subject,$this->charSet)."\r\n");

        if ($this->XMailer)
					$XMailer = $this->XMailer;
				else
					$XMailer = "PHPMailer [version " . $this->Version . "]";
				
				$this->messageOutput($fp,$message,sprintf("Message-ID: %s%s", $this->last_message_id, $this->LE));

	if ($this->Priority) $this->messageOutput($fp,$message,$this->HeaderLine("X-Priority", $this->Priority));
        $this->messageOutput($fp,$message,$this->HeaderLine("X-Mailer", $XMailer));
        
        if($this->ConfirmReadingTo != "")
            $this->messageOutput($fp,$message,$this->HeaderLine("Disposition-Notification-To", 
                       "<" . trim($this->ConfirmReadingTo) . ">"));
        
        $encodeHeaders = array(
        		'x-confirm-reading-to',
        		'disposition-notification-to'
        );
        
        
        for($index = 0; $index < count($this->CustomHeader); $index++){
        	$this->CustomHeader[$index][1] = $this->removeMoreNewLines($this->CustomHeader[$index][1]);
        	if(in_array(strtolower($this->CustomHeader[$index][0]),$encodeHeaders)){
        		slSystem::import('mail/parse');
        		$addresses = slMailParse::parseAddresses($this->CustomHeader[$index][1]);
        		$xheaders = array();
        		$xheader = array();
        		foreach($addresses as $addr){
        			$xheader[1] = $addr['display'];
        			$xheader[0] = $addr['address'];
        			$xheaders[] = $xheader;
        		}
        		$this->messageOutput(
        				$fp,
        				$message,
        				$this->AddrAppend($this->CustomHeader[$index][0],$xheaders)
        		);
        	}else{
        		$this->messageOutput(
        				$fp,
        				$message,
        				$this->HeaderLine(
        						trim($this->CustomHeader[$index][0]),
        						trim($this->CustomHeader[$index][1])
        				)
        		);
        	}
        	
        }
        
        $this->messageOutput($fp,$message,$this->HeaderLine("MIME-Version", "1.0"));
        if($this->iMIP){
        	$this->createIMIPHeader($fp);
        }else{
	        switch($this->message_type)
	        {
	            case "plain":
	                $this->messageOutput($fp,$message,$this->HeaderLine("Content-Transfer-Encoding", $this->Encoding));
	                $this->messageOutput($fp,$message,sprintf("Content-Type: %s; charset=%s",
	                                    $this->ContentType, $this->charSet));
	                break;
	            case "attachments":
	                 	            case "alt_attachments":

	                if($this->InlineImageExists()){
	                	
	                	if($this->NormalAttachmentExists()){
	                		$this->messageOutput($fp,$message,sprintf("Content-Type: %s;%s\tboundary=\"%s\"%s", 
	                                    "multipart/mixed", $this->LE, $this->boundary[3], $this->LE.$this->LE));
	                		$this->messageOutput($fp,$message,"--".$this->boundary[3].$this->LE);   
	                		$this->messageOutput($fp,$message,sprintf("Content-Type: %s;%s\ttype=\"text/html\";%s\tboundary=\"%s\"%s", 
	                                    "multipart/related", $this->LE, $this->LE, 
	                                    $this->boundary[1], $this->LE));
	                	}else{
	                    	$this->messageOutput($fp,$message,sprintf("Content-Type: %s;%s\ttype=\"text/html\";%s\tboundary=\"%s\"%s", 
	                                    "multipart/related", $this->LE, $this->LE, 
	                                    $this->boundary[1], $this->LE));
	                	}
	                }
	                else {
	                      $this->messageOutput($fp,$message,$this->HeaderLine("Content-Type", "multipart/mixed;"));
	                      $this->messageOutput($fp,$message,$this->TextLine("\tboundary=\"" . $this->boundary[1] . '"'));

	                }
	                break;
	            case "alt":
	                $this->messageOutput($fp,$message,$this->HeaderLine("Content-Type", "multipart/alternative;"));
	                $this->messageOutput($fp,$message,$this->TextLine("\tboundary=\"" . $this->boundary[1] . '"'));
	                break;
	        }
        }
        if($this->Mailer != "mail" )
            $this->messageOutput($fp,$message,$this->LE.$this->LE);

        return true;
    }
    
    function CreateBody(&$fp = false,$filename = false, &$message = '',$smarter_smart = true) {
        $result = "";
        $this->charSet = 'UTF-8';
        $this->SetWordWrap();
		$this->Body = $this->fixMSWord($this->Body);
		$this->Body = slToolsCharset::my_iconv('utf-8',$this->charSet.'//IGNORE',$this->Body);
		$this->AltBody = slToolsCharset::my_iconv('utf-8',$this->charSet.'//IGNORE',$this->AltBody);

		if($this->iMIP){
			$this->createIMIPBody($fp,$filename,$this->Body);
		}else{
			 
	        switch($this->message_type)
	        {
	            case "alt":
	            	   
	                $this->messageOutput($fp,$message,$this->GetBoundary($this->boundary[1], "", 
	                                              "text/plain", ""));
	                $this->messageOutput($fp,$message,$this->EncodeString($this->AltBody, $this->Encoding));
	                $this->messageOutput($fp,$message,$this->LE.$this->LE);
	                $this->messageOutput($fp,$message,$this->GetBoundary($this->boundary[1], "", 
	                                              "text/html", ""));
	                $this->messageOutput($fp,$message,$this->EncodeString($this->Body, $this->Encoding));
	                
	                $this->messageOutput($fp,$message,$this->LE.$this->LE);
	    
	                $this->messageOutput($fp,$message,$this->EndBoundary($this->boundary[1]));
	                
	                break;
	            case "plain":
	                $this->messageOutput($fp,$message,$this->EncodeString($this->Body, $this->Encoding));
	                break;
	            case "attachments":
	                 	                  $this->messageOutput($fp,$message,$this->GetBoundary($this->boundary[1], "", "", ""));
	                  $this->messageOutput($fp,$message,$this->EncodeString($this->Body, $this->Encoding));
	                  $this->messageOutput($fp,$message,$this->LE);
	                 	               
	                $this->AttachAll($fp,$filename, $message,false,$smarter_smart);
	                
	                break;
	            case "alt_attachments":
	                $this->messageOutput($fp,$message,sprintf("--%s%s", $this->boundary[1], $this->LE));
	                $this->messageOutput($fp,$message,sprintf("Content-Type: %s;%s" .
	                                   "\tboundary=\"%s\"%s",
	                                   "multipart/alternative", $this->LE, 
	                                   $this->boundary[2], $this->LE.$this->LE));
	    
	                 	                $this->messageOutput($fp,$message,$this->GetBoundary($this->boundary[2], "", 
	                                              "text/plain", "") . $this->LE);
	
	                $this->messageOutput($fp,$message,$this->EncodeString($this->AltBody, $this->Encoding));
	                $this->messageOutput($fp,$message,$this->LE.$this->LE);
	    
	                 	                $this->messageOutput($fp,$message,$this->GetBoundary($this->boundary[2], "", 
	                                              "text/html", "") . $this->LE);
	    
	                $this->messageOutput($fp,$message,$this->EncodeString($this->Body, $this->Encoding));
	                $this->messageOutput($fp,$message,$this->LE.$this->LE);
	
	                $this->messageOutput($fp,$message,$this->EndBoundary($this->boundary[2]));
	               	
	                
					if($this->InlineImageExists()){
						$this->AttachAll($fp,$filename, $message,false,$smarter_smart,'inline');
						 						if($this->NormalAttachmentExists()){
		               		$this->AttachAll($fp,$filename, $message,$this->boundary[3],$smarter_smart,'normal');
						}
	                	 	                	$this->messageOutput($fp,$message,sprintf("--%s--%s", $this->boundary[3], $this->LE));
					}else{
						$this->AttachAll($fp,$filename, $message,false,$smarter_smart);
					}
	                break;
	        }
		}
        if($this->IsError())
            return false;

        return true;
    }
    public function createIMIPBody(&$fp,$filename,$localBody)
    {
        $message = null;
    	switch($this->message_type){
    		case "attachments":
    			fwrite($fp,$this->GetBoundary($this->boundary[1], "", "", ""));
    			fwrite($fp,$this->EncodeString($localBody, $this->Encoding));
    			fwrite($fp,$this->LE);
    
    			$this->AttachAll($fp,$filename, $message);
    
    			fwrite($fp,$this->EndBoundary($this->boundary[1]));
    			break;
    		case "alt_attachments":
    
    			 
    
    			     			fwrite($fp,$this->GetBoundary($this->boundary[1], "",
    			"text/plain", "") . $this->LE);
    
    			fwrite($fp,$this->EncodeString($this->AltBody, $this->Encoding));
    			fwrite($fp,$this->LE.$this->LE);
    
    			     			fwrite($fp,$this->GetBoundary($this->boundary[1], "",
    					"text/html", "") . $this->LE);
    
    			fwrite($fp,$this->EncodeString($localBody, $this->Encoding));
    			fwrite($fp,$this->LE.$this->LE);
    
    			$this->AttachAll($fp,$filename,$message,$this->boundary[1]);
    
    			     			fwrite($fp,$this->EndBoundary($this->boundary[1]));
    			break;
    	}
    }
    
    public function createIMIPHeader(&$fp)
    {
    	switch($this->message_type)
    	{
    		case 'attachments':
    		case 'alt_attachments':
    			fwrite($fp,$this->HeaderLine("Content-Type", "multipart/alternative;"));
    			fwrite($fp,$this->TextLine("\tboundary=\"" . $this->boundary[1] . '"'));
    			break;
    	}
    }
    
    function GetBoundary($boundary, $charSet, $contentType, $encoding) {
        $result = "";
        if($charSet == "") { $charSet = $this->charSet; }
        if($contentType == "") { $contentType = $this->ContentType; }
        if($encoding == "") { $encoding = $this->Encoding; }

        $result .= $this->TextLine("--" . $boundary);
        $result .= sprintf("Content-Type: %s; charset=%s", 
                            $contentType, $charSet);
        $result .= $this->LE;
        $result .= $this->HeaderLine("Content-Transfer-Encoding", $encoding);
        $result .= $this->LE;
       
        return $result;
    }

    function EndBoundary($boundary) 
    {
        return $this->LE . "--" . $boundary . "--" . $this->LE; 
    }

    function SetMessageType() 
    {
        if(count($this->attachment) < 1 && strlen($this->AltBody) < 1)
            $this->message_type = "plain";
        else {
            if(count($this->attachment) > 0)
                $this->message_type = "attachments";
            if(strlen($this->AltBody) > 0 && count($this->attachment) < 1)
                $this->message_type = "alt";
            if(strlen($this->AltBody) > 0 && count($this->attachment) > 0)
                $this->message_type = "alt_attachments";
        }
    }

    function HeaderLine($name, $value) {
        return $name . ": " . $value . $this->LE;
    }

    function TextLine($value) {
        return $value . $this->LE;
    }

    function AddAttachment($path, $type = "application/octet-stream", $name = "", $encoding = "base64",$method = false, $encode = true, $dummy = false, $smart_params = false) {

        if(!@is_file($path)){
            $this->SetError('add_attachment',$this->Lang("file_access") . $path);
            return false;
        }
        
        $filename = basename($path);
    
        if($name == "")
            $name = $filename;

        $cur = count($this->attachment);
        $this->attachment[$cur][0] = $path;
        $this->attachment[$cur][1] = $filename;
        $this->attachment[$cur][2] = $name;
        $this->attachment[$cur][3] = $encoding;
        $this->attachment[$cur][4] = $type;
        $this->attachment[$cur][5] = false;          $this->attachment[$cur][6] = "attachment";
        $this->attachment[$cur][7] = 0;
        $this->attachment[$cur][8] = $encode;
        $this->attachment[$cur][9] = $method;
        $this->attachment[$cur][10] = $dummy;
        $this->attachment[$cur][11] = $this->SmartAttach;
        $this->attachment[$cur][12] = $smart_params;

        return true;
    }

    function AttachAll(&$fp = false,$messageFile = false, &$message, $boundary = false,$smarter_smart = true, $attachmenttype = 'all') 
    {
        $mime = array();
        if(!$boundary){       	
        	$boundary = $this->boundary[1];
        }

        for($i = 0; $i < count($this->attachment); $i++)
        {
        	
            $bString = $this->attachment[$i][5];
            if ($bString)
                $string = $this->attachment[$i][0];
            else
                $path = $this->attachment[$i][0];

            $filename    = $this->attachment[$i][1];
            $name        = $this->attachment[$i][2];
            $encoding    = $this->attachment[$i][3];
            $type        = $this->attachment[$i][4];
            $disposition = $this->attachment[$i][6];
            $cid         = $this->attachment[$i][7];
            $encode      = $this->attachment[$i][8];
            $method      = $this->attachment[$i][9];
            $dummy       = $this->attachment[$i][10];
            $smart_attach= $this->attachment[$i][11];
            $smart_params   = $this->attachment[$i][12];

            $charset      = "UTF-8";
            
       		if($attachmenttype=='inline'){
            	if($disposition!='inline'){
            		continue;
            	}
            }
        	if($attachmenttype=='normal'){
            	if($disposition=='inline'){
            		continue;
            	}
            }
            
	                       if (slToolsString::isabovechar($name)){
              slSystem::import('tools/charset');
              $name = "=?" . strtoupper($this->charSet) . "?Q?" .$this->converttoquoted(slToolsCharset::my_iconv('UTF-8', $this->charSet . '//IGNORE', $name)) . "?=";
            }
                                      $this->messageOutput($fp,$message,sprintf("--%s%s", $boundary, $this->LE));
            
            $sHead = "Content-Type: %s; name=\"%s\";";
            if($charset) $sHead.= " charset=\"".$charset."\";";
            if($method) $sHead.= " method=".$method;
            if($dummy){
            	$sHead.= "; dummyimg=true";
            }
            $sHead.="%s";
            
            $this->messageOutput($fp,$message,sprintf($sHead, $type, $name, $this->LE, $this->LE));
            
            if($smarter_smart && $smart_attach && $disposition != "inline" && $type!='message/rfc822'){
            	$key = $this->SmartAttachKey;
            	if($smart_params){
 					$hash = md5($key.$smart_params['url']);
 					$encoded_url = '=?UTF-8?B?'.base64_encode($smart_params['url']).'?=';
 					$encoded_zipid = '=?UTF-8?B?'.base64_encode($smart_params['zipid']).'?=';
 					
 					$this->messageOutput($fp,$message,"X-IceWarp-SmartAttach: url=\"".$encoded_url."\"; zipid=\"".$encoded_zipid."\"; size=\"".$smart_params['size']."\"; hash=\"".$hash."\"; algorithm=\"MD5\"".$this->LE.$this->LE);
            	}else{
            		$hash = md5($key.$path);
            		$encoded_path = '=?UTF-8?B?'.base64_encode($path).'?=';
            
            		$this->messageOutput($fp,$message,"X-IceWarp-SmartAttach: path=\"".$encoded_path."\"; copy=1; hash=\"".$hash."\"; algorithm=\"MD5\"".$this->LE.$this->LE);
            	}
            	continue;
            }
            if($encode) $this->messageOutput($fp,$message,sprintf("Content-Transfer-Encoding: %s%s", $encoding, $this->LE));

            if($disposition == "inline")
                $this->messageOutput($fp,$message,sprintf("Content-ID: <%s>%s", $cid, $this->LE));
            if(!$this->iMIP){
                 $this->messageOutput($fp,$message,sprintf("Content-Disposition: %s; filename=\"%s\"%s", 
                              $disposition, $name, $this->LE.$this->LE));
            }else{
            	$this->messageOutput($fp,$message,$this->LE.$this->LE);
            }
            if($bString){
                if ($encode) $this->messageOutput($fp,$message,$this->EncodeString($string, $encoding));
                else         $this->messageOutput($fp,$message,$string);
                
                if($this->IsError()) { return ""; }
                $this->messageOutput($fp,$message,$this->LE.$this->LE);
            } else {                             
                $this->EncodeFile($fp,$messageFile,$message, $path, $encoding,$encode);
                if($this->IsError()) { return ""; }
                $this->messageOutput($fp,$message,$this->LE.$this->LE);
            }
        }
        $this->messageOutput($fp,$message,sprintf("--%s--%s", $boundary, $this->LE));
        
        return true;
    }

    function EncodeFile (&$fp,$filename,$message, $path, $encoding = "base64",$encode = true) 
    {
    	
        if($encode){
          if($this->sendMode == 'file'){
            $newFile = slToolsFilesystem::randomFilename($this->getTempDir());
            
            fclose($fp);
            switch($encoding){
	          	case 'base64':
	          		if(defined('IW_DISABLED') && IW_DISABLED){
	          			file_put_contents($newFile,base64_encode(file_get_contents($path)));
	          		}else{
	          			icewarp_base64_encode_file($path,$newFile);

	          			$api = IceWarpAPI::instance('Shared/PHPMailer');
	          			$api->CacheFileWithUpdate($newFile);
	          		}
	          	break;
	          	case 'quoted-printable':
	          	default:
	          		file_put_contents($newFile,file_get_contents($path));
	          		break;
	          }
            
            $fp = fopen($filename,"ab");
            
            if(!$fd = fopen($newFile, "rb")){
              $this->SetError('encode_file',$this->Lang("file_open") . $path);
              return "";
            }

            while($buffer = fread($fd,4096)){
            	if($this->Encoding=='quoted-printable' && $encoding!='base64')
            		$buffer = $this->EncodeQP($buffer);
              
              fwrite($fp,$buffer);
            }
            
            fclose($fd);
            if(defined('IW_DISABLED') && IW_DISABLED){
            	unlink($newFile);
            }else{
            	slSystem::import('tools/icewarp');
            	slToolsIcewarp::iw_delete($newFile);
            }
          }else{
             $message = base64_encode(file_get_contents($path));
          }
        }else{
          if($this->sendMode == 'file'){
            $fd = fopen($path, "rb");
            while($buffer = fread($fd,4096))
              fwrite($fp,$buffer);
            fclose($fd);
          }else{
            $message = file_get_contents($path);
          }
        }

        return true;
    }

    function EncodeString ($str, $encoding = "base64") 
    {
        switch(strtolower($encoding)) {
          case "base64":
                             $str = chunk_split(base64_encode($str), 76, $this->LE);
              break;
          case "7bit":
          case "8bit":
              $str = $this->FixEOL($str);
              if (substr($str, -(strlen($this->LE))) != $this->LE)
                $str .= $this->LE;
              break;
          case "binary":
              $encoded = $str;
              break;
          case "quoted-printable":
              $str = $this->EncodeQP($str);
              break;
          default:
              $this->SetError('encode_unknown',$this->Lang("encoding") . $encoding);
              break;
        }
        return $str;
    }

    function EncodeHeader ($str, $position = 'text') 
    {
      $x = 0;
      switch (strtolower($position)) {
        case 'phrase':
          if (!preg_match('/[\200-\377]/', $str)) {
            $encoded = addcslashes($str, "\0..\37\177\\\"");

            if (($str == $encoded) && !preg_match('/[^A-Za-z0-9!#$%&\'*+\/=?^_`{|}~ -]/', $str))
              return ($encoded);
            else
              return ("\"$encoded\"");
          }
          $x = preg_match_all('/[^\040\041\043-\133\135-\176]/', $str, $matches);
          break;
        case 'comment':
          $x = preg_match_all('/[()"]/', $str, $matches);
        case 'text':
        default:
          $x += preg_match_all('/[\000-\010\013\014\016-\037\177-\377]/', $str, $matches);
          break;
      }

      if ($x == 0)
        return ($str);

      $maxlen = 75 - 7 - strlen($this->charSet);

      if (strlen($str)/3 < $x) {
        $encoding = 'B';
        $encoded = base64_encode($str);
        $maxlen -= $maxlen % 4;
        $encoded = trim(chunk_split($encoded, $maxlen, "\r\n"));
        
      } else {
        $encoding = 'Q';
        $encoded = $this->EncodeQP($str);
        
        $encoded = str_replace("=".$this->LE, "\r\n", trim($encoded));
      }

      $encoded = preg_replace('/^(.*)$/m', " =?".$this->charSet."?$encoding?\\1?=", $encoded);
      $encoded = trim(str_replace("\r\n", $this->LE, $encoded));
      
      return $encoded;
    }

    function EncodeQP($str,$is_header = false,$charset = 'UTF-8') 
    {
    	if(!defined('PHP_QPRINT_MAXL')) define('PHP_QPRINT_MAXL', $is_header ? (75 - strlen("?=\r\n\t=?" . $charset . "?Q?")) : 75);
    	$result = icewarp_quoted_printable_encode($str);
    	if($is_header){
    		$result = str_replace("=\r\n","?=\r\n\t=?".$charset."?Q?",$result);
    	}
    	return $result;
    }

    function EncodeQ($str, $position = "text", $mycharset = '')
    {
        $encoded = preg_replace("[\r\n]", "", $str);

        switch (strtolower($position)) {
          case "phrase":
            $encoded = preg_replace_callback("/([^A-Za-z0-9!*+\/ -])/", array($this, 'EncodeQ_preg_replace_callback'), $encoded);
            break;
          case "comment":
            $encoded = preg_replace_callback("/([\(\)\"])/", array($this, 'EncodeQ_preg_replace_callback'), $encoded);
          case "text":
          default:
            $encoded = preg_replace_callback('/([\000-\011\013\014\016-\037\075\077\137\177-\377])/', array($this, 'EncodeQ_preg_replace_callback'), $encoded);
            break;
        }

        $encoded = str_replace(" ", "_", $encoded);

        return $encoded;
    }

    private function EncodeQ_preg_replace_callback($matches) {
        return '=' . sprintf('%02X', ord($matches[1]));
    }

    function AddStringAttachment($string, $filename, $encoding = "base64", $type = "application/octet-stream", $encode = true, $content_id = false, $smart_params = false) 
    {
        if(strtolower($type) == 'message/rfc822') $encode = false;

        $cur = count($this->attachment);
        $this->attachment[$cur][0] = $string;
        $this->attachment[$cur][1] = $filename;
        $this->attachment[$cur][2] = $filename;
        $this->attachment[$cur][3] = $encoding;
        $this->attachment[$cur][4] = $type;
        $this->attachment[$cur][5] = true;
        $this->attachment[$cur][8] = $encode;
		if ($content_id){
			$this->attachment[$cur][6] = "inline";
	        $this->attachment[$cur][7] = $content_id;
		} else {
			$this->attachment[$cur][6] = "attachment";
	        $this->attachment[$cur][7] = 0;
		}
        $this->attachment[$cur][11] = $this->SmartAttach;
		if($smart_params){
			$this->attachment[$cur][12] = $smart_params;
		}
    }

    function AddEmbeddedImage($path, $cid, $name = "", $encoding = "base64", 
                              $type = "application/octet-stream") 
    {
    
        if(!@is_file($path)){
            $this->SetError('add_attachment',$this->Lang("file_access") . $path);
            return false;
        }

        $filename = $path;
        if($name == "")
            $name = basename($filename);

        $cur = count($this->attachment);
        $this->attachment[$cur][0] = $path;
        $this->attachment[$cur][1] = $filename;
        $this->attachment[$cur][2] = $name;
        $this->attachment[$cur][3] = $encoding;
        $this->attachment[$cur][4] = $type;
        $this->attachment[$cur][5] = false;
        $this->attachment[$cur][6] = "inline";
        $this->attachment[$cur][7] = $cid;
        $this->attachment[$cur][8] = true;
        return true;
    }

    function InlineImageExists() 
    {
        $result = false;
        for($i = 0; $i < count($this->attachment); $i++){
            if($this->attachment[$i][6] == "inline"){
                $result = true;
                break;
            }
        }
        
        return $result;
    }
    
	function NormalAttachmentExists() 
    {
        $result = false;
        for($i = 0; $i < count($this->attachment); $i++){
            if($this->attachment[$i][6] != "inline"){
                $result = true;
                break;
            }
        }
        
        return $result;
    }

    function ClearAddresses() 
    {
        $this->to = array();
    }

    function ClearCCs() 
    {
        $this->cc = array();
    }

    function ClearBCCs() 
    {
        $this->bcc = array();
    }

    function ClearReplyTos() 
    {
        $this->ReplyTo = array();
    }

    function ClearAllRecipients() 
    {
        $this->to = array();
        $this->cc = array();
        $this->bcc = array();
    }

    function ClearAttachments() 
    {
        $this->attachment = array();
    }

    function ClearCustomHeaders() 
    {
        $this->CustomHeader = array();
    }

    function SetError($type,$msg) 
    {   
        throw new Exception('phpmailer_'.$type);
    }

    function SetSMTPError($type, $msg) 
    {
        throw new Exception('SMTP_'.$type);
    }

    function RFCDate() 
    {
    	if(isset($this->RFCDate)){
    		return $this->RFCDate;
    	}
        $tz = date("Z");
        $tzs = ($tz < 0) ? "-" : "+";
        $tz = abs($tz);
        $tz = ($tz/3600)*100 + ($tz%3600)/60;
        if(date("Z")==0){
        	$time = time() + $_SESSION['TIMEZONE'];
        }else{
        	$time = time();
        }
        $result = sprintf("%s %s%04d", date("D, j M Y H:i:s",$time), $tzs, $tz);
        return $result;
    }
    

    function ServerVar($varName) 
    {
        global $HTTP_SERVER_VARS;
        global $HTTP_ENV_VARS;

        if(!isset($_SERVER))
        {
            $_SERVER = $HTTP_SERVER_VARS;
            if(!isset($_SERVER["REMOTE_ADDR"]))
                $_SERVER = $HTTP_ENV_VARS;          }
        
        if(isset($_SERVER[$varName]))
            return $_SERVER[$varName];
        else
            return "";
    }

    function ServerHostname() 
    {
        if ($this->Hostname != "")
            $result = $this->Hostname;
        elseif ($this->ServerVar('SERVER_NAME') != "")
            $result = $this->ServerVar('SERVER_NAME');
        else
            $result = "localhost.localdomain";

        return $result;
    }

    function Lang($key) 
    {
        $this->PluginDir = SHAREDLIB_PATH.'mail/';
        if(count($this->language) < 1)
            $this->SetLanguage("en", $this->PluginDir . 'language/');
    
        if(isset($this->language[$key]))
            return $this->language[$key];
        else
            return "Language string failed to load: " . $key;
    }

    function IsError() 
    {
        return ($this->error_count > 0);
    }

    function FixEOL($str) 
    {
         return $str;
    }

    function AddCustomHeader($custom_header) 
    {
        $this->CustomHeader[] = explode(":", $custom_header, 2);
    }
    
    public function fixMSWord($string,$text = false){
    	$quot = ($this->ContentType=='text/plain' || $text)?'"':'&quot;';
    	$apos = ($this->ContentType=='text/plain' || $text)?'\'':'&apos;';
    	     	     	return $string;
    }
    
         public function putheader($header, $mycharset = "", $emails = false, $quote = '')
    {
        $header = $this->fixMSWord($header,true);
        if ($mycharset != 'UTF-8') $mycharset = 'UTF-8';           $fheader = trim($header);

        if (!slToolsString::isabovechar($fheader)) return $fheader;
        if($emails && strpos($fheader,">")) {
            $arr = explode(">",$header);
            $out2 = null;
            foreach($arr as $val) {
                if(!strlen($val)) continue;
                unset($val2);
                if(($spos = strpos($val,"<"))>-1) $val .='>';
                if (!preg_match("/(.*)(<.*[^>]*>)/i",$val,$val2)) $val2[1]=$val;

                $val2[1]=preg_replace("/^[,;]/","",trim($val2[1]));

                if(slToolsString::isabovechar($val2[1])){
                    if($this->mime_encode_base64){
                        $out2 .= "=?" . strtoupper($mycharset) . "?B?" .base64_encode($val2[1]) . "?=";
                    }else{
                        $out2 .= "=?" . strtoupper($mycharset) . "?Q?" .$this->EncodeQ($val2[1],true,$mycharset) . "?=";
                    }
                }else{
                    $out2 .= $val2[1];
                }
                if($val2[2]) $out2 .= ' '.$val2[2].";";
            }

            if(isset($out2)) $out = $val2[2]?substr($out2,0,-1):$out2;
        } else {
            if($this->mime_encode_base64){
                $out = "=?" . strtoupper($mycharset) . "?B?" .base64_encode($fheader) . "?=";
            }else{
                $out = "=?" . strtoupper($mycharset) . "?Q?" .$this->EncodeQ($fheader,true,$mycharset) . "?=";
            }

        }
        return $out;
  }

  static function converttoquoted($string)
  {

    $converted = "";
    $strlen = strlen($string);
    
    for ($i = 0; $i < $strlen; $i++) {
                if ((ord($string[$i]) > 127) || ($string[$i] == "_") || ($string[$i] == "=") || ($string[$i]=="?")|| ($string[$i]==",") || ($string[$i]==">")|| ($string[$i]=="<")|| ($string[$i]=="@")|| ($string[$i]=="\"")|| ($string[$i]=="'") || (ord($string[$i]) < 32))
    	                        $converted .= "=" .

self::fillstr(strtoupper(dechex(ord($string[$i]))), 2, "0");
                else
                        $converted .= $string[$i];
        }
         $converted = str_replace(" ","_",$converted);
    
    
    return $converted;
  }
  
  
  function isabovechar($string)
  {
    for ($i = 0; $i < strlen($string); $i++) if (ord($string[$i]) > 127) { return true; }
    return false;
  }
   
  
  static function fillstr($str, $size, $char)
{
    if (strlen($str) > $size) return substr($str, 0, $size);

    $value = $str;
    for ($i = strlen($str); $i < $size; $i++) {
        $value = $char . $value;
    }

    return $value;
}

	public function setTempDir($dir)
	{
		$this->tempDir = $dir;
	}
	
	public function getTempDir()
	{
		return $this->tempDir;
	}
	
	public function setTempFile($file)
	{
		$this->tempFile = $file;
	}
	
	public function getTempFile()
	{
		return $this->tempFile;
	}
	
	public function smartAttach($filename = null)
	{
	    $api = IceWarpAPI::instance('Shared/PHPMailer');
		$api->SmartAttach(
				$filename,
				$this->SmartAttachAccount,
				$this->SmartAttachExpiration,
				$this->SmartAttachAnnonymous,
				$this->SmartAttachParams
		);
	}
	
	function removeMoreNewLines($str)
	{
		while(strpos($str,"\r\n\r\n") || strpos($str,"\n\n") || strpos($str,"\r\r")){
			$str = str_replace(
					array("\r\n\r\n","\n\n","\r\r"),
					array("\r\n","\n","\r"),
					$str
			);
		}
		return $str;
	}
	function encryptAndSign(&$fp, &$filename, $message = null)
	{
		 	}
	
	function sendSMS($recipientList, $html = false)
	{
		 	}

	
	static public function addressToIDN($address)
	{
		$domain = strpos($address,'@')===false;
		if(slToolsString::isabovechar($address)){
			$api = IceWarpAPI::instance('SharedLib');
			if($domain){
				$address = $api->UTF8ToIDN($address);
			}else{
				if($address){
					$address = explode('@',$address);
					$address[1] = $api->UTF8ToIDN($address[1]);
					$address = join('@',$address);
				}
			}
		}
		return $address;
	}
	
	static public function addressToUTF8($address)
	{
		$domain = strpos($address,'@')===false;
		if(!slToolsString::isabovechar($address)){
			$api = IceWarpAPI::instance('SharedLib');
			if($domain){
				$address = $api->IDNToUTF8($address);
			}else{
				if($address){
					$address = explode('@',$address);
					$address[1] = $api->IDNToUTF8($address[1]);
					$address = join('@',$address);
				}
			}
		}
		return $address;
	}
	
	public function prepareMessageTempFile($charset = 'UTF-8', $messageFile = false, $header = false, $body = false)
	{
		$this->time = time();
		$result = true;
	
		if($charset){
			$this->setCharset($charset);
		}
	
		if(!empty($this->AltBody)){
			$this->ContentType = "multipart/alternative";
		}
		$this->error_count = 0;
	
		$this->SetMessageType();
	
		if(!$messageFile){
			$messageFile = slToolsFilesystem::randomFileName($this->getTempDir());
		}
	
		if(!is_dir(dirname($messageFile))){
			slToolsFilesystem::mkdir_r(dirname($messageFile),0777,true);
		}
		$fp = fopen($messageFile,'wb+');
	
		if (!$header){
			$this->CreateHeader($fp);
			
		}else{
			fwrite($fp,$header . "\r\n");
		}
		if ($body){
			fwrite($fp,$body);
		}else{
			$this->CreateBody($fp,$messageFile);
		}
		@fclose($fp);
		
		 		if ($this->SmartAttach)
			$this->smartAttach($messageFile);
			
	    $api = IceWarpAPI::instance('Shared/PHPMailer');
		$api->CacheFileWithUpdate($messageFile);
	
		return $messageFile;
	}
	
	public function sendFromPreparedFile($filename,$deleteFile = true, $header = false,$body = false,$preservePrepared = true)
	{
        $message = '';
		slSystem::import('tools/filesystem');
		$tempFile = slToolsFilesystem::randomFilename($this->getTempDir());
		if($preservePrepared){
	
			slSystem::import('tools/icewarp');
			slToolsIcewarp::iw_copy($filename,$tempFile);
			$variable = 'tempFile';
		}else{
			$variable = 'filename';
		}
		switch($this->Mailer){
			case "sendmail":
				if(!$header && !$body){
					$data = file_get_contents($$variable);
					$header = substr($data,0,strpos("\r\n\r\n",$data));
					$body = substr($data,strpos("\r\n\r\n",$data)+4);
					unset($data);
				}
				$result = $this->SendmailSend($header, $body, $message);
				break;
			case "mail":
				if(!$header && !$body){
					$data = file_get_contents($$variable);
					$header = substr($data,0,strpos("\r\n\r\n",$data));
					$body = substr($data,strpos("\r\n\r\n",$data)+4);
					unset($data);
				}
				$result = $this->MailSend($header, $body, $message);
				break;
			case "smtp":
				if ($this->SignMessage || $this->EncryptMessage){
					$fp = fopen($$variable,'rw+');
					$this->encryptAndSign($fp,$$variable);
				}
				$result = $this->SmtpSend($$variable,$fp,$message);
				@fclose($fp);
				if($deleteFile){
					slSystem::import('tools/icewarp');
					@slToolsIcewarp::iw_delete($$variable);
				}
				if(!$preservePrepared){
					slSystem::import('tools/icewarp');
					@slToolsIcewarp::iw_delete($filename);
				}
				break;
			default:
				$this->SetError('mailer_support',$this->Mailer . $this->Lang("mailer_not_supported"));
			$result = false;
			break;
		}
		return $result;
	}
	
}

?>