const which = require('which')

async function test() {
  try {
    const path = await which('git')
    console.log('git found in', path)
  } catch (err) {
    console.log(err)
  }
}

test()
