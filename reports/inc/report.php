<?php

require_once('cache.php');

class Report extends ChallengeCacheTable
{
	static public function instance( &$cache )
	{
		return parent::instance( 'Report', 'report', $cache );
	}
	
	public function getWrapperClassName()
	{
		return 'ReportItem';
	}

}

?>