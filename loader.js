const {VM} = require('vm2');
const nodePath = require("path")
var request = require('request');
const repo = require("./repository")
const preprograms =  require("./preloadedPrograms")
const deep = require("./deep")


function deepFind(obj, path) {
    var paths = path.split('/')
      , current = obj
      , i;
    
    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }

module.exports = (name, library, message, cwd) => {
    var program
    var preprogram
    preprograms.get(name, (preprogram) => {
        if (!library.bin[name] && !preprograms) {
            return message.channel.send(`Program \`${name}\` not found`)
        }
        if (library.bin[name]) { program = library.bin[name] } else {
            program = preprogram
        }
        API = {
            packages: {
                getData: (name, callback) => {
                    repo.getPackageData(name, callback)
                },
                publish: (manifestPath, basePath, callback) => {
                    repo.publishPackage(deep(library, manifestPath), deep(library, basePath))
                }
            },
            print: (string) => {
                message.channel.send(string)
            },
            getItem: (library, pathString) => {
                if (pathString == "/") {
                    return library
                } else {
                    if (pathString[0] == "/") pathString = pathString.slice(1)
                    return deep(library, pathString)
                }
                
            },
            writeItem: (path,data) => {
                
                path = nodePath.normalize(path)
                deep(library, path, data)
                global.userLibrary[message.author.tag] = library
            },
            removeItem: (path) => {
                path = nodePath.normalize(path)
                deep(library, path, null, true)
                global.userLibrary[message.author.tag] = library
            },
            updateLibrary: (newLibrary) => {
                global.userLibrary[message.author.tag] = newLibrary
            },
            updateCWD: (newPath) => {
                global.userCWD[message.author.tag] = newPath
            },
            Path: {
                normalize: (path) => {
                    var target = ""

                    if (path[0] == "/") {
                        target = path
                    } else {
                        path = "/" + path
                        
                        if (path.endsWith("/")) {
                            target = cwd + path.slice(0, -1)
                        } else {
                            target = cwd + path
                        }
                        
                    }
                    return nodePath.normalize(path)       
                },
                relativize: (cwd, path) => {
                    if (path[0]!="/") {
                        path = cwd + "/" + path
                    } else {
                        path = path
                    }
                    return path
                }
            },
            user: {
                id: message.author.id,
                tag: message.author.tag
            },
            library: library,
            cwd: cwd,
            args: message.content.split(" "),
            input: {
                requestFile: (callback) => {
                    const filter = m => m.author.id == message.author.id && m.attachments.first()
                    var collector = message.channel.createMessageCollector(filter)
                    collector.on("collect", (message) => {
                        request(message.attachments.first().url, (err, res, body) => {
                            message.delete()
                            collector.stop()
                            callback(body, message.attachments.first().filename)

                        })
                    })
                }
            }
        }
        vm = new VM({
            timeout: 1000,
            sandbox: API
        });
        try {
           (async function () { vm.run(program)})()
        } catch (error) {
            message.channel.send(`Program ended due to an error\n\`\`\`${error}\`\`\``)
        }
        
    })


}