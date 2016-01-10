path = require("path");
assert = require("assert");
PUBNUB = require('../pubnub.js');
sepia = require('sepia');
_ = require('underscore');

sepia.fixtureDir(path.join(__dirname, 'sepia-fixtures', "ssl_test"));

function getRandom(max) {
  return Math.floor((Math.random() * (max || 1000000000) + 1))
}

function getTestUUID(){
  if ( _.contains(["playback", "cache"], process.env.VCR_MODE) ){
    return "dd6af454-fa7a-47be-a800-1b9b050f5d94"
  } else {
    return require('node-uuid').v4()
  }
}

function getChannelPostFix() {
  if ( _.contains(["playback", "cache"], process.env.VCR_MODE) ){
    return 10
  } else {
    return getRandom()
  }
}

describe("When SSL mode", function () {
  var fileFixtures = {};
  var itFixtures = {};

  before(function () {
    fileFixtures.channel = "test_javascript_ssl";
    fileFixtures.origin = 'blah.pubnub.com';
    fileFixtures.uuid = getTestUUID();
    fileFixtures.message = "hello";
    fileFixtures.publishKey = 'ds';
    fileFixtures.subscribeKey = 'ds';
  });


  describe("is enabled", function () {

      it("should be able to successfully subscribe to the channel and publish message to it on port 443", function (done) {

        var pubnub = PUBNUB.init({
          publish_key: fileFixtures.publishKey,
          subscribe_key: fileFixtures.subscribeKey,
          ssl: true,
          origin: fileFixtures.origin,
          uuid: fileFixtures.uuid
        });

        subscribeAndPublish(pubnub, fileFixtures.channel + "_enabled_" + getChannelPostFix(), fileFixtures.message, function(err){
          pubnub.shutdown();
          done(err);
        });
      });

      it("should send requests via HTTPS to 443 port", function (done) {
        var pubnub = PUBNUB.init({
          publish_key: fileFixtures.publishKey,
          subscribe_key: fileFixtures.subscribeKey,
          ssl: true,
          origin: fileFixtures.origin,
          uuid: fileFixtures.uuid
        });

        pubnub.publish({
          channel: fileFixtures.channel,
          message: fileFixtures.message,
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
          publish_key: fileFixtures.publishKey,
          subscribe_key: fileFixtures.subscribeKey,
          ssl: false,
          origin: fileFixtures.origin,
          uuid: fileFixtures.uuid
        });

        subscribeAndPublish(pubnub, fileFixtures.channel + "_disabled_" + getChannelPostFix(), fileFixtures.message, function (err) {
          pubnub.shutdown();
          done(err);
        });
      });

      it("should send requests via HTTP to 80 port", function (done) {
        var pubnub = PUBNUB.init({
          publish_key: fileFixtures.publishKey,
          subscribe_key: fileFixtures.subscribeKey,
          ssl: false,
          origin: fileFixtures.origin,
          uuid: fileFixtures.uuid
        });

        pubnub.publish({
          channel: fileFixtures.channel,
          message: fileFixtures.message,
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

function subscribeAndPublish(pubnub, channel, message, done) {
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
