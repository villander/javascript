
var ORIGIN = 'msgfiltering-dev.pubnub.com';

var TIMEOUT = 20000;


QUnit.module('PSV2 ServerTests', {
  setupOnce: function () {
    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    });
    pubnub.channel_group_list_groups({
        callback: function (r) {
            var groups = r.groups;
            for (var i in groups) {
                var group = groups[i];
                pubnub.channel_group_remove_group({
                    channel_group: group
                })
            }
        }
    });

    pubnub.channel_group_list_namespaces({
        callback: function (r) {
            var namespaces = r.namespaces;
            for (var i in namespaces) {
                var namespace = namespaces[i];
                pubnub.channel_group_remove_namespace({
                    namespace: namespace
                })
            }
        }
    });
  },
  setup: function () {
    // runs before each unit test 
  },
  teardown: function () {

  },
  teardownOnce: function () {
    // runs once after all unit tests finished (including teardown) 
    pubnub.channel_group_list_groups({
        callback: function (r) {
            var groups = r.groups;
            for (var i in groups) {
                var group = groups[i];
                pubnub.channel_group_remove_group({
                    channel_group: group
                })
            }
        }
    });

    pubnub.channel_group_list_namespaces({
        callback: function (r) {
            var namespaces = r.namespaces;
            for (var i in namespaces) {
                var namespace = namespaces[i];
                pubnub.channel_group_remove_namespace({
                    namespace: namespace
                })
            }
        }
    });
  }
});


function filter_test(test_name, test_func, stops) {
    var message = 'message' + get_random();
    var message_unicode = '☺';

    pubnub_test(test_name, test_func, {psv2 : true, message : message}, stops);
    pubnub_test(test_name, test_func, {psv2 : true, message : message, ssl : true}, stops)
    pubnub_test(test_name, test_func, {psv2 : true, message : message, cipher_key : 'enigma'}, stops)
    pubnub_test(test_name, test_func, {psv2 : true, message : message, ssl : true, cipher_key : 'enigma'}, stops)

    pubnub_test(test_name, test_func, {psv2 : true, message : message_unicode, unicode : true}, stops);
    pubnub_test(test_name, test_func, {psv2 : true, message : message_unicode, ssl : true, unicode : true}, stops)
    pubnub_test(test_name, test_func, {psv2 : true, message : message_unicode, cipher_key : 'enigma', unicode : true}, stops)
    pubnub_test(test_name, test_func, {psv2 : true, message : message_unicode, ssl : true, cipher_key : 'enigma', unicode : true}, stops)
}

function failure_test(name, metadata, filter) {
    filter_test(name, function(config){
        var random  = get_random();
        var ch      = 'channel-' + random;

        var pubnub = _pubnub_init({
            publish_key: test_publish_key,
            subscribe_key: test_subscribe_key,
            origin : ORIGIN
        }, config);

        expect(1);

        stop(1);
        
        setTimeout(function(){
            pubnub.unsubscribe({channel: ch});
            start();
        }, TIMEOUT);

        _pubnub_subscribe(pubnub, {
            channel: ch,
            filter_expr : filter,
            connect: function () {
                setTimeout(function(){
                    pubnub.publish({
                        metadata : metadata,
                        'channel' : ch,
                        message : config.message,
                        callback : function(r) {
                            ok(true, 'message published');   
                        },
                        error : function(r) {
                            ok(false, 'error occurred in publish');
                        }
                    })
                }, 100);
            },
            callback: function (response) {
                ok(false, "received message 1");
                pubnub.unsubscribe({channel: ch});
            },
            error: function (r) {
                ok(false, JSON.stringify(r));
                pubnub.unsubscribe({channel: ch});
                
            }
        }, config);
    }, 1);
}


function success_test(name, metadata, filter) {
    filter_test(name, function(config){
        var random  = get_random();
        var ch      = 'channel-' + random;

        var pubnub = _pubnub_init({
            publish_key: test_publish_key,
            subscribe_key: test_subscribe_key,
            origin : ORIGIN
        }, config);

        expect(2);

        stop(1);

        _pubnub_subscribe(pubnub, {
            channel: ch,
            filter_expr : filter,
            connect: function () {
                setTimeout(function(){
                    pubnub.publish({
                        'channel' : ch,
                        metadata : metadata,
                        message : config.message,
                        callback : function(r) {
                            ok(true, 'message published');   
                        },
                        error : function(r) {
                            ok(false, 'error occurred in publish');
                        }
                    })
                }, 100);
            },
            callback: function (response) {
                deepEqual(response, config.message, "message received 2");
                pubnub.unsubscribe({channel: ch});
                finish();
            },
            error: function () {
                ok(false);
                pubnub.unsubscribe({channel: ch});
                
            }
        }, config);
               
    }, 1);
}

var success_test_list = [
    {
        "name"      : "Exact number match",
        "filter"    : '(count == 42)',
        "metadata"  : {"count":42}
    },
    {
        "name"      : "Arithmetic",
        "filter"    : "(attributes.var1 + attributes['var2'] == 30)",
        "metadata"  : {"attributes":{"var1":10,"var2":20}}
    },
        {
        "name"      : "Arithmetic",
        "filter"    : "(meta.data.var1 + data['var2'] == 30)",
        "metadata"  : {"data":{"var1":10,"var2":20}}
    },
        {
        "name"      : "Larger than or equal match",
        "filter"    : "(regions.east.count >= 42)",
        "metadata"  : {"regions":{"east":{"count":42,"other":"something"}}}
    },
        {
        "name"      : "Exact string match",
        "filter"    : '(region in ("east","west"))',
        "metadata"  : {"region":"east"}
    },
        {
        "name"      : "Array match against string",
        "filter"    : '("east" in region)',
        "metadata"  : {"region":["east","west"]}
    },
        {
        "name"      : "Exact number match",
        "filter"    : "",
        "metadata"  : {"count":42}
    },
        {
        "name"      : "Negated array mismatch against string",
        "filter"    : '(!("central" in region))',
        "metadata"  : {"region":["east","west"]}
    },
        {
        "name"      : "Array LIKE match",
        "filter"    : '(region like "EAST")',
        "metadata"  : {"region":["east","west"]}
    },
    {
        "name"      : "Array LIKE match with wildcard",
        "filter"    : '(region like "EAST%")',
        "metadata"  : {"region":["east","west"]}
    },
    {
        "name"      : "Array LIKE match with wildcard",
        "filter"    : '(region like "EAST%")',
        "metadata"  : {"region":["east coast","west coast"]}
    },
    {
        "name"      : "Array LIKE match with wildcard",
        "filter"    : '(region like "%east")',
        "metadata"  : {"region":["north east","west"]}
    },
    {
        "name"      : "Array LIKE match with wildcard",
        "filter"    : '(region like "%est%")',
        "metadata"  : {"region":["east coast","west coast"]}
    }
]

var failure_test_list = [
    /*
    {
        "name"      : "Arithmetic BUG BUG BUG",
        "filter"    : "(data.var1 + data['var2'] == 20)",
        "metadata"  : {"data":{"var1":10,"var2":20}}
    },
    */
    {
        "name"      : "Smaller than mismatch",
        "filter"    : '(regions.east.count < 42)',
        "metadata"  : {"regions":{"east":{"count":42,"other":"something"}}}
    },
    {
        "name"      : "Missing variable evaluating to 0, mismatch",
        "filter"    : '(regions.east.volume > 0)',
        "metadata"  : {"regions":{"east":{"count":42,"other":"something"}}}
    },
    {
        "name"      : "String case mismatch for ==",
        "filter"    : '(region=="East")',
        "metadata"  : {"region":"east"}
    },
    {
        "name"      : "Case mismatch in array match",
        "filter"    : '("East" in region)',
        "metadata"  : {"region":["east","west"]}
    }
]


for (i in success_test_list) {
    var t = success_test_list[i]
    success_test(t.name, t.metadata, t.filter)
}


for (i in failure_test_list) {
    var t = failure_test_list[i]
    failure_test(t.name, t.metadata, t.filter)
}

