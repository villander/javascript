// Initialize PubNub

var pubnub = PUBNUB.init({
    publish_key: "pub key",
    subscribe_key: "sub key",
    origin: "pubsub.pubnub.com"
});

// Define some generic callbacks

function log(m) {
    return JSON.stringify(m, null, 4);
}

function onError(m) {
    console.log('Error: ' + log(m));
}

function onSuccess(m) {
    console.log('Success: ' + log(m));
}

// We will track devices and occupants with our IoT app

var dial = {};
var home = {}
var thermostat = {};
var occupants = {};

var connectionStatusIcon = "disconnect.png";

// Sane defaults that are populated on.ready();
var thermostatTemp = -1;
var thermostatPower = "unknown";
var thermostatMode = "unknown";

// We'll keep a temp object for our own key/value tracking.
var presenceObject = {};


function thermostatSetter(thermostatData) {

    // called from merge, replace, and on.ready() callbacks
    // sets ui and local vars with new thermostat values

    // value() can take a path
    if (thermostatData.value().temperature) {

    // you can also take an absolute value call, and walk to the child value you want
        thermostatTemp = thermostatData.value("temperature");
        $("#currentTemp").html(thermostatTemp);
    }

    if (thermostatData.value().mode) {
        thermostatMode = thermostatData.value().mode;
        $("#thermostatMode").html(thermostatMode);
    }

    if (thermostatData.value().power) {
        thermostatPower = thermostatData.value().power;
        $("#thermostatPower").html(thermostatPower);
    }

    $("#thermostatLogs").html("<pre>" + log(thermostatData.value()) + "</pre>");
}

function thermoReplace(options) {

    var temp = options["temp"] || thermostatTemp;
    var power = options["power"] || thermostatPower;
    var mode = options["mode"] || thermostatMode;
    var success = options["success"] || log;
    var error = options["error"] || log;

    thermostat.replace({"temperature": temp, "power": power, "mode": mode}, {success:success, error:error});
}

function logOccupants() {
    //
    // TODO: Can I perform the same object with the local occupants object instead?
    var presenceCount = Object.keys(presenceObject).length;
    console.log(presenceCount);

    $("#occupancyLogs").html("<pre>" + log(presenceObject) + "</pre>");

    if (presenceCount == 0) {
        // if nobody is home, automatically lower the thermostat
        // and turn off all but the porch lights
        $("#houseScene").attr("src", "img/house_at_night_porch_on.jpg");

        thermostatPower = "on";
        thermostatMode = "heat";
        thermostatTemp = 65;
        thermoReplace({"success":onSuccess, "error":onError});
        if (dial.set) {
            dial.set('value', thermostatTemp);
        }

    }
    else if (presenceCount == 1 && (presenceObject["dog"] || presenceObject["pizza"])) {
        // if there is only one person home, and its the dog or pizza delivery
        // then don't turn the lights on
        return;

    }
    else if (presenceCount == 2 && (presenceObject["dog"] && presenceObject["pizza"])) {
        // if there are two people home, and its the dog and pizza delivery
        // then don't turn the lights on
        return;
    } else {

        $("#houseScene").attr("src", "img/house_at_night_all_on.jpg");
    }
}

function refreshPresenceObject(occupantsList) {

    // If !ref.data then our reference is now empty
    if (!occupantsList.data) {
        //console.log("tree is empty!");
        logOccupants();
        return;
    }

    // Running .each() off a list lets us iterate across each one
    // In this example, we are populating a local presence object
    // And being sure the Pizza Delivery Person is evicted when
    // The app starts up

    if (occupantsList.each) {
        occupantsList.each(function (personObject, key) {
            var personName = personObject.value();

            if (personName == "burglar") {
                personObject.remove();
            } else {
                presenceObject[ personName] = key;
                roofSelector(personName).toggle();
            }
    });
    }

    logOccupants();
}

function roofSelector(person) {
    return $('#' + person + 'Roof');
}

$(document).ready(function () {

    home = pubnub.sync('home');
    thermostat = home.child('living_room.thermostat');
    occupants = home.child('occupants');

    // Acknowledge when the thermostat has registered by turning it green

    thermostat.on.ready(function (ref) {
        $("#connectStatus").attr("src", "img/connect.png");
        $("#thermostat").css("background-color", "green");

        thermostatSetter(ref);

        YUI().use('dial', function (Y) {

            dial = new Y.Dial({
                min: 0,
                max: 120,
                stepsPerRevolution: 5,
                value: 30,
                strings: {"label": ""}

            });

            dial.render('#thermostatDial');

            dial.on("valueChange", function (e) {
                if (e.newVal == thermostatTemp) {
                    return;
                }
                thermoReplace({"temp":e.newVal});
            });

            dial.set('value', thermostatTemp);
        });
    });

    $("#thermostatMode").on('click', function (e) {
        // Note, we're not setting the mode here. We'll set that at the on.replace callback below.
        if (thermostatMode == "heat") {
            thermoReplace({"mode":"cold"});
        } else {
            thermoReplace({"mode":"heat"});
        }

    });

    $("#thermostatPower").on('click', function (e) {
        // Note, we're not setting the mode here. We'll set that at the on.replace callback below.
        if (thermostatPower == "on") {
            thermoReplace({"power":"off"});
        } else {
            thermoReplace({"power":"on"});
        }
    });

    $("#thermostatAwayMode").on('click', function (e) {
        // Note, we're not setting the mode here. We'll set that at the on.replace callback below.
        thermostat.merge({"temperature": 65, "power": "on", "mode": "heat"}, {"success": log, "error": log});
    });


    thermostat.on.replace(function (ref) {
        thermostatSetter(ref);
    });

    thermostat.on.merge(function (ref) {
        thermostatSetter(ref);
    });

    // pop example

    $("#ejectPerson").on("click", function(e){
        occupants.pop({"success": onSuccess, "error": onError});
    });

    $(".family").on("click", function (e) {
        var person = this.id;
        if (!person) {
            console.log("No ID found on clicked person.");
            return;
        }

        if (presenceObject[person]) {
            // here we show examples of manually storing the key to remove a list item
            // vs removing a list item by name (only safe when in a "Set" / no dup name paradigm)

            // TODO: occupants.remove() takes 0 or 2 arguments
            // TODO: Need iterator to work

            occupants.remove({"path": presenceObject[person], "success": log, "error": log});

        } else {
            occupants.push(person, {"success": onSuccess, "error": onError });
        }
    });

    // When occupants is ready, lets add all members to our presenceObject.
    occupants.on.ready(function (ref) {
        refreshPresenceObject(ref);
    });

    occupants.on.change(function (ref) {
    });

    occupants.on.remove(function (ref) {

        $.each(ref.delta, function (index, person){

            console.log("Occupant Removed: " + person.value + " at " + person.key);
            delete presenceObject[person.value];
            roofSelector(person.value).toggle();
        });

        logOccupants();
    });


    // When an occupant is merged. For lists, this will be called on push()
    occupants.on.merge(function (ref) {
        var addedUser = ref.delta[0].value;
        var addedKey = ref.delta[0].key;

        console.log("Occupant Added: " + addedUser + " at " + addedKey);
        presenceObject[addedUser] = addedKey;

        roofSelector(addedUser).toggle();

        logOccupants();
    });


    home.on.ready(function (ref) {

        // The on.ready() callback fires when the reference point (in this case, home) is synced

        home.on.change(function (ref) {
            console.log("HOME CHANGE");
        });

        home.on.merge(function (ref) {
            console.log("MERGE");
        });

        home.on.replace(function (ref) {
            console.log("REPLACE");
        });

        home.on.remove(function (ref) {
            console.log("REMOVE");
        });

        home.on.error(function (ref) {
            // In the event of error!
            // This includes PAM access denied
            // Passes the standard error object

            console.log("ERROR");
        });

        home.on.resync(function (ref) {
            // In the event the object has lost sync with the server
            // And is attempting recovery, this will fire

            console.log("RESYNC");
        });

    });
});

