const crypto = require('crypto')
const keythereum = require('keythereum')

const randomBytes = (byteLength) => {
  return crypto.randomBytes(byteLength)
}

const generateKeystore = (privateKey, passphrase, options) => {
  if (!privateKey) {
    privateKey = randomBytes(32)
  }

  if (!passphrase) {
    passphrase = ''
  }

  if (typeof privateKey === 'string') {
    privateKey = privateKey.replace(/^0x/gi, '')
  }

  const salt = randomBytes(32)
  const iv = randomBytes(16)
  options = options || {
    kdf: 'pbkdf2',
    kdfparams: {
      c: 100000,
      dklen: 32,
      prf: 'hmac-sha256'
    },
    cipher: 'aes-128-ctr'
  }

  return new Promise((resolve) => {
    keythereum.dump(passphrase, privateKey, salt, iv, options,
      (keyObject) => resolve(keyObject))
  })
}

const recoverKeystore = async (keystore, passphrase) => {
  if (typeof keystore === 'string') {
    keystore = JSON.parse(keystore.trim())
  }

  if (!passphrase) {
    passphrase = ''
  }

  const privateKey = await keythereum.recover(passphrase, keystore).toString('hex')
  return privateKey
}

module.exports = {
  generateKeystore,
  recoverKeystore
}
