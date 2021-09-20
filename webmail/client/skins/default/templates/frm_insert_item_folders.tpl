<div class="frm_insert_item_container">
<div class="frm_insert_item_container2">
	<div class="filter_tree" id="{anchor filter_tree}" ><obj name="filter" type="obj_view_filter" css="inverted"></obj></div>
	<div class="leftdiv">
		<div class="leftdiv2" id="{anchor tree}"></div>
	</div>

	<div class="rightdiv"><obj name="datagrid" type="obj_datagrid2"><init>1</init></obj></div>

	<div class="upload hidden">
		<img class="icon" src="{_skin}/images/comp_upload48.svg">
		<div class="title">{IM::UPLOAD_FILE_HELPER}</div>
		<div class="subtitle">{IM::UPLOAD_FILE_SUBHELPER}</div>
		<div class="button">
			<obj name="upload_button" type="obj_button" tabindex="true"><value>MAIN_MENU::NEW_UPLOAD</value></obj>
		</div>
		<div class="helper">
			<div class="image"></div>
			<div class="helper_tip">{IM::UPLOAD_FILE_SUBHELPER_TIP}</div>
		</div>
	</div>

	<div class="bottomdiv">
		<obj name="radio" type="obj_radio">
			<value>embedded</value>
			<fill>
				<item key="embedded">INSERT_ITEM::EMBEDDED</item>
				<item key="link">INSERT_ITEM::LINK</item>
			</fill>
		</obj>
	</div>

</div>
</div>
<div class="topdiv" id="{anchor search}"><div class="label">{SEARCH::IN_FILES}<div class="icon"></div></div><obj name="search" type="obj_item_search"></obj></div>