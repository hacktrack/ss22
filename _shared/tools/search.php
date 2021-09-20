<?php

 
 



class SearchTool
{
	static $knownCommands = array(
		'from',
		'to',
		'subject',
		'cc',
		'bcc',
		'sms',
		'priority',
		'description',
		'title',
		'name',
		'email',
		'isemail',
		'company',
		'department',
		'location',
		'greater',
		'smaller',
		'keyword',
		'tag',
		'fulltext',
		'has',
		'is',
		'in',
		'after',
		'before',
		'beforetime',
		'aftertime',
		'beforeid',
		'afterid',
		'sinceid',
		'untilid',
		'color',
		'flag',
		'count',
		'class',
		'items',
		'classify',
		'mobile',
		'phone',
		'email1',
		'email2',
		'email3',
		'conference',
		'category',
		'note',
		'gchat',
		'everywhere',
		'creationdate',
		'comments',
		'next',
		'folder',
		'partid',
        'flags',
        'afterend',
        'beforeend',
        'taglist',
        'simplefulltext'
	);
	static $operators = array(
		'creationdate'=>'=',
		'beforetime'=>'<',
		'before'=>'<',
		'aftertime'=>'>',
		'after'=>'>'
	);
	static $folderDefaults = array(
		 		'M'=>array(
			'header_from',
			'header_to',
			'subject',
			'header_cc',
			'header_bcc',
			'header_sms'
		),
		 		'C'=>array(
			'ItmTitle',
			'ItmClassifyAs',
			'LctEmail1',
			'LctEmail2',
			'LctEmail3',
			'ItmCompany',
			'ItmDepartment',
			'ItmCategory',
			'ItmFirstName',
			'ItmSurName',
			'ItmMiddleName',
			'ItmDescription',

			 			'LctPhnHome1',
			'LctPhnHome2',
			'LctPhnAssistant',
			'LctPhnWork1',
			'LctPhnWork2',
			'LctPhnFaxHome',
			'LctPhnFaxWork',
			'LctPhnCallback',
			'LctPhnCompany',
			'LctPhnCar',
			'LctPhnIsdn',
			'LctPhnMobile',
			'LctPhnOther',
			'LctPhnOtherFax',
			'LctPhnPager',
			'LctPhnPrimary',
			'LctPhnRadio',
			'LctPhnTelex',
			'LctPhnHearing'
		),
		'E'=>array(
			'EvnTitle',
			'EvnNote',
		),
		'T'=>array(
			'EvnTitle',
			'EvnNote'
		),
		'N'=>array(
			'EvnTitle',
			'EvnNote'
		),
		'F'=>array(
			'EvnTitle',
			'EvnLocation',
			'EvnNote'
		),
		'J'=>array(
			'EvnTitle',
			'EvnNote'
		),
		 		'Q'=>array(
			'SndEmail',
			'SndOwner',
			'SndDomain',
			'SndSubject'
		),
		'QL'=>array(
			'SndEmail',
			'SndOwner',
			'SndDomain'
		),
		 		'G'=>array(
			'ItmTitle',
			'ItmOriginalFolder',
			'Itm_Deleted'
		),
		 		'SL'=>array(
			'subject',
			'header_from'
		),
		 		'K'=>array(
			'tagname'
		),
		 		'HIPAA'=>array(
			'fullname',
			'type'
		),
		 		'I'=>array(
			'EvnTitle',
			'EvnNote',
		)
	);
	
	static private $wildcards = array("%","_","[","]","^");
	static private $escaped = array('\%','\_','\[','\]','\^');
	
	private $type;
	private $tableName;
    public $dbtype;
    public $oFolder;
    public $tz;
    public $account;
    public $filter;

	 
	public function parse($condition, &$filter = array())
	{
		if(!$this->type){
			throw new Exception('search_type_undefined');
		}
		$this->configTableName($_SESSION['DBTYPE']);
		$this->dbtype = $_SESSION['DBTYPE'];
		$this->filter = &$filter;

		$tokens = $this->tokenizeCondition($condition);  		
		$this->prepareTokensToSql($tokens);  
		$result = $this->processTokens($tokens);  		return $result;
	}
	
	public function setFolder($oFolder)
	{
		$this->oFolder = $oFolder;
	}
	
	public function setTimeZone($tz)
	{
		$this->tz = $tz;
	}
	
	public function configTableName($dbType)
	{
		$this->setTableName(false);
		if($this->oFolder 
		&& $this->oFolder->type=='V'
		&& $this->oFolder->getType()=='M'
		&& $this->oFolder->isEmpty()){
			switch(strtoupper($dbType)){
				case 'MYSQL':
				$this->setTableName('i');
				break;
			}
		}
	}
	
	public function setTableName($tableName)
	{
		$this->tableName = $tableName;
	}
	public function getTableName()
	{
		return $this->tableName?$this->tableName.'.':'';
	}
	
	
	public function setType($type)
	{
		$this->type = $type;
	}
	
	public function getType()
	{
		return $this->type;
	}
	
	public function setAccount(&$account)
	{
		$this->account = &$account;
	}
	
	public function getAccount()
	{
		return $this->account;
	}

	 
	private function tokenizeCondition($condition) {
		$characterLimit = 2048;
		$tokensLimit = 100;
		$condition = trim($condition);
		if (strlen($condition) > $characterLimit) {
			throw new Exception('Character limit has been exceeded (' . $characterLimit . ').');
		}

		 		 		 		 		 		$return = preg_match_all('/([\(\-]*".*?[^\\\\"]"[\)]*)|([\(\-]*[\w]+?:[\w\@\.\/\=]*[\)]*?)|(\S+)/u', $condition, $tokens);
		 
		if (false === $return) {
			return array();
		}

		$tokens = $tokens[0];

		 		 		$loop = 0;
		for ($i = 0; $i < count($tokens); $i++) {
			$loop++;
			if ($loop > $tokensLimit) {
				throw new Exception('Search words limit has been exceeded (' . $tokensLimit . ').');
			}

			$token = $tokens[$i];
			$firstChar = substr($token, 0, 1);
			$lastChar = substr($token, -1);

			if ('-' === $firstChar && strlen($token) > 1) {
				 				if (isset($tokens[$i - 1]) && 1 === strlen($tokens[$i - 1]) && '-' === substr($tokens[$i - 1], 0, 1)) {
					continue;
				}
				$tokens[$i] = substr($token, 1);
				array_splice($tokens, $i, 0, $firstChar);
				$i = 0;  				continue;
			}

			if ('(' === $firstChar && strlen($token) > 1) {
				$tokens[$i] = substr($token, 1);
				array_splice($tokens, $i, 0, $firstChar);
				$i = 0;  				continue;
			}

			if (')' === $lastChar && strlen($token) > 1 && false === strpos($token, '(')) {
				$tokens[$i] = substr($token, 0, -1);
				array_splice($tokens, $i + 1, 0, $lastChar);
				$i = -1;  				continue;
			}

			 		}

		 		$loop = 0;
		for ($i = 0; $i < count($tokens); $i++) {
			$loop++;
			if ($loop > $tokensLimit) {
				throw new Exception('Search words limit has been exceeded (' . $tokensLimit . ').');
			}

			$token = $tokens[$i];
			$lastChar = substr($token, -1);

			 			if (':' === $lastChar && strlen($token) > 1 && isset($tokens[$i + 1])) {
				$nextToken = $tokens[$i + 1];
				if ($nextToken !== '-' && $nextToken !== ')' && $nextToken !== '(' && strlen($nextToken) > 0) {
					$tokens[$i] = $token . $nextToken;
					array_splice($tokens, $i + 1, 1);
					$i = -1;  					continue;
				}
			}

		}

		$this->validateTokens($tokens);

		return $tokens;
	}

	 
	private function separateContentInBracketsToString($tokens) {
		$cnt = count($tokens);
		$openingIndex = false;
		$closingIndex = false;
		 		for ($i = $cnt - 1; $i >= 0; $i--) {
			if ('(' === $tokens[$i]) {
				$openingIndex = $i;
				break;
			}
		}
		for ($i = $openingIndex + 1; $i < $cnt; $i++) {
			if (')' === $tokens[$i]) {
				$closingIndex = $i;
				break;
			}
		}

		if ($openingIndex !== false && $closingIndex !== false) {
			$offset = $openingIndex + 1;
			$length = $closingIndex - ($openingIndex + 1);
			$tokensSliced = array_slice($tokens, $offset, $length);
			$tokensBefore = array_slice($tokens, 0, $openingIndex);
			$tokensAfter = array_slice($tokens, $closingIndex + 1);
			if (count($tokensSliced) < 1) {
				$lastToken = $tokensBefore[count($tokensBefore) - 1];
				if (':' === substr($lastToken, -1)) {
					return array_merge($tokensBefore, array('AND', '()'), $tokensAfter);
				}
			}
			$tokensSlicedSimplified = $this->prepareTokensToSqlSimple($tokensSliced);
			return array_merge($tokensBefore, array(':::::' . json_encode($tokensSlicedSimplified)), $tokensAfter);
		}

		return '';
	}

	 
	private function prepareTokensToSql(&$tokens) {
		$cnt = count($tokens);
		if ($cnt < 1) {
			return;  		}

		$openingBracketIndexes = [];
		for ($i = $cnt - 1; $i >= 0; $i--) {
			if ('(' === $tokens[$i]) {
				$openingBracketIndexes[] = $i;
			}
		}
		$cnt = count($openingBracketIndexes);
		if ($cnt < 1) {
			$tokens = $this->prepareTokensToSqlSimple($tokens);  			return;
		}

		 		$cnt = count($openingBracketIndexes) + 1;
		for ($i = 0; $i < $cnt; $i++) {

			$openingBracketCount = 0;
			foreach ($tokens as $token) {
				if ('(' === $token) {
					$openingBracketCount++;
				}
			}

			 			if ('(' === $tokens[0] && ')' === $tokens[count($tokens) - 1] && 1 === $openingBracketCount) {
				$tokensToProcess = array_slice($tokens, 1, -1);
				if (0 === count($tokensToProcess)) {
					$tokens = array('(', ')');
				}
				else {
					$tokens = array_merge(array('('), $this->prepareTokensToSqlSimple($tokensToProcess), array(')'));
				}
			}
			 			elseif ($openingBracketCount > 0) {
				$tokens = $this->separateContentInBracketsToString($tokens);
			}
			 			elseif (0 === $openingBracketCount) {
				$tokens = $this->prepareTokensToSqlSimple($tokens);
			}
		}

		 		for ($i = 0; $i < count($tokens); $i++) {
			$token = $tokens[$i];
			if (':::::' === substr($token, 0, 5)) {
				$tokensDecoded = json_decode(substr($token, 5));
				if (JSON_ERROR_NONE === json_last_error() && is_array($tokensDecoded)) {
					array_unshift($tokensDecoded, '(');
					$tokensDecoded[] = ')';
				}
				array_splice($tokens, $i, 1, $tokensDecoded);
				continue;
			}
		}

		 	}

	 
	 private function processTokens($tokens)
     {
		$logicOperators = array('AND', 'OR', 'NOT');
		$bracketOperators = array('(', ')');
		$allOperators = array_merge($logicOperators, $bracketOperators);
		$resultArray = array();
		if (isset($tokens[0]) && '(' === $tokens[0] && ')' === $tokens[count($tokens) - 1]) {
			array_pop($tokens);
			array_shift($tokens);
		}

		for ($i = 0; $i < count($tokens); $i++) {
			$token = $tokens[$i];
			if (in_array($token, $allOperators)) {
				$resultArray[] = $token;
				continue;
			}
			$isSemicolon = false;
			$isSlicedTokens = false;
			if (strpos($token, ':') !== false) {
				$parts = explode(':', $token);
				if (in_array(strtolower($parts[0]), self::$knownCommands)) {
					$isSemicolon = true;
					$nextToken = isset($tokens[$i + 1]) ? $tokens[$i + 1] : false;
					if ($nextToken && '(' === $nextToken) {
						$closingBracketIndex = false;
						for ($j = $i + 1; $j < count($tokens); $j++) {
							if (')' === $tokens[$j]) {
								$closingBracketIndex = $j;
								break;
							}
						}
						if ($closingBracketIndex) {
							$slicedTokens = array_slice($tokens, $i + 1, $closingBracketIndex - $i);
							$isSlicedTokens = true;
							$resultArray[] = $this->processFunction(false, array_merge(array($token), $slicedTokens));
							$i = $closingBracketIndex;
							continue;
						}
					}
				}
				if (!$isSlicedTokens) {
					$resultArray[] = $this->processFunction($token);
					continue;
				}
			}
			if (!$isSemicolon) {
                $token = trim($token,'"');
                if(strlen($token) >= 3 && $this->type != 'Z'){
                    $prefix = 'fulltext:';
                    if($this->type == 'M'){
                        $resultArray[] = $this->processFunction($token);
                        $resultArray[] = 'OR';
                    }else{
                        $prefix = 'simple'. $prefix;
                    }
                    $token = $prefix . $token;
                }
                $resultArray[] = $this->processFunction($token);
			}
		}
		return implode(' ', $resultArray);
	}

	 
	private function prepareTokensToSqlSimple($tokens) {
		$logicOperators = array('AND', 'OR');
		$negationOperators = array('NOT', '-');
		$allOperators = array_merge($logicOperators, $negationOperators);

		 		for ($i = 0; $i < count($tokens); $i++) {
			$tokenPrev = isset($tokens[$i - 1]) ? $tokens[$i - 1] : false;
			$tokenCurrent = $tokens[$i];
			$tokenNext = isset($tokens[$i + 1]) ? $tokens[$i + 1] : false;
			$tokenPrevUp = $tokenPrev ? strtoupper($tokenPrev) : false;
			$tokenCurrentUp = $tokenCurrent ? strtoupper($tokenCurrent) : false;
			$tokenNextUp = $tokenNext ? strtoupper($tokenNext) : false;

			 			if (false === $tokenPrev &&
			    $tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators)) {
				$tokens[$i] = '"' . $tokenCurrent . '"';
			}
			 			elseif ($tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators) &&
			        false === $tokenNext) {
				$tokens[$i] = '"' . $tokenCurrent . '"';
			}
			 			elseif ($tokenCurrent !== false && true === in_array($tokenCurrentUp, $negationOperators) &&
			        false === $tokenNext) {
				$tokens[$i] = '"' . $tokenCurrent . '"';
			}
			 			elseif ($tokenPrev !== false && true === in_array($tokenPrevUp, $negationOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $negationOperators)) {
				$tokens[$i] = '"' . $tokenCurrent . '"';
			}
		}

		 		for ($i = 0; $i < count($tokens); $i++) {
			$tokenPrev = isset($tokens[$i - 1]) ? $tokens[$i - 1] : false;
			$tokenCurrent = $tokens[$i];
			$tokenNext = isset($tokens[$i + 1]) ? $tokens[$i + 1] : false;
			$tokenNextNext = isset($tokens[$i + 2]) ? $tokens[$i + 2] : false;
			$tokenNextNextNext = isset($tokens[$i + 3]) ? $tokens[$i + 3] : false;
			$tokenPrevUp = $tokenPrev ? strtoupper($tokenPrev) : false;
			$tokenPrevLow = $tokenPrev ? strtolower($tokenPrev) : false;
			$tokenCurrentUp = $tokenCurrent ? strtoupper($tokenCurrent) : false;
			$tokenNextUp = $tokenNext ? strtoupper($tokenNext) : false;
			$tokenNextNextUp = $tokenNextNext ? strtoupper($tokenNextNext) : false;
			$tokenNextNextNextUp = $tokenNextNextNext ? strtoupper($tokenNextNextNext) : false;
			$tokenPrevIsKeyword = ':' === substr($tokenPrev, -1, 1) && in_array(substr($tokenPrevLow, 0, -1), self::$knownCommands) !== false;

			 			if ($tokenPrev !== false && $tokenPrevIsKeyword &&
			    $tokenCurrent !== false && false === in_array($tokenCurrentUp, $allOperators)) {
				 			}
			 			elseif ($tokenPrev !== false && $tokenPrevIsKeyword &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $negationOperators) &&
			        $tokenNext !== false && false === in_array($tokenNextUp, $allOperators)) {
				 			}
			 			elseif ($tokenPrev !== false && false === in_array($tokenPrevUp, $allOperators) &&
			        $tokenCurrent !== false && false === in_array($tokenCurrentUp, $allOperators)) {
				array_splice($tokens, $i, 0, 'AND');
			}
			 			elseif ($tokenPrev !== false && true === in_array($tokenPrevUp, $negationOperators) &&
			        $tokenCurrent !== false && false === in_array($tokenCurrentUp, $negationOperators) &&
			        false === $tokenNext) {
				$tokens[$i - 1] = 'NOT';
			}
			 			elseif (false === $tokenPrev &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $negationOperators) &&
			        $tokenNext !== false && false === in_array($tokenNextUp, $allOperators)) {
				$tokens[$i] = 'NOT';
			}
			 			elseif ($tokenPrev !== false && false === in_array($tokenPrevUp, $allOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $negationOperators) &&
			        $tokenNext !== false && false === in_array($tokenNextUp, $allOperators)) {
				$tokens[$i] = 'NOT';
				array_splice($tokens, $i, 0, 'AND');
			}
			 			elseif ($tokenPrev !== false && false === in_array($tokenPrevUp, $allOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators) &&
			        $tokenNext !== false && false === in_array($tokenNextUp, $allOperators)) {
				$tokens[$i] = $tokenCurrentUp;
			}
			 			elseif ($tokenPrev !== false && false === in_array($tokenPrevUp, $allOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators) &&
			        $tokenNext !== false && true === in_array($tokenNextUp, $negationOperators) &&
			        $tokenNextNext !== false && false === in_array($tokenNextNextUp, $allOperators)) {
				$tokens[$i] = $tokenCurrentUp;
				$tokens[$i + 1] = 'NOT';
			}
			 			elseif ($tokenPrev !== false && true === in_array($tokenPrevUp, $logicOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators) &&
			        $tokenNext !== false && true === in_array($tokenNextUp, $logicOperators)) {
				$tokens[$i - 1] = '"' . $tokenPrev . '"';
				$tokens[$i + 1] = '"' . $tokenNext . '"';
				$tokens[$i] = $tokenCurrentUp;
			}
			 			elseif ($tokenPrev !== false && false === in_array($tokenPrevUp, $allOperators) &&
			        $tokenCurrent !== false && true === in_array($tokenCurrentUp, $logicOperators) &&
			        $tokenNext !== false && true === in_array($tokenNextUp, $negationOperators) &&
			        $tokenNextNext !== false && true === in_array($tokenNextNextUp, $logicOperators) &&
			        $tokenNextNextNext !== false && false === in_array($tokenNextNextNextUp, $allOperators)) {
				$tokens[$i] = $tokenCurrentUp;
				$tokens[$i + 1] = 'NOT';
				array_splice($tokens, $i + 3, 0, 'AND');
			}
		}

		return $tokens;
	}

	 
	private function validateTokens(&$tokens) {
		$bracketsCounter = 0;
		for ($i = 0; $i < count($tokens); $i++) {
			$token = $tokens[$i];
			if ('(' === $token) {
				$bracketsCounter++;
			}
			if (')' === $token) {
				if ($bracketsCounter > 0) {
					$bracketsCounter--;
				}
				else {
					$tokens[$i] = '"' . $token . '"';  				}
			}
		}
		if ($bracketsCounter > 0) {
			for ($i = count($tokens) - 1; $i >= 0 ; $i--) {
				if (0 === $bracketsCounter) {
					break;
				}
				$token = $tokens[$i];
				if ('(' === $token && $bracketsCounter > 0) {
					$tokens[$i] = '"' . $token . '"';  					$bracketsCounter--;
				}
			}
		}
	}

	private function escapeWildcards($value)
	{
		return str_replace(self::$wildcards,self::$escaped,$value);
	}
	
	private function escapeValue($value, $exact_match = false)
	{
		switch($this->type){
			case 'Q':
			case 'QL':
			     				$value = icewarp_escape_db_string($value,'antispam');
				break;
			case 'K':
				break;
			default:
				if($this->type=='M'){
					if($this->dbtype=='MYSQL' &&!$exact_match){
						$value = preg_replace('/\\\\(?!(_|%|\[|\]))/si','\\\\\\\\',$value);
					}
					$value = str_replace("'","''",$value);
				}else{
					$value = str_replace("'","''",$value);
				}
				
				break;
		}
		return $value;
	}
	
	 
	private function processValue($str_value ,$arr_value, $condition, $count, $value_callback = array(), $condition_callback = array(), $exact_match = false)
	{	
		if($str_value || trim($str_value,'"')==='0' || trim($str_value,"'")==='0'){
			$str_value = self::escapeValue($str_value, $exact_match);
			if(strpos($condition,'{ESCAPE \'\\\'}')!==false){
				$str_value = preg_replace('/\\\\(?!(_|%|\[|\]))/si','\\\\\\\\',$str_value);
			}
			$str_value = $this->executeCallback($str_value, $value_callback);
			if($str_value || trim($str_value,'"')==='0' || trim($str_value,"'")==='0'){
				if($count > 1){
					$condition = vsprintf($condition,array_fill(0,$count,$str_value));
				}else{
					$condition = sprintf($condition,$str_value);
				}			
			}
			
			$condition = $this->executeCallback($str_value, $condition_callback,$condition);
		}else if($arr_value){
			$result = '(';
			foreach($arr_value as $val){
				switch(strtoupper(trim($val))){
					case 'NOT':
						$result.= ' NOT ';
						break;
					case '(':
						$result.=' (';
						break;
					case ')':
						$result.=') ';
						break;
					break;
					case 'AND':
					case 'OR':
						$result.=' '.strtoupper($val).' ';
						break;
					default:
						if(($val[0]=='"' || $val[0]=="'") && (strlen($val) > 1)){
							$val = substr($val,1,strlen($val)-2);
							$val = str_replace(array('\\\\','\\"'),array('\\','"'),$val);  
						}
						$val = self::escapeValue($val, $exact_match);
						if(strpos($condition,'{ESCAPE \'\\\'}')!==false){
							$val = preg_replace('/\\\\(?!(_|%|\[|\]))/si','\\\\\\\\\\\\\\\\',$val);
						}	
						$val = $this->executeCallback($val, $value_callback);
						if(trim($val) || $val===0){
							$c = '';
							if($count > 1){
								$c = vsprintf($condition,array_fill(0,$count,$val));
							}else{
								
								$c = sprintf($condition,$val);
							}
						}
						$c = $this->executeCallback($val, $condition_callback, $c);
						$result.=$c;
						break;
				}
			}
			$result.=')';
			$condition = $result;
		}else{
			$condition = '';
		}
		return $condition;
	}
	
	private function executeCallback($value,$callback,$condition = '')
	{
		$arguments = array($value,$condition);
		
		if(is_array($callback['arguments'])){
			$arguments = slToolsPHP::array_merge($arguments,$callback['arguments']);
		}
		if(!empty($callback['func'])){
			if($callback['class']){
				$value = call_user_func_array(array($callback['class'], $callback['func']), $arguments);
			}else{
				$value = $callback['func']($arguments[0],$arguments[1],$arguments[2],$arguments[3],$arguments[4],$arguments[5]);
			}
		}else if($condition){
			$value = $condition; 
		}
		return $value;		
	}
	
	 
	private function processFunction($str_token = '',$arr_token = array())
	{
        $str_value = $value_callback = $condition_callback = $arr_value = $condition = $command = null;
		$escape = true;
		if($str_token){
			if(($str_token[0]=='"' || $str_token[0]=="'") && (strlen($str_token) > 1)){
				$str_value = substr($str_token,1,strlen($str_token)-2);
			}else{
				if(strpos($str_token,':')!==false){
					$info = explode(':',$str_token,2);
					if(in_array(strtolower($info[0]),self::$knownCommands)){
						$str_value = $info[1];
						$command = $info[0];
					}else{
						$str_value = $str_token;
					}
					
				}else{
					$str_value = $str_token;
				}
				if(($str_value[0]=='"' || $str_value[0]=="'") && (strlen($str_value) > 1)){
					$str_value = substr($str_value,1,strlen($str_value)-2);
				}
			}
		}
		if($arr_token){
			$command = substr($arr_token[0],0,strlen($arr_token[0])-1);
			$arr_value = $arr_token;
			array_shift($arr_value);
		}
		
		$complete = false;  		$exact_match = false;  		$count = 1;  		$table = $this->getTableName();
		 		switch(strtolower($command)){
			 			case 'from':
				switch($this->type){
					case 'Q':
					case 'QL':
						$condition = "(".$table."SndEmail IS NOT NULL AND ".$table."SndEmail LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					case 'M':
						$condition = "(".$table."header_from IS NOT NULL AND ".$table."header_from LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					case 'I':
						$condition_callback = array(
							'class'=>&$this,
							'func'=>'teamChatMemberCondition',
							'arguments'=>array('from')
						);
						break;
				}
				break;
			case 'to':
				switch($this->type){
					case 'Q':
					case 'QL':
						$condition = "(SndOwner IS NOT NULL AND SndOwner LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					case 'M':
						$condition = "(".$table."header_to IS NOT NULL AND ".$table."header_to LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
				}
				break;
			case 'subject':
				switch($this->type){
					case 'Q':
						$condition = "(SndSubject IS NOT NULL AND SndSubject LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					case 'M':
						$condition = "(".$table."subject IS NOT NULL AND ".$table."subject LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					}
					break;
				break;
			case 'cc':
				$condition = "(".$table."header_cc IS NOT NULL AND ".$table."header_cc LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'bcc':
				$condition = "(".$table."header_bcc IS NOT NULL AND ".$table."header_bcc LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'sms':
				$condition = "(".$table."header_sms IS NOT NULL AND ".$table."header_sms LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'priority':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'priorityCondition'
				);
				break;
			case 'color':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'colorCondition'
				);				
			break;
			 			case 'note':
			case 'description':
				if($this->type=='C'){
					$condition = "(ItmDescription IS NOT NULL AND ItmDescription LIKE '%%%s%%' {ESCAPE '\\'})";
				}else{
					$condition = "(EvnNote IS NOT NULL AND EvnNote LIKE '%%%s%%' {ESCAPE '\\'})";
				}
				break;
			break;
			case 'gchat':
				switch($str_value){
					case 'main':
						$this->filter['groupchat_type'] = 'main';
						$condition = "(EvnClass = 'Z' Or EvnClass = 'I' OR EvnClass='Q' OR EvnClass='R' OR EvnClass='D' Or EvnClass='S' Or EvnClass='W' Or EvnClass='B' Or EvnClass='Y')";
						break;
					case 'files':
						$this->filter['groupchat_type'] = 'files';
						$condition = "(EvnClass='F' OR EvnClass='M')";
						break;
					case 'events':
						$this->filter['groupchat_type'] = 'events';
						$condition = "(EvnClass='E' Or EvnClass='O' Or EvnClass='V')";
						break;
					case 'comments':
						$this->filter['groupchat_type'] = 'comments';
						$condition = "(EvnClass = 'Z' Or EvnClass = 'I' OR EvnClass='Q' OR EvnClass='R' OR EvnClass='D' Or EvnClass='S' Or EvnClass='W' Or EvnClass='Y')";						
						break;
					case 'global_pins':
					case 'my_pins':
					case 'mentions':
						$this->filter['groupchat_type'] = trim($str_value);
						$condition = "(EvnClass = 'Z' Or EvnClass = 'I' OR EvnClass='Q' OR EvnClass='R' OR EvnClass='D' Or EvnClass='S' Or EvnClass='W' Or EvnClass='Y')";
						break;
				}
				break;
			case 'title':
				switch($this->type){
					case 'G':
					case 'C':
						$condition = "(ItmTitle IS NOT NULL AND ItmTitle LIKE '%%%s%%' {ESCAPE '\\'})";
					break;
					case 'SL':
						$condition = "(header_from IS NOT NULL AND header_from LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					default:
						$condition = "(EvnTitle IS NOT NULL AND EvnTitle LIKE '%%%s%%' {ESCAPE '\\'})";
					break;
				}
				break;
			case 'name':
				switch($this->type){
					case 'C':
						$condition = "((ItmClassifyAs IS NOT NULL AND ItmClassifyAs LIKE '%%%s%%' {ESCAPE '\\'}) OR (ItmFirstName IS NOT NULL AND ItmFirstName LIKE '%%%s%%' {ESCAPE '\\'}) OR (ItmMiddleName IS NOT NULL AND ItmMiddleName LIKE '%%%s%%' {ESCAPE '\\'}) OR (ItmSurName IS NOT NULL AND ItmSurName LIKE '%%%s%%' {ESCAPE '\\'}))";
						$count = 4;
						break;
					case 'SL':
						$condition = "(header_from IS NOT NULL AND header_from LIKE '%%%s%%' {ESCAPE '\\'})";
						break;
					case 'Z':
						$this->filter['name'] = $str_value;
						 
						break;
				}
				break;
			case 'everywhere':
				switch($this->type)	{
					case 'Z':
						$this->filter['everywhere'] = $str_value;
						break;
					case 'I':						
						$condition_callback = array(
							'class'=>&$this,
							'func'=>'teamChatMemberCondition',
							'arguments'=>array('everywhere')
						);
						break;
				}
				break;
			case 'isemail':
				switch($this->type){
					case 'C':
						$condition = "((LCTEMAIL1 = '%s') OR (LCTEMAIL2 ='%s') OR (LCTEMAIL3 = '%s'))";
						$exact_match = true;
						$count = 3;
						break;
					case 'Z':
						$this->filter['email'] = $str_value;
						break;
					case 'I':
						$condition_callback = array(
							'class'=>&$this,
							'func'=>'teamChatMemberCondition',
							'arguments'=>array('isemail')
						);
						break;
				}
				break;
			case 'email':
				switch($this->type){
					case 'C':
						$condition = "((LCTEMAIL1 IS NOT NULL AND LCTEMAIL1 LIKE '%%%s%%'  {ESCAPE '\\'}) OR (LCTEMAIL2 IS NOT NULL AND LCTEMAIL2 LIKE '%%%s%%'  {ESCAPE '\\'}) OR (LCTEMAIL3 IS NOT NULL AND LCTEMAIL3 LIKE '%%%s%%' {ESCAPE '\\'}))";
						$count = 3;
						break;
					case 'SL':
						$condition = "(".$table."subject IS NOT NULL AND ".$table."subject LIKE '%%%s%%'  {ESCAPE '\\'})";
						$count = 1;
						break;
					case 'Z':
						$this->filter['email'] = $str_value;
						break;
					case 'I':
						$condition_callback = array(
							'class'=>&$this,
							'func'=>'teamChatMemberCondition',
							'arguments'=>array('email')
						);
						break;
				}
				break;
			case 'company':
				$condition = "(ItmCompany IS NOT NULL AND ItmCompany LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'department':
				$condition = "(ItmDepartment IS NOT NULL AND ItmDepartment LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'category':
				if($this->type!='M'){
					if($this->type=='C'){
						$col = 'ItmCategory';
					}else{
						$col = 'EvnCategory';
					}
					$condition = "($col IS NOT NULL AND $col LIKE '%%%s%%' {ESCAPE '\\'})";
				}
				break;
			case 'location':
				$condition = "(EvnLocation IS NOT NULL AND EvnLocation LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			break;
			 			case 'greater':
				switch($this->type){
					case 'M':
						$condition = $this->getTableName().'size > %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'kbtob'
						);
					break;
					case 'I':
					case 'F':
						$condition = 'EvnComplete > %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'kbtob'
						);
					break;
				}
			break;
			case 'smaller':
				switch($this->type){
					case 'M':
						$condition = $this->getTableName().'size < %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'kbtob'
						);
					break;
					case 'I':
					case 'F':
						$condition = 'EvnComplete < %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'kbtob'
						);
					break;
				}
			break;

			case 'keyword':			case 'tag':
				
				switch($this->type){
					case 'M':
					case 'Q':
					case 'QL':
						break;
					case 'K':
							$condition = "(tagname IS NOT NULL and tagname LIKE '%%%s%%' {ESCAPE '\\'})";
							break;
					default:
						$condition = "{TAG}%s{/TAG}";
						$exact_match = true;
						break;
				}
				break;
            case 'taglist':
                $condition = "(taglist IS NOT NULL and taglist LIKE \"%%%s%%\" {ESCAPE '\\'})";
                $value_callback = ['class' => &$this, 'func' => 'urlEnquoteEscape'];
				break;
			case 'fulltext':
			    if($this->type == 'M'){
                    $condition = "{FULLTEXT}%s{/FULLTEXT}";
                    $exact_match = true;
                }elseif(in_array($this->type, ['F','C','E','N','T','I','K'])){
                    $conditions = [];
                    foreach(self::$folderDefaults[$this->type] as $field){
                        $conditions[] = "(".$this->getTableName().$field." IS NOT NULL AND ".$this->getTableName().$field." LIKE '%%%s%%' {ESCAPE '\\'})";
                    }
                    $condition = join(' OR ',$conditions);
                    $condition .= ' OR {FULLTEXT}%s{/FULLTEXT}';
                    $condition = '('.$condition.')';
                    $count = count(self::$folderDefaults[$this->type]) + 1;
                }
			    break;
            case 'simplefulltext':
                if(in_array($this->type, ['F','C','E','N','T','I','K'])){
                    $conditions = [];
                    foreach(self::$folderDefaults[$this->type] as $field){
                        $conditions[] = "(".$this->getTableName().$field." IS NOT NULL AND ".$this->getTableName().$field." LIKE '%%%s%%' {ESCAPE '\\'})";
                    }
                    $condition = join(' OR ',$conditions);
                    $condition = '('.$condition.')';
                    $count = count(self::$folderDefaults[$this->type]);
                }
                break;
			case 'has':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'hasCondition'
				);		
				break;
			case 'is':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'isCondition'
				);		
				break;
			case 'in':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'inCondition'
				);		
			break;
            case 'afterend':
                if($this->type == 'E') {
                    $this->filter['idinterval'] = 'FUTURE';
                    $condition = null;
                    $str_value = null;
                }
                break;
            case 'beforeend':
                if($this->type == 'E') {
                    $this->filter['idinterval'] = 'PAST';
                    $condition = null;
                    $str_value = null;
                }
                break;
			case 'after':
			case 'aftertime':
			case 'beforetime':
			case 'creationdate':
			case 'before':
				$operator = self::$operators[strtolower($command)];
				$function_suffix  = strtolower($command)=='before'?'before':'';
				switch($this->type){
					case 'M':
						$condition= $this->getTableName().'date '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtotime'.$function_suffix
						);
						break;
					case 'C':
						break;
					case 'T':
						$condition= 'EvnEndDate '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtodelphidate'.$function_suffix
						);
						break;
					case 'E':
					case 'N':
					case 'J':
						$condition= 'EvnStartDate '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtodelphidate'.$function_suffix
						);
						break;
					case 'I':			
						$condition_callback = array(
							'class'=>&$this,
							'func'=>'teamChatTimeCondition',
							'arguments'=>array(strtolower($command))
						);
						break;
					case 'F':
						$condition= 'Evn_Modified '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtotime'.$function_suffix
						);
					break;
					case 'Q':
					case 'QL':
						$condition= 'SndCreatedOn '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtodelphidate'.$function_suffix
						);
					break;
					case 'G':
						$condition= 'Itm_Deleted '.$operator.' %s';
						$value_callback = array(
							'class'=>&$this,
							'func'=>'strtotime'.$function_suffix
						);
					break;
				}
			break;
			case 'comments':
				$condition = "(EvnComEvnID = '%s')";
				$exact_match = true;
				break; 
			case 'sinceid':
				$condition = "(Evn_ID >= '%s')";
				break;
			case 'afterid':
                if($this->type == 'E' && preg_match('/(?:afterend|beforeend)/i', $this->filter['search'])){
                    $this->filter['idinterval'] = ($this->filter['idinterval'] ?? '') . '+' . $str_value;
                    $condition = null;
                    $str_value = null;
                }else{
                    $condition = "(Evn_ID > '%s')";
                }
				break; 	
			case 'beforeid':
                if($this->type == 'E' && preg_match('/(?:afterend|beforeend)/i', $this->filter['search'])){
                    $this->filter['idinterval'] = ($this->filter['idinterval'] ?? '') . '+' . $str_value;
                    $condition = null;
                    $str_value = null;
                }else {
                    $condition = "(Evn_ID < '%s')";
                }
				break;
			case 'untilid':
				$condition = "(Evn_ID <= '%s')";
				break; 
			case 'next':
				$this->filter['next'] = $str_value;			
				$condition = "(1=1)";
				break;
			case 'folder':
				$condition = "(ItmOriginalFolder IS NOT NULL AND ItmOriginalFolder = '%s')";
				$exact_match = true;
				break;
			case 'flags':
				$condition = "(".$table."flags IS NOT NULL AND ".$table."flags = %s)";
				$exact_match = true;
				break;
			case 'class':
				switch($this->type){
					case 'C':
						$condition = "(ItmClass = '%s')";
						break;
					case 'I':
						$condition = "(EvnClass = '%s')";
						break;
				}
				break;
			case 'items':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'itemsCondition'
				);		
				break;
			case 'classify':
				$condition = "(ItmClassifyAs IS NOT NULL AND ItmClassifyAs = '%s')";
				break;
			case 'mobile':
				$condition = "(LctPhnMobile IS NOT NULL AND LctPhnMobile LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'email1':
				$condition = "(LCTEMAIL1 IS NOT NULL AND LCTEMAIL1 LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'email2':
				$condition = "(LCTEMAIL2 IS NOT NULL AND LCTEMAIL2 LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'email3':
				$condition = "(LCTEMAIL3 IS NOT NULL AND LCTEMAIL3 LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
			case 'phone':
				$condition = "((LctPhnHome1 IS NOT NULL AND LctPhnHome1 LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnHome2 IS NOT NULL AND LctPhnHome2 LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnAssistant IS NOT NULL AND LctPhnAssistant LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnWork1 IS NOT NULL AND LctPhnWork1 LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnWork2 IS NOT NULL AND LctPhnWork2 LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnCallback IS NOT NULL AND LctPhnCallback LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnCompany IS NOT NULL AND LctPhnCompany LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnCar IS NOT NULL AND LctPhnCar LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnISDN IS NOT NULL AND LctPhnISDN LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnMobile IS NOT NULL AND LctPhnMobile LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnPager IS NOT NULL AND LctPhnPager LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnPrimary IS NOT NULL AND LctPhnPrimary LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnRadio IS NOT NULL AND LctPhnRadio LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnTelex IS NOT NULL AND LctPhnTelex LIKE '%%%s%%' {ESCAPE '\\'}) ".
						  "OR (LctPhnHearing IS NOT NULL AND LctPhnHearing LIKE '%%%s%%' {ESCAPE '\\'}))";
				$count = 15;
				
				break;
			case 'conference':
				$condition_callback = array(
					'class'=>&$this,
					'func'=>'conferenceCondition'
				);		
				break;
			case 'partid':
				$condition = "(EvnUID = '%s')";
			break;
			default:
				if(stripos($str_value,'{TAG}')!==false){
					return $str_value;
				}
				$conditions = array();
				switch($this->type){
					case 'HIPAA':
							return $str_value;
						break;
					case 'Z':
						$this->filter['everywhere'] = $str_value;
						break;
					default:	
						foreach(self::$folderDefaults[$this->type] as $field){
							$conditions[] = "(".$this->getTableName().$field." IS NOT NULL AND ".$this->getTableName().$field." LIKE '%%%s%%' {ESCAPE '\\'})";
						}
						$condition = join(' OR ',$conditions);
						$condition = '('.$condition.')';
						$count = count(self::$folderDefaults[$this->type]);
	
						if($this->type == 'I' && strlen($command)==0){
							$condition_callback = array(
								'class'=>&$this,
								'func'=>'teamChatDefaultCondition'
							);
						}				
						break;
				}
				
			break;
		}
		if(!$complete){
			$condition = $this->processValue($str_value, $arr_value, $condition, $count, $value_callback, $condition_callback, $exact_match);
		}
		if($condition == ''){
			return '1 = 1';
		}
		return $condition;
	}
	
	private function itemsCondition($token)
	{
		switch($this->type){
			case 'M':
				$result = "(item_id = '".$token."' )";
				break;
			case 'E':
			case 'T':
			case 'N':
			case 'J':
			case 'F':
			case 'I':
				$result = "(EVN_ID = '".$token."' )";
				break;
			case 'G':
			case 'C':
				$result = "(ITM_ID = '".$token."' )";
				break;
		}
		return $result;
	}
	
	private function hasCondition($token)
	{
		switch($this->type){
			case 'M':
				switch($token){
					case 'attachment':
						$result = $this->getTableName()."has_attachment='T'";
						break;
					case 'flag':
						$result = $this->getTableName()."color <> 'Z'";
						break;
					case 'tag':
						$result = $this->getTableName()."taglist IS NOT NULL and taglist <> ''";
						break;
				}
				break;
			case 'C':
				switch($token){
					case 'email1':
						$result = "(NOT (LCTEMAIL1 = ''))";
						break;
					case 'email2':
						$result = "(NOT (LCTEMAIL2 = ''))";
						break;
					case 'email3':
						$result = "(NOT (LCTEMAIL3 = ''))";
						break;
					case 'email':
						$result = "((NOT (LCTEMAIL1 = '')) OR (NOT (LCTEMAIL2 = '')) OR (NOT (LCTEMAIL3 = '')))";
						break;
					case 'mobile':
						$result = "(NOT (LCTPHNMOBILE = ''))";
						break;
					case 'phone':
						$result = "( (NOT (LctPhnHome1 = '')) ".
								"OR (NOT (LctPhnHome2 = '')) ".
								"OR (NOT (LctPhnAssistant = '')) ".
								"OR (NOT (LctPhnWork1 = '')) ".
								"OR (NOT (LctPhnWork2 = '')) ".
								"OR (NOT (LctPhnCallback = '')) ".
								"OR (NOT (LctPhnCompany = '')) ".
								"OR (NOT (LctPhnCar = '')) ".
								"OR (NOT (LctPhnISDN = '')) ".
								"OR (NOT (LctPhnMobile = '')) ".
								"OR (NOT (LctPhnOther = '')) ".
								"OR (NOT (LctPhnPager = '')) ".
								"OR (NOT (LctPhnPrimary = '')) ".
								"OR (NOT (LctPhnRadio = '')) ".
								"OR (NOT (LctPhnTelex = '')) ".
								"OR (NOT (LctPhnHearing = ''))
								)";
						break;
					case 'sip':
						$result = "(LctPhnOther IS NOT NULL AND LctPhnOther LIKE 'sip:%')";
						break;
				}
				break;
			case 'E':
			case 'I':
				switch($token){
					case 'conference':
						$result = "(EvnMeetingID IS NOT NULL AND EvnMeetingID <> '')";
						break;
				}
				break;
			case 'K':
				switch($token){
					case 'email':
						$result = "(NOT (LCTEMAIL1 =''))";
						break;
				}
				break;
			break;
		}
		return $result;
	}
	
	private function isCondition($token)
	{
		switch(strtolower($token)){
			case 'read':
				$result = $this->getTableName().'unread = 0';
			break;
			case 'unread':
				$result = $this->getTableName().'unread = 1 ';
			break;
			case 'flagged':
				$result = $this->getTableName()."color <> 'Z'";
			break;
			case 'done':
				switch($this->type){
					case 'M':
						$result = $this->getTableName()."color = 'Y'";
					break;
					case 'E':
					case 'T':
					case 'N':
					case 'J':
					case 'F':
					case 'I':
						$result = "EvnStatus = 'M'";
					break;
				}
			break;
			case 'free':
				switch($this->type){
					case 'E':
					case 'T':
					case 'N':
					case 'J':
					case 'F':
					case 'I':
						$result = '{BITAND}EvnFlags,4{/BITAND}';
					break;
				}
			break;
			case 'busy':
				switch($this->type){
					case 'E':
					case 'T':
					case 'N':
					case 'J':
					case 'F':
					case 'I':
						$result = 'NOT {BITAND}EvnFlags,4{/BITAND}';
					break;
				}
			break;
			case 'private':
				switch($this->type){
					case 'C':
						$result = "(ItmShareType ='P' OR ItmShareType ='C')";
					break;
					case 'E':
					case 'T':
					case 'N':
					case 'J':
					case 'F':
					case 'I':
						$result = "(EvnShareType = 'C' OR EvnShareType='P')";
					break;
				}
			break;
			case 'public':
				switch($this->type){
					case 'C':
						$result = "(ItmShareType <> 'P' AND ItmShareType <> 'C')";
					break;
					case 'E':
					case 'T':
					case 'N':
					case 'J':
					case 'F':
					case 'I':
						$result = "(EvnShareType <> 'P' AND EvnShareType <> 'C')";
					break;
				}
			break;
			case 'anyone':
				if($this->type=='SL'){
					$result = "(lctemail1 = 'anyone')";
				}
				break;
		}
		return $result;
	}
	
	private function priorityCondition($value)
	{
		$priority = array(
			'highest'=>1,
			'high'=>2,
			'normal'=>3,
			'low'=>4,
			'lowest'=>5
		);
		
		$priority_val = $priority[trim(strtolower(self::escapeValue($value)))];
		if(!$priority_val){
			$priority_val = is_numeric($value)?$value:3;
		}
		$condition = $this->getTableName().'priority = '.$priority_val;			
		return $condition;
	}
	
	private function inCondition($folder)
	{
		if(trim(strtolower($folder))=='anywhere'){
			return '1 = 1';
		}
		if(!$oAccount = $this->getAccount()){
			return '0 = 1';
		}
		try{
			switch($this->type)
			{
				case 'M':
					$folder = str_replace("/","\\",$folder);
					$fdr = $oAccount->getFolder($folder);
					return "folder_id = ".$fdr->folderID;
				break;
				case 'C':
					return "ItmFolder = '".$folder."'";
				break;
				default:
					return "EvnFolder = '".$folder."'";
				break;
			}
		}catch(Exc $e){
			return '0 = 1';
		}
	}
	
	private function colorCondition($token)
	{
		switch($this->type){
			case 'M':
				switch(strtolower($token)){
					case 'none':
						$result = "color = 'Z'";
					break;
					case 'red':
						$result = "color = '1'";
					break;
					case 'blue':
						$result = "color = '2'";
					break;
					case 'green':
						$result = "color = '3'";
					break;
					case 'orange':
						$result = "color = '5'";
					break;
					case 'purple':
						$result = "color = '8'";
					break;
					case 'yellow':
						$result = "color = 'A'";
					break;
				}
				break;
			case 'K':
				$result = "(tagcolor IS NOT NULL AND tagcolor LIKE '%%%s%%' {ESCAPE '\\'})";
				break;
		}
		return $result;
	}
	
	private function conferenceCondition($token)
	{
		if($this->type!='E'){
			return '';
		}
		$accountID = $this->account->accountID;
		
		 		$accountID = str_replace(self::$wildcards,self::$escaped,$accountID);
		$accountID = str_replace("'","''",$accountID);
		
		switch($token){
			case 'organizer':
				$result = "((EvnMeetingID IS NOT NULL AND EvnMeetingID <> '') AND (EvnOrganizer LIKE '%%%s%%' {ESCAPE '\\'}))";
				break;
			case 'attendee':
				$result = "((EvnMeetingID IS NOT NULL AND EvnMeetingID <> '') AND NOT (EvnOrganizer IS NOT NULL AND EvnOrganizer LIKE '%%%s%%' {ESCAPE '\\'}))";
				break;
		}
		$result = sprintf($result,$accountID);
		return $result;
	}
	
	private function strtodelphidate($str)
	{
	    if(strcasecmp($str, 'now') === 0) $str = date('Y/m/d');
		$arr = explode('/',$str);
		return GregorianToJD($arr[1], $arr[2], $arr[0]);
	}
	
	private function strtodelphidatebefore($str)
	{
		return self::strtodelphidate($str)+1;
	}

	private function strtotime($str)
	{
		return strtotime($str);
	}
	
	private function strtotimebefore($str)
	{
		return self::strtotime($str)+86400;
	}
	
	protected function urlEnquoteEscape($str)
    {
        return slToolsString::urlenquote($str);
    }


	private function kbtob($str)
	{
		return ((int) $str) * 1024;
	}
	
	protected function teamChatDefaultCondition($value,$condition)
	{
		if(strlen($value)>=3){
			$condition = '('.$condition.' OR '.$this->teamChatMemberCondition($value,'','everywhere').')';
		}
		return $condition;
	}
	
	protected function teamChatMemberCondition($value,$condition, $type)
	{
		 		if(!$this->account){
			throw new Exception('search_set_account_first_teamchat');
		}
		if(!$this->oFolder){
			throw new Exception('search_set_folder_first_teamchat');
		}
		if($type=='from'){
			$type = 'everywhere';
		}
		$oMembersFolder = $this->account->getFolder('__@@GROUP@@__/'.$this->oFolder->name);
		if($oMembersFolder){
			$filter = array();
			$filter[$type] = $value;
			$oMembers = $oMembersFolder->getItems($filter);
			$memberSQL = '';
			$ownerIDS = array();
			if ($oMembers) foreach($oMembers as $oMember){
				$ownerIDS[] = $oMember->item['OWNERID'];	
			}
			$condition = 'EvnOwn_ID in (\''.join('\',\'',$ownerIDS).'\')';
		}
		return $condition;		
	}
	
	
	protected function teamChatTimeCondition($value,$condition,$type)
	{
		if (!$this->tz){
			throw new Exception('search_set_timezone_first_teamchat');
		}
		switch($type){
			 			case 'beforetime':
			case 'aftertime':
			 			case 'creationdate':
			case 'before':  
			case 'after':
				$operator = self::$operators[$type];
				$dtNow = new DateTime();
				$dtNow->setTimezone(new DateTimeZone($this->tz));
				$dtNow->setTimestamp(strtotime($value));
				if($operator == '=' ){
					$startOfDay = clone $dtNow;
					$startOfDay->modify('today');		
					$endOfDay = clone $startOfDay;
					$endOfDay->modify('tomorrow');
					$endOfDay->modify('1 second ago');
					$start_stamp = $startOfDay->getTimestamp(); 
					$end_stamp = $endOfDay->getTimestamp();
					$timeCondition = '(Evn_Created >= '.$start_stamp.' AND Evn_Created <= '.$end_stamp.')';					
				}else{
					$timeCondition = '(Evn_Created '.$operator.' '.$dtNow->getTimestamp().')';
				}
				if($type=='before' || $type=='after'){
					$eventCondition = "((EvnClass = 'E') AND (EvnStartDate ".$operator." ".unixtojd($dtNow->getTimestamp())." ))";
					$teamchatCondition = "((EvnClass = 'I' OR EvnClass='Q' OR EvnClass='R' OR EvnClass='D' Or EvnClass='S' Or EvnClass='W' Or EvnClass='B' Or EvnClass='F') AND ".$timeCondition.")";
					$timeCondition = '('.$timeCondition.' OR '.$eventCondition.')';
				}
				return $timeCondition;						
			break;	
		}
	}

	
}

?>