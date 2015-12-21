
var ORIGIN = 'msgfiltering-dev.pubnub.com';

var TIMEOUT = 20000;


QUnit.module('PSV2 FILTERING', {
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


filter_test('subscribe() should receive message when subscribed without filter, \
if message is published on a channel without metadata', function(config){
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
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
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



filter_test('subscribe() should receive message when subscribed using filter foo==bar, \
if message is published on a channel with metadata foo:bar', function(config){
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
        filter_expr : '(foo=="bar")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
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
            start();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: ch});
            
        }
    }, config);
           
}, 1);


filter_test('subscribe() should not receive message when subscribed using filter foo==bar, \
if message is published on a channel with no metadata', function(config){
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
        filter_expr : '(foo=="bar")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
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

filter_test('subscribe() should not receive message when subscribed using filter a==b, \
if message is published on a channel with metadata foo:bar', function(config){
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
        finish();
    }, TIMEOUT);

    _pubnub_subscribe(pubnub, {
        channel: ch,
        filter_expr : '(a=="b")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
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
            ok(false, "received message");
            pubnub.unsubscribe({channel: ch});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: ch});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should not receive message when subscribed using filter foo==b, \
if message is published on a channel with metadata foo:bar', function(config){
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
        finish();
    }, TIMEOUT);


    _pubnub_subscribe(pubnub, {
        channel: ch,
        filter_expr : '(foo=="b")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                })
            }, 1000);
        },
        callback: function (response) {
            ok(false, "received message");
            pubnub.unsubscribe({channel: ch});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: ch});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should not receive message when subscribed using filter bar==foo, \
if message is published on a channel with metadata foo:bar', function(config){
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
        finish();
    }, TIMEOUT);


    _pubnub_subscribe(pubnub, {
        channel: ch,
        filter_expr : '(bar=="foo")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                })
            }, 1000);
        },
        callback: function (response) {
            ok(false, "message received");
            pubnub.unsubscribe({channel: ch});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: ch});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should receive message when subscribed using filter foo==bar, \
if message is published on a channel with metadata foo:bar (multiple messages in response)', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(5);

    stop(1);
    
    _pubnub_subscribe(pubnub, {
        channel: ch,
        filter_expr : '(foo=="bar")',
        windowing : 6000,
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 1000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 2000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 3000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : ch,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 4000);
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



filter_test('subscribe() should receive message when subscribed to wildcard without filter, \
if message is published on a channel without metadata', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(2);

    stop(1);
    
    _pubnub_subscribe(pubnub, {
        channel: chw,
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
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
            pubnub.unsubscribe({channel: chw});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);



filter_test('subscribe() should receive message when subscribed to wildcard using filter foo==bar, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(2);


    stop(1);
    
    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(foo=="bar")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                })
            }, 1000);
        },
        callback: function (response) {
            deepEqual(response, config.message, "message received 2");
            pubnub.unsubscribe({channel: chw});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to wildcard using filter foo==bar, \
if message is published on a channel with no metadata', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    setTimeout(function(){
        pubnub.unsubscribe({channel: chw});
        finish();
    }, 5000);

    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(foo=="bar")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
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
            pubnub.unsubscribe({channel: chw});
        },
        error: function (r) {
            ok(false, JSON.stringify(r));
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to wildcard using filter a==b, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    setTimeout(function(){
        pubnub.unsubscribe({channel: chw});
        finish();
    }, 5000);

    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(a=="b")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
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
            ok(false, "received message");
            pubnub.unsubscribe({channel: ch});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: ch});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to wildcard using filter foo==b, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    setTimeout(function(){
        pubnub.unsubscribe({channel: chw});
        finish();
    }, 5000);


    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(foo=="b")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
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
            ok(false, "received message");
            pubnub.unsubscribe({channel: chw});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);

filter_test('subscribe() not should receive message when subscribed to wildcard using filter bar==foo, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    setTimeout(function(){
        pubnub.unsubscribe({channel: chw});
        finish();
    }, 5000);


    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(bar=="foo")',
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                })
            }, 1000);
        },
        callback: function (response) {
            ok(false, "message received");
            pubnub.unsubscribe({channel: chw});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);


filter_test('subscribe() should receive message when subscribed to wildcard using filter foo==bar, \
if message is published on a channel with metadata foo:bar (multiple messages in response)', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chw     = ch + '.*';
    var chwc    = ch + ".a";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(5);

    stop(1);
    
    _pubnub_subscribe(pubnub, {
        channel: chw,
        filter_expr : '(foo=="bar")',
        windowing : 6000,
        connect: function () {
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 1000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 2000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 3000);
            setTimeout(function(){
                pubnub.publish({
                    'channel' : chwc,
                    message : config.message,
                    metadata : { "foo" : "bar"},
                    callback : function(r) {
                        ok(true, 'message published');   
                    },
                    error : function(r) {
                        ok(false, 'error occurred in publish');
                    }
                });
            }, 4000);
        },
        callback: function (response) {
            deepEqual(response, config.message, "message received 2");
            pubnub.unsubscribe({channel: chw});
            finish();
        },
        error: function () {
            ok(false);
            pubnub.unsubscribe({channel: chw});
            
        }
    }, config);
           
}, 1);



filter_test('subscribe() should receive message when subscribed to channel group without filter, \
if message is published on a channel without metadata', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(2);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
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
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);



filter_test('subscribe() should receive message when subscribed to channel group using filter foo==bar, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(2);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(foo=="bar")',
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
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
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to channel group using filter foo==bar, \
if message is published on a channel with no metadata', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            setTimeout(function(){
                pubnub.unsubscribe({channel_group: chg});
                finish();
            }, 5000);

            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(foo=="bar")',
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
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
                    pubnub.unsubscribe({channel_group: chg});
                    //finish();
                },
                error: function (r) {
                    ok(false, JSON.stringify(r));
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to channel group using filter a==b, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            setTimeout(function(){
                pubnub.unsubscribe({channel_group: chg});
                finish();
            }, 5000);

            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(a=="b")',
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
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
                    ok(false, "received message");
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);

filter_test('subscribe() should not receive message when subscribed to channel group using filter foo==b, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            setTimeout(function(){
                pubnub.unsubscribe({channel_group: chg});
                finish();
            }, 5000);


            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(foo=="b")',
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
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
                    ok(false, "received message");
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);

filter_test('subscribe() not should receive message when subscribed to channel group using filter bar==foo, \
if message is published on a channel with metadata foo:bar', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(1);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            setTimeout(function(){
                pubnub.unsubscribe({channel_group: chg});
                finish();
            }, 5000);


            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(bar=="foo")',
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
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
                    ok(false, "message received");
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);
        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });
           
}, 1);


filter_test('subscribe() should receive message when subscribed to channel group using filter foo==bar, \
if message is published on a channel with metadata foo:bar (multiple messages in response)', function(config){
    var random  = get_random();
    var ch      = 'channel-' + random;
    var chg     = ch + '-group';
    var chgc    = ch + "-channel";

    var pubnub = _pubnub_init({
        publish_key: test_publish_key,
        subscribe_key: test_subscribe_key,
        origin : ORIGIN
    }, config);

    expect(5);

    stop(1);
    
    pubnub.channel_group_add_channel({
        'channel_group' : chg,
        'channels'      : chgc,
        'callback'      : function(r) {
            _pubnub_subscribe(pubnub, {
                channel_group: chg,
                filter_expr : '(foo=="bar")',
                windowing : 6000,
                connect: function () {
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
                            callback : function(r) {
                                ok(true, 'message published');   
                            },
                            error : function(r) {
                                ok(false, 'error occurred in publish');
                            }
                        });
                    }, 100);
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
                            callback : function(r) {
                                ok(true, 'message published');   
                            },
                            error : function(r) {
                                ok(false, 'error occurred in publish');
                            }
                        });
                    }, 2000);
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
                            callback : function(r) {
                                ok(true, 'message published');   
                            },
                            error : function(r) {
                                ok(false, 'error occurred in publish');
                            }
                        });
                    }, 3000);
                    setTimeout(function(){
                        pubnub.publish({
                            'channel' : chgc,
                            message : config.message,
                            metadata : { "foo" : "bar"},
                            callback : function(r) {
                                ok(true, 'message published');   
                            },
                            error : function(r) {
                                ok(false, 'error occurred in publish');
                            }
                        });
                    }, 4000);
                },
                callback: function (response) {
                    deepEqual(response, config.message, "message received 2");
                    pubnub.unsubscribe({channel_group: chg});
                    finish();
                },
                error: function () {
                    ok(false);
                    pubnub.unsubscribe({channel_group: chg});
                    
                }
            }, config);

        },
        'error'         : function(r) {
            ok(false, "error occurred in adding channel to group");
            finish();
        }
    });

           
}, 1);


