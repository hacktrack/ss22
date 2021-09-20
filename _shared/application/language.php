<?php

class slLanguage
	{
		static private $instance;
		static private $oData;
		static private $aData;
		static private $sLang;
		static private $sLanguageFile;
	
	public static function instance( $lang = '' )
	{
		if(!$lang){
			$lang = self::$sLang;
			if(!$lang){
				$lang = 'en';
				self::$sLang = 'en';
			}
		}else{
			self::$sLang = $lang;
		}
		if( !isset( self::$instance[$lang] ) ){
			self::$instance[$lang] = new slLanguage( $lang );
		}
		return self::$instance[$lang];
	}	

	protected function __construct($lang = '')
	{
		$t = time();
		$m = microtime();
		try{
			self::$sLanguageFile = slSystem::getFile(
				(defined('LANGUAGE_PATH')?LANGUAGE_PATH:'language/'). $lang ,
				'lang',
				'.xml'
			);
		}catch(Exception $e){
			self::$sLanguageFile = slSystem::getFile(
					'language/en/',
					'lang',
					'.xml'
			);
			$lang = 'en';
		}

		 		$session = slSession::instance();
		$langArray = $session->getMain('["language"]["array"]');
		if(!isset($_SESSION['user']) || empty($langArray)){
			$xml = slToolsXML::loadFile( self::$sLanguageFile );
			slSystem::import('tools/xml');
			$array = slToolsXML::xml2simplearray( $xml );
			if(isset($_SESSION['user'])){
				$session->setMain('["language"]["array"]',$array);
			}
		}else{
			$array = $langArray;
		}
		 
		foreach($array as $gkey => $group){
			if($group) foreach($group as $ikey => $item){
				$array[strtolower($gkey)][strtolower($ikey)] = $item;
			}
		}
		 		self::$aData = $array;
		self::$sLang = $lang;

		 		 		 	}
	public function getID()
	{
		return self::$sLang;
	}
	
	public function get($group,$label)
	{
	    if(isset(self::$aData[strtolower($group)][strtolower($label)])){
            return strval(self::$aData[strtolower($group)][strtolower($label)]);
        }
        return '';
	}
	
	public function &language()
	{
		return self::$aData;
	}
	
	static public function getLabel($sLabel)
	{
		$aLabel = explode('|',$sLabel);
		$sResult = slLanguage::instance()->get($aLabel[0],$aLabel[1]);
		if(!$sResult){
			$sResult = $sLabel;
		}
		return $sResult;
	}
}
?>