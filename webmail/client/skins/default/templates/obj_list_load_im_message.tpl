<div class="obj_groupchat_item obj_groupchat_message{optional me} me{/optional}">
	<div class="message">
		{optional avatar}<div class="avatar unselectable"><span style="background-image: url('{avatar}')"></span></div>{/optional}
		<h3 class="name"><strong>{htmlspecialchars from}</strong><span class="time unselectable" title="{fulltime}">{time}</span></h3>

		<div class="border">
			<div class="body">
				{optional body}<div class="cell"><article>{body}</article></div>{/optional}
			</div>
			{optional addon}<div class="addon" id="{anchor addon}">{optional addon_body}{addon_body}{/optional}</div>{/optional}
		</div>
	</div>
</div>