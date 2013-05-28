
//     prove-node
//     Copyright (c) 2013 Prove <support@getprove.com> (https://getprove.com/)
//     MIT Licensed

var querystring = require('querystring')
  , path        = require('path')
  , version     = require('./package').version
  , https       = require('https')

function responseHandler(req, callback) {

  if (typeof callback !== "function")
    return console.error('missing callback')

  req.on('response', function(res) {
    var response = ''
    res.setEncoding('utf8')
    res.on('data', function(chunk) {
      response += chunk
    })
    res.on('end', function() {
      var err = 200 === res.statusCode ? null : res.statusCode
      try {
        response = JSON.parse(response)
      }
      catch(e) {
        err = 1
        response = { error : { message : "prove - invalid json response" } }
      }
      if (err) err = { statusCode: err, response: response }
      callback(err, response)
    })
  })
}

module.exports = function(apiKey, devMode) {

  if (typeof apiKey !== 'string')
    return console.error('prove - `apiKey` not defined')

  if (typeof devMode !== 'boolean')
    devMode = false

  function prepareRequest(method, path, data, cb) {

    if (typeof cb !== 'function')
      return console.error('prove - missing callback')

    Object.keys(data).forEach(function(key) {
      if (typeof data[key] === 'object' && data[key] !== null) {
        var o = data[key];
        delete data[key]
        Object.keys(o).forEach(function(k) {
          var new_key = key + "[" + k + "]"
          data[new_key] = o[k]
        })
      }
    })

    var requestData = querystring.stringify(data)

    var headers = {
        'Accept'       : 'application/json'
      , 'User-Agent'   : 'Prove-Node'
      , 'X-Prove-Node' : version
    }

    var post = false
    switch (method) {
      case 'POST':
        headers['Content-Length'] = requestData.length
        headers['Content-Type']   = 'application/x-www-form-urlencoded; charset=UTF-8'
        post = true
        break
      case 'GET':
        path = path + '?' + requestData
        break
    }

    var requestOptions = {
        host    : (devMode) ? 'dev.getprove.com' : 'getprove.com'
      , port    : '443'
      , path    : path
      , auth    : apiKey + ':'
      , method  : method
      , headers : headers
      , rejectUnauthorized: !devMode
    }

    var req = https.request(requestOptions)
    responseHandler(req, cb)
    if (post) req.write(requestData)
    req.end()

  }

  // # Methods
  var get = function(path, data, cb) {
    prepareRequest('GET', path, data, cb)
  }

  var post = function(path, data, cb) {
    prepareRequest('POST', path, data, cb)
  }

  return {

    // # Verify
    verify: {
      list: function(cb) {
        get('/api/v1/verify', {}, cb)
      },
      create: function(data, cb) {
        post('/api/v1/verify', data, cb)
      },
      pin: function(id, pin, cb) {
        post('/api/v1/verify/' + id + '/pin', { pin: pin }, cb)
      },
      retrieve: function(id, cb) {
        get('/api/v1/verify/' + id, {}, cb)
      }
    }

  }

}
