const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
// Get the arguments passed (e.g., 1-a turn1 or 1a)
const taskAndProject = process.argv[2];
const subFolder = process.argv[3];  // Optional subfolder argument

if (!taskAndProject || (!/^\d+[a|b|ir]+$/.test(taskAndProject) && !/^\d+-[a|b|ir]+$/.test(taskAndProject))) {
    console.error("Usage: node run <taskNumber><a|b|ir> [subfolder] or <taskNumber>-<a|b|ir> [subfolder] (e.g., node run 1a turn1, node run 1-a turn1)");
    process.exit(1);
}

// Handle both formats: with and without hyphen
let taskNumber, projectKey;

if (taskAndProject.includes('-')) {
    // Format with hyphen (e.g., 1-a)
    [taskNumber, projectKey] = taskAndProject.split('-');
} else {
    // Format without hyphen (e.g., 1a)
    taskNumber = taskAndProject.match(/\d+/)[0]; // Extracts the number part
    projectKey = taskAndProject.match(/[a|b|ir]+/)[0]; // Extracts the project key part
}

// Map input project keys to corresponding project names
const projectMap = {
    'a': 'Model-A',
    'b': 'Model-B',
    'ir': 'Ideal-response'
};

// Validate project key
if (!projectMap[projectKey]) {
    console.error(`Invalid project key: ${projectKey}. Use 'a', 'b', or 'ir'.`);
    process.exit(1);
}

// Build the project directory based on the input
let projectDir = path.join(__dirname, `tasks/task-${taskNumber}`);
if (subFolder) {
    projectDir = path.join(projectDir, subFolder);  // Add the subfolder if provided (e.g., turn1, turn2)
}
projectDir = path.join(projectDir, projectMap[projectKey]);

// Check if the project directory exists
if (!fs.existsSync(projectDir)) {
    console.error(`Project directory not present: ${projectDir}`);
    process.exit(1);
}


// Install dependencies for the specific project
try {
    console.log(`Installing dependencies for task-${taskNumber}/${projectMap[projectKey]}...`);
    execSync(`npm install --prefix ${projectDir}`, { stdio: 'inherit' });
    console.log(`Dependencies installed successfully for task-${taskNumber}/${projectMap[projectKey]}`);
} catch (error) {
    console.error(`Error installing dependencies: ${error.message}`);
}
