<?php
 
class WebmailIqPublic extends PrivateAndPublic
{
	protected $sPP = 'public';

	public $oDOMQuery;
	public $aAttts;
	public $oResources;

	 
	public function __construct($oDOMQuery,&$oDOMDoc,&$attrs)
	{
		$this->oDOMQuery = $oDOMQuery;
		$this->oDOMDoc = &$oDOMDoc;
		$this->aAttrs = &$attrs;
		$this->aAttts['private'] = false;
		 
		$this->oResources = $this->oDOMDoc->query("public:resources/public:*",$this->oDOMQuery);
		if (!$this->oResources) {
			$this->oResources = $this->oDOMDoc->query("private:resources/*",$this->oDOMQuery);
		}
		if (!is_object($this->oResources)) {
			throw new Exc('settings_missing_tag','resources');
		}
		$this->loadUser();
		 
		$this->checkInputXML($oDOMDoc);
		 
		$this->exeInputXML();
	}
	 
	protected function checkInputXML($oDoc)
	{
		parent::checkInputXML($oDoc);
	}
	 	public static function get($sResourceName,$default,$domain,$user,$rights = false,$aAsD = false, $slave_domain = false)
	{
		if ($rights===false) {
			$rights = $_SESSION['ACCOUNT'];
		}
		switch($rights) {
			 			case 1:
				$result = $default;
				break;
			 			case 2:
			default:			
				$accessLevel = ($rights==1)?false:'domainadminaccess';
				$result = Storage::mergeResource($sResourceName,$domain,$default,$default,false,$accessLevel,'public',$aAsD);
				break;
		}
		 		return $result;
	}
	 	public static function set($sResourceName,$aActions,$aAsD = false,$domain = false, $rewrite = false)
	{
		if ($sResourceName!='login_settings'){
			$default = Storage::getDefaults($sResourceName);
			$domain = Storage::getDomainDefaults($sResourceName,$domain);
			 			$defaults = self::get($sResourceName, $default, $domain, false, 2);
			if ($aAsD || $_SESSION['ACCOUNT']==2) {
				$handler = $domain;
			} else {
				$handler = $default;
			}
		}
		$count=0;
		if ($aActions) {
			foreach($aActions as $action){
				$newdata['@childnodes']['item'][$count++] = $action['dataTree'];
				if (!$handler) {
					$handler = $newdata;
				}  
					 					foreach($newdata['@childnodes']['item'] as $ikey => $ival) {
						foreach($newdata['@childnodes']['item'][$ikey]['@childnodes'] as $key => $value) {							
							unset($handler['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['admin']);	 	 							if ($_SESSION['ACCOUNT']==1 && !$aAsD) {
								$handler['@childnodes']['item'][$ikey]['@childnodes'][$key] = $value;
							}
							 							if ($_SESSION['ACCOUNT']==2 || $aAsD) {
								unset($value[0]['@attributes']['domainadminaccess']);
								unset($handler['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['domainadminaccess']);
								if (
									$defaults['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['access']=='full'
								||
									!isset($defaults['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['access'])
								|| $aAsD
								){
									$handler['@childnodes']['item'][$ikey]['@childnodes'][$key] = $value;
								}
								unset($handler['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['admin']);
								if($aAsD){
									$handler['@childnodes']['item'][$ikey]['@childnodes'][$key][0]['@attributes']['admin'] = "true";}
							}
						}
					}
			 
			}
		}
		return $handler;
	}
}
?>
