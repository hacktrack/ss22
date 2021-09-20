<div iw-flex-grid="fit" class="wizard__item" id="{_ins}#fi_{name}">
	{optional icon}
	<span iw-flex-cell="none" class="wizard__icon icon-{icon} color-{optional icon_color}{icon_color}{/optional}{noptional icon_color}primary{/noptional}"></span>
	{/optional}
	<div iw-flex-cell="fit" class="wizard__text">
		<h4 class="wizard__title">{title_text}</h4>
		<p class="wizard__help">{help_text}</p>
	</div>
	<div iw-flex-cell="none">
		<obj name="button_{name}" type="obj_button" css="text {optional button_color}{button_color}{/optional}{noptional button_color}primary{/noptional} full" tabindex="true">
			<value>{button_text}</value>
		</obj>
	</div>
</div>
