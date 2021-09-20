<?php


class slHelperYears extends slHelper
{
	public function check()
	{
		$gui = slGUI::instance();
		$y=date('Y');
		for ($i=-10; $i<=10; $i++)
		{
			$a[]=array('y'=>($y+$i),'s'=>($y==($y+$i)?true:false));
		}
		$data['ty']=$y;
		$data['years']=$a;
		echo "aaa";
		$gui->setTemplateData($data);
		return true;
	}
}
?>