args.shift()
args.forEach(file => {
    if(getItem(library, Path.normalize(file)) != "object") {
        print(getItem(library, Path.normalize(file)))
    } else {
        print(file + " is a directory")
    }
});