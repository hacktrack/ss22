<?php

 

 define('DB_MIGRATION', true);
define('DB_MIGRATION_ITEM_CHUNK',10000);

 require_once('inc/require.php');
require_once('inc/include.php');
require_once('inc/exception.php');
require_once('inc/defines.php');

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

$account = $data['account'];
$login = $data['login'];
$pass = $data['pass'];
$path = $data['path'];
$dbconnection = $data['dbconnection'];
$dbuser = $data['dbuser'];
$dbpass = $data['dbpass'];
$dbdrop = $data['dbdrop'];

log_buffer("Migration - start :".$data['account'],"EXTENDED");


define('DB_MIGRATION_SOURCE','sqlite:'.$path);

 if(!$account){
	throw new Exc('webclient_migrate_missing_account');
}
if(!$pass){
	throw new Exc('webclient_migrate_missing_password');
}
if(!$path){
	throw new Exc('webclient_migrate_missing_path');
}
if(!$dbconnection){
	throw new Exc('webclient_migrate_missing_connection');
}
$cache_settings['connection'] = $dbconnection;

$cache_settings['user'] = $dbuser;
$cache_settings['pass'] = $dbpass;
$cache_settings['query_log'] = 4;
if(stripos($dbconnection,'oci')===0){
	$cache_settings['syntax'] = 'oracle';
	if($dbdrop){
		$cache_settings['check_tables'] = 0;
	}
}
$_SESSION['LOG'] = 4;
$user = false;

$destination['cache'] = new Cache($user,$cache_settings);

if($dbdrop){
	$destination['cache']->safeQuery("DROP table item");
	$destination['cache']->safeQuery("DROP table folder");
	$destination['cache']->safeQuery("DROP table wm_metadata");
	if($cache_settings['syntax'] == 'oracle'){
		$destination['cache']->safeQuery("DROP function BITNOT");
		$destination['cache']->safeQuery("DROP function BITOR");
		$destination['cache']->safeQuery("DROP sequence SEQ_FOLDER");
		$destination['cache']->safeQuery("DROP sequence SEQ_ITEM");
	}
	$destination['cache']->createTables();
	$destination['cache']->createTablesBackground();
}
 User::login($login,$pass);
$primary_account = $_SESSION['EMAIL'];
$user = $_SESSION['user'];
$account = $user->getAccount($primary_account);
if($account->isDelayed()){
	if($account->syncDelayedFolders()){
		$account->sync();
	}else{
		 	}
}
$folders = $account->folders["main"];
$folder_ids = array();
 if($folders){
	 	ksort($folders);
	
	 	foreach($folders as $folder){
		 		if(!$folder->delimiter){
			$folder->delimiter = '/';
		}
		$parentFolderName = preg_replace(
				'/'.preg_quote($folder->delimiter, '/').'[^'.preg_quote($folder->delimiter, '/').']*$/',
				'',
				$folder->name
		);
		
		$folder_param = array(
			'parent_folder_id'=>isset($folder_ids[$parentFolderName])?$folder_ids[$parentFolderName]:NULL,
			'account_id'=>$folder->account->accountID,
			'name'=>$folder->name,
			'rights'=>$folder->rights?$folder->rights:0,
			'attributes'=>$folder->attributes?$folder->attributes:0,
			'sync'=>$folder->sync,
			'path'=>$folder->getPath(),
			'uid_validity'=>$folder->validity,
			'sync_update'=>$folder->sync_update?$folder->sync_update:0,
			'unseen'=>$folder->unseen?$folder->unseen:0,
			'messages'=>$folder->messages?$folder->messages:0
		);
		$folder_ids[$folder->name] = $destination['cache']->createFolder($folder_param);
	}
	
	 	foreach($folders as $folder){
		$item_count = $folder->countItems();
		log_buffer("Item count($folder->name):". $item_count,"EXTENDED");
		if($item_count){
			$iteration_count =  ceil($item_count/DB_MIGRATION_ITEM_CHUNK);
			for($i = 0;$i < $iteration_count; $i++){
				$filter['offset'] = $i*DB_MIGRATION_ITEM_CHUNK;
				$filter['limit'] = DB_MIGRATION_ITEM_CHUNK-1;
				$filter['tag'] = '*';
				$items = $folder->getItems($filter);
				$destination['cache']->transaction();
				foreach($items as $item){
					 					$destination['cache']->createItem(
						array(
							'folder_id' => $folder_ids[$folder->name], 
							'rid' => $item->rid,
							'size' => $item->size, 
							'date' => $item->date, 
							'flags' => $item->flags ? $item->flags : 0, 
							'header_from' => $item->from, 
							'header_to' =>$item->to, 
							'subject' => $item->subject, 
							'static_flags' => $item->staticFlags?$item->staticFlags:0, 
							'priority' => $item->priority?$item->priority:0, 
							'color' => $item->color?$item->color:'Z',
							'smime_status' => $item->sMimeStatus?$item->sMimeStatus:0, 
							'has_attachment' => $item->hasAttachments ? 'T' : 'F', 
							'body' => $item->body ? $item->body : null,
							'sort_from'=>$item->sort_from,
							'sort_to'=>$item->sort_to,
							'message_id'=>$item->message_id,
							'msg_file'=>$item->msg_file,
							'taglist'=>$item->taglist
						),
						$destination
					);
				}
				$destination['cache']->commit();
			}
		}
	}
}
log_buffer("Migration - before logout:".$data['account'],"EXTENDED");
$user->logout();
log_buffer("Migration ended:".$data['account'],"EXTENDED");
?>