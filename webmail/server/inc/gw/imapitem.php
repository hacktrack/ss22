<?php
 
class GroupWareItemMail extends CacheItem
{
	public $partID;
	public $wmclass;
	public $gwItem;
	public $attachmentID;
	public $startPartID;
	public $parser;

    public function __construct(&$item, &$partID, &$parser, $attachmentID ,$startPartID )
	{
		
		$this->parser = &$parser;
		$this->item = &$item->item;
		$this->gwItem = &$item;
		$this->folder = &$item->folder;
		$this->partID = $partID;
		$this->attachmentID = $attachmentID;
		$this->itemID = $item->item['EVN_ID'];
		$this->startPartID = $startPartID;
		$this->wmclass = 'M';
	}

	public function getMessageFile()
	{
		return $this->parser->file;
	}

	public function getMessage()
	{
		if($this->parser->file){
			return file_get_contents($this->parser->file);
		}
		return $this->parser->message;
	}

	public function delete($cache = [], $delayed = false)
	{
	}

	public function move($folder, $cache = [], $delayed = false)
	{
	}

	public function parseMessage($decodeMime = true, $partID = 1, &$newMessage = false,
		$block_external = false, &$blocked = false,$download = false,$source = false, $rawhtml = false, $passphrase = '', $purify = true)
	{
		$ids = array();
		$ids['account_id'] = $this->gwItem->folder->account->account->accountID;
		$ids['folder_id'] = $this->gwItem->folder->name;
		$ids['item_id'] = $this->itemID.'|'.($this->startPartID?($this->attachmentID.'|'.$this->startPartID):$this->attachmentID);
		$ids['sid'] = session_id();
		 		$filename = $this->getMessageFile();
		 		$parser = new MailParse($filename, $ids, $decodeMime,'', $partID, '', $purify);
		$parser->PassPhrase = $passphrase;
		$parser->block_external = $block_external;
		$parser->download = $download;
		$structure = $parser->parse();

		if($source){
			$fp = fopen($filename,'rb+');
			$structure['source'] = fread($fp,1024000);
			fclose($fp);
			if(filesize($filename) > 1024000){
				$structure['source'] .= CRLF.'--- Truncated ---';
			}
		}		
		$blocked = $parser->blocked;
		if ($structure['info']['headers']){
			foreach ($structure['info']['headers'] as $header => $value){
				if ($value){
					if (is_array($value)){
						foreach ($value as $hval){
							$structure['headers_plain'] .= ucfirst($header) . ': ' . $hval . CRLF;
						}
					}else{
						$structure['headers_plain'] .= ucfirst($header) . ': ' . $value . CRLF;
					}
				}
			}
		}
		$stFlags = $this->getFlagsFromStructure($message, $structure, true, $filename);
		$this->hasAttachments = $stFlags['has_attachment'];
		$this->sMimeStatus = $stFlags['smime_status'];
		$this->from = $structure['headers']['from'];
		$this->sort_from = Tools::dbSortValue($this->from);
		$this->to = $structure['headers']['to'];
		$this->sort_to = Tools::dbSortValue($this->to . $this->cc . $this->bcc . $this->
			sms);
		$this->date = strtotime($structure['headers']['date']);
		if ($cc = $structure['headers']['cc'])
		{
			$this->cc = $cc;
			$this->sort_cc = Tools::dbSortValue($cc);
		}
		if ($bcc = $structure['headers']['bcc'])
		{
			$this->bcc = $bcc;
			$this->sort_bcc = Tools::dbSortValue($bcc);
		}
		if ($sms = $structure['headers']['sms'])
		{
			$this->sms = $sms;
			$this->sort_sms = Tools::dbSortValue($sms);
		}
		$this->priority = intval($structure['headers']['priority']);
		$this->subject = $structure['headers']['subject'];
		$this->message_id = $structure['headers']['message-id'];
		 		return $structure;
	}
	
	public function getPart($partID,&$info = array())
	{
		return $this->parser->getPart($partID,$info);
	}
	
	public function getAttachmentDataFile($partID,&$attInfo = array())
	{
        $info = [];
		$file = $this->parser->getPartFile($partID,$info);
		$attInfo['name'] = MailParse::getAttachmentName($info['info'],$partID);
		$attInfo['mimetype'] = $info['info']['content-type'];
		return $file;
	}
	
	
	public function sendData($passphrase = '')
	{
		$this->parseMessage(false);
		return parent::sendData();
	}
	
	public function sendAttachment($partID,$startID,$ids = array(),$sForceName = false,$resize = false,$atttype='',$skin = false, $passphrase = '', $return = false)
	{
		$this->parseMessage(true,$partID,$newMessage,false,$blocked,false,false,false,$passphrase);
		return parent::sendAttachment($partID,$startID,$ids,$sForceName,$resize,$atttype, $skin, $passphrase, $return);
	}


    public function getLocalMessage($file = null){}

    public function autoCreateMessage($filename = null){}
}
