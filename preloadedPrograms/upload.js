print("Please, Send the file that you want to upload")
input.requestFile((data, name) => {
    var path = ""
    if (args[1]) {
        if (args[1][0]!="/") {
            path = cwd + "/" + args[1]
        } else {
            path = args[1]
        }
        path = Path.normalize(path)
    } else {
        path = cwd + "/" + name
    }
    writeItem(path, data) 

})