const fs = require('fs');
const fse = require('fs-extra'); // fs-extra is more reliable for file copying
const path = require('path');
const { execSync } = require('child_process');

// Base port number
const BASE_PORT = 3000;

// Path to the base template directory
const baseTemplateDir = path.join(__dirname, 'base-template');

// Check if a task ID is provided as a command-line argument
const taskId = process.argv[2];
const subFolder = process.argv[3];  // Optional subfolder (e.g., turn1, turn2)

if (!taskId) {
    console.error("Usage: node create-task.js <task-id> [subfolder]");
    process.exit(1);
}

// Calculate the ports for the projects based on task ID
const modelAPort = BASE_PORT + (taskId - 1) * 3 + 1;
const modelBPort = BASE_PORT + (taskId - 1) * 3 + 2;
const idealResponsePort = BASE_PORT + (taskId - 1) * 3 + 3;

// Directory structure for the task
let taskDir = path.join(__dirname, `tasks/task-${taskId}`);
if (subFolder) {
    taskDir = path.join(taskDir, subFolder);  // Add the subfolder if provided (e.g., turn1, turn2)
    console.log(`Subfolder provided: ${subFolder}. Projects will be created under ${taskDir}.`);
}

const modelADir = path.join(taskDir, 'Model-A');
const modelBDir = path.join(taskDir, 'Model-B');
const idealResponseDir = path.join(taskDir, 'Ideal-response');

// Ensure the task directory and project directories exist
fs.mkdirSync(modelADir, { recursive: true });
fs.mkdirSync(modelBDir, { recursive: true });
fs.mkdirSync(idealResponseDir, { recursive: true });

// Function to copy the base template folder to a project directory without node_modules
function copyBaseTemplate(src, dest) {
    console.log(`Copying base template to ${dest}, excluding node_modules...`);

    try {
        fse.copySync(src, dest, {
            filter: (src, dest) => !src.includes('node_modules'),  // Skip node_modules folder
        });
        console.log(`Base template copied to ${dest}.`);
    } catch (err) {
        console.error(`Error copying base template: ${err.message}`);
    }
}

// Copy the base template to all three project directories
copyBaseTemplate(baseTemplateDir, modelADir);
copyBaseTemplate(baseTemplateDir, modelBDir);
copyBaseTemplate(baseTemplateDir, idealResponseDir);

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

// Install dependencies sequentially
installDependenciesSequentially();

console.log(`Task ${taskId} created successfully with Model-A (Port: ${modelAPort}), Model-B (Port: ${modelBPort}), and Ideal-response (Port: ${idealResponsePort}).`);
