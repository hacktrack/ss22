<div class="cover-b wsto">
<div id="cover_a"><div id="cover_b">
<div class="commandLine">

</div>
<div id="sizerWatcher" class="wsto">

<div class="wsto spacer no_padding">

{optional request::all::folder::active}
<div class="infoLine">{lang::manage_folders::perform_action} <strong>"{folder::cid}"</strong></div>
{/optional}
{!optional request::all::folder::active}
<div class="infoLine">{lang::manage_folders::select_folder}</div>
{/optional}

<div class="right wsto">


{optional request::all::folder::active}
<div class="left">
	<div class="fmBox{!optional folder::_RIGHTS_::href} disabled{/optional}" id="fm_open">
		<div>
			<h5>
				{optional folder::_RIGHTS_::href}
				<a href="?_l=folder&p0=main&p1=content&p2={optional request::all::_s::type 'M'}mail.main{/optional}{optional request::all::_s::type 'C'}contact.main{/optional}{optional request::all::_s::type 'E'}event.main{/optional}{optional request::all::_s::type 'T'}tasks.main{/optional}{optional request::all::_s::type 'N'}notes.main{/optional}{optional request::all::_s::type 'F'}file.main{/optional}&p3=item.fdr&p4={folder::url_name}&p5={request::all::_s::type}" >{lang::manage_folders::open_folder}</a>
				{/optional}
				{!optional folder::_RIGHTS_::href}
				{lang::manage_folders::open_folder}
				{/optional}
			</h5>
			<p>
			{lang::manage_folders::open_folder_des}
			</p>
		</div>
	</div>
	
	
	
	
	
	<div class="fmBox{!optional folder::_RIGHTS_::default} disabled{/optional}" id="fm_default">
		<form action="" method="post">
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

			<h5>{lang::manage_folders::default_folder}</h5>
			<p>
			{lang::manage_folders::default_folder_des}
			</p>
			<div class="fm_actionBox">

				{optional request::all::_s::type 'M'}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::set_default_as}" class="fancyButton" name="_a[defaultFolder]"/>
					
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="D" name="_s[defaultFolderType]"/> {lang::manage_folders::as_drafts}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="S" name="_s[defaultFolderType]"/> {lang::manage_folders::as_sent}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="H" name="_s[defaultFolderType]"/> {lang::manage_folders::as_trash}
					<br />
				{/optional}
				{!optional request::all::_s::type 'M'}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::set_default}" class="fancyButton" name="_a[defaultFolder]"/>
				{/optional}
			</div>
		</form>
	</div>
	
	
	
	
	
	<div class="fmBox{!optional folder::_RIGHTS_::link}{!optional folder::_RIGHTS_::unlink} disabled{/optional}{/optional}" id="fm_link">
		<form action="" method="post">
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

			<h5>{lang::manage_folders::link_folder}</h5>
			<p>
			{lang::manage_folders::link_folder_des}
			</p>
			<div class="fm_actionBox">

				<input{!optional folder::_RIGHTS_::link} disabled="disabled"{/optional} type="text" name="folderLinkName"{optional folder::link_name} value="{folder::link_name}"{/optional}{!optional folder::link_name} value="{folder::name}"{/optional} name="_a[linkFolder]"/>

				<input{!optional folder::_RIGHTS_::link} disabled="disabled"{/optional} type="submit" value="{optional folder::link_name}{lang::manage_folders::rename}{/optional}{!optional folder::link_name}{lang::manage_folders::link}{/optional}" class="fancyButton" name="_a[linkFolder]"/>

				{optional folder::link_name}
				<input{!optional folder::_RIGHTS_::unlink} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::unlink}" class="fancyButton" name="_a[unlinkFolder]"/>
				{/optional}
			</div>
		</form>
	</div>
	<div class="fmBox{!optional folder::_RIGHTS_::add} disabled{/optional}" id="fm_new">
		<form action="" method="post">
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

			<h5>{lang::manage_folders::add_folder}</h5>
			<p>
			{lang::manage_folders::add_folder_dis}
			</p>
			<div class="fm_actionBox">
				<input{!optional folder::_RIGHTS_::add} disabled="disabled"{/optional} type="text" name="newFolderName2"/>
				<select name="folder[type]" size="1"{!optional folder::_RIGHTS_::add} disabled="disabled"{/optional}>
					{dynamic settings::foldertypes}<option value="{*::type}"{optional *::selected} selected="selected"{/optional}>{*::label}</option>{/dynamic}
				</select>
				<input{!optional folder::_RIGHTS_::add} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::create}" class="fancyButton" name="_a[addFolder]"/>
			</div>
		</form>
	</div>
	<div class="fmBox{!optional folder::_RIGHTS_::rename} disabled{/optional}" id="fm_edit">
		<form action="" method="post">
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

			<h5>{lang::manage_folders::rename_folder}</h5>
			<p>
			{lang::manage_folders::rename_folder_des}
			</p>
			<div class="fm_actionBox">
				<input{!optional folder::_RIGHTS_::rename} disabled="disabled"{/optional} type="text" name="newFolderName" value="{folder::name}"/>
				<input{!optional folder::_RIGHTS_::rename} disabled="disabled"{/optional} type="submit" name="_a[editFolder]" value="{lang::manage_folders::save}" class="fancyButton"/>
			</div>
		</form>
	</div>
	<div class="fmBox{!optional folder::_RIGHTS_::delete}{!optional folder::_RIGHTS_::empty} disabled{/optional}{/optional}" id="fm_remove">
		<form action="" method="post">
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

			<h5>{lang::manage_folders::remove_folder}</h5>
			<p>
			{lang::manage_folders::remove_folder_des}
			</p>
			<div class="fm_actionBox">
				<input alt="{lang::manage_folders::delete_confirmation_text}" {!optional folder::_RIGHTS_::delete} disabled="disabled"{/optional} type="submit" name="_a[deleteFolder]" value="{lang::manage_folders::delete}" class="fancyButton"/>
				<input alt="{lang::manage_folders::empty_confirmation_text}"{!optional folder::_RIGHTS_::empty} disabled="disabled"{/optional} type="submit" name="_a[emptyFolder]" value="{lang::manage_folders::empty}" class="fancyButton"/>
			</div>
		</form>
	</div>
</div>
{/optional}

{!optional request::all::folder::active}

<form id="{id}"{optional name} name="{name}"{/optional}{optional method} method="{method}"{/optional}{optional enctype} enctype="{enctype}"{/optional} action="?_n[p][content]=manage.folders">

<input type="hidden" name="_c" value="folder"/>
<input type="hidden" name="type" value="{request::all::_s::type}"/>
{!optional request::all::_done}
{optional request::all::folder::action 'addNode'}
	<div class="header_like">
		<div class="bold">{lang::manage_folders::create_folder}</div>

		<input type="text" name="newFolderName"/>
		<select name="folder[type]" size="1">
			{dynamic settings::foldertypes}<option value="{*::type}"{optional *::selected} selected="selected"{/optional}>{*::label}</option>{/dynamic}
		</select>
		<input type="submit" value="{lang::manage_folders::create}" class="fancyButton"/>

		<input type="hidden" name="folder[action]" value="{request::all::folder::action}"/>
		<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>
		<input type="hidden" name="_a[addFolder]" value="1"/>
	</div>
{/optional}
{optional request::all::folder::action 'deleteNode'}
	<div class="header_like">
		<div class="bold">{lang::manage_folders::delete_empty_folder}</div>
		<div class="small">({request::all::folder::active})</div>
		{lang::manage_folders::delete_confirmation_text}
		<input type="hidden" name="folder[action]" value="{request::all::folder::action}"/>
		<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>
		{!optional request::all::dis 'delete'}
		<input type="submit" name="_a[deleteFolder]" value="{lang::manage_folders::delete}" class="fancyButton"/>
		{/optional}
		<input type="submit" name="_a[emptyFolder]" value="{lang::manage_folders::empty}" class="fancyButton"/>
		<input type="submit" name="_a[redirect]" value="{lang::manage_folders::delete_no}" class="fancyButton"/>
	</div>
{/optional}
{optional request::all::folder::action 'editNode'}
	<div class="header_like">
		<div class="bold">{lang::manage_folders::rename_folder}</div>
		<div class="small">({request::all::folder::active})</div>
		<input type="text" name="newFolderName"{optional request::all::folderName} value="{request::all::folderName}"{/optional}/> <input type="submit" name="_a[editFolder]" value="{lang::manage_folders::save}" class="fancyButton"/>
		<input type="hidden" name="folder[action]" value="{request::all::folder::action}"/>
		<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>
	</div>
{/optional}
{optional request::all::folder::action 'linkNode'}
	<div class="header_like">
		<div><div class="bold">{lang::manage_folders::link_as}</div><div class="small">({optional request::all::folder::active}{request::all::folder::active}{/optional})</div></div>
		<input type="text" name="folderLinkName"{optional request::all::link_name} value="{request::all::link_name}"{/optional}/> <input type="submit" value="{lang::manage_folders::link}" class="fancyButton"/>
		<input type="hidden" name="folder[action]" value="{request::all::folder::action}"/>
		<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>
		<input type="hidden" name="_a[linkFolder]" value="1"/>
	</div>
{/optional}
{optional request::all::folder::action 'unlinkNode'}
	<div class="header_like">
		<div class="bold">{lang::manage_folders::unlink_as}</div>
		<div class="small">({request::all::folder::active})</div>
		<input type="hidden" name="folder[action]" value="{request::all::folder::action}"/>
		<input type="hidden" name="folder[active]" value="{request::all::folder::active}"/>

		<div>

		<input type="text" name="folderLinkName"{optional request::all::link_name} value="{request::all::link_name}"{/optional}/>

		<input type="submit" name="_a[renameLink]" value="{lang::manage_folders::rename}" class="fancyButton"/>

		</div>
		<div>

		{lang::manage_folders::unlink_confirmation_text}
		<input type="submit" name="_a[unlinkFolder]" value="{lang::manage_folders::unlink_yes}" class="fancyButton"/>
		<input type="submit" name="_a[redirect]" value="{lang::manage_folders::unlink_no}" class="fancyButton"/>

		</div>

	</div>
{/optional}
{/optional}

<div class="spacer">
{anchor::mf}
</div>

</form>

{/optional}


</div>




<div class="cleaner"></div>
</div>
</div>
</div>
</div>
</div>