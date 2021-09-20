<?php

class TagsItem extends Item
{
	public $wmclass;
	public $folder;
	public $uid;

    public function __construct(&$folder)
	{
		$this->folder = &$folder;
		$this->wmclass = 'K';
	}
	
	public function edit($aItem)
	{
		return Storage::editTag($this->folder->account->gwAccount,$this->uid,$aItem['tagname'],$aItem['tagcolor']);
	}
	
	public function delete()
	{
		return Storage::deleteTag($this->folder->account->gwAccount,$this->uid);
	}
	
	public function move($folder)
	{
		
	}
	
	public function getMessage()
	{
		
	}
}

?>