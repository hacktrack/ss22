function obj_domainsettings_dnsvalidation(){};
var _me = obj_domainsettings_dnsvalidation.prototype;
/**
 * @brief:
 * @date : 01.12.2014
 **/
_me.__constructor = function(s){
	var me = this;
	storage.library('wm_user');
};

_me._load = function(accountDomain,isDomain)
{
	var that=this;
	var me=this;

	me._accountDomain=accountDomain;
	me._isDomain=isDomain;
	
	that._draw('obj_domainsettings_dnsvalidation', '');

	com.domain.dns(location.parsed_query.domain,function(result){

		var items=[];
		for(var i=0; i<result.records.length; i++){
			items.push({
				type: result.records[i].type,
				service: getLang('dns::service_'+result.records[i].service),
				variable: result.records[i].host,
				value: result.records[i].rows,
				status: result.records[i].value?"success":"error"
			});
		}
		
		result.general.domaintype=[
			getLang('domainlist::standard'),
			getLang('domainlist::domain_alias'),
			getLang('domainlist::backup_domain'),
			getLang('domainlist::distributed_domain'),
			getLang('domainlist::etrn_atrn_queue')
		][parseInt(result.general.domaintype)];
		
		log.log(['dnsvalidation-load',result,items]);
		
		that._draw('obj_domainsettings_dnsvalidation', '', {items:items,general:result.general});

		// Set url for Download button and enable
		com.properties.get('c_teamchat_api_url',function(url){
			url += 'DNSZoneFile.txt?override_method=files.download&dnszonefile=1&dnsdomain='+location.parsed_query.domain;
			var a = me._getAnchor('button_download_dnszonefile');
			a.href = url;
			a.target ='_blank';
			a.download ='DNSZoneFile.txt';
			a.parentNode.classList.remove('disabled');
		});

	});


}