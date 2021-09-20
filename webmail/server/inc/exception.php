<?php
 
class Exc extends Exception
{
	public $message;
	public $WMCode;
	public $sView;
	public $showLocation;
	public $class;
	public $function;
	public $wmmessage;
	public $wmcode;

	 
	public function __construct($code = "default", $msg = '', $showLocation = false,
		$logError = true, $sView = false)
	{

		$this->WMCode = $code;

		parent::__construct($msg, intval($code));
		$this->wmcode = $code;
		$this->sView = $sView;
		$this->showLocation = $showLocation;
		 		if ($logError && EXCEPTION_LOG && $_SESSION['EXCEPTION_LOG']){
			log_buffer($this->Message(), "ERROR",array('error'=>$this->WMCode));
		}
	}

	 
	public function Message()
	{

		@$ret = slToolsPHP::htmlspecialchars($this->message);
		if ($this->showLocation)
			$ret .= " in file:" . $this->file . " on line:" . $this->line .
				" found in function <b>" . $this->function . "</b> and class <b>" . $this->class . "</b>\r\n";
		return $ret;
	}

	public function XHTMLMessage($oLanguage = false, &$template = false)
	{
		global $_iqdata;
		$template['eid'] = strval($this->wmcode);
		switch (strval($this->wmcode))
		{
			case 'login_invalid':
				$langid = 'invalid_login';
				break;
			case 'default':
				$langid = strval($this->wmcode);
				break;
		}
		if ($oLanguage)
		{
			$code = $oLanguage->get('error', $langid);
			if ($code)
				$this->wmcode = $code;
		}
		$template['id'] = $_iqdata['id'];
		$template['message'] = nl2br($this->message);
		$template['location'] = 'in file: ' . $this->getFile() . ' on line: ' . $this->getLine();
		$template['trace'] = nl2br($this->getTraceAsString());
		$template['sid'] = $_iqdata['sid'];
		 		$ui = slGUI::instance();
		$file  = $ui->getFile('template','error',true,'.tpl');
		return trim(template($file,	$template));
	}

	public function XMLResponse($_iqdata)
	{
		global $xmlrequest_sid,$xmlrequest_uid;
		
		@$template['message'] = slToolsPHP::htmlspecialchars($this->message?$this->message:$this->wmmessage);
		 		 		$template['id'] = $_iqdata['id']?$_iqdata['id']:$xmlrequest_uid;
		$template['eid'] = strval($this->wmcode);
		$template['sid'] = $_iqdata['sid']?$_iqdata['sid']:$xmlrequest_sid;
		return trim(template('./inc/templates/xmlrequest_error.tpl', $template));
	}

}

class LogError
{
	CONST EXTENDED = 'EXTENDED';
	CONST DEBUG = 'DEBUG';
	CONST WARNING = 'WARNING';
	CONST RESPONSE = 'RESPONSE';
	CONST ERROR = 'ERROR';
	CONST REQUEST = 'REQUEST';

	 
	public static function Error($message, $type = "Warning")
	{
	}

	public static function checkRotationName($file)
	{
		$i = "";


		if ($_SESSION['LOG_ROTATION'])
		{
			$strings[''] = $strings[0] = "-00";
			for ($j = 1; $j < 10; $j++)
				$strings[$j] = "-0" . $j;

			while (@filesize($file . ($strings[$i] ? $strings[$i] : ("-" . $i)) . loggingext) >
				$_SESSION['LOG_ROTATION'])
				$i++;
		}
		$file = $file . ($strings[$i] ? $strings[$i] : (($i ? "-" : '') . $i)) .
			loggingext;

		return $file;
	}


	public static function CommunicationLog($message, $file = false)
	{
		if($_SESSION['LOGS']){
			$api = createobject("api");
			$api->DoLog($_SERVER['SERVER_THREAD'], 14, $_SERVER['REMOTE_ADDR'], $message, 1, 1);
		}
	}
}

function dmp($o, $ommit = array(), $print = true)
{
	print_r($o);
}

function log_string($string, $length)
{
	while (strlen($string) < $length){
		$string .= ' ';
	}
	if (strlen($string) > $length){
		$string = substr($string, 0, $length);
	}
	return $string;
}

 function log_buffer($buffer, $type, $attributes = array(), $file = false)
{
	$CommunicationLog = $namespace = $getset = $onlyMessage = $duration = null;
	static $wm_start,$wm_start_sec,$id, $sid;
	$action = '';
	if (isset($attributes['type']) && $attributes['type'] == 'set'){
		$action = log_string( $attributes['action'] ?? '', 10 );
		if (trim($action) != ''){
			$action = "Action:" . $action . "\t";
		}
	}
	$userID = ((isset($_SESSION['EMAIL']) && trim($_SESSION['EMAIL']) != '') ? $_SESSION['EMAIL'] : 'Unauthorized' );
	$userID = log_string( $userID, 25 );
	if(strtoupper($type)=='EXTENDED'){
		if( $_SESSION['LOGS'] < 4 )
			return;
		else $onlyMessage = true;
	}
	switch (strtoupper($type))
	{
		case 'DEBUG':
		case 'WARNING':
			if( $_SESSION['LOGS'] <= 2 )
				return;
			else
				$onlyMessage = true;

		case 'RESPONSE':
		case 'ERROR':
			list($wm_end_sec, $wm_end) = explode(" ", microtime());
			if ($wm_start && $wm_start_sec){
				$duration = $wm_end - $wm_start + $wm_end_sec - $wm_start_sec;
			}
			$duration = log_string( $duration, 8 );
			$namespace = log_string( $attributes['namespace'] ?? '', 20 );
			if(strtoupper($type)=='ERROR'){
				$namespace = log_string( $attributes['error'] ?? '', 20 );
			}
			$getset = ($attributes['type'] ?? 'get');
			if (!$onlyMessage){
				$CommunicationLog = '';				
				$CommunicationLog .= (strtoupper($type) == 'RESPONSE' ? '>>>' : strtoupper($type)).
				"\t" . $id .
				"\t" . $userID .
				"\t" . $namespace .
				"\t" . $getset .
				"\t" . $duration .
				"\t" . $action;
			}
			break;

		case 'REQUEST':
			$id = $attributes['id'];
			$sid = $attributes['sid'];
			list($wm_start_sec, $wm_start) = explode(" ", microtime());
			
			if (!$id){
				$id = rand();
			}
			$id = log_string( $id, 10);
			$sid = log_string( $sid, 32);
			$getset = ($attributes['type'] ? $attributes['type'] : 'get');
			$namespace = log_string( $attributes['namespace'], 20 );
			$CommunicationLog = '';
			$CommunicationLog .= "<<<\t" . $id . 
				"\t" . $userID . 
				"\t" . $namespace .
				"\t" . $getset .
				"\t" . $action;
			break;
	}
	 	if ($buffer){
		if ($_SESSION['LOGS'] <= 2){
			$buffer = '';
		} else	{
			 			if(strlen($buffer)>1024*1024){
				$buffer = substr($buffer,0,1024*1024);
				 
			}
			if($CommunicationLog){
				$CommunicationLog .= "\r\n".$buffer."\r\n";
			}else{
				$CommunicationLog = $buffer."\r\n";
			}
			
		}
	}
	if($type=='EXTENDED'){
		$CommunicationLog = '';
		$CommunicationLog = "<<<\t" . $id . 
				"\t" . $userID . 
				"\t" . $namespace .
				"\t" . $getset .
				"\t" . $action.$buffer;
	}
	 	LogError::CommunicationLog($CommunicationLog, $file);
}

 function webmailErrorHandler($errno, $errstr, $errfile, $errline)
{
	$errorType = array(
		E_ERROR => 'ERROR', 
		E_WARNING => 'WARNING', 
		E_PARSE => 'PARSING ERROR',
		E_NOTICE => 'NOTICE',
		E_CORE_ERROR => 'CORE ERROR',
		E_CORE_WARNING => 'CORE WARNING',
		E_COMPILE_ERROR => 'COMPILE ERROR',
		E_COMPILE_WARNING => 'COMPILE WARNING',
		E_USER_ERROR => 'USER ERROR',
		E_USER_WARNING => 'USER WARNING',
		E_USER_NOTICE => 'USER NOTICE',
		E_STRICT => 'STRICT NOTICE',
		E_RECOVERABLE_ERROR => 'RECOVERABLE ERROR'
	);
	switch ($errno)
	{
		case E_ERROR:
			$error = 'PHP_ERROR';
			$msg = "<b>PHP ERROR</b> [$errno] $errstr<br />\n";
			$msg .= "  Fatal error on line $errline in file $errfile";
			$msg .= ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
			$msg .= "Skipped...<br />\n";
			throw new Exc($error, $msg);
			break;

		default:
			log_buffer(
				"!!!!!\tPHP ".$errorType[$errno]." [$errno] $errstr in file $errfile on line $errline",
				'DEBUG'
			);
			break;
	}

	 
	return true;
}

class XMLExc extends Exc
{
	public function XMLResponse($_iqdata)
	{
		@$template['message'] = $this->message?$this->message:$this->wmmessage;
		$template['id'] = $_iqdata['id'];
		$template['eid'] = strval($this->wmcode);
		$template['sid'] = $_iqdata['sid'];
		return trim(template('./inc/templates/xmlrequest_error.tpl', $template));
	}
}

 
?>
