<div class="popupmaindialog">
<table class="frmtbl frmtbl100">
	<tr>
		<td colspan="2" id="{anchor icon}"></td>
	</tr>

	<tr>
		<td class="min-width">
			{FILE::NAME}
		</td>
		<td>
			<table class="full_width">
				<tr>
					<td class="input">
						<input class="full_width name" id="{anchor name}">
					</td>
					<td class="min-width extension">
						<div id="{anchor extension}"></div>
					</td>
				</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	<tr>
		<td class="min-width">
			{DATAGRID_ITEMS_VIEW::EVNLOCATION}
		</td>
		<td>
			<table class="full_width">
				<tr>
					<td class="folder" id="{anchor folder}"></td>
					<td class="min-width change_folder">
						<obj name="x_folders" type="obj_button" tabindex="true"><value>ATTENDEES::FOLDER</value></obj>
					</td>
				</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	{optional teamchat}
	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>
	<tr height="100%">
		<td class="min-width">
			{FILE::DESCRIPTION}
		</td>
		<td id="{anchor text}"></td>
	</tr>
	<tr class="hidden" hidden>
		<td>
			<div id="{anchor folder}"></div>
			<obj name="x_folders" type="obj_button" tabindex="true"><value>ATTENDEES::FOLDER</value></obj>
		</td>
	</tr>
	{/optional}

	{noptional teamchat}
	<tr height="100%">
		<td class="min-width">
			{FILE::DESCRIPTION}
		</td>
		<td id="{anchor msiebox}" class="msiebox">
			<div class="msiebox">
				<obj name="EVNNOTE" type="obj_wysiwyg" css="border2" tabindex="true"><placeholder>FILE::DESCRIPTION_PLACEHOLDER</placeholder></obj>
			</div>
		</td>
	</tr>
	{/noptional}

	<tr>
		<td colspan="2" class="space">&nbsp;</td>
	</tr>

	<tr id="{anchor tags_row}">
		<td class="min-width">
			{DATAGRID_ITEMS_VIEW::ITMCATEGORY}
		</td>
		<td colspan="2">
			<obj name="EVNTYPE" type="obj_categories" tabindex="true"></obj>
		</td>
	</tr>
</table>
</div>
