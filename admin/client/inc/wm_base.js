    /*
     *  Core Data Model - server request and response handling
     *  
     *  Creating, sending requests and receiving data
     *  and parsing data using IWAPI data lists, collections
     *  and state aware values (api currently stored in browser_ext.js)
     *  using xml http request/responses (handled by request.js)
     *
     *  Martin Ekblom 2017
     */

    function IWServerInteraction() {

    }

    // Create standard request with command and parameters
    IWServerInteraction.prototype.wrapQuery = function(query,type) {
        var request = new IWAPI.Collection('iq');
        request.setAttributes({
            sid: dataSet.get('main', ['sid']),
            type: type || 'get',
            format: 'application/xml'
        });
        request.addItem(query);
        return request;
    }

    // Create standard request with command and parameters
    IWServerInteraction.prototype.createCommand = function(command,parameters) {
        var query = new IWAPI.Collection('query');
        query.setAttribute("xmlns",'admin:iq:'+this.xmlns);
        // Add the name of the command to the request
        query.addItem(new IWAPI.PersistentValue(command,'commandname'));
        // Add the command parameters
        query.addItem(new IWAPI.Collection('commandparams'));
        for(var label in parameters) {
            this.compileItems(query.commandparams,label,parameters);
        }
        return query;
    }
 
    // Parse array list, object collections and string values into xml object structure
    IWServerInteraction.prototype.compileItems = function(data,label,parameters) {
        // Primitive value, just add
        if(typeof parameters[label]=="string" || typeof parameters[label]=="number") {
            data.addItem(new IWAPI.PersistentValue(parameters[label],label));
        } else
        // Array indicates a list of items
        if(parameters[label] instanceof Array) {
            var item = parameters[label];
            var list = new IWAPI.List(label);
            for(var i=0, l=item.length; i<l; i++) {
                if(typeof item[i]=="string") {
                    list.addItem(new IWAPI.PersistentValue(item[i],'item'));
                } else {
                    var collection = new IWAPI.Collection('item');
                    for(var name in item[i]) {
                        this.compileItems(collection,name,item[i]);
                    }
                    list.addItem(collection);
                } 
            }
            data.addItem(list);
        } else
        // Object indicates a collection of items
        if(typeof parameters[label]=="object") {
            var item = parameters[label];
            var collection = new IWAPI.Collection(label);
            for(var name in item) {
                this.compileItems(collection,name,item);
            }
            data.addItem(collection);
        }
    }

    // Send request to server and return legacy array
    IWServerInteraction.prototype.sendRequest = function(query,callback) {
        request.sendXMLString(this.wrapQuery(query).toXMLString(new IWAPI.XmlOptions(true)),[this,'response_check',[callback]]);  // Traditional Array parsing
    }

    // Send request to server and return result - removes unchanged values
    IWServerInteraction.prototype.setValues = function(query,callback) {
        request.sendXMLString(this.wrapQuery(query,'set').toXMLString(new IWAPI.XmlOptions(true,true)),[this,'parseResponse',[callback],'XML'],[this,'resultfail']);
    }

    // Send request to server and return result - with reset option for values
    IWServerInteraction.prototype.resetValues = function(query,callback) {
        request.sendXMLString(this.wrapQuery(query,'set').toXMLString(new IWAPI.XmlOptions(true,false,true)),[this,'parseResponse',[callback],'XML'],[this,'resultfail']);
    }

    // Send request to server and return result
    IWServerInteraction.prototype.executeCommand = function(query,callback) {
        request.sendXMLString(this.wrapQuery(query,'set').toXMLString(new IWAPI.XmlOptions(true)),[this,'parseResponse',[callback],'XML'],[this,'resultfail']);
    }

    // Send request to server and return result as collection object
    IWServerInteraction.prototype.getResult = function(query,callback) {
        request.sendXMLString(this.wrapQuery(query).toXMLString(new IWAPI.XmlOptions(true)),[this,'parseResponse',[callback],'XML'],[this,'resultfail']);
    }

    IWServerInteraction.prototype.parseXML = function(collection,xmlnode) {
        if(xmlnode) do {
            var name = xmlnode.nodeName.toLowerCase();
			if(xmlnode.firstElementChild===null) {
                collection.addItem(name,xmlnode.firstChild ? xmlnode.textContent : null);
            } else {
                // Item elements indicate a list otherwise a collection
                if(xmlnode.firstElementChild.nodeName=='item') {
                    var nested = new IWAPI.List(name);
                } else {
                    var nested = new IWAPI.Collection(name);
                }
                collection.addItem(nested);
                this.parseXML(nested,xmlnode.firstElementChild);
            }
        } while(xmlnode = xmlnode.nextSibling);
    }

    // Preparsing, separate out fatal errors
    IWServerInteraction.prototype.parseResponse = function(type,response,callback) {
        var xml = response.XML.documentElement;
        var type = xml.getAttribute('type');
        if(type=='result') {
            var result = xml.getElementsByTagName('result')[0];
            if(result.firstChild && !result.firstElementChild && result.firstChild.nodeType==3) {
                callback(result.textContent);
            } else if(result.firstChild) {
                var c = new IWAPI[result.firstChild.nodeName=='item'?'List':'Collection']('result');
                this.parseXML(c,result.firstChild);
				callback(c);
            } else {
                callback('');
            }

        } else if(type=='error') {
            var error = xml.getElementsByTagName('error')[0].getAttribute('uid');
            switch(error) {
                case 'session_invalid':
                case 'session_invalid_id':
                case 'session_expired':
                case 'session_no_user':
                    try {
                        dataSet.add('main', ['sid'], '');
                        logout(true);
                    }
                    catch (e) {
                        log.error(e);
                    }
                    callback();
                    break;
                case 'invoker_commandname_invalid':
                    gui.message.error(getLang('error::invalid_command'));
                    break;
                default:
                    callback({error: error});
            }
        }

    }
