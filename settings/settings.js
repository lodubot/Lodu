const fs = require('fs')

global.videoBuffer = "https://files.catbox.moe/p0nm55.mp4"
global.mess = {
    welcome: "HELLO 👋 JAY SHREE RAM🚩💀 thx USER"
}

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
