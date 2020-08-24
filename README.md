# ethereum-keystore

> Ethereum keystore generator and reader

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/ethereum-keystore/master/LICENSE)
[![NPM version](https://badge.fury.io/js/ethereum-keystore.svg)](http://badge.fury.io/js/ethereum-keystore)

## Demo

[https://lab.miguelmota.com/ethereum-keystore](https://lab.miguelmota.com/ethereum-keystore)

## Install

```bash
npm install ethereum-keystore
```

## Getting started

Generate random keystore, encrypted with passphrase:

```javascript
const { generateKeystore } = require('ethereum-keystore')

const keystore = await generateKeystore(null, 'mysecret')
console.log(keystore)
```

Generate keystore from private key, encrypted with passphrase:

```javascript
const { generateKeystore } = require('ethereum-keystore')

const keystore = await generateKeystore('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d', 'mysecret')
console.log(keystore)
```

Generate keystore with custom parameters:

```javascript
const { generateKeystore } = require('ethereum-keystore')

const keystore = await generateKeystore(null, 'mysecret', {
  kdf: 'pbkdf2',
  kdfparams: {
    c: 100000,
    dklen: 32,
    prf: 'hmac-sha256'
  },
  cipher: 'aes-128-ctr'
})
console.log(keystore)
```

Recover private key from encrypted keystore:

```javascript
const { recoverKeystore } = require('ethereum-keystore')

const keystoreJson = require('./keystore.json')
const privateKey = await recoverKeystore(keystoreJson, 'mysecret')
console.log(privateKey)
```

## CLI

Install:

```bash
npm install -g ethereum-keystore
```

Help

```bash
$ ethereum-keystore --help

  Usage
    $ ethereum-keystore [input] [options]

  Options
    --generate, -g      Generate keystore
    --recover, -r       Recover keystore
    --private-key, -k   Private key
    --passphrase, -p    Passphrase
    --outfile, -o       Output file
```

Generate random keystore, encrypted with passphrase:

```bash
$ ethereum-keystore -g -p mysecret
{"address":"281fe82d16e0ba4036a49074af87b313cc5844c5", ... }
```

Output keystore to file:

```bash
$ ethereum-keystore -g -p mysecret -o keystore.json
```

Generate keystore from private key, encrypted with passphrase:

```bash
$ ethereum-keystore -g -k 4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d -p mysecret
```

Recover private key from encrypted keystore file:

```bash
$ ethereum-keystore -r keystore.json -p mysecret
4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

Recover private key from piped encrypted keystore:

```bash
$ cat keystore | ethereum-keystore -r -p mysecret
4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
```

## Test

```bash
npm test
```

## License

[MIT](LICENSE)
