import * as child_process from 'child_process';

let interpreter = child_process.spawn('../tlox')
interpreter.stdout.on('data', (data) => {
    console.log(data.toString());
});
interpreter.stdin.setDefaultEncoding('utf8')
interpreter.stdin.write('15 - 5\n');

// async function startInterpreter() {
//     return new Promise(function (resolve, reject) {
//         exec("../tlox", (err, stdout, stderr) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve({ stdout, stderr });
//             }
//         });
//     });
// }

// async function main() {
//     //let { stdout } = await startInterpreter()

//     for (let line of stdout.split('\n')) {
//         console.log(`ls: ${line}`);
//     }
// }

// main();