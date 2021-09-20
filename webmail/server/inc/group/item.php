<?php

class GroupItem extends Item
{
	public $item;
	public $itemID;
	public $name;
	public $email;
	public $rights;
	public $isGuest;
	public $isAdmin;
	public $wmclass;

    public function __construct($folder, $item)
	{
		$this->item = $item;
		$this->itemID = $item['FRTEMAIL'];
		$this->name = $item['FRTNAME'];
		$this->email = $item['FRTEMAIL'];
		$this->rights = GroupWareFolder::decodeRights($item['FRTRIGHTS']);
		$this->isGuest = $item['FRTISGUEST'];
		$this->isAdmin = $item['FRTISADMIN'];
		$this->wmclass = 'Z';
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