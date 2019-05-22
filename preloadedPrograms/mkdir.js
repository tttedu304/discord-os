if (args[1]) {
    if (args[1][0]!="/") {
        path = cwd + "/" + args[1]
    } else {
        path = args[1]
    }
    path = Path.normalize(path)
    writeItem(path, {})
}