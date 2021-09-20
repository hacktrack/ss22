<div class="grey center">

	<input type="hidden" name="_c" value="{info::controller}" />
	<input type="hidden" name="container" value="{container::id}" />

	<table style="width:100%">
		<tr>
			<td style="text-align:left; padding-left:10px;">
				<input type="submit" name="_a[first]" value="&lt;&lt;" class="button pager small ico_fast_prev" />
				<input type="submit" name="_a[prev]" value="&lt;" class="button pager small ico_prev" />
			</td>
			<td style="text-align:center">
				<input type="text" name="_s[page]" value="{info::page}" class="small" /><strong> / {info::total}</strong>
			</td>
			<td style="text-align:right; padding-right:10px;">
				<input type="submit" name="_a[next]" value="&gt;" class="button pager small ico_next" />
				<input type="submit" name="_a[last]" value="&gt;&gt;" class="button pager small ico_fast_next" />
			</td>
		</tr>
		
	</table>
</div>