<ul>
{optional notifications}{dynamic notifications}<li data-id="{notifications::*::id}" class="{notifications::*::type}">
	<div class="avatar">
		<img src="{notifications::*::avatar}" />
		<div class="ico ico_{notifications::*::icon}"></div>
	</div>
	<div class="text">
		<div class="first_line{noptional notifications::*::second_line} single_line{/noptional}">{notifications::*::first_line}</div>
		{optional notifications::*::second_line}<div class="second_line">{notifications::*::second_line}</div>{/optional}
		<div class="time">{notifications::*::time}{optional notifications::*::room} / {notifications::*::room}{/optional}</div>
	</div>
</li>{/dynamic}{/optional}
</ul>
