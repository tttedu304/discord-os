var fs = require("fs")
module.exports.get = (name, callback) => {
    var result = ""
    fs.readFile("./preloadedPrograms/"+name+".js", "utf8", (err, data) => {
        if (err) { result = undefined } else {
            result = data
        }
        callback(result)
    })
}