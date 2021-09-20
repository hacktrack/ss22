<?php

class slControllerTest extends slControllerDefault
{
	public function index($page = false,$template = false,$dialog_error = false)
	{
		echo "index";
	}
	
	public function cokoli()
	{
		ob_start('ob_gzhandler');
		echo "cokoli";
		ob_end_flush();
		usleep( 3000000 );
		die();
		header("Location: index.html");
	}
}

?>