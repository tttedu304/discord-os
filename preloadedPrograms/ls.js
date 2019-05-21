var output = ""
var path = ""
if (args[1]) {
    path = args[1]
} else {
    path = cwd
}
if (typeof getItem(library, path) == "object") {
    items = Object.keys(getItem(library, path))
    items.forEach(item => {
        output += `${item}\n`
    })
    print(output)
}