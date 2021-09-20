<div id="listBox">
	<div class="right">
		<input type="hidden" name="_c" value="{info::controller}" />
		<input class="fancyButton" type="submit" name="_a[first]" value="&lt;&lt;" />
		<input class="fancyButton" type="submit" name="_a[prev]" value="&lt;" />
		<input type="text" name="_s[page]" value="{info::page}" class="shortText"/> / <strong>{info::total}</strong>
		<input class="fancyButton" type="submit" name="_a[next]" value="&gt;" />
		<input class="fancyButton" type="submit" name="_a[last]" value="&gt;&gt;" />
	</div>
	<div class="left">
		<select size="1" name="_a[dws]">
			<option value="">Do with selected:</option>
			<option value="delete">Delete</option>
			<option value="copy">Copy to:</option>
			<option value="move">Move to:</option>
			<option value="read">Mark as read</option>
			<option value="unread">Mark as unread</option>
			<option value="whitelist">Whitelist</option>
		</select>
		<input class="fancyButton" type="submit" value="Do it" />
	</div>
	<div class="cleaner"></div>
</div>