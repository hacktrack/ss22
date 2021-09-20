<div class="container" id="{anchor attach}"></div>
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

		<tr>
			<td colspan="2" class="space">&nbsp;</td>
		</tr>

		<tr>
			<td class="min-width">
				{ATTACHMENT::SAVE_TO_FOLDER}
			</td>
			<td>
				<table class="full_width">
					<tr>
						<td class="folder"><div id="{anchor folder}"></div></td>
						<td class="min-width change_folder">
							<obj name="x_folders" type="obj_button" tabindex="true"><value>ATTENDEES::FOLDER</value></obj>
						</td>
					</tr>
				</table>
			</td>
		</tr>

		<tr>
			<td class="separator unselectable" colspan="2" id="{anchor separator}"><div id="{anchor separator_text}" class="text">{DOCUMENT::SHOW_MORE_OPTIONS}</div></td>
		</tr>

		<tr height="100%">
			<td class="min-width">
				{FILE::DESCRIPTION}
			</td>
			<td>
				<obj name="EVNNOTE" type="obj_wysiwyg" css="border2" tabindex="true"><placeholder>FILE::DESCRIPTION_PLACEHOLDER</placeholder></obj>
			</td>
		</tr>

		<tr>
			<td colspan="2" class="space">&nbsp;</td>
		</tr>

		<tr>
			<td class="min-width">
				{DATAGRID_ITEMS_VIEW::ITMCATEGORY}
			</td>
			<td colspan="2">
				<obj name="EVNTYPE" type="obj_categories" tabindex="true"></obj>
			</td>
		</tr>
		{/noptional}
	</table>
</div>
