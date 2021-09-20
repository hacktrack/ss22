<?php

class slWidgetPanel extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$this->setTemplateData('center',strval($aConstruct['xml']['center'])=='true'?true:false);
		$this->setTemplateData('id',$this->getProperty('id'));
		$this->setTemplateData('onclick',strval($aConstruct['xml']['onclick']));
		
		 		 		 		$tpl='light';
		
		$data = slRequest::instance();
		$at=str_replace(".",'_',$data->get('get._n.p.content'));
		if ($at!='')
		{
			$active[$at]=true;
			
			if ($at=='grid_mail' || $at=='grid_mail_drafts' || $at=='view_mail' || $at=='compose_mail' || $at=='manage_folders'){$theme=$tpl.' blue';}
			elseif ($at=='search'){$theme=$tpl.' brown notree';}
			elseif ($at=='grid_contact' || $at=='grid_contact_detail' || $at=='grid_contact_select'){$theme=$tpl.' green notree';}
			elseif ($at=='grid_event' || $at=='grid_event_detail'){$theme=$tpl.' red notree';}
			elseif ($at=='settings'){$theme=$tpl.' gray notree';}
			elseif ($at=='grid_file'){$theme=$tpl.' orange notree';}
			elseif ($at=='grid_notes'){$theme=$tpl.' yellow notree';}
			elseif ($at=='grid_journal'){$theme=$tpl.' violet notree';}
			elseif ($at=='grid_task'){$theme=$tpl.' vine notree';}
			else {$theme=$tpl;}
		}
		else
		{
			$theme=$tpl.' blue';
		}
		$this->setTemplateData('theme',$theme);
	}
}

?>