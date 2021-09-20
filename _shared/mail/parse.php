<?php

slSystem::import('tools/charset');
slSystem::import('tools/string');
slSystem::import('tools/filesystem');
slSystem::import('tools/icewarp');
slSystem::import('tools/php');

 
class slMailParse 
{
	 
	public $mail;
	static public $class;
	 
	private $sMimeMessage;

	 
	public $message;

	 
	private $parts;

	 
	private $ids;
	
	static public $defaultCharset = 'UTF-8'; 
	
	private $tempDir = '';
	
	public $personalCertificates;
	public $publicCertificates;
	
	public $block_external;
	public $blocked;
	public $download;
	public $partIDChange;
	public $aUUAttachments;

	public $file;
	public $uid;
	public $originalParts;
	public $partPointer;
	public $startPart;
	public $decodeMime;
	public $attIdPrefix;
	public $rawhtml;
	public $addHtmlLinks;
	public $PassPhrase;
	public $aUUEncodedContent;
	public $parsed;
	public $aResult;
	public $rfc822Message;
	public $rfc822Parser;
	public $aParts;
	public $noCID;
	public $isCID;
	public $attachmentFile;
	protected $purify;

	 
	public function __construct($file = '',$ids = array(), $decodeMime = false, $attIdPrefix = '',$partID = '1',$fromString = '', $purify = true)
	{
		$t = time();
		$m = microtime();
		self::$class = get_class($this);
		
		 		if(!$file){
			if(!$fromString)
				throw new Exception('mailparse_empty');
			else{
				$this->mail = mailparse_msg_create();
				mailparse_msg_parse($this->mail,$fromString);
				$this->message = $fromString;
			}
		} else{
			if(!@$this->mail = mailparse_msg_parse_file($file)){
				$e = new Exception('mailparse_parser_init');
				$e->wmmessage = $file;
				throw $e;
			}
			$this->file = $file;
		}
		$this->uid = slSystem::uniqueID();
		$this->originalParts = mailparse_msg_get_structure($this->mail);
		 		 		if ($this->originalParts) foreach($this->originalParts as $part){
			$cursor = &$this->parts;
			$hierarchy = explode(".",$part);
			if(is_array($hierarchy)) foreach($hierarchy as $id){
				if(!isset($cursor[$id])) $cursor[$id] = array();
				$cursor = &$cursor[$id];
			}
			$this->partPointer[$part] = &$cursor;
		}
		$this->startPart = $partID;

		$this->ids = $ids;

		$this->decodeMime = $decodeMime;
		$this->attIdPrefix = $attIdPrefix;		
		if(!$this->startPart) $this->startPart = 1;
		$this->purify = $purify;
	}
	
	public function __destruct()
	{
		mailparse_msg_free($this->mail);
	}
	
	public function parse($noCID = false, $rawhtml = false, $addHtmlLinks = false)
	{
		$this->rawhtml = $rawhtml;
		$this->addHtmlLinks = $addHtmlLinks;
		 		if(($pos = strpos($this->startPart,'1.decrypt.'))!==false){
			$part = $this->recursivelyProcessEncryptedAttachments('getPart',$this->startPart, $params);
			$in = str_replace('1.decrypt.','',$this->startPart);
			if($params['info']['content-type']=='message/rfc822'){
				$rfcsuffix = '.rfc822';
			}else{
				$rfcsuffix = '';
			}
			$parser = new self::$class('',$this->ids,false,$this->startPart.$rfcsuffix.'.','',$part, $this->purify);
			$parser->download = $this->download;
			$parser->PassPhrase = $this->PassPhrase;
			$parser->block_external = $this->block_external;
			$message = $parser->parse($noCID,$rawhtml);
			$this->blocked = $parser->blocked;
			if($parser->aUUAttachments){
				$this->aUUAttachments = $parser->aUUAttachments;
				$this->aUUEncodedContent = $parser->aUUEncodedContent;
			}
			$this->parsed = true;
			$this->aResult = $message;
			return $this->aResult;
		}else if(($pos = strpos($this->startPart,'.rfc822.'))!==false){
			$out = substr($this->startPart,0,$pos);
			$part = $this->getPart($out,$params);
			$in = substr($this->startPart,$pos+strlen('.rfc822.'));
			$parser = new self::$class('',$this->ids,true,$this->attIdPrefix.$out.'.rfc822.',$in,$part);
			$parser->download = $this->download;
			$parser->block_external = $this->block_external;
			$parser->PassPhrase = $this->PassPhrase;
			$message = $parser->parse($noCID,$rawhtml);
			if($parser->aUUAttachments){
				$this->aUUAttachments = $parser->aUUAttachments;
				$this->aUUEncodedContent = $parser->aUUEncodedContent;
			}
			$this->blocked = $parser->blocked;
			$this->parsed = true;
			$this->aResult = $message;
			return $this->aResult;
		}else if(($pos = strpos($this->startPart,'|IMIP'))!==false){
			$out = substr($this->startPart,0,$pos);
			$part = $this->getPart($this->startPart,$params);
			$in = substr($this->startPart,$pos+strlen('|IMIP'));
			if($params['info']['content-type']=='message/rfc822'){
				$rfcsuffix = '.rfc822';
			}else{
				$rfcsuffix = '';
			}
			$parser = new self::$class('',$this->ids,true,$this->startPart.$rfcsuffix,'',$part);
			$parser->download = $this->download;
			$parser->block_external = $this->block_external;
			$parser->PassPhrase = $this->PassPhrase;
			$message = $parser->parse($noCID,$rawhtml);
			if($parser->aUUAttachments){
				$this->aUUAttachments = $parser->aUUAttachments;
				$this->aUUEncodedContent = $parser->aUUEncodedContent;
			}
			$this->parsed = true;
			 
				$this->aResult = $message;
			 
			 			return $this->aResult;
		 		}else{
			$this->parsePart($this->startPart);
		}
		if($this->partIDChange)
			$this->startPart = $this->partIDChange;
		
		if($this->startPart!='1'){
			if(isset($this->rfc822Message[$this->startPart])){
				$message = $this->rfc822Message[$this->startPart];
				$parser = $this->rfc822Parser[$this->startPart];
				if($parser->aUUAttachments){
					$this->aUUAttachments = $parser->aUUAttachments;
					$this->aUUEncodedContent = $parser->aUUEncodedContent;
				}
				$this->blocked = $parser->blocked;
				$this->parsed = true;
				$this->aResult = $message;
				return $message;
			}
		}
		 
		$this->aResult = $this->aParts[$this->startPart];

		 		if($this->aUUAttachments){
			foreach($this->aUUAttachments as $upart => $attachment){
				$this->aResult['attachments'][] = $attachment[0];
			}
		}

		 		$this->replaceCID();

		if(!$noCID  && ( isset($this->noCID) || isset($this->isCID) ) ){
			unset($this->aParts);
			unset($this->aResult);
			unset($this->aUUAttachments);
			unset($this->aUUEncodedContent);
			$this->parsed = false;
			return $this->parse(true,$rawhtml);
		}

		$this->aResult['content-type'] = (isset($this->aResult['isHTML']) && $this->aResult['isHTML'])?'html':((isset($this->aResult['isText']) && $this->aResult['isText'])?'text':'');
		 
		if ($this->decodeMime) {
			if(isset($this->aResult['signatures'])){
				$signatures = $this->aResult['signatures'];
			}
			$headers = $this->aResult['headers'];
			$info = $this->aResult['info'];
			
			$this->checkSMimeParts($this->aResult);
			
			if ($this->sMimeMessage){
				if($headers && $this->sMimeMessage['headers']['date']==-1){
					$this->sMimeMessage['headers'] = $headers;
				}
				if($info && !$this->sMimeMessage['info']){
					$this->sMimeMessage['info'] = $info;
				}
				if($signatures){
					$this->sMimeMessage['SES'] = true;
					$this->sMimeMessage['signatures'] = $signatures;
				}
				$this->sMimeMessage['encrypted'] = true;
				$this->parsed = true;
				if($this->sMimeMessage['blocked']){
					$this->blocked = $this->sMimeMessage['blocked'];
				}
				if($this->sMimeMessage['error']){
					$this->aResult['error'] = true;
					$this->aResult['encrypted'] = true;
					return $this->aResult;
				}
				$this->aResult = $this->sMimeMessage;
				return $this->sMimeMessage;
			}
		}
		$this->parsed = true;

		return $this->aResult;
	}

	 
	private function htmlExists($parent)
	{
		$cursor = $parent;
		while(isset($this->aParts[$cursor]) && strpos($cursor,'.')!==false){
			if(isset($this->aParts[$cursor]['html_body'])){
				$html_body = str_replace(array('<br />',"\r\n"),'',$this->aParts[$cursor]['html_body']);
			}else{
				$html_body = '';
			}
			if($html_body){
				return true;
			}
			$cursor = substr($cursor,0,strrpos($cursor,'.'));
		}
		if(isset($this->aParts[$cursor]['html_body'])){
			$html_body = str_replace(array('<br />',"\r\n"),'',$this->aParts[$cursor]['html_body']);
		}else{
			$html_body = '';
		}
		if($html_body){
			return true;
		}
		return false;
	}


	protected function parseContentTypeText(array $info, $parent, $part, $partID)
	{
		$body = $this->parseBody($part, $info, $partID);
		if(isset($info['content-disposition']) && $info['content-disposition'] == 'inline'){
			$this->aParts[$parent]['isText'] = true;
			if($this->aParts[$parent]['plain_body']){
				$this->aParts[$parent]['plain_body'] .= "-----------------\r\n" . $body;
			}else{
				$this->aParts[$parent]['plain_body'] = $body;
			}
			 
			if($this->htmlExists($parent)){
				$this->aParts[$parent]['html_body'] .='<hr/>'.slToolsString::text2html($body,true);
			}else{
				$this->aParts[$partID]['html_body'] = slToolsString::text2html($body,true);
			}
		}else{
			 			if (isset($info['content-name']) || isset($info['headers']['content-name']) || (isset($info['content-disposition']) && $info['content-disposition'] == 'attachment')){
				$attachmentTmp = $this->parseAttachment($part, $info, $partID);
				if(!empty($attachmentTmp)) $this->aParts[$parent]['attachments'][] = $attachmentTmp;
				 			}else{
				$this->aParts[$parent]['isText'] = true;
				if(!isset($this->aParts[$parent])){
					$parent .= '.1';
				}
				if(isset($this->aParts[$parent]['mixed']) && $this->aParts[$parent]['mixed']){
					$this->aParts[$parent]['plain_body'] .= $body;
					$this->aParts[$parent]['html_body'] .= slToolsString::text2html($body,true,true);
				}else{
					$this->aParts[$parent]['plain_body'] = $body;
				}
				$this->aParts[$parent]['plain_body_info'] = $info;
			}
		}
	}

	 
	protected function addXElementsToVCalendarXML(SimpleXMLElement $xml, $gwAccount)
	{
		$vObject = $xml->VEVENT ?? $xml->VTODO ?? $xml->VCALENDAR ?? false;
		if($addOriginal = $xml->METHOD == 'COUNTER' && $vObject instanceof SimpleXMLElement){
			$originalTimes = $this->getOriginalTime($xml, $gwAccount, $vObject->UID);
		}
		foreach (['DTSTART', 'DTEND', 'DTDUE'] as $attribute) {
			$element = $vObject->{$attribute};
			if(!$element instanceof SimpleXMLElement || empty($element)) continue;
			if($addOriginal){
				$element->addAttribute('X-ORIGINALDATE', slToolsDate::iso86012calendardate($originalTimes[$attribute]));
				$element->addAttribute('X-ORIGINALTIME', slToolsDate::iso86012calendartime($originalTimes[$attribute]));
			}
			if(!isset($element['X-LOCALTIME'])){
				$element->addAttribute('X-CTZDATE', slToolsDate::gregorianToCalendarDate($element[0]));
				$element->addAttribute('X-CTZTIME', -1);
				continue;
			}
			$element->addAttribute('X-CTZDATE', slToolsDate::iso86012calendardate($element['X-LOCALTIME']));
			$element->addAttribute('X-CTZTIME', slToolsDate::iso86012calendartime($element['X-LOCALTIME']));
		}
	}

	 
	protected function getOriginalTime(SimpleXMLElement $counterXML, $gwAccount, string $eventUid) : array
	{
		$calendar = $gwAccount->getFolder($_SESSION['user']->getDefaultFolder('E'));
		$calendarId = $calendar->openAccess();
		$originalEvent = simplexml_load_string($gwAccount->gwAPI->FunctionCall('GetVCalendar', $calendarId, '','XML;EXPAND;MATCHUID;SETUID=' . $eventUid));
		$vObject = $counterXML->VEVENT ?? $counterXML->VTODO ?? $counterXML->VCALENDAR ?? false;
		$recurrenceId = (string) $vObject->{'RECURRENCE-ID'};
		if(empty($recurrenceId)){
			$date = substr($vObject->DTSTART, 0, 8);
		}else{
			$date = substr($recurrenceId, 0, 8);
			foreach ($vObject as $xml) {
				if((string) $xml->{'RECURRENCE-ID'} == $recurrenceId){
					$vEvent = $xml;
					break;
				}
			}
		}
		$vEvent = $vEvent ?? $originalEvent->VEVENT ?? $originalEvent->VTODO ?? $originalEvent->VCALENDAR ?? false;

		$originalTimes = ['DTSTART' => 0, 'DTEND' => 0, 'DTDUE' => 0];
		foreach ($originalTimes as $attribute => $value) {
			$originalTimes[$attribute] = $date . substr($vEvent->{$attribute}, 8);
		}
		return $originalTimes;
	}

	private function parsePart($partID,$cleanHTML = true)
	{
		$base = null;
		$rawhtml = false;
		$subPart = 0;
		$t = time();
		$m = microtime();
		$part = mailparse_msg_get_part($this->mail, $partID);
		$info = mailparse_msg_get_part_data($part);

		$this->checkMainPartRFC822($partID, $info, $part);
		
		 		$this->aParts[$partID]['headers'] = self::parseHeaders($info,$this->attIdPrefix);
		$this->aParts[$partID]['info'] = $info;
		
		
		if (strpos($info['content-type'], 'multipart/') === 0 ){

			$this->aParts[$partID]['multipart']  = true;
			
			if(strpos($info['content-type'], 'report') !== false){
				$this->aParts[$partID]['report'] = true;
			}
			if(strpos($info['content-type'], 'mixed') !== false){
				$this->aParts[$partID]['mixed'] = true;
			}
			if(strpos($info['content-type'], 'alternative') !== false){
				$this->aParts[$partID]['alternative'] = true;
			}
			$t = time();
			$m = microtime();
			while ($subPart++ < count($this->partPointer[$partID])){
				$this->parsePart($partID.'.'.($subPart), $cleanHTML);
			}	
		}
		 		$parent = explode(".",$partID);
		if(count($parent)>1) unset($parent[count($parent)-1]);
		$parent = implode(".",$parent);
		
		if(isset($info['content-id']) && $info['content-id']){
			if((!isset($this->noCID[$partID]) && substr($info['content-type'],0,4) == 'text') || $this->isCID[$partID]){
				$modified_info = $info;
				$modified_info['headers']['content-type'] = 'application/octet-stream';
				$modified_info['content-type'] = 'application/octet-stream';
				 				$attachment = $this->parseAttachment($part, $modified_info, $partID);
				if(!empty($attachment)){
					$attachment['type'] = 'suspicious/content-id';
					$this->aParts[$parent]['attachments'][] = $attachment;
				}
			}
		
			if($this->isCID[$partID]){
				return;
			}
		}
		if(is_array($info['headers']['content-type'])) $info['headers']['content-type'] = $info['content-type'];
		if(@strpos($info['headers']['content-type'],'text/html') === 0){
			$info['content-type'] = 'text/html';	
		}
		@preg_match("#charset(\s|\t)?+=(\s|\t)?+(\"|\'})?([^\"^\'^\s^\r^\n^;]{1,})(;)?+(\"|\'})?#i",$info['headers']['content-type'],$charsetMatch);
		if ($charsetMatch)	{
			$info['content-charset'] = $charsetMatch[4];
		}
		 		switch($info['content-type'] ){
			 		 
			  			case 'text':
			case 'text/plain':
				$this->parseContentTypeText($info, $parent, $part, $partID);
			break;
			  			case 'text/html':
				 				if (isset($info['content-name']) || isset($info['headers']['content-name']) || (isset($info['content-disposition']) && $info['content-disposition']=='attachment')){
					$attachmentTmp = $this->parseAttachment($part, $info, $partID);
					if(!empty($attachmentTmp)) $this->aParts[$parent]['attachments'][] = $attachmentTmp;
				 				} else{
				    $this->aParts[$parent]['isHTML'] = true;
				    $body = $this->parseBody($part, $info, $partID);
				    if(!$this->rawhtml && $cleanHTML){
						if (ini_get('session.save_handler') == 'files' && file_exists(ini_get('session.save_path') . 'use-old-parser.mark')) {
							$body = slToolsString::cleanHTML($body, $base, $this->block_external, $this->blocked, $this->addHtmlLinks);
						}elseif(!$this->purify){
							$body = slToolsString::basicSanitizeHTML($body, $base, $this->block_external, $this->blocked, $this->addHtmlLinks);
						} else {
							$enableExternalResources = !$this->block_external;
							$enableLinkification = $this->addHtmlLinks;
							$body = slToolsString::purifyAdvancedHTML($body, $enableExternalResources, $enableLinkification, $externalResourcesAreBlocked, $base);
							$this->blocked = $externalResourcesAreBlocked;
						}
				    }

				    if(isset($info['content-disposition']) && $info['content-disposition']=='inline')  					$this->aParts[$parent]['plain_body'].="-----------------\r\n".slToolsString::removeHTML($body);

				    if($this->htmlExists($parent)){
					$this->aParts[$parent]['html_body'] .= '<hr/>'.$body;
					$this->aParts[$partID]['html_body'] .= '<hr/>'.$body;
				    }else{
					$this->aParts[$parent]['html_body'] = $body;
					$this->aParts[$partID]['html_body'] = $body;
				    }

				    $this->aParts[$parent]['html_base'] = $base;
				    $this->aParts[$partID]['html_base'] = $base;
				}
				
				$this->aParts[$parent]['html_body_info'] = $info;
				break;
			case 'text/x-vcalendar':
			case 'text/calendar':
				if(defined('IW_DISABLED') && IW_DISABLED){
					break;
				}
				
				$aAttachment = $this->parseAttachment($part, $info, $partID);
				if(empty($aAttachment)) break;
				 				$oGWAccount = &$_SESSION['user']->aAccounts[$_SESSION['EMAIL']]->gwAccount;
				$oIMIP = iMIP::load($oGWAccount);
				$sVersit = $this->parseBody($part, $info, $parent);
				if($sVersit){
					$imip_attachments = null;
					$aAttachment['imip_xmlstr'] = $oIMIP->convertVersit($sVersit,'XML;FILTER=ATTACH',$imip_attachments);
					if(preg_match('/^<VTIMEZONE>.*<\\/VTIMEZONE>\\s*$/Ds', $aAttachment['imip_xmlstr'])){
						$this->parseContentTypeText($info, $parent, $part, $partID);
						break;
					}
					if($imip_attachments){
						foreach($imip_attachments as $attachment){	
							$attachment['part_id'] = ($this->attIdPrefix!='1'?$this->attIdPrefix:'').$partID.'|'.$attachment['part_id'].'IMIP|';
							if($attachment['type'] =='message/rfc822'){
								$attachment['part_id'].='.rfc822.';
							}
							if(!empty($attachment['type']) || !empty($attachment['name'])) $this->aParts[$parent]['attachments'][] = $attachment;
						}
					}
					@$aAttachment['imip_xml'] = simplexml_load_string($aAttachment['imip_xmlstr']);
					if($aAttachment['imip_xml'] instanceof SimpleXMLElement) $this->addXElementsToVCalendarXML($aAttachment['imip_xml'], $oGWAccount);
					$aAttachment['imip_xmlstr'] = $aAttachment['imip_xml']->asXML();
					$aAttachment['is_hidden'] = 1;
					$owner = $_SESSION['EMAIL']!=$this->aParts[1]['headers']['to']?$this->aParts[1]['headers']['to']:false;
					switch(strtoupper($info['content-method'])){
						case 'DECLINECOUNTER':
							@$eventComment = $aAttachment['imip_xml']->VEVENT->COMMENT; 
							@$taskComment = $aAttachment['imip_xml']->VTODO->COMMENT; 
							@$method = $aAttachment['imip_xml']->METHOD; 
							$suffix = $owner?'=&ownerEmail='.urlencode($owner):'';
							$sVersit = $oIMIP->processVCalendar('group','',$sVersit,'REFRESH'.$suffix);
							$aAttachment['imip_xmlstr'] = $oIMIP->convertVersit($sVersit);
							@$aAttachment['imip_xml'] = simplexml_load_string($aAttachment['imip_xmlstr']);
							if ($eventComment){
								@$aAttachment['imip_xml']->VEVENT->addChild('COMMENT',$eventComment);
							}
							if ($taskComment){
								@$aAttachment['imip_xml']->VTODO->addChild('COMMENT',$taskComment);
							}
							if ($method){
								@$aAttachment['imip_xml']->addChild('METHOD',$method);
							}
							$aAttachment['imip_xmlstr'] = $aAttachment['imip_xml']->asXML();
							
							break;
						case 'REPLY':
						case 'CANCEL':
							 						case 'ACCEPTED':
						case 'DECLINED':
							$oInvitation = $oIMIP->loadInvitation($sVersit);
							$oInvitation->process($owner);
							break;
					}
				}
				 				$this->aParts[$parent]['attachments'][] = $aAttachment;
				
			break;
				
			 			
			case 'message/rfc822':
				if($this->file)
					@$data = mailparse_msg_extract_part_file($part, $this->file,NULL);
				else
					@$data = mailparse_msg_extract_part($part, $this->message,NULL);
				
				if(!$data){
					break;
				}
				
				if($partID=='1'){
					$partID.='.1';
				}
				$rfcParser = new self::$class('',$this->ids,true,$this->attIdPrefix.$partID.'.rfc822.','1',$data);
				$rfcParser->download = $this->download;
				$rfcParser->block_external = $this->block_external;
				$rfcParser->PassPhrase = $this->PassPhrase;
				$this->rfc822Message[$partID] = $rfcParser->parse(true,$rawhtml);
				$this->rfc822Parser[$partID] = $rfcParser;
				$attachment = $this->parseAttachment($part,$info,$partID);
				if(!empty($attachment)){
					if( $this->rfc822Message[$partID]['headers']['subject']){
						$attachment['name'] = $this->rfc822Message[$partID]['headers']['subject'].'.msg';
					}
					$this->aParts[$parent]['attachments'][] = $attachment;
				}
				break;
			case 'message/delivery-status':
					$this->aParts[$parent]['delivery-status'] = $this->parseBody($part, $info, $partID);
			break;
			case 'application/ms-tnef':
				$this->parseTnefPart($part,$parent,$partID);
				break;
			case 'application/x-pkcs7-signature':
			case 'application/pkcs7-signature':
              
				$attachmentTmp = $this->parseAttachment($part, $info, $partID);
				if(!empty($attachmentTmp)) $this->aParts[$parent]['signatures'][] = $attachmentTmp;
				break;
			case 'application/x-pkcs7-mime':
			case 'application/pkcs7-mime':

				if(strpos($info['headers']['content-type'],'signed-data')!==false){

					$certFile =  slToolsFilesystem::randomFilename($this->getTempDir());
					$outFile = slToolsFilesystem::randomFilename($this->getTempDir());

					openssl_pkcs7_verify($this->file,PKCS7_NOVERIFY,$certFile);
					openssl_pkcs7_verify($this->file,PKCS7_NOVERIFY,$certFile,array(),$certFile,$outFile);
					 
					$data = file_get_contents($outFile);
					@unlink($certFile);
					@unlink($outFile);	
					
					if(!$data){
						$this->sMimeMessage['error'] = 1;
						return;
					}
					$parser = new self::$class('',$this->ids,false,$this->attIdPrefix.$partID.'.signed.','1',$data);
					$parser->download = $this->download;
					$parser->block_external = $this->block_external;
					$parser->PassPhrase = $this->PassPhrase;
					$str = $parser->parse(false,$rawhtml);

					$this->sMimeMessage = $str;
					$attachmentTmp = $this->parseAttachment($part, $info, $partID);
					if(!empty($attachmentTmp)) $this->aParts[$parent]['signatures'][] = $attachmentTmp;
					break;
				}
				global $parseCount;
				if($parseCount==3){
					$att = $this->parseAttachment($part, $info, $partID);
					if(!empty($att)){
						$attachments = array($att);
						$this->checkSMimeParts($attachments);
					}
				}
				if(!isset($this->aParts[$parent])){
					$parent.='.1';
				}

				$attachmentTmp = $this->parseAttachment($part, $info, $partID);
				if(!empty($attachmentTmp)) $this->aParts[$parent]['attachments'][] = $attachmentTmp;
			break;
			case 'application/eml':
			case 'application/octet-stream':
				if(strtolower($info['content-name'])==='winmail.dat'){
					$this->parseTnefPart($part,$parent,$partID);
					break;
				}
				if (!$info['content-name']){
					$info['content-name'] = $info['disposition-name'];
				}
				$info['content-name'] = $this->decodeMimeHeader($info['content-name']);
		
				 				if(strpos($info['content-name'],'.eml')!==false || strpos($info['content-name'],'.msg')!==false){
					if($this->file)
						@$data = mailparse_msg_extract_part_file($part, $this->file,NULL);
					else
						@$data = mailparse_msg_extract_part($part, $this->message,NULL);
					
					if($partID=='1'){
						$partID.='.1';
					}
					try{
						$rfcParser = new self::$class('',$this->ids,true,$this->attIdPrefix.$partID.'.rfc822.','1',$data);
						$rfcParser->PassPhrase = $this->PassPhrase;
						$this->rfc822Message[$partID] = $rfcParser->parse(false,$rawhtml);
						$this->rfc822Parser[$partID] = $rfcParser;
					}Catch(Exception $e){
						
					}
					$attachment = $this->parseAttachment($part,$info,$partID);
					if(!empty($attachment)){
						if($this->rfc822Message[$partID]['headers']['subject']){
							$attachment['name'] = $this->rfc822Message[$partID]['headers']['subject'];
						}
						$attachment['type'] = 'application/octet-stream';
						$this->aParts[$parent]['attachments'][] = $attachment;
					}
				}
			 			case 'text/enriched':
			default:
					if(isset($info['content-dummyimg']) && $info['content-dummyimg']){
						break;
					}
					if(!isset($this->aParts[$parent])){
						$parent.='.1';
					}
					 					$attachment = $this->parseAttachment($part, $info, $partID);
					if(empty($attachment)) break;
					 					if(strpos($info['content-type'],'image/') !== false && $attachment['cid'] === '' && $info['content-disposition'] == 'inline'){
						$attachment['cid'] = 'webmail_'.md5(serialize($attachment));
						$index = $this->getIdsIndex();
						$_SESSION['mail']['cache'][$index]['cid'][$attachment['cid']] = $this->attIdPrefix.$partID;
						$_SESSION['mail']['cache'][$index]['time'] = time();
						$attachment['preserve'] = true;
						if($this->htmlExists($parent)){
							$this->aParts[$parent]['html_body'].='<img src="cid:'.$attachment['cid'].'" />';
						}
					}
					$this->aParts[$parent]['attachments'][] = $attachment;
				break;
			
			 
			case 'multipart/appledouble':
				$partID .='.2';
				$part = mailparse_msg_get_part($this->mail, $partID);
				$info = mailparse_msg_get_part_data($part);

				$attachmentTmp = $this->parseAttachment($part, $info, $partID);
				if(!empty($attachmentTmp)) $this->aParts[$parent]['attachments'][] = $attachmentTmp;
			break;
			case 'multipart/signed':
			 			case 'multipart/related': 
			case 'multipart/relative': 
			case 'multipart/alternative': 
			case 'multipart/mixed':
			case 'multipart/fax-message':
			case 'multipart/voice-message':
				$this->partDistribution($parent,$partID);
				break;
			 			case 'multipart/digest':
				$this->aParts[$parent]['attachments'] = $this->aParts[$partID]['attachments'];
				break;
			case 'multipart/report':
				
				if(!$this->aParts[$partID]['html_body'])
					$this->aParts[$partID]['html_body'] = slToolsString::text2html($this->aParts[$partID]['plain_body'], true).
														($this->aParts[$partID]['delivery-status']?'<hr/>':'').
														slToolsString::text2html($this->aParts[$partID]['delivery-status'], true);
				if(!$this->aParts[$partID]['html_body'] && !$this->aParts[$partID]['plain_body']){
					$this->aParts[$partID]['plain_body'] = $this->parseBody($part, $info, $partID);
				}
				break;
			
		}
		
	}

	private function partDistribution($parent,$partID)
	{
		 		if($parent==$partID){
			return;
		}
		 		if(!isset($this->aParts[$parent]['plain_body'])) $this->aParts[$parent]['plain_body'] = '';
		if(!isset($this->aParts[$parent]['html_body'])) $this->aParts[$parent]['html_body'] = '';

		if(isset($this->aParts[$parent]['mixed']) && $this->aParts[$parent]['mixed']){
			$this->aParts[$parent]['plain_body'] .= $this->aParts[$partID]['plain_body'];
			$this->aParts[$parent]['html_body'] .= ($this->aParts[$parent]['html_body'] ? '<hr/>' : '') . $this->aParts[$partID]['html_body'];
		}else{
			if(isset($this->aParts[$partID]['plain_body']) && $this->aParts[$partID]['plain_body']){
				$this->aParts[$parent]['plain_body'] .= $this->aParts[$partID]['plain_body'];
			}
			if(isset($this->aParts[$partID]['html_body']) && $this->aParts[$partID]['html_body']){
				$this->aParts[$parent]['html_body'] .= ($this->aParts[$parent]['html_body'] ? '<hr/>' : '') . $this->aParts[$partID]['html_body'];
			}
		}
		if(isset($this->aParts[$partID]['attachments']) && $this->aParts[$partID]['attachments']){
			if(!$this->aParts[$parent]['attachments']) $this->aParts[$parent]['attachments'] = array();
			$this->aParts[$parent]['attachments'] = slToolsPHP::array_merge($this->aParts[$partID]['attachments'], $this->aParts[$parent]['attachments']);
		}
		if(isset($this->aParts[$partID]['signatures']) && $this->aParts[$partID]['signatures']){
			if(!$this->aParts[$parent]['signatures']) $this->aParts[$parent]['signatures'] = array();
			$this->aParts[$parent]['signatures'] = slToolsPHP::array_merge($this->aParts[$partID]['signatures'], $this->aParts[$parent]['signatures']);
		}
		if($this->aParts[$partID]['isHTML']){
			$this->aParts[$parent]['isHTML'] = true;
		}
	}
	private function replaceEmptyCID()
	{
		
	}

	private function replaceCID()
	{
		 
		if (!$this->ids) return;
		if(!isset($this->ids['placeholder'])) $this->ids['placeholder'] = null;
		$search	= $replace = array();
		$i = 0;
		if(isset($this->aResult['attachments'])) foreach ($this->aResult['attachments'] as $key => $attachment) {
			$replaces = 0;
			$match = null;
			if (!isset($attachment['cid']) || $attachment['cid'] == ''){
				 				$search[$i] = '/(<((?i)img)[^>]*((?i)src)[^=]*=[^"]*("?))(cid:)?('. preg_quote($attachment['name'], '/') . ')(@[^\4]+)?(\4[^>]*>)/U';
				$fullpath = $this->ids['account_id'].'/'.$this->ids['folder_id'].'/'. $this->ids['item_id'].'/'.$this->attIdPrefix.$attachment['part_id'];
				$url = 'http'.(($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ? 's' : '').'://'.$_SERVER['HTTP_HOST'].str_replace(WEBMAIL_PHP,DOWNLOAD_PHP,$_SERVER['SCRIPT_NAME']);
				if(!$this->download){
					$replace[$i] = '\1' . ($this->ids['placeholder'] ? '' : $url) . '?sid=' . urlencode($this->ids['sid']) . '&amp;class=teamchat_attachment' . '&amp;fullpath=' . urlencode($fullpath).'\8';
				}else{
					$replace[$i] = '\0';
					$data = $this->getPart(substr($attachment['part_id'],strlen($this->attIdPrefix)));
					$data = base64_encode($data);
					$replace[$i] = '\1data:'.$attachment['type'].';base64,'.$data.'\8';
				}
				$match = $search[$i];
			}else{
				$cid = self::fixCID($attachment['cid']);
				$fullpath = $this->ids['account_id'].'/'.$this->ids['folder_id'].'/'. $this->ids['item_id'].'/'.urlencode($attachment['cid']);

				if(defined('DOWNLOAD_PHP')){
					if(!$this->download){
						$url = 'http'.(($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ?'s':'').'://'.$_SERVER['HTTP_HOST'].str_replace(WEBMAIL_PHP,DOWNLOAD_PHP,$_SERVER['SCRIPT_NAME']);

						$link = ($this->ids['placeholder'] ? '' : $url).'?sid='. ($this->ids['placeholder'] ? '@@SESSION_ID@@' : urlencode($this->ids['sid']));
						$link .= '&amp;class='. ($this->ids['placeholder'] ? 'teamchat_' : '') . 'cid' . '&amp;fullpath=' . urlencode($fullpath) . '&amp;part='.$attachment['part_id'];
					}else{
						$data = $this->getPart(substr($attachment['part_id'],strlen($this->attIdPrefix)));
						$data = base64_encode($data);
						$link = 'data:'.$attachment['type'].';base64,'.$data;
					}
				}else{
					 					$url = 'http'.(($_SERVER['HTTPS'] == 'ON' || ($_SESSION['ALWAYSHTTPS'] ?? false)) ?'s':'').'://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'];
					$link= ($this->ids['placeholder'] ? '' : $url) . '?a='.$this->ids['a'] .'&amp;i='.$this->ids['i'] .'&amp;h='.$this->ids['h'];
					$link .= '&amp;e='.$this->ids['e'] .'&amp;t='.$this->ids['t'] .'&amp;part='.$attachment['part_id'];
				}
				$cidPattern = '/(\"|\'|\=)cid:' . str_replace('/','\/',preg_quote($cid)) . '(\"|\'|\s)/si';
				$cidReplacement = ($this->ids['placeholder'] ? '$1$1 icewarp-src=' : '') . '$1' . $link . '$2';
				$this->aResult['html_body'] = preg_replace($cidPattern, $cidReplacement, $this->aResult['html_body'], 100, $replaces);
			}
			 			if((($match && preg_match($match,$this->aResult['html_body'])) || $replaces) && (!isset($attachment['preserve']) || !$attachment['preserve'])){
				if($this->aResult['attachments'][$key]['type'] == 'suspicious/content-id'){
					$this->isCID[$this->aResult['attachments'][$key]['part_id']] = 1;
				}
				unset($this->aResult['attachments'][$key]);
				$this->aResult['has_embedded_attachment'] = true;
			 			}else{
				unset($this->aResult['attachments'][$key]['cid']);
				if($this->aResult['attachments'][$key]['type']=='suspicious/content-id'){
					$this->noCID[$this->aResult['attachments'][$key]['part_id']] = 1;
				}
			}
			$i++;
		}

		if ($search) {
			if (!is_string($this->aResult['html_body'])) return;
			 			$backtrack_limit = ini_alter('pcre.backtrack_limit',10000000);
			$this->aResult['html_body'] = preg_replace($search, $replace, $this->aResult['html_body']);
			ini_set('pcre.backtrack_limit',$backtrack_limit);
		}
	}
	
	static private function fixCID($cid)
	{
		$cid = str_replace(array('@','/','=','\\','~'),array('___MAILPARSE_TOKEN1__','___MAILPARSE_TOKEN2__','___MAILPARSE_TOKEN3__','___MAILPARSE_TOKEN4__','___MAILPARSE_TOKEN5__'),$cid);
		$cid = urlencode($cid);
		$cid =  str_replace(array('___MAILPARSE_TOKEN1__','___MAILPARSE_TOKEN2__','___MAILPARSE_TOKEN3__','___MAILPARSE_TOKEN4__','___MAILPARSE_TOKEN5__'),array('@','/','=','\\','~'),$cid);
		return $cid;
	}
	 
	private static function parseHeaders($info, $prefix = '')
	{
		if (!isset($info['headers']))
			return array();
		if(isset($info['content-charset'])){
			$charset = $info['content-charset'];
		}else{
			$charset = false;
		}
		$headers = $info['headers'];
		 		$result = array('date' => -1,
							'from' => '',
							'to' => '',
							'cc' => '',
							'bcc' => '',
							'reply-to' => '',
							'subject' => '',
							'priority' => 3,
							'custom-headers' => array(),
							'received'=>'');
		if($headers) foreach ($headers as $key => $value) {
			switch ($key) {
				case 'date':
					$date = @intval(strtotime($value));
					if ($date > 0)
						$result['date'] = date('Y-m-d H:i:s', $date);
					break;
				case 'from':
				case 'to':
				case 'cc':
				case 'bcc':
				case 'reply-to':
				case 'sms':
				case 'received':
				case 'subject':
				case 'message-id':
				case 'x-message-id':
				case 'in-reply-to':
				case 'sender':
					if($key=='sender' || $key=='from' || $key=='to' || $key=='cc' || $key=='bcc' || $key=='sms' || $key=='reply-to'){
						$value = str_replace("?= =?","?==?",$value);
						$h = self::quoteAddresses($value,$charset,true);
					}else{
						$h = self::decodeMimeHeader($value,$charset);
					}
					if(is_array($h)){
						$v = implode(',',$h);
					}else{
						$v = $h;
					}
					if($key=='sender' || $key=='from' || $key=='to' || $key=='cc' || $key=='bcc' || $key=='sms'|| $key=='reply-to'){
						$v = self::fixHeader($v);
					}else if ( $key=='subject' ){
						$v = trim($v);
					}
					$result[$key] = $v;
					break;

				case 'x-priority':
					$result['priority'] = self::decodePriority($value);
					break;
				case 'references':
					$h = self::decodeMimeHeader($value);
					$h = preg_replace("/></su",">\x0D\x0A\x09<",$h);
					$h = preg_replace("/>,</su",">\x0D\x0A\x09<",$h);
					$h = preg_replace('([\x0A\x09\x0D\s]+)',"\x0D\x0A\x09",$h);
					$result[$key] = $h;
					break;
				 				case 'content-type':
					break;
				case 'mime-version':
					$result['mime'] = 1;
					break;
				case 'x-icewarp-server-invite-request':
					$result['x-icewarp-server-invite-request'] = $value;
				break;
				case 'x-icewarp-server-request':
					$result['x-icewarp-server-request'] = $value;
				break;
				case 'x-icewarp-server-teamchat-notifications':
					$result['x-icewarp-server-teamchat-notifications'] = $value;
				break;
				case 'x-icewarp-smartattach':
					$result['x-icewarp-smartattach'] = self::decodeMimeHeader($value);
					if($prefix){
						$result['x-icewarp-smartattach-prefix'] = $prefix;
					}else{
						$result['x-icewarp-smartattach-prefix'] = '';
					}
				break;
				case 'x-icewarp-conference':
					$result['x-icewarp-conference'] = $value;
				break;
				case 'x-icewarp-voicemail':
					$result['x-icewarp-voicemail'] = $value;
					break;
				case 'x-confirm-reading-to':
				case 'disposition-notification-to':
					$result['custom-headers'][$key] = self::quoteAddresses($value,$charset,true);
					break;
				break;
				default:
					$result['custom-headers'][$key] = self::decodeMimeHeader($value);
					break;
			}
		}
		return $result;
	}
	
	static public function quoteAddresses($value,$charset = false, $isInternal = false)
	{
		if(is_array($value)){
			foreach($value as $value_key => $value_val){
				$value[$value_key] = self::quoteAddress($value_val,$charset,$isInternal);
			}
		}else{
			$value = self::quoteAddress($value,$charset,$isInternal);
		}
		return $value;
	}
	
	static private function preprocessAddresses($a)
	{
		 		return $a;
	}
	
	static private function quoteAddress($a,$charset = false,$isInternal = false)
	{
		$a = self::preprocessAddresses($a);
		$addresses = self::parseAddresses($a,false,$isInternal);
		if($addresses){
			foreach($addresses as $addr){
				if($addr['display'] && $addr['display']!=$addr['address']){
					if(stripos($addr['display'],'?B?')!==false || stripos($addr['display'],'?Q?')!==false){		
						$display = self::decodeMimeHeader($addr['display'],false);
					}else{
						$display = $addr['display'];
					}
					
					$display = trim($display,"\"'");
					$quote = preg_match("/(\"|,|>|<|@|\\s|'|\\\\)/s",$display,$matches)?"\"":"";
					 					$display = strtr($display,array("\""=>"\\\"","\\"=>"\\\\"));
					$address[] = $quote.$display.$quote.' <'.$addr['address'].'>';
				}else{
					$address[] = slToolsString::fixDistributionListHeader($addr['address']);
				}
			}
			return join(', ',$address);
		}
		
		return $a;
	}
	
	 
	public function getHeaders($plain = false)
	{
		$part = mailparse_msg_get_part($this->mail, $this->startPart);
		$info = mailparse_msg_get_part_data($part);		
		
		if ($plain)
			return $info['headers'];
		else
			return self::parseHeaders($info,$this->attIdPrefix);
	}	
	
	 
	private function parseAttachment($part, $info, $partID)
	{
		if(!$info){
			$info = mailparse_msg_get_part_data($part);
		}
		if(($info['headers']['x-icewarp-smartattach'] ?? null) == 'indicator') return [];
		$size = $info['ending-pos-body']-$info['starting-pos-body'];

		if ($info['transfer-encoding']=='base64'){
			$size = $size *(3/4);
		}
		$messageRFC822Info = false;
		if($info['content-type']=='message/rfc822'){
			@$part = mailparse_msg_get_part($this->mail,$partID.'.1');
			@$messageRFC822Info = mailparse_msg_get_part_data($part);
		}
		$sName = self::getAttachmentName($info, $partID, $messageRFC822Info);
		$sContentType = $info['content-type']; 
		self::overrideContentType($sName,$sContentType);
		if($info['content-id']){
			$index = $this->getIdsIndex();
			 
			$_SESSION['mail']['cache'][$index]['cid'][$info['content-id']] = $this->attIdPrefix.$partID;
			$_SESSION['mail']['cache'][$index]['time'] = time();
			 
		}
		return array(
			'part_id' => $this->attIdPrefix.$partID,
			'cid'	 => isset($info['content-id']) ? $info['content-id'] : '',
			'type'	=> $sContentType,
			'name'	=> $sName,
			'size'	=> $size,
		);
	}
	
	public function getIdsIndex($start_part_id = '')
	{
		
	   if($this->ids){
	   	if($start_part_id){
	   		$start_part_id = '|'.$start_part_id;
	   	}
		return $this->ids['account_id'].'|'.$this->ids['folder_id'].'|'.$this->ids['item_id'].$start_part_id;
	   }else{
        return $this->file;
	   }
    }
	
	 
	static public function getAttachmentName($info, $partID, $rfc822Info = false, $returnEmpty = false, $extension = '.msg')
	{
		$name = null;
		 		 		if ($rfc822Info && isset($rfc822Info['headers']['subject'])){
			$subject = self::decodeMimeHeader($rfc822Info['headers']['subject']);
			if($subject){
				$name =$subject.$extension;
			}
			if(!$name && isset($info['content-name'])){
				$name = self::decodeMimeHeader($info['content-name']);
				if($name){
					return $name;
				}
			}
		}
		
		 		if (!$name && isset($info['disposition-filename'])){
			$name = self::decodeMimeHeader($info['disposition-filename']);
		}
		
		 		if (!$name && isset($info['content-name'])){
			$name = self::decodeMimeHeader($info['content-name']);
		}
		
		if (!$name && isset($info['content-description'])){
			$name = self::decodeMimeHeader($info['content-description']);
		}
		if (!$name && isset($info['headers']['subject']) && $info['headers']['subject']!=''){
			
			if($info['content-type']=='text/calendar'){
				$name = self::decodeMimeHeader($info['headers']['subject']);
				$name = $name?($name.'.ics'):'';
			}else{
				$name = self::decodeMimeHeader($info['headers']['subject']);
				$name = $name?($name.$extension):'';
			}
		}
		if ($name){
			return $name;
		}else if (!$returnEmpty){
			if(@strpos($info['content-type'],'rfc822')===false){
				return $partID.'.'.substr(
					$info['content-type'],
					strpos($info['content-type'],'/')
				);
			}
			return $partID.$extension;
		}
		return '';
	}
	 
	private function parseBody($part, $info, $partID)
	{
		if($this->file)
			@$data = mailparse_msg_extract_part_file($part, $this->file,NULL);
		else
			@$data = mailparse_msg_extract_part($part, $this->message,NULL);

		if(strpos($data,"\x00")){
			$data = str_replace("\x00",'',$data);
		}
		
		 		if(!isset($this->aParts[$partID]['headers']['mime']) && !isset($info['headers']['mime-version'])){
			
				$data = "\n".$data;
				$this->aUUEncodedContent = array();
				$subPart = 1;
				$offset = 0;
				$stop = 0;
				while(preg_match("#(\nbegin) ([0-9]{1,}) ([^\r^\n]{0,})#si",$data,$matches,PREG_OFFSET_CAPTURE,$offset)){
					$offset = $matches[1][1] + strlen($matches[3][0]);
					
					 					if(!preg_match("#(end)#s",$data)){
						$data.="\rend";
					}
					$parsedAttachment = $this->parseUUEncodedAttachment($data,$matches,$offset,$subPart);
					if ($parsedAttachment === false) {
						continue;
					}
					$this->aUUAttachments[($this->attIdPrefix?$this->attIdPrefix:'1').$this->startPart.'.uuencode.'.$subPart][] = $parsedAttachment;
				}
				$data = ltrim($data,"\n");
		}
		
		$check = substr($data,0,8192);
		if($info['charset']=='us-ascii' && $info['disposition-filename'] && ($info['content-type']=='text/calendar' || $info['content-type']=='text/x-vcalendar')){
			$info['content-charset'] = 'utf-8';
		}
		 		if(!$info['content-charset']){		
			if(preg_match('/<meta[^>]+(charset=([^"\']+))/si',$check,$matches)){
				$info['content-charset'] = $matches[2];
			}
		}
		 		if (slToolsString::isabovechar($check) && (!$info['content-charset'] || $info['content-charset']=='us-ascii')){
			mb_detect_order(self::$defaultCharset.',BIG5,ISO-8859-1,ISO-8859-2,UTF-8');
			$info['content-charset'] = mb_detect_encoding($check);
		}
		if($info['content-charset']){
			$result = slToolsCharset::my_iconv($info['content-charset'], 'UTF-8//IGNORE', $data);
		}
		 		if(!$result){
			preg_match("#charset(\s|\t)?+=(\s|\t)?+(\"|\'})?([^\"^\'^\s^\r^\n^;]{1,})(;)?+(\"|\'})?#i",$info['headers']['content-type'],$charsetMatch);
			$charsetFromContentType = $charsetMatch[4];
			if($charsetFromContentType && $info['content-charset'] && $info['content-charset'] != $charsetFromContentType){
				$result = slToolsCharset::my_iconv(strtolower($charsetFromContentType), 'UTF-8//IGNORE', $data);
			}
		}
		 		if(!$result){
			$result = $data;
		}
		
		return $result;
	}

	protected function quotedPrintableReplaceCallback($m)
	{
		return '&#x00' . $m[1] . ';';
	}

	 
	public static function decodeMimeHeader($header,$charset = false,$debug = false)
	{
		$converted = array();
		if(!is_array($header)){
			$headers[0] = $header;
		}else{
			$headers = $header;
		}
		$currentCharset = '';
		foreach($headers as $key => $sheader){
			$converted[$key] = '';
			$cached = '';
			if($headerArr = imap_mime_header_decode($sheader)){
				foreach ($headerArr as $item) {
					if($currentCharset && $currentCharset!=$item->charset){
						if($currentCharset=='default' || $currentCharset == 'us-ascii'){
							$converted[$key].=$cached;
						}else{
							$converted[$key].= slToolsCharset::my_iconv($currentCharset, 'UTF-8//IGNORE', $cached);
						}
						$cached = '';
					}
					if ($item->charset == 'default' || strtolower($item->charset) == 'us-ascii'){
						 if (!slToolsString::isabovechar($item->text)){
							$cached .=$item->text;
							$currentCharset = $item->charset;
							 						 }else{
						 	if($charset===false){
						 		$charset = self::$defaultCharset;
						 	}
						 	$currentCharset = $charset;
						 	$cached.=$item->text;
					 	}
					}else{
						$currentCharset = $item->charset;
						$cached .= $item->text;
					}
				}
				if($cached){
					if($currentCharset=='default' || $currentCharset == 'us-ascii'){
						$converted[$key].=$cached;
					}else{
						
						$converted[$key] .= slToolsCharset::my_iconv($currentCharset, 'UTF-8//IGNORE', $cached);
					}
					$cached = '';
				}
			}
		}

		if(is_array($converted) && count($converted)==1){
			$converted = reset($converted);
		}
		if(!$converted){
			$converted = '';
		}
		return $converted;
	}
	 
	public static function decodePriority($priority)
	{
		if($priority){
			preg_match('/^([0-9]{1,})/s',strval($priority),$regs);
			@$tmp = intval(reset($regs));
		}
		return $tmp ? $tmp : Item::NORMAL_PRIORITY;
	}
	
	 
	public static function parseAddresses($header,$sms = false, $internal = false)
	{
		 		if($sms){
			$quote_open = false;
			$escaped = false;
			$result = '';
			for($i = 0; $i < strlen($header);$i++){
				switch($header[$i]){
					case "\"":
						$result.=$header[$i];
						if(!$escaped){
							$quote_open = $quote_open?false:true;
						}
						$escaped = false;
					break;
					case "\\":
						$result.=$header[$i];
						$escaped = $escaped?false:true;
					break;
					case ' ':
						if($quote_open){
							$result.=$header[$i];
						}
					break;
					default:
						$result.=$header[$i];
					break;
				}
			}
			$header = $result;
		}
		
		if($internal && slToolsString::isabovechar($header) && strtoupper(self::$defaultCharset)!='UTF-8'){
			$header = slToolsCharset::my_iconv(self::$defaultCharset,'UTF-8//IGNORE',$header);
		}
		
		$result = icewarp_parse_to_header($header);
		foreach($result as $item){
			$itm['address'] = trim($item['email'],'<>');
			$itm['display'] = $item['name'];
			$return[] = $itm;
		}
		return $return;

	}

	 
	public function hasAttachments($structure)
	{
		 		if(isset($structure['attachments']) && !empty($structure['attachments']) ) foreach ($structure['attachments'] as $attachment) {
			if ($attachment['cid'] === '' || !isset($attachment['cid']))
				return true;
		}
		return false;
	}
	 
	public static function hasHTMLBody($structure)
	{
		 		return (isset($structure['isHTML']) && $structure['isHTML']);
	}
	 
	public function sMimeStatus($structure, &$message, $file = false,&$cert = false)
	{
		slSystem::import('mail/smime');
		$smime = new slSMime();
		$smime->setCertificateList($this->personalCertificates);
		$smime->setTempDir($this->getTempDir());
		$smimetype = self::getSmimeType($structure);
		$time = strtotime($structure['headers']['date']);
		
		if(isset($structure['encrypted']) && $structure['encrypted'] == true){
			if (isset($structure['signatures'])){
				foreach ($structure['signatures'] as $item){
					if ($item['type'] == 'application/x-pkcs7-signature'
						 || $item['type'] == 'application/pkcs7-signature'
						 || $item['type'] == 'application/x-pkcs7-mime'
						 || $item['type'] == 'application/pkcs7-mime'
						 ){
						if ($status = $smime->verify($file,$cert,$structure['SES']?false:true,$smimetype,$time, $this->PassPhrase)){	
							if($status == CERT_EXPIRED){
								$result = 7;	 							}else{
								$result = 5;	 							}
						}else{
							$result = 2;	 						}
					}
				}
			}else{
				if($structure['isOutlookEncrypted']){
					$result = 5;				 					if($structure['expired']){
						$result = 7;			 					}
				}else{
					
					$result = 3;				 					if($structure['expired']){
						$result = 8;
					}
				}
			}
			return $structure['error']?2:$result;
		}
		 		if (!isset($structure['signatures']))
			return 1;
		
		foreach ($structure['signatures'] as $item) {
			if ($item['type'] == 'application/x-pkcs7-signature'
				 || $item['type'] == 'application/pkcs7-signature'
				 || $item['type'] == 'application/x-pkcs7-mime'
				 || $item['type'] == 'application/pkcs7-mime'){
				if ($status = $smime->verify($file,$cert,false,$smimetype,$time)){
					if($status == CERT_EXPIRED){
						return 6;
					}
					return 4;				 				}
				else
					return 2;				 			}
		}
		 		return 1;
	}
	
	public function sendResult($result,$sForceName,$resize = false)
	{
		$name = $result['name'];
		if($resize){
			$resized = $this->resizeStringImage($result,$resize);
		}
		if($resized){
			$result['size'] = $resized['size'];
			$result['type'] = $resized['type'];
			$result['content'] = $resized['content'];
		}
		if($name){
			$result['filename'] = $name;
		}
		header("Expires: Mon, 1 Jan 2099 00:00:00 GMT");
		slToolsFilesystem::sendFileHeaders($sForceName?$sForceName:$result['filename'],$result['size'],$result['type']);
		$_SESSION['user']->closeSession();
		echo $result['content'];
		return true;
	}
	
	 
	public function sendPart($partID, $sForceName = false, $resize = false)
	{
		$rfcInfo = null;
		$data = $this->getPart($partID, $params, $sForceName);
		@$this->attachmentFile = fopen($params['fName'],'wb+');
		fwrite($this->attachmentFile,$data);
        fclose($this->attachmentFile);
        $info = $params['info'];
        $fName = $params['fName'];
        if($info['content-type']=='message/rfc822'){
            $rfcPart = mailparse_msg_get_part($this->mail, $partID.'.1');
            $rfcInfo = mailparse_msg_get_part_data($rfcPart);
        }

        $fileName = $sForceName?$sForceName:self::getAttachmentName($info, $partID, $rfcInfo);

        slSystem::import('api/api');
        $api = new IceWarpAPI();
        $api->CacheFileWithUpdate($fName);
        $length = filesize($fName);
        if($resize){
            slSystem::import('tools/image');
            $image = new slToolsImage();
            $image->ignoreFileExtension(true);
            $image->load($fName);
            $image->edit($resize['width'],$resize['height'],$resize['crop']);
            $fName = $this->getTempDir().$image->save();
            $length = filesize($fName);
        }
        header("Expires: Mon, 1 Jan 2099 00:00:00 GMT");
         
        slToolsFilesystem::sendFileHeaders($fileName, $length, $info['content-type']);
        slToolsFilesystem::downloadFile($fName,!$resize);
        return true;
	}
	
	public function resizeStringImage($attachment, $parameters)
	{
		$fName = slToolsFilesystem::randomFilename($this->getTempDir());
		file_put_contents($fName,$attachment['content']);
		slSystem::import('tools/image');
		$image = new slToolsImage();
		$image->ignoreFileExtension(true);
		$image->load($fName);
		$image->edit($parameters['width'],$parameters['height'],$parameters['crop']);
		$parameters['type'] = $attachment['type'];
		$result['name'] = $image->save(
			false,
			false,
			$parameters['quality']?$parameters['quality']:false,
			$parameters['type']?$parameters['type']:false
		);
		$result['content'] = file_get_contents($fName);
		
		$result['size'] = filesize($fName);
		$result['type'] = $attachment['type'];
		return $result;
	}
	
	public function getIMIPPart($partID)
	{
		$pos = strpos($partID,'|IMIP');
		if($pos===false){
			return false;
		}
		$imip_part_id = substr($partID,0,$pos);
		$imip_att_id = substr($partID,$pos+5);
		$imip_att_id = preg_replace('/IMIP\|/','',$imip_att_id,1);
		if(!$this->parsed){
			$this->parsePart($this->startPart,false);
			$this->aResult = $this->aParts[$this->startPart];
		}

		$imip = $this->getPart($imip_part_id);
		$structure = $this->aResult;
		$matchid = $this->attIdPrefix.$imip_part_id.'|IMIP'.$imip_att_id.'IMIP|';		
		if($structure['attachments']){
			foreach($structure['attachments'] as $attachment){
				if($attachment['part_id']==$matchid){
					$result = $attachment;
					break;
				}
			}
		}
		if($_SESSION['user']){
			$oAccount = $_SESSION['user']->getAccount($_SESSION['EMAIL']);
			$oGWAPI = $oAccount->gwAccount->gwAPI;
			if($oGWAPI){
				$result['content'] = base64_decode($oGWAPI->FunctionCall("ExtractVersitAttachment",$oGWAPI->sessid,$imip,$imip_att_id));
			}
		}
		if($result){
			$result['filename'] = $result['name'];
			return $result;
		}else{
			return false;
		}
	}
	
	public function getRFC822Part($partID,$method = 'sendPart',&$params = array(), $resize = array())
	{
		$info = null;
		if(isset($this->partPointer[$partID])){
			$result['content'] = $this->$method($partID,$info);
			$result['info'] = $info;
			return $result;
		}
		$separator = '.rfc822.';
		$len = strlen($separator);
		
		if(($pos = strpos($partID,'.rfc822.'))!==false){
			$thisParserPart = substr($partID,0,$pos);
			$recursiveParserPart = substr($partID,$pos+$len);
			if(!$recursiveParserPart){
				return false;
			}
			$part = $this->getPart($thisParserPart);
			$recursiveParser = new self::$class('',$this->ids,true,$this->attIdPrefix.$thisParserPart.$separator,'1',$part);
			$recursiveParser->block_external = $this->block_external;
			$recursiveParser->download = $this->download;
			if($method=='sendPart'){
				$params = false;
			}
			$result =  $recursiveParser->$method($recursiveParserPart,$params, $resize);
			return $result;
		}else{
			return false;
		}
	}
	
	public function getSignedPart($partID,$method = 'sendPart',&$params = array(), $resize = array())
	{
		$info = null;
		if(isset($this->partPointer[$partID])){

				$result['content'] = $this->$method($partID,$info);
				$result['headers'] = mailparse_msg_get_part($this->file,$partID);
				if($method=='sendPart'){
					return;
				}
				$result['info'] = $info;
				return $result;
		}
		$separator = '.signed.';
		$len = strlen($separator);
		if(($pos = strpos($partID,'.signed.'))!==false){
			$thisParserPart = substr($partID,0,$pos);
			$recursiveParserPart = substr($partID,$pos+$len);

			$outFile = slToolsFilesystem::randomFilename($this->getTempDir());
			$certFile = slToolsFilesystem::randomFilename($this->getTempDir());

			openssl_pkcs7_verify($this->file,PKCS7_NOVERIFY,$certFile);
			openssl_pkcs7_verify($this->file,PKCS7_NOVERIFY,$certFile,array(),$certFile,$outFile);
			
			$part = file_get_contents($outFile);
			
			@unlink($outFile);
			@unlink($certFile);
			
			$recursiveParser = new self::$class('',$this->ids,true,$this->attIdPrefix.$thisParserPart.$separator,'1',$part);
			$recursiveParser->block_external = $this->block_external;
			$recursiveParser->download = $this->download;
			return $recursiveParser->$method($recursiveParserPart,$params, $resize);
		}else{
			return false;
		}
	}
	
	
	public function sendCID($cid,$sForceName = false,$resize = false,$start_part_id = false)
	{
		$partID = $this->getCachedPartID($cid,$start_part_id);
		$this->sendPart($partID,$sForceName,$resize);
	}
	
	public function getCachedPartID($cid,$start_part_id = '')
	{

		$index = $this->getIdsIndex($start_part_id);
		if(!$this->parsed){
			$this->parsePart($this->startPart,false);
			$this->aResult = $this->aParts[$this->startPart];
		}

		if(!isset($_SESSION['mail']['cache'][$index]['cid'][$cid])){
			if(isset($_SESSION['mail']['cache'][$index]['cid'][urldecode($cid)])){
				return $_SESSION['mail']['cache'][$index]['cid'][urldecode($cid)];
			}
		}
		$partID = $_SESSION['mail']['cache'][$index]['cid'][$cid];
		return $partID;
	}
	
	public function getPartSource($partID,$trunc = 1024000)
	{

		if(!$partID || $partID=='1'){
			$fp = fopen($this->file,'rb+');
			$source = fread($fp, $trunc + 1);
			fclose($fp);
			$file = true;
		}else{
			$source = $this->getPart($partID);
			$file = false;
		}
		if( strlen($source) > $trunc){
			if(!$file){
				$source = substr($source,0,$trunc);
			}
			$source .= CRLF.'--- Truncated ---';
		}
		return $source;
	}
	
	public function getPart($partID,&$params = array())
	{
        if (!isset($this->partPointer[$partID])) {
            if(strpos($partID,'decrypt') !== false){
                try{
                    if($result = $this->recursivelyProcessEncryptedAttachments('getPart', $partID, $params)) return $result;
                }catch(Exception $e){}
            }
                         if($result['content'] = $this->getRFC822Part($partID,'getPart',$params)){
            }else if($result['content'] = $this->getSignedPart($partID,'getPart',$params)){
                             }else if($result = $this->getSmartAttachPart($partID)){                  $params['info'] = $result;
                             }else if ($result = $this->getIMIPPart($partID)){                  $params['info'] = $result;
            }else if ($result = $this->getUUEncodedPart($partID)){                  $params['info']['content-name'] = $result['filename'];
                $params['info']['content-type'] = $result['type'];
                $params['info']['transfer-encoding'] = 'uu';
            }else if($result = $this->getTnefPart($partID,$params)){                  $params['info']['content-name'] = $result['filename'];
                $params['info']['content-type'] = $result['type'];
                $params['info']['transfer-encoding'] = 'tnef';
            }else{
                throw new Exception('mailparse_get_part');
			}
            if(preg_match('/(?P<url>https?\:\/\/.*\/teamchatapi\/.*)/', $result['content'], $matches) && filter_var($matches['url'], FILTER_VALIDATE_URL)){
                header('Location: ' . $matches['url']);
                exit();
            }
			$params['fName'] = slToolsFilesystem::randomFilename($this->getTempDir());
			return $result['content'];
        }
        $part = mailparse_msg_get_part($this->mail, $partID);
        $info = mailparse_msg_get_part_data($part);
        $params['info'] = $info;

        $this->checkMainPartRFC822($partID, $info, $part);

        if($info['content-type'] == 'message/rfc822'){
            $rfcPart = mailparse_msg_get_part($this->mail, $partID.'.1');
            $rfcInfo = mailparse_msg_get_part_data($rfcPart);
        }

        $fName = slToolsFilesystem::randomFilename($this->getTempDir());

        $info['transfer-encoding'] = '';
        $params['info'] = $info;
        $params['fName'] = $fName;

        if($this->file){
            $data = @mailparse_msg_extract_part_file($part,$this->file,NULL);
        }else{
            $data = @mailparse_msg_extract_part($part,$this->message,NULL);
        }

        return $data;
	}	
	
	public function getPartFile($partID,&$params = array())
	{
		$partID = str_replace('/', '|', $partID);
		$fName = slToolsFilesystem::randomFilename($this->getTempDir());
		$write = true;
		
		if (!isset($this->partPointer[$partID])) {
			if(strpos($partID,'decrypt')!==false){
				try{
					if($result = $this->recursivelyProcessEncryptedAttachments('getPartFile', $partID, $params)){
						return $result;
					}
				}catch(Exception $e){
					
				}
			}
			$partExist = false;

			 			if ($result = $this->getRFC822Part($partID,'getPartFile',$params)){
				$fName = $result;
				$write = false;
				$partExist = true;
			}else if($result = $this->getSignedPart($partID,'getPartFile',$params)){
				$partExist = true;
				$write = false;
				$fName = $result;
			 			}else if($result = $this->getSmartAttachPart($partID)){
				$partExist = true;
				$params['info'] = $result['info']['info'];
			
			 			}else if($result = $this->getIMIPPart($partID)){
				$partExist = true;
				$params['info']['content-name'] = $result['filename'];
				$params['info']['content-type'] = $result['type'];
			}else if($result = $this->getTnefPart($partID)){
				$params['info']['content-name'] = $result['filename'];
				$params['info']['content-type'] = $result['type'];
				$params['info']['transfer-encoding'] = 'tnef';
				$partExist = true;
			}else if( $result = $this->getUUEncodedPart($partID)){
				$params['info']['content-name'] = $result['filename'];
				$params['info']['content-type'] = $result['type'];
 				$params['info']['transfer-encoding'] = 'uu';
				$partExist = true;
			}
			$arrContextOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]];
			if(preg_match('/(?P<url>https?\:\/\/.*\/teamchatapi\/.*)/', $result['content'], $matches) && filter_var($matches['url'], FILTER_VALIDATE_URL) && ($urlContent = @file_get_contents($matches['url'],false, stream_context_create($arrContextOptions)))){
				$result['content'] = $urlContent;
			}
			if($partExist){
				 				if($write){
				 	if(defined('IW_DISABLED') && IW_DISABLED){
						file_put_contents($fName,$result['content']);
					}else{
					 	slToolsIcewarp::iw_file_put_contents($fName,$result['content']);
					}
				}
				return $fName;
			}
			throw new Exception('mailparse_get_partfile');
			 			 		}

		$part = mailparse_msg_get_part($this->mail, $partID);
		$info = mailparse_msg_get_part_data($part);
		
		$this->checkMainPartRFC822($partID, $info, $part);
		
		$params['info'] = $info;

		$this->attachmentFile = fopen($fName,'wb+');
		
		if($this->file){
			@mailparse_msg_extract_part_file($part,$this->file,array($this,"put_file"));
		}else{
			@mailparse_msg_extract_part($part,$this->message,array($this,"put_file"));
		}
		@fclose($fName);

		return $fName;
	}
	
	public function getPartFileCID($cid,&$params = array())
	{
		$partID = $this->getCachedPartID($cid);

		$result = $this->getPartFile($partID,$params);
		return $result;
	}

	private function getUUEncodedPart($partID)
	{
		 		try{
			if(!$this->parsed){
				$result = $this->parsePart($this->startPart,false);
				$this->aResult = $this->aParts[$this->startPart];
			}
		}catch(Exc $e){
			return false;
		}
		if(!$aAttachment = $this->aUUAttachments[$this->attIdPrefix.$partID][0]){
			return false;
		}
		$result = array();			
		$result['filename'] = $aAttachment['name'];
		$result['content'] = $this->aUUEncodedContent[$this->attIdPrefix.$partID];
		$result['size'] = strlen($result['content']);
		$result['type'] = $aAttachment['type'];
		return $result;
	}	
	
	private function parseTnefPart($part,$parent,$partID)
	{
		$name = slToolsFilesystem::randomFileName($this->getTempDir());
		 		if($this->file){
			$data = @mailparse_msg_extract_part_file($part, $this->file,NULL);
		}else{
			$data = @mailparse_msg_extract_part($part, $this->message,NULL);
		}
		if(defined('IW_DISABLED') && IW_DISABLED){
			file_put_contents($name,$data);
		}else{
			slToolsIcewarp::iw_file_put_contents($name,$data);
		}
		@$oTnef = tnef_parse_file($name);
		if($oTnef){
			$iTnef = 0;
			$iRTF = 0;
			@$attachments = tnef_list_attachments($oTnef);
			@$body = tnef_get_body($oTnef);
			if($body){
				if($body['html']){
					if(is_array($body['html'])){
						$body['html'] = join('',$body['html']);
					}
					
					 					$check = substr($body['html'],0,1024);
					if(preg_match('/<meta[^>]+(charset=([^"]+))/si',$check,$matches)){
						$charset = $matches[2];
					}
					if (!$charset && slToolsString::isabovechar($body['html'])){
						mb_detect_order(self::$defaultCharset.',BIG5,ISO-8859-1,ISO-8859-2,UTF-8');
						$charset = mb_detect_encoding($body['html']);
					}
					$body['html'] = slToolsCharset::my_iconv($charset, 'UTF-8', $body['html']);
					$this->aParts[$parent]['html_body']=$body['html'];
				}elseif($body['text']){ 
					if(is_array($body['text'])){
						$body['text'] = join("---\r\n",$body['text']);
					}
					$this->aParts[$parent]['plain_body']=$body['text'];
				}if($body['rtf'])
					$this->aParts[$parent]['attachments'][] = array(
						'part_id' => $this->attIdPrefix.$partID.'.tnef.rtf.'.(++$iRTF),
						'type'	=> 'text/rtf',
						'name'	=> 'attachment - '.$iRTF.'.rtf',
						'size'	=> strlen($body['rtf'][0])
				);
			}
			if ($attachments) foreach($attachments as $attachment){
				@$data = tnef_get_attachment($oTnef,$attachment['name']);

				if($attachment['name']=='smime.p7m'){
					$type = 'application/x-pkcs7-mime';
				}else{
					$type = slMail::getMimeType($attachment['name']);
				}
				$this->aParts[$parent]['attachments'][] = array(
					'part_id' => $this->attIdPrefix.$partID.'.tnef.'.(++$iTnef),
					'type'	=> $type,
					'name'	=> $attachment['name'],
					'size'	=> $attachment['size']);
			}
			unset($oTnef);
		}else{
			 			$info = mailparse_msg_get_part_data($part);
			$attachmentTmp = $this->parseAttachment($part,$info,$partID);
			if(!empty($attachmentTmp)) $this->aParts[$parent]['attachments'][] = $attachmentTmp;
		}
	
		if(defined('IW_DISABLED') && IW_DISABLED){
			unlink($name);
		}else{
			slToolsIcewarp::iw_delete($name);
		}
	}
	private function getSmartAttachPart($partID)
	{
		if(!$this->parsed){
			$this->parsePart($this->startPart,false);
			$this->aResult = $this->aParts[$this->startPart];
		}
		if(substr($partID,0,2)=='sa'){
			$smartAttachments = self::parseSmartAttachments($this->aResult,$this->attIdPrefix);
			if($smartAttachments) foreach($smartAttachments as $attachment){
				if($attachment['part_id'] == $this->attIdPrefix.$partID){
					$context = stream_context_create(array('ssl' => array(
						'verify_host' => false,
						'verify_peer' => false,
						'verify_peer_name' => false,
						'allow_self_signed' => true
					)));
					$content = file_get_contents($attachment['url'], false, $context);
					$result['filename'] = $attachment['name'];
					$result['content'] = $content;
					$result['size'] = $attachment['size'];
					$result['type'] = $attachment['type'];
					return $result;
				}
			}
		}else{
			return false;
		}
	}

	protected static function parseVariableFromString(string $string, string $variable)
	{
		if(!preg_match('/' . $variable . '\s*=\s*"(?P<' . $variable . '>.*?)"\s*(?:;|$)/', $string, $matches)) return '';
		return $matches[$variable];
	}

	static public function parseSmartAttachments($message,$prefix = '')
	{
		$smartAttach = $message['headers']['x-icewarp-smartattach'];
		if(!is_array($smartAttach)){
			$smartAttachArray[0] = $smartAttach;
		}else{
			$smartAttachArray = $smartAttach;
		}
		$sa = 0;
		slSystem::import('tools/validate');

		foreach($smartAttachArray as $val){
			$attach = array();
			$attach['size'] = self::parseVariableFromString($val, 'size');
			$attach['name'] = self::parseVariableFromString($val, 'name');
			$attach['url'] = self::parseVariableFromString($val, 'url');
			$attach['url'] = slToolsValidate::URL($attach['url']);
			 			if(!$attach['url']){
				continue;
			}		
			$attach['all'] = self::parseVariableFromString($val, 'all');
			$attach['smart'] = true;
			$attach['part_id'] = $prefix.'sa'.$sa++;
			$attach['type'] = 'application/octet-stream';
			$smartAttachments[] = $attach;
		}
		return $smartAttachments;
	}
	
	private function getTnefPart($partID, &$info = array())
	{	
		$rtf = false;
		$origPartID = $partID;
		if(strpos($partID,".tnef.rtf.")!==false){
			$partID = explode(".tnef.rtf.",$partID);
			$rtf = true;
		}else if(strpos($partID,".tnef.")!==false){
			$partID = explode(".tnef.",$partID);
		}
		$rtfID = $partID[1];
		$partID = $partID[0];
		
		$name = slToolsFilesystem::randomFileName($this->getTempDir());
		@$part = mailparse_msg_get_part($this->mail, $partID);	
		@$info = mailparse_msg_get_part_data($part); 
		
		$result = false;	
		 		if($this->file)
			$data = @mailparse_msg_extract_part_file($part, $this->file,NULL);
		else
			$data = @mailparse_msg_extract_part($part, $this->message,NULL);

		if(defined('IW_DISABLED') && IW_DISABLED){
			file_put_contents($name,$data);
		}else{
			slToolsIcewarp::iw_file_put_contents($name,$data);
		}
		@$oTnef = tnef_parse_file($name);
		$iTnef = 0;
		if($rtf){
			@$body = tnef_get_body($oTnef);
			$result = array(
					'part_id' => $this->attIdPrefix.$partID.'.tnef.rtf.'.$rtfID,
					'type'	=> 'text/rtf',
					'filename'	=> 'attachment - '.$rtfID.'.rtf',
					'size'	=> strlen($body['rtf'][0]),
					'content' => $body['rtf'][0]
			);
			unset($oTnef);
			if(defined('IW_DISABLED') && IW_DISABLED){
				unlink($name);
			}else{
				slToolsIcewarp::iw_delete($name);
			}
			return $result;
		}
		@$attachments = tnef_list_attachments($oTnef);
		if ($attachments){ 
			foreach($attachments as $attachment){
				if((++$iTnef)==$rtfID){
					@$data = tnef_get_attachment($oTnef,$attachment['name']);
					if($attachment['name']=='smime.p7m'){
						$type = 'application/x-pkcs7-mime';
						$data = 'Content-Type:'.$type.';name=smime.p7m;'.CRLF.
								'Content-Transfer-Encoding:base64;'.CRLF.CRLF.
								wordwrap(base64_encode($data),76,CRLF,True);
					}else{
						$type = slMail::getMimeType($attachment['name']);
					}
			 		$result = array(
		 				'part_id' => $this->attIdPrefix.$partID.'.tnef.'.($iTnef),
						'type'	=> $type,
						'filename'	=> $attachment['name'],
						'size'	=> '',						'content' => $data
			 		);
				}
			}
		}
		unset($oTnef);
		if(defined('IW_DISABLED') && IW_DISABLED){
			slToolsIcewarp::iw_delete($name);
		}else{
			unlink($name);
		}
		return $result;
	}	

	 
	public function parseUUEncodedAttachment(&$body,$matches,$offset,&$partID)
	{
			$start = $matches[3][1]+strlen($matches[3][0]);
			if (!preg_match("#(end)#s",$body,$endmatches,PREG_OFFSET_CAPTURE,$offset)) {
				return false;
			}
			$length = $endmatches[1][1] - $start;
			
			$content = trim(str_replace("\r","",substr($body,$start,$length)));
			$id = ($this->attIdPrefix?$this->attIdPrefix:'1').$this->startPart.'.uuencode.';
			@$this->aUUEncodedContent[$id.$partID] = convert_uudecode($content);
			$size = strlen($this->aUUEncodedContent[$id.$partID]);

			$body = substr_replace(
				$body,
				"",
				$matches[1][1],
				$endmatches[1][1] + strlen($endmatches[1][0]) - $matches[1][1]
			);
			$aAttachment =	array(
				'part_id' => $id.$partID++,
				'cid'	 => '',
				'type'	=> 'application/octet-stream',
				'name'	=> $matches[3][0],
				'size'	=> $size,
			);
			return $aAttachment;
	}
	 
	private function recursivelyProcessEncryptedAttachments($methodName, $partID, &$params = null,&$params2 = null, &$params3 = null)
	{
		 		$needle = '.decrypt.';

		$delimiter = strpos($partID, $needle);
		if ($delimiter === false)
			throw new Exception('mailparse_get_part');
		$in = substr($partID,$delimiter + strlen($needle));
		
		$parser = $this->decryptPart(substr($partID, 0, $delimiter));
		if(!$parser->parsed){
			$parser->parse(false,$this->rawhtml);
		}
		 
		
		if($parser->blocked){
			$this->blocked = $parser->blocked;
		}
		if ($parser === false)
			throw new Exception('mailparse_get_part',$partID);
		
		$result = $parser->$methodName($in, $params, $params2, $params3);
		return $result;
	}	
	
	 
	private function checkSMimeParts(&$structure)
	{
		if (isset($structure['attachments'])) {
			foreach ($structure['attachments'] as $key => $att) {
				 				if ($att['type'] == 'application/x-pkcs7-mime' 
				|| $att['type'] == 'application/pkcs7-mime') {
					$parser = $this->decryptPart($att['part_id']);
					if ($parser !== false) {
						$part = $parser->parse(false,$this->rawhtml);
						 						if (isset($part['attachments'])) {
							foreach ($part['attachments'] as &$partAtt) {
								$aID = strval($partAtt['part_id']);
								$partAtt['part_id'] = $aID;
								$structure['attachments'][] = $partAtt;
							}
						}
            			 						 						 						 						if ($key == 0 && !$structure['plain_body'] && !$structure['html_body']) {
								$this->sMimeMessage = $part;
								if($parser->blocked){
									$this->sMimeMessage['blocked'] = $parser->blocked;
								}
						}else{
            
							$this->sMimeMessage['error'] = 1;
						}
					}else{
						 						if (strtolower($structure['attachments'][$key]['name'])=='smime.p7m'){
							unset($structure['attachments'][$key]);
						}
						$this->sMimeMessage['error'] = 1;
					}
				}
			}
		}
	}
	
	public function getSmimeType($info)
	{
		if(isset($info['info']['headers']['content-type'])){
			$contentType = $info['info']['headers']['content-type'];
		}
		if($contentType && @preg_match('#smime-type=([^;^\s]{0,})#',$contentType,$matches)){
			$smimetype = $matches[1];
		}else{
			$smimetype = '';
		}
		
		return $smimetype;
	}
	 
	private function decryptPart($partID) 
	{
		if($partID!=$this->attIdPrefix){
			$partID = str_replace($this->attIdPrefix,'',$partID);
		}
		if($partID=='1'){
			if($this->file){
				$encrypted = file_get_contents($this->file);
				$part = mailparse_msg_get_part($this->mail, 1);
				$info = mailparse_msg_get_part_data($part);
			}else{
				$encrypted = $this->message;
			}
			
		}else{
			$encrypted = $this->getPart($partID,$params);
			$info = $params;
		}
		$smimetype = $this->getSmimeType($this->aParts[$partID]);
		 		if(substr($this->aParts['1']['info']['headers']['content-type'],0,16)=='multipart/signed'){
			$this->fixSignEncryptAndSign($encrypted);
		}
		slSystem::import('mail/smime');
		$smime = new slSMime();
		$smime->setCertificateList($this->personalCertificates);
		$smime->setTempDir($this->getTempDir());

		$time = strtotime($info['headers']['date']);

		if ( $smime->decodeMessage( $encrypted, $smimetype, $cert, $isOutlookEncrypted,$isExpired,$time,$this->PassPhrase ) ) {
			if($partID!='1'){
				$this->attIdPrefix.=$partID.'.';
			}
			$attIdPrefix = ($this->attIdPrefix?$this->attIdPrefix:$partID.'.') . 'decrypt.';
			$parser = new self::$class(false, $this->ids, $this->decodeMime, $attIdPrefix, '', $encrypted );
			$parser->block_external = $this->block_external;
			$parser->download = $this->download;
			$parser->PassPhrase = $this->PassPhrase;
			if($isExpired){
				$parser->aParts[$partID]['expired'] = $isExpired;
			}
			if($cert){
				$parser->aParts[$partID]['certificate'] = $cert;
			}
			if($isOutlookEncrypted){
				$parser->aParts[$partID]['isOutlookEncrypted'] = 1;
			}
			if($parser->blocked){
				$parser->aParts[$partID]['blocked'] = 1;
			}
			return $parser;
		}
		return false;
	}
	
	public function getAttachments()
	{
		if(!$this->parsed){
			$this->parse(false,$this->rawhtml);
		}
		foreach($this->aParts as $part){
			if($this->hasAttachments($part)){
				foreach($part['attachments'] as $attachment){
					$result[] = $attachment;
				}
			}
		}
		return $result;
	}
	
	private function fixSignEncryptAndSign(&$encrypted)
	{
		$delim = "\r\n\r\n";
		$pos = strpos($encrypted,$delim);
		if($pos===false){
			$delim = "\n\n";
			$pos = strpos($encrypted,$delim);
		}
		$headers = substr($encrypted,0,$pos);
		preg_match('#Content-Type:(.*)boundary="?([^"]{1,})"?#i',$headers,$matches);
		$boundary = $matches[2];
		$headers = preg_replace('#Content-Type:(.*)boundary="?([^"]{1,})"?#i','',$headers);
		$encrypted = substr($encrypted,strpos($encrypted,$delim)+strlen($delim));
		$encrypted = substr($encrypted,strpos($encrypted,$boundary)+strlen($boundary));
		$encrypted = ltrim(substr($encrypted,0,strpos($encrypted,$boundary)-2));
	}

	function put_file($string)
	{
		fwrite($this->attachmentFile,$string);
	}
	
	static public function fixHeader($header)
	{
		return trim($header);
	}
	
	static public function overrideContentType($fileName,&$contentType)
	{
		$extStart = strpos($fileName,'.');
		$ext = substr($fileName,$extStart+1);
		switch($ext){
			case 'eml':
				$contentType ='message/rfc822';
				break;
			default:
				break;
		}
	}
	
	public function setTempDir($path)
	{
		if(!is_dir($path)){
			throw new Exception('mail_parse_temp_dir_existance');
		}
		$this->tempDir = $path;
	}
	
	public function getTempDir()
	{
		return $this->tempDir;
	}
	
	private function checkMainPartRFC822(&$partID,&$info, &$part)
	{
		if($partID=='1.1'){
			$checkpart = mailparse_msg_get_part($this->mail, '1');
			$checkinfo = mailparse_msg_get_part_data($checkpart);
			if(strpos($checkinfo['content-type'], 'message/rfc822') !== false ){
				$part = $checkpart;
				$info = $checkinfo;
				$partID='1';
			}
		}		
	}
}
?>
