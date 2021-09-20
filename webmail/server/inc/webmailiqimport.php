<?php

 
class WebmailIqImport extends XMLRequestInterface
{
	private $sAID;  	private $oAccount;  	private static $aActions = array("csv"=>1, "vcard"=>1,"vcalendar"=>1,"ldif"=>1,"groupware"=>1,"status"=>1);

	public $oDOMImport;
	public $oCharset;
	public $oDOMQuery;
	public $oDOMContainer;
	public $oDOMAccount;
	public $oDOMFolder;
	public $sFID;
	public $oDOMItems;
	public $oDOMDoc;
	public $sFullPath;
	public $sLines;
	public $sSeparator;
	public $charset;
	public $sAction;
	public $oDOMItem;
	public $sSkipFirst;
	public $oFolder;
	public $sIID;
	public $bGetSingleItem;
	public $sAttId;
	public $bGetAttach;

	 
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
		if (!$this->oDOMImport = $this->oDOMDoc->getNode("import:import",$this->oDOMQuery)) {
			throw new Exc('import_missing_tag','import');
		}
		if ($this->oDOMDoc->getNode("import:separator",$this->oDOMImport)) {
			$this->sSeparator = $this->oDOMDoc->getNode("import:separator",$this->oDOMImport);
		} else {
			$this->sSeparator = delimiterchar;
		}
		 		if ($this->oCharset = $this->oDOMDoc->getNode("import:charset", $this->oDOMImport)) {
			$this->charset = $this->oDOMDoc->getNodeValue("import:charset", $this->oDOMImport);
		}
		$this->sAction = strtolower($this->oDOMImport->getAttribute("action"));
			
		if($this->aAttrs["type"]=='set'){
			$this->sSkipFirst = $this->oDOMDoc->getNode("import:skipfirst",$this->oDOMImport)?true:false;
			 			if (!$this->sAction = strtolower($this->oDOMImport->getAttribute("action"))) {
				throw new Exc('import_missing_action');
			}
			if(!self::$aActions[$this->sAction]) {
				throw new Exc('import_invalid_action',$this->sAction);
			}
			$this->aAttrs['action'] = $this->sAction;
			if($this->sAction == 'csv') {
				$this->oDOMContainer = $this->oDOMQuery;
			} else {
				$this->oDOMContainer = $this->oDOMImport;
			}
			 			if (!$this->oDOMAccount = $this->oDOMDoc->getNode("import:account", $this->oDOMContainer)) {
				throw new Exc('import_missing_tag','account');
			}
			 			if (!$this->sAID = $this->oDOMAccount->getAttribute("uid")) {
				throw new Exc('import_missing_account_id');
			}
			 			if (!$this->oAccount = $_SESSION['user']->getAccount($this->sAID)) {
				throw new Exc('import_invalid_account_id',$this->sAID);
			}
			switch($this->sAction){
				case 'groupware':
					if (!$this->sFullPath = $this->oDOMDoc->getNodeValue("import:fullpath",$this->oDOMImport)) {
						throw new Exc('import_missing_tag','fullpath');
					}
					break;
				case 'csv':
				case 'ldif':
				case 'sif':
				case 'vcard':
				case 'vcalendar':
					if (!$this->sFullPath = $this->oDOMDoc->getNodeValue("import:fullpath",$this->oDOMImport)) {
						throw new Exc('import_missing_tag','fullpath');
					}
					 					if (!$this->oDOMFolder = $this->oDOMDoc->getNode("import:folder", $this->oDOMAccount)) {
						throw new Exc('import_missing_tag','folder');
					}
					 					if (!$this->sFID = $this->oDOMFolder->getAttribute("uid")) {
						throw new Exc('import_missing_folder_id');
					}
					 
					if(!$this->oFolder = $this->oAccount->getFolder($this->sFID)) {
						throw new Exc('import_invalid_folder_id',$this->sFID);
					}
					 					if ($this->sAction=='csv'){
						foreach($this->oDOMDoc->query('/iq/import:query/import:account/import:folder/import:item') as $item) {
							$this->oDOMItems[] = $item;
						}
						 						if (isset($this->oDOMItems[0]) && $oDOMItem = $this->oDOMItems[0]) {
							if ($this->sIID = $oDOMItem->getAttribute("uid")) {
								$this->bGetSingleItem = true;
								if ($this->sAttId = $oDOMItem->getAttribute("atid")) {
									$this->bGetAttach = true;
								}
								if (!is_object($this->oFolder->getItem($this->sIID,NO_ADDONS))) {
									throw new Exc('import_invalid_item_id',$this->sIID);
								}
							}
						}
						 
						if (!$this->oDOMItem = $this->oDOMItems[0]) {
							throw new Exc('import_missing_tag','item');
						}
						 
						 
					}
					break;
			}
		} else {
			if ($this->sAction !='status'){
				if (!$this->sLines = $this->oDOMDoc->getNodeValue("import:lines",$this->oDOMImport)) {
					throw new Exc('import_missing_tag','lines');
				}
				if (!$this->sFullPath = $this->oDOMDoc->getNodeValue("import:fullpath",$this->oDOMImport)) {
					throw new Exc('import_missing_tag','fullpath');
				}
			}
			
		}
		$this->charset = $this->charset?$this->charset:'UTF-8';
	}
	 
	private function exeInputXML()
	{
		$oUser = &$_SESSION['user'];
		$aInfo = Tools::parseFullPath($this->sFullPath,'file');
		$aAttachments = $oUser->getAttachments($aInfo['folder']);
		$aAttachment = $aAttachments[$aInfo['item']] ?? null;
		switch($this->aAttrs["type"])
		{
			case 'get':
				$this->sTemplateFile= 'webmailiqimport_get';
				
				switch($this->sAction){
					case 'status':
						if(file_exists($_SESSION['USERDIR'].'import_status.dat')){
							@$sContent = file_get_contents($_SESSION['USERDIR'].'import_status.dat');
							$data = explode(CRLF,$sContent);
							$processed = $data[0];
							$total = $data[1];
							$completed = 0;
						}else{
							$completed = 1;
						}						
						
						$this->aData['status'] = 1;
						$this->aData['processed'] = $processed ?? null;
						$this->aData['total'] = $total ?? null;
						$this->aData['completed'] = $completed;
						break;
					default:
						$aCSV = $this->csv2array($aAttachment['file'],$this->charset,$this->sLines,$this->sSeparator);
						$aCSV = $this->cnvCSV($aCSV);
						$this->aData['lines'] = $aCSV;
						break;
				}
				break;
			case 'set':
				
				switch($this->sAction){
					 					case 'csv':
						$this->csv2contacts($aAttachment['file'],$this->charset);
						break;
					case 'groupware':
						@$sGroupContentXML = file_get_contents($aAttachment['file']);
						if(!$oGWAccount = $this->oAccount->gwAccount) {
							throw new Exc('import_invalid_account_id',$this->oAccount->accountID);
						}
						$sGWSessionID = $oGWAccount->gwAPI->OpenGroup('*');
						if(!$oGWAccount->gwAPI->FunctionCall("ImportGroup",$sGWSessionID,$sGroupContentXML)) {
							$error = $oGWAccount->gwAPI->FunctionCall('GetLastError',$sGWSessionID);
							if($error!=11){
								throw new Exc('import_invalid_data',substr($sGroupContentXML,0,200));
							}
						}
						break;
					case 'vcard':
					case 'vcalendar':
					case 'ldif':
						@$sContent = file_get_contents($aAttachment['file']);
						$this->oFolder->importItem($this->sAction,$sContent);
						break;
					case 'status':
						break;
				}
				break;
		}
	}

	 
	protected function getSeparator(string $line) : string
	{
		if (preg_match_all('/(;|,|:|\t|\|)+/i', $line, $matches)) {
			$values = array_count_values($matches[1]);
			return current(array_keys($values,max($values)));
		}
		throw new Exc('import_invalid_data', 'Unknown separator.');
	}
	
	private function csv2array($filename,$charset = 'UTF-8',$lines = false,$separator = ",",$autodetect = true)
	{
		slSystem::import('tools/php');
		@$fp = fopen ($filename,"r");
		if ($autodetect) {
			$line = fread($fp, 4096);
			if($charset!='UTF-8'){
				$line = Tools::my_iconv($charset, 'UTF-8', $line);
			}
			$separator = $this->getSeparator($line);
			fseek($fp,0);
		}
        $lCount = 0;
		while($line_data = fgets($fp)){
			if($charset!='UTF-8'){
				$line_data = Tools::my_iconv($charset, 'UTF-8', $line_data);
			}
			$continue = false;
			$data = Tools::my_str_getcsv($line_data,$separator,'"',"\n",$continue);
			while($continue && $line_data = fgets($fp)) {
				$multi = Tools::my_str_getcsv($line_data,$separator,'"',"\n",$continue);
				$data[count($data)-1] .= $multi[0];
				unset($multi[0]);
				$data = slToolsPHP::array_merge($data,$multi);
			}
			$aResult[] = $data;
			if($lines && ++$lCount>=$lines) {
				break;
			}
		}
		@fclose ($fp);
		
		return $aResult;
	}
	private function cnvCSV($aCSV)
	{
		foreach($aCSV as $sLineNumber => $aLine)
		foreach($aLine as $sColNumber => $sColValue){
			$aResult['num'][$sLineNumber]['col']['num'][$sColNumber]['value'] = $sColValue;
			$aResult['num'][$sLineNumber]['col']['num'][$sColNumber]['id'] = $sColNumber;
			$aResult['num'][$sLineNumber]['id'] = $sLineNumber;
		}
		return $aResult;
	}

	 
	protected function csv2contacts(string $filename, string $charset = 'UTF-8', string $separator = ',', bool $autodetect = true)
	{
		User::closeSession();
		slSystem::import('tools/php');  		$line = 0;
		$lineCount = 0;
		$aError = [];
		$aArray = Tools::makeTreeFromXML($this->oDOMItem);

		if(!file_exists($filename)) throw new Exc('import_add_items', "Import file doesn't exist. [$filename]");

		@$fp = fopen ($filename,"r");

		if(class_exists('SplFileObject')){  			$file = new \SplFileObject($filename, 'r');
			$file->seek(PHP_INT_MAX);
			$lineCount = $file->key() + 1;
		}else{
			while(!feof($fp)){
				fgets($fp);
				$lineCount++;
			}
			fseek($fp,0);
		}

		$firstLine = fgets($fp);
		if($charset != 'UTF-8')	$firstLine = Tools::my_iconv($charset, 'UTF-8', $firstLine);
		if($autodetect) $separator = $this->getSeparator($firstLine);
		if(!$this->sSkipFirst) fseek($fp,0);

		while (@$line_data = fgets ($fp)) {
			if($charset != 'UTF-8') $line_data = Tools::my_iconv($charset, 'UTF-8', $line_data);
			if($line % 10 == 0) file_put_contents($_SESSION['USERDIR'].'import_status.dat',$line.CRLF.$lineCount);
			icewarp_keepalive($_SERVER["SERVER_THREAD"]);

			$continue = false;
			$data = Tools::my_str_getcsv($line_data, $separator,'"',"\n",$continue);

			while($continue && $line_data = fgets($fp)) {
				$multi = Tools::my_str_getcsv($line_data,$separator,'"',"\n",$continue);
				$data[array_key_last($data)] .= array_shift($multi);
				$data = slToolsPHP::array_merge($data,$multi);
			}

			$aItem = array();
			$aContactArray = $this->fillArray($aArray,$data);
			if(isset($aContactArray['@childnodes']['values'][0]['@childnodes'])) {
				foreach ($aContactArray['@childnodes']['values'][0]['@childnodes'] as $var => $val) {
					$aItem[$var] = $val[0]['@value'];
				}
			}
			if(empty($aItem['itmclassifyas'])){
				$aItem['itmclassifyas'] = $aItem['itmfirstname'].' '.$aItem['itmsurname'];
				$aContactArray['@childnodes']['values'][0]['@childnodes']['itmclassifyas'][0]['@value'] = $aItem['itmclassifyas'];
			}
			if(empty($aItem['itmsharetype'])){
				$aItem['itmsharetype'] = 'U';
				$aContactArray['@childnodes']['values'][0]['@childnodes']['itmsharetype'][0]['@value'] = $aItem['itmsharetype'];
			}
			if(isset($aItem['itmbdate'])){
				if(preg_match('/([\d]{2})([\d]{2})?[\.\s\-\/]+([\d]{2})[\.\s\-\/]+([\d]{2,4})/', $aItem['itmbdate'], $matches)){
					if(!empty($matches[2])){
						$aItem['itmbdate'] = "$matches[3]/$matches[4]/$matches[1]$matches[2]";
					}else{
						$aItem['itmbdate'] = "$matches[3]/$matches[1]/$matches[4]";
					}
				}
				$dateTime = DateTime::createFromFormat('m/d/Y', $aItem['itmbdate']);
				if($dateTime instanceof DateTime){
					$aItem['itmbdate'] = cal_to_jd(CAL_GREGORIAN, $dateTime->format('n'),$dateTime->format('j'),$dateTime->format('Y'));
					$aContactArray['@childnodes']['values'][0]['@childnodes']['itmbdate'][0]['@value'] = $aItem['itmbdate'];
				}
			}
			try{
				$item = $this->oFolder->createItem($aItem, $aContactArray);
				unset($item->aAddons);
			} catch (Exc $e){
				$aError[] = $line;
			}
			$line++;
		}

		@unlink($_SESSION['USERDIR'] . 'import_status.dat');
		if(!empty($aError)) throw new Exc('import_add_items', implode(",", $aError));
		@fclose ($fp);
	}

	private function fillArray($aArray,$aCSVLine)
	{
		$aArray = $this->fill_r($aArray,$aCSVLine);
		return $aArray;
	}
	private function fill_r($aArray,$aCSVLine)
	{
		foreach($aArray as $key => $val) {
			if (is_array($val)) {
				$aResult[$key] = $this->fill_r($aArray[$key],$aCSVLine);
			} else {
				if($aCSVLine[$val]) {
					$aResult[$key] = str_replace("\r\n"," ",$aCSVLine[$val]);
				} else{
					$aResult[$key] = is_numeric($val)?'':$val;
				}
			}
		}
		return $aResult;
	}
}
?>
