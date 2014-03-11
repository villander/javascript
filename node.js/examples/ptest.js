// These settings must match on both Actor and Listener
var publicRandomSuffix = Math.floor((Math.random() * 100000) + 1);

var publicChannel = "testingPub1";
var publicSub = "demo";
var publicPub = "demo";
var listenerUUID = "PN_LISTENER" + publicRandomSuffix;

var publicListenerProduction = require("./pubnub-3.5.48.js").init({
    origin: "pubnub.pubnub.com",
    publish_key: publicPub,
    subscribe_key: publicSub,
    uuid: listenerUUID
}), exec = require('child_process').exec;


publicListenerProduction.subscribe({
    noheresync: true,
    channel: publicChannel,
    message: onPublicListenerMessage,
    connect: function (ch) {
        console.log("Listener Connected.");
    }
});

function onPublicListenerMessage(m) {
    console.log("Listener heard Message: " + m);
    if (m.test && m.platform && m.actorID) {

        l1 = new Listener(m);
        a = 1;

    }
}



//var publicListenerPresenceBeta = require("./pubnub-3.6.0beta.js").init({
//    origin: "presence-beta.pubnub.com",
//    publish_key: this.publicPub,
//    subscribe_key: this.publicSub,
//    uuid: this.listenerUUID
//}), exec = require('child_process').exec;

function Listener(config) {

    // test config specific
    // these attributes are defined by the Actor/Listener handshake

    this.randomSuffix = Math.floor((Math.random() * 100000) + 1);
    console.log("New Listener Instance " + this.randomSuffix + " created.");

    this.actorUUID = config.actorID;
    this.currentTest = config.test;

    this.clientLevel = config.test.common.client;
    this.serverLevel = config.test.common.server;

    this.listenerInit = config.test.init.listener;

    this.ssl = config.test.common.ssl;
    this.pubKey = config.test.common.keyset.pubKey;
    this.subKey = config.test.common.keyset.subKey;
    this.keySetDescription  = config.test.common.keyset.description;

    // instance specific
    // these values can change during runtime

    this.currentStep = 0;
    this.numberOfSteps = 0;

    this.alreadyConnected = false;
    this.currentStep = "";

    this.maxWaitTime = 0;
    this.testResults = [];
    this.stepInProgress = true;
    this.stepInProgressInterval = 0;

    // This is what the listener calls when he hears an event


    function onActorPresenceEvent(msg, e, ch) {
        if (msg.uuid != listenerUUID && msg.uuid == actorUUID) {
            console.log("Listener heard Presence event: " + msg.action + " on " + msg.uuid + ": " + ch);

            if (!testResults[currentStep]) {
                testResults.push([]);
            }

            testResults[currentStep].push({step: currentStep, action: msg.action, uuid: msg.uuid, timestamp: msg.timestamp, channel: ch, date: new Date });
        }
    }
}


function pnInit(ssl, key, isListener) {

    var uuid = isListener ? listenerUUID : actorUUID;
    var origin = (serverLevel == "3.6") ? "presence-beta.pubnub.com" : "pubsub.pubnub.com";

    var pubnub = PUBNUB.init({
        publish_key: 'demo',
        subscribe_key: key,
        origin: origin,
        ssl: ssl,
        "compatible_3.5": extraCompat,
        uuid: uuid
    });

    console.log(uuid + ": " + key + "\nOrigin: " + origin + "\nClient level: " + clientLevel + "\nServer level: " + serverLevel + "\nCompat: " + true + "\nClient extra compat flag: " + extraCompat + "\nSSL: " + ssl);
    return pubnub;
}

function waitForPNLoad() {
    if (pnLoading) {
        console.log("Waiting for PN to finish loading.");
        //pnLoadedInterval = setInterval(waitForPNLoad, 1000);
    } else {
        console.log("\nInitializing listener and actor instances.");
        clearInterval(pnLoadedInterval);

        randomSuffix = Math.floor((Math.random() * 10000) + 1);

        actorUUID = actorUUID + randomSuffix;
        listenerUUID = listenerUUID + randomSuffix;

        listener = pnInit(ssl, subKey, true);
        actor = pnInit(ssl, subKey, false);

        startCurrentTest();
    }
}


function initTest(testNub) {
    console.log("Running test: " + testNub.common.description + "\n");
    currentTest = testNub;
    ssl = testNub.common.ssl;
    clientLevel = testNub.common.client;
    serverLevel = testNub.common.server;
    pubKey = testNub.common.keyset.pubKey;
    subKey = testNub.common.keyset.subKey;
    extraCompat = testNub.platformSpecific.JS_WEB.clientExtraCompatibilityFlag;
    listenerInit = testNub.init.listener;

    loadPNLib();
}

function startTestById(id) {
    currentTestId = id;
    initTest(tests[id]);
}

function waitForStepInProgress() {

    if (stepInProgress) {
        console.log("Still waiting for test to complete.");

    } else {
        clearInterval(stepInProgressInterval);

        console.log("\n" + new Date + ": step " + currentStep + " complete.");

        if (!testResults[currentStep]) {
            testResults.push([
                {step: currentStep, action: "nothing_happened", uuid: "none", timestamp: "none", "channel": "none", date: new Date}
            ]);
        }

        for (a = 0; a < testResults[currentStep].length; a++) {
            var stringResults = JSON.stringify(testResults[currentStep][a]);
            console.log("\nStep " + currentStep + " results: " + stringResults + "\n");
        }

        currentStep++;
        startNextStep();
    }
}

function startCurrentTest() {
    console.log("\nStarting test: " + currentTest.common.description);
    alreadyConnected = false;
    numberOfSteps = Object.keys(currentTest.steps).length;

    startNextStep();
}

function logResultSummary() {
    for (step = 0; step < testResults.length; step++) {
        for (result = 0; result < testResults[step].length; result++) {
            stringResult = JSON.stringify(testResults[step][result]);
            console.log(stringResult);
        }
    }
}

function analyzeResults() {

    for (step = 0; step < testResults.length; step++) {

        var numExpectedResults = currentTest.steps[step].listener.length;
        var numActualResults = testResults[step].length

        var expectedTempArray = [];
        var actualTempArray = [];

        for (expected = 0; expected < currentTest.steps[step].listener.length; expected++) {
            //console.log("Listener should have heard results: ");
            //console.log(JSON.stringify(currentTest.steps[step].listener[step]));
            expectedTempArray.push(currentTest.steps[step].listener[expected][0] + currentTest.steps[step].listener[expected][1]);
        }

        for (result = 0; result < testResults[step].length; result++) {
            //console.log("Actor actual results were: ");
            //console.log(JSON.stringify(testResults[step][result]));
            actualTempArray.push(testResults[step][result].action + testResults[step][result].channel);
        }

        if (numActualResults == numExpectedResults) {
            playSound('beep');
            var row = document.getElementById('row-' + currentTestId);
            row.className = "pass";
            console.log("\nPASS: Step " + step + " numbers of actual/expected results are equal (" + numActualResults + ")\n");

            while (expectedTempArray.length > 0) {
                var actualIndex = actualTempArray.indexOf(expectedTempArray[0]);

                if (actualIndex != -1) {
                    actualTempArray.splice(actualIndex, 1);
                }
                expectedTempArray.splice(0, 1);

            }

            if (expectedTempArray.length == 0 && actualTempArray.length == 0) {
                console.log("\nPASS: Step " + step + " literal results are equal.\n");
            } else {
                row.className = "fail";
                console.log("\nFAIL: Step " + step + " literal results are NOT equal. Actual results that differed from expected are:");
                console.log(JSON.stringify(actualTempArray) + "\n");
            }
        }

        else {
            var row = document.getElementById('row-' + currentTestId);
            row.className = "fail";
            console.log("\FAIL: Step " + step + " numbers of actual/expected results are equal (" + numActualResults + ")\n");
        }
    }
}

function startNextStep() {

    stepInProgress = true;
    maxWaitTime = 0;

    if (currentStep + 1 > numberOfSteps) {
        console.log("\n*** All Test Steps Complete! ***\n");

        console.log("\nSummary of test results:");
        logResultSummary();
        analyzeResults();
        return;
    }

    console.log("\nStep " + (currentStep) + ".");

    var actorDelay = currentTest.steps[currentStep].actor[2];
    var actorAction = currentTest.steps[currentStep].actor[0];
    var actorChannel = currentTest.steps[currentStep].actor[1];

    console.log("\nActor should wait " + actorDelay + " seconds to " + actorAction + " to channel " + actorChannel);
    console.log("-- Then --");

    for (a = 0; a < currentTest.steps[currentStep].listener.length; a++) {

        var listenerTimeout = currentTest.steps[currentStep].listener[a][2];
        var listenerExpectedEvent = currentTest.steps[currentStep].listener[a][0];
        var listenerChannel = currentTest.steps[currentStep].listener[a][1];

        console.log("Listener should wait up to " + listenerTimeout + " ms to receive a " + listenerExpectedEvent + " on channel " + listenerChannel);
        if (listenerTimeout > maxWaitTime) {
            maxWaitTime = listenerTimeout;
        }
    }

    console.log("maxWaitTime set to: " + maxWaitTime + "\n");

    stepInProgressInterval = setInterval(waitForStepInProgress, 5000);

    setTimeout(function () {
        stepInProgress = false;
    }, maxWaitTime);

    console.log("\n" + new Date + ": Starting step " + currentStep);

    if (currentStep == 0) {
        var initListener = true;
    } else {
        var initListener = false;
    }

    if (actorAction == "subscribe") {
        subscribeToChannel(actorChannel, initListener)
    } else if (actorAction == "unsubscribe") {
        unsubscribeToChannel(actorChannel, initListener)
    }
}

/* UNSUBSCRIBE */

function unsubscribeToChannel(actorChannel, initListener) {
    if (initListener) {

        // Spawn the listener, then the actor
        listener.subscribe({
            noheresync: true,
            channel: listenerInit[1],
            message: onPublicListenerMessage,
            presence: onActorPresenceEvent,
            connect: function (ch) {
                if (alreadyConnected) {
                    console.log("Listener is already connected. Not doing that again.");
                    return;
                }

                alreadyConnected = true;
                console.log("Listener Connected.");
                actorUnsubscribe(actorChannel)
            }
        });
    } else {
        // Just spawn the actor
        actorUnsubscribe(actorChannel)
    }
}

function actorUnsubscribe(channel) {
    console.log("Unsubscribing actor...");
    actor.unsubscribe({
        channel: channel
    });
}


/* SUBSCRIBE */

function subscribeToChannel(actorChannel, initListener) {
    if (initListener) {

        // Spawn the listener, then the actor
        listener.subscribe({
            noheresync: true,
            channel: listenerInit[1],
            message: onPublicListenerMessage,
            presence: onActorPresenceEvent,
            connect: function (ch) {
                if (alreadyConnected) {
                    console.log("Listener is already connected. Not doing that again.");
                    return;
                }

                alreadyConnected = true;
                console.log("Listener Connected.");
                actorSubscribe(actorChannel)
            }
        });
    } else {
        // Just spawn the actor
        actorSubscribe(actorChannel)
    }
}

function actorSubscribe(channel) {
    console.log("Subscribing actor...");
    actor.subscribe({
        noheresync: true,
        channel: channel,
        message: function (m) {
            console.log("Actor: msg received: " + m);
        },
        connect: function () {
            console.log("Actor: Subscribe complete on channel " + channel + ".");
        }
    });
}





/* Start! */

//initTest(tests[1]);






