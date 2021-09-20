<?php


 

 define('DB_MIGRATION', true);
define('DB_MIGRATION_ITEM_CHUNK',10000);

 require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

@unlink('sqlite:c:\\migrate.db'); $destination_settings['connection'] = 'sqlite:c:\\migrate.db';
$destination_settings['query_log'] = 4;
$user = false;

$destination['cache'] = new Cache($user,$destination_settings);
$destination['cache']->checkTablesBackground();

$api = createobject('api');
$configPath = $api->GetProperty('C_ConfigPath');
$webclientSettings = slToolsXML::loadFile($configPath.'_webmail/server.xml');
$source_settings['connection'] = strval($webclientSettings->item->dbconn);
$source_settings['user'] = strval($webclientSettings->item->dbuser);
$source_settings['pass'] = strval($webclientSettings->item->dbpass);
$source_settings['query_log'] = 4;

$source_settings['connection'] = 'oci:Mock';
$source_settings['syntax'] = 'oracle';
$source_settings['export'] = True;
$source['cache'] = new Cache($user,$source_settings); 
$statements = $source['cache']->createTables(true);
file_put_contents('oracle.sql',join(CRLF,$statements));

$source_settings['connection'] = 'odbc:Mock';
$source_settings['syntax'] = '';
$source['cache'] = new Cache($user,$source_settings); 
$statements = $source['cache']->createTables(true);
file_put_contents('mssql.sql',join(CRLF,$statements));


$source_settings['connection'] = 'mysql:Mock';
$source['cache'] = new Cache($user,$source_settings); 
$statements = $source['cache']->createTables(true);
file_put_contents('mysql.sql',join(CRLF,$statements));


$source_settings['connection'] = 'sqlite:Mock';
$source['cache'] = new Cache($user,$source_settings); 
$statements = $source['cache']->createTables(true);
file_put_contents('sqlite.sql',join(CRLF,$statements));
 


?>