const { execSync } = require('child_process');

// Map input to corresponding project names and directories
const projectMap = {
  'a': 'Model-A',
  'b': 'Model-B',
  'ir': 'Ideal-response'
};

// Get the argument passed (e.g., 1a, 2b, 1ir)
const taskAndProject = process.argv[2];

if (!taskAndProject || !/^\d+[a|b|ir]$/.test(taskAndProject)) {
    console.error("Usage: node install <taskNumber><a|b|ir> (e.g., node install 1a, node install 1ir)");
    process.exit(1);
}

// Extract task number and project type (e.g., '1' and 'a')
const taskNumber = taskAndProject.match(/\d+/)[0]; // Extracts number (e.g., 1)
const projectKey = taskAndProject.match(/[a|b|ir]+/)[0]; // Extracts 'a', 'b', or 'ir'

// Get the project directory based on the input
const projectDir = `tasks/task-${taskNumber}/${projectMap[projectKey]}`;

if (!projectDir) {
    console.error(`Project not found for input: ${taskAndProject}`);
    process.exit(1);
}

// Install dependencies for the specific project
try {
    console.log(`Installing dependencies for task-${taskNumber}/${projectMap[projectKey]}...`);
    execSync(`npm run dev --prefix ${projectDir}`, { stdio: 'inherit' });
    console.log(`Dependencies installed successfully for task-${taskNumber}/${projectMap[projectKey]}`);
} catch (error) {
    console.error(`Error installing dependencies: ${error.message}`);
}
