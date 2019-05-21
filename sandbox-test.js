const {VM} = require('vm2');
 
const vm = new VM({
    timeout: 1000,
    sandbox: {print: function (string) {
        console.log(string)
    }}
});
 
vm.run("print('hola!')");