<?php
 
class WebmailIqUpload extends XMLRequestInterface {
	private $sAID;  	private $oAccount;  	private static $aActions = array(
		'ticket'=>1,
		'xmlimage'=>1
	);

	public $oDOMQuery;
	public $oDOMUpload;
	public $oDOMFolder;
	public $oDOMFile;
	public $oDOMClass;
	public $oDOMPassphrase;
	public $oDOMHash;
	public $oDOMDoc;
	public $sClass;
	public $sType;
	public $sPassphrase;
	public $sFile;
	public $sAction;
	public $sHash;
	public $oDOMHosts;
	public $attachment;
	public $sFolder;

	 
	public function __construct($oQuery,&$oDoc,&$attrs)
	{
		$this->oDOMQuery = $oQuery;
		$this->oDOMDoc = &$oDoc;
		$this->aAttrs = &$attrs;
		$this->loadUser();
		$this->checkInputXML();
		$this->exeInputXML();
	}
	 
	private function checkInputXML()
	{
		 		if(!$this->oDOMUpload = $this->oDOMDoc->getNode('upload:upload',$this->oDOMQuery)){
			throw new Exc('upload_tag_missing','tag');
		}
		 		if($this->oDOMFolder = $this->oDOMDoc->getNode('upload:folder',$this->oDOMUpload)){
			$this->sFolder = $this->oDOMDoc->getNodeValue('upload:folder',$this->oDOMUpload);
		}
		 		if($this->oDOMFile = $this->oDOMDoc->getNode('upload:file',$this->oDOMUpload)){
			$this->sFile = $this->oDOMDoc->getNodeValue('upload:file',$this->oDOMUpload);
		}
		 		if($this->oDOMClass = $this->oDOMDoc->getNode('upload:class',$this->oDOMUpload)){
			$this->sClass = $this->oDOMDoc->getNodeValue('upload:class',$this->oDOMUpload);
		}
		if($this->aAttrs['type']=='get'){
			$this->sType = $this->oDOMUpload->getAttribute('type');
			switch($this->sType){
				case 'certificate':
					if($this->oDOMPassphrase= $this->oDOMDoc->getNode(
						'upload:passphrase',
						$this->oDOMUpload
					)){
						$this->sPassphrase = $this->oDOMDoc->getNodeValue(
							'upload:passphrase',
							$this->oDOMUpload
						);
					}
				break;
			}
			$this->attachment = $this->getAttachment($this->sFolder,$this->sFile,$this->sClass);
		}
		if($this->aAttrs['type']=='set'){
			 			if(!$this->sAction = $this->oDOMUpload->getAttribute('action')){
				throw new Exc('upload_missing_attribute','action');
			}
			
			switch($this->sAction){

				case 'socks_connect':
					foreach($this->oDOMDoc->query('/iq/upload:query/upload:upload/upload:streamhost') as $item) {
						$host['jid'] = $item->getAttribute('jid');
						$host['hash'] = $this->oDOMDoc->getNodeValue('upload:hash',$item);
						$host['host'] = $this->oDOMDoc->getNodeValue('upload:host',$item);
						$this->oDOMHosts[] = $host;
					}
				break;
				case 'socks':
					if($this->oDOMHash = $this->oDOMDoc->getNode('upload:hash',$this->oDOMUpload)){
						$this->sHash = $this->oDOMDoc->getNodeValue('upload:hash',$this->oDOMUpload);
					}else{
						throw new Exc('upload_tag_missing','hash');
					}
					$this->attachment = $this->getAttachment($this->sFolder,$this->sFile,$this->sClass);
				break;
				case 'extract':
					$this->attachment = $this->getAttachment(
						$this->sFolder,
						$this->sFile,
						$this->sClass
					);
				break;
			}
		}
	}
	
	private function getAttachment($sFolder,$sFile,$sClass)
	{
		switch($sClass){
			case 'item':
				$oUser = $_SESSION['user'];
				$oAccount = $oUser->getAccount($_SESSION['EMAIL']);
				$oFolder = $oAccount->getFolder($sFolder);
				$oItem = $oFolder->getItem($sFile);
				$class = isset($oItem->item['EVNCLASS'])?$oItem->item['EVNCLASS']:$oItem->item['ITMCLASS'];
				switch($class){
					case 'F':
					case 'M':
						$aAttachments = $oItem->aAddons['attachment']->getData();
						$gwattachment = reset($aAttachments);
						$info = [];
						$file = $oItem->getAttachmentDataFile($gwattachment['ATTNAME'],$info);
						$attachment['name'] = $info['name'];
						$attachment['size'] = $gwattachment['ATTSIZE'];
						$attachment['type'] = $info['mimetype'];
						$attachment['file'] = $file;
						break;
					case 'C':
					case 'E':
					case 'T':
					case 'N':
					case 'J':
						$attachment = [];
						$oItem->getDataFile($attachment);
						break;
				}
			break;
			default:
			case 'file':
				if(!$sFolder){
					throw new Exc('upload_tag_missing','folder');
				}
				if(!$sFile){
					throw new Exc('upload_tag_missing','file');
				}
				$oUser = &$_SESSION['user'];
				$aAttachments = $oUser->getAttachments();
				if(!($attachment = $aAttachments[$sFolder][$sFile])){
					throw new Exc('upload_attachment_missing',$sFolder.'/'.$sFile);
				}
			break;
		}
		return $attachment;
	}
	 
	private function exeInputXML()
	{
		$attachment = &$this->attachment;
		switch($this->aAttrs['type']){
			case 'get':
				switch($this->sType){
					case 'certificate':
						$this->sTemplateFile = 'webmailiqupload_set';
						$oUser = User::load($this->aAttrs['sid']);
						$data['file'] = $this->sFolder.'/'.$this->sFile;
						if($this->sPassphrase){
							$data['passphrase'] = $this->sPassphrase;
						}
						$data['file'] = $this->sFolder.'/'.$this->sFile;
						$cert = Storage::getCertificateData($oUser,$data);
						$info = Storage::getCertificateInfo(
							$cert['cert'],
							$cert['ainfo'],$xmlInfo);
						$this->aData['data'] = $xmlInfo;
						if($cert['cert']){
							$type ='public';
						}
						if($cert['pkey']){
							$type='private';
						}
						if(!$cert['cert']){
							throw new Exc('certificate_invalid');
						}
						$this->aData['type'] = $type;
					break;
					default:
						$this->sTemplateFile = 'webmailiqupload_get';
						$this->aData['name'] = slToolsPHP::htmlspecialchars($attachment['name']);
						$this->aData['type'] = slToolsPHP::htmlspecialchars($attachment['type']);
						$this->aData['ticket'] = $this->generateTicketID($attachment);
					break;
				}
			break;
			case 'set':
				$this->sTemplateFile = 'webmailiqupload_set';
				switch($this->sAction){
					case 'socks':
						@$_SESSION['user']->closeSession();
						$this->sTemplateFile = 'webmailiqupload_get';
						$this->aData['name'] = slToolsPHP::htmlspecialchars($attachment['name']);
						$this->aData['type'] = slToolsPHP::htmlspecialchars($attachment['type']);
						$this->aData['size'] = filesize($attachment['file']);
						$api = createobject("api");
						$api->SOCKSCall('sendfile', $this->sHash, 'filename=' . urlencode($attachment['file']));
					break;
					case 'socks_connect':
						@$_SESSION['user']->closeSession();
						$this->sTemplateFile = 'webmailiqupload_get';
						$api = createobject("api");
						foreach($this->oDOMHosts as $host){
							if($socket = $api->SOCKSCall('connect',$host['hash'],'host='.$host['host'])){
								$jid = $host['jid'];
								break;
							}
						}
						$this->aData['socket'] = $socket;
						$this->aData['jid'] = $jid;
						if(!$socket){
							throw new Exc('socks','connect');
						}
					break;
					case 'extract':
						$folderID = Tools::my_uniqid(date('Y-m-d',time()),true);
						$fileID = Tools::my_uniqid();
						$_SESSION['user']->addFileAttachment(
							$this->attachment['file'],
							$this->attachment['name'],
							$this->attachment['type'],
							$folderID,
							$fileID
						);
						$this->aData['folder'] = $folderID;
						$this->aData['file'] = $fileID;
						$this->aData['size'] = $this->attachment['size'];
						$this->aData['name'] = $this->attachment['name'];
						$this->aData['type'] = $this->attachment['type'];
						
					break;
				}
			break;
		}
	}

	private function generateTicketID($aAttachment)
	{
		 		$key =  WebmailIqAuth::getServerData('private');
		
		 		$aData['email'] = $_SESSION['EMAIL'];
		$aData['folder'] = $this->sFolder;
		$aData['file'] = basename($aAttachment['file']);
		$aData['name'] = $aAttachment['name'];
		$aData['type'] = $aAttachment['type'];
		if(!$aData['type'] || $aData['type']=='application/octet-stream'){
			$aData['type'] = Tools::getMimeType($aData['name']);
		}
		 		$sData = MerakGWAPI::createURLLine($aData);
		$sData = rawurlencode(base64_encode(gzcompress($sData)));
		
		 		$aData['hash'] = $sData.md5($key);
		
		 		$sData = MerakGWAPI::createURLLine($aData);
		$sData = rawurlencode(base64_encode(gzcompress($sData)));
		return $sData;
	}
}
?>
