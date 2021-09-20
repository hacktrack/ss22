<div class="box-head">
	<div class="box-head-left">
		<div class="box-head-back" id="{anchor box_head_back}" is-hidden="1">
			<obj name="btn_back" type="obj_button" css="icon icon-arrow-back" tabindex="true"></obj>
		</div>
		<div class="box-head-info">
			<h2 class="box-head-title beta" id="{anchor heading}"></h2>
		</div>
	</div>
	<div class="box-head-right">
		<div>
			<obj name="btn_search_icon" type="obj_button" css="button obj_button icon icon-search-circle borderless" tabindex="true"></obj>
		</div>
		<div id="{anchor heading_buttons}"></div>
		<div>
			<obj name="btn_heading" type="obj_button" css="text success hide box-main-action" tabindex="true"></obj>
		</div>
	</div>
	<!-- Topbar - Search -->
	<div class="topbar" iw-type="search" id="{anchor topbar}">
		<div class="menu left" iw-type="icon">
			<obj name="btn_search" type="obj_button" css="icon icon-search-circle topbar-search-icon borderless" tabindex="true"></obj>
		</div>
		<div class="topbar-center topbar-search">
			<div class="topbar-search-result">
				<span id="{anchor search_query}"></span> - <span class="weight-600"><span id="{anchor search_results}">0</span> {GENERIC::RESULTS}</span>
			</div>
			<obj name="input_search" type="obj_input_search" css="topbar-search-input" tabindex="true">
				<placeholder>other::search_placeholder</placeholder>
			</obj>
		</div>
		<div class="menu right" iw-type="icon">
			<obj name="btn_close_search" type="obj_button" css="icon icon-close topbar-search-close borderless" tabindex="true"></obj>
		</div>
	</div>
</div>
<div class="box-body">
	<div class="box-action" id="{anchor action_menu}">
		<div class="menu" iw-type="tab" iw-location="box" iw-subtype="action">
			<div class="menu-item" id="{anchor heading_button_mobile}">
				<obj name="btn_save_2" type="obj_button" css="button text success full" tabindex="true">
					<value>generic::save</value>
				</obj>
			</div>
			<div class="menu-item" id="{anchor heading_buttons_mobile}"></div>
		</div>
	</div>
	<div class="box-menu" id="{anchor tab_menu}">
		<obj name="left_menu" type="obj_tabmenu" iw-type="tab" iw-location="box"></obj>
	</div>
	<div class="box-content" id="{anchor main_content}"></div>
</div>
<div class="box-foot hide" id="{anchor foot}">
</div>
