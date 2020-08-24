const test = require('tape')
const { generateKeystore, recoverKeystore } = require('../')

test('generateKeystore - random', async (t) => {
  t.plan(1)

  const keystore = await generateKeystore()
  t.equal(keystore.address.length, 40)
})

test('generateKeystore - from private key', async (t) => {
  t.plan(1)

  const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const keystore = await generateKeystore(privateKey)
  t.equal(keystore.address, '90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
})

test('generateKeystore - with passphrase', async (t) => {
  t.plan(1)

  const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const passphrase = 'mysecret'
  const keystore = await generateKeystore(privateKey, passphrase)
  t.equal(keystore.address, '90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
})

test('generateKeystore - with options', async (t) => {
  t.plan(2)

  const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const passphrase = 'mysecret'
  const options = {
    kdf: 'pbkdf2',
    kdfparams: {
      c: 1000,
      dklen: 32,
      prf: 'hmac-sha256'
    },
    cipher: 'aes-128-ctr'
  }

  const keystore = await generateKeystore(privateKey, passphrase, options)
  t.equal(keystore.address, '90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
  t.equal(keystore.crypto.kdfparams.c, 1000)
})

test('recoverKeystore', async (t) => {
  t.plan(1)

  const keystore = { 'address': '90f8bf6a479f320ead074411a4b0e7944ea8c9c1', 'crypto': { 'cipher': 'aes-128-ctr', 'ciphertext': '99261fb5cbc95fb91215e60bf65f7a5060bcc7e18df72bdaaf60379a93fab05c', 'cipherparams': { 'iv': '1b451e34514902201ab320a00a51c8a1' }, 'mac': '964873dc9e21f4a5f59fd79844727aee7391c17b55bce7d3d178782b5de62a01', 'kdf': 'pbkdf2', 'kdfparams': { 'c': 1000, 'dklen': 32, 'prf': 'hmac-sha256', 'salt': 'b8f30f71c7db97becc69b991203808c70d02804c31e07802f8b82c6ccc51401b' } }, 'id': 'daeeb6a6-c749-4457-9e3c-9c6c74bd747a', 'version': 3 }
  const passphrase = 'mysecret'

  const privateKey = await recoverKeystore(keystore, passphrase)
  t.equal(privateKey, '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d')
})
