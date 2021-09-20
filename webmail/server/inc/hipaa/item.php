<?php
class HipaaItem
{
	public $item;
	public $category;
	public $itemID;

    public function __construct($folder, $itemID, $data, $category = 'patients')
	{
		$this->folder = &$folder;  		$this->itemID = $itemID;   		$this->item = $data;	   		
		if((isset($data['category']) && $data['category']=='staff') || $category=='staff'){
			$this->category = 'staff';
		}else{
			$this->category = 'patients';  		}
	}
	
	
	 
	public static function create($folder,$item = array())
	{
		$parameters = $item;
		$type = $parameters['type'];
		if(!$type){
			throw new Exc('item_missing_tag','type');
		}
		if(!$parameters['username']){
			$email = self::generateUsername($parameters['name']).'@'.$_SESSION['DOMAIN'];
		}else{
			$email = $parameters['username'].'@'.$_SESSION['DOMAIN'];
		}
		switch(strtolower($type)){
			case 'hipaa':
				return Hipaa::createItem($email,$parameters);
			break;
		}
	}
	
	public function delete()
	{
		return Hipaa::deleteItem($this->itemID, $this->category);
	}
	
	public function edit($parameters)
	{
		return Hipaa::editItem($this->itemID,$parameters);
	}
	
	public static function generateUsername($fullname)
	{
		$names = explode(" ", $fullname);
		$name = substr($names[0],0,1).substr($names[1],0,3).uniqid();
		return $name;
	}
}