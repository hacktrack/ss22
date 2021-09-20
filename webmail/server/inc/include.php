<?php

 define('WEBMAIL_DB_VERSION', 26);
define('WEBMAIL_DB_VERSION_BACKGROUND', 3);

 define('heshexpire', 60);	 define('sessionexpire', 240);  
 define('DB_MYSQL',0x0);
define('DB_SQLITE',0x1);
define('WM_DB_TYPE',DB_SQLITE);
define('DB_QUERY_CHUNK',1);
define('DB_BODY_LIMIT',32000);
define('DB_MAX_IDS_IN_QUERY',1000);

 define('MAX_CHUNK_SIZE',1000);
define('CHUNK_SIZE',1000);
define('UNAVAILABLE_FILE', 'unavailable.tmp');
define('MAX_EXECUTION_TIME', 960);

 define('HARD_LOG',0);
define('EXCEPTION_LOG',1);

 define('SETTINGS_FOLDER','~webmail/');
define('SETTINGS_FOLDER_NO_SLASH','~webmail');
define('UPLOAD_FOLDER','~webmail/~upload/');
define('RSA_CONFIGPATH','data/');
define('sessiondir', './sessions/');
define('loggingdir', 'webmail/');

 define('storeageext', '.xml');
define('avatarext', '.xml');
define('filterext', '.xml');
define('loggingext', '.log');
define('sessionext', '.ses');
define('dataext', '.dat');
define('templateext', '.tpl');
define('messageext', '.msg');
define('imipext','.ics');
define('localpopmessageext', '.tmp');

 define('accountsfile', 'accounts.xml');
define('rssfile', 'rss.xml');
define('virtualfile', 'virtual.xml');
define('searchfile', 'search.xml');
define('SETTINGS_FILE','settings');
define('COOKIE_FILE','cookies');
define('LOGIN_FILE','login');
define('CERTIFICATE_FILE','cert.pem');
define('GLOBAL_FILE','server');
define('SPELLCHECKER_FILE','spellchecker');
define('GLOBAL_SETTINGS_FILE',WM_CONFIGPATH.GLOBAL_FILE.storeageext);
define('DEFAULT_SETTINGS_FILE',WM_CONFIGPATH.'default.settings.xml');
define('DEFAULT_COOKIE_FILE',WM_CONFIGPATH.'default.cookies.xml');
define('GLOBAL_SETTINGS_DEFAULT','./inc/templates/globalsettings.tpl');
define('SPELLCHECKER_SETTINGS_FILE',WM_CONFIGPATH.SPELLCHECKER_FILE.storeageext);
define('SPELLCHECKER_SETTINGS_DEFAULT','./inc/templates/spellchecker.tpl');

 define('VCARD_EXT','.vcf');
define('VCALENDAR_EXT','.ics');

 define('restriction_suffix','_restriction');
define('allowdadmin', 1);  
 define('SERVER_TIMEZONE',100);

 define('RSS_ENABLED',true);

 if(!defined('DOWNLOAD_PHP')){
	define('DOWNLOAD_PHP','server/download.php');
}
if(!defined('WEBMAIL_PHP')){
	define('WEBMAIL_PHP','server/webmail.php');
}
 define('S_FOLDER_NAME','SPAM_QUEUE');
define('Q_FOLDER_NAME','Quarantine');
define('B_FOLDER_NAME',S_FOLDER_NAME.'/Blacklist');
define('W_FOLDER_NAME',S_FOLDER_NAME.'/Whitelist');

define('S_FOLDER_NAME_UPPER',strtoupper(S_FOLDER_NAME));
define('Q_FOLDER_NAME_UPPER',strtoupper(Q_FOLDER_NAME));
define('B_FOLDER_NAME_UPPER',strtoupper(B_FOLDER_NAME));
define('W_FOLDER_NAME_UPPER',strtoupper(W_FOLDER_NAME));
 define('DEFAULT_AVATAR_NAME','blank.gif');
define('DEFAULT_AVATAR','../client/skins/blank.gif');

 define('CR',"\r");
define('LF',"\n");
define('CRLF',"\r\n");
define('UNIX1900',2415019);
define('DAY_LENGTH',86400);
define('WEEK_LENGTH',604800);
define('WORK_WEEK_LENGTH',432000);
define('WITH_ADDONS',0x0);
define('NO_ADDONS',0x1);
define('delimiterchar',',');

 define('MAX_LINKS_SIZE', 32000);
define('MAX_ADDRESS_LINKS', 100);
define('MAX_URL_LINKS', 100);
		
define('WM_LOCK_RETRY',1000000);		

if(!isset($_SERVER['CONTENT_TYPE']) && isset($_SERVER['HTTP_CONTENT_TYPE'])){
	$_SERVER['CONTENT_TYPE'] = $_SERVER['HTTP_CONTENT_TYPE'];
}

function Get()
{
	slSystem::import('io/get');
	return slIOGet::instance();
}

function Post()
{
	slSystem::import('io/post');
	return slIOPost::instance();
}

define('APP_LOGGING_METHOD','log_buffer');

?>