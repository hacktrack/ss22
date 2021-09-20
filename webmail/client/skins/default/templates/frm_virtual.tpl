<div class="popupmaindialog">
	<div class="general_container">
		<table class="frmtbl frmtbl100 top_table">
			<tr>
			    <th class="th">{FORM_FOLDERS::NAME}</th>
				<td class="td">
				<obj name="name" type="obj_input" css="obj_input_100" tabindex="true" focus="true">
					<restrictions>
						<item>![/\\:\*\?\"&lt;\|&gt;\~]+</item>
						<item>.+</item>
					</restrictions>
				</obj>
				</td>
			</tr>
			<tr>
			    <th class="th">{FORM_FOLDERS::TYPE}</th>
				<td><obj name="select_type" type="obj_select" tabindex="true"></obj></td>
			</tr>
			<tr>
			    <th class="th">{FORM_FOLDERS::SHARETYPE}</th>
				<td><obj name="share" type="obj_select" tabindex="true"></obj></td>
			</tr>
			<tr><td class="space" colspan="2">&nbsp;</td></tr>
			<tr>
			    <th>{VIRTUAL::FILTER}</th>
				<td><obj name="search" type="obj_suggest_search" css="obj_input_100" tabindex="true"></obj></td>
			</tr>
		</table>
		
		<div class="folder_container">
			<div class="maxbox">
				<obj name="tree" type="obj_tree_folder" css="border"><init><item>{aid}</item><item>{type}</item><item></item><item>1</item></init></obj>
				<obj name="add" type="obj_button" css="ico img play simple"></obj>
			</div>

			<div class="list_container">
				<obj name="list" type="obj_datagrid" css="border"></obj>
			</div>

			<table class="tbl_buttons">
				<tr>
			    	<td><obj name="btn_remove" type="obj_button"><value>FORM_BUTTONS::REMOVE</value><disabled>1</disabled></obj></td>
			    </tr>
			</table>
		</div>
	</div>	
</div>