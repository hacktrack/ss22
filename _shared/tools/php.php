<?php 

class slToolsPHP
{
	 
	static public function array_merge()
	{
		$arguments = func_get_args();
		$result = array();
		foreach($arguments as $key => $arg){
			if($arguments[$key] === NULL || $arguments[$key] === false || $arguments[$key] === ''){
				$arguments[$key] = array();
			}
			if(!is_array($arguments[$key])){
				$arguments[$key] = (array) $arg;
			}
			$result+=$arguments[$key];
		}
		
		if(defined('ARRAY_MERGE_KEY_SAFE') && ARRAY_MERGE_KEY_SAFE == true){
			return $result;
		}else{
			return call_user_func_array('array_merge',$arguments);
		}
	}
	 
	static public function htmlspecialchars()
	{
		$args = func_get_args();
		$args[1] = isset($args[1]) ? $args[1] : ENT_COMPAT | ENT_HTML401;
		 		$args[2] = isset($args[2]) ? $args[2]:'ISO-8859-1';
		
		return call_user_func_array('htmlspecialchars', $args);
	}
	
	static public function htmlspecialchars_array($array)
	{
        $return = [];
		if (is_array($array)) {
			foreach($array as $key => $val) {
				if (is_array($val)) {
					$return[$key] = slToolsPHP::htmlspecialchars_array($val);
				} else {
					$return[$key] = slToolsPHP::htmlspecialchars($val);
				}
			}
		} else {
			return slToolsPHP::htmlspecialchars($array);
		}
		return $return;
	}
	
	static public function fputcsv ($fh, array $fields, $delimiter = ',', $enclosure = '"', $newline = "\n") 
	{
	    $delimiter_esc = preg_quote($delimiter, '/');
	    $enclosure_esc = preg_quote($enclosure, '/');
	  
	    $output = array();
	    foreach ($fields as $field) {
	        $output[] = preg_match("/(?:${delimiter_esc}|${enclosure_esc}|\s)/", $field) ? (
	            $enclosure . str_replace($enclosure, $enclosure . $enclosure, $field) . $enclosure
	        ) : $field;
	    }
  
    	fwrite($fh, join($delimiter, $output) . $newline);
  	}
  	
 	static public function str_getcsv($data, $delimiter = ',', $enclosure = '"', $newline = "\n",&$quote_open)
 	{
 		$data = str_replace("\r\n","\n",$data);
        $pos = $last_pos = -1;
        $end = strlen($data);
        $row = 0;
                 $trim_quote = false;

        $return = array();

                 for ($i = -1;; ++$i){
            ++$pos;
                         $comma_pos = strpos($data, $delimiter, $pos);
            $quote_pos = strpos($data, $enclosure, $pos);
            $newline_pos = strpos($data, $newline, $pos);

                         $pos = min(($comma_pos === false) ? $end : $comma_pos, ($quote_pos === false) ? $end : $quote_pos, ($newline_pos === false) ? $end : $newline_pos);

                         $char = (isset($data[$pos])) ? $data[$pos] : null;
            $done = ($pos == $end);

                         if ($done || $char == $delimiter || $char == $newline){
                                 if ($quote_open && !$done){
                    continue;
                }

                $length = $pos - ++$last_pos;

                                 if ($trim_quote){
                                         --$length;
                }

                                 $return[$row][] = ($length > 0) ? str_replace($enclosure . $enclosure, $enclosure, substr($data, $last_pos, $length)) : '';

                                 if ($done){
                    break;
                }

                                 $last_pos = $pos;

                                 if ($char == $newline){
                    ++$row;
                }

                $trim_quote = false;
            }
                         else if ($char == $enclosure){

                                 if ($quote_open == false){
                                         $quote_open = true;
                    $trim_quote = false;

                                         if ($last_pos + 1 == $pos){
                        ++$last_pos;
                    }

                }
                else {
                                         $quote_open = false;

                                         $trim_quote = true;
                }

            }

        }
        return $return[0];
    }
    
	static public function filegetcsv($filename,$separator = ",",$enclosure='"',$newline="\r\n",$charset = 'UTF-8')
	{
		slSystem::import('tools/php');
		@$fp = fopen ($filename,"r");
        $aResult = [];
		while($line_data = fgets($fp)){
			if($charset!='UTF-8'){
				$line_data = slToolsCharset::my_iconv($charset, 'UTF-8', $line_data);
			}
			$continue = false;
			$data = slToolsPHP::str_getcsv($line_data,$separator,$enclosure,$newline,$continue);
			while($continue && $line_data = fgets($fp)) {
				$multi = slToolsPHP::str_getcsv($line_data,$separator,$enclosure,$newline,$continue);
				$data[count($data)-1] .= $multi[0];
				unset($multi[0]);
				$data = slToolsPHP::array_merge($data,$multi);
			}
			$aResult[] = $data;
		}
		@fclose ($fp);
		
		return $aResult;
	}

 

     
    public static function arrayOrderBy(array &$array, array $rules)
    {
        usort($array, function ($a, $b) use ($rules) {
            $retval = 0;
            foreach ($rules as $rule) {
                $retval = strcmp($a[$rule['key']], $b[$rule['key']]);
                if($retval != 0) break;
            }
            if (strcasecmp($rule['direction'], 'DESC') === 0) $retval *= -1;
            return $retval;
        });
        return $array;
    }
}
?>