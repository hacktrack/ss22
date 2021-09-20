<?php
 
class MailParse extends slMailParse
{
    public $tempDir = '';

	public function __construct($file = '',$ids = array(), $decodeMime = false, $attIdPrefix = '',$partID = '1',$fromString = '', $purify = true)
	{
		parent::__construct($file,$ids,$decodeMime,$attIdPrefix,$partID,$fromString, $purify);
		self::$defaultCharset = $_SESSION['DEFAULTCHARSET'];
		 		$this->personalCertificates = Storage::getPersonalCertificates();
	}
	
	public function getTempDir()
	{
		if($_SESSION['user']) {
			$dir = User::getDir() . '~upload/';
			if(!is_dir($dir)) {
				slSystem::import('tools/filesystem');
				slToolsFilesystem::mkdir_r($dir, 0777, true);
			}
		} else {
			$api = createobject('API');
			$dir = $api->getProperty("C_System_Storage_Dir_TempPath").'webmail/';
		}
		$this->tempDir = $dir;
		return $dir;
	}
}
?>