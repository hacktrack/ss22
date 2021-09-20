<?php

class slToolsDebug
{
	static $logLevel = LOG_LEVEL;
	static $file = 'c:\\debug.txt';
	static $register = array();
	
	static public function message($message)
	{
		if(self::$logLevel){
			echo $message;
		}
	}
	
	static public function print_r($variable,$message = false)
	{
		if(self::$logLevel){
			if($message){
				echo $message;
			}
			echo '<pre>';
			print_r($variable);
			echo '</pre>';
		}
	}
	static public function log($message)
	{
		$fp = fopen(self::$file,'a+');
		$time = microtime();
		fwrite($fp,date("Y/m/d H:i:s").substr($time,1,strpos($time,' '))." ".$message."\r\n===============================================\r\n");
		fclose($fp);
	}
	
	static public function debug($message = 0,$out = 0)
	{
		global $debug_uid,$debug_register;
		
		$trace = debug_backtrace();
		if(!$message){
            $val = '';
			if( (LOG_LEVEL & LOG_ARGUMENTS > 0)  && is_array($trace[1]['args'])){
				foreach($trace[1]['args'] as $key => $val){
					if(is_object($val)){
						$args[] = get_class($val);
					}else{
						$args[] = (string) $val;
					}
				}
				$args = implode(',',$args);
			}else{
				if(is_object($val)){
					$args = get_class($val);
				}else{
					$args = (string) $val;
				}
			}
			$message = $trace[1]['class'].'::'.$trace[1]['function'].'('.$args.')';
		}
		$t['t'] = time();
		$t['m'] = microtime();
		if(!$debug_register[$message]){
			$debug_register[$message] = array();
		}
		array_push($debug_register[$message],$t);
		$duration = '';
		if($out){
			$last = array_pop($debug_register[$message]);
			if($last){
				$duration = ' Duration:'.round(time()-$last['t']+microtime()-$last['m'],5);
			}
		}
		$pad = str_pad('',count($trace),' ');
		file_put_contents(
			self::$file,
			$pad.
				"[".$debug_uid."]Time:".
				date("Y-m-d H:i:s",time()).
				substr(microtime(),1,6).
				($out?' <<< ':' >>> ').$message.$duration."\r\n",
			FILE_APPEND
		);
	}
}

class slToolsDebugTicker
{
	private $script_statistics;
	private $start_time;
	private $start_microtime;
	private $operation_time;
	private $operation_microtime;
	private $ticks;
	private $hash;
	private $id;
	 
    public $log_file;
	 
    public $duration;

	public function __construct()
	{
		$this->log_file = 'c:\\log.txt';
	}
	
	public function track_stats(){
		
		$trace = debug_backtrace();
		$exe_time = ((time()- $this->start_time) + (microtime() - $this->start_microtime));
		
		$func_args = array();
		if(is_array($trace[1]['args'])) foreach($trace[1]['args'] as $arg){
			if(is_object($arg)){
				$func_args[]= '(object('.get_class($arg).'))';
			}else
			if(is_array($arg)){
				$func_args[]= '(array('.count($arg).'))';
			}else if (is_string($arg)){
				$func_args[]= '(string('.strlen($arg).')):'.substr($arg,0,100);
			}else if(is_int($arg)){
				$func_args[]= '(int):'.$arg;
			}
		}
		$func_args = join(',',$func_args);
		$func_args = $func_args?('('.$func_args.')'):$func_args;
		$hash = md5($trace[1]["function"].$trace[1]["file"].$trace[1]["line"].$func_args);
		if(!isset($this->id)){
			$this->hash = $hash;
			$this->operation_time = time();
			$this->operation_microtime = microtime();
			$this->duration = $exe_time;
			$this->id = md5(uniqid().time().microtime());
		}else{
			$this->duration = (time()-$this->operation_time)+(microtime()-$this->operation_microtime);
		}

		if(isset($trace[2])){
			$called_by = ($trace[2]['class']?($trace[2]['class'].'::'):'').
				($trace[2]['function']?($trace[2]['function']):'').
				' in '.$trace[2]["file"].': '.$trace[2]["line"];
		}else{
			$called_by = '';
		}
		
		$this->script_statistics[$this->id] = array(
			"current_time" =>(time()+microtime()),
			"memory" => memory_get_usage(true),
			"file" => $trace[1]["file"].': '.$trace[1]["line"],
			"function" => ($trace[1]['class']?($trace[1]['class'].'::'):'').$trace[1]["function"].$func_args,
			"called_by" => $called_by,
			"exe_time" => $exe_time,
			"duration"=>$this->duration
		);
		if($this->hash != $hash){
			unset($this->id);
		}
	}
	
	public function start()
	{
		if(!isset($this->ticks)){
			$this->ticks = 1;
		}
		$this->start_time = time();
		$this->start_microtime = microtime();
		declare(ticks = 2);register_tick_function(array(&$this, 'track_stats'), true);
	}
	
	public function doLog()
	{
		 
		file_put_contents(
			$this->log_file,
			print_r($this->script_statistics,true).
			"\r\n".
			'===================================================='.
			"\r\n",
			FILE_APPEND
		);
	}
	
	public function setTicks(int $ticks)
	{
		$this->ticks = $ticks;
	}
	
	public function getTicks()
	{
		return $this->ticks;
	}
	
	public function setLogFile(string $log_file)
	{
		$this->log_file  = $log_file;
	}
	
	public function getLogFile()
	{
		return $this->getLogFile();
	}
}

?>