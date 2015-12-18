var test_publish_key = 'ds';
var test_subscribe_key = 'ds';
var test_secret_key = 'ds';

var pubnub = PUBNUB.init({
    publish_key   : test_publish_key,
    subscribe_key : test_subscribe_key,
    build_u       : true
});

var pubnub_enc = PUBNUB({
    publish_key: test_publish_key,
    subscribe_key: test_subscribe_key,
    cipher_key: "enigma",
    build_u   : true
});

var channel = 'javascript-test-channel-' + Math.floor((Math.random() * 10) + 1);
var count = 0;

var message_string = 'Hi from Javascript';
var message_jsono = {"message": "Hi Hi from Javascript"};
var message_jsona = ["message" , "Hi Hi from javascript"];


function get_random(){
    return Math.floor((Math.random() * 100000000000) + 1);
}
function _pubnub_init(args, config, pn){
    if (config) {
        args.ssl = config.ssl;
        args.jsonp = config.jsonp;
        args.cipher_key = config.cipher_key;
    }
    if (pn) 
        return pn.init(args);
    else 
        return PUBNUB.init(args);
}

function _pubnub(args, config, pn) {
    if (config) {
        args.ssl = config.ssl;
        args.jsonp = config.jsonp;
        args.cipher_key = config.cipher_key;
    }
    if (pn) 
        return pn(args);
    else 
        return PUBNUB(args);
}

function _pubnub_subscribe(pubnub, args, config) {
    if (config && config.presence) args.presence = config.presence;
    if (config && config.psv2) args.v2 = true;
    return pubnub.subscribe(args);
}

function _pubnub_publish(pubnub, args, config) {
    return pubnub.publish(args);
}


function pubnub_test(test_name, test_func, config) {
    if (config) {
        if (config.ssl) {
            test_name += ' [SSL] ';
        }
        if (config.jsonp) {
            test_name += ' [JSONP] ';
        }
        if (config.presence) {
            test_name += ' [PRESENCE] ';
        }
        if (config.cipher_key) {
            test_name += ' [ENCRYPTION]'
        }
        if (config.psv2) {
            test_name += ' [PSV2]'
        }
        if (config.unicode) {
            test_name += ' [UNICODE]'
        }
    }
    test(test_name, function(){
        test_func(config);
    });
}

function pubnub_test_all(test_name, test_func) {
    /*
    pubnub_test(test_name, test_func);
    //pubnub_test(test_name, test_func, {jsonp : true});
    pubnub_test(test_name, test_func, {ssl : true});
    //pubnub_test(test_name, test_func, {cipher_key : 'enigma'});
    pubnub_test(test_name, test_func, {
        presence : function(r){
            if (!r.action) { ok(false, "presence called"); start()};
        }
    });
    //pubnub_test(test_name, test_func, {jsonp : true, ssl : true, cipher_key : 'enigma'});
    //pubnub_test(test_name, test_func, {jsonp : true, ssl : true});
    */
    pubnub_test(test_name, test_func, {psv2 : true});
    //pubnub_test(test_name, test_func, {jsonp : true, psv2 : true});
    pubnub_test(test_name, test_func, {ssl : true, psv2 : true});
    //pubnub_test(test_name, test_func, {cipher_key : 'enigma', psv2 : true});
    pubnub_test(test_name, test_func, {
        presence : function(r){
            if (!r.action) { ok(false, "presence called"); start()};
        }, psv2 : true
    });
    //pubnub_test(test_name, test_func, {jsonp : true, ssl : true, cipher_key : 'enigma', psv2 : true});
    //pubnub_test(test_name, test_func, {jsonp : true, ssl : true, psv2 : true});
}

