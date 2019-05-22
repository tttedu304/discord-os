if (args[1]) {
    if (args[1][0]!="/") {
        path = cwd + "/" + args[1]
    } else {
        path = args[1]
    }
    target = Path.normalize(path)
    if (typeof getItem(library, target) != "object") {
        print(target + " is not a directory")
    } else {
        updateCWD(target)
    }
    
}
