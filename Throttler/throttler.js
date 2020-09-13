/* eslint-disable @typescript-eslint/no-var-requires */
//throttle-proxy
const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

let throttleProfile = {};
let primaryThrottle;
let secondaryThrottle;

app.get('/setThrottleProfile', (req, res) => {
    throttleProfile = {};
    return null;
});

app.get('/startThrottle', (req, res) => {
    throttleProfile = [
        { position: 0, bandwidth: 400 },
        { position: 60, bandwidth: 300 },
        { position: 120, bandwidth: 400 },
        { position: 180, bandwidth: 200 },
    ];
    throttler(throttleProfile);
    return res.sendStatus(200);
});

function throttler(profile) {
    for (let i = 0; i <= profile.length - 1; i++) {
        setTimeout(() => {
            console.log(`Throttle @ ${profile[i].bandwidth}`);

            if (!primaryThrottle) {
                console.log(`Primary Throttle @ ${profile[i].bandwidth}, for ${profile[i].position * 1000}`);
                primaryThrottle = exec(`throttle-proxy -v -s ${profile[i].bandwidth * 1000}`, (err, stdout, stderr) => {
                    if (err) {
                        return;
                    }

                    // the *entire* stdout and stderr (buffered)
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                });
                return secondaryThrottle && (secondaryThrottle.kill(), (secondaryThrottle = undefined));
            }

            if (!secondaryThrottle) {
                console.log(`Secondary Throttle @ ${profile[i].bandwidth}, for ${profile[i].position * 1000}`);
                secondaryThrottle = exec(
                    `throttle-proxy -v -s ${profile[i].bandwidth * 1000}`,
                    (err, stdout, stderr) => {
                        if (err) {
                            return;
                        }

                        // the *entire* stdout and stderr (buffered)
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                    },
                );
                return primaryThrottle && (primaryThrottle.kill(), (primaryThrottle = undefined));
            }
        }, profile[i].position * 1000);
    }
}
app.listen(port);
