<?php
define (CHALLENGE_DB_VERSION,1);

 
slSystem::import('storage/database');
slSystem::import('tools/php');

class slCacheRecord
{
	private $id;
	private $param;
	public $property;
	
	public function __construct( &$param, &$row )
	{
		foreach($row as $prop => $val){
			if( !is_numeric( $prop ) ){
				$this->setProperty( $prop, $val );
			}
		}
		$this->param = $param;
		$this->id = $this->property['id'];
	}
	public function getProperty($name)
	{
		 
		return $this->property[$name];
	}
	
	public function setProperty($name,$val)
	{
		$this->property[$name] = $val;
	}
	
	public function getID()
	{
		return $this->id;
	}
}

abstract class slCache extends slDatabase
{
	protected $tablesChecked;
	

	 
	public function retrieve( $table, $class, $param, $fields = '', $where = array(), $offset = 0, $limit = 0, $order = false, $search = false, $fulltext = false,$groupBy = false, $result = 'object',$id = 'id' )
	{
		$filter = $this->createFilter( $fields, $where, $offset, $limit, $order, $search, $fulltext, $groupBy);
		$stmt = $this->createStatement( $filter, $table );
		$stmt->execute( $where['value']?$where['value']:NULL );
		$items = $this->recordFactory( $stmt, $class, $param, $result, $id);
		return $items;
	}
	
	public function customQuery($table, $class, $param, $query, $values = array(), $result = 'object', $id = 'id')
	{
		if($values){
			$stmt = $this->prepare( $query );
			$stmt->execute( $values );
		}else{
			$stmt = $this->query( $query );
		}
		 
		$items = $this->recordFactory( $stmt, $class, $param, $result, $id);
		return $items;
	}
	
	private function recordFactory( &$stmt , $class ,$param, $result = 'object', $id ='id' )
	{
		$items = array();
		while ( $row = $stmt->fetch() ) {
			switch($result){
				case 'array':
					$items[ $row[$id] ] = $row;
				break;
				default:
				case 'object':
					$item = $this->createRecord( $class, $param, $row );
					if($id!='id'){
						$idValue = $item->GetProperty( $id );
					}else{
						$idValue = $item->getID();
					}
					if(!isset($items[$idValue])){
						$items[ $idValue ] = $item;
					}
				break;
			}
		}
		return $items;
	}
	

	 
	public function ids($table,$transaction = false)
	{
		if (!$transaction){
			$this->transaction();
		}
		$stmt = $this->prepare('SELECT item_id, rid, flags, color
								FROM item
								WHERE folder_id = ?');

        $folderID = null;
		$stmt->execute(array($folderID));
		
		$items = array();
		while ($row = $stmt->fetch()) {
			$items[$row['rid']] = array('item_id' => intval($row['item_id']),
												'flags'	=> intval($row['flags']),
                        'color' => $row['color']);
		}
		if ($transaction)
		  $this->commit();

		return $items;
	}
	
	 
	public function createRecord( $class, &$param, &$row )
	{
		$class = $class?$class:'slCacheRecord';
		return new $class($param,$row);
	}
	
  	
	 
	public function createFilter( $columns, $where, $offset, $limit, $orderBy, $search = false, $fulltext = false, $groupBy = false )
	{
		 		$stmt = array();
		 		if ( $orderBy ){
			$this->order( $stmt, $orderBy );	
		}
		 		if ( $limit ){
			$this->limit( $stmt, $offset, $limit );		
		}
		 		if($where){
    		$this->filter( $stmt, $where, $search , $fulltext);
		}
		if($columns){
			$this->columns( $stmt, $columns );
		}
		if($groupBy){
			$this->group( $stmt, $groupBy );
		}
		return $stmt;
	}
	
	 
	public function createStatement( $filter, $table )
	{
    	     	if(isset($filter['limit']) && $this->dbtype == 'odbc'){
      		       		$limit = str_replace('LIMIT ', '', $filter['limit']);
      		$limit = explode(',', $limit);
     		$statement = $this->prepare(
			 	'SELECT TOP '.intval($limit[1]). 
				' '.$filter['columns'].
				' FROM ('.
					'SELECT TOP '.intval($limit[1]+$limit[0]).
					' '.$filter['columns'].',ROW_NUMBER()'.
					(isset($filter['order'])?(' OVER('.$filter['order'].'))'):'').
					' as row'.
					' FROM '.$table.
					(isset($filter['filter']['condition'])?(' WHERE ' . $filter['filter']['condition']):'') .
					(isset($filter['order'])?(' '.$filter['order']):'').
				' )'.
				' x WHERE x.row BETWEEN '.intval( $limit[0] + 1 ).
				' and '.intval( $limit[1] + $limit[0] )
			);
		}else{
      		$statement = $this->prepare(
	  			'SELECT '.$filter['columns'].
				' FROM '.$table.
				(isset($filter['filter']['condition'])?(' WHERE ' . $filter['filter']['condition']):'') .
				(isset($filter['groupby'])?$filter['groupby']:'').
    			(isset($filter['order'])?$filter['order']:'').
    			(isset($filter['limit'])?$filter['limit']:'')
			);		
		}
		return $statement;
	}
	
	 
	public function filter( &$stmt, $filter , $search = false , $fulltext = false )
	{
	     	  	if($search && $fulltext){
	    
		}else {
			$stmt['filter'] = $filter;
	    }
  	}
	
	public function order( &$stmt, $order )
	{
		$stmt['order'] = ' ORDER BY '.  $order ;
	}
	
	public function limit( &$stmt, $offset, $limit )
	{
		$stmt['limit'] = ' LIMIT ' . $offset . ',' . $limit;
	}
	
	public function group( &$stmt, $groupby )
	{
		$stmt['groupby'] = ' GROUP BY ' . $groupby;
	}
	
	public function columns( &$stmt, $columns, $allowed = array() )
	{
		 		if (strpos($columns,'*')===true) {          
			$stmt['columns'] = '*';
		} else{ 
			if($allowed){
		    	$stmt['columns'] = '';
				foreach($allowed as $field){
			    	if (substr_count($columns,$field)>0){
			    		$stmt['columns'] .= $field.',';
			    	}
			    }
			}else{
				if(!$columns){
					$this->error('no_columns_set');
				}
				$stmt['columns'] = $columns;
			}
		}
	}
	
	 
	public function create($table, $fields, $transaction = false)
	{
		$columns = ' (' . implode(',', array_keys($fields)) . ') ';
		$values  = '(' . implode(',', array_fill(0, count($fields), '?')) . ')';
		if ( !$transaction ){ 
			$this->transaction();
    	}
		$stmt = $this->prepare(
			'INSERT INTO ' . $table .
			$columns .
			'VALUES ' . $values
		);
		$stmt->execute( array_values( $fields ) );
		
		$id = $this->getID($table);
		
		if (!$transaction){
    		$this->commit();
      	}
		return $id;
	}

	 
	public function update($table, $id, $fields, $transaction = false)
	{
		$columns = implode('=?,', array_keys($fields)) . '=? ';
		$selector = implode('=? AND ', array_keys($id)) . '=?';
		if (!$transaction){
			$this->transaction();
		}
		$stmt = $this->prepare(
			'UPDATE ' . $table . 
			' SET ' . $columns .
			' WHERE ' . $selector
		);
	 	$stmt->execute(array_merge(array_values($fields), array_values($id)));
		if (!$transaction){
			$this->commit();
		}
	}
	
	 
	public function delete( $table, $where, $transaction = false )
	{
		if (!$transaction){
			$this->transaction();
		}
		$stmt = $this->prepare(
			'DELETE FROM ' . $table . 
			' WHERE '.$where['condition']
		);
		$stmt->execute( $where['value'] );
		if (!$transaction){
			$this->commit();
		}
	}
	
	 	 	 	}

?>