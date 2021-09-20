<div class="topFix7">
	<input type="hidden" name="_c" value="{info::controller}" />
	<input type="hidden" name="container" value="{container::id}" />
	<!--<input {!optional info::hasPrev}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[first_bottom]" value="&lt;&lt;" title="{lang::mail_view::first}"/>-->
	
	<input {!optional info::hasPrev}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[prev_bottom]" value="&lt;" title="{lang::mail_view::prev}"/>
	 <strong><input type="text" value="{htmlspecialchars info::page}" name="_s[page_bottom]" class="oneChar" id="pageBottom"/> / {info::total}</strong>
	<input {!optional info::hasNext}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[next_bottom]" value="&gt;" title="{lang::mail_view::next}"/>
	<!--<input {!optional info::hasNext}disabled="disabled"{/optional} class="fancyButton" type="submit" name="_a[last_bottom]" value="&gt;&gt;" title="{lang::mail_view::last}"/>-->
	<input type="hidden" name="" value="1" id="pageBottom_hidden"/>
</div>