{optional type 'multiple'}
<input type="checkbox" name="{variable}[{*::id}]"{optional *::checked} checked="checked"{/optional}/>
{/optional}
{optional type 'single'}
<input type="radio" name="{variable}" value="{*::id}"{optional *::checked} checked="checked"{/optional}/>
{/optional}
{optional type 'none'}{/optional}
{!optional type}{/optional}