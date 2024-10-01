# Task Management for React

## Overview

This project automates the creation of multiple tasks, where each task contains three projects:
- `Model-A`
- `Model-B`
- `Ideal-response`

Each project is a **Vite** application written in **TypeScript**, and follows the same template. This project simplifies the process of setting up and managing these tasks, installing dependencies, and starting the Vite development server for each project.

### How to manage multiple React projects in Stackblitz?

Use this repository [https://github.com/ibk9493/monorepo_react] as a boilerplate. Below are the steps:

1. Fork this repository in Stackblitz.
2. Follow these scripts to get started.

### Scripts

#### 1. **`create-task.js`**

This script automatically generates a new task with three projects (`Model-A`, `Model-B`, `Ideal-response`), installs the necessary dependencies. You can also optionally specify a **subfolder** (e.g., `turn1`, `turn2`) to organize multiple project sets within the same task.

- **Usage**:
  ```bash
  node create-task.js <task-id> [subfolder]
  ```

- **Examples**:
  ```bash
  # Create a new task without a subfolder
  node create-task.js 20509
  ```
  ```bash
  # Create a new task with a subfolder (e.g., turn1)
  node create-task.js 20509 turn1
  ```

  This will:
  - Create a subfolder `turn1` inside `task-20509`, and the three projects will be placed inside `turn1`:
    ```
    /tasks/task-20509/turn1/Model-A
    /tasks/task-20509/turn1/Model-B
    /tasks/task-20509/turn1/Ideal-response
    ```

  - You can create multiple sets of projects for the same task by using different subfolders (e.g., `turn1`, `turn2`).

#### 2. **`run.js`**
This script runs a specific project in a task. You can specify the task number and project (e.g., `20509-a`, `20509-b`, `20509-ir`) and optionally the subfolder (e.g., `turn1`), to start the Vite server only for that project.

- **Usage**:
  ```bash
  node run.js <task-id>-<project> [subfolder]
  ```

- **Examples**:
  ```bash
  # Run Model-A for task 20509
  node run.js 20509-a
  ```

  ```bash
  # Run Model-A for task 20509 with subfolder turn1
  node run.js 20509-a turn1
  ```

This will start the Vite development server for `Model-A` in `task-20509`, optionally inside a specific subfolder.

#### 3. **`install.js`** (Optional)
If you have added additional dependencies in `package.json` for a specific project in a task, you can run this script to install those dependencies. Specify the task number and project (e.g., `20509-a`, `20509-b`, `20509-ir`) and optionally a subfolder.

- **Usage**:
  ```bash
  node install.js <task-id>-<project> [subfolder]
  ```

- **Examples**:
  ```bash
  # Install dependencies for Model-A in task 20509
  node install.js 20509-a
  ```

  ```bash
  # Install dependencies for Model-A in task 20509 with subfolder turn1
  node install.js 20509-a turn1
  ```

This will install the dependencies for `Model-A` in `task-20509`, optionally inside a specific subfolder.

### Key Information

#### How the Port Works for Different Projects?

Each project in a task uses a different port:
- **Model-A** starts at port 3001.
- **Model-B** starts at port 3002.
- **Ideal-response** starts at port 3003.

For `task-2`, the ports will increment by 3, starting at 3004.

#### How Does the Folder Structure Look Like?

The overall folder structure is as follows:

```plaintext
/base_template_code
  /..
/tasks
  /task-<taskId>
    /Model-A
      /..
    /Model-B
      /..
    /Ideal-response
      /..
  /task-<taskId>
    /turn1
      /..
    /turn2
      /..
```

If you don't specify a subfolder, the projects will be created directly inside `tasks/task-<taskId>`. If a subfolder is specified, the projects will be created inside that subfolder.

### Example Workflow without subfolder

1. **Create a Task Without Subfolder**:
   ```bash
   node create-task.js 20509
   ```
2. **Run Model-A Without Subfolder**:
   ```bash
   node run.js 20509-a
   ```
   
### Example Workflow with subfolder   
1. **Create a Task With Subfolder `turn1`**:
   ```bash
   node create-task.js 20509 turn1
   ```

2. **Run Model-A With Subfolder `turn1`**:
   ```bash
   node run.js 20509-a turn1
   ```
### Example Workflow with subfolder with updated dependcies
1. **Install Dependencies for Model-B in Subfolder `turn2`**:

   ```bash
   node install.js 20509-b turn2
   ```

### Conclusion

This system streamlines the process of managing multiple Vite projects across different tasks, ensuring that the configuration, dependencies, and development server setup are handled automatically. The option to use subfolders allows you to organize different project sets within the same task, making it easy to manage multiple versions or iterations of a task.

### Note: Please dont make any changes in `base-template` otherwise all your tasks will automatically be disqualified. Dont make any changes in the scripts without prior discussion.
