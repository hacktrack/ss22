<?php
slSystem::import('tools/php');
class slHelperItem extends slHelper {
	private $DTF=array();
	
	public function bytesToSize($bytes) {
		$sizes = array(' B', ' KB', ' MB', ' GB', ' TB');
		if ($bytes==0) return '0 B';
		$i = floor(log($bytes)/log(1024));
		return round($bytes / pow(1024, $i),2).$sizes[$i];
	}
	
	public function getDTFormats()
	{
		if (empty($this->DTF))
		{
			$helper['helper'] = 'settings';
			$helperObject = slHelperFactory::instance($helper);
			$mail_settings_default=$helperObject->getPrivate('mail_settings_default');
			$mail_settings_default= $mail_settings_default['@childnodes']['item'][0]['@childnodes'];
			
			if(isset($mail_settings_default['date_format']))
			{
				$date_format = $mail_settings_default['date_format'][0]['@value'];
			}
			else
			{
				$date_format = 'dd/mm/yyyy';
			}
			
			if(isset($mail_settings_default['time_format']))
			{
				$time_format = $mail_settings_default['time_format'][0]['@value'];
			}
			else
			{
				$time_format = 0;
			}
			
			$this->DTF['date']=$date_format;
			$this->DTF['time']=$time_format;
		}
		else
		{
			$date_format=$this->DTF['date'];
			$time_format=$this->DTF['time'];
		}
		return array('date'=>$this->convertDateFormat($date_format),'time'=>$time_format);
	}
	
	public function convertDateFormat($format)
	{
		if (is_numeric($format))
		{
			$types=array('mm/dd/yy','mm/dd/yyyy','dd-mm-yy','dd-mm-yyyy','dd/mm/yy','dd/mm/yyyy','yyyy-mm-dd','dd.mm.yy','dd.mm.yyyy');
			$format=$types[$format];
		}
		
		$pre=array('dd','mm','yyyy','yy');
		$post=array('d','m','Y','y');
		return str_replace($pre,$post,$format);
	}
	
	public function convertTimeFormat($definition,$format=0)
	{
		$pre=array('H');
		$post=array('h');
		
		if ($format==0)
		{
			return str_replace($pre,$post,$definition.'a');
		}
		else
		{
			return str_replace($post,$pre,$definition);
		}
	}
	
	public function getContainer( $param, &$info )
	{
		$this->getData( $param );
		$folder = $this->data['id'];
		if(!$this->data['id']){
			$folder = 'INBOX';
		}
		$oAccount = User::getCurrentUser()->getAccount($_SESSION['EMAIL']);
		try {
			$oFolder = $oAccount->getFolder($folder);
		}catch (Exception $e){
			if($folder == 'INBOX' && $e->WMCode == 'folder_does_not_exist'){
				$oAccount->sync();
				$oAccount->syncFolders();
				$oFolder = $oAccount->getFolder($folder);
			}
		}
		$delayedResult = true;
		if($oAccount->isDelayed()){
			$delayedResult = $oAccount->syncDelayedFolders();
		}
		 		if ( !$oFolder->gw && !$oFolder->sync && !$oAccount->aSyncedFolders[$oFolder->folderID]) {
			$oAccount->aSyncedFolders[$oFolder->folderID] = true;
			if ($oFolder && $delayedResult) {
				$oFolder->sync();
			}
		}
		$info['id'] = $oFolder->name;
		$info['type'] = $oFolder->type;
		$info['item'] = $this->data['item'];
		return $oFolder;
	}
	
	public function getFilter( &$container, &$param, &$info )
	{
		if(!$this->data['interval']){
			$request = slRequest::instance();
			$view = $request->get('all._n.p.main');
			switch($view){
				case 'grid.contact':
				case 'grid.contact.select':
					 					if($this->data['filter']){
						$this->data['filter'] .= " AND (ITMCLASS <> 'L')";
					}else{
						$this->data['filter'] = "ITMCLASS <> 'L'";
					}
				break;
				case 'grid.event':
					$template = $request->get('all.view');
					switch($template){
						default:
						case 'grid.event.day':
						case 'grid.event.workweek':
						case 'grid.event.week':
						case 'grid.event.month':
							$info = self::getWeek();
							if($template){
								$templateView = substr($template,strrpos($template,'.'));
							}else{
								$templateView = '';
							}
							switch($templateView){
								case 'month':
									$start = $info['this_month']['start'];
									$end = $info['this_month']['end'];
								break;
								case 'day':
									$start = $info['this_day']['start'];
									$end = $info['this_day']['end'];
								break;
								case 'workweek':
								case 'week':
								default:
									$start = $info['this_week']['start'];
									$end = $info['this_week']['end'];
								break;
							}
							$this->data['interval']['start'] = $start;
							$this->data['interval']['end'] = $end;
						break;
						case 'grid.event.list':
						break;
					}
				break;
			}
		}
		$type = $container->type=='V'?$container->contentType:$container->type;
		switch($type){
			case 'C':
			
				 
				if($this->data['sort']){
					$this->data['orderby'] = $this->data['sort'];
				}
			break;
			default:
			
				if($this->data['sort']){
					$this->data['orderby'] = $this->data['sort'];
				}
			break;
		}
		$itemsCount = $container->countItems( 0, true, $this->data['filter'] );
		$filter['tag'] = $param['columns'];
		 		if($this->data['interval']){
			$start = $this->data['interval']['start'];
			$end = $this->data['interval']['end'];
			$start = MerakGWAPI::unix2calendarDate($start);
			$end = MerakGWAPI::unix2calendarDate($end);
			$filter['interval'] = $start.'-'.$end;
		 		}else{
			$filter['orderby'] = $this->data['orderby'];
			$info['page'] = $this->data['page'];
			if(!$filter['orderby']){
				$filter['orderby'] = $param['orderby'];
			}
			$info['total'] = ceil( $itemsCount / $param['limit'] );
			$info['total'] = $info['total']?$info['total']:1;
			$info['itemsCount'] = $itemsCount;
			if( $info['page'] <= 1 ){
				$info['page'] = 1;
			}else if ( $info['page'] > $info['total'] ){
				$info['page'] = $info['total'];
			}
			$filter['limit'] = $param['limit']; 
			$filter['offset'] = $filter['limit'] * ( $info['page'] - 1 );
			$info['hasNext'] = ( $filter['offset'] + $filter['limit'] < $itemsCount ) ? true : false;
			$info['hasPrev'] = ( $info['page'] > 1 ) ? true : false;
		}
		if($this->data['filter']){
			$filter['sql'] = $this->data['filter'];
		}
		$request = slRequest::instance();
		$info['link'] = $request->getURI(false);
		$info['controller'] = $param['controller'];
		return $filter;
	}
	
	 	
	 
	public function gridWidget( $param )
	{
		$this->param = $param;
		$result = array();
		 		$container = $this->getContainer( $param, $result['container'] );
		if($container->account && $container->account->isDelayed()){
			$delayedResult = $container->account->syncDelayedFolders();
		}else{
			$delayedResult = true;
		}
		 		$session = slSession::instance();
		$sessionVar = '["sync"]["folder"]["'.md5($container->name).'"]';
		$lastSync = $session->getMain($sessionVar);
		$lastSync = $lastSync?$lastSync:0;

		if(time()-$lastSync > 60){
			if($delayedResult){
				$container->toSync = true;
				$container->sync();
				$session->setMain($sessionVar,time());
			}
		}
		if($container->name=='INBOX'){
			$result['container']['unread'] = $container->countItems(Item::FLAG_SEEN);
		}
		$filter = $this->getFilter( $container, $param, $result['info'] );
		 		$oItems = $container->getItems($filter);
		$folderH['helper'] = 'folder';
		$this->folderHelper = slHelperFactory::instance($folderH);
		
		 		require_once('inc/webmailiqitems.php');
		if (method_exists($this,"convert".$container->type)) {
			$result['data'] = WebmailIQItems::cnvItems(
				$oItems,
				$filter,
				array(
					'class'=>$this,
					'method'=>'convert'.$container->type
				)
			);
		} else {
			$result['data'] = WebmailIQItems::cnvItems( $oItems , $filter );
		}
		 		if (method_exists($this,$container->type.'finishHandler')){
			$finish=$container->type.'finishHandler';
			$result['data']=$this->$finish($result['data'], $result['info']);
		}
		return $result;
	}
	
	public function joinAddresses($addresses,&$my_addr)
	{
		$reply_all=array();
		if(is_array($addresses))
		{
			foreach($addresses as $address){
				if($_SESSION['EMAIL'] == $address['address']){
					$my_addr = $address;
				}
				else
				{
					if($address['address'])
					{
						if($address['address']!=$address['display'] && !empty($address['display'])){
							$addr = '"'.$address['display'].'" <'.$address['address'].'>';
						}else{
							$addr = $address['address'];
						}
						$reply_all[$address['address']] = $addr;
					}
				}
			}
		}
		return $reply_all;
	}
	
	public function mailviewWidget( $param )
	{	
		$session = slSession::instance();
		 
		 		if($param['htmlOnly']){
			
			$items[0]['html'] = $session->getPage('html');
			$result['data'] = $items[0];
		}else{
			$request = slRequest::instance();
			$action = $request->get('all._s.action');
			switch($action){
				case 'error':
				case 'session':
					if($request->get('all._n.p.main')!='view.mail'){
						break;
					}
				case 'replytoall':
				case 'reply':
				case 'forward':
				case 'continue':
				default:
					try{
						$container = $this->getContainer( $param, $result['info'] );
						$result['container'] = $result['info'];
						 						$oItem = $container->getItem( $this->data['item'] );
						if($oItem->flags & Item::FLAG_SEEN){
							$unread = false;
						}else{
							$unread = true;
						}
						 						$oItem->markAsRead();
						 						require_once('inc/webmailiqitems.php');
						$filter = array();
						$filter['tag']="*";
						$items[0] = $oItem;
						$items = WebmailIQItems::cnvItems(
							$items,	 							$filter,	 							array(
								'class'=>$this,
								'method'=>'convertM'
							),			 							false,		
							1,			 							false		 						);
						
						if(isset($items[0]['attachments'])){
							$router = slRouter::instance();
							$url = MODEL_PATH . 'download.php';
							$linkParam['sid'] = $_SESSION['SID'];
							$linkParam['class'] = 'attachment';
							foreach($items[0]['attachments']['num'] as $key => $attachment){
								
								$items[0]['attachments']['num'][$key]['size']=$this->bytesToSize($items[0]['attachments']['num'][$key]['size']);
								
								$linkParam['fullpath'] = rawurlencode($oItem->folder->account->accountID).'/'.
									rawurlencode($oItem->folder->name).'/'.
									$oItem->itemID.'/'.
									$attachment['part_id'];
								$items[0]['attachments']['num'][$key]['link'] = $router->getCustomLink(
									$linkParam , 
									true, 
									false, 
									$url,
									true
								);
								$items[0]['attachments']['num'][$key]['class'] = 'attachment';
								$items[0]['attachments']['num'][$key]['fullpath'] = $linkParam['fullpath'];
							}
						}
						
						$result['data'] = $items[0];
						$result['data']['type'] = $result['data']['content-type'];
						$result['data']['unread'] = $unread;
						
						if($result['data']['text']){
							$result['data']['plain_text_html'] = slToolsString::text2html($result['data']['text'],true);
						}else{
							$result['data']['plain_text_html'] = nl2br(slToolsString::removeHTML($result['data']['html']));
							
						}
						
						
						if($result['data']['content-type']=='html'){
							$result['data']['html_new_window'] = $request->getPath().'?_n[p][main]=view.mail.html&amp;_s[id]='.rawurlencode($container->name).'&amp;_s[type]=M&amp;_s[item]='.$oItem->itemID;
						}
					}catch(Exception $e){
						$noItem = true;
					}
				break;
			}
			$helperConstructor['helper'] = 'settings';
			$settings = slHelperFactory::instance($helperConstructor);
			 			$sset = $settings->getPrivate('signature');
			
			$txt=$sset['@childnodes']['item'][0]['@childnodes']['text'][0]['@value'];
			
			if (trim(br2nl($txt))=='') {$txt='';}
			
			$sig['html'] = nl2br($txt);
			$sig['text']=slToolsString::removeHTML($sig['html']);
			
			$sig['to_top']=$sset['@childnodes']['item'][0]['@childnodes']['to_top'][0]['@value'];
			switch($action){
				case 'reply':
					$result['data']['mail_action'] = 'reply';
					 					 					 					$result['data']['date'] = date("Y/m/d H:i:s",$result['data']['date']);
					$result['data']['sourceid'] = $result['data']['id'];
					$result['data']['sourcefolder'] = $this->data['id'];
					$result['data']['sourceaccount'] = $_SESSION['EMAIL'];
					if($request->get('all._s.sourceid')){
						$result['data']['sourceid'] = $request->get('all._s.sourceid');
						$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
						$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
						$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
					}
					$this->createMessageEnvelope('reply',$result);
					 					$this->createConversationHeaders($result);
					if($result['data']['reply_to']){
						$result['data']['to'] = $result['data']['reply_to'];
					}else{
						$result['data']['to'] = $result['data']['from'];
					}
					$result['data']['cc'] = '';
					$result['data']['bcc'] = '';
					
					unset($result['data']['attachments']);
					$result['data']['text'] = $this->addSignature(
						$result['data']['text'],
						$sig['text'],
						'text',
						$sig['to_top']
					);
				break;
				case 'replytoall':
					$result['data']['mail_action'] = 'reply';

					 					 					 					$result['data']['date'] = @date($DTFormats['date'].self::convertTimeFormat(" H:i:s",$DTFormats['time']),$result['data']['date']);
					
					$result['data']['sourceid'] = $result['data']['id'];
					$result['data']['sourcefolder'] = $this->data['id'];
					$result['data']['sourceaccount'] = $_SESSION['EMAIL'];
					$result['data']['sourceaction'] = 'reply';
					if($request->get('all._s.sourceid')){
						$result['data']['sourceid'] = $request->get('all._s.sourceid');
						$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
						$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
						$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
					}
						
					 					$this->createMessageEnvelope('reply',$result);
					 					$this->createConversationHeaders($result);
					 					$from = MailParse::parseAddresses($result['data']['from']);
					$to = MailParse::parseAddresses($result['data']['to']);
					$cc = MailParse::parseAddresses($result['data']['cc']);
					$reply_to = MailParse::parseAddresses($result['data']['reply_to']);
					if($reply_to){
						$from = $reply_to;
					}
					if($from) foreach($from as $faddr){
						$fromAddresses[$faddr['address']] = 1;
					}
					$from = is_array($from)?$from:array();
					$to = is_array($to)?$to:array();
					$cc = is_array($cc)?$cc:array();
					
					@$addresses = slToolsPHP::array_merge($from,$to);
					$my_addr = false;
					if(is_array($addresses)) foreach($addresses as $address){
						if(!$address['address']){
							continue;
						}
						if($address['address']!=$address['display'] && $address['display']){
							$addr = '"'.$address['display'].'" <'.$address['address'].'>';
						}else{
							$addr = $address['address'];
						}
						if(isset($reply_all[$address['address']])){
							if($address['address']!=$address['display']){
								$reply_all[$address['address']] = $addr;
							}else{
								continue;
							}
						}
						if($_SESSION['EMAIL'] == $address['address']){
							$my_addr = $addr;
							if(!isset($fromAddresses[$address['address']])){
								continue;
							}
						}

						$reply_all[$address['address']] = $addr;
					}
					
					$reply_cc=array();
					if(is_array($cc)) foreach($cc as $address){
						if(!$address['address']){
							continue;
						}
						if($address['address']!=$address['display'] && $address['display']){
							$addr = '"'.$address['display'].'" <'.$address['address'].'>';
						}else{
							$addr = $address['address'];
						}
						if(isset($reply_cc[$address['address']])){
							if($address['address']!=$address['display']){
								$reply_cc[$address['address']] = $addr;
							}else{
								continue;
							}
						}
						
						if($_SESSION['EMAIL'] == $address['address']){
							$my_addr = $addr;
							if(!isset($fromAddresses[$address['address']])){
								continue;
							}
						}
						else
						{
							 						}

						$reply_cc[$address['address']] = $addr;
					}

					if($my_addr && empty($reply_all)){
						$reply_all[$_SESSION['EMAIL']] = $my_addr;
					}
					$reply_all = join(', ',$reply_all);
					$reply_cc = join(', ',$reply_cc);
					
					
					$result['data']['to'] = $reply_all;
					$result['data']['cc'] = $reply_cc;
					$result['data']['bcc'] = '';
					unset($result['data']['attachments']);
					$result['data']['text'] = $this->addSignature(
						$result['data']['text'],
						"\r\n".$sig['text'],
						'text',
						$sig['to_top']
					);
					
					$result['data']['html'] = $this->addSignature(
						$result['data']['html'],
						"<br />".$sig['html'],
						'html',
						$sig['to_top']
					);										
				break;
				case 'forward':
					$result['data']['mail_action'] = 'forward';
					 					 					 					$result['data']['date'] = date("Y/m/d H:i:s",$result['data']['date']);
					$result['data']['sourceid'] = $result['data']['id'];
					$result['data']['sourcefolder'] = $this->data['id'];
					$result['data']['sourceaccount'] = $_SESSION['EMAIL'];
					if($request->get('all._s.sourceid')){
						$result['data']['sourceid'] = $request->get('all._s.sourceid');
						$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
						$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
						$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
					}
					$this->createMessageEnvelope('forward',$result);
					$result['data']['prefix'] = 'Fwd: ';
					$result['data']['to'] = '';
					$result['data']['cc'] = '';
					$result['data']['bcc'] = '';
					$result['data']['text'] = $this->addSignature(
						$result['data']['text'],
						$sig['text'],
						'text',
						$sig['to_top']
					);
					
					 					
				break;
				case 'continue':
					$result['data']['draftid'] = $result['data']['id'];
					$result['data']['draftfolder'] = $this->data['id'];
					$result['data']['draftaccount'] = $_SESSION['EMAIL'];
					if($request->get('all._s.sourceid')){
						$result['data']['sourceid'] = $request->get('all._s.sourceid');
						$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
						$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');	
						$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
					
					}
					if($request->get('all._s.draftid')){
						$result['data']['draftid'] = $request->get('all._s.draftid');
						$result['data']['draftfolder'] = $request->get('all._s.draftfolder');
						$result['data']['draftaccount'] = $request->get('all._s.draftaccount');
					}
					$result['data']['mail_action'] = 'draft';
					if($result['data']['type'] == 'text'){
						$result['data']['html'] = $result['data']['html'];
						$result['data']['text'] = $result['data']['text'];
					}else{
						$result['data']['type'] = 'html';
						$result['data']['html'] = $result['data']['html'];
						$result['data']['text'] = slToolsString::removeHTML($result['data']['html']);
					};
				break;
				case 'error':
				case 'session':
					if($request->get('all._n.p.main')!='view.mail'){
						$priorityTrans = array(
							'highest'=>1,
							'high'=>2,
							'normal'=>3,
							'low'=>4,
							'lowest'=>5
						);
						 						$session = slSession::instance();
						$id = $request->get('all._s.message_id');
						$mail = $session->getMain('["compose"]["'.$id.'"]["mail"]');
						$formData = $session->getMain('["compose"]["'.$id.'"]["form"]');
						 						if($formData['options'] && $formData['options']['priority']){
							$formData['options']['priority'] = $priorityTrans[$formData['options']['priority']];
						}
						$result['data'] = $this->mailToForm($mail,$id,$formData);
						if(!$result['data']['text']){
							$result['data']['text'] = $result['data']['html'];
						}
						if($formData['mail_action']){
							$result['data']['mail_action'] = $formData['mail_action'];
						}
						$result['data']['options'] = $formData['options'];
						if($request->get('all._s.sourceid')){
							$result['data']['sourceid'] = $request->get('all._s.sourceid');
							$result['data']['sourcefolder'] = $request->get('all._s.sourcefolder');
							$result['data']['sourceaccount'] = $request->get('all._s.sourceaccount');
							$result['data']['sourceaction'] = $request->get('all._s.sourceaction');
							
						}
						if($request->get('all._s.draftid')){
							$result['data']['draftid'] = $request->get('all._s.draftid');
							$result['data']['draftfolder'] = $request->get('all._s.draftfolder');
							$result['data']['draftaccount'] = $request->get('all._s.draftaccount');
						}
					}else{
						$session = slSession::instance();
						$id = $request->get('all._s.message_id');
						$formData = $session->getMain('["compose"]["'.$id.'"]["form"]');
						$result['data']['fast_reply'] = $formData['html'];
					}
				break;
				default:
					if($request->get('all._n.p.main')=='mail.compose'){
						$result['data']['text'] = $this->addSignature(
							$result['data']['text'],
							$sig['text'],
							'text',
							$sig['to_top']
						);
					}
					$mail_settings_default = $settings->getPrivate('mail_settings_default');
					$mail_settings_general = $settings->getPrivate('mail_settings_general');
					$mail_settings_default = $mail_settings_default['@childnodes']['item'][0]['@childnodes'];
					$mail_settings_general = $mail_settings_general['@childnodes']['item'][0]['@childnodes'];
					if(isset($mail_settings_default['save_sent_message'])){
						$save_sent_message = $mail_settings_default['save_sent_message'][0]['@value'];
					}else{
						$save_sent_message = 1;
					}
					if(isset($mail_settings_default['read_confirmation'])){
						$read_confirmation = $mail_settings_default['read_confirmation'][0]['@value'];
					}else{
						$read_confirmation = 0;
					}
					if(isset($mail_settings_default['priority'])){
						$priority = $mail_settings_default['priority'][0]['@value'];
					}else{
						$priority = 3;
					}
					if($priority==2 || $priority==4){
						$priority = 3;
					}
					$result['data']['options']['request_read_confirmation'] = $read_confirmation;
					$result['data']['options']['save_sent_message'] = $save_sent_message;
					$result['data']['options']['priority'] = $priority;
				break;
			}
			if(!$result['data']['options']){
				 				$helperConstructor['helper'] = 'settings';
				$settings = slHelperFactory::instance($helperConstructor);
				$mail_settings_default = $settings->getPrivate('mail_settings_default');
				$mail_settings_general = $settings->getPrivate('mail_settings_general');
				$mail_settings_default = $mail_settings_default['@childnodes']['item'][0]['@childnodes'];
				$mail_settings_general = $mail_settings_general['@childnodes']['item'][0]['@childnodes'];
				if(isset($mail_settings_default['save_sent_message'])){
					$save_sent_message = $mail_settings_default['save_sent_message'][0]['@value'];
				}else{
					$save_sent_message = 1;
				}
				if(isset($mail_settings_default['read_confirmation'])){
					$read_confirmation = $mail_settings_default['read_confirmation'][0]['@value'];
				}else{
					$read_confirmation = 0;
				}
				if(isset($mail_settings_default['priority'])){
					$priority = $mail_settings_default['priority'][0]['@value'];
				}else{
					$priority = 3;
				}
				if(isset($mail_settings_default['html_message'])){
					$msg_type = $mail_settings_default['html_message'][0]['@value'];
				}else{
					$msg_type = 0;
				}
				$msg_type = $msg_type?'html':'text';
				$result['data']['options']['request_read_confirmation'] = $read_confirmation;
				$result['data']['options']['save_sent_message'] = $save_sent_message;
				$result['data']['options']['priority'] = $priority;
				$result['data']['options']['type'] = $msg_type;
				if(!$result['data']['type']){
					$result['data']['type'] = $msg_type;
				}
			}
			
			$replyFullpath = $result['data']['reply_fullpath'];
			$fwdFullpath = $result['data']['forward_fullpath'];
			
			if($replyFullpath || $fwdFullpath){
			
				if($replyFullpath){
					$fullpath = Tools::parseFullpath($replyFullpath,'item');
				}
				if($fwdFullpath){
					$fullpath = Tools::parseFullpath($fwdFullpath,'item');
				}
				$result['data']['sourceid'] = $fullpath['item'];
				$result['data']['sourcefolder'] = $fullpath['folder'];
				$result['data']['sourceaccount'] = $fullpath['account'];
				$result['data']['sourceaction'] = $replyFullpath?'reply':'forward';
			}
			
			$router = slRouter::instance();
			$folder['helper'] = 'folder';
			$folderHelper =slHelperFactory::instance($folder);
			$folderInfo = $folderHelper->getInfo(
				$result['container']['type'],
				$result['container']['id']
			);
			$params = array(
				'window'=>'main',
				'target'=>'main',
				'view'=>$folderInfo['page'],
				'data'=>'item.fdr',
				'id'=>$result['container']['id'],
				'type'=>$result['container']['type']
			);
			$link = $router->getCompressedLink('folder',$params);
			$result['container']['list_link'] = $request->getPath().$link;
			$result['info']['link'] = $request->getURI();
			 			$this->separateAddresses($result,'reply_to');
			$this->separateAddresses($result,'from');
			$this->separateAddresses($result,'to');
			$this->separateAddresses($result,'cc');
			$this->separateAddresses($result,'bcc');
			$session->setPage( 'html', $result['data']['html'] );
			if(isset($_SESSION['EMAIL'])){
				$result['data']['aid']=$_SESSION['EMAIL'];
			}
		}
		
		 		
		return $result;
	}
	
	public function separateAddresses(&$result,$index)
	{
		if($index=='to'){
			$result['data']['aditional']['to_differs']=false;
		}
		
		if($result['data'][$index]){
			$addresses = MailParse::parseAddresses($result['data'][$index]);
			foreach($addresses as $address){
				if($address['display']==$address['address'])
				{
					$name=strtok($address['address'],'@');
					$address['display']=$name;
					 				}
				else
				{
					$address['cdisplay']=$address['display'];
					$address['display']=rawurlencode($address['display']);
				}
				
				$address['caddress']=$address['address'];
				$address['address']=rawurlencode($address['address']);
				$result['data']['aditional'][$index][] = $address;
				 				if($index=='to' && $address['caddress']!=$_SESSION['EMAIL']){
					$result['data']['aditional']['to_differs']=true;
				}
			}
		}
	}
	
	public function formWidget( $param )
	{
		$result = [];
		try{
			$container = $this->getContainer( $param, $result['info'] );
			try{
				$item = $container->getItem( $this->data['item'] );
				$items[0] = $item;
				require_once('inc/webmailiqitems.php');
				$filter = array();
				$filter['tag']="*";
				if(method_exists($this,'convert'.$container->getType().'Detail')){
					$method = array(
						'class'=>$this,
						'method'=>'convert'.$container->getType().'Detail'
					);
				}else{
					$method = false;
				}
				$items = WebmailIQItems::cnvItems(
					$items,	 					$filter,	 					$method,	 					false,		
					1,			 					false		 				);
				$item = reset($items);
				$result['item'] = $item;
			}catch(Exc $e){
				
			}
			$request = slRequest::instance();
			$result['info']['link'] = $request->getURI();
			$result['info']['controller'] = $param['controller'];
			$result['container'] = $container;
		}catch(Exc $e){
		}

		return $result;
	}
	
	public function menuWidget( $param )
	{
		slSystem::import('controller/grid',APP_PATH);
		$request = slRequest::instance();
		$data = $this->formWidget($param);
		$link = $request->getPath().'?_c=folder&amp;_a[sync]=1&amp;_s[id]='.rawurlencode($data['container']->name)."&amp;_s[type]=".$data['container']->getType();
		if($sort = $request->get('get._s.sort')){
			$link = slControllerGrid::replaceURLVariable($link,'_s[sort]',$sort,'&amp;');
		}
		if($search = $request->get('get._s.search')){
			$link = slControllerGrid::replaceURLVariable($link,'_s[search]',$search,'&amp;');
		}
		if($page = $request->get('get._s.page')){
			$link = slControllerGrid::replaceURLVariable($link,'_s[page]',$page,'&amp;');
		}
		$data['buttons']['refresh'] = $link;
		$data['container'] = $data['info'];
		
		return $data;
	}
	
	
	public function getItemLink( $oItem, $aItems )
	{
		 		$router = slRouter::instance('Request');
		 		$linkType = $this->param['link'];
		 		$linkParam['window'] = 'main';
		$linkParam['target'] = $this->data['target'];
		$linkParam['data'] = $this->data['data'];
		$linkParam['type'] = $oItem->folder->type;
		$linkParam['id'] = $oItem->folder->name;
		$linkParam['item'] = $oItem->itemID;
		 		switch($oItem->folder->type){
			case 'M':
				$linkParam['view'] = 'view.mail';
			break;
			case 'E':
				$linkParam['view'] = 'view.event';
			break;
			case 'C':
				$linkParam['view'] = 'view.contact';
			break;
			case 'T':
				$linkParam['view'] = 'view.task';
			break;
			case 'N':
				$linkParam['view'] = 'view.note';
			break;
			case 'J':
				$linkParam['view'] = 'view.journal';
			break;
			case 'F':
				$linkParam['view'] = 'view.file';
			break;
			default:
			break;
		}
		 		$link = $router->getCompressedLink( $linkType ,$linkParam );
		return $link;
	}


	static public function convertC(&$oItem,&$aItem)
	{ 
		if (substr_count($aItem['ITMCATEGORY'],',')>0) {$ct=explode(',',$aItem['ITMCATEGORY']); $ct=$ct[0];}
		else {$ct=$aItem['ITMCATEGORY'];}
		$aItem['aditional']['class']=strtolower($ct);
		
		$rename=false;
		if (isset($aItem['ITMCLASSIFYAS']))
		{
			if ($aItem['ITMCLASSIFYAS']=='')
			{
				$rename=true;
			}
		}
		else
		{
			$rename=true;
		}
		if($rename)
		{
			$name='';
				if (isset($aItem['ITMTITLE']))
				{
					if ($aItem['ITMTITLE']!='')
					{
						$name.=$aItem['ITMTITLE'];
					}
				}
				if (isset($aItem['ITMFIRSTNAME']))
				{
					if ($aItem['ITMFIRSTNAME']!='')
					{
						$name.=' '.$aItem['ITMFIRSTNAME'];
					}
				}
				if (isset($aItem['ITMMIDDLENAME']))
				{
					if ($aItem['ITMMIDDLENAME']!='')
					{
						$name.=' '.$aItem['ITMMIDDLENAME'];
					}
				}
				if (isset($aItem['ITMSURNAME']))
				{
					if ($aItem['ITMSURNAME']!='')
					{
						$name.=' '.$aItem['ITMSURNAME'];
					}
				}
				if (isset($aItem['ITMSUFFIX']))
				{
					if ($aItem['ITMSUFFIX']!='')
					{
						$name.=' '.$aItem['ITMSUFFIX'];
					}
				}
				$aItem['ITMCLASSIFYAS']=$name;
		}

	}

	
	public function convertM(&$oItem,&$aItem)
	{	

		$data = slRequest::instance();
		
		$DTFormats=self::getDTFormats();
		$time_format=$DTFormats['time'];
		$ctz=0;
		$stz=0;
		if (isset($_SESSION['CTZ']) && trim($_SESSION['CTZ'])!='') {$ctz=$_SESSION['CTZ']*60;}
		if (isset($_SESSION['STZ']) && trim($_SESSION['STZ'])!='') {$stz=$_SESSION['STZ']*60;}
		
		$timestampToUse=($aItem['timestamp']-date('Z',$aItem['timestamp']))+$ctz;
		
		 
		$select=$data->get('get.select');
		if ($select=='all' || ($select=='unread' && $aItem['recent']) || ($select=='read' && !$aItem['recent']))
		{
			$aItem['aditional']['checked'] = true;
			$aItem['checked'] = true;
		}
		 
		$outgoingFolders = $this->folderHelper->mappedFolders;
		unset($outgoingFolders['spam']);
		unset($outgoingFolders['trash']);
		if(is_array($outgoingFolders) && in_array($oItem->folder->name,$outgoingFolders)){
			$aItem['address'] = self::getDisplayAddress($aItem['to']);
		}else{
			
			$aItem['address'] = self::getDisplayAddress($aItem['from']);
		}
		$aItem['unread'] = !($oItem->flags & Item::FLAG_SEEN);
		$aItem['aditional']['fromshow'] = htmlspecialchars(self::getDisplayAddress($aItem['from']));
		$aItem['aditional']['toshow'] = htmlspecialchars(self::getDisplayAddress($aItem['to']));
		$toArray = Mailparse::parseAddresses($aItem['to']);
		if(count($toArray)>1 || 
			strtolower($toArray[0]['address'])!=strtolower($_SESSION['EMAIL'])
		){
			$aItem['aditional']['toshowpda'] = $aItem['aditional']['toshow'];
		}
		$aItem['aditional']['date']=date($DTFormats['date'],$timestampToUse);
		 		$aItem['aditional']['fulldate']=date($DTFormats['date']." ".$this->convertTimeFormat('H:i:s',$time_format),$timestampToUse);
		if(date("Y/m/d",$timestampToUse)==date("Y/m/d",time()-date('Z')+$ctz)){
			$aItem['aditional']['shortdate'] = date($this->convertTimeFormat('H:i:s',$time_format),$timestampToUse);
			 		}else{
			$aItem['aditional']['shortdate'] = iconv("","UTF-8",date($DTFormats['date'],$timestampToUse));
			 		}
		if ($aItem['aditional']['date']==date('d/m/Y',time()-date('Z')+$ctz)) {$aItem['aditional']['date']=date($this->convertTimeFormat('H:i',$time_format),$timestampToUse);}
		$aItem['aditional']['size']=round( $aItem['size'] / 1024 , 2 ).' kB';
		$aItem['link'] = $this->getItemLink( $oItem, $aItem );
		
		 		 	}
	
	static private function getDisplayAddress($address)
	{
		$result = '';
		if (substr_count($address,'&lt;')>0){
			$result=explode("&lt;",$address);
			$result=str_replace('&quot;',"",$result[0]);
		} else {
			$result=str_replace('&quot;',"",$address);
		}
		return $result;
	}
	
	

	
	public function CfinishHandler( $data, &$info )
	{
		$ui = slGUI::instance();
	 	$request = slRequest::instance();
		$tpl = $request->get('all.view');
		$widget = $this->getWidget('grid');
		try{
			$tpl = $widget->getProperty('view');
		}catch(Exception $e){
		}
		if ($tpl=='') {
			$tpl='grid.contact.card';
		}
		
		$info['template']=$ui->getFile('template',$tpl);
		
		return $data;
	}
	
	public function MFinishHandler( $data, &$info )
	{
		try {
			$ui = slGUI::instance();
			$info['read']=$ui->getFile(
				'css/images/grid/',
				'ico_unread',
				true,
				'.gif'
			);
		} catch (Exception $e){	
		}
		return $data;
	}
	
	private function completeAddress($addr)
	{
		if($addr[1]){
			$result = '"'.$addr[1].'"'.' <'.$addr[0].'>';
		}else{
			$result = $addr[0];
		}
		return $result;
	}
	
	public function mailToForm($mail,$id,$formData)
	{
		$request =slRequest::instance();
		if(is_array($mail->to) && !empty($mail->to)) foreach($mail->to as $to){
			$result['to'][]= $this->completeAddress($to);
		}
		if(is_array($result['to']) &&!empty($result['to'])){
			$result['to'] = implode(', ',$result['to']);
		}
		if(is_array($mail->cc) && !empty($mail->cc)) foreach($mail->cc as $cc){
			$result['cc'][] = $this->completeAddress($cc);
		}
		if(is_array($result['cc']) &&!empty($result['cc'])){
			$result['cc'] = implode(', ',$result['cc']);
		}
		if(is_array($mail->bcc) && !empty($mail->bcc)) foreach($mail->bcc as $bcc){
			$result['bcc'][] = $this->completeAddress($bcc);
		}
		if(is_array($result['bcc']) &&!empty($result['bcc'])){
			$result['bcc'] = implode(', ',$result['bcc']);
		}
		$result['subject'] = $mail->Subject;
		if(is_array($mail->attachment) && !empty($mail->attachment)) foreach($mail->attachment as $key => $attach){
			$attachments[$key]['class'] = 'session';
			$attachments[$key]['fullpath'] = $id.'/'.$key;
			$attachments[$key]['name'] = $attach[2];
		}
		$result['attachments'] = $attachments;
		$result['html'] = $mail->Body;
		if(strpos($mail->ContentType,'plain')!==false){
			$result['type'] = 'text';
			$result['html'] = slToolsString::text2html($mail->Body);
			$result['text'] = $mail->Body;
		}else{
			$result['type'] = 'html';
			$result['html'] = $mail->Body;
			$result['text'] = slToolsString::removeHTML($mail->Body);
		};
		if($formData['draftid']){
			$result['draftid'] = $formData['draftid'];
			$result['draftfolder'] = $formData['draftfolder'];
			$result['draftaccount'] = $formData['draftaccount'];
		}
		if($formData['sourceid']){
			$result['sourceid'] = $formData['sourceid'];
			$result['sourcefolder'] = $formData['sourcefolder'];
			$result['sourceaccount'] = $formData['sourceaccount'];
			$result['sourceaction'] = $formData['sourceaction'];
		}
		
		
		return $result;
	}
	
	public function createConversationHeaders(&$result)
	{
		 		$result['data']['in-reply-to'] = $result['data']['message_id'];
		$result['data']['references'] = ($result['data']['references'])?($result['data']['references']."\n\t").$result['data']['message_id']:$result['data']['message_id'];
	}
	
	public function createMessageEnvelope($type,&$data)
	{
		$settings['helper'] = 'settings';
		$settingsHelper = slHelperFactory::instance($settings);
		$default = $settingsHelper->getPrivate('mail_settings_general');
		$default = $default['@childnodes']['item'][0]['@childnodes'];
		$classic_prefix = $default['classic_prefix'][0]['@value'];
		$language = slLanguage::instance();
		if($data['data']['content-type']  == 'html')
		{
			$subject = $language->get('compose_mail','subject').': '.slToolsPHP::htmlspecialchars($data['data']['subject']);
			$from = $language->get('compose_mail','from').': '.slToolsPHP::htmlspecialchars($data['data']['from']);
			$to = $language->get('compose_mail','to').': '.slToolsPHP::htmlspecialchars($data['data']['to']);
			
			$subjectt = $language->get('compose_mail','subject').': '.$data['data']['subject'];
			$fromt = $language->get('compose_mail','from').': '.$data['data']['from'];
			$tot = $language->get('compose_mail','to').': '.$data['data']['to'];
			
			$date = $language->get('compose_mail','date').': '.$data['data']['date'];
			$headHTML = $subject."<br/>".$from."<br/>".$to."<br/>".$date."<br/>";
			$headText = $subjectt."\r\n".$fromt."\r\n".$tot."\r\n".$date."\r\n";
			$original = $language->get('compose_mail','original_message');
			$html = $data['data']['html'];
			$data['data']['html'] = "<br/><br/>".$original."<br/>".$headHTML."<br/>".$html;
			$data['data']['text'] = "\r\n\r\n".$original."\r\n".$headText."\r\n".slToolsString::removeHTML($html);
		}
		if($data['data']['content-type']  == 'text'){
			$subject = $language->get('compose_mail','subject').': '.$data['data']['subject'];
			$from = $language->get('compose_mail','from').': '.$data['data']['from'];
			$to = $language->get('compose_mail','to').': '.$data['data']['to'];
			$date = $language->get('compose_mail','date').': '.$data['data']['date'];
			$head = $subject."\r\n".$from."\r\n".$to."\r\n".$date."\r\n";
			$original = $language->get('compose_mail','original_message');
			$html = $data['data']['plain']?$data['data']['plain']:$data['data']['html'];
			$data['data']['text'] = "\r\n\r\n".$original."\r\n".$head."\r\n".$html;
			$data['data']['html'] = nl2br(slToolsPHP::htmlspecialchars($data['data']['text']));
		}
		switch($type){
			case 'reply':
				$data['data']['subject'] = $this->subjectPrefix($data['data']['subject'],'Re',$classic_prefix);
			break;
			case 'forward':
				$data['data']['subject'] = $this->subjectPrefix($data['data']['subject'],'Fwd',$classic_prefix);
			break;
		}
	}
	
	public function subjectPrefix($value,$prefix,$classic_prefix)
	{
		if($classic_prefix || !preg_match('/^'.$prefix.'(\[([0-9]+)\])?(\s)?:(\s)?/si',$value,$matches)){
			$value = $prefix.':'.$value;
		}else{
			$val = (intval($matches[2])==0)?'2':(intval($matches[2])+1);
			$value = preg_replace('/^'.$prefix.'(\[([0-9]+)\])?(\s)?:(\s)?/si',$prefix.'['.$val.']'.$matches[3].':'.($matches[4]==''?' ':$matches[4]),$value);
		}
		return $value;
	}
	public function addSignature($value,$signature,$type,$to_top)
	{
		$newline = $type=='html'?'<br/>':"\n";
		if($to_top){
			$value = $newline.$signature.$newline.$value;
		}else{
			$value = $value.$newline.$newline.$signature;
		}
		
		if (trim(br2nl($value))=='') {$value='';}
		
		return $value;
	}
}

?>
