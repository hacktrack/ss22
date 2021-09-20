<div class="right topFix7">
	<input type="hidden" name="_c" value="{info::controller}" />
	<input type="hidden" name="container" value="{container::id}" />
	
	<input {!optional info::hasPrev}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[prev_top]" value="&lt;" title="{lang::mail_view::prev}"/>
	<strong><input type="text" value="{htmlspecialchars info::page}" name="_s[page_top]" class="oneChar" id="pageTop"/> / {info::total}</strong>
	<input {!optional info::hasNext}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[next_top]" value="&gt;" title="{lang::mail_view::next}"/>
	
	<input type="hidden" value="1" id="pageTop_hidden"/>
</div>