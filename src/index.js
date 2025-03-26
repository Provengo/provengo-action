const core = require('@actions/core');
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const https = require('https');
const util = require('util');

// Function to download a file
function downloadFile(url, dest) {
    console.log(`start download file`);
    return new Promise((resolve, reject) => {
        console.log(`start download provengo`);
        let file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Download completed.');
                resolve(dest); // Resolve the promise
            });
        }).on('error', (err) => {
            fs.unlink(dest); // Delete the file async if there's an error
            reject(`Error downloading the file: ${err.message}`);
        });
        console.log(`end download provengo`);
    });
}

async function run() {
//    verify if provengo is installed, else install.
    try {
        const stdout = execSync(`provengo -v`, { encoding: 'utf-8' });
        console.log(`Provengo Installed, Version: ${stdout.trim()}`);
    } catch (error) {
         console.log("Install Provengo");
         let downloadProvengo;
         let outputFilePath;
         let installProvengo;
        try {
            const platform = process.platform;
            if(platform == "linux"){
                const osRelease = fs.readFileSync('/etc/os-release');
                if (osRelease.includes('ID=debian') || osRelease.includes('ID=ubuntu')) {
                    downloadProvengo = 'https://downloads.provengo.tech/unix-dist/deb/Provengo-deb.deb';
                    outputFilePath = "./Provengo-deb.deb";
                    installProvengo = `sudo apt-get install ${outputFilePath}`;
                } else if (osRelease.includes('ID=fedora') || osRelease.includes('ID=centos') || osRelease.includes('ID=rhel')) {
                    downloadProvengo = 'https://downloads.provengo.tech/unix-dist/rpm/Provengo-rpm.rpm';
                    outputFilePath = "./Provengo-rpm.rpm";
                    installProvengo = `sudo rpm -i Provengo-rpm.rpm`;
                }
            }

            await downloadFile(downloadProvengo, outputFilePath); // Download the software
            fs.chmodSync(outputFilePath, '755'); // Make executable
            execSync(installProvengo, (error, stdout, stderr) => {
                if (error) {
                  core.setFailed(`Execution failed: ${error.message}`);
                  return;
                }
                console.error(`stderr: ${stderr}`);
            });
            let version = execSync(`provengo -v`, { encoding: 'utf-8' });
            console.log(`Provengo Installed, Version: ${version.trim()}`);

        } catch (error) {
            core.setFailed(error.message);
        }
    }
}

run();


//let core = require('@actions/core');
//let github = require('@actions/github');
//
//try {
//  // `who-to-greet` input defined in action metadata file
//  let nameToGreet = core.getInput('who-to-greet');
//  console.log(`Hello ${nameToGreet}!`);
//  let time = (new Date()).toTimeString();
//  core.setOutput("time", time);
//  // Get the JSON webhook payload for the event that triggered the workflow
//  let payload = JSON.stringify(github.context.payload, undefined, 2)
//  console.log(`The event payload: ${payload}`);
//} catch (error) {
//  core.setFailed(error.message);
//}