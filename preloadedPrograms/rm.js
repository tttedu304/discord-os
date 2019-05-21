args.shift()
args.forEach(file => {
    if(getItem(library, Path.normalize(file))) {
        removeItem(file)
    } else {
        print(file + " is a directory")
    }
});