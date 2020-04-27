//////////////////////////////////////
////////// README Generator //////////
////////// April 27th, 2020 //////////
//////////////////////////////////////
// © 2020 Alexander James Hamilton. //
//////// All Rights Reserved. ////////
//////////////////////////////////////


// Libraries
const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const axios = require("axios");

// file writing functions
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);


// inquirer constructors
function InputPrompt(name, message) {
    this.name = name,
    this.message = message,
    this.ask = function() {
        return inquirer.prompt([
        {
          type: "input",
          name: this.name,
          message: this.message
        }
    ])};
}

function ListPrompt(name, message, choices, type) {
    this.name = name,
    this.message = message,
    this.choices = choices,
    this.type = type,
    this.ask = function() {
        return inquirer.prompt([
        {
          type: this.type,
          name: this.name,
          message: this.message,
          choices: this.choices
        }
    ])};
}

// Input Prompts
const projectNameInput = new InputPrompt("projectName", "What is the name of your project?");
const licenseInput = new InputPrompt("license", "Please input the license you'd like to use: ");
const descriptionInput = new InputPrompt("description", "Please enter a description of your project.");
const installationInput = new InputPrompt("instructions", "Input an installation instruction block:");
const installEnvironmentInput = new InputPrompt("environment", "Enter your installation environment:");
const usageInput = new InputPrompt("instructions", "Enter the usage instructions:");
const addContributorInput = new InputPrompt("name", "Contributor name:");
const addContributionInput = new InputPrompt("description", "Contribution to project:");
const testInput = new InputPrompt("instructions", "Input a test instruction block:");
const testEnvironmentInput = new InputPrompt("environment", "Enter your test environment:");
const addQuestionInput = new InputPrompt("question", "Q:");
const addAnswerInput = new InputPrompt("answer", "A:");

// Arrays of List Prompt Choices
const statuses = ["Incomplete", "In Progress", "Ready"];
const licenses = ["mit", "apache", "zlib", "gpl", "wtfpl", "other", "none"];
const contentSelections = ["Installation", "Usage", "Contributors", "Tests", "FAQ"];
const programingLanguages = ["git", "other"];
const yesOrNoThankYou = ["YES", "No, thank you."];
const yesPleaseOrNo = ["Yes, please!", "I'm good, thanks!"];


// List Prompts
const statusList = new ListPrompt("status", "Where is your project currently?", statuses, "list");
const licenseList = new ListPrompt("license", "What license would you like to use for this project?", licenses, "list");
const contentSelectionList = new ListPrompt("contents", "What elements would you like to include in your README.md?", contentSelections, "checkbox");
const installEnvironmentList = new ListPrompt("environment", "Select and installation environment.", programingLanguages, "list");
const addInstallBlocksList = new ListPrompt("response", "Would you like to add another block of installation instructions?", yesPleaseOrNo, "list");
const addContributorList = new ListPrompt("response", "Would you like to add another contributor", yesOrNoThankYou, "list");
const testEnvironmentList = new ListPrompt("environment", "Select and installation environment.", programingLanguages, "list");
const addTestBlocksList = new ListPrompt("response", "Would you like to add another block of installation instructions?", yesPleaseOrNo, "list");
const addFAQList = new ListPrompt("response", "Would you like to add another FAQ?", yesPleaseOrNo, "list");


// init function
async function init() {

    try {
        console.log("\x1b[34m%s\x1b[0m", "\nWelcome to the README.md Generator!\n\n");
        console.log("\x1b[36m%s\x1b[0m", "This application will help you built README file for your projects on the fly.\nAnswer the following prompts accordingly to fill out templated README.md!\n");


        // PROJECT NAME
        let userProjectName = await projectNameInput.ask();
        console.log(userProjectName.projectName);

        // Assuring that the user inputs a project name
        while(userProjectName.projectName === "") {
            console.log("Please enter a valid project project name!\n");
            userProjectName = await projectNameInput.ask();
        }
        // await appendNameLine(userProjectName.projectName);


        // STATUS
        const userStatus = await statusList.ask();
        console.log("Status = ", userStatus.status);
        // await appendStatusLine(userStatus.status);


        // DESCRIPTION
        const userDescription = await descriptionInput.ask();
        console.log("Description = ", userDescription.description);
        if(userDescription.description != "") {
            console.log("Description found!");
            // await appendDescriptionLines(userDescription.description);
        }


        // LICENSE
        const userLicense = await licenseList.ask();

        if(userLicense.license === "none") {
            console.log("User selects to not use a license");
            console.log("Success!\nUser's project name = ", userProjectName.projectName);
        }
        else if(userLicense.license === "other") {
            const otherLicense = await licenseInput.ask();
            if(otherLicense.license != "") {
                console.log("User inputs a license");
                // await appendLicenseLine(otherLicense.license);
            }
            console.log("Success!\nUser's project name = ", userProjectName.projectName);
            console.log("License = ", otherLicense.license);
        }
        else {
            // await appendLicenseLine(userLicense.license);
            console.log("Success!\nUser's project name = ", userProjectName.projectName);
            console.log("License = ", userLicense.license);
        }


        // Table of Contents
        console.log("\x1b[34m%s\x1b[0m", "\n\nTable Of Contents");
        console.log("\x1b[36m%s\x1b[0m", "Now you have the chance to pick which additional\nelements you would like to add to your project README!\n");
        const tableOfContents = await contentSelectionList.ask();
        console.log("table of contents", tableOfContents.contents);
        if(tableOfContents.contents.length > 0) {
            console.log("Contents selected! Count = ", tableOfContents.contents.length);
            // await appendTOCLines(tableOfContents.contents);
        }


        // INSTALLATION
        console.log("\x1b[34m%s\x1b[0m", "\n\nINSTALLATION");
        console.log("\x1b[36m%s\x1b[0m", "Provide other users with the proper\ninstallation instructions to run your project\n");
        const installSelect = await installEnvironmentList.ask();
        let installEnvironment = installSelect.environment;
        console.log("install environment = ", installEnvironment);

        if(installEnvironment === "other") {
            const installInput = await installEnvironmentInput.ask();
            installEnvironment = installInput.environment;
        }

        let addInstallBlock = "Yes, please!";
        const installationBlocks = [];

        while(addInstallBlock === "Yes, please!") {
            let installInstructions = await installationInput.ask();
            installationBlocks.push(installInstructions.instructions);
            let continueInstallBlocks = await addInstallBlocksList.ask();
            addInstallBlock = continueInstallBlocks.response;
        }

        if(installationBlocks.length > 0) {
            console.log("Installation instructions recorded!");
            console.log("install = ", installationBlocks);
            
            // await appendInstallationLines(installationBlocks);
        }

        // USAGE
        console.log("\x1b[34m%s\x1b[0m", "\n\nUSAGE");
        console.log("\x1b[36m%s\x1b[0m", "The usage section will help users understand the practical execution of your application.\n");
        const usageDescription = await usageInput.ask();
        console.log("Usage = ", usageDescription.instructions);
        if(usageDescription.instructions > 0) {
            
            // await appendUsageLines(usageDescription.instructions);
        }


        // CONTRIBUTORS
        console.log("\x1b[34m%s\x1b[0m", "\n\nCONTRIBUTORS");
        console.log("\x1b[36m%s\x1b[0m", "You will be prompted to add the names of contributors to\nthis project then describe their contributions.\n");

        const contributorName = [];
        const contribution = [];
        let addContributor = "";


        while(addContributor.response != "No, thank you."){
            let addName = await addContributorInput.ask();
            contributorName.push(addName.name);
            let addDescription = await addContributionInput.ask();
            contribution.push(addDescription.description);

            addContributor = await addContributorList.ask();
        }

        console.log("Contributors properly saved!");
        console.log("Contributors = ", contributorName);
        console.log("Contributions = ", contribution);
        // await appendContributorsLines(contributorName, contribution);


        // TESTS
        console.log("\x1b[34m%s\x1b[0m", "\n\nTESTS");
        console.log("\x1b[36m%s\x1b[0m", "Provide other users with the proper\n instructions for running tests on your project\n");
        const testSelect = await testEnvironmentList.ask();
        let testEnvironment = testSelect.environment;
        console.log("test environment = ", testEnvironment);

        if(testEnvironment === "other") {
            const testInput = await testEnvironmentInput.ask();
            testEnvironment = testInput.environment;
        }

        let addTestBlock = "Yes, please!";
        const testBlocks = [];

        while(addTestBlock === "Yes, please!") {
            let testInstructions = await testInput.ask();
            testBlocks.push(testInstructions.instructions);
            let continueTestBlocks = await addTestBlocksList.ask();
            addTestBlock = continueTestBlocks.response;
        }

        if(testBlocks.length > 0) {
            console.log("Test instructions recorded!");
            console.log("test = ", testBlocks);
            
            // await appendTestLines(testBlocks);
        }


        // FAQ
        console.log("\x1b[34m%s\x1b[0m", "\n\nFAQs");
        console.log("\x1b[36m%s\x1b[0m", "Input a common question about your project,\nthen you will be asked to add an answer.\n");

        const questions = [];
        const answers = [];

        let addFAQ = "";

        while(addFAQ.response != "I'm good, thanks!"){
            let addQuestion = await addQuestionInput.ask();
            questions.push(addQuestion.question);
            let addAnswer = await addAnswerInput.ask();
            answers.push(addAnswer.answer);

            addFAQ = await addFAQList.ask();
        }

        console.log("Questions and Answers properly saved!");
        console.log("Questions = ", questions);
        console.log("answers = ", answers);
        // await appendFAQLines(questions, answers);


    } catch(err) {
      console.log(err);
    }
  }

// Initializing our program with init function
init();










// Example from previous assignments
// const writeFileAsync = util.promisify(fs.writeFile);

// function promptUser() {
//   return inquirer.prompt([
//     {
//       type: "input",
//       name: "name",
//       message: "What is your name?"
//     },
//     {
//       type: "input",
//       name: "location",
//       message: "Where are you from?"
//     },
//     {
//       type: "input",
//       name: "hobby",
//       message: "What is your favorite hobby?"
//     },
//     {
//       type: "input",
//       name: "food",
//       message: "What is your favorite food?"
//     },
//     {
//       type: "input",
//       name: "github",
//       message: "Enter your GitHub Username"
//     },
//     {
//       type: "input",
//       name: "linkedin",
//       message: "Enter your LinkedIn URL."
//     }
//   ]);
// }

// function generateHTML(answers) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//   <title>Document</title>
// </head>
// <body>
//   <div class="jumbotron jumbotron-fluid">
//   <div class="container">
//     <h1 class="display-4">Hi! My name is ${answers.name}</h1>
//     <p class="lead">I am from ${answers.location}.</p>
//     <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
//     <ul class="list-group">
//       <li class="list-group-item">My GitHub username is ${answers.github}</li>
//       <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
//     </ul>
//   </div>
// </div>
// </body>
// </html>`;
// }

// async function init() {
//   console.log("hi")
//   try {
//     const answers = await promptUser();

//     const html = generateHTML(answers);

//     await writeFileAsync("index.html", html);

//     console.log("Successfully wrote to index.html");
//   } catch(err) {
//     console.log(err);
//   }
// }

// init();