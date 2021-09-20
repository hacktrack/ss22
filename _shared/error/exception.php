<?php
require_once(SHAREDLIB_PATH.'system.php');
slSystem::import('tools/filesystem');


 
 
class Exc extends Exception
{

     

    public $message;

    public $logError;
    public $wmcode;
    public $WMCode;
    public $sView;
    public $showLocation;
    public $function;
    public $class;

    public function __construct($code = "default", $msg = '', $showLocation = false, $logError = true, $sView = false)
    {
        $this->WMCode = $code;
        parent::__construct($msg, intval($code));
        $this->wmcode = $code;
        $this->sView = $sView;
        $this->showLocation = $showLocation;
        $this->logError = $logError;
    }

     
    public function Message()
    {

        @$ret = slToolsPHP::htmlspecialchars($this->message);
        if ($this->showLocation)
            $ret .= " in file:" . $this->file . " on line:" . $this->line .
                " found in function <b>" . $this->function . "</b> and class <b>" . $this->class . "</b>\r\n";
        return $ret;
    }

    public function XHTMLMessage($oLanguage = false, $sSkin = UI_SKIN_DEFAULT)
    {
        global $_iqdata;
        $template['eid'] = strval($this->wmcode);
        switch (strval($this->wmcode)) {
            case 'login_invalid':
                $langid = 'invalid_login';
                break;
            case 'default':
                $langid = strval($this->wmcode);
                break;
        }
        if ($oLanguage) {
            $code = $oLanguage->get('error', $langid);
            if ($code)
                $this->wmcode = $code;
        }
        $template['id'] = $_iqdata['id'];
        $template['message'] = nl2br($this->message);
        $template['location'] = 'in file: ' . $this->getFile() . ' on line: ' . $this->
            getLine();
        $template['trace'] = nl2br($this->getTraceAsString());
        $template['sid'] = $_iqdata['sid'];
                 return trim(template(PROJECT_PATH_DEFAULT . 'skin/' . $sSkin . '/tpl/error.tpl',
            $template));
    }

    public function XMLResponse($_iqdata)
    {
        @$template['message'] = slToolsPHP::htmlspecialchars($this->message);
                          $template['id'] = $_iqdata['id'];
        $template['eid'] = strval($this->wmcode);
        $template['sid'] = $_iqdata['sid'];
        return trim(template('./inc/templates/xmlrequest_error.tpl', $template));
    }

}

class IcewarpLog
{
     
    public static function Error($message, $type = "Warning")
    {
                 $date = date("Ymd");
        $file = $_SESSION['LOGPATH'] . loggingdir . $_SESSION['SERVER_ID'] . $date;
        $file = self::checkRotationName($file);
                 list($msec, $time) = explode(" ", microtime());
        $buffer = 'ERROR    ' . date('H:i:s.', $time) . substr($msec, 2, 6) . "\r\n" . $type .": " . $message . "\r\n";
                 if (!file_exists($file))
            $fp = @fopen($file, "w+");
        else
            $fp = fopen($file, "a+");
                 @fwrite($fp, $buffer);
                 @fclose($fp);
        return true;
    }

    public static function checkRotationName($file)
    {
        $i = "";
        if ($_SESSION['LOG_ROTATION']) {
            $strings[''] = $strings[0] = "-00";
            for ($j = 1; $j < 10; $j++)
                $strings[$j] = "-0" . $j;

            while (@filesize($file . ($strings[$i] ? $strings[$i] : ("-" . $i)) . loggingext) > $_SESSION['LOG_ROTATION'])
                $i++;
        }
        $file = $file . ($strings[$i] ? $strings[$i] : (($i ? "-" : '') . $i)) . loggingext;
        return $file;
    }


    public static function writeLog($message, $file = false)
    {
                 $date = date("Ymd");

        if (!$file) {
            $file = $_SESSION['LOGPATH'] . loggingdir . $_SESSION['SERVER_ID'] . $date;
            $file = self::checkRotationName($file);
        }
                 $buffer = $message;
        if (!file_exists($_SESSION['LOGPATH'] . loggingdir))
            if (!slToolsFilesystem::mkdir_r($_SESSION['LOGPATH'] . loggingdir))
                throw new Exc('logdir_create', $_SESSION['LOGPATH'] . loggingdir);

                 if (!file_exists($file))
            $fp = @fopen($file, "w+");
        else
            $fp = @fopen($file, "a+");


                 @fwrite($fp, $buffer);
                 @fclose($fp);
        return true;
    }
    
     	function Log($buffer, $type, $attributes = array(), $file = false)
	{
	    static $start, $msec, $id, $sid;
	
	    if ($attributes['type'] == 'set') {
	        $action = $attributes['action'];
	        while (strlen($action) < 10) {
	            $action .= ' ';
	        }
	        if (strlen($action) > 10) {
	            $action = substr($action, 0, 10);
	        }
	        if (trim($action) != '') {
	            $action = "Action:" . $action . "\t";
	        } else {
	            $action = '';
	        }
	    } else {
	        $action = '';
	    }
	    $userID = ((trim($_SESSION['EMAIL']) != '') ? substr($_SESSION['EMAIL'], 0, 20) :
	        'Unauthorized        ');
	    while (strlen($userID) < 20) {
	        $userID .= ' ';
	    }
	    switch (strtoupper($type)) {
	        case 'DEBUG':
	            if ($_SESSION['LOGS'] < 2)
	                return;
	            else
	                $onlyMessage = true;
	        case 'RESPONSE':
	        case 'ERROR':
	            if (strtoupper($type) == 'ERROR') {
	                if (!$_SESSION['LOGPATH'])
	                    simulateSession();
	            }
	            list($mesec, $end) = explode(" ", microtime());
	            if ($start && $msec)
	                $duration = time() - $start + microtime() - $msec;
	            while (strlen($duration) < 8) {
	                $duration .= ' ';
	            }
	            if (!$onlyMessage) {
	                if ($_SESSION['LOGS'] > 1)
	                    $CommunicationLog = "\r\n-------------------------------------------------------------------------------------------------------------------\r\n";
	
	                $CommunicationLog .= $_SERVER['REMOTE_ADDR'] . "\t" . (strtoupper($type) ==
	                    'RESPONSE' ? '<<<<<' : strtoupper($type)) . "\t" . date('H:i:s', $end) .
	                      "\t" . $id . "\t" . $userID . "\t" . $attributes['namespace'] .
	                    "\t" . $attributes['type'] . "\t" . $duration . "\t" . $action . "\r\n";
	
	                if ($_SESSION['LOGS'] > 1)
	                    $CommunicationLog .=
	                        "-------------------------------------------------------------------------------------------------------------------\r\n";
	            }
	            break;
	
	        case 'REQUEST':
	
	            $id = $attributes['id'];
	            $sid = $attributes['sid'];
	
	            list($msec, $start) = explode(" ", microtime());
	            if (!$id)
	                $id = rand();
	            while (strlen($id) < 10) {
	                $id .= ' ';
	            }
	            if (strlen($id) > 10) {
	                $id = substr($id, 0, 10);
	            }
	            while (strlen($sid) < 32) {
	                $sid .= ' ';
	            }
	            if (strlen($sid) > 32) {
	                $sid = substr($sid, 0, 32);
	            }
	            if ($_SESSION['LOGS'] > 1)
	                $CommunicationLog = '========================================================================================================================' .
	                    "\r\n";
	
	            $CommunicationLog .= $_SERVER['REMOTE_ADDR'] . "\t>>>>>\t" . date('H:i:s', $start) .
	                  "\t" . $id . "\t" . $userID . "\t" . $attributes['namespace'] .
	                "\t" . ($attributes['type'] ? $attributes['type'] : 'get') . "\t" . $action . "\r\n";
	
	            if ($_SESSION['LOGS'] > 1)
	                $CommunicationLog .=
	                    '------------------------------------------------------------------------------------------------------------------------' .
	                    "\r\n";
	            break;
	    }
	
	    if (!@$_SESSION['LOGS'] && !HARD_LOG)
	        return;
	
	    if ($buffer) {
	        if ($_SESSION['LOGS'] < 2) {
	            $buffer = '';
	        } else {
	             	            $CommunicationLog .= $buffer . "\r\n";
	        }
	    }
	    $this->writeLog( $CommunicationLog, $file );
}
}


 function IcewarpErrorHandler($errno, $errstr, $errfile, $errline)
{
    $errorType = array(E_ERROR => 'ERROR', E_WARNING => 'WARNING', E_PARSE =>
        'PARSING ERROR', E_NOTICE => 'NOTICE', E_CORE_ERROR => 'CORE ERROR',
        E_CORE_WARNING => 'CORE WARNING', E_COMPILE_ERROR => 'COMPILE ERROR',
        E_COMPILE_WARNING => 'COMPILE WARNING', E_USER_ERROR => 'USER ERROR',
        E_USER_WARNING => 'USER WARNING', E_USER_NOTICE => 'USER NOTICE', E_STRICT =>
        'STRICT NOTICE', E_RECOVERABLE_ERROR => 'RECOVERABLE ERROR');
    switch ($errno) {
        case E_ERROR:
            $error = 'PHP_ERROR';
            $msg = "<b>PHP ERROR</b> [$errno] $errstr<br />\n";
            $msg .= "  Fatal error on line $errline in file $errfile";
            $msg .= ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
            $msg .= "Skipped...<br />\n";
            throw new Exc($error, $msg);
            break;

        default:
                         break;
    }

     
    return true;
}

set_error_handler("IcewarpErrorHandler");


function dmp($o)
{
    print_r($o);
}

?>