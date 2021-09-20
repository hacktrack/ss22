<?php
 

 

class slToolsValidate
{
	 
	static public function URL($value = false)
	{
		if(preg_match('/^(javascript|vbscript):/si',$value,$matches)){
			return false;	
		}
		 		if(preg_match('/^data:/si',$value)){
			return false;
		}
		if(preg_match('/^\.\./si',$value)){
			return false;
		}
		return $value;
		
		 		
	}
	static public function ftp_url($value = false)
	{
		
	}
	static public function news_url($value = false)
	{
	
	}
	static public function nntp_url($value = false)
	{
	
	}
	static public function telnet_url($value = false)
	{
	
	}
	static public function gopher_url($value = false)
	{
	
	}
	static public function wais_url($value = false)
	{
	
	}
	static public function mailto_url($value = false)
	{
	
	}
	static public function file_url($value = false)
	{
	
	}
	static public function prospero_url($value = false)
	{
	
	}
	static public function other_url($value = false)
	{
		return self::generic_url($value);
	}
	static public function generic_url($value = false)
	{
		 
		
		 
		
		$alpha = "[a-zA-Z]";
		$digit = "[0-9]";
		$HEXDIG = "[0-9A-Fa-f]" ;
		$dec_octet = "(25[\x30-\x35]|2[\x30-\x34]$digit|1$digit{2}|[\x31-\x39]$digit|$digit)";
		
		$IPv4address = "$dec_octet\.$dec_octet\.$dec_octet\.$dec_octet";
		
		$h16 = "$HEXDIG{1,4}";
		$ls32 = "($h16:$h16|$IPv4address)";
				
		
		$unreserved = "($alpha|$digit|-|\.|_|~)";
		$pct_encoded = "%$HEXDIG$HEXDIG" ;
		$sub_delims = "[!\$&'\(\)\*\+,;=]";
		
		$pchar = "($unreserved|$pct_encoded|$sub_delims|:|@)";
		
		$IPv6address = "(".
							"($h16:){6}$ls32|".
							"::($h16:){5}$ls32|".
							"($h16)?::($h16:){4}$ls32|".
							"(($h16:){0,1}$h16)?::($h16:){3}$ls32|".
							"(($h16:){0,2}$h16)?::($h16:){2}$ls32|".
							"(($h16:){0,3}$h16)?::$h16:$ls32|".
							"(($h16:){0,4}$h16)?::$ls32|".
							"(($h16:){0,5}$h16)?::$h16|".
							"(($h16:){0,6}$h16)?::".
						")";
		$reg_name = "($unreserved|$pct_encoded|$sub_delims)*";
		
		$IPvFuture = "v$HEXDIG\.($unreserved|$sub_delims|:)";	
		$IP_literal = "\[($IPv6address|$IPvFuture)\]";
		
		$userinfo = "($unreserved|$pct_encoded|$sub_delims|:)*";
		$host = "($IP_literal|$IPv4address|$reg_name)";
		$port = "$digit*";
		
		$segment = "$pchar*";
		$segment_nz = "$pchar{1}";
		$segment_nz_nc = "($unreserved|$pct_encoded|$sub_delims|@){1}";
		
		
		$path_abempty = "(\/$segment)*";
		$path_absolute = "\/($segment_nz(\/$segment)*)?";
		$path_noscheme = "$segment_nz_nc(\/$segment)*";
		$path_rootless = "$segment_nz(\/$segment)*";
		
		
		$path = "($path_abempty|$path_absolute|$path_rootless|$path_noscheme)";
		$authority = "($userinfo@)?$host(:$port)?";
		
		$hier_part = "\/\/$authority($path)?";
		$www_hier_part = "$authority($path)?";
	    $scheme = "$alpha($alpha|$digit|\+|\-|\.)*";
		$query = "($pchar|\/|\?)*";
		$fragment = "($pchar|\/|\?)*";
		
		$url = "($scheme:$hier_part|www\.$www_hier_part)\/?(\?$query)?(\#$fragment)?";
		
		preg_match_all('/'.$url.'/si',$value,$matches);
		
		echo $value;
		echo "<br/>\r\n";
		echo $url;
		print_r($matches);
	}
	
	static public function URI($value)
	{
		preg_match("/(([^:\/\?#]+):)?(\/\/([^\/\?#]*))?([^\?#]*)(\?([^#]*))?(#(.*))?/si",$value,$matches);
		return slToolsPHP::htmlspecialchars($value);
	}
	
	static public function domain($value = false)
	{
		$letter = "[a-zA-Z]";
		$digit = "[0-9]";
		$let_dig = "($letter|$digit)";
		$let_dig_hyp = "($let_dig|-)";
		$ldh_str = "($let_dig_hyp*)";
		$label = "($let_dig(($ldh_str)?$let_dig)?)";
		$subdomain = "(($label\.)+$label?)";
		if($value){
			preg_match('/'.$subdomain.'/si',$value,$matches);
			return $matches;
		}else{
			return $subdomain;
		}
	}
}
?>