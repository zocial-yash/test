const fs = require('fs');
const inquirer = require('inquirer');

// Read package.json file
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Function to prompt user for which version to bump and how
async function promptVersionBump() {
    // First, ask if we are updating staging or production version
    const { versionType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'versionType',
            message: 'Which version do you want to bump?',
            choices: ['staging', 'production'],
            default: 'staging'
        }
    ]);

    // Now ask which part of the version to bump: major, minor, or patch
    const { incrementType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'incrementType',
            message: `Which part of the ${versionType} version do you want to bump?`,
            choices: ['patch', 'minor', 'major'],
            default: 'patch'
        }
    ]);

    // Get the current version depending on whether it's staging or production
    let currentVersion = versionType === 'staging' ? packageJson.non_production_version : packageJson.production_version;

    // Split the version into major, minor, patch
    let [major, minor, patch] = currentVersion.split('.').map(Number);

    // Increment based on user choice
    if (incrementType === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (incrementType === 'minor') {
        minor += 1;
        patch = 0;
    } else if (incrementType === 'patch') {
        patch += 1;
    }

    // Create the new version string
    const newVersion = `${major}.${minor}.${patch}`;

    // Update the appropriate version field in package.json
    if (versionType === 'staging') {
        packageJson.non_production_version = newVersion;
    } else {
        packageJson.production_version = newVersion;
    }

    // Write the updated package.json back to disk
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8');

    console.log(`Updated ${versionType} version to ${newVersion}`);
}

// Run the prompt
promptVersionBump();