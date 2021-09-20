<!-- Permissions - Wizard -->
<div class="box-content-inner u-flexit u-margin-top" is-hidden="1" id="{anchor showless}">
	<div class="wizard">

	<!-- Permissions - Wizard - Inbox -->
	{include inc_wizard_item}
		{	"name": "folder_inbox",
			"title_text": "{PERMISSIONS::INBOX}",
			"help_text": "{PERMISSIONS_HELP::INBOX}",
			"button_text": "generic::share",
			"icon": "email"
		}
	{/include}

	<!-- Permissions - Wizard - Calendar -->
	{include inc_wizard_item}
		{	"name": "folder_calendar",
			"title_text": "{PERMISSIONS::CALENDAR}",
			"help_text": "{PERMISSIONS_HELP::CALENDAR}",
			"button_text": "generic::share",
			"icon": "expiration"
		}
	{/include}

	<!-- Permissions - Wizard - Contacts -->
	{include inc_wizard_item}
		{	"name": "folder_contacts",
			"title_text": "{PERMISSIONS::CONTACTS}",
			"help_text": "{PERMISSIONS_HELP::CONTACTS}",
			"button_text": "generic::share",
			"icon": "card"
		}
	{/include}

	<!-- Permissions - Wizard - Files -->
	{include inc_wizard_item}
		{	"name": "folder_files",
			"title_text": "{PERMISSIONS::FILES}",
			"help_text": "{PERMISSIONS_HELP::FILES}",
			"button_text": "generic::share",
			"icon": "documents"
		}
	{/include}

	</div>

	<obj name="btn_show_all_folders" type="obj_button" css="text primary full context" tabindex="true">
		<value>permissions::show_all_folders</value>
	</obj>
</div>

<!-- Permissions - Folder -->
<div class="box-content-inner u-flexit u-margin-top" id="{anchor tree}">
	<div class="folders">
		<ul id="{anchor folders}" class="folders-parent"></ul>
	</div>
	<obj name="btn_show_less" type="obj_button" css="text primary full context" tabindex="true">
		<value>permissions::show_less</value>
	</obj>
</div>

<!-- Permissions - Table -->
<div class="box-content-inner u-flexit" is-hidden="1" id="{anchor detail}">
	<obj name="list" type="obj_loadable">
		<label>obj_permissions_header</label>
		<value>obj_permissions_item</value>
	</obj>
	<obj name="btn_add" type="obj_button" css="text primary full context" tabindex="true">
		<value>permissions::add_new_user_or_domain</value>
	</obj>
</div>
