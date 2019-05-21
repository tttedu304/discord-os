print("Please, Send the file that you want to upload")
input.requestFile((data, name) => {
    var path = ""
    if (args[1]) {
        path = args[1]
    } else {
        path = cwd + "/" + name
    }
    writeItem(path, data) 

})