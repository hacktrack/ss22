<?php

 define('date19800101', 29221);
 define('dayunit', 60*60*24);
  
 

 
class slToolsDate
{
	
  static $timezone;  
    public static function gregorianToCalendarDate($date)
    {
        if(!preg_match('/^(?P<year>\\d{4}|\\d{2})(?P<month>\\d{2})(?P<day>\\d{2})/', $date, $matches)) return false;
        return GregorianToJD($matches['month'], $matches['day'], $matches['year']);
    }
  	
   
  static public function unix2calendardate($stamp)
  {
    $jd = getdate($stamp);
    $on = GregorianToJD($jd["mon"], $jd["mday"], $jd["year"]);

    return $on;
  }
  static public function unix2calendartime($stamp)
  {
    $jd = getdate($stamp);
    $at = ($jd["hours"] * 60 + $jd["minutes"])*60 + $jd["seconds"];
    return $at;
  }
  
  static public function calendar2unix($date,$time)
  {
    $stamp = jdtounix($date) + $time;
    return $stamp;
  }	
  
   
	public static function calendar2iso8601($calendardate,$calendartime,$test = false)
	{
		$g = jdtogregorian($calendardate);
		$g = explode('/',$g);
		$minutes = $calendartime;
		
		$hours = $minutes/60;
		 		
		if(strpos($hours,'.')!==false){
			$hours = (int) substr($hours,0,strpos($hours,'.'));
		}
		
		 		
		if($hours){
			$minutes = $minutes % ($hours*60);
		}
		
		$iso8601 = $g[2].''.str_pad($g[0],2,'0',STR_PAD_LEFT).''.str_pad($g[1],2,'0',STR_PAD_LEFT).'T'.
		str_pad($hours,2,'0',STR_PAD_LEFT).''.str_pad($minutes,2,'0',STR_PAD_LEFT).'00';
		
		return $iso8601;
	}
  	
	public static function iso86012calendartime($iso8601)
	{
		preg_match('/([0-9]{4})-?([0-9]{2})-?([0-9]{2})T([0-9]{2}):?([0-9]{2}):?([0-9]{2})/si',$iso8601,$matches);
		return $matches[4] * 60 + $matches[5];
	}
  	
	public static function iso86012calendardate($iso8601)
	{
		preg_match('/([0-9]{4})-?([0-9]{2})-?([0-9]{2})T([0-9]{2}):?([0-9]{2}):?([0-9]{2})/si',$iso8601,$matches);
		return GregorianToJD($matches[2], $matches[3], $matches[1]);
	}
 	 
  
  
  
  static public function fileTimeFix($gmtstamp)
  {
  	if(!self::$timezone){
  		$api = IceWarpAPI::instance();
		self::$timezone = $api->GetProperty("C_TimeZone");
  	}
  	$timechange = self::$timezone-date("O")*36;
	$stamp = $gmtstamp + $timechange;
	return $stamp;
  }
  
  static public function dbTimeFix($stamp)
  {
  	if(!self::$timezone){
  		$api = IceWarpAPI::instance();
		self::$timezone = $api->GetProperty("C_TimeZone");
  	}
  	$timechange = (date("O")!=0)?(self::$timezone):0;
	return $stamp - $timechange;
  }
  
   
  static public function my_date($format = 'd/m/Y H:i',$unixTime = false)
  {
  	if($unixTime===false){
  		$iw_date = icewarp_rfc822_date();
  	}else{
  		$iw_date = icewarp_rfc822_date($unixTime);
  	}  	
  	$matches = slToolsDate::parse_rfc822_date($iw_date);
  	$namedArray = array(
  	   		'd'=>3,
  		'D'=>2,
  		'j'=>3,
  		'l'=>2,
  		'N'=>2,
  		'S'=>3,
  		'w'=>2,
  		'z'=>-1,
  	   		'W'=>-1,
  	   		'F'=>4,
  		'm'=>4,
  		'M'=>4,
  		'n'=>4,
  		't'=>4,
  	   		'L'=>5,
  		'o'=>5,
  		'Y'=>5,
  		'y'=>5,
  	   		'a'=>6,
  		'A'=>6,
  		'B'=>-1,
  		'g'=>6,
  		'G'=>6,
  		'h'=>6,
  		'H'=>6,
  		'i'=>7,
  		's'=>9,
  		'u'=>-1,
  	   		'e'=>10,
  		'I'=>10,
  		'O'=>10,
  		'P'=>10,
  		'T'=>10,
  		'Z'=>10,
  	   		'c'=>0,
  		'r'=>0,
  		'U'=>0
  	);
  	$knownCommands = '(d|D|j|l|N|S|w|z|W|F|m|M|n|t|L|o|Y|y|a|A|B|g|G|h|H|i|s|u|e|I|O|P|T|Z|c|r|U|#)';
  	$format = preg_replace('/((?<!\\\\)'.$knownCommands.')/s','#$2',$format);

  	foreach($namedArray as $variable=>$index){
  		$value = $matches[$namedArray[$variable]];
  		$value = self::processToken($variable, $value);
  		$format = str_replace('#'.$variable,$value,$format);
  	}
  	$format = str_replace('##','#',$format);
  	
  	$format = preg_replace('/(\\\\)'.$knownCommands.'/s','$2',$format);
  	return $format;
  }
  
  static private function processToken($token,$value)
  {
  	 $dayName = array(
  		'Mon'=>'Monday',
  		'Tue'=>'Tuesday',
  		'Wed'=>'Wednesday',
  		'Thu'=>'Thursday',
  		'Fri'=>'Friday',
  		'Sat'=>'Saturday',
  		'Sun'=>'Sunday'
  	);
  	$iso8601dayOfWeek = array(
  		'Mon'=>1,
  		'Tue'=>2,
  		'Wed'=>3,
  		'Thu'=>4,
  		'Fri'=>5,
  		'Sat'=>6,
  		'Sun'=>7
  	);
  	$dayOfWeek = array(
  		'Mon'=>1,
  		'Tue'=>2,
  		'Wed'=>3,
  		'Thu'=>4,
  		'Fri'=>5,
  		'Sat'=>6,
  		'Sun'=>0
  	);
  	$monthOfYear = array(
  		'Jan'=>1,
  		'Feb'=>2,
  		'Mar'=>3,
  		'Apr'=>4,
  		'May'=>5,
  		'Jun'=>6,
  		'Jul'=>7,
  		'Aug'=>8,
  		'Sep'=>9,
  		'Oct'=>10,
  		'Nov'=>11,
  		'Dec'=>12
  	);
  	$monthName = array(
  		'Jan'=>'January',
  		'Feb'=>'February',
  		'Mar'=>'March',
  		'Apr'=>'April',
  		'May'=>'May',
  		'Jun'=>'June',
  		'Jul'=>'July',
  		'Aug'=>'August',
  		'Sep'=>'September',
  		'Oct'=>'October',
  		'Nov'=>'November',
  		'Dec'=>'December'
  	);
  	
    switch($token)
  	{
  		case 'j':
  			$value = ltrim($value,'0');
  			break;
  		case 'l':
  			$value = $dayName[$value];
  			break;
  		case 'N':
  			$value = $iso8601dayOfWeek[$value];
  			break;
  		case 'S':
  			$value = ltrim($value,'0');
  			$value = slToolsDate::getOrdinalSuffix($value);
  			break;
  		case 'w':
  			$value = $dayOfWeek[$value]-1;
  			break;
  		case 'F':
  			$value = $monthName[$value];
  			break;
  		case 'm':
  			$value = str_pad($monthOfYear[$value],2,'0',STR_PAD_LEFT);
  			break;
  		case 'n':
  			$value = $monthOfYear[$value];
  			break;
  		case 'y':
  			$value = substr($value,2);
  			break;
  		case 'a':
  			$value = slToolsDate::getAnteMeridiem($value);
  			break;
  		case 'A':
  			$value = slToolsDate::getAnteMeridiem($value,true);
  			break;  			
  		case 'g':
  			$value = slToolsDate::get12Hour($value);
  			break;  			
  		case 'G':
  			$value = slToolsDate::get24Hour($value);
  			break;  			
  		case 'h':
  			$value = slToolsDate::get12Hour($value,true);
  			break;  			
  		case 'H':
  			$value = slToolsDate::get24Hour($value,true);
  			break;  
  						
  		case 'Z':
  			$sign = substr($value,0,1);
  			$hours = substr($value,1,2);
  			$minutes = substr($value,3,2);
  			$value = ($sign == '-' ? $sign : '') . ($hours * 3600 + $minutes * 60);
  			break;
  		case 'P':
  			$sign = substr($value,0,1);
  			$hours = substr($value,1,2);
  			$minutes = substr($value,3,2);
  			$value = $sign . $hours . ':' . $minutes;
  			break;
  		default:
  			break;
  	}
  	return $value;
  }
  
  static public function get12Hour($hour,$leadZero = false)
  {
  	$hour = intval($hour);
  	if($hour > 12){
  		$hour = $hour - 12;
  	}
  	if($leadZero){
  		$hour = str_pad($hour,2,'0',STR_PAD_LEFT);
  	}
  	return $hour;
  }
  static public function get24Hour($hour,$leadZero = false)
  {
  	$hour = intval($hour);
  	if($leadZero){
  		$hour = str_pad($hour,2,'0',STR_PAD_LEFT);
  	}
  	return $hour;
  } 
  
  static public function getAnteMeridiem($hour,$toUpperCase = false)
  {
  	$hour = intval($hour);
  	if($hour <=12){
  		$m = 'am';
  	}else{
  		$m = 'pm';
  	}
  	if($toUpperCase){
  		$m = strtoupper($m);
  	}
  	return $m;
  }
  
  static public function getOrdinalSuffix($dayNum)
  {
  	switch($dayNum)
  	{
  		case 1:
  		case 21:
  		case 31:
  			$result = 'st';
  			break;
  		case 2:
  		case 22:
  			$result = 'nd';
  			break;
  		case 3:
  		case 23:
  			$result = 'rd';
  			break;
  		default:
  			$result = 'th';
  		break;
  	}
  }
  
  static public function parse_rfc822_date($rfc822Date)
  {
    $day = "(Mon|Tue|Wed|Thu|Fri|Sat|Sun)";
  	$month = "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";
  	$date = "([0-9]{1,2})\s$month\s([0-9]{2,4})";
 	
  	$hour = "([0-9]{2}):([0-9]{2})(:([0-9]{2}))?";
  	$zone = "(UT|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT|[a-zA-Z]{1}|((\+|\-)([0-9]{4})))";

  	$time = "$hour\s$zone";
  	
  	$date_time = "($day,\s)?$date\s$time"; 
  	
  	preg_match("/".$date_time."/si",$rfc822Date,$matches);
  	return $matches;
  }
  
  static public function ClassicToPHPFormat($format)
  {
  	$format = str_ireplace('yyyy', 'Y', $format);
  	$format = str_ireplace('yyyy', 'y', $format);
  	$format = str_ireplace('mm', 'm', $format);
  	$format = str_ireplace('dd', 'd', $format);
  	return $format;
  }



    public static function convertdelphidatetotime($time)
  {
    $fdate = mktime(0,0,0,1,1,1980);
    $ftime = $time - date19800101;
    return $fdate + (dayunit * $ftime);
  }

    public static function converttimetodelphi($time)
  {
    $fdate = ($time - mktime(0,0,0,1,1,1980)) / dayunit;
    return date19800101 + $fdate;
  }

   public static function addnull($num)
   {
   	return ($num>=10)?($num):('0'.$num);
   }

   public static function timetostr($sec)
  {
	 $s =  $sec%60;
	 $m =  (($sec-$s)/60)<60?($sec-$s)/60:(($sec-$s)/60)%60;
	 $h =  (($sec-$s-$m*60)/3600)<24?($sec-$s-$m*60)/3600:(($sec-$s-$m*60)/3600)%24;
	 $d =  (($sec-$s-$m*60-$h*3600)/dayunit)<30?($sec-$s-$m*60-$h*3600)/dayunit:(($sec-$s-$m*60-$h*3600)/dayunit)%dayunit;
	 $ret = self::addnull($d).':'.self::addnull($h).':'.self::addnull($m).':'.self::addnull($s);
  	 return $ret;
  }

  public static function strtodate($str)
  {
    if (!$str) return 0;
    preg_match('/([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})/si', $str, $regs);
    $year = $regs[1];
    $month = $regs[2];
    $day = $regs[3];
    
    $time = mktime(0,0,0,$month,$day,$year);
    return intval(round(self::converttimetodelphi($time)));
  }

    public static function datetostr($date,$format = "Y/m/d")
  {
    if ($date<=0) return "";
    $time = self::convertdelphidatetotime($date);
    $value = date($format, $time);
    return $value;
  }

}

?>