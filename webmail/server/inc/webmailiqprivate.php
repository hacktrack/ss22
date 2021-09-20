<?php
 
class WebmailIqPrivate extends PrivateAndPublic
{
	public $aAttts;
	public $sDirectory;

	protected $sPP;  	 
	public function __construct($oDOMQuery,&$oDOMDoc,&$attrs)
	{
		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->aAttts['private'] = true;
		$this->sPP = 'private';
		$this->oResources = $this->oDOMDoc->query("private:resources/private:*",$this->oDOMQuery);
		if (!$this->oResources) {
			$this->oResources = $this->oDOMDoc->query("private:resources/*",$this->oDOMQuery);
		}
		$this->sDirectory = @$_SESSION['USERDIR'];
		 		$this->loadUser();
		parent::checkInputXML($oDOMDoc);
		$this->exeInputXML();
	}
	public static function get($sResourceName, $default, $domain, $user, $rights = false,$aAsD = false,$slave_domain = false)
	{	
		$data = [];

		 		$settingsState = 0;
		$settingsState += $default?1:0;
		$settingsState += $domain?2:0;
		$settingsState += $user?4:0;
		$settingsState += $slave_domain?8:0;

		switch($settingsState) {
			
			 			case 3:
				$data = Storage::mergeResource($sResourceName,$domain,$default,$default,false,'domainadminaccess');
				$data = Storage::mergeResource($sResourceName,$data,$data,$data,false,'useraccess');
				break;
			 			case 7:
				$tmp = WebmailIqPublic::get($sResourceName,$default,$domain,$user,2);
				$data = Storage::mergeResource($sResourceName,$user,$tmp,$tmp,false);
				break;
			 			case 6:
				$data = Storage::mergeResource($sResourceName,$user,$domain,$domain,false);
				break;
			 			case 5:
				$data = Storage::mergeResource($sResourceName,$user,$default,$default,false);
				break;
			 			case 4:
				$data = $user;
				break;
			 			case 2:
				if($sResourceName == 'groups'){
					$data = $domain;
				}else{
					$data = self::removeAttrs($domain,0);
				}
				break;
			 			case 1:
				if($sResourceName == 'groups'){
					$data = $default;
				}else{
					$data = self::removeAttrs($default,0);
				}
				break;
			 			case 8:
				if($sResourceName == 'groups'){
					$data = $slave_domain;
				}else{
					$data = self::removeAttrs($slave_domain,0);
				}				
				break;
			 			case 9:
				$data = Storage::mergeResource($sResourceName,$slave_domain,$default,$default,false,'domainadminaccess');
				$data = Storage::mergeResource($sResourceName,$data,$data,$data,false,'useraccess');
				break;
			 			case 10:
				$data = Storage::mergeResource($sResourceName,$slave_domain,$domain,$domain,false,'domainadminaccess');
				$data = Storage::mergeResource($sResourceName,$data,$data,$data,false,'useraccess');				
				break;
			 			case 11:
				$tmp = Storage::mergeResource($sResourceName,$domain,$default,$default,false,'domainadminaccess');
				$data = Storage::mergeResource($sResourceName,$slave_domain,$tmp,$tmp,false,'useraccess');			
				break;
			 			case 12:				
				$data = Storage::mergeResource($sResourceName,$user,$slave_domain,$slave_domain,false);
				break;
			 			case 13:
				$tmp = WebmailIqPublic::get($sResourceName,$default,$slave_domain,$user,2);
				$data = Storage::mergeResource($sResourceName,$user,$tmp,$tmp,false);
				break;
			 			case 14:
				$tmp = WebmailIqPublic::get($sResourceName,$domain,$slave_domain,$user,2);
				$data = Storage::mergeResource($sResourceName,$user,$tmp,$tmp,false);
				break;
			 			case 15:
				$tmp = WebmailIqPublic::get($sResourceName,$default,$domain,$user,2);
				$tmp = WebmailIqPublic::get($sResourceName,$slave_domain,$tmp,$tmp,2);
				$data = Storage::mergeResource($sResourceName,$user,$tmp,$tmp,false);
				break;
		}
		return $data;
	}
	public static function set($sResourceName,$aActions,$aAsD = false,$domain = false,$rewrite = false)
	{
		$domain = Storage::getDomainDefaults($sResourceName);
		$default = Storage::getDefaults($sResourceName);
		$user = Storage::getUserData($sResourceName);
		$data = self::get($sResourceName, $default, $domain, $user);
		if ($aActions) {
			foreach($aActions as $action) {
				$newdata['@childnodes']['item'][] = $action['dataTree'];
			}
			 			if (!$data || $rewrite){
				$items = $newdata;
			 			} else {
				$items = Storage::mergeResource($sResourceName,$user,$newdata,$data,true,'access');
			}
		}
		if($sResourceName=='cookie_settings'){
			$items['@attributes']['version'] = 12;
		}
		return $items;
	}
}
?>
