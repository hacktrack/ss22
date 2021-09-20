<?php

 
class slControllerGrid extends slControllerDefault
{
	
	public function check( &$action, &$data )
	{
		parent::check( $action, $data );
		$request = slRequest::instance();
		$page_current = $request->get('all._s.page_current');
		$page_new = $request->get('all._s.page');
		if($page_current!=$page_new){
			$action = 'page';
		}
		 	}
	
	public function first($varname = 'form._s.page')
	{
		 		$request = slRequest::instance();
		$page = 1;
		$request->set($varname,$page);
		 		 		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[page]',$page);
		$result->redirectURL = $uri;
		return $result;
	}

	public function prev($varname = 'form._s.page')
	{
		 		$request = slRequest::instance();
		if(!$page = $request->get($varname)){
			$page = 1;
		}
		$page = $page - 1;
		$request->set($varname,$page);
		
		 		 		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[page]',$page);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function next($varname = 'form._s.page')
	{
		
		 		$request = slRequest::instance();
		if(!$page = $request->get($varname)){
			$page = 1;
		}
		$page = $page + 1;
		$request->set($varname,$page);
		
		 		 		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);

		$uri = $this->replaceURLVariable($uri,'_s[page]',$page);
		$result->redirectURL = $uri;
		return $result;
	}
	
	
	public function last($varname = 'form._s.page')
	{
		 		$request = slRequest::instance();
		$page = pow( 2, 30 );
		$request->set($varname,$page);
		 		 		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[page]',$page);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function page($varname = 'form._s.page')
	{
		 		$request = slRequest::instance();
		$page = $request->get($varname);
		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[page]',$page);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function sort($sortname = 'form._s.sort')
	{
		$request = slRequest::instance();
		
		$sort = $request->get($sortname);
		$order = $request->get($ordername);

		$request->set($sortname,$sort);
		$request->set($ordername,$order);
		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[sort]',$sort);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function enter_click()
	{
		$request = slRequest::instance();
		$page_current = $request->get('all._s.page_current');
		$page_new = $request->get('all._s.page');
		if($page_current!=$page_new){
			return $this->page();
		}
		return true;
	}
	
	public function first_top()
	{
		return $this->first('form._s.page_top');
	}
	public function prev_top()
	{
		return $this->prev('form._s.page_top');
	}
	public function next_top()
	{
		return $this->next('form._s.page_top');
	}
	public function last_top()
	{
		return $this->last('form._s.page_top');
	}
	public function first_bottom()
	{
		return $this->first('form._s.page_bottom');
	}
	public function prev_bottom()
	{
		return $this->prev('form._s.page_bottom');
	}
	public function next_bottom()
	{
		return $this->next('form._s.page_bottom');
	}
	public function last_bottom()
	{
		return $this->last('form._s.page_bottom');
	}
	
	public function replaceURLVariable($uri,$varName,$value,$amp = '&')
	{
		if(strpos($uri,$varName)!==false){
			$varname = quotemeta($varName);
			$uri = preg_replace(
				'/&'.$varname.'\=[^\s^\&]{0,}/i',
				$value?($amp.$varName.'='.rawurlencode($value)):'',
				$uri
			);
		}else{
			$uri.=$amp.$varName.'='.rawurlencode($value);
		}
		return $uri;
	}
	
}
?>