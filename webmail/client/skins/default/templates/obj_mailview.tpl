<div class="maxbox relative">
<div id="{anchor block}" class="maxbox">
<table class="header_container frmtbl frmtbl100 nospace empty" id="{anchor message}">
 	<tr>
		<td class="header_container">
			<table class="frmtbl frmtbl100">
 				<tr id="{anchor top}">
					<td width="100%"><h2 id="{anchor subject}"></h2></td>
					<th width="0%" id="{anchor date}" class="th date"></th>
					<th width="0%" rowspan="2" id="{anchor avatar}" class="avatar"></th>
				</tr>
				<tr>
					<td id="{anchor from}"></td>
					<th id="{anchor teamchat}">
						<obj type="obj_button" name="copy_to_teamchat" css="transparent ico teamchat"><value>POPUP_ITEMS::COPY_ITEM_TO_TEAMCHAT</value></obj>
					</th>
				</tr>
 			</table>
 			<!-- separated because of Chrome -->
			<table class="frmtbl frmtbl100">
				<tr>
					<td id="{anchor container}" class="td_container">
						<table width="100%" class="header">
							<tbody id="{anchor header}"></tbody>
						</table>
					</td>
				</tr>
 			</table>

			<div id="{anchor player}" class="player"></div>

			<pre id="{anchor pre}"></pre>

			<div id="{anchor smart}" class="infobox smart">{MAIL_VIEW::SMART}</div>
			<a id="{anchor show}" class="infobox show_image">{MAIL_VIEW::SHOW_IMG}</a>
			<a id="{anchor skip}" class="infobox skip_image">{MAIL_VIEW::SKIP_IMG}</a>
			<a id="{anchor deferred}" class="infobox deferred"></a>
			<div id="{anchor serror}" class="infobox serror">{MAIL_VIEW::SERROR}</div>
		</td>
	</tr>
	<tr>
		<td class="body_container"><iframe id="{anchor frame}" frameborder="0" marginwidth="0" marginheight="0" name="{anchor frame}" scrolling="no" seamless="seamless"></iframe></td>
	</tr>
</table>
</div>
</div>
