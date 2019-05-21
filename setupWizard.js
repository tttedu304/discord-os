module.exports = (library, message, callback) => {

    message.channel.send("Generating files...")
    library.system = {}
    library.bin = {}
    library.system.info = `name\t${message.author.tag}`
    callback(library)
}