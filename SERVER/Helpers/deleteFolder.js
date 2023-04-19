import fs from 'fs'

export default (dir,done) => {
    fs.rm(dir, { recursive: true, force: true }, (err) => {
        if (err) {
            done(false)
        } else {
            done(true)
        }
    })
}