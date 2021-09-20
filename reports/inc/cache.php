<?php

 

require_once( SHAREDLIB_PATH . 'system.php' );
slSystem::import('storage/cache');
slSystem::import('tools/php');
require_once ('wrapper.php');

 
class ChallengeCache extends slCache
{
	static $instance;
	public static function instance() 
	{
		$challenge = ChallengeApplication::instance();
		$dbHost = $challenge->database['host'];
		$dbType = $challenge->database['type'];
		$dbName = $challenge->database['name'];
		$dbUser = $challenge->database['user'];
		$dbPass = $challenge->database['pass'];
		$dbLogs = $challenge->database['logs'];
		$dbConnection = $challenge->dbConnection;
		$index = $dbHost.'#'.$dbName;
		if (!isset(self::$instance[$index])){
				self::$instance[$index] = new ChallengeCache( $dbConnection, $dbUser, $dbPass, $dbLogs);
		}
		return self::$instance[$index];
	}

	 
	public function createTables()
	{
		try {
			$this->transaction();
			 			 			$this->query(
				'CREATE TABLE report ('   . 
				'id INTEGER PRIMARY KEY ' . $this->sAutoincrement . ', ' . 
				'rep_time INTEGER NOT NULL, ' . 
				'rep_hash ' . $this->sTextField . ' NOT NULL )'
			);
			 			$this->query(
				'CREATE TABLE spam ('   . 
				'id INTEGER PRIMARY KEY ' . $this->sAutoincrement . ', ' . 
				'itm_report_id INTEGER NOT NULL, ' . 
				'itm_subject ' . $this->sTextField . ' NOT NULL, ' . 
				'itm_sender ' . $this->sTextField . ' NOT NULL, ' . 
				'itm_recipient ' . $this->sTextField . ' NOT NULL , ' .
				'itm_hash ' . $this->sTextField . ', ' . 
				'itm_folder ' . $this->sTextField . ', ' .
				'itm_date INTEGER NOT NULL, ' . 
				'itm_time INTEGER NOT NULL, ' . 
				'itm_flags INTEGER, ' . 
				'itm_seen_by_owner INTEGER NOT NULL DEFAULT 0)' .
				$this->dbTableType
			);
			 			$this->query(
				'CREATE TABLE quarantine ('   . 
				'id INTEGER PRIMARY KEY ' . $this->sAutoincrement . ', ' . 
				'itm_report_id INTEGER NOT NULL, ' . 
				'itm_subject ' . $this->sTextField . ' NOT NULL, ' . 
				'itm_sender ' . $this->sTextField . ' NOT NULL, ' . 
				'itm_recipient ' . $this->sTextField . ' NOT NULL, ' .
				'itm_hash ' . $this->sTextField . ', ' .
				'itm_folder ' . $this->sTextField . ', ' .
				'itm_date INTEGER NOT NULL, ' . 
				'itm_time INTEGER NOT NULL, ' . 
				'itm_flags INTEGER, ' . 
				'itm_seen_by_owner INTEGER NOT NULL DEFAULT 0,'.
				'sync_hash ' . $this->sTextField .' ) ' .
				$this->dbTableType
			);
			 			$this->query(
				'CREATE TABLE admin ('   . 
				'id INTEGER PRIMARY KEY ' . $this->sAutoincrement . ', ' . 
				'email '.$this->sTextField.' NOT NULL)'
			);
			 			$this->query(
				'CREATE TABLE spam_admin ('   . 
				'spam_id INTEGER  NOT NULL,'.
				'admin_id INTEGER NOT NULL, '.
				'report_id INTEGER NOT NULL, '.
				'PRIMARY KEY(spam_id,admin_id))'
			);
			 			$this->query(
				'CREATE TABLE quarantine_admin ('   . 
				'quarantine_id INTEGER NOT NULL,'.
				'admin_id INTEGER NOT NULL,'.
				'report_id INTEGER NOT NULL, '.
				'PRIMARY KEY(quarantine_id,admin_id))'
			);
			 			$this->query('CREATE TABLE challenge_metadata (' . 
				'item_key VARCHAR(128), ' .
				'item_value VARCHAR(128))'
			);
			
			 			if(strtolower($this->dbtype) == 'sqlite' || strtolower($this->dbtype)=='odbc'){
				$this->query('CREATE INDEX IDX_itm_spam_emails ON spam (itm_recipient,itm_sender)');
				$this->query('CREATE INDEX IDX_itm_quarantine_emails ON quarantine (itm_recipient,itm_sender)');
			}else{
				$this->query('CREATE INDEX IDX_itm_spam_emails ON spam (itm_recipient(128),itm_sender(128))');
				$this->query('CREATE INDEX IDX_itm_quarantine_emails ON quarantine (itm_recipient(128),itm_sender(128))');
			}
			
			$this->query('CREATE INDEX IDX_itm_spam_report_id ON spam (itm_report_id)');
			$this->query('CREATE INDEX IDX_itm_quarantine_report_id ON quarantine (itm_report_id)');
            $this->commit();
            $this->transaction();
			 			$stmt = $this->prepare('INSERT INTO challenge_metadata (item_key, item_value) ' .
				'VALUES (?, ?)');
			$stmt->execute(array('db_version', strval(CHALLENGE_DB_VERSION)));
			$this->commit();
		}
		catch (PDOException $e) {
			echo "PDO General Error:".$e->getMessage();
		}
	}
	
	 
	public function checkTables()
	{
		if(!$this->tablesChecked){
			try{
				$this->suppressError = true;
				$stmt = $this->prepare("SELECT item_value FROM challenge_metadata WHERE item_key = ?");
				if ($stmt){
					$stmt->execute(array(0 => 'db_version'));
					$data = $stmt->fetch();
					$version = $data['item_value'];
					unset($stmt);
				}
				$this->suppressError = false;
			}catch(Exception $e){
				$this->createTables();
				$version = CHALLENGE_DB_VERSION;
			}
			if ( CHALLENGE_DB_VERSION > $version ){
				$result =  $this->alterTables($version);
				$this->tablesChecked = $result;
				return $result;
			} else {
				$this->tablesChecked = true;
				return true;
			}
		}
		return true;
	}

	 
	public function alterTables($version)
	{
		$this->transaction();
		if($version < 2){
			$this->safeQuery('ALTER TABLE spam ADD itm_flags INTEGER');
			$this->safeQuery('ALTER TABLE quarantine ADD itm_flags INTEGER');
		} elseif ($version <= 3) {
			 			$this->safeQuery('ALTER TABLE quarantine ADD sync_hash ' . $this->sTextField);

			 			$list = $this->retrieve(
				'quarantine',
				'QuarantineItem',
				null,
				implode(',', array_merge(Quarantine::$hashFields, ['id']))
			);

			 			foreach ($list as $id => $quarantineItem) {
				$this->update(
					'quarantine',
					['id' => $id],
					['sync_hash' => Quarantine::createItemHash($quarantineItem->property)],
					true
				);
			}
		}
		$this->commit();
		
		$this->transaction();
		 		try{
			$stmt = $this->prepare('UPDATE challenge_metadata SET item_value = ? WHERE item_key = ?');
			$stmt->execute(array(strval(CHALLENGE_DB_VERSION), 'db_version'));
		 		}catch(Exception $e){
			$this->query('CREATE TABLE challenge_metadata ('.
				'item_key VARCHAR(128), '.
				'item_value VARCHAR(128))'
			);
			$stmt = $this->prepare('INSERT INTO challenge_metadata (item_key, item_value) '.
				'VALUES (?, ?)');
			$stmt->execute(
				array(
					'db_version',
					strval(CHALLENGE_DB_VERSION)
				)
			);
		}
		$this->commit();
		return true;
	}
	
	public function dropTables()
	{
		$this->safeQuery('DROP TABLE report');
		$this->safeQuery('DROP TABLE spam');
		$this->safeQuery('DROP TABLE quarantine');
		$this->safeQuery('DROP TABLE admin');
		$this->safeQuery('DROP TABLE spam_admin');
		$this->safeQuery('DROP TABLE quarantine_admin');
		$this->safeQuery('DROP TABLE challenge_metadata');
	}
	
	 
	public function initDatabase()
	{
		 		$this->sTextField = 'text';
		switch($this->dbtype){
			case 'MYSQL':
				$this->sDBType = '';			case 'MSSQL':
			case 'ODBC':
				 				if ($this->dbtype=='ODBC' || $this->dbtype=='MSSQL') {
					$this->sAutoincrement = 'IDENTITY';
					$this->sTextField = 'varchar(8000)';
				}else{
					$this->sAutoincrement = 'AUTO_INCREMENT';
				}
				try{
                    parent::initDatabase();
					$this->setStatementClass('slDatabaseStatement');
					 
				}catch (PDOException $e){
					 					self::doLog("db_auto_create:".$e->getMessage(),12);
					throw new Exc('db_auto_create',$e->getMessage());
				}
				break;
			case 'SQLITE':
			default:
				$this->sAutoincrement = 'AUTOINCREMENT';
				$this->sDBType = '';
				$filename = $this->pureconn;
				$location = dirname($this->pureconn);
				$this->sTextField .=' DEFAULT \'\'';
				$newDatabase = !is_file($filename);
				 				if ($newDatabase){
					if(!is_dir($location)){
						if(!slToolsFilesystem::mkdir_r($location)){
							self::doLog("db_create_sqlitefile:".$filename,12);
							throw new Exc('db_create_sqlitefile');
						}
					}
	
				}
				$sConn = 'sqlite:'.$filename;
                parent::initDatabase();
				$this->setStatementClass('slDatabaseStatement');
				 				$this->query('PRAGMA synchronous = 0;');
				$this->query('PRAGMA temp_store = 2;');
				break;
		}
	}
}

 
class ChallengeCacheTable
{


	static protected $instance = array();
	var $SYNC_ID;	
	protected $table;
	
	protected function __construct( $table, &$cache )
	{
		$this->cache = &$cache;
		$this->setTable( $table );
	}
	
	static public function instance( $class, $table, &$cache )
	{
		$index = $table.md5($cache->connection.$cache->dbuser.$cache->dbpass);
		if(!isset(self::$instance[$index])){
			self::$instance[$index] = new $class( $table, $cache );
		}
		return self::$instance[$index];
	}
	public function setTable( $table )
	{
		$this->table = $table;
	}
	
	public function getTable()
	{
		return $this->table;
	}
	
	public function create( $item, $transaction = false )
	{
		$id = $this->cache->create( $this->table, $item, $transaction );
		$result = $item;
		$result['id'] = $id;
		$param = false;
		$recordName = $this->getWrapperClassName();
		return new $recordName( $param, $result );
	}

	public function retrieve( $fields = '*', $where = '', $offset = false, $limit = false, $order = '',$search = false, $fulltext = false, $groupBy = false, $result = 'object',$id = 'id')
	{
		$recordName = $this->getWrapperClassName();
		return $this->cache->retrieve( 
			$this->getTable(),
			$recordName,
			false, 
			$fields, 
			$where, 
			$offset, 
			$limit, 
			$order,
			$search,
			$fulltext,
			$groupBy,
			$result,
			$id
		);
	}
	
	public function query( $query, $values = false, $result = 'object', $id = 'id' )
	{
		$recordName = $this->getWrapperClassName();
		return $this->cache->customQuery( 
			$this->getTable(),
			$recordName,
			false,
			$query,
			$values,
			$result,
			$id
		);
	}
	
	public function update( $id, $item ,$transaction = false)
	{
		return $this->cache->update( $this->table, $id, $item, $transaction );
	}

	public function delete( $id ,$transaction = false, $condition = false)
	{
		if($condition){
			$selector = implode('=? AND ', array_keys($condition)) . ' = ?';
			$values = array_values($condition);
		}else{
			$selector = 'id = ?';
			$values = array($id);
		}
		return $this->cache->delete( 
			$this->table, 
			array(
				'condition'=>$selector,
				'value'=>$values
			), 
			$transaction
		);
	}
	
	public function getCached( $recipient, $report_id, $mode, $groupBy = false, $fields = '*',$result = 'object', $id = 'id',$sender = false, $all = false)
	{
		$where['condition'] = '( ';
		$where['condition'] .= 'itm_recipient = :itm_recipient';
		$where['value'][':itm_recipient'] = $recipient;
		 		 		 		 		if( $sender ){
			$where['condition'] .= ' AND itm_sender = :itm_sender';
			$where['value'][':itm_sender'] = $sender;
		}else{
			 			if( $mode == 1){
				$where['condition'] .= ' AND itm_report_id <= :itm_report_id AND (itm_seen_by_owner = :itm_report_id OR itm_seen_by_owner = 0)';
			}else{
				$where['condition'] .= ' AND itm_report_id <= :itm_report_id';
			}
			$where['value'][':itm_report_id'] = $report_id;
		}
		$where['condition'] .= ' )';
		
		$list = $this->retrieve(
			$fields,
			$where,
			false,
			false,
			'itm_date desc,itm_time desc',
			false,
			false,
			$groupBy,
			$result,
			$id
		);
		return $list;
	}

	
	public function getItem( $id )
	{
		$where = array(
			'condition'=>'id = :itm_id',
			'value'=>array(
				':itm_id'=>$id
			)
		);
		$list = $this->retrieve(
			'*',
			$where
		);
		if($list){
			$list = reset($list);
		}
		return $list;	
	}

	
	 
	public function getItems( $report_id, $account, $mode, &$send = false, $groupBy = false, $hasRecent = true, $fields = '*',$result = 'object', $id = 'id' )
	{
		$result = $this->getCached(
				$account, 
				$report_id, 
				$mode,
				$groupBy,
				$fields,
				$result,
				$id,
				false
		);
		
		if( ( $mode==1 && $hasRecent==true )
			|| ( $mode==2 && count($result) > 0 ) ){
			$send = true;
		}else{
			$result = array();
		}
		return $result;
	}

	public function getSenderItems( $report_id, $account, $sender, $all = false, $mode = 2, $fields = '*', $result = 'object', $id = 'id' )
	{
		$result = $this->getCached(
				$account, 
				$report_id, 
				$mode,
				$groupBy,
				$fields,
				$result,
				$id,
				$sender,
				$all
		);
		return $result;
	}
	
	public function getWrapperClassName()
	{
		return 'slCacheRecord';
	}

	public function sync( $user, $report_id, &$hasRecent, $adminID = false, $relationStorage = false )
	{
		$relation = array();
		$relation['admin_id'] = $adminID;
		$relation['report_id'] = $report_id;
		$current = $this->getIDList( $user );

		if($adminID){
			$adminItems = $this->getAdminItems( 
				$report_id, 
				$user->account->EmailAddress,
				2,
				$send,
				false,
				true,
				'id,itm_folder,itm_sender,itm_recipient,itm_seen_by_owner' . ($this->table=='quarantine'?',sync_hash':''), 
				'array',
				$this->SYNC_ID,
				false,
				$adminID
			);
		}
		$personalItems = $this->getItems( 
				$report_id, 
				$user->account->EmailAddress,
				2,
				$send,
				false,
				true,
				'id,itm_folder,itm_sender,itm_recipient,itm_seen_by_owner' . ($this->table=='quarantine'?',sync_hash':''), 
				'array',
				$this->SYNC_ID
		);

		$cached = slToolsPHP::array_merge($personalItems,$adminItems);

		$this->cache->transaction();

		foreach($current as $itemID => $itemPath){
			if(!isset($cached[$itemID])){
				 				try{
					$item = $this->getItemDetail( 
						$itemPath,
						$report_id,
						$user->account->EmailAddress, 
						$itemID, 
						$adminID,
						$itemPath,
						false
					);
				}catch(Exception $e){
					 					continue;
				}
				 				if($adminID == false){
					$item['itm_seen_by_owner'] = $report_id;
				}

				$cacheItem = $this->safeCreate( $item, true );

				$cacheID = $cacheItem->getID();
				$sender = $item['itm_sender'];
				$rcp = $item['itm_recipient'];
				$infoUsers[$rcp]['new'][$sender] = $sender;
			}else{
				$cacheID = $cached[$itemID]['id'];
				$sender = $cached[$itemID]['itm_sender'];
				$rcp = $cached[$itemID]['itm_recipient'];
				$infoUsers[$rcp]['all'][$sender] = $sender;
			}

			 			if((!isset($personalItems[$itemID]) || $personalItems[$itemID]['itm_seen_by_owner']==0) && $adminID == false){
				$item = array();
				$item['itm_seen_by_owner'] = $report_id;
				$this->update( array('id'=>$cacheID), $item, true );    
				$newPersonal[$sender] = $sender; 
			}else{
				$existingPersonal[$sender] = 1;
			}
			 			if(!isset($adminItems[$itemID]) && $adminID != false){
				$relation[$this->getTable().'_id'] = $cacheID;
				try{
					$relationStorage->create($relation , true);
				}catch(Exception $e){
					
				}
				$newAdmin[$sender] = $sender;
			}else{
				$existingAdmin[$sender] = 1;
			}
			unset( $cached[$itemID] );
		}
		foreach($cached as $item){
			 			$this->delete( $item['id'], true );
			if($relationStorage){
				$condition[$this->getTable().'_id'] = $item['id'];
				$relationStorage->delete( $item['id'] ,true, $condition);
			}
		}
		$this->cache->commit();
		if(is_array($infoUsers) && !empty($infoUsers)){
			$app = ChallengeApplication::instance();
			foreach($infoUsers as $backupKey => $backupUser){
				if(is_array($backupUser['new']) && !empty($backupUser['new'])){
					foreach($backupUser['new'] as $rcp){
						$app->message("(new) From: ".$rcp.', To: '.$backupKey);
					}
				}
				if($app->getLogging()>3){
					if(is_array($backupUser['all']) && !empty($backupUser['all'])){
						foreach($backupUser['all'] as $rcp){
							$app->message("(all) From: ".$rcp.', To: '.$backupKey);
						}
					}
				}
			}
		}
		 		if( $adminID != false ){
			$existing = &$existingAdmin;
			$new = &$newAdmin;
		}else{
			$existing = &$existingPersonal;
			$new = &$newPersonal;
		}
		foreach($existing as $sender => $val){
			unset($new[$sender]);
		}

		if(count($new)){
			$hasRecent  = true;
		}else{
			$hasRecent = false;
		}
	}
	
	public function safeCreate($item, $transaction = false)
	{
		try{
			if(!$item['itm_subject']){
				$item['itm_subject'] = 'blank';
			}
			$this->suppressError = true;
			return $this->create( $item, $transaction );
		}catch(Exception $e){
			 			$fourbyte = $this->dbtype=='MYSQL'?true:false;
			$item['itm_subject'] = slToolsString::utf8_bad_replace($item['itm_subject'],' ',false,$fourbyte);
			$item['itm_sender'] = slToolsString::utf8_bad_replace($item['itm_sender'],' ',false,$fourbyte);
			$item['itm_recipient'] = slToolsString::utf8_bad_replace($item['itm_recipient'],' ',false,$fourbyte);
			
			$cutlen = $this->dbsyntax=='oracle'?2000:8000;
			 			$item['itm_subject'] = iconv_substr($item['itm_subject'],0,$cutlen,'utf-8');
			$item['itm_sender'] = iconv_substr($item['itm_sender'] ,0,$cutlen,'utf-8');
			$item['itm_recipient'] = iconv_substr($item['itm_recipient'],0,$cutlen,'utf-8');

			$this->suppressError = false;
			try{
				return $this->create( $item, $transaction );
			}catch(Exception $e){
				
				$item['itm_subject'] = slToolsCharset::my_iconv('','US-ASCII//TRANSLIT//IGNORE',$item['itm_subject']);
				$item['itm_sender']  = slToolsCharset::my_iconv('','US-ASCII//TRANSLIT//IGNORE',$item['itm_sender']);
				$item['itm_recipient']  = slToolsCharset::my_iconv('','US-ASCII//TRANSLIT//IGNORE',$item['itm_recipient']);
				
				return $this->create( $item, $transaction );
			}
		}
	}

}



?>