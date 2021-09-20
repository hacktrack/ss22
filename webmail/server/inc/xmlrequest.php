<?php
 
abstract class XMLRequestInterface 
{
	public $oDoc;			 	public $oQuery;			 	public $aAttrs;			 	public $aData;		 	 	public $sTemplatePath = "inc/templates/";  	 	public $sTemplateFile = 'default';		 	 	public $sFormatType = 'xml';		 		 
	public $sInputXML;
	public $sRootType;

	 	private static $aFreeXMLNSAction = Array(
			'webmail:iq:accounts' => array('signup'=>true)
	);

	 
	public function answer()
	{
		 
		$sPath = $this->sTemplatePath.$this->sTemplateFile.templateext;

		 
		if (!file_exists($sPath)) throw new Exc('xmlrequest_path',$sPath);

		 
		$this->aData['xmlNameSpace'] = $this->aAttrs['namespace'];

		$tpltype = str_replace($this->sTemplatePath,'',$sPath);

		$treatedInternally = [
			'webmailiqfriends_get.tpl',
			'webmailiqitems_get.tpl',
			'webmailiqgroups_get.tpl',
			'xmlrequest_iq_result.tpl',
			'xmlrequest_iq_error.tpl',
			'webmailiqprivateandpublic_get.tpl',
			'webmailiqupload_set.tpl',
			'webmailiqtools_get.tpl'
		];
		 		if ($this->sFormatType == 'xml' && !in_array(strtolower($tpltype), $treatedInternally)){
			$this->aData = Tools::htmlspecialchars_array($this->aData);
		}
		return trim(template($sPath,$this->aData));
    }

	 
	public static function checkFreeAction($sNamespace,$sAction)
	{
		if(!isset(self::$aFreeXMLNSAction[$sNamespace][$sAction]))
			throw new Exc('xmlrequest_access_denied');
		return true;
	}

	private function checkInputXML($oDoc){}
	private function exeInputXML(){}
	protected function loadUser()
	{
		 		if ($this->aAttrs["sid"]!="" && isset($this->aAttrs["sid"])){
			User::load($this->aAttrs["sid"]);
			$this->aData['teamchat_token'] = $_SESSION['TEAMCHAT_TOKEN'];
		}
	}

	 
	public function setBoolValFromDOMDoc(& $variable, string $key, $node = null)
	{
		if ($variable = $this->oDOMDoc->getNode($key, $node)) {
			$variable = (bool)$this->oDOMDoc->getNodeValue($key, $node) == 'true';
		}
		return $variable;
	}

	 
	public function setValFromDOMDoc(& $variable, string $key, $node = null)
	{
		if ($variable = $this->oDOMDoc->getNode($key, $node)) {
			$variable = $this->oDOMDoc->getNodeValue($key, $node);
		}
		return $variable;
	}
}

 
class XMLRequest extends XMLRequestInterface
{
		 		private $aXMLRootTags = Array(
			'iq' => 'WebmailIq',
		);  
		 		private $aXMLNS = Array(
		    'webmail:iq:items' => 'Items',
		    'webmail:iq:folders' => 'Folders',
			'webmail:iq:accounts' => 'Accounts',
        	'webmail:iq:private' => 'Private',
			'webmail:iq:public' => 'Public',
			'webmail:iq:message' => 'Message',
			'webmail:iq:freebusy' => 'FreeBusy',
			'webmail:iq:spellchecker' => 'SpellChecker',
			'webmail:iq:import' => 'Import',
			'webmail:iq:auth' => 'Auth',
			'webmail:iq:upload' => 'Upload',
			'webmail:iq:tools' => 'Tools'
		);
		 		private $aFreeXMLNS = Array(
			'webmail:iq:auth' => 'Auth',
			'webmail:iq:accounts' => 'Accounts',
			'webmail:iq:public' => 'Public',
			'webmail:iq:freebusy' => 'FreeBusy',
			'webmail:iq:private' => 'Private',
		);
		
		private $aQuery = Array(); 
		
		 
		function __construct()
		{
			 			foreach($this->aXMLNS as $key => $val){
				$this->aQuery[$key] = "/iq/".strtolower($val).":query";
			}
			 			$oInputStream = new InputStream();
			 			$this->sInputXML = $oInputStream->getString();
			 			$this->checkInputXML($oInputStream->getDOM());
			 			unset($oInputStream);
			           	$this->exeInputXML();
		}

		 
		private function checkInputXML($oDoc)
		{	
			global $xmlrequest_sid,$xmlrequest_uid;
			
        	$iQueryCount = 0;	         	$sNS		 = "";   
			 			$this->sRootType = strtolower($oDoc->documentElement->tagName);
			$xmlrequest_sid = $this->aAttrs["sid"] = $oDoc->documentElement->getAttribute('sid');
			$xmlrequest_uid = $this->aAttrs["id"] = $oDoc->documentElement->getAttribute('uid');
			if ($format = $oDoc->documentElement->getAttribute('format')){
				$this->sFormatType = strtolower($format);
			}else{
				$this->sFormatType = 'xml';
			}
			$sRequest = $oDoc->getNodeContent($oDoc->documentElement);

			 			if ($this->sRootType == 'iq'){
				 				$this->aAttrs["type"] = $oDoc->documentElement->getAttribute('type');
				
				 				switch($this->aAttrs["type"]){
					case 'get':
					case 'set': 
						break;  
					case ''	: 
						$this->aAttrs["type"]="get"; 
						break;
					default	: 
						log_buffer(
							$this->sInputXML,
							'REQUEST',
							$this->aAttrs
						);
						throw new Exc('xmlrequest_invalid_type',$this->aAttrs["type"]);
				}
										
				 				foreach ($this->aQuery as $sQuery) {
					 foreach ($oDoc->query($sQuery) as $oQuery) {
            			$iQueryCount++;
						 						if (!$sNS = $oQuery->namespaceURI){
							log_buffer(
								$this->sInputXML,
								'REQUEST',
								$this->aAttrs
							);
							throw new Exc ('xmlrequest_missing_xmlns');
						}
						 						if ( (!isset($this->aAttrs["sid"]) || $this->aAttrs["sid"]=="")
							&& !isset($this->aFreeXMLNS[$sNS]) ){
								log_buffer(
									$this->sInputXML,
									'REQUEST',
									$this->aAttrs
								);
							throw new Exc ('xmlrequest_invalid_sid');
						}
						$this->aAttrs["namespace"] = $sNS;
					 }
				}
				log_buffer(
					'Request start ('.$this->aAttrs['sid'].')',
					'EXTENDED',
					$this->aAttrs
				);
				 				if (!$iQueryCount){
					log_buffer(
							$this->sInputXML,
							'REQUEST',
							$this->aAttrs
					);
           			throw new Exc ('xmlrequest_missing_tag','query');
				}
        	}
				
			if($this->aAttrs['sid']){
				try{
					User::load($this->aAttrs['sid']);
				}catch(Exception $e){
					
				}
			}
			 			$this->oDoc = $oDoc;
        	log_buffer(
				$this->sInputXML,
				'REQUEST',
				$this->aAttrs
			);
        	unset($this->sInputXML);				
			return true;
		}
		

		
		
     
		private function exeInputXML() {
		
		     
				$this->aData['subAnswer'] = '';
				foreach ($this->aQuery as $sQuery) 
				  foreach($this->oDoc->query($sQuery) as $oQuery){
					  
					   
					  $sNS = $oQuery->namespaceURI;
					  $this->aAttrs['namespace'] = $sNS;
					  $classConstructor = $this->aXMLRootTags[$this->sRootType].$this->aXMLNS[$sNS];

					   
					  if (!class_exists($classConstructor))
						 throw new Exc ('xmlrequest_missing_class',$classConstructor);

					   
					  $cSubRequest = new $classConstructor($oQuery,$this->oDoc,$this->aAttrs);

					  $this->aData['subAnswer'] .= $cSubRequest->answer();
				}
				  
				if(!$this->aData['subAnswer']) unset($this->aData['subAnswer']);
        
				  
				$this->aData['sid'] = $this->aAttrs["sid"];
				$this->aData['id']  = slToolsPHP::htmlspecialchars($this->aAttrs["id"]);
				$this->aData['ns']  = $this->aAttrs["namespace"];
				$this->aData['teamchat_token'] = $cSubRequest->aData['teamchat_token'] ?? null;
				if(isset($cSubRequest->isError) && $cSubRequest->isError){
					$postfix = 'error';
				}else{
					$postfix = 'result';
				}
				$this->sTemplateFile= 'xmlrequest_'.$this->sRootType.'_'.$postfix;
 		}
		

}
?>
