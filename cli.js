const path = require('path')
const fs = require('fs')
const meow = require('meow')
const { generateKeystore, recoverKeystore } = require('.')

const cli = meow(`
    Usage
      $ ethereum-keystore [input] [options]

    Options
      --generate, -g      Generate keystore
      --recover, -r       Recover keystore
      --private-key, -k   Private key
      --passphrase, -p    Passphrase
      --outfile, -o       Output file

    Examples
      $ ethereum-keystore -g -p mysecret
      {"address":"281fe82d16e0ba4036a49074af87b313cc5844c5", ... }

      $ ethereum-keystore -g -p mysecret > keystore.json

      $ ethereum-keystore -g -p mysecret -o keystore.json

      $ ethereum-keystore -g -k 4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d -p mysecret
      {"address":"90f8bf6a479f320ead074411a4b0e7944ea8c9c1", ... }

      $ ethereum-keystore -r keystore.json -p mysecret
      4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d

      $ cat keystore.json | ethereum-keystore -r -p mysecret
      4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d
`, {
  flags: {
    generate: {
      type: 'boolean',
      alias: 'g'
    },
    recover: {
      type: 'string',
      alias: 'r'
    },
    privateKey: {
      type: 'string',
      alias: 'k'
    },
    passphrase: {
      type: 'string',
      alias: 'p'
    },
  }
})

if (process.stdin) {
  process.stdin.setEncoding('utf8')
  process.stdin.resume()
  let content = ''
  process.stdin.on('data', (buf) => {
    content += buf.toString()
  })
  setTimeout(() => {
    content = content.trim()

    if (!content) {
      content = cli.input[0]
    }

    run({
      input: content,
      ...cli.flags
    })
  }, 10)
} else {
  const input = cli.input[0]

  run({
    input,
    ...cli.flags
  })
}

async function run(opts) {
  if (
    opts.generate ||
    (opts.input||'').replace(/^0x/gi, '').length === 64
  ) {
    const keystore = await generateKeystore(opts.input || opts.privateKey, opts.passphrase)
    const keystoreJson = JSON.stringify(keystore)
    if (opts.outfile) {
      fs.writeFileSync(path.resolve(opts.outfile), keystoreJson)
    } else {
      console.log(keystoreJson)
    }
    process.exit(0)
  } else if (opts.recover || opts.input) {
    if (opts.recover) {
      opts.input = JSON.parse(fs.readFileSync(path.resolve(opts.recover)).toString().trim())
    }

    const privateKey = await recoverKeystore(opts.input, opts.passphrase)
    if (opts.outfile) {
      fs.writeFileSync(path.resolve(opts.outfile), privateKey)
    } else {
      console.log(privateKey)
    }
    process.exit(0)
  } else {
    console.log('Invalid input')
    cli.showHelp()
    process.exit(1)
  }
}
