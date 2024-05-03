/* 
// failed promisify attempt
// const util = require('util');
// const spawn = util.promisify(require('child_process').spawn);

// async function spawnProcessForCommandLsPromise() {
//     try {
//         const {stdout, stderr} = await spawn("ls", ["-la"]);
//         console.log(`ls stdout: ${stdout}`);
//         console.log(`ls stderr: ${stderr}`);
//     } catch(error) {
//         console.log(`ls error: ${error.message}`);
//     }
// }

// async function spawnProcessForCommandMongodPromise() {
//     try {
//         const {stdout, stderr} = await spawn("mongod", ["--dbpath=/Users/yifan/data/db/"]);
//         console.log(`mongod stdout: ${stdout}`);
//         console.log(`mongod stderr: ${stderr}`);
//     } catch(error) {
//         console.log(`mongod error: ${error.message}`);
//     }
// }

// spawnProcessForCommandMongodPromise();
// spawnProcessForCommandLsPromise();
*/


const { spawn } = require("child_process");
/* 
// Successful testing running multiple commands using one spawn call/process by providng {shell: true} option to spawn()
const nodeServer = spawn('cd /Users/yifan/Desktop/Python_Projects/LIZ_Project/AuthPortal/server && pwd && nodemon', {shell: true});

nodeServer.stdout.on("data", data => {
    console.log(`nodeServer stdout: ${data}`);
});
*/
function spawnProcessForCommandLs() {
    const ls = spawn("ls", ["-la"]);

    ls.stdout.on("data", data => {
        console.log(`ls stdout: ${data}`);
    });
    
    ls.stderr.on("data", data => {
        console.log(`ls stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`ls error: ${error.message}`);
    });
    
    ls.on("close", code => {
        console.log(`child process for ls exited with code ${code}`);
    });
}

function spawnProcessForCommandMongod() {
    // const mongod = spawn('mongod --dbpath=/Users/yifan/data/db/', {shell: true});
    // Now use brew to manage mongodb instance
    const mongod = spawn('brew services start mongodb-community@6.0', {shell: true});

    mongod.stdout.on("data", data => {
        console.log(`[mongod stdout]: ${data}`);
    });
    
    mongod.stderr.on("data", data => {
        console.log(`[mongod stderr]: ${data}`);
    });
    
    mongod.on('error', (error) => {
        console.log(`[mongod error]: ${error.message}`);
    });
    
    mongod.on("close", code => {
        console.log(`child process for mongod exited with code ${code}`);
    });
}

function spawnProcessForAuthPortalServer(serverFilePath) {
    const nodeServer = spawn(`cd ${serverFilePath} && pwd && nodemon`, {shell: true});

    nodeServer.stdout.on("data", data => {
        console.log(`[nodeServer stdout]: ${data}`);
    });
    
    nodeServer.stderr.on("data", data => {
        console.log(`[nodeServer stderr]: ${data}`);
    });
    
    nodeServer.on('error', (error) => {
        console.log(`[nodeServer error]: ${error}`);
    });
    
    nodeServer.on("close", code => {
        console.log(`child process for nodeServer exited with code ${code}`);
    });
}

function spawnProcessForPythonServer(serverFilePath, virtualEnv, portNumber) {
    const pythonServer = spawn(`cd ${serverFilePath} && pwd && source activate ${virtualEnv} && nodemon node.py -p=${portNumber}`, {shell: true});
    // NOTE: actually nodemon is a delicously generic tool and knows that .py files should be executed with python for example; thus it will automatically restart 'python node.py -p=whateverport' on file changes: https://stackoverflow.com/questions/49355010/how-do-i-watch-python-source-code-files-and-restart-when-i-save
    // Thus whenever needing to install new python package, we need to install it under the BEIS-V050 virtual environment
    // a) start new terminal and cd /Users/yifan/Desktop/Python_Projects/LIZ_Project/core-python-finished
    // b) source activate BEIS-V050
    // c) e.g. python3 -m pip install pymongo[srv]   and   python3 -m pip install python-dotenv
    pythonServer.stdout.on("data", data => {
        console.log(`[pythonServer on port=${portNumber} stdout]: ${data}`);
    });
    
    pythonServer.stderr.on("data", data => {
        console.log(`[pythonServer on port=${portNumber} stderr]: ${data}`);
    });
    
    pythonServer.on('error', (error) => {
        console.log(`[pythonServer error on port=${portNumber}]: ${error}`);
    });
    
    pythonServer.on("close", code => {
        console.log(`child process for pythonServer on port=${portNumber} exited with code ${code}`);
    });
}

function spawnProcessForAuthPortalClient(clientFilePath) {
    const reactClient = spawn(`cd ${clientFilePath} && pwd && sudo npm start`, {shell: true});

    reactClient.stdout.on("data", data => {
        console.log(`[reactClient stdout]: ${data}`);
    });
    
    reactClient.stderr.on("data", data => {
        console.log(`[reactClient stderr]: ${data}`);
    });
    
    reactClient.on('error', (error) => {
        console.log(`[reactClient error]: ${error}`);
    });
    
    reactClient.on("close", code => {
        console.log(`child process for reactClient exited with code ${code}`);
    });
}

const timeInterval = 8000;
const smallerTimeInterval = 2000;

spawnProcessForCommandMongod();

setTimeout(() => {
    console.log('AuthPortalServer called...');
    spawnProcessForAuthPortalServer('/Users/yifanli/Desktop/Web/AuthPortal_blockchain/server');
}, timeInterval);

setTimeout(() => {
    console.log('pythonServer 1 called...');
    spawnProcessForPythonServer('/Users/yifanli/Desktop/Web/blockchain_digital_currency_app', 'NewTestVirtualEnvOnMacpro', '5100');
}, timeInterval + smallerTimeInterval);

setTimeout(() => {
    console.log('pythonServer 2 called...');
    spawnProcessForPythonServer('/Users/yifanli/Desktop/Web/blockchain_digital_currency_app', 'NewTestVirtualEnvOnMacpro', '5101');
}, timeInterval + smallerTimeInterval);

setTimeout(() => {
    console.log('AuthPortalClient called...');
    spawnProcessForAuthPortalClient('/Users/yifanli/Desktop/Web/AuthPortal_blockchain/client');
}, timeInterval * 2);
