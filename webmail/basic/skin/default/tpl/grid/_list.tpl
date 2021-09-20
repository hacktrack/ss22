<div>
	<div>
		<fieldset>
			<input type="hidden" name="_c" value="{info::controller}" />
			<input type="hidden" name="container" value="{container::id}" />
			<!--<input class="fancyButton" type="submit" name="_a[first_top]" value="&lt;&lt;" title="{lang::mail_view::first}"/>-->
			<input class="fancyButton" type="submit" name="_a[prev_top]" value="&lt;"  title="{lang::mail_view::prev}"/>
			<input type="text" name="_s[page_top]" value="{htmlspecialchars info::page}" class="shortText"/> / <strong>{info::total}</strong>
			<input type="submit" name="_a[refresh_top]" value="" class="hidden"/>
			<input class="fancyButton" type="submit" name="_a[next_top]" value="&gt;"  title="{lang::mail_view::next}"/>
			<!--<input class="fancyButton" type="submit" name="_a[last_top]" value="&gt;&gt;" title="{lang::mail_view::last}"/>-->
		</fieldset>
	</div>
	
</div>