import fs from 'fs'

export default (dir, files, callback) => {
    var maxFiles = files.length - 1
    files.map((ele, key) => {
        fs.unlink(dir + ele, (err) => {
            if (err) {
                console.log(err)
                if (key === maxFiles) {
                    callback(true)
                }
            } else {
                console.log("Delete File successfully.");
                if (key === maxFiles) {
                    callback(true)
                }
            }
        });
    })
}

export const DeleteOneFile = (file, callback) => {
    fs.unlink(file, (err) => {
        if (err) {
            callback(true)
        } else {
            console.log("Delete File successfully.");
            callback(true)
        }
    });
}