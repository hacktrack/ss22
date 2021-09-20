<?php

abstract class iAPIInterface
{
	var $base;
	protected static $instance;
	protected $apiID;
	protected $exc_id;
	protected $function;


	function _createBase()
	{
		
		try{
			$funcname = $this->function;
			$this->base = $funcname(0, '', $this->apiID);
			
		}catch (CIWPipeException $pipeException){
			 			print_r($pipeException);die();
		}catch (CIWPipeTimeoutException $timeoutException){
			 			throw new Exc($this->exc_id . '_timeout', $timeoutException->getMessage());
		}
		catch (Exception $e){
			print_r($e);die();
		}
	}
	function __destruct()
	{
		try{
			$funcname = $this->function;
			$funcname($this->base);
		}catch (CIWPipeException $pipeException){
			 		}catch (CIWPipeTimeoutException $timeoutException) {
			 			throw new Exc($this->exc_id . '_timeout', $timeoutException->getMessage());
		}catch (Exception $e){

		}
	}
	 	function FunctionCall($funcname, $param1 = "", $param2 = "", $param3 = "", $param4 ="", $param5 ="")
	{
		try{
			$func = $this->function;
			$result = $func($this->base, $funcname, $param1, $param2, $param3,$param4,$param5);
		}catch (CIWPipeException $pipeException){
			 		}
		catch (CIWPipeTimeoutException $timeoutException){
			 			throw new Exc($this->exc_id .'_timeout', $timeoutException->getMessage());
		}catch (Exception $e){

		}
		return $result;
	}
	 	public function __call( $funcName, $params )
	{
		$func = $this->function;
		return $func(
				$this->base,
				$funcName,
				isset( $params[0] ) ? $params[0] : null,
				isset( $params[1] ) ? $params[1] : null,
				isset( $params[2] ) ? $params[2] : null,
				isset( $params[3] ) ? $params[3] : null,
				isset( $params[4] ) ? $params[4] : null
		);
	}

}
