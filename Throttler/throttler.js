/* eslint-disable @typescript-eslint/no-var-requires */
//throttle-proxy
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const proxy = require('throttle-proxy');

const app = express();
const port = 3001;

app.set('json spaces', 2);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let throttleProxy = null;

app.post('/prepThrottle', (req, res) => {
    console.log(new Date().toLocaleString(), ` - Prep Proxy ${req.body.profile[0].bandwidth}`);
    throttle(req.body.profile[0].bandwidth);
    res.sendStatus(200);
});

app.post('/updateThrottle/:bandwidth', async (req, res) => {
    console.log(new Date().toLocaleString(), ` - Update Proxy ${req.params.bandwidth}`);
    throttle(req.params.bandwidth);
    return res.sendStatus(200);
});

app.post('/resetThrottle', (req, res) => {
    console.log(new Date().toLocaleString(), ' - Reset Proxy');
    startDefaultProxy();
    res.sendStatus(200);
});

function throttle(value) {
    throttleProxy && throttleProxy.close();
    throttleProxy = proxy({
        port: 1080,
        incomingSpeed: value * 100,
        outgoingSpeed: value * 100,
        delay: 0,
    });
}

function startDefaultProxy() {
    throttleProxy && throttleProxy.close();
    throttleProxy = proxy({
        port: 1080,
        incomingSpeed: 500000, //5mbps
        outgoingSpeed: 500000, //5mbps
        delay: 0,
    });
}

app.listen(port, () => {
    console.log(new Date().toLocaleString(), ` - Start Default Proxy`);
    startDefaultProxy();
});

// app.get('/startThrottle', async (req, res) => {
//     console.log(throttleProfile);
//     await throttler(throttleProfile);
//     return res.sendStatus(200);
// });

// function sleep(min) {
//     return new Promise((resolve) => setTimeout(resolve, min * 60000));
// }

// 400000kbps == 4mbps
// 400000
// async function throttler(profile) {
//     for (let i = 0; i <= profile.length - 1; i++) {
//         console.log(new Date().toLocaleString(), ` - Throttle @ ${profile[i].bandwidth}`);

//         throttleProxy && throttleProxy.close();
//         throttleProxy = proxy({
//             port: 1080,
//             incomingSpeed: profile[i].bandwidth * 100,
//             outgoingSpeed: profile[i].bandwidth * 100,
//             delay: 0,
//         });
//         console.log(new Date().toLocaleString(), ' - sleeping for ', profile[i].end - profile[i].start);
//         await sleep(profile[i].end - profile[i].start);
//     }
//     startDefaultProxy();
// }

// if (!primaryThrottle) {
//     console.log(new Date().toLocaleString(), ` - Primary Throttle`);
//     primaryThrottle = exec(`throttle-proxy -v -s ${profile[i].bandwidth * 100}`, (stdout, stderr) => {
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//     });
//     secondaryThrottle && (secondaryThrottle.kill(), (secondaryThrottle = undefined));
// } else {
//     console.log(new Date().toLocaleString(), ` - Secondary Throttle`);
//     primaryThrottle && (primaryThrottle.kill(), (primaryThrottle = undefined));
//     secondaryThrottle = exec(`throttle-proxy -v -s ${profile[i].bandwidth * 100}`, (stdout, stderr) => {
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//     });
// }

// setTimeout(() => {
// console.log(`Throttle @ ${profile[i].bandwidth} for ${profile[i].position * 60000}`);
// if (!primaryThrottle) {
//     console.log(`Primary Throttle @ ${profile[i].bandwidth}, for ${profile[i].position * 1000}`);
//     primaryThrottle = exec(`throttle-proxy -v -s ${profile[i].bandwidth * 100}`, (err, stdout, stderr) => {
//         if (err) {
//             return;
//         }
//         // the *entire* stdout and stderr (buffered)
//         console.log(`stdout: ${stdout}`);
//         console.log(`stderr: ${stderr}`);
//     });
//     return secondaryThrottle && (secondaryThrottle.kill(), (secondaryThrottle = undefined));
// }
// if (!secondaryThrottle) {
//     console.log(`Secondary Throttle @ ${profile[i].bandwidth}, for ${profile[i].position * 1000}`);
//     secondaryThrottle = exec(
//         `throttle-proxy -v -s ${profile[i].bandwidth * 100}`,
//         (err, stdout, stderr) => {
//             if (err) {
//                 return;
//             }
//             // the *entire* stdout and stderr (buffered)
//             console.log(`stdout: ${stdout}`);
//             console.log(`stderr: ${stderr}`);
//         },
//     );
//     return primaryThrottle && (primaryThrottle.kill(), (primaryThrottle = undefined));
// }
// }, profile[i].position * 60000);
