
var suffix = ".devbuild.pubnub.com"


function get_origin(o) {
    return o + suffix
}

function get_origins(o) {
    var o1 = [];
    for (var i in o) {
        o1[i] = o[i] + suffix;
    }
    console.log(JSON.stringify(o1));
    return o1;
}

function check_origin(a,b) {
    deepEqual(a.split('://')[1], b);
}

function down(origin, time) {
    var pn = PUBNUB.init({
        'origin'       : get_origin(origin),
        'publish_key'  : 'demo',
    });
    var channel = 'denyme' + time + origin;

    pn.publish({
        channel : channel,
        message : 'denyme',
        callback : function(r) {}
    })
} 

var tests = [

    {
        "name"    : "ha test 1",
        "channel" : "ab",
        "origins" : ["geo1", "geo2", "geo3", "geo4"],
        "down"    : [
                        { origin : "geo1", duration : 120}
                    ],
        "checks"  : [
                        { origin : "geo2", interval : 90},
                        { origin : "geo1", interval : 180}
                    ]
    },

    {
        "name"    : "ha test 2",
        "channel" : "ab",
        "origins" : ["geo1", "geo2", "geo3", "geo4"],
        "down"    : [
                        { origin : "geo1", duration : 120}
                    ],
        "checks"  : [
                        { origin : "geo1", interval : 180}
                    ]
    },
    {
        "name"    : "ha test 3",
        "channel" : "ab",
        "origins" : ["geo1", "geo2", "geo3", "geo4"],
        "down"    : [
                        { origin : "geo1", duration : 600},
                        { origin : "geo2", duration : 480},
                        { origin : "geo3", duration : 360}
                    ],
        "checks"  : [   
                        { origin : "geo4", interval : 240},
                        { origin : "geo3", interval : 420},
                        { origin : "geo2", interval : 540},
                        { origin : "geo1", interval : 660}
                    ]
    }


]

var offset = 1;
var l = 0;
var j = 0;
for (var i in tests) {

    test(tests[l++]['name'], function() {

        var max = 0;



        var t = tests[j++];
        console.log(t["name"]);
        var my_offset = offset;
        console.log('my_offset ' + my_offset);
        var checks_count = t.checks.length;
        stop(1);

        for ( var ci in t["checks"]) {
            console.log(t["name"]);
            var c = t["checks"][ci];
            console.log(c["interval"]);
            if (c["interval"] > max) max = c["interval"];
        }
        console.log(max);

        expect(checks_count);
        setTimeout(function() {

            var pubnub = PUBNUB.init({
                publish_key   : 'demo',
                subscribe_key : 'demo',
                origins       : get_origins(t["origins"])
            });


            pubnub.subscribe({ 
                channel : t["channel"],
                callback : function(response) {
                }
            });

            for (var di in t["down"]) {
                var d = t["down"][di];
                down(d["origin"],d["duration"]);
            }
            var k = 0;
            for ( var ci in t["checks"]) {
                var c = t["checks"][ci];
                console.log('check at ' + (my_offset + c["interval"]));
                setTimeout(function(){
                    var t2 = t["checks"][k++];
                    console.log('check : ' + pubnub.get_sub_origin() + ', ' + get_origin(t2["origin"]));
                    check_origin(pubnub.get_sub_origin(), get_origin(t2["origin"]));
                }, (my_offset + c["interval"]) * 1000);
            }
            console.log('start at ' + (my_offset + max + 5));
            setTimeout(function(){
                console.log('start');
                start();
                pubnub.unsubscribe({channel : t["channel"]});
            }, (my_offset + max + 5) * 1000);
        }, my_offset * 1000);

        //offset = offset + max + 15; 
        console.log('offset ' + offset);
    });


}