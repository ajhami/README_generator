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
// const axios = require("axios");

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
const getUserNameInput = new InputPrompt("name", "What is your name?");
const getUserGitHubInput = new InputPrompt("username", "Provide GitHub username here:")

// Arrays of List Prompt Choices
const statuses = ["Incomplete", "In Progress", "Ready"];
const licenses = ["mit", "apache", "zlib", "gpl", "wtfpl", "other", "none"];
const contentSelections = ["Installation", "Usage", "Contributors", "Tests", "FAQ"];
const programingLanguages = ["git", "other"];
const yesOrNoThankYou = ["YES", "No, thank you."];
const yesPleaseOrNo = ["Yes, please!", "I'm good, thanks!"];
const yesOrPleaseNo = ["Sure!", "Please no, I wanna go home!"];


// List Prompts
const statusList = new ListPrompt("status", "What is the status of your project currently?", statuses, "list");
const licenseList = new ListPrompt("license", "What license would you like to use for this project?", licenses, "list");
const contentSelectionList = new ListPrompt("contents", "What elements would you like to include in your README.md?", contentSelections, "checkbox");
const installEnvironmentList = new ListPrompt("environment", "Select an installation environment.", programingLanguages, "list");
const addInstallBlocksList = new ListPrompt("response", "Would you like to add another block of installation instructions?", yesPleaseOrNo, "list");
const addContributorList = new ListPrompt("response", "Would you like to add another contributor", yesOrNoThankYou, "list");
const testEnvironmentList = new ListPrompt("environment", "Select a test environment.", programingLanguages, "list");
const addTestBlocksList = new ListPrompt("response", "Would you like to add another block of installation instructions?", yesPleaseOrNo, "list");
const addFAQList = new ListPrompt("response", "Would you like to add another FAQ?", yesPleaseOrNo, "list");
const addUserGitHubList = new ListPrompt("response", "Would you like to provide your GitHub username?", yesOrPleaseNo, "list");


// README Text Input Functions
projectNameLine = projectName => {    
    return `# ${projectName}

`;
};

projectStatusBadge = projectStatus => {
    if(projectStatus === "Incomplete") {
        return `![Project Status](https://img.shields.io/badge/status-incomplete-red)`;
    }
    else if(projectStatus === "In Progress") {
        return `![Project Status](https://img.shields.io/badge/status-in%20progress-yellow)`;
    }
    else {
        return `![Project Status](https://img.shields.io/badge/status-ready-green)`;
    }

};

projectLicenseBadge = projectLicense => {
    return `
![License](https://img.shields.io/badge/License-${projectLicense}-blue)`
};

projectDescriptionLines = projectDescription => {
    return `

## Description
${projectDescription}

`
};

tableOfContentsSection = contentsSelected => {
    let tableOfContentsLines = "## Table of Contents\n";
    for(content in contentsSelected) {
        tableOfContentsLines = tableOfContentsLines + "- " + contentsSelected[content] + "\n";
    }
    return tableOfContentsLines;
}

installationLines = (environment, installationBlocks) => {
    let installLines = "\n### Installation (" + environment + ")\n";
    installLines = installLines + "```" + environment + "\n";
    for(block in installationBlocks) {
        installLines = installLines + installationBlocks[block] + "\n";
    }
    installLines = installLines + "```";
    return installLines;
}

projectUsageLines = projectUsage => {
    return `
### Usage
${projectUsage}

`
};

contributorsSection = (contributors, contributions) => {
    let contributionText = "### Contributions\n| Contributor | Contribution |\n|:---:| --- |\n";
    for(number in contributors) {
        contributionText = contributionText + `| ${contributors[number]} | ${contributions[number]} |\n`
    }
    return contributionText;
}

testLines = (environment, testBlocks) => {
    let testLines = "\n### Testing (" + environment + ")\n";
    testLines = testLines + "```" + environment + "\n";
    for(block in testBlocks) {
        testLines = testLines + testBlocks[block] + "\n";
    }
    testLines = testLines + "```";
    return testLines;
}

faqSection = (questions, answers) => {
    let faqText = "\n### FAQs\n";
    for(number in questions) {
        faqText = faqText + `#### Q: ${questions[number]}\nA: ${answers[number]}\n`
    }
    return faqText;
}

copyrightSection = (name, github) => {
    return `

*© 2020 ${github} - ${name}. All Rights Reserved.*`
}




// init function
async function init() {

    try {
        console.log("\x1b[34m%s\x1b[0m", "\nWelcome to the README.md Generator!\n\n");
        console.log("\x1b[36m%s\x1b[0m", "This application will help you built README file for your projects on the fly.\nAnswer the following prompts accordingly to fill out templated README.md!\n");


        // PROJECT NAME
        let userProjectName = await projectNameInput.ask();
        
        // Assuring that the user inputs a project name
        while(userProjectName.projectName === "") {
            console.log("Please enter a valid project project name!\n");
            userProjectName = await projectNameInput.ask();
        }

        const writeProjectName = projectNameLine(userProjectName.projectName);
        await writeFileAsync("README.md", writeProjectName);
        

        // STATUS
        const userStatus = await statusList.ask();
        const writeProjectStatus = projectStatusBadge(userStatus.status);
        console.log("WriteProjectStatus = ", writeProjectStatus);
        await appendFileAsync("README.md", writeProjectStatus);


        // LICENSE
        const userLicense = await licenseList.ask();
        let writeProjectLicense = "";

        if(userLicense.license === "none") {
            return;
        }
        else if(userLicense.license === "other") {
            const otherLicense = await licenseInput.ask();
            if(otherLicense.license != "") {
                writeProjectLicense = projectLicenseBadge(otherLicense.license);
                await appendFileAsync("README.md", writeProjectLicense);
            }
        }
        else {
            writeProjectLicense = projectLicenseBadge(userLicense.license);
            await appendFileAsync("README.md", writeProjectLicense);
        }


        // DESCRIPTION
        const userDescription = await descriptionInput.ask();
        if(userDescription.description != "") {
            const writeProjectDescription = projectDescriptionLines(userDescription.description);
            await appendFileAsync("README.md", writeProjectDescription);
        }


        // TABLE OF CONTENTS
        console.log("\x1b[34m%s\x1b[0m", "\n\nTable Of Contents");
        console.log("\x1b[36m%s\x1b[0m", "Now you have the chance to pick which additional\nelements you would like to add to your project README!\n");
        
        const tableOfContents = await contentSelectionList.ask();
        
        if(tableOfContents.contents.length > 0) {
            const writeTableOfContents = tableOfContentsSection(tableOfContents.contents);
            await appendFileAsync("README.md", writeTableOfContents);
        }


        // INSTALLATION
        if(tableOfContents.contents.indexOf(contentSelections[0]) >= 0) {
            console.log("\x1b[34m%s\x1b[0m", "\n\nINSTALLATION");
            console.log("\x1b[36m%s\x1b[0m", "Provide other users with the proper\ninstallation instructions to run your project\n");
        
            const installSelect = await installEnvironmentList.ask();
            let installEnvironment = installSelect.environment;
        
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
                const writeInstallBlocks = installationLines(installEnvironment, installationBlocks);
                await appendFileAsync("README.md", writeInstallBlocks);
            }
        }


        // USAGE
        if(tableOfContents.contents.indexOf(contentSelections[1]) >= 0) {
            console.log("\x1b[34m%s\x1b[0m", "\n\nUSAGE");
            console.log("\x1b[36m%s\x1b[0m", "The usage section will help users understand the practical execution of your application.\n");
        
            const usageDescription = await usageInput.ask();
            const writeUsage = projectUsageLines(usageDescription.instructions);
            await appendFileAsync("README.md", writeUsage);
        }


        // CONTRIBUTORS
        if(tableOfContents.contents.indexOf(contentSelections[2]) >= 0) {
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
        
            const contributorsLines = contributorsSection(contributorName, contribution);
            await appendFileAsync("README.md", contributorsLines);
        }


        // TESTS
        if(tableOfContents.contents.indexOf(contentSelections[3]) >= 0) {
            console.log("\x1b[34m%s\x1b[0m", "\n\nTESTS");
            console.log("\x1b[36m%s\x1b[0m", "Provide other users with the proper\n instructions for running tests on your project\n");
    
            const testSelect = await testEnvironmentList.ask();
            let testEnvironment = testSelect.environment;
    
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
                const testText = testLines(testEnvironment, testBlocks);
                await appendFileAsync("README.md", testText);
            }
        }


        // FAQ
        if(tableOfContents.contents.indexOf(contentSelections[4]) >= 0) {
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
    
            const faqLines = faqSection(questions, answers);
            await appendFileAsync("README.md", faqLines);
        }

        // FINAL TOUCHES
        console.log("\x1b[34m%s\x1b[0m", "\n\nYou're almost there!");
        console.log("\x1b[36m%s\x1b[0m", "Answer just a couple quick questions while we prepare your new README.");

        const usersName = await getUserNameInput.ask();
        const addGithub = await addUserGitHubList.ask();
        let githubName = "";
    
        if(addGithub.response === "Sure!") {
            const getGitHub = await getUserGitHubInput.ask();
            githubName = getGitHub.username;
        }

        const writecopyright = copyrightSection(usersName.name, githubName);
        await appendFileAsync("README.md", writecopyright);

        console.log("\x1b[32m%s\x1b[0m", "\n\nYour README.md is ready!");
        


    } catch(err) {
      console.log(err);
    }
  }

// Initializing our program with init function
init();


