<?php

if(!defined('SHAREDLIB_PATH')) {
    if (($sharedLibPath = realpath(__DIR__ . '/../../../_shared')) && is_dir($sharedLibPath)) {
        define('SHAREDLIB_PATH', $sharedLibPath . '/');
    } else {
        define('SHAREDLIB_PATH', get_cfg_var('icewarp_sharedlib_path'));
    }
}

if (version_compare(PHP_VERSION, "7.3") < 0 && !function_exists("is_countable")) {
    function is_countable($var): bool
    {
        return (is_array($var) || is_object($var) || is_iterable($var) || $var instanceof Countable);
    }
}

require_once(SHAREDLIB_PATH.'system.php');

if(!defined('CLIENT')){define('CLIENT','client');}

function webclient_autoloader($classname)
{
	$require_array = array(
		'xml'=>'inc/xml.php',
		'xmlrequest'=>'inc/xmlrequest.php',
		'xmlrequestinterface'=>'inc/xmlrequest.php',
		'webmailiqauth'=>'inc/webmailiqauth.php',
		'webmailiqaccounts'=>'inc/webmailiqaccounts.php',
		'webmailiqfolders'=>'inc/webmailiqfolders.php',
		'webmailiqfreebusy'=>'inc/webmailiqfreebusy.php',
		'webmailiqimport'=>'inc/webmailiqimport.php',
		'webmailiqitems'=>'inc/webmailiqitems.php',
		'webmailiqmessage'=>'inc/webmailiqmessage.php',
		'webmailiqprivate'=>'inc/webmailiqprivate.php',
		'webmailiqpublic'=>'inc/webmailiqpublic.php',
		'webmailiqspellchecker'=>'inc/webmailiqspellchecker.php',
		'webmailiqupload'=>'inc/webmailiqupload.php',
		'webmailiqtools'=>'inc/webmailiqtools.php',
		'account'=>'inc/account.php',
		'exc'=>'inc/exception.php',
		'folder'=>'inc/folder.php',
		'forgot'=>'inc/forgot.php',
		'imip'=>'inc/imip.php',
		'inputstream'=>'inc/inputstream.php',
		'item'=>'inc/item.php',
		'mail'=>'inc/mail.php',
		'mailparse'=>'inc/mailparse.php',
		'privateandpublic'=>'inc/privateandpublic.php',
		'search'=>'inc/search.php',
		'tools'=>'inc/tools.php',
		'user'=>'inc/user.php',
		'virtualhandler'=>'inc/virtual/virtual.php',
		'virtualfolder'=>'inc/virtual/folder.php',
		'virtualaccount'=>'inc/virtual/account.php',
		'hipaaaccount'=>'inc/hipaa/account.php',
		'hipaafolder'=>'inc/hipaa/folder.php',
		'hipaaitem'=>'inc/hipaa/item.php',
		'paths'=>'inc/cache/paths.php',
		'cache'=>'inc/cache/cache.php',
		'cacheitem'=>'inc/cache/item.php',
		'cachefolder'=>'inc/cache/folder.php',
		'cacheaccount'=>'inc/cache/account.php',
		'pop3'=>'inc/pop3/pop3.php',
		'pop3item'=>'inc/pop3/item.php',
		'pop3folder'=>'inc/pop3/folder.php',
		'pop3account'=>'inc/pop3/account.php',
		'imap'=>'inc/imap/imap.php',
		'imapitem'=>'inc/imap/item.php',
		'imapfolder'=>'inc/imap/folder.php',
		'imapaccount'=>'inc/imap/account.php',
		'localpop'=>'inc/localpop/localpop.php',
		'localpopitem'=>'inc/localpop/item.php',
		'localpopfolder'=>'inc/localpop/folder.php',
		'localpopaccount'=>'inc/localpop/account.php',
		'rss'=>'inc/rss/rss.php',
		'rssitem'=>'inc/rss/item.php',
		'rssfolder'=>'inc/rss/folder.php',
		'rssaccount'=>'inc/rss/account.php',
		'sharedaccounts'=>'inc/shared/shared.php',
		'sharedaccountitem'=>'inc/shared/item.php',
		'sharedaccountfolder'=>'inc/shared/folder.php',
		'sharedaccountaccount'=>'inc/shared/account.php',
		'tagshandler'=>'inc/tags/tags.php',
		'tagsitem'=>'inc/tags/item.php',
		'tagsfolder'=>'inc/tags/folder.php',
		'tagsaccount'=>'inc/tags/account.php',
		'reminders'=>'inc/reminders/reminders.php',
		'remindersitem'=>'inc/reminders/item.php',
		'remindersfolder'=>'inc/reminders/folder.php',
		'remindersaccount'=>'inc/reminders/account.php',
		'groupwaremanagement'=>'inc/gw/gwmanage.php',
		'groupwareitemmail'=>'inc/gw/imapitem.php',
		'groupwareaddon'=>'inc/gw/addon.php',
		'groupwareitem'=>'inc/gw/item.php',
		'groupwarefolder'=>'inc/gw/folder.php',
		'groupwareaccount'=>'inc/gw/account.php',
		'groupaccount'=>'inc/group/account.php',
		'groupfolder'=>'inc/group/folder.php',
		'groupitem'=>'inc/group/item.php',
		'sizeaccount'=>'inc/size/account.php',
		'sizefolder'=>'inc/size/folder.php',
		'sizeitem'=>'inc/size/item.php',
		'quarantinefolder'=>'inc/quarantine/folder.php',
		'quarantineitem'=>'inc/quarantine/item.php',
		'devicesfolder'=>'inc/devices/folder.php',
		'devicesitem'=>'inc/devices/item.php',
		'storage'=>'inc/storage/storage.php',
		'merakgwapi'=>'inc/gw/gw.php',
		'icewarpgwapi'=>'inc/gw/gw.php',
		'iapiinterface'=>SHAREDLIB_PATH.'api/abstract.php',
		'merakapi'=>SHAREDLIB_PATH.'api/api.php',
		'icewarpapi'=>SHAREDLIB_PATH.'api/api.php',
		'merakaccount'=>SHAREDLIB_PATH.'api/account.php',
		'icewarpaccount'=>SHAREDLIB_PATH.'api/account.php',
		'merakdomain'=>SHAREDLIB_PATH.'api/domain.php',
		'icewarpdomain'=>SHAREDLIB_PATH.'api/domain.php',
		'merakremoteaccount'=>SHAREDLIB_PATH.'api/remoteaccount.php',
		'icwarpremoteaccount'=>SHAREDLIB_PATH.'api/remoteaccount.php',
		'hipaa'=>'inc/hipaa/hipaa.php',
        'alfrescoaccount'=>'inc/alfresco/account.php',
        'alfrescofolder'=>'inc/alfresco/folder.php',
        'alfrescoitem'=>'inc/alfresco/item.php',
        'alfrescoaddon'=>'inc/alfresco/addon.php',
	);

    if($require_array[strtolower($classname)]){
        if(file_exists($require_array[strtolower($classname)])){
            require_once($require_array[strtolower($classname)]);
        }elseif(file_exists(__DIR__ . '/../' . $require_array[strtolower($classname)])){
            require_once(__DIR__ . '/../' . $require_array[strtolower($classname)]);
        }elseif(function_exists('log_buffer')){
            log_buffer("__autoload: There is no defined webclient autoloader for : \"".$classname."\" (".print_r(debug_backtrace(),true).")","EXTENDED");
        }
    }else{
        $classname = str_replace('\\', '/', $classname);
        $classname = str_replace('_', '/', $classname);
        $baseDir = __DIR__ . '/../../';

        if (is_file($baseDir . strtolower($classname) . '.php')) {
            require_once($baseDir . strtolower($classname) . '.php');
        }elseif (is_file($baseDir . $classname . '.php')) {
            require_once($baseDir . $classname . '.php');
        }elseif(function_exists('log_buffer')){
            log_buffer("__autoload: There is no defined webclient autoloader for : \"".$classname."\" (".print_r(debug_backtrace(),true).")","EXTENDED");
        }
    }
}
spl_autoload_register('webclient_autoloader');

function createobject($object)
{
	$identity = defined('APP_IDENTITY')?APP_IDENTITY:'WebClient';
    switch (strtolower($object)) {
        case "api":
        	$ip = $_SERVER['REMOTE_ADDR'];
            if (isset($_SESSION['EMAIL']) && ($email = $_SESSION['EMAIL'])) {
                $email = $ip.'/'.$identity.'/'.$email;
            } else {
                $email = $ip.'/'.$identity;
            }
            $api = IceWarpAPI::instance($email);
            return $api;
        case "domain":
			return new MerakDomain();
        case "account":
            return new MerakAccount();
        case "remoteaccount":
            return new MerakRemoteAccount();
        case "schedule":
            return new MerakSchedule();
        case "statistics":
            return new MerakStatistics();
        case "gwapi":
            return new MerakGWAPI('com.icewarp.webclient');

    }
}

$api = createobject('API');
if(empty($api->base)){
    throw new Exc(500,'IceWarpAPI was not loaded properly');
}
define('WM_CONFIGPATH', $api->GetProperty('C_ConfigPath') . '_webmail/');
define('WM_HOSTSPATH', WM_CONFIGPATH . '_hosts/');
$_SESSION['LOGS'] = $api->GetProperty('C_WebMail_Logs');
$session_cookie = $api->GetProperty('C_WebMail_SessionCookie');
$_SESSION['SESSION_COOKIE'] = (strtolower(strval($session_cookie))=='true' || intval($session_cookie)==1)?true:false;
$secure_cookie = $api->GetProperty('C_Webmail_HTTPSecureCookie');
$secure_cookie = (strtolower(strval($secure_cookie))=='true' || intval($secure_cookie)==1)?true:false;
if($secure_cookie){
	define('SECURE_COOKIE',true);
}
if(!empty($_GET['meeting'] ?? null)){
    @$licenseData = simplexml_load_string($api->GetProperty('c_license_xml'));
    $conferenceProvider = (string)$licenseData->teamconferenceprovider;
    if(strcasecmp($conferenceProvider, 'jitsi') || strcasecmp($conferenceProvider, 'jitsi-free')){
        $url = $api->getProperty('C_Conference_API_URL');
        header('Location: ' . $url . $_GET['meeting']);
        die();
    }
}

?>