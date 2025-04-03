import * as path from "path";
import * as fs from "fs-extra";
import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

program
  .name("create-pearl-agent")
  .description("Create a new Pearl app with TypeScript support")
  .argument("<project-name>", "Name of the project to create")
  .action((projectName: string) => {
    // Validate project name
    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
      console.error(
        chalk.red(
          "Error: Project name can only contain letters, numbers, hyphens, and underscores"
        )
      );
      process.exit(1);
    }

    const targetDir = path.join(process.cwd(), projectName);

    // Check if directory already exists
    if (fs.existsSync(targetDir)) {
      console.error(
        chalk.red(`Error: Directory ${projectName} already exists.`)
      );
      process.exit(1);
    }

    console.log(
      chalk.blue(`Creating a new Pearl app in ${chalk.cyan(targetDir)}`)
    );

    // Create project directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy template files
    copyTemplateFiles(targetDir);

    // Update package.json name
    updatePackageJson(targetDir, projectName);

    console.log(
      chalk.green(`\nSuccess! Created ${projectName} at ${targetDir}`)
    );
    console.log("Inside that directory, you can run several commands:");
    console.log();
    console.log(chalk.cyan("  npm install"));
    console.log("    Installs all dependencies");
    console.log();
    console.log(chalk.cyan("  npm run dev"));
    console.log("    Starts the development server");
    console.log();
    console.log("We suggest that you begin by typing:");
    console.log();
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  npm install"));
    console.log(chalk.cyan("  npm run dev"));
    console.log();
    console.log("Happy hacking!");
  });

function copyTemplateFiles(targetDir: string) {
  // More reliable template path resolution
  const templateDir = getTemplatePath();

  console.log("Using template directory:", templateDir);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found at ${templateDir}`);
  }

  fs.copySync(templateDir, targetDir);
}

function getTemplatePath(): string {
  // Try multiple possible locations
  const possiblePaths = [
    // For local development
    path.join(__dirname, "../template"),
    // For global install
    path.join(__dirname, "../../template"),
    // For npx/npm install
    path.join(process.cwd(), "node_modules/create-pearl-agent/template"),
    // For some global installs
    path.join(require.resolve("create-pearl-agent"), "../template"),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }

  throw new Error("Could not locate template directory");
}

function updatePackageJson(targetDir: string, projectName: string) {
  const packageJsonPath = path.join(targetDir, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    console.log(chalk.blue("Updating package.json..."));

    const packageJson = fs.readJsonSync(packageJsonPath);

    packageJson.name = projectName;
    packageJson.version = "0.1.0";

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
  }
}

program.parse();
