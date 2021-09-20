<?php

class slControllerMailview extends slControllerDefault
{
	public function check( &$action, &$data)
	{
		parent::check( $action, $data );
		switch($action){
			case 'delete':
				slSystem::import('controller/item',APP_PATH);
				$this->controller = new slControllerItem( $this->appplication );
				$this->controller->check($action,$data);
			break;
		}
	}
	public function delete()
	{
		$request = slRequest::instance();
		return $this->controller->delete();
		 
	}
}


?>