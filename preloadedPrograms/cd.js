if (args[1]) {
    target = Path.normalize(args[1])
    if (typeof getItem(library, target) != "object") {
        print(target + " is not a directory")
    } else {
        updateCWD(Path.normalize(args[1]))
    }
    
}
