 const core = require('@actions/core');
 const { exec } = require('child_process');
 const fs = require('fs');
 const https = require('https');

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

const execPromise = util.promisify(exec);

 async function run() {
     try {
         let command = core.getInput('command');
         let stringBasicParameters = core.getInput('basic_parameters');
         let basicParameters = JSON.parse(core.getInput('basic_parameters'));
         let stringCommandParameters = core.getInput('command_parameters');
         let commandParameters = JSON.parse(core.getInput('command_parameters'));

         console.log(`command: ${command}`);
         console.log(`basicParameters: ${stringBasicParameters}`);
         console.log(`commandParameters: ${stringCommandParameters}`);

         // Define the URL to download from (customize this)
         let downloadProvengo = 'https://downloads.provengo.tech/unix-dist/deb/Provengo-deb.deb';
         let outputFilePath = "./Provengo-deb.deb";
         // Download the software
         await downloadFile(downloadProvengo, outputFilePath);
         console.log("1")
         //   let softwarePath = path.resolve('./your-software/your-executable-or-script'); // Adjust as needed

            // Set permissions if needed (for Unix-like systems)
         fs.chmodSync(outputFilePath, '755'); // Make executable

        console.log("2")
         // Unzip the downloaded software if it’s a zip file (adjust as needed)
         let installProvengo = `sudo apt-get install ${outputFilePath}`;
         await execPromise(installProvengo, (installationError, stdout, stderr) => {
             if (installationError) {
                 core.setFailed(`Installation failed: ${installationError.message}`);
                 return;
             }
            console.log(`install provengo`);
            console.log(`install provengo Output: ${stdout}`);
            console.error(`install provengo Errors: ${stderr}`);
         }) );
        console.log("3")
         // Build the command to run your software
         let params = [
             // JSON.stringify(basicParameters),     // Basic parameters
             // JSON.stringify(commandParameters)     // Command-specific parameters
         ].join(' ');

//         let fullCommand = `provengo --batch-mode create new/pr`;
//
         console.log("4")
         exec(fullCommand, (executeError, stdout, stderr) => {
             if (executeError) {
                 core.setFailed(`Execution failed: ${executeError.message}`);
                 return;
             }
             console.log(`create provengo Output: ${stdout}`);
             console.error(`create provengo Errors: ${stderr}`);
         });
//
         console.log("5")
         fullCommand = `provengo run new/pr`;
         exec(fullCommand, (executeError, stdout, stderr) => {
             if (executeError) {
                 core.setFailed(`Execution failed: ${executeError.message}`);
                 return;
             }
             console.log(`run provengo Output: ${stdout}`);
             console.error(`run provengo Errors: ${stderr}`);
         });
        console.log("6")
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