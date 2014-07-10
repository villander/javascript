

function is_draw(map) {
    for ( var i in map) {
        if (map[i] == 0)
            return false;
    }
    return true;
}

function check_winner(map) {
    if (map[0] != 0) {
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
    if (map[3] != 0) {
        if (map[3] == map[4] && map[3] == map[5]) {
            return map[3];
        }
    }
    if (map[6] != 0) {
        if (map[6] == map[7] && map[6] == map[8]) {
            return map[6];
        }
        if (map[6] == map[4] && map[6] == map[2]) {
            return map[6];
        }
    }
    if (map[1] != 0) {
        if (map[1] == map[4] && map[1] == map[7]) {
            return map[1];
        }
    }
    if (map[2] != 0) {
        if (map[2] == map[5] && map[2] == map[8]) {
            return map[2];
        }
    }
    return null;
}



function get_lobby_channel() {
    return process.argv[2];
}



function is_auto_play() {
    return true;
}

function get_clear_after() {
    return 12;
}
function is_auto_join() {
    return true;
}

function is_debug() {
    return true;
}

function debug_log(message) {
    if (is_debug()) {
        console.log('[' + Date.now() + '] ' + message);
    }
}

function is_display_mode() {
    return true;
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
function get_uid() {
    return process.argv[3] || pubnub.uuid();
}


function get_symbol(num) {
    return process.argv[4] || 'X';
}


function get_max_concurrent() {
    return JSON.parse(process.argv[5] || 5);
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

function get_next_move(map, symbol, opponent_symbol, game_id) {
    return winCheck(map, symbol, opponent_symbol, game_id);
}

function winCheck(map, symbol, opponent_symbol, game_id) {
    
    if(map[0] == symbol && map[1] == symbol && map[2] == 0) {
        return 2;
    }
    else if(map[1] == symbol && map[2] == symbol && map[0] == 0) {
        return 0;
    }
    else if(map[3] == symbol && map[4] == symbol && map[5] == 0) {
        return 5;
    }
    else if(map[4] == symbol && map[5] == symbol && map[3] == 0) {
        return 3;
    }
    else if(map[6] == symbol && map[7] == symbol && map[8] == 0) {
        return 8;
    }
    else if(map[7] == symbol && map[8] == symbol && map[6] == 0) {
        return 6;
    }
    else if(map[0] == symbol && map[4] == symbol && map[8] == 0) {
        return 8;
    }
    else if(map[4] == symbol && map[8] == symbol && map[0] == 0) {
        return 0;
    }
    else if(map[2] == symbol && map[4] == symbol && map[6] == 0) {
        return 6;
    }
    else if(map[6] == symbol && map[4] == symbol && map[2] == 0) {
        return 2;
    }
    else if(map[0] == symbol && map[2] == symbol && map[1] == 0) {
        return 1;
    }
    else if(map[3] == symbol && map[5] == symbol && map[4] == 0) {
        return 4;
    }
    else if(map[6] == symbol && map[8] == symbol && map[7] == 0) {
        return 7;
    }
    else if(map[0] == symbol && map[6] == symbol && map[3] == 0) {
        return 3;
    }
    else if(map[1] == symbol && map[7] == symbol && map[4] == 0) {
        return 4;
    }
    else if(map[2] == symbol && map[8] == symbol && map[5] == 0) {
        return 5;
    }
    else if(map[0] == symbol && map[4] == symbol && map[8] == 0) {
        return 8;
    }
    else if(map[3] == symbol && map[6] == symbol && map[0] == 0) {
        return 0;
    }
    else if(map[4] == symbol && map[7] == symbol && map[1] == 0) {
        return 1;
    }
    else if(map[5] == symbol && map[8] == symbol && map[2] == 0) {
        return 2;
    }
    else if(map[0] == symbol && map[3] == symbol && map[6] == 0) {
        return 6;
    }
    else if(map[1] == symbol && map[4] == symbol && map[7] == 0) {
        return 7;
    }
    else if(map[2] == symbol && map[5] == symbol && map[8] == 0) {
        return 8;
    }
    else if(map[0] == symbol && map[8] == symbol && map[4] == 0) {
        return 4;
    }
    else if(map[2] == symbol && map[6] == symbol && map[4] == 0) {
        return 4;
    }
    else {
        return computer(map, symbol, opponent_symbol, game_id);
    }
}


function computer(map, symbol, opponent_symbol, game_id) {

    if(map[0] == opponent_symbol && map[1] == opponent_symbol && map[2] == 0) {
        return 2;
    }
    else if(map[1] == opponent_symbol && map[2] == opponent_symbol && map[0] == 0) {
        return 0;
    }
    else if(map[3] == opponent_symbol && map[4] == opponent_symbol && map[5] == 0) {
        return 5;
    }
    else if(map[4] == opponent_symbol && map[5] == opponent_symbol && map[3] == 0) {
        return 3;
    }
    else if(map[6] == opponent_symbol && map[7] == opponent_symbol && map[8] == 0) {
        return 8;
    }
    else if(map[7] == opponent_symbol && map[8] == opponent_symbol && map[6] == 0) {
        return 6;
    }
    else if(map[0] == opponent_symbol && map[4] == opponent_symbol && map[8] == 0) {
        return 8;
    }
    else if(map[4] == opponent_symbol && map[8] == opponent_symbol && map[0] == 0) {
        return 0;
    }
    else if(map[2] == opponent_symbol && map[4] == opponent_symbol && map[6] == 0) {
        return 6;
    }
    else if(map[6] == opponent_symbol && map[4] == opponent_symbol && map[2] == 0) {
        return 2;
    }
    else if(map[0] == opponent_symbol && map[2] == opponent_symbol && map[1] == 0) {
        return 1;
    }
    else if(map[3] == opponent_symbol && map[5] == opponent_symbol && map[4] == 0) {
        return 4;
    }
    else if(map[6] == opponent_symbol && map[8] == opponent_symbol && map[7] == 0) {
        return 7;
    }
    else if(map[0] == opponent_symbol && map[6] == opponent_symbol && map[3] == 0) {
        return 3
    }
    else if(map[1] == opponent_symbol && map[7] == opponent_symbol && map[4] == 0) {
        return 4;
    }
    else if(map[2] == opponent_symbol && map[8] == opponent_symbol && map[5] == 0) {
        return 5;
    }
    else if(map[0] == opponent_symbol && map[4] == opponent_symbol && map[8] == 0) {
        return 8;
    }
    else if(map[3] == opponent_symbol && map[6] == opponent_symbol && map[0] == 0) {
        return 0;
    }
    else if(map[4] == opponent_symbol && map[7] == opponent_symbol && map[1] == 0) {
        return 1;
    }
    else if(map[5] == opponent_symbol && map[8] == opponent_symbol && map[2] == 0) {
        return 2;
    }
    else if(map[0] == opponent_symbol && map[3] == opponent_symbol && map[6] == 0) {
        return 6;
    }
    else if(map[1] == opponent_symbol && map[4] == opponent_symbol && map[7] == 0) {
        return 7;
    }
    else if(map[2] == opponent_symbol && map[5] == opponent_symbol && map[8] == 0) {
        return 8;
    }
    else if(map[0] == opponent_symbol && map[8] == opponent_symbol && map[4] == 0) {
        return 4;
    }
    else if(map[2] == opponent_symbol && map[6] == opponent_symbol && map[4] == 0) {
        return 4;
    }
    else {
        //return AI1(map, symbol, opponent_symbol);
        
        if (game_id % 5 == 0)
            return AI5(map, symbol, opponent_symbol);
        else if (game_id % 3 == 0)
            return AI3(map, symbol, opponent_symbol);
        else if (game_id % 2 == 0)
            return AI2(map, symbol, opponent_symbol);
        else 
            return AI1(map, symbol, opponent_symbol);
        
    }
}

function AI1(map, symbol, opponent_symbol) {


    if(map[4] == 0) {
        return 4;
    }
    else if(map[0] == 0) {
        return 0;
    }
    else if(map[8] == 0) {
        return 8;
    }
    else if(map[5] == 0) {
        return 5;
    }
    else if(map[1] == 0) {
        return 1;
    }
    else if(map[7] == 0) {
        return 7;
    }
    else if(map[2] == 0) {
        return 2;
    }
    else if(map[6] == 0) {
        return 6;
    }
    else if(map[3] == 0) {
        return 3;
    }
}

function AI2(map, symbol, opponent_symbol) {

    if(map[0] == 0) {
        return 0;
    }
    else if(map[8] == 0) {
        return 8;
    }
    else if(map[4] == 0) {
        return 4;
    }
    else if(map[1] == 0) {
        return 1;
    }
    else if(map[5] == 0) {
        return 5;
    }
    else if(map[2] == 0) {
        return 2;
    }
    else if(map[7] == 0) {
        return 7;
    }
    else if(map[3] == 0) {
        return 3;
    }
    else if(map[6] == 0) {
        return 6;
    }
}

function AI3(map, symbol, opponent_symbol) {

    if(map[4] == 0) {
        return 4;
    }
    else if(map[2] == 0) {
        return 2;
    }
    else if(map[7] == 0) {
        return 7;
    }
    else if(map[3] == 0) {
        return 3;
    }
    else if(map[6] == 0) {
        return 6;
    }
    else if(map[8] == 0) {
        return 8;
    }
    else if(map[0] == 0) {
        return 0;
    }
    else if(map[1] == 0) {
        return 1;
    }
    else if(map[5] == 0) {
        return 5;
    }
}


function AI5(map, symbol, opponent_symbol) {

    if(map[5] == 0) {
        return 5;
    }
    else if(map[2] == 0) {
        return 2;
    }
    else if(map[7] == 0) {
        return 7;
    }
    else if(map[0] == 0) {
        return 0;
    }
    else if(map[6] == 0) {
        return 6;
    }
    else if(map[8] == 0) {
        return 8;
    }
    else if(map[3] == 0) {
        return 3;
    }
    else if(map[1] == 0) {
        return 1;
    }
    else if(map[4] == 0) {
        return 4;
    }
}

var PUBNUB  = require("./../pubnub.js");
var pubnub = PUBNUB.init({
    publish_key   : "pub-c-fd1a1d00-6c07-4435-a647-495cdfcdfc95",
    subscribe_key : "sub-c-f045aeaa-befe-11e3-b6e0-02ee2ddab7fe",
    uuid : get_uid(),
    leave_on_unload : true
});

var current_game_count = 0;
var games_completed = 0;
var game_count = 0;
var message_count = 0;


var games = {}
var lobby = []
var display_table_id_next = 1;
var max_per_row_tables = 3;
var max_total = 6;
var clear_after = get_clear_after();

function get_my_num(game_id) {
    return games[game_id]['num'];
}

function get_opponent_num(game_id) {
    return ((games[game_id]['num'] == 1)?2:1);
}

function start_handshake(uuid, turn) {
    if (current_game_count >= get_max_concurrent()) return;
    var message = {
        'game' : 'tictactoe',
        'mtype' : 'handshake',
        'step' : 1,
        'p1_uuid' : pubnub.get_uuid(),
        'p2_uuid' : uuid,
        'turn' : turn
    };
    message['sender'] = pubnub.get_uuid();
    message['id'] = ++message_count; 

    function p(m) {
        pubnub.publish({
            'channel' : get_lobby_channel(),
            'message' : message,
            'callback' : function(r){debug_log('HANDSHAKE 1 SENT : ' + JSON.stringify(message));},
            'error' : function(r){debug_log('ERROR in publish ' + JSON.stringify(r) + ', ' + JSON.stringify(message)); p(m);}
        })
    }
    p(message);
}
function start_handshake_2(uuid, turn) {
    if (current_game_count >= get_max_concurrent()) return;
    var message = {
        'game' : 'tictactoe',
        'mtype' : 'handshake',
        'step' : 2,
        'p1_uuid' : uuid,
        'turn' : turn,
        'p2_uuid' : pubnub.get_uuid(),
        'game_id' : getRandomInt(1,10000000000),
        'symbol' : get_symbol(2)
    };
    message['sender'] = pubnub.get_uuid();
    message['id'] = ++message_count; 

    function p(m) {
        pubnub.publish({
            'channel' : get_lobby_channel(),
            'message' : message,
            'callback' : function(r){debug_log('HANDSHAKE 2 SENT : ' + JSON.stringify(message));},
            'error' : function(r){debug_log('ERROR in publish ' + JSON.stringify(r) + ', ' + JSON.stringify(message)); p(m);}
        })
    }
    p(message);
}
function start_handshake_3(uuid, turn, game_id) {
    var message = {
        'game' : 'tictactoe',
        'mtype' : 'handshake',
        'step' : 3,
        'p1_uuid' : pubnub.get_uuid(),
        'p2_uuid' : uuid,
        'turn' : turn,
        'game_id' : game_id,
        'symbol' : get_symbol(1)
    };
    message['sender'] = pubnub.get_uuid();
    message['id'] = ++message_count; 

    function p(m) {
        pubnub.publish({
            'channel' : get_lobby_channel(),
            'message' : message,
            'callback' : function(r){debug_log('HANDSHAKE 3 SENT : ' + JSON.stringify(message));},
            'error' : function(r){debug_log('ERROR in publish ' + JSON.stringify(r) + ', ' + JSON.stringify(message)); p(m);}
        })
    }
    p(message);
}

function clear_timers(game_id, time_remaining) {
    var game = games[game_id];
    if (game) {
        clearInterval(game['interval']);
        clearTimeout(game['timeout']);
        game['time_remaining'] = 60;
    }
}

function update_time_remaining(game_id, n) {
    console.log(' game_id :  '  + game_id + ' , ' + + n + ' sec remaining');
}

function update_turn(game_id, uuid) {

    var game = games[game_id];
    if (game) {

        clear_timers(game_id);
        
        if (uuid == pubnub.get_uuid()) {
            if (is_auto_play()) {
                game_step(game_id,
                    get_next_move(game['map'], get_my_num(game_id), get_opponent_num(game_id)));
                return;
            }

            game['timeout'] = setTimeout(function(){
                clear_timers(game_id);
                declare_winner(game_id, get_opponent_num(game_id));
                //end_game(game_id, game['uuid']);
            }, 60000)

            game['interval'] = setInterval(function() {
                update_time_remaining(game_id, game['time_remaining']);
                game['time_remaining']--;
            }, 1000);

        } else {
            /*
            game['timeout'] = setTimeout(function(){
                declare_winner(game_id, pubnub.get_uuid());
                //end_game(game_id, game['uuid']);
                clear_timers(game_id);
            }, 60000)

            game['interval'] = setInterval(function() {
                update_time_remaining(game_id, game['time_remaining']);
                game['time_remaining']--;
            }, 1000);
            */
        }
    }
}



function update_result(game_id, result) {
    clear_timers(game_id);
}

function update_my_uuid(game_id, uuid) {

}

function update_opponent(game_id, uuid) {

}

function get_print_symbol(game_id, s) {
    if (s == 0) {
        return '';
    }
    if (s == get_my_num(game_id)) {
        return games[game_id]['symbol'];
    } 
    if (s == get_opponent_num(game_id)) {
        return games[game_id]['opponent_symbol'];
    } 
}
function update_game_status(game_id, status) {

}

function draw_grid(game_id, symbol, map) {

}



function declare_winner(game_id, symbol) {
    var winner = '';
    var game = games[game_id];

    if (game) {
        if (symbol == get_my_num(game_id)) {
            winner = pubnub.get_uuid();
        } else if (symbol != 0){
            winner = game['uuid'];
        } else {
            winner = '';
        }
        var message = {
            'mtype' : 'winner',
            'game_id' : game_id,
            'winner' : winner
        }
        message['sender'] = pubnub.get_uuid();
        message['id'] = ++message_count;
        function p(m) {
            pubnub.publish({
                'channel' : game_id,
                'message' : message,
                'callback' : function(r){'DECLARED WINNER : ' + debug_log(JSON.stringify(message))},
                'error' : function(r){debug_log('ERROR in publish ' + JSON.stringify(r) + ', ' + JSON.stringify(message)); p(m);}
            })
        }
        p(message);

    }
}

function handle_game_messages(message) {

    if (message['mtype'] == 'game') {

        var gid_in_message = message['game_id'];
        var game = games[gid_in_message];
        debug_log('RECEIVED GAME MESSAGE [' + gid_in_message + '] : ' + JSON.stringify(message));
        if (game) {
            game['map'] = message['map'];

            draw_grid(gid_in_message, get_my_num(gid_in_message) , game['map']);

            game['turn'] = message['turn'];
            
            var winning_symbol = check_winner(game['map']);

            if (winning_symbol) {
                declare_winner(gid_in_message, winning_symbol);
            } else {
                if (is_draw(game['map'])) {
                    declare_winner(gid_in_message, '');
                } else {
                    update_turn(gid_in_message, game['turn']);
                }
            }
        }
        
    }
    if (message['mtype'] == 'winner') {
        if (games[message['game_id']]) {
            end_game(message['game_id'], message['winner']);
        }
    }

}

function get_game_id_from_cell(node) {

}


function select_cell(cell) {
    //game_step(get_game_id_from_cell(cell), cell.id);
}

function create_grid(game_id) {

}


function create_game(game_id, opponent_uuid, my_symbol, turn_uuid, num, opponent_symbol) {
    games[game_id] = {
        'map'               : [0,0,0,0,0,0,0,0,0],
        'uuid'              : opponent_uuid,
        'symbol'            : my_symbol,
        'turn'              : turn_uuid,
        'timeout'           : null,
        'interval'          : null,
        'time_remaining'    : 60,
        'num'               : num,
        'opponent_symbol'   : opponent_symbol
    };
    debug_log('CREATING GAME : [' + game_id + ']' + JSON.stringify(games[game_id]));
    create_grid(game_id);
    update_opponent(game_id, opponent_uuid);
    update_my_uuid(game_id, pubnub.get_uuid());
    update_game_status(game_id, 'Game Started');
    update_turn(game_id, turn_uuid);
    current_game_count++;
    game_count++;

}

function end_game(game_id, winner_uuid) {

    update_game_status(game_id, 'finished');

    if (winner_uuid == pubnub.get_uuid()) {
        update_result(game_id, "You won");
    } else if (winner_uuid == '') {
        update_result(game_id, "Draw");
    } else {
        update_result(game_id, "You lost");
    }
    debug_log('END GAME : [' + game_id + ']' + JSON.stringify(games[game_id]));
    pubnub.unsubscribe({channel : game_id});
    delete games[game_id];
    current_game_count--;
    games_completed++;
    if (is_auto_join()) {
        var i = getRandomInt(0, lobby.length - 1);
        start_handshake(lobby[i], lobby[i]);
    }
}

function enter_lobby() {
    pubnub.subscribe({
        'restore' : true,
        'channel' : get_lobby_channel(),
        'callback' : function(r) {

            /* read message only if we are either player 1 or player 2 */

            if (r['game'] == 'tictactoe' && 
                (r['p1_uuid'] == pubnub.get_uuid() || 
                r['p2_uuid'] == pubnub.get_uuid())) {
                    debug_log('HANDSHAKE ' + r['step'] + ' RECEIVED : ' + JSON.stringify(r));
                    // handle handshakes
                    if (r['mtype'] == 'handshake') {
                        switch(r['step']) {

                            case 1: // some one has asked us to play

                                if (r['p2_uuid'] == pubnub.get_uuid()) { // we are player 2, send handshake
                                    start_handshake_2(r['p1_uuid'], r['turn']);
                                }   
                                break;

                            case 2: // some has responded to our play request
                                if (r['p1_uuid'] == pubnub.get_uuid()) { // we are player 1, we send initial request

                                    // leave lobby. we might want to remove this in case playing multiple games
                                    // at same time is going to be supported later on.
                                    //pubnub.unsubscribe({channel : get_lobby_channel()}); 
                                    
                                    // create a private channel to play the game.
                                    pubnub.subscribe({
                                        'restore' : true,
                                        'channel' : r['game_id'],
                                        'callback' : function(r1) {
                                            handle_game_messages(r1);
                                        },
                                        'error' : function(r1) {

                                        },
                                        'presence' : function(r1) {
                                            if (r1['action'] == 'join' && r1['uuid'] == r['p2_uuid']) {
                                                create_game(r['game_id'], r['p2_uuid'], get_symbol(1), r['turn'], 1, r['symbol']);
                                                /*
                                                game_id = r['game_id'];
                                                game = games[game_id];
                                                clear_timers(game_id);
                                                game['timeout'] = setTimeout(function(){
                                                    clear_timers(game_id);
                                                    declare_winner(game_id, pubnub.get_uuid());
                                                    //end_game(game_id, game['uuid']);
                                                }, 60000)

                                                game['interval'] = setInterval(function() {
                                                    update_time_remaining(game_id, game['time_remaining']);
                                                    game['time_remaining']--;
                                                }, 1000);
                                                */
                                            }
                                        },
                                        'connect' : function(r1) {

                                            // send handshake 3 to acknowledge that we are starting

                                            start_handshake_3(r['p2_uuid'], r['turn'], r['game_id']);

                                        }
                                    });
                                }
                                break;

                            case 3: // some one has confirmed the game

                                if (r['p2_uuid'] == pubnub.get_uuid()) { // we are player 2, player 1 has confirmed 

                                    // leave lobby. we might want to remove this in case playing multiple games
                                    // at same time is going to be supported later on.                                    
                                    //pubnub.unsubscribe({channel : get_lobby_channel()});

                                    pubnub.subscribe({
                                        'restore' : true,
                                        'channel' : r['game_id'],
                                        'callback' : function(r1) {
                                            handle_game_messages(r1);
                                        },
                                        'error' : function(r1) {

                                        },
                                        'connect' : function(r1) {
                                            setTimeout(function(){
                                                create_game(r['game_id'], r['p1_uuid'], get_symbol(2), r['turn'], 2, r['symbol']);
                                            },2000);
                                        }
                                    });
                                }
                                break;
                        }
                    }

            }
        },
        'error' : function(r) {

        },
        connect : function(r) {
            if (is_auto_join()) {
                var i = getRandomInt(0, lobby.length - 1);
                if (lobby[i] && lobby[i] != pubnub.get_uuid()) start_handshake(lobby[i], lobby[i]);
            }
            /*
            pubnub.here_now({
                'channel' : get_lobby_channel(),
                'callback' : function(r) {
                    var uuids = r.uuids;

                    
                    var i = getRandomInt(0,uuids.length - 1);
                    var count = 0;
                    while(uuids[i] != pubnub.get_uuid() && uuids.length > 1 && count < 4) {
                        i = getRandomInt(0, uuids.length - 1);
                        count++;
                    }
                    start_handshake(uuids[i], uuids[i]);
                    
                    lobby = []
                    for ( var i in uuids) {
                        add_to_lobby(uuids[i]);
                    }
                    draw_lobby(lobby);
                },
                'error' : function (r) {

                }
            });
            */

            
        },
        presence : function(r) {
              /*$("#lobby table").append('<tr><td onclick="start_handshake(this.innerHTML, this.innerHTML);">'+r.uuid+'</td></tr>') */
            
            if (r.action == 'join' && r.uuid != pubnub.get_uuid()) {
                update_lobby(r.uuid);
                //start_handshake(r.uuid , r.uuid);
            }
            if ((r.action == 'leave' || r.action == 'timeout') && r.uuid != pubnub.get_uuid()) {
                for ( var i in lobby) {
                    if (r.uuid == lobby[i]) {
                        lobby[i] = 0;
                        draw_lobby(lobby);
                    }
                }
                
                //start_handshake(r.uuid , r.uuid);
            }
            
        }
    });
}

function add_to_lobby(uuid) {
    for (var i in lobby) {
        if (lobby[i] == uuid) {
            return;
        }
    }
    lobby.push(uuid); 
}

function update_lobby(uuid) {
    add_to_lobby(uuid);
    draw_lobby(lobby);
}


function game_step(game_id, position) {

    var game = games[game_id];
    if (game) {
        if (game['map'][position] == 0 && game['turn'] == pubnub.get_uuid()) {
            
            var m = [];

            for ( var i in game['map']) {
                m[i] = game['map'][i];
            }

            m[position] = get_my_num(game_id);
            var message = {
                'mtype' : 'game',
                'game_id' : game_id,
                'map' : m,
                'turn' : game['uuid']
            }
            message['sender'] = pubnub.get_uuid();
            message['id'] = ++message_count; 

            function p(m) {
                pubnub.publish({
                    'channel' : game_id,
                    'message' : message,
                    'callback' : function(r){try {game['map'][position] = get_my_num(game_id);} catch (e) {}debug_log('SENT GAME STEP ['+ game_id +'] : ' + JSON.stringify(message))},
                    'error' : function(r){debug_log('ERROR in publish ' + JSON.stringify(r) + ', ' + JSON.stringify(message)); p(m);}
                })
            }
            p(message);
        }
    }
}

function draw_lobby(uuids) {

}

function clear_screen() {

}

function populate_lobby() {
    get_player_list(function(r){
            var array = r.uuids;
            for (var i in array) {
                add_to_lobby(array[i]);   
            }
            draw_lobby(lobby);
            enter_lobby();
    })
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function start() {

    if (is_display_mode()) {
        enter_lobby(); 
    } else {
        populate_lobby();
    }

    setInterval(function() {
       debug_log('No. of games in progress : ' + Object.size(games) + ', Game Count = ' + game_count + ', Games completed = ' + games_completed);
       debug_log('RUNNING GAMES : ' + JSON.stringify(games));
    }, 5000); 
}

start();