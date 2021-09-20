
var wm_generic = (function () {
    function wm_generic() {
        this.xmlns = 'rpc'; // All descendants needs this property set or set it as create_iq arg
        this.error = false; // error object
    }

    wm_generic.prototype = Object.create(IWServerInteraction.prototype);

    /**
        * Method publishing instance of this object to global com object
        * @param name
        */
    wm_generic.prototype.__publish = function (name) {
        window['com'] = window['com'] || {};
        window['com'][name] = this;
    };
    /**
        * Method handling communication with server
        * @param aData
        * @param oResponse
        * @param oResponse2
        * @param sType
        * @param sId
        * @param sNs
        * @param bJSON
        * @param bNoSession
        */
    wm_generic.prototype.create_iq = function (aData, oResponse, oResponse2, sType, sId, sNs, bJSON, bNoSession) {
		oResponse2 = oResponse2 || false;
		sType = sType || 'get';
		sId = sId || '123';
		bJSON = bJSON || false;
        delete this.error;
        /* supported xmlns */
        var xmlns = {
            "auth": 1,
            "tools": 1,
            "accounts": 1,
            "folders": 1,
            "items": 1,
            "freebusy": 1,
            "spellchecker": 1,
            "public": 1,
            "private": 1,
            "domain": 1,
            "message": 1,
            "import": 1,
            "export": 1,
            "upload": 1,
            "rpc": 1
        };
        /* set xmlns from property */
        sNs = sNs || this.xmlns;
        if (!xmlns[sNs]) {
            throw new Error('create_iq: unsupported xmlns "' + sNs + '"');
        }
        sNs = 'admin:iq:' + sNs;
        /* prepare IQ object structure */
        var iq = { "IQ": [{ "ATTRIBUTES": {}, "QUERY": [{ "ATTRIBUTES": {} }] }] };
        /* append values into IQ */
        sSID = bNoSession ? '' : dataSet.get('main', ['sid']);
        if (sSID)
            iq['IQ'][0]['ATTRIBUTES']['SID'] = sSID;
        if (sId)
            iq['IQ'][0]['ATTRIBUTES']['UID'] = sId;
        iq['IQ'][0]['ATTRIBUTES']['TYPE'] = (sType != 'set' ? 'get' : 'set');
        iq['IQ'][0]['QUERY'][0]['ATTRIBUTES']['XMLNS'] = sNs;
        //Do not ask for JSON in case of ?xml=true
        if (bJSON === false || gui._REQUEST_VARS.xml) {
            iq['IQ'][0]['ATTRIBUTES']['FORMAT'] = 'application/xml';
        }
        else {
            iq['IQ'][0]['ATTRIBUTES']['FORMAT'] = 'text/json';
        }
        /* append data into query */
        if (aData && typeof aData == 'object')
            iq['IQ'][0]['QUERY'][0] = arrConcat(iq['IQ'][0]['QUERY'][0], aData);
        if (oResponse) {
            //http.sendArray(iq,[this,'response_check',[oResponse]],oResponse2);
            request.sendArray(iq, [this, 'response_check', [oResponse]], oResponse2);
            return true;
        }
        else {
            var q = request.sendArray(iq);
            if (q) {
                var aOut = q.getArray();
                // Error handler
                if (aOut['IQ'][0]['ATTRIBUTES']['TYPE'] == "error") {
                    var aErr = aOut['IQ'][0]['ERROR'][0];
                    this.error = {};
                    this.error["text"] = aErr['VALUE'];
                    if (aErr['ATTRIBUTES'] && aErr['ATTRIBUTES']['UID']) {
                        this.error["id"] = aErr['ATTRIBUTES']['UID'];
                        this.error["lang"] = getLang("ERR_" + aErr['ATTRIBUTES']['ID']);
                    }
                }
                return aOut;
            }
        }
    };
    /**
        * Check for Server side low level errors
        * @param aData
        * @param oResponse
        */
    wm_generic.prototype.response_check = function (aData, oResponse) {
        try {
            var aXMLResponse = aData['Array'];
            var aIQAttribute = aXMLResponse['IQ'][0]['ATTRIBUTES'];
        }
        catch (r) {
            return false;
        }
        if (aIQAttribute['TYPE'] == 'error')
            try {
                switch (aXMLResponse.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID) {
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
                        return false;
                    case 'session_ip_mismatch':
                        if (gui && gui.frm_main && gui.frm_main._acceptChangedIP) {
                            gui.frm_main._acceptChangedIP();
                        }
                        return false;
                }
            }
            catch (er) {
                log.error(er);
            }
        else if (aXMLResponse.IQ[0].ATTRIBUTES && aXMLResponse.IQ[0].ATTRIBUTES.GWSID)
            window['sPrimaryAccountGWSID'] = aXMLResponse.IQ[0].ATTRIBUTES.GWSID;
        try {
            executeCallbackFunction(oResponse, aData);
        }
        catch (e) {
            if ((gui._REQUEST_VARS['debug'] || gui._REQUEST_VARS['frm']) && dataSet.get('main', ['sid']))
                log.error(['fatal-error', e]);
        }
    };
    /**
        * default response method
        */
    wm_generic.prototype.response = function () { };
    ;
    /**
        * Default prepareChanged method
        * @param objects
        * @param clear
        */
    wm_generic.prototype._prepareChanged = function (objects, clear) {
        var items = [];
        try {
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].object) {
                    objects[i] = objects[i].object;
                }
                var fChanged = (objects[i]._groupChanged ? '_groupChanged' : '_changed');
                if (objects[i][fChanged] && objects[i][fChanged](clear)) {
                    log.log(['generic-_prepareChanged', "CHANGED", objects[i]]);
                    items.push(objects[i]);
                }
            }
        }
        catch (e) {
            log.error(["wmgeneric-preparechanged", e]);
        }
        return (items[0] ? items : false);
    };
    wm_generic.prototype._prepareSet = function (objects) {
        var items = [];
        for (var i = 0; i < objects.length; i++) {
            var readonly = false;
            var valTag = 'val';
            var merge = false;
            if (objects[i].object) {
                if (objects[i].object.__key) {
                    valTag = objects[i].object.__key;
                }
                if (objects[i].val) {
                    valTag = objects[i].val;
                }
                objects[i] = objects[i].object;
            }
            log.log(['objprepare', objects[i], objects[i]._readonly, (objects[i]._readonly ? objects[i]._readonly() : 'none')]);
            if (objects[i]._readonly) {
                if (objects[i]._readonly()) {
                    readonly = true;
                }
            }
            if (!readonly) {
                var val = objects[i]._value();
                if (typeof val == 'object' && val!=null) {
                    //array content
                    if (!val._ignore) {
                        var itm = objects[i].__source;
                        if (itm) {
                            itm.PROPERTYVAL[0] = helper.mergeDeepArray(itm.PROPERTYVAL[0], val);
                            items.push(itm);
                        }
                        else {
                            log.error(['e:prepare-save-failed-no-source', objects[i]]);
                        }
                    }
                }
                else {
                    // string content
                    try {
                        var itm = objects[i].__source;
                        if (itm) {
                            if (merge) {
                                if (!itm.PROPERTYVAL[0][valTag.toUpperCase()]) {
                                    itm.PROPERTYVAL[0][valTag.toUpperCase()] = [{}];
                                }
                                if (itm.PROPERTYVAL[0].CLASSNAME[0].VALUE.toLowerCase() == 'tpropertynovalue') {
                                    itm.PROPERTYVAL[0].CLASSNAME[0].VALUE = "TPropertyString";
                                }
                                itm.PROPERTYVAL[0][valTag.toUpperCase()][0].VALUE = val;
                            }
                            else {
                                if (!itm.PROPERTYVAL[0][valTag.toUpperCase()]) {
                                    itm.PROPERTYVAL[0][valTag.toUpperCase()] = [{}];
                                }
                                if (itm.PROPERTYVAL[0].CLASSNAME[0].VALUE.toLowerCase() == 'tpropertynovalue') {
                                    itm.PROPERTYVAL[0].CLASSNAME[0].VALUE = "TPropertyString";
                                }
                                itm.PROPERTYVAL[0][valTag.toUpperCase()][0].VALUE = val;
                                items.push(itm);
                            }
                        }
                        else {
                            log.error(['e:prepare-save-failed-no-source', objects[i]]);
                        }
                    }
                    catch (e) {
                        log.error(['e:invalid-source', (objects[i].__source ? objects[i].__source : false), e]);
                    }
                }
                log.log('Prepared');
            }
            else {
                log.log('Excluded - readonly');
            }
        }
        return items;
    };
    /**
        * Universal error handler attachable to other handlers
        * @param aHandler
        * @param eHandler
        */
    wm_generic.prototype.__attachErrorHandler = function (aHandler, eHandler) {
        if (!aHandler) {
            log.error(['wmgeneric-attachErrorHandler', 'no aHandler']);
        }
        if (aHandler[0]) {
            log.error(['wmgeneric-attacherrorhandler', 'handler cannot be array']);
            return aHandler;
        }
        var retHandler = function (data) { };
        if (!eHandler && typeof eHandler != 'boolean') {
            eHandler = global.responseErrorHandler;
        }
        if (eHandler) {
            var rh = aHandler;
            retHandler = function (data) {
                try {
                    if (data.Array.IQ[0].QUERY[0].ERROR) {
                        eHandler(data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
                    }
                    else {
                        rh(data);
                    }
                }
                catch (e) {
                    log.error(['wmgeneric-attachErrorHandler', e]);
                }
            };
        }
        return retHandler;
    };
    /**
        * Logout method
        * @param aHandler
        */
    wm_generic.prototype.logout = function (aHandler) {
        var aRequest = {
            commandname: [{ VALUE: 'logout' }],
            commandparams: []
        };
        if (!aHandler[0]) {
            aHandler = [aHandler];
        }
        this.create_iq(aRequest, [this, '__response', [aHandler]]);
    };
    /**
        * Response preprocessor
        * @param preprocessor
        * @param handler
        */
    wm_generic.prototype._preprocessResponse = function (preprocessor, handler) {
        if (!handler[0]) {
            handler = [handler];
        }
        return [function (response) {
                try {
                    if (response.Array.IQ[0].QUERY[0].ERROR && response.Array.IQ[0].QUERY[0].ERROR[0]) {
                        handler[0](false, response.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
                        return false;
                    }
                }
                catch (e) {
                    log.error(['generic-preprocessresponse', e]);
                    handler[0](false, 'invalid_response');
                    return false;
                }
                handler[0](preprocessor(response));
            }];
    };
    /**
        * Handles all necessarities and returns boolean value representing the result
        * @param aHandler
        */
    wm_generic.prototype._autoBooleanHandler = function (aHandler) {
        if (!aHandler[0]) {
            aHandler = [aHandler];
        }
        var fc = [function (data) {
                try {
                    if (data.Array.IQ[0].QUERY[0].ERROR && data.Array.IQ[0].QUERY[0].ERROR[0]) {
                        aHandler[0](false, data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
                        return false;
                    }
                    if (data.Array.IQ[0].QUERY[0].RESULT[0] && data.Array.IQ[0].QUERY[0].RESULT[0].VALUE != 0) {
                        aHandler[0](true, data.Array.IQ[0].QUERY[0].RESULT[0] && data.Array.IQ[0].QUERY[0].RESULT[0]);
                        return true;
                    }
                    aHandler[0](false);
                    return false;
                }
                catch (e) {
                    aHandler[0](false, e);
                    return false;
                }
            }];
        return fc;
    };
    /**
        * Handles all necessarities and returns id for created item
        * @param aHandler
        */
    wm_generic.prototype._autoIdHandler = function (aHandler) {
        if (!aHandler[0]) {
            aHandler = [aHandler];
        }
        var fc = [function (data) {
                try {
                    if (data.Array.IQ[0].QUERY[0].ERROR && data.Array.IQ[0].QUERY[0].ERROR[0]) {
                        aHandler[0](false, data.Array.IQ[0].QUERY[0].ERROR[0].ATTRIBUTES.UID);
                        return false;
                    }
                    if (data.Array.IQ[0].QUERY[0].RESULT[0] && data.Array.IQ[0].QUERY[0].RESULT[0].VALUE != 0) {
                        aHandler[0](data.Array.IQ[0].QUERY[0].RESULT[0].VALUE);
                        return data.Array.IQ[0].QUERY[0].RESULT[0].VALUE;
                    }
                    aHandler[0](false);
                    return false;
                }
                catch (e) {
                    aHandler[0](false, e);
                    return false;
                }
            }];
        return fc;
    };
    /**
        * Parses flat list of items to associative array
        * @param data
        */
    wm_generic.prototype._parseSingleItems = function (data) {
        try {
            var ret = [];
            var single = false;
            if (!data[0]) {
                single = true;
                data = [data];
            }
            for (var i = 0; i < data.length; i++) {
                ret[i] = {};
                for (var key in data[i]) {
                    log.info(['error', data[i][key][0]]);
                    if ((data[i][key][0] && data[i][key][0].VALUE) || (data[i][key][0] && JSON.stringify(data[i][key][0]) == '{}')) {
                        ret[i][key.toLowerCase()] = data[i][key][0].VALUE;
                    }
                    else {
                        ret[i][key.toLowerCase()] = data[i][key];
                    }
                }
            }
        }
        catch (e) {
            log.error(["generic-parsesingleitems", 'unexpected data', e, data]);
        }
        if (single) {
            return ret[0];
        }
        return ret;
    };
    /**
        *
        * @param scope
        * @param binds
        * @param type
        * @param ignoreChanges
        */
    wm_generic.prototype.bind = function (scope, binds, type, ignoreChanges) {
        var me = scope;
        var that = this;
        if (!type) {
            type = COM_TYPE_SERVER;
        }
        var variables = [];
        for (var key in binds) {
            variables.push(key);
        }
        if (!ignoreChanges) {
            /* observer */
            me._changeObserverID = 'changeObserver_' + me._name;
            gui._changeObserver.assignListener(me._changeObserverID, function (callback, close) {
                if (callback) {
                    close();
                    /*
                    if(changeObserverCallback){
                        return changeObserverCallback(callback);
                    }
                    */
                    that.save(scope, binds, type, callback);
                    return false;
                }
                else {
                    return that.checkChanges(scope, binds);
                }
            });
            //
            me._add_destructor(function () {
                gui._changeObserver.clearListener(me._changeObserverID);
            }, me._changeObserverID);
        }
        com.console.standardized(function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var key = item.apiproperty;
                log.log(['general-binded', key, data]);
                if (binds[key]) {
                    var element = "";
                    var settings = {};
                    if (typeof binds[key] == 'object' && binds[key][0]) {
                        if (binds[key][1]) {
                            settings = binds[key][1];
                        }
                        settings['_used'] = true;
                    }
                    if (typeof binds[key] == 'string' || (settings['_used'] && typeof binds[key][0] == 'string')) {
                        // if element is defined as simple string
                        if (settings['_used']) {
                            element = binds[key][0];
                        }
                        else {
                            element = binds[key];
                        }
                        var obj = me[element];
                        obj.__source = item._source;
                        obj.__item = item;
                        // switch element types for setting value
                        switch (obj._type) {
                            case 'obj_toggle':
                                if (settings['reversed']) {
                                    item._bval = !item._bval;
                                }
                                obj._checked(item._bval);
                                break;
                            default:
                                obj._value(item._sval);
                                break;
                        }
                        // set rights
                        global.setRight(scope, item.propertyright, obj);
                    }
                    else if (typeof binds[key] == 'object') {
                        // if bind is defined as object with extended functionality
                        if (binds[key].load) {
                            binds[key].load(item);
                        }
                        if (binds[key].rights) {
                            binds[key].rights(item.propertyright);
                        }
                    }
                }
            }
        }, function (error) {
            gui.message.error(error);
        })[type](variables);
    };

    /**
     * Parsing string data from the xml with encoded file content
     *
     * Assuming data in the following form:
     * data:application/octet-stream;base64,LS0tLS1CRUdJTiBDRV...
     *
     * @param data
     * @author Martin Ekblom
     */
    wm_generic.prototype._unpackxmlfile = function(data) {
        var file = {};
        if(data && typeof data=="string" && data.indexOf(',')!=-1 && data.indexOf('data:')==0) {
            data = data.substr(5).split(',');
            file.content = atob(data[1]);
            data = data[0].split(';');
            if(data[0]) {
                file.mime = data[0];
            }
        }
        return file;
    }

    /**
        * Forcing the browser to treat string content as file and start download with filename
        * @param content
        * @param name
        * @param mime
        * @author Martin Ekblom
        */
    wm_generic.prototype._downloadfile = function(content, name, mime) {
        try {
            var blob = new Blob([content],{type: mime || data[0] || 'application/octet-stream'});
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            // Download in IE with filename
            if(navigator.msSaveBlob) {
                navigator.msSaveBlob(blob,name);
            } else
            // Download with HTML5 download attribute for filename
            if('download' in a) {
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            // Download without filename
            else {
                window.location.href = url;                
            }
            return true;
        } catch(e) {
            log.error("ERROR: [downloadfile failed] " + name + " " + mime);
            return false;
        }
    }

    /**
        * Checking changes on all binded objects in given scope
        * @param scope
        * @param binds
        * @param clear
        */
    wm_generic.prototype.checkChanges = function (scope, binds, clear) {
        var objects = [];
        for (var key in binds) {
            if (scope[binds[key]]) {
                objects.push(scope[binds[key]]);
            }
            else if (typeof binds[key] == 'object') {
                if (binds[key].object && scope[binds[key].object]) {
                    objects.push(scope[binds[key].object]);
                }
                else {
                    if (binds[key].change) {
                        binds[key]._changed = binds[key].change;
                    }
                    objects.push(binds[key]);
                }
            }
            else {
                log.error(['generic-checkchanges', 'object does not exist', binds[key]]);
            }
        }
        var items = [];
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].object) {
                objects[i] = objects[i].object;
            }
            if (objects[i]._changed && objects[i]._changed(clear)) {
                log.log(['generic-_prepareChanged', "CHANGED", objects[i]]);
                items.push(objects[i]);
            }
        }
        return (items[0] ? items : false);
    };
    /**
        * Save method
        * @param scope
        * @param binds
        * @param type
        * @param successCallback
        * @param errorCallback
        */
    wm_generic.prototype.save = function (scope, binds, type, successCallback, errorCallback) {
        log.log(['generic-save']);
        var element;
        var me = scope;
        var that = this;
        var items = {};
        if (!type) {
            type = COM_TYPE_SERVER;
        }
        for (var key in binds) {
            var value = "";
            var readonly = false;
            var settings = {};
            if (typeof binds[key] == 'object' && binds[key][0]) {
                if (binds[key][1]) {
                    settings = binds[key][1];
                }
                settings['_used'] = true;
            }
            // DO READONLY! READONLY ITEMS CANNOT BE SAVED!
            if (typeof binds[key] == 'string' || (settings['_used'] && typeof binds[key][0] == 'string')) {
                // if element is defined as simple string
                if (settings['_used']) {
                    element = binds[key][0];
                }
                else {
                    element = binds[key];
                }
                var obj = me[element];
                var source = obj.__source;
                readonly = obj._readonly();
                // switch element types for getting value
                switch (obj._type) {
                    case 'obj_toggle':
                        if (settings['reversed']) {
                            value = (obj._checked() ? '0' : '1');
                        }
                        else {
                            value = (obj._checked() ? '1' : '0');
                        }
                        break;
                    default:
                        value = obj._value();
                        break;
                }
            }
            else if (typeof binds[key] == 'object') {
                // if bind is defined as object with extended functionality
                if (binds[key].save) {
                    value = binds[key].save();
                }
                if (binds[key].readonly) {
                    readonly = binds[key].readonly();
                }
            }
            if (!readonly) {
                items[key] = value;
            }
        }
        // call save on console and handle response
        com.console.set(function (data) {
            that.checkChanges(scope, binds, true);
            if (successCallback) {
                var r = successCallback();
                if (typeof r != 'undefined' && r == false) {
                    return;
                }
            }
            gui.message.toast(getLang('message::save_successfull'));
        }, function (error) {
            if (errorCallback) {
                var r = errorCallback();
                if (typeof r != 'undefined' && r == false) {
                    return;
                }
            }
            gui.message.error(getLang('error::save_unsuccessful'));
        })[type](items);
    };
    /**
        * Default response handler
        * @param aData
        * @param aHandler
        */
    wm_generic.prototype.__response = function (aData, aHandler) {
        var out = aData;
        executeCallbackFunction(aHandler, out);
    };

    return wm_generic;
}());
