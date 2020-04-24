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
const addQuestionInput = new InputPrompt("question", "Q:");
const addAnswerInput = new InputPrompt("answer", "A:");
const addContributorInput = new InputPrompt("name", "Contributor name:");
const addContributionInput = new InputPrompt("description", "Contribution to project:");

// List Prompts Options
const statuses = ["Incomplete", "In Progress", "Ready"];
const licenses = ["mit", "apache", "zlib", "gpl", "wtfpl", "other", "none"];
const contentSelections = ["Installation", "Usage", "Contributors", "Tests", "FAQ"];
const yesOrNo = ["YES", "no"];
const yesPleaseOrNo = ["Yes, please!", "I'm good, thanks!"];


// List Prompts
const statusList = new ListPrompt("status", "Where is your project currently?", statuses, "list");
const licenseList = new ListPrompt("license", "What license would you like to use for this project?", licenses, "list");
const contentSelectionList = new ListPrompt("contents", "What elements would you like to include in your README.md?", contentSelections, "checkbox");
const addContributorList = new ListPrompt("response", "Would you like to add a contributor to this project?", yesOrNo, "list");
const addAnotherContributorList = new ListPrompt("response", "Would you like to add another contributor", yesPleaseOrNo, "list");
const addFAQList = new ListPrompt("response", "Would you like to add FAQs to this README.md?", yesOrNo, "list");
const addAnotherFAQList = new ListPrompt("response", "Would you like to add another FAQ?", yesPleaseOrNo, "list");


// init function
async function init() {

    try {
        console.log(`
        

Welcome to the README.md Generator!
        
        `);


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
        const tableOfContents = await contentSelectionList.ask();
        console.log("table of contents", tableOfContents.contents);
        if(tableOfContents.contents.length > 0) {
            console.log("Contents selected! Count = ", tableOfContents.contents.length);
            // appendTOCLines(tableOfContents.contents);
        }


        ["Installation", "Usage", "Contributors", "Tests", "FAQ"]
        // INSTALLATION


        // USAGE


        // CONTRIBUTORS
        const contributorName = [];
        const contribution = [];

        let addContributor = await addContributorList.ask();

        if(addContributor.response === "YES") {
            while(addContributor.response != "I'm good, thanks!"){
                let addName = await addContributorInput.ask();
                contributorName.push(addName.name);
                let addDescription = await addContributionInput.ask();
                contribution.push(addDescription.description);

                addContributor = await addAnotherContributorList.ask();
            }

            console.log("Contributors properly saved!");
            console.log("Contributors = ", contributorName);
            console.log("Contributions = ", contribution);
            // await appendContributorsLines(contributorName, contribution);

        }
        
        // TESTS


        // FAQ
        const questions = [];
        const answers = [];

        let addFAQ = await addFAQList.ask();

        if(addFAQ.response === "YES") {
            while(addFAQ.response != "I'm good, thanks!"){
                let addQuestion = await addQuestionInput.ask();
                questions.push(addQuestion.question);
                let addAnswer = await addAnswerInput.ask();
                answers.push(addAnswer.answer);

                addFAQ = await addAnotherFAQList.ask();
            }

            console.log("Questions and Answers properly saved!");
            console.log("Questions = ", questions);
            console.log("answers = ", answers);
            // await appendFAQLines(questions, answers);
        }


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