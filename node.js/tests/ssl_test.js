path = require("path");
assert = require("assert");
PUBNUB = require('../pubnub.js');
sepia = require('sepia');

sepia.fixtureDir(path.join(__dirname, 'sepia-fixtures', "ssl_test"));


function getRandom(max) {
  return Math.floor((Math.random() * (max || 1000000000) + 1))
}

function getTestUUID(){
  if (process.env.HTTP_BLOCKED){
    return "dd6af454-fa7a-47be-a800-1b9b050f5d94"
  } else {
    return require('node-uuid').v4()
  }
}

function getChannelPostFix() {
  if (process.env.HTTP_BLOCKED){
    return 10
  } else {
    return getRandom()
  }
}


channel = "test_javascript_ssl";
origin = 'blah.pubnub.com';
uuid = getTestUUID();
message = "hello";
publishKey = 'demo';
subscribeKey = 'demo';

describe("When SSL mode", function () {

  describe("is enabled", function () {

      it("should be able to successfully subscribe to the channel and publish message to it on port 443", function (done) {

        var pubnub = PUBNUB.init({
          publish_key: publishKey,
          subscribe_key: subscribeKey,
          ssl: true,
          origin: origin,
          uuid: uuid
        });

        subscribeAndPublish(pubnub, channel + "_enabled_" + getChannelPostFix(), function(err){
          pubnub.shutdown();
          done(err);
        });
      });

      it("should send requests via HTTPS to 443 port", function (done) {
        var pubnub = PUBNUB.init({
          publish_key: publishKey,
          subscribe_key: subscribeKey,
          ssl: true,
          origin: origin,
          uuid: uuid
        });

        pubnub.publish({
          channel: channel,
          message: message,
          callback: function () {
            pubnub.shutdown();
            done();
          },
          error: function (err) {
            pubnub.shutdown();
            done(new Error("Error callback triggered"));
          }
        });
      });
  });

  describe("is disabled", function () {
      it("should be able to successfully subscribe to the channel and publish message to it on port 80", function (done) {
        var pubnub = PUBNUB.init({
          publish_key: publishKey,
          subscribe_key: subscribeKey,
          ssl: false,
          origin: origin,
          uuid: uuid
        });

        subscribeAndPublish(pubnub, channel + "_disabled_" + getChannelPostFix(), function (err) {
          pubnub.shutdown();
          done(err);
        });
      });

      it("should send requests via HTTP to 80 port", function (done) {
        var pubnub = PUBNUB.init({
          publish_key: publishKey,
          subscribe_key: subscribeKey,
          ssl: false,
          origin: origin,
          uuid: uuid
        });

        pubnub.publish({
          channel: channel,
          message: message,
          callback: function () {
            pubnub.shutdown();
            done();
          },
          error: function () {
            pubnub.shutdown();
            done(new Error("Error callback triggered"));
          }
        });
      });
  });

});

function subscribeAndPublish(pubnub, channel, done) {
  pubnub.subscribe({
    channel: channel,
    connect: function () {
      pubnub.publish({
        channel: channel,
        message: message
      })
    },
    callback: function (msg, envelope, ch) {
      assert.equal(message, msg);
      assert.equal(channel, ch);
      done();
    },
    error: function (err) {
      done(new Error("Error callback triggered"));
    }
  });
}
