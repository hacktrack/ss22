<?php
require_once( "inc/application.php" );

function safeExecute(&$database,&$stmt,&$itm)
{
	try{
		$stmt->execute(array_values($itm->property));
	}catch(Exception $e){
		
		 		if($itm->property['itm_subject']) $itm->property['itm_subject'] = slToolsString::utf8_bad_replace($itm->property['itm_subject'],' ',false,$fourbyte);
		if($itm->property['itm_sender']) $itm->property['itm_sender'] = slToolsString::utf8_bad_replace($itm->property['itm_sender'],' ',false,$fourbyte);
		if($itm->property['itm_recipient']) $itm->property['itm_recipient'] = slToolsString::utf8_bad_replace($itm->property['itm_recipient'],' ',false,$fourbyte);
		
		$cutlen = $database->dbsynatx=='oracle'?2000:8000;
		 		if($itm->property['itm_subject']) $itm->property['itm_subject'] = substr($itm->property['itm_subject'],$cutlen);
		if($itm->property['itm_sender']) $itm->property['itm_sender']  = substr($itm->property['itm_sender'] ,0,$cutlen);
		if($itm->property['itm_recipient']) $itm->property['itm_recipient']  = substr($itm->property['itm_recipient'],0,$cutlen);
		$stmt->execute(array_values($itm->property));
	}
}

function copyTable($src,$dst)
{
	$count = $src->retrieve('COUNT(*) as cnt');
	$count = reset($count)->getProperty('cnt');
	if($count > DB_MIGRATION_ITEM_CHUNK){
		$chunks = ceil($count/DB_MIGRATION_ITEM_CHUNK);
		for($i = 0; $i < $chunks; $i++ ){
			 			$offset  = ($i)*DB_MIGRATION_ITEM_CHUNK;
			$limit = DB_MIGRATION_ITEM_CHUNK;
			 			$items = $src->retrieve('*','',$offset,$limit);
			$item = reset($items);
			$columns = ' (' . implode(',', array_keys($item->property)) . ')';
			$values  = '(' . implode(',', array_fill(0, count($item->property), '?')) . ')';
			 			$dst->cache->transaction();
			$stmt = $dst->cache->prepare("INSERT INTO ".$dst->getTable().$columns.' VALUES '.$values);
			foreach($items as $itm){
				safeExecute($dst->cache,$stmt,$itm);
			}
			$dst->cache->commit();
		}
	}else{
		 		if ($count){
			$items = $src->retrieve();
			$item = reset($items);
			$columns = ' (' . implode(',', array_keys($item->property)) . ')';
			$values  = '(' . implode(',', array_fill(0, count($item->property), '?')) . ')';
			 			$dst->cache->transaction();
			$stmt = $dst->cache->prepare("INSERT INTO ".$dst->getTable().$columns.' VALUES '.$values);
			foreach($items as $itm){
				safeExecute($dst->cache,$stmt,$itm);	
			}
			$dst->cache->commit();
		}
	}
}

 
 if(!icewarp_getlock('challenge')){
	throw new Exception('challenge_already_running');
}
 define('DB_MIGRATION', true);
define('DB_MIGRATION_ITEM_CHUNK',1000);

 if($argv) foreach($argv as $arg){
	if(strpos($arg,'parameters=')===0){
		$parameters = str_replace("parameters=","",$arg);
	}
	if(strpos($arg,'-parameters=')===0){
		$parameters = str_replace("-parameters=","",$arg);
	}
}
if(!$parameters){
	$parameters = $argv[1];
}
 
parse_str($parameters,$data);

$srcdbconnection = $data['srcdbconnection'];
$srcdbuser = $data['srcdbuser'];
$srcdbpass = $data['srcdbpass'];
$srcdbsyntax = $data['srcdbsyntax'];
$destdbconnection = $data['destdbconnection'];
$destdbuser = $data['destdbuser'];
$destdbpass = $data['destdbpass'];
$destdbsyntax = $data['destdbsyntax'];


define('DB_MIGRATION_SOURCE','sqlite:'.$path);

 if(!$srcdbconnection){
	throw new Exception('challenge_migrate_missing_source_connection');
}
if(!$destdbconnection){
	throw new Exception('challenge_migrate_missing_dest_connection');
}

$cache_settings['connection'] = $dbconnection;
$cache_settings['user'] = $dbuser;
$cache_settings['pass'] = $dbpass;
$cache_settings['query_log'] = 4;
$user = false;

$srccache = new ChallengeCache( $srcdbconnection, $srcdbuser, $srcdbpass, 4, $srcdbsyntax);
$report = Report::instance( $srccache );
$spam = Spam::instance( $srccache );
$quarantine = Quarantine::instance( $srccache );
$admin = ChallengeCacheTable::instance(
	'ChallengeCacheTable',
	'admin',
	$srccache
);
$spamAdmin = ChallengeCacheTable::instance(
	'ChallengeCacheTable',
	'spam_admin',
	$srccache
);
$quarantineAdmin = ChallengeCacheTable::instance(
	'ChallengeCacheTable',
	'quarantine_admin',
	$srccache
);

$destcache = new ChallengeCache( $destdbconnection, $destdbuser, $destdbpass, 4, $destdbsyntax);
$destreport = Report::instance( $destcache );
$destspam = Spam::instance( $destcache );
$destquarantine = Quarantine::instance( $destcache );
$destadmin = ChallengeCacheTable::instance(
		'ChallengeCacheTable',
		'admin',
		$destcache
);
$destspamAdmin = ChallengeCacheTable::instance(
		'ChallengeCacheTable',
		'spam_admin',
		$destcache
);
$destquarantineAdmin = ChallengeCacheTable::instance(
		'ChallengeCacheTable',
		'quarantine_admin',
		$destcache
);
$destcache->dropTables();
$destcache->createTables();

 copyTable($report,$destreport);
copyTable($spam,$destspam);
copyTable($quarantine,$destquarantine);
copyTable($admin,$destadmin);
copyTable($spamAdmin,$destspamAdmin);
copyTable($quarantineAdmin,$destquarantineAdmin);

 icewarp_releaselock('challenge');

?>