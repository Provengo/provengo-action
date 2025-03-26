const core = require('@actions/core');
const { execSync } = require('child_process');

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
     try {

         // Define the URL to download from (customize this)
         let downloadProvengo = 'https://downloads.provengo.tech/unix-dist/deb/Provengo-deb.deb';
         let outputFilePath = "./Provengo-deb.deb";
         // Download the software
         await downloadFile(downloadProvengo, outputFilePath);

         //   let softwarePath = path.resolve('./your-software/your-executable-or-script'); // Adjust as needed

            // Set permissions if needed (for Unix-like systems)
         fs.chmodSync(outputFilePath, '755'); // Make executable

         // Unzip the downloaded software if it’s a zip file (adjust as needed)
//         let installProvengo = `sudo apt-get install ${outputFilePath}`;
//         let output = execSync(installProvengo);

     } catch (error) {
         core.setFailed(error.message);
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