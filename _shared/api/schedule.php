<?php

class IceWarpSchedule extends iAPIInterface
{
	var $base, $lastcount, $Count;

	function __construct($basevalue = 0)
	{
		$this->apiID = 'IceWarpServer.ScheduleObject';
		$this->exc_id = '_api_account';
		$this->function = 'icewarp_apiobjectcall_persistent';
		$this->lastcount = 0;
		if (!$basevalue)
			$this->_createBase();
		else
			$this->base = $basevalue;
	}


	function GetProperty($property)
	{
		$this->UpdateCount(false);
		return $this->FunctionCall( 'GetProperty', $property);
	}

	function SetProperty($property, $value)
	{
		$this->UpdateCount(false);
		$result = $this->FunctionCall( 'SetProperty', $property, $value);
		if (strcasecmp($property, 's_backup') == 0)
			$this->UpdateCount();
		return $result;
	}

	function Add()
	{
		$result = $this->FunctionCall( 'Add');
		$this->UpdateCount();
		return $result;
	}

	function Delete($index)
	{
		$result = $this->FunctionCall( 'Delete', $index);
		$this->UpdateCount();
		return $result;
	}

	function Select($index)
	{
		$result = $this->FunctionCall( 'Select', $index);
		$this->UpdateCount();
		return $result;
	}

	function UpdateCount($get = true)
	{
		if ($get)
			$this->Count = $this->FunctionCall( 'GetCount');
		else
			if ($this->lastcount <> $this->Count)
				$this->FunctionCall( 'SetCount', $this->Count);
		$this->lastcount = $this->Count;
	}
}

 class MerakSchedule extends IceWarpSchedule
{
}

?>