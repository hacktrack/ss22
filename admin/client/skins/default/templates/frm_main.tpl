<header class="header">

	<!-- Topbar - Main -->
	<nav class="topbar" iw-type="main">
		<div class="menu left" iw-type="button">
			<obj name="btn_menu_main" type="obj_button" css="icon icon-menu" tabindex="true"></obj>
			<obj name="btn_menu_home" type="obj_button" css="icon icon-home hide" tabindex="true"></obj>
			<obj name="btn_menu_add" type="obj_button" css="icon icon-add" tabindex="true"></obj>
		</div>
		{optional cloudserver}<span class="badge badge--dashboard">{cloudserver}</span>{/optional}
		<div class="menu right" iw-type="button">
			<obj name="btn_search_icon" type="obj_button" css="icon icon-search-circle borderless" tabindex="true" title="main::search">
				<disabled>1</disabled>
			</obj>
			<div class="usermenu" id="{anchor usermenu}" tabindex="true">
				<div class="usermenu__userhead userhead icon-user_default" id="{anchor usermenu_userhead}">
					<div class="userhead-image" id="{anchor usermenu_image}"></div>
					<i class="icon-user_rank usermenu__rank" id="{anchor usermenu_rank}"></i>
				</div>
				<div class="usermenu__text">
					<p class="usermenu__name" id="{anchor usermenu_name}"></p>
					<p class="usermenu__email" id="{anchor usermenu_email}"></p>
				</div>
				<i class="icon-dropdown-arrow usermenu__icon"></i>
			</div>
		</div>
		<obj name="btn1" type="obj_button" css="text primary hide" tabindex="true">
			<value>main::logout</value>
		</obj>
	</nav>

	<!-- Topbar - Search -->
	<div class="topbar" iw-type="search" id="{anchor topbar}">
		<div class="menu left" iw-type="button">
			<obj name="btn_search" type="obj_button" css="icon icon-search-circle topbar-search-icon borderless" tabindex="true" title="main::search"></obj>
		</div>
		<div class="topbar-center topbar-search">
			<div class="topbar-search-result">
				<span class="topbar-search-result-text" id="{anchor search_query}"></span> - <span class="weight-600"><span id="{anchor search_results}">0</span> {GENERIC::RESULTS}</span>
			</div>
			<obj name="input_search" type="obj_input_search" css="topbar-search-input" tabindex="true">
				<placeholder>other::search_placeholder</placeholder>
			</obj>
		</div>
		<div class="menu right" iw-type="icon">
			<obj name="btn_close_search" type="obj_button" css="icon icon-close topbar-search-close borderless" tabindex="true"></obj>
		</div>
	</div>

</header>
<aside class="main-menu" id="{anchor aside_main_menu}"></aside>
<aside class="main-menu" id="{anchor aside_menu}"></aside>
<aside class="main-menu main-menu--right main-menu--colored" id="{anchor user_menu}"></aside>
<main class="content-main">
	<div class="content-topbars" id="{anchor topbars}"></div>
	<div class="content-boxes" id="{anchor main_box}">
		<obj name="main" type="frm_box"></obj>
	</div>
</main>
<div class="toast" id="{anchor toast}">
	<span class="toast-message" id="{anchor toast_text}"></span>
	<a href="#" class="toast-close" id="{anchor toast_close}">&times;</a>
</div>
<iframe is-hidden="1" id="{anchor download}"></iframe>
