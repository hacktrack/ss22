<?php

 
abstract class ChallengeBehaviour
{
	private $iterateAccounts = true; 

	 
	abstract public function onStart();

	 
	abstract public function onDomain( &$domain );


	 
	abstract public function onAccount( &$domain, &$account );

	 
	abstract public function onStop();
}

?>