<?php
class slWidgetMailview extends slWidget
{
	public function create($aConstruct)
	{		
		parent::create($aConstruct);
		
		$oUI = slGUI::instance();
		if($helperID = strval($aConstruct['xml']['helper']))
		{
			$xml=$aConstruct['xml'];
			$construct = array( 'helper' => $helperID );
			$helper = slHelperFactory::instance( $construct, $this );
			$sDataID = strval($xml->config->data);
			$param['data'] = $sDataID;
			$param['htmlOnly'] = (
				isset($xml->config->htmlOnly) 
				&& (
					strval( $xml->config->htmlOnly ) == 'true'
				) 
			) ? true : false;
			$data = $helper->mailviewWidget( $param );
			
			$data['data']['UEfrom']=urlencode($data['data']['from']);
			
			 
			$to=$data['data']['to'];
			$to=explode(',',$to);
			
			$i=0;
			foreach ($to as $val)
			{
				$data['data']['toa'][$i]['address']=trim($val);
				$data['data']['toa'][$i]['UEaddress']=urlencode(trim($val));
				if (($i+1)!=count($to))
				{
					$data['data']['toa'][$i]['notlast']=true;
				}
				$i++;
			}
			 
			
			$router = slRouter::instance();
			$linkParam['window'] = 'html';
			$linkParam['target'] = 'html';
			$linkParam['view'] = 'view.mail.html';
			$linkParam['id'] = $data['info']['id'];
			$linkParam['type'] = $data['info']['type'];
			$linkParam['item'] = $data['info']['item'];
			$link = $router->getCompressedLink('item', $linkParam, true);
			$this->setTemplateData('htmlFrame',array('src'=>$link));
			$this->setTemplateData($helperID,$data['data']);
			$this->setTemplateData('folder',$data['info']);
			$this->setTemplateData('info',$data['info']);
			$this->setTemplateData('container',$data['container']);
		}
	}
}
?>
