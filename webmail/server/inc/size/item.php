<?php

class SizeItem
{
	public $item;
	public $itemID;
	public $display;
	public $size;
	public $responsibleUsers;
	public $responsibleUsersList;
	public $wmclass;

    public function __construct($folder, $item)
	{
		$this->item = $item;
		$this->itemID = $item['FDR_ID'];
		$this->display = $item['FDRDISPLAY'];
		$this->size = $item['FDRSIZE'];
        $this->responsibleUsers = $item['FDRRESPONSIBLE'];
        $this->responsibleUsersList = MailParse::parseAddresses($item['FDRRESPONSIBLE']);
		$this->wmclass = 'A';
	}
	public function delete()
	{
		return false;
	}
	
	public function move($oFolder)
	{
		return false;
	}
	
	public function getMessage()
	{
		return false;
	}
}
?>