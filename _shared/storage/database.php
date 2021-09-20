<?php

 
 
 
class slDatabaseStatement extends PDOStatement
{
	 
	public $doLog;
	 
	public $pdo;

	protected function __construct($pdo = false)
	{
		$this->pdo = $pdo;
		$this->doLog = true;
	}
	public function execute($inputParameters = array())
	{
		$t = time();
		$m = microtime(true);
		try{
			$result = parent::execute($inputParameters);
		}catch(PDOException $e){
			if(!$this->pdo->suppressError){
				 				slDatabase::DoLog('Failed SQL:'.$this->queryString.print_r($inputParameters,true).$e->getMessage(),12);
				 				if($this->pdo->query_log > 0){
					slDatabase::DoLog('Failed SQL:'.$this->queryString.print_r($inputParameters,true).$e->getMessage());
				}
			}else{
				if($this->pdo->query_log > 0){
					slDatabase::DoLog('Failed SQL:'.$this->queryString.print_r($inputParameters,true).$e->getMessage());
				}
			}
			$message = $e->getMessage();
			$e = new Exception('failed_sql');
			$e->wmmessage = $message;
			throw $e;
		}
		if($this->doLog){
			$time = time()-$t + microtime(true)-$m;
			if($this->pdo->perf_threshold && $time > $this->pdo->perf_threshold){
				if($this->pdo){
					$this->pdo->log($this->queryString."\r\n");
					$string ="\r\nTime:$time\r\n".$this->queryString."\r\n";
					$this->pdo->DoLog($string,32);
				}
			} 
		}
		if($this->pdo->query_log > 1){
			slDatabase::DoLog($this->queryString."[".join(",",$inputParameters)."] ".'['.round($time*1000,2).'ms]');
		}
		 		if(is_array($result) && !empty($result)){
			foreach($result as $key => $val){
				if(!is_int($key)){
					$result[strtolower($key)] = $val;
				}
			}
		}
		return $result;
	}
	
	public function fetch( $fetch_style = PDO::FETCH_BOTH, $cursor_orientation = PDO::FETCH_ORI_NEXT, $cursor_offset = 0  )
	{
		$result = parent::fetch($fetch_style, $cursor_orientation, $cursor_offset);
		 		if(is_array($result) && !empty($result)){
			foreach($result as $key => $val){
				if(!is_int($key)){
					$result[strtolower($key)] = $val;
				}
			}
		}
		return $result;
	}
	
	public function fetchAll( $fetch_style = PDO::FETCH_BOTH, $fetch_argument = NULL , $ctor_args = NULL)
	{
		if($fetch_style){
			if($fetch_argument){
				if($ctor_args){
					$result = parent::fetchAll($fetch_style, $fetch_argument, $ctor_args);
				}else{
					$result = parent::fetchAll($fetch_style, $fetch_argument);
				}
			}else{
				$result = parent::fetchAll($fetch_style);
			}
		}else{
			$result = parent::fetchAll();
		}
		 		if(is_array($result) && !empty($result)){
			foreach($result as $key => $val){
				foreach($val as $column => $value){
					if(!is_int($value)){
						$result[$key][strtolower($column)] = $value;
					}
				}
			}
		}
		return $result;
	}
}


class slDatabase extends PDO {
	static protected $api;
	 
	private $transaction;

	 
	private $rollback;
	
	protected $statementClass;
	public $connection;
	public $dbtype;
	public $dbname;
	public $pureconn;
	public $dbuser;
	public $dbpass;
	public $query_log;
	public $perf_threshold;
	public $collation;
	public $collate_enable;
	public $extended_logs;
	public $dbsyntax;
	public $export;
	public $check_tables;
	public $time;
	public $suppressError;
	public $pdo;
	
	public $logs;
	 
	public function __construct($connection = false,$user = '', $pass = '',$query_log = 0,$perf_threshold = 0,$collation = '', $collate_enable = false,$extended_logs = false, $syntax = '', $export = false, $checkTables = true)
	{
		$this->connection = $connection;
		$arr = explode(":",$this->connection,2);
		$this->dbtype = strtoupper($arr[0]);
		if(preg_match("#dbname=([^;]*)#i",$this->connection,$matches)) {
			$this->dbname = $matches[1];
		}
		if($arr[1]) {
			$this->pureconn = $arr[1];
		}
		$this->dbuser = $user;
		$this->dbpass = $pass;
		$this->query_log = $query_log;
		$this->perf_threshold = $perf_threshold;
		$this->collation = $collation;
		$this->collate_enable = $collate_enable;
		$this->extended_logs = $extended_logs;
		$this->dbsyntax = strtolower($syntax);
		$this->export = $export;
		$this->check_tables = $checkTables;
		
		$this->initDatabase();

		if(!$this->export){
  			$this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  			$this->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
		}
  		$this->transaction = 0;

  		if(!$this->export){
			if($this->dbtype=='MYSQL'){	
				$this->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY,true);
				$api = IceWarpAPI::instance();				
				$charset = $api->GetProperty('c_system_mysqldefaultcharset');
				$this->safeQuery('SET character_set_connection = '.$charset.';');
				$this->safeQuery('SET character_set_client = '.$charset.';');
				$this->safeQuery('SET character_set_results = '.$charset.';');
			}
			if($this->dbsyntax=='oracle'){
				$this->safeQuery('alter session set NLS_COMP=LINGUISTIC');
				$this->safeQuery('alter session set NLS_SORT=BINARY_CI');
			}
			if($this->check_tables){
				$this->checkTables();
			}
  		}
  }

 public function isRollback()
 {
 	if($this->rollback){
 		return true;
 	}
 }
  
	public function safeQuery($sCommand,$retry_count = 3)
  	{
  		try{
  			return $this->query($sCommand);
  		} catch(Exception $e){

  		}
  	}
  	public function retryQuery($sCommand,$retry_count = 3)
  	{
  		try{
  			$result =  $this->query($sCommand);
  		} catch(Exception $e){
  			if(stripos($e->getMessage(), 'DATABASE IS LOCKED') !== false){
  				usleep(1000000);    				if($retry_count){
  					return $this->retryQuery($sCommand,$retry_count-1);
  				}else{
  					$this->rollback = true;
  				}
  			}else{
  				$this->rollback = true;
  			}
  		}
  	}

	 
	public function transaction()
	{
		if (!$this->transaction++) {
			parent::beginTransaction();
			$this->rollback = false;
		}
		$this->time[$this->transaction]['t'] = time();
		$this->time[$this->transaction]['m'] = microtime(true);
	}

	 
	public function commit()
	{
		
		$time = (time() - $this->time[$this->transaction]['t']) + (microtime(true) - $this->time[$this->transaction]['m']);
		$logs = $this->logs[$this->transaction];
		unset($this->time[$this->transaction]);
		unset($this->logs[$this->transaction]);
		if (!--$this->transaction) {
			if ($this->rollback)
				parent::rollback();
			else
				parent::commit();
		}
		if($this->perf_threshold && $time > $this->perf_threshold){
			$this->DoLog("Transaction too long : \r\n".$logs,32);
		}
		
	}

	 
	public function rollback()
	{
		if (!--$this->transaction)
			parent::rollBack();
		else
			$this->rollback = true;
	}

	 
	public function getID($table = '')
	{
		 		if($this->dbsyntax=='oracle'){
			$result = $this->query("SELECT SEQ_".$table.".CURRVAL as ID FROM dual");
			$id = $result->fetch();
			return $id['ID'];
		 		}else if ($this->dbtype!='ODBC' && $this->dbtype!='MYSQL'){
			return intval(parent::lastInsertId());
		}
		 		else
		{
	        $stmt = $this->prepare("SELECT @@IDENTITY AS ID");
        	$stmt->execute();
	        $row = $stmt->fetch(PDO::FETCH_ASSOC);
		    return intval($row['ID']);
		}
	}

	 
	public function prepare($statement, $driver_options = array())
	{
		try{
			$stmt = parent::prepare($statement, $driver_options);
			if(!$stmt instanceof PDOStatement) throw new Exception('failed_sql');
			$stmt->pdo = $this;
		} catch(Exception $e) {
			if(!$this->suppressError){
				$this->DoLog('Failed SQL: '.$statement."\r\n".$e->getMessage(),12);
				if($this->query_log > 0){
					$this->DoLog('Failed SQL: '.$statement."\r\n".$e->getMessage());
	    		}
			}else{
				if($this->pdo->query_log > 0){
					$this->DoLog('Failed SQL: '.$statement."\r\n".$e->getMessage());
				}
			}
			$message = $e->getMessage();
			$e = new Exception('failed_sql');
			$e->wmmessage = $message;
			throw $e;
    	}
    	return $stmt;
	}

	 
	public function query($statement)
	{
		$t = time();
		$m = microtime(true);
	    try{
	  		switch (strtoupper(substr($statement, 0, 6))) {
	    		case 'SELECT':
	    		case 'CREATE':
	    		case 'DESCRI':
	    		case 'DROP I':
	    		case 'DROP T':
	    		case 'DROP S':
	    		case 'DROP F':
	    			$result =  parent::query($statement);
	    			break;
	    		case 'INSERT':
	    		case 'UPDATE':
	    		case 'DELETE':
	    		case 'VACUUM':
	    		case 'PRAGMA':
	    		case 'ALTER ':
	    		case 'SET NA':
	    		case 'SET CH':
	    		case 'SET FT':
	    		case 'SHOW C':
	    			$result =  parent::exec($statement);
	    			break;
	    		default:
	    			throw new Exception('db_invalid_statement');
	  			
	    	}
	    	if($this->query_log > 1){
	    		$time = time()-$t+microtime(true)-$m;
				$this->DoLog(print_r($statement,true).'['.round($time*1000,2).'ms]');
			}
	    }catch(Exception $e){
	    	$time = time()-$t+microtime()-$m;
	    	$message = ($e->getMessage()=='db_invalid_statement')?'':$e->getMessage();
		    if(!$this->suppressError){
		    	
		    	 		    	$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message,12);
		    	 		    	if($this->query_log > 0){
					$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message);
	    		}
	    	}else{
	    		if($this->query_log > 0){
	    			$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message);
	    		}
	    	}
	    	$e = new Exception('failed_sql');
	    	$e->wmmessage = $message;
	    	throw $e;
	    }
	    return $result;
	}
	
	public function exec( $statement )
	{	
		$t = time();
		$m = microtime();
		try{
			if($this->query_log > 1){
				$time = time()-$t+microtime()-$m;
				$this->DoLog(print_r($statement,true).'['.round($time*1000,2).'ms]');
			}
			return parent::exec( $statement );
		}catch(Exception $e){
			$time = time()-$t+microtime()-$m;
			$message = ($e->getMessage()=='db_invalid_statement')?'':$e->getMessage();
	    	if(!$this->suppressError){
		    	 		    	$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message,12);
		    	 		    	if($this->query_log > 0){
					$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message);
		    	}
	    	}else{
	    		if($this->query_log > 0){
	    			$this->DoLog('Failed SQL: '.$statement.'['.round($time*1000,2).'ms]'."\r\n".$message);
	    		}
	    	}
	        $e = new Exception('failed_sql');
	    	$e->wmmessage = $message;
	    	throw $e;
		}
	}
	 
	protected function configureStatementClass($suppressError = false)
	{
		 		if (!$this->getAttribute(PDO::ATTR_PERSISTENT))
		{
			$this->setAttribute(PDO::ATTR_STATEMENT_CLASS, array($this->getStatementClass(),array()));
		} elseif (!$suppressError)
		{
			throw new Exception('Extending PDOStatement is not supported with persistent connections.');
		}
	}
	
	 
	public function setStatementClass($classname)
	{
		$this->statementClass = $classname;
		$this->configureStatementClass();
	}
	
	 
	public function getStatementClass()
	{
		return $this->statementClass;
	}
	
	public function log($msg)
	{
		$this->logs[$this->transaction].=$msg;
	}
	
	static public function doLog($msg,$id = 33)
	{
		if(!self::$api){
			self::$api = new IceWarpAPI();
		}
		self::$api->DoLog(
			$_SERVER['SERVER_THREAD'],
			$id,
			defined('APP_IDENTITY')?APP_IDENTITY:'sharedlib/database',
			"[".($_SESSION['SID']?$_SESSION['SID']:'Unauthorized')."]\t".$msg,
			1,
			1
		);
	}
	
	public function initDatabase()
	{
		parent::__construct($this->connection,$this->dbuser,$this->dbpass);
	}
	
	public function createTables()
	{
	}
	
	public function checkTables()
	{
	}
	
	public function alterTables($version)
	{
	}
}

?>
