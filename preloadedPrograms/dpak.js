if (args[1]) {
    if (args[1]=="install") {
        if (args[2]) {
            print("Getting package data...")
            packages.getData(args[2], (data) => {
                data.forEach(file => {
                    writeItem(file.path, file.data)
                })
                print(`${args[2]} installed.`)
            })
            
        }
    }
    if (args[1]=="publish") {
        if (!args[2]||!args[3]) {
            print("Missing path for manifest or data directory\nUsage: dpak publish <manifest> <data directory>")
        } else {
            manifestPath = Path.relativize(cwd, args[2])
            basePath = Path.relativize(cwd, args[3])
            packages.publish(Path.normalize(manifestPath), Path.normalize(basePath), () => {
                print("Published!")
            })
        }
    }
}