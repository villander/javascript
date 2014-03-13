/* ---------------------------------------------------------------------------
    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys
--------------------------------------------------------------------------- */

var publicRandomSuffix = Math.floor((Math.random() * 100000) + 1);
var actorID = "PN_ACTOR" + publicRandomSuffix;

var channelA = "gecA";
var channelB = "gecB";

var pubnub = require("../../pubnub.js").init({
    publish_key   : "demo",
    subscribe_key : "demo"
})
,   exec  = require('child_process').exec;


var keysets = {

    "keyset1": {
        "pubKey": "pub-c-fb5fa283-0d93-424f-bf86-d9aca2366c86",
        "subKey": "sub-c-d247d250-9dbd-11e3-8008-02ee2ddab7fe",
        "secKey": "sec-c-MmI2YjRjODAtNWU5My00ZmZjLTg0MzUtZGM1NGExNjJkNjg1",
        "description": "Compatibility Mode ON"
    },

    "keyset2": {
        "pubKey": "pub-c-c9b0fe21-4ae1-433b-b766-62667cee65ef",
        "subKey": "sub-c-d91ee366-9dbd-11e3-a759-02ee2ddab7fe",
        "secKey": "sec-c-ZDUxZGEyNmItZjY4Ny00MjJmLWE0MjQtZTQyMDM0NTY2MDVk",
        "description": "Compatibility Mode OFF"
    }
};

var tests = [
    {
        "common": {
            "description": "(0) Test 1: 3.5 -> 3.5 Base Compatibility, SSL Off.",
            "client": "3.5",
            "server": "3.5",
            "keyset": keysets.keyset1,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 5000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["leave", channelA, 5000],
                    ["join", channelA, 5000],
                    ["join", channelB, 5000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelA, 5000],
                    ["leave", channelB, 5000],
                    ["join", channelB, 5000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(1) Test 2: 3.5 -> 3.5 Base Compatibility, SSL On.",
            "client": "3.5",
            "server": "3.5",
            "keyset": keysets.keyset1,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 5000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 5000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(2) Test 3: 3.5 -> 3.6 BW Compatibility (Compat On), SSL On.",
            "client": "3.5",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 5000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 5000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(3) Test 4: 3.5 -> 3.6 BW Compatibility (Compat On), SSL Off.",
            "client": "3.5",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["leave", channelA, 5000],
                    ["join", channelA, 5000],
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelA, 5000],
                    ["leave", channelB, 5000],
                    ["join", channelB, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(4) Test 5: 3.5 -> 3.6 BW Compatibility (Compat Off), SSL On.",
            "client": "3.5",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(5) Test 6: 3.5 -> 3.6 BW Compatibility (Compat Off), SSL Off.",
            "client": "3.5",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(6) Test 7: 3.6 -> 3.6 Compat Off, SSL On.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelA, 720000]
                ]
            }
        }

    },


    {
        "common": {
            "description": "(7) Test 8: 3.6 -> 3.6 Compat Off, SSL Off.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(8) Test 9: 3.6 -> 3.6 Compat On, SSL On.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelA, 5000],
                    ["join", channelA, 5000],
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },


    {
        "common": {
            "description": "(9) Test 10: 3.6 -> 3.6 Compat On, SSL Off.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": false // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["leave", channelA, 720000],
                    ["join", channelA, 5000],
                    ["join", channelB, 5000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["leave", channelB, 720000],
                    ["join", channelB, 5000],
                    ["leave", channelA, 5000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(10) Test 11: 3.6 -> 3.6 Compat On, Client Side Compat On, SSL On.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": true // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },


    {
        "common": {
            "description": "(11) Test 12: 3.6 -> 3.6 Compat Off, Client Side Compat On, SSL On.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": true
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": true // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },

    {
        "common": {
            "description": "(12) Test 13: 3.6 -> 3.6 Compat Off, Client Side Compat Off, SSL Off.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset2,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": true // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["timeout", channelA, 720000]
                ]
            }
        }

    },


    {
        "common": {
            "description": "(13) Test 14: 3.6 -> 3.6 Compat On, Client Side Compat On, SSL Off.",
            "client": "3.6",
            "server": "3.6",
            "keyset": keysets.keyset1,
            "ssl": false
        },

        "init": {
            "listener": ["subscribe", [channelA, channelB], 0]
        },

        "platformSpecific": {
            "JS_WEB": {
                "clientExtraCompatibilityFlag": true // actually doesn't matter for 3.5 -> 3.5
            }
        },

        "steps": {
            0: {
                "actor": ["subscribe", channelA, 0],
                "listener": [
                    ["join", channelA, 720000]
                ]                  // [should get this event, on channel ch, within this many seconds]
            },

            1: {
                "actor": ["subscribe", channelB, 0],

                "listener": [
                    ["join", channelB, 720000],
                    ["join", channelA, 5000],
                    ["leave", channelA, 5000]
                ]                                               // when more than two rules are in an array, they:
                // can happen in any order
                // must both happen, in order for that step to pass
            },

            2: {
                "actor": ["unsubscribe", channelA, 0],
                "listener": [
                    ["join", channelB, 720000],
                    ["leave", channelB, 5000],
                    ["leave", channelA, 5000]
                ]
            }
        }

    }




];

pubnub.publish({
    channel  : "testingPub1",
    message: {test: tests[0], platform: "JS_WEB", actorID: actorID},
    callback : function(message) {
        console.log("Published!");

    },
    error : function() {
        console.log("Network Connection Dropped");
    }
});

setTimeout(function(){
    process.exit(0);
}, 2000);

