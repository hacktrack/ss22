<?php
if (isset($_GET['clean']))
{
	$d=opendir('packages');
	while($f=readdir($d))
	{
		if($f!='..' && $f!='.')
		{
			@unlink('packages/'.$f);
		}
	}
}

if (isset($_GET['style'])) 
{
	$_GET['style']=str_replace('../basic/','*B_PREF*',$_GET['style']);
	$_GET['style']=str_replace('../../','',$_GET['style']);
	$_GET['style']=str_replace('*B_PREF*','../basic/',$_GET['style']);
}
if (isset($_GET['script'])) 
{
	$_GET['script']=str_replace('../basic/','*B_PREF*',$_GET['script']);
	$_GET['script']=str_replace('../../','',$_GET['script']);
	$_GET['script']=str_replace('*B_PREF*','../basic/',$_GET['script']);
}


include('minimizer.class.php');
minimizer::debug();

minimizer::prefix('../');
minimizer::check('script');
minimizer::check('style');
echo minimizer::get('script');
echo minimizer::get('style');
?>