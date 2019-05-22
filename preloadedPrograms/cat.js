args.shift()
args.forEach(file => {
    if (file[0]!="/") {
        path = cwd + "/" + file
    } else {
        path = file
    }
    path = Path.normalize(path)
    if(getItem(library, path) != "object") {
        print(getItem(library, path))
    } else {
        print(file + " is a directory")
    }
});