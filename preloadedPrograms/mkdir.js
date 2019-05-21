if (args[1]) {
    paths = Path.normalize(args[1]).split("/")
    var current = library
    for(i=0; i<paths.length; i++){
        if(current[paths[i]]!=undefined){
            current[paths[i]] = {}
        }
        current = current[paths[i]]
    }
}