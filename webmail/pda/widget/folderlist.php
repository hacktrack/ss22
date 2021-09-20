<?php
class slWidgetFolderList extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$request = slRequest::instance();
		$data = $oWMData->get('folder','list');

		$output = '';
		$delimiterString = '\/';
		if (isset($data['num'])) {
			$aFolders = array();
			foreach ($data['num'] as $folderNumber=>$folderDescription) {
				$aFolder = array();
				$splitNameArray = preg_split('/'.$delimiterString.'/',$folderDescription['name']);
				$splitLocalizedNameArray = preg_split('/'.$delimiterString.'/',$folderDescription['localizedName']);
				$depth = count($splitNameArray);
				 				$break = '';
				$deep = 1;
				for(; $deep<$depth; $deep++) {
					$break .= '&nbsp;&nbsp;';
				}
	 	 				 				 				 				$aFolder['break'] = $break;
				$aFolder['src'] = Tools::getServerURL().'?sid='.$oWMRequest->sSID.'&amp;folder='.$folderDescription['id'].'&amp;view='.$folderDescription['view'];
				$aFolder['name'] = $splitLocalizedNameArray[($deep-1)];
				$aFolders['num'][] = $aFolder;
			}
		}
		 
		$this->setTemplateData('folders',$aFolders);
		 
		$this->setTemplateData('sid',$oWMRequest->sSID);
	}
}
?>
