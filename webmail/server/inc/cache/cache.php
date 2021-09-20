<?php
define('CACHE_ITEM_CHUNK_SIZE', 1000);
 
class Cache extends slDatabase 
{
	public $paths;  	static private $base;
	static private $refresh;
	public $fulltext;
	public $sBitOR;
	public $sOracleFolderPK;
	public $sAutoincrement;
	public $sPK;
	public $sizeField;
	public $sDBType;
	public $sOracleItemPK;
	public $index_account;
	public $index_sort_from;
	public $index_sort_to;
	public $sTextField;
	public $index_rid;
	public $dateField;
	public $dbsynatx;

	 
	public function __construct(&$user = false,$dbsettings = array())
	{
		
		if(is_object($user)){
			$this->paths = new Paths(User::getTempDir(),$this);
			if(defined('DB_MIGRATION') && DB_MIGRATION===true){
				$conn = DB_MIGRATION_SOURCE;
			}else{
				$conn = self::fixSQLitePath($_SESSION['DBCONN'],$_SESSION['USERNAME'],$_SESSION['DOMAIN'],User::getDir());
			}
			$dbuser = $_SESSION['DBUSER'];
			$dbpass = $_SESSION['DBPASS'];
			$nonsensetranslate = array(
					0=>0,
					1=>2,
					2=>1,
					3=>3
			);
			$query_log = $nonsensetranslate[$_SESSION['QUERY_LOG']];
			$performance_log_threshold = $_SESSION['PERFORMANCE_LOG_THRESHOLD'];
			$collation = $_SESSION['COLLATION'];
			$collate_enable = $_SESSION['COLLATE_ENABLE'];
			$extended_logs = $_SESSION['LOGS'] >= 4;
			$dbsyntax = $_SESSION['DBSYNTAX'];
			$export = false;
			$checkTables = true;
		}else{
			$conn = $dbsettings['connection'];
			$dbuser = $dbsettings['user'];
			$dbpass = $dbsettings['pass'];
			$query_log = $dbsettings['query_log']?$dbsettings['query_log']:0;
			$performance_log_threshold = $dbsettings['perf_threshold']?$dbsettings['perf_threshold']:0;
			$collation = $dbsettings['collation']?$dbsettings['collation']:'';
			$collate_enable = $collation?true:false;
			$extended_logs = $dbsettings['extended_logs'];
			$dbsyntax = $dbsettings['syntax'];
			$export = $dbsettings['export'];
			if(isset($dbsettings['check_tables'])){
				$checkTables = $dbsettings['check_tables'];
			}else{
				$checkTables = true;
			}
		}
		
		parent::__construct(
			$conn,
			$dbuser,
			$dbpass,
			$query_log,
			$performance_log_threshold,
			$collation,
			$collate_enable,
			$extended_logs,
			$dbsyntax,
			$export,
			$checkTables
		);
	}
	
	 	static public function instance(&$user = false,$dbsettings = array())
	{
		if(!isset(self::$base) || self::$refresh == true){
			self::$base = new Cache($user,$dbsettings);
			self::$refresh = false;
		}
		return self::$base;
	}
	static public function release()
	{
		self::$refresh = true;
	}
	
	
	public function fixEscape($condition)
	{
		switch(strtolower($this->dbtype)){
			case 'mysql':
				$condition = preg_replace('/(\{(ESCAPE \'.\')\})/si','',$condition);
				$condition = str_replace('\\','\\\\',$condition);
			case 'mssql':
			case 'odbc':
			case 'oci':
				if($this->dbsyntax=='oracle'){
					$condition = preg_replace('/(\{(ESCAPE \'.\')\})/si','',$condition);
				}
				$condition = str_replace('\\','\\\\',$condition);
				$condition = preg_replace('/(\{(ESCAPE \'([^\']+)\')\})/si','{ESCAPE \'\\\'}',$condition);
			break;
			case 'sqlite':
			default:
				$condition = str_replace('\\','\\\\',$condition);
				$condition = preg_replace('/(\{(ESCAPE \'([^\']+)\')\})/si','ESCAPE \'\\\'',$condition);
			break;
		}
		return $condition;
	}
	
	static public function fixSQLitePath($path,$user,$domain,$userdir)
	{
		$path = str_replace("%WMUSERPATH%",$userdir,$path);
		$path = str_replace("%USER%",$user,$path);
		$path = str_replace("%DOMAIN%",$domain,$path);
		
		return $path;
	}
	 
	public function getFolders($account, $class)
	{

		$this->transaction();
		$stmt = $this->prepare('SELECT folder_id, name, rights, sync, attributes, path, uid_validity, messages, unseen, sync_update, subscription_type
								FROM folder
								WHERE account_id = ?');
		$stmt->execute(array($account->accountID));

		$folders = array();
		
		while ($row = $stmt->fetch()) {
			$folder = new $class(
				$account,
				intval($row['folder_id']),
				$row['name'],
				intval($row['rights']),
				$row['sync'],
				$row['attributes'],
				$row['path'],
				$row['uid_validity'],
				$row['messages'],
				$row['unseen'],
				$row['sync_update'],
				$row['subscription_type']
			);
			$folders[$folder->name] = $folder;
		}
		$this->commit();
		return $folders;
	}
	
	 
	public function getChildern($account, $class, $folderID)
	{
		$this->transaction();
		$stmt = $this->prepare('SELECT folder_id, name, rights, sync, attributes, path, uid_validity, messages, unseen, sync_update, subscription_type
								FROM folder
								WHERE account_id = ? AND parent_folder_id = ?');
		$stmt->execute(array($account->accountID,$folderID));

		$folders = array();
		while ($row = $stmt->fetch()) {
			$folder = new $class(
				$account,
				intval($row['folder_id']),
				$row['name'],
				intval($row['rights']),
				$row['sync'],
				$row['attributes'],
				$row['path'],
				$row['uid_validity'],
				$row['messages'],
				$row['unseen'],
				$row['sync_update'],
				$row['subscription_type']
			);
			$folders[$folder->name] = $folder;
		}
		$this->commit();

		if(count($folders)!=0) return $folders;
		
    return false;
	}
	
	public function getFolderById($account, $class, $folderID)
	{
		$this->transaction();
		$stmt = $this->prepare('SELECT folder_id, name, rights, sync, attributes, path, uid_validity, messages, unseen, sync_update, subscription_type
								FROM folder
								WHERE folder_id = ?');
		$stmt->execute(array($folderID));

		if($row = $stmt->fetch()){
			$result = new $class(
				$account,
				intval($row['folder_id']),
				$row['name'],
				intval($row['rights']),
				$row['sync'],
				$row['attributes'],
				$row['path'],
				$row['uid_validity'],
				$row['messages'],
				$row['unseen'],
				$row['sync_update'],
				$row['subscription_type']
			);
		}else{
			$result = false;
		}
		$this->commit();
		return $result;
	}
	
	 
	public function getParent($account, $class, $folderID)
	{
		$this->transaction();
		$stmt = $this->prepare('SELECT name, parent_folder_id
								FROM folder
								WHERE folder_id = ? AND account_id = ?');
		$stmt->execute(array($folderID,$account->accountID));

		$parentID = null;
    while($row = $stmt->fetch())
            $parentID = $row['parent_folder_id'];
		
    $stmt = $this->prepare('SELECT name
								FROM folder
								WHERE folder_id = ?');
								
		$stmt->execute(array($parentID));            
    
    while($row = $stmt->fetch())
            $parentName = $row['name'];   
    
         $type = 'main';

    if (isset($parentName))
    	$folder = $account->getFolder($parentName,$type);
    else
    	$folder = null;

		$this->commit();

    return $folder;
	}
	
	private function optimizeOrderBy(&$orderBy,&$fields)
	{
		 		$orderBy = str_ireplace(
			array(
				'header_from',
				'header_to',
				'header_cc',
				'header_bcc',
				'header_sms'
			),
			array(
				'sort_from',
				'sort_to',
				'sort_cc',
				'sort_bcc',
				'sort_sms',
			),
			$orderBy
		);
		
		if($this->dbsyntax=='oracle'){
			$orderBy = str_replace("date",'"date"',$orderBy);
			$orderBy = str_replace("size",'"size"',$orderBy);
		}
		$orderBy = preg_replace("/subject\s(ASC|DESC)/si","sort_subject \\1,subject \\1",$orderBy);
		
		$this->addSortColumn('header_from','sort_from',$fields);
		$this->addSortColumn('header_to','sort_to',$fields);
		$this->addSortColumn('header_cc','sort_cc',$fields);
		$this->addSortColumn('header_bcc','sort_bcc',$fields);
		$this->addSortColumn('header_sms','sort_sms',$fields);
		$this->addSortColumn('subject','sort_subject',$fields);
	}
	
	private function addSortColumn($column,$sort_column,&$fields)
	{
		if(stripos($fields,$column)!==false){
			if(stripos($fields,$sort_column)===false){
				$fields.=','.$sort_column;
			}
		}
	}

	
	 
	public function getItems(  $folder,$aFilterTag = array('tag'=>'*'), $class = 'CacheItem', $createObject = true, $ignoreHidden = true)
	{
		$filter = $aFilterTag['sql'];
		$orderBy = $aFilterTag['orderby'];
		$offset = $aFilterTag['offset'];
		$limit = $aFilterTag['limit'];
		$fields = $aFilterTag['tag'];
		$search = $aFilterTag['fulltext'] ?? '';
		
		$resultFields = $fields;
		$resultFields = explode(',',$resultFields);
		
		$selector = $this->getFolderSelector( $folder, $isComplicated );
		$hidden = $ignoreHidden?'(is_hidden is NULL OR is_hidden!=1) AND ':'';
		$this->transaction();
		if ($orderBy){
			$orderBy = icewarp_sanitize_db_sql($orderBy,false,true);
			if($this->collate_enable){
				$orderBy = Tools::collateOrderBy($orderBy,$this->collation);
			}
			$orderBy = ' ORDER BY '. $orderBy;
			$this->optimizeOrderBy($orderBy,$fields);
		}
		if (intval($limit)){
			$limit = ' LIMIT ' . intval($offset) . ',' . intval($limit);
			$limit = icewarp_sanitize_db_sql($limit);
		}
		$filter = $this->composeFilter($filter,$search);
		 		$aAllowedFields = array(
			'item_id',
			'rid',
			'size',
			'date',
			'flags',
			'header_from',
			'header_to',
			'header_cc',
			'header_bcc',
			'header_sms',
			'sort_from',
			'sort_to',
			'sort_cc',
			'sort_bcc',
			'sort_sms',
			'message_id',
			'subject',
			'static_flags',
			'priority',
			'color',
			'smime_status',
			'has_attachment',
			'unread',
			'msg_file',
			'flag_update',
			'is_hidden',
			'source_folder_id',
			'dummy_id',
			'folder_id',
			'taglist',
			'item_moved',
			'*'
		);
		
		
		 		if (strpos($fields,'*')!==false) 
    {       
            $bFields = false;
            $sFields = '*';
		
    } else{ 

            $bFields = true;
            if (substr_count($fields,'item_id')==0) $fields.=',item_id';
			if (substr_count($fields,'rid')==0) $fields.=',rid';
			if (substr_count($fields,'is_hidden')==0) $fields.=',is_hidden';
			if (substr_count($fields,'folder_id')==0) $fields.=','.($isComplicated?'i.':'') .'folder_id';
    
			$sFields = '';
		foreach($aAllowedFields as $field)
          if (substr_count($fields,$field)>0 || !$bFields) 
                $sFields .= ($isComplicated?'i.':'').$field.',';

    $sFields = substr($sFields,0,strlen($sFields)-1);  
    }
	$sFields = icewarp_sanitize_db_sql($sFields);
	 	if($isComplicated){
		$stmt = $this->getComplicatedStatement($selector,$folder,$sFields,$filter,$orderBy,$limit);
		$values = array();
	}else{
	     	    if($limit && ($this->dbtype == 'ODBC' || $this->dbtype=='OCI')){
			$rowNumberOrder = (empty($orderBy)) ? ' ORDER BY '.$this->dateField:$orderBy;
			switch($this->dbsyntax){
				case 'oracle':
					 					if($limit){
						$limit = str_replace('LIMIT ', '', $limit);
						$limit = explode(',', $limit);
					}
					$sFields = preg_replace('/date(?!")/','"date"',$sFields );
					$rowNumberOrder = preg_replace('/date(?!")/','"date"',$rowNumberOrder);
					$sFields = preg_replace('/size(?!")/','"size"',$sFields );
					$stmt = $this->prepare(
							'SELECT '.$sFields.',rnum '.
							'FROM ( SELECT a.*,row_number() over ('.$rowNumberOrder.') as rnum '.
									'FROM item a WHERE ('.$hidden.$selector.$filter.')) b '.
							'WHERE (b.rnum BETWEEN '.intval($limit[0]).' AND '.intval($limit[0]+$limit[1]).' ) '.
							$orderBy
					);
					$values = array();
				break;
				case 'default':
				case 'mssql':
				default:
					 					$limit = str_replace('LIMIT ', '', $limit);
					$limit = explode(',', $limit);
					 					$stmt = $this->prepare(
							'SELECT TOP '.intval($limit[1]). ' '.$sFields.' FROM
							(SELECT TOP '.intval($limit[1]+$limit[0]).' '.$sFields.',ROW_NUMBER() OVER('.$rowNumberOrder.') as row
							FROM item WHERE ('.$hidden.$selector.$filter.') '.$orderBy.') x
							WHERE x.row BETWEEN '.intval($limit[0]+1).' and '.intval($limit[1]+$limit[0])
					);
					$values = array();
				break;
			}	
	    }else{
	    	$stmt = $this->prepare(
	    		'SELECT '.$sFields.
	    		' FROM item'.
	    		' WHERE  '.$hidden.$selector.$filter . ' '.
	    		$orderBy.($limit?$limit:'')
	    	);
	    	$values = array();
		}
	}
		$stmt->execute($values);

		$items = array();
		while ($row = $stmt->fetch()) {
			if($createObject){
			$item = new $class(
				$folder,
				isset($row['item_id']) ? intval($row['item_id']) : '', 
				isset($row['rid']) ? $row['rid'] : '',
				isset($row['size']) ? intval($row['size']) : '', 
				isset($row['date']) ? $row['date'] : '',
				isset($row['flags']) ? intval($row['flags']) : '',
				isset($row['header_from']) ? $row['header_from'] : '', 
				isset($row['header_to']) ? $row['header_to'] : '',
				isset($row['subject']) ? $row['subject'] : '',
				isset($row['static_flags']) ? intval($row['static_flags']) : '',
				isset($row['priority']) ? intval($row['priority']) : '',
				isset($row['color']) ? $row['color'] : null,
				isset($row['smime_status']) ? intval($row['smime_status']) : '',
				(isset($row['has_attachment']) && $row['has_attachment'] == 'T') ? true : false,
				isset($row['body']) ? $row['body'] : null,
				isset($row['header_cc']) ? $row['header_cc'] : '',
				isset($row['header_bcc']) ? $row['header_bcc'] : '',
				isset($row['header_sms']) ? $row['header_sms'] : '',
				isset($row['sort_from']) ? $row['sort_from'] : '',
				isset($row['sort_to']) ? $row['sort_to'] : '',
				isset($row['sort_cc']) ? $row['sort_cc'] : '',
				isset($row['sort_bcc']) ? $row['sort_bcc'] : '',
				isset($row['sort_sms']) ? $row['sort_sms'] : '',
				isset($row['message_id']) ? $row['message_id'] : '',
				isset($row['item_moved']) ? $row['item_moved'] : '',
				isset($row['msg_file']) ? $row['msg_file'] : '',
				isset($row['flag_update']) ? $row['flag_update'] : '',
				isset($row['source_folder_id']) ? $row['source_folder_id'] : '',
				isset($row['is_hidden']) ? $row['is_hidden'] : '',
				isset($row['dummy_id']) ? $row['dummy_id'] : '',
				isset($row['taglist']) ? $row['taglist'] : ''
			);
			$item->original_folder_id = $row['folder_id'];
			$items[$item->itemID] = $item;
			}else{
				$item = array();
				foreach($resultFields as $field){
					$item[trim($field)] = $row[(trim($field))];
				}
				$items[$row['item_id']] = $item;
				
			}
		}
		$this->commit();
		return $items;
	}
	
	public function getItemsIDByCondition( $folder, $condition, $limit = '',$forceIndex = '' )
	{
		$duplicated = array();
		$result =  $this->getItemsID(
			$folder,
			true,
			$duplicated,
			$folder->itemClassName,
			"item_id,rid,flags,color,msg_file,flag_update,source_folder_id,dummy_id,taglist",
			$condition,
			$limit,
			$forceIndex
		);
		
		return $result;
	}
	
	
	public function getFolderSelector( $folder, &$isComplicated = false )
	{
		$ids = null;
		$selector = null;
		if($folder->type=='V'){
			if($folder->folders && !empty($folder->folders)) foreach($folder->folders as $fdr){
				$ids[] = $fdr->folderID;
			}
			if($ids){
				$selector = ' folder_id IN ( '.join(',',$ids ).' ) ';
			}else{
				 				$shared_id = $folder->account->account->getFolder('__@@SHARED@@__');
				$shared_id = $shared_id->folderID;
				switch(strtoupper($this->dbtype)){
					case 'SQLITE':
						$selector = ' folder_id <> \''.$shared_id.'\'';
					break;
					case 'OCI':
					case 'MSSQL':
					case 'ODBC':
						$selector = ' folder_id IN (SELECT folder_id FROM folder WHERE account_id = \''.
							$folder->account->account->accountID.
							'\' AND folder_id <> \''.$shared_id.'\') ';
						break;
					case 'MYSQL':
						$isComplicated = true;
						$selector =  '( f.account_id = \''.$folder->account->account->accountID.
							'\' AND  f.folder_id <> '.$shared_id.
							') ';
					break;
				}
			}
		}else{
			$selector = ' folder_id = '.$folder->folderID.' ';
		}
		return $selector;
	}
	
	public function getFolderQuery($folder, $limit, $dbType)
	{
		
	}

	 
	public function getItem($folder, $class, $itemID,$initialized = false, $rid = false)
	{
		$row = $this->getItemRow($folder,$itemID,$initialized,$class, $rid);
		$item = new $class(
			$folder,
			$row['item_id'],
			$row['rid'],
			intval($row['size']), 
			$row['date'],
			intval($row['flags']),
			$row['header_from'], 
			$row['header_to'],
			$row['subject'],
			intval($row['static_flags']),
			intval($row['priority']),
			$row['color'],
			intval($row['smime_status']),
			($row['has_attachment'] == 'T') ? true : false,
			($class=='RSSItem') ? $row['body'] : NULL,
			isset($row['header_cc']) ? $row['header_cc'] : '',
			isset($row['header_bcc']) ? $row['header_bcc'] : '',
			isset($row['header_sms']) ? $row['header_sms'] : '',
			isset($row['sort_from']) ? $row['sort_from'] : '',
			isset($row['sort_to']) ? $row['sort_to'] : '',
			isset($row['sort_cc']) ? $row['sort_cc'] : '',
			isset($row['sort_bcc']) ? $row['sort_bcc'] : '',
			isset($row['sort_sms']) ? $row['sort_sms'] : '',
			isset($row['message_id']) ? $row['message_id'] : '',
			isset($row['item_moved']) ? $row['item_moved'] : '',
			isset($row['msg_file']) ? $row['msg_file'] : '',
			isset($row['flag_update']) ? $row['flag_update'] : '',
			isset($row['source_folder_id']) ? $row['source_folder_id'] : '',
			isset($row['is_hidden']) ? $row['is_hidden'] : '',
			isset($row['dummy_id']) ? $row['dummy_id'] : '',
			isset($row['taglist']) ? $row['taglist'] : ''
		);
		$item->original_folder_id = $row['folder_id'];
		return $item;
	}
	
	public function getItemRow($folder,$itemID,$initialized = false,$class = '', $rid = '')
	{
		if (!$initialized) $this->transaction();
		if($folder->type!='V'){
			$fdrCondition = 'folder_id = ? AND ';
		}else{
			$fdrCondition = '';
		}
		if($rid){
			$itmCondition = ' rid = ?';
		}else{
			$itmCondition = ' item_id = ?';
		}
		
		if($rid && $folder->itemClassName=='IMAPItem'){
			$rid = IMAP::fixID($rid);
		}
		$stmt = $this->prepare(
			'SELECT item_id, rid, folder_id, '.$this->sizeField.', '.$this->dateField.' , flags,'.
			'header_from, header_to,header_cc,header_bcc,header_sms,subject,'.
			'static_flags, priority, color, smime_status,message_id,sort_from,sort_to,'.
			'sort_cc,sort_bcc,sort_sms,msg_file,flag_update,source_folder_id,is_hidden,'.
			'dummy_id,taglist,item_moved,has_attachment'.($class=='RSSItem'?', body':'').
				' FROM item'.
				' WHERE '.$fdrCondition.$itmCondition
		);
		if($folder->type!='V'){
			$stmt->execute(array($folder->folderID,$rid?$rid:$itemID));
		}else{
			$stmt->execute(array($itemID));
		}
		$row = $stmt->fetch();
		$stmt->closeCursor();
		if (!$initialized) $this->commit();
		if (!$row){
			throw new Exc('item_invalid_id');   		}
			 		return $row;
	}

	 
	public function countItems($folder, $flags = 0, $positive = true,$filter = '',$search = false)
	{
		
		$selector = $this->getFolderSelector( $folder, $isComplicated );
		$filter = $this->composeFilter( $filter, $search );
		
		$this->transaction();
		if ($flags) {
			$not = $positive ? '' : 'NOT';
			if($flags==32){
				if($isComplicated){
					$flagCondition = 'i.unread = ?';
				}else{
					$flagCondition = 'unread = ?';
				}
				$flags = $positive?0:1;
			}else{
				if($isComplicated){
					$flagCondition = $not . ' (i.flags & ? > 0)';
				}else{
					$flagCondition = $not . ' (flags & ? > 0)';
				}
			}
			$values = array( intval($flags) );
		} else {
			$values = array();
			$flagCondition = '';
		} 
		
		if($isComplicated){
			$stmt = $this->getComplicatedStatement($selector,$folder,'COUNT(*) AS count',$filter . ($flagCondition?' AND '.$flagCondition:''));
		}else{
			$stmt = $this->prepare(
				'SELECT COUNT(*) AS count '.
				'FROM item '.
				'WHERE (is_hidden != 1 OR is_hidden IS NULL) AND '.$selector . $filter.
				($flagCondition?' AND '.$flagCondition:'')
			);
		}
		 
				
		$stmt->execute($values);
		$row = $stmt->fetch();
		 
		$stmt->closeCursor();
		$this->commit();
		if (!$row)
			throw new Exc('item_count_retrieve',$folder->name);		return intval($row['count']);
	}
	
	public function composeFilter( $filter, $search, $isComplicated = false )
	{
		 		if($search && $this->fulltext){
			switch($this->dbtype){
				 
				default:
					$filter =  " AND (".($filter ? $filter . " OR " : "") . "body LIKE '%".$search."%')";
			break;
			}
		}else if($filter){
			$filter = ' AND '.$filter;
		}
		$filter = $this->fixEscape($filter);
		$filter = icewarp_sanitize_db_sql($filter);
		return $filter; 
	}

	 
	public function getFoldersID($accountID)
	{
		$this->transaction();
		$stmt = $this->prepare('SELECT folder_id, parent_folder_id, name, rights, attributes, path, uid_validity, subscription_type
								FROM folder
								WHERE account_id = ?');
		$stmt->execute(array($accountID));

		$folders = array();
		while ($row = $stmt->fetch()) {
			$folders[$row['name']] = array(
				'folder_id' => intval($row['folder_id']),
				'parent_folder_id' => intval($row['parent_folder_id']),
				'rights'	=> intval($row['rights']),
				'attributes'=> intval($row['attributes']),
				'path'=> intval($row['path']),
				'validity'=> intval($row['uid_validity']),
				'subscription_type'=>$row['subscription_type']
			);
		}
		$this->commit();

		return $folders;
	}

	 
	public function createFolder($fields)
	{
	  if (strtolower($fields['name'])=='inbox'){
	   $fields['sync'] = '1';
	   }
		
    return $this->create('folder', $fields);
	}
	
	 
	public function cleanup() {
		
		if ($this->dbtype=="SQLITE")
			$this->query('VACUUM');
	}
	 
	public function deleteFolder($accountID, $folderID, $depth = 0)
	{
		$this->transaction();

		 
		$stmt = $this->prepare('SELECT folder_id
								FROM folder
								WHERE account_id = ? AND parent_folder_id = ?');
		$stmt->execute(array($accountID,$folderID));
		$folders = $stmt->fetchAll();

		 
		if($folders) foreach ($folders as $row) {
			$this->deleteFolder($accountID, intval($row['folder_id']),
								$depth + 1);
		}
		if ($folders) {
			$stmt = $this->prepare('DELETE FROM folder
									WHERE account_id = ? AND parent_folder_id = ?');
			$stmt->execute(array($accountID,$folderID));
		}

		 
		if (!$depth) {
			$stmt = $this->prepare('DELETE FROM folder
									WHERE account_id = ? AND folder_id = ?');
			$stmt->execute(array($accountID,$folderID));
		}
		$stmt = $this->prepare('DELETE FROM item
								WHERE folder_id = ?');
		$stmt->execute(array($folderID));

		$this->commit();

	}
	       	 
	public function deleteItems(&$oFolder,$oItems = false,$delayed = false)
	{
		$this->transaction();
		if ($oItems!==false){
			foreach($oItems as $oItem){
				if($delayed){
					$this->updateItem(
						$oItem->itemID,
						array(),
						array(),
						'delete',
						$oItem
					);
				}else{
					$this->deleteItem(
						$oFolder->account->accountID,
						$oFolder->folderID,
						$oItem->itemID,
						$this
					);
				}
				if($oFolder && $oFolder->isRemote()){
					$this->deleteMessage(
						$oFolder->account->accountID,
						$oFolder->folderID,
						$oItem->itemID
					);
				}
			}
		} else {
			if($delayed){
				 				$stmt = $this->prepare("UPDATE item SET flag_update = flag_update | 2,is_hidden = 1 WHERE folder_id = ?");
				 				$stmt->execute(array($oFolder->folderID));
				if($oFolder && $oFolder->isRemote()){
					$this->deleteMessageDir($oFolder->account->accountID,$oFolder->folderID,true);
				}
			}else{
				$stmt = $this->prepare("DELETE FROM item WHERE folder_id = ?");
				$stmt->execute(array($oFolder->folderID));
			}
		}
		
		$this->commit();
		return true;
	}

	     	
	public function moveItems(&$oFrom,$oTo,$oItems = false,$aMovedID = false,$delayed = false)
	{
		 		 		$cache['cache'] = $this;
		 		if (!$oItems){
			$oI = $this->getItemsIDByCondition($oFrom,'( is_hidden != 1 )');
			if($oI) foreach($oI as $rid => $itm){
				$item = new stdClass();
				$item->itemID = $itm['item_id'];
				$item->rid = $rid;
				$item->source_folder_id = $itm['source_folder_id'];
				$item->dummy_id = $itm['dummy_id'];
				$item->flag_update = $itm['flag_update'];
				$oItems[$itm['item_id']] = $item;
			}
		}
		 		if($oItems){
			$oChunkedItems = array_chunk($oItems,CACHE_ITEM_CHUNK_SIZE);
			foreach($oChunkedItems as $oItemChunk){
				$this->transaction();
				foreach($oItemChunk as $oItem){
						$this->updateItem(
							$oItem->itemID,
							array(
								'folder_id'=>$oTo->folderID,
								'rid'=>isset($aMovedID[$oItem->rid])?$aMovedID[$oItem->rid]:$oItem->rid,
								'item_moved'=>time()
							),
							$cache,
							$delayed?'move':'none',
							$oItem,
							$oFrom,
							$oTo
						);
						if($oFrom && $oFrom->isRemote() && $oTo && $oTo->isRemote()){
							$this->moveMessage($oFrom->account->accountID,$oFrom->folderID,$oItem->itemID,$oTo->folderID);
						}
				}
				$this->commit();
			}
		}
		
		 		return true;
	}
	
	     	
	public function copyItems(&$oFrom,$oTo,$oItems = false,$aCopiedID = false)
	{
	 	$cache['cache'] = $this;
		if (!$oItems){
			$filter['tag']='*';
			$oItems = $oFrom->getItems($filter);
		}
		if($oItems) foreach($oItems as $oItem){
			$this->createItem(
				array(
					'folder_id' => $oTo->folderID,
					'rid' => $aCopiedID[$oItem->rid],
					'size' => $oItem->size,
					'date' => $oItem->date,
					'flags' => $oItem->flags,
					'header_from' => $oItem->from,
					'header_to' => $oItem->to,
					'subject' =>$oItem->subject,
					'static_flags' => $oItem->staticFlags,
					'priority' => intval($oItem->priority),
					'color' => $oItem->color,
					'body' => $oItem->body,
					'smime_status' => $oItem->sMimeStatus,
					'has_attachment' => $oItem->hasAttachments ? 'T' : 'F',
					'message_id'=>$oItem->message_id,
					'msg_file'=>$oItem->file,
					'taglist'=>$oItem->taglist,
					'item_moved'=>time()	
				),
				$cache
			);
		}
		return true;
	}
		
	 
	public function updateFolder($folderID, $fields)
	{
		$this->update('folder', array('folder_id' => $folderID), $fields);
	}

	public function renameFolder($accountID, 
                                $folderID,
                                $sOldFolderName,
                                $sNewFolderName,
                                $iDepth = 0,
                                $iLength = 0,
                                $stmtGetSubfolders = false,
                                $stmtUpdateFolder = false)
	{
		     if(!$iDepth){
      $this->transaction();
		   		  $stmtUpdateFolder = $this->prepare('UPDATE folder
        SET name = ?
        WHERE folder_id = ?');
             $stmtGetSubfolders = $this->prepare('SELECT folder_id,name
				FROM folder
				WHERE parent_folder_id = ?');
				
      $iLength = strlen($sOldFolderName);
    }

         $stmtUpdateFolder->execute(array($sNewFolderName, $folderID));
		
		 		$stmtGetSubfolders->execute(array($folderID));
		$aFolders = $stmtGetSubfolders->fetchAll();
	
		 		if($aFolders) foreach ($aFolders as $aFolder) { 
		  $sNewSubFolderName = $sNewFolderName.'/'.substr($aFolder['name'],$iLength+1);
      $this->renameFolder($accountID, 
                          intval($aFolder['folder_id']),
								          $sNewSubFolderName,
                          $aFolder['name'],
                          $iDepth + 1,
                          strlen($sNewSubFolderName),
                          $stmtGetSubfolders,
                          $stmtUpdateFolder);
		}		
		
		     if(!$iDepth){
      $this->commit();
    }
  }


	 
	public function getItemsID($folder,$transaction = true,&$duplicated = array(),$class = 'IMAPItem',$fields = 'item_id,rid,flags,color,msg_file,flag_update,source_folder_id,dummy_id,taglist',$condition = '',$limit = false,$forceIndex = '')
	{
		$selector = $this->getFolderSelector($folder, $isComplicated);
		if($condition){
			$selector .= ' AND '.$condition;
		}
		if ($transaction)
			$this->transaction();

		if($isComplicated){
			$stmt = $this->getComplicatedStatement($selector,$folder,$fields,'','','',$forceIndex);
		}else{
			$stmt = $this->prepare('SELECT '.$fields.'
						FROM item '.$forceIndex.
						' WHERE '.$selector);
		}
		$stmt->execute();
		 		$items = array();
		while ($row = $stmt->fetch()) {
			if(isset($items[IMAP::fixID($row['rid'])])){
				$duplicated[] = $row['item_id'];
				$duplicated[] = $items[IMAP::fixID($row['rid'])]['item_id'];
			}
			if ($class == 'IMAPItem') {
				$row['rid'] = IMAP::fixID($row['rid']);
			}
			$items[$row['rid']] = array(
				'item_id' => intval($row['item_id']),
				'flags'	=> intval($row['flags']),
				'color' => $row['color'],
				'header_from'=>$row['header_from'],
				'msg_file'=>$row['msg_file'],
				'flag_update'=>$row['flag_update'],
				'source_folder_id'=>$row['source_folder_id'],
				'dummy_id'=>$row['dummy_id'],
				'taglist'=>$row['taglist'],
                'date'=>$row['date']
			);
		}
		if ($transaction)
			$this->commit();
			
		return $items;
	}

	
	 
	public function createItem($fields,$cache = array())
	{
		if(isset($fields['flags'])){
			$fields['unread'] = (intval($fields['flags']) & Item::FLAG_SEEN) > 0?0:1;
		}
		if(!isset($fields['subject'])){
			$fields['subject'] = '';
		}else{
			$fields['sort_subject'] =  preg_replace("/^(([a-zA-Z]{2,3})([0-9\[\]]+)?:\s)+/s","",$fields['subject']);
		}
		if(!isset($fields['item_moved'])){
			$fields['item_moved'] = time();
		}
		
		try{
			$this->suppressError = true;
			return $this->create('item', $fields, $cache);
		}catch(Exception $e){
			return $this->itemFallback($fields, $fields['rid'],'create',$cache);
		}
	}

	 
	public function deleteItem($accountID, $folderID, $itemID,$cache = false,$delayed = false)
	{
		if ($cache===false) $this->transaction();
		
		if(!$delayed){
			$stmt = $this->prepare('DELETE FROM item
									WHERE item_id = ?');
			$stmt->execute(array($itemID));
		}else{
			$this->updateItem($itemID,array(),array(),'delete');
		}
		if ($cache===false) $this->commit();

		return true;
		 	}

	 
	public function updateItem($itemID, $fields, $cache = array(),$action = 'none',$item = false,$oFrom = false,$oTo = false)
	{
		
		if(isset($fields['flags'])){
			$fields['unread'] = (intval($fields['flags']) & Item::FLAG_SEEN) > 0?0:1;
		}
		if(isset($fields['subject'])){
			$fields['sort_subject'] =  preg_replace("/^(([a-zA-Z]{2,3})([0-9\[\]]+)?:\s)+/s","",$fields['subject']);
		}
		switch($action){
			case 'delete':
				$fields['flag_update'] = (int) $item->flag_update | 2;
				$fields['is_hidden'] = 1;
				if($item){
					if($item->dummy_id){
						$this->deleteItem(
							$item->folder->account->accountID,
							$item->folder->folderID,
							$item->dummy_id,
							$cache
						);
					}
				}
			break;
			case 'move':
				$fields['flag_update'] = (int) $item->flag_update | 4;
				if(!$item->source_folder_id){
					$dummy = array(
						'rid'=>$item->rid,
						'folder_id'=>$oFrom->folderID,
						'is_hidden'=>1,
						'size'=>$oTo->folderID,  						'date'=>-1,  
						'header_from'=>'',
						'header_to'=>'',
						'priority'=>0,
						'flags'=>0,
						'unread'=>0,
						'static_flags'=>0,
						'smime_status'=>0
					);
					$id = $this->createItem($dummy,$cache);
					$fields['source_folder_id'] = $oFrom->folderID;
					$fields['dummy_id'] = $id;
					$fields['item_moved'] = time();
				}else if($oTo->folderID == $item->source_folder_id){
					$this->deleteItem($oTo->account->accountID,$oTo->folderID,$item->dummy_id,$cache);
					$fields['source_folder_id'] = 0;
					$fields['flag_update'] = (int) $item->flag_update | ~4;
					$fields['dummy_id'] = 0; 
				}else{
					$this->update(
							'item',
							array('item_id' => $item->dummy_id),
							array('size' => $oTo->folderID)
					);
				}
			break;
			case 'flags':
				$fields['flag_update'] = (int) $item->flag_update | 1;
			break;
		}
		try{
			$this->suppressError = true;
			$this->update('item', array('item_id' => $itemID), $fields, $cache);
		}catch(Exception $e){
			$this->itemFallback($fields, $itemID, $methodName = 'update', $cache);
		}
	}

	 
	protected function create($table, $fields, $cache = array())
	{
		if($this->dbsyntax=='oracle'){
			if(isset($fields['date'])){
				$fields['"date"'] = $fields['date'];
				unset($fields['date']);
			}
			if(isset($fields['size'])){
				$fields['"size"'] = $fields['size'];
				unset($fields['size']);
			}
		}
		
		$columns = ' (' . implode(',', array_keys($fields)) . ') ';
		$values  = '(' . implode(',', array_fill(0, count($fields), '?')) . ')';

		if (!$cache['cache']){
			$this->transaction();
		}
		$stmt = $this->prepare('INSERT INTO ' . $table . $columns .
								'VALUES ' . $values);

		$stmt->execute(array_values($fields));
		
		$id = $this->getID($table);
		
		if (!$cache['cache']){
			$this->commit();
		}
		return $id;
	}

	 
	protected function update($table, $id, $fields, $cache = array())
	{
		$columns = implode('=?,', array_keys($fields)) . '=? ';
		$selector = implode('=? AND ', array_keys($id)) . '=?';
		if (!isset($cache['cache'])) $this->transaction();
		$stmt = $this->prepare('UPDATE ' . $table . ' SET ' . $columns .
								'WHERE ' . $selector);
		try{
			$stmt->execute(slToolsPHP::array_merge(array_values($fields), array_values($id)));
			
		 		}catch(Exception $e){
			switch($e->getMessage()){
				case 'failed_sql':
					if(strtolower($table)=='item'){
						throw $e;
					}
					break;
			}
		}
		if (!isset($cache['cache'])) $this->commit();
	}
	
	public function markFolderItems($mailbox,$flag, $oItems = false)
	{
		$ids = [];
		if($oItems){
			foreach($oItems as $oItem){
				$ids[] = $oItem->itemID;
			}
			$itemCondition = ' AND item_id IN('.join(',',$ids).')';
		}else{
			$itemCondition = '';
		}
		$itemCondition.= (($flag==32)?' AND unread = 1':'');
		$set = ($flag==32)?',unread = 0':'';
		if($this->dbsyntax=='oracle'){
			$set.=', flag_update = bitor(flag_update,1)';
			$stmt = $this->prepare(
					'UPDATE item SET flags = bitor(flags,?)'.$set.' WHERE folder_id = ?'.$itemCondition
			);
		}else{
			$set.=', flag_update = flag_update | 1';
			$stmt = $this->prepare(
					'UPDATE item SET flags = flags | ?'.$set.' WHERE folder_id = ?'.$itemCondition
			);
		}
		
		$stmt->execute(array($flag,$mailbox));
	}
  
	public function unmarkFolderItems($mailbox,$flag, $oItems = false)
	{
		$ids = [];
		if($oItems){
			foreach($oItems as $oItem){
				$ids[] = $oItem->itemID;
			}
			$itemCondition = ' AND item_id IN('.join(',',$ids).')';
		}else{
			$itemCondition = '';
		}
		$itemCondition.= (($flag==32)?' AND unread = 0':'');
		$set = ($flag==32)?',unread = 1':'';
		
		if($this->dbsyntax=='oracle'){
			$set.=', flag_update = BITOR(flag_update,1)';
			$stmt = $this->prepare(
				'UPDATE item SET flags = BITAND(flags,BITNOT(?)) '.$set.' WHERE folder_id = ?'.$itemCondition
			);
		}else{
			$set.=', flag_update = flag_update | 1';
			$stmt = $this->prepare(
				'UPDATE item SET flags = flags & ~? '.$set.' WHERE folder_id = ?'.$itemCondition
			);
		}
		$stmt->execute(array($flag,$mailbox));
	}



	 
	public function getMessage($accountID, $folderID, $itemID)
	{
		$file = $this->getMessageFile($this->getMessageDir($accountID, $folderID), $itemID);
		if (!is_file($file)){
			return false;
		}
		@$return =  file_get_contents($file);
		return $return;
	}

	 
	public function createMessage($accountID, $folderID, $itemID, $message = false,$fileName = false)
	{
  	  $dir = $this->getMessageDir($accountID, $folderID);
  		  
      if(!is_dir($dir)){
      	slSystem::import('tools/filesystem');
        slToolsFilesystem::mkdir($dir,0777,true);
      }
      $file = $this->getMessageFile($dir, $itemID);
      
      slSystem::import('tools/icewarp');
  	  if($fileName === false){
    		         if (substr($message,strlen($message)-4,4)!=CRLF.CRLF)
          $message.=CRLF.CRLF;
  
        @slToolsIcewarp::iw_file_put_contents($file, $message);
  	 }else{
        slToolsIcewarp::iw_copy($fileName,$file);
     }
  }
	
	 
	public function editMessage($accountID, $folderID, $itemID, $message, $filename = false)
	{
		$file = $this->getMessageFile(
					$this->getMessageDir(
							$accountID, 
							$folderID
					),
					$itemID
				);
		slSystem::import('tools/icewarp');
		if(!$filename){
	  		@slToolsIcewarp::iw_file_put_contents($file, $message);
		}else{
	  		@slToolsIcewarp::iw_copy($filename,$file);
		}
	}

	 
	public function deleteMessage($accountID, $folderID, $itemID)
	{
		$file = $this->getMessageFile($this->getMessageDir($accountID, $folderID),
									  $itemID);

    if (is_file($file)){
    	slSystem::import('tools/icewarp');
    	@slToolsIcewarp::iw_delete($file);
    }
	return true;
	}

	 
	public function moveMessage($accountID, $folderID, $itemID, $dstFolderID)
	{
		$file = $this->getMessageFile(
					$this->getMessageDir(
						$accountID, 
						$folderID
					),
					$itemID
				);
		if (is_file($file)) {
			slSystem::import('tools/icewarp');
			slSystem::import('tools/filesystem');
			$dstDir = $this->getMessageDir($accountID, $dstFolderID);
			if(!is_dir($dstDir)){
				slToolsFilesystem::mkdir($dstDir,0777,true);
			}
			@slToolsIcewarp::iw_move($file, $this->getMessageFile($dstDir, $itemID));
		}
	}

	 
	public function getMessageFile($dir, $itemID)
	{
		return $this->paths->getMessageFile($dir, $itemID);
	}

	 
	public function getMessageDir($accountID, $folderID,$empty = false)
	{
		return $this->paths->getMessageDir($accountID, $folderID, $empty);
 	}
	
	 
	public function getMessagePath($accountID, $folderName, $itemID)
	{
	  return $this->paths->getMessagePath($accountID,$folderName,$itemID);
	}

	 
	public function deleteMessageDir($accountID, $folderID,$empty = false)
	{
		slSystem::import('tools/filesystem');
		slToolsFilesystem::rmdir(
				$this->getMessageDir($accountID, $folderID, $empty),
				$empty,
				true
		);
	}
	
	public function query($statement)
	{
		$statement = self::fixEscape($statement);
		return parent::query($statement);
	}
	
	public function syncMoveItems($oFrom,$oTo,&$oItems,$aMovedID)
	{
		$this->transaction();
		 		$cache['cache'] = $this;
		if($oItems) foreach($oItems as $key =>  $oItem){
			if(isset($aMovedID[$oItem->rid])){
				$flag_update= $oItem->flag_update & ~4; 
				$oItems[$key]->flag_update = $flag_update; 
				$this->updateItem(
					$oItem->itemID,
					array(
						'rid'=>$aMovedID[$oItem->rid],
						'flag_update'=>$flag_update,
						'source_folder_id'=>0,
						'dummy_id'=>0
					),
					$cache
				);
			}else{
				$this->deleteItem(
						$oFrom->account->accountID,
						$oFrom->folderID,
						$oItem->itemID,
						$cache
				);
			}
			$this->deleteItem(
				$oFrom->account->accountID,
				$oFrom->folderID,
				$oItem->dummy_id,
				$cache
			);
			
		}
		
		
		 		$oFrom = $_SESSION['user']->getAccount($oFrom->account->accountID)->getFolder($oFrom->name); 
		$oTo = $_SESSION['user']->getAccount($oTo->account->accountID)->getFolder($oTo->name); 

		
		 		$oFrom->messages = $oFrom->messages - count($aMovedID);
		$oTo->messages = $oTo->messages+count($aMovedID);
		$this->updateFolder($oFrom->folderID,array('messages'=>$oFrom->messages));
		$this->updateFolder($oTo->folderID,array('messages'=>$oTo->messages));

		
		
		$this->commit();
		
		return true;
	}
	
	public function getTargetFoldersID($folder)
	{
		$result = [];
		$stmt = $this->prepare('SELECT '.$this->sizeField.' FROM item WHERE folder_id = ? AND (is_hidden = 1 AND '.$this->dateField.'= -1)');
		$stmt->execute(array($folder->folderID));
		while($row = $stmt->fetch()){
			$result[$row['size']] = $row['size'];
		}
		return $result;
	}
	
	public function getDelayedItemsID($folder,$transaction = true,$class = 'IMAPItem',$fields = 'item_id,rid,flags,color,msg_file,flag_update,source_folder_id,dummy_id,taglist')
	{
		$selector = $this->getFolderSelector($folder,$isComplicated);
		if ($transaction)
			$this->transaction();
			
		if($isComplicated){
			$stmt = $this->getComplicatedStatement($selector,$folder,$fields,'i.flag_update > 0');
		}else{
			$stmt = $this->prepare('SELECT '.$fields.'
								FROM item
								WHERE '.$selector.' AND flag_update > 0');
		}
		$stmt->execute();
		$items = array();
		while ($row = $stmt->fetch()) {
			if(isset($items[$row['rid']])){
				$duplicated[] = $row['item_id'];
			}
			if ($class == 'IMAPItem') {
				$row['rid'] = IMAP::fixID($row['rid']);
			}
			$items[$row['rid']] = array(
				'item_id' => intval($row['item_id']),
				'flags'	=> intval($row['flags']),
				'color' => $row['color'],
				'header_from'=>$row['header_from'],
				'msg_file'=>$row['msg_file'],
				'flag_update'=>$row['flag_update'],
				'source_folder_id'=>$row['source_folder_id'],
				'dummy_id'=>$row['dummy_id'],
				'taglist'>$row['taglist']
			);
		}
		if ($transaction)
			$this->commit();

		return $items;
	}
	
	public function getComplicatedStatement($selector,$folder, $sFields = '*',$filter = '',$orderBy = '',$limit = '',$forceIndex = '')
	{
		 	    if($limit && ($this->dbtype == 'ODBC') && $this->dbsyntax!='oracle'){
	    	$rowNumberOrder = (empty($orderBy)) ? ' ORDER BY '.$this->dateField:$orderBy;
			 			$limit = str_replace('LIMIT ', '', $limit);
			$limit = explode(',', $limit);
			 			$stmt = $this->prepare(
				'SELECT TOP '.intval($limit[1]). ' '.$sFields.' FROM 
                  (SELECT TOP '.intval($limit[1]+$limit[0]).' '.$sFields.',ROW_NUMBER() OVER('.$rowNumberOrder.') as row
                  FROM item '.$forceIndex.' WHERE ((is_hidden is NULL OR is_hidden!=1) AND '.$selector . $filter .') '.$orderBy.') x
                  WHERE x.row BETWEEN '.intval($limit[0]+1).' and '.intval($limit[1]+$limit[0])
			);
	    }else{
			$filter = str_replace('folder_id', 'f.folder_id', $filter);
			$stmt = $this->prepare(
	    		'SELECT '.$sFields.
	    		' FROM item i '.$forceIndex.' INNER JOIN folder f ON f.folder_id = i.folder_id'.
	    		' WHERE'.$selector.
	    		' 	AND (i.is_hidden is NULL OR i.is_hidden!=1) '.$filter . ' '.
	    		$orderBy.($limit?$limit:'')
	    	);
		}
		return $stmt;
	}
	
	public function initDatabase()
	{
		 		$this->sTextField = 'text';
		$this->sizeField = 'size';
		$this->dateField = 'date';
		$this->index_rid = 'rid';
		$this->sOracleItemPK = '';
		$this->sOracleFolderPK = '';
		$this->sPK = 'PRIMARY KEY';
		switch($this->dbtype){
			case 'MYSQL':
				$this->sDBType = '';			case 'MSSQL':
			case 'ODBC':
			case 'OCI':
				$this->index_sort_from = 'sort_from(16)';
				$this->index_sort_to = 'sort_to(16)';
				$this->index_account = 'account_id(32)';
				 				if ($this->dbtype!='MYSQL') {
					$this->sAutoincrement = 'IDENTITY';
					$this->sTextField = 'varchar(8000) ';
					if($this->dbsyntax=='oracle'){
						$this->sTextField = 'nvarchar2(2000) DEFAULT \'\'';
						$this->sBitOR = '||';
						$this->sOracleItemPK = ', CONSTRAINT item_PK PRIMARY KEY ( item_id )';
						$this->sOracleFolderPK = ', CONSTRAINT folder_PK PRIMARY KEY ( folder_id )';
						$this->sAutoincrement = '';
						$this->sPK = '';
						$this->sizeField = '"size"';
						$this->dateField = '"date"';
					}
					$this->index_sort_from = 'sort_from';
					$this->index_sort_to = 'sort_to';
					$this->index_account = 'account_id';
				}else{
					$this->sAutoincrement = 'AUTO_INCREMENT';
					$this->index_rid = 'rid(16)';
				}
				try{
					$charset = '';
					if($this->dbsyntax=='oracle'){
						$charset = 'charset=AL32UTF8;';
					}
					if(!$this->export){
						PDO::__construct($this->connection.$charset,$this->dbuser,$this->dbpass);
						$this->setStatementClass('slDatabaseStatement');
					}

				}catch (PDOException $e){
					 					 					self::doLog("db_auto_create:".$e->getMessage(),12);
					throw new Exc('db_auto_create',$e->getMessage());
				}
				break;
			case 'SQLITE':
			default:
				$this->index_sort_from = 'sort_from';
				$this->index_sort_to = 'sort_to';
				$this->index_account = 'account_id';
				$this->sAutoincrement = 'AUTOINCREMENT';
				$this->sDBType = '';
				$filename = $this->pureconn;
				$location = dirname($this->pureconn);
				$this->sTextField .=' DEFAULT \'\'';
				$newDatabase = !is_file($filename);
				 				if ($newDatabase){
					if(!is_dir($location)){
						slSystem::import('tools/filesystem');
						if(!slToolsFilesystem::mkdir_r($location,0777,true)){
							self::doLog("db_create_sqlitefile:".$filename,12);
							throw new Exc('db_create_sqlitefile');
						}
					}
		
				}
				if(!$this->export){
					$sConn = 'sqlite:'.$filename;
					PDO::__construct($sConn);
					$this->setStatementClass('slDatabaseStatement');
					 					$result = $this->query('PRAGMA synchronous = 0;');
					$result = $this->query('PRAGMA temp_store = 2;');
				}
				break;
		}
		return true;		
	}
	
	public function createTables($exportSQL = false)
	{
		
		 
		$folderSQL = 'CREATE TABLE folder ('   .
					'folder_id INTEGER '.$this->sPK.' '.$this->sAutoincrement.', ' .
					'parent_folder_id INTEGER, '.
					'account_id '.$this->sTextField.' NOT NULL, '  .
					'name '.$this->sTextField.' NOT NULL, ' .
					'rights INTEGER DEFAULT 0 NOT NULL , ' .
					'attributes INTEGER DEFAULT 0 NOT NULL , '.
					'sync CHAR(1), '.
					'path '.$this->sTextField.', '.
					'uid_validity '.$this->sTextField.', '.
					'sync_update INTEGER DEFAULT 0 NOT NULL , '.
					'unseen INTEGER DEFAULT 0 NOT NULL , '.
					'messages INTEGER DEFAULT 0 NOT NULL , '.
					'subscription_type '.$this->sTextField.					
					$this->sOracleFolderPK.')';
		if($exportSQL){
			$result[] = $folderSQL; 
		}
		$folderOracleSequenceSQL = '';
		$folderOracleTriggerSQL = '';
		$itemOracleSequenceSQL = '';
		$itemOracleTriggerSQL = '';
		$itemOracleBitNotSQL = '';
		$itemOracleBitOrSQL = '';
		$indexItemSortFromSQL = '';
		$indexItemSortToSQL = '';
		if($this->dbsyntax=='oracle'){
			$folderOracleSequenceSQL = 'CREATE SEQUENCE SEQ_FOLDER INCREMENT BY 1 START WITH 1 NOMAXVALUE MINVALUE 1 NOCYCLE CACHE 20 NOORDER';	
		  	$folderOracleTriggerSQL = 'CREATE TRIGGER TR_FOLDER BEFORE INSERT OR UPDATE '.
					'OF '.
					'FOLDER_ID '.
					'ON FOLDER '.
					'REFERENCING NEW AS NEW FOR EACH ROW '.
					'BEGIN '.
					'IF :NEW."FOLDER_ID" IS NULL THEN '.
					'SELECT "SEQ_FOLDER".NEXTVAL INTO :NEW."FOLDER_ID" FROM dual; '.
					'END IF; '.
					'END;';
			if($exportSQL){
				$result[] = $folderOracleSequenceSQL; 
				$result[] = $folderOracleTriggerSQL; 
			}
		}
		 
		$itemSQL = 'CREATE TABLE item ('   .
					'item_id INTEGER '.$this->sPK.' '.$this->sAutoincrement.', ' .
					'folder_id INTEGER NOT NULL, ' .
					'rid '.$this->sTextField.' NOT NULL, ' .
					'message_id varchar(255) , ' .
					$this->sizeField.' INTEGER NOT NULL, ' .
					$this->dateField.' INTEGER NOT NULL, ' .
					'header_from '.$this->sTextField.' , ' .
					'header_to '.$this->sTextField.' , ' .
					'header_cc '.$this->sTextField.', ' .
					'header_bcc '.$this->sTextField.', ' .
					'header_sms '.$this->sTextField.', ' .
					'subject '.$this->sTextField.' , ' .
					'priority INTEGER DEFAULT 0 NOT NULL , ' .
					'flags INTEGER DEFAULT 0 NOT NULL , ' .
					'unread INTEGER DEFAULT 0 NOT NULL , ' .
					'body '.$this->sTextField.', '.
					'static_flags INTEGER DEFAULT 0 NOT NULL , ' .
					'smime_status INTEGER DEFAULT 0 NOT NULL , ' .
					'has_attachment VARCHAR(1) DEFAULT \'F\' , ' .
					'color VARCHAR(1) DEFAULT \'Z\' , ' .
					'completed_on VARCHAR(32),'.
					'sort_subject '.$this->sTextField.', ' .
					'sort_from '.$this->sTextField.', ' .
					'sort_to '.$this->sTextField.' , ' .
					'sort_cc '.$this->sTextField.' , ' .
					'sort_bcc '.$this->sTextField.' , ' .
					'sort_sms '.$this->sTextField.' , ' .
					'msg_file '.$this->sTextField.' , ' .
					'flag_update INTEGER DEFAULT 0 NOT NULL , ' .
					'source_folder_id INTEGER , ' .
					'dummy_id INTEGER , ' .
					'is_hidden INTEGER DEFAULT 0 NOT NULL, '.
					'taglist '.$this->sTextField .', '.
					'item_moved INTEGER DEFAULT 0 NOT NULL '.
					$this->sOracleItemPK.') '.$this->sDBType;	
		if($exportSQL){
			$result[] = $itemSQL; 
		}
		if($this->dbsyntax=='oracle'){
			$itemOracleSequenceSQL = 'CREATE SEQUENCE SEQ_ITEM INCREMENT BY 1 START WITH 1 NOMAXVALUE MINVALUE 1 NOCYCLE CACHE 20 NOORDER';
			$itemOracleTriggerSQL = 'CREATE TRIGGER TR_ITEM BEFORE INSERT OR UPDATE '.
					'OF '.
					'ITEM_ID '.
					'ON ITEM '.
					'REFERENCING NEW AS NEW OLD AS OLD FOR EACH ROW '.
					'BEGIN '.
					'IF :NEW."ITEM_ID" IS NULL THEN '.
					'SELECT "SEQ_ITEM".NEXTVAL INTO :NEW."ITEM_ID" FROM dual; '.
					'END IF; '.
					'END;';
			$itemOracleBitNotSQL = 'CREATE FUNCTION bitnot(x IN NUMBER) RETURN NUMBER AS '.
							'BEGIN    RETURN (0 - x) - 1; '.
							'END;';
			$itemOracleBitOrSQL = 'CREATE FUNCTION bitor(x IN NUMBER, y IN NUMBER) RETURN NUMBER AS '.
				'BEGIN RETURN (x + y - BITAND(x, y)); '.
				'END;';
			if($exportSQL){
				$result[] = $itemOracleSequenceSQL; 
				$result[] = $itemOracleTriggerSQL; 
				$result[] = $itemOracleBitNotSQL; 
				$result[] = $itemOracleBitOrSQL; 
			}
		}
		$indexFolderAccountSQL = 'CREATE INDEX IDX_folder_account ON folder ('.$this->index_account.',folder_id)';
		$indexFolderParentSQL = 'CREATE INDEX IDX_folder_parent ON folder (parent_folder_id)';
		$indexItemDateSQL = 'CREATE INDEX IDX_item_date ON item (folder_id,'.$this->dateField.')';
		$indexItemListSQL = 'CREATE INDEX IDX_item_list ON item (folder_id,unread,is_hidden)';
		$idnexItemFlagUpdateSQL = 'CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)';
		$indexItemRIDSQL = 'CREATE INDEX IDX_item_rid ON item (folder_id,'.$this->index_rid.')';
		if($exportSQL){
			$result[] = $indexFolderAccountSQL; 
			$result[] = $indexFolderParentSQL; 
			$result[] = $indexItemDateSQL; 
			$result[] = $indexItemListSQL; 
			$result[] = $idnexItemFlagUpdateSQL; 
			$result[] = $indexItemRIDSQL; 
		}
		if($this->dbtype!='MSSQL' && $this->dbtype!='ODBC'){
			$indexItemSortFromSQL = 'CREATE INDEX IDX_item_sort_from ON item (folder_id,'.$this->index_sort_from.')';
			$indexItemSortToSQL = 'CREATE INDEX IDX_item_sort_to ON item (folder_id,'.$this->index_sort_to.')';
			if($exportSQL){
				$result[] = $indexFolderAccountSQL; 
				$result[] = $indexFolderParentSQL; 
				$result[] = $indexItemDateSQL; 
				$result[] = $indexItemListSQL; 
				$result[] = $idnexItemFlagUpdateSQL; 
				$result[] = $indexItemRIDSQL; 
			}
		}
		 
		
		$metadataSQL = 'CREATE TABLE wm_metadata (' .
					'item_key VARCHAR(128), ' .
					'item_value VARCHAR(128))';
		$metadataVersionSQL = 'INSERT INTO wm_metadata (item_key, item_value) VALUES (\'db_version\', \''.strval(WEBMAIL_DB_VERSION).'\')';
		
		if($exportSQL){
			 			$result[] = $metadataSQL;
			$result[] = $metadataVersionSQL;
			return $result;
		}
		
		try{
			 			$this->transaction();
			$this->query($folderSQL);
			 			if($this->dbsyntax=='oracle'){
				$this->exec($folderOracleSequenceSQL);
				$this->exec($folderOracleTriggerSQL);
			}
			$this->query($itemSQL);
			 			if($this->dbsyntax=='oracle'){
				$this->exec($itemOracleSequenceSQL);
				$this->exec($itemOracleTriggerSQL);
				$this->exec($itemOracleBitNotSQL);
				$this->exec($itemOracleBitOrSQL);
			}
			 			$this->safeQuery($indexFolderAccountSQL);
			$this->safeQuery($indexFolderParentSQL);
			 			$this->safeQuery($indexItemDateSQL);
			$this->safeQuery($indexItemListSQL);
			$this->safeQuery($idnexItemFlagUpdateSQL);
			$this->safeQuery($indexItemRIDSQL);
			
			 			if($this->dbtype!='MSSQL' && $this->dbtype!='ODBC'){
				$this->safeQuery($indexItemSortFromSQL);
				$this->safeQuery($indexItemSortToSQL);
			}
			 			
			 
			$this->query($metadataSQL);
			 			 			 			 			 		    $this->query($metadataVersionSQL);
		    
			 			$this->commit();
		}catch(PDOException $e){
			$this->commit();
			self::doLog("db_create_tables:".$e->getMessage(),12);
			throw new Exc('db_create_tables',$e->getMessage());
		}
	}
	
	public function getVersion($key = 'db_version')
	{
		try{
			$this->suppressError = true;
			$stmt = $this->prepare("SELECT item_value FROM wm_metadata WHERE item_key = ?");
			if ($stmt) {
				$stmt->execute(array(0=>$key),false);
				$result = $stmt->fetch();
				$version = $result['item_value'];
				unset($stmt);
			}else{
				$version = 0;
			}

			$this->suppressError = false;
		}catch(Exception $e){
			$version = 0;
		}
		return $version;
	}
	
	public function checkTables()
	{
		if(!$_SESSION['DB_CHECKED']){
			$version = $this->getVersion();
			if(!$version){
				$this->createTables();
				$version = WEBMAIL_DB_VERSION;
			}
			if ( WEBMAIL_DB_VERSION > $version ){
				$result =  $this->alterTables($version);
				$_SESSION['DB_CHECKED'] = $result;
				return $result;
			} else {
				$_SESSION['DB_CHECKED'] = true;
				return true;
			}
		}
	}
	
	public function checkTablesBackground()
	{
		if(!$_SESSION['DB_CHECKED_BACKGROUND']){
			$version = $this->getVersion('db_version_background');
			if(!$version){
				$this->createTablesBackground();
				$version = WEBMAIL_DB_VERSION_BACKGROUND;  			}
			if ( WEBMAIL_DB_VERSION_BACKGROUND > $version ){
				$result =  $this->alterTablesBackground($version);
				$_SESSION['DB_CHECKED_BACKGROUND'] = $result;
				return $result;
			} else {
				$_SESSION['DB_CHECKED_BACKGROUND'] = true;
				return true;
			}
		}
	}
	
  	public function alterTables($current_version)
	{
		$version = $current_version;
		 		 		if($current_version < 4){
			$this->transaction();
			$this->safeQuery('ALTER TABLE folder DROP delimiter');
			 			$this->safeQuery('ALTER TABLE folder ADD sync CHAR(1)');
			$this->safeQuery('ALTER TABLE folder ADD rights INTEGER NOT NULL DEFAULT 0');
			 			 			$this->safeQuery('ALTER TABLE item MODIFY header_from '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item MODIFY header_to '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item MODIFY '.$this->dateField.' varchar(32)');
			$this->safeQuery('ALTER TABLE item MODIFY subject '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item MODIFY rid '.$this->sTextField);
			 			$this->safeQuery('ALTER TABLE item ADD sync CHAR(1)');
			$this->safeQuery('ALTER TABLE item ADD priority INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('ALTER TABLE item ADD static_flags INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('ALTER TABLE item ADD smime_status INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('ALTER TABLE item ADD has_attachment CHAR(1) DEFAULT \'F\'');
			$this->safeQuery('ALTER TABLE item ADD color CHAR(1) DEFAULT \'Z\'');
			$this->safeQuery('ALTER TABLE item ADD completed_on VARCHAR(32)');
			$this->safeQuery('ALTER TABLE item ADD body TEXT');
			$this->updateVersion(4);
			$this->commit();
			$current_version = 4;
		}
		if($current_version == 4){
			$this->transaction();
			 			$this->safeQuery('ALTER TABLE item ADD header_to '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD header_cc '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD header_bcc '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD header_sms '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD message_id varchar(255)');
			$this->safeQuery('ALTER TABLE item ADD sort_from '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD sort_to '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD sort_cc '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD sort_bcc '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD sort_sms '.$this->sTextField);
	
			$this->safeQuery('UPDATE item SET sort_from =ltrim(rtrim(replace(replace(header_from,\'"\',\'\'),\'\'\'\',\'\')))');
			$this->safeQuery('UPDATE item SET sort_to =ltrim(rtrim(replace(replace(header_to,\'"\',\'\'),\'\'\'\',\'\')))');
			$this->safeQuery('CREATE INDEX IDX_item_sort_from ON item ('.$this->index_sort_from.')');
			$this->safeQuery('CREATE INDEX IDX_item_sort_to ON item ('.$this->index_sort_to.')');
			$this->updateVersion(5);
			$this->commit();
			$current_version = 5;
		}
		if($current_version == 5){
			$this->transaction();
			if($this->dbtype=='MSSQL' || $this->dbtype=='ODBC'){
				$this->safeQuery('DROP INDEX IDX_item_sort_from ON item');
				$this->safeQuery('DROP INDEX IDX_item_sort_to ON item');
			}
			$this->updateVersion(6);
			$this->commit();
			$current_version = 6;
		}
		if($current_version == 6){
			$this->transaction();
			$this->safeQuery('ALTER TABLE folder ADD attributes INTEGER NOT NULL DEFAULT 0');
			$this->updateVersion(7);
			$this->commit();
			$current_version = 7;
		}
		if($current_version == 7){
			$this->transaction();
			if(strtolower($this->dbtype)!='sqlite'){
				$this->safeQuery('ALTER TABLE item MODIFY header_cc '.$this->sTextField);
				$this->safeQuery('ALTER TABLE item MODIFY header_bcc '.$this->sTextField);
				$this->safeQuery('ALTER TABLE item MODIFY header_sms '.$this->sTextField);
			}
			$this->safeQuery('UPDATE item SET header_cc = \'\' WHERE header_cc IS NULL');
			$this->safeQuery('UPDATE item SET header_bcc = \'\' WHERE header_bcc IS NULL');
			$this->safeQuery('UPDATE item SET header_sms = \'\' WHERE header_sms IS NULL');
			$this->updateVersion(8);
			$this->commit();
			$current_version = 8;
		}
		if($current_version < 9){
			$this->transaction();
			$this->safeQuery('ALTER TABLE item ADD unread INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('UPDATE item SET unread = 1 WHERE flags & 32 = 0 ');
			 			$this->updateVersion(9);
			$this->commit();
			$current_version = 9;
		}
		if($current_version == 9){
			$this->transaction();
			$this->safeQuery('ALTER TABLE folder ADD path '.$this->sTextField);
			$this->safeQuery('ALTER TABLE folder ADD validity '.$this->sTextField);
			$this->safeQuery('ALTER TABLE item ADD msg_file '.$this->sTextField);
			$this->updateVersion(10);
			$this->commit();
			$current_version = 10;
		}
		if($current_version == 10){
			$this->transaction();
			$this->safeQuery('ALTER TABLE folder ADD uid_validity '.$this->sTextField);
			$this->updateVersion(11);
			$this->commit();
			$current_version = 11;
		}
		if($current_version == 11){
			 			$this->updateVersion(12);
			$current_version = 12;
		}
		if($current_version == 12){
			 
			 
			$this->updateVersion(13);
			$current_version = 13;
		}
		if($current_version == 13){
			$this->transaction();
			$this->safeQuery('ALTER TABLE item ADD source_folder_id INTEGER');
			$this->safeQuery('ALTER TABLE item ADD is_hidden INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('ALTER TABLE item ADD dummy_id INTEGER');
			
			$this->safeQuery('ALTER TABLE item ADD flag_update INTEGER NOT NULL DEFAULT 0');
			 			if(version >=12){
				$this->safeQuery('UPDATE item SET flags_updated = 0 WHERE flags_updated IS NULL ');
			}
			 			if($version >=12){
				$this->safeQuery('UPDATE item SET flag_update = flags_updated');
			}
			$this->updateVersion(14);
			$this->commit();
			$current_version = 14;
		}
		
		if($current_version == 14){
			$this->transaction();
			 			$this->safeQuery('CREATE INDEX IDX_folder_account ON folder ('.$this->index_account.',folder_id)');
			$this->safeQuery('CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)');
			if(strtolower($this->dbtype)=='odbc' || strtolower($this->dbtype)=='mssql'){
				$this->safeQuery('ALTER TABLE folder ADD COLUMN sync_update NOT NULL CONSTRAINT item_sync_update_Default DEFAULT 0');
			}else{
				$this->safeQuery('ALTER TABLE folder ADD sync_update INTEGER NOT NULL DEFAULT 0');
			}
			$this->safeQuery('ALTER TABLE folder ADD unseen INTEGER NOT NULL DEFAULT 0');
			$this->safeQuery('ALTER TABLE folder ADD messages INTEGER NOT NULL DEFAULT 0');
			$this->updateVersion(15);
			$this->commit();
			$current_version = 15;
		}
		
		if($current_version == 15){
			$this->transaction();
			$this->updateVersion(16);
			$this->commit();
			$current_version = 16;
		}
		
		if($current_version == 16){
			$this->transaction();
			 			if($version==15){
				if($this->dbtype=='SQLITE'){
					$this->safeQuery('DROP INDEX IDX_item_flag_update');
					$this->safeQuery('DROP INDEX IDX_folder_account');
				}else{
					$this->safeQuery('DROP INDEX IDX_item_flag_update ON item');
					$this->safeQuery('DROP INDEX IDX_folder_account ON folder');
				}
				$this->safeQuery('CREATE INDEX IDX_folder_account ON folder ('.$this->index_account.',folder_id)');
				$this->safeQuery('CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)');
			 			}else if(version==16){
				if($this->dbtype=='SQLITE'){
					$this->safeQuery('DROP INDEX IDX_folder_account');
				}else{
					$this->safeQuery('DROP INDEX IDX_folder_account ON folder');
				}
				$this->safeQuery('CREATE INDEX IDX_folder_account ON folder ('.$this->index_account.',folder_id)');
				if($this->dbtype=='SQLITE'){
					$this->safeQuery('DROP INDEX IDX_item_date');
					if($current_version >= 9){
						$this->safeQuery('DROP INDEX IDX_item_list');
					}
					$this->safeQuery('DROP INDEX IDX_item_flag_update');
				}else{
					$this->safeQuery('DROP INDEX IDX_item_date ON item');
					if($current_version >= 9){
						$this->safeQuery('DROP INDEX IDX_item_list ON item');
					}
					$this->safeQuery('DROP INDEX IDX_item_flag_update ON item');
				}
				if($this->dbtype=='SQLITE'){
					$this->safeQuery('DROP INDEX IDX_item_sort_from');
					$this->safeQuery('DROP INDEX IDX_item_sort_to');
				}
				if($this->dbtype=='MYSQL'){
					$this->safeQuery('DROP INDEX IDX_item_sort_from ON item');
					$this->safeQuery('DROP INDEX IDX_item_sort_to ON item');
				}
				 				$this->safeQuery('CREATE INDEX IDX_item_date ON item (folder_id,'.$this->dateField.')');
				$this->safeQuery('CREATE INDEX IDX_item_list ON item (folder_id,unread)');
				$this->safeQuery('CREATE INDEX IDX_item_flag_update ON item (folder_id,flag_update)');
				if($this->dbtype!='MSSQL' && $this->dbtype!='ODBC' && $this->dbtype!='OCI'){
					$this->safeQuery('CREATE INDEX IDX_item_sort_from ON item (folder_id,'.$this->index_sort_from.')');
					$this->safeQuery('CREATE INDEX IDX_item_sort_to ON item (folder_id,'.$this->index_sort_to.')');
				}
			 			}else{
				 				 			}
			if($this->dbtype=='MYSQL'){
				$this->safeQuery('DROP INDEX IDX_item_body ON item');
				$this->safeQuery('ALTER TABLE item ENGINE = InnoDB');
			}
			$this->updateVersion(17);
			$this->commit();
			$current_version = 17;
		}
		if($current_version == 17){
			$this->transaction();
			$this->safeQuery('ALTER TABLE item ADD taglist '.$this->sTextField);
			$this->updateVersion(18);
			$this->commit();
			$current_version = 18;
		}
		if($current_version == 18){
			$this->transaction();
			if($version > 9){
				if(strtolower($this->dbtype)=='sqlite'){
					$this->safeQuery('DROP INDEX IDX_item_list');
				}else{
					$this->safeQuery('DROP INDEX IDX_item_list ON item');
				}
			}
			$this->safeQuery('CREATE INDEX IDX_item_list ON item(folder_id,unread,is_hidden)');	
			$this->updateVersion(19);
			$this->commit();
			$current_version = 19;
		}
		if($current_version == 19){
			$this->transaction();
			 			if($version >= 15){
				$this->safeQuery('ALTER TABLE folder DROP unseen');
				$this->safeQuery('ALTER TABLE folder DROP messages');
				$this->safeQuery('ALTER TABLE folder ADD unseen INTEGER NOT NULL DEFAULT 0');
				$this->safeQuery('ALTER TABLE folder ADD messages INTEGER NOT NULL DEFAULT 0');
			}
			
			$this->updateVersion(20);
			$this->commit();
			$current_version = 20;
		}
		
		if($current_version == 20){
			$this->transaction();
			$this->safeQuery('CREATE INDEX IDX_folder_parent ON folder (parent_folder_id)');
			 
			$this->updateVersion(21);
			$this->commit();
			$current_version = 21;
		}
		if($current_version == 21){
			$this->transaction();
			
			$this->query('ALTER TABLE item ADD sort_subject '.$this->sTextField);

			$this->updateVersion(22);
			$this->commit();
			$current_version = 22;
		}
		if($current_version == 22){
			$this->transaction();
			
			$this->query('ALTER TABLE folder ADD subscription_type '.$this->sTextField);
			
			$this->updateVersion(23);
			$this->commit();
			$current_version = 23;
		}
		if($current_version == 23){
			$this->transaction();
		
			$this->query('ALTER TABLE item ADD item_moved INTEGER NOT NULL DEFAULT 0');

			$this->updateVersion(24);
			$this->commit();
			$current_version = 24;
		}
		if($current_version == 24){
			$this->transaction();
		
			$this->query('CREATE INDEX IDX_item_rid ON item (folder_id,'.$this->index_rid.')');
		
			$this->updateVersion(25);
			$this->commit();
			$current_version = 25;
		}
		if($current_version == 25){
			$this->transaction();
			if(strtolower($this->dbtype)=='mysql' || strtolower($this->dbtype)=='oci'){
				$this->safeQuery('UPDATE folder SET sync_update = 0 WHERE sync_update IS NULL');
				$this->safeQuery('ALTER TABLE folder MODIFY sync_update INTEGER DEFAULT 0 NOT NULL');
			}
			if(strtolower($this->dbtype)=='odbc' || strtolower($this->dbtype)=='mssql'){
				$this->safeQuery('ALTER TABLE folder ALTER COLUMN sync_update INTEGER NOT NULL');
				$this->safeQuery('ALTER TABLE folder ADD CONSTRAINT item_sync_update_Default DEFAULT 0 FOR sync_update');
			}
						$this->updateVersion(26);
			$this->commit();
			$current_version = 26;
		}
	}
	
	public function alterTablesBackground($current_version)
	{
		if($current_version < 1){
			$this->transaction();
			$this->safeQuery("UPDATE item SET sort_subject = subject, item_moved = ".$this->dateField);
			$this->commit();
			$this->updateVersionBackground(1);
			$current_version = 1;
		}	
		if($current_version == 1){
			switch(strtolower($this->dbtype)){
				default:
					define('DB_UPGRADE_CHUNK',10000);
					$count = $this->safeQuery("SELECT count(*) as count FROM item");
					$count = $count->fetch();
					$chunks = ceil($count['count']/DB_UPGRADE_CHUNK);
					$updateStmt = $this->prepare("UPDATE item SET sort_subject = ? WHERE item_id = ?");
					for ($i = 0; $i < $chunks; $i++){
						$this->transaction();
						$items = $this->safeQuery("SELECT item_id,subject FROM item LIMIT ".$i*DB_UPGRADE_CHUNK.",".DB_UPGRADE_CHUNK);
						$items = $items->fetchAll();
						$c = count($items);
						for($j = 0; $j < $c; $j++){
							$oldval  = $items[$j]['subject'];
							$items[$j]['subject'] = preg_replace("/^(([a-zA-Z]{2,3})([0-9\[\]]+)?:\s)+/s","",$items[$j]['subject']);
							if($items[$j]['subject']!=$oldval){
								$updateStmt->execute(array($items[$j]['subject'],$items[$j]['item_id']));
							}
						}
						$this->commit();
					}
					
				break;
				case 'odbc':
				case 'mssql':
					define('DB_UPGRADE_CHUNK',10000);
					$count = $this->safeQuery("SELECT count(*) as count FROM item");
					$count = $count->fetch();
					$chunks = ceil($count['count']/DB_UPGRADE_CHUNK);
					$updateStmt = $this->prepare("UPDATE item SET sort_subject = ? WHERE item_id = ?");
					for ($i = 0; $i < $chunks; $i++){
						$this->transaction();
						$items = $this->safeQuery('SELECT TOP '.intval(DB_UPGRADE_CHUNK). ' item_id,subject FROM
							(SELECT TOP '.intval(DB_UPGRADE_CHUNK+$i*DB_UPGRADE_CHUNK).' item_id,subject,ROW_NUMBER() OVER(ORDER BY '.$this->dateField.') as row
								FROM item ORDER BY '.$this->dateField.' ) x
							WHERE x.row BETWEEN '.intval($i*DB_UPGRADE_CHUNK+1).' and '.intval(DB_UPGRADE_CHUNK+$i*DB_UPGRADE_CHUNK));
						$items = $items->fetchAll();
						$c = count($items);
						for($j = 0; $j < $c; $j++){
							$oldval  = $items[$j]['subject'];
							$items[$j]['subject'] = preg_replace("/^(([a-zA-Z]{2,3})([0-9\[\]]+)?:\s)+/s","",$items[$j]['subject']);
							if($items[$j]['subject']!=$oldval){
								$updateStmt->execute(array($items[$j]['subject'],$items[$j]['item_id']));
							}
						}
						$this->commit();
					}
				}
			$this->updateVersionBackground(2);
			$current_version = 2;
		}
		if($current_version == 2){
			$this->transaction();
			
			if(strtolower($this->dbtype)=='odbc' || strtolower($this->dbtype)=='mssql'){
				$this->safeQuery('DROP INDEX IDX_item_is_delayed ON item');
				$this->safeQuery('ALTER TABLE item DROP COLUMN is_delayed');
			}else if (strtolower($this->dbtype)=='mysql'){
				$this->safeQuery('ALTER TABLE item DROP is_delayed');
			}
			$this->updateVersionBackground(3);
			$current_version = 3;
			$this->commit();
		}
	}
	
	public function updateVersion($version, $key = 'db_version')
	{
		 		try{
			$stmt = $this->prepare('UPDATE wm_metadata SET item_value = ? WHERE item_key = ?');
			$stmt->execute(array(strval($version), $key));
			 		}catch(Exception $e){
			$this->query('CREATE TABLE wm_metadata (' .
					'item_key VARCHAR(128), ' .
					'item_value VARCHAR(128))');
			$stmt = $this->prepare('INSERT INTO wm_metadata (item_key, item_value) ' .
					'VALUES (?, ?)');
			$stmt->execute(array($key, strval($version)));
		}
	}
	
	public function updateVersionBackground($version)
	{
		$this->updateVersion($version,'db_version_background');
	}
	
	public function createTablesBackground()
	{
		
		$count = $this->safeQuery("SELECT count(*) as count FROM wm_metadata WHERE item_key='db_version_background'");
		$count = $count->fetch();
		if($count['count']){
			$count = $count['count'];
		}else{
			$count = 0;
		}
		if(!$count){
			$stmt = $this->prepare('INSERT INTO wm_metadata (item_key, item_value) ' .
					'VALUES (?, ?)');

			 			$stmt->execute(array('db_version_background', strval(WEBMAIL_DB_VERSION_BACKGROUND)));
		}
	}
	
	public function getForcedIndexSQL($index)
	{
		switch(strtolower($this->dbtype)){
			case 'mysql':
				$condition = 'USE INDEX ('.$index.')';
				break;
			case 'mssql':
			case 'odbc':
			case 'oci':
				$condition = 'WITH (INDEX('.$index.'))';
				if($this->dbsyntax=='oracle'){
					$condition = '/*+ INDEX('.$index.') */';
				}
				break;
			case 'sqlite':
			default:
				$condition = 'INDEXED BY '.$index;
				break;
		}
		return $condition;
	}
	
	private function itemFallback($item, $id, $methodName = 'create', $cache, &$errors = array())
	{
		log_buffer("2nd try $methodName item (shortened,utf8 fixed) [ID] [".$id."]","EXTENDED");
		try{
			$fourbyte  = strtolower($this->dbtype)=='mysql'?true:false;
			 			$item['header_from'] = slToolsString::utf8_bad_replace($item['header_from'], ' ',false,$fourbyte);
			$item['header_to'] = slToolsString::utf8_bad_replace($item['header_to'], ' ',false,$fourbyte);
			$item['subject'] = slToolsString::utf8_bad_replace($item['subject'], ' ',false,$fourbyte);
			$item['sort_from'] = slToolsString::utf8_bad_replace($item['sort_from'], ' ',false,$fourbyte);
			$item['sort_to'] = slToolsString::utf8_bad_replace($item['sort_to'], ' ',false,$fourbyte);
			$item['sort_subject'] = slToolsString::utf8_bad_replace($item['sort_subject'], ' ',false,$fourbyte);
			$item['taglist'] = slToolsString::utf8_bad_replace($item['taglist'], ' ',false,$fourbyte);

			 			$cutlen = $this->dbsynatx=='oracle'?2000:8000;
			$item['header_from'] = substr($item['header_from'],0,$cutlen);
			$item['header_to'] = substr($item['header_to'],0,$cutlen);
			$item['subject'] = substr($item['subject'],0,$cutlen);
			$item['sort_from'] = substr($item['sort_from'],0,$cutlen);
			$item['sort_to'] = substr($item['sort_to'],0,$cutlen);
			$item['sort_subject'] = substr($item['sort_subject'],0,$cutlen);
			$item['message_id'] = substr($item['message_id'],0,255);
            $item['taglist'] = substr($item['taglist'],0,$cutlen);

			if($methodName=='create'){
				return $cache['cache']->create(
					'item',
					$item,
					$cache
				);
			}else{
				return $cache['cache']->update(
					'item',
					array('item_id'=>$id),
					$item,
					$cache
				);
			}
		}catch (Exception $e){
			
			log_buffer("3rd try $methodName item (Error (corrupted header)) [ID] [".$id."]","EXTENDED");
			try{
				 				$item['header_from'] = 'Error (corrupted header)';
				$item['header_to'] = 'Error (corrupted header)';
				$item['subject'] = 'Error (corrupted header)';
				$item['sort_from'] = 'Error';
				$item['sort_to'] = 'Error';
				$item['sort_subject'] = 'Error';
				$item['taglist'] = 'Error';
				$item['size'] = 0;

				$cache['cache']->suppressError = false;
				if($methodName=='create'){
					return $cache['cache']->create(
						'item',
						$item,
						$cache
					);
				}else{
					return $cache['cache']->update(
						'item',
						array('item_id'=>$id),
						$item,
						$cache
					);
				}
				
			}catch(Exception $e){
				$errors['item_insert_to_database'][] = $id;
			}
		}		
	}
}

?>
