
//     prove-node
//     Copyright (c) 2013 Prove <support@getprove.com> (https://getprove.com/)
//     MIT Licensed

// # test - verify

var vows         = require('vows')
  , assert       = require('assert')
  , fs           = require('fs')
  , path         = require('path')
  , apiKey       = process.env.PROVE

if (!apiKey)
  throw new Error('missing PROVE apiKey')

var getprove = require('../')(apiKey)

vows.describe('verify').addBatch({

  'Create a new verification': {

    topic: function() {
      var that = this
      getprove.verify.create({
        tel: '1234567890'
      }, that.callback)
    }, 'returns verify': function(err, verify) {
      assert.isNull(err);
      assert.isDefined(verify);
      assert.isDefined(verify.id);
    }

  },

  'Verify a pin': {
    topic: function() {
      var that = this
      getprove.verify.create({
        tel: '1234567890'
      }, function(err, verify) {
        assert.isNull(err)
        assert.isDefined(verify)
        assert.isDefined(verify.id)
        getprove.verify.pin(verify.id, "000000", that.callback)
      })
    }, 'returns verify': function(err, verify) {
      assert.isNull(err)
      assert.isDefined(verify)
      assert.isTrue(verify.verified)
    }
  },

  'List all verifications': {
    topic: function() {
      var that = this
      getprove.verify.list(that.callback)
    }, 'returns verifications': function(err, verifications) {
      assert.isNull(err)
      assert.isDefined(verifications)
      assert.isArray(verifications)
    }
  },

  'Retrieve existing verification': {
    topic: function() {
      var that = this
      getprove.verify.create({
        tel: '1234567890'
      }, function(err, verify) {
        assert.isNull(err)
        assert.isDefined(verify)
        assert.isDefined(verify.id)
        getprove.verify.pin(verify.id, "000000", function(err, verify) {
          assert.isNull(err)
          assert.isDefined(verify)
          assert.isTrue(verify.verified)
          getprove.verify.retrieve(verify.id, that.callback)
        })
      })
    }, 'returns verify': function(err, verify) {
      assert.isNull(err)
      assert.isDefined(verify)
      assert.isDefined(verify.id)
    }
  }

}).export(module, { error: false })
