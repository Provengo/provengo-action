const core = require('@actions/core');
const { exec } = require('child_process');
const { execSync } = require('child_process');

const fs = require('fs');
const https = require('https');
const util = require('util');

//const basicParametersToFlags = {"batch-mode": {"flag": "--batch-mode", "input": false}, "verbose":  {"flag": "--verbose", "input": false}, "profile":  {flag: "-p", "input": true}} //basic}
//const parametersToFlags = { "selenium-server": {"flag": "--selenium-server", "input": true}, "junit-report":  {"flag": "--junit-report", "input": false}, //run
//                            "highlight": {"flag": "--highlight", "input": true}, "layout": {"flag": "--layout", "input": true} , "style": {"flag": "--style", "input":true} //analyze
//                            "single-file": {"flag": "--single-file", "input":false} , "overwrite": {"flag": "--overwrite", "input":false}, //gen-scripts
//                            "format": {"flag": "-f", "input":true}, "suites": {"flag": "--suites", "input":true}, //report
//                            "algorithm": {"flag": "-a", "input":true}, "size": {"flag": "--size", "input":true}, "max-length": {"flag": "-m", "input":true}, //Sample
//                            "size": {"flag": "--size", "input":true}, "algorithm": {"flag": "-a", "input":true}, "ranking-function": {"flag": "--ranking-function", "input":true}, //Ensembler
//                            "format": {"flag": "-f", "input":true}//Gen-Book
//                            }

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
         let command = core.getInput('command');

//         console.log(`###### : ${run} #######`);

         let basicParameters = JSON.parse(core.getInput('basic_parameters'));
         let commandParameters = JSON.parse(core.getInput('command_parameters'));

         console.log(`command: ${command}`);

         // Define the URL to download from (customize this)
         let downloadProvengo = 'https://downloads.provengo.tech/unix-dist/deb/Provengo-deb.deb';
         let outputFilePath = "./Provengo-deb.deb";
         // Download the software
         await downloadFile(downloadProvengo, outputFilePath);

         //   let softwarePath = path.resolve('./your-software/your-executable-or-script'); // Adjust as needed

            // Set permissions if needed (for Unix-like systems)
         fs.chmodSync(outputFilePath, '755'); // Make executable

         // Unzip the downloaded software if it’s a zip file (adjust as needed)
         let installProvengo = `sudo apt-get install ${outputFilePath}`;
         let output = execSync(installProvengo);

//
//         let fullCommand = `provengo --batch-mode create new/pr`;
////
//         console.log("4")
//         exec(fullCommand, (executeError, stdout, stderr) => {
//             if (executeError) {
//                 core.setFailed(`Execution failed: ${executeError.message}`);
//                 return;
//             }
//             console.log(`create provengo Output: ${stdout}`);
//             console.error(`create provengo Errors: ${stderr}`);
//         });
////
//         console.log("5")
//         fullCommand = `provengo run new/pr`;
//         exec(fullCommand, (executeError, stdout, stderr) => {
//             if (executeError) {
//                 core.setFailed(`Execution failed: ${executeError.message}`);
//                 return;
//             }
//             console.log(`run provengo Output: ${stdout}`);
//             console.error(`run provengo Errors: ${stderr}`);
//         });
//        console.log("6")
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