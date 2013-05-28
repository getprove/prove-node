
# prove-node <sup>0.0.3</sup>

[Prove](https://getprove.com/) API wrapper for Node.

* 0.0.5 - Typo fix
* 0.0.4 - Changed test pin from 1337 to 000000
* 0.0.3 - Added support for `rejectUnauthorized` for devMode
* 0.0.2 - Added devMode parameter to toggle host
* 0.0.1 - Initial release

## Quick Start

```bash
npm install getprove
```

Example:

```js
var getprove = require('getprove')('test_APIKEY123')

// Create a new verification
getprove.verify.create({ tel: '1234567890' }, createVerification)

function createVerification(err, verify) {
  if (err) throw err
  console.log('Create a new verification', verify)

  // SMS or call sent at this point (but not if we're using test api key)

  // Add something like `res.render()` here or tell the user we sent them a pin.
  // ...

  // Verify a pin (you'd use something like `req.body.pin`)
  var pin = "000000" // since we're in test mode it's always 000000
  getprove.verify.pin(verify.id, pin, function(err, verify) {
    if (err) throw err
    console.log('Verify a pin', verify)

    // Put something else like `next()` here if it was a middleware
    process.exit(0)

  })
})
```


## API

All methods take a `data` object as their first parameter and a `callback(err, response)` as their last parameter.

* `getprove.verify.list` - List all verifications `(cb)`
* `getprove.verify.create` - Create a new verification `(data, cb)`
* `getprove.verify.pin` - Verify a pin `(id, pin, cb)`
* `getprove.verify.retrieve` - Retrieve existing verification `(id, cb)`

Documentation is available at: <https://github.com/getprove/prove-api/>


## Tests

To run tests, install `vows`:

```bash
npm install vows
```

Then run:

```bash
PROVE=your-api-key vows test/*
```


## Contributors

* Nick Baugh <niftylettuce@gmail.com>


## License

The MIT License

Copyright (c) 2013- Prove <support@getprove.com> (https://getprove.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
