/**
 * @author      Milan Kolcak <kolcakmilan@gmail.com>
 * @link        https://www.facebook.com/MilanKolcak
 * @link        https://plus.google.com/u/0/115293588588082222794
 * @created on	05.09.
 * @copyright   2013
 * @version     1.0.0
 */

var hello = {};

hello.identifiers = 
{
	namespace: 'hello',
			
	document_disable_select: false,
	document_disable_ignor: '.__selectable', //@todo: momentalne nefunkcne len priprava
			
	init_data: 'init',
	init_args_separator: '~',
	init_value_separator: '::',
	
	ns_separator: '|',
	ns_joiner: '_',
	
	plugin_separator: ';;',
	plugin_identifier: '_',
	plugin_constructor: '__construct',
	
	trigger_reset_form: 'hello_reset_form',
	trigger_actived_content: 'hello_actived_content',
	trigger_ajax_before: 'hello_ajax_before',
	trigger_ajax_success: 'hello_ajax_success',
	trigger_ajax_error_app: 'hello_ajax_error_app',
	trigger_ajax_error_server: 'hello_ajax_error_server',
	trigger_ajax_complete: 'hello_ajax_complete',
	trigger_update: 'hello_call_update',
	trigger_show: 'hello_show',
	trigger_hidden: 'hello_hidden',
	trigger_change: 'hello_change',
	trigger_hover: 'hello_hover',
	trigger_click: 'hello_click',
	trigger_data_change: 'hello_data_change'
};