<?php

 
class slObserver  
{
	public $state;
	
	public function update(slObservable &$observable)
	{
		$this->state = $observable->getState();
	}
}


class slObservable  
{
	public $aObservers;
	public $state;
	
	public function setState($state)
	{
		if($state!==$this->getState()){
			$this->state = $state;
			$this->notify();
		}
	}
	
	public function getState()
	{
		return $this->state;
	}
	
	public function attach(slObserver &$observer)
	{
		$this->aObservers[] = &$observer;
	}
	
	public function detach(slObserver &$observer)
	{
		foreach($this->aObservers as $key => $observed){
			if($observed===$observer){
				unset($this->aObservers[$key]);
			}
		}
	}
	
	public function notify()
	{
		if(is_array($this->aObservers) && !empty($this->aObservers)){
			foreach($this->aObservers as $key =>$observed){
				$observed->update($this);
			}
		}
	}
}

?>