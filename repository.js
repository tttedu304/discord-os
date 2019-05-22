const fs = require("fs")
const queue = require("queue")
const fsextra = require("fs-extra")
const deep = require("./deep")
module.exports.getPackageData = (name, callback) => {
    if (require(`./repository/${name}.json`)) {
        var manifest = require(`./repository/${name}.json`)
        var files = []
        manifest.files.forEach(file => {
            fs.readFile(`./repository/data/${name}${file.path}`, "utf8", (err, data) => {
                files.push({
                    path: file.installPath,
                    data: data
                })
                if (files.length >= manifest.files.length) {
                    callback(files)
                }
            })
        })
        
        
        
    }
} 

module.exports.publishPackage = (manifest, base, callback) => {
    manifest = JSON.parse(manifest)
    
    var q = queue()
    /*
        createManifest: false,
        createDataDirectory: false,
        createFiles: false,
    */
   var files = []
    manifest.files.forEach(file => {
        files.push({
            path: file.path,
            data: deep(base, file.path)
        })
    })
    console.log(files)
    q.push(function (){
        fsextra.writeFile(`./repository/${manifest.name}.json`, JSON.stringify(manifest))
    })
    q.push(function (){fsextra.ensureDir(`./repository/data/${manifest.name}`)})
    files.forEach(file => {
        q.push(function (){
            fsextra.ensureFile(`./repository/data/${manifest.name}${file.path}`)
        })
        q.push(function (){
            fsextra.writeFile(`./repository/data/${manifest.name}${file.path}`, file.data)
        })
    })
    q.start(callback)
}