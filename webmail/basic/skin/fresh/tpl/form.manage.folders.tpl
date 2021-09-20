

<div class="body">

{optional request::all::folder::active}
<div>
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

	<div class="fmBox{!optional folder::_RIGHTS_::link}{!optional folder::_RIGHTS_::unlink} disabled{/optional}{/optional}" id="fm_link">
		<div>
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{htmlspecialchars request::all::folder::active}"/>

			<h5>{lang::manage_folders::link_folder}</h5>
			<p>
			{lang::manage_folders::link_folder_des}
			</p>
			<div class="fm_actionBox">

				<input{!optional folder::_RIGHTS_::link} disabled="disabled"{/optional} type="text" class="inp_text" name="folderLinkName"{optional folder::link_name} value="{folder::link_name}"{/optional}{optional folder::link_name} value="{folder::link_name}"{/optional} name="_a[linkFolder]"/>

				<input{!optional folder::_RIGHTS_::link} disabled="disabled"{/optional} type="submit" value="{optional folder::link_name}{lang::manage_folders::rename}{/optional}{!optional folder::link_name}{lang::manage_folders::link}{/optional}" class="inp_btn" name="_a[linkFolder]"/>

				{optional folder::link_name}
				<input{!optional folder::_RIGHTS_::unlink} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::unlink}" class="inp_btn" name="_a[unlinkFolder]"/>
				{/optional}
			</div>
		</div>
	</div>
	
	<div class="fmBox{!optional folder::_RIGHTS_::add}{!optional request::all::folder::active '#'} disabled{/optional}{/optional}" id="fm_new">
		<div>
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{htmlspecialchars request::all::folder::active}"/>

			<h5>{lang::manage_folders::add_folder}</h5>
			<p>
			{lang::manage_folders::add_folder_dis}
			</p>

			<div class="fm_actionBox">
				<table>
				    <tr>
				    	<td class="rspace"><input{!optional folder::_RIGHTS_::add}{!optional request::all::folder::active '#'} disabled="disabled"{/optional}{/optional} type="text" class="inp_text" name="newFolderName2"/></td>
				    	<td class="rspace">
							<select name="folder[type]" size="1"{!optional folder::_RIGHTS_::add}{!optional request::all::folder::active '#'} disabled="disabled"{/optional}{/optional}>
								{dynamic settings::foldertypes}{optional *::type}<option value="{.*::type}"{optional *::selected} selected="selected"{/optional}>{.*::label}</option>{/optional}{/dynamic}
							</select>
						</td>
				    	<td><input{!optional folder::_RIGHTS_::add}{!optional request::all::folder::active '#'} disabled="disabled"{/optional}{/optional} type="submit" value="{lang::manage_folders::create}" class="inp_btn" name="_a[addFolder]"/></td>
				    </tr>
				</table>
			</div>
		</div>
	</div>
	
	<div class="fmBox{!optional folder::_RIGHTS_::rename} disabled{/optional}" id="fm_edit">
		<div>
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{htmlspecialchars request::all::folder::active}"/>

			<h5>{lang::manage_folders::rename_folder}</h5>
			<p>
			{lang::manage_folders::rename_folder_des}
			</p>
			<div class="fm_actionBox">
				<input{!optional folder::_RIGHTS_::rename} disabled="disabled"{/optional} type="text" class="inp_text" name="newFolderName" value="{optional folder::name}{folder::name}{/optional}"/>
				<input{!optional folder::_RIGHTS_::rename} disabled="disabled"{/optional} type="submit" name="_a[editFolder]" value="{lang::manage_folders::save}" class="inp_btn"/>
			</div>
		</div>
	</div>
	
	<div class="fmBox{!optional folder::_RIGHTS_::default} disabled{/optional}" id="fm_default">
		<div>
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{htmlspecialchars request::all::folder::active}"/>

			<h5>{lang::manage_folders::default_folder}</h5>
			<p>
			{lang::manage_folders::default_folder_des}
			</p>
			<div class="fm_actionBox">

				{optional request::all::_s::type 'M'}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="D" name="_s[defaultFolderType]"/> {lang::manage_folders::as_drafts}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="S" name="_s[defaultFolderType]"/> {lang::manage_folders::as_sent}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="radio" value="H" name="_s[defaultFolderType]"/> {lang::manage_folders::as_trash}

					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::set_as_default}" class="inp_btn" name="_a[defaultFolder]"/>
				{/optional}
				{!optional request::all::_s::type 'M'}
					<input{!optional folder::_RIGHTS_::default} disabled="disabled"{/optional} type="submit" value="{lang::manage_folders::default_folder}" class="inp_btn" name="_a[defaultFolder]"/>
				{/optional}
			</div>
		</div>
	</div>
	
	<div class="fmBox{!optional folder::_RIGHTS_::delete}{!optional folder::_RIGHTS_::empty} disabled{/optional}{/optional}" id="fm_remove">
		<div>
			<input type="hidden" name="_c" value="folder"/>
			<input type="hidden" name="type" value="{request::all::_s::type}"/>
			<input type="hidden" name="folder[active]" value="{htmlspecialchars request::all::folder::active}"/>

			<h5>{lang::manage_folders::remove_folder}</h5>
			<p>
			{lang::manage_folders::remove_folder_des}
			</p>
			<div class="fm_actionBox">
				<input alt="{lang::manage_folders::delete_confirmation_text}" {!optional folder::_RIGHTS_::delete} disabled="disabled"{/optional} type="submit" name="_a[deleteFolder]" value="{lang::manage_folders::delete}" class="inp_btn"/>
				<input alt="{lang::manage_folders::empty_confirmation_text}"{!optional folder::_RIGHTS_::empty} disabled="disabled"{/optional} type="submit" name="_a[emptyFolder]" value="{lang::manage_folders::empty}" class="inp_btn"/>
			</div>
		</div>
	</div>
</div>
{/optional}

{!optional request::all::folder::active}

<div class="spacer">
{anchor::mf}
</div>

{/optional}


</div>



