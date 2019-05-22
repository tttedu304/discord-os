args.shift()
args.forEach(file => {
    if (file[0]!="/") {
        path = cwd + "/" + file
    } else {
        path = file
    }
    path = Path.normalize(path)
    if(getItem(library, file)!=undefined) {
        removeItem(file)
    } else {
        print(file + " not found")
    }
});