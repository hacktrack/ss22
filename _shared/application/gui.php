<?php

slSystem::import('application/helper');
slSystem::import('application/language');

  

class slGUI
{
	static private $instance;
	static private $aTemplate;
	static private $aCachedFiles;
	private $skin;
	private $view;
	private $aJavascript;
	private $aStylesheet;
	private $aError;
	private $model;
	private $body;

    public $skinDefault;
    public $outputType;
    public $templateOverride;
	 	 	 	protected function __construct( &$application )
	{
		$this->skinDefault = 'default';
		$this->application = &$application;
	}
	
	static public function instance( &$application = false )
	{
		if(!isset(self::$instance)){
			if(!$application){
				slApplication::errorStatic('application_missing');
			}
			self::$instance = new slGUI( $application );
		}
		return self::$instance;
	}
	
	public function message( $msg )
	{
		 	}
	 	 	 	public function setSkin( $skin )
	{
		if($this->checkSkin( $skin )){
			$this->skin = $skin;
		}
		return true;
	}
	
	public function getSkin()
	{
		return $this->skin;
	}
	
	 	 	 	public function setView( $view )
	{
		if($this->checkView( $view )){
			$this->view = $view;
		}
	}
	
	public function checkView( $view )
	{
		return true;
	}
	
	public function checkSkin( $skin )
	{
		return true;
	}
		
	public function getView()
	{
		return $this->view;
	}
	 	 	 	public function setJavascript($sFile)
	{
		$this->aJavascript[$sFile]['src'] = $this->getFile('javascript',$sFile);
	}
	public function getJavascript()
	{
		return $this->aJavascript;
	}
	public function delJavascript($sFile = false)
	{
		if($sFile===false){
			unset($this->aJavascript);
		}else{
			unset($this->aJavascript[$sFile]);
		}
		return true;
	}
	 	 	 	public function setStylesheet($sFile, $attr = [])
	{
		try{
			$this->aStylesheet[$sFile]['src'] = $this->getFile('stylesheet',$sFile);
			if (!empty($attr)) {
				foreach($attr as $key=>$a) {
					$this->aStylesheet[$sFile][$key] = strval($a);
				}
			}
		}catch(Exception $styleExc){}
	}
	public function getStylesheet()
	{
		return $this->aStylesheet;
	}
	
	public function delStylesheet($sFile = false)
	{
		if($sFile===false){
			unset($this->aStylesheet);
		}else{
			unset($this->aStylesheet[$sFile]);
		}
		return true;
	}
	
	public function setOutputType( $outputType )
	{
		$this->outputType = $outputType;
	}
	
	public function getOutputType()
	{
		return $this->outputType;
	}
	
 
	public function setError($sError)
	{
		$this->aError[] = array('error'=>$sError);
	}
	
	static public function setTemplateData($array)
	{
		if($array) foreach($array as $var => $val ){
			slVariable::setDotted( $var,$val,self::$aTemplate );
		}
	}
	
	static public function getTemplateData()
	{
		if(!is_array(self::$aTemplate)){
			self::$aTemplate = array();
		}
		return self::$aTemplate;
	}
	
	 
	public function setTemplateOverride($templates)
	{
		if(is_array($templates) && !empty($templates)){
			foreach($templates as $object => $template){
				$this->templateOverride[$object] = $template;
			}
		}
	}
	
	public function getOverridenTemplate($object)
	{
		if(!isset($this->templateOverride[$object])){
			return false;
		}
		return $this->templateOverride[$object];
	}

	public function clearTemplateOverride($templates)
	{
		if(is_array($templates) && !empty($templates)){
			foreach($templates as $object => $template){
				if(isset($this->templateOverride[$object])){
					unset($this->templateOverride[$object]);
				}
			}
		}
	}
	
	
 
	static public function template($sTemplate,$aData = array())
	{
		global $templateProcessingTime;
		$t = time();
		$m = microtime();
		slSystem::import('application/language');
		$oLanguage = slLanguage::instance();
		$oRequest = slRequest::instance();
		$aData['request'] = $oRequest->data();
		$aData['request']['errorData'] = $oRequest->get('errorData');
		$aData['request']['query_string'] = $oRequest->getQueryString();
		$aData['request']['path'] = $oRequest->getPath();
		$aData['lang'] = $oLanguage->language();
		$aAdditionalData = self::getTemplateData();
		if($aAdditionalData){
			$aData = self::merge_r($aData,$aAdditionalData);
		}
		if(file_exists($sTemplate)){
			$string = false;
		}else{
			$string = true;
		}
		$result = template($sTemplate,$aData,$string);
		$templateProcessingTime+=time()-$t+microtime()-$m;
		return $result;
	}
	
	static public function merge_r( $arr1, $arr2 )
	{
		$result = $arr1;
		if(is_array($arr2)){
			foreach($arr2 as $key => $val){
				$result[$key] = self::merge_r($arr1[$key],$arr2[$key]);
			}
		}else{
			$result = $arr2;
		}
		return $result;
	}
	
	 
	public function getDescriptor()
	{
		$sPath = $this->getFile('view',$this->getView(),'.xml');
		if(!$sPath){
			throw new Exception('file_does_not_exist:'.slToolsPHP::htmlspecialchars($this->getView()));
		}
		$oXML = slToolsXML::loadFile($sPath);
		return $oXML;
	}
	
	
	public function draw(&$oXML = false)
	{
		if(!$oXML){
			$oXML = $this->getDescriptor();
		}
		$sBody = '';
		$aBody = array();
		
		 		$aConstruct['objID'] = 'window';
		$aConstruct['xml'] = &$oXML;
		 		$oObjClass = slGUI::instanceWidget( $aConstruct );
		if(!$oObjClass){
			throw new Exception('GUI:Main window creation failed!');
		}
		$oObjClass->create( $aConstruct );
		if($this->aError){
			$oObjClass->setTemplateData('error',$this->aError);
		}
		$sBody .= $oObjClass->getBody($oXML);
		return $sBody;
	}
	
	 
	static public function &instanceWidget(&$aConstruct,$sLibrary = false)
	{
		$sClass = 'slWidget'.ucfirst($aConstruct['objID']);
		try{
			$sClassLibrary = slSystem::getFile('widget',$aConstruct['objID'],'.php');
			require_once($sClassLibrary);
		}catch(Exception $e){
			if(!class_exists($sClass)){
				throw new Exception('widget_does_not_exist:'.$sClass);
			}
		}
		if(class_exists($sClass)){	
			slSystem::import('system/singleton');
			$oResult = &slSingleton::instance($sClass,$aConstruct);
		} else{
			$oResult = false;
		}
		return $oResult;
	}
 
	public function getFile($sType,$sName, $getSkin = true,$sExt = '')
	{
		$result = false;
		 		$sNameSecure = slToolsFilesystem::securepath($sName);
		$cacheID = $sType.'#'.$sNameSecure.'#'.$getSkin.'#'.$sExt;
		if(isset(self::$aCachedFiles[$cacheID])){
			return self::$aCachedFiles[$cacheID];
		}
		switch($sType){
			case 'template':
				$getSkin = true;
				$sFolder = 'tpl/';
				$sExt = '.tpl';
			break;
			case 'javascript':
				$getSkin = true;
				$sFolder = 'js/';
				$sExt  = '.js';
			break;
			case 'stylesheet':
				$getSkin = true;
				$sFolder = 'css/';
				$sExt = '.css';
			break;
			case 'view':
				$sExt = '.xml';
				$sFolder = 'view/';
				$getSkin = true;
			break;
			default:
				$sFolder = $sType;
			break;
		}
		$path = $sFolder . $sNameSecure . $sExt;

		if($getSkin){
			$skin = APP_PATH . 'skin/' . $this->getSkin() . '/' . $path;
			$default = APP_PATH . 'skin/' . $this->skinDefault . '/' . $path;
			if( file_exists( $skin ) ){
				$result = $skin;
			} else if( file_exists( $default ) ){
				$result = $default;
			}else if(defined('APP_INCLUDE_PATH')){
				$skin = APP_INCLUDE_PATH . 'skin/' . $this->getSkin() . '/' . $path;
				$default = APP_INCLUDE_PATH . 'skin/' . $this->skinDefault . '/' . $path;
				if( file_exists( $skin ) ){
					$result = $skin;
				} else if( file_exists( $default ) ){
					$result = $default;
				}
			}
		}else{
			if( file_exists( APP_PATH . $path ) ){
				$result = APP_PATH . $path;
			}else
			if( defined('APP_INCLUDE_PATH') && file_exists( APP_INCLUDE_PATH . $path ) ){
				$result = APP_INCLUDE_PATH . $path;
			}
		}
		if($result){
			self::$aCachedFiles[$cacheID] = $result;
			return $result;
		}
		$this->message ( 'gui_file_not_exists:' . $path );
	}
}


 
interface slWidgetInterface
{
	function getBody(&$oXML);
	function create($sID);	 	function open($sID);
	function getProperty($sProperty);
	function setProperty($sProperty,$value);
}

 

abstract class slWidget implements slWidgetInterface
{
	protected $aData;	 	protected $pData;	 	protected $sObjID;	 	protected $sTemplateFile;	 	protected $sJavascriptFile;	 	protected $sCSSFile;	     public $objID;
    public $sStylesheetFile;
	
	public function __construct($aConstruct = array())
	{
		$ui = slGUI::instance();
		$this->objID = $aConstruct['objID'];
		$this->aData = array();
		try{
			$this->sTemplateFile = $ui->getFile('template',$this->objID);
			if(!$this->sTemplateFile){
				throw new Exception();
			}
		}catch(Exception $e){
			$this->sTemplateFile = $ui->getFile('template','default');
		}
		
		try{
			$this->sJavascriptFile = $ui->getFile('javascript',$this->objID);
		}catch(Exception $e){
			
		}
		
		try{
			$this->sStylesheetFile = $ui->getFile('stylesheet',$this->objID);
		}catch(Exception $e){
			
		}
	}
	
	public function initFiles()
	{
		
	}
	
	public function create($aConstruct)
	{
		$oGUI = slGUI::instance();
		if($aConstruct['xml']['id']){
			$generatedID = false;
			$id = strval($aConstruct['xml']['id']);
		}else{
			$generatedID = true;
			$id = slSystem::uniqueID();
		}
		$this->aData[$id] = new stdClass();
		$this->pData = &$this->aData[$id];
		$this->setProperty('id',$id);
		if(defined('APP_GENERATE_WIDGET_IDS') && APP_GENERATE_WIDGET_IDS && !$generatedID){
			$this->setProperty('uid',$id);
		}
		if($aConstruct['xml']->config->template){
			foreach($aConstruct['xml']->config->template as $key=>$val){
				if($val) foreach($val as $object =>$template){
					$templates[strval($object)] = strval($template);
				}
			}
			$this->setProperty('templateOverride',$templates);
		}
		if($aConstruct['xml']->config->target){
			$this->setProperty( 'target', strval($aConstruct['xml']->config->target) );	
		}else{
			$this->setProperty( 'target', 'main' );
		}
		if($overriden = $oGUI->getOverridenTemplate($this->objID)){
			$this->setProperty( 'sTemplateFile', $oGUI->getFile('template',$overriden ) );
		}
		
		if($aConstruct['xml']['template']){

			$this->setProperty( 'sTemplateFile', $oGUI->getFile('template',strval($aConstruct['xml']['template'] ) ) );
		}
		if($aConstruct['xml']['css']){
			$this->setProperty('css',strval($aConstruct['xml']['css']));
			$this->setTemplateData('css',strval($aConstruct['xml']['css']));
		}
		if($aConstruct['xml']->config->javascript->src){
			foreach($aConstruct['xml']->config->javascript->src as $javascript){
				$oGUI->setJavascript(strval($javascript));
			}
		}
		if($aConstruct['xml']->config->stylesheet->src){
			foreach($aConstruct['xml']->config->stylesheet->src as $stylesheet){
				if ($stylesheet->attributes())
				{
					$attr=$stylesheet->attributes();
				}
				else
				{
					$attr='';
				}
				$oGUI->setStylesheet(strval($stylesheet),$attr);
			}
		}
		
		if($aConstruct['xml']['helper']){
			$this->setProperty('helper',strval($aConstruct['xml']['helper']));
		}
				
		if($cookie = strval($aConstruct['xml']['cookie'])){
			$val = $_COOKIE[$cookie];
			$this->setProperty('value',$val);
		}
		 		if($aConstruct['xml']->config->set){
			foreach($aConstruct['xml']->config->set as $set){
				$widgetID = strval($set['widget']);
				$widgetID = 'slWidget'.ucfirst(strtolower($widgetID));
				$file = slSystem::getFile('widget',$set['widget'],'.php');
				require_once($file);
				$obj = slSingleton::instance($widgetID);
				
				foreach($set->property as $property){
					if($property['set']){
						$function = strval($property['set']);
						$property = strval($property);
						$obj->$function($property);
					}else{
						$obj->setProperty(strval($property['name']),strval($property));
						$obj->setTemplateData(strval($property['name']),strval($property));
					}
				}
			}
		}
		
		return $id;
	}
	
	public function createWidget($objID,$id = false){
		$aConstruct['objID'] = $objID;
		$obj = slGUI::instanceWidget($aConstruct);
		$oGUI = slGUI::instance();
		$id = $id?$id:slSystem::uniqueID();
		$obj->aData[$id] = new stdClass();
		$obj->pData = &$obj->aData[$id];
		$obj->setProperty('id',$id);
		if($overriden = $oGUI->getOverridenTemplate($objID)){
			$obj->setProperty( 'sTemplateFile', $oGUI->getFile('template',$overriden ) );
		}
		return $obj;
	}
	
	
	public function open($sID)
	{
		if(!$this->aData[$sID]){
			throw new Exception('UI:uiobject_invalid_id:'.$sID);
		}
		$this->pData = &$this->aData[$sID];
	}
	
	public function getProperty($sProperty)
	{
		if(!isset($this->pData->$sProperty))
			throw new Exception('UI:uiobject_invalid_property:'.$sProperty);
		return $this->pData->$sProperty;
	}
	
	public function setProperty($sProperty,$value)
	{
		$this->pData->$sProperty = $value;
	}
	
	public function getTemplateData($sIndex)
	{
		return @$this->pData->aTemplate[$sIndex];
	}
	
	public function setTemplateData($sIndex,$value)
	{
		 
		$this->pData->aTemplate[$sIndex] = $value;
	}
	
	public function getBody(&$oXML)
	{
		$ui = slGUI::instance();
		try{
			$templateOverride = $this->getProperty('templateOverride');
			$ui->setTemplateOverride($templateOverride);
		}catch(Exception $e){

		}
		
		$sBody = '';
		$aAnchor = array();
		
		$cid = $this->getProperty('id');
		if($oXML) foreach($oXML as $sObjClass => $oObjXML){
			switch($sObjClass){
				case 'config':
				case 'comment':
				break;
				case 'helper':
					$this->createHelper( $oObjXML );
				break;
				default:
					 					$aConstruct['objID'] = strval($sObjClass);
					$aConstruct['xml'] = $oObjXML;
					$aConstruct['parent'] = &$this;
					
					 					try{
						$oObjClass = $ui->instanceWidget($aConstruct);
						$oObjClass->create($aConstruct);
						$body = $oObjClass->getBody( $oObjXML );
						if($anchor = strval($aConstruct['xml']['anchor'])){
							$aAnchor[$anchor] = $body;
						}
						$anchoronly = strval($aConstruct['xml']['anchoronly']);
						if(!$anchoronly
						|| strtolower($anchoronly)=='false'
						|| strtolower($anchoronly)=='0'
						){
							$sBody .= $body;
						}
					 					 					 					}catch(Exc $e){
						echo $e->XHTMLMessage();
					}
				break;
			}
		}
		 		 		 		$this->open($cid);
		$this->setTemplateData('body',$sBody);
		$this->setTemplateData('anchor',$aAnchor);
		$this->setTemplateData('property',(array) $this->pData);
		$sBody = slGUI::template($this->getTemplateFile() ,$this->getProperty('aTemplate'));
		if($templateOverride){
			$ui->clearTemplateOverride($templateOverride);
		}
		return $sBody;
	}
	
	public function getTemplateFile()
	{
		try{
			$template = $this->getProperty('sTemplateFile');
		}catch(Exception $e){
			$template = $this->sTemplateFile;
		}
		return $template;
	}
	
	public function createHelper( &$oObjXML )
	{
		$helper = strval($oObjXML);
		$helperParam = array(
			'widget'=>$this,
			'helper'=>strval($helper)
		);
		$h = slHelperFactory::instance( $helperParam );
		$h->check();
	}
}

 

abstract class slWidgetFormAbstract extends slWidget
{
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$oXML = $aConstruct['xml'];
		if($oXML->config->controller){
			$this->setProperty('controller',strval($oXML->config->controller));
			$this->setTemplateData('controller',strval($oXML->config->controller));
		}
		if($oXML->config->window){
			$this->setProperty('window',strval($oXML->config->window));
			$this->setTemplateData('window',strval($oXML->config->window));
		}
		if($oXML->config->data){
			$this->setProperty('dataID',strval($oXML->config->data));
		}
		if($oXML->config->view){
			$this->setTemplateData('view',strval($oXML->config->view));
		}
		$this->setTemplateData('name',strval($oXML['name']));
		$this->setTemplateData('method',$oXML['method']?strval($oXML['method']):'get');
		$this->setTemplateData('id',strval($oXML['id']));
		$this->setTemplateData('script',strval($oXML['script'])?strval($oXML['script']):$_SERVER['SCRIPT_NAME']);
		$this->setProperty('aVariable',array());
		if($oXML->config->variables){
			foreach($oXML->config->variables->variable as  $variable){
				$name = $variable['name'];
				$name = explode( '.', $name, 2 );
				$name[1] = slVariable::dottedToBracket($name[1]);
				$var = $name[0].$name[1];
				$value = strval($variable);
				$this->addVariable($var,$value);
			}
		}
	}
	
	public function getVariable($variable)
	{
		$ui = slGUI::instance();
		$request = slRequest::instance();
		$error = $request->get('errorData.all');
		if(empty($error)){
			try{
				$item = $this->getTemplateData('item');
				if(isset($item[$variable])){
					$value =  $item[$variable];
				}
				return $value;
			}catch(Exception $e){
				 			}
		}else{			
			$sentData = $request->get('errorData.all');
			try{
				$dataid = $this->getProperty('dataID');
				$sentData = $sentData[$dataid];
			}catch(Exception $e){
				 			}
			if($sentData[$variable]){
				return $sentData[$variable];
			}else{
				return false;
			}
		}
	}
	
	public function setRequire($variable)
	{
		$this->pData->aVariable['required']['var_name'] = 'required';
		if(isset($this->pData->aVariable['required']['var_value'])){
			$variable = ','.$variable;
		}
		$this->pData->aVariable['required']['var_value'].= $variable;
	}
	
	
	protected function addVariable($variable,$value)
	{
		$aVariable['var_name'] = $variable;
		$aVariable['var_value'] = $value;
		$this->pData->aVariable[$variable] = $aVariable;
	}
	
	public function getBody(&$oXML)
	{
		parent::getBody($oXML);
		$this->setTemplateData('variable',array_values($this->getProperty('aVariable')));
		return slGUI::template($this->getTemplateFile(),$this->getProperty('aTemplate'));
	}
}


abstract class slWidgetFieldsetAbstract extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$oXML = $aConstruct['xml'];
		$this->setTemplateData('id',$oXML['id']?strval($oXML['id']):false);
		$this->setTemplateData('storage', $oXML['storage']?strval($oXML['storage']):false);
		$this->setProperty('label',slLanguage::getLabel(strval($oXML['label'])));
		$this->setTemplateData('func',$oXML['func']?strval($oXML['func']):false);
	}
}


 

abstract class slWidgetInput extends slWidget
{
	public function __construct($aConstruct)
	{
		parent::__construct($aConstruct);
	}
		
	public function setLabel($label,$language = false)
	{
		if($language){
			$label = slLanguage::getLabel($label);
		}
		$this->setProperty('label',$label);
	}
	
	public function setName($name)
	{
		$this->setProperty('name',$name);
	}
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$oXML = &$aConstruct['xml'];
		$request = slRequest::instance();
		$file = slSystem::getFile('widget','form','.php');
		require_once($file);
		$form = slSingleton::instance('slWidgetForm');
		try{
			$dataID = $form->getProperty('dataID');
		}catch(Exception $e){
			$dataID = 'main';
		}
		if($template = strval($aConstruct['xml']['template'])){
			
			$file = slGUI::instance()->getFile('template',$template);
			$this->setProperty('sTemplateFile',$file);
		}
		
		$this->setProperty('dataID',$dataID);
		$label = strval($oXML['label']);
		$this->setProperty('label',slLanguage::getLabel($label));
		$this->setProperty('css',strval($oXML['css']));
		
		if($oXML['name'] || $oXML['variable']){
			$var = $oXML['variable']?strval($oXML['variable']):strval($oXML['name']);	
			$this->setProperty('variable',$var);
			$this->setProperty('name',strval($oXML['name']));
			$this->getValue($request->get('all.sent'),$request->get('errorData.all'));
		}
		if(strval($oXML['required'])=='true'){
			$this->setRequire($var);
			$this->checkRequire($dataID,$var);
			$this->setProperty('required',true);
		}
		if($oXML['func']){
			$this->setProperty('func',strval($oXML['func']));
		}
		if($oXML['type']){
			$this->setProperty('type',strval($oXML['type']));
		}
		$this->setTemplateData('body','');
	}
	
	public function checkRequire($dataID = null, $var = null)
	{
		$request = slRequest::instance();
		if($request->get('all.sent')){
			try{
				if(!$this->getProperty('value')){
					throw new Exception();
				}
			}catch(Exception $e){
				$this->setProperty('css','highlight');
			}
		}
	}
	
	public function setRequire($variable)
	{
		$form = slSingleton::instance('slWidgetForm');
		$form->setRequire($variable);
	}
	
	public function getValue($sent = false,$error = false)
	{
		 		try{
			$variable = $this->getProperty('variable');
			$form = slSingleton::instance('slWidgetForm');
			$value = $form->getVariable($variable,$sent,$error);
			
			try{
				$function = $this->getProperty('func');
				if($function){
					$value = slFormVariable::$function(); 
				}
			}catch(Exception $e){
				 			}
			$this->setValue($value);
		}catch(Exception $e){
			 		}
	}
	
	public function setValue($value)
	{
		$this->setProperty('value',$value);
	}
	
	public function setData($data)
	{
		$this->setProperty('data',$data);
	}
	
	public function setCSS($css)
	{
		$this->setProperty('css',$css);
	}
	
	public function labels_function($fnc)
	{
		if($fnc=='getFonts')
		{
			$path="../client/languages/".$_SESSION['LANGUAGE']."/fonts.xml";
			if( file_exists( APP_PATH . $path ) ){
				$result = APP_PATH . $path;
			}else
			if( APP_INCLUDE_PATH && file_exists( APP_INCLUDE_PATH . $path ) ){
				$result = APP_INCLUDE_PATH . $path;
			}
			if (@$fonts=slToolsXML::loadFile($result))
			{
				 				$use=array(array('label'=>'-','value'=>''));
				foreach($fonts as $val)
				{
					$val=(array)$val;
					$use[]=array('label'=>$val['name'],'value'=>$val['family']);
				}
				return $use;
			}
			else
			{
				throw new Exception('Font definitions not found ['.$result.']');
			}
		}
	}
}

class slWidgetEdit extends slWidgetInput
{

}

class slWidgetPassword extends slWidgetInput
{
}



class slWidgetButton extends slWidgetInput
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$this->setProperty('name','_a['.strval($aConstruct['xml']['action']).']');
		switch(strval($aConstruct['xml']['type'])){
			case 'submit':
				$this->setProperty('submit',true);
			break;
			case 'reset':
				$this->setProperty('reset',true);
			break;
		}
	}
}

class slWidgetRadio extends slWidgetInput
{
	public function setValue($value)
	{
		$this->setProperty('value',$this->getProperty('val'));
		if($value==$this->getProperty('val')){
			$this->setProperty('checked',true);
		}
	}
}
class slWidgetLink extends slWidgetInput
{
	public function setValue($value)
	{
		
	}
}
class slWidgetCheckbox extends slWidgetInput
{
	public function create($aConstruct){
		parent::create($aConstruct);
		if($cookie = strval($aConstruct['xml']['cookie'])){
			$val = $_COOKIE[$cookie];
			$this->setProperty('value',$val);
		}
		$this->setProperty('inverse',strval($aConstruct['xml']['inverse']));
	}
	public function setValue($value)
	{
		try{
			$inverse = $this->getProperty('inverse');
			if(strtolower($inverse) == 'false' || $inverse == '0'){
				$inverse = false;
			}
		}catch(Exception $e){
			$inverse = false;
		}
		if($value){
			$this->setProperty('checked',$inverse?false:true);
		}else{
			$this->setProperty('checked',$inverse?true:false);
		}
		$this->setProperty('value',$value);
	}
}

class slWidgetSelect extends slWidgetInput
{
	
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		if($cookie = strval($aConstruct['xml']['cookie'])){
			$val = $_COOKIE[$cookie];
			
			$this->setProperty('value',$val);
		}
		if($labels = strval($aConstruct['xml']['labels'])){
			$this->setProperty('labels',$labels);			
		}
		if($values = strval($aConstruct['xml']['values'])){
			$this->setProperty('values',$values);
		}
		$this->generateOptions();
		$this->getValue(slRequest::instance()->get('sent'),slRequest::instance()->get('errorData.all'));
	}

	public function setValue($value)
	{
		try{
			$func_labels = $this->getProperty('labels_function');
			$options = $this->labels_function($func_labels);
		}catch(Exception $e){
			$this->generateOptions();
			$options = $this->getProperty('options');
			
		}
		foreach($options as $key => $option){
			if($option['value'] == $value){
				$options[$key]['selected'] = true;
			}
		}
		$this->setProperty('value',$value);
		$this->setProperty('options',$options);
	}
	public function generateOptions()
	{
		$options = array();
		try{
			$labels = $this->getProperty('labels');
			$labels = slLanguage::getLabel($labels);
			$labels = explode('|',$labels);
		}catch(Exception $e){

		}
		
		try{
			$values = $this->getProperty('values');
			$values = slLanguage::getLabel($values);
			$values = explode('|',$values);
		}catch(Exception $e){
			
		}
		
		for($i = 0;$i < count($labels);$i++){
			$option['label'] = $labels[$i];
			$option['value'] = $values?$values[$i]:$i;
			$options[] = $option;
		}
		$this->setProperty('options',$options);
	}
	
	public function getBody(&$oXML)
	{
		try{
			$this->getProperty('options');
		}catch(Exception $e){
			$this->generateOptions();
		}
		return parent::getBody($oXML);
	}

}

class slWidgetTextarea extends slWidgetInput
{
}
class slWidgetHidden extends slWidgetInput
{
}

class slWidgetDatepicker extends slWidgetInput
{
	public function getBody(&$oXML)
	{
        try {
            $date = $this->getProperty('value');

            $date = explode('/', $date);

            $this->setProperty('date', array('day' => $date[2], 'month' => $date[1], 'year' => $date[0]));

            $view['days'] = array(array('value' => ''), array('value' => '01'), array('value' => '02'), array('value' => '03'), array('value' => '04'), array('value' => '05'), array('value' => '06'), array('value' => '07'), array('value' => '08'), array('value' => '09'), array('value' => '10'), array('value' => '11'), array('value' => '12'), array('value' => '13'), array('value' => '14'), array('value' => '15'), array('value' => '16'), array('value' => '17'), array('value' => '18'), array('value' => '19'), array('value' => '20'), array('value' => '21'), array('value' => '22'), array('value' => '23'), array('value' => '24'), array('value' => '25'), array('value' => '26'), array('value' => '27'), array('value' => '28'), array('value' => '29'), array('value' => '30'), array('value' => '31'));
            $view['months'] = array(array('value' => ''), array('value' => '01'), array('value' => '02'), array('value' => '03'), array('value' => '04'), array('value' => '05'), array('value' => '06'), array('value' => '07'), array('value' => '08'), array('value' => '09'), array('value' => '10'), array('value' => '11'), array('value' => '12'));

            try {
                $from = $this->getProperty('from');
                if (substr($from, 0, 1) == '-') {
                    $from = date('Y') - trim($from, '-');
                }
                if (substr($from, 0, 1) == '+') {
                    $from = date('Y') + intval(trim($from, '+'));
                }
            } catch (Exception $e) {
                $from = date('Y') - 1;
            }

            try {
                $to = $this->getProperty('to');
                if (substr($to, 0, 1) == '-') {
                    $to = date('Y') - trim($to, '-');
                }
                if (substr($to, 0, 1) == '+') {
                    $to = date('Y') + intval(trim($to, '+'));
                }
            } catch (Exception $e) {
                $to = date('Y') + 4;
            }

            $view['years'] = array(array('value' => ''));
            for ($i = $from; $i <= $to; $i++) {
                $view['years'][] = array('value' => $i);
            }

            if (isset($view['days'][($date[2] - 1 + 1)])) {
                $view['days'][($date[2] - 1 + 1)]['selected'] = true;
            }

            if (isset($view['months'][($date[1] - 1)])) {
                $view['months'][($date[1] - 1 + 1)]['selected'] = true;
            }

            foreach ($view['years'] as $key => $val) {
                if ($val['value'] == $date[0]) {
                    $view['years'][$key]['selected'] = true;
                }
            }

            $this->setProperty('view', $view);
        } catch (Exception $e) {}
        return parent::getBody($oXML);
	}
}


  
abstract class slWidgetFrame extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$oXML = $aConstruct['xml'];
		$this->setTemplateData('variable', strval($oXML['variable']));
		$this->setTemplateData('name', strval($oXML['name']));
		$this->setTemplateData('label',slLanguage::getLabel(strval($oXML['label'])));
		$this->setTemplateData('required',strval($oXML['required'])=='true'?true:false);
		$this->setTemplateData('func',$oXML['func']?strval($oXML['func']):false);
		$this->setTemplateData('type',$oXML['type']?strval($oXML['type']):false);
		$this->setTemplateData('id',$oXML['id']?strval($oXML['id']):false);
		$this->setTemplateData('body','');
	}
}

?>