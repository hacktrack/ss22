<div class="wm_block_div">
	{optional canceled}<h1>{MAIL_VIEW::CANCELED}</h1>{/optional}
	<h2>{summary}</h2>

	<table>
		{optional date}
		<tr>
			<th class="lbl">
				{optional original_date}
					{MAIL_VIEW::PROPOSED_TIME}
				{/optional}
				{noptional original_date}
					{MAIL_VIEW::TIME}
				{/noptional}:
			</th><td>{date}{optional rcr} <em>({MAIL_VIEW::RECURRENT})</em>{/optional}{optional ocr} <em>({MAIL_VIEW::OCCURRENCE})</em>{/optional}</td>
		</tr>
		{/optional}

		{optional original_date}
		<tr>
			<th class="lbl">{MAIL_VIEW::CURRENT_TIME}:</th><td>{original_date}</td>
		</tr>
		{/optional}

		{optional attendee}
		<tr>
			<th class="lbl">{MAIL_VIEW::ATTENDEE}:</th><td>{attendee}</td>
		</tr>
		{/optional}

		{optional location}
		<tr>
			<th class="lbl">{MAIL_VIEW::LOCATION}:</th><td>{location}</td>
		</tr>
		{/optional}

		{optional comment}
		<tr>
			<th class="lbl">{MAIL_VIEW::COMMENT}:</th><td class="pre">{comment}</td>
		</tr>
		{/optional}

		{optional tags}
		<tr>
			<th class="lbl">{DATAGRID_ITEMS_VIEW::ITMCATEGORY}:</th>
			<td class="tags">
			{dynamic tags}
				<span style="background-color: {tags::*::TAGCOLOR}">{htmlspecialchars tags::*::TAGNAME}</span>
			{/dynamic}
			</td>
		</tr>
		{/optional}

		{optional description}
		<tr>
			<th class="lbl">{MAIL_VIEW::DESCRIPTION}:</th><td>{description}</td>
		</tr>
		{/optional}
	</table>

	{noptional disabled}
	<form>
		<input type="hidden" name="partid" value="{pid}" />
		<input type="hidden" name="imip_type" value="{imip_type}" />
		<input type="hidden" name="imip_method" value="{imip_method}" />
		{optional import_only}
		<input type="button" class="obj_button color1" name="accept" value="{MAIL_VIEW::IMPORT}" />
		{/optional}
		{noptional import_only}
		<input type="button" class="obj_button color1" name="accept" value="{MAIL_VIEW::ACCEPT}" />
		<input type="button" class="obj_button color2" name="decline" value="{MAIL_VIEW::DECLINE}" />
		{noptional organiser}
		{optional timecontrols}
		<input type="button" class="obj_button color3" name="tentative" value="{MAIL_VIEW::TENTATIVE}" />

		{noptional groupchat}
		<input type="button" class="obj_button inverted" name="propose" value="{MAIL_VIEW::PROPOSE}" />
		{/noptional}

		{/optional}
		{/noptional}
		{/noptional}
	</form>
	{/noptional}
</div>
