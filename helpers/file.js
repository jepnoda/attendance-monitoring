import fs from 'fs'

export const deleteIfExists = (file) => {
  if (fs.existsSync(file)) {
    fs.unlink(file, (err) => {
      if (err) console.error(err)
      console.log(`${file} deleted.`)
    })
  }
}
