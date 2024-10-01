const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

// Base port number
const BASE_PORT = 3000;

// Path to the base template directory
const baseTemplateDir = path.join(__dirname, 'base_template');

// Check if a task ID is provided as a command-line argument
const taskId = process.argv[2];
if (!taskId) {
    console.error("Usage: node create-task.js <task-id>");
    process.exit(1);
}

// Calculate the ports for the projects based on task ID
const modelAPort = BASE_PORT + (taskId - 1) * 3 + 1;
const modelBPort = BASE_PORT + (taskId - 1) * 3 + 2;
const idealResponsePort = BASE_PORT + (taskId - 1) * 3 + 3;

// Directory structure for the task
const taskDir = path.join(__dirname, `tasks/task-${taskId}`);
const modelADir = path.join(taskDir, 'Model-A');
const modelBDir = path.join(taskDir, 'Model-B');
const idealResponseDir = path.join(taskDir, 'Ideal-response');

// Ensure the task directory and project directories exist
fs.mkdirSync(modelADir, { recursive: true });
fs.mkdirSync(modelBDir, { recursive: true });
fs.mkdirSync(idealResponseDir, { recursive: true });

// Function to copy the base template folder to a project directory
function copyBaseTemplate(destination) {
    execSync(`cp -r ${baseTemplateDir}/* ${destination}`);
}

// Copy the base template to all three project directories
copyBaseTemplate(modelADir);
copyBaseTemplate(modelBDir);
copyBaseTemplate(idealResponseDir);

// Function to update the package.json dynamically
function updatePackageJson(projectDir, projectName, port) {
    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Update the project name in package.json
    packageJson.name = projectName;

    // Add Vite port configuration dynamically
    packageJson.scripts.dev = `vite --port ${port}`;

    // Write the updated package.json back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
}

// Function to update vite.config.ts dynamically
function updateViteConfig(projectDir) {
    const viteConfigPath = path.join(projectDir, 'vite.config.ts');
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

    // Replace the alias path dynamically based on the project location
    const updatedViteConfig = viteConfig.replace(
        `'@': path.resolve(__dirname, './src')`,  // Old alias
        `'@': path.resolve(__dirname, './src')`  // Keep the alias as is, assuming the structure stays the same
    );

    // Write the updated vite.config.ts back to the file
    fs.writeFileSync(viteConfigPath, updatedViteConfig, 'utf8');
}

// Update package.json for Model-A, Model-B, and Ideal-response and vite.config.ts
updatePackageJson(modelADir, `task-${taskId}-Model-A`, modelAPort);
updateViteConfig(modelADir);

updatePackageJson(modelBDir, `task-${taskId}-Model-B`, modelBPort);
updateViteConfig(modelBDir);

updatePackageJson(idealResponseDir, `task-${taskId}-Ideal-response`, idealResponsePort);
updateViteConfig(idealResponseDir);

// Function to install dependencies sequentially
function installDependenciesSequentially() {
    console.log("Installing dependencies...");

    try {
        execSync(`npm install --prefix ${modelADir}`, { stdio: 'inherit' });
        execSync(`npm install --prefix ${modelBDir}`, { stdio: 'inherit' });
        execSync(`npm install --prefix ${idealResponseDir}`, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error installing dependencies: ${error.message}`);
    }
}

// Function to start all projects concurrently
/*
function startProjects() {
    console.log("Starting projects...");

    const startCommands = [
        `npm run dev --prefix ${modelADir}`,
        `npm run dev --prefix ${modelBDir}`,
        `npm run dev --prefix ${idealResponseDir}`
    ];

    exec(`concurrently "${startCommands.join('" "')}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting projects: ${error.message}`);
            return;
        }
        console.log(stdout);
    });
}
*/
// Install dependencies sequentially
installDependenciesSequentially();

// Start the projects concurrently after the installation is complete
//startProjects();

console.log(`Task ${taskId} created successfully with Model-A (Port: ${modelAPort}), Model-B (Port: ${modelBPort}), and Ideal-response (Port: ${idealResponsePort}).`);
