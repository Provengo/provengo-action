 const core = require('@actions/core');
 const { exec } = require('child_process');
 const fs = require('fs');
 const https = require('https');

 // Function to download a file
 function downloadFile(url, dest) {
     return new Promise((resolve, reject) => {
         const file = fs.createWriteStream(dest);
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
     });
 }

 async function run() {
     try {
         const command = core.getInput('command');
         const basicParameters = JSON.parse(core.getInput('basic_parameters'));
         const commandParameters = JSON.parse(core.getInput('command_parameters'));

         console.log(`command: ${command}`);
         console.log(`basicParameters: ${basicParameters}`);
         console.log(`commandParameters: ${commandParameters}`);

         // Define the URL to download from (customize this)
         const downloadProvengo = 'https://downloads.provengo.tech/unix-dist/deb/Provengo-deb.deb';

         // Download the software
         await downloadFile(downloadProvengo, "./Provengo-deb.deb");

         // Unzip the downloaded software if it’s a zip file (adjust as needed)
         const unzipCommand = `sudo apt-get install ${outputFilePath}`;
         exec(unzipCommand, (installationError) => {
             if (installationError) {
                 core.setFailed(`Installation failed: ${installationError.message}`);
                 return;
             }

         });
         //   const softwarePath = path.resolve('./your-software/your-executable-or-script'); // Adjust as needed

         //   // Set permissions if needed (for Unix-like systems)
         //   fs.chmodSync(softwarePath, '755'); // Make executable

         // Build the command to run your software
         const params = [
             // JSON.stringify(basicParameters),     // Basic parameters
             // JSON.stringify(commandParameters)     // Command-specific parameters
         ].join(' ');

         const fullCommand = `provengo --batch-mode create new/pr`;

         exec(fullCommand, (executeError, stdout, stderr) => {
             if (executeError) {
                 core.setFailed(`Execution failed: ${executeError.message}`);
                 return;
             }
             console.log(`Output: ${stdout}`);
             console.error(`Errors: ${stderr}`);
         });


         fullCommand = `provengo run new/pr`;
         exec(fullCommand, (executeError, stdout, stderr) => {
             if (executeError) {
                 core.setFailed(`Execution failed: ${executeError.message}`);
                 return;
             }
             console.log(`Output: ${stdout}`);
             console.error(`Errors: ${stderr}`);
         });

     } catch (error) {
         core.setFailed(error.message);
     }
 }

 run();


//const core = require('@actions/core');
//const github = require('@actions/github');
//
//try {
//  // `who-to-greet` input defined in action metadata file
//  const nameToGreet = core.getInput('who-to-greet');
//  console.log(`Hello ${nameToGreet}!`);
//  const time = (new Date()).toTimeString();
//  core.setOutput("time", time);
//  // Get the JSON webhook payload for the event that triggered the workflow
//  const payload = JSON.stringify(github.context.payload, undefined, 2)
//  console.log(`The event payload: ${payload}`);
//} catch (error) {
//  core.setFailed(error.message);
//}