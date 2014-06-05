


function check_winner(map) {
    if (map[0] != '') {
        if (map[0] == map[1] && map[0] == map[2]) {
            return map[0];
        }
        if (map[0] == map[4] && map[0] == map[8]) {
            return map[0];
        }
        if (map[0] == map[3] && map[0] == map[6]) {
            return map[0];
        }
    }
    if (map[3] != '') {
        if (map[3] == map[4] && map[3] == map[5]) {
            return map[3];
        }
    }
    if (map[6] != '') {
        if (map[6] == map[7] && map[6] == map[8]) {
            return map[6];
        }
        if (map[6] == map[4] && map[6] == map[2]) {
            return map[6];
        }
    }
    if (map[1] != '') {
        if (map[1] == map[4] && map[1] == map[7]) {
            return map[1];
        }
    }
    if (map[2] != '') {
        if (map[2] == map[5] && map[2] == map[8]) {
            return map[2];
        }
    }
    return null;
}

function get_url_vars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function get_lobby_channel() {
    return (get_url_vars()['lobby'] || 'lobby');
}

function is_auto_play() {
    return ((get_url_vars()['autoplay'])?true:false);
}

function is_debug() {
    return ((get_url_vars()['debug'])?true:false);
}

function debug_log(message) {
    if (is_debug()) {
        console.log(message);
    }
}

function is_uuid_in_lobby(uuid, callback, error) {
    pubnub.where_now({
        'uuid'     : uuid,
        'callback' : function(r) {
             callback((r['channels'].indexOf(get_lobby_channel()) == -1)?false:true);
        },
        'error'    : function(r) {

        }
    });
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function get_player_list(callback){
    pubnub.here_now({
        'channel' : get_lobby_channel(),
        'callback' : callback
    })
}
