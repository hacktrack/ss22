<?php

class slModel
{
	protected function __construct( &$databaseAdapter )
	{
		$this->databaseAdapter = &$databaseAdapter;
	}
	
}