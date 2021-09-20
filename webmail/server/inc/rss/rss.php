<?php

class RSS
{
	private static $instance;

	public $sEncoding;
	public $rssDoc;

	 
	public static function instance($account) 
	{
		$index = $account->accountID;
		if (!isset(self::$instance[$index])) {
			$rss = __CLASS__;
			self::$instance[$index] = new $rss();
		}

		return self::$instance[$index];
	}
	
	private function __construct($sEncoding = "UTF-8")
	{
		$this->sEncoding = $sEncoding;
		$this->rssDoc = slToolsDOM::open($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);

	}
	public function createFolder($sName,$sType,$sChannel)
	{
		$this->rssDoc = slToolsDOM::open($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
		if (!is_object($this->rssDoc)) {
			$this->rssDoc =  new slToolsDOM($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
			$rssNode = new DOMElement('rss');
			$this->rssDoc->appendChild($rssNode);
		} else {
			$rssNode = $this->rssDoc->getNode('/rss');
		}
		 
		if(@$this->rssDoc->query("/rss/folder[@name='".$sName."'")){
			throw new Exc('folder_already_exists',$sName);
		}
		if($sChannel){
			if(!@$fp = $this->checkChannel($sChannel)){
				throw new Exc('rss_invalid_channel',$sChannel);
			}else{
				fclose($fp);
			}
		}
		 
		$folderNode = $rssNode->appendChild(new DOMElement('folder'));
		$folderNode->setAttribute('name',$sName);
		$folderNode->nodeValue = slToolsPHP::htmlspecialchars($sChannel);
		$this->rssDoc->save();
	}

	public function editFolder($sOldName,$sName,&$sChannel,$bChannelChange = false)
	{
		
		$this->rssDoc = slToolsDOM::open($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
		 		$nodes = $this->rssDoc->query("/rss/folder[@name='".$sOldName."']");
		if($nodes){
			foreach($nodes as $channelNode){
				$result = $channelNode;
			}
		}
		if(!$result){
			throw new Exc('folder_does_not_exist',$sOldName);
		}
		 		if($sName){
			Folder::checkName($sOldName);
			Folder::checkRename($sOldName,$sName);
			$result->setAttribute('name',$sName);
			 			$domFolders = $this->rssDoc->query("/rss/folder");
			if($domFolders){
				foreach($domFolders as $channelNode){
					if($sFolder = $channelNode->getAttribute('name')){
						if(strpos($sFolder,$sOldName.'/')!==false){
							$name = preg_replace("#$sOldName#",$sName,$sFolder,1);
							$channelNode->setAttribute('name',$name);
						}
					}
				}
			}
		}
		 		if($bChannelChange){
			if(@$fp = $this->checkChannel($sChannel)){
				@fclose($fp);
			}else{
				if($sChannel){
					throw new Exc('rss_invalid_channel',$sChannel);
				}
			}
			@$result->nodeValue = slToolsPHP::htmlspecialchars($sChannel);
		}
		$this->rssDoc->save();
	}

	public function deleteFolder($sName)
	{
		$file = $_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile;
		if (!is_object($this->rssDoc)) {
			$this->rssDoc = slToolsDOM::open($file);
			$rssNode = $this->rssDoc->appendChild(new DOMElement('rss'));
		} else
			$rssNode = $this->rssDoc->getNode('/rss');

         
    $oDOMFolders = $this->rssDoc->query("/rss/folder");
    if($oDOMFolders){
			foreach($oDOMFolders as $channelNode){
	      $sFolderName = $channelNode->getAttribute("name");
	      if(strpos($sFolderName,$sName.'/')!==false || $sFolderName == $sName){
	        $rssNode->removeChild($channelNode);
	        $result = true;
	      }
	    }
    }

    if(!$result)
      throw new Exc('folder_does_not_exist',$sName);
  
    $this->rssDoc->save();

  }
      
  public function getChannels()
  {
  	$this->rssDoc = slToolsDOM::open($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
    $oUser = &$_SESSION['user'];
    $rssDoc =  $this->rssDoc;
    
    if (!is_object($rssDoc)) {
      return array();
    } 
	$query = $rssDoc->query('/rss/folder');
	if($query){
		foreach ($query as $channelNode){
			$channel = false;
			$channel->name = $channelNode->getAttribute("name");
			$channel->channel = $channelNode->nodeValue;
			$channel->rights = Folder::DEFAULT_RIGHTS;
			$aResult[] = $channel;
		}
	}

		return $aResult;
	}
	
	public function getChannelURL($name)
	{
		$rssDoc =  $this->rssDoc;
		if (!is_object($rssDoc)) {
			return false;
		}
		$query = $rssDoc->query("/rss/folder[@name='".$name."']");
		if($query){
			foreach($query as $channelNode){
				return $channelNode->nodeValue;
			}
		}
		return false;
	}

	public function getItemsID(&$folder)
	{
		$aResult  = array();
		if(!@$fp = $this->checkChannel($folder->channel)){
			throw new Exc('rss_invalid_channel',$folder->channel);
		}
		while($buffer = @fread($fp,65535)){
			$xml.=$buffer;
		}
		@fclose($fp);
		$test = @simplexml_load_string($xml);
		if(!$test){
			$test = Tools::fixXML($xml);
		}
		if(!$test){
			throw new Exc('rss_invalid_channel',$folder->channel);
		}
		if($test){
			 			if($test->channel){
				$folder->channelName = strval($test->channel->title);
				if($test->channel->item){
					$itmPointer = &$test->channel->item;
				}
				if($test->item){
					$itmPointer = &$test->item;
				}
				if($itmPointer){
					foreach($itmPointer as $item){
						$itm = $this->parseRSS($item,$folder);
						$aResult[$itm->uid] = $itm;
					}
				}
			 			} else {
				$folder->channelName = strval($test->title);
				$url = str_replace($test->link["href"],"",$folder->channel);
				if($test->entry){
					foreach($test->entry as $item){
						$itm = $this->parseATOM($item,$folder);
						$aResult[$itm->uid] = $itm;
					}
				}
			}
		}
		return $aResult;
	}
	
	private function parseRSS($item,&$folder)
	{
		$itm = false;
		if($item->guid)
			$itm->uid = strval($item->guid);
		else
			$itm->uid = md5(trim(strval($item->link)) . trim(strval($item->title)));
		 
		$itm->subject = str_replace("&nbsp;"," ",Tools::unhtmlspecialchars(strval($item->title)));
		$itm->subject = Tools::decodeASCII($itm->subject);
		
		@$itm->from = slToolsPHP::htmlspecialchars(strval($folder->channelName));
		$itm->date = strval($item->pubDate);
		$itm->to = strval($item->link);
		$itm->body = strval($item->description);
		return $itm;
	}

	private function parseATOM($item,&$folder)
	{
		$itm = false;
		if($item->id){
			$itm->uid = strval($item->id);
			$sTo = $itm->uid;
		}else
			$itm->uid = md5(trim(strval($item->link)) . trim(strval($item->title)));
		
		$itm->subject = Tools::unhtmlspecialchars(strval($item->title));
		$itm->subject = Tools::decodeASCII($itm->subject);
		
		@$itm->from = slToolsPHP::htmlspecialchars($folder->channelName);

		$itm->date = strval($item->updated);
		if($item->link){
			foreach($item->link as $link)
				$aLinks[strtolower(strval($link["rel"]))] = strval($link["href"]);
		}
		if($aLinks['alternate'])
			$itm->to = $aLinks['alternate'];
		else if($aLinks['self'])
			$itm->to = strval($aLinks['self']);
		
		if(strpos($itm->to,'http://')===false){
			if($aLinks['via']){
				if(strpos($aLinks['via'],'http://')!==false){
					$itm->to = $aLinks['via'];
				}else{
					$itm->to = $aLinks['alternate'];
				}
			}else{
			$itm->to = $sTo;
			}
		}
		
		$itm->body = Tools::unhtmlspecialchars(strval($item->content->asXML()));
		if(!$itm->body){
			$itm->body = Tools::unhtmlspecialchars(strval($item->summary));
		}
		return $itm;
	}
	public function checkChannel($sChannel)
	{
		$sChannel = str_replace(array('rss://', 'feed://'), 'http://', $sChannel);
		if(!realpath($sChannel)){
			if (!@$fp = fopen($sChannel, 'rb')){
				throw new Exc('rss_invalid_channel', $sChannel);
			}
		}else{
			throw new Exc('rss_invalid_channel', '[Attack warning] file enumeration for file '.realpath($sChannel));
		}
		return $fp;
	}
	
	public function drop(){}
	
	
	
	public function clear()
	{
		slSystem::import('tools/icewarp');
		slToolsIcewarp::iw_delete($_SESSION['USERDIR'].SETTINGS_FOLDER . rssfile);
	}
	
	}

?>
