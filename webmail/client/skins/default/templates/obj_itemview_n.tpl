<div class="itemview itemview_n">
	<h1>{htmlspecialchars title}</h1>
	<h2>{date}</h2>

	<table class="frmtbl frmtbl100">
		{optional note}
		<tr><td class="space">&nbsp;</td></tr>
		<th class="th">{CONTACT::NOTES}</th>
		<tr><td id="{anchor note}" class="view_note">{note}</td></tr>
		{/optional}

		{optional att}
		<tr><td class="space">&nbsp;</td></tr>
		<tr>
			<th class="th">{ATTACHMENT::ATTACHMENTS}</th>
		</tr>
		<tr>
			<td>
			{dynamic att}
			<div class="attach{optional att::*::ico} type_{att::*::ico}{/optional}">
				<a href="{att::*::link}" class="att{optional att::*::ico} ico_{att::*::ico}{/optional}" target="{_ins}.frame" title="{htmlspecialchars att::*::title}" rel="{htmlspecialchars att::*::id}">{optional att::*::size} <span>{htmlspecialchars att::*::size}</span>{/optional}{htmlspecialchars att::*::title}</a>
				{optional att::*::play}<obj name="X_play" type="obj_button_play" css="simple"><src>{htmlspecialchars att::*::play}</src><title>{htmlspecialchars att::*::title}</title></obj>{/optional}
			</div>
			{/dynamic}
			<iframe name="{_ins}.frame" id="{_ins}.frame" class="att"></iframe>
			</td>
		</tr>
		{/optional}

		{optional tags}
		<tr><td class="space">&nbsp;</td></tr>
		<tr>
			<th class="th">{TAGS::TAGS}</th>
		</tr>
		<tr>
			<td class="td">
				<div class="tags">
					{dynamic tags}
					<a href="javascript: void();" {optional tags::*::tagcolor}style="background-color: {htmlspecialchars tags::*::tagcolor}; color: {tags::*::textcolor}"{/optional}>{htmlspecialchars tags::*::tagname}</a>
					{/dynamic}
				</div>
			</td>
		</tr>
		{/optional}
	</table>
</div>