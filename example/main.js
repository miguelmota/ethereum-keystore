var { generateKeystore, recoverKeystore } = require('../')

var generateForm = document.querySelector('#generateForm')
var recoverForm = document.querySelector('#recoverForm')

recoverForm.upload.addEventListener('input', () => {
  const reader = new FileReader()
  reader.onload = (event) => {
    recoverForm.keystore.value = event.target.result
    recoverForm.upload.value = ''
  }

  reader.readAsText(recoverForm.upload.files[0])
})

async function generateFormHandler(event) {
  event.preventDefault()
  generateForm.output.innerHTML = ''
  generateForm.download.disabled = true
  try {
    const keystore = await generateKeystore(
      generateForm.privatekey.value,
      generateForm.passphrase.value,
      generateForm.parameters.value,
    )

    const keystoreJson = JSON.stringify(keystore)
    generateForm.output.innerHTML = keystoreJson
    generateForm.download.disabled = false
  } catch(err) {
    console.error(err)
  }
}

async function recoverFormHandler(event) {
  event.preventDefault()
  recoverForm.output.innerHTML = ''
  try {
    recoverForm.output.innerHTML = await recoverKeystore(
        recoverForm.keystore.value,
        recoverForm.passphrase.value,
      )
  } catch(err) {
    console.error(err)
  }
}

function download(text, filename) {
  const blob = new Blob([text], {type: 'text/plain'})
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

generateForm.addEventListener('submit', generateFormHandler)
recoverForm.addEventListener('submit', recoverFormHandler)
generateForm.download.addEventListener('click', () => {
  event.preventDefault()
  const keystoreJson = generateForm.output.innerHTML
  if (keystoreJson) {
    download(keystoreJson, `0x${JSON.parse(keystoreJson).address}.json`)
  }
})
