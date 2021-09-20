<?php

 
class slControllerGrid extends slControllerDefault
{
	
	public function check( &$action, &$data )
	{
		parent::check( $action, $data );
		 	}
	
	public function first($varname = 'form._s.page')
	{
		$result = new stdClass();
		 		$request = slRequest::instance();
		$page = 1;
		$request->set($varname,$page);
		 		 		 		$result->redirect = true;
		$uri = $request->getURI(false);
		if(strpos($uri,'_s[page]')!==false){
			$uri = preg_replace('/_s\[page\]\=[0-9]+/i','_s[page]='.$page,$uri);
		}else{
			$uri.='&_s[page]='.$page;
		}
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}

	public function prev($varname = 'form._s.page', $count = 1)
	{
		$result = new stdClass();
		 		$request = slRequest::instance();
		if(!$page = $request->get($varname)){
			$page = 1;
		}
		$page = $page - $count;
		if($page < 1) {
			$page = 1;
		}
		$request->set($varname,$page);
		
		 		 		 		$result->redirect = true;
		$uri = $request->getURI(false);
		if(strpos($uri,'_s[page]')!==false){
			$uri = preg_replace('/_s\[page\]\=[0-9]+/i','_s[page]='.$page,$uri);
		}else{
			$uri.='&_s[page]='.$page;
		}
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function next($varname = 'form._s.page', $count = 1)
	{
		$result = new stdClass();
		 		$request = slRequest::instance();
		if(!$page = $request->get($varname)){
			$page = 1;
		}
		$page = $page + $count;
		$request->set($varname,$page);
		
		 		 		 		$result->redirect = true;
		$uri = $request->getURI(false);
		if(strpos($uri,'_s[page]')!==false){
			$uri = preg_replace('/_s\[page\]\=[0-9]+/i','_s[page]='.$page,$uri);
		}else{
			$uri.='&_s[page]='.$page;
		}
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
	
	
	public function last($varname = 'form._s.page')
	{
		$result = new stdClass();
		 		$request = slRequest::instance();
		$page = pow( 2, 30 );
		$request->set($varname,$page);
		 		 		 		$result->redirect = true;
		$uri = $request->getURI(false);
		if(strpos($uri,'_s[page]')!==false){
			$uri = preg_replace('/_s\[page\]\=[0-9]+/i','_s[page]='.$page,$uri);
		}else{
			$uri.='&_s[page]='.$page;
		}
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
		
	public function search()
	{
		$request = slRequest::instance();
		$search = $request->get('form.search');
		$result = new stdClass();
		$result->redirect = true;
		
		$uri = $request->getURI(false);
		 
		$uri = $this->getResultLink(
			array(
				'id'=>$request->get('all.container'),
				'type'=>$request->get('all.type')
			),
			$search,
			1
		);
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function sort($sortname = 'form._s.sort')
	{
		$request = slRequest::instance();
		
		$sort = $request->get($sortname);

		$request->set($sortname,$sort);
		 		$result = new stdClass();
		$result->redirect = true;
		$uri = $request->getURI(false);
		$uri = $this->replaceURLVariable($uri,'_s[sort]',$sort);
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
		$uri = $this->removeErrorAndMessage($uri);
		$result->redirectURL = $uri;
		return $result;
	}
	
	public function page_both()
	{
		$request = slRequest::instance();
		$default = $request->get('form._s.default_page');
		$top = $request->get('form._s.page_top');
		$bottom = $request->get('form._s.page_bottom');
		$page='form._s.default_page';
		if ($top!=$default) {$page='form._s.page_top';}
		if ($bottom!=$default) {$page='form._s.page_bottom';}
		return $this->page($page);
	}
	
	public function page_top()
	{
		return $this->page('form._s.page_top');
	}
	
	public function page_bottom()
	{
		return $this->page('form._s.page_bottom');
	}
	
	public function first_top()
	{
		 		return $this->first('form._s.default_page');
	}
	public function prev_top()
	{
		 		return $this->prev('form._s.default_page');
	}
	public function next_five()
	{
		return $this->next('form._s.default_page', 5);
	}
	public function prev_five()
	{
		return $this->prev('form._s.default_page', 5);
	}
	public function next_top()
	{
		 		 		 		return $this->next('form._s.default_page');
	}
	public function last_top()
	{
		 		return $this->last('form._s.default_page');
	}
	public function first_bottom()
	{
		 		return $this->first('form._s.default_page');
	}
	public function prev_bottom()
	{
		 		return $this->prev('form._s.default_page');
	}
	public function next_bottom()
	{
		 		return $this->next('form._s.default_page');
	}
	public function last_bottom()
	{
		 		return $this->last('form._s.default_page');
	}
	public function replaceURLVariable($uri,$varName,$value)
	{
		if(strpos($uri,$varName)!==false){
			$varname = quotemeta($varName);
			$uri = preg_replace(
				'/&'.$varname.'\=[^\s^\&]{0,}/i',
				$value?('&'.$varName.'='.rawurlencode($value)):'',
				$uri
			);
		}else{
			$uri.='&'.$varName.'='.rawurlencode($value);
		}
		return $uri;
	}
	
	static public function getResultLink($selector,$search = false,$page = false, $sort =false,$view = false,$email = false,$dlg = false)
	{
		$router = slRouter::instance();
		$request = slRequest::instance();
		$folder['helper'] = 'folder';
		$folderHelper =slHelperFactory::instance($folder);
		$folderInfo = $folderHelper->getInfo($selector['type'],$selector['id']);
		$view = $request->get('all._n.p.content');
		
		if(!$view || strpos($view,'detail')!==false || strpos($view,'view')!==false){
			$view = $folderInfo['page'];
		}
		if($view == 'contact.distribution'){
			$view = 'contact.select';
		}
		$params = array(
			'window'=>'main',
			'target'=>'content',
			'view'=>$view,
			'data'=>'item.fdr',
			'id'=>$selector['id'],
			'type'=>$selector['type']
		);

		$link = $router->getCompressedLink('folder',$params);
		$link = $request->getPath().str_replace('&amp;','&',$link);
		if($selector['type']=='E'){
			$link = self::replaceURLVariable($link,'view','event.list');
		}
		if($sort!=false){
			$link = self::replaceURLVariable($link,'_s[sort]',$sort);
		}else{
			if(($sort = $request->get('get._s.sort'))!=false){
				$link = self::replaceURLVariable($link,'_s[sort]',$sort);
			}
		}
		if($search!==false){
			$link = self::replaceURLVariable($link,'_s[search]',$search);
		}else{
			if($search = $request->get('get._s.search')){
				
				$link = self::replaceURLVariable($link,'_s[search]',$search);
			}
		}
		if($page!=false){
			$link = self::replaceURLVariable($link,'_s[page]',$page);
		}else{
			if(($page = $request->get('get._s.page'))!=false){
				$link = self::replaceURLVariable($link,'_s[page]',$page);
			}
		}
		if($email!=false){
			$link = self::replaceURLVariable($link,'email',$email);
		}else{
			if(($email = $request->get('get.email'))!=false){
				$link = self::replaceURLVariable($link,'email',$email);
			}
		}
		if($dlg!=false){
			$link = self::replaceURLVariable($link,'_dlg',$dlg);
		}else{
			if(($dlg = $request->get('all._dlg'))!=false){
				$link = self::replaceURLVariable($link,'_dlg',$dlg);
			}
		}
		if(($did = $request->get('all._s.distrib_id'))!=false){
			$link = self::replaceURLVariable($link,'_s[distrib_id]',$did);
		}
		return $link;
	}
	
	static public function removeErrorAndMessage($link)
	{
		$request = slRequest::instance();
		if($request->get('get.mid')){
			$link = self::replaceURLVariable($link,'mid','');
		}
		
		if($request->get('get.eid')){
			$link = self::replaceURLVariable($link,'eid','');
		}
		return $link;
	}
}
?>
