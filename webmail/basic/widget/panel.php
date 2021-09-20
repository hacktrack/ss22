<?php

class slWidgetPanel extends slWidget
{
	public function create($aConstruct)
	{
		parent::create($aConstruct);
		$this->setTemplateData('center',strval($aConstruct['xml']['center'])=='true'?true:false);
		$this->setTemplateData('id',$this->getProperty('id'));
		$this->setTemplateData('onclick',strval($aConstruct['xml']['onclick']));

		 		 		 		$tpl='fancy';

		$data = slRequest::instance();
		$at=str_replace(".",'_',$data->get('get._n.p.content'));
		$tp=str_replace(".",'_',$data->get('all._s.type'));
		if ($at!='')
		{
			$active[$at]=true;
			             if ($at=='settings' || $at=='settings_section' || $tp=='Q' || $tp=='QL'){$theme=$tpl.' lgray';}
			elseif ($at=='mail_main' || $at=='mail_drafts' || $at=='mail_view' || $at=='mail_compose' || $tp=='M'){$theme=$tpl.' blue';}
			elseif ($at=='search'){$theme=$tpl.' brown notree';}
			elseif ($at=='contact_main' || $at=='contact_detail' || $at=='contact_add' || $at=='contact_select' || $tp=='C'){$theme=$tpl.' green';}
			elseif ($at=='event_main' || $at=='event_detail' || $at=='event_add' || $tp=='E'){$theme=$tpl.' red';}
			elseif ($at=='tasks_main' || $at=='tasks_detail' || $at=='tasks_add' || $tp=='T'){$theme=$tpl.' cyan';}
			elseif ($at=='notes_main' || $at=='notes_detail' || $at=='notes_add' || $tp=='N'){$theme=$tpl.' yellow';}
			elseif ($at=='files_main' || $at=='files_detail' || $at=='files_add' || $tp=='F'){$theme=$tpl.' magenta';}
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